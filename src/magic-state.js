import {preparationSpellDamage}from './preparation-balance.js?v=0.6.38';
import {investmentEffect}from './investments.js?v=0.6.38';
import {weaponById}from './gear-content.js?v=0.6.38';
import {accessoryEffects}from './gear-state.js?v=0.6.38';
import {contractEffects}from './contracts.js?v=0.6.38';
import {routeEffects}from './routes.js?v=0.6.38';
import {alchemyResource}from './magic-content.js?v=0.6.38';
export const freshMagic=()=>({mana:30,castTimer:0,burnTimer:0,burnTicks:0,burnPower:0,wardCooldown:0,casts:0,detonations:0,catalystsUsed:0,wardsUsed:0,burnDamage:0,spellDamage:0});
export function initializeMagic(s){
 if(s.version===1)return;s.meta.magicVersion=1;for(const id of ['spark_catalyst','ward_essence'])s.run.resources[id]??=0;
 s.run.magicState??=freshMagic();s.settings.alchemyUse??={catalyst:true,ward:true};
}
export const isCaster=s=>weaponById(s.run.equipment.weapon?.id)?.combat?.type==='magic';
export const casterMultiplier=s=>weaponById(s.run.equipment.weapon?.id)?.combat?.spellMultiplier||1;
const has=(s,id)=>s.run.augments.selected.includes(id);
const spend=(s,id)=>{if(!s.settings.alchemyUse?.catalyst||s.run.resources[id]<1)return false;s.run.resources[id]--;s.run.magicState.catalystsUsed++;return true;};
export function physicalIgnition(s,e,critical){
 if(!critical||e.hp<=0||!has(s,'binding_oil'))return;initializeMagic(s);
 const m=s.run.magicState; // A stronger flame neither gets replaced nor wastes oil.
 if(m.burnTicks*m.burnPower>=6||!spend(s,'spark_catalyst'))return;
 m.burnTicks=3;m.burnPower=2;m.burnTimer=0;
}
export const manaRegeneration=s=>2+(routeEffects(s).manaRegen||0)+(contractEffects(s).manaRegen||0)+(accessoryEffects(s,"combat").manaRegen||0);
export const spellInterval=s=>4/(1+investmentEffect(s,"castHaste"));
export function advanceMagic(s,dt,damage){
 initializeMagic(s);const m=s.run.magicState;m.mana=Math.min(30,m.mana+manaRegeneration(s)*dt);m.wardCooldown=Math.max(0,m.wardCooldown-dt);
 if(m.burnTicks>0){m.burnTimer+=dt;if(m.burnTimer>=1-1e-8){m.burnTimer=Math.max(0,m.burnTimer-1);m.burnTicks--;m.burnDamage+=damage(m.burnPower);}}
 if(s.run.enemy.hp<=0)return;if(!isCaster(s))return;
 const interval=spellInterval(s);m.castTimer=Math.min(interval,m.castTimer+dt);if(m.castTimer<interval-1e-8||m.mana<10-1e-8)return;
 m.castTimer=0;m.mana=Math.max(0,m.mana-10);m.casts++;m.spellDamage+=damage(preparationSpellDamage(s,casterMultiplier(s)));if(s.run.enemy.hp<=0)return;
 if(has(s,'volatile_ink')&&m.burnTicks>0&&spend(s,'spark_catalyst')){const blast=m.burnTicks*m.burnPower*5;m.burnTicks=0;m.burnPower=0;m.burnTimer=0;m.detonations++;m.spellDamage+=damage(blast);}
 else{m.burnTicks=6;m.burnPower=3;m.burnTimer=0;}
}
export function wardPacket(s,hits,maxHp){
 initializeMagic(s);const m=s.run.magicState;
 if(!s.settings.alchemyUse.ward||s.run.resources.ward_essence<1||m.wardCooldown>1e-8||hits.reduce((a,b)=>a+b,0)<maxHp*.2)return hits;
 s.run.resources.ward_essence--;m.wardsUsed++;m.wardCooldown=6;let remaining=has(s,'ward_distillation')?30:18;
 if(has(s,'ward_distillation'))m.mana=Math.min(30,m.mana+4);
 return hits.map(hit=>{const amount=Math.min(remaining,Math.max(0,hit-1));remaining-=amount;return hit-amount;});
}
export function magicChoice(s,{type,id,value}){
 if(s.version===1||s.run.status!=='preparing'||s.run.augments.offer.length)return {ok:false,reason:'準備中に設定してください。'};initializeMagic(s);
 if(type==='use'&&['catalyst','ward'].includes(id)&&typeof value==='boolean'){s.settings.alchemyUse[id]=value;return {ok:true};}
 return {ok:false,reason:'錬金設定が不正です。'};
}

// Potential direct packet before the enemy remaining-HP clamp.
export const fireballPower=s=>preparationSpellDamage(s,casterMultiplier(s))*casterMultiplier(s)*(1+investmentEffect(s,"spellPower")+(accessoryEffects(s,"combat").spellPower||0));
