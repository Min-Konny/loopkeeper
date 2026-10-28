import {specialistDuration}from './specialist-content.js?v=0.6.121';
import {getSkillProgress}from './legacy-engine.js?v=0.6.121';
// New preparation rules start only in a newly created/confirmed life.
export const preparationBalance=s=>s?.version===2&&[1,2].includes(s.meta.preparationBalanceVersion)&&[1,2].includes(s.run.preparationBalanceVersion);
export function preparationCostFactor(s,d){if(!preparationBalance(s))return 1;if(d?.equipment)return ({4:1.25,5:1.6,6:2.1,7:2.6})[d.tier]||1;if(d?.facility||d?.facilityId)return ({3:1.3,4:1.6,5:2})[d.level||d.facility?.level]||1;return 1;}
export function preparationChannelDuration(s,d,channel,normal,permanentLevel){return preparationBalance(s)&&channel==='auto_cook'?Math.max(.25,d.duration*1.6*specialistDuration(s,"cooking")/(1+.04*Math.max(0,permanentLevel-1))):normal;}
const routeChanges={forest:{hp:230,attack:24,defense:4,danger:'序盤・飛行'},quarry:{hp:330,attack:28,defense:12,danger:'序盤・重装'},marsh:{hp:240,attack:24,defense:6,danger:'序盤・連撃'},forest_depth:{hp:700,attack:90,defense:12},quarry_depth:{hp:1200,attack:108},citadel:{hp:1800,attack:110,defense:36},river:{hp:850,attack:84,defense:12},forge:{hp:1850,attack:180},observatory:{hp:3400,attack:265,defense:34},ice:{hp:5000,attack:360}};
// Fixed regional durability: strength earned later can still overpower early routes.
const routeDurability={forest:460,quarry:660,marsh:480,forest_depth:1400,quarry_depth:2400,citadel:3600,river:1700,forge:3700,observatory:6800,ice:10000};
export function preparationRoute(s,d){const adjusted=preparationBalance(s)&&d&&routeChanges[d.id]?{...d,...routeChanges[d.id]}:d;return s?.version===2&&adjusted&&routeDurability[adjusted.id]?{...adjusted,hp:Math.max(adjusted.hp,routeDurability[adjusted.id])}:adjusted;}

const bossAttacks={6:100,9:125,15:235,18:325,21:380,27:450,30:460,33:445,36:465};
export const preparationEnemyAttack=(s,e,normal)=>preparationBalance(s)&&s.run.campaign==='frontier36'&&bossAttacks[e.wave]?bossAttacks[e.wave]:normal;
export const preparationSpellDamage=(s,multiplier=1)=>preparationBalance(s)?30+(1.5*(getSkillProgress(s.run.skills.combat.xp).level-1)+(getSkillProgress(s.meta.skills.combat.xp,true).level-1))/multiplier:30;

export const preparationRevision=s=>s?.version===2&&s.meta.preparationBalanceVersion===2&&s.run.preparationBalanceVersion===2;
export function preparationDefinition(s,d){if(!preparationRevision(s)||!d)return d;const changes={cook_batch:{duration:12,xpCoefficient:1.35},cook_rations:{duration:18,xpCoefficient:1.5}};return changes[d.id]?{...d,...changes[d.id]}:d;}
