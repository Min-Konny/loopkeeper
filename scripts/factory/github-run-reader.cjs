const {createHash}=require('node:crypto');
const subjectKey=s=>createHash('sha256').update(JSON.stringify([s.repository,s.taskId,s.intentId,s.baseSha,s.headSha,s.planDigest])).digest('hex');
// Official API reads only. Receipts/config come from trusted coordinator storage, never candidate artifacts.
class GitHubRunReader {
 constructor({api,profile,receiptReader}){this.api=api;this.profile=structuredClone(profile);this.receiptReader=receiptReader;}
 async read(subject){
  const p=this.profile,key=subjectKey(subject),receipt=await this.receiptReader(key);
  if(p.assurance!=='isolated-independent'||subject.repository!==p.repository)throw Error('Independent verifier profile not established');
  if(!receipt||receipt.subjectKey!==key||!Number.isSafeInteger(receipt.runId)||receipt.runId<1||!Number.isSafeInteger(receipt.attempt)||receipt.attempt<1)throw Error('Missing trusted subject/run receipt');
  const run=await this.api.getRun(receipt.runId);
  if(run.id!==receipt.runId||run.run_attempt!==receipt.attempt||run.repository?.full_name!==p.repository||run.head_repository?.full_name!==p.repository||run.workflow_id!==p.workflowId||run.path!==p.workflowPath||run.head_sha!==p.sourceSha||run.head_branch!=='main'||run.event!=='workflow_dispatch'||run.triggering_actor?.login!==p.actor||run.display_title!=='verify:'+key)throw Error('Official run provenance mismatch');
  const identity={...subject,reference:`https://github.com/${p.repository}/actions/runs/${receipt.runId}/attempts/${receipt.attempt}`};
  if(run.status!=='completed')return {...identity,pending:true};
  if(run.conclusion!=='success')return {...identity,passed:false};
  const jobs=await this.api.getJobs(receipt.runId,receipt.attempt);
  if(!Array.isArray(jobs)||!Array.isArray(p.requiredJobs)||!p.requiredJobs.length)throw Error('Required jobs unavailable');
  for(const name of p.requiredJobs){const matching=jobs.filter(j=>j.name===name);if(matching.length!==1||matching[0].status!=='completed'||matching[0].conclusion!=='success')return {...identity,passed:false};}
  const latest=await this.api.getRun(receipt.runId);
  if(latest.id!==run.id||latest.run_attempt!==receipt.attempt||latest.head_sha!==run.head_sha||latest.status!=='completed'||latest.conclusion!=='success')throw Error('Run changed while reading attempt jobs');
  return {...identity,passed:true};
 }
}
module.exports={GitHubRunReader,subjectKey};
