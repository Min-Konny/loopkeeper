import { getCatalog, getRecipeCost, getSkillProgress, isKnown, getUnlocks, getAugmentStatus } from './engine.js?v=0.4.1';
import { icon } from './icons.js?v=0.4.1';
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export function getPreparation(state) {
  const goal = state.run.queue[0];
  if (!goal || goal.kind !== 'goal' || state.settings.disabledUpgrades.includes('action_queue') || (!state.run.queueManaged && state.run.activeAction?.kind === 'gather')) return null;
  if (!state.meta.upgrades.includes('action_queue')) return null;
  const recipe = getCatalog(state).RECIPES.find(r => r.id === goal.id);
  if (!recipe) return null;
  const batch = state.run.activeAction?.id === goal.id ? state.run.activeAction : state.run.suspendedActions[goal.id];
  const count = recipe.equipment || recipe.facility ? 1 : goal.count;
  return { name: recipe.name, id: recipe.id, materials: Object.entries(getRecipeCost(state, recipe)).map(([id, amount]) => ({ id, required: amount * count, available: Math.min(amount * count, (state.run.resources[id] || 0) + (batch?.kind === 'craft' ? amount : 0)) })) };
}
export function preparationMarkup(state) {
  const preparation = getPreparation(state);
  if (!preparation || state.run.status !== 'preparing') return '';
  const { RESOURCES } = getCatalog(state);
  return `<div class="craft-preparation"><span class="preparation-goal" title="${esc(preparation.name)}">${icon('hammer')}${esc(preparation.name)}</span><div class="preparation-materials" aria-label="製作の準備状況">${preparation.materials.map(m => {
    const label = `${RESOURCES[m.id]?.name || m.id} ${m.available}/${m.required}`;
    return `<span class="preparation-material ${m.available >= m.required ? 'ready' : ''}" title="${esc(label)}" aria-label="${esc(label)}">${icon(m.id)}<b>${m.available}/${m.required}</b>${m.available >= m.required ? '<i aria-hidden="true">✓</i>' : ''}</span>`;
  }).join('')}</div></div>`;
}

export function availableDiscoveries(state) {
  const { ACTIONS, RECIPES } = getCatalog(state);
  const result = [...ACTIONS, ...RECIPES].filter(d => isKnown(state, d) && getSkillProgress(state.run.skills[d.skill].xp).level >= (d.unlockLevel || 1)).map(d => ({ id: d.id, name: d.name, icon: d.facility ? 'camp' : d.equipment ? 'hammer' : ({logging:'axe',mining:'pickaxe',foraging:'leaf',combat:'sword',smithing:'hammer'}[d.skill] || 'spark') }));
  const unlocks = getUnlocks(state);
  if (unlocks.facilities) result.push({ id: 'feature_village', name: '村の施設', icon: 'camp' });
  if (unlocks.diplomacy) result.push({ id: 'feature_diplomacy', name: '外交と交易', icon: 'gold' });
  if (getAugmentStatus(state).unlocked) result.push({ id: 'feature_augments', name: 'オーグメント', icon: 'spark' });
  return result;
}
