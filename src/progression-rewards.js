import {preparationRevision}from './preparation-balance.js?v=0.6.62';
// Rewards follow the previous frontier, so retreating to early waves cannot
// repeatedly fund a mature build. No award is triggered by rebirth or loading.
import {earlyLoop}from './early-loop.js?v=0.6.62';
import {lateLoop,repeatRouteValue}from './late-loop.js?v=0.6.62';
import {finalWaveForRun}from './campaign-rules.js?v=0.6.62';
export const repeatCheckpointValue=wave=>Math.min(3,1+Math.floor(wave/6));
export function createProgression(meta,finalWave=21){return {startBestWave:Math.min(finalWave,meta.bestWave),checkpointAward:null,attemptAward:null};}
export function initializeProgression(s){
 if(s.version===1||s.run.progression)return;
 s.run.progression=createProgression(s.meta,finalWaveForRun(s));
 // Existing clears have already happened; do not pay retrospectively.
 if(s.run.wave>=s.run.progression.startBestWave)s.run.progression.checkpointAward=0;
}
function credit(s,amount){
 const earned=Math.max(0,Math.min(amount,1e9-s.meta.totalPoints));
 s.meta.points+=earned;s.meta.totalPoints+=earned;s.meta.repeatPoints=(s.meta.repeatPoints||0)+earned;return earned;
}
export function rewardRepeatVictory(s,e){
 initializeProgression(s);const p=s.run.progression;
 if(!p||p.startBestWave<(earlyLoop(s)?2:3)||s.run.endless?.active||s.run.routes?.active||(e.country&&!(lateLoop(s)||earlyLoop(s)&&p.startBestWave<=12&&e.wave<=12))||e.wave<p.startBestWave||p.checkpointAward!==null)return 0;
 return p.checkpointAward=credit(s,earlyLoop(s)&&p.startBestWave<=12?Math.min(4,2+Math.floor(p.startBestWave/6)):repeatCheckpointValue(p.startBestWave));
}
export function rewardFrontierAttempt(s,e){
 initializeProgression(s);const p=s.run.progression;
 const stalled=preparationRevision(s)&&p&&s.run.wave===p.startBestWave&&e.wave===p.startBestWave+1;
 if(!p||p.startBestWave<3||s.run.endless?.active||s.run.routes?.active||(e.country&&!(lateLoop(s)||earlyLoop(s)&&p.startBestWave<=12&&e.wave<=12))||p.attemptAward!==null||e.wave<Math.max(4,p.startBestWave)||s.run.wave<Math.max(3,p.startBestWave-1)||!e.report||e.hp>e.maxHp*(stalled ? .75 : .5))return 0;
 return p.attemptAward=credit(s,(earlyLoop(s)&&p.startBestWave<=12&&e.wave<=12?2:1)+(stalled?1:0));
}
export const repeatRunPoints=s=>s.run.progression?(s.run.progression.checkpointAward||0)+(s.run.progression.attemptAward||0)+(s.run.progression.routeAward||0):0;

export function rewardRepeatRoute(s,d){const amount=repeatRouteValue(s,d);if(!amount)return 0;initializeProgression(s);const p=s.run.progression;if((p.routeAward||0)>=2)return 0;const earned=credit(s,amount);p.routeAward=(p.routeAward||0)+earned;return earned;}
