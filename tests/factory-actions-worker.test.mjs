import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const {GitHubActionsWorker,subjectKey}=createRequire(import.meta.url)('../scripts/factory/github-actions-worker.cjs');
function harness(){
 const subject={repository:'Min-Konny/loopkeeper',taskId:'task',intentId:'intent',issue:1,baseSha:'a'.repeat(40),planDigest:'b'.repeat(64),policyDigest:'c'.repeat(64)};
 const profile={repository:subject.repository,sourceSha:'d'.repeat(40),workflowId:12,workflowPath:'.github/workflows/trusted-worker.yml',actor:'owner',ref:'main'};
 const receipt={runId:17,attempt:1,subject,subjectKey:subjectKey(subject),prNumber:2,headSha:'e'.repeat(40),branch:'factory/task'};
 const run={id:17,run_attempt:1,repository:{full_name:profile.repository},head_repository:{full_name:profile.repository},workflow_id:12,path:profile.workflowPath,head_sha:profile.sourceSha,head_branch:'main',event:'workflow_dispatch',triggering_actor:{login:'owner'},display_title:'worker:'+receipt.subjectKey,status:'completed',conclusion:'success'};
 const pr={state:'open',head:{repo:{full_name:profile.repository},sha:receipt.headSha,ref:receipt.branch},base:{repo:{full_name:profile.repository},ref:'main'}};
 const calls=[];const api={getTrustedSource:async()=>profile.sourceSha,dispatchImmutable:async x=>calls.push(x),getRun:async()=>run,getPull:async()=>pr};
 const worker=new GitHubActionsWorker({profile,api,receiptReader:async key=>typeof key==='string'?null:receipt});
 return {worker,profile,subject,receipt,run,pr,api,calls};
}
test('default disabled makes zero external calls',async()=>{const x=harness();x.worker.api=new Proxy({}, {get(){throw Error('network touched')}});await assert.rejects(x.worker.start(x.subject),/disabled/);});
test('accepted dispatch is unknown receipt, not execution; exactly one call',async()=>{const x=harness();x.worker.enabled=true;await assert.rejects(x.worker.start(x.subject),/reconcile official run/);assert.equal(x.calls.length,1);assert.equal(x.calls[0].inputs.subject_key,subjectKey(x.subject));});
test('existing intent never dispatches again',async()=>{const x=harness();x.worker.enabled=true;x.worker.receiptReader=async()=>x.receipt;await assert.rejects(x.worker.start(x.subject),/reconciliation/);assert.equal(x.calls.length,0);});
test('changed trusted source does not dispatch',async()=>{const x=harness();x.worker.enabled=true;x.api.getTrustedSource=async()=> 'f'.repeat(40);await assert.rejects(x.worker.start(x.subject),/source changed/);assert.equal(x.calls.length,0);});
test('unknown fields including credentials rejected',()=>assert.throws(()=>subjectKey({...harness().subject,token:'not-a-secret'})));
test('official run plus coordinator PR receipt yields completion, not acceptance',async()=>{const x=harness();const result=await x.worker.read({turnId:'17',intentId:'intent'});assert.equal(result.state,'completed');assert.equal(result.headSha,x.receipt.headSha);assert.equal(result.passed,undefined);});
for(const [name,change]of Object.entries({
 event:x=>x.run.event='pull_request',rerun:x=>x.run.run_attempt=2,actor:x=>x.run.triggering_actor.login='other',source:x=>x.run.head_sha='f'.repeat(40),
 intent:x=>x.receipt.subject.intentId='other',title:x=>x.run.display_title='other',
 fork:x=>x.pr.head.repo.full_name='other/repo',stale:x=>x.pr.head.sha='f'.repeat(40),closed:x=>x.pr.state='closed',
 missing:x=>delete x.receipt.prNumber
}))test('reject '+name,async()=>{const x=harness();change(x);await assert.rejects(x.worker.read({turnId:'17',intentId:'intent'}));});
test('workflow queued and in_progress do not claim Claude started',async()=>{const x=harness();x.run.status='queued';assert.equal((await x.worker.read({turnId:'17',intentId:'intent'})).state,'admitted');x.run.status='in_progress';assert.equal((await x.worker.read({turnId:'17',intentId:'intent'} )).state,'admitted');});
test('failed run does not read PR or claim completion',async()=>{const x=harness();x.run.conclusion='failure';x.api.getPull=async()=>{throw Error('not expected')};assert.equal((await x.worker.read({turnId:'17',intentId:'intent'})).state,'failed');});
test('rerun during PR lookup fails closed',async()=>{const x=harness();x.api.getPull=async()=>{x.run.run_attempt=2;return x.pr};await assert.rejects(x.worker.read({turnId:'17',intentId:'intent'}));});

test('ordinary mutable-ref dispatch transport is refused',async()=>{const x=harness();x.worker.enabled=true;delete x.api.dispatchImmutable;x.api.dispatch=async()=>{throw Error('unsafe')};await assert.rejects(x.worker.start(x.subject),/Immutable dispatch/);assert.equal(x.calls.length,0);});
