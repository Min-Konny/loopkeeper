// Pick existing productive work; never change XP rules, prices or discovery.
export function trainingCandidates(state,target,{definitions,levelFor,known,costFor,durationFor,visiting=new Set()}){
 const needs=costFor(target),priority=state.settings.craftMaterialPriority || [],rank=id=>{const i=priority.indexOf(id);return i<0?priority.length:i;};
 function useful(d){return Object.entries(d.yields || {}).some(([id,n])=>n>0 && (state.run.resources[id] || 0)<(needs[id] || 0));}
 return definitions.filter(d=>d.skill===target.skill && !d.equipment && !d.facility && !d.endlessFacility && !visiting.has(d.id) && known(d) && levelFor(d.skill)>=(d.unlockLevel || 1) && d.duration>0 && (d.xpCoefficient ?? 1)>0 && (!d.trainingStat || d.trainingStat==='attack'))
 .filter(d=>Object.entries(costFor(d)).every(([id,n])=>(state.run.resources[id] || 0)>=n || definitions.some(p=>p.yields?.[id]>0 && known(p) && !visiting.has(p.id))))
 .sort((a,b)=>{const aGroup=useful(a)?0:Object.keys(costFor(a)).length?2:1,bGroup=useful(b)?0:Object.keys(costFor(b)).length?2:1;
  return aGroup-bGroup || Math.min(...Object.keys(a.yields || {}).map(rank),priority.length)-Math.min(...Object.keys(b.yields || {}).map(rank),priority.length) || durationFor(a)-durationFor(b) || a.id.localeCompare(b.id);
 });
}
