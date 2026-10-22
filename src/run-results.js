import {earlyLoop}from './early-loop.js?v=0.6.55';import {lateLoop}from './late-loop.js?v=0.6.55';
import {campaignForRun}from './campaign-rules.js?v=0.6.55';
import {repeatRunPoints}from './progression-rewards.js?v=0.6.55';
export function createRunResults(meta){
 const previous=(meta.history||[]).find(x=>x.generation<meta.generation),previousWall=previous?.result?.wallWave||null;
 return {startPoints:meta.totalPoints,startFeatures:[...(meta.freeFeatures||[])],partial:false,activeRealSeconds:0,timingComplete:true,arrivals:{},clears:{},previousWall,wallReference:null};
}
export function initializeRunResults(s){
 if(s.version===1||s.run.results)return;
 const r=createRunResults(s.meta);r.partial=true;r.timingComplete=false;
 const oldWall=s.run.enemy?.wave||s.run.deathReport?.wave;if(oldWall)r.arrivals[oldWall]={game:null,real:null};
 s.run.results=r;
}
export function recordArrival(s,wave){
 initializeRunResults(s);const r=s.run.results;
 const time={game:s.run.elapsed,real:r.timingComplete?r.activeRealSeconds:null};
 r.arrivals[wave]=time;if(wave===r.previousWall)r.wallReference={...time};
 for(const key of Object.keys(r.arrivals).sort((a,b)=>Number(a)-Number(b)).slice(0,-30))delete r.arrivals[key];
}
export function recordClear(s,wave){
 initializeRunResults(s);const r=s.run.results;r.clears[wave]={game:s.run.elapsed,real:r.timingComplete?r.activeRealSeconds:null};
 for(const key of Object.keys(r.clears).sort((a,b)=>Number(a)-Number(b)).slice(0,-30))delete r.clears[key];
}
export function runSummary(s){
 const r=s.run.results;if(!r)return null;
 const wallWave=Math.max(s.run.wave,...Object.keys(r.arrivals).map(Number)),wallTime=r.arrivals[wallWave]||r.clears[wallWave]||null;
 return {...(lateLoop(s)?{lateLoopVersion:1,routeRepeatPoints:s.run.progression?.routeAward||0}:{}),...(earlyLoop(s)?{earlyLoopVersion:1,enemyRemainingPercent:s.run.battleReports?.[0]?.maxHp?Math.round(100*s.run.battleReports[0].remainingHp/s.run.battleReports[0].maxHp):null}:{}),campaign:campaignForRun(s),wave:s.run.wave,wallWave,gameSeconds:s.run.elapsed,realSeconds:r.timingComplete?r.activeRealSeconds:null,pointsGained:Math.max(0,s.meta.totalPoints-r.startPoints),repeatPoints:repeatRunPoints(s),partial:r.partial,freeUnlocks:(s.meta.freeFeatures||[]).filter(id=>!r.startFeatures.includes(id)),wallTime,previousWall:r.previousWall,wallReference:r.wallReference};
}
export function runComparison(s){
 const current=runSummary(s),previous=(s.meta.history||[]).find(x=>x.generation<s.meta.generation)?.result;
 if(!current||!previous)return null;
 if((previous.campaign||"classic21")!==current.campaign&&Math.max(current.wallWave,previous.wallWave)>21)return null;
 let sameWall=null;if(current.previousWall===previous.wallWave&&current.wallReference?.game!=null&&previous.wallTime?.game!=null){
   sameWall={wave:previous.wallWave,game:current.wallReference.game-previous.wallTime.game,real:current.wallReference.real!=null&&previous.wallTime.real!=null?current.wallReference.real-previous.wallTime.real:null};
 }
 return {wave:current.wave-previous.wave,sameWall};
}
