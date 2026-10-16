import {investmentEffect}from './investments.js?v=0.6.18';
import {accessoryById,weaponById,ACCESSORY_SLOTS}from './gear-content.js?v=0.6.18';
export const emptySets=()=>({preparation:Object.fromEntries(ACCESSORY_SLOTS.map(s=>[s,null])),combat:Object.fromEntries(ACCESSORY_SLOTS.map(s=>[s,null]))});
export function initializeGear(s){
 if(s.version===1)return;
 s.meta.gearVersion=1;
 s.meta.accessories??=[];s.meta.accessorySets??=emptySets();for(const row of Object.values(s.meta.accessorySets))for(const slot of ACCESSORY_SLOTS)row[slot]??=null;s.meta.accessorySlotsVersion=1;s.meta.presetVersion=1;s.meta.buildPresets??=[];s.meta.nextBuildPresetId??=1;
 s.run.ownedEquipment??=[...new Set(Object.values(s.run.equipment).map(x=>x.id))];
 if(s.run.playerCombatTimer===undefined)s.run.playerCombatTimer=s.run.combatTimer;
}
export function accessoryEffects(s,phase=s.run.status==='combat'?'combat':'preparation'){
 const result={};for(const id of Object.values(s.meta.accessorySets?.[phase]||{})){
  if(!s.meta.accessories?.includes(id))continue;for(const[k,v]of Object.entries(accessoryById(id)?.effect||{}))result[k]=(result[k]||0)+v;
 }return result;
}
export function combatBuild(s){
 const w=weaponById(s.run.equipment.weapon?.id)?.combat||{type:'melee',rate:1,pierce:0},a=accessoryEffects(s,'combat');
 const rate=Math.max(.6,Math.min(1.6,w.rate*(1+(a.haste||0)+investmentEffect(s,"haste"))));
 return {...w,rate,interval:1.5/rate,critRate:Math.min(.5,(a.critRate||0)+investmentEffect(s,"critRate")),critMultiplier:Math.min(2.5,1.5+(a.critPower||0)+(w.type==='crossbow'?.25:0)),counter:a.counter||0};
}
export function strikeModifier(s,e,consume=false){
 const b=combatBuild(s),c=e.buildCombat||{critGauge:0,hits:0};
 const gauge=c.critGauge+b.critRate,critical=gauge>=1-1e-8;
 if(consume){e.buildCombat={critGauge:Math.max(0,gauge-(critical?1:0)),hits:c.hits+1};}
 return {critical,multiplier:critical?b.critMultiplier:1,pierce:b.pierce,build:b};
}
export function changeGear(s,{type,id,phase,slot},recipes){
 if(s.version===1||s.run.status!=='preparing'||s.run.augments.offer.length)return {ok:false,reason:'準備中に構成を選んでください。'};
 initializeGear(s);
 if(type==='weapon'||type==='equipment'){
  const d=recipes.find(x=>x.id===id&&x.equipment&&(type==='equipment'||x.slot==='weapon'));if(!d||!s.run.ownedEquipment.includes(id))return {ok:false,reason:'この命で所持する武器ではありません。'};
  s.run.equipment[d.slot]={id:d.id,...d.equipment};return {ok:true};
 }
 if(type!=='accessory'||!['preparation','combat'].includes(phase)||!ACCESSORY_SLOTS.includes(slot))return {ok:false,reason:'構成が不正です。'};
 if(id!==null&&(!s.meta.accessories.includes(id)||accessoryById(id)?.slot!==slot))return {ok:false,reason:'この部位の所持品ではありません。'};
 s.meta.accessorySets[phase][slot]=id;return {ok:true};
}
