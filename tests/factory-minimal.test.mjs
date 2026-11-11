import test from 'node:test';import assert from 'node:assert/strict';import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),f=require('../scripts/factory/minimal-factory.cjs'),g=require('../scripts/factory/proposal-generator.cjs');
const allowed=['src/game.js'],raw=JSON.stringify({files:[{path:'src/game.js',content:'export const x=1;'}]});
test('canonical proposal remains source data',()=>assert.deepEqual(JSON.parse(f.normalize(raw,allowed)),JSON.parse(raw)));
for(const p of ['../x','.github/workflows/a.yml','src/../x.js','src/.env','src/x.jsx','src/x.js/../b.js','SRC/x.js','src/x.js\0'])test('reject path '+JSON.stringify(p),()=>assert.throws(()=>f.paths([p])));
test('reject case collision, duplicate and too many paths',()=>{for(const p of [['src/X.js','src/x.js'],['src/x.js','src/x.js'],Array.from({length:5},(_,i)=>'src/x'+i+'.js')])assert.throws(()=>f.paths(p));});
for(const value of [{files:[],extra:true},{files:[{path:'src/other.js',content:'x'}]},{files:[{path:allowed[0],content:'x',mode:'120000'}]},{files:[{path:allowed[0],content:'x'},{path:allowed[0],content:'y'}]},{files:[{path:allowed[0],content:'\0'}]},{files:[{path:allowed[0],content:'\ud800'}]},{files:[{path:allowed[0],content:'x'.repeat(65537)}]},{files:[{path:allowed[0],content:'-----BEGIN PRIVATE KEY-----'}]}])test('reject malformed or unsafe proposal '+JSON.stringify(value).slice(0,65),()=>assert.throws(()=>f.normalize(JSON.stringify(value),allowed)));
test('unknown issue editor cannot change approved digest',()=>{const i={title:'task',body:'approved',state:'open',labels:[{name:'factory:approved'}]};const d=f.issueDigest(i);i.body='different';assert.throws(()=>f.checkIssue(i,d));});
test('typed SDK options have no tools, MCP, settings or inherited credential env',async()=>{const o=g.options({token:'dummy-not-a-secret',home:'/tmp/empty',cwd:'/tmp/empty',pathEnv:'/usr/bin'});assert.deepEqual(o.tools,[]);assert.deepEqual(o.settingSources,[]);assert.deepEqual(o.mcpServers,{});assert.equal(o.strictMcpConfig,true);assert.equal(o.settings.disableAllHooks,true);assert.equal(o.managedSettings.disableAllHooks,true);assert.deepEqual(Object.keys(o.env).sort(),['CLAUDE_CODE_OAUTH_TOKEN','CLAUDE_CONFIG_DIR','HOME','PATH']);assert.equal((await o.canUseTool('Bash',{})).behavior,'deny');});
test('missing OAuth rejects before model invocation',async()=>{let calls=0;await assert.rejects(g.generate({prompt:'task',query:()=>{calls++},token:'',home:'/tmp',cwd:'/tmp'}));assert.equal(calls,0);});
test('structured result only, never assistant report',async()=>{const output=await g.generate({prompt:'task',token:'dummy',home:'/tmp',cwd:'/tmp',query:async function*(){yield{type:'assistant',text:'untrusted report'};yield{type:'result',subtype:'success',structured_output:JSON.parse(raw)};}});assert.equal(output,raw);});
test('failed generation cannot emit a proposal',async()=>await assert.rejects(g.generate({prompt:'task',token:'dummy',home:'/tmp',cwd:'/tmp',query:async function*(){yield{type:'result',subtype:'error'};}})));
function h(){
 const issue={title:'task',body:'approved',state:'open',labels:[{name:'factory:approved'}]},sha='a'.repeat(40);
 const context={eventName:'workflow_dispatch',ref:'refs/heads/main',runAttempt:1,actor:'owner',repo:{owner:'owner',repo:'repo'},sha};
 const input={issue:'1',base:sha,issueDigest:f.issueDigest(issue),paths:allowed.join(),triggeringActor:'owner'},calls=[],out={};
 const github={rest:{issues:{get:async()=>({data:issue})},repos:{getCollaboratorPermissionLevel:async()=>({data:{permission:'admin'}}),getContent:async()=>({data:{encoding:'base64',size:1,content:Buffer.from('x').toString('base64')}})},git:{getRef:async()=>({data:{object:{sha}}}),getTree:async()=>({data:{tree:[{path:allowed[0],type:'blob',mode:'100644'}]}}),createRef:async r=>calls.push(r)}}};
 return {context,input,github,calls,out,issue,core:{setOutput:(k,v)=>out[k]=v}};
}
test('gate atomically reserves one branch and binds exact issue/base/paths',async()=>{const x=h();await f.gate(x);assert.equal(x.calls.length,1);assert.equal(JSON.parse(x.out.manifest).base,x.context.sha);assert.ok(x.out.prompt.includes('approved'));});
for(const [name,change]of Object.entries({rerun:x=>x.context.runAttempt=2,nonowner:x=>x.context.actor='other',wrongref:x=>x.context.ref='refs/heads/other',oldbase:x=>x.input.base='b'.repeat(40),editedissue:x=>x.issue.body='changed',revokedlabel:x=>x.issue.labels=[],symlink:x=>x.github.rest.git.getTree=async()=>({data:{tree:[{path:allowed[0],type:'blob',mode:'120000'}]}})}))test('gate blocks '+name+' before reservation',async()=>{const x=h();change(x);await assert.rejects(f.gate(x));assert.equal(x.calls.length,0);});
test('existing reservation failure is not retried',async()=>{const x=h();let n=0;x.github.rest.git.createRef=async()=>{n++;throw Error('exists')};await assert.rejects(f.gate(x));assert.equal(n,1);});

function publisher(){
 const x=h(),manifest={base:x.context.sha,issue:1,issueDigest:x.input.issueDigest,paths:allowed,branch:'factory/issue-1-abc'},events=[];
 Object.assign(x.github.rest.git,{
 createBlob:async p=>(events.push(['blob',p]),{data:{sha:'blob'}}),
 getCommit:async()=>({data:{tree:{sha:'oldtree'}}}),
 createTree:async p=>(events.push(['tree',p]),{data:{sha:'newtree'}}),
 createCommit:async p=>(events.push(['commit',p]),{data:{sha:'b'.repeat(40)}}),
 updateRef:async p=>events.push(['update',p])
 });x.github.rest.pulls={create:async p=>(events.push(['pr',p]),{data:{number:2}})};
 return {...x,manifest,raw,events};
}
test('publisher creates only approved source tree and fixed draft metadata',async()=>{const x=publisher();await f.publish(x);const tree=x.events.find(e=>e[0]==='tree')[1];assert.equal(tree.tree[0].path,allowed[0]);assert.equal(tree.tree[0].mode,'100644');const p=x.events.find(e=>e[0]==='pr')[1];assert.equal(p.draft,true);assert.match(p.body,/Human code review required/);assert.equal(x.events.find(e=>e[0]==='update')[1].force,false);});
test('publisher refuses changed reservation before writes',async()=>{const x=publisher();x.github.rest.git.getRef=async p=>({data:{object:{sha:p.ref==='heads/main'?x.manifest.base:'f'.repeat(40)}}});await assert.rejects(f.publish(x));assert.equal(x.events.length,0);});
test('publisher refuses unapproved artifact before writes',async()=>{const x=publisher();x.raw=JSON.stringify({files:[{path:'.github/workflows/pwn.yml',content:'bad'}]});await assert.rejects(f.publish(x));assert.equal(x.events.length,0);});
test('unknown ref update outcome never creates PR or retries update',async()=>{const x=publisher();let n=0;x.github.rest.git.updateRef=async()=>{n++;throw Error('timeout')};await assert.rejects(f.publish(x));assert.equal(n,1);assert.equal(x.events.some(e=>e[0]==='pr'),false);});
