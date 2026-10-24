import {PRESSURE_FACILITY}from './meal-content.js?v=0.6.64';
export const PRESSURE_GRACE=45;
export function battlePressure(s,e=s.run.enemy,elapsedOverride=null){if(!e||e.pressureVersion!==1)return{active:false,elapsed:0,graceRemaining:0,multiplier:1,slow:0};const elapsed=elapsedOverride??((e.round||0)*1.5+(s.run.combatTimer||0)),slow=Math.max(0,Math.min(.5,(s.run.facilities.signal_post||0)>0?PRESSURE_FACILITY.effect.pressureSlow:0)),after=Math.max(0,elapsed-PRESSURE_GRACE),multiplier=Math.min(1e6,1.02**(after/1.5*(1-slow)));return{active:true,elapsed,graceRemaining:Math.max(0,PRESSURE_GRACE-elapsed),multiplier,slow};}
export const pressuredAttack=(s,e=s.run.enemy,elapsedOverride=null)=>Math.min(1e9,(e?.attack||0)*battlePressure(s,e,elapsedOverride).multiplier);
