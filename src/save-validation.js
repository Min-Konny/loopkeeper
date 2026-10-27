import{validMerchant}from './merchant.js?v=0.6.102';
import {validReplayRecord} from './replay-achievements.js?v=0.6.102';
import {REPLAY_ACHIEVEMENTS} from './replay-achievements.js?v=0.6.102';
import{ENCHANTMENTS,enchantmentResource,validEnchantmentState}from './enchantments.js?v=0.6.102';
import {EXTRA_SKILLS}from './new-skills.js?v=0.6.102';
import {validParty}from './party.js?v=0.6.102';
import {validPopulation}from './settlement.js?v=0.6.102';
import {validMeals}from './meals.js?v=0.6.102';
import {MEALS,mealByRecipe}from './meal-content.js?v=0.6.102';
import {preparationRoute}from './preparation-balance.js?v=0.6.102';
import {validWorkMilestones}from './work-milestones.js?v=0.6.102';
import {validTrophies} from './boss-materials.js?v=0.6.102';
import {validCampaign,campaignFinalWave,campaignIncludes,finalWaveForRun,encountersForRun,EXTENDED_ENCOUNTERS,FRONTIER_ENCOUNTERS,FRONTIER_CAMPAIGN,EXTENDED_CAMPAIGN}from './campaign-rules.js?v=0.6.102';
import {CONTRACTS,contractById}from './contracts.js?v=0.6.102';
import {validRegionalRewards}from './regional-rewards.js?v=0.6.102';
import {ROUTES,routeById}from './routes.js?v=0.6.102';
import {farmResource,resourceCap}from './farm-content.js?v=0.6.102';
import {COMPANIONS,companionById,companionEligible}from './companion-content.js?v=0.6.102';
import {alchemyResource}from './magic-content.js?v=0.6.102';
import {validPreset}from './build-presets.js?v=0.6.102';
import {ACCESSORIES,ACCESSORY_SLOTS}from './gear-content.js?v=0.6.102';
import {FREE_FEATURES,hasUpgrade}from './free-features.js?v=0.6.102';
import { endlessEnemy } from './endless.js?v=0.6.102';
import { validMaterialPriority } from './material-priority.js?v=0.6.102';
import { validCondition } from './queue-conditions.js?v=0.6.102';
import { CONTENT as C } from "./content.js?v=0.6.102";
const object = (x) => x !== null && typeof x === "object" && !Array.isArray(x);
const number = (x, min = 0, max = 1e9) =>
  Number.isFinite(x) && x >= min && x <= max;
const integer = (x, min = 0, max = 1e9) =>
  number(x, min, max) && Number.isInteger(x);
const unique = (xs) => Array.isArray(xs) && new Set(xs).size === xs.length;
const validMagicState=x=>object(x)&&number(x.mana,0,30)&&number(x.castTimer,0,4)&&number(x.burnTimer,0,1)&&integer(x.burnTicks,0,6)&&number(x.burnPower,0,3)&&number(x.wardCooldown,0,6)&&['casts','detonations','catalystsUsed','wardsUsed'].every(k=>integer(x[k]))&&['burnDamage','spellDamage'].every(k=>number(x[k]))&&x.catalystsUsed<=12&&x.wardsUsed<=12&&x.detonations<=x.casts&&x.detonations<=x.catalystsUsed;
const validCompanionState=x=>object(x)&&integer(x.woodCount,0,2)&&number(x.bonusWood)&&number(x.foxCooldown,0,8)&&integer(x.foxHits)&&number(x.foxDamage)&&integer(x.turtleCharges,0,2)&&integer(x.turtleBlocks,0,2)&&number(x.turtlePrevented,0,28);
const validFarm=x=>object(x)&&integer(x.feedUsed)&&integer(x.eggsProduced)&&integer(x.cycles,0,5e8)&&x.eggsProduced===x.cycles*2&&x.feedUsed===x.cycles*2+(x.batch?2:0)&&(x.batch===null||object(x.batch)&&number(x.batch.progress,0,20)&&x.batch.paidFeed===2&&x.batch.quantity===2);
const validTime=x=>object(x) && (x.game===null||number(x.game)) && (x.real===null||number(x.real));
const validResult=x=>object(x)&&(x.lateLoopVersion===undefined||x.lateLoopVersion===1)&&(x.routeRepeatPoints===undefined||x.lateLoopVersion===1&&integer(x.routeRepeatPoints,0,2)&&x.routeRepeatPoints<=x.repeatPoints)&&(x.earlyLoopVersion===undefined||x.earlyLoopVersion===1)&&(x.enemyRemainingPercent===undefined||x.enemyRemainingPercent===null||integer(x.enemyRemainingPercent,0,100))&&(x.campaign===undefined||validCampaign(x.campaign))&&integer(x.wave)&&integer(x.wallWave)&&number(x.gameSeconds)&&(x.realSeconds===null||number(x.realSeconds))&&integer(x.pointsGained)&&typeof x.partial==='boolean'&&(x.repeatPoints===undefined||integer(x.repeatPoints,0,x.lateLoopVersion===1?8:x.earlyLoopVersion===1?6:4))&&validList(x.freeUnlocks,new Set(FREE_FEATURES.map(f=>f.id)),5)&&(x.wallTime===null||validTime(x.wallTime))&&(x.previousWall===null||integer(x.previousWall,1))&&(x.wallReference===null||validTime(x.wallReference));
const defs = new Map(
  [...C.actions, ...C.equipment, ...C.processing, ...C.facilities].map((x) => [
    x.id,
    x,
  ]),
);
const skillIds = ["logging", "mining", "foraging", "smithing", "combat"];
const upgradeIds = new Set(C.legacy.map((x) => x.id));
const validSkills = (x) =>
  object(x) && EXTRA_SKILLS.every(d=>x[d.id]===undefined||object(x[d.id])&&number(x[d.id].xp)) && skillIds.every((id) => object(x[id]) && number(x[id].xp));
const validList = (x, set, max = 100) =>
  unique(x) && x.length <= max && x.every((id) => set.has(id));
const validGoal = (x) =>
  object(x) &&
  defs.has(x.id) &&
  integer(x.count, 1, 99) && (!defs.get(x.id)?.expedition || x.count===1&&x.kind==='goal'&&!x.until) &&
  ["goal", "action"].includes(x.kind) && validCondition(x);
function validBatch(x) {
  return (
    object(x) && (x.earlyLoopBatch===undefined||x.earlyLoopBatch===1) &&
    (x.mealOutputVersion===undefined||[1,2].includes(x.mealOutputVersion)&&!!mealByRecipe(x.id)) &&
    (x.paidCost === undefined || object(x.paidCost) && Object.entries(x.paidCost).every(([id,n]) => C.resources.some(r => r.id === id) && number(n))) &&
    defs.has(x.id) && !defs.get(x.id).expedition &&
    integer(x.instanceId, 1) &&
    ["main", "auto_cook", "processing_worker"].includes(x.channel) &&
    ["craft", "gather"].includes(x.kind) &&
    number(x.duration, 0.25, 1e6) &&
    number(x.progress, 0, x.duration + 0.1) &&
    number(x.runXp) &&
    number(x.permanentXp)
  );
}
function ledger(x, total, free = new Set()) {
  return (
    object(x) &&
    validList(x.upgrades, upgradeIds, upgradeIds.size) &&
    object(x.paidCosts) &&
    integer(x.points) &&
    Object.keys(x.paidCosts).length === x.upgrades.length &&
    x.upgrades.every(
      (id) =>
        integer(x.paidCosts[id], 1, 100) &&
        C.legacy
          .find((u) => u.id === id)
          .unlock.requires?.every((p) => x.upgrades.includes(p) || free.has(p)) !== false,
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
      !["A1", "A2", "A2.1"].includes(s.contentVersion) ||
      !object(s.meta) ||
      !object(s.run) ||
      !object(s.settings)
    )
      return false;
    const { meta: m, run: r, settings: t } = s;
    if(!validReplayRecord(s))return false;
    if(r.clearAchievements!==undefined&&!validList(r.clearAchievements,new Set(REPLAY_ACHIEVEMENTS.map(x=>x.id)),REPLAY_ACHIEVEMENTS.length))return false;
    if(r.clearAchievements?.some(id=>!s.replay?.unlocked?.some(x=>x.id===id)))return false;
    if(r.results?.startAccessories!==undefined&&!validList(r.results.startAccessories,new Set(ACCESSORIES.map(x=>x.id)),ACCESSORIES.length))return false;
    if(r.results?.startRouteClears!==undefined&&!validList(r.results.startRouteClears,new Set(ROUTES.map(x=>x.id)),ROUTES.length))return false;
    if(!validMeals(s))return false;
    if(r.enemy?.pressureVersion!==undefined&&r.enemy.pressureVersion!==1)return false;
    if(r.automationOnly!==undefined&&typeof r.automationOnly!=='boolean')return false;
    if(r.manualRepeat!==undefined&&(r.manualRepeat!=='smelt_iron'||!['preparing','combat'].includes(r.status)||r.activeAction?.id!==r.manualRepeat||r.activeAction.channel!=='main'||r.activeAction.kind!=='craft'||r.activeAction.goalId!==undefined||r.activeAction.stock||r.queueManaged))return false;
    if(!validWorkMilestones(s)||!validTrophies(s)||!validRegionalRewards(s))return false;
    if(r.campaign!==undefined&&(!validCampaign(r.campaign)||r.campaign!=="classic21"&&["A1","A2"].includes(s.contentVersion)))return false;
    const goal=finalWaveForRun(s);
    if(m.freeFeatures!==undefined && (!validList(m.freeFeatures,new Set(FREE_FEATURES.map(x=>x.id)),5) || m.foundationVersion!==1))return false;
    if(m.questRewardVersion!==undefined&&![1,2].includes(m.questRewardVersion))return false;
    if(m.questRewardVersion===undefined&&C.quests.some(q=>q.kind&&m.completedMilestones?.includes(q.id)))return false;
    if(m.questRewardVersion!==2&&['first_accessory','accessories_3'].some(id=>m.completedMilestones.includes(id)))return false;
    if(m.cycleGoalsVersion!==undefined&&m.cycleGoalsVersion!==1||r.cycleGoalsVersion!==undefined&&(r.cycleGoalsVersion!==1||m.cycleGoalsVersion!==1))return false;
    if(m.foundationVersion!==undefined && m.foundationVersion!==1)return false;
    if(m.featureRefundTotal!==undefined && !integer(m.featureRefundTotal,0,m.totalPoints))return false;
    const validClear = x => object(x) && integer(x.generation,1,m.generation) && (x.campaign===undefined?x.wave===21:validCampaign(x.campaign)&&x.wave===campaignFinalWave(x.campaign)) && integer(x.seconds) && validList(x.augments,new Set(C.augments.map(a=>a.id)),4) && validList(x.badges,new Set(['independent','architect','champion']),3);
    if(r.results!==undefined){const x=r.results,ids=new Set(FREE_FEATURES.map(f=>f.id));if(!object(x)||!integer(x.startPoints,0,m.totalPoints)||!validList(x.startFeatures,ids,5)||typeof x.partial!=='boolean'||typeof x.timingComplete!=='boolean'||!number(x.activeRealSeconds,0,r.elapsed)||!object(x.arrivals)||!object(x.clears)||(x.previousWall!==null&&!integer(x.previousWall,1))||(x.wallReference!==null&&!validTime(x.wallReference)))return false;for(const map of [x.arrivals,x.clears])if(Object.keys(map).length>30||Object.entries(map).some(([k,v])=>!/^\d+$/.test(k)||!integer(Number(k),1,Math.max(goal,r.wave+1))||!validTime(v)))return false;}
    if((m.history||[]).some(x=>x.result!==undefined&&!validResult(x.result)))return false;
    if([r.activeAction,...Object.values(r.suspendedActions||{})].some(x=>x?.earlyLoopBatch!==undefined&&r.earlyLoopVersion!==1))return false;
    if(m.earlyLoopFishBatching!==undefined&&(typeof m.earlyLoopFishBatching!=='boolean'||m.earlyLoopVersion!==1))return false;
    if(m.earlyLoopBatching!==undefined&&(typeof m.earlyLoopBatching!=='boolean'||m.earlyLoopVersion!==1))return false;
    if((m.preparationBalanceVersion!==undefined&&![1,2].includes(m.preparationBalanceVersion))||(r.preparationBalanceVersion!==undefined&&(![1,2].includes(r.preparationBalanceVersion)||r.preparationBalanceVersion!==m.preparationBalanceVersion)))return false;
    if((m.lateLoopVersion!==undefined&&m.lateLoopVersion!==1)||(r.lateLoopVersion!==undefined&&(r.lateLoopVersion!==1||m.lateLoopVersion!==1)))return false;
    if((m.earlyLoopVersion!==undefined&&m.earlyLoopVersion!==1)||(r.earlyLoopVersion!==undefined&&(r.earlyLoopVersion!==1||m.earlyLoopVersion!==1)))return false;
    if(m.repeatPoints!==undefined&&!integer(m.repeatPoints,0,Math.min(m.totalPoints,m.generation*(m.lateLoopVersion===1?8:m.earlyLoopVersion===1?6:4))))return false;
    if(r.progression!==undefined){const p=r.progression;if(!object(p)||(p.routeAward!==undefined&&(r.lateLoopVersion!==1||!integer(p.routeAward,0,2)||p.routeAward>(r.routes?.cleared||[]).filter(id=>["observatory","ice"].includes(id)).length))||!integer(p.startBestWave,0,Math.min(goal,m.bestWave))||!(p.checkpointAward===null||integer(p.checkpointAward,0,r.earlyLoopVersion===1?4:3))||!(p.attemptAward===null||integer(p.attemptAward,0,(r.earlyLoopVersion===1?2:1)+(r.preparationBalanceVersion===2?1:0)))||(p.checkpointAward||0)+(p.attemptAward||0)+(p.routeAward||0)>(m.repeatPoints||0))return false;if((p.checkpointAward||0)>0&&(p.startBestWave<(r.earlyLoopVersion===1?2:3)||r.wave<p.startBestWave)||(p.attemptAward||0)>0&&p.startBestWave<3)return false;}
    if(m.gearVersion!==undefined&&m.gearVersion!==1)return false;
    if((m.accessories!==undefined||m.accessorySets!==undefined)&&m.gearVersion!==1)return false;
    if(m.accessories!==undefined&&!validList(m.accessories,new Set(ACCESSORIES.map(x=>x.id)),ACCESSORIES.length))return false;
    if(m.accessorySlotsVersion!==undefined&&m.accessorySlotsVersion!==1)return false;
    if(m.accessorySlotsVersion===1&&(m.gearVersion!==1||m.accessorySets===undefined||!Array.isArray(r.ownedEquipment)))return false;
    if(m.accessorySets!==undefined){const slots=m.accessorySlotsVersion===1?ACCESSORY_SLOTS:["ring","bracelet"],sets=m.accessorySets;if(!object(sets)||Object.keys(sets).length!==2)return false;for(const phase of ['preparation','combat']){const row=sets[phase];if(!object(row)||Object.keys(row).length!==slots.length)return false;for(const slot of slots)if(row[slot]!==null&&(!m.accessories?.includes(row[slot])||ACCESSORIES.find(x=>x.id===row[slot])?.slot!==slot))return false;}}
    if((m.buildPresets!==undefined||m.nextBuildPresetId!==undefined||m.presetVersion!==undefined)&&m.presetVersion!==1)return false;
    if(m.presetVersion===1&&(!Array.isArray(m.buildPresets)||m.buildPresets.length>6||!integer(m.nextBuildPresetId,1)||new Set(m.buildPresets.map(p=>p.id)).size!==m.buildPresets.length||new Set(m.buildPresets.map(p=>p.name)).size!==m.buildPresets.length||m.buildPresets.some(p=>!validPreset(p,C.equipment)||p.id>=m.nextBuildPresetId)))return false;
    if(r.ownedEquipment!==undefined&&(!validList(r.ownedEquipment,new Set(C.equipment.map(x=>x.id)),C.equipment.length)||r.ownedEquipment.some(id=>!campaignIncludes(s,defs.get(id)?.campaign))||Object.values(r.equipment).some(x=>!r.ownedEquipment.includes(x.id))))return false;
    if(Object.values(r.equipment).some(x=>['orichalcum_bow','orichalcum_crossbow','orichalcum_staff'].includes(x.id)&&!r.ownedEquipment?.includes(x.id)))return false;
    if(r.playerCombatTimer!==undefined&&!number(r.playerCombatTimer,0,3))return false;
    if(r.enemy?.buildCombat!==undefined){const b=r.enemy.buildCombat;if(!object(b)||!number(b.critGauge,0,.999999999)||!integer(b.hits))return false;}
    if(r.enemy?.report&&['playerHits','criticalHits'].some(k=>r.enemy.report[k]!==undefined&&!integer(r.enemy.report[k])))return false;
    if((r.contracts!==undefined||m.contractVersion!==undefined)&&m.contractVersion!==1)return false;
    if(m.contractVersion===1){const x=r.contracts,ids=new Set(CONTRACTS.map(d=>d.id));if(!object(x)||!validList(x.completed,ids,2)||new Set(x.completed.map(id=>contractById(id).country)).size!==x.completed.length||x.completed.some(id=>m.bestWave<contractById(id).gate||r.wave<1)||!(x.active===null||contractById(x.active)&&m.bestWave>=contractById(x.active).gate&&r.wave>=1&&!x.completed.some(id=>contractById(id).country===contractById(x.active).country)))return false;}
    if(!validPopulation(s))return false;
    if((r.routes!==undefined||m.routeClears!==undefined)&&m.routeVersion!==1)return false;
    if(m.routeVersion!==undefined&&m.routeVersion!==1)return false;
    if(m.routeVersion===1){const ids=new Set(ROUTES.map(x=>x.id)),x=r.routes;if(!validList(m.routeClears,ids,ROUTES.length)||(m.routeClears.length>0&&m.bestWave<3)||!object(x)||!validList(x.cleared,ids,ROUTES.length)||x.cleared.some(id=>!m.routeClears.includes(id)||routeById(id).campaign&&(r.campaign!==routeById(id).campaign||r.wave<routeById(id).wave))||!(x.active===null||object(x.active)&&routeById(x.active.id)&&(!routeById(x.active.id).campaign||r.campaign===routeById(x.active.id).campaign&&r.wave>=routeById(x.active.id).wave)&&!x.cleared.includes(x.active.id)&&r.wave>=3&&number(x.active.startedAt,0,r.elapsed)&&r.elapsed-x.active.startedAt<=30.1&&r.status==='combat')||!(x.last===null||object(x.last)&&routeById(x.last.id)&&typeof x.last.won==='boolean'&&typeof x.last.reason==='string'&&number(x.last.seconds,0,30.1)&&integer(x.last.points,0,4)))return false;}
    if(m.farmVersion!==undefined&&m.farmVersion!==1)return false;
    if(r.farmState!==undefined&&!validFarm(r.farmState))return false;
    if(m.farmVersion===1&&(!validFarm(r.farmState)||typeof t.farmAutoCook!=='boolean'||typeof t.farmOffline!=='boolean'))return false;
    if(!['fodder','eggs'].every(id=>r.resources[id]===undefined&&m.farmVersion===undefined||number(r.resources[id],0,resourceCap(id))))return false;
    if(m.magicVersion!==undefined&&m.magicVersion!==1)return false;
    if(m.magicVersion===1&&(r.magicState===undefined||t.alchemyUse===undefined))return false;
    if(r.merchant!==undefined&&!validMerchant(r.merchant,C.market.filter(m=>m.direction==='buy'&&m.resource).map(m=>m.resource)))return false;
    if(r.enchantmentVersion!==undefined&&r.enchantmentVersion!==1)return false;
    if(r.enchantmentVersion===1&&(!r.enchantment||ENCHANTMENTS.some(d=>r.resources[d.id]===undefined)))return false;
    if(r.enchantment!==undefined&&!validEnchantmentState(r.enchantment))return false;
    if(ENCHANTMENTS.some(d=>r.resources[d.id]!==undefined&&!integer(r.resources[d.id],0,12)))return false;
    if(r.magicState!==undefined&&!validMagicState(r.magicState))return false;
    if(t.alchemyUse!==undefined&&(!object(t.alchemyUse)||typeof t.alchemyUse.catalyst!=='boolean'||typeof t.alchemyUse.ward!=='boolean'))return false;
    if(['spark_catalyst','ward_essence'].some(id=>r.resources[id]!==undefined&&!integer(r.resources[id],0,12)))return false;
    if(m.companionVersion!==undefined&&m.companionVersion!==1)return false;
    if((m.companions!==undefined||m.activeCompanion!==undefined)&&m.companionVersion!==1)return false;
    if(r.companionState!==undefined&&!validCompanionState(r.companionState))return false;
    if(m.companionVersion===1){if(!validList(m.companions,new Set(COMPANIONS.map(p=>p.id)),COMPANIONS.length)||m.companions.some(id=>!companionEligible(s,companionById(id)))||(m.activeCompanion!==null&&!m.companions.includes(m.activeCompanion))||!validCompanionState(r.companionState))return false;}
    const free=m.foundationVersion===1?new Set([...(m.freeFeatures||[]),...FREE_FEATURES.filter(f=>m.bestWave>=f.wave).map(f=>f.id)]):new Set();
    if (m.firstClear !== undefined && !validClear(m.firstClear)) return false;
    if(m.firstExtendedClear!==undefined&&(!validClear(m.firstExtendedClear)||m.firstExtendedClear.campaign!==EXTENDED_CAMPAIGN))return false;
    if(m.firstFrontierClear!==undefined&&(!validClear(m.firstFrontierClear)||m.firstFrontierClear.campaign!==FRONTIER_CAMPAIGN))return false;
    if (m.bestEndlessWave !== undefined && !integer(m.bestEndlessWave,21)) return false;
    if (r.clearRecord !== undefined && (!validClear(r.clearRecord)||r.clearRecord.wave!==goal)) return false;
    if (r.endless !== undefined && (!object(r.endless) || r.endless.active !== true || r.wave < goal || !validClear(r.clearRecord) || r.clearRecord.wave!==goal || !object(r.endless.levels) || !number(r.endless.incomeTimer,0,15) || Object.entries(r.endless.levels).some(([id,n])=> !C.facilities.some(f=>f.facilityId===id) || !integer(n,0,10000) || (r.facilities[id]||0)<5))) return false;
    if (m.discovered !== undefined && !validList(m.discovered, new Set([...defs.keys(), 'feature_village', 'feature_diplomacy', 'feature_augments']), 200)) return false;
    if (
      !integer(m.generation, 1) ||
      !integer(m.bestWave) ||
      !integer(m.totalPoints) ||
      !integer(m.clears) ||
      !ledger(m, m.totalPoints,free) ||
      !validSkills(m.skills)
    )
      return false;
    if (
      !validList(
        m.completedMilestones,
        new Set(C.quests.map((q) => q.id)),
        C.quests.length,
      ) ||
      !unique(m.defeatedBosses) ||
      m.defeatedBosses.some(
        (id) =>
          ![...C.encounters,...EXTENDED_ENCOUNTERS,...FRONTIER_ENCOUNTERS].some((e) => e.boss && e.id === id) &&
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
      !C.resources.every((x) => number(r.resources[x.id]) || enchantmentResource(x.id)&&r.resources[x.id]===undefined || x.id==='herb_soup'&&r.resources[x.id]===undefined || MEALS.some(m=>m.id===x.id)&&r.resources[x.id]===undefined&&r.mealVersion===undefined || farmResource(x.id)&&r.resources[x.id]===undefined&&m.farmVersion===undefined || alchemyResource(x.id)&&r.resources[x.id]===undefined&&m.magicVersion===undefined || x.id === "fish" && r.resources.fish === undefined && ["A1","A2"].includes(s.contentVersion))
    )
      return false;
    if (
      !["preparing", "combat", "dead", "cleared", "legacy_setup"].includes(
        r.status,
      ) ||
      !integer(r.wave, 0, r.endless?.active ? 1000000 : goal) ||
      !number(r.elapsed) ||
      !number(r.nextWaveAt) ||
      !number(r.hp) ||
      !number(r.combatTimer, 0, 1.6) ||
      !number(r.simRemainder, 0, 60)
    )
      return false;
    if(!validParty(s))return false;
    if (r.training !== undefined && (!object(r.training) || !number(r.training.defense) || !number(r.training.vitality))) return false;
    if (r.status === "legacy_setup" && (!ledger(r.legacyDraft, m.totalPoints,free) || (r.legacyDraft.disabledUpgrades!==undefined && !validList(r.legacyDraft.disabledUpgrades,upgradeIds,upgradeIds.size))))
      return false;
    if (r.status === "cleared" && r.wave !== goal) return false;
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
          !campaignIncludes(s,d.campaign) ||
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
          !C.facilities.some((f) => f.facilityId === id) || !C.facilities.some(f => f.facilityId === id && f.level === n),
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
        !["cook_meal",...MEALS.map(m=>m.recipe)].includes(r.autoCraft.id))
    )
      return false;
    if (
      !object(r.workers) ||
      C.workers.some((w) => {
        const rw = r.workers[w.id];
        return (
          !object(rw) ||
          !integer(rw.level, 0, w.levels.length-1) ||
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
    if (r.encounterDepth !== undefined && typeof r.encounterDepth !== "boolean") return false;
    if (m.challengeBadges !== undefined && !validList(m.challengeBadges, new Set(['independent','architect','champion']), 3)) return false;
    if (r.strategy !== undefined && (!object(r.strategy) || !['constructionUntil','focus','playerDamage','facilityDamage'].every(k => number(r.strategy[k])) || r.strategy.focus > 30 || typeof r.strategy.eligible !== 'boolean' || typeof r.strategy.aidUsed !== 'boolean')) return false;
    const validReport = x => object(x) && (x.archer===undefined||number(x.archer)) && (x.magic===undefined||number(x.magic)) && (x.magicState===undefined||validMagicState(x.magicState)) && (x.pet===undefined||number(x.pet)) && (x.companion===undefined||validCompanionState(x.companion)&&(x.companion.id===null||!!companionById(x.companion.id))) && ['player','guards','tower','counter','prevented','foodHealing','treatmentHealing','damageTaken','rounds','wave'].every(k => number(x[k]));
    if (r.battleReports !== undefined && (!Array.isArray(r.battleReports) || r.battleReports.length > 8 || r.battleReports.some(x => !validReport(x) || typeof x.enemy !== 'string' || x.enemy.length > 100 || typeof x.won !== 'boolean' || !number(x.remainingHp) || !number(x.maxHp)))) return false;
    if (r.enemy?.report !== undefined && !validReport(r.enemy.report)) return false;
    if (r.enemy?.baseDefense !== undefined && !number(r.enemy.baseDefense)) return false;
    if (r.enemy?.retaliation !== undefined && typeof r.enemy.retaliation !== 'boolean') return false;
    if (r.enemy?.supplied !== undefined && typeof r.enemy.supplied !== 'boolean') return false;
    if (r.enemy?.pressure != null && !['rally','sunder'].includes(r.enemy.pressure)) return false;
    const a = r.augments;
    if (
      !object(a) ||
      !integer(a.seed, 0, 4294967295) ||
      (a.rerollsUsed !== undefined && !integer(a.rerollsUsed, 0, 4)) ||
      (a.exclusionVersion!==undefined&&a.exclusionVersion!==1) ||
      ((a.excluded!==undefined||a.exclusionsUsed!==undefined)&&a.exclusionVersion!==1) ||
      (a.exclusionVersion===1&&(!validList(a.excluded,new Set(C.augments.map(x=>x.id)),1)||!integer(a.exclusionsUsed,0,1)||a.exclusionsUsed!==a.excluded.length||a.exclusionsUsed>(a.rerollsUsed||0)||a.excluded.some(id=>a.offer.includes(id)||a.selected.includes(id)))) ||
      !validList(a.selected, new Set(C.augments.map((a) => a.id)), r.endless?.active ? C.augments.length : 4) ||
      !validList(a.offer, new Set(C.augments.map((a) => a.id)), 3) ||
      a.offer.some((id) => a.selected.includes(id)) ||
      !unique(a.offeredStages) ||
      a.offeredStages.some((x) => !["start", 3, 9, 15].includes(x) && !(r.endless?.active && integer(x,24,r.wave) && x%6===0)) ||
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
        d = r.endless?.active ? endlessEnemy(r.wave+1,encountersForRun(s,C.encounters),goal) : encountersForRun(s,C.encounters)[r.wave],
        route = r.routes?.active ? preparationRoute(s,routeById(r.routes.active.id)) : null;
      if (
        !object(e) ||
        !d ||
        e.id !== d.id ||
        e.wave !== r.wave + 1 ||
        (r.routes?.active&&(e.xpBudget!==0||e.maxHp!==route.hp||e.attack!==route.attack||e.defense>route.defense||e.trait!==route.trait||e.country!==null||e.invasion!==false||e.pressure!=null)) ||
        !number(e.hp, 0, e.maxHp) ||
        !number(e.maxHp, 1) ||
        !number(e.attack) ||
        !number(e.defense) ||
        !integer(e.round) ||
        !number(e.xpBudget) ||
        !number(e.xpAwarded, 0, e.xpBudget) ||
        !integer(e.charges, 0, 5)
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
      typeof t.paused !== "boolean" || (t.gameSpeed!==undefined&&![1,2,5].includes(t.gameSpeed)) ||
      (t.craftMaterialPriority !== undefined && !validMaterialPriority(t.craftMaterialPriority)) ||
      t.speed !== 1 ||
      !validList(t.disabledUpgrades, upgradeIds, upgradeIds.size) ||
      !validList(
        t.hiddenRecipes,
        new Set(C.equipment.concat(C.facilities).map((x) => x.id)),
          48,
      ) ||
      !number(t.soundVolume, 0, 1) ||
      (t.musicVolume !== undefined && !number(t.musicVolume, 0, 1)) ||
      (t.ambientVolume !== undefined && !number(t.ambientVolume, 0, 1)) ||
      typeof t.effectsEnabled !== "boolean" ||
      (t.pauseWhenHidden !== undefined && typeof t.pauseWhenHidden !== "boolean") ||
      typeof t.showHiddenRecipes !== "boolean" ||
      !integer(t.foodTarget, 0, 9999) ||
      !integer(t.processingTarget, 0, 9999) ||
      !Array.isArray(t.stockTargets) ||
      t.stockTargets.length > C.resources.length ||
      t.stockTargets.some(
        (x) =>
          !C.resources.some((y) => y.id === x.id) || !integer(x.count, 1, Math.min(9999,resourceCap(x.id))),
      ) ||
      !object(t.workerTargets)
    )
      return false;
    return true;
  } catch {
    return false;
  }
}
