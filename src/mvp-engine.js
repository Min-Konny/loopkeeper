import { CONTENT as C } from "./content.js?v=0.2.5";
import { A1_ENCOUNTERS } from "./content-a1-encounters.js?v=0.2.5";
import {
  SKILLS,
  getSkillProgress,
  LEGACY_UPGRADES as OLD_UPGRADES,
} from "./legacy-engine.js?v=0.2.5";
export { SKILLS, getSkillProgress };
export const FIRST_RAID_DELAY = 180,
  BASE_RAID_INTERVAL = 180,
  RAID_TIMING_VERSION = 3;
export const ACCELERATION = {
  duration: 120,
  multiplier: 5,
  bestWave: 9,
  automationCount: 3,
  generation: 2,
};
export const RESOURCES = Object.fromEntries(
  C.resources.map((r) => [r.id, { name: r.name }]),
);
const statText = (s) =>
  Object.entries(s)
    .map(
      ([k, v]) =>
        `${{ attack: "攻撃", defense: "防御", maxHp: "最大HP", speed: "速度" }[k]} +${k === "speed" ? Math.round(v * 100) + "%" : v}`,
    )
    .join(" / ");
export const ACTIONS = C.actions.map((a) => ({
  ...a,
  description:
    a.id === "train_combat"
      ? "攻撃力と最大HPを鍛える。"
      : Object.entries(a.yields)
          .map(([r, n]) => `${RESOURCES[r].name} +${n}`)
          .join(" / "),
}));
export const FACILITIES = Object.fromEntries(
  C.facilities
    .filter((f) => f.level === 1)
    .map((f) => [
      f.facilityId,
      { name: f.name, description: "村の備えを強化する。" },
    ]),
);
const effectText = (f) =>
  ({
    watchtower: `襲撃猶予 +${f.effect.raidDelay}秒`,
    barricade: `防御 +${f.effect.defense}`,
    infirmary: `準備中に回復 / 戦闘処置 ${f.effect.treatmentCharges}回`,
    workshop: `製作速度 +${Math.round(f.effect.craftSpeed * 100)}%`,
    market: `木材10 → 金貨${f.effect.woodSaleAmount}`,
    guardhouse: `支援攻撃 ${f.effect.supportAttack}`,
  })[f.facilityId];
export const RECIPES = [
  ...C.equipment.map((e) => ({
    ...e,
    equipment: { slot: e.slot, name: e.name, tier: e.tier, ...e.stats },
    description: statText(e.stats),
  })),
  ...C.processing.map((p) => ({
    ...p,
    description: Object.entries(p.yields)
      .map(([r, n]) => `${RESOURCES[r].name} +${n}`)
      .join(" / "),
  })),
  ...C.facilities.map((f) => ({
    ...f,
    name: f.name + [" I", " II", " III"][f.level - 1],
    facility: { id: f.facilityId, level: f.level, name: f.name },
    description: effectText(f),
  })),
];
const augmentDescriptions = {
  forestry: "伐採・採掘時間 −20%",
  builder: "施設素材 −25%",
  warrior: "攻撃 +18%",
  drill: "訓練時間 −30%",
  provisions: "食料回復 +30%",
  guard: "防御 +15%",
  timber_contract: "自分が伐った木材1につき金貨0.15",
  investment: "施設段階1につき15秒ごと金貨0.5",
  bounty: "撃退金貨 +75%",
  momentum: "撃退ごと攻撃+0.7、勝利時HP6%回復",
  joint_procurement: "資材購入 −15%",
  artisan_guild: "人員作業時間 −25%",
  spoils_reinvestment: "撃退後の次の装備素材 −25%",
  field_training: "訓練と戦闘経験 +25%",
  wall_readiness: "最初の敵攻撃の被害 −40%",
  healing_patrol: "救護所の回復 +30%",
};
export const AUGMENTS = C.augments.map((a) => ({
  ...a,
  description: augmentDescriptions[a.id],
}));
export const LEGACY_UPGRADES = C.legacy.map((u) => ({
  ...u,
  name:
    u.name ||
    OLD_UPGRADES.find((x) => x.id === u.id)?.name ||
    {
      foraging_worker: "採集師",
      processing_worker: "加工職人",
      queue_templates: "手順テンプレート",
      stock_targets: "在庫目標",
      fortress_augments: "要塞オーグメント",
      acceleration_extension: "復帰時間延長",
      inherited_blade_2: "剣技の継承 II",
      inherited_guard_2: "守備の継承 II",
      inherited_vitality_2: "生命力の継承 II",
    }[u.id] ||
    u.id,
  kind:
    u.kind ||
    (u.id.includes("worker")
      ? "worker"
      : u.id.includes("inherited")
        ? "combat"
        : u.id.includes("acceleration")
          ? "time"
          : u.id.includes("augments")
            ? "augment_pack"
            : "automation"),
  description: u.description || "周回の備えを拡張。",
}));
export const DIPLOMACY = {
  country: C.diplomacy[0].name,
  foodCost: 8,
  deadline: 150,
  incomeInterval: 15,
  incomeAmount: 1,
};
export const BUYABLES = C.market.map((m) => ({
  ...m,
  cost: m.gold || 0,
  name:
    m.id === "sell_wood"
      ? "木材を納入"
      : m.id === "mercenary"
        ? "傭兵を雇う"
        : `${RESOURCES[m.resource]?.name || m.id}を購入`,
  description: m.attack
    ? `攻撃 +${m.attack}`
    : `${RESOURCES[m.resource]?.name} ${m.quantity}個`,
}));
export const MILESTONES = C.quests.map((q) => ({
  ...q,
  action: q.action || q.recipe,
  tab: q.tab || "craft",
  reward: 1,
  name:
    q.name ||
    {
      first_weapon: "石の槍を作る",
      first_meal: "薬草のスープを作る",
      first_tower: "見張り台を建てる",
      first_iron_smelting: "鉄を精錬する",
      first_queue_completion: "予約を完了する",
      first_worker_purchase: "人員を雇う",
      first_facility_level_2: "施設をIIへ強化する",
      first_diplomacy_resolution: "外交を解決する",
      first_synergy: "相乗を成立させる",
    }[q.id] ||
    {
      first_iron_equipment: "鉄装備を作る",
      first_steel_equipment: "鋼装備を作る",
      first_silver_equipment: "銀装備を作る",
      first_mithril_equipment: "ミスリル装備を作る",
      first_diamond_equipment: "ダイヤモンド装備を作る",
      first_orichalcum_equipment: "オリハルコン装備を作る",
    }[q.id] ||
    q.id,
  action: q.trigger.recipeId || q.trigger.facilityId || null,
  tab: q.trigger.event === "facility_completed" ? "village" : "craft",
}));
const defs = new Map([...ACTIONS, ...RECIPES].map((x) => [x.id, x]));
const upgrades = new Map(LEGACY_UPGRADES.map((x) => [x.id, x]));
const skills = () => Object.fromEntries(SKILLS.map((x) => [x.id, { xp: 0 }]));
const round = (n) => Math.round(n * 1e8) / 1e8;
const ok = () => ({ ok: true, reason: "" }),
  fail = (reason) => ({ ok: false, reason });
const lv = (s, id, p = false) =>
  getSkillProgress((p ? s.meta : s.run).skills[id].xp, p).level;
const on = (s, id) =>
  s.meta.upgrades.includes(id) && !s.settings.disabledUpgrades.includes(id);
const aug = (s, id) => s.run.augments.selected.includes(id);
const effect = (s, id) =>
  C.facilities.find(
    (f) => f.facilityId === id && f.level === (s.run.facilities[id] || 0),
  )?.effect || {};
const log = (s, text, type = "info") => {
  s.run.log.unshift({ id: ++s.run.logSeq, time: s.run.elapsed, text, type });
  s.run.log.length = Math.min(40, s.run.log.length);
};
function freshRun(meta, settings) {
  return {
    status: "preparing",
    elapsed: 0,
    wave: 0,
    nextWaveAt: 180,
    raidTimingVersion: 3,
    hp: 100,
    resources: Object.fromEntries(C.resources.map((r) => [r.id, 0])),
    skills: skills(),
    equipment: {},
    facilities: {},
    activeAction: null,
    suspendedActions: {},
    enemy: null,
    combatTimer: 0,
    simRemainder: 0,
    logSeq: 0,
    log: [],
    helpers: {},
    autoCraft: null,
    queue: [],
    queueManaged: false,
    queueSeq: 0,
    workSeq: 0,
    blockedReason: "",
    idleWait: false,
    deathReport: null,
    healTimer: 0,
    workers: Object.fromEntries(
      C.workers.map((w) => [
        w.id,
        {
          level: 0,
          target:
            settings.workerTargets[w.id] ||
            w.resourceChoices?.[0] ||
            w.recipeChoices?.[0],
          batch: null,
        },
      ]),
    ),
    diplomacy: {
      status: "locked",
      deadline: 0,
      incomeTimer: 0,
      incomeTotal: 0,
      mercenary: false,
    },
    countries: Object.fromEntries(
      C.diplomacy.map((c) => [
        c.id,
        { status: "locked", deadline: 0, incomeTimer: 0, incomeTotal: 0 },
      ]),
    ),
    hostileQueue: [],
    runAttack: 0,
    reinvestment: 0,
    augments: {
      seed: (Math.imul(meta.generation, 0x9e3779b1) ^ 0xa5f1523d) >>> 0,
      offer: [],
      selected: [],
      offeredStages: [],
      investmentTimer: 0,
    },
    acceleration: {
      active: false,
      remainingSeconds: meta.upgrades.includes("acceleration_extension")
        ? Math.max(120, meta.bestWave * 57)
        : 120,
      limitWave: meta.bestWave,
    },
    startPermanentXp: Object.fromEntries(
      SKILLS.map((x) => [x.id, meta.skills[x.id].xp]),
    ),
  };
}
export function createGame() {
  const meta = {
    generation: 1,
    bestWave: 0,
    skills: skills(),
    history: [],
    points: 0,
    totalPoints: 0,
    defeatedBosses: [],
    upgrades: [],
    paidCosts: {},
    completedMilestones: [],
    templates: [],
    clears: 0,
  };
  const settings = {
    paused: true,
    speed: 1,
    disabledUpgrades: [],
    showHiddenRecipes: false,
    hiddenRecipes: [],
    soundVolume: 0.3,
    effectsEnabled: true,
    foodTarget: 12,
    processingTarget: 6,
    stockTargets: [],
    workerTargets: {},
  };
  const s = {
    version: 2,
    schemaVersion: 2,
    contentVersion: C.revision,
    meta,
    settings,
    run: freshRun(meta, settings),
  };
  log(s, "最初の襲撃まで3分。資源と食料を備えよう。");
  return s;
}
export function isKnown(s, d) {
  if (typeof d === "string") d = defs.get(d);
  return (
    !!d &&
    s.meta.bestWave >=
      (typeof d.knownAfterBoss === "string"
        ? (C.encounters.find((e) => e.id === d.knownAfterBoss)?.wave ?? 999)
        : d.knownAfterBoss || 0) &&
    s.meta.bestWave >= (d.unlockBestWave || 0)
  );
}
export function getUnlocks(s) {
  return { facilities: s.meta.bestWave >= 1, diplomacy: s.meta.bestWave >= 3 };
}
export function getSkillEffects(s, id) {
  return {
    runLevel: lv(s, id),
    permanentLevel: lv(s, id, true),
    runSpeedPercent: (lv(s, id) - 1) * 10,
    permanentSpeedPercent: (lv(s, id, true) - 1) * 8,
    runXpPercent: Math.min(100, (lv(s, id, true) - 1) * 4),
    runAttack: id === "combat" ? (lv(s, id) - 1) * 2 : 0,
    runMaxHp: id === "combat" ? (lv(s, id) - 1) * 10 : 0,
  };
}
export function getSynergies(s) {
  return C.synergies
    .filter(
      (y) =>
        s.meta.bestWave >= y.unlockBestWave &&
        s.run.augments.selected.some(
          (id) =>
            AUGMENTS.find((a) => a.id === id)?.family ===
            y.requiresSelectedFamily,
        ) &&
        (y.facilityAny.some((f) => (s.run.facilities[f.id] || 0) >= f.level) ||
          (y.orCombatRunLevel && lv(s, "combat") >= y.orCombatRunLevel)),
    )
    .map((y) => y.id);
}
export function getStats(s) {
  const r = lv(s, "combat") - 1,
    p = lv(s, "combat", true) - 1;
  let attack = 6 + r * 2 + p * 0.7 + s.run.runAttack,
    defense = p * 0.2,
    maxHp = 100 + r * 10 + p * 4;
  for (const e of Object.values(s.run.equipment)) {
    attack += e.attack || 0;
    defense += e.defense || 0;
    maxHp += e.maxHp || 0;
  }
  for (const id of s.meta.upgrades)
    if (on(s, id)) {
      const e = upgrades.get(id)?.effect || {};
      attack += e.attack || 0;
      defense += e.defense || 0;
      maxHp += e.maxHp || 0;
    }
  const syn = getSynergies(s);
  defense +=
    (effect(s, "barricade").defense || 0) *
    (syn.includes("fortress") ? 1.25 : 1);
  if (s.run.diplomacy.mercenary) attack += 5;
  if (aug(s, "momentum")) attack += s.run.wave * 0.7;
  attack *=
    1 + (aug(s, "warrior") ? 0.18 : 0) + (syn.includes("martial") ? 0.12 : 0);
  defense *= 1 + (aug(s, "guard") ? 0.15 : 0);
  return {
    attack: round(attack),
    defense: round(defense),
    maxHp: round(maxHp),
    speed: s.run.equipment.tool?.speed || 0,
    support: effect(s, "guardhouse").supportAttack || 0,
  };
}
export function getFoodHealing(s) {
  return Math.floor(
    (30 + getStats(s).maxHp * 0.1) * (aug(s, "provisions") ? 1.3 : 1),
  );
}
export function getRaidInterval(s) {
  return 180 + (effect(s, "watchtower").raidDelay || 0);
}
export function getActionDuration(s, d) {
  if (typeof d === "string") d = defs.get(d);
  let multiplier = 1;
  if (aug(s, "forestry") && ["logging", "mining"].includes(d.skill))
    multiplier *= 0.8;
  if (aug(s, "drill") && d.id === "train_combat") multiplier *= 0.7;
  const speed =
    (1 + 0.1 * (lv(s, d.skill) - 1)) *
    (1 + 0.08 * (lv(s, d.skill, true) - 1)) *
    (1 + (s.run.equipment.tool?.speed || 0)) *
    (d.cost ? 1 + (effect(s, "workshop").craftSpeed || 0) : 1);
  return round(Math.max(0.25, (d.duration * multiplier) / speed));
}
export function getRecipeCost(s, d) {
  if (typeof d === "string") d = defs.get(d);
  let discount = d?.facility && aug(s, "builder") ? 0.25 : 0;
  if (d?.equipment && s.run.reinvestment > 0) discount += 0.25;
  return Object.fromEntries(
    Object.entries(d?.cost || {}).map(([id, n]) => [
      id,
      Math.max(
        1,
        Math.ceil(n * (1 - (id === "gold" ? 0 : Math.min(0.5, discount)))),
      ),
    ]),
  );
}
function reward(s, id) {
  if (s.meta.completedMilestones.includes(id)) return;
  s.meta.completedMilestones.push(id);
  s.meta.points++;
  s.meta.totalPoints++;
  log(
    s,
    `初達成：${MILESTONES.find((q) => q.id === id)?.name || id} / 継承 +1`,
    "permanent",
  );
}
function event(s, type, d = {}) {
  for (const q of MILESTONES) {
    const t = q.trigger;
    let hit = false;
    if (type === "craft") {
      hit = t.event === "recipe_completed" && t.recipeId === d.id;
      hit ||=
        t.event === "equipment_completed" &&
        !!d.equipment &&
        d.tier >= t.minimumTier;
      hit ||=
        t.event === "facility_completed" &&
        !!d.facility &&
        (!t.facilityId || t.facilityId === d.facility.id) &&
        d.level >= t.minimumLevel;
    }
    if (type === "worker_purchase")
      hit = t.event === "upgrade_purchased" && t.anyOf.includes(d.id);
    if (type === "queue_complete") hit = t.event === "queue_goal_completed";
    if (type === "diplomacy")
      hit = !!t.anyOfEvents?.includes("country_aid_paid");
    if (type === "synergy")
      hit = t.event === "synergy_activated" && getSynergies(s).length > 0;
    if (hit) reward(s, q.id);
  }
}
export function getMilestoneStatus(s) {
  const next = MILESTONES.find(
    (q) => !s.meta.completedMilestones.includes(q.id),
  );
  return {
    completed: s.meta.completedMilestones.length,
    total: MILESTONES.length,
    next: next || null,
    available: !next || next.tab !== "village" || getUnlocks(s).facilities,
  };
}
export function canStartAction(s, id, ignoreActive = false) {
  const d = defs.get(id);
  if (!d) return fail("作業がありません。");
  if (s.run.status !== "preparing") return fail("準備中に選んでください。");
  if (s.run.augments.offer.length)
    return fail("オーグメントを選んでください。");
  if (!isKnown(s, d)) return fail("先のボスを撃退すると発見できます。");
  if (!ignoreActive && s.run.activeAction?.id === id)
    return fail("作業中です。");
  if (s.run.suspendedActions[id]) return ok();
  if (lv(s, d.skill) < d.unlockLevel)
    return fail(
      `${SKILLS.find((x) => x.id === d.skill).name} Lv.${d.unlockLevel}が必要。`,
    );
  if (d.facility) {
    const current = s.run.facilities[d.facility.id] || 0;
    if (current >= d.level) return fail("建設済みです。");
    if (current !== d.level - 1) return fail("先に前段階を建設してください。");
  }
  if (d.equipment && s.run.equipment[d.slot]?.id === id)
    return fail("装備済みです。");
  for (const [r, n] of Object.entries(getRecipeCost(s, d)))
    if (s.run.resources[r] < n)
      return fail(
        `${RESOURCES[r].name}が${Math.ceil(n - s.run.resources[r])}不足。`,
      );
  return ok();
}
function suspend(s) {
  const a = s.run.activeAction;
  if (a) {
    s.run.suspendedActions[a.id] = a;
    s.run.activeAction = null;
  }
  s.run.queueManaged = false;
}
function batch(s, id, channel = "main", durationMultiplier = 1) {
  const d = defs.get(id);
  for (const [r, n] of Object.entries(getRecipeCost(s, d)))
    s.run.resources[r] = round(s.run.resources[r] - n);
  if (d.equipment && s.run.reinvestment) s.run.reinvestment = 0;
  const xpBonus = aug(s, "field_training") && id === "train_combat" ? 1.25 : 1;
  return {
    id,
    instanceId: ++s.run.workSeq,
    channel,
    kind: d.cost ? "craft" : "gather",
    progress: 0,
    duration: round(getActionDuration(s, d) * durationMultiplier),
    runXp:
      d.duration *
      2 *
      d.xpCoefficient *
      Math.min(2, 1 + 0.04 * (lv(s, d.skill, true) - 1)) *
      xpBonus,
    permanentXp: d.duration * 0.3 * d.xpCoefficient * xpBonus,
  };
}
function begin(s, id) {
  if (s.run.activeAction?.id === id) return;
  suspend(s);
  s.run.activeAction = s.run.suspendedActions[id] || batch(s, id);
  delete s.run.suspendedActions[id];
}
export function startAction(s, id) {
  const a = canStartAction(s, id);
  if (!a.ok) return a;
  detach(s);
  suspend(s);
  begin(s, id);
  s.run.idleWait = false;
  s.settings.paused = false;
  if (
    s.run.queue.length &&
    !s.settings.disabledUpgrades.includes("action_queue")
  )
    s.settings.disabledUpgrades.push("action_queue");
  return ok();
}
export function stopAction(s) {
  if (s.run.status !== "preparing") return fail("襲撃中です。");
  suspend(s);
  s.settings.paused = true;
  return ok();
}
function gain(s, skill, run, perm) {
  const before = getStats(s).maxHp,
    old = lv(s, skill);
  s.run.skills[skill].xp = round(Math.min(1e9, s.run.skills[skill].xp + run));
  s.meta.skills[skill].xp = round(
    Math.min(1e9, s.meta.skills[skill].xp + perm),
  );
  s.run.hp = round(
    Math.min(getStats(s).maxHp, s.run.hp + getStats(s).maxHp - before),
  );
  if (lv(s, skill) > old)
    log(
      s,
      `${SKILLS.find((x) => x.id === skill).name} Lv.${lv(s, skill)}`,
      "level",
    );
}
function complete(s, a) {
  const d = defs.get(a.id);
  for (const [r, n] of Object.entries(d.yields || {}))
    s.run.resources[r] = round(Math.min(1e9, s.run.resources[r] + n));
  if (aug(s, "timber_contract") && d.skill === "logging")
    s.run.resources.gold = round(
      s.run.resources.gold + (d.yields.wood || 0) * 0.15,
    );
  if (d.equipment) {
    s.run.equipment[d.slot] = { id: d.id, ...d.equipment };
    s.run.hp = Math.min(s.run.hp, getStats(s).maxHp);
    log(s, `${d.name}を装備した。`, "craft");
  }
  if (d.facility) {
    const oldDelay = effect(s, "watchtower").raidDelay || 0;
    s.run.facilities[d.facility.id] = d.level;
    s.run.nextWaveAt = round(
      s.run.nextWaveAt + (effect(s, "watchtower").raidDelay || 0) - oldDelay,
    );
    log(s, `${d.name}が完成。`, "craft");
  }
  event(s, "craft", d);
  if (getSynergies(s).length) event(s, "synergy");
  gain(s, d.skill, a.runXp, a.permanentXp);
}

// Resolve only the next required batch. Re-evaluate after every completion or helper delivery.
export function getProductionSources(
  s,
  resource,
  shortage,
  inventory = s.run.resources,
  visiting = new Set(),
  alreadyPaid = new Set(),
) {
  const available = (d) =>
    !visiting.has(d.id) && isKnown(s, d) && lv(s, d.skill) >= d.unlockLevel;
  function estimate(d, count, stock, seen, paid) {
    if (seen.has(d.id)) return Infinity;
    const next = new Set([...seen, d.id]);
    const saved =
      !paid.has(d.id) &&
      (s.run.activeAction?.id === d.id
        ? s.run.activeAction
        : s.run.suspendedActions[d.id]);
    let seconds =
      (saved ? saved.duration - saved.progress : getActionDuration(s, d)) +
      (count - 1) * getActionDuration(s, d);
    paid.add(d.id);
    for (const [r, cost] of Object.entries(getRecipeCost(s, d))) {
      const required = cost * (count - (saved?.kind === "craft" ? 1 : 0));
      const missing = required - (stock[r] || 0);
      if (missing > 0) {
        let best = null;
        for (const source of [...ACTIONS, ...RECIPES].filter(
          (x) => x.yields?.[r] && available(x) && !next.has(x.id),
        )) {
          const trial = { ...stock },
            trialPaid = new Set(paid);
          const time = estimate(
            source,
            Math.ceil(missing / source.yields[r]),
            trial,
            next,
            trialPaid,
          );
          if (!best || time < best.time) best = { time, trial, trialPaid };
        }
        if (!best || !Number.isFinite(best.time)) return Infinity;
        seconds += best.time;
        Object.assign(stock, best.trial);
        for (const id of best.trialPaid) paid.add(id);
      }
      stock[r] = (stock[r] || 0) - required;
    }
    for (const [r, countPerBatch] of Object.entries(d.yields || {}))
      stock[r] = (stock[r] || 0) + countPerBatch * count;
    return seconds;
  }
  return [...ACTIONS, ...RECIPES]
    .filter((d) => d.yields?.[resource] && available(d))
    .map((d) => ({
      d,
      seconds: estimate(
        d,
        Math.ceil(shortage / d.yields[resource]),
        { ...inventory },
        visiting,
        new Set(alreadyPaid),
      ),
    }))
    .filter((x) => Number.isFinite(x.seconds))
    .sort((a, b) => a.seconds - b.seconds)
    .map((x) => x.d);
}
export function resolveGoal(s, id, visiting = new Set()) {
  const d = defs.get(id);
  if (!d) return fail("作業がありません。");
  if (visiting.has(id)) return fail("材料の循環があります。");
  if (!isKnown(s, d)) return fail("未発見です。");
  if (s.run.suspendedActions[id]) return { ...ok(), id };
  if (d.facility && (s.run.facilities[d.facility.id] || 0) >= d.level)
    return { ...ok(), done: true };
  if (d.equipment && s.run.equipment[d.slot]?.id === id)
    return { ...ok(), done: true };
  if (lv(s, d.skill) < d.unlockLevel)
    return fail(
      `${SKILLS.find((x) => x.id === d.skill).name} Lv.${d.unlockLevel}が必要。`,
    );
  const seen = new Set([...visiting, id]);
  if (d.facility && (s.run.facilities[d.facility.id] || 0) < d.level - 1)
    return resolveGoal(s, d.requires[0], seen);
  for (const [r, n] of Object.entries(getRecipeCost(s, d))) {
    if (s.run.resources[r] >= n) continue;
    const producers = getProductionSources(
      s,
      r,
      n - s.run.resources[r],
      s.run.resources,
      seen,
    );
    let reason = "";
    for (const p of producers) {
      const result = resolveGoal(s, p.id, seen);
      if (result.ok) return result;
      reason = result.reason;
    }
    return fail(
      reason ||
        `${RESOURCES[r].name}不足。${r === "hide" ? "撃退または市場で入手。" : r === "gold" ? "市場で木材を納入。" : "技能を上げてください。"}`,
    );
  }
  return { ...ok(), id };
}
export function enqueueAction(
  s,
  id,
  count = 1,
  kind = defs.get(id)?.cost ? "goal" : "action",
) {
  if (!on(s, "action_queue")) return fail("行動予約を解放してください。");
  if (!isKnown(s, id)) return fail("未発見です。");
  if (
    !Number.isInteger(count) ||
    count < 1 ||
    count > 99 ||
    s.run.queue.length >= 8
  )
    return fail("予約8件、回数1〜99。");
  if (s.run.status !== "preparing") return fail("準備中に予約してください。");
  if (defs.get(id)?.equipment || defs.get(id)?.facility) count = 1;
  s.run.queue.push({ id, count, kind, goalId: ++s.run.queueSeq });
  return ok();
}
export const enqueueGoal = (s, id, count = 1) =>
  enqueueAction(s, id, count, "goal");
function detach(s) {
  if (s.run.queueManaged) {
    if (s.run.activeAction?.kind === "gather") suspend(s);
    else if (s.run.activeAction) delete s.run.activeAction.goalId;
  }
  for (const a of Object.values(s.run.suspendedActions)) delete a.goalId;
  s.run.queueManaged = false;
}
export function editQueuedAction(s, i, n) {
  if (!s.run.queue[i] || !Number.isInteger(n) || n < 1 || n > 99)
    return fail("回数1〜99。");
  s.settings.paused = true;
  detach(s);
  const d = defs.get(s.run.queue[i].id);
  s.run.queue[i].count = d?.equipment || d?.facility ? 1 : n;
  return ok();
}
export function moveQueuedAction(s, i, dir) {
  if (![-1, 1].includes(dir) || !s.run.queue[i] || !s.run.queue[i + dir])
    return fail("移動できません。");
  detach(s);
  [s.run.queue[i], s.run.queue[i + dir]] = [
    s.run.queue[i + dir],
    s.run.queue[i],
  ];
  return ok();
}
export function removeQueuedAction(s, i) {
  if (!s.run.queue[i]) return fail("予約がありません。");
  if (i === 0) detach(s);
  s.run.queue.splice(i, 1);
  if (!s.run.queue.length && !s.run.activeAction) s.settings.paused = true;
  return ok();
}
export function clearQueue(s) {
  detach(s);
  s.run.queue = [];
  if (!s.run.activeAction) s.settings.paused = true;
  return ok();
}
export function getQueueStatus(s) {
  if (!on(s, "action_queue"))
    return { active: false, reason: "予約は無効です。" };
  if (!s.run.queue.length)
    return { active: false, reason: "予約はありません。" };
  const q = s.run.queue[0],
    r =
      q.kind === "goal" ? resolveGoal(s, q.id) : canStartAction(s, q.id, true);
  return {
    active: r.ok && !s.settings.paused,
    reason: r.ok
      ? s.settings.paused
        ? "一時停止中。"
        : "予約を実行。"
      : r.reason,
  };
}
function driveQueue(s) {
  if (s.run.activeAction || !on(s, "action_queue")) return;
  while (s.run.queue.length) {
    const q = s.run.queue[0],
      r =
        q.kind === "goal"
          ? resolveGoal(s, q.id)
          : { ...canStartAction(s, q.id, true), id: q.id };
    if (r.done) {
      s.run.queue.shift();
      continue;
    }
    if (!r.ok) {
      if (s.run.blockedReason !== r.reason) {
        s.run.blockedReason = r.reason;
        s.settings.paused = true;
        log(s, r.reason);
      }
      return;
    }
    s.run.blockedReason = "";
    begin(s, r.id);
    s.run.activeAction.goalId = q.goalId;
    s.run.queueManaged = true;
    return;
  }
}
function reserve(s) {
  const current = s.run.queueManaged ? s.run.queue[0] : null;
  const d = defs.get(
    current?.id || (!s.run.activeAction ? s.run.queue[0]?.id : null),
  );
  if (!d) return {};
  const inventory = { ...s.run.resources },
    out = {};
  const paid =
    s.run.activeAction?.kind === "craft" ? s.run.activeAction.id : null;
  function add(x, count = 1, seen = new Set()) {
    if (seen.has(x.id) || x.id === paid) return;
    const next = new Set([...seen, x.id]);
    for (const [r, n] of Object.entries(getRecipeCost(s, x))) {
      const needed = n * count;
      out[r] = (out[r] || 0) + Math.min(inventory[r] || 0, needed);
      const short = needed - (inventory[r] || 0);
      inventory[r] = Math.max(0, (inventory[r] || 0) - needed);
      if (short > 0) {
        const p = RECIPES.find((p) => p.yields?.[r] && isKnown(s, p));
        if (p) add(p, Math.ceil(short / p.yields[r]), next);
      }
    }
  }
  add(d);
  return out;
}
export function canConfigureWorker(s, id, target) {
  const w = C.workers.find((w) => w.id === id),
    rw = s.run.workers[id];
  if (
    !w ||
    !on(s, id) ||
    ![...(w.resourceChoices || []), ...(w.recipeChoices || [])].includes(target)
  )
    return fail("対象を選べません。");
  const tier = resourceTier(target);
  if (tier > w.levels[rw.level].maxResourceTier || !resourceKnown(s, target))
    return fail("人員の強化または発見が必要。");
  return ok();
}
export function configureWorker(s, id, target) {
  const allowed = canConfigureWorker(s, id, target);
  if (!allowed.ok) return allowed;
  s.run.workers[id].target = target;
  s.settings.workerTargets[id] = target;
  return ok();
}
const resourceTier = (id) => {
  const d = defs.get(id);
  if (d) return d.tier || resourceTier(Object.keys(d.yields || {})[0]);
  return (
    {
      coal: 3,
      steel_ingot: 3,
      silver_ore: 4,
      silver_ingot: 4,
      mithril_ore: 5,
      mithril_ingot: 5,
      diamond: 6,
      orichalcum_ore: 7,
      orichalcum_ingot: 7,
    }[id] || (["ore", "ingot"].includes(id) ? 2 : 1)
  );
};
export const resourceKnown = (s, id) =>
  s.meta.bestWave >=
    {
      coal: 6,
      steel_ingot: 6,
      silver_ore: 9,
      silver_ingot: 9,
      mithril_ore: 12,
      mithril_ingot: 12,
      diamond: 15,
      orichalcum_ore: 18,
      orichalcum_ingot: 18,
    }[id] ||
  (!Object.hasOwn(
    {
      coal: 6,
      steel_ingot: 6,
      silver_ore: 9,
      silver_ingot: 9,
      mithril_ore: 12,
      mithril_ingot: 12,
      diamond: 15,
      orichalcum_ore: 18,
      orichalcum_ingot: 18,
    },
    id,
  ) &&
    (!defs.has(id) || isKnown(s, id)));
export function upgradeWorker(s, id) {
  const w = C.workers.find((x) => x.id === id),
    rw = s.run.workers[id],
    next = w?.levels[rw?.level + 1];
  if (
    s.run.status !== "preparing" ||
    !on(s, id) ||
    !next ||
    s.meta.bestWave < next.unlockBestWave
  )
    return fail("まだ強化できません。");
  if (s.run.resources.gold < next.goldCost) return fail("金貨不足。");
  s.run.resources.gold -= next.goldCost;
  rw.level++;
  return ok();
}
function helpers(s, dt) {
  const reserved = reserve(s);
  const funded = (d) =>
    Object.entries(getRecipeCost(s, d)).every(
      ([r, n]) => s.run.resources[r] - (reserved[r] || 0) >= n,
    );
  if (on(s, "auto_cook")) {
    const d = defs.get("cook_meal");
    if (
      !s.run.autoCraft &&
      s.run.resources.food < s.settings.foodTarget &&
      funded(d)
    )
      s.run.autoCraft = batch(s, d.id, "auto_cook");
    if (s.run.autoCraft) {
      s.run.autoCraft.progress = round(s.run.autoCraft.progress + dt);
      s.run.helpers.auto_cook = s.run.autoCraft.progress;
      if (s.run.autoCraft.progress + 1e-8 >= s.run.autoCraft.duration) {
        complete(s, s.run.autoCraft);
        s.run.autoCraft = null;
        s.run.helpers.auto_cook = 0;
      }
    }
  }
  for (const w of C.workers) {
    if (!on(s, w.id)) continue;
    const rw = s.run.workers[w.id],
      level = w.levels[rw.level];
    if (
      !rw.batch &&
      resourceKnown(s, rw.target) &&
      resourceTier(rw.target) <= level.maxResourceTier
    ) {
      if (w.recipeChoices) {
        const d = defs.get(rw.target),
          output = Object.keys(d.yields)[0];
        if (s.run.resources[output] < s.settings.processingTarget && funded(d))
          rw.batch = batch(
            s,
            d.id,
            w.id,
            level.recipeDurationMultiplier *
              (aug(s, "artisan_guild") ? 0.75 : 1),
          );
      } else
        rw.batch = {
          target: rw.target,
          progress: 0,
          duration: level.interval * (aug(s, "artisan_guild") ? 0.75 : 1),
          quantity: level.quantity,
        };
    }
    if (rw.batch) {
      rw.batch.progress = round(rw.batch.progress + dt);
      if (rw.batch.progress + 1e-8 >= rw.batch.duration) {
        if (w.recipeChoices) complete(s, rw.batch);
        else
          s.run.resources[rw.batch.target] = round(
            Math.min(1e9, s.run.resources[rw.batch.target] + rw.batch.quantity),
          );
        rw.batch = null;
      }
    }
  }
}
export function setStockTarget(s, id, n) {
  if (
    !on(s, "stock_targets") ||
    !RESOURCES[id] ||
    !Number.isInteger(n) ||
    n < 0 ||
    n > 9999
  )
    return fail("在庫目標は0〜9999。");
  s.settings.stockTargets = s.settings.stockTargets.filter((x) => x.id !== id);
  if (n) s.settings.stockTargets.push({ id, count: n });
  return ok();
}
export function saveTemplate(s, name) {
  if (
    !on(s, "queue_templates") ||
    !name.trim() ||
    name.length > 40 ||
    s.meta.templates.length >= 8 ||
    !s.run.queue.length
  )
    return fail("手順は最大8件。予約を作って保存してください。");
  s.meta.templates.push({
    name: name.trim(),
    goals: s.run.queue.map(({ id, count, kind }) => ({ id, count, kind })),
  });
  return ok();
}
export function loadTemplate(s, i) {
  const t = s.meta.templates[i];
  if (
    !on(s, "queue_templates") ||
    !on(s, "action_queue") ||
    !t ||
    s.run.queue.length + t.goals.length > 8 ||
    t.goals.some((g) => !isKnown(s, g.id))
  )
    return fail("この手順を使えません。");
  for (const g of t.goals) {
    const d = defs.get(g.id);
    s.run.queue.push({ ...g, count: d?.equipment || d?.facility ? 1 : g.count, goalId: ++s.run.queueSeq });
  }
  return ok();
}
export function deleteTemplate(s, i) {
  if (!s.meta.templates[i]) return fail("手順がありません。");
  s.meta.templates.splice(i, 1);
  return ok();
}

export function getAugmentStatus(s) {
  return {
    unlocked: s.meta.bestWave >= 3,
    offer: [...s.run.augments.offer],
    selected: [...s.run.augments.selected],
    remaining: 4 - s.run.augments.selected.length,
  };
}
function offer(s, stage) {
  const a = s.run.augments;
  if (
    s.meta.bestWave < 3 ||
    a.offer.length ||
    a.selected.length >= 4 ||
    a.offeredStages.includes(stage)
  )
    return;
  const pool = AUGMENTS.filter(
    (x) =>
      !a.selected.includes(x.id) &&
      (!x.pack || on(s, x.pack)) &&
      (!x.requiresPurchasedWorker || C.workers.some((w) => on(s, w.id))),
  );
  let sets = [];
  for (let i = 0; i < pool.length; i++)
    for (let j = i + 1; j < pool.length; j++)
      for (let k = j + 1; k < pool.length; k++)
        sets.push([pool[i], pool[j], pool[k]]);
  if (!sets.length) sets = [pool];
  const balanced = sets.filter(
    (xs) =>
      !["economy", "martial", "fortress"].some(
        (f) => xs.filter((x) => x.family === f).length > 2,
      ),
  );
  if (balanced.length) sets = balanced;
  if ([9, 15].includes(stage)) {
    const families = a.selected.map(
        (id) => AUGMENTS.find((x) => x.id === id).family,
      ),
      matching = sets.filter((xs) =>
        xs.some((x) => families.includes(x.family)),
      );
    if (matching.length) sets = matching;
  }
  a.seed = (Math.imul(a.seed, 1664525) + 1013904223) >>> 0;
  a.offer = (sets[Math.floor((a.seed / 4294967296) * sets.length)] || []).map(
    (x) => x.id,
  );
  a.offeredStages.push(stage);
  s.settings.paused = true;
  s.run.acceleration.active = false;
}
export function chooseAugment(s, id) {
  if (!s.run.augments.offer.includes(id) || s.run.status !== "preparing")
    return fail("候補を選んでください。");
  s.run.augments.selected.push(id);
  s.run.augments.offer = [];
  s.settings.paused = true;
  event(s, "synergy");
  return ok();
}
function syncCountries(s) {
  for (const c of C.diplomacy) {
    const r = s.run.countries[c.id];
    if (
      r.status === "locked" &&
      s.meta.bestWave >= c.unlockBestWave &&
      (s.run.wave >= c.repeatArrivalWave || s.run.wave >= c.unlockBestWave)
    ) {
      r.status = "pending";
      r.deadline = s.run.elapsed + c.deadlineSeconds;
      log(s, `${c.name}から援助の依頼。`);
    }
  }
  Object.assign(s.run.diplomacy, s.run.countries.saphra);
}
export function aidCountry(s, id = "saphra") {
  const c = C.diplomacy.find((c) => c.id === id),
    r = s.run.countries[id];
  if (s.run.status !== "preparing" || r?.status !== "pending")
    return fail("依頼はありません。");
  if (Object.entries(c.cost).some(([id, n]) => s.run.resources[id] < n))
    return fail("援助の資源が不足。");
  for (const [id, n] of Object.entries(c.cost)) s.run.resources[id] -= n;
  r.status = "allied";
  syncCountries(s);
  event(s, "diplomacy");
  return ok();
}
function hostile(s, id) {
  s.run.countries[id].status = "hostile";
  if (!s.run.hostileQueue.includes(id)) s.run.hostileQueue.push(id);
  syncCountries(s);
}
export function refuseCountry(s, id = "saphra") {
  if (s.run.status !== "preparing" || s.run.countries[id]?.status !== "pending")
    return fail("依頼はありません。");
  hostile(s, id);
  return ok();
}
export function getSupplyCost(s, id) {
  const m = C.market.find((m) => m.id === id);
  if (!m) return 0;
  if (m.id === "sell_wood") return 10;
  let discount = m.discountEligible
    ? (effect(s, "market").purchaseDiscount || 0) +
      (aug(s, "joint_procurement") ? 0.15 : 0) +
      (getSynergies(s).includes("economy") ? 0.1 : 0) +
      (s.run.countries.mining_realm.status === "allied" && id !== "buy_hide"
        ? 0.15
        : 0)
    : 0;
  return Math.max(1, Math.ceil(m.gold * (1 - Math.min(0.4, discount))));
}
export function buySupply(s, id) {
  const m = C.market.find((m) => m.id === id);
  if (s.run.status !== "preparing" || !m || !s.run.facilities.market)
    return fail("市場を建設してください。");
  if (m.resource && !resourceKnown(s, m.resource)) return fail("未発見です。");
  if (m.oncePerRun && s.run.diplomacy.mercenary) return fail("雇用済み。");
  if (id === "sell_wood") {
    if (s.run.resources.wood < 10) return fail("木材10が必要。");
    s.run.resources.wood -= 10;
    s.run.resources.gold += effect(s, "market").woodSaleAmount;
    return ok();
  }
  const price = getSupplyCost(s, id);
  if (s.run.resources.gold < price) return fail("金貨不足。");
  s.run.resources.gold -= price;
  if (m.attack) s.run.diplomacy.mercenary = true;
  else s.run.resources[m.resource] += m.quantity;
  return ok();
}
function income(s, dt) {
  syncCountries(s);
  for (const c of C.diplomacy) {
    const r = s.run.countries[c.id];
    if (r.status === "pending" && s.run.elapsed >= r.deadline) hostile(s, c.id);
    if (r.status === "allied" && c.ally.incomeInterval) {
      r.incomeTimer = round(r.incomeTimer + dt);
      while (r.incomeTimer >= c.ally.incomeInterval) {
        r.incomeTimer -= c.ally.incomeInterval;
        r.incomeTotal += c.ally.gold;
        s.run.resources.gold += c.ally.gold;
      }
    }
  }
  syncCountries(s);
  if (aug(s, "investment")) {
    s.run.augments.investmentTimer = round(s.run.augments.investmentTimer + dt);
    if (s.run.augments.investmentTimer >= 15) {
      s.run.augments.investmentTimer -= 15;
      s.run.resources.gold +=
        Object.values(s.run.facilities).reduce((a, b) => a + b, 0) * 0.5;
    }
  }
}
export function canPurchaseUpgrade(s, id) {
  const u = upgrades.get(id);
  if (!u) return fail("解放がありません。");
  if (
    !["preparing", "legacy_setup"].includes(s.run.status) ||
    s.run.augments.offer.length
  )
    return fail("準備中に購入してください。");
  const owned =
      s.run.status === "legacy_setup"
        ? s.run.legacyDraft.upgrades
        : s.meta.upgrades,
    points =
      s.run.status === "legacy_setup"
        ? s.run.legacyDraft.points
        : s.meta.points;
  if (owned.includes(id)) return fail("購入済み。");
  if (points < u.cost) return fail("ポイント不足。");
  const g = u.unlock;
  if (g.bestWave && s.meta.bestWave < g.bestWave)
    return fail(`最高第${g.bestWave}波が必要。`);
  if (
    g.completedQuests &&
    s.meta.completedMilestones.length < g.completedQuests &&
    s.meta.bestWave < 3
  )
    return fail(`初達成${g.completedQuests}件が必要。`);
  if (g.requires?.some((x) => !owned.includes(x)))
    return fail("先に前提を解放してください。");
  if (
    g.automationCount &&
    owned.filter((x) =>
      ["automation", "worker"].includes(upgrades.get(x)?.kind),
    ).length < g.automationCount
  )
    return fail("自動化を3種類解放してください。");
  if (g.generation && s.meta.generation < g.generation)
    return fail("次の世代で解放。");
  return ok();
}
export function purchaseUpgrade(s, id) {
  const r = canPurchaseUpgrade(s, id);
  if (!r.ok) return r;
  const u = upgrades.get(id),
    target = s.run.status === "legacy_setup" ? s.run.legacyDraft : s.meta;
  target.points -= u.cost;
  target.upgrades.push(id);
  target.paidCosts[id] = u.cost;
  if (s.run.status !== "legacy_setup") {
    event(s, "worker_purchase", { id });
    s.run.hp = Math.min(s.run.hp, getStats(s).maxHp);
  }
  return ok();
}
export function refundUpgrade(s, id) {
  if (s.run.status !== "legacy_setup")
    return fail("次周開始前だけ再配分できます。");
  const d = s.run.legacyDraft;
  if (!d.upgrades.includes(id)) return fail("未購入です。");
  if (d.upgrades.some((x) => upgrades.get(x).unlock.requires?.includes(id)))
    return fail("先に上位を外してください。");
  d.points += d.paidCosts[id];
  delete d.paidCosts[id];
  d.upgrades = d.upgrades.filter((x) => x !== id);
  return ok();
}
export function toggleUpgrade(s, id) {
  if (
    !s.meta.upgrades.includes(id) ||
    s.run.status !== "preparing" ||
    s.run.augments.offer.length
  )
    return fail("準備中に切り替えてください。");
  s.settings.disabledUpgrades = s.settings.disabledUpgrades.includes(id)
    ? s.settings.disabledUpgrades.filter((x) => x !== id)
    : [...s.settings.disabledUpgrades, id];
  s.run.hp = Math.min(s.run.hp, getStats(s).maxHp);
  return ok();
}
export function restartRun(s) {
  if (!["dead", "cleared"].includes(s.run.status))
    return fail("周回終了後に開始してください。");
  s.run.status = "legacy_setup";
  s.run.legacyDraft = {
    upgrades: [...s.meta.upgrades],
    paidCosts: { ...s.meta.paidCosts },
    points: s.meta.points,
  };
  s.settings.paused = true;
  return ok();
}
export function confirmRun(s) {
  if (s.run.status !== "legacy_setup") return fail("継承準備ではありません。");
  Object.assign(s.meta, s.run.legacyDraft);
  s.meta.generation++;
  s.settings.disabledUpgrades = s.settings.disabledUpgrades.filter((id) =>
    s.meta.upgrades.includes(id),
  );
  s.contentVersion = C.revision;
  s.run = freshRun(s.meta, s.settings);
  s.run.hp = getStats(s).maxHp;
  for (const id of s.meta.upgrades) event(s, "worker_purchase", { id });
  s.settings.paused = true;
  offer(s, "start");
  return ok();
}
export function getAccelerationStatus(s) {
  const a = s.run.acceleration,
    available =
      s.meta.bestWave >= 9 &&
      s.meta.generation >= 2 &&
      s.meta.upgrades.filter((x) =>
        ["automation", "worker"].includes(upgrades.get(x)?.kind),
      ).length >= 3;
  const unlocked = on(s, "cycle_acceleration");
  const eligible =
    unlocked &&
    available &&
    a.remainingSeconds > 0 &&
    s.run.wave < a.limitWave &&
    ["preparing", "combat"].includes(s.run.status) &&
    !s.run.augments.offer.length;
  return {
    ...a,
    available,
    unlocked,
    canStart: eligible,
    eligible,
    multiplier: 5,
    reason: "既知の襲撃まで復帰を短縮。",
  };
}
export function startAcceleration(s) {
  if (!getAccelerationStatus(s).canStart) return fail("復帰を使えません。");
  s.run.acceleration.active = true;
  s.settings.paused = false;
  if (!s.run.activeAction && !s.run.queue.length) s.run.idleWait = true;
  return ok();
}
export function stopAcceleration(s) {
  s.run.acceleration.active = false;
  return ok();
}
export function getNextEnemy(s) {
  const e = (s.contentVersion === "A1" ? A1_ENCOUNTERS : C.encounters)[
    s.run.wave
  ];
  if (!e)
    return {
      name: "最終襲撃を撃退",
      hp: 0,
      attack: 0,
      defense: 0,
      wave: 21,
      isBoss: true,
    };
  const country = s.run.hostileQueue[0],
    inv = C.diplomacy.find((c) => c.id === country)?.invasion;
  return {
    ...e,
    hp: inv ? Math.ceil(e.hp * inv.hpMultiplier) : e.hp,
    attack: inv ? Math.ceil(e.attack * inv.attackMultiplier) : e.attack,
    defense: e.defense + (inv?.defenseBonus || 0),
    maxHp: inv ? Math.ceil(e.hp * inv.hpMultiplier) : e.hp,
    isBoss: e.boss,
    invasion: !!inv,
    country: country || null,
  };
}
function beginRaid(s) {
  s.run.enemy = {
    ...getNextEnemy(s),
    round: 0,
    xpAwarded: 0,
    xpBudget:
      C.encounters[s.run.wave].combatXpBudget *
      (aug(s, "field_training") ? 1.25 : 1),
    charges: effect(s, "infirmary").treatmentCharges || 0,
  };
  s.run.status = "combat";
  s.run.combatTimer = 0;
  log(s, `第${s.run.enemy.wave}波：${s.run.enemy.name}`, "raid");
}
function record(s) {
  s.meta.history.unshift({
    generation: s.meta.generation,
    wave: s.run.wave,
    elapsed: s.run.elapsed,
    skillGains: Object.fromEntries(
      SKILLS.map((x) => [
        x.id,
        round(s.meta.skills[x.id].xp - s.run.startPermanentXp[x.id]),
      ]),
    ),
  });
  s.meta.history = s.meta.history.slice(0, 20);
}
function die(s, e, before, damage) {
  s.run.deathReport = {
    enemy: e.name,
    wave: e.wave,
    beforeHit: before,
    damage,
    food: s.run.resources.food,
  };
  s.run.hp = 0;
  s.run.status = "dead";
  s.settings.paused = true;
  s.run.acceleration.active = false;
  s.run.enemy = null;
  s.run.activeAction = null;
  s.run.suspendedActions = {};
  s.run.queue = [];
  s.run.simRemainder = 0;
  log(s, "力尽きた。経験を次の命へ。", "death");
  record(s);
}
function victory(s, e) {
  s.run.wave = e.wave;
  if (s.run.wave >= s.run.acceleration.limitWave)
    s.run.acceleration.active = false;
  s.meta.bestWave = Math.max(s.meta.bestWave, e.wave);
  let gold =
    e.gold *
    (1 +
      (aug(s, "bounty") ? 0.75 : 0) +
      (getSynergies(s).includes("martial") ? 0.2 : 0));
  s.run.resources.gold = round(s.run.resources.gold + gold);
  s.run.resources.hide += e.hide;
  if (e.boss && !s.meta.defeatedBosses.includes(e.id)) {
    s.meta.defeatedBosses.push(e.id);
    s.meta.points++;
    s.meta.totalPoints++;
    log(s, "ボス初撃破 / 継承 +1", "permanent");
  }
  if (e.country) {
    const c = C.diplomacy.find((c) => c.id === e.country);
    s.run.hostileQueue = s.run.hostileQueue.filter((id) => id !== e.country);
    s.run.countries[e.country].status = "defeated";
    for (const [id, n] of Object.entries(c.victory)) {
      if (id === "runAttack") s.run.runAttack += n;
      else s.run.resources[id] += n;
    }
    event(s, "diplomacy");
  }
  if (aug(s, "momentum"))
    s.run.hp = Math.min(getStats(s).maxHp, s.run.hp + getStats(s).maxHp * 0.06);
  if (aug(s, "spoils_reinvestment")) s.run.reinvestment = 1;
  s.run.enemy = null;
  s.run.status = e.wave === 21 ? "cleared" : "preparing";
  s.run.nextWaveAt = round(s.run.elapsed + getRaidInterval(s));
  log(s, `第${e.wave}波を撃退。`, "victory");
  if (e.wave === 21) {
    s.meta.clears++;
    s.settings.paused = true;
    s.run.acceleration.active = false;
    record(s);
  } else {
    syncCountries(s);
    if ([3, 9, 15].includes(e.wave)) offer(s, e.wave);
  }
  if (s.run.wave >= s.run.acceleration.limitWave)
    s.run.acceleration.active = false;
}
function battleRound(s) {
  const e = s.run.enemy;
  e.round++;
  function damage(n) {
    const dealt = Math.min(e.hp, Math.max(1, n - e.defense));
    e.hp = round(Math.max(0, e.hp - dealt));
    const entitled = round(e.xpBudget * (1 - e.hp / e.maxHp)),
      amount = Math.max(0, entitled - e.xpAwarded);
    e.xpAwarded = entitled;
    gain(
      s,
      "combat",
      amount * Math.min(2, 1 + 0.04 * (lv(s, "combat", true) - 1)),
      amount * 0.2,
    );
  }
  damage(getStats(s).attack);
  if (e.hp <= 0) return victory(s, e);
  const support = getStats(s).support;
  if (support) {
    damage(support);
    if (e.hp <= 0) return victory(s, e);
  }
  const stats = getStats(s),
    hits = (
      e.trait === "combo"
        ? [0.75, 0.75]
        : [e.trait === "heavy" && e.round % 4 === 0 ? 1.6 : 1]
    ).map((m) =>
      round(
        Math.max(
          1,
          (e.attack * m - stats.defense) *
            (e.round === 1 && aug(s, "wall_readiness") ? 0.6 : 1),
        ),
      ),
    );
  const packet = hits.reduce((a, b) => a + b, 0);
  if (
    s.run.resources.food > 0 &&
    s.run.hp < stats.maxHp &&
    (s.run.hp <= stats.maxHp * 0.55 || s.run.hp <= packet)
  ) {
    s.run.resources.food--;
    const heal = getFoodHealing(s);
    s.run.hp = Math.min(stats.maxHp, s.run.hp + heal);
    log(s, `食料で${heal}回復。`, "heal");
  }
  for (const hit of hits) {
    const before = s.run.hp;
    s.run.hp = round(s.run.hp - hit);
    if (s.run.hp <= 0) return die(s, e, before, hit);
  }
  if (e.charges > 0 && s.run.hp <= stats.maxHp * 0.35) {
    e.charges--;
    s.run.hp = round(
      Math.min(
        stats.maxHp,
        s.run.hp +
          stats.maxHp *
            0.22 *
            (aug(s, "healing_patrol") ? 1.3 : 1) *
            (getSynergies(s).includes("fortress") ? 1.2 : 1),
      ),
    );
    log(s, "救護処置。", "heal");
  }
}
function step(s, dt) {
  s.run.elapsed = round(s.run.elapsed + dt);
  if (s.run.status === "combat") {
    s.run.combatTimer = round(s.run.combatTimer + dt);
    if (s.run.combatTimer + 1e-8 >= 1.5) {
      s.run.combatTimer = round(s.run.combatTimer - 1.5);
      battleRound(s);
    }
    return;
  }
  if (s.run.status !== "preparing") return;
  if (s.run.elapsed + 1e-8 >= s.run.nextWaveAt) {
    beginRaid(s);
    return;
  }
  driveQueue(s);
  if (s.settings.paused) return;
  if (!s.run.activeAction && on(s, "stock_targets")) {
    for (const t of s.settings.stockTargets) {
      if (s.run.resources[t.id] >= t.count) continue;
      const p = getProductionSources(
        s,
        t.id,
        t.count - s.run.resources[t.id],
      )[0];
      if (p) {
        const r = resolveGoal(s, p.id);
        if (r.ok && r.id) {
          begin(s, r.id);
          s.run.activeAction.stock = true;
          break;
        }
      }
    }
  }
  const a = s.run.activeAction;
  if (a) {
    a.progress = round(a.progress + dt);
    if (a.progress + 1e-8 >= a.duration) {
      complete(s, a);
      s.run.activeAction = null;
      const q = s.run.queue[0];
      if (
        q &&
        a.goalId === q.goalId &&
        (q.kind === "action" || a.id === q.id)
      ) {
        if (--q.count <= 0) {
          s.run.queue.shift();
          event(s, "queue_complete");
        }
      }
      if (a.kind === "gather" && !a.goalId && !a.stock)
        s.run.activeAction = batch(s, a.id);
      s.run.queueManaged = false;
    }
  }
  helpers(s, dt);
  income(s, dt);
  if (s.run.facilities.infirmary) {
    s.run.healTimer = round(s.run.healTimer + dt);
    if (s.run.healTimer >= 4) {
      s.run.healTimer -= 4;
      const ef = effect(s, "infirmary"),
        max = getStats(s).maxHp;
      s.run.hp = round(
        Math.min(
          max,
          s.run.hp +
            (ef.prepHealFlat + max * ef.prepHealHpRatio) *
              (aug(s, "healing_patrol") ? 1.3 : 1),
        ),
      );
    }
  }
  if (!s.run.activeAction) {
    driveQueue(s);
    if (!s.run.activeAction && on(s, "stock_targets")) {
      for (const t of s.settings.stockTargets) {
        if (s.run.resources[t.id] >= t.count) continue;
        const sources = getProductionSources(
          s,
          t.id,
          t.count - s.run.resources[t.id],
        );
        for (const p of sources) {
          const r = resolveGoal(s, p.id);
          if (r.ok && r.id) {
            begin(s, r.id);
            s.run.activeAction.stock = true;
            break;
          }
        }
        if (s.run.activeAction) break;
      }
    }
    if (!s.run.activeAction && !s.run.queue.length && !s.run.idleWait)
      s.settings.paused = true;
  }
}
export function tick(s, seconds) {
  if (
    s.settings.paused ||
    !["preparing", "combat"].includes(s.run.status) ||
    s.run.augments.offer.length
  )
    return;
  s.run.simRemainder = round(
    s.run.simRemainder + Math.min(60, Math.max(0, seconds)),
  );
  while (s.run.simRemainder + 1e-8 >= 0.1 && !s.settings.paused) {
    s.run.simRemainder = round(s.run.simRemainder - 0.1);
    step(s, 0.1);
  }
  if (s.settings.paused) s.run.simRemainder = 0;
}
export function advanceTime(s, seconds) {
  let real = Math.min(60, Math.max(0, seconds));
  while (real > 1e-8 && !s.settings.paused) {
    const fast = s.run.acceleration.active && getAccelerationStatus(s).canStart;
    const chunk = Math.min(
      0.02,
      real,
      fast ? s.run.acceleration.remainingSeconds : real,
    );
    if (chunk <= 0) {
      s.run.acceleration.active = false;
      continue;
    }
    tick(s, chunk * (fast ? 5 : 1));
    if (fast)
      s.run.acceleration.remainingSeconds = round(
        Math.max(0, s.run.acceleration.remainingSeconds - chunk),
      );
    if (s.run.acceleration.remainingSeconds === 0)
      s.run.acceleration.active = false;
    real -= chunk;
  }
}
export const serializeGame = (s) => JSON.stringify(s);
export function migrateLegacy(old) {
  const s = createGame();
  s.meta = {
    ...s.meta,
    ...structuredClone(old.meta),
    totalPoints:
      old.meta.points +
      old.meta.upgrades.reduce((n, id) => n + (upgrades.get(id)?.cost || 1), 0),
    paidCosts: Object.fromEntries(old.meta.upgrades.map((id) => [id, 1])),
    defeatedBosses: old.meta.defeatedBosses.map(
      (w) =>
        C.encounters.find((e) => e.wave === Number(w) && e.boss)?.id ||
        `legacy_boss_wave_${w}`,
    ),
    clears: 0,
  };
  s.settings = { ...s.settings, ...old.settings };
  s.contentVersion = C.revision;
  s.run = freshRun(s.meta, s.settings);
  s.run.status = "legacy_setup";
  for (const id of old.meta.upgrades) event(s, "worker_purchase", { id });
  for (const e of Object.values(old.run.equipment)) {
    const d = defs.get(e.id);
    if (d) event(s, "craft", d);
  }
  s.run.legacyDraft = {
    upgrades: [...s.meta.upgrades],
    paidCosts: { ...s.meta.paidCosts },
    points: s.meta.points,
  };
  s.legacyMigration = true;
  return s;
}
