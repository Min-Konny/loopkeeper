import {specialistAug}from './specialist-content.js?v=0.6.127';
import {JOBS,OUTPOSTS,outpostId} from './settlement-content.js?v=0.6.127';
export const populationCapacity=s=>2+(s.run.facilities.housing||0);
export function population(s){
 if(s.run.population)return s.run.population;
 const assigned={};let free=populationCapacity(s);
 for(const id of Object.keys(JOBS))if(s.meta.upgrades.includes(id)&&free>0){assigned[id]=1;free--;}
 return {assigned,timers:{}};
}
export function initializeSettlement(s){if(s.version!==2)return;s.run.population??=population(s);for(const p of OUTPOSTS)if(s.run.routes?.cleared.includes(p.id)&&!s.run.facilities[outpostId(p.id)])s.run.facilities[outpostId(p.id)]=1;}
export const assigned=s=>Object.values(population(s).assigned).reduce((a,b)=>a+b,0);
export const staffing=(s,id)=>population(s).assigned[id]||0;
export function allocationLimit(s,id){
 if(JOBS[id])return s.meta.upgrades.includes(id)||['dead','legacy_setup','cleared'].includes(s.run.status)?1:0;
 const p=OUTPOSTS.find(p=>outpostId(p.id)===id);
 return p&&s.run.routes?.cleared.includes(p.id)?(s.run.facilities[id]||0):0;
}
export function allocatePopulation(s,id,count){
 if(s.version!==2||s.run.status!=='preparing')return {ok:false,reason:'襲撃準備中に配置してください。'};
 if(!Object.hasOwn(JOBS,id)&&!OUTPOSTS.some(p=>outpostId(p.id)===id))return {ok:false,reason:'不明な配置先です。'};
 if(!Number.isInteger(count)||count<0||count>allocationLimit(s,id))return {ok:false,reason:'雇用・開拓・拠点の増築が必要です。'};
 if(assigned(s)-staffing(s,id)+count>populationCapacity(s))return {ok:false,reason:'人口上限です。別の仕事から外すか、住宅を増築してください。'};
 initializeSettlement(s);s.run.population.assigned[id]=count;return {ok:true};
}
export function outpostRate(s,id){const p=OUTPOSTS.find(p=>p.id===id);return p?60/p.interval*(1+.25*Math.max(0,(s.run.facilities[outpostId(id)]||1)-1))*(specialistAug(s,'settled_outposts')?1.25:1):0;}
export function advanceOutposts(s,dt){
 initializeSettlement(s);
 for(const p of OUTPOSTS){const key=outpostId(p.id),n=staffing(s,key);if(!n||!s.run.routes?.cleared.includes(p.id))continue;
  const interval=60/outpostRate(s,p.id),progress=(s.run.population.timers[p.id]||0)+dt*n;
  const units=Math.floor((progress+1e-8)/interval);
  s.run.population.timers[p.id]=Math.max(0,Math.round((progress-units*interval)*1e8)/1e8);
  if(units)s.run.resources[p.resource]=Math.min(1e9,s.run.resources[p.resource]+units);
 }
}
export function validPopulation(s){
 const p=s.run.population;if(p===undefined)return true;
 if(!p||typeof p!=='object'||!p.assigned||typeof p.assigned!=='object'||Array.isArray(p.assigned)||!p.timers||typeof p.timers!=='object'||Array.isArray(p.timers))return false;
 if(Object.entries(p.assigned).some(([id,n])=>(!Object.hasOwn(JOBS,id)&&!OUTPOSTS.some(p=>outpostId(p.id)===id))||!Number.isInteger(n)||n<0||n>allocationLimit(s,id)))return false;
 if(assigned(s)>populationCapacity(s))return false;
 return Object.entries(p.timers).every(([id,n])=>OUTPOSTS.some(p=>p.id===id)&&Number.isFinite(n)&&n>=0&&n<=60);
}
