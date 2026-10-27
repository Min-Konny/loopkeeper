import {getPlanningYields,getRequiredProductionBatches}from './engine.js?v=0.6.85';
import {enqueueTrainingLevel}from './engine.js?v=0.6.85';
import {trophyShortage} from './boss-materials.js?v=0.6.85';
import {hasUpgrade}from './free-features.js?v=0.6.85';
import { trainingCandidates } from './prerequisite-training.js?v=0.6.85';
import { getActionXp } from './engine.js?v=0.6.85';
import * as old from "./legacy-planner.js?v=0.6.85";
import { orderRecipeMaterials } from './engine.js?v=0.6.85';
import {
  isLegacy,
  getCatalog,
  ACTIONS,
  RECIPES,
  RESOURCES,
  isKnown,
  getActionDuration,
  getRecipeCost,
  getSkillProgress,
  enqueueAction,
  moveQueuedAction,
  removeQueuedAction,
  resolveGoal,
  canStartAction,
  startAction,
  stopAction,
  getProductionSources,
} from "./engine.js?v=0.6.85";
const fail = (reason) => ({ ok: false, reason, steps: [], summary: "" });
export function planCraft(s, id, count = 1) {
  if (!Number.isInteger(count) || count < 1 || count > 99) return fail("回数は1〜99の整数で指定してください。");
  if (isLegacy(s)) return old.planCraft(s, id, count);
  if (!hasUpgrade(s,"action_queue"))
    return fail("行動予約を解放してください。");
  const d = RECIPES.find((x) => x.id === id);
  if (!d || !isKnown(s, d)) return fail("未発見の製作です。");
  if (s.run.status !== "preparing") return fail("準備中に予約してください。");
  if(d.equipment&&s.run.ownedEquipment?.includes(id)&&s.run.activeAction?.id!==id&&!s.run.suspendedActions[id])return fail("所持済みです。状態・装備で切り替えられます。");
  if(d.expedition){
    if(!s.meta.routeClears?.includes(d.expedition))return fail('一度突破した拠点のみ再開拓を予約できます。');
    const foundation='outpost_'+d.expedition;
    const plan=s.run.facilities[foundation]?{ok:true,steps:[],seconds:0,summary:''}:planCraft(s,foundation,1);
    return plan.ok?{...plan,summary:(plan.summary?plan.summary+' → ':'')+'守護敵（最大30秒・襲撃が近い時は保留）',seconds:plan.seconds+30}:plan;
  }
  const shadow=structuredClone(s);
  const inventory = { ...s.run.resources },
    steps = [];
  const equipment = { ...s.run.equipment };
  shadow.run.resources=inventory;shadow.run.equipment=equipment;
  let trainingBatches=0;
  let seconds = 0;
  const paid = new Set();
  function append(x, n) {
    const saved =
      !paid.has(x.id) &&
      (s.run.activeAction?.id === x.id
        ? s.run.activeAction
        : s.run.suspendedActions[x.id]);
    seconds +=
      (saved ? saved.duration - saved.progress : getActionDuration(s, x)) +
      getActionDuration(s, x) * (n - 1);
    const xp=getActionXp(shadow,x.id);
    const gain=saved?{runXp:saved.runXp,permanentXp:saved.permanentXp}:xp;
    shadow.run.skills[x.skill].xp=Math.min(1e9,shadow.run.skills[x.skill].xp+gain.runXp+xp.runXp*(n-1));
    shadow.meta.skills[x.skill].xp=Math.min(1e9,shadow.meta.skills[x.skill].xp+gain.permanentXp+xp.permanentXp*(n-1));
    paid.add(x.id);
    while (n) {
      const count = Math.min(99, n);
      steps.push({ id: x.id, count });
      n -= count;
    }
  }
  const output=(x,saved=null)=>getPlanningYields(shadow,x,saved);
  function batchesFor(x,resource,short){
    const saved=!paid.has(x.id)&&(s.run.activeAction?.id===x.id?s.run.activeAction:s.run.suspendedActions[x.id]);
    return getRequiredProductionBatches(shadow,x,resource,short,saved);
  }
  function craft(x, n, seen = new Set()) {
    if (seen.has(x.id)) throw Error("材料の循環。");
    if (!isKnown(s, x)) throw Error("未発見です。");
    const next = new Set([...seen, x.id]);
    if (x.endlessFacility && (s.run.facilities[x.endlessFacility] || 0) < 5) craft(RECIPES.find(r => r.id === `${x.endlessFacility}_level_5`), 1, next);
    if (x.facility) {
      if ((s.run.facilities[x.facility.id] || 0) >= x.level) return;
      if ((s.run.facilities[x.facility.id] || 0) < x.level - 1)
        craft(
          RECIPES.find((r) => r.id === x.requires[0]),
          1,
          next,
        );
    }
    const saved =
      !paid.has(x.id) &&
      (s.run.activeAction?.id === x.id
        ? s.run.activeAction
        : s.run.suspendedActions[x.id]);
    if(!saved&&x.equipment&&s.run.ownedEquipment?.includes(x.id)){equipment[x.slot]={id:x.id,...x.equipment};return;}
    if(!saved){const reason=trophyShortage(s,x.id);if(reason)throw Error(reason);}
    if (x.previousEquipmentId && !saved) {
      if ((equipment[x.slot]?.tier || 0) >= x.tier) return;
      if ((equipment[x.slot]?.tier || 0) < x.tier - 1) craft(RECIPES.find(r => r.id === x.previousEquipmentId), 1, next);
    }
    while(getSkillProgress(shadow.run.skills[x.skill].xp).level<x.unlockLevel){
      if(++trainingBatches>512)throw Error("必要な技能育成が長すぎます。技能を育ててから再開してください。");
      const candidate=trainingCandidates(shadow,x,{definitions:[...ACTIONS,...RECIPES],levelFor:k=>getSkillProgress(shadow.run.skills[k].xp).level,known:d=>isKnown(shadow,d),costFor:d=>getRecipeCost(shadow,d),durationFor:d=>getActionDuration(shadow,d),visiting:next})[0];
      if(!candidate)throw Error(x.skill+" Lv."+x.unlockLevel+"が必要です。実行可能な採集・製作で育ててください。");
      const before=shadow.run.skills[x.skill].xp;craft(candidate,1,next);if(shadow.run.skills[x.skill].xp<=before)throw Error("技能育成を進められません。");
    }
    for (const [r, cost] of orderRecipeMaterials(s,x,inventory,n-(saved?.kind==='craft'?1:0),paid,next)) {
      const needed = cost * (n - (saved?.kind === "craft" ? 1 : 0)),
        short = needed - (inventory[r] || 0);
      if (short > 0) {
        const sources = getProductionSources(
          s,
          r,
          short,
          inventory,
          next,
          paid,
        );
        const p = sources[0] || [...ACTIONS,...RECIPES].filter(source=>source.yields?.[r] && isKnown(shadow,source) && !next.has(source.id)).sort((a,b)=>(a.unlockLevel || 1)-(b.unlockLevel || 1))[0];
        if (!p)
          throw Error(
            RESOURCES[r].name +
              "不足。" +
              (r === "hide"
                ? "撃退または市場で入手。"
                : r === "gold"
                  ? "市場で木材を納入。"
                  : "技能を上げてください。"),
          );
        craft(p, batchesFor(p,r,short), next);
      }
      inventory[r] = (inventory[r] || 0) - needed;
    }
    append(x, n);
    if (x.equipment) equipment[x.slot] = { id:x.id, ...x.equipment };
    const fresh=output(x),first=saved?output(x,saved):fresh;
    for (const r of Object.keys(fresh))inventory[r]=(inventory[r]||0)+(first[r]||0)+fresh[r]*(n-1);
  }
  try {
    craft(d, d.equipment || d.facility || d.endlessFacility || d.accessory || d.expedition ? 1 : count);
    return {
      ok: true,
      reason: "",
      steps,
      seconds,
      summary: steps
        .map(
          (x) =>
            [...ACTIONS, ...RECIPES].find((d) => d.id === x.id).name +
            " ×" +
            x.count,
        )
        .join(" → "),
    };
  } catch (e) {
    return { ...fail(e.message), known: true };
  }
}
// Move the whole newly added plan, preserving the order of legacy material steps.
export function prioritizeAddedReservations(s, previousLength) {
  const paidGoalId = !isLegacy(s) && s.run.activeAction?.kind === "craft" ? s.run.activeAction.goalId : undefined;
  const added = s.run.queue.length - previousLength;
  for (let offset = 0; offset < added; offset++) {
    for (let index = previousLength + offset; index > offset; index--)
      moveQueuedAction(s, index, -1);
  }
  if (paidGoalId !== undefined) s.run.activeAction.goalId = paidGoalId;
}
export function queueAction(s, id, count, position = "end") {
  const d = getCatalog(s).RECIPES.find(r => r.id === id);
  const existing = (d?.equipment || d?.facility || d?.expedition) ? s.run.queue.findIndex(q => q.id === id) : -1;
  if (position === "front" && existing >= 0) {
    if (!hasUpgrade(s,"action_queue") || s.run.status !== "preparing") return fail("準備中に予約してください。");
    const paidGoalId = !isLegacy(s) && s.run.activeAction?.kind === "craft" ? s.run.activeAction.goalId : undefined;
    for (let index = existing; index > 0; index--) moveQueuedAction(s, index, -1);
    if (paidGoalId !== undefined) s.run.activeAction.goalId = paidGoalId;
    return {ok:true,reason:"",moved:true};
  }
  const previousLength = s.run.queue.length;
  const result = enqueueAction(s, id, count);
  if (result.ok && position === "front") prioritizeAddedReservations(s, previousLength);
  return result;
}
export function queueCraft(s, id, position = "end", count = 1) {
  const previousLength = s.run.queue.length;
  if (isLegacy(s)) {
    const result = old.queueCraft(s, id, count);
    if (result.ok && position === "front") prioritizeAddedReservations(s, previousLength);
    return result;
  }
  const d = RECIPES.find((x) => x.id === id);
  if (!d || !isKnown(s, d)) return fail("未発見です。");
  if(d.equipment&&s.run.ownedEquipment?.includes(id)&&s.run.activeAction?.id!==id&&!s.run.suspendedActions[id])return fail("所持済みです。状態・装備で切り替えられます。");
  const previousDisabled = s.settings.disabledUpgrades;
  s.settings.disabledUpgrades = s.settings.disabledUpgrades.filter(
    (x) => x !== "action_queue",
  );
  const result = queueAction(s, id, d.equipment || d.facility || d.endlessFacility || d.accessory || d.expedition ? 1 : count, position);
  if (!result.ok) {
    s.settings.disabledUpgrades = previousDisabled;
    return fail(result.reason);
  }
  return { ok: true, reason: "", moved: result.moved, steps: [{ id, count: d.equipment || d.facility || d.endlessFacility || d.accessory || d.expedition ? 1 : count }] };
}


// Explicitly selecting work takes it back from a blocked reservation, even when
// the same manual batch is still selected. Suspending preserves paid materials.
export function selectManualAction(s, id) {
  if (s.run.status !== "preparing") return startAction(s, id);
  if (s.run.activeAction?.id === id && s.run.queue.length && !s.settings.disabledUpgrades.includes("action_queue")) {
    const stopped = stopAction(s);
    if (!stopped.ok) return stopped;
  }
  if(s.run.activeAction?.id===id){delete s.run.manualRepeat;return {ok:true,reason:""};}
  return startAction(s,id);
}


export function queueWork(s, id, count = 1, position = "end") {
  if (!getCatalog(s).ACTIONS.some(action => action.id === id)) return fail("その作業は存在しません。");
  const previousDisabled = s.settings.disabledUpgrades;
  s.settings.disabledUpgrades = previousDisabled.filter(x => x !== "action_queue");
  const result = queueAction(s, id, count, position);
  if (!result.ok) s.settings.disabledUpgrades = previousDisabled;
  return result;
}

// One shared check for warnings and recovery; already-paid crafts must finish.
export function blockedReservation(s) {
  const first = s.run.queue[0];
  if (isLegacy(s) || !hasUpgrade(s,"action_queue") || s.run.status !== 'preparing' || !first || s.run.activeAction?.kind === 'craft' || s.run.queueManaged && s.run.activeAction || s.settings.disabledUpgrades.includes('action_queue')) return null;
  const owned=getCatalog(s).RECIPES.find(d=>d.id===first.id)?.equipment&&s.run.ownedEquipment?.includes(first.id);
  const check = first.kind === 'goal'||owned ? resolveGoal(s, first.id) : canStartAction(s, first.id, true);
  return check.ok ? null : check;
}

export function recoverReservation(s, operation) {
  if (!blockedReservation(s)) return fail('停止している予約はありません。');
  if (operation === 'remove') return removeQueuedAction(s, 0);
  if (operation !== 'defer' || s.run.queue.length < 2) return fail('後ろに回せる予約がありません。');
  for (let index = 0; index < s.run.queue.length - 1; index++) {
    const result = moveQueuedAction(s, index, 1);
    if (!result.ok) return result;
  }
  return { ok: true, reason: '' };
}

// New training goals use the existing condition schema; old count reservations stay intact.
export function queueTraining(s,id,target,position='end'){
 const disabled=s.settings.disabledUpgrades,previousLength=s.run.queue.length;s.settings.disabledUpgrades=disabled.filter(x=>x!=='action_queue');
 const result=enqueueTrainingLevel(s,id,target);
 if(!result.ok||result.skipped)s.settings.disabledUpgrades=disabled;
 if(result.ok&&!result.skipped&&position==='front')prioritizeAddedReservations(s,previousLength);
 return result;
}
