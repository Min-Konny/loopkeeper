import{getCatalog,getRecipeCost,getSkillProgress,isKnown,canStartAction}from'./engine.js?v=0.6.74';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function usefulGoals(s){
 if(s.version!==2||s.run.status!=='preparing')return[];
 const result=[],priority={barricade:1,guardhouse:2,infirmary:3,archery_tower:4,workshop:5,market:6,signal_post:7,smokehouse:8,henhouse:9,watchtower:10};
 for(const d of getCatalog(s).RECIPES){if(!isKnown(s,d))continue;let why,order;
  if(d.equipment){const old=s.run.equipment[d.slot]||{},stats=['attack','defense','maxHp','speed'];if(s.run.ownedEquipment.includes(d.id)||d.tier!==(old.tier||0)+1||!stats.some(k=>(d.equipment[k]||0)>(old[k]||0))||stats.some(k=>(d.equipment[k]||0)<(old[k]||0)))continue;why='装備の更新';order=({weapon:-4,tool:-3,armor:-2,shield:-1})[d.slot]??0;}
  else if(d.facility&&(s.run.facilities[d.facility.id]||0)===d.level-1){why=d.facility.id==='watchtower'?'準備時間を延長（待ち時間も増えます）':['henhouse','smokehouse'].includes(d.facility.id)?'料理を活用するための施設':d.facility.id==='signal_post'?'45秒を超える戦闘への備え':'施設の次段階';order=priority[d.facility.id]??20;}
  else continue;
  const paid=s.run.activeAction?.id===d.id?s.run.activeAction:s.run.suspendedActions[d.id],cost=getRecipeCost(s,d),missing=paid?.paidCost?{}:Object.fromEntries(Object.entries(cost).filter(([id,n])=>n>(s.run.resources[id]||0)).map(([id,n])=>[id,Math.ceil(n-(s.run.resources[id]||0))]));
  result.push({id:d.id,name:d.name,why,order,cost,missing,paid:!!paid?.paidCost,active:s.run.activeAction?.id===d.id,skill:d.skill,skillNeeded:Math.max(0,(d.unlockLevel||1)-getSkillProgress(s.run.skills[d.skill].xp).level),check:canStartAction(s,d.id),tab:d.facility?'village':'craft'});
 }
 return result.sort((a,b)=>Number(b.paid)-Number(a.paid)||a.order-b.order||a.id.localeCompare(b.id));
}
export function usefulGoalsMarkup(s){if(s.version!==2||s.run.status!=='preparing'||s.meta.bestWave<1)return'';const goals=usefulGoals(s),catalog=getCatalog(s),names=id=>catalog.RESOURCES[id]?.name||id;return'<details data-detail-key="useful-goals" class="useful-goals"><summary>未制作の装備・施設'+(goals.length?'：'+esc(goals[0].name):'：今の候補なし')+'</summary>'+(goals.length?goals.slice(0,3).map(g=>'<div class="useful-goal"><strong>'+esc(g.name)+'</strong><small>'+esc(g.why)+'</small><p>'+(g.paid?(g.active?'制作中・材料支払い済み':'中断中・材料支払い済み'):Object.entries(g.missing).length?'不足：'+Object.entries(g.missing).map(([id,n])=>esc(names(id))+' '+n).join(' / '):'材料は揃っています')+(g.skillNeeded?'・'+esc(catalog.SKILLS?.find(x=>x.id===g.skill)?.name||g.skill)+'をあと'+g.skillNeeded+'レベル':'')+'</p>'+(!g.check.ok&&!Object.keys(g.missing).length&&!g.paid?'<small>'+esc(g.check.reason)+'</small>':'')+'<button class="button small muted" data-tab="'+g.tab+'">'+(g.tab==='village'?'村の施設':'工房')+'で確認</button></div>').join(''):'<p>今わかっている未制作の装備・施設に、次段階の候補はありません。訓練や備蓄を進めながら次の解放を待てます。</p>')+'</details>';}
