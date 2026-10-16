import {queueUnlocked}from './queue-unlock.js?v=0.6.26';
import { trainingCandidates } from './prerequisite-training.js?v=0.6.26';
import { getSkillProgress } from './legacy-engine.js?v=0.6.26';
import { ACTIONS, RECIPES, RESOURCES, canStartAction, getActionDuration, getRecipeCost, enqueueAction, toggleUpgrade } from './legacy-engine.js?v=0.6.26';
import { dependencyOrderedCosts } from './material-priority.js?v=0.6.26';

const MAX_STEPS = 8;
const MAX_COUNT = 99;
const failure = reason => ({ ok: false, reason, steps: [], summary: '' });
const resourceName = id => RESOURCES[id]?.name || id;
class PlanningError extends Error {}
function grantXP(context,skill,count){for(let i=0;i<count;i++){const level=getSkillProgress(context.permanent[skill].xp,true).level;context.skills[skill].xp=Math.min(1e9,Math.round((context.skills[skill].xp+10*(1+(level-1)*.08))*1e6)/1e6);context.permanent[skill].xp=Math.min(1e9,context.permanent[skill].xp+2);}}
function compactGathering(steps){const out=[],first=new Map();for(const step of steps){const d=ACTIONS.find(x=>x.id===step.id);if(d && Object.keys(d.yields || {}).length){const at=first.get(step.id);if(at!==undefined && out[at].count+step.count<=MAX_COUNT){out[at].count+=step.count;continue;}first.set(step.id,out.length);}out.push({...step});}return out;}

/** Build an inventory-aware crafting plan without changing the game state. */
export function planCraft(state, recipeId, count = 1) {
  const target = RECIPES.find(recipe => recipe.id === recipeId);
  if (!target) return failure('その製作は存在しません。');
  if (!Number.isInteger(count) || count < 1 || count > MAX_COUNT) return failure('回数は1〜99の整数で指定してください。');
  if (target.equipment || target.facility) count = 1;
  if (!queueUnlocked(state)) return failure('WAVE 1撃退で行動予約が無料解放されます。');
  if (state.run.status === 'dead') return failure('次の世代で製作を予約してください。');
  if (state.run.queue.length > 0 || state.run.activeAction?.kind === 'craft') return planAfterPending(state, recipeId, count);

  // Validate skill and equipment rules through the engine, ignoring only material
  // shortages and work that will be interrupted after the current raid.
  function checkDefinition(definition, context) {
    const funded = { ...state.run.resources };
    for (const [id, amount] of Object.entries(getRecipeCost(state, definition))) funded[id] = Math.max(funded[id] || 0, amount);
    const preview = { ...state, meta:{...state.meta,skills:context?.permanent || state.meta.skills},run: { ...state.run, skills:context?.skills || state.run.skills, status: 'preparing', activeAction: null, resources: funded } };
    const allowed = canStartAction(preview, definition.id);
    if (!allowed.ok) throw new PlanningError(allowed.reason);
  }

  const interrupted = { ...state.run.suspendedActions };
  if (state.run.activeAction?.kind === 'gather') interrupted[state.run.activeAction.id] = state.run.activeAction;
  const copyContext = context => ({ skills:structuredClone(context.skills),permanent:structuredClone(context.permanent),inventory: { ...context.inventory }, steps: context.steps.map(step => ({ ...step })), seconds: context.seconds, resumed: new Set(context.resumed) });

  function append(context, definition, count) {
    if (!Number.isInteger(count) || count < 1 || count > MAX_COUNT) throw new PlanningError('必要な作業が99回を超えます。材料を集めてから再度予約してください。');
    const previous = context.steps.at(-1);
    if (previous?.id === definition.id && previous.count + count <= MAX_COUNT) previous.count += count;
    else context.steps.push({ id: definition.id, count });
    if(context.steps.length>512)throw new PlanningError("必要な作業が多すぎます。素材と技能を準備してから再開してください。");
    const saved = !context.resumed.has(definition.id) && interrupted[definition.id];
    context.seconds += saved ? saved.duration - saved.progress + getActionDuration(state, definition) * (count - 1) : getActionDuration(state, definition) * count;
    context.resumed.add(definition.id);
    grantXP(context,definition.skill,count);
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
    while(getSkillProgress(context.skills[definition.skill].xp).level<(definition.unlockLevel || 1)){
      const preview={...state,run:{...state.run,resources:context.inventory,skills:context.skills},meta:{...state.meta,skills:context.permanent}};
      const candidate=trainingCandidates(preview,{...definition,cost:{}},{definitions:[...ACTIONS,...RECIPES],levelFor:k=>getSkillProgress(context.skills[k].xp).level,known:()=>true,costFor:d=>getRecipeCost(preview,d),durationFor:d=>getActionDuration(preview,d),visiting:new Set([...ancestors,definition.id])})[0];
      if(!candidate)throw new PlanningError(definition.skill+"の技能を育てる実行可能な作業がありません。");
      const estimate={skills:structuredClone(context.skills),permanent:structuredClone(context.permanent)};let n=0;
      while(getSkillProgress(estimate.skills[definition.skill].xp).level<(definition.unlockLevel || 1)&&n<99){grantXP(estimate,definition.skill,1);n++;}
      if(!n)throw new PlanningError("技能育成を進められません。");
      schedule(context,candidate,n,new Set([...ancestors,definition.id]));
    }
    checkDefinition(definition,context);
    if (!Number.isInteger(count) || count < 1 || count > MAX_COUNT) throw new PlanningError('必要な作業が99回を超えます。材料を集めてから再度予約してください。');
    if (ancestors.has(definition.id)) throw new PlanningError('材料の調達順序を組み立てられません。');
    const nextAncestors = new Set([...ancestors, definition.id]);
    const paidBatch = !context.resumed.has(definition.id) && interrupted[definition.id]?.kind === 'craft' ? 1 : 0;
    const costs=dependencyOrderedCosts(getRecipeCost(state,definition),state.settings.craftMaterialPriority||[],{
      inventory:context.inventory,count:count-paidBatch,visiting:nextAncestors,
      sourceFor:(id,missing,seen)=>[...ACTIONS,...RECIPES].filter(source=>source.yields?.[id]&&!seen.has(source.id)).filter(source=>{try{checkDefinition(source,context);return true;}catch{return false;}}).sort((a,b)=>getActionDuration(state,a)-getActionDuration(state,b))[0],
      costFor:source=>getRecipeCost(state,source),isPaid:source=>!context.resumed.has(source.id)&&interrupted[source.id]?.kind==='craft',
    });
    for (const [id, amount] of costs) {
      ensureResource(context, id, amount * (count - paidBatch), nextAncestors);
      // Reserve each ingredient before resolving another ingredient that might
      // consume it too, so shared prerequisites are never counted twice.
      context.inventory[id] = (context.inventory[id] || 0) - amount * (count - paidBatch);
    }
    append(context, definition, count);
    for (const [id, amount] of Object.entries(definition.yields || {})) context.inventory[id] = (context.inventory[id] || 0) + amount * count;
  }

  try {
    const context = { skills:structuredClone(state.run.skills),permanent:structuredClone(state.meta.skills),inventory: { ...state.run.resources }, steps: [], seconds: 0, resumed: new Set() };
    schedule(context, target, count, new Set());
    if(context.steps.length>MAX_STEPS)context.steps=compactGathering(context.steps);
    if(context.steps.length>MAX_STEPS)throw new PlanningError("技能育成を含む予約が8件を超えます。素材や技能を準備してから再開してください。");
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
    grantXP({skills:preview.run.skills,permanent:preview.meta.skills},definition.skill,entry.count);
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

