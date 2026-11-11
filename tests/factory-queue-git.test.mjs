import test from 'node:test';import assert from 'node:assert/strict';import {mkdtempSync,rmSync} from 'node:fs';import {tmpdir} from 'node:os';import {join} from 'node:path';import {execFileSync} from 'node:child_process';import {createRequire} from 'node:module';
const {Queue}=createRequire(import.meta.url)('../scripts/factory/queue.cjs');
test('real Git objects persist queue across coordinator restart and reject stale ref writer',async()=>{
 const dir=mkdtempSync(join(tmpdir(),'factory-queue-'));
 const git=(args,input)=>execFileSync('git',['-C',dir,...args],{input,encoding:'utf8',stdio:['pipe','pipe','pipe'],env:{...process.env,GIT_AUTHOR_NAME:'Queue test',GIT_AUTHOR_EMAIL:'queue@example.invalid',GIT_COMMITTER_NAME:'Queue test',GIT_COMMITTER_EMAIL:'queue@example.invalid'}}).trim();
 const commit=(state,parent)=>{const blob=git(['hash-object','-w','--stdin'],JSON.stringify(state));const tree=git(['mktree'],`100644 blob ${blob}\tqueue.json\n`);return git(['commit-tree',tree,...(parent?['-p',parent]:[]),'-m','Queue state']);};
 try{
  git(['init','--bare']);const initial=commit({version:1,tasks:[]});git(['update-ref','refs/heads/factory-state',initial]);
  const store=()=>({async read(){const revision=git(['rev-parse','refs/heads/factory-state']);return{revision,state:JSON.parse(git(['show',revision+':queue.json']))};},async compareAndSwap(revision,state){const next=commit(state,revision);try{git(['update-ref','refs/heads/factory-state',next,revision]);return true;}catch{return false;}}});
  const q=new Queue(store()),p={repository:'Min-Konny/loopkeeper',issue:1,baseSha:'a'.repeat(40),planDigest:'b'.repeat(64),policyDigest:'c'.repeat(64),approvalRef:'test-user-approval',dependencies:[]};
  const added=await q.enqueue(p),snapshot=await store().read();await q.reserve(added.id,'worker','send-intent');
  assert.equal(await store().compareAndSwap(snapshot.revision,snapshot.state),false);
  const restarted=new Queue(store());assert.equal((await restarted.enqueue(p)).state,'reserved');await assert.rejects(restarted.reserve(added.id,'duplicate','different'));
  assert.equal((await store().read()).state.tasks.length,1);
 }finally{rmSync(dir,{recursive:true,force:true});}
});
