import { CONTENT as C } from "./content.js?v=0.2.16";
const object = (x) => x !== null && typeof x === "object" && !Array.isArray(x);
const number = (x, min = 0, max = 1e9) =>
  Number.isFinite(x) && x >= min && x <= max;
const integer = (x, min = 0, max = 1e9) =>
  number(x, min, max) && Number.isInteger(x);
const unique = (xs) => Array.isArray(xs) && new Set(xs).size === xs.length;
const defs = new Map(
  [...C.actions, ...C.equipment, ...C.processing, ...C.facilities].map((x) => [
    x.id,
    x,
  ]),
);
const skillIds = ["logging", "mining", "foraging", "smithing", "combat"];
const upgradeIds = new Set(C.legacy.map((x) => x.id));
const validSkills = (x) =>
  object(x) && skillIds.every((id) => object(x[id]) && number(x[id].xp));
const validList = (x, set, max = 100) =>
  unique(x) && x.length <= max && x.every((id) => set.has(id));
const validGoal = (x) =>
  object(x) &&
  defs.has(x.id) &&
  integer(x.count, 1, 99) &&
  ["goal", "action"].includes(x.kind);
function validBatch(x) {
  return (
    object(x) &&
    defs.has(x.id) &&
    integer(x.instanceId, 1) &&
    ["main", "auto_cook", "processing_worker"].includes(x.channel) &&
    ["craft", "gather"].includes(x.kind) &&
    number(x.duration, 0.25, 1e6) &&
    number(x.progress, 0, x.duration + 0.1) &&
    number(x.runXp) &&
    number(x.permanentXp)
  );
}
function ledger(x, total) {
  return (
    object(x) &&
    validList(x.upgrades, upgradeIds, 19) &&
    object(x.paidCosts) &&
    integer(x.points) &&
    Object.keys(x.paidCosts).length === x.upgrades.length &&
    x.upgrades.every(
      (id) =>
        integer(x.paidCosts[id], 1, 100) &&
        C.legacy
          .find((u) => u.id === id)
          .unlock.requires?.every((p) => x.upgrades.includes(p)) !== false,
    ) &&
    x.points + x.upgrades.reduce((n, id) => n + x.paidCosts[id], 0) === total
  );
}
export function validateSave(s) {
  try {
    if (
      !object(s) ||
      s.version !== 2 ||
      s.schemaVersion !== 2 ||
      !["A1", "A2"].includes(s.contentVersion) ||
      !object(s.meta) ||
      !object(s.run) ||
      !object(s.settings)
    )
      return false;
    const { meta: m, run: r, settings: t } = s;
    if (
      !integer(m.generation, 1) ||
      !integer(m.bestWave) ||
      !integer(m.totalPoints) ||
      !integer(m.clears) ||
      !ledger(m, m.totalPoints) ||
      !validSkills(m.skills)
    )
      return false;
    if (
      !validList(
        m.completedMilestones,
        new Set(C.quests.map((q) => q.id)),
        15,
      ) ||
      !unique(m.defeatedBosses) ||
      m.defeatedBosses.some(
        (id) =>
          !C.encounters.some((e) => e.boss && e.id === id) &&
          !/^legacy_boss_wave_\d+$/.test(id),
      )
    )
      return false;
    if (
      !Array.isArray(m.templates) ||
      m.templates.length > 8 ||
      m.templates.some(
        (x) =>
          !object(x) ||
          typeof x.name !== "string" ||
          x.name.length > 40 ||
          !Array.isArray(x.goals) ||
          x.goals.length > 8 ||
          !x.goals.every(validGoal),
      )
    )
      return false;
    if (
      !Array.isArray(m.history) ||
      m.history.length > 20 ||
      m.history.some(
        (x) =>
          !object(x) ||
          !integer(x.generation, 1) ||
          !integer(x.wave) ||
          !number(x.elapsed) ||
          (x.skillGains !== undefined &&
            (!object(x.skillGains) ||
              !skillIds.every((id) => number(x.skillGains[id])))),
      ) ||
      !validSkills(r.skills) ||
      !object(r.resources) ||
      !C.resources.every((x) => number(r.resources[x.id]))
    )
      return false;
    if (
      !["preparing", "combat", "dead", "cleared", "legacy_setup"].includes(
        r.status,
      ) ||
      !integer(r.wave, 0, 21) ||
      !number(r.elapsed) ||
      !number(r.nextWaveAt) ||
      !number(r.hp) ||
      !number(r.combatTimer, 0, 1.6) ||
      !number(r.simRemainder, 0, 60)
    )
      return false;
    if (r.status === "legacy_setup" && !ledger(r.legacyDraft, m.totalPoints))
      return false;
    if (r.status === "cleared" && r.wave !== 21) return false;
    if (
      r.deathReport !== null &&
      (!object(r.deathReport) ||
        typeof r.deathReport.enemy !== "string" ||
        r.deathReport.enemy.length > 200 ||
        !integer(r.deathReport.wave, 1) ||
        !number(r.deathReport.beforeHit) ||
        !number(r.deathReport.damage) ||
        !number(r.deathReport.food))
    )
      return false;
    if (
      !object(r.equipment) ||
      Object.entries(r.equipment).some(([slot, e]) => {
        const d = defs.get(e.id);
        return (
          !d ||
          d.slot !== slot ||
          ["attack", "defense", "maxHp", "speed"].some(
            (k) => (e[k] || 0) !== (d.stats[k] || 0),
          )
        );
      })
    )
      return false;
    if (
      !object(r.facilities) ||
      Object.entries(r.facilities).some(
        ([id, n]) =>
          !C.facilities.some((f) => f.facilityId === id) || !integer(n, 1, 3),
      )
    )
      return false;
    if (
      !Array.isArray(r.queue) ||
      r.queue.length > 8 ||
      r.queue.some((x) => !validGoal(x) || !integer(x.goalId, 1)) ||
      !integer(r.queueSeq) ||
      !integer(r.workSeq)
    )
      return false;
    if (r.activeAction && !validBatch(r.activeAction)) return false;
    if (
      !object(r.suspendedActions) ||
      Object.entries(r.suspendedActions).some(
        ([id, x]) => id !== x.id || !validBatch(x),
      )
    )
      return false;
    if (
      r.autoCraft &&
      (!validBatch(r.autoCraft) ||
        r.autoCraft.channel !== "auto_cook" ||
        r.autoCraft.id !== "cook_meal")
    )
      return false;
    if (
      !object(r.workers) ||
      C.workers.some((w) => {
        const rw = r.workers[w.id];
        return (
          !object(rw) ||
          !integer(rw.level, 0, 2) ||
          ![...(w.resourceChoices || []), ...(w.recipeChoices || [])].includes(
            rw.target,
          ) ||
          (rw.batch &&
            (w.recipeChoices
              ? !validBatch(rw.batch) ||
                rw.batch.channel !== w.id ||
                !w.recipeChoices.includes(rw.batch.id)
              : !w.resourceChoices.includes(rw.batch.target) ||
                !number(rw.batch.duration, 0.25, 100) ||
                !number(rw.batch.progress, 0, rw.batch.duration + 0.1) ||
                !integer(rw.batch.quantity, 1, 3)))
        );
      })
    )
      return false;
    const mainBatches = [
      r.activeAction,
      ...Object.values(r.suspendedActions),
    ].filter(Boolean);
    const batches = [
      ...mainBatches,
      r.autoCraft,
      r.workers.processing_worker.batch,
    ].filter(Boolean);
    if (
      mainBatches.some((x) => x.channel !== "main") ||
      !unique(batches.map((x) => x.instanceId)) ||
      batches.some((x) => x.instanceId > r.workSeq) ||
      !unique(mainBatches.map((x) => x.id))
    )
      return false;
    if (
      !unique(r.queue.map((x) => x.goalId)) ||
      r.queue.some((x) => x.goalId > r.queueSeq)
    )
      return false;
    const a = r.augments;
    if (
      !object(a) ||
      !integer(a.seed, 0, 4294967295) ||
      !validList(a.selected, new Set(C.augments.map((a) => a.id)), 4) ||
      !validList(a.offer, new Set(C.augments.map((a) => a.id)), 3) ||
      a.offer.some((id) => a.selected.includes(id)) ||
      !unique(a.offeredStages) ||
      a.offeredStages.some((x) => !["start", 3, 9, 15].includes(x)) ||
      !number(a.investmentTimer, 0, 15)
    )
      return false;
    if (
      !object(r.acceleration) ||
      typeof r.acceleration.active !== "boolean" ||
      !number(r.acceleration.remainingSeconds, 0, 1e6) ||
      !integer(r.acceleration.limitWave) ||
      !number(r.runAttack) ||
      !integer(r.reinvestment, 0, 1) ||
      !number(r.healTimer, 0, 4.1)
    )
      return false;
    if (r.status === "combat") {
      const e = r.enemy,
        d = C.encounters[r.wave];
      if (
        !object(e) ||
        !d ||
        e.id !== d.id ||
        e.wave !== r.wave + 1 ||
        !number(e.hp, 0, e.maxHp) ||
        !number(e.maxHp, 1) ||
        !number(e.attack) ||
        !number(e.defense) ||
        !integer(e.round) ||
        !number(e.xpBudget) ||
        !number(e.xpAwarded, 0, e.xpBudget) ||
        !integer(e.charges, 0, 3)
      )
        return false;
    } else if (r.enemy !== null) return false;
    if (
      !object(r.countries) ||
      C.diplomacy.some((c) => {
        const x = r.countries[c.id];
        return (
          !object(x) ||
          !["locked", "pending", "allied", "hostile", "defeated"].includes(
            x.status,
          ) ||
          !number(x.deadline) ||
          !number(x.incomeTimer) ||
          !number(x.incomeTotal)
        );
      }) ||
      !validList(r.hostileQueue, new Set(C.diplomacy.map((c) => c.id)), 2) ||
      !object(r.diplomacy)
    )
      return false;
    if (
      !Array.isArray(r.log) ||
      r.log.length > 40 ||
      r.log.some(
        (x) =>
          !integer(x.id) ||
          !number(x.time) ||
          typeof x.text !== "string" ||
          x.text.length > 1000,
      ) ||
      !integer(r.logSeq) ||
      !object(r.startPermanentXp) ||
      !skillIds.every((id) => number(r.startPermanentXp[id]))
    )
      return false;
    if (
      typeof t.paused !== "boolean" ||
      t.speed !== 1 ||
      !validList(t.disabledUpgrades, upgradeIds, 19) ||
      !validList(
        t.hiddenRecipes,
        new Set(C.equipment.concat(C.facilities).map((x) => x.id)),
        47,
      ) ||
      !number(t.soundVolume, 0, 1) ||
      typeof t.effectsEnabled !== "boolean" ||
      typeof t.showHiddenRecipes !== "boolean" ||
      !integer(t.foodTarget, 0, 9999) ||
      !integer(t.processingTarget, 0, 9999) ||
      !Array.isArray(t.stockTargets) ||
      t.stockTargets.length > 17 ||
      t.stockTargets.some(
        (x) =>
          !C.resources.some((y) => y.id === x.id) || !integer(x.count, 1, 9999),
      ) ||
      !object(t.workerTargets)
    )
      return false;
    return true;
  } catch {
    return false;
  }
}
