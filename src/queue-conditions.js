import { CONTENT } from './content.js?v=0.6.24';
import { getSkillProgress } from './legacy-engine.js?v=0.6.24';
const definitions = [...CONTENT.actions, ...CONTENT.equipment, ...CONTENT.processing, ...CONTENT.facilities];
export const isCombatTraining=id=>definitions.some(d=>d.id===id&&d.skill==='combat'&&['attack','defense','vitality'].includes(d.trainingStat));
export function trainingProgress(s,id){const d=definitions.find(d=>d.id===id);if(!isCombatTraining(id))return null;const xp=['defense','vitality'].includes(d.trainingStat)?s.run.training?.[d.trainingStat]||0:s.run.skills.combat.xp;return getSkillProgress(xp);}
export function validCondition(q) {
  const c = q.until, d = definitions.find(d => d.id === q.id);
  if (!c) return c === undefined;
  if (!d || d.slot || d.facilityId || !['stock', 'level', 'unlock'].includes(c.type) || typeof c.pauseAfter !== 'boolean') return false;
  if (c.type === 'stock') return !!d.yields?.[c.resource] && Number.isInteger(c.target) && c.target > 0 && c.target <= 9999;
  if (c.type === 'level') return Number.isInteger(c.target) && c.target > 1 && c.target <= 100;
  const recipe = CONTENT.equipment.find(r => r.id === c.recipe);
  return !!recipe && recipe.skill === d.skill;
}
export function goalSatisfied(s, q) {
  if (!q.until) return false;
  const c = q.until, d = definitions.find(d => d.id === q.id);
  if (c.type === 'stock') return s.run.resources[c.resource] >= c.target;
  const xp = ['defense', 'vitality'].includes(d.trainingStat) ? s.run.training[d.trainingStat] : s.run.skills[d.skill].xp;
  if (c.type === 'level') return getSkillProgress(xp).level >= c.target;
  const target = CONTENT.equipment.find(r => r.id === c.recipe);
  return getSkillProgress(s.run.skills[d.skill].xp).level >= target.unlockLevel;
}
export function conditionLabel(q) {
  const c = q.until;
  if (!c) return `残り${q.count}回`;
  const label = c.type === 'stock' ? `${CONTENT.resources.find(r => r.id === c.resource)?.name} ${c.target}個まで` : c.type === 'level' ? (isCombatTraining(q.id)?`この命の進行Lv.${c.target}まで`:`Lv.${c.target}まで`) : `${CONTENT.equipment.find(r => r.id === c.recipe)?.name}の製作Lvまで`;
  return label + (c.pauseAfter ? '・達成で停止' : '');
}
