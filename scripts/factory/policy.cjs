const {key}=require('./queue.cjs');
// Config must be loaded from the operator-controlled trusted revision, never a PR/Issue artifact.
// permissionReader must obtain current repository permission for the configured approver.
class SnapshotPolicy {
 constructor({repository,catalogReader,permissionReader}){this.repository=repository;this.catalogReader=catalogReader;this.permissionReader=permissionReader;}
 async check(plan){
  const catalog=await this.catalogReader();
  if(!/^[0-9a-f]{40}$/.test(catalog?.revision||'')||!Array.isArray(catalog?.approvedPlans))return {allowed:false};
  const record=catalog.approvedPlans.find(r=>r.id===key(plan));
  if(plan.repository!==this.repository||!record||typeof record.approver!=='string'||!record.approver)return {allowed:false};
  const fields=['repository','issue','baseSha','planDigest','policyDigest','approvalRef','dependencies'];
  if(fields.some(k=>JSON.stringify(record.plan[k])!==JSON.stringify(plan[k])))return {allowed:false};
  const permission=await this.permissionReader({repository:this.repository,user:record.approver});
  if(!['write','maintain','admin'].includes(permission))return {allowed:false};
  return{allowed:true,planDigest:plan.planDigest,policyDigest:plan.policyDigest,baseSha:plan.baseSha};
 }
}
module.exports={SnapshotPolicy};
