// One Git-backed queue authority per repository. No agent execution or credentials here.
const {createHash}=require('node:crypto');
const sha=x=>typeof x==='string'&&/^[0-9a-f]{40}$/.test(x);
const digest=x=>typeof x==='string'&&/^[0-9a-f]{64}$/.test(x);
const active=new Set(['reserved','admitted','running','review','uncertain']);
const key=p=>createHash('sha256').update(JSON.stringify([p.repository,p.issue,p.baseSha,p.planDigest])).digest('hex');
function checkPlan(p) {
 if(!p||!/^[-\w]+\/[-\w.]+$/.test(p.repository)||!Number.isSafeInteger(p.issue)||p.issue<1||!sha(p.baseSha)||!digest(p.planDigest)||!digest(p.policyDigest)||typeof p.approvalRef!=='string'||!p.approvalRef.trim()||!Array.isArray(p.dependencies)||p.dependencies.some(x=>!digest(x)))throw Error('Invalid approved plan snapshot');
 // approvalRef is evidence supplied by a trusted coordinator, not self-authorization by an Issue.
 return {repository:p.repository,issue:p.issue,baseSha:p.baseSha,planDigest:p.planDigest,policyDigest:p.policyDigest,approvalRef:p.approvalRef,dependencies:[...new Set(p.dependencies)]};
}
function checkHistory(t){
 const edges={queued:['reserved'],reserved:['admitted','uncertain','blocked'],admitted:['running','review','uncertain','blocked'],running:['review','uncertain','blocked'],review:['verified','blocked'],uncertain:['admitted','review','blocked'],blocked:['queued'],verified:[]};
 let previous='queued';
 for(const h of t.history){
  if(!edges[previous]?.includes(h.state))throw Error('Invalid persisted transition');
  const e=h.evidence;
  if(h.state==='reserved'){if(typeof h.intentId!=='string'||!h.intentId)throw Error('Missing persisted intent');}
  else {
   if(typeof e?.reference!=='string'||!e.reference.trim())throw Error('Missing persisted evidence');
   if(h.state==='queued'&&e.recoveryVerified!==true)throw Error('Missing recovery evidence');
   if(h.state==='admitted'&&(typeof e.turnId!=='string'||!e.turnId))throw Error('Missing receipt evidence');
   if(h.state==='running'&&e.started!==true)throw Error('Missing start evidence');
   if(h.state==='review'&&e.completed!==true)throw Error('Missing completion evidence');
   if(h.state==='verified'&&(!sha(e.headSha)||e.passed!==true))throw Error('Missing verification evidence');
   if(h.state==='blocked'&&(!e.reason||!e.resumeCondition||e.outcomeKnown!==true))throw Error('Missing blocked evidence');
  }
  previous=h.state;
 }
 if(previous!==t.state)throw Error('Persisted state/history mismatch');
 const reservation=t.history.findLast(h=>h.state==='reserved');
 if(active.has(t.state)&&reservation?.intentId!==t.intentId)throw Error('Persisted intent mismatch');
}
function checkState(s){if(s?.version!==1||!Array.isArray(s.tasks))throw Error('Missing or unsupported queue; reconcile instead of treating as empty');for(const t of s.tasks){if(t.id!==key(checkPlan(t.plan))||!['queued','reserved','admitted','running','review','uncertain','verified','blocked'].includes(t.state)||!Array.isArray(t.history))throw Error('Invalid queue record');if(active.has(t.state)&&(!t.owner||!t.intentId))throw Error('Missing active intent');checkHistory(t);}if(new Set(s.tasks.map(t=>t.id)).size!==s.tasks.length)throw Error('Duplicate task IDs');const ids=new Set(s.tasks.map(t=>t.id));if(new Set(s.tasks.map(t=>t.plan.repository)).size>1)throw Error('Mixed repository queue');for(const t of s.tasks)if(t.plan.dependencies.some(d=>!ids.has(d)))throw Error('Unknown persisted dependency');const visiting=new Set(),done=new Set();function visit(id){if(visiting.has(id))throw Error('Dependency cycle');if(done.has(id))return;visiting.add(id);for(const d of s.tasks.find(t=>t.id===id).plan.dependencies)visit(d);visiting.delete(id);done.add(id);}for(const id of ids)visit(id);if(s.tasks.filter(t=>active.has(t.state)).length>1)throw Error('Multiple active tasks');return s;}
class Queue {
 constructor(store){this.store=store;}
 async change(fn){for(let n=0;n<4;n++){const {revision,state}=await this.store.read();checkState(state);const next=structuredClone(state);const result=fn(next);checkState(next);if(await this.store.compareAndSwap(revision,next))return result;}throw Error('Queue contention; no side effect executed');}
 async enqueue(plan){const p=checkPlan(plan),id=key(p);return this.change(s=>{const old=s.tasks.find(t=>t.id===id);if(old){if(JSON.stringify(old.plan)!==JSON.stringify(p))throw Error('Existing plan metadata differs');return {id,state:old.state,duplicate:true};}if(s.tasks.some(t=>t.plan.repository!==p.repository))throw Error('Separate queue required per repository');for(const dep of p.dependencies)if(!s.tasks.some(t=>t.id===dep))throw Error('Unknown dependency');s.tasks.push({id,plan:p,state:'queued',history:[]});return{id,state:'queued',duplicate:false};});}
 async resume(id,evidence){return this.change(s=>{const t=s.tasks.find(t=>t.id===id);if(t?.state!=='blocked'||evidence?.recoveryVerified!==true||typeof evidence.reference!=='string'||!evidence.reference.trim())throw Error('Verified blocked recovery required');t.state='queued';delete t.owner;delete t.intentId;t.history.push({state:'queued',evidence:structuredClone(evidence)});return structuredClone(t);});}
 async reserve(id,owner,intentId){if(!owner||!intentId)throw Error('Owner and intent required');return this.change(s=>{if(s.tasks.some(t=>active.has(t.state)))throw Error('Active reservation requires reconciliation');const t=s.tasks.find(t=>t.id===id);if(t?.state!=='queued')throw Error('Task not queued');if(t.plan.dependencies.some(dep=>s.tasks.find(x=>x.id===dep)?.state!=='verified'))throw Error('Dependency not verified');t.state='reserved';t.owner=owner;t.intentId=intentId;t.history.push({state:t.state,intentId});return structuredClone(t);});}
 async transition(id,intentId,next,evidence){return this.change(s=>{const t=s.tasks.find(t=>t.id===id);if(!t||t.intentId!==intentId)throw Error('Reservation does not match');const permitted={reserved:['admitted','uncertain','blocked'],admitted:['running','review','uncertain','blocked'],running:['review','uncertain','blocked'],review:['verified','blocked'],uncertain:['admitted','review','blocked']};if(!permitted[t.state]?.includes(next))throw Error('Invalid transition');if(!evidence||typeof evidence.reference!=='string'||!evidence.reference.trim())throw Error('Evidence reference required');if(next==='admitted'&&(!evidence.turnId||typeof evidence.turnId!=='string'))throw Error('Receipt turn ID required');if(next==='running'&&evidence.started!==true)throw Error('Actual start evidence required');if(next==='review'&&evidence.completed!==true)throw Error('Completion evidence required');if(next==='verified'&&(!sha(evidence.headSha)||evidence.passed!==true))throw Error('Exact verified SHA and passing evidence required');if(next==='blocked'&&(!evidence.reason||!evidence.resumeCondition||evidence.outcomeKnown!==true))throw Error('Known outcome and unblock condition required');t.history.push({state:next,evidence:structuredClone(evidence)});t.state=next;return structuredClone(t);});}
}
// GitHub adapter uses immutable commits and a NON-FORCED descendant-only ref update.
// Competing writers create sibling commits. Only one can fast-forward from the same head.
class GitHubStore {
 constructor(api,{owner,repo,branch='factory-state'}){this.api=api;this.owner=owner;this.repo=repo;this.branch=branch;}
 async read(){const {data:ref}=await this.api.git.getRef({owner:this.owner,repo:this.repo,ref:'heads/'+this.branch});const revision=ref.object.sha;const {data:file}=await this.api.repos.getContent({owner:this.owner,repo:this.repo,path:'queue.json',ref:revision});if(file.encoding!=='base64'||typeof file.content!=='string')throw Error('Queue content unavailable');return {revision,state:checkState(JSON.parse(Buffer.from(file.content,'base64').toString('utf8')))};}
 async compareAndSwap(revision,state){checkState(state);const common={owner:this.owner,repo:this.repo};const {data:blob}=await this.api.git.createBlob({...common,content:JSON.stringify(state,null,2)+'\n',encoding:'utf-8'});const {data:tree}=await this.api.git.createTree({...common,tree:[{path:'queue.json',mode:'100644',type:'blob',sha:blob.sha}]});const {data:commit}=await this.api.git.createCommit({...common,message:'Advance factory queue',tree:tree.sha,parents:[revision]});try{await this.api.git.updateRef({...common,ref:'heads/'+this.branch,sha:commit.sha,force:false});return true;}catch(e){if(e.status===409||e.status===422)return false;throw e;}}
}
module.exports={Queue,GitHubStore,checkState,key};
