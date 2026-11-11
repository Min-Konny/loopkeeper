'use strict';
const {createHash}=require('node:crypto');
const sha=x=>typeof x==='string'&&/^[0-9a-f]{40}$/.test(x);
function subjectKey(input){
 const names=['repository','taskId','intentId','baseSha','planDigest','policyDigest'];
 if(!input||Object.keys(input).some(k=>![...names,'issue'].includes(k))||
 names.some(k=>typeof input[k]!=='string'||!input[k])||!sha(input.baseSha)||
 !/^[0-9a-f]{64}$/.test(input.planDigest)||!/^[0-9a-f]{64}$/.test(input.policyDigest)||
 !Number.isSafeInteger(input.issue)||input.issue<1)throw Error('Invalid worker subject');
 return createHash('sha256').update(JSON.stringify(names.map(k=>input[k]).concat(input.issue))).digest('hex');
}
// Configuration and receipt store belong to the protected coordinator, not Issue/PR data.
// An Actions dispatch has no run ID: an ambiguous/accepted dispatch MUST NOT be retried.
class GitHubActionsWorker {
 constructor({profile,api,receiptReader,enabled=false}){
  this.profile=structuredClone(profile);this.api=api;this.receiptReader=receiptReader;this.enabled=enabled;
 }
 validate(){
  const p=this.profile;
  if(!p||!p.repository||!sha(p.sourceSha)||!Number.isSafeInteger(p.workflowId)||p.workflowId<1||
  !/^\.github\/workflows\/[a-z0-9-]+\.yml$/.test(p.workflowPath)||
  !p.actor||p.ref!=='main')throw Error('Missing trusted worker profile');
 }
 async start(input){
  // Disabled before *any* network call, including credentialed metadata access.
  if(this.enabled!==true)throw Error('Worker disabled; no dispatch performed');
  this.validate();const key=subjectKey(input),p=this.profile;
  if(input.repository!==p.repository)throw Error('Wrong worker repository');
  const old=await this.receiptReader(key);
  if(old)throw Error('Existing intent requires reconciliation, not dispatch');
  const current=await this.api.getTrustedSource(p.repository,p.ref);
  if(current!==p.sourceSha)throw Error('Trusted worker source changed');
  // Scope, policy and credential permission must also be enforced by the trusted workflow.
  // GITHUB_TOKEN write access must never be exposed to candidate code.
  // Transport MUST bind the exact trusted source through an immutable protected ref.
  // Ordinary dispatch(main) is intentionally unsupported because of a TOCTOU race.
  if(typeof this.api.dispatchImmutable!=='function')throw Error('Immutable dispatch transport not configured');
  await this.api.dispatchImmutable({repository:p.repository,workflowId:p.workflowId,sourceSha:p.sourceSha,
   inputs:{subject:JSON.stringify(input),subject_key:key}});
  // HTTP 204 is NOT a worker receipt or proof of execution. Reserve intent until official run lookup.
  throw Error('Dispatch submitted; reconcile official run before admitting; do not retry');
 }
 async read({turnId,intentId}){
  this.validate();const p=this.profile;
  if(typeof turnId!=='string'||!/^[1-9][0-9]*$/.test(turnId)||!Number.isSafeInteger(Number(turnId)))throw Error('Invalid official run ID');
  const receipt=await this.receiptReader({runId:Number(turnId),intentId});
  if(!receipt||receipt.runId!==Number(turnId)||receipt.subject?.intentId!==intentId||
   receipt.subject.repository!==p.repository||receipt.subjectKey!==subjectKey(receipt.subject)||
   receipt.attempt!==1)throw Error('Missing correlated coordinator receipt');
  const run=await this.api.getRun(p.repository,Number(turnId));
  const check=r=>{
   if(r.id!==receipt.runId||r.run_attempt!==1||r.repository?.full_name!==p.repository||
    r.head_repository?.full_name!==p.repository||r.workflow_id!==p.workflowId||
    r.path!==p.workflowPath||r.head_sha!==p.sourceSha||r.head_branch!==p.ref||
    r.event!=='workflow_dispatch'||r.triggering_actor?.login!==p.actor||
    r.display_title!=='worker:'+receipt.subjectKey)throw Error('Worker run provenance mismatch');
  };
  check(run);
  const common={turnId,intentId,reference:'https://github.com/'+p.repository+'/actions/runs/'+run.id};
  // Workflow setup/in_progress does not prove Claude started; remain admitted.
  if(run.status!=='completed')return {...common,state:'admitted'};
  if(run.conclusion!=='success')return {...common,state:'failed'};
  // Success is only work completion, never independent acceptance. PR number comes
  // from a coordinator-owned reconciliation record, NOT arbitrary candidate artifacts.
  if(!Number.isSafeInteger(receipt.prNumber)||receipt.prNumber<1||!sha(receipt.headSha)||
   typeof receipt.branch!=='string'||!receipt.branch.startsWith('factory/'))throw Error('Missing reconciled PR output');
  const pr=await this.api.getPull(p.repository,receipt.prNumber);
  if(pr.state!=='open'||pr.head?.repo?.full_name!==p.repository||
   pr.base?.repo?.full_name!==p.repository||pr.base.ref!=='main'||
   pr.head.ref!==receipt.branch||pr.head.sha!==receipt.headSha)throw Error('Worker PR output mismatch');
  const latest=await this.api.getRun(p.repository,receipt.runId);check(latest);
  if(latest.status!=='completed'||latest.conclusion!=='success')throw Error('Worker run changed');
  return {...common,state:'completed',headSha:receipt.headSha};
 }
}
module.exports={GitHubActionsWorker,subjectKey};
