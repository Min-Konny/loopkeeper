'use strict';
const {createHash}=require('node:crypto');
const hash=s=>createHash('sha256').update(s).digest('hex');
const sha=s=>typeof s==='string'&&/^[0-9a-f]{40}$/.test(s);
const digest=s=>typeof s==='string'&&/^[0-9a-f]{64}$/.test(s);
function paths(value){
 const list=typeof value==='string'?value.split(',').map(x=>x.trim()):value;
 if(!Array.isArray(list)||list.length<1||list.length>4||
 list.some(p=>typeof p!=='string'||p.length>160||!/^src\/(?:[a-zA-Z0-9_-]+\/)*[a-zA-Z0-9_-]+\.js$/.test(p))||
 new Set(list.map(x=>x.toLowerCase())).size!==list.length)throw Error('Pilot permits 1-4 distinct existing src JavaScript files only');
 return [...list].sort();
}
function issueDigest(issue){return hash(issue.title+'\n'+(issue.body||''));}
function checkIssue(issue,expected){
 if(issue.state!=='open'||issue.pull_request||issueDigest(issue)!==expected||
 !issue.labels.some(x=>x.name==='factory:approved'))throw Error('Issue approval snapshot changed or unavailable');
}
function normalize(raw,allowed){
 if(typeof raw!=='string'||Buffer.byteLength(raw)>100000)throw Error('Oversize proposal');
 const data=JSON.parse(raw),names=paths(allowed);
 if(!data||Array.isArray(data)||Object.keys(data).sort().join()!=='files'||!Array.isArray(data.files)||
 data.files.length<1||data.files.length>names.length)throw Error('Invalid proposal shape');
 let bytes=0;const seen=new Set();
 const files=data.files.map(f=>{
  if(!f||Array.isArray(f)||Object.keys(f).sort().join()!=='content,path'||!names.includes(f.path)||seen.has(f.path)||
  typeof f.content!=='string'||f.content.includes('\0')||Buffer.from(f.content).toString('utf8')!==f.content)throw Error('Invalid proposed file');
  seen.add(f.path);bytes+=Buffer.byteLength(f.content);if(bytes>65536)throw Error('Oversize files');
  if(/(?:-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|sk-ant-[A-Za-z0-9_-]{12,}|gh[pousr]_[A-Za-z0-9]{20,})/.test(f.content))throw Error('Credential-like content rejected');
  return {path:f.path,content:f.content};
 }).sort((a,b)=>a.path.localeCompare(b.path));
 return JSON.stringify({files});
}
async function current({github,context,manifest}){
 if(!sha(manifest.base)||!digest(manifest.issueDigest)||!Number.isSafeInteger(manifest.issue))throw Error('Invalid trusted manifest');
 const main=await github.rest.git.getRef({...context.repo,ref:'heads/main'});
 if(main.data.object.sha!==manifest.base)throw Error('Main moved: reconcile without rerun');
 const issue=await github.rest.issues.get({...context.repo,issue_number:manifest.issue});
 checkIssue(issue.data,manifest.issueDigest);
 const permission=await github.rest.repos.getCollaboratorPermissionLevel({...context.repo,username:context.actor});
 if(!['admin','maintain','write'].includes(permission.data.permission))throw Error('Actor permission revoked');
}
async function gate({github,context,core,input}){
 if(context.eventName!=='workflow_dispatch'||context.ref!=='refs/heads/main'||context.runAttempt!==1||
 context.actor!==context.repo.owner||input.triggeringActor!==context.repo.owner)throw Error('Owner first-attempt main dispatch only');
 if(!sha(input.base)||input.base!==context.sha||!digest(input.issueDigest)||!/^([1-9][0-9]*)$/.test(input.issue))throw Error('Exact input required');
 const issue=Number(input.issue);if(!Number.isSafeInteger(issue))throw Error('Invalid issue');
 const allowed=paths(input.paths);
 const manifest={base:input.base,issueDigest:input.issueDigest,issue,paths:allowed,
 branch:'factory/issue-'+issue+'-'+input.issueDigest.slice(0,16)+'-'+input.base.slice(0,8)};
 await current({github,context,manifest});
 const {data:tree}=await github.rest.git.getTree({...context.repo,tree_sha:manifest.base,recursive:'1'});
 if(tree.truncated)throw Error('Incomplete source tree');
 const files=[];
 for(const path of allowed){
  if(!tree.tree.some(e=>e.path===path&&e.type==='blob'&&e.mode==='100644'))throw Error('Non-regular existing source');
  const {data:f}=await github.rest.repos.getContent({...context.repo,path,ref:manifest.base});
  if(f.encoding!=='base64'||f.size>65536)throw Error('Unsupported source encoding/size');
  files.push({path,content:Buffer.from(f.content,'base64').toString('utf8')});
 }
 // Source is data only. No repository instructions or tools run in the generator.
 normalize(JSON.stringify({files}),allowed);
 const {data:task}=await github.rest.issues.get({...context.repo,issue_number:issue});checkIssue(task,manifest.issueDigest);
 if(Buffer.byteLength(task.title+'\n'+(task.body||''))>8000)throw Error('Oversize issue');
 const prompt='Implement ONLY the approved task below as JSON files with full replacement text. You have no tools. Do not request tools or execute code. Do not include explanations. If not possible, return files: []. No tests or acceptance claims.\n'+JSON.stringify({task:{title:task.title,body:task.body},files});
 await current({github,context,manifest});
 // Atomic create is the durable reservation. Existing or unknown outcome: never retry.
 await github.rest.git.createRef({...context.repo,ref:'refs/heads/'+manifest.branch,sha:manifest.base});
 core.setOutput('manifest',JSON.stringify(manifest));core.setOutput('prompt',prompt);
}
async function publish({github,context,manifest,raw}){
 await current({github,context,manifest});
 const normalized=normalize(raw,manifest.paths),files=JSON.parse(normalized).files;
 const ref=await github.rest.git.getRef({...context.repo,ref:'heads/'+manifest.branch});
 if(ref.data.object.sha!==manifest.base)throw Error('Reservation changed; reconcile existing result');
 const tree=[];
 for(const f of files){
  const b=await github.rest.git.createBlob({...context.repo,content:f.content,encoding:'utf-8'});
  tree.push({path:f.path,mode:'100644',type:'blob',sha:b.data.sha});
 }
 const base=await github.rest.git.getCommit({...context.repo,commit_sha:manifest.base});
 const t=await github.rest.git.createTree({...context.repo,base_tree:base.data.tree.sha,tree});
 if(t.data.sha===base.data.tree.sha)throw Error('No change: reservation retained');
 const c=await github.rest.git.createCommit({...context.repo,tree:t.data.sha,parents:[manifest.base],message:'Factory proposal for #'+manifest.issue});
 await current({github,context,manifest});
 await github.rest.git.updateRef({...context.repo,ref:'heads/'+manifest.branch,sha:c.data.sha,force:false});
 // No candidate-authored report, title or acceptance claims are published.
 return github.rest.pulls.create({...context.repo,head:manifest.branch,base:'main',draft:true,
 title:'[factory] #'+manifest.issue+' review required',
 body:'Proposal for #'+manifest.issue+'. No automatic merge or deployment. Source regression is only a signal, not independent acceptance. Human code review required. Proposal SHA-256: '+hash(normalized)});
}
module.exports={hash,paths,normalize,issueDigest,checkIssue,current,gate,publish};
