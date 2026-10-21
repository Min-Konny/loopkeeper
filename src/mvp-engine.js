import {mealByRecipe}from './meal-content.js?v=0.6.51';
import {initializeMeals,totalFood,mealEffects,consumeFood,consumeAutomaticFood,serveBattleMeal,advanceMeal}from './meals.js?v=0.6.51';
import {battlePressure,pressuredAttack}from './battle-pressure.js?v=0.6.51';
import {preparationEnemyAttack,preparationCostFactor,preparationChannelDuration,preparationRoute}from './preparation-balance.js?v=0.6.51';
import {lateLoop,lateEncounter,lateRelief}from './late-loop.js?v=0.6.51';
import {earlyLoop,earlyDefinition,earlyEncounter,earlyJobMultiplier}from './early-loop.js?v=0.6.51';
import {recordWorkMilestone}from './work-milestones.js?v=0.6.51';
import {awardTrophy,trophyShortage,payTrophies,refundUnfinishedTrophies} from './boss-materials.js?v=0.6.51';
import {EXTENDED_CAMPAIGN,FRONTIER_CAMPAIGN,CLASSIC_CAMPAIGN,campaignFinalWave,campaignIncludes,validCampaign,finalWaveForRun,campaignForRun,encountersForRun}from './campaign-rules.js?v=0.6.51';
import {investmentEffect}from './investments.js?v=0.6.51';
import {freshContracts,contractEffects}from './contracts.js?v=0.6.51';
import {initializeRoutes,freshRoutes,routeById,routeEffects,canEnterRoute,finishRoute}from './routes.js?v=0.6.51';
import {freshFarm,advanceFarm}from './farm-state.js?v=0.6.51';import {farmResource,resourceCap}from './farm-content.js?v=0.6.51';
import {companionById}from './companion-content.js?v=0.6.51';
import {activeCompanion,freshCompanion,beginCompanionFight,companionWork,companionCritical,companionPacket}from './companion-state.js?v=0.6.51';
import {freshMagic,initializeMagic,advanceMagic,casterMultiplier,physicalIgnition,wardPacket}from './magic-state.js?v=0.6.51';import {alchemyResource}from './magic-content.js?v=0.6.51';
import {weaponById}from './gear-content.js?v=0.6.51';
import {initializeGear,accessoryEffects,combatBuild,strikeModifier,changeGear}from './gear-state.js?v=0.6.51';
import {createProgression,rewardRepeatVictory,rewardFrontierAttempt}from './progression-rewards.js?v=0.6.51';
import {createRunResults,recordArrival,recordClear,runSummary}from './run-results.js?v=0.6.51';
import {LEGACY_RANKS,MAX_LEGACY_RANK,rankId}from './legacy-rank-definitions.js?v=0.6.51';
import {hasUpgrade,isFreeFeature,synchronizeFreeFeatures}from './free-features.js?v=0.6.51';
import { maximumTradeCount } from './maximum-trade.js?v=0.6.51';
import { startingGrant } from './starting-resources.js?v=0.6.51';
import { tradeSaleUnit } from './fish-economy.js?v=0.6.51';
import { trainingCandidates } from './prerequisite-training.js?v=0.6.51';
import { recordReward } from './reward-events.js?v=0.6.51';
import { observesWork, completedWork } from './work-completion.js?v=0.6.51';
import { reinforcementCost, reinforcementEffect, endlessEnemy } from './endless.js?v=0.6.51';
import { validCondition, goalSatisfied, isCombatTraining } from './queue-conditions.js?v=0.6.51';
import { strategy, newStrategy, challengeResults } from './strategy.js?v=0.6.51';
import { CONTENT as C } from "./content.js?v=0.6.51";
import { A2_ENCOUNTERS } from "./content-a2-encounters.js?v=0.6.51";
import { A1_ENCOUNTERS } from "./content-a1-encounters.js?v=0.6.51";
import {
  SKILLS,
  getSkillProgress,
  LEGACY_UPGRADES as OLD_UPGRADES,
} from "./legacy-engine.js?v=0.6.51";
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
      ? "攻撃力を鍛える。"
      : a.trainingStat === "defense" ? "防御力を鍛える。" : a.trainingStat === "vitality" ? "最大HPを鍛える。" : Object.entries(a.yields)
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
    smokehouse: '魚料理の加工速度 +25% / 食料の回復量 +4',
    watchtower: `襲撃猶予 +${f.effect.raidDelay}秒`,
    barricade: `防御 +${f.effect.defense}`,
    infirmary: `準備中に回復 / 戦闘処置 ${f.effect.treatmentCharges}回`,
    workshop: `製作速度 +${Math.round(f.effect.craftSpeed * 100)}%`,
    market: `木材10 → 金貨${f.effect.woodSaleAmount}${f.level>=2 ? ` / 対象素材の購入${Math.round(f.effect.purchaseDiscount*100)}%引き（小数反映）` : ""}`,
    guardhouse: `支援攻撃 ${f.effect.supportAttack}`,
    archery_tower: `弓支援 ${f.effect.rangedAttack} / 飛行に2.5倍`,
  })[f.facilityId];
export const RECIPES = [
  ...C.equipment.map((e) => ({
    ...e,
    equipment: { slot: e.slot, name: e.name, tier: e.tier, ...e.stats },
    description: e.description || statText(e.stats),
  })),
  ...C.processing.map((p) => ({
    ...p,
    description: p.description || Object.entries(p.yields)
      .map(([r, n]) => `${RESOURCES[r].name} +${n}`)
      .join(" / "),
  })),
  ...C.facilities.map((f) => ({
    ...f,
    name: f.name + [" I", " II", " III", " IV", " V"][f.level - 1],
    facility: { id: f.facilityId, level: f.level, name: f.name },
    description: f.description || effectText(f),
  })),
];
const augmentDescriptions = {
  forestry: "伐採・採掘時間 −20%",
  builder: "施設素材 −25%",
  warrior: "攻撃 +18%",
  drill: "訓練時間 −30%",
  provisions: "食料回復 +30%",
  guard: "防御 +15%",
  timber_contract: "本人の伐採で実際に得た木材1個につき金貨0.6。木材は残る（職人・購入は対象外）",
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
  description: augmentDescriptions[a.id] || a.description,
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
  hasUpgrade(s,id) && !s.settings.disabledUpgrades.includes(id);
const aug = (s, id) => s.run.augments.selected.includes(id);
const effect = (s, id) =>
  reinforcementEffect(id, s.run.endless?.levels[id] || 0, C.facilities.find(
    (f) => f.facilityId === id && f.level === (s.run.facilities[id] || 0),
  )?.effect || {});
const log = (s, text, type = "info") => {
  s.run.log.unshift({ id: ++s.run.logSeq, time: s.run.elapsed, text, type });
  s.run.log.length = Math.min(40, s.run.log.length);
};
const progressRates=new WeakMap();
function freshRun(meta, settings, campaign=FRONTIER_CAMPAIGN) {
  return {
    campaign,...([1,2].includes(meta.preparationBalanceVersion)?{preparationBalanceVersion:meta.preparationBalanceVersion}:{}),...(meta.earlyLoopVersion===1?{earlyLoopVersion:1}:{}),...(meta.lateLoopVersion===1?{lateLoopVersion:1}:{}),
    trophyClaims:[],regionalClaims:[],
    strategy: { ...newStrategy(), eligible: meta.clears > 0 },
    battleReports: [],
    results:createRunResults(meta),
    progression:createProgression(meta,campaignFinalWave(campaign)),
    encounterDepth: true,
    status: "preparing",
    elapsed: 0,
    wave: 0,
    nextWaveAt: 180,
    raidTimingVersion: 3,
    mealVersion:1,mealEffect:null,
    hp: 100,
    resources: Object.fromEntries(C.resources.map((r) => [r.id, 0])),
    skills: skills(),
    training: {defense:0, vitality:0},
    equipment: {},
    ownedEquipment:[],
    playerCombatTimer:0,
    magicState:freshMagic(),
    companionState:freshCompanion(),farmState:freshFarm(),routes:freshRoutes(),contracts:freshContracts(),
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
    automationOnly:false,
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
      rerollsUsed: 0,
      exclusionVersion:1,excluded:[],exclusionsUsed:0,
      investmentTimer: 0,
    },
    acceleration: {
      active: false,
      remainingSeconds: (meta.upgrades.includes("acceleration_extension") || (meta.freeFeatures||[]).includes("acceleration_extension") || meta.bestWave>=9) && !settings.disabledUpgrades.includes("acceleration_extension")
        ? Math.max(120, meta.bestWave * 57)
        : 120,
      limitWave: meta.bestWave,
    },
    startPermanentXp: Object.fromEntries(
      SKILLS.map((x) => [x.id, meta.skills[x.id].xp]),
    ),
  };
}
export function createGame({campaign=FRONTIER_CAMPAIGN,earlyLoopPrototype=false,earlyLoopBatching=true,earlyLoopFishBatching=true,lateLoopPrototype=false,preparationBalancePrototype=false}={}) {
  if(!validCampaign(campaign))throw Error("Unknown campaign");
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
    challengeBadges: [],
  };
  if(preparationBalancePrototype)meta.preparationBalanceVersion=2;
  if(lateLoopPrototype)meta.lateLoopVersion=1;
  if(earlyLoopPrototype){meta.earlyLoopVersion=1;if(earlyLoopBatching===false)meta.earlyLoopBatching=false;if(earlyLoopFishBatching===false)meta.earlyLoopFishBatching=false;}
  const settings = {
    paused: true,
    speed: 1,
    disabledUpgrades: [],
    showHiddenRecipes: false,
    hiddenRecipes: [],
    soundVolume: 0.3,
    musicVolume: 0.15,
    effectsEnabled: true,
    pauseWhenHidden: false,
    foodTarget: 12,
    processingTarget: 6,
    stockTargets: [],
    workerTargets: {},
    craftMaterialPriority: [],
  };
  const s = {
    version: 2,
    schemaVersion: 2,
    contentVersion: C.revision,
    meta,
    settings,
    run: freshRun(meta, settings,campaign),
  };
  synchronizeFreeFeatures(s);
  log(s, "最初の襲撃まで3分。資源と食料を備えよう。");
  return s;
}
export function isKnown(s, d) {
  if (typeof d === "string") d = defs.get(d);
  return (
    !!d && campaignIncludes(s,d.campaign) && (!d.endlessFacility || s.run.endless?.active) &&
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
    runMaxHp: id === "combat" ? (getSkillProgress(s.run.training?.vitality ?? s.run.skills.combat.xp).level - 1) * 18 : 0,
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
function defeatedCountryBonus(s, key) {
  return C.diplomacy.reduce((total, country) => total +
    (s.run.countries[country.id]?.status === "defeated" ? country.defeatEffect?.[key] || 0 : 0), 0);
}
export function getStats(s) {
  const r = lv(s, "combat") - 1,
    p = lv(s, "combat", true) - 1;
  let attack = 6 + r * 2 + p * 0.7 + s.run.runAttack,
    defense = p * 0.2 + (getSkillProgress(s.run.training?.defense || 0).level - 1) * 1.5,
    maxHp = 100 + (s.contentVersion === "A2.1" ? (getSkillProgress(s.run.training?.vitality || 0).level - 1) * 18 : r * 10) + p * 4;
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
  maxHp += effect(s, "barricade").maxHp || 0;
  const syn = getSynergies(s);
  defense +=
    (effect(s, "barricade").defense || 0) *
    (syn.includes("fortress") ? 1.25 : 1);
  if (s.run.diplomacy.mercenary) attack += 5;
  if (aug(s, "momentum")) attack += s.run.wave * 0.7;
  attack *=
    1 + (aug(s, "warrior") ? 0.18 : 0) + (syn.includes("martial") ? 0.12 : 0) + defeatedCountryBonus(s, "attackPercent");
  const contract=contractEffects(s);defense+=contract.defense||0;maxHp+=contract.maxHp||0;
  const regional=routeEffects(s);attack+=regional.attack||0;defense+=regional.defense||0;maxHp+=regional.maxHp||0;
  const accessory=accessoryEffects(s);defense=Math.max(0,defense+(accessory.defense||0));
  defense *= 1 + (aug(s, "guard") ? 0.15 : 0);
  if (aug(s, "shield_master")) attack += defense * .2;
  return {
    attack: round(attack*(1+(mealEffects(s).attack||0))),
    defense: round(defense),
    maxHp: round(maxHp),
    speed: s.run.equipment.tool?.speed || 0,
    support: (effect(s, "guardhouse").supportAttack || 0) * (aug(s, "supply_lines") && (s.run.enemy ? s.run.enemy.supplied : totalFood(s) >= 20) ? 1.35 : 1),
    ranged: effect(s, "archery_tower").rangedAttack || 0,
  };
}
export function getFoodHealing(s) {
  return Math.floor(
    (30 + getStats(s).maxHp * 0.1) * (aug(s, "provisions") ? 1.3 : 1) + (effect(s, 'smokehouse').foodHealingFlat || 0)+(contractEffects(s).foodHealing||0),
  );
}
export function getRaidInterval(s) {
  return (s.run.campaign===FRONTIER_CAMPAIGN&&s.run.wave>=24?120:180) + (effect(s, "watchtower").raidDelay || 0);
}
export function getActionDuration(s, d) {
  if (typeof d === "string") d = defs.get(d);
  d=earlyDefinition(s,d);
  let multiplier = 1;
  if (aug(s, "forestry") && ["logging", "mining"].includes(d.skill))
    multiplier *= 0.8;
  if (aug(s, "drill") && d.trainingStat) multiplier *= 0.7;
  if (aug(s, "construction_rush") && ["logging", "mining", "foraging"].includes(d.skill) && !d.cost && s.run.elapsed < (s.run.strategy?.constructionUntil || 0)) multiplier *= .8;
  if (d.trainingStat && aug(s, "last_stand") && s.run.nextWaveAt - s.run.elapsed <= 45) multiplier *= .65;
  if (d.trainingStat && aug(s, "trade_school")) multiplier *= 1 - .04 * (s.run.facilities.market || 0);
  if(d.skill==="logging")multiplier*=1-(routeEffects(s).loggingSpeed||0);
  const investmentSpeed=d.skill==="combat"?0:!d.cost?investmentEffect(s,"gatherSpeed"):d.kind==="alchemy"?investmentEffect(s,"alchemySpeed"):investmentEffect(s,"craftSpeed");
  const fishingSpeed=d.id==='fish_river'?1+(accessoryEffects(s,'preparation').fishingSpeed||0):1;
  const speed = fishingSpeed*
    (1+investmentSpeed)*(1 + 0.1 * (lv(s, d.skill) - 1)) *
    (1 + 0.08 * (lv(s, d.skill, true) - 1)) *
    (1 + (s.run.equipment.tool?.speed || 0)) *
    (d.id === 'cook_fish' ? 1 + (effect(s, 'smokehouse').fishCookingSpeed || 0) : 1) *
    (d.cost ? 1 + (effect(s, "workshop").craftSpeed || 0) : 1) *
    (!d.trainingStat?1+(accessoryEffects(s,'preparation').workSpeed||0)+(d.skill==='combat'?0:contractEffects(s).workSpeed||0):1);
  return round(Math.max(0.25, (d.duration * multiplier) / speed));
}
export function getRecipeCost(s, d) {
  if (typeof d === "string") d = defs.get(d);
  d=earlyDefinition(s,d);
  let discount = (d?.facility || d?.endlessFacility) && aug(s, "builder") ? 0.25 : 0;
  if (d?.equipment && s.run.reinvestment > 0) discount += 0.25;
  return Object.fromEntries(
    Object.entries(d?.endlessFacility ? reinforcementCost(s, d) : d?.cost || {}).map(([id, n]) => [
      id,
      Math.max(
        1,
        Math.ceil(n * preparationCostFactor(s,d) * (1 - (id === "gold" ? 0 : Math.min(0.5, discount)))),
      ),
    ]),
  );
}
function reward(s, id) {
  if (s.meta.completedMilestones.includes(id)) return;
  s.meta.completedMilestones.push(id);
  s.meta.points++;
  s.meta.totalPoints++;
  recordReward(s,"points","",s.meta.points-1,s.meta.points);
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
  if(d.kind==='alchemy'&&Object.keys(d.yields).some(id=>(s.run.resources[id]||0)>=12))return fail('錬金在庫の上限12に到達しています。');
  if (s.run.status !== "preparing") return fail("準備中に選んでください。");
  if (s.run.augments.offer.length)
    return fail("オーグメントを選んでください。");
  if (s.run.suspendedActions[id]?.trophyReceipt?.version===0) return ok();
  if (!isKnown(s, d)) return fail("先のボスを撃退すると発見できます。");
  if (!ignoreActive && s.run.activeAction?.id === id)
    return fail("作業中です。");
  if (s.run.suspendedActions[id]) return ok();
  const missingTrophy=trophyShortage(s,id);if(missingTrophy)return fail(missingTrophy);
  if (lv(s, d.skill) < d.unlockLevel)
    return fail(
      `${SKILLS.find((x) => x.id === d.skill).name} Lv.${d.unlockLevel}が必要。`,
    );
  if (d.endlessFacility && (s.run.endless?.levels[d.endlessFacility] || 0) >= 10000) return fail("追加強化の上限に到達しました。");
  if (d.endlessFacility && (!s.run.endless?.active || (s.run.facilities[d.endlessFacility] || 0) < 5)) return fail("エンドレスで施設Vを建設すると追加強化できます。");
  if (d.facility) {
    const current = s.run.facilities[d.facility.id] || 0;
    if (current >= d.level) return fail("建設済みです。");
    if (current !== d.level - 1) return fail("先に前段階を建設してください。");
  }
  if(d.accessory&&s.meta.accessories?.includes(d.accessory))return fail('永久所持済みです。');
  if (d.equipment && (s.run.ownedEquipment?.includes(id) || s.run.equipment[d.slot]?.id === id))
    return fail("所持済みです。状態・装備で切り替えられます。");
  if (d.previousEquipmentId && (s.run.equipment[d.slot]?.tier || 0) != d.tier - 1)
    return fail(`${defs.get(d.previousEquipmentId).name}から強化してください。`);
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
  const d = earlyDefinition(s,defs.get(id));
  const trophyReceipt=payTrophies(s,id);
  const paidCost = getRecipeCost(s, d);
  for (const [r, n] of Object.entries(paidCost))
    s.run.resources[r] = round(s.run.resources[r] - n);
  if (d.equipment && s.run.reinvestment) s.run.reinvestment = 0;
  return {
    id,...(d.earlyLoopDefinition?{earlyLoopBatch:1}:{}),
    ...(mealByRecipe(id)?{mealOutputVersion:1}:{}),
    instanceId: ++s.run.workSeq,
    channel,
    paidCost,
    ...(trophyReceipt?{trophyReceipt}:{}),
    kind: d.cost ? "craft" : "gather",
    progress: 0,
    duration: round(preparationChannelDuration(s,d,channel,getActionDuration(s,d)*durationMultiplier,lv(s,d.skill,true))),
    ...getActionXp(s,id),
  };
}
function begin(s, id) {
  delete s.run.manualRepeat;
  s.run.idleWait=false;s.run.automationOnly=false;
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
  if(s.run.manualRepeat)s.run.acceleration.active=false;
  delete s.run.manualRepeat;
  s.run.idleWait=false;s.run.automationOnly=false;
  suspend(s);
  s.settings.paused = true;
  return ok();
}
export function canStartManualRepeat(s){
 if(s.version===1||s.run.status!=='preparing'||s.run.augments.offer.length)return fail('準備中に連続精錬を選んでください。');
 if(on(s,'action_queue')&&s.run.queue.length)return fail('行動予約を停止してから連続精錬を選んでください。');
 const a=s.run.activeAction?.id==='smelt_iron'?s.run.activeAction:s.run.suspendedActions.smelt_iron;
 if(a&&(a.channel!=='main'||a.goalId!==undefined||a.stock||s.run.queueManaged))return fail('予約・在庫補充の精錬は既存の回数指定で進めてください。');
 return a?ok():canStartAction(s,'smelt_iron');
}
export function startManualRepeat(s){
 const check=canStartManualRepeat(s);if(!check.ok)return check;
 if(s.run.activeAction?.id!=='smelt_iron'){const result=startAction(s,'smelt_iron');if(!result.ok)return result;}
 s.run.manualRepeat='smelt_iron';s.run.idleWait=false;s.run.automationOnly=false;s.settings.paused=false;return ok();
}
function gain(s, skill, run, perm, focus) {
  const before = getStats(s).maxHp,
    old = lv(s, skill);
  if (skill === "combat") {
    s.run.training ||= {defense:0,vitality:s.run.skills.combat.xp * .5};
    if (focus === "defense" || focus === "vitality") {
      s.run.training[focus] = round(Math.min(1e9,s.run.training[focus]+run));run=0;
    } else if (!focus) s.run.training.vitality=round(Math.min(1e9,s.run.training.vitality+run*.5));
  }
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
export function getActionYields(s, d, channel = "main") {
  if (typeof d === "string") d = defs.get(d);
  d=earlyDefinition(s,d);
  const bonus = channel === "main" && aug(s, "well_stocked") && totalFood(s) >= 20 && !d.cost && ["logging", "mining"].includes(d.skill) ? (d.earlyLoopUnits||1) : 0;
  return Object.fromEntries(Object.entries(d.yields || {}).map(([r,n])=>[r,n+bonus]));
}
function complete(s, a) {
  const original=defs.get(a.id);
  let d = a.earlyLoopBatch===1?earlyDefinition(s,original,{paid:true}):{...original,earlyLoopDefinition:true};
  if(mealByRecipe(a.id)&&a.mealOutputVersion!==1)d={...d,yields:{food:mealByRecipe(a.id).units}};
  for(const material of recordWorkMilestone(s,d,a.earlyLoopBatch===1?earlyJobMultiplier(d.id):1))log(s,material.name+' +1（作業実績の特殊素材）','permanent');
  const observed = (a.channel === 'main' || a.channel === 'auto_cook') && observesWork(s);
  const gains = observed ? {} : null;
  const woodBefore = s.run.resources.wood;
  const training = ['defense', 'vitality'].includes(d.trainingStat) ? d.trainingStat : null;
  const xpBefore = observed ? (training ? s.run.training[training] : s.run.skills[d.skill].xp) : 0;
  for (const [r, n] of Object.entries(getActionYields(s, d, a.channel))) {
    const before = s.run.resources[r];
    s.run.resources[r] = round(Math.min(resourceCap(r), before + n));
    if (gains && s.run.resources[r] > before) gains[r] = s.run.resources[r] - before;
  }
  const petWood=companionWork(s,d,a,Math.max(0,s.run.resources.wood-woodBefore));if(gains&&petWood)gains.wood=(gains.wood||0)+petWood;
  if (a.channel === "main" && d.id === "train_combat" && aug(s, "weapon_master")) strategy(s).focus = Math.min(30, strategy(s).focus + 1);
  if (a.channel === 'main' && aug(s, 'timber_contract') && d.skill === 'logging') {
    const delivered = Math.max(0, s.run.resources.wood - woodBefore);
    const rate = C.augments.find(x=>x.id==='timber_contract').values.goldPerWood;
    s.run.resources.gold = round(Math.min(1e9, s.run.resources.gold + delivered * rate));
  }
  if(d.accessory){initializeGear(s);if(!s.meta.accessories.includes(d.accessory))s.meta.accessories.push(d.accessory);log(s,d.name+'を永久所持に加えた。','craft');}
  if (d.equipment) {
    initializeGear(s);if(!s.run.ownedEquipment.includes(d.id))s.run.ownedEquipment.push(d.id);
    s.run.equipment[d.slot] = { id: d.id, ...d.equipment };
    s.run.hp = Math.min(s.run.hp, getStats(s).maxHp);
    log(s, `${d.name}を装備した。`, "craft");
  }
  if (d.facility) {
    if (aug(s, "construction_rush")) strategy(s).constructionUntil = s.run.elapsed + 90;
    if (aug(s, "salvage")) for (const r of ["wood", "stone"]) s.run.resources[r] = round(s.run.resources[r] + (a.paidCost?.[r] || 0) * .15);
    const oldDelay = effect(s, "watchtower").raidDelay || 0;
    s.run.facilities[d.facility.id] = d.level;
    s.run.nextWaveAt = round(
      s.run.nextWaveAt + (effect(s, "watchtower").raidDelay || 0) - oldDelay,
    );
    log(s, `${d.name}が完成。`, "craft");
  }
  if (d.endlessFacility) {
    const oldDelay = effect(s, "watchtower").raidDelay || 0;
    s.run.endless.levels[d.endlessFacility] = (s.run.endless.levels[d.endlessFacility] || 0) + 1;
    s.run.nextWaveAt = round(s.run.nextWaveAt + (effect(s, "watchtower").raidDelay || 0) - oldDelay);
    if (aug(s, "construction_rush")) strategy(s).constructionUntil = s.run.elapsed + 90;
    if (aug(s, "salvage")) for (const r of ["wood", "stone"]) s.run.resources[r] = round(s.run.resources[r] + (a.paidCost?.[r] || 0) * .15);
    log(s, `${d.name} +${s.run.endless.levels[d.endlessFacility]} が完成。`, "craft");
  }
  event(s, "craft", d);
  if (getSynergies(s).length) event(s, "synergy");
  gain(s, d.skill, a.runXp, a.permanentXp, d.trainingStat);
  if (observed) completedWork(s, {id:d.id, skill:d.skill, kind:a.kind,
    resourceGains:gains, trainingGain:!Object.keys(d.yields || {}).length && d.skill === 'combat' ? (training ? s.run.training[training] : s.run.skills[d.skill].xp) - xpBefore : 0,
    created:!!(d.equipment || d.facility || d.endlessFacility || d.accessory)});
}

// Resolve only the next required batch. Re-evaluate after every completion or helper delivery.
// Pure estimates share the real yield rules and preserve already-paid historical batches.
export function getPlanningYields(s,d,saved=null){
 if(typeof d==='string')d=defs.get(d);
 const definition=saved?(saved.earlyLoopBatch===1?earlyDefinition(s,d,{paid:true}):{...d,earlyLoopDefinition:true}):d;
 return getActionYields(s,saved&&mealByRecipe(d.id)&&saved.mealOutputVersion!==1?{...definition,yields:{food:mealByRecipe(d.id).units}}:definition);
}
export function getRequiredProductionBatches(s,d,resource,shortage,saved=null){
 const fresh=getPlanningYields(s,d)[resource];
 return saved?1+Math.max(0,Math.ceil((shortage-(getPlanningYields(s,d,saved)[resource]||0))/fresh)):Math.ceil(shortage/fresh);
}
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
    for (const [r, cost] of orderedMaterialCosts(getRecipeCost(s, d), s.settings.craftMaterialPriority || [])) {
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
            getRequiredProductionBatches({...s,run:{...s.run,resources:stock}},source,r,missing,!paid.has(source.id)&&(s.run.activeAction?.id===source.id?s.run.activeAction:s.run.suspendedActions[source.id])),
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
    const context={...s,run:{...s.run,resources:stock}},fresh=getPlanningYields(context,d),first=saved?getPlanningYields(context,d,saved):fresh;
    for(const r of Object.keys(fresh))stock[r]=(stock[r]||0)+(first[r]||0)+fresh[r]*(count-1);
    return seconds;
  }
  return [...ACTIONS, ...RECIPES]
    .filter((d) => d.yields?.[resource] && available(d))
    .map((d) => ({
      d,
      seconds: estimate(
        d,
        getRequiredProductionBatches({...s,run:{...s.run,resources:inventory}},d,resource,shortage,!alreadyPaid.has(d.id)&&(s.run.activeAction?.id===d.id?s.run.activeAction:s.run.suspendedActions[d.id])),
        { ...inventory },
        visiting,
        new Set(alreadyPaid),
      ),
    }))
    .filter((x) => Number.isFinite(x.seconds))
    .sort((a, b) => a.seconds - b.seconds)
    .map((x) => x.d);
}
export function getActionXp(s,id){const d=earlyDefinition(s,defs.get(id));if(!d)throw Error("Unknown action: "+id);const xpBonus=aug(s,"field_training")&&d.trainingStat?1.25:1;return {runXp:d.duration*2*d.xpCoefficient*Math.min(2,1+.04*(lv(s,d.skill,true)-1))*xpBonus,permanentXp:d.duration*.3*d.xpCoefficient*xpBonus};}
function trainForGoal(s,d,visiting){
 const seen=new Set([...visiting,d.id]);
 for(const candidate of trainingCandidates(s,d,{definitions:[...ACTIONS,...RECIPES],levelFor:skill=>lv(s,skill),known:x=>isKnown(s,x),costFor:x=>getRecipeCost(s,x),durationFor:x=>getActionDuration(s,x),visiting:seen})){
  const result=resolveGoal(s,candidate.id,seen);
  if(result.ok && result.id)return {...result,training:result.training || {skill:d.skill,level:d.unlockLevel,goal:d.id}};
 }
 return {...fail(SKILLS.find(x=>x.id===d.skill).name+" Lv."+d.unlockLevel+"が必要です。実行可能な採集・製作で技能を育ててから再開してください。"),skill:d.skill};
}
export function resolveGoal(s, id, visiting = new Set()) {
  const d = defs.get(id);
  if (!d) return fail("作業がありません。");
  if (d.endlessFacility && !s.run.endless?.active) return fail("エンドレスで解放されます。");
  if (d.endlessFacility && (s.run.facilities[d.endlessFacility] || 0) < 5) return resolveGoal(s, `${d.endlessFacility}_level_5`, new Set([...visiting, id]));
  if (visiting.has(id)) return fail("材料の循環があります。");
  if (s.run.suspendedActions[id]?.trophyReceipt?.version===0)return {...ok(),id};
  if (!isKnown(s, d)) return fail("未発見です。");
  if (s.run.suspendedActions[id]) return { ...ok(), id };
  if(d.accessory&&s.meta.accessories?.includes(d.accessory))return {...ok(),done:true};
  const missingTrophy=trophyShortage(s,id);if(missingTrophy)return fail(missingTrophy);
  if (d.facility && (s.run.facilities[d.facility.id] || 0) >= d.level)
    return { ...ok(), done: true };
  if (d.equipment && (s.run.ownedEquipment?.includes(id) || s.run.equipment[d.slot]?.id === id))
    return { ...ok(), done: true };
  const seen = new Set([...visiting, id]);
  if (d.previousEquipmentId && (s.run.equipment[d.slot]?.tier || 0) != d.tier - 1) {
    if ((s.run.equipment[d.slot]?.tier || 0) >= d.tier && !weaponById(s.run.equipment[d.slot]?.id)) return { ...ok(), done: true };
    if(s.run.ownedEquipment?.includes(d.previousEquipmentId))return {...ok(),equipId:d.previousEquipmentId};
    return resolveGoal(s, d.previousEquipmentId, seen);
  }
  if (d.facility && (s.run.facilities[d.facility.id] || 0) < d.level - 1)
    return resolveGoal(s, d.requires[0], seen);
  if (lv(s,d.skill)<d.unlockLevel) return trainForGoal(s,d,visiting);
  let unavailable = null;
  const priority = s.settings.craftMaterialPriority || [];
  for (const [r, n] of orderRecipeMaterials(s,d,s.run.resources,1,new Set(),seen)) {
    if (s.run.resources[r] >= n) continue;
    const producers = getProductionSources(
      s,
      r,
      n - s.run.resources[r],
      s.run.resources,
      seen,
    );
    for(const source of [...ACTIONS,...RECIPES].filter(x=>x.yields?.[r] && isKnown(s,x) && !seen.has(x.id)).sort((a,b)=>(a.unlockLevel || 1)-(b.unlockLevel || 1) || getActionDuration(s,a)-getActionDuration(s,b)))if(!producers.some(p=>p.id===source.id))producers.push(source);
    let reason = "";
    for (const p of producers) {
      const result = resolveGoal(s, p.id, seen);
      if (result.ok) return result;
      reason = result.reason;
    }
    const locked = ACTIONS.filter(p => p.yields?.[r] && isKnown(s, p) && lv(s, p.skill) < p.unlockLevel).sort((a, b) => a.unlockLevel - b.unlockLevel)[0];
    if(locked){const training=resolveGoal(s,locked.id,seen);if(training.ok)return training;}
    const failure = locked ? { ...fail(`${RESOURCES[r].name}を集めるには${SKILLS.find(x => x.id === locked.skill).name} Lv.${locked.unlockLevel}が必要。`), skill: locked.skill } : fail(
      reason ||
        `${RESOURCES[r].name}不足。${r === "hide" ? "撃退または市場で入手。" : r === "gold" ? (s.run.facilities.market ? "襲撃を撃退、または市場で資源を売却。" : "襲撃の撃退で入手。市場の建設後は資源売却でも入手。") : "技能を上げてください。"}`,
    );
    if (!priority.length) return failure;
    unavailable ||= failure;
  }
  return unavailable || { ...ok(), id };
}
export function setMaterialPriority(s, priority) {
  if (!hasUpgrade(s,"action_queue")) return fail('行動予約を解放してください。');
  if (!validMaterialPriority(priority)) return fail('素材は重複せず、優先したい順に指定してください。');
  if (priority.some(id => !resourceKnown(s, id) || id === 'gold' && !getUnlocks(s).facilities)) return fail('未発見の素材は指定できません。');
  s.settings.craftMaterialPriority = [...priority];
  return ok();
}
export function enqueueAction(
  s,
  id,
  count = 1,
  kind = defs.get(id)?.cost ? "goal" : "action",
) {
  if (!on(s, "action_queue")) return fail("行動予約を解放してください。");
  if (!isKnown(s, id)) return fail("未発見です。");
  if (!Number.isInteger(count) || count < 1 || count > 99)
    return fail("回数は1〜99の整数で指定してください。");
  if (s.run.queue.length >= 8)
    return fail("行動予約が8件でいっぱいです。不要な予約を削除してください。");
  if (s.run.status !== "preparing") return fail("準備中に予約してください。");
  if (defs.get(id)?.equipment || defs.get(id)?.facility || defs.get(id)?.endlessFacility || defs.get(id)?.accessory) {
    if (s.run.queue.some(q => q.id === id)) return fail("既に予約しています。");
    count = 1;
  }
  if(defs.get(id)?.equipment&&s.run.ownedEquipment?.includes(id)&&s.run.activeAction?.id!==id&&!s.run.suspendedActions[id])return fail("所持済みです。状態・装備で切り替えられます。");
  delete s.run.manualRepeat;
  s.run.queue.push({ id, count, kind, goalId: ++s.run.queueSeq });
  if (s.run.queue.length === 1 && s.run.activeAction?.kind !== "craft") {
    const check = kind === "goal" ? resolveGoal(s, id) : canStartAction(s, id, true);
    if (!check.ok) {
      s.run.blockedReason = check.reason;
      s.settings.paused = true;
    }
  }
  return ok();
}
export function enqueueConditional(s, id, until) {
  if (!on(s, "queue_templates")) return fail("手順テンプレートを解放すると条件を指定できます。");
  if (!validCondition({id, until})) return fail("この作業には指定できない条件です。");
  if (until.type === "unlock" && !isKnown(s, until.recipe)) return fail("未発見の装備です。");
  const result = enqueueAction(s, id, 1);
  if (result.ok) s.run.queue.at(-1).until = { ...until };
  return result;
}
export function enqueueTrainingLevel(s,id,target){
 const until={type:'level',target,pauseAfter:false};
 if(s.version!==2||!isCombatTraining(id)||!validCondition({id,until}))return fail('目標レベルは2〜100の整数で指定してください。');
 if(!on(s,'action_queue'))return fail('行動予約を解放してください。');
 if(s.run.status!=='preparing')return fail('準備中に予約してください。');
 if(!isKnown(s,id))return fail('未発見です。');
 if(goalSatisfied(s,{id,until}))return {...ok(),skipped:true};
 const result=enqueueAction(s,id,1,'action');if(result.ok)s.run.queue.at(-1).until=until;return result;
}
export function editQueuedTrainingLevel(s,index,target){
 const q=s.run.queue[index];if(s.version!==2||!q||!isCombatTraining(q.id)||q.until?.type!=='level')return fail('この予約は目標レベル指定ではありません。');
 if(!validCondition({...q,until:{...q.until,target}}))return fail('目標レベルは2〜100の整数で指定してください。');
 if(q.until.target===target)return ok();s.settings.paused=true;detach(s);q.until.target=target;return ok();
}
export const enqueueGoal = (s, id, count = 1) =>
  enqueueAction(s, id, count, "goal");
function detach(s) {
  delete s.run.manualRepeat;
  if (s.run.queueManaged) {
    if (s.run.activeAction?.kind === "gather") suspend(s);
    else if (s.run.activeAction) delete s.run.activeAction.goalId;
  }
  if (s.run.activeAction?.kind === "craft") delete s.run.activeAction.goalId;
  for (const a of Object.values(s.run.suspendedActions)) delete a.goalId;
  s.run.queueManaged = false;
}
export function editQueuedAction(s, i, n) {
  if (!s.run.queue[i] || !Number.isInteger(n) || n < 1 || n > 99)
    return fail("回数1〜99。");
  s.settings.paused = true;
  detach(s);
  const d = defs.get(s.run.queue[i].id);
  s.run.queue[i].count = d?.equipment || d?.facility || d?.endlessFacility || d?.accessory ? 1 : n;
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
      q.kind === "goal" || defs.get(q.id)?.equipment && s.run.ownedEquipment?.includes(q.id) ? resolveGoal(s, q.id) : canStartAction(s, q.id, true);
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
  if(s.run.manualRepeat&&on(s,'action_queue')&&s.run.queue.length)delete s.run.manualRepeat;
  if (!on(s, "action_queue") || !s.run.queue.length) return;
  const trainingGoal=s.run.queue[0];
  if(s.run.queueManaged&&s.run.activeAction?.kind==='gather'&&isCombatTraining(trainingGoal.id)&&trainingGoal.until?.type==='level'&&s.run.activeAction.goalId===trainingGoal.goalId&&goalSatisfied(s,trainingGoal)){
    const id=s.run.activeAction.id;suspend(s);delete s.run.suspendedActions[id].goalId;s.run.queueManaged=false;
  }
  if (s.run.activeAction) {
    if (s.run.queueManaged || s.run.activeAction.kind === "craft") return;
    // A manual gathering loop must yield to an explicitly enabled reservation.
    // Keep its partial work so returning to it never wastes progress.
    suspend(s);
  }
  while (s.run.queue.length) {
    const q = s.run.queue[0];
    const owned = defs.get(q.id)?.equipment && s.run.ownedEquipment?.includes(q.id) && !s.run.suspendedActions[q.id];
    if(owned){s.run.queue.shift();continue;}
    if (goalSatisfied(s, q)) {
      s.run.queue.shift();
      event(s, "queue_complete");
      if (q.until.pauseAfter) { s.settings.paused = true; s.run.blockedReason = "目標達成。次の備えを選びましょう。"; return; }
      continue;
    }
    const r =
        q.kind === "goal"
          ? resolveGoal(s, q.id)
          : { ...canStartAction(s, q.id, true), id: q.id };
    if (r.done) {
      s.run.queue.shift();
      continue;
    }
    if (!r.ok) {
      s.settings.paused = true;
      if (s.run.blockedReason !== r.reason) {
        s.run.blockedReason = r.reason;
        s.settings.paused = true;
        log(s, r.reason);
      }
      return;
    }
    s.run.blockedReason = "";
    if(r.equipId){const switched=changeGear(s,{type:"equipment",id:r.equipId},RECIPES);if(!switched.ok){s.settings.paused=true;s.run.blockedReason=switched.reason;return;}continue;}
    begin(s, r.id);
    s.run.activeAction.goalId = q.goalId;
    s.run.queueManaged = true;
    return;
  }
}
function reserve(s) {
  if (!on(s, "action_queue")) return {};
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
    if (seen.has(x.id) || x.id === paid || x.equipment && s.run.ownedEquipment?.includes(x.id) && !s.run.suspendedActions[x.id]) return;
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
export const resourceKnown = (s, id) => (alchemyResource(id)||farmResource(id)) ? s.meta.bestWave>=3 :
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
function automaticRecipe(s,funded){const explicit=s.settings.autoCookRecipe;if(explicit&&explicit!=='auto')return defs.get(explicit);const egg=defs.get('egg_stew');return s.settings.farmAutoCook&&isKnown(s,egg)&&lv(s,egg.skill)>=egg.unlockLevel&&funded(egg)?egg:defs.get('cook_meal');}
export function getAutoCookingStatus(s) {
  const reserved=reserve(s),egg=defs.get("egg_stew");
  const recipe=(s.run.autoCraft?defs.get(s.run.autoCraft.id):automaticRecipe(s,d=>Object.entries(getRecipeCost(s,d)).every(([r,n])=>s.run.resources[r]-(reserved[r]||0)>=n))),cost=getRecipeCost(s,recipe);
  const materials = Object.entries(cost).map(([id, required]) => ({id, required, stock:s.run.resources[id], reserved:reserved[id] || 0, available:Math.max(0,s.run.resources[id]-(reserved[id] || 0))}));
  const base = {materials, food:totalFood(s), target:s.settings.foodTarget, batch:s.run.autoCraft};
  const result = (code, text) => ({...base, code, text});
  if (!s.meta.upgrades.includes("auto_cook")) return result("locked", "未解放");
  if (!on(s,"auto_cook")) return result("disabled", "OFF");
  if (s.run.status !== "preparing") return result("inactive", "準備中のみ調理");
  if(recipe.id!=="cook_meal"&&(!isKnown(s,recipe)||lv(s,recipe.skill)<recipe.unlockLevel))return result("unavailable","料理の解放・技能が必要です。");
  if (s.run.autoCraft) return result(s.settings.paused ? "paused" : "cooking", s.settings.paused ? "調理を一時停止中" : "調理中");
  if (totalFood(s) >= s.settings.foodTarget) return result("target", `目標${s.settings.foodTarget}に到達 · 増やすには目標を上げる`);
  const missing = materials.filter(m=>m.available < m.required);
  if (missing.length) return result("materials", missing.map(m=>`${RESOURCES[m.id].name}が${m.required-m.available}不足${m.reserved ? `（予約用${m.reserved}を確保）` : ""}`).join(" · "));
  return result(s.settings.paused ? "paused" : "ready", s.settings.paused ? "時間停止中 · 開始すると調理" : "調理を開始します");
}
export function getProcessingStatus(s) {
  const worker = s.run.workers.processing_worker, recipe = defs.get(worker.target);
  const output = Object.keys(recipe.yields)[0], reserved = reserve(s);
  const materials = Object.entries(getRecipeCost(s, recipe)).map(([id, required]) => ({id, required, available:Math.max(0,s.run.resources[id]-(reserved[id] || 0)), reserved:reserved[id] || 0}));
  const base = {recipe:recipe.id, output, stock:s.run.resources[output], target:s.settings.processingTarget, materials, batch:worker.batch};
  const result = (code, text) => ({...base, code, text});
  if (!s.meta.upgrades.includes("processing_worker")) return result("locked", "未雇用");
  if (!on(s, "processing_worker")) return result("disabled", "OFF");
  if (s.run.status !== "preparing") return result("inactive", "準備中のみ加工");
  if (worker.batch) return result(s.settings.paused ? "paused" : "processing", `${defs.get(worker.batch.id).name} · ${s.settings.paused ? "一時停止中" : "加工中"}`);
  const allowed = canConfigureWorker(s,"processing_worker",worker.target);
  if (!allowed.ok) return result("unavailable", allowed.reason);
  if (s.run.resources[output] >= s.settings.processingTarget) return result("target", `目標${s.settings.processingTarget}に到達 · 増やすには目標を上げる`);
  const missing = materials.filter(m=>m.available < m.required);
  if (missing.length) return result("materials", missing.map(m=>`${C.resources.find(r=>r.id===m.id)?.name || m.id}が${Math.ceil(m.required-m.available)}不足${m.reserved ? `（予約用${m.reserved}を確保）` : ""}`).join(" · "));
  return result(s.settings.paused ? "paused" : "ready", s.settings.paused ? "時間停止中 · 開始すると加工" : "加工待ち");
}
function helpers(s, dt) {
  const reserved = reserve(s);
  const funded = (d) =>
    Object.entries(getRecipeCost(s, d)).every(
      ([r, n]) => s.run.resources[r] - (reserved[r] || 0) >= n,
    );
  if (on(s, "auto_cook")) {
    const egg=defs.get("egg_stew");
    const d = automaticRecipe(s,funded);
    if (
      !s.run.autoCraft &&
      totalFood(s) < s.settings.foodTarget &&
      (d.id==="cook_meal"||isKnown(s,d)&&lv(s,d.skill)>=d.unlockLevel) && funded(d)
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
            Math.min(resourceCap(rw.batch.target), s.run.resources[rw.batch.target] + rw.batch.quantity),
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
    n > Math.min(9999,resourceCap(id))
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
    goals: s.run.queue.map(({ id, count, kind, until }) => ({ id, count, kind, ...(until ? {until:{...until}} : {}) })),
  });
  return ok();
}
export function getTemplatePreview(s, i) {
  const t = s.meta.templates[i];
  const seen = new Set(s.run.queue.filter(q => defs.get(q.id)?.equipment || defs.get(q.id)?.facility).map(q => q.id));
  const items = (t?.goals || []).map(g => {
    const d = defs.get(g.id);
    const item = { ...g, name: d?.name || g.id, status: "ready", reason: "追加" };
    if(isCombatTraining(g.id)&&g.until?.type==='level'&&!g.until.pauseAfter&&goalSatisfied(s,g))return {...item,status:'skip',reason:'この命の目標レベルに到達済み'};
    const paid = s.run.activeAction?.id === g.id || s.run.suspendedActions[g.id];
    const equipped = d?.equipment && s.run.equipment[d.slot];
    const completed = !paid && (d?.equipment && s.run.ownedEquipment?.includes(d.id) || (d?.facility ? (s.run.facilities[d.facility.id] || 0) >= d.level : equipped && !d.combat && !weaponById(equipped.id) && ["attack", "defense", "maxHp", "speed"].every(stat => (equipped[stat] || 0) >= (d.equipment[stat] || 0))));
    if (completed) return { ...item, status: "skip", reason: d.facility ? "建設済み" : "装備済み・上位装備あり" };
    if ((d?.equipment || d?.facility) && seen.has(g.id)) return { ...item, status: "skip", reason: "予約済み" };
    if (!isKnown(s, g.id)) return { ...item, status: "blocked", reason: "未解放" };
    const check = g.kind === "goal" ? resolveGoal(s, g.id) : canStartAction(s, g.id, true);
    if (!check.ok) return { ...item, status: "blocked", reason: check.reason };
    if (d.equipment || d.facility) seen.add(g.id);
    return item;
  });
  const additions = items.filter(g => g.status === "ready");
  const enabled = on(s, "queue_templates") && on(s, "action_queue") && t && s.run.status === "preparing";
  const reason = !enabled ? "この手順を使えません。" : !additions.length ? "追加できる予約がありません。" : s.run.queue.length + additions.length > 8 ? "行動予約が8件でいっぱいです。不要な予約を削除してください。" : "";
  return { ok: !reason, reason, items, additions };
}
export function loadTemplate(s, i) {
  const preview = getTemplatePreview(s, i);
  if (!preview.ok) return fail(preview.reason);
  const additions = preview.additions;
  if (s.run.queue.length + additions.length > 8) return fail("行動予約が8件でいっぱいです。不要な予約を削除してください。");
  delete s.run.manualRepeat;
  for (const g of additions) {
    const d = defs.get(g.id);
    s.run.queue.push({ id: g.id, kind: g.kind, count: d?.equipment || d?.facility ? 1 : g.count, ...(g.until ? {until:{...g.until}} : {}), goalId: ++s.run.queueSeq });
  }
  return { ...ok(), added: additions.length };
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
    remaining: (s.run.endless?.active ? C.augments.length : 4) - s.run.augments.selected.length,
  };
}
function augmentPool(s) {
  const a = s.run.augments;
  return AUGMENTS.filter(x => !(a.excluded||[]).includes(x.id) && !a.selected.includes(x.id) && s.meta.bestWave >= (x.unlockBestWave || 0) && (!x.pack || on(s, x.pack)) && (!x.requiresPurchasedWorker || C.workers.some(w => on(s, w.id))));
}
function drawAugmentOffer(s, stage, previous = []) {
  const a = s.run.augments;
  const pool = augmentPool(s);
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
  if (previous.length) {
    // Change as many cards as the unlocked pool and family rules allow.
    const overlap = xs => xs.filter(x => previous.includes(x.id)).length;
    const minimum = Math.min(...sets.map(overlap));
    sets = sets.filter(xs => overlap(xs) === minimum && xs.some(x => !previous.includes(x.id)));
    if (!sets.length) return null;
  }
  const seed = (Math.imul(a.seed, 1664525) + 1013904223) >>> 0;
  return {seed, offer:(sets[Math.floor((seed / 4294967296) * sets.length)] || []).map(x => x.id)};
}
export function getAugmentRerollStatus(s) {
  const limit = 2 + C.legacy.filter(u => u.effect?.augmentRerolls && s.meta.upgrades.includes(u.id)).reduce((n,u) => n + u.effect.augmentRerolls, 0);
  const remaining = Math.max(0, limit - (s.run.augments.rerollsUsed || 0));
  const reason = s.run.status !== 'preparing' || !s.run.augments.offer.length ? '候補の選択中だけ引き直せます。'
    : !remaining ? 'この周回のリロールを使い切りました。'
    : !augmentPool(s).some(x => !s.run.augments.offer.includes(x.id)) ? '入れ替えられる候補がありません。' : '';
  return {limit,remaining,canReroll:!reason,reason};
}
export function rerollAugments(s) {
  const status = getAugmentRerollStatus(s);
  if (!status.canReroll) return fail(status.reason);
  const a = s.run.augments;
  const next = drawAugmentOffer(s, a.offeredStages.at(-1), a.offer);
  if (!next) return fail('入れ替えられる候補がありません。');
  Object.assign(a, next);
  a.rerollsUsed = (a.rerollsUsed || 0) + 1;
  s.settings.paused = true;
  s.run.acceleration.active = false;
  return ok();
}
export function getAugmentExclusionStatus(s,id){
  const a=s.run.augments,remaining=Math.max(0,1-(a.exclusionsUsed||0)),rerolls=getAugmentRerollStatus(s);
  const alternatives=augmentPool(s).filter(x=>!a.offer.includes(x.id));
  const reason=s.run.status!=='preparing'||!a.offer.length?'候補の選択中だけ除外できます。':!remaining?'この人生では候補を除外済みです。':!a.offer.includes(id)?'現在の提示から1候補を選んでください。':!rerolls.remaining?'再抽選の残り回数がありません。':!alternatives.length?'補充できる候補がないため除外できません。':'';
  return {limit:1,remaining,canExclude:!reason,reason};
}
export function excludeAugment(s,id){
  const status=getAugmentExclusionStatus(s,id);if(!status.canExclude)return fail(status.reason);
  const a=s.run.augments,kept=a.offer.filter(x=>x!==id);let candidates=augmentPool(s).filter(x=>!a.offer.includes(x.id));
  const families=kept.map(id=>AUGMENTS.find(x=>x.id===id).family),balanced=candidates.filter(x=>families.filter(f=>f===x.family).length<2);if(balanced.length)candidates=balanced;
  const seed=(Math.imul(a.seed,1664525)+1013904223)>>>0,replacement=candidates[Math.floor(seed/4294967296*candidates.length)];
  a.offer=a.offer.map(x=>x===id?replacement.id:x);a.seed=seed;a.exclusionVersion=1;a.excluded=[id];a.exclusionsUsed=1;a.rerollsUsed=(a.rerollsUsed||0)+1;s.settings.paused=true;s.run.acceleration.active=false;return ok();
}
function offer(s, stage) {
  const a = s.run.augments;
  if (
    s.meta.bestWave < 3 ||
    a.offer.length ||
    a.selected.length >= (s.run.endless?.active ? C.augments.length : 4) ||
    a.offeredStages.includes(stage)
  )
    return;
  const aNext = drawAugmentOffer(s, stage);
  if (!aNext?.offer.length) return;
  Object.assign(a, aNext);
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
  strategy(s).aidUsed = true;
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
  const price = m.gold * (1 - Math.min(0.4, discount));
  // Upgraded markets quote cents so small purchases actually receive their discount.
  return Math.max(1, s.run.facilities.market >= 2 ? Math.ceil(price * 100 - 1e-8) / 100 : Math.ceil(price));
}
export function buySupply(s, id) {
  const m = C.market.find((m) => m.id === id);
  if (s.run.status !== "preparing" || !m || !s.run.facilities.market)
    return fail("市場を建設してください。");
  if (m.resource && !resourceKnown(s, m.resource)) return fail("未発見です。");
  if (m.oncePerRun && s.run.diplomacy.mercenary) return fail("雇用済み。");
  if (id === "sell_wood") {
    if(investmentEffect(s,"tradeSaleBonus"))return tradeResource(s,"wood","sell",10);
    if (s.run.resources.wood < 10) return fail("木材10が必要。");
    const proceeds=effect(s, "market").woodSaleAmount;
    if(s.run.resources.gold+proceeds>1e9)return fail("資金の保存上限に達します。");
    s.run.resources.wood -= 10;
    s.run.resources.gold = round(s.run.resources.gold + proceeds);
    return ok();
  }
  const price = getSupplyCost(s, id);
  if(m.resource && s.run.resources[m.resource]+m.quantity>resourceCap(m.resource))return fail('資源上限に達します。');
  if (s.run.resources.gold < price) return fail("金貨不足。");
  s.run.resources.gold -= price;
  if (m.attack) s.run.diplomacy.mercenary = true;
  else s.run.resources[m.resource] += m.quantity;
  return ok();
}
export function getTradeQuote(s, resource, direction, count = 1) {
  const entry = C.market.find(m=>m.direction === 'buy' && m.resource === resource);
  const all = count === 'all';
  if (!entry || !['buy','sell'].includes(direction) || (!all && (!Number.isInteger(count) || count < 1 || count > 9999))) return fail('数量は1〜9999個、または全てを指定してください。');
  const buyUnit = getSupplyCost(s,entry.id) / entry.quantity;
  const ordinaryUnit = resource === 'eggs' ? .3 : resource === 'wood' ? Math.min((effect(s,'market').woodSaleAmount || 2) / 10, buyUnit * .75) : buyUnit * .75;
  const unitFor = n => direction === 'buy' ? buyUnit : tradeSaleUnit(s, resource, n, buyUnit, ordinaryUnit);
  const totalFor = n => direction === 'buy' ? Math.ceil(unitFor(n) * n * 100 - 1e-8) / 100 : Math.floor(unitFor(n) * n * 100 + 1e-8) / 100;
  if (all) {
    const limit = direction === 'buy' ? resourceCap(resource) - s.run.resources[resource] : s.run.resources[resource];
    count = maximumTradeCount(limit, n => direction === 'buy' ? round(s.run.resources.gold-totalFor(n)) >= 0 : round(s.run.resources.gold+totalFor(n)) <= 1e9);
  }
  const unit = unitFor(count), total = totalFor(count);
  let reason = '';
  if (!s.run.facilities.market) reason = '市場を建設してください。';
  else if (!resourceKnown(s,resource)) reason = '未発見の品です。';
  else if (s.run.status !== 'preparing') reason = '準備中のみ取引できます。';
  else if (!count) reason = direction === 'buy' ? '購入できる数量がありません。' : '売却できる数量がありません。';
  else if (direction === 'buy' && round(s.run.resources.gold-total) < 0) reason = '金貨不足。';
  else if (direction === 'sell' && s.run.resources[resource] < count) reason = '所持数不足。';
  else if (direction === 'buy' && s.run.resources[resource] + count > resourceCap(resource) || direction === 'sell' && s.run.resources.gold + total > 1e9) reason = '所持上限に達します。';
  return {ok:!reason, reason, resource, direction, count, unit, total};
}
export function tradeResource(s, resource, direction, count) {
  const quote = getTradeQuote(s,resource,direction,count);
  if (!quote.ok) return quote;
  s.run.resources.gold = round(s.run.resources.gold + (direction === 'buy' ? -quote.total : quote.total));
  s.run.resources[resource] = round(s.run.resources[resource] + (direction === 'buy' ? quote.count : -quote.count));
  return quote;
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
        r.incomeTotal = round(Math.min(1e9, r.incomeTotal + c.ally.gold));
        s.run.resources.gold = round(Math.min(1e9, s.run.resources.gold + c.ally.gold));
      }
    }
  }
  syncCountries(s);
  if (aug(s, "investment")) {
    s.run.augments.investmentTimer = round(s.run.augments.investmentTimer + dt);
    if (s.run.augments.investmentTimer >= 15) {
      s.run.augments.investmentTimer -= 15;
      s.run.resources.gold = round(Math.min(1e9, s.run.resources.gold +
        Object.values(s.run.facilities).reduce((a, b) => a + b, 0) * 0.5));
    }
  }
}
export function canPurchaseUpgrade(s, id) {
  if(isFreeFeature(id)) return fail("到達WAVEで無料解放されます。");
  const u = upgrades.get(id);
  if (!u) return fail("解放がありません。");
  if (
    s.run.status !== "legacy_setup" ||
    s.run.augments.offer.length
  )
    return fail("継承ポイントの配分は転生時に行います。");
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
  if (g.requires?.some((x) => !owned.includes(x) && !(isFreeFeature(x)&&hasUpgrade(s,x))))
    return fail(`先に${g.requires.filter(x => !owned.includes(x)).map(x => upgrades.get(x).name).join("・")}を解放してください。`);
  const automationCount = owned.filter(x => ["automation", "worker"].includes(upgrades.get(x)?.kind)).length;
  if (g.automationCount && automationCount < g.automationCount)
    return fail(`自動化・人員を${g.automationCount}種類解放してください（現在${automationCount}/${g.automationCount}種類）。`);
  const generation = s.meta.generation + (s.run.status === "legacy_setup" ? 1 : 0);
  if (g.generation && generation < g.generation)
    return fail(`第${g.generation}世代から解放。`);
  return ok();
}
export function purchaseUpgrade(s, id) {
  if(isFreeFeature(id)){if(!["preparing","legacy_setup"].includes(s.run.status)||s.run.augments.offer.length)return fail("準備中に解放を確認してください。");if(!hasUpgrade(s,id))return fail("到達WAVEで無料解放されます。");synchronizeFreeFeatures(s);return ok();}
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
  if(isFreeFeature(id))return fail("無料機能はポイントを使用しません。");
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
export function toggleUpgrade(s,id){
 const u=upgrades.get(id);if(!u)return fail('解放がありません。');
 if(u.kind==='augment_reroll')return fail('リロール回数の追加は常に有効です。');
 const setup=s.run.status==='legacy_setup',operational=isFreeFeature(id)||['automation','worker'].includes(u.kind);
 if(!setup&&!operational)return fail('継承の構成変更は転生時に行います。');
 const owned=setup?s.run.legacyDraft.upgrades.includes(id)||hasUpgrade(s,id):hasUpgrade(s,id);
 if(!owned||(!setup&&s.run.status!=='preparing')||s.run.augments.offer.length)return fail('操作できる状態ではありません。');
 const target=setup?s.run.legacyDraft:s.settings;target.disabledUpgrades??=[...s.settings.disabledUpgrades];
 target.disabledUpgrades=target.disabledUpgrades.includes(id)?target.disabledUpgrades.filter(x=>x!==id):[...target.disabledUpgrades,id];
 return ok();
}
export function abandonRun(s) {
  if(s.run.routes?.active){s.settings.paused=true;withdrawRoute(s,"周回中止・帰還");}
  if (!["preparing", "combat"].includes(s.run.status)) return fail("進行中の周回だけ切り上げられます。");
  s.run.status = "dead";
  s.settings.paused = true;
  s.run.acceleration.active = false;
  s.run.enemy = null;
  refundUnfinishedTrophies(s);
  delete s.run.manualRepeat;
  s.run.activeAction = null;
  s.run.suspendedActions = {};
  s.run.queue = [];
  s.run.simRemainder = 0;
  s.run.augments.offer = [];
  record(s);
  return restartRun(s);
}
export function restartRun(s) {
  if (!["dead", "cleared"].includes(s.run.status))
    return fail("周回終了後に開始してください。");
  s.run.status = "legacy_setup";
  s.run.legacyDraft = {
    upgrades: [...s.meta.upgrades],
    paidCosts: { ...s.meta.paidCosts },
    points: s.meta.points,
    disabledUpgrades:[...s.settings.disabledUpgrades],
  };
  s.settings.paused = true;
  return ok();
}
export function getStartingResources(s){const ids=s.run.status==="legacy_setup"?s.run.legacyDraft.upgrades:s.meta.upgrades;return startingGrant(ids,s.run.status==="legacy_setup"?(s.run.legacyDraft.disabledUpgrades??s.settings.disabledUpgrades):s.settings.disabledUpgrades);}
export function confirmRun(s, {earlyLoopPrototype=false,lateLoopPrototype=false,preparationBalancePrototype=false}={}) {
  if (s.run.status !== "legacy_setup") return fail("継承準備ではありません。");
  synchronizeFreeFeatures(s);
  const draft=s.run.legacyDraft;
  Object.assign(s.meta,{upgrades:draft.upgrades,paidCosts:draft.paidCosts,points:draft.points});
  s.settings.disabledUpgrades=[...(draft.disabledUpgrades??s.settings.disabledUpgrades)];
  if(preparationBalancePrototype)s.meta.preparationBalanceVersion=2;
  if(lateLoopPrototype)s.meta.lateLoopVersion=1;
  if(earlyLoopPrototype){s.meta.earlyLoopVersion=1;delete s.meta.earlyLoopBatching;delete s.meta.earlyLoopFishBatching;}
  s.meta.generation++;
  s.settings.disabledUpgrades = s.settings.disabledUpgrades.filter((id) =>
    hasUpgrade(s,id),
  );
  s.contentVersion = C.revision;
  refundUnfinishedTrophies(s);
  s.run = freshRun(s.meta, s.settings,FRONTIER_CAMPAIGN);
  s.run.trophyClaims=[];
  Object.assign(s.run.resources,getStartingResources(s));
  s.run.hp = getStats(s).maxHp;
  for (const id of s.meta.upgrades) event(s, "worker_purchase", { id });
  s.settings.paused = true;
  offer(s, "start");
  return ok();
}
export function getAccelerationStatus(s) {
  const a = s.run.acceleration,
    available =
      hasUpgrade(s,"cycle_acceleration") && s.meta.generation >= 2;
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
    multiplier: Math.round(5*(1+investmentEffect(s,"returnSpeed"))*1e6)/1e6,
    reason: "既知の襲撃まで復帰を短縮。",
  };
}
export function startAcceleration(s) {
  if (!getAccelerationStatus(s).canStart) return fail("復帰を使えません。");
  s.run.acceleration.active = true;
  s.settings.paused = false;
  if(s.run.status==='preparing')prepareCampClock(s);
  return ok();
}
export function stopAcceleration(s) {
  s.run.acceleration.active = false;
  return ok();
}
export function getNextEnemy(s) {
  if (s.run.endless?.active && s.run.wave >= finalWaveForRun(s)) return endlessEnemy(s.run.wave + 1, encountersForRun(s,C.encounters),finalWaveForRun(s));
  const e = encountersForRun(s,(s.contentVersion === "A1" ? A1_ENCOUNTERS : s.contentVersion === "A2" ? A2_ENCOUNTERS : C.encounters))[
    s.run.wave
  ];
  if (!e)
    return {
      name: "最終襲撃を撃退",
      hp: 0,
      attack: 0,
      defense: 0,
      wave: finalWaveForRun(s),
      isBoss: true,
    };
  const country = s.run.hostileQueue[0],
    inv = C.diplomacy.find((c) => c.id === country)?.invasion;
  return {
    ...lateEncounter(s,earlyEncounter(s,e)),
    pressure: lateLoop(s)&&e.wave===30?"sunder":(earlyLoop(s)&&[7,8,13,14].includes(e.wave)||lateRelief(s,e.wave))?null:s.run.encounterDepth ? ({7:"rally", 10:"sunder", 13:"rally", 16:"sunder", 19:"rally"}[e.wave] || null) : null,
    hp: inv ? Math.ceil(e.hp * inv.hpMultiplier) : e.hp,
    attack: inv ? Math.ceil(preparationEnemyAttack(s,e,lateEncounter(s,e).attack) * inv.attackMultiplier) : preparationEnemyAttack(s,e,lateEncounter(s,earlyEncounter(s,e)).attack),
    defense: e.defense + (inv?.defenseBonus || 0),
    maxHp: inv ? Math.ceil(e.hp * inv.hpMultiplier) : e.hp,
    isBoss: e.boss,
    invasion: !!inv,
    country: country || null,
  };
}
function beginRaid(s,encounter=null) {
  s.run.idleWait=false;
  const next=()=>encounter||getNextEnemy(s);
  s.run.enemy = {
    ...next(),
    supplied: totalFood(s) >= 20,
    pressureVersion:1,
    baseDefense: next().defense,
    retaliation: false,
    report: { wave: s.run.wave + 1, magic:0, pet:0, player: 0, guards: 0, tower: 0, counter: 0, prevented: 0, foodHealing: 0, treatmentHealing: 0, damageTaken: 0, rounds: 0 },
    round: 0,
    xpAwarded: 0,
    xpBudget:
      next().combatXpBudget *
      (aug(s, "field_training") ? 1.25 : 1),
    charges: effect(s, "infirmary").treatmentCharges || 0,
  };
  s.run.status = "combat";
  if(["fish_meal","egg_meal"].includes(s.settings.mealPreference)&&s.run.resources[s.settings.mealPreference]>0)serveBattleMeal(s,getFoodHealing(s),getStats(s).maxHp);
  if(!encounter)recordArrival(s,s.run.enemy.wave);
  beginCompanionFight(s);s.run.magicState=freshMagic();s.run.combatTimer = 0;const build=combatBuild(s);s.run.playerCombatTimer=build.opening?build.interval-build.opening:0;
  log(s, `第${s.run.enemy.wave}波：${s.run.enemy.name}`, "raid");
}
function record(s) {
  if (s.run.endless?.active && s.meta.history[0]?.generation === s.meta.generation) s.meta.history.shift();
  s.meta.history.unshift({
    generation: s.meta.generation,
    wave: s.run.wave,
    elapsed: s.run.elapsed,
    ...(s.run.results?{result:runSummary(s)}:{}),
    skillGains: Object.fromEntries(
      SKILLS.map((x) => [
        x.id,
        round(s.meta.skills[x.id].xp - s.run.startPermanentXp[x.id]),
      ]),
    ),
  });
  s.meta.history = s.meta.history.slice(0, 20);
}
function finishBattleReport(s, e, won) {
  if (!e.report) return;
  e.report.rounds = e.round;
  const r = { ...e.report, magicState:structuredClone(s.run.magicState||freshMagic()), companion:{id:activeCompanion(s),...s.run.companionState}, enemy: e.name, won, remainingHp: Math.max(0, e.hp), maxHp: e.maxHp };
  s.run.battleReports = [r, ...(s.run.battleReports || [])].slice(0, 8);
  if(!s.run.routes?.active)strategy(s).playerDamage += r.player+(r.magic||0);
  if(!s.run.routes?.active)strategy(s).facilityDamage += r.guards + r.tower + r.counter+(r.pet||0);
  strategy(s).focus = 0;
}
function die(s, e, before, damage) {
  if(s.run.routes?.active){finishBattleReport(s,e,false);returnFromRoute(s,false,"敗北・帰還");return;}
  finishBattleReport(s, e, false);
  s.run.deathReport = {
    enemy: e.name,
    wave: e.wave,
    beforeHit: before,
    damage,
    food: totalFood(s),
  };
  s.run.hp = 0;
  s.run.status = "dead";
  s.settings.paused = true;
  s.run.acceleration.active = false;
  s.run.enemy = null;
  refundUnfinishedTrophies(s);
  delete s.run.manualRepeat;
  s.run.activeAction = null;
  s.run.suspendedActions = {};
  s.run.queue = [];
  s.run.simRemainder = 0;
  log(s, "力尽きた。経験を次の命へ。", "death");
  const repeat=rewardFrontierAttempt(s,e);if(repeat){recordReward(s,'points','',s.meta.points-repeat,s.meta.points);log(s,'前線への挑戦 / 継承 +'+repeat,'permanent');}
  record(s);
}
function victory(s, e) {
  if(s.run.routes?.active){finishBattleReport(s,e,true);const points=returnFromRoute(s,true,"突破");if(points)recordReward(s,"points","",s.meta.points-points,s.meta.points);return;}
  const repeat=rewardRepeatVictory(s,e);if(repeat){recordReward(s,'points','',s.meta.points-repeat,s.meta.points);log(s,'前線への復帰 / 継承 +'+repeat,'permanent');}
  const trophy=awardTrophy(s,e);if(trophy)log(s,trophy.name+" +1（永久素材）","permanent");
  recordClear(s,e.wave);
  finishBattleReport(s, e, true);
  s.run.wave = e.wave;
  if (s.run.wave >= s.run.acceleration.limitWave)
    s.run.acceleration.active = false;
  s.meta.bestWave = Math.max(s.meta.bestWave, Math.min(finalWaveForRun(s), e.wave));
  const rewards=synchronizeFreeFeatures(s);for(const id of rewards.companionsAdded||[])log(s,'相棒を永久所持に加えた：'+companionById(id).name,'permanent');
  if (s.run.endless?.active) s.meta.bestEndlessWave = Math.max(s.meta.bestEndlessWave || finalWaveForRun(s), e.wave);
  let gold =
    e.gold *
    (1 +
      (aug(s, "bounty") ? 0.75 : 0) +
      (getSynergies(s).includes("martial") ? 0.2 : 0) +
      defeatedCountryBonus(s, "victoryGoldPercent"));
  s.run.resources.gold = round(Math.min(1e9, s.run.resources.gold + gold));
  s.run.resources.hide += e.hide;
  if (!s.run.endless?.active && e.boss && !s.meta.defeatedBosses.includes(e.id)) {
    s.meta.defeatedBosses.push(e.id);
    s.meta.points++;
    s.meta.totalPoints++;
    recordReward(s,"points","",s.meta.points-1,s.meta.points);
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
  const finalClear=!s.run.endless?.active&&e.wave===finalWaveForRun(s);
  if(finalClear)delete s.run.manualRepeat;
  s.run.status = finalClear ? "cleared" : "preparing";
  s.run.nextWaveAt = round(s.run.elapsed + getRaidInterval(s));
  log(s, `第${e.wave}波を撃退。`, "victory");
  if (finalClear) {
    s.run.clearRecord = {generation:s.meta.generation,wave:finalWaveForRun(s),campaign:campaignForRun(s),seconds:Math.floor(s.run.elapsed),augments:[...s.run.augments.selected],badges:challengeResults(s)};
    if (!s.meta.clears) s.meta.firstClear ||= structuredClone(s.run.clearRecord);
    if(s.run.campaign===EXTENDED_CAMPAIGN)s.meta.firstExtendedClear ||= structuredClone(s.run.clearRecord);
    if(s.run.campaign===FRONTIER_CAMPAIGN)s.meta.firstFrontierClear ||= structuredClone(s.run.clearRecord);
    s.meta.clears++;
    s.meta.challengeBadges = [...new Set([...(s.meta.challengeBadges || []), ...challengeResults(s)])];
    s.settings.paused = true;
    s.run.acceleration.active = false;
    record(s);
  } else {
    syncCountries(s);
    if ([3, 9, 15].includes(e.wave) || s.run.endless?.active && e.wave % 6 === 0) offer(s, e.wave);
  }
  if (s.run.wave >= s.run.acceleration.limitWave)
    s.run.acceleration.active = false;
}
export function getPlayerStrike(s, e = s.run.enemy || getNextEnemy(s)) {
  const attack = getStats(s).attack * (aug(s, "executioner") && e.hp <= e.maxHp * .35 ? 1.3 : 1) * (e.retaliation ? 1.5 : 1);
  const armor = e.defense * (1-combatBuild(s).pierce) * (aug(s, "weapon_master") ? 1 - (s.run.strategy?.focus || 0) / 100 : 1);
  return { attack, armor, damage: Math.max(1, attack - armor) };
}
function battleDamage(s,e,n,source='player') {
    const armor = e.defense * (source==="magic"||source==="pet"?0:source==="player"?1-combatBuild(s).pierce:1) * (source === "player" && aug(s, "weapon_master") ? 1 - (s.run.strategy?.focus || 0) / 100 : 1);
    const dealt = Math.min(e.hp, Math.max(1, n - armor));
    if (e.report) e.report[source] = round((e.report[source]||0) + dealt);
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
    return dealt;
}
function playerAttack(s){
  const e=s.run.enemy,mod=strikeModifier(s,e,true);battleDamage(s,e,getPlayerStrike(s,e).attack*mod.multiplier);
  if(e.report){e.report.playerHits=(e.report.playerHits||0)+1;e.report.criticalHits=(e.report.criticalHits||0)+(mod.critical?1:0);}
  physicalIgnition(s,e,mod.critical);companionCritical(s,e,mod.critical,n=>battleDamage(s,e,n,'pet'));
  if(mod.build.markEvery&&e.buildCombat.hits%mod.build.markEvery===0)e.defense=round(Math.min(e.defense,Math.max((e.baseDefense??e.defense)*.7,e.defense-2)));
  e.retaliation=false;if(e.hp<=0)return victory(s,e);
}
function needsFoodHealing(s,stats,packet){
  return totalFood(s)>0&&s.run.hp<stats.maxHp&&(s.run.hp<=stats.maxHp*.55||s.run.hp<=packet);
}
function applyTreatment(s,e,stats){
    e.charges--;
    const beforeHeal = s.run.hp;
    s.run.hp = round(
      Math.min(
        stats.maxHp,
        s.run.hp +
          (effect(s, "infirmary").treatmentFlat || 0) + stats.maxHp *
            0.22 *
            (aug(s, "healing_patrol") ? 1.3 : 1) *
            (getSynergies(s).includes("fortress") ? 1.2 : 1),
      ),
    );
    if (e.report) e.report.treatmentHealing = round(e.report.treatmentHealing + s.run.hp - beforeHeal);
    if (aug(s, "triage")) e.retaliation = true;
    log(s, "救護処置。", "heal");
}
function battleRound(s){const e=s.run.enemy;const damage=(n,source='player')=>battleDamage(s,e,n,source);
  if (e.hp <= 0) return victory(s, e);
  const support = getStats(s).support;
  if (support) {
    damage(support * (e.trait === "flying" ? .5 : 1), "guards");
    if (e.hp <= 0) return victory(s, e);
  }
  const ranged = getStats(s).ranged;
  if (ranged) {
    damage(ranged*(e.trait==="flying"?2.5:1), "tower");
    if (aug(s, "piercing_volley")) e.defense = round(Math.max((e.baseDefense ?? e.defense) * .6, e.defense - (e.baseDefense ?? e.defense) * .08));
    if(e.hp<=0)return victory(s,e);
  }
  const stats = getStats(s);
  let hits = (
      e.trait === "combo"
        ? [0.75, 0.75]
        : [e.trait === "heavy" && e.round % 4 === 0 ? 1.6 : 1]
    ).map((m) =>
      round(
        Math.max(
          1,
          (pressuredAttack(s,e) * m * (e.pressure === "rally" ? 1 + Math.min(.3, Math.floor((e.round - 1) / 4) * .05) : 1) - stats.defense * (e.pressure === "sunder" && e.round % 4 === 0 ? .6 : 1)) *
            (e.round === 1 && aug(s, "wall_readiness") ? 0.6 : 1),
        ),
      ),
    );
  hits=companionPacket(s,e,hits);
  hits=wardPacket(s,hits,stats.maxHp);
  const packet = hits.reduce((a, b) => a + b, 0);
  if (e.report) {
    const raw = (e.trait === "combo" ? 1.5 : e.trait === "heavy" && e.round % 4 === 0 ? 1.6 : 1) * pressuredAttack(s,e) * (e.pressure === "rally" ? 1 + Math.min(.3, Math.floor((e.round - 1) / 4) * .05) : 1);
    e.report.prevented = round(e.report.prevented + Math.max(0, raw - packet));
  }
  // Prefer a finite treatment when food would otherwise mask its opportunity.
  const treatmentBeforeFood = e.charges > 0 && needsFoodHealing(s,stats,packet);
  if(treatmentBeforeFood)applyTreatment(s,e,stats);
  if (needsFoodHealing(s,stats,packet)) {
    const heal = getFoodHealing(s),consumed=consumeAutomaticFood(s,heal,stats.maxHp);
    if (e.report&&consumed.ok) e.report.foodHealing = round(e.report.foodHealing + consumed.healed);
    log(s, `食料で${heal}回復。`, "heal");
  }
  for (const hit of hits) {
    const before = s.run.hp;
    if (e.report) e.report.damageTaken = round(e.report.damageTaken + Math.min(before, hit));
    s.run.hp = round(s.run.hp - hit);
    if (s.run.hp <= 0) return die(s, e, before, hit);
  }
  if (!treatmentBeforeFood && e.charges > 0 && s.run.hp <= stats.maxHp * 0.35) applyTreatment(s,e,stats);
  if(combatBuild(s).counter){damage(stats.defense*combatBuild(s).counter,'counter');if(e.hp<=0)return victory(s,e);}
  if (aug(s, "thorn_wall") && s.run.facilities.barricade) {
    damage(stats.defense * .25, "counter");
    if (e.hp <= 0) return victory(s, e);
  }
}
// The foreground, bounded automation, and explicit manual waiting are distinct clock owners.
function automaticClockWork(s){
 const active=new Set(['ready','paused','cooking','processing']);
 return [[getAutoCookingStatus(s),'自動調理'],[getProcessingStatus(s),'自動加工']].filter(([x])=>active.has(x.code)).map(([,name])=>name);
}
export function getClockStatus(s){
 if(s.run.status==='combat')return {kind:'combat',label:s.run.routes?.active?'地域遠征中':'襲撃中'};
 if(s.run.activeAction)return {kind:'work',label:(defs.get(s.run.activeAction.id)?.name||'作業中')+(s.run.manualRepeat===s.run.activeAction.id?'（連続）':'')};
 const automatic=s.run.automationOnly?automaticClockWork(s):[];
 if(automatic.length)return {kind:'automation',label:automatic.join('・')};
 if(s.run.idleWait)return {kind:'wait',label:'手動待機（襲撃まで時間を進める）'};
 return {kind:'none',label:'作業なし'};
}
function startReadyStockWork(s){
 if(s.run.activeAction||!on(s,'stock_targets'))return;
 for(const target of s.settings.stockTargets){
  if(s.run.resources[target.id]>=target.count)continue;
  for(const producer of getProductionSources(s,target.id,target.count-s.run.resources[target.id])){
   const result=resolveGoal(s,producer.id);
   if(result.ok&&result.id){begin(s,result.id);s.run.activeAction.stock=true;return;}
  }
 }
}
function prepareCampClock(s){
  driveQueue(s);
  if(s.settings.paused)return false;
  startReadyStockWork(s);
  // Work replaces temporary waiting/automation permission; speed alone never owns time.
  if(s.run.activeAction){s.run.idleWait=false;s.run.automationOnly=false;}
  if(getClockStatus(s).kind==='none'){s.settings.paused=true;s.run.automationOnly=false;return false;}
  return true;
}
function returnFromRoute(s,won,reason){
  const points=finishRoute(s,won,reason);
  // A live fight returns to runnable camp work; an explicit pause remains a pause.
  if(!s.settings.paused)prepareCampClock(s);
  return points;
}
function step(s, dt) {
  if(s.run.status==='combat'){s.run.idleWait=false;advanceMeal(s,dt);}
  if(s.run.status==='preparing'&&!prepareCampClock(s))return;
  advanceFarm(s,dt,reserve(s));
  s.run.elapsed = round(s.run.elapsed + dt);
  if(s.run.routes?.active&&s.run.elapsed-s.run.routes.active.startedAt>=30){withdrawRoute(s,"時間切れ・帰還");return;}
  if(s.run.results){const rate=progressRates.get(s);if(rate)s.run.results.activeRealSeconds=round(s.run.results.activeRealSeconds+dt/rate);else s.run.results.timingComplete=false;}
  if (s.run.endless?.active) {
    s.run.endless.incomeTimer = round(s.run.endless.incomeTimer + dt);
    if (s.run.endless.incomeTimer >= 15) {
      s.run.endless.incomeTimer = round(s.run.endless.incomeTimer - 15);
      s.run.resources.gold = Math.min(1e9, round(s.run.resources.gold + (effect(s, "market").income || 0)));
    }
  }
  if (s.run.status === "combat") {
    s.run.companionState??=freshCompanion();s.run.companionState.foxCooldown=Math.max(0,s.run.companionState.foxCooldown-dt);
    advanceMagic(s,dt,n=>battleDamage(s,s.run.enemy,n*casterMultiplier(s)*(1+investmentEffect(s,'spellPower')+(accessoryEffects(s,'combat').spellPower||0)),'magic'));if(s.run.enemy.hp<=0){victory(s,s.run.enemy);return;}
    initializeGear(s);s.run.combatTimer=round(s.run.combatTimer+dt);s.run.playerCombatTimer=round(s.run.playerCombatTimer+dt);
    const enemyDue=s.run.combatTimer+1e-8>=1.5;if(enemyDue){s.run.enemy.round++;s.run.combatTimer=round(s.run.combatTimer-1.5);}
    const interval=combatBuild(s).interval;if(s.run.playerCombatTimer+1e-8>=interval){s.run.playerCombatTimer=round(s.run.playerCombatTimer-interval);playerAttack(s);}
    if(s.run.status==='combat'&&enemyDue)battleRound(s);
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
  let manualRepeatStopped=false;
  const a = s.run.activeAction;
  if (a) {
    a.progress = round(a.progress + dt);
    if (a.progress + 1e-8 >= a.duration) {
      complete(s, a);
      s.run.activeAction = null;
      const queueIndex = s.run.queue.findIndex(q => q.goalId === a.goalId);
      const q = s.run.queue[queueIndex];
      if (
        q &&
        a.goalId === q.goalId &&
        (q.kind === "action" || a.id === q.id)
      ) {
        if (!q.until && --q.count <= 0) {
          s.run.queue.splice(queueIndex, 1);
          event(s, "queue_complete");
        }
      }
      if (a.kind === "gather" && !a.goalId && !a.stock)
        s.run.activeAction = batch(s, a.id);
      s.run.queueManaged = false;
      if(s.run.manualRepeat===a.id){
        const check=canStartAction(s,a.id);
        if(check.ok)s.run.activeAction=batch(s,a.id);
        else{delete s.run.manualRepeat;s.run.idleWait=false;s.run.automationOnly=false;s.run.acceleration.active=false;s.settings.paused=true;manualRepeatStopped=true;log(s,'連続精錬を停止：'+check.reason,'craft');}
      }
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
  if(manualRepeatStopped)return;
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
    if (!s.run.activeAction && (!on(s,'action_queue')||!s.run.queue.length) && getClockStatus(s).kind==='none'){
      s.settings.paused = true;s.run.automationOnly=false;
    }
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
  if(real>0&&!s.settings.paused&&s.run.status==='preparing'&&!s.run.augments.offer.length&&!prepareCampClock(s))return;
  while (real > 1e-8 && !s.settings.paused) {
    const acceleration=getAccelerationStatus(s),fast=s.run.acceleration.active&&acceleration.canStart,multiplier=fast?acceleration.multiplier:1;
    const chunk = Math.min(
      0.02,
      real,
      fast ? s.run.acceleration.remainingSeconds : real,
    );
    if (chunk <= 0) {
      s.run.acceleration.active = false;
      continue;
    }
    progressRates.set(s,multiplier);
    try{tick(s, chunk * multiplier);}finally{progressRates.delete(s);}
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
  s.run = freshRun(s.meta, s.settings,CLASSIC_CAMPAIGN);
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
    disabledUpgrades:[...s.settings.disabledUpgrades],
  };
  s.legacyMigration = true;
  return s;
}

export function getVitalityMigrationXp(combatXp) {
  const target = Math.ceil((getSkillProgress(combatXp).level-1)*10/18)+1;
  return Array.from({length:target-1},(_,i)=>Math.round(50*(i+1)**1.3)).reduce((a,b)=>a+b,0);
}

export function startEndless(s) {
  if (s.run.status !== "cleared" || s.run.wave !== finalWaveForRun(s) || s.run.endless?.active) return fail("最終襲撃のクリア後に挑戦できます。");
  s.run.clearRecord ||= {generation:s.meta.generation,wave:finalWaveForRun(s),campaign:campaignForRun(s),seconds:Math.floor(s.run.elapsed),augments:[...s.run.augments.selected],badges:challengeResults(s)};
  if (s.meta.clears === 1) s.meta.firstClear ||= structuredClone(s.run.clearRecord);
  s.run.endless = {active:true,levels:{},incomeTimer:0};
  s.run.status = "preparing";
  s.settings.paused = true;
  s.run.nextWaveAt = round(s.run.elapsed + getRaidInterval(s));
  s.run.acceleration.active = false;
  log(s,"終わらぬ夜へ。村の施設Vから追加強化できます。","info");
  return ok();
}
import { orderedMaterialCosts, dependencyOrderedCosts, validMaterialPriority } from './material-priority.js?v=0.6.51';

export function orderRecipeMaterials(s,d,inventory=s.run.resources,count=1,alreadyPaid=new Set(),visiting=new Set()) {
  return dependencyOrderedCosts(getRecipeCost(s,d),s.settings.craftMaterialPriority||[],{
    inventory,count,visiting,
    sourceFor:(id,missing,seen)=>getProductionSources(s,id,missing,inventory,seen,alreadyPaid)[0],
    costFor:source=>getRecipeCost(s,source),
    isPaid:source=>!alreadyPaid.has(source.id)&&(s.run.activeAction?.id===source.id?s.run.activeAction:s.run.suspendedActions[source.id])?.kind==='craft',
  });
}

export function getLegacyRankStatus(s,key){
 const def=LEGACY_RANKS.find(x=>x.key===key);if(!def)return null;
 const target=s.run.status==='legacy_setup'?s.run.legacyDraft:s.meta;
 const owned=Array.from({length:MAX_LEGACY_RANK},(_,i)=>rankId(def,i+1)).filter(id=>target.upgrades.includes(id));
 const rank=owned.length,nextRank=rank<MAX_LEGACY_RANK?rank+1:null,next=nextRank?upgrades.get(rankId(def,nextRank)):null;
 const paidTotal=owned.reduce((n,id)=>n+target.paidCosts[id],0);
 const disabled=s.run.status==='legacy_setup'?(target.disabledUpgrades??s.settings.disabledUpgrades):s.settings.disabledUpgrades;
 const activeEffect=owned.reduce((n,id)=>n+(disabled.includes(id)?0:upgrades.get(id).effect[def.stat]),0);
 const totalEffect=owned.reduce((n,id)=>n+upgrades.get(id).effect[def.stat],0);
 const check=next?canPurchaseUpgrade(s,next.id):fail('初期実装はR5までです。');
 return {key,rank,nextRank,nextCost:next?.cost,nextIncrement:next?.effect[def.stat],nextTotal:totalEffect+(next?.effect[def.stat]||0),paidTotal,activeEffect,refundCost:rank?target.paidCosts[rankId(def,rank)]:0,canBuy:check.ok,reason:check.reason,canToggle:s.run.status==='legacy_setup'&&!s.run.augments.offer.length,toggleLabel:owned.some(id=>disabled.includes(id))?'全段階を有効化':'停止'};
}
export function purchaseLegacyRank(s,key){const r=getLegacyRankStatus(s,key),def=LEGACY_RANKS.find(x=>x.key===key);return r?.nextRank?purchaseUpgrade(s,rankId(def,r.nextRank)):fail('追加できるランクがありません。');}
export function refundLegacyRank(s,key){const r=getLegacyRankStatus(s,key),def=LEGACY_RANKS.find(x=>x.key===key);return r?.rank?refundUpgrade(s,rankId(def,r.rank)):fail('返却できるランクがありません。');}
export function toggleLegacyRank(s,key){const r=getLegacyRankStatus(s,key),def=LEGACY_RANKS.find(x=>x.key===key);if(!r?.rank||!r.canToggle)return fail('継承の構成変更は転生時に行います。');const owned=Array.from({length:r.rank},(_,i)=>rankId(def,i+1)),d=s.run.legacyDraft;d.disabledUpgrades??=[...s.settings.disabledUpgrades];const enable=owned.some(id=>d.disabledUpgrades.includes(id));d.disabledUpgrades=d.disabledUpgrades.filter(id=>!owned.includes(id));if(!enable)d.disabledUpgrades.push(...owned);return ok();}

export function resetLegacyRankDraft(s){if(s.run.status!=='legacy_setup')return fail('転生開始前だけ振り直せます。');let refunded=0;for(const def of LEGACY_RANKS)for(let n=MAX_LEGACY_RANK;n>=1;n--){const id=rankId(def,n);if(s.run.legacyDraft.upgrades.includes(id)){refunded+=s.run.legacyDraft.paidCosts[id];const result=refundUpgrade(s,id);if(!result.ok)return result;}}return {...ok(),refunded};}

export function cancelLegacyDraft(s){if(s.run.status!=='legacy_setup')return fail('転生開始前だけ変更を取り消せます。');s.run.legacyDraft={upgrades:[...s.meta.upgrades],paidCosts:{...s.meta.paidCosts},points:s.meta.points,disabledUpgrades:[...s.settings.disabledUpgrades]};return ok();}

export function startRoute(s,id){const r=canEnterRoute(s,id);if(!r.ok)return r;initializeRoutes(s);const d=preparationRoute(s,routeById(id)),enemy={...getNextEnemy(s),name:d.name,hp:d.hp,maxHp:d.hp,attack:d.attack,defense:d.defense,trait:d.trait,...(d.campaign?{image:d.image,traitParams:['heavy','flying'].includes(d.trait)?{every:4,multiplier:1.6}:null}:{}),pressure:null,isBoss:false,invasion:false,country:null,gold:0,hide:0,combatXpBudget:0};s.run.routes.active={id,startedAt:s.run.elapsed};beginRaid(s,enemy);s.settings.paused=false;return {ok:true};}
export function withdrawRoute(s,reason='撤退・帰還'){if(!s.run.routes?.active)return {ok:false,reason:'地域戦闘中ではありません。'};finishBattleReport(s,s.run.enemy,false);returnFromRoute(s,false,reason);return {ok:true};}

export const getReservedResources=s=>reserve(s);

export function useMeal(s,id){return consumeFood(s,id,getFoodHealing(s),getStats(s).maxHp);}
