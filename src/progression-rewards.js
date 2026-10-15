// Rewards follow the previous frontier, so retreating to early waves cannot
// repeatedly fund a mature build. No award is triggered by rebirth or loading.
import {finalWaveForRun}from './campaign-rules.js?v=0.6.3';
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
 if(!p||p.startBestWave<3||s.run.endless?.active||e.country||e.wave<p.startBestWave||p.checkpointAward!==null)return 0;
 return p.checkpointAward=credit(s,repeatCheckpointValue(p.startBestWave));
}
export function rewardFrontierAttempt(s,e){
 initializeProgression(s);const p=s.run.progression;
 if(!p||p.startBestWave<3||s.run.endless?.active||e.country||p.attemptAward!==null||e.wave<Math.max(4,p.startBestWave)||s.run.wave<Math.max(3,p.startBestWave-1)||!e.report||e.hp>e.maxHp*.5)return 0;
 return p.attemptAward=credit(s,1);
}
export const repeatRunPoints=s=>s.run.progression?(s.run.progression.checkpointAward||0)+(s.run.progression.attemptAward||0):0;
