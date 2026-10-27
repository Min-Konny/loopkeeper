import {isFrontierFinish,finishDismissed,dismissFinish,finishReturnMarkup,mountFrontierFinish,nextPermanentTargetsMarkup} from './frontier-finish.js?v=0.6.102';
import {NAV_SHORT,speedControls,queueContext,mountResponsiveControls} from './interface-controls.js?v=0.6.102';
import {preserveRenderScroll} from './render-scroll.js?v=0.6.102';
import{campHealthMarkup,formatHealth}from './camp-health.js?v=0.6.102';
import{merchantNotice}from './merchant-ui.js?v=0.6.102';
import{editStoredMerchant}from './merchant-storage.js?v=0.6.102';
import{VILLAGE_CATEGORIES,villageCategory,villageCategoriesMarkup,specialistWorkLink}from './village-navigation.js?v=0.6.102';
import {memberFor,partyWeapon}from './party.js?v=0.6.102';
import {skillVisible}from './new-skills.js?v=0.6.102';
import {allocatePopulation}from './settlement.js?v=0.6.102';
import {populationMarkup}from './settlement-ui.js?v=0.6.102';
import {setGameSpeed}from './game-speed.js?v=0.6.102';
import{canEarlyRaid}from './engine.js?v=0.6.102';
import{earlyRaidControl,earlyRaidToken,earlyRaidConfirmation}from './early-raid-ui.js?v=0.6.102';
import{editStoredEarlyRaid}from './early-raid-storage.js?v=0.6.102';
import{usefulGoalsMarkup}from './useful-goals.js?v=0.6.102';
import {mealMarkup}from './meal-ui.js?v=0.6.102';
import {getTotalFood,mealStatus,useMeal,setMealPreference,setRecoveryMeal,setAutoCookRecipe}from './engine.js?v=0.6.102';
import './decision-keyboard.js?v=0.6.102';
import {pixelFacilityProduct} from './pixel-product-art.js?v=0.6.102';
import {isQueuedNumberInput,captureQueuedNumberEdit,queuedNumberEditIndex,queuedNumberEditValue,restoreQueuedNumberEdit,preserveQueuedNumberEdit}from './queue-number-edit.js?v=0.6.102';
import { mountPixelCamp } from './pixel-camp-scene.js?v=0.6.102';
import {mountPhaserCamp}from './phaser-camp-scene.js?v=0.6.102';
import {trainingMode,nextTrainingLevel,trainingLevelEditor,trainingQueueEditor}from './training-queue-ui.js?v=0.6.102';
import {queueTraining}from './planner.js?v=0.6.102';
import {editQueuedTrainingLevel}from './engine.js?v=0.6.102';
import {raidEnemyStats}from './raid-info-ui.js?v=0.6.102';
import {stockMarkup}from './stock-ui.js?v=0.6.102';
import {inventoryMarkup,queueStopStatus,queueStopMarkup,createStopTransition,createQuestSeen,BAG_CATEGORIES}from './camp-space-ui.js?v=0.6.102';
import {installDialogDismissal}from './dialog-dismissal.js?v=0.6.102';
import {createExpandedPane}from './expanded-pane.js?v=0.6.102';
import {createInheritanceMapUI}from './inheritance-map-ui.js?v=0.6.102';
import {acknowledgeWorkRewards}from './work-milestone-storage.js?v=0.6.102';
import {getClockStatus} from './engine.js?v=0.6.102';
import {CRAFT_CATEGORIES,craftCategory,craftCategoryMarkup,readUiPreference,saveUiPreference} from './craft-categories.js?v=0.6.102';
import {marketMarkup} from './mvp-ui.js?v=0.6.102';
import {trophyMarkup} from './boss-materials.js?v=0.6.102';
import {editStoredAugment}from './augment-choice-storage.js?v=0.6.102';import {augmentExclusionMarkup}from './augment-exclusion-ui.js?v=0.6.102';
let augmentSaveError='',pendingAugmentExclude=null;
import {clearHistoryMarkup}from './clear-history-ui.js?v=0.6.102';
import {replayAchievementsMarkup}from './replay-achievements-ui.js?v=0.6.102';
import {finalWaveForRun}from './campaign-rules.js?v=0.6.102';
import {contractsMarkup}from './contracts-ui.js?v=0.6.102';import {editStoredContract}from './contracts-storage.js?v=0.6.102';
import {routesMarkup}from './routes-ui.js?v=0.6.102';import {editStoredRoute}from './routes-storage.js?v=0.6.102';
import {settleFarmOffline}from './farm-offline.js?v=0.6.102';
import {farmMarkup}from './farm-ui.js?v=0.6.102';import {editStoredFarm}from './farm-storage.js?v=0.6.102';
import {companionMarkup}from './companion-ui.js?v=0.6.102';import {companionById}from './companion-content.js?v=0.6.102';import {proposeCompanion,confirmStoredCompanion}from './companion-storage.js?v=0.6.102';
import {editStoredMagic}from './magic-storage.js?v=0.6.102';
import {proposeBuildRestore}from './build-presets.js?v=0.6.102';import {editStoredBuild}from './build-presets-storage.js?v=0.6.102';import {buildRestoreMarkup}from './build-presets-ui.js?v=0.6.102';
import {gearMarkup}from './gear-ui.js?v=0.6.102';import {editStoredGear}from './gear-storage.js?v=0.6.102';import {trainBuild}from './gear-training.js?v=0.6.102';
import {runResultMarkup}from './run-results-ui.js?v=0.6.102';
import {editStoredLegacyRank}from './legacy-ranks-storage.js?v=0.6.102';
import {migrateStoredFoundation}from './foundation-storage.js?v=0.6.102';
import {hasUpgrade,FREE_FEATURES}from './free-features.js?v=0.6.102';
import { confirmStoredRun } from './run-confirmation.js?v=0.6.102';
import { trainingPurpose } from './training-purpose.js?v=0.6.102';
import { GATHER_VIEW_KEY, readGatherView, readGatherPreference, saveGatherView, gatherGuideMarkup } from './gather-display.js?v=0.6.102';
import { workshopProduct, workshopMaterialIcon, materialShortage } from './workshop-art.js?v=0.6.102';
import { createRewardDisplay } from './reward-notices.js?v=0.6.102';
import { withWorkCompletions } from './work-completion.js?v=0.6.102';
import { portraitImage, portraitBadge } from './portrait-art.js?v=0.6.102';
import { reinforcementEffect } from './endless.js?v=0.6.102';
import { setTextIfChanged } from './dom-text.js?v=0.6.102';
import { validateReservationInput, reservationInputError, installReservationKeyboard, restoreControlFocus } from './reservation-input.js?v=0.6.102';
import { createRecipeSearch, filterRecipeNames } from './recipe-search.js?v=0.6.102';
import { prepareTemplateOverwrite, commitTemplateOverwrite, templateOverwriteMarkup } from './template-overwrite.js?v=0.6.102';
import { prepareMaterialPriority, commitMaterialPriority, materialPriorityMarkup, editMaterialPriority } from './material-priority-ui.js?v=0.6.102';
import { startEndless } from './engine.js?v=0.6.102';
import { augmentStatusMarkup } from './augments-ui.js?v=0.6.102';
import { getActionYields } from './engine.js?v=0.6.102';
import { reportMarkup, enemyRoadmap, challengesMarkup, chapterPresentation, queueTimingMarkup, conditionalMarkup, updateConditionDraft, conditionalRequest, conditionLabel } from './strategy-ui.js?v=0.6.102';
import { enqueueConditional } from './engine.js?v=0.6.102';
import { tradeResource } from "./engine.js?v=0.6.102";
import { changelogMarkup } from "./changelog.js?v=0.6.102";
import { createBackgroundClock } from "./background-clock.js?v=0.6.102";
import { updateSetupDialog } from "./setup-dialog.js?v=0.6.102";
import { compareRun } from './visual-design.js?v=0.6.102';
import { createRenderGuard } from './render-guard.js?v=0.6.102';
import { installQueueDrag } from './queue-drag.js?v=0.6.102';
import { preparationMarkup } from './preparation-ui.js?v=0.6.102';
import { saveClearCard } from './clear-card.js?v=0.6.102';
import { runFrameTasks } from './frame-loop.js?v=0.6.102';
import { getCatalog } from "./engine.js?v=0.6.102";
import { CONTENT } from "./content.js?v=0.6.102";
import {
  isLegacy,
  isKnown,
  resourceKnown,
  confirmRun,
  refundUpgrade,
  configureWorker,
  upgradeWorker,
  setStockTarget,
  saveTemplate,
  loadTemplate,
  deleteTemplate,
} from "./engine.js?v=0.6.102";
import {
  setupMarkup,
  diplomacyMarkup,
  autoCookingMarkup,
  processingMarkup,
  diplomacyDeadlineMarkup,
  automationMarkup,
  templatesMarkup,
  milestoneMarkup as economicMilestoneMarkup,
  synergyMarkup,
} from "./mvp-ui.js?v=0.6.102";
import {earlyDefeatMarkup}from './early-loop.js?v=0.6.102';
import { createSessionOwner } from "./session-owner.js?v=0.6.102";
import { editQueuedAction, moveQueuedAction } from "./engine.js?v=0.6.102";
import {
  loadStoredGame,
  writeStoredGame,
  readBackups,
  decodeRecord,
  unreadableRecord,
  readResetBackup,
  resetStoredGame,
  replaceStoredGame,
} from "./save-storage.js?v=0.6.102";
import {
  updatePresentation,
  playCompletedWork,
  markQueueEdited,
  unlockAudio,
  previewSound,
} from "./presentation.js?v=0.6.102";
import {
  getRaidInterval,
  aidCountry,
  refuseCountry,
  buySupply,
  purchaseUpgrade,
  toggleUpgrade,
  removeQueuedAction,
  clearQueue,
  getQueueStatus,
  createGame,
  getSkillProgress,
  getStats,
  getActionDuration,
  getNextEnemy,
  canStartAction,
  startAction,
  stopAction,
  restartRun,
  abandonRun,
  serializeGame,
  parseSave,
} from "./engine.js?v=0.6.102";
import { icon } from "./icons.js?v=0.6.102";
import { planCraft, queueCraft, queueAction, queueWork, selectManualAction, blockedReservation, recoverReservation } from "./planner.js?v=0.6.102";
import {
  FIRST_RAID_DELAY,
  getUnlocks,
  getAugmentStatus,
  chooseAugment,
  rerollAugments,
  getRecipeCost,
  getFoodHealing,
  getSkillEffects,
} from "./engine.js?v=0.6.102";
import { renderAugments } from "./augments-ui.js?v=0.6.102";
import {canStartManualRepeat}from './engine.js?v=0.6.102';
import {editStoredManualRepeat}from './manual-repeat-storage.js?v=0.6.102';
import {manualRepeatMarkup}from './manual-repeat-ui.js?v=0.6.102';
import {LEGACY_CATEGORIES}from './legacy-categories.js?v=0.6.102';
import { renderUpgradeSections } from "./upgrades-ui.js?v=0.6.102";
import { renderBattle, suspendBattle } from "./battle-ui.js?v=0.6.102";
import { mountCampScene } from "./camp-scene.js?v=0.6.102";
import { workScene, syncWorkAnimation } from "./work-scene.js?v=0.6.102";
import { getRecipeVisibility } from "./workshop.js?v=0.6.102";
import { getMilestoneStatus } from "./engine.js?v=0.6.102";
import {
  advanceTime,
  getAccelerationStatus,
  startAcceleration,
  stopAcceleration,
} from "./engine.js?v=0.6.102";

history.scrollRestoration = "manual";
const wideWorkLayout=window.matchMedia("(min-width:1000px)");
let queueExpanded = false;
let queueRailMutation=false;
let loadWarning = "";
let state = loadGame();
let foundationPending=false;let farmOfflinePending=false;
let {
  SKILLS,
  RESOURCES,
  ACTIONS,
  RECIPES,
  FACILITIES,
  DIPLOMACY,
  BUYABLES,
  LEGACY_UPGRADES,
  MILESTONES,
} = getCatalog(state);
function refreshCatalog() {
  ({
    SKILLS,
    RESOURCES,
    ACTIONS,
    RECIPES,
    FACILITIES,
    DIPLOMACY,
    BUYABLES,
    LEGACY_UPGRADES,
    MILESTONES,
  } = getCatalog(state));
}
state.settings.paused = true;
let tab = readUiPreference(localStorage,"loopkeeper-work-tab-v1",["gather","craft","village","diplomacy","trade","legacy","workers"],"gather");
let selectedSkill = null;
let gatherView=readGatherView(localStorage);
let gatherTried=readGatherPreference(localStorage).tried;
const milestoneMarkup=s=>economicMilestoneMarkup(s)+gatherGuideMarkup(gatherTried);
let queueDraftId = "chop_wood";
let queueDraftCount = 1;
let savedAt = null;
let saveFailed = false;
let toastTimer;
let lastTick = performance.now();
let lastRender = 0;
let lastSave = 0;
let deadShown = false;
let displayedOffer = "";
let setupShown = false;
let setupCategory = "combat";
let marketSide=readUiPreference(localStorage,"loopkeeper-market-side-v1",["buy","sell"],"buy"), marketCount=readUiPreference(localStorage,"loopkeeper-market-count-v1",["1","10","100","all"],"1");marketCount=marketCount==="all"?"all":Number(marketCount);
let villageFilter=readUiPreference(localStorage,'loopkeeper-village-category-v1',VILLAGE_CATEGORIES.map(x=>x[0]),'all');
let craftFilter = readUiPreference(localStorage,"loopkeeper-craft-category-v1",CRAFT_CATEGORIES.map(x=>x[0]),"all");
let showOwnedAccessories=false;
let legacyCategory=readUiPreference(localStorage,'loopkeeper-legacy-category-v1',LEGACY_CATEGORIES.map(x=>x.id).concat('map'),'combat');
const craftQuantities = {};
document.addEventListener('change',event=>{if(event.target.matches('[data-bag-zero]')){bagShowZero=event.target.checked;committedSelect=event.target;render();}});
let bagResetScroll=false,bagShowZero=false,bagCategory='all',manualPauseReason='',currentQueueStop=null;
const questSeen=createQuestSeen(localStorage,state.meta.completedMilestones),stopTransition=createStopTransition();
let activeBattle = null;
const skillIcons = {cooking:"food",alchemy:"herbs",commerce:"gold",archery:"bow",sorcery:"spark",
  logging: "axe",
  mining: "pickaxe",
  foraging: "leaf",
  smithing: "hammer",
  combat: "sword",
};
const slotNames = { weapon: "武器", armor: "防具", shield: "盾", tool: "道具" };
const slotIcons = {
  weapon: "sword",
  armor: "armor",
  shield: "shield",
  tool: "tool",
};
const tabNames = {
  gather: ["採集と訓練", "今日の備えが、次の命の力になる。"],
  craft: ["野営地の工房", "集めた資源を、生き延びる力に。"],
  village: ["村の施設", "備えを築き、この命をもう少し先へ。"],
  trade: ["交易", "資源の売買と、傭兵の雇用。"],
  diplomacy: ["外交", "食料を分かち合うか、武器を手に迎えるか。"],
  legacy: ["継承", "経験と解放を、次の命へ。"],
  workers: ["人員", "仲間の作業先と強化を選ぶ。"],
};
const format = (number) =>
  Math.floor(Number(number) || 0).toLocaleString("ja-JP");
const escape = (text) =>
  String(text ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const time = (seconds) =>
  `${String(Math.floor(Math.max(0, seconds) / 60)).padStart(2, "0")}:${String(Math.floor(Math.max(0, seconds) % 60)).padStart(2, "0")}`;
const progress = (value) => Math.min(100, Math.max(0, value * 100));
const skillLevel = (id, permanent = false) =>
  getSkillProgress(
    (permanent ? state.meta.skills : state.run.skills)[id]?.xp || 0,
    permanent,
  );
const resourceName = (id) => RESOURCES[id]?.name || id;
const hasLegacyOptions = () =>
  state.meta.bestWave >= 3 ||
  state.meta.points > 0 ||
  state.meta.upgrades.length > 0;
const basicRecipes = new Set([
  "wooden_spear",
  "wooden_armor",
  "wooden_shield",
  "work_tools",
  "cook_meal",
]);
const visibleRecipe = (recipe) =>
  isLegacy(state)
    ? recipe.facility
      ? getUnlocks(state).facilities && recipe.level === 1
      : !recipe.knownAfterBoss &&
        (state.meta.bestWave >= 1 || basicRecipes.has(recipe.id))
    : isKnown(state, recipe) &&
      (state.meta.bestWave >= 1 ||
        basicRecipes.has(recipe.id) ||
        skillLevel(recipe.skill).level >= recipe.unlockLevel);
const visibleResource = (id) =>
  isLegacy(state)
    ? Object.keys(state.run.resources).includes(id)
    : resourceKnown(state, id) &&
      (id !== "gold" || getUnlocks(state).facilities);

function runGrowth(skill) {
  const effects = getSkillEffects(state, skill);
  return `作業速度 +${effects.runSpeedPercent}%${skill === "combat" ? ` · 攻撃 +${effects.runAttack} · 最大HP +${effects.runMaxHp}` : ["archery","sorcery"].includes(skill)?` · ${skill==='archery'?'弓攻撃':'魔力'} +${effects.runAttack}`:""}`;
}

function savedWorkNote(work) {
  if (!work) return "";
  return `<div class="saved-work" role="progressbar" aria-label="作業の進み具合" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(progress(work.progress / work.duration))}"><div class="work-track"><i style="width:${progress(work.progress / work.duration)}%"></i></div></div>`;
}

function loadGame() {
  try {
    const loaded = loadStoredGame(localStorage);
    loadWarning = loaded.warning;
    if (loaded.game) return loaded.game;
  } catch {
    loadWarning =
      "ブラウザーの保存領域を利用できません。保存メニューからデータを書き出せます。";
  }
  return createGame({earlyLoopPrototype:true,lateLoopPrototype:true,preparationBalancePrototype:true});
}

function saveGame(force = false, checkpoint = false) {
  if (!session.owned || (loadWarning && !force)) return;
  if(farmOfflinePending){const r=settleFarmOffline(localStorage,state,{isOwner:()=>session.owned});if(!r.ok){saveFailed=true;return;}state=r.state;farmOfflinePending=false;loadWarning='';refreshCatalog();}
  if(foundationPending){const r=migrateStoredFoundation(localStorage,state,{isOwner:()=>session.owned});if(!r.ok){saveFailed=true;return;}state=r.state;foundationPending=false;refreshCatalog();}
  try {
    writeStoredGame(localStorage, state, { checkpoint });
    const workNotice=acknowledgeWorkRewards(localStorage,state,{isOwner:()=>session.owned});if(workNotice.ok&&workNotice.rewards.length)toast(workNotice.rewards.map(m=>m.name+' +1').join(' / ')+'（作業実績の特殊素材）');
    savedAt = new Date();
    saveFailed = false;
    if (force) loadWarning = "";
  } catch {
    saveFailed = true;
  }
}

function toast(message) {
  const el = document.querySelector("#toast");
  el.textContent = message;
  el.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("visible"), 3800);
}

function queueIssue() {
  return blockedReservation(state);
}
function resumeSelectedWork() {
  if (state.run.status !== "preparing" || getAugmentStatus(state).offer.length)
    return false;
  if (
    state.run.queueManaged &&
    state.settings.disabledUpgrades.includes("action_queue")
  )
    toggleUpgrade(state, "action_queue");
  const issue = queueIssue();
  if (issue) { state.settings.paused = true; return false; }
  state.settings.paused = false;
  lastTick = performance.now();
  return true;
}

const renderGuard = createRenderGuard({ document, window, onReady: () => render() });
let committedSelect = null;

function editingWithin(element) {
  const active = document.activeElement;
  if (!element?.contains(active) || !active.matches('input, textarea, select') || active === committedSelect) return false;
  return isQueuedNumberInput(active) ? preserveQueuedNumberEdit(state,active,queuedNumberContext(active)) : true;
}

const detailStates = new Map();
function rememberDetails(el) { for (const d of el.querySelectorAll('details[data-detail-key]')) detailStates.set(d.dataset.detailKey, d.open); }
function restoreDetails(el) { for (const d of el.querySelectorAll('details[data-detail-key]')) if (detailStates.has(d.dataset.detailKey)) d.open = detailStates.get(d.dataset.detailKey); }
function setHTML(selector, html) {
  const el = document.querySelector(selector);
  if (el.dataset.lastHtml === html) return;
  // Keep selection and partially typed values intact until the editor loses focus.
  if (editingWithin(el)) return;
  const focusKey = el.contains(document.activeElement)
    ? document.activeElement.dataset.focus
    : null;
  const routeAnchorTop = focusKey === 'route-result'
    ? document.activeElement.getBoundingClientRect().top - el.getBoundingClientRect().top : null;
  const hostScrollTop = el.scrollTop;
  const scrollPositions = [...el.querySelectorAll('[data-scroll-key]')].map(node => ({
    key: node.dataset.scrollKey, top: node.scrollTop, left: node.scrollLeft,
  }));
  rememberDetails(el);
  el.innerHTML = html;
  for (const input of el.querySelectorAll('input[type="number"]')) validateReservationInput(input);
  restoreDetails(el);
  el.dataset.lastHtml = html;
  for (const position of scrollPositions) {
    const scroller = el.querySelector(`[data-scroll-key="${CSS.escape(position.key)}"]`);
    if (scroller) { scroller.scrollTop = position.top; scroller.scrollLeft = position.left; }
  }
  el.scrollTop = hostScrollTop;
  restoreControlFocus(el, focusKey);
  if (routeAnchorTop !== null) {
    const anchor = el.querySelector('[data-focus="route-result"]');
    if (anchor) el.scrollTop += anchor.getBoundingClientRect().top - el.getBoundingClientRect().top - routeAnchorTop;
  }
}

document.querySelector("#app").innerHTML = `
  <aside class="sidebar">
    <a class="brand" href="#" aria-label="LoopKeeper ホーム"><img src="./assets/mark.svg" alt="" /><span><strong>LoopKeeper</strong><small>IDLE DEFENSE</small></span></a>
    <div class="sidebar-label">野営地</div>
    <nav id="navigation" aria-label="メインメニュー"></nav>
    <div class="skills-heading"><span class="sidebar-label">この命の技能</span><span class="skill-legend">進行 <b>/</b> 永続</span></div>
    <div id="skill-list"></div>
    <div class="sidebar-note">${icon("flame")}<p>灯が消えても、<br />経験は次の命へ。</p></div>
    <div id="generation" class="generation"></div>
    <button class="prototype-label updates-link" data-command="updates-menu">更新履歴 <b>v0.6.102</b></button>
  </aside>
  <div class="workspace">
         <header class="topbar"><span class="mobile-header-title">LoopKeeper</span><button title="メニュー（保存・状態・周回復帰など）" class="mobile-menu-toggle" data-command="header-menu" data-focus="header-menu" aria-label="メニュー" aria-haspopup="dialog" aria-controls="header-menu-dialog" aria-expanded="false"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button><div class="breadcrumb">灰の辺境</div><nav class="quick-actions" aria-label="よく使う詳細"><button class="dashboard-button" data-info="bag" data-focus="bag-open" aria-label="持ち物・すべての所持品" title="持ち物">${icon("bag")}</button><button class="dashboard-button" data-info="quests" data-focus="quests-open" aria-label="クエスト" title="クエスト">${icon("book")}<span data-quest-badge></span></button><button class="dashboard-button" data-info="strategy" data-camp-strategy data-focus="strategy-open" aria-label="方針" title="方針">${icon("flag")}<span data-strategy-badge></span></button><button class="dashboard-button" data-info="queue" data-camp-queue data-focus="queue-open" aria-label="行動予約" title="行動予約">${icon("queue")}<span data-queue-badge></span></button><button class="dashboard-button" data-command="settings-menu" data-focus="settings-open" aria-label="設定" title="設定">${icon("settings")}</button></nav><div class="topbar-actions"><span id="save-status"></span><button class="icon-button" data-command="save-menu" title="データの保存" aria-label="データの保存">${icon("save")}</button></div></header>
<main>

      <div id="save-warning" role="alert"></div><div id="milestone" hidden></div>
      <section class="camp-banner" aria-label="野営地と襲撃予報"><div class="camp-caption"><span class="location-tag"><i></i> THE ASHEN FRONTIER</span><h2>まだ、火は灯っている。</h2><p>森の向こうから、足音が近づいてくる。</p></div><div id="raid-forecast" class="raid-forecast"></div><div id="time-controls" class="time-controls"></div></section>
      <section id="resource-bar" class="resource-bar" aria-label="所持資源"></section><div id="diplomacy-notice"></div><div id="merchant-notice"></div><div id="augments-panel"></div>
      <div id="session-notice"></div><div id="prep-status" class="prep-status" aria-label="準備状況"></div><div id="queue-warning"></div><div class="play-layout"><section class="work-area"><div class="section-heading"><div><h2 id="section-title"></h2><p id="section-description"></p></div><span id="work-label" class="subtle-label"></span><div class="list-tools"><button type="button" class="button small muted" data-command="expand-work" data-focus="expand-work" aria-haspopup="dialog" aria-controls="expanded-work-dialog">拡大</button><div id="gather-view-controls" class="gather-view-controls" aria-label="行動の表示"><button type="button" class="button small muted" data-gather-view="normal" data-focus="gather-view-normal">通常</button><button type="button" class="button small muted" data-gather-view="simple" data-focus="gather-view-simple">簡易</button></div><div id="material-priority-controls" class="material-priority-controls" hidden><button class="button small gold-outline" data-command="material-priority-menu" data-focus="material-priority-menu">素材の優先順</button></div><div id="recipe-search-tools" hidden><button type="button" id="recipe-search-toggle" class="button small muted" aria-controls="recipe-search" aria-expanded="false">検索</button><small id="recipe-search-summary"></small><button type="button" id="recipe-search-reset" class="button small muted" hidden aria-label="検索条件を解除">解除</button></div></div></div><div id="active-work"></div><div id="mobile-queue-context" class="mobile-queue-context" aria-label="行動予約の状況"></div><div id="useful-goals"></div><div id="early-raid-control"></div><div id="recipe-search" class="recipe-search" hidden><label for="recipe-search-input" data-search-label>工房の名前検索</label><div class="recipe-search-controls"><input id="recipe-search-input" type="search" placeholder="名前の一部を入力" autocomplete="off" spellcheck="false" aria-controls="content"><button type="button" disabled aria-label="検索をクリア">クリア</button><small data-search-result role="status" aria-live="polite"></small></div></div><div id="content"></div></section><aside id="camp-rail" aria-label="野営地と行動予約"><details class="camp-view" open><summary>野営地の風景</summary><div id="camp-scene-view" role="img" aria-label="森の野営地。焚火とテント、建設した村の施設が見える風景"></div><button class="button small muted" data-info="camp" data-focus="camp-view-open">風景を大きく見る</button></details><aside id="queue-preview" class="queue-preview" aria-label="行動予約の一覧"></aside></aside></div>

      <footer><span>一度にひとつの行動。どんな順番で、何を残すか。</span><span>時間停止中・画面を離れている間は襲撃も停止します。</span></footer>
    </main>
  </div>`;

const expandedPane=createExpandedPane({document,area:document.querySelector('.work-area'),title:()=>document.querySelector('#section-title').textContent,topNodes:[document.querySelector('.camp-banner'),document.querySelector('#resource-bar')],sideNodes:[document.querySelector('#camp-rail')],extraNodes:[document.querySelector('#toast')]});
wideWorkLayout.addEventListener('change',()=>{
 const focused=document.activeElement,wasInExpanded=expandedPane.dialog.contains(focused);
 if(wideWorkLayout.matches&&expandedPane.dialog.open)expandedPane.close({preserveCurrentScroll:true});
 render();
 if(wideWorkLayout.matches&&wasInExpanded&&!document.querySelector('dialog[open]')){const target=focused?.isConnected&&focused.getBoundingClientRect().width>0?focused:document.querySelector('#navigation [data-tab="'+tab+'"]');target?.focus({preventScroll:true});}
});
const recipeSearch = createRecipeSearch({ document, onChange() {
  document.querySelector("#content").scrollTop = 0;
  render();
} });

const infoDialog = document.createElement("dialog");
const materialPriorityDialog = document.createElement("dialog");
materialPriorityDialog.id = "material-priority-dialog";
materialPriorityDialog.setAttribute("aria-labelledby", "material-priority-title");
let materialPriorityOpener=null;
materialPriorityDialog.addEventListener("close", () => { materialPriorityProposal = null; (materialPriorityOpener?.isConnected ? materialPriorityOpener : document.querySelector('[data-command="material-priority-menu"]'))?.focus({preventScroll:true}); });
document.body.append(materialPriorityDialog);
let materialPriorityProposal = null;
const gatherDetailDialog=document.createElement("dialog");gatherDetailDialog.id="gather-detail-dialog";gatherDetailDialog.setAttribute("aria-labelledby","gather-detail-title");document.body.append(gatherDetailDialog);
let gatherDetailId="";gatherDetailDialog.addEventListener("close",()=>document.querySelector('[data-focus="gather-detail-'+CSS.escape(gatherDetailId)+'"]')?.focus({preventScroll:true}));
const gatherGuideDialog=document.createElement("dialog");gatherGuideDialog.id="gather-guide-dialog";gatherGuideDialog.setAttribute("aria-labelledby","gather-guide-title");document.body.append(gatherGuideDialog);
gatherGuideDialog.addEventListener("close",()=>document.querySelector('[data-focus="gather-display-guide"]')?.focus({preventScroll:true}));
function renderGatherGuide(){setHTML("#gather-guide-dialog",'<div class="dialog-heading"><h2 id="gather-guide-title">行動表示の設定</h2><button class="icon-button" data-close="gather-guide-dialog" aria-label="閉じる">×</button></div><p>通常は名前・収量・レベルを表示。簡易は画像中心で、詳細から情報と予約操作を確認できます。</p><div class="gather-view-controls"><button class="button muted" data-gather-view="normal" data-focus="guide-normal" aria-pressed="'+(gatherView==="normal")+'">通常</button><button class="button muted" data-gather-view="simple" data-focus="guide-simple" aria-pressed="'+(gatherView==="simple")+'">簡易</button></div><p role="status" aria-live="polite">'+(gatherTried?"簡易表示を試す案内：達成済み":"簡易へ切り替えると案内を達成します。")+'</p>');}
let buildProposal=null;const buildRestoreDialog=document.createElement('dialog');buildRestoreDialog.id='build-restore-dialog';buildRestoreDialog.setAttribute('aria-labelledby','build-restore-title');buildRestoreDialog.addEventListener('close',()=>{buildProposal=null;});document.body.append(buildRestoreDialog);
let companionProposal=null;const companionDialog=document.createElement('dialog');companionDialog.id='companion-choice-dialog';companionDialog.setAttribute('aria-labelledby','companion-choice-title');companionDialog.addEventListener('close',()=>{companionProposal=null;});document.body.append(companionDialog);
const inheritanceMapUI=createInheritanceMapUI({document,getCategory:scope=>scope==='setup'?setupCategory:legacyCategory,setCategory(scope,id){if(scope==='setup')setupCategory=id;else{legacyCategory=id;saveUiPreference(localStorage,'loopkeeper-legacy-category-v1',id);}},render});
const templateOverwriteDialog = document.createElement("dialog");
templateOverwriteDialog.id = "template-overwrite-dialog";
templateOverwriteDialog.setAttribute("aria-labelledby", "template-overwrite-title");
templateOverwriteDialog.addEventListener("close", () => { templateOverwriteProposal = null; });
document.body.append(templateOverwriteDialog);
let templateOverwriteProposal = null;
infoDialog.id = "info-dialog";
infoDialog.setAttribute("aria-labelledby", "info-title");
infoDialog.innerHTML = `<div class="dialog-heading"><h2 id="info-title">状態・装備</h2><button class="icon-button" data-close="info-dialog" aria-label="閉じる">${icon("close")}</button></div><div data-info-panel="status"><button class="button muted end-run-button" data-command="abandon-menu">この周回を切り上げる</button><div id="survivor"></div><div id="equipment"></div><div id="facilities"></div><div id="next-goal"></div></div><div data-info-panel="queue" hidden><div id="queue-panel"></div></div><div data-info-panel="quests" hidden id="quest-list"></div><div data-info-panel="journal" hidden><section class="journal"><div class="journal-title">${icon("book")}<h2>焚き火の記録</h2><span>この命の足跡</span></div><div id="journal-entries" role="log" aria-label="ゲームの記録"></div></section></div>`;
document.body.append(infoDialog);
infoDialog.insertAdjacentHTML('beforeend','<div data-info-panel="bag" hidden><div id="bag-content"></div></div><div data-info-panel="strategy" hidden><div id="strategy-details"></div></div>');
infoDialog.insertAdjacentHTML('beforeend','<div data-info-panel="camp" hidden><div id="pixel-village-full" class="pixel-camp-full"></div></div>');
const queueStopDialog=document.createElement('dialog');queueStopDialog.id='queue-stop-dialog';queueStopDialog.setAttribute('aria-labelledby','queue-stop-title');queueStopDialog.innerHTML='<div class="dialog-heading"><h2 id="queue-stop-title">行動予約を停止中</h2><button class="icon-button" data-close="queue-stop-dialog" aria-label="閉じる">×</button></div><div id="queue-stop-body"></div>';document.body.append(queueStopDialog);
const overlayPause=new WeakMap(),overlayFocus=new WeakMap();
let pendingEarlyRaid=null;
const earlyRaidDialog=document.createElement('dialog');earlyRaidDialog.id='early-raid-dialog';earlyRaidDialog.setAttribute('aria-labelledby','early-raid-title');earlyRaidDialog.addEventListener('close',()=>{pendingEarlyRaid=null;});document.body.append(earlyRaidDialog);


const headerMenuDialog = document.createElement("dialog");
headerMenuDialog.id = "header-menu-dialog";
headerMenuDialog.setAttribute("aria-labelledby", "header-menu-title");
headerMenuDialog.innerHTML = `<div class="dialog-heading"><h2 id="header-menu-title">メニュー</h2><button class="icon-button" data-close="header-menu-dialog" aria-label="閉じる">${icon("close")}</button></div><nav class="mobile-menu-actions" aria-label="ゲームの操作">${[
  ["info", "queue", "book", "行動予約"],
  ["info", "status", "shield", "状態・装備"],
  ["info", "quests", "book", "クエスト"],
  ["info", "journal", "book", "記録"],
  ["command", "save-menu", "save", "データの保存"],
  ["command", "updates-menu", "history", "更新履歴"],
  ["command", "settings-menu", "settings", "設定"],
  ["command", "help", "help", "遊び方"],
  ["command", "abandon-menu", "memory", "この周回を切り上げる"],
].map(([type, value, symbol, label]) => `<button data-${type}="${value}">${icon(symbol)}<span>${label}</span>${icon("chevron")}</button>`).join("")}</nav>`;
document.body.append(headerMenuDialog);
headerMenuDialog.querySelector('nav').insertAdjacentHTML('beforebegin','<div id="header-acceleration"></div>');
headerMenuDialog.querySelector('nav').insertAdjacentHTML('afterbegin','<button data-info="bag">バッグ・所持品</button><button data-info="strategy">方針・連携</button>');

const abandonDialog = document.createElement("dialog");
abandonDialog.id = "abandon-dialog";
abandonDialog.setAttribute("aria-labelledby", "abandon-title");
abandonDialog.innerHTML = `<div class="dialog-heading"><h2 id="abandon-title">次の世代へ進みますか？</h2><button class="icon-button" data-close="abandon-dialog" aria-label="閉じる">${icon("close")}</button></div><p>獲得済みの永続経験・継承ポイント・初達成の記録は残ります。</p><p class="fine-print">資源・装備・施設・進行レベル・オーグメントは次の世代でリセットされます。</p><div class="save-options"><button class="button muted" data-close="abandon-dialog">この周回を続ける</button><button class="button gold" data-command="abandon-confirm">切り上げて継承へ</button></div>`;
document.body.append(abandonDialog);
headerMenuDialog.addEventListener("close", () => document.querySelector(".mobile-menu-toggle").setAttribute("aria-expanded", "false"));


function focusFor(node){if(node?.isConnected)return node;const key=node?.dataset?.focus;return key?document.querySelector('[data-focus="'+CSS.escape(key)+'"]'):null;}
function showCampDialog(dialog,opener){
 if(dialog.open)return;
 const others=[infoDialog,headerMenuDialog,queueStopDialog].filter(d=>d!==dialog&&d.open);
 const pausedBefore=others.some(d=>overlayPause.get(d)===false)?false:state.settings.paused;
 const origin=opener?.closest?.('dialog'),returnFocus=origin&&others.includes(origin)?overlayFocus.get(origin)||document.querySelector('.mobile-menu-toggle'):opener||document.activeElement;
 const restore=expandedPane.dialog.open?expandedPane.getOpener():others.find(d=>d._campExpanded)?._campExpanded;
 for(const other of others){other._campHandoff=true;other.close();}
 if(expandedPane.dialog.open)expandedPane.close();
 dialog._campExpanded=restore;overlayPause.set(dialog,pausedBefore);overlayFocus.set(dialog,returnFocus);state.settings.paused=true;lastTick=performance.now();dialog.showModal();render();dialog.querySelector('[data-close]')?.focus({preventScroll:true});
}
for(const dialog of [infoDialog,headerMenuDialog,queueStopDialog])installDialogDismissal(dialog,{onClose(){
 if(dialog._campHandoff){if(dialog===queueStopDialog){dialog._campHandoff=false;overlayPause.delete(dialog);}return;}
 if(!document.querySelector('dialog[open]')){
  const expandedOpener=focusFor(dialog._campExpanded);dialog._campExpanded=null;
  if(expandedOpener&&session.owned&&state.run.status==='preparing'){if(!wideWorkLayout.matches)expandedPane.open(expandedOpener);else expandedOpener.focus({preventScroll:true});}
  const target=focusFor(overlayFocus.get(dialog));if(target&&(!document.querySelector('dialog[open]')||expandedPane.dialog.contains(target)))target.focus({preventScroll:true});
 }
 if(dialog===queueStopDialog){overlayPause.delete(dialog);render();}
}});
function selectWorkMenu(id,{expand=false}={}){
 if(!Object.hasOwn(tabNames,id))return;
 if(queueStopDialog.open)queueStopDialog.close();
 if(infoDialog.open)infoDialog.close();
 if(window.innerWidth<=690)document.querySelector('.workspace main').scrollTop=0;
 tab=id;selectedSkill=null;saveUiPreference(localStorage,'loopkeeper-work-tab-v1',tab);document.querySelector('#content').scrollTop=0;render();
 expandedPane.dialog.scrollTop=0;
 const opener=document.querySelector('#navigation [data-tab="'+tab+'"]');
 if(wideWorkLayout.matches&&expandedPane.dialog.open)expandedPane.close({preserveCurrentScroll:true});
 if(expandedPane.dialog.open)expandedPane.setOpener(opener);
 if(expand&&window.innerWidth>690&&!wideWorkLayout.matches&&state.run.status!=='legacy_setup')expandedPane.open(opener);
}
function openInformation(name,opener){
 if(name==='bag'){bagCategory='all';bagResetScroll=true;}
 if(!['queue','status','quests','journal','bag','strategy','camp'].includes(name))return;
 infoDialog.dataset.panel=name;document.querySelector('#info-title').textContent={camp:'野営地の風景',queue:'行動予約',status:'状態・装備',quests:'初達成のクエスト',journal:'焚き火の記録',bag:'持ち物',strategy:'方針と連携'}[name];
 for(const panel of infoDialog.querySelectorAll('[data-info-panel]'))panel.hidden=panel.dataset.infoPanel!==name;
 if(name==='quests')questSeen.acknowledge(state.meta.completedMilestones);
 showCampDialog(infoDialog,opener);render();
}
function openQueueStop(opener){if(!currentQueueStop)return;setHTML('#queue-stop-body',queueStopMarkup(currentQueueStop));showCampDialog(queueStopDialog,opener);}
const expandedMenu=document.createElement('select');expandedMenu.dataset.expandedMenu='1';expandedMenu.setAttribute('aria-label','拡大する作業メニュー');expandedPane.dialog.querySelector('.expanded-heading').prepend(expandedMenu);expandedMenu.addEventListener('change',()=>selectWorkMenu(expandedMenu.value,{expand:true}));
function syncCampSpace(){
 document.body.classList.toggle('camp-work-idle',!state.run.activeAction&&state.run.status==='preparing'&&['none','wait'].includes(getClockStatus(state).kind));
 setHTML('#save-warning',saveFailed||loadWarning?'<div class="save-warning"><span>保存を確認してください。</span><button data-command="save-menu">保存・書き出し</button></div>':'');
 const unseen=questSeen.unseen(state.meta.completedMilestones);document.querySelector('[data-quest-badge]').parentElement.title=unseen?'未確認の達成 '+unseen+'件（報酬は自動反映済み）':'クエストの進行と達成済み一覧';document.querySelector('[data-quest-badge]').textContent=unseen?' '+unseen:'';document.querySelector('[data-info="quests"]').setAttribute('aria-label','クエスト'+(unseen?'、未確認の達成'+unseen+'件、報酬は自動反映済み':''));
 const offer=getAugmentStatus(state),strategyButton=document.querySelector('[data-camp-strategy]');document.querySelector('[data-strategy-badge]').textContent=offer.offer.length?' !':'';strategyButton.classList.toggle('choice-required',!!offer.offer.length);if(offer.offer.length){strategyButton.dataset.command='show-augments';delete strategyButton.dataset.info;}else{strategyButton.dataset.info='strategy';delete strategyButton.dataset.command;}
 if(infoDialog.open&&infoDialog.dataset.panel==='bag'){setHTML('#bag-content',inventoryMarkup(state,bagCategory,Object.keys(RESOURCES).filter(visibleResource),{showZero:bagShowZero}));if(bagResetScroll){document.querySelector('#bag-content .inventory-scroll').scrollTop=0;bagResetScroll=false;}}
 if(infoDialog.open&&infoDialog.dataset.panel==='quests'){setHTML('#quest-list','<p class="fine-print">報酬は達成時に自動反映されます。</p>'+nextPermanentTargetsMarkup(state)+milestoneMarkup(state));const list=infoDialog.querySelector('.milestone-list');if(list)list.open=true;}
 if(infoDialog.open&&infoDialog.dataset.panel==='strategy'){setHTML('#strategy-details',renderAugments(state)+synergyMarkup(state)+augmentStatusMarkup(state));for(const d of infoDialog.querySelectorAll('[data-info-panel="strategy"] details'))d.open=true;}
 currentQueueStop=session.owned?queueStopStatus(state,queueIssue(),{manualReason:manualPauseReason}):null;
 const queueButton=document.querySelector('[data-camp-queue]');queueButton.dataset.info='queue';queueButton.classList.toggle('queue-is-stopped',!!currentQueueStop);queueButton.setAttribute('aria-label',currentQueueStop?'行動予約を編集。停止中。'+currentQueueStop.reason:'行動予約 '+state.run.queue.length+'件');document.querySelector('[data-queue-badge]').textContent=currentQueueStop?' !':state.run.queue.length?' '+state.run.queue.length:'';
 const options=[...document.querySelectorAll('#navigation [data-nav-expand]')].map(n=>'<option value="'+n.dataset.tab+'">'+escape(tabNames[n.dataset.tab][0])+'</option>').join('');if(expandedMenu.dataset.options!==options){expandedMenu.innerHTML=options;expandedMenu.dataset.options=options;}expandedMenu.value=tab;
 if(!currentQueueStop&&queueStopDialog.open)queueStopDialog.close();
 if(queueRailMutation){stopTransition.take(currentQueueStop);queueRailMutation=false;}
 // Pausing never opens an extra modal. Queue state remains visible inline.
 stopTransition.take(currentQueueStop,{blocked:true});
}

const singleUse = (id) => RECIPES.some((r) => r.id === id && (r.equipment || r.facility || r.endlessFacility || r.accessory || r.expedition));

function updateStockHint(){const scroller=document.querySelector('#stock-scroll'),hint=document.querySelector('#stock-scroll-hint');if(!scroller||!hint)return;const maxX=scroller.scrollWidth-scroller.clientWidth,max=scroller.scrollHeight-scroller.clientHeight;if(maxX>1){hint.textContent=scroller.scrollLeft<maxX-2?'↔ 横にも所持品':'↔ 左にも所持品';scroller.dataset.overflow='true';return;}hint.textContent=max>1?(scroller.scrollTop<max-2?'↕ 下にも所持品':'↕ 上にも所持品'):'';scroller.dataset.overflow=String(max>1);}
document.addEventListener('scroll',event=>{if(event.target.id==='stock-scroll')updateStockHint();},true);
const resourceObserver = new ResizeObserver((entries) => {
  updateStockHint();
  document.documentElement.style.setProperty(
    "--resource-height",
    `${entries[0].borderBoxSize?.[0]?.blockSize || entries[0].target.getBoundingClientRect().height}px`,
  );
});
resourceObserver.observe(document.querySelector("#resource-bar"));

const campScene = mountCampScene(document.querySelector("#camp-scene-view"));
const fullCampScene=mountPhaserCamp(document.querySelector("#pixel-village-full"));
const campView=document.querySelector(".camp-view");mountResponsiveControls({document,window,storage:localStorage,camp:campView,menu:headerMenuDialog});

function renderNavigation() {
  const unlocks = getUnlocks(state);
  setHTML(
    "#navigation",
    [
      ["gather", "leaf", "採集と訓練"],
      ["craft", "hammer", "工房"],
      ["village", "camp", "村の施設"],
      ["diplomacy", "flag", "外交"],
      ["trade", "gold", "交易"],
      ["legacy", "memory", hasLegacyOptions() ? "継承" : "経験の継承"],
      ["workers", "people", "人員"],
    ]
      .filter(([id]) =>
        id === "trade" ? !isLegacy(state) && unlocks.diplomacy : id === "workers" ? !isLegacy(state) && hasLegacyOptions() : id === "village"
          ? unlocks.facilities
          : id === "diplomacy" || id === "trade"
            ? unlocks.diplomacy
            : true,
      )
      .map(
        ([id, symbol, name]) =>
          `<button class="nav-item ${tab === id ? "selected" : ""}" data-tab="${id}" data-short-label="${NAV_SHORT[id]}" data-nav-expand="1" data-focus="nav-${id}" aria-label="${name}" aria-current="${tab === id ? "page" : "false"}">${icon(symbol)}<span>${name}</span>${id === "legacy" && hasLegacyOptions() ? `<small>${state.meta.points} pt</small>` : icon("chevron")}</button>`,
      )
      .join(""),
  );
  setHTML(
    "#skill-list",
    SKILLS.filter(skill=>skillVisible(state,skill.id)).map((skill) => {
      const run = skillLevel(skill.id),
        permanent = skillLevel(skill.id, true);
      return `<button class="sidebar-skill ${selectedSkill === skill.id ? "selected" : ""}" data-skill="${skill.id}" data-focus="skill-${skill.id}" aria-label="${escape(skill.name)}の技能、進行レベル${run.level}、永続レベル${permanent.level}" aria-pressed="${selectedSkill === skill.id}"><span class="skill-symbol ${skill.id}">${icon(skillIcons[skill.id])}</span><span class="compact-skill-level" aria-hidden="true">Lv.${run.level}</span><span class="skill-data"><span class="skill-row"><span>${escape(skill.name)}</span><span class="skill-numbers">${run.level} <b>/ ${permanent.level}</b></span></span><span class="thin-track"><i style="width:${progress(run.progress)}%"></i></span></span></button>`;
    }).join(""),
  );
  setHTML(
    "#generation",
    `<span class="generation-symbol">${icon("memory")}</span><div><small>${state.run.endless?.active ? "エンドレス" : "繰り返す命"}</small><strong>第 ${format(state.meta.generation)} 世代</strong></div><span class="generation-number">${String(state.meta.generation).padStart(2, "0")}</span><span class="generation-compact" aria-label="第${state.meta.generation}世代"><b>${format(state.meta.generation)}</b>世代</span>`,
  );
}

function renderControls() {
  document.documentElement.classList.toggle(
    "effects-disabled",
    !state.settings.effectsEnabled,
  );
  const awaitingChoice = getAugmentStatus(state).offer.length > 0;
  const acceleration = getAccelerationStatus(state);
  const accelerationControl = "";
  setHTML(
    "#time-controls",
    isFrontierFinish(state)?speedControls(state.settings.gameSpeed)+finishReturnMarkup(state):`${speedControls(state.settings.gameSpeed)}<button class="button ${state.settings.paused ? "gold" : "muted"} pause-button" data-command="${awaitingChoice ? "show-augments" : "pause"}" data-focus="pause" aria-label="${awaitingChoice ? "方針を選ぶ" : state.settings.paused ? "時間を進める" : "一時停止"}" title="${awaitingChoice ? "方針を選ぶ" : state.settings.paused ? "時間を進める" : "一時停止"}" ${["dead", "cleared", "legacy_setup"].includes(state.run.status) ? "disabled" : ""}>${icon(awaitingChoice ? "spark" : state.settings.paused ? "play" : "pause")}<span>${awaitingChoice ? "方針を選ぶ" : state.settings.paused ? (!state.run.activeAction&&!state.run.queue.length&&!state.run.automationOnly ? "作業なしで待機" : "時間を進める") : "一時停止"}</span></button>`,
  );
  setHTML("#header-acceleration",accelerationControl);
  const saveText = loadWarning
    ? "読込エラー · 保存をご確認ください"
    : saveFailed
      ? "保存できません · 書き出し推奨"
      : savedAt
        ? "自動保存済み"
        : "自動保存";
  setHTML(
    "#save-status",
    `<span class="save-indicator ${saveFailed || loadWarning ? "error" : ""}"></span>${saveText}`,
  );
}

function renderWorld() {
  campScene.setActive(state.settings.effectsEnabled && !state.settings.paused && state.run.status === "preparing" && !(infoDialog.open && !infoDialog.querySelector('[data-info-panel="camp"]').hidden));
  campScene.setSettlement(Object.fromEntries(Object.entries(state.run.facilities).map(([id,n])=>[id,n+(state.run.endless?.levels[id] || 0)])), state.meta.generation);
  const construction = RECIPES.find(d => d.id === state.run.activeAction?.id && d.facility);
  campScene.setConstruction(construction?.endlessFacility || construction?.facility?.id, state.run.activeAction ? state.run.activeAction.progress / state.run.activeAction.duration : 0);
  campScene.setThreat(state.run.status === "preparing" ? Math.max(0, 1 - (state.run.nextWaveAt - state.run.elapsed) / 45) : 0, state.settings.paused);
  campScene.setWork(state.run.activeAction?.id);
  fullCampScene.setSettlement(Object.fromEntries(Object.entries(state.run.facilities).map(([id,n])=>[id,n+(state.run.endless?.levels[id]||0)])));
  fullCampScene.setConstruction(construction?.endlessFacility || construction?.facility?.id,state.run.activeAction?state.run.activeAction.progress/state.run.activeAction.duration:0);
  fullCampScene.setWork(state.run.activeAction?.id);
  fullCampScene.setActive(state.settings.effectsEnabled && infoDialog.open && !infoDialog.querySelector('[data-info-panel="camp"]').hidden);
  const families = getCatalog(state).AUGMENTS.filter(a => getAugmentStatus(state).selected.includes(a.id)).map(a => a.family);
  document.body.classList.toggle("build-economy", families.includes("economy"));
  document.body.classList.toggle("build-martial", families.includes("martial"));
  document.body.classList.toggle("build-fortress", families.includes("fortress"));
  document.querySelector(".camp-banner").dataset.chapter = String(
    Math.min(7, Math.floor(state.run.wave / 3) + 1),
  );
  const enemy = state.run.enemy || getNextEnemy(state);
  const combat = state.run.status === "combat";
  const dead = state.run.status === "dead";
  const remaining = Math.max(0, state.run.nextWaveAt - state.run.elapsed);
  setHTML('#raid-forecast',isFrontierFinish(state)?'<div class="raid-summary"><div><b>通常36波・クリア</b><button data-command="show-clear-results">夜明けを取り戻した</button>'+campHealthMarkup(state)+'</div><span class="raid-clock" aria-label="通常36波をクリア"><b>完遂</b><small>次の挑戦は任意</small></span></div>':'<div class="raid-summary"><div><b>WAVE '+String(enemy.wave??state.run.wave+1).padStart(2,'0')+(enemy.isBoss?' · BOSS':'')+'</b><button data-info="status" title="'+escape(enemy.name+' / HP '+format(enemy.maxHp||enemy.hp)+' / 攻撃 '+enemy.attack+' / 防御 '+enemy.defense)+'">'+escape(enemy.name)+'</button>'+campHealthMarkup(state)+'</div><span class="raid-clock '+(remaining<15?'urgent':'')+'" aria-label="'+(combat?'襲撃中':dead?'旅の終わり':'襲撃まで '+time(Math.ceil(remaining)))+'"><b>'+ (combat?'防衛中':dead?'—':time(Math.ceil(remaining)))+'</b><small>'+(combat?'自動戦闘':dead?'旅の終わり':state.settings.paused?'時間停止中':getClockStatus(state).kind==='wait'?'手動待機'+(getAccelerationStatus(state).active?' · 5×':''):getAccelerationStatus(state).active&&getAccelerationStatus(state).canStart?'5×進行中':'襲撃まで')+'</small></span>'+raidEnemyStats(enemy)+'</div>');
  setHTML('#resource-bar',stockMarkup(state));updateStockHint();
  if (!getUnlocks(state).diplomacy) {
    setHTML("#diplomacy-notice", "");
    return;
  }
  const quest = state.run.diplomacy;
  if (!isLegacy(state)) {
    setHTML("#diplomacy-notice", diplomacyDeadlineMarkup(state));
    return;
  }
  const questMessage =
    quest.status === "pending"
      ? `サフラから食料${DIPLOMACY.foodCost}の援助要請 · 返答まで ${time(Math.ceil(Math.max(0, quest.deadline - state.run.elapsed)))}`
      : quest.status === "allied"
        ? "サフラとの交易中 · 10秒ごとに金貨1"
        : quest.status === "hostile"
          ? "サフラ軍が次の襲撃に加勢 · 食料を守り、迎え撃つ"
          : "サフラ軍を撃退 · この周回の攻撃力 +3";
  setHTML(
    "#diplomacy-notice",
    `<div class="diplomacy-notice ${quest.status}">${icon(quest.status === "hostile" ? "sword" : "flag")}<span>${questMessage}</span><button data-tab="diplomacy" data-focus="diplomacy-notice">外交を開く${icon("chevron")}</button></div>`,
  );
}

function renderWork() {
  setHTML('#merchant-notice',merchantNotice(state));
  document.querySelector("#gather-view-controls").hidden=tab!=="gather" || state.run.status==="legacy_setup";
  for(const node of document.querySelectorAll("[data-gather-view]"))node.setAttribute("aria-pressed",String(node.dataset.gatherView===gatherView));
  recipeSearch.show(state.run.status !== "legacy_setup" && ["craft", "village"].includes(tab) ? tab : null);
  document.querySelector('#material-priority-controls').hidden = !['craft','village'].includes(tab) || !hasUpgrade(state,"action_queue") || state.run.status === 'legacy_setup';
  if (state.run.status === "legacy_setup") {
    setHTML("#content", "<p>次の命の構成を選んでください。</p>");
    return;
  }
  const focusedSkill = SKILLS.find((skill) => skill.id === selectedSkill);
  document.querySelector("#section-title").textContent = focusedSkill
    ? `${focusedSkill.name}の技能`
    : tab === "legacy" && !hasLegacyOptions()
      ? "経験の継承"
      : tabNames[tab][0];
  document.querySelector("#section-description").textContent =
    focusedSkill?.description ||
    (tab === "legacy" && !hasLegacyOptions()
      ? "経験を重ね、ひとつ先の襲撃へ。"
      : tabNames[tab][1]);
  document.querySelector("#work-label").textContent =
    tab === "gather"
      ? "ひとつを選んで、繰り返す"
      : tab === "craft"
        ? "完成すると自動装備"
        : tab === "village"
          ? "この周回の拠点を強化"
          : tab === "diplomacy"
            ? "関係と恩恵は周回限定"
            : tab === "workers"
              ? "仲間の作業を設定"
              : "死亡しても引き継ぐ";
  document.body.classList.toggle("work-resting", state.settings.paused || !state.settings.effectsEnabled || state.run.status === "combat");
  const action = state.run.activeAction;
  const activeDefinition =
    action && [...ACTIONS, ...RECIPES].find((x) => x.id === action.id);
  const working = activeDefinition && state.run.status !== "dead";
  const combat = state.run.status === "combat";
  setHTML(
    "#active-work",
    `<div class="active-work ${working ? "working" : ""} ${combat ? "battle" : ""}">${working && !combat ? workScene(activeDefinition.skill, activeDefinition.id, state.run.equipment) : `<div class="active-icon">${icon(combat ? "shield" : "clock")}</div>`}<div class="active-detail"><div><strong>${combat ? "野営地を防衛中" : working ? escape(activeDefinition.name) : !isLegacy(state)&&getClockStatus(state).kind!=='none' ? escape(getClockStatus(state).label) : "次の行動を選びましょう"}</strong>${trainingPurpose(state) ? `<small class="training-purpose">${escape(trainingPurpose(state))}</small>` : ""}<span>${combat ? "作業は戦闘後に再開" : working ? `<span data-work-time></span>` : state.settings.paused ? "時間は止まっています" : "襲撃までの時間は進みます"}</span></div><div class="work-track" ${working && !combat ? `role="progressbar" aria-label="${escape(activeDefinition.name)}の進み具合" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"` : 'aria-hidden="true"'}><i data-live-work style="width:0%"></i></div>${preparationMarkup(state)}</div>${working ? `<button class="stop-button" data-command="stop" data-focus="stop" title="作業を中断" aria-label="作業を中断">${icon("close")}</button>` : ""}</div>`,
  );
  setHTML("#useful-goals",["gather","craft","village"].includes(tab)?usefulGoalsMarkup(state):"");
  setHTML("#early-raid-control",["gather","craft","village"].includes(tab)?earlyRaidControl(state):"");
  if (tab === "gather") renderGather();
  if (tab === "craft" || tab === "village") renderCraft();
  if (tab === "legacy") renderLegacy();
  if (tab === "workers") setHTML("#content", populationMarkup(state)+automationMarkup(state) || '<div class="village-intro">継承ポイントで仲間を雇うと、ここで作業先と強化を選べます。</div><button class="button gold-outline" data-tab="legacy">継承で人員を解放</button>');
  if (tab === "diplomacy") renderDiplomacy();
  if (tab === "trade") setHTML("#content",commerceTabs()+marketMarkup(state,marketSide,marketCount));
  renderQueue();
  // The compact header owns the reservation count and stop indicator.
}

function renderGather() {
  setHTML(
    "#content",
    `${gatherView==="simple" ? "" : renderSkillOverview()}<div class="action-grid ${gatherView==="simple" ? "is-simple" : ""} ${selectedSkill ? "filtered" : ""}">${ACTIONS.filter(
      (action) =>
        isLegacy(state) ? !action.knownAfterBoss : isKnown(state, action),
    )
      .filter((action) => !selectedSkill || action.skill === selectedSkill)
      .map((action) => {
        const focusedTraining = action.trainingStat && !isLegacy(state);
        const current = focusedTraining ? getSkillProgress(["defense","vitality"].includes(action.trainingStat) ? state.run.training?.[action.trainingStat] || 0 : state.run.skills[action.skill].xp) : skillLevel(action.skill),
          permanent = skillLevel(action.skill, true);
        const active = state.run.activeAction?.id === action.id;
        const suspended = state.run.suspendedActions?.[action.id];
        const check = canStartAction(state, action.id);
        const locked = !check.ok && !active;
        const levelLocked = current.level < (action.unlockLevel || 1);
        const yields = Object.entries(getActionYields(state, action));
        return `<article class="gather-card"><button class="action-card ${active ? "active" : ""} ${locked ? "locked" : ""}" data-action="${action.id}" data-focus="action-${action.id}" ${locked ? "disabled" : ""} aria-pressed="${active}" aria-label="${escape(action.name+(locked ? "："+check.reason : ""))}"><span class="simple-state">${active ? "選択中" : locked ? "不可" : ""}</span><div class="action-summary"><div class="card-top"><span class="action-icon ${action.skill}">${icon(skillIcons[action.skill])}</span><span class="action-time">${icon(locked ? "lock" : "clock")}${levelLocked ? `進行 Lv.${action.unlockLevel}` : state.run.status === "combat" ? "襲撃中" : `${getActionDuration(state, action).toFixed(1)}秒`}</span></div><div class="action-name"><h3>${escape(action.name)}</h3>${active ? '<span class="active-pill">選択中</span>' : ""}</div>${action.id === "gather_food" || !yields.length ? `<p>${escape(action.id === "gather_food" ? `救護所で戦闘外の回復に使用。` : action.description)}</p>` : ""}<div class="action-yield">${yields.length ? yields.map(([id, amount]) => `<span>${icon(id)}${escape(resourceName(id))}<b>+${amount}</b></span>`).join("") : `<span>${icon(action.trainingStat === "defense" ? "shield" : action.trainingStat === "vitality" ? "heart" : "sword")}${focusedTraining ? `${{attack:"攻撃",defense:"防御",vitality:"最大HP",archer:"弓攻撃",mage:"魔力"}[action.trainingStat]} +${(current.level-1)*({attack:2,defense:1.5,vitality:18,archer:2,mage:3}[action.trainingStat])}` : "戦闘経験を積む"}</span>`}${icon("arrow", "card-arrow")}</div></div><div class="action-portrait portrait-${action.skill} ${action.id === "fish_river" ? "portrait-fishing" : ""}" aria-hidden="true"><span class="portrait-horizon"></span>${portraitImage(action.skill, action.id, state.run.equipment, state.settings.effectsEnabled)}<span class="portrait-caption">${portraitBadge(skillIcons[action.skill])}</span></div><div class="action-details"><div class="card-levels"><span>${focusedTraining ? "訓練" : "進行"} <b>Lv.${current.level}</b></span><span class="permanent-text">${icon("memory")}永続 <b>Lv.${permanent.level}</b></span></div>${!focusedTraining && current.level > 1 ? `<div class="run-growth"><b>${runGrowth(action.skill)}</b></div>` : ""}${savedWorkNote(suspended)}<div class="card-skill-track"><i style="width:${progress(current.progress)}%"></i></div>${levelLocked ? `<div class="lock-reason">${escape(check.reason)}</div>` : ""}</div></button>${hasUpgrade(state,"action_queue") ? `<div class="gather-reservation">${trainingMode(state,action.id)?trainingLevelEditor(state,action.id,craftQuantities[action.id],`data-craft-count="${action.id}" data-focus="work-count-${action.id}" aria-label="${escape(action.name)}の目標進行レベル"`):`<label>回数<input type="number" min="1" max="99" step="1" title="1〜99の整数" inputmode="numeric" data-craft-count="${action.id}" data-focus="work-count-${action.id}" aria-label="${escape(action.name)}の予約回数" value="${Number.isFinite(craftQuantities[action.id] ?? 1) ? craftQuantities[action.id] ?? 1 : ""}"></label>`}<button data-queue-work="${action.id}" data-focus="queue-work-${action.id}" ${locked ? "disabled" : ""}>${state.run.queue.length ? "末尾に予約" : "行動予約"}</button>${state.run.queue.length ? `<button data-queue-work="${action.id}" data-queue-position="front" data-focus="queue-work-front-${action.id}" ${locked ? "disabled" : ""}>先頭に予約</button>` : ""}</div>` : ""}<button type="button" class="gather-detail-button" data-gather-detail="${action.id}" data-focus="gather-detail-${action.id}" aria-label="${escape(action.name)}の詳細">詳細</button></article>`;
      })
      .join(
        "",
      )}</div>${state.meta.bestWave === 0 && !state.run.equipment.weapon ? `<div class="context-hint">${icon("help")}<span>まずは木材4・石材2を集めて、工房で石の槍を。</span></div>` : ""}`,
  );
}

function renderSkillOverview() {
  if (!selectedSkill) return "";
  const skill = SKILLS.find((item) => item.id === selectedSkill);
  const current = skillLevel(selectedSkill),
    permanent = skillLevel(selectedSkill, true);
  return `<div class="focused-skill"><span class="action-icon ${selectedSkill}">${icon(skillIcons[selectedSkill])}</span><div class="focused-skill-progress"><div><span>進行 Lv.${current.level}</span><small>${format(current.xpInto)} / ${format(current.xpNeeded)} XP</small></div><div class="xp-track"><i style="width:${progress(current.progress)}%"></i></div></div><div class="focused-skill-progress"><div><span class="permanent-text">永続 Lv.${permanent.level}</span><small>${format(permanent.xpInto)} / ${format(permanent.xpNeeded)} XP</small></div><div class="xp-track permanent"><i style="width:${progress(permanent.progress)}%"></i></div></div><button class="icon-button" data-tab="gather" data-focus="clear-filter" aria-label="全技能の作業に戻る" title="全技能の作業に戻る">${icon("close")}</button></div><div class="skill-effect-summary"><strong>この周回の効果：${runGrowth(selectedSkill)}</strong><span>周回Lvごとに作業速度 +10%${selectedSkill === "combat" ? (isLegacy(state) ? "、攻撃 +1.25・最大HP +5" : "、攻撃 +2。防御・体力は専用訓練で成長") : ""}。次のLvまで ${Math.ceil(current.xpNeeded - current.xpInto)} XP。</span><span class="permanent-text">永続Lvの効果：作業速度 +${getSkillEffects(state, selectedSkill).permanentSpeedPercent}% · 周回経験値 +${getSkillEffects(state, selectedSkill).runXpPercent ?? getSkillEffects(state, selectedSkill).permanentSpeedPercent}%</span></div>`;
}

function renderQueuePreview() {
  const owned=hasUpgrade(state,"action_queue"),host=document.querySelector("#queue-preview");
  host.hidden=!owned||state.run.status==='legacy_setup';if(host.hidden)return;
  const enabled=!state.settings.disabledUpgrades.includes("action_queue"),issue=queueIssue(),active=state.run.activeAction;
  const status=issue?"要確認":!enabled?"保留中":state.settings.paused?"時間停止中":"実行中";
  setHTML("#queue-preview",'<div class="queue-preview-heading"><h3>'+icon("book")+'行動予約 <small>'+state.run.queue.length+'/8</small></h3><button data-info="queue" data-focus="rail-editor">編集・追加</button></div><div class="queue-preview-status">'+status+'</div>'+queueTimingMarkup(state)+(state.run.queue.length?'<ol data-scroll-key="queue-preview">'+state.run.queue.map((entry,index)=>{
    const name=[...ACTIONS,...RECIPES].find(d=>d.id===entry.id)?.name||entry.id,current=index===0&&state.run.queueManaged&&enabled,goal=entry.goalId??index;
    return '<li data-queue-row="'+index+'" data-preview-goal="'+goal+'" class="'+(current?'current':'')+'"><button class="queue-number queue-drag-handle" data-queue-drag="'+index+'" data-focus="rail-handle-'+goal+'" aria-label="予約'+(index+1)+'の順番をドラッグで変更" title="ドラッグで並べ替え"><span class="queue-grip" aria-hidden="true">⋮⋮</span>'+(index+1)+'</button><span class="queue-preview-name">'+escape(name)+'</span><button class="queue-preview-remove icon-button" data-queue-remove="'+index+'" '+(entry.goalId!==undefined?'data-queue-goal="'+entry.goalId+'"':'')+' aria-label="'+escape(name)+'の予約を削除">'+icon("close")+'</button><div class="queue-rail-details">'+(entry.until?(trainingMode(state,entry.id)&&entry.until.type==='level'?trainingQueueEditor(state,entry,index,'rail-level-'+goal):'<small>'+escape(conditionLabel(entry))+'</small>'):singleUse(entry.id)?'<small>1回</small>':'<label>残り <input type="number" min="1" max="99" step="1" inputmode="numeric" value="'+entry.count+'" data-queue-count="'+index+'" data-focus="rail-count-'+goal+'" aria-label="予約'+(index+1)+'・'+escape(name)+'の残り回数"> 回</label>')+(current&&active?'<small class="queue-rail-progress">'+Math.min(active.progress,active.duration).toFixed(1)+' / '+active.duration.toFixed(1)+' 秒</small>':'')+'<div class="queue-rail-order"><button class="icon-button" data-queue-move="'+index+'" data-direction="-1" data-focus="rail-up-'+goal+'" aria-label="予約'+(index+1)+'を上へ" '+(index===0?'disabled':'')+'>↑</button><button class="icon-button" data-queue-move="'+index+'" data-direction="1" data-focus="rail-down-'+goal+'" aria-label="予約'+(index+1)+'を下へ" '+(index===state.run.queue.length-1?'disabled':'')+'>↓</button></div></div></li>';
  }).join('')+'</ol><div class="queue-rail-controls">'+(state.settings.paused?(issue?'<button class="button small muted" data-info="queue-stop">停止理由を確認</button>':'<button class="button small gold" data-queue-resume="1">'+(enabled?'予約を再開':'有効にして再開')+'</button>'):'<button class="button small muted" data-command="pause">停止</button>')+'<button class="button small muted" data-toggle-upgrade="action_queue">'+(enabled?'予約を保留':'予約を有効にする')+'</button></div>':'<p class="queue-preview-empty">予約はまだありません。<br>作業カードの「末尾に予約」で追加できます。</p>'));
}

function renderQueue() {
  renderQueuePreview();
  const unlocked = hasUpgrade(state,"action_queue");
  if (!unlocked) {
    if(!isLegacy(state)){const wave=FREE_FEATURES.find(x=>x.id==="action_queue").wave;setHTML("#queue-panel",`<section class="queue-unlock-card"><h3>${icon("book")}作業を順番に予約</h3><p>製作を予約すると、不足する材料も自動で集めます。</p><div class="queue-unlock-condition">WAVE ${wave}突破で無料解放（現在の最高突破 WAVE ${state.meta.bestWave}）</div><p>一度解放すると次の人生でも使えます。継承ポイントは不要です。</p><button class="button gold" data-close="info-dialog">作業に戻る</button></section>`);return;}
    setHTML(
      "#queue-panel",
      `<section class="queue-unlock-card"><h3>${icon("book")}作業を順番に予約</h3><p>製作を予約すると、不足する材料も自動で集めます。</p><div class="queue-unlock-condition">${state.meta.bestWave < 3 && state.meta.completedMilestones.length < 2 ? `クエストを2件達成して解放（${state.meta.completedMilestones.length}/2） · 継承1 pt` : "継承1 ptで購入できます"}</div><button class="button gold" ${state.meta.bestWave < 3 && state.meta.completedMilestones.length < 2 ? 'data-info="quests"' : 'data-tab="legacy"'} data-focus="queue-unlock">${state.meta.bestWave < 3 && state.meta.completedMilestones.length < 2 ? "クエストを見る" : "継承で解放"}${icon("chevron")}</button></section>`,
    );
    return;
  }
  const enabled = !state.settings.disabledUpgrades.includes("action_queue");
  const queueStatus = getQueueStatus(state);
  const definitions = [
    ...ACTIONS.filter((a) => isKnown(state, a)),
    ...RECIPES.filter(visibleRecipe),
  ];
  if (!definitions.some((d) => d.id === queueDraftId)) queueDraftId = definitions[0]?.id || "chop_wood";
  const draftSingle = singleUse(queueDraftId);
  const draftQueued = draftSingle ? state.run.queue.findIndex(q => q.id === queueDraftId) : -1;
  setHTML(
    "#queue-panel",
    `<section class="queue-box" aria-label="行動予約"><div class="queue-heading"><h3>${icon("book")}行動予約 <small>${state.run.queue.length} / 8</small></h3><button data-command="queue-expand" data-focus="queue-expand" aria-expanded="${queueExpanded}">${queueExpanded ? "追加欄を閉じる" : "作業を追加"}</button><button class="button small ${enabled ? "gold-outline" : "muted"}" data-toggle-upgrade="action_queue" data-focus="queue-toggle" aria-pressed="${enabled}">${enabled ? "予約を保留" : "予約を有効にする"}</button></div>${queueExpanded ? `<div class="queue-controls"><label>予約する作業<select id="queue-action" data-focus="queue-action" aria-label="予約する作業">${definitions.map((item) => `<option value="${item.id}" ${queueDraftId === item.id ? "selected" : ""}>${escape(item.name)}</option>`).join("")}</select></label>${draftSingle ? '<span class="queue-single">1回</span>' : `${trainingMode(state,queueDraftId)?trainingLevelEditor(state,queueDraftId,queueDraftCount,`id="queue-count" data-focus="queue-count" aria-label="目標の進行レベル"`):`<label>回数<input id="queue-count" data-focus="queue-count" type="number" min="1" max="99" step="1" title="1〜99の整数" inputmode="numeric" aria-label="予約回数" value="${Number.isFinite(queueDraftCount) ? queueDraftCount : ""}"></label>`}`}<button class="button small gold-outline" data-command="queue-add" data-focus="queue-add" ${draftQueued >= 0 || state.run.queue.length >= 8 || state.run.status === "dead" ? "disabled" : ""}>末尾に追加</button><button class="button small gold-outline" data-command="queue-add-front" data-focus="queue-add-front" ${draftQueued === 0 || (draftQueued < 0 && state.run.queue.length >= 8) || state.run.status === "dead" ? "disabled" : ""}>${draftQueued >= 0 ? "先頭へ移す" : "先頭に追加"}</button></div>` : ""}${state.run.queue.length ? `<ol class="queue-list">${state.run.queue.map((entry, index) => `<li data-queue-row="${index}" class="${index === 0 && state.run.queueManaged ? "current" : ""}"><button class="queue-number queue-drag-handle" data-queue-drag="${index}" data-focus="queue-handle-${entry.goalId ?? index}" aria-label="予約${index + 1}の順番をドラッグで変更" title="ドラッグで並べ替え"><span class="queue-grip" aria-hidden="true">⋮⋮</span>${index + 1}</button><span>${escape(definitions.find((item) => item.id === entry.id)?.name)}</span>${entry.until ? (trainingMode(state,entry.id)&&entry.until.type==='level'?trainingQueueEditor(state,entry,index,'queue-level-'+(entry.goalId??index)):`<span class="queue-condition-label">${escape(conditionLabel(entry))}</span>`) : singleUse(entry.id) ? '<span class="queue-single">1回</span>' : `<label class="queue-entry-count">残り <input type="number" min="1" max="99" step="1" title="1〜99の整数" value="${entry.count}" data-queue-count="${index}" data-focus="queue-count-${entry.goalId ?? index}" aria-label="予約${index + 1}・${escape(definitions.find(item => item.id === entry.id)?.name || entry.id)}の残り回数"> 回</label>`}<button class="icon-button" data-queue-move="${index}" data-direction="-1" data-focus="queue-up-${entry.goalId ?? index}" aria-label="予約${index + 1}を上へ" ${index === 0 ? "disabled" : ""}>↑</button><button class="icon-button" data-queue-move="${index}" data-direction="1" data-focus="queue-down-${entry.goalId ?? index}" aria-label="予約${index + 1}を下へ" ${index === state.run.queue.length - 1 ? "disabled" : ""}>↓</button><button class="icon-button" data-queue-remove="${index}" data-focus="queue-remove-${index}" aria-label="予約${index + 1}を削除">${icon("close")}</button></li>`).join("")}</ol><div class="queue-footer"><span>${state.settings.paused ? "時間停止中" : escape(queueStatus.reason || (enabled ? "順番に実行します" : "手動作業中・予約は保留"))}</span><button data-command="queue-clear" data-focus="queue-clear">予約を全消去</button></div>` : ""}${currentQueueStop ? `<div class="queue-editor-stop"><p role="status">${escape(currentQueueStop.reason)}</p><div class="stop-actions">${!currentQueueStop.blocked?'<button class="button gold" data-queue-resume="1">予約を再開</button>':''}<button class="button muted" data-info="queue-stop">停止理由を確認</button></div></div>` : ""}${queueExpanded ? '<p class="queue-help">目標レベル・回数は入力欄の範囲で指定。Enterは入力の確認のみ、追加はボタンで確定。手動作業を選ぶと予約を保留します。</p>' : ""}</section>`,
  );
}

function renderCraft() {
  const smartUnlocked = hasUpgrade(state,"action_queue");
  const village = tab === "village";
  const catalog = RECIPES.filter(recipe=>visibleRecipe(recipe)||!isLegacy(state)&&recipe.accessory&&state.meta.bestWave>=3)
    .sort(
      (a, b) =>
        (a.tier || 0) - (b.tier || 0) ||
        (a.slot === "weapon" ? -1 : b.slot === "weapon" ? 1 : 0),
    )
    .filter(recipe=>!recipe.expedition&&!recipe.outpost)
    .filter(recipe=>village||!selectedSkill||!["cooking","alchemy"].includes(selectedSkill)||recipe.skill===selectedSkill)
    .filter((recipe) => (village ? Boolean(recipe.facility || recipe.endlessFacility) : !recipe.facility && !recipe.endlessFacility))
    .filter(
      (recipe) =>
        village ||
        craftFilter === "all" ||
        craftCategory(recipe) === craftFilter,
    );
  const hiddenCount = catalog.filter(
    (recipe) => getRecipeVisibility(state, recipe).hidden,
  ).length;
  const completedCount=catalog.filter(recipe=>recipe.accessory&&state.meta.accessories?.includes(recipe.accessory)).length;
  const displayedCatalog = catalog.filter(recipe => (showOwnedAccessories||!recipe.accessory||!state.meta.accessories?.includes(recipe.accessory))&&(state.settings.showHiddenRecipes || !getRecipeVisibility(state, recipe).hidden));
  const filteredCatalog=village&&villageFilter!=='all'?displayedCatalog.filter(d=>villageCategory(d)===villageFilter):displayedCatalog;
  const searchMatches = filterRecipeNames(filteredCatalog, recipeSearch.query());
  recipeSearch.report(searchMatches.length, displayedCatalog.length);
  const searchEmpty = !searchMatches.length ? `<p class="craft-search-empty">${recipeSearch.query().trim() ? "名前に一致する品がありません。検索をクリアするか、表示分類を変更してください。" : village ? "この分類に表示できる施設はありません。分類や非表示設定を変更してください。" : "この分類に表示できる品はありません。作成済みの永久装備は表示切替、または状態・装備の図鑑で確認できます。"}</p>` : "";
  const queueNotice = state.run.queue.length >= 8 ? '<div class="queue-warning"><span>行動予約が8件でいっぱいです。不要な予約を削除してください。</span><button data-info="queue">予約を整理</button></div>' : "";
  const slotFilter = !village ? craftCategoryMarkup(craftFilter)+`<button class="button small muted" data-show-owned-accessories="1" aria-pressed="${showOwnedAccessories}">作成済みも表示 (${completedCount})</button>` : "";
  const filter =
    hiddenCount || state.settings.showHiddenRecipes
      ? `<div class="craft-filters"><button class="craft-visibility" data-command="toggle-hidden-recipes" data-focus="hidden-filter" aria-pressed="${state.settings.showHiddenRecipes}">${icon(state.settings.showHiddenRecipes ? "eye" : "eye-off")}非表示も表示${hiddenCount ? `<small>${hiddenCount}</small>` : ""}</button></div>`
      : "";
  setHTML(
    "#content",
    `${renderSkillOverview()}${village ? `<div class="village-intro">${state.run.endless?.active ? '施設Vから追加強化。資源を投じて備えを伸ばせます。' : '住宅・防衛・訓練への投資を選びます。住宅は人口上限を増やします。'}</div>` : ""}${!village && !isLegacy(state) ? `<div class="workshop-automation">${autoCookingMarkup(state)}${processingMarkup(state)}</div>` : ""}<div class="catalog-filters">${village?villageCategoriesMarkup(villageFilter):slotFilter}${filter}</div>${queueNotice}${searchEmpty}<div class="craft-list">${searchMatches
      .map((recipe) => {
        const craftCount = singleUse(recipe.id) ? 1 : craftQuantities[recipe.id] ?? 1;
        const validCraftCount = Number.isInteger(craftCount) && craftCount >= 1 && craftCount <= 99;
        const check = canStartAction(state, recipe.id);
        const active = state.run.activeAction?.id === recipe.id;
        const queuedIndex = singleUse(recipe.id) ? state.run.queue.findIndex(q => q.id === recipe.id) : -1;
        const suspended = state.run.suspendedActions?.[recipe.id];
        const ownedEquipment = !isLegacy(state) && Boolean(recipe.equipment && state.run.ownedEquipment?.includes(recipe.id));
        const equipped = ownedEquipment || (recipe.accessory ? state.meta.accessories?.includes(recipe.accessory) : recipe.facility
          ? (state.run.facilities[recipe.facility.id] || 0) >=
            (recipe.level || 1)
          : Object.values(state.run.equipment).some(
              (item) =>
                item?.id === recipe.id || item?.name === recipe.equipment?.name,
            ));
        const plan =
          smartUnlocked && !suspended ? planCraft(state, recipe.id, craftCount) : null;
        const resumable =
          ((active && state.settings.paused) || Boolean(suspended)) &&
          state.run.status === "preparing";
        const allowed = (recipe.accessory && equipped || ownedEquipment && !active && !suspended) ? false : active
          ? resumable
          : suspended
            ? check.ok
            : smartUnlocked
              ? plan.ok ||
                (!isLegacy(state) &&
                  plan.known &&
                  state.run.status === "preparing")
              : check.ok;
        const reason =
          smartUnlocked && !suspended ? plan?.reason : check.reason;
        const eq = recipe.equipment;
        const visibility = getRecipeVisibility(state, recipe);
        const visibilityButton =
          eq || recipe.facility
            ? `<button class="craft-hide" data-hide-recipe="${recipe.id}" data-focus="hide-${recipe.id}" aria-pressed="${visibility.manuallyHidden}" aria-label="${escape(recipe.name)}${visibility.manuallyHidden ? "の非表示を解除" : "を隠す"}" title="${visibility.inProgress ? "進行中の製作は隠せません" : visibility.manuallyHidden ? "非表示を解除" : "この品を隠す"}" ${visibility.inProgress ? "disabled" : ""}>${icon(visibility.manuallyHidden ? "eye-off" : "eye")}</button>`
            : "";
        const benefits = recipe.facility
          ? ""
          : eq
            ? [
                ["attack", "攻撃"],
                ["defense", "防御"],
                ["maxHp", "最大HP"],
                ["speed", "速度"],
              ]
                .filter(([key]) => eq[key]&&!(memberFor(recipe.id)==='mage'&&key==='attack'))
                .map(([key, label]) => {
                  const current = memberFor(recipe.id)?partyWeapon(state,memberFor(recipe.id))?.stats?.[key]||0:state.run.equipment[eq.slot]?.[key] || 0;
                  const value = (number) =>
                    key === "speed" ? Math.round(number * 100) + "%" : number;
                  return `${label} ${value(current)} → ${value(eq[key])}`;
                })
                .join(" / ")
            : Object.entries(recipe.yields || {})
                .map(([id, amount]) => `${resourceName(id)} +${amount}`)
                .join(" / ");
        return `<article class="craft-card ${!village ? "workshop-card" : ""} ${active ? "active" : ""} ${visibility.manuallyHidden ? "craft-hidden" : ""}">${!village ? workshopProduct(recipe) : pixelFacilityProduct(recipe)}<div class="craft-info"><h3>${escape(recipe.name)}${recipe.endlessFacility ? ` <span class="equipped-tag">+${state.run.endless?.levels[recipe.endlessFacility] || 0}</span>` : ""}${equipped ? `<span class="equipped-tag">${village ? "建設済み" : recipe.accessory ? "永久所持" : "装備中"}</span>` : visibility.inferior ? '<span class="equipped-tag">下位装備</span>' : ""}</h3>${!village && recipe.description === benefits ? "" : `<p>${escape(recipe.description)}</p>`}<div class="craft-benefits">${escape(benefits)}<span>${benefits ? " · " : ""}${getActionDuration(state, recipe).toFixed(1)}秒</span></div><div class="recipe-cost">${Object.entries(
          active || suspended ? {} : Object.fromEntries(Object.entries(getRecipeCost(state, recipe)).map(([id,amount]) => [id, !smartUnlocked || validCraftCount ? amount * (smartUnlocked ? craftCount : 1) : null])),
        )
          .map(
            ([id, amount]) =>
              `<span class="${amount !== null && (state.run.resources[id] || 0) < amount ? "insufficient" : ""}">${village ? `${icon(id)}${escape(resourceName(id))} ${format(state.run.resources[id] || 0)}<b>/${amount ?? "—"}</b>${materialShortage(amount,state.run.resources[id] || 0)>0 ? `<small class="material-gap">不足 ${format(materialShortage(amount,state.run.resources[id] || 0))}</small>` : ""}</span>` : `${!village ? workshopMaterialIcon(id) : icon(id)}<span class="material-label">${escape(resourceName(id))}</span> <span class="material-stock">${format(state.run.resources[id] || 0)}<b>/${amount ?? "—"}</b></span>${!village && materialShortage(amount,state.run.resources[id] || 0)>0 ? `<small class="material-gap">不足 ${format(materialShortage(amount,state.run.resources[id] || 0))}</small>` : ""}</span>`}`,
          )
          .join(
            "",
          )}</div>${trophyMarkup(state,recipe.id,Boolean(active||suspended))}${savedWorkNote(active ? state.run.activeAction : suspended)}<div class="craft-growth">${SKILLS.find(x=>x.id===recipe.skill)?.name||"製作"} Lv.${skillLevel(recipe.skill).level} · 作業速度 +${getSkillEffects(state,recipe.skill).runSpeedPercent}%</div></div><div class="craft-command">${village?specialistWorkLink(recipe):""}${smartUnlocked && !singleUse(recipe.id) && !active && !suspended ? `<label class="craft-quantity">製作回数<input type="number" min="1" max="99" step="1" title="1〜99の整数" inputmode="numeric" data-craft-count="${recipe.id}" data-focus="craft-count-${recipe.id}" aria-label="${escape(recipe.name)}の製作回数" value="${Number.isFinite(craftCount) ? craftCount : ""}"></label><small class="craft-total">${Object.entries(recipe.yields || {}).map(([id,amount]) => `${escape(resourceName(id))} ${Number.isInteger(craftCount) && craftCount >= 1 && craftCount <= 99 ? format(amount * craftCount) : "—"}個`).join(" / ")}</small>` : ""}<div class="craft-buttons"><button class="button small ${allowed ? "gold-outline" : "muted"}" ${smartUnlocked && !active && !suspended ? "data-smart-craft" : "data-action"}="${recipe.id}" data-focus="recipe-${recipe.id}" ${!allowed || queuedIndex >= 0 || (active && !resumable) ? "disabled" : ""}>${queuedIndex >= 0 && !active ? "予約済み" : active && !resumable ? (village ? "建設中" : "製作中") : resumable ? (village ? "建設を再開" : "製作を再開") : equipped ? (village ? "建設済み" : recipe.accessory ? "永久所持済み" : ownedEquipment ? "所持済み" : "装備済み") : smartUnlocked && state.run.queue.length > 0 && !active && !suspended ? "末尾に予約" : recipe.endlessFacility ? "追加強化する" : village ? "建設する" : "製作する"}</button>${smartUnlocked && state.run.queue.length > 0 && queuedIndex !== 0 && !active && !suspended && !equipped ? `<button class="button small gold-outline" data-smart-craft="${recipe.id}" data-queue-position="front" data-focus="recipe-front-${recipe.id}" ${!allowed ? "disabled" : ""}>${queuedIndex > 0 ? "先頭へ移す" : "先頭に予約"}</button>` : ""}${visibilityButton}</div>${manualRepeatMarkup(state,recipe,recipe.id==='smelt_iron'?canStartManualRepeat(state):{ok:false})}${!allowed && !active && !equipped ? `<small>${escape(reason)}</small>` : smartUnlocked && !active && !suspended && !equipped ? '<small class="permanent-text">材料集めからおまかせ</small>' : ""}</div></article>`;
      })
      .join(
        "",
      )}</div><div class="context-hint">${icon("hammer")}<span>${smartUnlocked ? (village ? (state.run.endless?.active ? "追加強化も、足りない材料の採集から予約できます。" : "「建設する」で足りない材料の採集から予約します。") : "予約すると、足りない材料の採集・加工も行います。獣皮や技能条件は別途必要です。") : village ? "完成すると施設の効果が働きます。" : "完成すると自動で装備します。"}</span></div>`,
  );
}

function renderLegacy() {
  const history = state.meta.history || [];
  setHTML(
    "#content",
    `<button class="button muted end-run-button" data-command="abandon-menu">この周回を切り上げる</button>${renderUpgradeSections(state,legacyCategory,inheritanceMapUI.options('live'))}<div class="legacy-intro"><span>${icon("memory")}</span><div><h3>身体は還る。記憶は残る。</h3><p>行動した技能に永続経験が蓄積します。永続レベルが高いほど、次の命では作業と進行レベルの成長が速くなります。</p></div></div><div class="legacy-skills">${SKILLS.filter(skill=>skillVisible(state,skill.id)).map(
      (skill) => {
        const current = skillLevel(skill.id),
          permanent = skillLevel(skill.id, true);
        return `<article class="legacy-skill"><div class="legacy-skill-title"><span class="skill-symbol ${skill.id}">${icon(skillIcons[skill.id])}</span><h3>${escape(skill.name)}</h3><span class="permanent-text">永続 Lv.<b>${permanent.level}</b></span></div><div class="legacy-bars"><div><span>この命の成長 <b>Lv.${current.level}</b></span><div class="xp-track"><i style="width:${progress(current.progress)}%"></i></div><small>${format(current.xpInto)} / ${format(current.xpNeeded)} XP</small></div><div><span class="permanent-text">受け継いだ経験</span><div class="xp-track permanent"><i style="width:${progress(permanent.progress)}%"></i></div><small>${format(permanent.xpInto)} / ${format(permanent.xpNeeded)} XP · 次は Lv.${permanent.level + 1}</small></div></div><div class="legacy-growth">この周回の効果：${runGrowth(skill.id)}</div></article>`;
      },
    ).join(
      "",
    )}</div><div class="history-heading"><h3>過去の命</h3><span>最高撃退数 ${state.meta.bestWave}</span></div>${
      history.length
        ? `<div class="history-list">${history
            .slice(0, 5)
            .map(
              (entry) =>
                `<div><span>${icon("flame")}第 ${entry.generation} 世代</span><strong>${entry.wave} 波を撃退</strong><small>生存 ${time(entry.elapsed)}</small></div>`,
            )
            .join("")}</div>`
        : '<div class="empty-history">最初の旅の途中です。<br /><span>この命の記録は、次の世代への道しるべになります。</span></div>'
    }`,
  );
}

function commerceTabs(){return '<div class="commerce-tabs" role="group" aria-label="外交と交易"><button class="button small muted" data-tab="diplomacy" aria-pressed="'+(tab==='diplomacy')+'">外交・道・依頼</button><button class="button small muted" data-tab="trade" aria-pressed="'+(tab==='trade')+'">交易・資源売買</button></div>';}
function renderDiplomacy() {
  if (!isLegacy(state)) {
    setHTML("#content", commerceTabs()+diplomacyMarkup(state)+contractsMarkup(state,document.querySelector(".contracts-panel")?.open)+routesMarkup(state));
    return;
  }
  const quest = state.run.diplomacy;
  const pending = quest.status === "pending";
  const preparing = state.run.status === "preparing";
  const allied = quest.status === "allied";
  const hostile = quest.status === "hostile";
  const defeated = quest.status === "defeated";
  const statusName = pending
    ? "援助要請"
    : allied
      ? "交易中"
      : hostile
        ? "敵対中"
        : "援軍を撃退";
  const food = state.run.resources.food;
  setHTML(
    "#content",
    `<section class="diplomacy-card ${quest.status}"><div class="diplomacy-heading"><span class="country-emblem">${icon("shield")}</span><div><div class="eyebrow">THE NORTHERN BORDER</div><h3>${escape(DIPLOMACY.country)}</h3></div><span class="diplomacy-status">${statusName}</span></div><p class="country-message">${pending ? "「凶作で食料が底をついた。支援してくれるなら、交易の利益を分かち合おう。」期限を過ぎると、食料を奪うため兵を送り込んできます。" : allied ? "援助が国を救いました。交易路が開かれ、この命が続く限り金貨が届きます。" : hostile ? "食料を求めるサフラ軍が、次の襲撃に加勢します。十分な備えがあれば、戦利金を狙って迎え撃つこともできます。" : "サフラ軍を撃退しました。戦利金を獲得し、この周回の攻撃力が上がっています。"}</p><div class="diplomacy-metrics">${pending ? `<div><small>返答まで</small><strong>${time(Math.ceil(Math.max(0, quest.deadline - state.run.elapsed)))}</strong></div><div><small>必要な食料</small><strong class="${food < DIPLOMACY.foodCost ? "danger-text" : ""}">${food}<em> / ${DIPLOMACY.foodCost}</em></strong></div>` : allied ? `<div><small>交易からの累計</small><strong>${quest.incomeTotal}<em> 金貨</em></strong></div><div><small>次の入金まで</small><strong>${Math.ceil(Math.max(0, DIPLOMACY.incomeInterval - quest.incomeTimer))}<em> 秒</em></strong></div>` : `<div><small>${hostile ? "勝利時の戦利金" : "受け取った戦利金"}</small><strong>10<em> 金貨</em></strong></div><div><small>${hostile ? "勝利時の効果" : "現在の戦闘効果"}</small><strong>+3<em> 攻撃</em></strong></div>`}</div>${pending ? `<div class="diplomacy-choices"><div class="diplomacy-choice"><h4>${icon("food")}援助して交易を結ぶ</h4><p>食料${DIPLOMACY.foodCost}を支払い、${DIPLOMACY.incomeInterval}秒ごとに金貨${DIPLOMACY.incomeAmount}。手元の回復食との配分が重要です。</p><button class="button gold-outline" data-command="aid-country" data-focus="aid-country" ${!preparing || food < DIPLOMACY.foodCost ? "disabled" : ""}>食料 ${DIPLOMACY.foodCost} を援助</button></div><div class="diplomacy-choice war-choice"><h4>${icon("sword")}援助せず、迎え撃つ</h4><p>次の敵の体力が25%増加、攻撃+3。撃退で戦利金と攻撃ボーナス。襲撃時刻は変わりません。</p><button class="button muted" data-command="refuse-country" data-focus="refuse-country" ${!preparing ? "disabled" : ""}>援助せず迎え撃つ</button></div></div>` : `<div class="diplomacy-result">${icon(allied ? "check" : hostile ? "sword" : "trophy")}<span>${allied ? "交易収入は戦闘中も続きます。時間停止中は入金も停止します。" : hostile ? "兵は次の予定された襲撃で到着します。こちらから出撃する操作はありません。" : "以後の敵にサフラ軍は加勢しません。勝利の効果はこの命だけ続きます。"}</span></div>`}</section><div class="market-heading"><h3>隊商の交易所</h3><span>${icon("gold")}所持金 <b>${state.run.resources.gold}</b></span></div><div class="market-list">${BUYABLES.map(
      (item) => {
        const hired = item.id === "mercenary" && quest.mercenary;
        return `<article class="market-item"><span class="market-icon">${icon(item.id === "mercenary" ? "sword" : "food")}</span><div><h4>${escape(item.name)}${hired ? '<span class="equipped-tag">雇用済み</span>' : ""}</h4><p>${escape(item.description)}</p></div><button class="button small gold-outline" data-buy-supply="${item.id}" data-focus="buy-${item.id}" ${!preparing || hired || state.run.resources.gold < item.cost ? "disabled" : ""}>${hired ? "雇用済み" : `${item.cost} 金貨`}</button></article>`;
      },
    ).join(
      "",
    )}</div><div class="context-hint">${icon("memory")}<span>外交関係・金貨・戦闘ボーナス・傭兵は次の命でリセット。周回ごとに別の戦略を試せます。</span></div>`,
  );
}

function facilitySummary(id) {
  const l = Number(state.run.facilities[id] || 0);
  if (!l) return "未建設";
  if (isLegacy(state))
    return id === "watchtower"
      ? "+15秒"
      : id === "barricade"
        ? "防御 +3"
        : "2回復 /4秒";
  const rank = state.run.endless?.levels[id] || 0;
  const f = reinforcementEffect(id,rank,CONTENT.facilities.find(
    (f) => f.facilityId === id && f.level === l,
  ).effect);
  return (
    "Lv." +
    l + (rank ? ` +${rank}` : "") +
    " · " +
    ({
      watchtower: "+" + f.raidDelay + "秒",
      barricade: "防御 +" + f.defense,
      infirmary: "処置 " + f.treatmentCharges + "回" + (rank ? ` / 回復 +${f.treatmentFlat}` : ""),
      workshop: "製作 +" + Math.round(f.craftSpeed * 100) + "%",
      smokehouse: "魚料理 +25% / 食料回復 +4",
      market: "割引 " + Math.round(f.purchaseDiscount * 100) + "%" + (rank ? ` / 金貨+${f.income}/15秒` : ""),
      guardhouse: "支援 " + getStats(state).support,
      signal_post: "敵の攻撃力上昇速度 −30%（停止なし）",
      archery_tower: "弓支援 " + f.rangedAttack + " / 飛行に2.5倍",
    }[id] || (f.specialistSpeed?'技能作業 +'+Math.round(f.specialistSpeed*100)+'%':f.trainingSpeed?'全戦闘訓練 +'+Math.round(f.trainingSpeed*100)+'%':f.population?'人口上限 '+f.population+'人':'建設済み'))
  );
}
function renderSurvivor() {
  const stats = getStats(state),
    health = Math.max(0, state.run.hp);
  setHTML(
    "#survivor",
    `<div class="panel-heading"><h2>${icon("shield")}灯守の状態</h2><span class="status-dot ${state.run.status}">${state.run.status === "combat" ? "戦闘中" : state.run.status === "dead" ? "死亡" : "準備中"}</span></div><div class="health-heading"><span>${icon("heart")}生命力</span><strong>${formatHealth(health)} <small>/ ${formatHealth(stats.maxHp)}</small></strong></div><div class="health-track"><i style="width:${progress(health / stats.maxHp)}%"></i></div><div class="combat-stats"><div>${icon("sword")}<span>攻撃力</span><strong>${stats.attack}</strong></div><div>${icon("shield")}<span>防御力</span><strong>${stats.defense}</strong></div></div>${skillLevel("combat").level > 1 ? `<div class="combat-growth"><span>周回の戦闘 Lv.${skillLevel("combat").level}</span><strong>攻撃 +${getSkillEffects(state, "combat").runAttack} · 最大HP +${getSkillEffects(state, "combat").runMaxHp}</strong></div>` : ""}<div class="survival-time"><span>${icon("clock")}この命の時間</span><strong>${time(state.run.elapsed)}</strong></div><div class="auto-food">${icon("food")}<span>食料はピンチになると自動で使用</span><b>${format(getTotalFood(state))}</b></div>`,
  );
  setHTML(
    "#equipment",
    `<div class="panel-heading equipment-heading"><h2>装備</h2><span>完成時に自動装備</span></div><div class="equipment-list">${Object.entries(
      slotNames,
    )
      .map(([slot, name]) => {
        const item = state.run.equipment[slot];
        return `<div class="equipment-slot ${item ? "has-item" : ""}"><span class="equipment-icon">${icon(slotIcons[slot])}</span><div><small>${name}</small><strong>${item ? escape(item.name) : "未装備"}</strong></div>${item ? icon("check") : '<span class="empty-slot">—</span>'}</div>`;
      })
      .join("")}</div>${gearMarkup(state,document.querySelector('.gear-panel')?.open,{codexOpen:document.querySelector('.accessory-codex')?.open,draftName:document.querySelector('[data-build-name]')?.value||''})}${companionMarkup(state,document.querySelector('.companion-codex')?.open)}${farmMarkup(state,document.querySelector('.farm-panel')?.open)}`,
  );
  setHTML(
    "#next-goal",
    `<div class="goal-note"><div>${icon("flame")}次の一歩</div><p>${!state.run.equipment.weapon ? "木材4・石材2を集めて石の槍を。襲撃前に、工房で準備を整えよう。" : !state.run.equipment.shield ? "武器の備えはできた。盾と食料があれば、もう少し先へ。" : state.run.wave >= 6 ? "次の襲撃の特性を見て、装備・食料・村への投資を選ぼう。" : "採掘と製作を育て、次の装備を目指そう。"}</p><button data-tab="${state.run.equipment.weapon && state.run.equipment.shield ? "legacy" : "craft"}" data-focus="next-goal">${state.run.equipment.weapon && state.run.equipment.shield ? "技能の成長を見る" : "工房を開く"}${icon("arrow")}</button></div>`,
  );
  setHTML(
    "#facilities",
    !getUnlocks(state).facilities
      ? ""
      : `<div class="panel-heading facility-heading"><h2>村の施設</h2><button data-tab="village" data-focus="village-shortcut" aria-label="村の施設を建設">建設 ${icon("chevron")}</button></div>${Object.entries(
          FACILITIES,
        )
          .map(
            ([id, facility]) =>
              `<div class="facility-row ${state.run.facilities[id] ? "built" : ""}" title="${escape(facility.description)}">${icon(id === "watchtower" ? "eye" : id === "barricade" ? "shield" : "heart")}<span>${escape(facility.name)}</span><b>${facilitySummary(id)}</b></div>`,
          )
          .join("")}`,
  );
}

function renderJournal() {
  const entries = state.run.log.slice(0, 4);
  setHTML(
    "#journal-entries",
    entries.length
      ? entries
          .map(
            (entry) =>
              `<div class="journal-entry ${escape(entry.type)}"><time>${time(entry.time)}</time><span class="log-dot"></span><p>${escape(entry.text)}</p></div>`,
          )
          .join("")
      : `<div class="journal-entry"><time>00:00</time><span class="log-dot"></span><p>小さな火を灯した。この命で、どこまで辿り着けるだろう。</p></div>`,
  );
}

function syncBattleDialog() {
  const dialog = document.querySelector("#battle-dialog");
  if (state.run.status === "combat" && state.run.enemy) {
    activeBattle = {
      generation: state.meta.generation,
      wave: state.run.enemy.wave,
      name: state.run.enemy.name,
      routeId: state.run.routes?.active?.id || null,
    };
    renderBattle(dialog, state);
    const retreat=dialog.querySelector("[data-command=abandon-menu],[data-route-withdraw]");if(retreat){if(state.run.routes?.active){delete retreat.dataset.command;retreat.dataset.routeWithdraw="1";retreat.textContent="地域から撤退";}else{delete retreat.dataset.routeWithdraw;retreat.dataset.command="abandon-menu";}}
    const battleCamp = mountCampScene(dialog.querySelector(".battle-scene"), {
      variant: "battle",
      focusY: 0.45,
    });
    battleCamp.setSettlement(state.run.facilities);
    battleCamp.setActive(state.settings.effectsEnabled && !state.settings.paused);
    if (!dialog.open && !document.querySelector("dialog[open]:not(#expanded-work-dialog)"))
      dialog.showModal();
    campScene.setActive(false);
    return;
  }
  suspendBattle(dialog);
  const routeReturned = dialog.open && activeBattle?.routeId && state.run.routes?.last?.id === activeBattle.routeId && state.run.status === 'preparing';
  if (routeReturned) dialog.addEventListener('close', () => requestAnimationFrame(() => {
    const result = document.querySelector('#content .route-result');
    if (result && !document.querySelector('dialog[open]:not(#expanded-work-dialog)')) {
      result.focus({ preventScroll: true });
    }
  }), {once:true});
  if (dialog.open) dialog.close();
  campScene.setActive(state.settings.effectsEnabled && !state.settings.paused);
  if (
    activeBattle &&
    state.run.status === "preparing" &&
    activeBattle.generation === state.meta.generation &&
    state.run.wave >= activeBattle.wave
  ) {
    toast(`第${activeBattle.wave}波を撃退しました。`);
  }
  activeBattle = null;
}

function renderExtra(selector, html) {
  const host = document.querySelector(selector);
  let extra = host.querySelector(":scope > .mvp-extra");
  if (editingWithin(extra)) return;
  if (!html) {
    extra?.remove();
    return;
  }
  if (!extra) {
    extra = document.createElement("div");
    extra.className = "mvp-extra";
    host.append(extra);
  }
  if (extra.dataset.html !== html) {
    const focus = extra.contains(document.activeElement)
      ? document.activeElement.dataset.focus
      : null;
    rememberDetails(extra);
    extra.innerHTML = html;
    for (const input of extra.querySelectorAll('input[type="number"]')) validateReservationInput(input);
    restoreDetails(extra);
    extra.dataset.html = html;
    if (focus)
      extra
        .querySelector('[data-focus="' + CSS.escape(focus) + '"]')
        ?.focus({ preventScroll: true });
  }
}
function renderMealControls(){
 const visible=state.version===2&&['craft','workers'].includes(tab)&&!['dead','cleared','legacy_setup'].includes(state.run.status)&&(state.meta.bestWave>=3||state.run.resources.fish_meal>0||state.run.resources.egg_meal>0||state.meta.upgrades.some(id=>["auto_cook","lumber_worker","mining_worker","foraging_worker","processing_worker"].includes(id)));
 let panel=document.getElementById('meal-controls');if(!visible){panel?.remove();return;}if(!panel){panel=document.createElement('section');panel.id='meal-controls';(tab==='workers'?document.querySelector('#content .population-panel'):null)?.insertAdjacentElement('afterend',panel)||document.querySelector('#content').prepend(panel);}setHTML('#meal-controls',mealMarkup(state));
}
function render() {
  renderGuard.run(() => {
    try { preserveRenderScroll(document, () => { renderScreen(); renderMealControls(); inheritanceMapUI.sync(); }); }
    finally { committedSelect = null; }
  });
}
function renderScreen() {
  if(gatherGuideDialog.open)renderGatherGuide();
  if (materialPriorityDialog.open && materialPriorityProposal) setHTML('#material-priority-dialog', materialPriorityMarkup(state, materialPriorityProposal));
  if (!session.owned) state.settings.paused = true;
  const unlocks = getUnlocks(state);
  if (
    (tab === "village" && !unlocks.facilities) ||
    (["diplomacy","trade"].includes(tab) && !unlocks.diplomacy)
  )
    tab = "gather";
  renderNavigation();
  renderControls();
  renderWorld();
  renderWork();
  setHTML("#mobile-queue-context",queueContext(state,id=>ACTIONS.find(d=>d.id===id)?.name||RECIPES.find(d=>d.id===id)?.name||id));
  expandedPane.update();
  document.querySelector('[data-command="expand-work"]').hidden=wideWorkLayout.matches||state.run.status==='legacy_setup';
  renderSurvivor();
  renderJournal();
  setHTML("#milestone", "");
  syncBattleDialog();
  setHTML("#augments-panel", "");
  setHTML("#prep-status", "");
  setHTML("#queue-warning", "");
  const offer = getAugmentStatus(state);
  const offerKey = offer.offer.length
    ? `${state.meta.generation}:${offer.selected.length}:${offer.offer.join(",")}`
    : "";
  const augmentDialog = document.querySelector("#augment-dialog");
  if(!session.owned){if(augmentDialog.open)augmentDialog.close();const exclusion=document.querySelector("#augment-exclude-dialog");if(exclusion.open)exclusion.close();pendingAugmentExclude=null;}
  if (offerKey) setHTML("#augment-dialog", renderAugments(state, { offer: true,error:augmentSaveError }));
  else if (augmentDialog.open) augmentDialog.close();
  if (
    session.owned && offerKey &&
    offerKey !== displayedOffer &&
    !document.querySelector("dialog[open]:not(#expanded-work-dialog)")
  ) {
    augmentDialog.showModal();
    displayedOffer = offerKey;
  }
  if (!offerKey){displayedOffer="";augmentSaveError="";}
  chapterPresentation(state);
  document.body.classList.toggle("effects-disabled", !state.settings.effectsEnabled);
  renderExtra("#next-goal", enemyRoadmap(state) + augmentStatusMarkup(state));
  renderExtra("#journal-entries", replayAchievementsMarkup(state)+`${clearHistoryMarkup(state)}${state.meta.bestEndlessWave ? `<p class="fine-print">エンドレス最高 ${state.meta.bestEndlessWave}波撃退</p>` : ""}` + earlyDefeatMarkup(state) + reportMarkup(state) + challengesMarkup(state));
  document.querySelector("#death-dialog").classList.toggle("frontier-finish",isFrontierFinish(state));
  if (["dead", "cleared"].includes(state.run.status) && !deadShown) {if(isFrontierFinish(state)&&finishDismissed(localStorage,state))deadShown=true;else showDeath();}
  document.querySelector("#death-dialog").classList.toggle("legacy-setup", state.run.status === "legacy_setup");
  if (state.run.status === "legacy_setup" && session.owned) {
    const dialog = document.querySelector("#death-dialog");
    const markup = setupMarkup(state, setupCategory, inheritanceMapUI.options('setup'));
    updateSetupDialog(dialog, markup);
    if (!dialog.open) dialog.showModal();
    setupShown = true;
  } else {setupShown=false;if(state.run.status==="legacy_setup" && !session.owned)document.querySelector("#death-dialog").close();}
  if (tab === "legacy" && !isLegacy(state)) {
    renderExtra("#content", milestoneMarkup(state));
  }
  if (!isLegacy(state) && hasUpgrade(state,"action_queue"))
    renderExtra("#queue-panel", queueTimingMarkup(state) + conditionalMarkup(state) + templatesMarkup(state));
  setHTML(
    "#session-notice",
    session.owned
      ? ""
      : '<div class="session-notice"><span>別のタブでプレイ中</span><button class="button small muted" data-command="takeover">このタブで続ける</button></div>',
  );
  for (const dialog of document.querySelectorAll("dialog[open]")) {
    const notice = dialog.querySelector(".session-dialog");
    if (session.owned) notice?.remove();
    else if (!notice)
      dialog.insertAdjacentHTML(
        "beforeend",
        '<div class="session-dialog session-notice"><span>別のタブでプレイ中</span><button class="button small muted" data-command="takeover">このタブで続ける</button></div>',
      );
  }
  syncCampSpace();
}

function showHelp() {
  state.settings.paused = true;
  document.querySelector("#help-dialog").innerHTML =
    `<div class="dialog-heading"><div class="eyebrow">HOW TO SURVIVE · v0.6.102</div><button class="icon-button" data-close="help-dialog" aria-label="閉じる">${icon("close")}</button></div><h2 id="help-title">ひとつ先の夜を、目指して。</h2><p class="dialog-lead">最初は短い命でも、その経験は無駄になりません。</p><ol class="guide-steps"><li><span>01</span><div><h3>資源を集める</h3><p>伐採・採掘・採集を選ぶと時間が動き、繰り返し作業します。一時停止後も、作業を選べば再開できます。最初の襲撃は${FIRST_RAID_DELAY / 60}分後です。</p></div></li><li><span>02</span><div><h3>工房で備える</h3><p>まずは木材4・石材2で石の槍を製作。装備は完成時に自動装着されます。回復ポーションを工房で製作すると、戦闘中の回復に使えます。食料は救護所で戦闘外に使います。</p></div></li><li><span>03</span><div><h3>襲撃を生き延びる</h3><p>敵が野営地へ攻めてきます。大きな戦闘画面で自動防衛を見守ります。一時停止も可能です。撃退後は元の作業へ戻ります。</p></div></li><li><span>04</span><div><h3>経験を次の命へ</h3><p>死亡すると資源・装備・進行レベルは失われます。使った技能の永続経験は残り、次の命の成長を速めます。</p></div></li></ol><p class="fine-print">初めて襲撃を防ぐと村の施設が解放されます。初達成のクエストで継承ポイントを得て、自動化などを解放できます。最初のボスを倒すと外交とオーグメントの3択が登場します。まずは資源・装備・食料の準備に集中しましょう。</p><div class="guide-tip">${icon("pause")}いつでも一時停止して計画できます。<br />裏画面でも進みます。設定で自動停止を選べます。ゲームを閉じている間は進みません。</div><button class="button gold full-width" data-close="help-dialog">野営地に戻る${icon("arrow")}</button>`;
  document.querySelector("#help-dialog").showModal();
  render();
}

function showSettingsMenu() {
  state.settings.paused = true;
  document.querySelector("#settings-dialog").innerHTML = `<div class="dialog-heading"><div class="eyebrow">SETTINGS</div><button class="icon-button" data-close="settings-dialog" aria-label="閉じる">${icon("close")}</button></div><h2 id="settings-title">設定</h2><p class="fine-print"><a href="./src/vendor/THIRD-PARTY-NOTICES.txt" target="_blank" rel="noopener">使用ライブラリとライセンス</a></p><section class="presentation-settings settings-options"><h3>ゲームの進行</h3><label><input id="pause-when-hidden" type="checkbox" ${state.settings.pauseWhenHidden ? "checked" : ""}> 別のタブ・アプリへ移ったら一時停止</label><h3>音と演出</h3><label>BGM音量 <input id="music-volume" type="range" min="0" max="1" step="0.05" value="${state.settings.musicVolume ?? .15}"></label><label>環境音（風） <input id="ambient-volume" type="range" min="0" max="1" step="0.05" value="${state.settings.ambientVolume || 0}"></label><label>効果音量 <input id="sound-volume" type="range" min="0" max="1" step="0.05" value="${state.settings.soundVolume}"></label><label><input id="effects-enabled" type="checkbox" ${state.settings.effectsEnabled ? "checked" : ""}> 演出を表示</label></section><section class="presentation-settings"><h3>リプレイ実績</h3><button class="button muted full-width" data-info="journal">実績・挑戦条件を見る</button></section><section class="presentation-settings"><h3>新しい挑戦</h3><p class="fine-print">継承もリセットして、第1世代から挑戦します。解除済みのリプレイ実績は残ります。</p><button class="button muted full-width" data-command="reset-menu">最初からやり直す</button></section>`;
  document.querySelector("#settings-dialog").showModal();
  render();
}

function showSaveMenu() {
  state.settings.paused = true;
  document.querySelector("#save-dialog").innerHTML =
    `<div class="dialog-heading"><div class="eyebrow">YOUR JOURNEY</div><button class="icon-button" data-close="save-dialog" aria-label="閉じる">${icon("close")}</button></div><h2 id="save-title">旅の記録</h2><p class="dialog-lead">進行中の命と永続経験を、このブラウザーに自動保存します。</p>${loadWarning ? `<div class="save-warning">${escape(loadWarning)}</div>` : ""}<div class="save-summary"><span>第 ${state.meta.generation} 世代</span><strong>最高 ${state.meta.bestWave} 波撃退</strong><span>生存 ${time(state.run.elapsed)}</span></div><div class="save-options"><button class="button gold-outline" data-command="export">${icon("save")}データを書き出す</button><button class="button muted" data-command="import">${icon("book")}データを読み込む</button></div><p class="fine-print">読み込み前の記録はバックアップに残します。ブラウザーの保存領域を消す前は、ファイルに書き出してください。</p><button class="button gold full-width" data-command="save-now">今すぐブラウザーに保存</button>`;
  document
    .querySelector("#save-dialog")
    .insertAdjacentHTML(
      "beforeend",
      `<details class="save-code"><summary>セーブコードで保存・読み込み</summary><p>ファイルの代わりに、コード全体をコピーして保管できます。</p><textarea id="save-code" aria-label="セーブコード" placeholder="ここにセーブコードを貼り付け" spellcheck="false"></textarea><div><button class="button small muted" data-command="code-export">現在のコードを表示</button><button class="button small gold-outline" data-command="code-import">コードを読み込む</button></div></details>`,
    );
  if (state.run.endless?.active) document.querySelector("#save-dialog").insertAdjacentHTML("beforeend", `<div class="save-options"><span>エンドレス ${state.run.wave}波 · 最高${state.meta.bestEndlessWave || finalWaveForRun(state)}波</span><button class="button gold-outline" data-command="share-endless">エンドレス記録画像を保存</button><button class="button muted" data-command="share-clear">通常クリアの画像を保存</button></div>`);
  const backups = readBackups(localStorage);
  const resetBackup = readResetBackup(localStorage);
  if (resetBackup) document.querySelector("#save-dialog").insertAdjacentHTML("beforeend", `<div class="save-options"><span>最初からやり直す前 · 第${resetBackup.meta.generation}世代</span><button class="button muted" data-command="restore-reset">リセット前の記録を復元</button></div>`);
  document.querySelector("#save-dialog").insertAdjacentHTML(
    "beforeend",
    `<details class="backup-list"><summary>バックアップから復元（${backups.length}/5）</summary>${backups
      .map((entry, index) => {
        const saved = decodeRecord(entry.record);
        return `<div><span>${escape(new Date(entry.savedAt).toLocaleString("ja-JP"))} · 第${saved.meta.generation}世代 · ${saved.run.wave}波</span><button class="button small muted" data-backup="${index}">復元</button></div>`;
      })
      .join(
        "",
      )}${unreadableRecord(localStorage) ? '<button class="button small muted" data-command="export-original">読み込めなかった元データを書き出す</button>' : ""}</details>`,
  );
  if (isLegacy(state))
    document
      .querySelector("#save-dialog")
      .insertAdjacentHTML(
        "beforeend",
        '<button class="button muted full-width" data-command="migrate-now">継承してMVPの新しい周を準備</button>',
      );
  document.querySelector("#save-dialog").showModal();
  render();
}

function showDeath() {
  delete document.querySelector("#death-dialog").dataset.setup;
  deadShown = true;
  state.settings.paused = true;
  saveGame();
  const record = state.meta.history[0];
  const gains = record?.skillGains || {};
  const comparison = compareRun(state);
  const signed = (value, formatter = format) => `${value >= 0 ? "+" : "−"}${formatter(Math.abs(value))}`;
  const comparisonMarkup = comparison ? `<div class="run-comparison"><span>前回の命と比べて</span><b>${signed(comparison.wave)}波</b><b>生存時間 ${signed(comparison.seconds,time)}</b></div>` : '<div class="run-comparison"><span>この命の経験が、次の出発点になります。</span></div>';
  const retainedUnlocks = state.meta.upgrades
    .map((id) => LEGACY_UPGRADES.find((item) => item.id === id)?.name)
    .filter(Boolean);
  for (const dialog of document.querySelectorAll("dialog[open]"))
    dialog.close();
  document.querySelector("#death-dialog").innerHTML =
    `<div class="death-emblem">${icon("flame")}</div><div class="eyebrow">THE EMBER REMAINS</div><h2 id="death-title">火は消えても、記憶は残る。</h2><p class="dialog-lead">第 ${state.meta.generation} 世代の旅が終わりました。<br />積み重ねた経験が、次の命を少し強くする。</p><div class="death-stats"><div><small>この命の時間</small><strong>${time(state.run.elapsed)}</strong></div><div><small>撃退した襲撃</small><strong>${state.run.wave}<span> 波</span></strong></div><div><small>最高記録</small><strong>${state.meta.bestWave}<span> 波</span></strong></div></div>${comparisonMarkup}${runResultMarkup(state)}<div class="inheritance-heading">${icon("memory")}次の命へ引き継ぐ経験</div><div class="inheritance-list">${SKILLS.filter(skill=>skillVisible(state,skill.id)).map((skill) => `<div><span>${icon(skillIcons[skill.id])}${escape(skill.name)}</span><b>永続 Lv.${getSkillProgress(state.run.startPermanentXp?.[skill.id] ?? Math.max(0,state.meta.skills[skill.id].xp-(gains[skill.id] || 0)),true).level} → ${skillLevel(skill.id, true).level}</b><small>+${format(gains[skill.id] || 0)} XP</small></div>`).join("")}</div><p class="death-tip">${state.run.equipment.weapon ? "鍛えた技能で準備を速め、次は装備と食料をひとつ多く。" : "次の命では、伐採から武器を作る順番を試してみよう。"}</p><button class="button gold full-width" data-command="rebirth">次の命を灯す${icon("arrow")}</button><p class="fine-print">資源・装備・進行レベル・オーグメントの効果はリセットされます。</p>`;
  if (state.run.endless?.active) {
    document.querySelector('#death-title').textContent = `終わらぬ夜 · ${state.run.wave}波撃退`;
    document.querySelector('#death-dialog .death-tip').insertAdjacentHTML('afterend', '<button class="button gold-outline full-width" data-command="share-endless">エンドレス記録画像を保存</button>');
  }
  const report = state.run.deathReport;
  if (report) {
    const tip = document.querySelector("#death-dialog .death-tip");
    const advice =
      report.food > 0
        ? "ポーションは残っていました。防御や最大体力を増やし、一撃を耐える備えを。"
        : "ポーションがありませんでした。ポーションの製作と、戦闘を短くする攻撃力を見直しましょう。";
    tip.textContent = advice;
    tip.insertAdjacentHTML(
      "beforebegin",
      `<section class="defeat-report"><h3>第${report.wave}波 · ${escape(report.enemy)}</h3><p>直前のHP <b>${report.beforeHit}</b> ／ 最後の被害 <b>${report.damage}</b></p><p>残ったポーション <b>${format(report.food)} 個</b></p></section>`,
    );
  }
  document
    .querySelector("#death-dialog .death-tip")
    .insertAdjacentHTML(
      "beforebegin",
      `<div class="death-legacy">${icon("trophy")}<span>継承ポイント <b>${state.meta.points} pt</b> ・ 初撃破 ${state.meta.defeatedBosses.length} 体 ・ クエスト ${state.meta.completedMilestones.length}/${MILESTONES.length}<br /><small>${retainedUnlocks.length ? `引き継ぐ解放：${retainedUnlocks.map(escape).join("、")}` : "初達成のクエストと、ボスの初撃破で継承ポイントを獲得。"}</small></span></div>`,
    );
  if (state.run.status === "cleared") {
    document.querySelector('#death-dialog .death-tip').insertAdjacentHTML('afterend',replayAchievementsMarkup(state));
    document.querySelector("#death-title").textContent = "最終襲撃を撃退。";
    document.querySelector('#death-dialog .death-tip').insertAdjacentHTML('afterend', `<button class="button gold-outline full-width" data-command="start-endless">エンドレスへ挑む</button><p class="fine-print">装備・施設・資源を維持して${finalWaveForRun(state)+1}波へ。施設Vの追加強化と追加オーグメントで、到達WAVEを伸ばせます。</p>`);
    document.querySelector("#death-dialog .dialog-lead").textContent =
      `第${state.meta.generation}世代で村を守り抜きました。次は別の構成で挑戦できます。`;
    document.querySelector("#death-dialog .death-stats").insertAdjacentHTML('beforebegin', `<div class="clear-achievement">${icon('trophy')}<strong>第${state.meta.generation}世代でクリア</strong><button class="button gold-outline" data-command="share-clear">${icon('save')}記録画像を保存</button></div>`);
  }
  document.querySelector("#death-dialog .death-stats").insertAdjacentHTML("afterend", earlyDefeatMarkup(state) + reportMarkup(state) + challengesMarkup(state));
  mountFrontierFinish(document.querySelector("#death-dialog"),state);
  document.querySelector("#death-dialog").showModal();
  document.querySelector("#death-dialog").scrollTop = 0;
}

document.addEventListener('keydown',event=>{
 if(!event.target.matches?.('[data-legacy-category]')||!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
 const ids=LEGACY_CATEGORIES.map(c=>c.id),i=ids.indexOf(event.target.dataset.legacyCategory),next=event.key==='Home'?0:event.key==='End'?ids.length-1:(i+(event.key==='ArrowRight'?1:-1)+ids.length)%ids.length;
 event.preventDefault();document.querySelector('[data-legacy-category="'+ids[next]+'"]').click();
});
document.addEventListener("click", (event) => {
  unlockAudio(state.settings);
  const button = event.target.closest("button, .brand");
  if (!button || button.disabled) return;
  if(inheritanceMapUI.handleClick(button))return;
  if(foundationPending && !button.dataset.legacyCategory && !button.dataset.bagCategory && !button.dataset.tab && !button.dataset.close && !button.dataset.info && !["save-now","save-menu","export","code-export","takeover","help","header-menu"].includes(button.dataset.command)){toast("保存できるまでポイント移行を保留しています。");return;}
  if (
    !session.owned &&
    !["takeover", "header-menu", "save-menu", "export", "code-export", "help"].includes(
      button.dataset.command,
    ) &&
    !button.dataset.tab &&
    !button.dataset.legacyCategory && !button.dataset.bagCategory &&
    !button.dataset.skill &&
    !button.dataset.close &&
    !button.dataset.info
  ) {
    toast("別のタブでプレイ中です。");
    return;
  }
  if (button.closest("#header-menu-dialog") && !button.dataset.close && !button.dataset.info && button.dataset.command!=="acceleration") headerMenuDialog.close();

  if(button.dataset.population){
   const r=allocatePopulation(state,button.dataset.population,Number(button.dataset.populationCount));
   if(!r.ok)toast(r.reason);else saveGame();render();return;
  }
  if(button.dataset.reopen){
   const r=queueCraft(state,'reopen_'+button.dataset.reopen,'end',1);
   if(!r.ok)toast(r.reason);else {state.settings.paused=false;saveGame();}render();return;
  }
  if(button.dataset.command==='early-raid-menu'){
   const check=canEarlyRaid(state);if(!check.ok){toast(check.reason);return;}
   pendingEarlyRaid=earlyRaidToken(state);earlyRaidDialog.innerHTML=earlyRaidConfirmation(state);showCampDialog(earlyRaidDialog,button);return;
  }
  if(button.dataset.command==='early-raid-confirm'){
   if(!pendingEarlyRaid||!earlyRaidDialog.open)return;
   const result=editStoredEarlyRaid(localStorage,state,pendingEarlyRaid,{isOwner:()=>session.owned,pausedAfter:overlayPause.get(earlyRaidDialog)??true});
   if(!result.ok){earlyRaidDialog.querySelector('[data-early-raid-error]').textContent=result.reason;return;}
   state=result.state;pendingEarlyRaid=null;overlayPause.set(earlyRaidDialog,state.settings.paused);lastTick=performance.now();earlyRaidDialog.close();render();return;
  }
  if(button.dataset.excludeAugment){pendingAugmentExclude=button.dataset.excludeAugment;const dialog=document.querySelector('#augment-exclude-dialog');dialog.innerHTML=augmentExclusionMarkup(state,pendingAugmentExclude);dialog.showModal();}
  if(button.dataset.purchase||button.dataset.refund||(state.run.status==='legacy_setup'&&button.dataset.toggleUpgrade)){
    const key=button.dataset.purchase||button.dataset.refund||button.dataset.toggleUpgrade,type=button.dataset.purchase?'upgrade':button.dataset.refund?'remove':'switch';
    const r=editStoredLegacyRank(localStorage,state,{key,type},{isOwner:()=>session.owned});
    if(r.ok){state=r.state;refreshCatalog();saveFailed=false;toast('次の命への配分を保存しました。');}else toast(r.reason);render();return;
  }
  if (button.dataset.workerUpgrade) {
    const r = upgradeWorker(state, button.dataset.workerUpgrade);
    if (!r.ok) toast(r.reason);
    saveGame();
  }
  if (button.dataset.template !== undefined) {
    const r = loadTemplate(state, Number(button.dataset.template));
    if (!r.ok) toast(r.reason);
    else { markQueueEdited(); toast(`${r.added}件の行動予約を追加しました。`); }
    saveGame();
  }
  if (button.dataset.templateDelete !== undefined) {
    deleteTemplate(state, Number(button.dataset.templateDelete));
    saveGame();
  }
  if (button.dataset.templateOverwrite !== undefined) {
    const result = prepareTemplateOverwrite(state, Number(button.dataset.templateOverwrite));
    if (!result.ok) toast(result.reason);
    else {
      templateOverwriteProposal = result.proposal;
      state.settings.paused = true;
      templateOverwriteDialog.innerHTML = templateOverwriteMarkup(state, result.proposal);
      templateOverwriteDialog.showModal();
      templateOverwriteDialog.scrollTop = 0;
    }
  }
  if (materialPriorityDialog.open && materialPriorityProposal) {
    editMaterialPriority(state,materialPriorityProposal,{toggle:button.dataset.priorityToggle,move:button.dataset.priorityMove,direction:Number(button.dataset.direction),reset:button.dataset.priorityReset!==undefined});
    if(button.dataset.priorityToggle && button.dataset.focus?.startsWith("priority-remove-")) queueMicrotask(()=>materialPriorityDialog.querySelector('[data-focus="priority-tile-'+CSS.escape(button.dataset.priorityToggle)+'"]')?.focus({preventScroll:true}));
    if(button.dataset.priorityReset!==undefined) setTimeout(()=>materialPriorityDialog.querySelector("#priority-order-title")?.focus({preventScroll:true}),0);
  }
  if (button.dataset.aid) {
    const r = aidCountry(state, button.dataset.aid);
    if (!r.ok) toast(r.reason);
    saveGame();
  }
  if (button.dataset.refuse) {
    const r = refuseCountry(state, button.dataset.refuse);
    if (!r.ok) toast(r.reason);
    saveGame();
  }
  if (button.classList.contains("brand")) {
    event.preventDefault();
    tab = "gather";
  }
  if(button.dataset.tab){selectWorkMenu(button.dataset.tab,{expand:button.dataset.navExpand==='1'});return;}
  if (button.dataset.skill) {
    if(window.innerWidth<=690)document.querySelector('.workspace main').scrollTop=0;
    if(queueStopDialog.open)queueStopDialog.close();
    document.querySelector("#content").scrollTop = 0;
    selectedSkill = button.dataset.skill;if(["cooking","alchemy"].includes(selectedSkill))craftFilter="all";
    tab = ["smithing","cooking","alchemy"].includes(selectedSkill) ? "craft" : "gather";
  }
  if (button.dataset.chooseAugment) {
    const result = chooseAugment(state, button.dataset.chooseAugment);
    toast(
      result.ok
        ? "この命の方針を選びました。"
        : result.reason,
    );
    lastTick = performance.now();
    saveGame();
  }
  if (button.dataset.setupCategory) {
    setupCategory = button.dataset.setupCategory;
    render();
    document.querySelector(`#setup-tab-${setupCategory}`)?.focus({ preventScroll: true });
  }
  if(button.dataset.contractAccept||button.dataset.contractDeliver||button.dataset.contractCancel){const type=button.dataset.contractAccept?"accept":button.dataset.contractDeliver?"deliver":"cancel",id=button.dataset.contractAccept||button.dataset.contractDeliver;const r=editStoredContract(localStorage,state,{type,id},{isOwner:()=>session.owned});if(r.ok){state=r.state;refreshCatalog();render();toast(type==="deliver"?"納品と今周回の報酬を保存しました。":type==="cancel"?"受注を解除しました。":"任意依頼を受注しました。");}else toast(r.reason);return;}
  if(button.dataset.route||button.dataset.routeWithdraw){const r=editStoredRoute(localStorage,state,button.dataset.route,{withdraw:!!button.dataset.routeWithdraw,isOwner:()=>session.owned});if(r.ok){state=r.state;refreshCatalog();render();}else toast(r.reason);return;}
  if(button.dataset.farm){const r=editStoredFarm(localStorage,state,button.dataset.farm,{isOwner:()=>session.owned});if(r.ok){state=r.state;refreshCatalog();toast('農場設定を保存しました。');}else toast(r.reason);return;}
  if(button.dataset.companion){const id=button.dataset.companion==='none'?null:button.dataset.companion;companionProposal=proposeCompanion(state,id);if(!companionProposal.ok){toast(companionProposal.reason);return;}companionDialog.innerHTML='<h2 id="companion-choice-title">同行を変更</h2><p>現在：'+(companionById(state.meta.activeCompanion)?.name||'同行なし')+' → '+(companionById(id)?.name||'同行なし')+'</p><p>所持品・報酬・進行は変わりません。戦闘中は変更できません。</p><button class="button muted" data-close="companion-choice-dialog">取消</button><button class="button gold" data-companion-confirm="1">この相棒と同行</button><p data-companion-error role="status" aria-live="polite"></p>';companionDialog.showModal();return;}
  if(button.dataset.companionConfirm){const r=confirmStoredCompanion(localStorage,state,companionProposal,{isOwner:()=>session.owned});if(r.ok){state=r.state;companionDialog.close();refreshCatalog();toast('同行する相棒を保存しました。');}else{const error=companionDialog.querySelector('[data-companion-error]');if(error)error.textContent=r.reason;toast(r.reason);}render();return;}
  if(button.dataset.alchemyUse||button.dataset.alchemyTarget){const choice=button.dataset.alchemyTarget?{type:'target',id:button.dataset.alchemyTarget}:{type:'use',id:button.dataset.alchemyUse,value:!state.settings.alchemyUse?.[button.dataset.alchemyUse]};const r=editStoredMagic(localStorage,state,choice,{isOwner:()=>session.owned});if(r.ok){state=r.state;refreshCatalog();toast('錬金設定を保存しました。');}else toast(r.reason);render();return;}
  if(button.dataset.equipWeapon||button.dataset.equipEquipment||button.dataset.equipAccessory){
    const choice=button.dataset.equipEquipment?{type:"equipment",id:button.dataset.equipEquipment}:button.dataset.equipWeapon?{type:'weapon',id:button.dataset.equipWeapon}:{type:'accessory',id:button.dataset.equipAccessory==='none'?null:button.dataset.equipAccessory,phase:button.dataset.gearPhase,slot:button.dataset.gearSlot};
    const result=editStoredGear(localStorage,state,choice,{isOwner:()=>session.owned});if(result.ok){state=result.state;refreshCatalog();saveFailed=false;toast('構成を保存しました。');}else toast(result.reason);render();return;
  }
  if(button.dataset.showOwnedAccessories){showOwnedAccessories=!showOwnedAccessories;render();return;}

  if(button.dataset.legacyCategory){legacyCategory=button.dataset.legacyCategory;saveUiPreference(localStorage,'loopkeeper-legacy-category-v1',legacyCategory);render();document.querySelector('[data-legacy-category="'+legacyCategory+'"]').focus({preventScroll:true});return;}
  if(button.dataset.repeatCraft){const stop=state.run.manualRepeat===button.dataset.repeatCraft,result=editStoredManualRepeat(localStorage,state,{stop,isOwner:()=>session.owned});if(result.ok||result.stopped){state=result.state;refreshCatalog();lastTick=performance.now();render();toast(!result.ok?result.reason:stop?'連続製作を停止しました。':'材料が尽きるまで鉄を連続製作します。');}else toast(result.reason);return;}
  if(button.dataset.villageCategory){villageFilter=button.dataset.villageCategory;saveUiPreference(localStorage,'loopkeeper-village-category-v1',villageFilter);render();document.querySelector('[data-village-category="'+villageFilter+'"]')?.focus({preventScroll:true});return;}
  if(button.dataset.craftCategory){selectedSkill=null;craftFilter=button.dataset.craftCategory;saveUiPreference(localStorage,'loopkeeper-craft-category-v1',craftFilter);render();document.querySelector('[data-craft-category="'+craftFilter+'"]').focus({preventScroll:true});return;}
  if(button.dataset.accessorySource){for(const dialog of document.querySelectorAll('dialog[open]:not(#expanded-work-dialog)'))dialog.close();tab='craft';selectedSkill='smithing';craftFilter='accessory';saveUiPreference(localStorage,'loopkeeper-craft-category-v1',craftFilter);render();return;}
  if(button.dataset.buildSave||button.dataset.buildUpdate||button.dataset.buildDelete){const type=button.dataset.buildSave?'save':button.dataset.buildUpdate?'update':'delete',id=Number(button.dataset.buildUpdate||button.dataset.buildDelete)||null,name=document.querySelector('[data-build-name]')?.value||'';const r=editStoredBuild(localStorage,state,{type,id,name},{isOwner:()=>session.owned});if(r.ok){state=r.state;refreshCatalog();render();toast(type==='delete'?'この保存構成を削除しました。':'名前付き構成を保存しました。');}else toast(r.reason);return;}
  if(button.dataset.buildRestore){buildProposal=proposeBuildRestore(state,Number(button.dataset.buildRestore),RECIPES);if(!buildProposal.ok){toast(buildProposal.reason);return;}buildRestoreDialog.innerHTML=buildRestoreMarkup(state,buildProposal);buildRestoreDialog.showModal();return;}
  if(button.dataset.buildConfirm){const r=editStoredBuild(localStorage,state,{type:'restore',proposal:buildProposal},{isOwner:()=>session.owned});if(r.ok){state=r.state;buildRestoreDialog.close();refreshCatalog();render();toast(r.missing.length?'所有する構成だけ復元。未所持部位は維持しました。':'構成を復元して保存しました。');}else{buildRestoreDialog.querySelector('[data-build-error]').textContent=r.reason;toast(r.reason);}return;}
  if(button.dataset.trainBuild){const result=trainBuild(state),out=document.querySelector('#gear-training-result');if(out)out.textContent=result.ok?'WAVE '+result.wave+' ・ '+(result.won?'撃退':'未撃退')+' ・ '+result.seconds+'秒 ・ 本人 '+result.playerHits+'撃 / 会心 '+result.criticalHits+'回 ・ 本人ダメージ '+Math.round(result.playerDamage)+' / 反撃 '+Math.round(result.counterDamage)+' / 相棒追撃 '+Math.round(result.petDamage)+' ・ 相棒の軽減 '+Math.round(result.companion.turtlePrevented)+' / 魔法 '+Math.round(result.magicDamage)+' ・ 詠唱 '+result.magic.casts+' / 爆発 '+result.magic.detonations+' ・ 触媒 '+result.alchemySpent.catalyst+' / 護符液 '+result.alchemySpent.ward+'消費':result.reason;return;}
  if(button.dataset.buyRank||button.dataset.refundRank||button.dataset.toggleRank||button.dataset.resetRanks||button.dataset.cancelDraft){
    const key=button.dataset.buyRank||button.dataset.refundRank||button.dataset.toggleRank,type=button.dataset.cancelDraft?'cancel':button.dataset.resetRanks?'reset':button.dataset.buyRank?'buy':button.dataset.refundRank?'refund':'toggle';
    const result=editStoredLegacyRank(localStorage,state,{key,type},{isOwner:()=>session.owned});
    if(result.ok){state=result.state;refreshCatalog();saveFailed=false;toast(type==='refund'?'ランクの実支払額を返しました。':'継承の構成を保存しました。');}else toast(result.reason);
    render();return;
  }
  if (button.dataset.toggleUpgrade) {
    toggleUpgrade(state, button.dataset.toggleUpgrade);
    saveGame();
  }
  if (button.dataset.backup !== undefined) {
    const backup = readBackups(localStorage)[Number(button.dataset.backup)];
    const restored = backup && decodeRecord(backup.record);
    if (restored) importSaveText(serializeGame(restored));
    else toast("バックアップを読み込めません。");
  }
  if (button.dataset.queueMove !== undefined) {
    if(button.closest("#queue-preview"))queueRailMutation=true;
    const result = moveQueuedAction(
      state,
      Number(button.dataset.queueMove),
      Number(button.dataset.direction),
    );
    if (!result.ok) toast(result.reason);
    saveGame();
  }
  if (button.dataset.queueRemove !== undefined) {
    if(button.closest("#queue-preview"))queueRailMutation=true;
    const blocked = Boolean(queueIssue());
    markQueueEdited();
    const index = button.dataset.queueGoal !== undefined ? state.run.queue.findIndex(q => String(q.goalId) === button.dataset.queueGoal) : Number(button.dataset.queueRemove);
    const result = removeQueuedAction(state, index);
    if (!result.ok) toast(result.reason);
    else if (blocked) resumeSelectedWork();
    saveGame();
  }
  if (button.dataset.queueFix) {
    markQueueEdited();
    const result = recoverReservation(state, button.dataset.queueFix);
    if (!result.ok) toast(result.reason);
    else if (state.run.activeAction || state.run.queue.length) resumeSelectedWork();
    saveGame();
  }
  if (button.dataset.hideRecipe) {
    const recipe = RECIPES.find(
      (recipe) => recipe.id === button.dataset.hideRecipe,
    );
    if (
      (recipe?.equipment || recipe?.facility) &&
      !getRecipeVisibility(state, recipe).inProgress
    ) {
      state.settings.hiddenRecipes = state.settings.hiddenRecipes.includes(
        recipe.id,
      )
        ? state.settings.hiddenRecipes.filter((id) => id !== recipe.id)
        : [...state.settings.hiddenRecipes, recipe.id];
      saveGame();
    }
  }
  if (button.dataset.queueWork) {
    const training=trainingMode(state,button.dataset.queueWork);
    const result = training?queueTraining(state,button.dataset.queueWork,craftQuantities[button.dataset.queueWork]??nextTrainingLevel(state,button.dataset.queueWork),button.dataset.queuePosition||"end"):queueWork(state, button.dataset.queueWork, craftQuantities[button.dataset.queueWork] ?? 1, button.dataset.queuePosition || "end");
    if (!result.ok) toast(result.reason);
    else if(result.skipped)toast("この命の目標レベルに到達済みのため、予約を省略しました。");
    else { resumeSelectedWork(); toast("行動を予約しました。"); }
    saveGame();
  }
  if(button.dataset.useMeal){const result=useMeal(state,button.dataset.useMeal);toast(result.ok?'料理を1食使いました。効果は1種類で、重ねても強さは増えません。':result.reason);saveGame();}
  if (button.dataset.smartCraft) {
    const result = queueCraft(state, button.dataset.smartCraft, button.dataset.queuePosition || "end", craftQuantities[button.dataset.smartCraft] ?? 1);
    const resumed = result.ok && resumeSelectedWork();
    toast(
      !result.ok
        ? result.reason
        : result.moved
          ? "予約を先頭へ移しました。"
          : resumed
          ? "材料集めから完成まで予約し、作業を開始しました。"
          : getAugmentStatus(state).offer.length
            ? "予約しました。先にオーグメントを選んでください。"
            : queueIssue()?.reason || "予約しました。戦闘後に実行します。",
    );
    saveGame();
  }
  if (button.dataset.marketSide) {
    marketSide = button.dataset.marketSide;saveUiPreference(localStorage,"loopkeeper-market-side-v1",marketSide);
  }
  if(button.dataset.merchantTrade){const r=editStoredMerchant(localStorage,state,{id:button.dataset.merchantTrade,side:marketSide,count:marketCount,visit:Number(button.dataset.merchantVisit)},{isOwner:()=>session.owned});if(r.ok){state=r.state;refreshCatalog();toast(r.count+'個取引しました。');}else toast(r.reason);render();return;}
  if (button.dataset.tradeResource) {
    const result = tradeResource(state, button.dataset.tradeResource, marketSide, marketCount);
    toast(result.ok ? `${result.count}個${marketSide === 'sell' ? '売却' : '購入'}しました。` : result.reason);
    saveGame();
  }
  if (button.dataset.buySupply) {
    const result = buySupply(state, button.dataset.buySupply);
    toast(result.ok ? "交易が成立しました。" : result.reason);
    saveGame();
  }
  if(button.dataset.gatherView){const result=saveGatherView(localStorage,button.dataset.gatherView);if(result.ok){gatherView=result.view;gatherTried=result.tried;}else toast("表示設定を保存できませんでした。現在の表示を保持します。");}
  if(button.dataset.gatherDetail){const id=button.dataset.gatherDetail,card=document.querySelector('[data-action="'+CSS.escape(id)+'"]')?.closest(".gather-card"),action=ACTIONS.find(a=>a.id===id);if(card && action){gatherDetailId=id;state.settings.paused=true;gatherDetailDialog.innerHTML='<div class="dialog-heading"><h2 id="gather-detail-title">'+escape(action.name)+'</h2><button class="icon-button" data-close="gather-detail-dialog" aria-label="閉じる">×</button></div>'+card.querySelector(".action-summary").innerHTML+card.querySelector(".action-details").innerHTML+(card.querySelector(".gather-reservation")?.outerHTML || "");gatherDetailDialog.showModal();}}
  if (button.dataset.action) {
    const result = selectManualAction(state, button.dataset.action);
    if (!result.ok) toast(result.reason);
    else if (!resumeSelectedWork())
      toast("作業を選択しました。先にオーグメントを選んでください。");
    saveGame();
  }
  if(button.dataset.bagCategory){bagCategory=button.dataset.bagCategory;bagResetScroll=true;render();document.querySelector('[data-bag-category="'+bagCategory+'"]').focus({preventScroll:true});return;}
  if(button.dataset.queueResume){if(!session.owned)return;if(state.settings.disabledUpgrades.includes('action_queue'))toggleUpgrade(state,'action_queue');if(resumeSelectedWork()){manualPauseReason='';queueStopDialog.close();if(infoDialog.open)infoDialog.close();}else toast(queueIssue()?.reason||'準備を確認してください。');saveGame();render();return;}
  if(button.dataset.gameSpeedChoice){const r=setGameSpeed(state,button.dataset.gameSpeedChoice);if(!r.ok)toast(r.reason);else saveGame();render();return;}
  if(button.dataset.info){if(button.dataset.info==='queue-stop'){openQueueStop(button);return;}openInformation(button.dataset.info,button);return;}
  if (button.dataset.close)
    document.getElementById(button.dataset.close).close();
  switch (button.dataset.command) {
    case 'gather-display-guide':state.settings.paused=true;renderGatherGuide();gatherGuideDialog.showModal();break;
    case 'material-priority-menu': {
      const result=prepareMaterialPriority(state);
      if (!result.ok) { toast(result.reason); break; }
      materialPriorityProposal=result.proposal;
      materialPriorityOpener=button;
      state.settings.paused=true;
      setHTML('#material-priority-dialog',materialPriorityMarkup(state,result.proposal));
      materialPriorityDialog.showModal();
      materialPriorityDialog.scrollTop=0;
      break;
    }
    case 'material-priority-apply': {
      if (!materialPriorityDialog.open || !materialPriorityProposal) break;
      const result=commitMaterialPriority(localStorage,state,materialPriorityProposal,{isOwner:()=>session.owned});
      if (!result.ok) {materialPriorityProposal.error=result.reason;render();setTimeout(()=>materialPriorityDialog.querySelector('[data-priority-error]')?.focus(),0);break;}
      state=result.state;
      savedAt=new Date();saveFailed=false;loadWarning='';
      materialPriorityDialog.close();
      toast(result.changed===false ? '優先順の変更はありません。' : '素材の優先順を保存しました。');
      break;
    }
    case "takeover":
      session.takeover().then((acquired) => {
        if (!acquired) toast("他のタブを閉じて再度お試しください。");
        render();
      });
      break;
    case "confirm-run": {
      const r = confirmStoredRun(localStorage,state,{isOwner:()=>session.owned,earlyLoopPrototype:true,lateLoopPrototype:true,preparationBalancePrototype:true});
      if (!r.ok) {toast(r.reason);const error=document.querySelector("[data-setup-save-error]");if(error)error.textContent=r.reason;}
      else {
        state=r.state;savedAt=new Date();saveFailed=false;loadWarning="";
        document.querySelector("#death-dialog").close();
        deadShown = false;

      }
      break;
    }
    case "template-save": {
      const r = saveTemplate(
        state,
        document.querySelector("#template-name").value,
      );
      if (!r.ok) toast(r.reason);
      saveGame();
      break;
    }
    case "template-overwrite-confirm": {
      if (!templateOverwriteDialog.open || !templateOverwriteProposal) break;
      const result = commitTemplateOverwrite(localStorage, state, templateOverwriteProposal, { isOwner: () => session.owned });
      if (!result.ok) { toast(result.reason); break; }
      state = result.state;
      templateOverwriteDialog.close();
      savedAt = new Date();
      saveFailed = false;
      loadWarning = "";
      toast(`「${result.name}」を現在の予約で上書きしました。`);
      break;
    }
    case "stock-add": {
      const r = setStockTarget(
        state,
        document.querySelector("#stock-resource").value,
        Number(document.querySelector("#stock-quantity").value),
      );
      if (!r.ok) toast(r.reason);
      saveGame();
      break;
    }
    case "migrate-now":
      if (
        confirm(
          "現在の資源・装備をリセットし、継承して新しい周を準備します。続けますか？",
        )
      ) {
        saveGame(false, true);
        restartRun(state);
        refreshCatalog();
        document.querySelector("#save-dialog").close();
        saveGame();
      }
      break;
    case "confirm-exclude-augment": {
      const result=editStoredAugment(localStorage,state,{type:'exclude',id:pendingAugmentExclude},{isOwner:()=>session.owned});
      if(!result.ok)document.querySelector('[data-exclusion-error]').textContent=result.reason;
      else{state=result.state;augmentSaveError='';pendingAugmentExclude=null;document.querySelector('#augment-exclude-dialog').close();savedAt=new Date();saveFailed=false;}
      lastTick=performance.now();break;
    }
    case "reroll-augments": {
      const result = editStoredAugment(localStorage,state,{type:'reroll'},{isOwner:()=>session.owned});
      if(!result.ok){augmentSaveError=result.reason;lastTick=performance.now();break;}
      state=result.state;augmentSaveError='';savedAt=new Date();saveFailed=false;
      if (!result.ok) toast(result.reason);
      else toast("オーグメント候補を引き直しました。");
      lastTick = performance.now();
      break;
    }
    case "show-augments":
      if (getAugmentStatus(state).offer.length && !document.querySelector("dialog[open]:not(#expanded-work-dialog)")) {
        setHTML("#augment-dialog", renderAugments(state, { offer: true }));
        document.querySelector("#augment-dialog").showModal();
      }
      break;
    case "share-first-frontier-clear":
      if (state.meta.firstFrontierClear) saveClearCard({...state,run:{...state.run,clearRecord:state.meta.firstFrontierClear}}).catch(error => toast(error.message));
      break;
    case "share-first-extended-clear":
      if (state.meta.firstExtendedClear) saveClearCard({...state,run:{...state.run,clearRecord:state.meta.firstExtendedClear}}).catch(error => toast(error.message));
      break;
    case "share-first-clear":
      if (state.meta.firstClear) saveClearCard({...state,run:{...state.run,clearRecord:state.meta.firstClear}}).catch(error => toast(error.message));
      break;
    case "share-endless":
      saveClearCard(state, true).catch(error => toast(error.message));
      break;
    case "share-clear":
      saveClearCard(state).catch(error => toast(error.message));
      break;
    case "expand-work":
      if(!wideWorkLayout.matches)expandedPane.open(button);
      break;
    case "pause":
      if (
        !["dead", "cleared", "legacy_setup"].includes(state.run.status) &&
        !getAugmentStatus(state).offer.length
      ) {
        state.settings.paused = !state.settings.paused;
        manualPauseReason=state.settings.paused?"手動で一時停止しています。":"";
        if (!isLegacy(state)) state.run.idleWait = !state.settings.paused && state.run.status==="preparing" && !state.run.activeAction && !state.run.queue.length && !state.run.automationOnly;
        lastTick = performance.now();
        saveGame();
      }
      break;
    case "acceleration": {
      const wasActive=getAccelerationStatus(state).active,pausedBefore=headerMenuDialog.open?(overlayPause.get(headerMenuDialog)??state.settings.paused):state.settings.paused;
      const result = wasActive
        ? stopAcceleration(state)
        : startAcceleration(state);
      if (!result.ok) toast(result.reason);
      if(result.ok&&wasActive&&headerMenuDialog.open)state.settings.paused=pausedBefore;
      if(result.ok&&!wasActive&&state.settings.paused)toast("加速を設定しました。行動を選ぶと進みます。");
      lastTick = performance.now();
      if(headerMenuDialog.open){overlayPause.set(headerMenuDialog,state.settings.paused);headerMenuDialog.close();}
      saveGame();
      break;
    }
    case "toggle-hidden-recipes":
      state.settings.showHiddenRecipes = !state.settings.showHiddenRecipes;
      saveGame();
      break;
    case "stop":
      manualPauseReason="作業を中断しました。";
      stopAction(state);
      if (!state.run.activeAction && state.run.status === "preparing")
        state.settings.paused = true;
      saveGame();
      break;
    case "help":
      showHelp();
      break;
    case "processing-start":
    case "auto-cook-start":
      if (state.run.status === "preparing" && !queueIssue() && !getAugmentStatus(state).offer.length && !temporaryDialogs.some(dialog=>dialog.open)) {
        state.settings.paused = false;
        state.run.idleWait=false;state.run.automationOnly=true;
        lastTick = performance.now();
      }
      break;
    case "header-menu":
      showCampDialog(headerMenuDialog,button);
      document.querySelector(".mobile-menu-toggle").setAttribute("aria-expanded", "true");
      render();
      break;
    case "updates-menu": {
      state.settings.paused = true;
      const dialog = document.querySelector("#updates-dialog");
      dialog.innerHTML = changelogMarkup();
      dialog.showModal();
      dialog.scrollTop = 0;
      render();
      break;
    }
    case "settings-menu":
      showSettingsMenu();
      break;
    case "save-menu":
      showSaveMenu();
      break;
    case "export-original": {
      const raw = unreadableRecord(localStorage);
      if (raw) downloadText(raw, "loopkeeper-unreadable.json");
      break;
    }
    case "save-now":
      saveGame(true);
      toast(
        saveFailed
          ? "保存できませんでした。データを書き出してください。"
          : "旅の記録を保存しました。",
      );
      break;
    case "export":
      exportSave();
      break;
    case "import":
      document.querySelector("#import-input").click();
      break;
    case "code-export": {
      const input = document.querySelector("#save-code");
      input.value = serializeGame(state);
      input.focus();
      input.select();
      break;
    }
    case "code-import":
      importSaveText(document.querySelector("#save-code").value);
      break;
    case "queue-expand":
      queueExpanded = !queueExpanded;
      break;
    case "queue-add":
    case "queue-add-front": {
      const result = trainingMode(state,queueDraftId)?queueTraining(state,queueDraftId,queueDraftCount,button.dataset.command === "queue-add-front" ? "front" : "end"):queueAction(state, queueDraftId, singleUse(queueDraftId) ? 1 : queueDraftCount, button.dataset.command === "queue-add-front" ? "front" : "end");
      if (!result.ok) toast(result.reason);
      else if(result.skipped)toast("この命の目標レベルに到達済みのため、予約を省略しました。");
      saveGame();
      break;
    }
    case "queue-condition-add": {
      if (!isLegacy(state)) {
        const request = conditionalRequest();
        const result = enqueueConditional(state, request.id, request.until);
        toast(result.ok ? "条件付きの行動予約を追加しました。" : result.reason);
        saveGame();
      }
      break;
    }
    case "queue-clear":
      markQueueEdited();
      clearQueue(state);
      saveGame();
      break;
    case "aid-country": {
      const result = aidCountry(state);
      toast(
        result.ok
          ? "援助が届きました。この周回は交易収入を得られます。"
          : result.reason,
      );
      saveGame();
      break;
    }
    case "refuse-country": {
      const result = refuseCountry(state);
      toast(
        result.ok
          ? "援助を断りました。サフラ軍が次の襲撃に加勢します。"
          : result.reason,
      );
      saveGame();
      break;
    }
    case "reset-menu": {
      const dialog = document.querySelector("#reset-dialog");
      delete dialog.dataset.restore;
      dialog.innerHTML = `<div class="dialog-heading"><h2 id="reset-title">第1世代からやり直しますか？</h2><button class="icon-button" data-close="reset-dialog" aria-label="閉じる">${icon("close")}</button></div><p class="dialog-lead">第${state.meta.generation}世代の進行・永続レベル・継承ポイント・解放・初達成・クリア記録をすべて初期化します。</p><p class="fine-print">解除済みのリプレイ実績と音量・演出の設定は残ります。現在の挑戦は直近1回分を保存メニューから復元できます。</p><label class="reset-ack"><input type="checkbox" id="replay-reset-ack"> 進行を初期化して第1世代から始めることを確認しました</label><div class="save-options"><button class="button muted" data-close="reset-dialog">キャンセル</button><button class="button gold" data-command="reset-confirm" disabled>新しい挑戦を始める</button></div>`;
      state.settings.paused = true;
      dialog.showModal();
      break;
    }
    case "reset-confirm": {
      if (!document.querySelector("#reset-dialog").open || document.querySelector("#reset-dialog").dataset.restore) break;
      if(!document.querySelector('#replay-reset-ack')?.checked)break;
      try {
        state = resetStoredGame(localStorage, state);
      } catch {
        toast("保存できないため、リセットを中止しました。現在の進行は残っています。");
        break;
      }
      activeBattle = null;
      deadShown = setupShown = false;
      displayedOffer = "";
      queueExpanded = false;
      queueDraftId = "chop_wood";
      queueDraftCount = 1;
      tab = "gather";
      selectedSkill = null;
      craftFilter = "all";
      for (const key of Object.keys(craftQuantities)) delete craftQuantities[key];
      delete document.querySelector("#death-dialog").dataset.setup;
      refreshCatalog();
      markQueueEdited();
      loadWarning = "";
      saveFailed = false;
      savedAt = new Date();
      lastTick = performance.now();
      for (const dialog of document.querySelectorAll("dialog[open]")) dialog.close();
      toast("第1世代から新しい挑戦を始めます。");
      break;
    }
    case "restore-reset": {
      const previous = readResetBackup(localStorage);
      if (!previous) { toast("リセット前の記録を読み込めません。"); break; }
      const dialog = document.querySelector("#reset-dialog");
      dialog.dataset.restore = "true";
      dialog.innerHTML = `<div class="dialog-heading"><h2 id="reset-title">リセット前の記録へ戻しますか？</h2><button class="icon-button" data-close="reset-dialog" aria-label="閉じる">${icon("close")}</button></div><p class="dialog-lead">第${previous.meta.generation}世代・最高${previous.meta.bestWave}波の記録を復元します。現在の進行は通常のバックアップに残ります。</p><div class="save-options"><button class="button muted" data-close="reset-dialog">キャンセル</button><button class="button gold" data-command="restore-reset-confirm">記録を復元する</button></div>`;
      dialog.showModal();
      break;
    }
    case "restore-reset-confirm": {
      if (!document.querySelector("#reset-dialog").open || !document.querySelector("#reset-dialog").dataset.restore) break;
      try {
        const previous = readResetBackup(localStorage);
        if (!previous) throw Error("Missing backup");
        previous.settings.paused = true;
        writeStoredGame(localStorage, state, { checkpoint: true });
        writeStoredGame(localStorage, previous);
        state = previous;
      } catch {
        toast("復元できませんでした。現在の進行は残っています。");
        break;
      }
      activeBattle = null;
      deadShown = setupShown = false;
      displayedOffer = "";
      delete document.querySelector("#death-dialog").dataset.setup;
      refreshCatalog();
      markQueueEdited();
      savedAt = new Date();
      loadWarning = "";
      saveFailed = false;
      lastTick = performance.now();
      for (const dialog of document.querySelectorAll("dialog[open]")) dialog.close();
      toast("リセット前の記録を復元しました。");
      break;
    }
    case "show-clear-results": {
      if(isFrontierFinish(state))showDeath();
      break;
    }
    case "start-endless": {
      saveGame(false, true);
      const result = startEndless(state);
      if (!result.ok) { toast(result.reason); break; }
      deadShown = setupShown = false;
      displayedOffer = "";
      activeBattle = null;
      refreshCatalog();
      document.querySelector("#death-dialog").close();
      tab = "village";
      lastTick = performance.now();
      saveGame();
      toast("エンドレス開始。施設Vから追加強化できます。");
      break;
    }
    case "abandon-menu":
      if (!["preparing", "combat"].includes(state.run.status)) {toast("進行中の周回だけ切り上げられます。");break;}
      state.settings.paused = true;
      abandonDialog.showModal();
      break;
    case "abandon-confirm": {
      if (!abandonDialog.open) break;
      saveGame(false, true);
      const result = abandonRun(state);
      if (!result.ok) {toast(result.reason);break;}
      activeBattle = null;
      deadShown = false;
      displayedOffer = "";
      refreshCatalog();
      for (const dialog of document.querySelectorAll("dialog[open]")) dialog.close();
      delete document.querySelector("#death-dialog").dataset.setup;
      tab = "gather";
      selectedSkill = null;
      lastTick = performance.now();
      saveGame();
      break;
    }
    case "rebirth":
      saveGame(false, true);
      restartRun(state);
      refreshCatalog();
      deadShown = false;
      tab = "gather";
      selectedSkill = null;
      document.querySelector("#death-dialog").close();
      saveGame();
      toast(
        `第 ${state.meta.generation} 世代。受け継いだ記憶と、新たな一歩を。`,
      );
      break;
  }
  if (temporaryDialogs.some(dialog => dialog.open)) state.settings.paused = true;
  render();
  if (
    (button.dataset.tab || button.dataset.skill) &&
    window.matchMedia("(max-width: 690px)").matches
  ) {
    const workArea = document.querySelector(".work-area");
    workArea.style.scrollMarginTop = `${document.querySelector("#prep-status").getBoundingClientRect().height + 12}px`;
    document.querySelector("#content").scrollTop = 0;
  }
  if (button.dataset.hideRecipe && !document.contains(button))
    document.querySelector('[data-focus="hidden-filter"]')?.focus();
});

const queuedNumberDrafts=new WeakMap();
function queuedNumberContext(input){if(!queuedNumberDrafts.has(input))queuedNumberDrafts.set(input,captureQueuedNumberEdit(state,input));return queuedNumberDrafts.get(input);}
function applyQueuedNumberInput(input){const draft=queuedNumberContext(input),index=queuedNumberEditIndex(state,draft);if(index<0){toast('予約が変わりました。現在の予約を確認してください。');return false;}if(input.value===draft.displayedValue||queuedNumberEditValue(state,draft)===input.valueAsNumber)return true;const result=input.dataset.queueTrainingLevel!==undefined?editQueuedTrainingLevel(state,index,input.valueAsNumber):editQueuedAction(state,index,input.valueAsNumber);if(!result.ok)toast(result.reason);else {queuedNumberDrafts.set(input,captureQueuedNumberEdit(state,input));saveGame();}return result.ok;}
document.addEventListener('focusin',event=>{if(isQueuedNumberInput(event.target))queuedNumberDrafts.set(event.target,captureQueuedNumberEdit(state,event.target));});
document.addEventListener('keydown',event=>{const input=event.target;if(!session.owned||!isQueuedNumberInput(input)||event.isComposing||event.keyCode===229)return;
 if(event.key==='Escape'&&restoreQueuedNumberEdit(state,input,queuedNumberContext(input))){event.preventDefault();event.stopPropagation();validateReservationInput(input);}
 if(event.key==='Enter'){event.preventDefault();event.stopPropagation();if(validateReservationInput(input)){applyQueuedNumberInput(input);input.blur();render();}else toast(reservationInputError(input));}
},true);
document.addEventListener("input", (event) => {
  if (!session.owned) return;
  validateReservationInput(event.target);
  updateConditionDraft(event.target);
  if (event.target.dataset.target && Number.isInteger(event.target.valueAsNumber) && event.target.valueAsNumber >= 0 && event.target.valueAsNumber <= 9999) {
    state.settings[event.target.dataset.target] = event.target.valueAsNumber;
    saveGame();
  }
  if (event.target.dataset.craftCount !== undefined)
    craftQuantities[event.target.dataset.craftCount] = event.target.valueAsNumber;
  if (event.target.id === "queue-count")
    queueDraftCount = event.target.valueAsNumber;
});

document.addEventListener("change", (event) => {
  if(event.target.id==="replay-reset-ack"){document.querySelector('[data-command="reset-confirm"]').disabled=!event.target.checked;return;}
  if(event.target.hasAttribute?.('data-inheritance-branch')){committedSelect=event.target;inheritanceMapUI.handleChange(event.target);return;}
  if (!session.owned) return;
  if (!validateReservationInput(event.target)) {
    toast(reservationInputError(event.target));
    return;
  }
  if (event.target.matches('select')) committedSelect = event.target;
  if(event.target.dataset.queueTrainingLevel!==undefined){applyQueuedNumberInput(event.target);render();}
  if (event.target.dataset.priorityChoice !== undefined && materialPriorityProposal) { materialPriorityProposal.choice=event.target.value; render(); }
  if (event.target.dataset.craftCount !== undefined) {
    render();
  }
  if (event.target.id === "craft-filter") {
    selectedSkill=null;craftFilter = event.target.value;
    render();
  }
  if(event.target.hasAttribute('data-enchantment')){const r=editStoredMagic(localStorage,state,{type:'enchantment',id:event.target.value},{isOwner:()=>session.owned});if(r.ok){state=r.state;refreshCatalog();}else toast(r.reason);render();return;}
  if (event.target.dataset.worker) {
    const r = configureWorker(
      state,
      event.target.dataset.worker,
      event.target.value,
    );
    if (!r.ok) toast(r.reason);
    saveGame();
    render();
  }
  if (event.target.dataset.target) {
    const n = event.target.valueAsNumber;
    if (Number.isInteger(n) && n >= 0 && n <= 9999)
      state.settings[event.target.dataset.target] = n;
    saveGame();
  }
  if (event.target.dataset.stock) {
    setStockTarget(
      state,
      event.target.dataset.stock,
      Number(event.target.value),
    );
    saveGame();
    render();
  }
  if (event.target.dataset.queueCount !== undefined) { applyQueuedNumberInput(event.target); render(); }
  if (event.target.id === "market-count") {
    marketCount = event.target.value === 'all' ? 'all' : Number(event.target.value);saveUiPreference(localStorage,'loopkeeper-market-count-v1',String(marketCount));
    render();
  }
  if (event.target.id === "music-volume") {
    state.settings.musicVolume = Number(event.target.value);
    unlockAudio(state.settings);
    saveGame();
  }
  if (event.target.id === "ambient-volume") {
    state.settings.ambientVolume = Number(event.target.value);
    unlockAudio(state.settings);
    saveGame();
  }
  if (event.target.id === "sound-volume") {
    state.settings.soundVolume = Number(event.target.value);
    previewSound(state.settings);
    saveGame();
  }
  if (event.target.id === "pause-when-hidden") {
    state.settings.pauseWhenHidden = event.target.checked;
    saveGame();
  }
  if (event.target.id === "effects-enabled") {
    state.settings.effectsEnabled = event.target.checked;
    saveGame();
    render();
  }
  if (updateConditionDraft(event.target)) { render(); }
  if (event.target.id === "queue-action") {
    queueDraftId = event.target.value;
    queueDraftCount = trainingMode(state,queueDraftId)?nextTrainingLevel(state,queueDraftId):1;
    render();
  }
  if (event.target.dataset.craftCount !== undefined && Number.isInteger(event.target.valueAsNumber) && event.target.valueAsNumber >= (event.target.dataset.trainingLevel!==undefined?2:1) && event.target.valueAsNumber <= (event.target.dataset.trainingLevel!==undefined?100:99))
    craftQuantities[event.target.dataset.craftCount] = event.target.valueAsNumber;
  if (event.target.id === "queue-count")
    queueDraftCount = event.target.valueAsNumber;
});

function downloadText(text, filename) {
  const url = URL.createObjectURL(
    new Blob([text], { type: "application/json" }),
  );
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function exportSave() {
  downloadText(
    serializeGame(state),
    `loopkeeper-generation-${state.meta.generation}-${new Date().toISOString().replace(/[:.]/g, "-")}.json`,
  );
  toast("旅の記録を書き出しました。");
}

document
  .querySelector("#import-input")
  .addEventListener("change", async (event) => {
    const file = event.target.files[0];
    event.target.value = "";
    if (!file) return;
    if (file.size > 1_000_000) {
      toast("このファイルは大きすぎます。正しいセーブデータを選んでください。");
      return;
    }
    try {
      importSaveText(await file.text());
    } catch {
      toast("ファイルを読み込めませんでした。現在の記録は変更していません。");
    }
  });

function importSaveText(text) {
  // File reads are asynchronous; another tab may have taken over meanwhile.
  if (!session.owned) {
    toast("別のタブでプレイ中です。このタブで続けてから読み込んでください。");
    return;
  }
  const imported = parseSave(text);
  if (!imported) {
    toast("読み込めないセーブデータです。現在の記録は変更していません。");
    return;
  }
  try {
    state = replaceStoredGame(localStorage, state, imported);
  } catch {
    toast("保存できないため、読み込みを中止しました。現在の進行は残っています。");
    return;
  }
  activeBattle = null;
  refreshCatalog();
  deadShown = setupShown = false;
  displayedOffer = "";
  delete document.querySelector("#death-dialog").dataset.setup;
  markQueueEdited();
  lastTick = performance.now();
  savedAt = new Date();
  saveFailed = false;
  loadWarning = "";
  document.querySelector("#save-dialog").close();
  render();
  toast(`第 ${state.meta.generation} 世代の記録を読み込みました。`);
}

function resumeAfterDialogClose(event) {
  const dialog=event?.currentTarget;
  if(dialog?._campHandoff){dialog._campHandoff=false;overlayPause.delete(dialog);return;}
  if(dialog&&overlayPause.has(dialog)){const pausedBefore=overlayPause.get(dialog);overlayPause.delete(dialog);if(pausedBefore){render();return;}}

  if (queueIssue()) { state.settings.paused = true; render(); return; }
  const queued = state.run.queue.length > 0 && hasUpgrade(state,"action_queue") && !state.settings.disabledUpgrades.includes("action_queue");
  if (!session.owned || document.hidden || document.querySelector("dialog[open]:not(#expanded-work-dialog)") || !["preparing", "combat"].includes(state.run.status) || getAugmentStatus(state).offer.length || (state.run.status === "preparing" && !state.run.activeAction && !queued && !["wait","automation"].includes(getClockStatus(state).kind))) return;
  state.settings.paused = false;
  lastTick = performance.now();
  saveGame();
  render();
}
window.addEventListener("storage",event=>{if(event.key===GATHER_VIEW_KEY){gatherView=readGatherView(localStorage);gatherTried=readGatherPreference(localStorage).tried;render();}});
const temporaryDialogs = [earlyRaidDialog,document.querySelector("#augment-exclude-dialog"),buildRestoreDialog,gatherGuideDialog,gatherDetailDialog,materialPriorityDialog, templateOverwriteDialog, document.querySelector("#reset-dialog"), abandonDialog, headerMenuDialog, document.querySelector("#updates-dialog"), document.querySelector("#settings-dialog"), infoDialog, document.querySelector("#save-dialog"), document.querySelector("#help-dialog"), document.querySelector("#augment-dialog")];
let queueDragPaused = true;
let draggedQueue = null;
installQueueDrag({
  document, window,
  onStart() {
    queueDragPaused = state.settings.paused;
    draggedQueue = [...state.run.queue];
    state.settings.paused = true;
    lastTick = performance.now();
  },
  onDrop(from, to) {
    // A takeover or imported save must never reorder a different queue.
    if (!session.owned || draggedQueue.length !== state.run.queue.length || draggedQueue.some((entry, i) => entry !== state.run.queue[i])) return;
    markQueueEdited();
    const direction = to > from ? 1 : -1;
    for (let i = from; i !== to; i += direction) {
      const result = moveQueuedAction(state, i, direction);
      if (!result.ok) { toast(result.reason); return; }
    }
    queueRailMutation=true;
    toast("行動予約の順番を変更しました。");
  },
  onEnd() {
    draggedQueue = null;
    if (!queueDragPaused && session.owned && !document.hidden && !temporaryDialogs.some(dialog => dialog.open) && ["preparing", "combat"].includes(state.run.status) && !getAugmentStatus(state).offer.length && !queueIssue()) state.settings.paused = false;
    lastTick = performance.now();
    saveGame();
    render();
  },
});
for (const dialog of temporaryDialogs) {
  dialog.addEventListener("close",()=>queueMicrotask(()=>{if(!wideWorkLayout.matches||document.querySelector("dialog[open]"))return;const active=document.activeElement;if(!active||active===document.body||!active.getBoundingClientRect().width)document.querySelector('#navigation [data-tab="'+tab+'"]')?.focus({preventScroll:true});}));
  dialog.addEventListener("close", resumeAfterDialogClose);
  if([infoDialog,headerMenuDialog].includes(dialog))continue;
  let pressedOutside = false;
  const outside = event => {
    const rect = dialog.getBoundingClientRect();
    return event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom);
  };
  dialog.addEventListener("pointerdown", event => { pressedOutside = outside(event); });
  dialog.addEventListener("click", event => {
    if (pressedOutside && outside(event)) dialog.close();
    pressedOutside = false;
  });
}

document
  .querySelector("#death-dialog")
  .addEventListener("cancel", (event) => event.preventDefault());
document.querySelector("#battle-dialog").addEventListener("cancel", (event) => {
  event.preventDefault();
  state.settings.paused = true;
  lastTick = performance.now();
  saveGame();
  render();
});
installReservationKeyboard({ document, onInvalid: toast });
document.addEventListener("keydown", (event) => {
  if (!event.repeat) unlockAudio(state.settings);
  if (
    event.code !== "Space" ||
    event.repeat ||
    document.querySelector("dialog[open]:not(#battle-dialog)") ||
    ["INPUT", "TEXTAREA", "BUTTON", "A", "SELECT", "SUMMARY"].includes(
      document.activeElement?.tagName,
    )
  )
    return;
  event.preventDefault();
  if (getAugmentStatus(state).offer.length) {
    toast("まず、この命のオーグメントを選びましょう。");
    return;
  }
  if (
    session.owned &&
    !["dead", "cleared", "legacy_setup"].includes(state.run.status)
  ) {
    state.settings.paused = !state.settings.paused;
    lastTick = performance.now();
    render();
  }
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    if (state.settings.pauseWhenHidden) state.settings.paused = true;
    saveGame();
  }
  scheduleFrame();
  if (!document.hidden) render();
});
window.addEventListener("blur", () => {
  if (state.settings.pauseWhenHidden) {
    state.settings.paused = true;
    saveGame();
  }
});
function updateLiveWork() {
  for(const portrait of document.querySelectorAll?.('[data-work-portrait]')||[])syncWorkAnimation(portrait,null,{animate:false});
  const action = state.run.activeAction;
  const bar = document.querySelector("[data-live-work]");
  const label = document.querySelector("[data-work-time]");
  if (!bar) return;
  syncWorkAnimation(document.querySelector(".work-vignette"), action, {animate:state.settings.effectsEnabled && !state.settings.paused && state.run.status === "preparing"});
  const completion = action && state.run.status !== "dead" ? progress(action.progress / action.duration) : 0;
  bar.style.width = `${completion}%`;
  const meter = bar.parentElement;
  if (meter?.getAttribute("role") === "progressbar") {
    const value = String(Math.round(completion));
    if (meter.getAttribute("aria-valuenow") !== value) meter.setAttribute("aria-valuenow", value);
  }
  if (label && action) setTextIfChanged(label, `${Math.min(action.progress, action.duration).toFixed(1)} / ${action.duration.toFixed(1)} 秒`);
}

let presentationFailed = false;
let lastFrameError = '';
function frameError(stage, error) {
  const optional = ['presentation','reward-baseline','rewards'].includes(stage);
  if (optional) presentationFailed = true;
  else state.settings.paused = true;
  const key = `${stage}:${error?.message}`;
  if (key === lastFrameError) return;
  lastFrameError = key;
  console.error(`Game frame (${stage})`, error);
  toast(optional ? '演出に問題が起きたため、演出を止めて作業を続けます。' : '処理に問題が起きたため一時停止しました。再開できない場合は記録を書き出してください。');
}
const backgroundClock = createBackgroundClock();
const rewardDisplay = createRewardDisplay(document);
let scheduledFrame = null;
function scheduleFrame() {
  if (scheduledFrame) {
    if (scheduledFrame.hidden) clearTimeout(scheduledFrame.id);
    else cancelAnimationFrame(scheduledFrame.id);
  }
  scheduledFrame = document.hidden
    ? {hidden:true, id:setTimeout(() => frame(performance.now()), 1000)}
    : {hidden:false, id:requestAnimationFrame(frame)};
}
function frame(now) {
  const elapsed = backgroundClock.take((now - lastTick) / 1000, {
    hidden:document.hidden, pauseWhenHidden:state.settings.pauseWhenHidden,
    blocked: foundationPending || !session.owned || temporaryDialogs.some(dialog => dialog.open) || state.settings.paused || !["preparing","combat"].includes(state.run.status),
  });
  lastTick = now;
  const presentationDue = !document.hidden && now - lastRender > 150;
  runFrameTasks([
    ['reward-baseline',()=>{if(!presentationFailed)rewardDisplay.bind(state,{owned:session.owned});}],
    ['advance', () => {
      if (session.owned && (!document.hidden || !state.settings.pauseWhenHidden) && !temporaryDialogs.some(dialog => dialog.open) && !state.settings.paused && state.run.status !== 'dead')
        withWorkCompletions(state, event => playCompletedWork(state, event, {owned:session.owned, live:backgroundClock.live}), () => advanceTime(state, elapsed));
    }],
    ['render', () => {
      if (presentationDue) {
        render();
        lastRender = now;
      }
    }],
    ['presentation', () => {
      if (presentationDue && !presentationFailed) updatePresentation(state);
    }],
    ['rewards',()=>{if(!presentationFailed)rewardDisplay.update(state,{owned:session.owned,hidden:document.hidden,catchup:backgroundClock.catchingUp});}],
    ['work', () => { if (!document.hidden) updateLiveWork(); }],
    ['save', () => {
      if (now - lastSave > 2000) {
        saveGame();
        lastSave = now;
      }
    }],
  ], frameError, scheduleFrame);
}
const channel =
  typeof BroadcastChannel === "function"
    ? new BroadcastChannel("tomori-session")
    : null;
const session = createSessionOwner({
  locks: navigator.locks,
  channel,
  onAcquire() {
    state = loadGame();augmentSaveError="";pendingAugmentExclude=null;
    const offline=settleFarmOffline(localStorage,state,{isOwner:()=>session.owned});state=offline.state;farmOfflinePending=!offline.ok;if(!offline.ok){loadWarning=offline.reason;foundationPending=true;state.settings.paused=true;refreshCatalog();lastTick=performance.now();return;}
    const migration=migrateStoredFoundation(localStorage,state,{isOwner:()=>session.owned});
    state=migration.state;foundationPending=!migration.ok;if(!migration.ok)loadWarning=migration.reason;
    refreshCatalog();
    state.settings.paused = true;
    deadShown = false;
    lastTick = performance.now();
  },
  onRelease() {
    expandedPane.close();
    if(state.settings.farmOffline&&!state.settings.paused){saveGame();state.settings.paused=true;}else{state.settings.paused=true;saveGame();}
  },
  onChange() {
    render();
  },
});
// Keep one exit path: onRelease saves an explicitly opted-in running life before
// pausing memory. A preceding pause/save would erase offline replay eligibility.
window.addEventListener("pagehide", () => session.relinquish());
session.acquire();
render();
if (loadWarning) toast(loadWarning);
scheduleFrame();

window.addEventListener("pageshow", (event) => {
  if (event.persisted) session.acquire();
});

document.addEventListener('change',event=>{const el=event.target;if(!session.owned)return;let result;if(el.matches('[data-game-speed]'))result=setGameSpeed(state,el.value);if(el.matches('[data-recovery-meal]'))result=setRecoveryMeal(state,el.value);if(el.matches('[data-meal-preference]'))result=setMealPreference(state,el.value);if(el.matches('[data-auto-cook-recipe]'))result=setAutoCookRecipe(state,el.value);if(result){if(!result.ok)toast(result.reason);saveGame();render();}});

// Remember only the explicit dismissal of this clear, never pause or change the run.
document.querySelector("#death-dialog").addEventListener("close",()=>{if(isFrontierFinish(state)){dismissFinish(localStorage,state);deadShown=true;render();document.querySelector('#time-controls [data-focus="clear-results"]')?.focus({preventScroll:true});}});
