const {randomUUID}=require('node:crypto');
const {Queue,checkState}=require('./queue.cjs');
const sha=x=>typeof x==='string'&&/^[0-9a-f]{40}$/.test(x);
// Trusted coordinator entrypoint. Adapters are configured by the operator, never by Issue text.
// It cannot authorize a task: policy.check must validate the immutable approved plan externally.
class Consumer {
 constructor({store,policy,worker,verifier,repository,owner}){this.store=store;this.queue=new Queue(store);this.policy=policy;this.worker=worker;this.verifier=verifier;this.repository=repository;this.owner=owner;}
 async step(){
  const {state}=await this.store.read();checkState(state);
  const tasks=state.tasks.filter(t=>t.plan.repository===this.repository);
  const active=tasks.find(t=>['reserved','uncertain','admitted','running','review'].includes(t.state));
  if(active){
   if(['reserved','uncertain'].includes(active.state))return {state:'reconcile-required',id:active.id};
   if(active.owner!==this.owner)return {state:'other-owner',id:active.id};
   const current=await this.policy.check(structuredClone(active.plan));
   if(current?.allowed!==true||current.planDigest!==active.plan.planDigest||current.policyDigest!==active.plan.policyDigest||current.baseSha!==active.plan.baseSha)return {state:'policy-hold',id:active.id};
   if(active.state==='review')return this.verify(active);
   const receipt=active.history.findLast(h=>h.state==='admitted')?.evidence;
   // Poll failure leaves state unchanged; a read failure must never cause a new send.
   const outcome=await this.worker.read({turnId:receipt.turnId,intentId:active.intentId});
   if(outcome?.turnId!==receipt.turnId||outcome?.intentId!==active.intentId)throw Error('Worker result identity mismatch');
   if(outcome.state==='running'){
    if(active.state==='admitted')await this.queue.transition(active.id,active.intentId,'running',{reference:outcome.reference,started:true});
    return {state:'running',id:active.id};
   }
   if(outcome.state==='completed'){
    if(!sha(outcome.headSha))throw Error('Completed result missing exact artifact SHA');
    await this.queue.transition(active.id,active.intentId,'review',{reference:outcome.reference,completed:true,headSha:outcome.headSha,turnId:receipt.turnId});
    return {state:'review',id:active.id};
   }
   if(outcome.state==='failed'){
    await this.queue.transition(active.id,active.intentId,'blocked',{reference:outcome.reference,reason:'Worker reported failure',resumeCondition:'Reconcile failure and verify recovery',outcomeKnown:true});
    return {state:'blocked',id:active.id};
   }
   return {state:active.state,id:active.id};
  }
  const task=tasks.find(t=>t.state==='queued'&&t.plan.dependencies.every(id=>tasks.find(x=>x.id===id)?.state==='verified'));
  if(!task)return {state:'idle'};
  const approval=await this.policy.check(structuredClone(task.plan));
  if(approval?.allowed!==true||approval.planDigest!==task.plan.planDigest||approval.policyDigest!==task.plan.policyDigest||approval.baseSha!==task.plan.baseSha)throw Error('Trusted policy has not approved exact snapshot');
  const intentId=randomUUID();await this.queue.reserve(task.id,this.owner,intentId);
  const current=await this.policy.check(structuredClone(task.plan));
  if(current?.allowed!==true||current.planDigest!==task.plan.planDigest||current.policyDigest!==task.plan.policyDigest||current.baseSha!==task.plan.baseSha){
   await this.queue.transition(task.id,intentId,'blocked',{reference:'policy recheck before send',reason:'Approval changed before send; worker not invoked',resumeCondition:'Verify current approval and explicitly recover',outcomeKnown:true});
   return {state:'blocked',id:task.id};
  }
  // Queue/API credentials are never fields in this payload. Actual runners still require process isolation.
  const input=Object.freeze({taskId:task.id,intentId,repository:task.plan.repository,issue:task.plan.issue,baseSha:task.plan.baseSha,planDigest:task.plan.planDigest,policyDigest:task.plan.policyDigest});
  let receipt;
  try{receipt=await this.worker.start(input);if(typeof receipt?.turnId!=='string'||!receipt.turnId||receipt.intentId!==intentId||typeof receipt.reference!=='string'||!receipt.reference.trim())throw Error('Invalid send receipt');}
  catch(error){await this.queue.transition(task.id,intentId,'uncertain',{reference:'send outcome unavailable; official reconciliation required'});throw error;}
  // If receipt persistence fails, reservation remains. Do not call worker.start again.
  await this.queue.transition(task.id,intentId,'admitted',{reference:receipt.reference,turnId:receipt.turnId});
  return {state:'admitted',id:task.id,turnId:receipt.turnId};
 }
 async verify(task){
  const completed=task.history.at(-1).evidence;
  if(!sha(completed.headSha))throw Error('Review has no immutable artifact');
  // The verifier adapter must READ an existing trusted result, never initiate a paid run.
  // Concurrent reads are safe; verification scheduling/idempotency is a separate integration requirement.
  const result=await this.verifier.read({repository:this.repository,taskId:task.id,intentId:task.intentId,baseSha:task.plan.baseSha,headSha:completed.headSha,planDigest:task.plan.planDigest});
  if(result?.taskId!==task.id||result?.intentId!==task.intentId||result?.repository!==this.repository||result?.headSha!==completed.headSha||result?.planDigest!==task.plan.planDigest||typeof result.reference!=='string'||!result.reference.trim())throw Error('Verifier subject mismatch');
  if(result.passed!==true){await this.queue.transition(task.id,task.intentId,'blocked',{reference:result.reference,reason:'Independent verification did not pass',resumeCondition:'Repair and separately verify the exact new artifact',outcomeKnown:true});return{state:'blocked',id:task.id};}
  await this.queue.transition(task.id,task.intentId,'verified',{reference:result.reference,headSha:result.headSha,passed:true});
  return {state:'verified',id:task.id};
 }
}
module.exports={Consumer};
