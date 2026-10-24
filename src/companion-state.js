import {COMPANIONS,companionById,companionEligible}from './companion-content.js?v=0.6.65';
export const freshCompanion=()=>({woodCount:0,bonusWood:0,foxCooldown:0,foxHits:0,foxDamage:0,turtleCharges:2,turtleBlocks:0,turtlePrevented:0});
export function synchronizeCompanions(s){
 if(s.version===1)return [];
 s.meta.companionVersion=1;s.meta.companions??=[];s.meta.activeCompanion??=null;s.run.companionState??=freshCompanion();
 const added=[];for(const p of COMPANIONS)if(companionEligible(s,p)&&!s.meta.companions.includes(p.id)){s.meta.companions.push(p.id);added.push(p.id);}return added;
}
export const activeCompanion=s=>s.meta.companions?.includes(s.meta.activeCompanion)&&companionById(s.meta.activeCompanion)?s.meta.activeCompanion:null;
export function beginCompanionFight(s){
 const state=s.run.companionState||freshCompanion();s.run.companionState={...state,foxCooldown:0,foxHits:0,foxDamage:0,turtleCharges:2,turtleBlocks:0,turtlePrevented:0};
}
export function companionWork(s,d,a,delivered){
 if(activeCompanion(s)!=='forest_sparrow'||a.channel!=='main'||d.skill!=='logging'||delivered<=0)return 0;
 const p=s.run.companionState;p.woodCount=(p.woodCount+1)%3;if(p.woodCount)return 0;
 const amount=Math.min(1,1e9-s.run.resources.wood);s.run.resources.wood+=amount;p.bonusWood=Math.min(1e9,p.bonusWood+amount);return amount;
}
export function companionCritical(s,e,critical,damage){
 if(!critical||e.hp<=0||activeCompanion(s)!=='ember_fox')return;
 const p=s.run.companionState,m=s.run.magicState;if(p.foxCooldown>1e-8||!m||m.burnTicks<=0)return;
 const power=m.burnTicks*m.burnPower*2+6;m.burnTicks=0;m.burnPower=0;m.burnTimer=0;p.foxCooldown=8;p.foxHits++;p.foxDamage+=damage(power);
}
export function companionPacket(s,e,hits){
 const p=s.run.companionState;if(activeCompanion(s)!=='shield_tortoise'||!p||!p.turtleCharges||![1,4].includes(e.round))return hits;
 p.turtleCharges--;p.turtleBlocks++;let remaining=14;
 return hits.map(hit=>{const amount=Math.min(remaining,Math.max(0,hit-1));remaining-=amount;p.turtlePrevented+=amount;return hit-amount;});
}
export function selectCompanion(s,id){
 if(s.version===1||s.run.status!=='preparing'||s.run.augments.offer.length)return {ok:false,reason:'準備中に同行を選んでください。'};
 if(id!==null&&(!companionById(id)||!s.meta.companions?.includes(id)))return {ok:false,reason:'まだ所持していない相棒です。'};
 s.meta.activeCompanion=id;return {ok:true};
}
