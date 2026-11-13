import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),{normalize,paths,decision,gate,recheck}=require('../scripts/factory/graphics-loop.cjs');
const bot='chatgpt-codex-connector[bot]',head='a'.repeat(40),user={login:bot,type:'Bot'};
const review={id:10,user,commit_id:head,state:'CHANGES_REQUESTED',body:'Fix focus loss'};
const state={phase:'review',head,round:0};
test('graphics proposal admits scoped CSS and JS only',()=>{
 assert.equal(JSON.parse(normalize(JSON.stringify({files:[{path:'src/title-screen.css',content:'a{}'}]}),['src/title-screen.css'])).files.length,1);
 for(const p of ['src/engine.js','src/save-storage.js','src/mvp-engine.js','../x.js','.github/x.js','src/X.js'])assert.throws(()=>paths([p]));
 for(const files of [[],[{path:'src/title-screen.css',content:'a'},{path:'src/title-screen.css',content:'b'}],[{path:'src/main.js',content:'x'}],[{path:'src/title-screen.css',content:'\0'}]])assert.throws(()=>normalize(JSON.stringify({files}),['src/title-screen.css']));
 assert.throws(()=>normalize(JSON.stringify({files:[{path:'src/title-screen.css',content:'x'.repeat(65537)}]}),['src/title-screen.css']));
});
test('reviews are bound to bot identity and exact head',()=>{
 assert.equal(decision(state,[{...review,commit_id:'b'.repeat(40)}],[],bot).action,'wait');
 assert.equal(decision(state,[{...review,user:{login:'outsider',type:'Bot'}}],[],bot).action,'wait');
 assert.equal(decision(state,[{...review,user:{login:bot,type:'User'}}],[],bot).action,'wait');
 assert.equal(decision(state,[review],[],bot).action,'repair');
 assert.equal(decision({...state,phase:'running'},[review],[],bot).action,'hold');
});
test('three repairs maximum and no prose-based auto acceptance',()=>{
 assert.equal(decision({...state,round:2},[review],[],bot).action,'repair');
 assert.equal(decision({...state,round:3},[review],[],bot).action,'limit');
 assert.equal(decision(state,[{...review,state:'APPROVED'}],[],bot).action,'human');
 assert.equal(decision(state,[{...review,state:'COMMENTED',body:'Looks good'}],[],bot).action,'human');
});
test('inline feedback belongs to the actual latest review and head',()=>{
 const r={...review,state:'COMMENTED'},note={pull_request_review_id:10,user,commit_id:head,path:'src/title-screen.css',body:'Contrast'};
 assert.equal(decision(state,[r],[note],bot).action,'repair');
 assert.equal(decision(state,[r],[{...note,commit_id:'b'.repeat(40)}],bot).action,'human');
 assert.equal(decision(state,[r],[{...note,pull_request_review_id:9}],bot).action,'human');
});
test('disabled catalog makes no GitHub call',async()=>{
 const previous=process.env.GITHUB_RUN_ATTEMPT;process.env.GITHUB_RUN_ATTEMPT='1';
 try{await gate({github:new Proxy({},{get(){throw Error('Network must not run');}}),context:{eventName:'schedule',ref:'refs/heads/main'},core:{setOutput(){},info(){}},catalog:{enabled:false}});}finally{if(previous===undefined)delete process.env.GITHUB_RUN_ATTEMPT;else process.env.GITHUB_RUN_ATTEMPT=previous;}
});
test('removed issue approval stops before candidate or model access',async()=>{
 let calls=0;const github={rest:{issues:{get:async()=>{calls++;return {data:{state:'closed',labels:[],title:'x'}};}}}};
 await assert.rejects(recheck({github,context:{repo:{}},manifest:{issue:4}}),/approval revoked/);assert.equal(calls,1);
});
test('mocked implementation -> review -> repair preserves branch and rejects duplicate execution',async()=>{
 const {createHash}=await import('node:crypto'),{publish}=require('../scripts/factory/graphics-loop.cjs');
 const issue={state:'open',title:'Title focus',body:'Preserve controls',labels:[{name:'factory:approved'}]};
 const catalog={enabled:true,issue:4,issueDigest:createHash('sha256').update(issue.title+'\n'+issue.body).digest('hex'),reviewer:bot,paths:['src/title-screen.css']};
 const refs=new Map([['main',head]]);let checkpoint,revision=0,comments=0,commits=0,reviewList=[];
 const g={rest:{repos:{
  getContent:async({path})=>{if(path==='graphics-loop.json'&&!checkpoint)throw Object.assign(Error('missing'),{status:404});const text=path==='graphics-loop.json'?checkpoint:'body {}';return {data:{type:'file',encoding:'base64',size:Buffer.byteLength(text),content:Buffer.from(text).toString('base64'),sha:String(revision)}};},
  createOrUpdateFileContents:async({content,sha})=>{assert.equal(sha,checkpoint?String(revision):undefined);checkpoint=Buffer.from(content,'base64').toString();revision++;return {data:{}};},
  getCollaboratorPermissionLevel:async()=>({data:{permission:'admin'}}),
  compareCommitsWithBasehead:async()=>({data:{status:'ahead',files:[{filename:'src/title-screen.css',status:'modified',patch:'diff'}]}})
 },issues:{get:async()=>({data:issue}),createComment:async()=>{comments++;return {data:{}};}},git:{
  getRef:async({ref})=>({data:{object:{sha:refs.get(ref.slice(6))}}}),
  createRef:async({ref,sha})=>{assert.equal(refs.has(ref.slice(11)),false);refs.set(ref.slice(11),sha);return {data:{}};},
  getTree:async()=>({data:{truncated:false,tree:[{path:'src/title-screen.css',mode:'100644',type:'blob'}]}}),
  createBlob:async()=>({data:{sha:'blob'}}),getCommit:async()=>({data:{tree:{sha:'old-tree'}}}),
  createTree:async()=>({data:{sha:'new-tree'}}),createCommit:async()=>({data:{sha:String(++commits).repeat(40)}}),
  updateRef:async({ref,sha,force})=>{assert.equal(force,false);refs.set(ref.slice(6),sha);return {data:{}};}
 },pulls:{create:async()=>({data:{number:20}}),get:async()=>({data:{state:'open',head:{repo:{full_name:'owner/repo'},ref:'factory/graphics-4',sha:refs.get('factory/graphics-4')},base:{ref:'main'}}}),listReviews:'reviews',listReviewComments:'comments'}},paginate:async fn=>fn==='reviews'?reviewList:[]};
 const c={eventName:'workflow_dispatch',ref:'refs/heads/main',sha:head,actor:'owner',repo:{owner:'owner',repo:'repo'},runId:1};
 let output={};const core={setOutput(k,v){output[k]=v;},info(){}};
 const old={GITHUB_RUN_ATTEMPT:process.env.GITHUB_RUN_ATTEMPT,GITHUB_TRIGGERING_ACTOR:process.env.GITHUB_TRIGGERING_ACTOR,BOOTSTRAP:process.env.BOOTSTRAP};
 Object.assign(process.env,{GITHUB_RUN_ATTEMPT:'1',GITHUB_TRIGGERING_ACTOR:'owner',BOOTSTRAP:'true'});
 try{
  await gate({github:g,context:c,core,catalog});assert.equal(output.run,'true');const manifest=JSON.parse(output.manifest);
  output={};await gate({github:g,context:c,core,catalog});assert.equal(output.run,'false');
  await publish({github:g,context:c,manifest,raw:JSON.stringify({files:[{path:'src/title-screen.css',content:'body {color:red}'}]})});
  assert.equal(JSON.parse(checkpoint).phase,'review');assert.equal(comments,1);
  output={};await gate({github:g,context:c,core,catalog});assert.equal(output.run,'false');
  reviewList=[{...review,commit_id:refs.get('factory/graphics-4')}];c.runId=2;
  await gate({github:g,context:c,core,catalog});const repair=JSON.parse(output.manifest);assert.equal(repair.round,1);assert.equal(repair.branch,manifest.branch);
  await publish({github:g,context:c,manifest:repair,raw:JSON.stringify({files:[{path:'src/title-screen.css',content:'body {color:blue}'}]})});
  assert.equal(comments,2);assert.equal(commits,2);assert.equal(JSON.parse(checkpoint).phase,'review');
  output={};await gate({github:g,context:c,core,catalog});assert.equal(output.run,'false'); // old review cannot trigger a third generation
 }finally{for(const [k,v] of Object.entries(old))if(v===undefined)delete process.env[k];else process.env[k]=v;}
});
