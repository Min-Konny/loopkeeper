export const getActionYields = (s,d) => isLegacy(s) ? d.yields || {} : mvp.getActionYields(s,d);
export const getPlayerStrike = s => isLegacy(s) ? {attack:getStats(s).attack,armor:(s.run.enemy || getNextEnemy(s)).defense,damage:Math.max(1,getStats(s).attack-(s.run.enemy || getNextEnemy(s)).defense)} : mvp.getPlayerStrike(s);
export { enqueueConditional } from './mvp-engine.js?v=0.4.3';
import * as legacy from "./legacy-engine.js?v=0.4.3";
import * as mvp from "./mvp-engine.js?v=0.4.3";
import { validateSave } from "./save-validation.js?v=0.4.3";
export { getProductionSources } from "./mvp-engine.js?v=0.4.3";
export { canConfigureWorker } from "./mvp-engine.js?v=0.4.3";
export { getAutoCookingStatus, getProcessingStatus, getTradeQuote, tradeResource } from "./mvp-engine.js?v=0.4.3";
export { getTemplatePreview } from "./mvp-engine.js?v=0.4.3";
export {
  SKILLS,
  getSkillProgress,
  FIRST_RAID_DELAY,
  BASE_RAID_INTERVAL,
  RAID_TIMING_VERSION,
  ACCELERATION,
  RESOURCES,
  ACTIONS,
  FACILITIES,
  RECIPES,
  AUGMENTS,
  LEGACY_UPGRADES,
  DIPLOMACY,
  BUYABLES,
  MILESTONES,
} from "./mvp-engine.js?v=0.4.3";
export const isLegacy = (s) => s.version === 1;
function normalizeSingleReservations(s) {
  if (!s) return null;
  const recipes = (isLegacy(s) ? legacy : mvp).RECIPES;
  const single = id => { const d = recipes.find(r => r.id === id); return d?.equipment || d?.facility; };
  const replacements = new Map();
  function uniqueSingles(entries, recordLinks = false) {
    const seen = new Map();
    return entries.filter(entry => {
      if (!single(entry.id)) return true;
      entry.count = 1;
      if (seen.has(entry.id)) {
        if (recordLinks) replacements.set(entry.goalId, seen.get(entry.id).goalId);
        return false;
      }
      seen.set(entry.id, entry);
      return true;
    });
  }
  s.run.queue = uniqueSingles(s.run.queue, !isLegacy(s));
  for (const t of s.meta.templates || []) t.goals = uniqueSingles(t.goals);
  for (const batch of [s.run.activeAction, ...Object.values(s.run.suspendedActions || {})]) {
    if (batch && replacements.has(batch.goalId)) batch.goalId = replacements.get(batch.goalId);
  }
  return s;
}
export function parseSave(text) {
  if (typeof text !== "string" || text.length > 100000) return null;
  try {
    const raw = JSON.parse(text);
    if (raw.version === 1) return normalizeSingleReservations(legacy.parseSave(text));
    if (!validateSave(raw)) return null;
    raw.run.training ||= {defense:0, vitality:mvp.getVitalityMigrationXp(raw.run.skills.combat.xp)};
    for (const id of Object.keys(mvp.RESOURCES)) raw.run.resources[id] ??= 0;
    raw.settings.pauseWhenHidden ??= false;
    raw.settings.musicVolume ??= raw.settings.soundVolume === 0 ? 0 : .15;
    raw.settings.paused = true;
    raw.run.acceleration.active = false;
    return normalizeSingleReservations(raw);
  } catch {
    return null;
  }
}
export const serializeGame = (s) => JSON.stringify(s);
export const createGame = (...args) => mvp.createGame(...args);
export const isKnown = (...args) =>
  isLegacy(args[0]) && typeof legacy.isKnown === "function"
    ? legacy.isKnown(...args)
    : mvp.isKnown(...args);
export const getUnlocks = (...args) =>
  isLegacy(args[0]) && typeof legacy.getUnlocks === "function"
    ? legacy.getUnlocks(...args)
    : mvp.getUnlocks(...args);
export const getSkillEffects = (...args) =>
  isLegacy(args[0]) && typeof legacy.getSkillEffects === "function"
    ? legacy.getSkillEffects(...args)
    : mvp.getSkillEffects(...args);
export const getSynergies = (...args) =>
  isLegacy(args[0]) && typeof legacy.getSynergies === "function"
    ? legacy.getSynergies(...args)
    : mvp.getSynergies(...args);
export const getStats = (...args) =>
  isLegacy(args[0]) && typeof legacy.getStats === "function"
    ? legacy.getStats(...args)
    : mvp.getStats(...args);
export const getFoodHealing = (...args) =>
  isLegacy(args[0]) && typeof legacy.getFoodHealing === "function"
    ? legacy.getFoodHealing(...args)
    : mvp.getFoodHealing(...args);
export const getRaidInterval = (...args) =>
  isLegacy(args[0]) && typeof legacy.getRaidInterval === "function"
    ? legacy.getRaidInterval(...args)
    : mvp.getRaidInterval(...args);
export const getActionDuration = (...args) =>
  isLegacy(args[0]) && typeof legacy.getActionDuration === "function"
    ? legacy.getActionDuration(...args)
    : mvp.getActionDuration(...args);
export const getRecipeCost = (...args) =>
  isLegacy(args[0]) && typeof legacy.getRecipeCost === "function"
    ? legacy.getRecipeCost(...args)
    : mvp.getRecipeCost(...args);
export const getMilestoneStatus = (...args) =>
  isLegacy(args[0]) && typeof legacy.getMilestoneStatus === "function"
    ? legacy.getMilestoneStatus(...args)
    : mvp.getMilestoneStatus(...args);
export const canStartAction = (...args) =>
  isLegacy(args[0]) && typeof legacy.canStartAction === "function"
    ? legacy.canStartAction(...args)
    : mvp.canStartAction(...args);
export const startAction = (...args) =>
  isLegacy(args[0]) && typeof legacy.startAction === "function"
    ? legacy.startAction(...args)
    : mvp.startAction(...args);
export const stopAction = (...args) =>
  isLegacy(args[0]) && typeof legacy.stopAction === "function"
    ? legacy.stopAction(...args)
    : mvp.stopAction(...args);
export const resolveGoal = (...args) =>
  isLegacy(args[0]) && typeof legacy.resolveGoal === "function"
    ? legacy.resolveGoal(...args)
    : mvp.resolveGoal(...args);
export const enqueueAction = (...args) =>
  isLegacy(args[0]) && typeof legacy.enqueueAction === "function"
    ? legacy.enqueueAction(...args)
    : mvp.enqueueAction(...args);
export const enqueueGoal = (...args) =>
  isLegacy(args[0]) && typeof legacy.enqueueGoal === "function"
    ? legacy.enqueueGoal(...args)
    : mvp.enqueueGoal(...args);
export const editQueuedAction = (...args) =>
  isLegacy(args[0]) && typeof legacy.editQueuedAction === "function"
    ? legacy.editQueuedAction(...args)
    : mvp.editQueuedAction(...args);
export const moveQueuedAction = (...args) =>
  isLegacy(args[0]) && typeof legacy.moveQueuedAction === "function"
    ? legacy.moveQueuedAction(...args)
    : mvp.moveQueuedAction(...args);
export const removeQueuedAction = (...args) =>
  isLegacy(args[0]) && typeof legacy.removeQueuedAction === "function"
    ? legacy.removeQueuedAction(...args)
    : mvp.removeQueuedAction(...args);
export const clearQueue = (...args) =>
  isLegacy(args[0]) && typeof legacy.clearQueue === "function"
    ? legacy.clearQueue(...args)
    : mvp.clearQueue(...args);
export const getQueueStatus = (...args) =>
  isLegacy(args[0]) && typeof legacy.getQueueStatus === "function"
    ? legacy.getQueueStatus(...args)
    : mvp.getQueueStatus(...args);
export const configureWorker = (...args) =>
  isLegacy(args[0]) && typeof legacy.configureWorker === "function"
    ? legacy.configureWorker(...args)
    : mvp.configureWorker(...args);
export const resourceKnown = (...args) =>
  isLegacy(args[0]) && typeof legacy.resourceKnown === "function"
    ? legacy.resourceKnown(...args)
    : mvp.resourceKnown(...args);
export const upgradeWorker = (...args) =>
  isLegacy(args[0]) && typeof legacy.upgradeWorker === "function"
    ? legacy.upgradeWorker(...args)
    : mvp.upgradeWorker(...args);
export const setStockTarget = (...args) =>
  isLegacy(args[0]) && typeof legacy.setStockTarget === "function"
    ? legacy.setStockTarget(...args)
    : mvp.setStockTarget(...args);
export const saveTemplate = (...args) =>
  isLegacy(args[0]) && typeof legacy.saveTemplate === "function"
    ? legacy.saveTemplate(...args)
    : mvp.saveTemplate(...args);
export const loadTemplate = (...args) =>
  isLegacy(args[0]) && typeof legacy.loadTemplate === "function"
    ? legacy.loadTemplate(...args)
    : mvp.loadTemplate(...args);
export const deleteTemplate = (...args) =>
  isLegacy(args[0]) && typeof legacy.deleteTemplate === "function"
    ? legacy.deleteTemplate(...args)
    : mvp.deleteTemplate(...args);
export const getAugmentStatus = (...args) =>
  isLegacy(args[0]) && typeof legacy.getAugmentStatus === "function"
    ? legacy.getAugmentStatus(...args)
    : mvp.getAugmentStatus(...args);
export const chooseAugment = (...args) =>
  isLegacy(args[0]) && typeof legacy.chooseAugment === "function"
    ? legacy.chooseAugment(...args)
    : mvp.chooseAugment(...args);
export const aidCountry = (...args) =>
  isLegacy(args[0]) && typeof legacy.aidCountry === "function"
    ? legacy.aidCountry(...args)
    : mvp.aidCountry(...args);
export const refuseCountry = (...args) =>
  isLegacy(args[0]) && typeof legacy.refuseCountry === "function"
    ? legacy.refuseCountry(...args)
    : mvp.refuseCountry(...args);
export const getSupplyCost = (...args) =>
  isLegacy(args[0]) && typeof legacy.getSupplyCost === "function"
    ? legacy.getSupplyCost(...args)
    : mvp.getSupplyCost(...args);
export const buySupply = (...args) =>
  isLegacy(args[0]) && typeof legacy.buySupply === "function"
    ? legacy.buySupply(...args)
    : mvp.buySupply(...args);
export const canPurchaseUpgrade = (...args) =>
  isLegacy(args[0]) && typeof legacy.canPurchaseUpgrade === "function"
    ? legacy.canPurchaseUpgrade(...args)
    : mvp.canPurchaseUpgrade(...args);
export const purchaseUpgrade = (...args) =>
  isLegacy(args[0]) && typeof legacy.purchaseUpgrade === "function"
    ? legacy.purchaseUpgrade(...args)
    : mvp.purchaseUpgrade(...args);
export const refundUpgrade = (...args) =>
  isLegacy(args[0]) && typeof legacy.refundUpgrade === "function"
    ? legacy.refundUpgrade(...args)
    : mvp.refundUpgrade(...args);
export const toggleUpgrade = (...args) =>
  isLegacy(args[0]) && typeof legacy.toggleUpgrade === "function"
    ? legacy.toggleUpgrade(...args)
    : mvp.toggleUpgrade(...args);
export function abandonRun(s) {
  if (!isLegacy(s)) return mvp.abandonRun(s);
  if (!["preparing", "combat"].includes(s.run.status)) return {ok:false,reason:"進行中の周回だけ切り上げられます。"};
  const next = mvp.migrateLegacy(s);
  next.meta.history.unshift({generation:s.meta.generation,wave:s.run.wave,elapsed:s.run.elapsed});
  next.meta.history = next.meta.history.slice(0,20);
  next.settings.paused = true;
  Object.keys(s).forEach(k=>delete s[k]);Object.assign(s,next);
  return {ok:true,reason:""};
}
export function restartRun(s) {
  if (isLegacy(s)) {
    const next = mvp.migrateLegacy(s);
    Object.keys(s).forEach((k) => delete s[k]);
    Object.assign(s, next);
    return { ok: true, reason: "" };
  }
  return mvp.restartRun(s);
}
export const confirmRun = (...args) =>
  isLegacy(args[0]) && typeof legacy.confirmRun === "function"
    ? legacy.confirmRun(...args)
    : mvp.confirmRun(...args);
export const getAccelerationStatus = (...args) =>
  isLegacy(args[0]) && typeof legacy.getAccelerationStatus === "function"
    ? legacy.getAccelerationStatus(...args)
    : mvp.getAccelerationStatus(...args);
export const startAcceleration = (...args) =>
  isLegacy(args[0]) && typeof legacy.startAcceleration === "function"
    ? legacy.startAcceleration(...args)
    : mvp.startAcceleration(...args);
export const stopAcceleration = (...args) =>
  isLegacy(args[0]) && typeof legacy.stopAcceleration === "function"
    ? legacy.stopAcceleration(...args)
    : mvp.stopAcceleration(...args);
export const getNextEnemy = (...args) =>
  isLegacy(args[0]) && typeof legacy.getNextEnemy === "function"
    ? legacy.getNextEnemy(...args)
    : mvp.getNextEnemy(...args);
export const tick = (...args) =>
  isLegacy(args[0]) && typeof legacy.tick === "function"
    ? legacy.tick(...args)
    : mvp.tick(...args);
export const advanceTime = (...args) =>
  isLegacy(args[0]) && typeof legacy.advanceTime === "function"
    ? legacy.advanceTime(...args)
    : mvp.advanceTime(...args);
export const migrateLegacy = (...args) =>
  isLegacy(args[0]) && typeof legacy.migrateLegacy === "function"
    ? legacy.migrateLegacy(...args)
    : mvp.migrateLegacy(...args);

export const getCatalog = (s) => (isLegacy(s) ? legacy : mvp);
export function getCombatPreview(s) {
  const e = s.run.enemy || getNextEnemy(s),
    stats = getStats(s);
  const nextRound = (e.round || 0) + 1;
  const multipliers =
    e.trait === "combo"
      ? [0.75, 0.75]
      : [e.trait === "heavy" && nextRound % 4 === 0 ? 1.6 : 1];
  const first =
    nextRound === 1 && s.run.augments.selected.includes("wall_readiness")
      ? 0.6
      : 1;
  const hits = multipliers.map((m) =>
    Math.max(1, (e.attack * m * (e.pressure === "rally" ? 1 + Math.min(.3, Math.floor((nextRound - 1) / 4) * .05) : 1) - stats.defense * (e.pressure === "sunder" && nextRound % 4 === 0 ? .6 : 1)) * first),
  );
  return {
    hits,
    packet: hits.reduce((a, b) => a + b, 0),
    support: (stats.support || 0) * (e.trait === "flying" ? .5 : 1) + (stats.ranged || 0)*(e.trait==="flying"?2.5:1),
    charges: e.charges || 0,
    trait: (e.pressure === "rally" ? "戦意高揚 · " : e.pressure === "sunder" ? "崩し · " : "") + ({ combo: "連撃", heavy: "強打", armor: "装甲", flying: "飛行" }[e.trait] || "通常"),
  };
}

export const getAugmentRerollStatus = s => isLegacy(s) ? {limit:0,remaining:0,canReroll:false,reason:'次の世代から利用できます。'} : mvp.getAugmentRerollStatus(s);
export const rerollAugments = s => isLegacy(s) ? {ok:false,reason:'次の世代から利用できます。'} : mvp.rerollAugments(s);
