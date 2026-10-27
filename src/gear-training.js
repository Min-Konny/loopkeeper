import {finalWaveForRun}from './campaign-rules.js?v=0.6.112';
import * as E from './engine.js?v=0.6.112';import {combatBuild}from './gear-state.js?v=0.6.112';
export function trainBuild(state,{wave=state.run.wave+1,seconds=45}={}){
 if(state.version===1||state.run.status!=='preparing'||state.run.augments.offer.length)return {ok:false,reason:'準備中に試し打ちできます。'};
 if(!Number.isInteger(wave)||wave<1||wave>Math.min(finalWaveForRun(state),state.meta.bestWave+1)||!Number.isFinite(seconds)||seconds<=0||seconds>60)return {ok:false,reason:'試し打ちの条件が不正です。'};
 const s=structuredClone(state),before=s.run.elapsed;s.run.wave=wave-1;s.run.nextWaveAt=before;s.run.activeAction=null;s.run.suspendedActions={};s.run.queue=[];s.run.augments.offer=[];s.run.acceleration.active=false;s.settings.paused=false;s.run.idleWait=true;
 E.advanceTime(s,.1);for(let t=0;t<seconds&&s.run.status==='combat';t+=.1)E.advanceTime(s,.1);
 const report=s.run.battleReports?.[0]?.wave===wave?s.run.battleReports[0]:s.run.enemy?.report;
 return {ok:true,wave,seconds:+(s.run.elapsed-before).toFixed(1),won:s.run.wave>=wave,status:s.run.status,remainingHp:Math.max(0,s.run.hp),enemyHp:s.run.enemy?.hp||report?.remainingHp||0,playerHits:report?.playerHits||0,criticalHits:report?.criticalHits||0,playerDamage:report?.player||0,counterDamage:report?.counter||0,companion:{id:state.meta.activeCompanion,...s.run.companionState},petDamage:report?.pet||0,magic:s.run.magicState,magicDamage:report?.magic||0,alchemySpent:{catalyst:(state.run.resources.spark_catalyst||0)-(s.run.resources.spark_catalyst||0),ward:(state.run.resources.ward_essence||0)-(s.run.resources.ward_essence||0)},build:combatBuild(state)};
}
