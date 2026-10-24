import {WORK_MILESTONES}from './work-milestone-content.js?v=0.6.75';
const jobs=s=>[s.run.activeAction,...Object.values(s.run.suspendedActions||{})].filter(Boolean);
export function initializeWorkMilestones(s){
 if(s.version===1||s.meta.workMilestoneVersion===1)return;
 s.meta.workMilestoneVersion=1;s.meta.workCounts={};s.meta.workClaims=[];s.meta.workNotified=[];
 // Already paid work retains its original dedicated material receipt.
 for(const job of jobs(s))if(job.trophyReceipt?.version===1&&job.trophyReceipt.recipeVersion===undefined)job.trophyReceipt.recipeVersion=1;
}
export function recordWorkMilestone(s,d,units=1){
 initializeWorkMilestones(s);const awards=[];
 for(const m of WORK_MILESTONES){
  if(!(m.action===d.id||m.equipment&&(d.equipment||d.accessory)))continue;
  s.meta.workCounts[m.id]=Math.min(1e9,(s.meta.workCounts[m.id]||0)+units);
  if(s.meta.workCounts[m.id]<m.count||s.meta.workClaims.includes(m.id))continue;
  s.meta.workClaims.push(m.id);s.meta.trophies[m.material]=(s.meta.trophies[m.material]||0)+1;s.meta.trophyEarned[m.material]=(s.meta.trophyEarned[m.material]||0)+1;awards.push(m);
 }
 return awards;
}
export function validWorkMilestones(s){
 const m=s.meta,keys=new Set(WORK_MILESTONES.map(x=>x.id)),object=x=>x&&typeof x==='object'&&!Array.isArray(x),list=x=>Array.isArray(x)&&new Set(x).size===x.length&&x.every(k=>keys.has(k));
 if(m.workMilestoneVersion===undefined)return ['workCounts','workClaims','workNotified'].every(k=>m[k]===undefined);
 if(m.workMilestoneVersion!==1||!object(m.workCounts)||!list(m.workClaims)||!list(m.workNotified)||m.workNotified.some(k=>!m.workClaims.includes(k)))return false;
 if(Object.entries(m.workCounts).some(([k,n])=>!keys.has(k)||!Number.isInteger(n)||n<0||n>1e9))return false;
 for(const d of WORK_MILESTONES){const claimed=m.workClaims.includes(d.id);if(claimed!==((m.workCounts[d.id]||0)>=d.count)||(m.trophyEarned?.[d.material]||0)!==(claimed?1:0))return false;}
 return true;
}
export function workMilestoneMarkup(s){if(s.version===1)return '';return '<details class="work-milestones"><summary>作業実績と特殊素材</summary><p>完了回数は転生後も保持。各素材1個を一度だけ獲得し、通常素材と合わせて製作します。導入前の過去分は推測集計しません。職人による別の受動産出・購入・クリックは回数に含みません。</p>'+WORK_MILESTONES.map(m=>'<p><strong>'+m.name+'</strong> · '+m.label+' '+Math.min(m.count,s.meta.workCounts?.[m.id]||0)+' / '+m.count+'回'+(m.id==='fishing'&&s.run.earlyLoopVersion===1?'（魚4匹分を1回として計上）':'')+' · '+(s.meta.workClaims?.includes(m.id)?'素材獲得済み':'未達成')+' · 所持 '+(s.meta.trophies?.[m.material]||0)+'</p>').join('')+'</details>';}
