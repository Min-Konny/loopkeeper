import { ACTIONS, RECIPES, RESOURCES, canStartAction, getActionDuration, getRecipeCost, enqueueAction, toggleUpgrade } from './legacy-engine.js?v=0.3.8';

const MAX_STEPS = 8;
const MAX_COUNT = 99;
const failure = reason => ({ ok: false, reason, steps: [], summary: '' });
const resourceName = id => RESOURCES[id]?.name || id;
class PlanningError extends Error {}

/** Build an inventory-aware crafting plan without changing the game state. */
export function planCraft(state, recipeId, count = 1) {
  const target = RECIPES.find(recipe => recipe.id === recipeId);
  if (!target) return failure('その製作は存在しません。');
  if (!Number.isInteger(count) || count < 1 || count > MAX_COUNT) return failure('回数は1〜99の整数で指定してください。');
  if (target.equipment || target.facility) count = 1;
  if (!state.meta.upgrades.includes('action_queue')) return failure('継承ポイントで「行動予約・おまかせ製作」を解放してください。');
  if (state.run.status === 'dead') return failure('次の世代で製作を予約してください。');
  if (state.run.queue.length > 0 || state.run.activeAction?.kind === 'craft') return planAfterPending(state, recipeId, count);

  // Validate skill and equipment rules through the engine, ignoring only material
  // shortages and work that will be interrupted after the current raid.
  function checkDefinition(definition) {
    const funded = { ...state.run.resources };
    for (const [id, amount] of Object.entries(getRecipeCost(state, definition))) funded[id] = Math.max(funded[id] || 0, amount);
    const preview = { ...state, run: { ...state.run, status: 'preparing', activeAction: null, resources: funded } };
    const allowed = canStartAction(preview, definition.id);
    if (!allowed.ok) throw new PlanningError(allowed.reason);
  }

  const interrupted = { ...state.run.suspendedActions };
  if (state.run.activeAction?.kind === 'gather') interrupted[state.run.activeAction.id] = state.run.activeAction;
  const copyContext = context => ({ inventory: { ...context.inventory }, steps: context.steps.map(step => ({ ...step })), seconds: context.seconds, resumed: new Set(context.resumed) });

  function append(context, definition, count) {
    if (!Number.isInteger(count) || count < 1 || count > MAX_COUNT) throw new PlanningError('必要な作業が99回を超えます。材料を集めてから再度予約してください。');
    const previous = context.steps.at(-1);
    if (previous?.id === definition.id && previous.count + count <= MAX_COUNT) previous.count += count;
    else context.steps.push({ id: definition.id, count });
    if (context.steps.length > MAX_STEPS) throw new PlanningError('必要な作業が予約上限の8件を超えます。材料を集めてから再度予約してください。');
    const saved = !context.resumed.has(definition.id) && interrupted[definition.id];
    context.seconds += saved ? saved.duration - saved.progress + getActionDuration(state, definition) * (count - 1) : getActionDuration(state, definition) * count;
    context.resumed.add(definition.id);
  }

  function ensureResource(context, id, amount, ancestors) {
    const shortage = amount - (context.inventory[id] || 0);
    if (shortage <= 0) return;
    const producers = [...ACTIONS, ...RECIPES].filter(definition => definition.yields?.[id] > 0);
    if (producers.length === 0) {
      throw new PlanningError(id === 'hide'
        ? `獣皮が${shortage}不足しています。襲撃を撃退して集めてください。`
        : `${resourceName(id)}が${shortage}不足しています。自動で調達できる作業がありません。`);
    }

    let best = null;
    let firstReason = '';
    for (const producer of producers) {
      const candidate = copyContext(context);
      try {
        schedule(candidate, producer, Math.ceil(shortage / producer.yields[id]), ancestors);
        if (!best || candidate.seconds < best.seconds) best = candidate;
      } catch (error) {
        if (!(error instanceof PlanningError)) throw error;
        firstReason ||= error.message;
      }
    }
    if (!best) throw new PlanningError(firstReason || `${resourceName(id)}を調達できません。`);
    Object.assign(context, best);
  }

  function schedule(context, definition, count, ancestors) {
    checkDefinition(definition);
    if (!Number.isInteger(count) || count < 1 || count > MAX_COUNT) throw new PlanningError('必要な作業が99回を超えます。材料を集めてから再度予約してください。');
    if (ancestors.has(definition.id)) throw new PlanningError('材料の調達順序を組み立てられません。');
    const nextAncestors = new Set([...ancestors, definition.id]);
    const paidBatch = !context.resumed.has(definition.id) && interrupted[definition.id]?.kind === 'craft' ? 1 : 0;
    for (const [id, amount] of Object.entries(getRecipeCost(state, definition))) {
      ensureResource(context, id, amount * (count - paidBatch), nextAncestors);
      // Reserve each ingredient before resolving another ingredient that might
      // consume it too, so shared prerequisites are never counted twice.
      context.inventory[id] = (context.inventory[id] || 0) - amount * (count - paidBatch);
    }
    append(context, definition, count);
    for (const [id, amount] of Object.entries(definition.yields || {})) context.inventory[id] = (context.inventory[id] || 0) + amount * count;
  }

  try {
    const context = { inventory: { ...state.run.resources }, steps: [], seconds: 0, resumed: new Set() };
    schedule(context, target, count, new Set());
    const definitions = new Map([...ACTIONS, ...RECIPES].map(definition => [definition.id, definition]));
    const summary = context.steps.map(step => `${definitions.get(step.id).name} ×${step.count}`).join(' → ');
    return { ok: true, reason: '', steps: context.steps, summary, seconds: context.seconds };
  } catch (error) {
    if (!(error instanceof PlanningError)) throw error;
    return failure(error.message);
  }
}

function planAfterPending(state, recipeId, count) {
  const preview = structuredClone(state);
  const definitions = new Map([...ACTIONS, ...RECIPES].map(item => [item.id, item]));
  const pending = [...state.run.queue];
  const active = state.run.activeAction;
  if (active?.kind === 'craft' && !active.queueCredit) pending.unshift({ id: active.id, count: 1 });
  const consumed = new Set();
  for (const entry of pending) {
    const definition = definitions.get(entry.id);
    const paid = !consumed.has(entry.id) && (active?.id === entry.id ? active : state.run.suspendedActions[entry.id]);
    const funded = { ...preview.run.resources };
    for (const [id, amount] of Object.entries(getRecipeCost(preview, definition))) funded[id] = Math.max(funded[id] || 0, amount);
    const allowed = canStartAction({ ...preview, run: { ...preview.run, status: 'preparing', activeAction: null, resources: funded } }, definition.id, true);
    if (!allowed.ok) return failure(`現在の予約：${allowed.reason}`);
    const unpaid = entry.count - (paid?.kind === 'craft' ? 1 : 0);
    for (const [id, amount] of Object.entries(getRecipeCost(preview, definition))) {
      if (preview.run.resources[id] < amount * unpaid) return failure('現在の予約の材料が不足しています。先に予約を整理してください。');
      preview.run.resources[id] -= amount * unpaid;
    }
    if (definition.equipment) {
      if (entry.count > 1) return failure('現在の予約に重複する装備があります。先に予約を整理してください。');
      preview.run.equipment[definition.equipment.slot] = { id: definition.id, ...definition.equipment };
    }
    if (definition.facility) {
      if (entry.count > 1 || preview.run.facilities[definition.facility.id]) return failure('現在の予約に重複する施設があります。先に予約を整理してください。');
      preview.run.facilities[definition.facility.id] = true;
    }
    for (const [id, amount] of Object.entries(definition.yields || {})) preview.run.resources[id] += amount * entry.count;
    delete preview.run.suspendedActions[entry.id];
    consumed.add(entry.id);
  }
  preview.run.queue = [];
  preview.run.activeAction = null;
  preview.run.queueManaged = false;
  const plan = planCraft(preview, recipeId, count);
  if (plan.ok && state.run.queue.length + plan.steps.length > MAX_STEPS) return failure('予約は最大8件です。完了後に追加してください。');
  return plan;
}

/** Commit the complete plan atomically; recipes still pay only when tick starts them. */
export function queueCraft(state, recipeId, count = 1) {
  const plan = planCraft(state, recipeId, count);
  if (!plan.ok) return plan;
  const staged = structuredClone(state);
  for (const step of plan.steps) {
    const result = enqueueAction(staged, step.id, step.count);
    if (!result.ok) return failure(result.reason);
  }
  if (staged.settings.disabledUpgrades.includes('action_queue')) {
    const result = toggleUpgrade(staged, 'action_queue');
    if (!result.ok) return failure(result.reason);
  }
  // enqueueAction and toggleUpgrade are applied to the draft first. No partial
  // queue or toggle becomes visible if any one of those engine checks fails.
  state.run.queue = staged.run.queue;
  state.settings.disabledUpgrades = staged.settings.disabledUpgrades;
  return plan;
}

