import {encounterName} from './encounter-copy.js?v=0.6.140';
import {VERSION} from './version.js?v=0.6.140';
import {mountVillageDashboard,villageDashboardMarkup} from './village-dashboard.js?v=0.6.140';
let villageDashboard=null;
import {legacyDiplomacyMarkup,legacyDiplomacyNotice,legacyFacilitySummary} from './legacy-progress-copy.js?v=0.6.140';
import {legacyQueueUnlockMarkup} from './legacy-ui-copy.js?v=0.6.140';
import {reasonText} from './reason-copy.js?v=0.6.140';import {logText} from './log-copy.js?v=0.6.140';
import {queueStopReason,englishQueueStop} from './planning-en.js?v=0.6.140';
import {englishSurvivor,compactFacility,equipmentSlotName,campFacilityDescription,campPopulationCapacity} from './camp-details-en.js?v=0.6.140';
import {englishQueue,englishQueueRail,englishQueueUnlock} from './queue-en.js?v=0.6.140';
import {companionConfirmation} from './companion-copy.js?v=0.6.140';
import {englishHelp} from './help-copy.js?v=0.6.140';
import {campForecast} from './camp-copy.js?v=0.6.140';
import {clockText} from './clock-copy.js?v=0.6.140';
import {tradeReason} from './trade-copy.js?v=0.6.140';
import {deathLegacyMarkup,lastHitMarkup} from './death-copy.js?v=0.6.140';
import {upgradeName} from './unlock-copy.js?v=0.6.140';
import {entityText} from './entity-copy.js?v=0.6.140';
import {text as uiText,getUILocale,subscribeLocale,formatNumber,formatDate} from './i18n.js?v=0.6.140';
import {copySpan,languageControlMarkup} from './locale-controls.js?v=0.6.140';
import {titleText} from './title-copy.js?v=0.6.140';
import {refreshFrontierFinishCopy,isFrontierFinish,finishDismissed,dismissFinish,finishReturnMarkup,mountFrontierFinish,nextPermanentTargetsMarkup} from './frontier-finish.js?v=0.6.140';
import {NAV_SHORT,speedControls,queueContext,mountResponsiveControls} from './interface-controls.js?v=0.6.140';
import {preserveRenderScroll} from './render-scroll.js?v=0.6.140';
import{campHealthMarkup,formatHealth}from './camp-health.js?v=0.6.140';
import{merchantNotice}from './merchant-ui.js?v=0.6.140';
import{editStoredMerchant}from './merchant-storage.js?v=0.6.140';
import{VILLAGE_CATEGORIES,villageCategory,villageCategoriesMarkup,specialistWorkLink}from './village-navigation.js?v=0.6.140';
import {memberFor,partyWeapon}from './party.js?v=0.6.140';
import {skillVisible}from './new-skills.js?v=0.6.140';
import {allocatePopulation}from './settlement.js?v=0.6.140';
import {populationMarkup}from './settlement-ui.js?v=0.6.140';
import {setGameSpeed}from './game-speed.js?v=0.6.140';
import{canEarlyRaid}from './engine.js?v=0.6.140';
import{earlyRaidControl,earlyRaidToken,earlyRaidConfirmation}from './early-raid-ui.js?v=0.6.140';
import{editStoredEarlyRaid}from './early-raid-storage.js?v=0.6.140';
import{usefulGoalsMarkup}from './useful-goals.js?v=0.6.140';
import {mealMarkup}from './meal-ui.js?v=0.6.140';
import {getTotalFood,mealStatus,useMeal,setMealPreference,setRecoveryMeal,setAutoCookRecipe}from './engine.js?v=0.6.140';
import './decision-keyboard.js?v=0.6.140';
import {pixelFacilityProduct} from './pixel-product-art.js?v=0.6.140';
import {isQueuedNumberInput,captureQueuedNumberEdit,queuedNumberEditIndex,queuedNumberEditValue,restoreQueuedNumberEdit,preserveQueuedNumberEdit}from './queue-number-edit.js?v=0.6.140';
import { mountPixelCamp } from './pixel-camp-scene.js?v=0.6.140';
import {mountPhaserCamp}from './phaser-camp-scene.js?v=0.6.140';
import {trainingMode,nextTrainingLevel,trainingDraftTarget,trainingLevelEditor,trainingQueueEditor}from './training-queue-ui.js?v=0.6.140';
import {queueTraining}from './planner.js?v=0.6.140';
import {editQueuedTrainingLevel}from './engine.js?v=0.6.140';
import {raidEnemyStats}from './raid-info-ui.js?v=0.6.140';
import {stockMarkup}from './stock-ui.js?v=0.6.140';
import {inventoryMarkup,queueStopStatus,queueStopMarkup,createStopTransition,createQuestSeen,BAG_CATEGORIES}from './camp-space-ui.js?v=0.6.140';
import {installDialogDismissal}from './dialog-dismissal.js?v=0.6.140';
import {createExpandedPane}from './expanded-pane.js?v=0.6.140';
import {createInheritanceMapUI}from './inheritance-map-ui.js?v=0.6.140';
import {acknowledgeWorkRewards}from './work-milestone-storage.js?v=0.6.140';
import {getClockStatus} from './engine.js?v=0.6.140';
import {CRAFT_CATEGORIES,craftCategory,craftCategoryMarkup,readUiPreference,saveUiPreference} from './craft-categories.js?v=0.6.140';
import {marketMarkup} from './mvp-ui.js?v=0.6.140-ux226';
import {trophyMarkup} from './trophy-ui.js?v=0.6.140';
import {editStoredAugment}from './augment-choice-storage.js?v=0.6.140';import {augmentExclusionMarkup}from './augment-exclusion-ui.js?v=0.6.140';
let augmentSaveError='',pendingAugmentExclude=null;
import {clearHistoryMarkup}from './clear-history-ui.js?v=0.6.140';
import {replayAchievementsMarkup}from './replay-achievements-ui.js?v=0.6.140';
import {finalWaveForRun}from './campaign-rules.js?v=0.6.140';
import {contractsMarkup}from './contracts-ui.js?v=0.6.140';import {editStoredContract}from './contracts-storage.js?v=0.6.140';
import {routesMarkup}from './routes-ui.js?v=0.6.140';import {editStoredRoute}from './routes-storage.js?v=0.6.140';
import {settleFarmOffline}from './farm-offline.js?v=0.6.140';
import {farmMarkup}from './farm-ui.js?v=0.6.140';import {editStoredFarm}from './farm-storage.js?v=0.6.140';
import {companionMarkup}from './companion-ui.js?v=0.6.140';import {companionById}from './companion-content.js?v=0.6.140';import {proposeCompanion,confirmStoredCompanion}from './companion-storage.js?v=0.6.140';
import {editStoredMagic}from './magic-storage.js?v=0.6.140';
import {proposeBuildRestore}from './build-presets.js?v=0.6.140';import {editStoredBuild}from './build-presets-storage.js?v=0.6.140';import {buildRestoreMarkup}from './build-presets-ui.js?v=0.6.140';
import {gearMarkup}from './gear-ui.js?v=0.6.140';import {editStoredGear}from './gear-storage.js?v=0.6.140';import {trainBuild}from './gear-training.js?v=0.6.140';
import {runResultMarkup}from './run-results-ui.js?v=0.6.140';
import {editStoredLegacyRank}from './legacy-ranks-storage.js?v=0.6.140';
import {migrateStoredFoundation}from './foundation-storage.js?v=0.6.140';
import {hasUpgrade,FREE_FEATURES}from './free-features.js?v=0.6.140';
import { confirmStoredRun } from './run-confirmation.js?v=0.6.140';
import { trainingPurpose } from './training-purpose.js?v=0.6.140';
import { GATHER_VIEW_KEY, readGatherView, readGatherPreference, saveGatherView, gatherGuideMarkup } from './gather-display.js?v=0.6.140';
import { workshopProduct, workshopMaterialIcon,catalogMaterialMarkup, materialShortage } from './workshop-art.js?v=0.6.140';
import { createRewardDisplay } from './reward-notices.js?v=0.6.140';
import { withWorkCompletions } from './work-completion.js?v=0.6.140';
import { portraitImage, portraitBadge } from './portrait-art.js?v=0.6.140';
import { reinforcementEffect } from './endless.js?v=0.6.140';
import { setTextIfChanged } from './dom-text.js?v=0.6.140';
import { validateReservationInput, reservationInputError, installReservationKeyboard, restoreControlFocus } from './reservation-input.js?v=0.6.140';
import { createRecipeSearch, filterRecipeNames } from './recipe-search.js?v=0.6.140';
import { prepareTemplateOverwrite, commitTemplateOverwrite, templateOverwriteMarkup } from './template-overwrite.js?v=0.6.140';
import { prepareMaterialPriority, commitMaterialPriority, materialPriorityMarkup, editMaterialPriority } from './material-priority-ui.js?v=0.6.140';
import { startEndless } from './engine.js?v=0.6.140';
import { augmentStatusMarkup } from './augments-ui.js?v=0.6.140';
import { getActionYields } from './engine.js?v=0.6.140';
import { reportMarkup, enemyRoadmap, challengesMarkup, chapterPresentation, queueTimingMarkup, conditionalMarkup, updateConditionDraft, conditionalRequest, conditionLabel } from './strategy-ui.js?v=0.6.140';
import { enqueueConditional } from './engine.js?v=0.6.140';
import { tradeResource } from "./engine.js?v=0.6.140";
import { changelogMarkup } from "./changelog.js?v=0.6.140";
import { createBackgroundClock } from "./background-clock.js?v=0.6.140";
import { updateSetupDialog } from "./setup-dialog.js?v=0.6.140";
import { compareRun } from './visual-design.js?v=0.6.140';
import { createRenderGuard } from './render-guard.js?v=0.6.140';
import { installQueueDrag } from './queue-drag.js?v=0.6.140';
import { preparationMarkup } from './preparation-ui.js?v=0.6.140';
import { saveClearCard } from './clear-card.js?v=0.6.140';
import { runFrameTasks } from './frame-loop.js?v=0.6.140';
import { getCatalog } from "./engine.js?v=0.6.140";
import { CONTENT } from "./content.js?v=0.6.140";
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
} from "./engine.js?v=0.6.140";
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
} from "./mvp-ui.js?v=0.6.140-ux226";
import {earlyDefeatMarkup}from './lifecycle-copy.js?v=0.6.140';
import { createSessionOwner } from "./session-owner.js?v=0.6.140";
import { editQueuedAction, moveQueuedAction } from "./engine.js?v=0.6.140";
import {
  loadStoredGame,
  writeStoredGame,
  readBackups,
  decodeRecord,
  unreadableRecord,
  readResetBackup,
  resetStoredGame,
  replaceStoredGame,
} from "./save-storage.js?v=0.6.140";
import {
  updatePresentation,
  playCompletedWork,
  markQueueEdited,
  unlockAudio,
  previewSound,
} from "./presentation.js?v=0.6.140";
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
} from "./engine.js?v=0.6.140";
import { icon } from "./icons.js?v=0.6.140";
import { planCraft, queueCraft, queueAction, queueWork, selectManualAction, blockedReservation, recoverReservation } from "./planner.js?v=0.6.140";
import {
  FIRST_RAID_DELAY,
  getUnlocks,
  getAugmentStatus,
  chooseAugment,
  rerollAugments,
  getRecipeCost,
  getFoodHealing,
  getSkillEffects,
} from "./engine.js?v=0.6.140";
import { renderAugments } from "./augments-ui.js?v=0.6.140";
import {canStartManualRepeat}from './engine.js?v=0.6.140';
import {editStoredManualRepeat}from './manual-repeat-storage.js?v=0.6.140';
import {manualRepeatMarkup}from './manual-repeat-ui.js?v=0.6.140';
import {LEGACY_CATEGORIES}from './legacy-categories.js?v=0.6.140';
import { renderUpgradeSections } from "./upgrades-ui.js?v=0.6.140";
import { renderBattle, suspendBattle } from "./battle-ui.js?v=0.6.140";
import { mountCampScene } from "./camp-scene.js?v=0.6.140";
import { workScene, syncWorkAnimation } from "./work-scene.js?v=0.6.140";
import { getRecipeVisibility } from "./workshop.js?v=0.6.140";
import { getMilestoneStatus } from "./engine.js?v=0.6.140";
import {
  advanceTime,
  getAccelerationStatus,
  startAcceleration,
  stopAcceleration,
} from "./engine.js?v=0.6.140";

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
let tab = 'home';
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
let bagResetScroll=false,bagShowZero=false,bagCategory='all',manualPauseReason='',manualPauseKey='',currentQueueStop=null;
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
const tabNames = {};Object.defineProperty(tabNames,'home',{get:()=>[uiText('village.home'),uiText('village.description')]});
for(const key of ['gather','craft','village','trade','diplomacy','legacy','workers'])Object.defineProperty(tabNames,key,{get:()=>[uiText('pane.'+key+'.title'),uiText('pane.'+key+'.description')]});
const format = number=>formatNumber(Math.floor(Number(number)||0));
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
const resourceName = id=>entityText('resource',{id,name:RESOURCES[id]?.name||id});
const definitionName = d=>entityText(ACTIONS.some(a=>a.id===d?.id)?'action':'recipe',d);
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
  return uiText('skill.speed',{speed:effects.runSpeedPercent})+(skill==='combat'?uiText('skill.combatGrowth',{attack:effects.runAttack,hp:effects.runMaxHp}):['archery','sorcery'].includes(skill)?uiText('skill.partyGrowth',{stat:uiText(skill==='archery'?'stat.archer':'stat.mage'),attack:effects.runAttack}):'');
}

function savedWorkNote(work) {
  if (!work) return "";
  return `<div class="saved-work" role="progressbar" aria-label="${escape(uiText('work.savedProgress'))}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(progress(work.progress / work.duration))}"><div class="work-track"><i style="width:${progress(work.progress / work.duration)}%"></i></div></div>`;
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
    const workNotice=acknowledgeWorkRewards(localStorage,state,{isOwner:()=>session.owned});if(workNotice.ok&&workNotice.rewards.length)toast(uiText('notice.workMaterials',{names:workNotice.rewards.map(m=>(getUILocale()!=='ja'?entityText('material',m.material):m.name)+' +1').join(' / ')}));
    savedAt = new Date();
    saveFailed = false;
    if (force) loadWarning = "";
  } catch {
    saveFailed = true;
  }
}

function toast(message,id) {
  const el = document.querySelector("#toast");
  el.textContent = reasonText(state,message,id);
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
    <a class="brand" href="#" aria-label="${uiText('chrome.home')}" data-ui-aria="chrome.home"><img src="./assets/mark.svg" alt="" /><span><strong>LoopKeeper</strong><small>IDLE DEFENSE</small></span></a>
    <div class="sidebar-label">${copySpan('chrome.camp')}</div>
    <nav id="navigation" aria-label="${uiText('chrome.main')}" data-ui-aria="chrome.main"></nav>
    <div class="skills-heading"><span class="sidebar-label">${copySpan('chrome.skills')}</span><span class="skill-legend">${copySpan('chrome.current')} <b>/</b> ${copySpan('chrome.permanent')}</span></div>
    <div id="skill-list"></div>
    <div class="sidebar-note">${icon("flame")}<p>${copySpan('chrome.note1')}<br />${copySpan('chrome.note2')}</p></div>
    <div id="generation" class="generation"></div>
    <button class="prototype-label updates-link" data-command="updates-menu">${copySpan('menu.updates')} <b>v${VERSION}</b></button>
  </aside>
  <div class="workspace">
         <header class="topbar"><span class="mobile-header-title">LoopKeeper</span><button title="${uiText('chrome.menuHint')}" data-ui-title="chrome.menuHint" class="mobile-menu-toggle" data-command="header-menu" data-focus="header-menu" aria-label="${uiText('chrome.menu')}" data-ui-aria="chrome.menu" aria-haspopup="dialog" aria-controls="header-menu-dialog" aria-expanded="false"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button><div class="breadcrumb">${copySpan('chrome.frontier')}</div><nav class="quick-actions" aria-label="${uiText('chrome.quick')}" data-ui-aria="chrome.quick"><button class="dashboard-button" data-info="bag" data-focus="bag-open" aria-label="${uiText('chrome.bagAria')}" data-ui-aria="chrome.bagAria" title="${uiText('chrome.bag')}" data-ui-title="chrome.bag">${icon("bag")}</button><button class="dashboard-button" data-info="quests" data-focus="quests-open" aria-label="${uiText('menu.quests')}" data-ui-aria="menu.quests" title="${uiText('menu.quests')}" data-ui-title="menu.quests">${icon("book")}<span data-quest-badge></span></button><button class="dashboard-button" data-info="strategy" data-camp-strategy data-focus="strategy-open" aria-label="${uiText('chrome.strategy')}" data-ui-aria="chrome.strategy" title="${uiText('chrome.strategy')}" data-ui-title="chrome.strategy">${icon("flag")}<span data-strategy-badge></span></button><button class="dashboard-button" data-info="queue" data-camp-queue data-focus="queue-open" aria-label="${uiText('queueUi.heading')}" data-ui-aria="queueUi.heading" title="${uiText('queueUi.heading')}" data-ui-title="queueUi.heading">${icon("queue")}<span data-queue-badge></span></button><button class="dashboard-button" data-command="settings-menu" data-focus="settings-open" aria-label="${uiText('settings.heading')}" data-ui-aria="settings.heading" title="${uiText('settings.heading')}" data-ui-title="settings.heading">${icon("settings")}</button></nav><div class="topbar-actions"><span id="save-status"></span><button class="icon-button" data-command="save-menu" title="${uiText('chrome.save')}" data-ui-title="chrome.save" aria-label="${uiText('chrome.save')}" data-ui-aria="chrome.save">${icon("save")}</button></div></header>
<main>

      <div id="save-warning" role="alert"></div><div id="milestone" hidden></div>
      <section class="camp-banner" aria-label="${uiText('camp.banner')}" data-ui-aria="camp.banner"><div class="camp-caption"><span class="location-tag"><i></i> THE ASHEN FRONTIER</span><h2>まだ、火は灯っている。</h2><p>森の向こうから、足音が近づいてくる。</p></div><div id="raid-forecast" class="raid-forecast"></div><div id="time-controls" class="time-controls"></div></section>
      <section id="resource-bar" class="resource-bar" aria-label="${uiText('stock.heading')}" data-ui-aria="stock.heading"></section><div id="diplomacy-notice"></div><div id="merchant-notice"></div><div id="augments-panel"></div>
      <div id="session-notice"></div><div id="prep-status" class="prep-status" aria-label="${uiText('chrome.prep')}" data-ui-aria="chrome.prep"></div><div id="queue-warning"></div><div class="play-layout"><section class="work-area"><div class="section-heading"><div><h2 id="section-title"></h2><p id="section-description"></p></div><span id="work-label" class="subtle-label"></span><div class="list-tools"><button type="button" class="button small muted" data-command="expand-work" data-focus="expand-work" aria-haspopup="dialog" aria-controls="expanded-work-dialog">${copySpan('chrome.expand')}</button><div id="gather-view-controls" class="gather-view-controls" aria-label="${uiText('chrome.display')}" data-ui-aria="chrome.display"><button type="button" class="button small muted" data-gather-view="normal" data-focus="gather-view-normal">${copySpan('guide.normal')}</button><button type="button" class="button small muted" data-gather-view="simple" data-focus="gather-view-simple">${copySpan('guide.simple')}</button></div><div id="material-priority-controls" class="material-priority-controls" hidden><button class="button small gold-outline" data-command="material-priority-menu" data-focus="material-priority-menu">${copySpan('chrome.priority')}</button></div><div id="recipe-search-tools" hidden><button type="button" id="recipe-search-toggle" class="button small muted" aria-controls="recipe-search" aria-expanded="false">${copySpan('search.open')}</button><small id="recipe-search-summary"></small><button type="button" id="recipe-search-reset" class="button small muted" hidden aria-label="${uiText('search.resetAria')}" data-ui-aria="search.resetAria">解除</button></div></div></div><div id="active-work"></div><div id="mobile-queue-context" class="mobile-queue-context" aria-label="${uiText('chrome.queueState')}" data-ui-aria="chrome.queueState"></div><div id="useful-goals"></div><div id="early-raid-control"></div><div id="recipe-search" class="recipe-search" hidden><label for="recipe-search-input" data-search-label>工房の名前検索</label><div class="recipe-search-controls"><input id="recipe-search-input" type="search" placeholder="${uiText('search.placeholder')}" data-ui-placeholder="search.placeholder" autocomplete="off" spellcheck="false" aria-controls="content"><button type="button" disabled aria-label="${uiText('search.clearAria')}" data-ui-aria="search.clearAria">クリア</button><small data-search-result role="status" aria-live="polite"></small></div></div><div id="content"></div></section><aside id="camp-rail" aria-label="${uiText('camp.rail')}" data-ui-aria="camp.rail"><details class="camp-view" open><summary data-ui-copy="camp.scenery">${uiText('camp.scenery')}</summary><div id="camp-scene-view" role="img" aria-label="${uiText('camp.sceneAria')}" data-ui-aria="camp.sceneAria"></div><button class="button small muted" data-info="camp" data-focus="camp-view-open" data-ui-copy="camp.enlarge">${uiText('camp.enlarge')}</button></details><aside id="queue-preview" class="queue-preview" aria-label="${uiText('chrome.queueList')}" data-ui-aria="chrome.queueList"></aside></aside></div>

      <footer><span>${copySpan('chrome.one')}</span><span>${copySpan('chrome.clock')}</span></footer>
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
function renderGatherGuide(){setHTML('#gather-guide-dialog','<div class="dialog-heading"><h2 id="gather-guide-title">'+escape(uiText('guide.title'))+'</h2><button class="icon-button" data-close="gather-guide-dialog" aria-label="'+escape(uiText('common.close'))+'">×</button></div><p>'+escape(uiText('guide.detail'))+'</p><div class="gather-view-controls"><button class="button muted" data-gather-view="normal" data-focus="guide-normal" aria-pressed="'+(gatherView==='normal')+'">'+escape(uiText('guide.normal'))+'</button><button class="button muted" data-gather-view="simple" data-focus="guide-simple" aria-pressed="'+(gatherView==='simple')+'">'+escape(uiText('guide.simple'))+'</button></div><p role="status" aria-live="polite">'+escape(uiText(gatherTried?'guide.done':'guide.try'))+'</p>');}
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
infoDialog.innerHTML = `<div class="dialog-heading"><h2 id="info-title">状態・装備</h2><button class="icon-button" data-close="info-dialog" aria-label="閉じる" data-ui-aria="common.close">${icon("close")}</button></div><div data-info-panel="status"><button class="button muted end-run-button" data-command="abandon-menu" data-ui-copy="augmentUi.endRun">この周回を切り上げる</button><div id="survivor"></div><div id="equipment"></div><div id="facilities"></div><div id="next-goal"></div></div><div data-info-panel="queue" hidden><div id="queue-panel"></div></div><div data-info-panel="quests" hidden id="quest-list"></div><div data-info-panel="journal" hidden><section class="journal"><div class="journal-title">${icon("book")}<h2 data-ui-copy="journal.heading">${uiText('journal.heading')}</h2><span data-ui-copy="journal.life">${uiText('journal.life')}</span></div><div id="journal-entries" role="log" aria-label="${uiText('journal.aria')}" data-ui-aria="journal.aria"></div></section></div>`;
document.body.append(infoDialog);
infoDialog.insertAdjacentHTML('beforeend','<div data-info-panel="bag" hidden><div id="bag-content"></div></div><div data-info-panel="strategy" hidden><div id="strategy-details"></div></div>');
infoDialog.insertAdjacentHTML('beforeend','<div data-info-panel="camp" hidden><div id="pixel-village-full" class="pixel-camp-full"></div></div>');
const queueStopDialog=document.createElement('dialog');queueStopDialog.id='queue-stop-dialog';queueStopDialog.setAttribute('aria-labelledby','queue-stop-title');queueStopDialog.innerHTML='<div class="dialog-heading"><h2 id="queue-stop-title" data-ui-copy="queueUi.stoppedHeading">'+uiText('queueUi.stoppedHeading')+'</h2><button class="icon-button" data-close="queue-stop-dialog" aria-label="閉じる" data-ui-aria="common.close">×</button></div><div id="queue-stop-body"></div>';document.body.append(queueStopDialog);
const overlayPause=new WeakMap(),overlayFocus=new WeakMap();
let pendingEarlyRaid=null;
const earlyRaidDialog=document.createElement('dialog');earlyRaidDialog.id='early-raid-dialog';earlyRaidDialog.setAttribute('aria-labelledby','early-raid-title');earlyRaidDialog.addEventListener('close',()=>{pendingEarlyRaid=null;});document.body.append(earlyRaidDialog);


const headerMenuDialog = document.createElement("dialog");
headerMenuDialog.id = "header-menu-dialog";
headerMenuDialog.setAttribute("aria-labelledby", "header-menu-title");
headerMenuDialog.innerHTML = `<div class="dialog-heading"><h2 id="header-menu-title">${copySpan('menu.heading')}</h2><button class="icon-button" data-close="header-menu-dialog" aria-label="${uiText('common.close')}" data-ui-aria="common.close">${icon("close")}</button></div><nav class="mobile-menu-actions" aria-label="${uiText('menu.aria')}" data-ui-aria="menu.aria">${[
  ["info", "queue", "book", copySpan('menu.queue')],
  ["info", "status", "shield", copySpan('menu.status')],
  ["info", "quests", "book", copySpan('menu.quests')],
  ["info", "journal", "book", copySpan('menu.journal')],
  ["command", "save-menu", "save", copySpan('menu.save')],
  ["command", "updates-menu", "history", copySpan('menu.updates')],
  ["command", "settings-menu", "settings", copySpan('settings.heading')],
  ["command", "return-title", "chevron", titleText("title.return")],
  ["command", "help", "help", copySpan('menu.help')],
  ["command", "abandon-menu", "memory", copySpan('menu.abandon')],
].map(([type, value, symbol, label]) => `<button data-${type}="${value}">${icon(symbol)}<span>${label}</span>${icon("chevron")}</button>`).join("")}</nav>`;
document.body.append(headerMenuDialog);
headerMenuDialog.querySelector('nav').insertAdjacentHTML('beforebegin','<div id="header-acceleration"></div>');
headerMenuDialog.querySelector('nav').insertAdjacentHTML('afterbegin','<button data-info="bag">'+copySpan('menu.bag')+'</button><button data-info="strategy">'+copySpan('menu.strategy')+'</button>');

const abandonDialog = document.createElement("dialog");
abandonDialog.id = "abandon-dialog";
abandonDialog.setAttribute("aria-labelledby", "abandon-title");
abandonDialog.innerHTML = `<div class="dialog-heading"><h2 id="abandon-title" data-ui-copy="abandon.title">${uiText('abandon.title')}</h2><button class="icon-button" data-close="abandon-dialog" aria-label="閉じる" data-ui-aria="common.close">${icon("close")}</button></div><p data-ui-copy="abandon.keeps">${uiText('abandon.keeps')}</p><p class="fine-print" data-ui-copy="abandon.resets">${uiText('abandon.resets')}</p><div class="save-options"><button class="button muted" data-close="abandon-dialog" data-ui-copy="abandon.cancel">${uiText('abandon.cancel')}</button><button class="button gold" data-command="abandon-confirm" data-ui-copy="abandon.confirm">${uiText('abandon.confirm')}</button></div>`;
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
 if(id==='home'&&expandedPane.dialog.open)expandedPane.close();
 tab=id;selectedSkill=null;document.querySelector('#content').scrollTop=0;render();
 expandedPane.dialog.scrollTop=0;
 const opener=document.querySelector('#navigation [data-tab="'+tab+'"]');
 if(wideWorkLayout.matches&&expandedPane.dialog.open)expandedPane.close({preserveCurrentScroll:true});
 if(expandedPane.dialog.open)expandedPane.setOpener(opener);
 if(id!=='home'&&expand&&window.innerWidth>690&&!wideWorkLayout.matches&&state.run.status!=='legacy_setup')expandedPane.open(opener);
}
function openInformation(name,opener){
 if(name==='bag'){bagCategory='all';bagResetScroll=true;}
 if(!['queue','status','quests','journal','bag','strategy','camp'].includes(name))return;
 infoDialog.dataset.panel=name;const heading=document.querySelector('#info-title');heading.dataset.uiCopy='info.'+name;heading.textContent=uiText('info.'+name);const close=infoDialog.querySelector('[data-close]');if(close){close.dataset.uiAria='common.close';close.setAttribute('aria-label',uiText('common.close'));}
 for(const panel of infoDialog.querySelectorAll('[data-info-panel]'))panel.hidden=panel.dataset.infoPanel!==name;
 if(name==='quests')questSeen.acknowledge(state.meta.completedMilestones);
 showCampDialog(infoDialog,opener);render();
}
function openQueueStop(opener){if(!currentQueueStop)return;setHTML('#queue-stop-body',(getUILocale()!=='ja'?englishQueueStop(state,currentQueueStop,manualPauseReason&&manualPauseKey?uiText(manualPauseKey):manualPauseReason):queueStopMarkup(currentQueueStop)));showCampDialog(queueStopDialog,opener);}
const expandedMenu=document.createElement('select');expandedMenu.dataset.expandedMenu='1';expandedMenu.dataset.uiAria='chrome.expandedMenu';expandedMenu.setAttribute('aria-label',uiText('chrome.expandedMenu'));expandedPane.dialog.querySelector('.expanded-heading').prepend(expandedMenu);expandedMenu.addEventListener('change',()=>selectWorkMenu(expandedMenu.value,{expand:true}));
function syncCampSpace(){
 document.body.classList.toggle('camp-work-idle',!state.run.activeAction&&state.run.status==='preparing'&&['none','wait'].includes(getClockStatus(state).kind));
 setHTML('#save-warning',saveFailed||loadWarning?'<div class="save-warning"><span>'+escape(uiText('chrome.saveWarning'))+'</span><button data-command="save-menu">'+escape(uiText('chrome.saveOpen'))+'</button></div>':'');
 const unseen=questSeen.unseen(state.meta.completedMilestones);document.querySelector('[data-quest-badge]').parentElement.title=unseen?uiText('goals.unseen',{count:unseen}):uiText('goals.overview');document.querySelector('[data-quest-badge]').textContent=unseen?' '+unseen:'';document.querySelector('[data-info="quests"]').setAttribute('aria-label',unseen?uiText('goals.aria',{count:unseen}):uiText('menu.quests'));
 const offer=getAugmentStatus(state),strategyButton=document.querySelector('[data-camp-strategy]');document.querySelector('[data-strategy-badge]').textContent=offer.offer.length?' !':'';strategyButton.classList.toggle('choice-required',!!offer.offer.length);if(offer.offer.length){strategyButton.dataset.command='show-augments';delete strategyButton.dataset.info;}else{strategyButton.dataset.info='strategy';delete strategyButton.dataset.command;}
 if(infoDialog.open&&infoDialog.dataset.panel==='bag'){setHTML('#bag-content',inventoryMarkup(state,bagCategory,Object.keys(RESOURCES).filter(visibleResource),{showZero:bagShowZero}));if(bagResetScroll){document.querySelector('#bag-content .inventory-scroll').scrollTop=0;bagResetScroll=false;}}
 if(infoDialog.open&&infoDialog.dataset.panel==='quests'){setHTML('#quest-list','<p class="fine-print">'+escape(uiText('goals.auto'))+'</p>'+nextPermanentTargetsMarkup(state)+milestoneMarkup(state));const list=infoDialog.querySelector('.milestone-list');if(list)list.open=true;}
 if(infoDialog.open&&infoDialog.dataset.panel==='strategy'){setHTML('#strategy-details',renderAugments(state)+synergyMarkup(state)+augmentStatusMarkup(state));for(const d of infoDialog.querySelectorAll('[data-info-panel="strategy"] details'))d.open=true;}
 currentQueueStop=session.owned?queueStopStatus(state,queueIssue(),{manualReason:manualPauseReason}):null;
 const queueButton=document.querySelector('[data-camp-queue]');queueButton.dataset.info='queue';queueButton.classList.toggle('queue-is-stopped',!!currentQueueStop);queueButton.setAttribute('aria-label',currentQueueStop?uiText('queueUi.stoppedAria',{reason:reasonText(state,currentQueueStop.reason,state.run.queue[0]?.id)}):uiText('queueUi.countAriaShort',{count:state.run.queue.length}));document.querySelector('[data-queue-badge]').textContent=currentQueueStop?' !':state.run.queue.length?' '+state.run.queue.length:'';
 const options=[...document.querySelectorAll('#navigation [data-nav-expand]')].map(n=>'<option value="'+n.dataset.tab+'">'+escape(tabNames[n.dataset.tab][0])+'</option>').join('');if(expandedMenu.dataset.options!==options){expandedMenu.innerHTML=options;expandedMenu.dataset.options=options;}expandedMenu.value=tab;
 if(!currentQueueStop&&queueStopDialog.open)queueStopDialog.close();
 if(queueRailMutation){stopTransition.take(currentQueueStop);queueRailMutation=false;}
 // Pausing never opens an extra modal. Queue state remains visible inline.
 stopTransition.take(currentQueueStop,{blocked:true});
}

const singleUse = (id) => RECIPES.some((r) => r.id === id && (r.equipment || r.facility || r.endlessFacility || r.accessory || r.expedition));

function updateStockHint(){const scroller=document.querySelector('#stock-scroll'),hint=document.querySelector('#stock-scroll-hint');if(!scroller||!hint)return;const maxX=scroller.scrollWidth-scroller.clientWidth,max=scroller.scrollHeight-scroller.clientHeight;if(maxX>1){hint.textContent=scroller.scrollLeft<maxX-2?uiText('stock.right'):uiText('stock.left');scroller.dataset.overflow='true';return;}hint.textContent=max>1?(scroller.scrollTop<max-2?uiText('stock.below'):uiText('stock.above')):'';scroller.dataset.overflow=String(max>1);}
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
      ["home", "camp", uiText('village.home')],
      ["gather", "leaf", uiText('nav.gatherFull')],
      ["craft", "hammer", uiText('nav.craftFull')],
      ["village", "camp", uiText('nav.villageFull')],
      ["diplomacy", "flag", uiText('nav.diplomacyFull')],
      ["trade", "gold", uiText('nav.trade')],
      ["legacy", "memory", hasLegacyOptions() ? uiText('nav.legacy') : uiText('nav.experience')],
      ["workers", "people", uiText('nav.workers')],
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
          `<button class="nav-item ${tab === id ? "selected" : ""}" data-tab="${id}" data-short-label="${id==='home'?uiText('village.home'):NAV_SHORT[id]}" data-nav-expand="1" data-focus="nav-${id}" aria-label="${name}" aria-current="${tab === id ? "page" : "false"}">${icon(symbol)}<span>${name}</span>${id === "legacy" && hasLegacyOptions() ? `<small>${state.meta.points} pt</small>` : icon("chevron")}</button>`,
      )
      .join(""),
  );
  setHTML(
    "#skill-list",
    SKILLS.filter(skill=>skillVisible(state,skill.id)).map((skill) => {
      const run = skillLevel(skill.id),
        permanent = skillLevel(skill.id, true);
      return `<button class="sidebar-skill ${selectedSkill === skill.id ? "selected" : ""}" data-skill="${skill.id}" data-focus="skill-${skill.id}" aria-label="${escape(uiText('skill.aria',{skill:entityText('skill',skill),level:run.level,permanent:permanent.level}))}" aria-pressed="${selectedSkill === skill.id}"><span class="skill-symbol ${skill.id}">${icon(skillIcons[skill.id])}</span><span class="compact-skill-level" aria-hidden="true">Lv.${run.level}</span><span class="skill-data"><span class="skill-row"><span>${escape(entityText('skill',skill))}</span><span class="skill-numbers">${run.level} <b>/ ${permanent.level}</b></span></span><span class="thin-track"><i style="width:${progress(run.progress)}%"></i></span></span></button>`;
    }).join(""),
  );
  setHTML(
    "#generation",
    `<span class="generation-symbol">${icon("memory")}</span><div><small>${uiText(state.run.endless?.active?'camp.endless':'camp.lives')}</small><strong>${uiText('camp.generation',{count:format(state.meta.generation)})}</strong></div><span class="generation-number">${String(state.meta.generation).padStart(2, "0")}</span><span class="generation-compact" aria-label="${uiText('camp.generation',{count:format(state.meta.generation)})}"><b>${format(state.meta.generation)}</b>${uiText('camp.generationShort')}</span>`,
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
    isFrontierFinish(state)?speedControls(state.settings.gameSpeed)+finishReturnMarkup(state):`${speedControls(state.settings.gameSpeed)}<button class="button ${state.settings.paused ? "gold" : "muted"} pause-button" data-command="${awaitingChoice ? "show-augments" : "pause"}" data-focus="pause" aria-label="${awaitingChoice ? uiText('controls.choose') : state.settings.paused ? uiText('controls.resume') : uiText('controls.pause')}" title="${awaitingChoice ? uiText('controls.choose') : state.settings.paused ? uiText('controls.resume') : uiText('controls.pause')}" ${["dead", "cleared", "legacy_setup"].includes(state.run.status) ? "disabled" : ""}>${icon(awaitingChoice ? "spark" : state.settings.paused ? "play" : "pause")}<span>${awaitingChoice ? uiText('controls.choose') : state.settings.paused ? (!state.run.activeAction&&!state.run.queue.length&&!state.run.automationOnly ? uiText('controls.wait') : uiText('controls.resume')) : uiText('controls.pause')}</span></button>`,
  );
  setHTML("#header-acceleration",accelerationControl);
  const saveText = loadWarning
    ? uiText('camp.saveReadWarning')
    : saveFailed
      ? uiText('camp.saveWriteWarning')
      : savedAt
        ? uiText('camp.saveSaved')
        : uiText('camp.saveAuto');
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
  setHTML('#raid-forecast',getUILocale()!=='ja'?campForecast(state):isFrontierFinish(state)?'<div class="raid-summary"><div><b>通常36波・クリア</b><button data-command="show-clear-results">夜明けを取り戻した</button>'+campHealthMarkup(state)+'</div><span class="raid-clock" aria-label="通常36波をクリア"><b>完遂</b><small>次の挑戦は任意</small></span></div>':'<div class="raid-summary"><div><b>WAVE '+String(enemy.wave??state.run.wave+1).padStart(2,'0')+(enemy.isBoss?' · BOSS':'')+'</b><button data-info="status" title="'+escape(enemy.name+' / HP '+format(enemy.maxHp||enemy.hp)+' / 攻撃 '+enemy.attack+' / 防御 '+enemy.defense)+'">'+escape(enemy.name)+'</button>'+campHealthMarkup(state)+'</div><span class="raid-clock '+(remaining<15?'urgent':'')+'" aria-label="'+(combat?'襲撃中':dead?'旅の終わり':'襲撃まで '+time(Math.ceil(remaining)))+'"><b>'+ (combat?'防衛中':dead?'—':time(Math.ceil(remaining)))+'</b><small>'+(combat?'自動戦闘':dead?'旅の終わり':state.settings.paused?'時間停止中':getClockStatus(state).kind==='wait'?'手動待機'+(getAccelerationStatus(state).active?' · 5×':''):getAccelerationStatus(state).active&&getAccelerationStatus(state).canStart?'5×進行中':'襲撃まで')+'</small></span>'+raidEnemyStats(enemy)+'</div>');
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
  if(getUILocale()!=='ja'){setHTML('#diplomacy-notice',legacyDiplomacyNotice(state,{icon,time,config:DIPLOMACY}));return;}
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
  const dashboardOpen=tab==='home'&&state.run.status!=='legacy_setup';
  document.body.classList.toggle('on-village-dashboard',dashboardOpen);
  if(!dashboardOpen&&villageDashboard){villageDashboard.destroy();villageDashboard=null;}

  setHTML('#merchant-notice',merchantNotice(state));
  document.querySelector("#gather-view-controls").hidden=tab!=="gather" || state.run.status==="legacy_setup";
  for(const node of document.querySelectorAll("[data-gather-view]"))node.setAttribute("aria-pressed",String(node.dataset.gatherView===gatherView));
  recipeSearch.show(state.run.status !== "legacy_setup" && ["craft", "village"].includes(tab) ? tab : null);
  document.querySelector('#material-priority-controls').hidden = !['craft','village'].includes(tab) || !hasUpgrade(state,"action_queue") || state.run.status === 'legacy_setup';
  if (state.run.status === "legacy_setup") {
    setHTML("#content", '<p>'+escape(uiText('work.chooseNextLife'))+'</p>');
    return;
  }
  const focusedSkill = SKILLS.find((skill) => skill.id === selectedSkill);
  document.querySelector("#section-title").textContent = focusedSkill
    ? uiText('skill.heading',{skill:entityText('skill',focusedSkill)})
    : tab === "legacy" && !hasLegacyOptions()
      ? uiText('nav.experience')
      : tabNames[tab][0];
  document.querySelector("#section-description").textContent =
    (focusedSkill?entityText('skill',focusedSkill,'description'):null) ||
    (tab === "legacy" && !hasLegacyOptions()
      ? uiText('nav.experienceHint')
      : tabNames[tab][1]);
  document.querySelector("#work-label").textContent =
    tab === "gather"
      ? uiText('work.gather')
      : tab === "craft"
        ? uiText('work.craft')
        : tab === "village"
          ? uiText('work.village')
          : tab === "diplomacy"
            ? uiText('work.diplomacy')
            : tab === "workers"
              ? uiText('work.workers')
              : uiText('work.legacy');
  document.body.classList.toggle("work-resting", state.settings.paused || !state.settings.effectsEnabled || state.run.status === "combat");
  const action = state.run.activeAction;
  const activeDefinition =
    action && [...ACTIONS, ...RECIPES].find((x) => x.id === action.id);
  const working = activeDefinition && state.run.status !== "dead";
  const combat = state.run.status === "combat";
  setHTML(
    "#active-work",
    `<div class="active-work ${working ? "working" : ""} ${combat ? "battle" : ""}">${working && !combat ? workScene(activeDefinition.skill, activeDefinition.id, state.run.equipment, state) : `<div class="active-icon">${icon(combat ? "shield" : "clock")}</div>`}<div class="active-detail"><div><strong>${combat ? uiText('work.defending') : working ? escape(definitionName(activeDefinition)) : !isLegacy(state)&&getClockStatus(state).kind!=='none' ? escape(clockText(state,getClockStatus(state))) : uiText('work.choose')}</strong>${trainingPurpose(state) ? `<small class="training-purpose">${escape(trainingPurpose(state))}</small>` : ""}<span>${combat ? uiText('work.afterCombat') : working ? `<span data-work-time></span>` : state.settings.paused ? uiText('work.paused') : uiText('work.countdown')}</span></div><div class="work-track" ${working && !combat ? `role="progressbar" aria-label="${escape(uiText('work.progressAria',{name:definitionName(activeDefinition)}))}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"` : 'aria-hidden="true"'}><i data-live-work style="width:0%"></i></div>${preparationMarkup(state)}</div>${working ? `<button class="stop-button" data-command="stop" data-focus="stop" title="${uiText('work.stop')}" aria-label="${uiText('work.stop')}">${icon("close")}</button>` : ""}</div>`,
  );
  setHTML("#useful-goals",["gather","craft","village"].includes(tab)?usefulGoalsMarkup(state):"");
  setHTML("#early-raid-control",["gather","craft","village"].includes(tab)?earlyRaidControl(state):"");
  if (tab === "home") renderVillageDashboard();
  if (tab === "gather") renderGather();
  if (tab === "craft" || tab === "village") renderCraft();
  if (tab === "legacy") renderLegacy();
  if (tab === "workers") setHTML("#content", populationMarkup(state)+automationMarkup(state,{stockResource:document.querySelector('#stock-resource')?.value,stockQuantity:document.querySelector('#stock-quantity')?.value}) || '<div class="village-intro">継承ポイントで仲間を雇うと、ここで作業先と強化を選べます。</div><button class="button gold-outline" data-tab="legacy">継承で人員を解放</button>');
  if (tab === "diplomacy") renderDiplomacy();
  if (tab === "trade") setHTML("#content",commerceTabs()+marketMarkup(state,marketSide,marketCount));
  renderQueue();
  // The compact header owns the reservation count and stop indicator.
}

function renderVillageDashboard() {
  if (!villageDashboard) {
    setHTML('#content', villageDashboardMarkup);
    villageDashboard = mountVillageDashboard(document.querySelector('.village-dashboard'));
  }
  const stats = getStats(state), enemy = state.run.enemy || getNextEnemy(state);
  const action = state.run.activeAction;
  const definition = [...ACTIONS,...RECIPES].find(item => item.id === action?.id);
  const milestone = getMilestoneStatus(state).next;
  const paused = state.settings.paused;
  const preparing = state.run.status === 'preparing';
  const finished=isFrontierFinish(state);
  villageDashboard.update({
    finished,
    animate: state.settings.effectsEnabled && preparing && !document.querySelector('dialog[open]'),
    generation: uiText('village.generation',{count:state.meta.generation}),
    speed: state.settings.gameSpeed,
    control: finished ? uiText('village.results') : uiText(getAugmentStatus(state).offer.length?'controls.choose':paused?'controls.resume':'controls.pause'),
    controlCommand: finished ? 'show-clear-results' : getAugmentStatus(state).offer.length ? 'show-augments' : 'pause',
    controlDisabled: !finished && ['dead','cleared','legacy_setup'].includes(state.run.status),
    hp: Math.max(0,state.run.hp), maxHp: stats.maxHp,
    health: `${Math.ceil(Math.max(0,state.run.hp))} / ${stats.maxHp}`,
    wave: finished ? uiText('village.complete') : `WAVE ${enemy.wave||state.run.wave+1}`, enemy: finished?uiText('village.dawn'):encounterName(state,enemy),
    'enemy-stats': finished?'':uiText('village.stats',{attack:format(enemy.attack),defense:format(enemy.defense),hp:format(enemy.maxHp||enemy.hp)}),
    countdown: finished?'':preparing ? time(Math.max(0,Math.ceil(state.run.nextWaveAt-state.run.elapsed))) : state.run.status === 'combat' ? uiText('village.raiding') : '—',
    work: (definition ? definitionName(definition) : null) || uiText('village.chooseHint'),
    'work-detail': action ? (paused ? uiText('work.paused') : uiText('village.remaining',{seconds:Math.max(0,action.duration-action.progress).toFixed(1)})) : uiText('village.workHint'),
    progress: action ? Math.max(0,Math.min(1,action.progress/action.duration)) : 0,
    goal: milestone?entityText('quest',milestone):uiText('village.defend'),
    'goal-detail': milestone ? uiText('village.reward',{points:milestone.reward}) : uiText('village.prepare'),
    facilities: uiText('village.facilities',{count:Object.values(state.run.facilities).filter(n=>n>0).length}),
    village: {
      facilities: Object.fromEntries(Object.entries(state.run.facilities).map(([id,n])=>[id,n+(state.run.endless?.levels[id]||0)])),
      constructing: RECIPES.some(d=>d.id===action?.id&&(d.facility||d.endlessFacility)),
      threat: preparing ? 1-(state.run.nextWaveAt-state.run.elapsed)/45 : state.run.status==='combat' ? 1 : 0,
    },
    enemyData: enemy, routeId: state.run.routes?.active?.id || null,
    worker: definition ? {id:definition.id,skill:definition.skill,equipment:state.run.equipment} : null,
    displayState: state, partyEquipment: state.run.party?.equipment,
    workerAction: action, workerAnimate: state.settings.effectsEnabled && !paused && preparing,
    reserves: ['wood','stone','food'].map(id=>({icon:id,label:resourceName(id),amount:formatNumber(state.run.resources[id],{notation:'compact',maximumFractionDigits:1}),fullAmount:format(state.run.resources[id])})),
    queueMore: Math.max(0,state.run.queue.length-5),
    queue: state.run.queue.slice(0,5).map(item=>{const d=[...ACTIONS,...RECIPES].find(d=>d.id===item.id);return {label:d?definitionName(d):item.id,icon:skillIcons[d?.skill]||'hammer'};}),
  });
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
        return `<article class="gather-card"><button class="action-card ${active ? "active" : ""} ${locked ? "locked" : ""}" data-action="${action.id}" data-focus="action-${action.id}" ${locked ? "disabled" : ""} aria-pressed="${active}" aria-label="${escape(entityText('action',action)+(locked ? ": "+reasonText(state,check.reason,action.id) : ""))}"><span class="simple-state">${active ? uiText('gather.selected') : locked ? uiText('gather.unavailable') : ""}</span><div class="action-summary"><div class="card-top"><span class="action-icon ${action.skill}">${icon(skillIcons[action.skill])}</span><span class="action-time">${icon(locked ? "lock" : "clock")}${levelLocked ? uiText('gather.level',{level:action.unlockLevel}) : state.run.status === "combat" ? uiText('gather.raid') : uiText('gather.seconds',{seconds:formatNumber(getActionDuration(state,action),{minimumFractionDigits:1,maximumFractionDigits:1,useGrouping:false})})}</span></div><div class="action-name"><h3>${escape(entityText('action',action))}</h3>${active ? '<span class="active-pill">'+uiText('gather.selected')+'</span>' : ""}</div>${action.id === "gather_food" || !yields.length ? `<p>${escape(action.id === "gather_food" ? uiText('gather.foodUse') : entityText('action',action,'description'))}</p>` : ""}<div class="action-yield">${yields.length ? yields.map(([id, amount]) => `<span>${icon(id)}${escape(resourceName(id))}<b>+${amount}</b></span>`).join("") : `<span>${icon(action.trainingStat === "defense" ? "shield" : action.trainingStat === "vitality" ? "heart" : "sword")}${focusedTraining ? `${Object.fromEntries(['attack','defense','vitality','archer','mage'].map(key=>[key,uiText('stat.'+key)]))[action.trainingStat]} +${(current.level-1)*({attack:2,defense:1.5,vitality:18,archer:2,mage:3}[action.trainingStat])}` : uiText('gather.experience')}</span>`}${icon("arrow", "card-arrow")}</div></div><div class="action-portrait portrait-${action.skill} ${action.id === "fish_river" ? "portrait-fishing" : ""}" aria-hidden="true"><span class="portrait-horizon"></span>${portraitImage(action.skill, action.id, state.run.equipment, state.settings.effectsEnabled, state)}<span class="portrait-caption">${portraitBadge(skillIcons[action.skill])}</span></div><div class="action-details"><div class="card-levels"><span>${focusedTraining ? uiText('gather.training') : uiText('gather.run')} <b>Lv.${current.level}</b></span><span class="permanent-text">${icon('memory')}${uiText('gather.permanent')} <b>Lv.${permanent.level}</b></span></div>${!focusedTraining && current.level > 1 ? `<div class="run-growth"><b>${runGrowth(action.skill)}</b></div>` : ""}${savedWorkNote(suspended)}<div class="card-skill-track"><i style="width:${progress(current.progress)}%"></i></div>${levelLocked ? `<div class="lock-reason">${escape(reasonText(state,check.reason,action.id))}</div>` : ""}</div></button>${hasUpgrade(state,"action_queue") ? `<div class="gather-reservation">${trainingMode(state,action.id)?trainingLevelEditor(state,action.id,craftQuantities[action.id],`data-craft-count="${action.id}" data-focus="work-count-${action.id}" aria-label="${escape(uiText('gather.targetAria',{name:entityText('action',action)}))}"`):`<label>${uiText('gather.count')}<input type="number" min="1" max="99" step="1" title="${uiText('gather.integer')}" inputmode="numeric" data-craft-count="${action.id}" data-focus="work-count-${action.id}" aria-label="${escape(uiText('gather.countAria',{name:entityText('action',action)}))}" value="${Number.isFinite(craftQuantities[action.id] ?? 1) ? craftQuantities[action.id] ?? 1 : ""}"></label>`}<button data-queue-work="${action.id}" data-focus="queue-work-${action.id}" ${locked ? "disabled" : ""}>${state.run.queue.length ? uiText('gather.queueLast') : uiText('gather.queue')}</button>${state.run.queue.length ? `<button data-queue-work="${action.id}" data-queue-position="front" data-focus="queue-work-front-${action.id}" ${locked ? "disabled" : ""}>${uiText('gather.queueFirst')}</button>` : ""}</div>` : ""}<button type="button" class="gather-detail-button" data-gather-detail="${action.id}" data-focus="gather-detail-${action.id}" aria-label="${escape(uiText('gather.detailsAria',{name:entityText('action',action)}))}">${uiText('gather.details')}</button></article>`;
      })
      .join(
        "",
      )}</div>${state.meta.bestWave === 0 && !state.run.equipment.weapon ? `<div class="context-hint">${icon("help")}<span>${escape(uiText('gather.firstHint'))}</span></div>` : ""}`,
  );
}

function renderSkillOverview() {
  if (!selectedSkill) return "";
  const skill = SKILLS.find((item) => item.id === selectedSkill);
  const current = skillLevel(selectedSkill),
    permanent = skillLevel(selectedSkill, true);
  return `<div class="focused-skill"><span class="action-icon ${selectedSkill}">${icon(skillIcons[selectedSkill])}</span><div class="focused-skill-progress"><div><span>${uiText('gather.run')} Lv.${current.level}</span><small>${format(current.xpInto)} / ${format(current.xpNeeded)} XP</small></div><div class="xp-track"><i style="width:${progress(current.progress)}%"></i></div></div><div class="focused-skill-progress"><div><span class="permanent-text">${uiText('gather.permanent')} Lv.${permanent.level}</span><small>${format(permanent.xpInto)} / ${format(permanent.xpNeeded)} XP</small></div><div class="xp-track permanent"><i style="width:${progress(permanent.progress)}%"></i></div></div><button class="icon-button" data-tab="gather" data-focus="clear-filter" aria-label="${uiText('skill.allActions')}" title="${uiText('skill.allActions')}">${icon("close")}</button></div><div class="skill-effect-summary"><strong>${escape(uiText('skill.runEffect',{effect:runGrowth(selectedSkill)}))}</strong><span>${escape(uiText('skill.runRule',{combat:selectedSkill==='combat'?uiText(isLegacy(state)?'skill.legacyCombat':'skill.combatRule'):'',xp:Math.ceil(current.xpNeeded-current.xpInto)}))}</span><span class="permanent-text">${escape(uiText('skill.permanentEffect',{speed:getSkillEffects(state,selectedSkill).permanentSpeedPercent,xp:getSkillEffects(state,selectedSkill).runXpPercent??getSkillEffects(state,selectedSkill).permanentSpeedPercent}))}</span></div>`;
}

function renderQueuePreview() {
  const owned=hasUpgrade(state,"action_queue"),host=document.querySelector("#queue-preview");
  host.hidden=!owned||state.run.status==='legacy_setup';if(host.hidden)return;
  const enabled=!state.settings.disabledUpgrades.includes("action_queue"),issue=queueIssue(),active=state.run.activeAction;
  const status=issue?"要確認":!enabled?"保留中":state.settings.paused?"時間停止中":"実行中";
  if(getUILocale()!=='ja'){setHTML('#queue-preview',englishQueueRail(state,{icon,enabled,issue,timing:queueTimingMarkup,name:id=>definitionName([...ACTIONS,...RECIPES].find(d=>d.id===id))||id,singleUse,trainingMode,trainingQueueEditor}));return;}
  setHTML("#queue-preview",'<div class="queue-preview-heading"><h3>'+icon("book")+'行動予約 <small>'+state.run.queue.length+'/8</small></h3><button data-info="queue" data-focus="rail-editor">編集・追加</button></div><div class="queue-preview-status">'+status+'</div>'+queueTimingMarkup(state)+(state.run.queue.length?'<ol data-scroll-key="queue-preview">'+state.run.queue.map((entry,index)=>{
    const name=definitionName([...ACTIONS,...RECIPES].find(d=>d.id===entry.id))||entry.id,current=index===0&&state.run.queueManaged&&enabled,goal=entry.goalId??index;
    return '<li data-queue-row="'+index+'" data-preview-goal="'+goal+'" class="'+(current?'current':'')+'"><button class="queue-number queue-drag-handle" data-queue-drag="'+index+'" data-focus="rail-handle-'+goal+'" aria-label="予約'+(index+1)+'の順番をドラッグで変更" title="ドラッグで並べ替え"><span class="queue-grip" aria-hidden="true">⋮⋮</span>'+(index+1)+'</button><span class="queue-preview-name">'+escape(name)+'</span><button class="queue-preview-remove icon-button" data-queue-remove="'+index+'" '+(entry.goalId!==undefined?'data-queue-goal="'+entry.goalId+'"':'')+' aria-label="'+escape(name)+'の予約を削除">'+icon("close")+'</button><div class="queue-rail-details">'+(entry.until?(trainingMode(state,entry.id)&&entry.until.type==='level'?trainingQueueEditor(state,entry,index,'rail-level-'+goal):'<small>'+escape(conditionLabel(entry))+'</small>'):singleUse(entry.id)?'<small>1回</small>':'<label>残り <input type="number" min="1" max="99" step="1" inputmode="numeric" value="'+entry.count+'" data-queue-count="'+index+'" data-focus="rail-count-'+goal+'" aria-label="予約'+(index+1)+'・'+escape(name)+'の残り回数"> 回</label>')+(current&&active?'<small class="queue-rail-progress">'+Math.min(active.progress,active.duration).toFixed(1)+' / '+active.duration.toFixed(1)+' 秒</small>':'')+'<div class="queue-rail-order"><button class="icon-button" data-queue-move="'+index+'" data-direction="-1" data-focus="rail-up-'+goal+'" aria-label="予約'+(index+1)+'を上へ" '+(index===0?'disabled':'')+'>↑</button><button class="icon-button" data-queue-move="'+index+'" data-direction="1" data-focus="rail-down-'+goal+'" aria-label="予約'+(index+1)+'を下へ" '+(index===state.run.queue.length-1?'disabled':'')+'>↓</button></div></div></li>';
  }).join('')+'</ol><div class="queue-rail-controls">'+(state.settings.paused?(issue?'<button class="button small muted" data-info="queue-stop">停止理由を確認</button>':'<button class="button small gold" data-queue-resume="1">'+(enabled?'予約を再開':'有効にして再開')+'</button>'):'<button class="button small muted" data-command="pause">停止</button>')+'<button class="button small muted" data-toggle-upgrade="action_queue">'+(enabled?'予約を保留':'予約を有効にする')+'</button></div>':'<p class="queue-preview-empty">予約はまだありません。<br>作業カードの「末尾に予約」で追加できます。</p>'));
}

function renderQueue() {
  renderQueuePreview();
  const unlocked = hasUpgrade(state,"action_queue");
  if (!unlocked) {
    if(getUILocale()!=='ja'&&isLegacy(state)){setHTML('#queue-panel',legacyQueueUnlockMarkup(state,icon));return;}
    if(getUILocale()!=='ja'&&!isLegacy(state)){setHTML('#queue-panel',englishQueueUnlock(state,FREE_FEATURES.find(x=>x.id==='action_queue').wave,icon));return;}
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
  if(getUILocale()!=='ja'){setHTML('#queue-panel',englishQueue(state,{icon,enabled,expanded:queueExpanded,definitions,draftId:queueDraftId,draftCount:queueDraftCount,draftSingle,draftQueued,queueStatus,currentStop:currentQueueStop?{...currentQueueStop,reason:queueStopReason(state,currentQueueStop,manualPauseReason&&manualPauseKey?uiText(manualPauseKey):manualPauseReason)}:null,name:id=>definitionName(definitions.find(d=>d.id===id))||id,singleUse,trainingMode,trainingQueueEditor,trainingLevelEditor}));return;}
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
  const searchMatches = filterRecipeNames(filteredCatalog, recipeSearch.query(),d=>entityText('recipe',d));
  recipeSearch.report(searchMatches.length, displayedCatalog.length);
  const searchEmpty = !searchMatches.length ? `<p class="craft-search-empty">${recipeSearch.query().trim() ? uiText('craft.noMatch') : village ? uiText('craft.noFacility') : uiText('craft.noItems')}</p>` : "";
  const queueNotice = state.run.queue.length >= 8 ? '<div class="queue-warning"><span>'+uiText('craft.queueFull')+'</span><button data-info="queue">'+uiText('craft.manageQueue')+'</button></div>' : '';
  const slotFilter = !village ? craftCategoryMarkup(craftFilter)+`<button class="button small muted" data-show-owned-accessories="1" aria-pressed="${showOwnedAccessories}">${uiText('craft.showOwned',{count:completedCount})}</button>` : "";
  const filter =
    hiddenCount || state.settings.showHiddenRecipes
      ? `<div class="craft-filters"><button class="craft-visibility" data-command="toggle-hidden-recipes" data-focus="hidden-filter" aria-pressed="${state.settings.showHiddenRecipes}">${icon(state.settings.showHiddenRecipes ? "eye" : "eye-off")}${uiText('craft.showHidden')}${hiddenCount ? `<small>${hiddenCount}</small>` : ""}</button></div>`
      : "";
  setHTML(
    "#content",
    `${renderSkillOverview()}${village ? `<div class="village-intro">${uiText(state.run.endless?.active?'village.endlessIntro':'village.intro')}</div>` : ""}${!village && !isLegacy(state) ? `<div class="workshop-automation">${autoCookingMarkup(state)}${processingMarkup(state)}</div>` : ""}<div class="catalog-filters">${village?villageCategoriesMarkup(villageFilter):slotFilter}${filter}</div>${queueNotice}${searchEmpty}<div class="craft-list ${village ? "facility-list" : ""}">${searchMatches
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
            ? `<button class="craft-hide" data-hide-recipe="${recipe.id}" data-focus="hide-${recipe.id}" aria-pressed="${visibility.manuallyHidden}" aria-label="${escape(uiText(visibility.manuallyHidden?'craft.unhideAria':'craft.hideAria',{name:entityText('recipe',recipe)}))}" title="${visibility.inProgress ? uiText('craft.cannotHide') : visibility.manuallyHidden ? uiText('craft.unhide') : uiText('craft.hide')}" ${visibility.inProgress ? "disabled" : ""}>${icon(visibility.manuallyHidden ? "eye-off" : "eye")}</button>`
            : "";
        const benefits = recipe.facility
          ? ""
          : eq
            ? [
                ["attack", uiText('stat.attack')],
                ["defense", uiText('stat.defense')],
                ["maxHp", uiText('stat.vitality')],
                ["speed", uiText('stat.speed')],
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
        return `<article class="craft-card ${village ? "facility-card" : "workshop-card"} ${active ? "active" : ""} ${visibility.manuallyHidden ? "craft-hidden" : ""}">${village ? '<div class="facility-overview">'+pixelFacilityProduct(recipe) : workshopProduct(recipe)}<div class="craft-info"><h3>${escape(entityText('recipe',recipe))}${recipe.endlessFacility ? ` <span class="equipped-tag">+${state.run.endless?.levels[recipe.endlessFacility] || 0}</span>` : ""}${equipped ? `<span class="equipped-tag">${village ? uiText('craft.built') : recipe.accessory ? uiText('craft.permanent') : uiText('craft.equipped')}</span>` : visibility.inferior ? '<span class="equipped-tag">'+uiText('craft.inferior')+'</span>' : ""}</h3>${!village && entityText('recipe',recipe,'description') === benefits ? "" : `<p>${escape(entityText('recipe',recipe,'description'))}</p>`}<div class="craft-benefits">${escape(benefits)}<span>${benefits ? " · " : ""}${uiText('gather.seconds',{seconds:getActionDuration(state,recipe).toFixed(1)})}</span></div>${village ? '</div></div><div class="facility-details">' : ''}<div class="recipe-cost">${Object.entries(
          active || suspended ? {} : Object.fromEntries(Object.entries(getRecipeCost(state, recipe)).map(([id,amount]) => [id, !smartUnlocked || validCraftCount ? amount * (smartUnlocked ? craftCount : 1) : null])),
        )
          .map(([id,amount])=>catalogMaterialMarkup({id,label:resourceName(id),available:state.run.resources[id]||0,required:amount,format}))
          .join(
            "",
          )}</div>${trophyMarkup(state,recipe.id,Boolean(active||suspended))}${savedWorkNote(active ? state.run.activeAction : suspended)}<div class="craft-growth">${escape(uiText('craft.growth',{skill:entityText('skill',SKILLS.find(x=>x.id===recipe.skill)),level:skillLevel(recipe.skill).level,speed:getSkillEffects(state,recipe.skill).runSpeedPercent}))}</div></div><div class="craft-command">${smartUnlocked && !singleUse(recipe.id) && !active && !suspended ? `<label class="craft-quantity">${uiText('craft.count')}<input type="number" min="1" max="99" step="1" title="${uiText('gather.integer')}" inputmode="numeric" data-craft-count="${recipe.id}" data-focus="craft-count-${recipe.id}" aria-label="${escape(uiText('craft.countAria',{name:entityText('recipe',recipe)}))}" value="${Number.isFinite(craftCount) ? craftCount : ""}"></label><small class="craft-total">${Object.entries(recipe.yields || {}).map(([id,amount]) => escape(uiText('craft.output',{name:resourceName(id),amount:Number.isInteger(craftCount)&&craftCount>=1&&craftCount<=99?format(amount*craftCount):'—'}))).join(" / ")}</small>` : ""}<div class="craft-buttons">${village?specialistWorkLink(recipe):""}<button class="button small ${allowed ? "gold-outline" : "muted"}" ${smartUnlocked && !active && !suspended ? "data-smart-craft" : "data-action"}="${recipe.id}" data-focus="recipe-${recipe.id}" ${!allowed || queuedIndex >= 0 || (active && !resumable) ? "disabled" : ""}>${queuedIndex >= 0 && !active ? uiText('craft.queued') : active && !resumable ? (village ? uiText('craft.building') : uiText('craft.crafting')) : resumable ? (village ? uiText('craft.resumeBuild') : uiText('craft.resume')) : equipped ? (village ? uiText('craft.built') : recipe.accessory ? uiText('craft.permanentDone') : ownedEquipment ? uiText('craft.owned') : uiText('craft.equippedDone')) : smartUnlocked && state.run.queue.length > 0 && !active && !suspended ? uiText('gather.queueLast') : recipe.endlessFacility ? uiText('craft.reinforce') : village ? uiText('craft.build') : uiText('craft.make')}</button>${smartUnlocked && state.run.queue.length > 0 && queuedIndex !== 0 && !active && !suspended && !equipped ? `<button class="button small gold-outline" data-smart-craft="${recipe.id}" data-queue-position="front" data-focus="recipe-front-${recipe.id}" ${!allowed ? "disabled" : ""}>${queuedIndex > 0 ? uiText('craft.moveFirst') : uiText('gather.queueFirst')}</button>` : ""}${visibilityButton}</div>${manualRepeatMarkup(state,recipe,recipe.id==='smelt_iron'?canStartManualRepeat(state):{ok:false})}${!allowed && !active && !equipped ? `<small>${escape(reasonText(state,reason,recipe.id))}</small>` : smartUnlocked && !active && !suspended && !equipped ? '<small class="permanent-text">'+uiText('craft.autoMaterials')+'</small>' : ""}</div></article>`;
      })
      .join(
        "",
      )}</div><div class="context-hint">${icon("hammer")}<span>${smartUnlocked ? (village ? (state.run.endless?.active ? uiText('craft.reinforceHint') : uiText('craft.buildHint')) : uiText('craft.autoHint')) : village ? uiText('craft.facilityHint') : uiText('craft.autoEquip')}</span></div>`,
  );
}

function renderLegacy() {
  const history = state.meta.history || [];
  setHTML(
    "#content",
    `<button class="button muted end-run-button" data-command="abandon-menu">${uiText('menu.abandon')}</button>${renderUpgradeSections(state,legacyCategory,inheritanceMapUI.options('live'))}<div class="legacy-intro"><span>${icon("memory")}</span><div><h3>${uiText('legacy.bodyTitle')}</h3><p>${uiText('legacy.bodyHint')}</p></div></div><div class="legacy-skills">${SKILLS.filter(skill=>skillVisible(state,skill.id)).map(
      (skill) => {
        const current = skillLevel(skill.id),
          permanent = skillLevel(skill.id, true);
        return `<article class="legacy-skill"><div class="legacy-skill-title"><span class="skill-symbol ${skill.id}">${icon(skillIcons[skill.id])}</span><h3>${escape(entityText('skill',skill))}</h3><span class="permanent-text">${uiText('legacy.permanentLevel')}<b>${permanent.level}</b></span></div><div class="legacy-bars"><div><span>${uiText('legacy.currentGrowth')} <b>Lv.${current.level}</b></span><div class="xp-track"><i style="width:${progress(current.progress)}%"></i></div><small>${format(current.xpInto)} / ${format(current.xpNeeded)} XP</small></div><div><span class="permanent-text">${uiText('legacy.inheritedXP')}</span><div class="xp-track permanent"><i style="width:${progress(permanent.progress)}%"></i></div><small>${format(permanent.xpInto)} / ${format(permanent.xpNeeded)} XP · ${uiText('legacy.nextLevel',{level:permanent.level+1})}</small></div></div><div class="legacy-growth">${escape(uiText('legacy.lifeEffect',{effect:runGrowth(skill.id)}))}</div></article>`;
      },
    ).join(
      "",
    )}</div><div class="history-heading"><h3>${uiText('legacy.history')}</h3><span>${uiText('legacy.bestCleared',{wave:state.meta.bestWave})}</span></div>${
      history.length
        ? `<div class="history-list">${history
            .slice(0, 5)
            .map(
              (entry) =>
                `<div><span>${icon("flame")}${uiText('legacy.generation',{generation:entry.generation})}</span><strong>${uiText('legacy.wavesCleared',{count:entry.wave})}</strong><small>${uiText('legacy.survived',{duration:time(entry.elapsed)})}</small></div>`,
            )
            .join("")}</div>`
        : `<div class="empty-history">${uiText('legacy.emptyTitle')}<br /><span>${uiText('legacy.emptyHint')}</span></div>`
    }`,
  );
}

function commerceTabs(){return '<div class="commerce-tabs" role="group" aria-label="'+uiText('commerce.aria')+'"><button class="button small muted" data-tab="diplomacy" aria-pressed="'+(tab==='diplomacy')+'">'+uiText('commerce.envoys')+'</button><button class="button small muted" data-tab="trade" aria-pressed="'+(tab==='trade')+'">'+uiText('commerce.trade')+'</button></div>';}
function renderDiplomacy() {
  if (!isLegacy(state)) {
    setHTML("#content", commerceTabs()+diplomacyMarkup(state)+contractsMarkup(state,document.querySelector(".contracts-panel")?.open)+routesMarkup(state));
    return;
  }
  if(getUILocale()!=='ja'){setHTML('#content',legacyDiplomacyMarkup(state,{icon,time,config:DIPLOMACY,buyables:BUYABLES}));return;}
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
 if(getUILocale()!=='ja'&&isLegacy(state)){const translated=legacyFacilitySummary(state,id);if(translated!==null)return translated;}
 if(getUILocale()!=='ja'&&!isLegacy(state))return compactFacility(state,id);
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
    }[id] || (f.specialistSpeed?'技能作業 +'+Math.round(f.specialistSpeed*100)+'%':f.trainingSpeed?'全戦闘訓練 +'+Math.round(f.trainingSpeed*100)+'%':f.population?'人口上限 '+campPopulationCapacity(state)+'人':'建設済み'))
  );
}
function renderSurvivor() {
  const stats = getStats(state),
    health = Math.max(0, state.run.hp);
  setHTML(
    "#survivor",
    getUILocale()!=='ja'?englishSurvivor(state,icon,time,progress):`<div class="panel-heading"><h2>${icon("shield")}灯守の状態</h2><span class="status-dot ${state.run.status}">${state.run.status === "combat" ? "戦闘中" : state.run.status === "dead" ? "死亡" : "準備中"}</span></div><div class="health-heading"><span>${icon("heart")}生命力</span><strong>${formatHealth(health)} <small>/ ${formatHealth(stats.maxHp)}</small></strong></div><div class="health-track"><i style="width:${progress(health / stats.maxHp)}%"></i></div><div class="combat-stats"><div>${icon("sword")}<span>攻撃力</span><strong>${stats.attack}</strong></div><div>${icon("shield")}<span>防御力</span><strong>${stats.defense}</strong></div></div>${skillLevel("combat").level > 1 ? `<div class="combat-growth"><span>周回の戦闘 Lv.${skillLevel("combat").level}</span><strong>攻撃 +${getSkillEffects(state, "combat").runAttack} · 最大HP +${getSkillEffects(state, "combat").runMaxHp}</strong></div>` : ""}<div class="survival-time"><span>${icon("clock")}この命の時間</span><strong>${time(state.run.elapsed)}</strong></div><div class="auto-food">${icon("food")}<span>食料はピンチになると自動で使用</span><b>${format(getTotalFood(state))}</b></div>`,
  );
  setHTML(
    "#equipment",
    `<div class="panel-heading equipment-heading"><h2>${uiText('status.equipment')}</h2><span>${uiText('status.autoEquip')}</span></div><div class="equipment-list">${Object.entries(
      slotNames,
    )
      .map(([slot, name]) => {
        const item = state.run.equipment[slot];
        return `<div class="equipment-slot ${item ? "has-item" : ""}"><span class="equipment-icon">${icon(slotIcons[slot])}</span><div><small>${escape(equipmentSlotName(slot))}</small><strong>${item ? escape(entityText('recipe',RECIPES.find(d=>d.id===item.id)||item)) : uiText('status.empty')}</strong></div>${item ? icon("check") : '<span class="empty-slot">—</span>'}</div>`;
      })
      .join("")}</div>${gearMarkup(state,document.querySelector('.gear-panel')?.open,{codexOpen:document.querySelector('.accessory-codex')?.open,draftName:document.querySelector('[data-build-name]')?.value||''})}${companionMarkup(state,document.querySelector('.companion-codex')?.open)}${farmMarkup(state,document.querySelector('.farm-panel')?.open)}`,
  );
  setHTML(
    "#next-goal",
    `<div class="goal-note"><div>${icon("flame")}${uiText('status.next')}</div><p>${!state.run.equipment.weapon ? uiText('status.spear') : !state.run.equipment.shield ? uiText('status.shield') : state.run.wave >= 6 ? uiText('status.invest') : uiText('status.craft')}</p><button data-tab="${state.run.equipment.weapon && state.run.equipment.shield ? "legacy" : "craft"}" data-focus="next-goal">${state.run.equipment.weapon && state.run.equipment.shield ? uiText('status.skills') : uiText('status.workshop')}${icon("arrow")}</button></div>`,
  );
  setHTML(
    "#facilities",
    !getUnlocks(state).facilities
      ? ""
      : `<div class="panel-heading facility-heading"><h2>${uiText('status.facilities')}</h2><button data-tab="village" data-focus="village-shortcut" aria-label="${uiText('status.buildAria')}">${uiText('status.build')} ${icon("chevron")}</button></div>${Object.entries(
          FACILITIES,
        )
          .map(
            ([id, facility]) =>
              `<div class="facility-row ${state.run.facilities[id] ? "built" : ""}" title="${escape(getUILocale()!=='ja'?campFacilityDescription(state,id,facility.description):facility.description)}">${icon(id === "watchtower" ? "eye" : id === "barricade" ? "shield" : "heart")}<span>${escape(entityText('facility',{id,name:facility.name}))}</span><b>${facilitySummary(id)}</b></div>`,
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
              `<div class="journal-entry ${escape(entry.type)}"><time>${time(entry.time)}</time><span class="log-dot"></span><p>${escape(logText(entry,state))}</p></div>`,
          )
          .join("")
      : `<div class="journal-entry"><time>00:00</time><span class="log-dot"></span><p>${uiText('journal.empty')}</p></div>`,
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
    const retreat=dialog.querySelector("[data-command=abandon-menu],[data-route-withdraw]");if(retreat){if(state.run.routes?.active){delete retreat.dataset.command;retreat.dataset.routeWithdraw="1";retreat.textContent=uiText('battle.withdrawRoute');}else{delete retreat.dataset.routeWithdraw;retreat.dataset.command="abandon-menu";}}
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
    toast(uiText('notice.waveWon',{wave:activeBattle.wave}));
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
  setHTML("#mobile-queue-context",queueContext(state,id=>definitionName([...ACTIONS,...RECIPES].find(d=>d.id===id))||id));
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
  renderExtra("#journal-entries", replayAchievementsMarkup(state)+`${clearHistoryMarkup(state)}${state.meta.bestEndlessWave ? `<p class="fine-print">${escape(uiText('journal.endlessBest',{wave:state.meta.bestEndlessWave}))}</p>` : ""}` + earlyDefeatMarkup(state) + reportMarkup(state) + challengesMarkup(state));
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
    renderExtra("#queue-panel", queueTimingMarkup(state) + conditionalMarkup(state) + templatesMarkup(state,{draftName:document.querySelector('#template-name')?.value||''}));
  setHTML(
    "#session-notice",
    session.owned
      ? ""
      : '<div class="session-notice"><span>'+escape(uiText('chrome.otherTab'))+'</span><button class="button small muted" data-command="takeover">'+escape(uiText('chrome.takeover'))+'</button></div>',
  );
  for (const dialog of document.querySelectorAll("dialog[open]")) {
    const notice = dialog.querySelector(".session-dialog");
    if (session.owned) notice?.remove();
    else if (!notice)
      dialog.insertAdjacentHTML(
        "beforeend",
        '<div class="session-dialog session-notice">'+copySpan('chrome.otherTab')+'<button class="button small muted" data-command="takeover" data-ui-copy="chrome.takeover">'+escape(uiText('chrome.takeover'))+'</button></div>',
      );
  }
  syncCampSpace();
}

function helpMarkup() { return getUILocale()!=='ja'?englishHelp(FIRST_RAID_DELAY/60,icon):`<div class="dialog-heading"><div class="eyebrow">HOW TO SURVIVE · v${VERSION}</div><button class="icon-button" data-close="help-dialog" aria-label="閉じる" data-ui-aria="common.close">${icon("close")}</button></div><h2 id="help-title">ひとつ先の夜を、目指して。</h2><p class="dialog-lead">最初は短い命でも、その経験は無駄になりません。</p><ol class="guide-steps"><li><span>01</span><div><h3>資源を集める</h3><p>伐採・採掘・採集を選ぶと時間が動き、繰り返し作業します。一時停止後も、作業を選べば再開できます。最初の襲撃は${FIRST_RAID_DELAY / 60}分後です。</p></div></li><li><span>02</span><div><h3>工房で備える</h3><p>まずは木材4・石材2で石の槍を製作。装備は完成時に自動装着されます。回復ポーションを工房で製作すると、戦闘中の回復に使えます。食料は救護所で戦闘外に使います。</p></div></li><li><span>03</span><div><h3>襲撃を生き延びる</h3><p>敵が野営地へ攻めてきます。大きな戦闘画面で自動防衛を見守ります。一時停止も可能です。撃退後は元の作業へ戻ります。</p></div></li><li><span>04</span><div><h3>経験を次の命へ</h3><p>死亡すると資源・装備・進行レベルは失われます。使った技能の永続経験は残り、次の命の成長を速めます。</p></div></li></ol><p class="fine-print">初めて襲撃を防ぐと村の施設が解放されます。初達成のクエストで継承ポイントを得て、自動化などを解放できます。最初のボスを倒すと外交とオーグメントの3択が登場します。まずは資源・装備・食料の準備に集中しましょう。</p><div class="guide-tip">${icon("pause")}いつでも一時停止して計画できます。<br />裏画面でも進みます。設定で自動停止を選べます。ゲームを閉じている間は進みません。</div><button class="button gold full-width" data-close="help-dialog">野営地に戻る${icon("arrow")}</button>`; }
function showHelp(opener) {
  document.querySelector('#help-dialog').innerHTML=helpMarkup();
  showCampDialog(document.querySelector('#help-dialog'),opener);
}
subscribeLocale(()=>{const dialog=document.querySelector('#help-dialog[open]');if(!dialog)return;const focused=[...dialog.querySelectorAll('button')].indexOf(document.activeElement),top=dialog.scrollTop;preserveRenderScroll(document,()=>{dialog.innerHTML=helpMarkup();if(focused>=0)dialog.querySelectorAll('button')[focused]?.focus({preventScroll:true});dialog.scrollTop=top;});});

function showSettingsMenu() {
  state.settings.paused = true;
  document.querySelector("#settings-dialog").innerHTML = `<div class="dialog-heading"><div class="eyebrow">SETTINGS</div><button class="icon-button" data-close="settings-dialog" aria-label="${uiText('common.close')}" data-ui-aria="common.close">${icon("close")}</button></div><h2 id="settings-title">${copySpan('settings.heading')}</h2><p class="fine-print"><a href="./src/vendor/THIRD-PARTY-NOTICES.txt" target="_blank" rel="noopener">${copySpan('settings.licenses')}</a></p>${languageControlMarkup()}<section class="presentation-settings settings-options"><h3>${copySpan('settings.progress')}</h3><label><input id="pause-when-hidden" type="checkbox" ${state.settings.pauseWhenHidden ? "checked" : ""}> ${copySpan('settings.pauseHidden')}</label><h3>${copySpan('settings.audio')}</h3><label>${copySpan('settings.bgm')} <input id="music-volume" type="range" min="0" max="1" step="0.05" value="${state.settings.musicVolume ?? .15}"></label><label>${copySpan('settings.ambientWind')} <input id="ambient-volume" type="range" min="0" max="1" step="0.05" value="${state.settings.ambientVolume || 0}"></label><label>${copySpan('settings.sfx')} <input id="sound-volume" type="range" min="0" max="1" step="0.05" value="${state.settings.soundVolume}"></label><label><input id="effects-enabled" type="checkbox" ${state.settings.effectsEnabled ? "checked" : ""}> ${copySpan('settings.effects')}</label></section><section class="presentation-settings"><h3>${copySpan('settings.replay')}</h3><button class="button muted full-width" data-info="journal">${copySpan('settings.viewAchievements')}</button></section><section class="presentation-settings"><h3>${copySpan('settings.newChallenge')}</h3><p class="fine-print">${copySpan('settings.resetHint')}</p><button class="button muted full-width" data-command="reset-menu">${copySpan('settings.reset')}</button></section>`;
  document.querySelector("#settings-dialog").insertAdjacentHTML('beforeend','<section class="presentation-settings"><button class="button muted full-width" data-command="return-title">'+copySpan('title.return')+'</button></section>');
  document.querySelector("#settings-dialog").showModal();
  render();
}

function showSaveMenu() {
  state.settings.paused = true;
  document.querySelector("#save-dialog").innerHTML =
    `<div class="dialog-heading"><div class="eyebrow">${copySpan('save.eyebrow')}</div><button class="icon-button" data-close="save-dialog" aria-label="${uiText('common.close')}" data-ui-aria="common.close">${icon("close")}</button></div><h2 id="save-title">${copySpan('save.heading')}</h2><p class="dialog-lead">${copySpan('save.lead')}</p>${loadWarning ? `<div class="save-warning">${escape(loadWarning)}</div>` : ""}<div class="save-summary"><span>${copySpan('save.generation',{generation:state.meta.generation})}</span><strong>${copySpan('save.best',{wave:state.meta.bestWave})}</strong><span>${copySpan('save.survival',{time:time(state.run.elapsed)})}</span></div><div class="save-options"><button class="button gold-outline" data-command="export">${icon("save")}${copySpan('save.export')}</button><button class="button muted" data-command="import">${icon("book")}${copySpan('save.import')}</button></div><p class="fine-print">${copySpan('save.backupHint')}</p><button class="button gold full-width" data-command="save-now">${copySpan('save.now')}</button>`;
  document
    .querySelector("#save-dialog")
    .insertAdjacentHTML(
      "beforeend",
      `<details class="save-code"><summary>${copySpan('save.codeHeading')}</summary><p>${copySpan('save.codeHint')}</p><textarea id="save-code" aria-label="${uiText('save.codeLabel')}" data-ui-aria="save.codeLabel" placeholder="${uiText('save.codePlaceholder')}" data-ui-placeholder="save.codePlaceholder" spellcheck="false"></textarea><div><button class="button small muted" data-command="code-export">${copySpan('save.codeExport')}</button><button class="button small gold-outline" data-command="code-import">${copySpan('save.codeImport')}</button></div></details>`,
    );
  if (state.run.endless?.active) document.querySelector("#save-dialog").insertAdjacentHTML("beforeend", `<div class="save-options"><span>${copySpan('save.endless',{wave:state.run.wave,best:state.meta.bestEndlessWave||finalWaveForRun(state)})}</span><button class="button gold-outline" data-command="share-endless">${copySpan('save.shareEndless')}</button><button class="button muted" data-command="share-clear">${copySpan('save.shareClear')}</button></div>`);
  const backups = readBackups(localStorage);
  const resetBackup = readResetBackup(localStorage);
  if (resetBackup) document.querySelector("#save-dialog").insertAdjacentHTML("beforeend", `<div class="save-options"><span>${copySpan('save.beforeReset',{generation:resetBackup.meta.generation})}</span><button class="button muted" data-command="restore-reset">${copySpan('save.restoreReset')}</button></div>`);
  document.querySelector("#save-dialog").insertAdjacentHTML(
    "beforeend",
    `<details class="backup-list"><summary>${copySpan('save.backups',{count:backups.length})}</summary>${backups
      .map((entry, index) => {
        const saved = decodeRecord(entry.record);
        return `<div><span>${copySpan('save.backupRow',{date:formatDate(new Date(entry.savedAt),{dateStyle:'short',timeStyle:'medium'}),generation:saved.meta.generation,wave:saved.run.wave})}</span><button class="button small muted" data-backup="${index}">${copySpan('save.restore')}</button></div>`;
      })
      .join(
        "",
      )}${unreadableRecord(localStorage) ? '<button class="button small muted" data-command="export-original">'+copySpan('save.exportOriginal')+'</button>' : ""}</details>`,
  );
  if (isLegacy(state))
    document
      .querySelector("#save-dialog")
      .insertAdjacentHTML(
        "beforeend",
        '<button class="button muted full-width" data-command="migrate-now">'+copySpan('save.migrate')+'</button>',
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
  const comparisonMarkup = comparison ? `<div class="run-comparison"><span>${copySpan('death.compare')}</span><b>${signed(comparison.wave)}${copySpan('death.waveUnit')}</b><b>${copySpan('death.survival')} ${signed(comparison.seconds,time)}</b></div>` : '<div class="run-comparison"><span>'+copySpan('death.first')+'</span></div>';
  const retainedUnlocks = state.meta.upgrades
    .map((id) => {const u=LEGACY_UPGRADES.find(item=>item.id===id);return u?upgradeName(u):null;})
    .filter(Boolean);
  for (const dialog of document.querySelectorAll("dialog[open]"))
    dialog.close();
  document.querySelector("#death-dialog").innerHTML =
    `<div class="death-emblem">${icon("flame")}</div><div class="eyebrow">${copySpan('death.eyebrow')}</div><h2 id="death-title">${copySpan('death.title')}</h2><p class="dialog-lead">${copySpan('death.lead',{generation:state.meta.generation})}<br />${copySpan('death.leadHint')}</p><div class="death-stats"><div><small>${copySpan('death.time')}</small><strong>${time(state.run.elapsed)}</strong></div><div><small>${copySpan('death.defeated')}</small><strong>${state.run.wave}<span>${copySpan('death.waveUnit')}</span></strong></div><div><small>${copySpan('death.best')}</small><strong>${state.meta.bestWave}<span>${copySpan('death.waveUnit')}</span></strong></div></div>${comparisonMarkup}${runResultMarkup(state)}<div class="inheritance-heading">${icon("memory")}${copySpan('death.inheritance')}</div><div class="inheritance-list">${SKILLS.filter(skill=>skillVisible(state,skill.id)).map((skill) => `<div><span>${icon(skillIcons[skill.id])}${copySpan('entity.skill.'+skill.id+'.name')}</span><b>${copySpan('death.permanentLevel')}${getSkillProgress(state.run.startPermanentXp?.[skill.id] ?? Math.max(0,state.meta.skills[skill.id].xp-(gains[skill.id] || 0)),true).level} → ${skillLevel(skill.id, true).level}</b><small>+${format(gains[skill.id] || 0)} XP</small></div>`).join("")}</div><p class="death-tip">${state.run.equipment.weapon ? copySpan('death.equippedHint') : copySpan('death.firstHint')}</p><button class="button gold full-width" data-command="rebirth">${copySpan('death.rebirth')}${icon("arrow")}</button><p class="fine-print">${copySpan('death.resetHint')}</p>`;
  if (state.run.endless?.active) {
    document.querySelector('#death-title').textContent = uiText('death.endlessTitle',{wave:state.run.wave});
    document.querySelector('#death-dialog .death-tip').insertAdjacentHTML('afterend', '<button class="button gold-outline full-width" data-command="share-endless">'+copySpan('death.endlessImage')+'</button>');
  }
  const report = state.run.deathReport;
  if (report) {
    const tip = document.querySelector("#death-dialog .death-tip");
    const advice =
      report.food > 0
        ? uiText('death.potionsRemain')
        : uiText('death.noPotions');
    tip.innerHTML = copySpan(isLegacy(state)?(report.food>0?'legacy.death.foodRemain':'legacy.death.noFood'):(report.food>0?'death.potionsRemain':'death.noPotions'));
    tip.insertAdjacentHTML(
      "beforebegin",
      lastHitMarkup(report,format,state),
    );
  }
  document
    .querySelector("#death-dialog .death-tip")
    .insertAdjacentHTML(
      "beforebegin",
      deathLegacyMarkup(state),
    );
  if (state.run.status === "cleared") {
    document.querySelector('#death-dialog .death-tip').insertAdjacentHTML('afterend',replayAchievementsMarkup(state));
    document.querySelector("#death-title").textContent = uiText('death.finalClear');
    document.querySelector('#death-dialog .death-tip').insertAdjacentHTML('afterend', `<button class="button gold-outline full-width" data-command="start-endless">${copySpan('death.endless')}</button><p class="fine-print">${escape(uiText('death.endlessHint',{wave:finalWaveForRun(state)+1}))}</p>`);
    document.querySelector("#death-dialog .dialog-lead").textContent =
      uiText('death.clearLead',{generation:state.meta.generation});
    document.querySelector("#death-dialog .death-stats").insertAdjacentHTML('beforebegin', `<div class="clear-achievement">${icon('trophy')}<strong>${escape(uiText('death.clearGeneration',{generation:state.meta.generation}))}</strong><button class="button gold-outline" data-command="share-clear">${icon('save')}記録画像を保存</button></div>`);
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
  if (button.closest("#header-menu-dialog") && !button.dataset.close && !button.dataset.info && button.dataset.command!=="acceleration" && button.dataset.command!=="help" && button.dataset.command!=="abandon-menu" && button.dataset.command!=="updates-menu") headerMenuDialog.close();

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
    if(r.ok){state=r.state;refreshCatalog();saveFailed=false;toast(uiText('unlock.saved'));}else toast(r.reason);render();return;
  }
  if (button.dataset.workerUpgrade) {
    const r = upgradeWorker(state, button.dataset.workerUpgrade);
    if (!r.ok) toast(r.reason);
    saveGame();
  }
  if (button.dataset.template !== undefined) {
    const r = loadTemplate(state, Number(button.dataset.template));
    if (!r.ok) toast(r.reason);
    else { markQueueEdited(); toast(uiText('notice.queueAddedCount',{count:r.added})); }
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
    selectWorkMenu('home');return;
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
  if(button.dataset.contractAccept||button.dataset.contractDeliver||button.dataset.contractCancel){const type=button.dataset.contractAccept?"accept":button.dataset.contractDeliver?"deliver":"cancel",id=button.dataset.contractAccept||button.dataset.contractDeliver;const r=editStoredContract(localStorage,state,{type,id},{isOwner:()=>session.owned});if(r.ok){state=r.state;refreshCatalog();render();toast(type==="deliver"?uiText('contract.deliveredSaved'):type==="cancel"?uiText('contract.cancelled'):uiText('contract.accepted'));}else toast(r.reason);return;}
  if(button.dataset.route||button.dataset.routeWithdraw){const r=editStoredRoute(localStorage,state,button.dataset.route,{withdraw:!!button.dataset.routeWithdraw,isOwner:()=>session.owned});if(r.ok){state=r.state;refreshCatalog();render();}else toast(r.reason);return;}
  if(button.dataset.farm){const r=editStoredFarm(localStorage,state,button.dataset.farm,{isOwner:()=>session.owned});if(r.ok){state=r.state;refreshCatalog();toast(uiText('notice.farmSaved'));}else toast(r.reason);return;}
  if(button.dataset.companion){const id=button.dataset.companion==='none'?null:button.dataset.companion;companionProposal=proposeCompanion(state,id);if(!companionProposal.ok){toast(companionProposal.reason);return;}companionDialog.innerHTML=companionConfirmation(state,id);companionDialog.showModal();return;}
  if(button.dataset.companionConfirm){const r=confirmStoredCompanion(localStorage,state,companionProposal,{isOwner:()=>session.owned});if(r.ok){state=r.state;companionDialog.close();refreshCatalog();toast(uiText('companion.saved'));}else{const error=companionDialog.querySelector('[data-companion-error]');if(error)error.textContent=r.reason;toast(r.reason);}render();return;}
  if(button.dataset.alchemyUse||button.dataset.alchemyTarget){const choice=button.dataset.alchemyTarget?{type:'target',id:button.dataset.alchemyTarget}:{type:'use',id:button.dataset.alchemyUse,value:!state.settings.alchemyUse?.[button.dataset.alchemyUse]};const r=editStoredMagic(localStorage,state,choice,{isOwner:()=>session.owned});if(r.ok){state=r.state;refreshCatalog();toast(uiText('magic.saved'));}else toast(r.reason);render();return;}
  if(button.dataset.equipWeapon||button.dataset.equipEquipment||button.dataset.equipAccessory){
    const choice=button.dataset.equipEquipment?{type:"equipment",id:button.dataset.equipEquipment}:button.dataset.equipWeapon?{type:'weapon',id:button.dataset.equipWeapon}:{type:'accessory',id:button.dataset.equipAccessory==='none'?null:button.dataset.equipAccessory,phase:button.dataset.gearPhase,slot:button.dataset.gearSlot};
    const result=editStoredGear(localStorage,state,choice,{isOwner:()=>session.owned});if(result.ok){state=result.state;refreshCatalog();saveFailed=false;toast(uiText('gear.saved'));}else toast(result.reason);render();return;
  }
  if(button.dataset.showOwnedAccessories){showOwnedAccessories=!showOwnedAccessories;render();return;}

  if(button.dataset.legacyCategory){legacyCategory=button.dataset.legacyCategory;saveUiPreference(localStorage,'loopkeeper-legacy-category-v1',legacyCategory);render();document.querySelector('[data-legacy-category="'+legacyCategory+'"]').focus({preventScroll:true});return;}
  if(button.dataset.repeatCraft){const stop=state.run.manualRepeat===button.dataset.repeatCraft,result=editStoredManualRepeat(localStorage,state,{stop,isOwner:()=>session.owned});if(result.ok||result.stopped){state=result.state;refreshCatalog();lastTick=performance.now();render();toast(!result.ok?result.reason:stop?'連続製作を停止しました。':'材料が尽きるまで鉄を連続製作します。');}else toast(result.reason);return;}
  if(button.dataset.villageCategory){villageFilter=button.dataset.villageCategory;saveUiPreference(localStorage,'loopkeeper-village-category-v1',villageFilter);render();document.querySelector('[data-village-category="'+villageFilter+'"]')?.focus({preventScroll:true});return;}
  if(button.dataset.craftCategory){selectedSkill=null;craftFilter=button.dataset.craftCategory;saveUiPreference(localStorage,'loopkeeper-craft-category-v1',craftFilter);render();document.querySelector('[data-craft-category="'+craftFilter+'"]').focus({preventScroll:true});return;}
  if(button.dataset.accessorySource){for(const dialog of document.querySelectorAll('dialog[open]:not(#expanded-work-dialog)'))dialog.close();tab='craft';selectedSkill='smithing';craftFilter='accessory';saveUiPreference(localStorage,'loopkeeper-craft-category-v1',craftFilter);render();return;}
  if(button.dataset.buildSave||button.dataset.buildUpdate||button.dataset.buildDelete){const type=button.dataset.buildSave?'save':button.dataset.buildUpdate?'update':'delete',id=Number(button.dataset.buildUpdate||button.dataset.buildDelete)||null,name=document.querySelector('[data-build-name]')?.value||'';const r=editStoredBuild(localStorage,state,{type,id,name},{isOwner:()=>session.owned});if(r.ok){state=r.state;refreshCatalog();render();toast(type==='delete'?uiText('preset.deleted'):uiText('preset.saved'));}else toast(r.reason);return;}
  if(button.dataset.buildRestore){buildProposal=proposeBuildRestore(state,Number(button.dataset.buildRestore),RECIPES);if(!buildProposal.ok){toast(buildProposal.reason);return;}buildRestoreDialog.innerHTML=buildRestoreMarkup(state,buildProposal);buildRestoreDialog.showModal();return;}
  if(button.dataset.buildConfirm){const r=editStoredBuild(localStorage,state,{type:'restore',proposal:buildProposal},{isOwner:()=>session.owned});if(r.ok){state=r.state;buildRestoreDialog.close();refreshCatalog();render();toast(r.missing.length?uiText('preset.partial'):uiText('preset.restored'));}else{buildRestoreDialog.querySelector('[data-build-error]').textContent=r.reason;toast(r.reason);}return;}
  if(button.dataset.trainBuild){renderSurvivor();const result=trainBuild(state),out=document.querySelector('#gear-training-result');if(out)out.textContent=getUILocale()!=='ja'?(result.ok?uiText('trainingReport.summary',{wave:result.wave,result:uiText(result.won?'trainingReport.won':'trainingReport.lost'),seconds:result.seconds,hits:result.playerHits,critical:result.criticalHits,damage:Math.round(result.playerDamage),counter:Math.round(result.counterDamage),pet:Math.round(result.petDamage),prevented:Math.round(result.companion.turtlePrevented),magic:Math.round(result.magicDamage),casts:result.magic.casts,detonations:result.magic.detonations,catalyst:result.alchemySpent.catalyst,ward:result.alchemySpent.ward}):reasonText(state,result.reason)):(result.ok?'WAVE '+result.wave+' ・ '+(result.won?'撃退':'未撃退')+' ・ '+result.seconds+'秒 ・ 本人 '+result.playerHits+'撃 / 会心 '+result.criticalHits+'回 ・ 本人ダメージ '+Math.round(result.playerDamage)+' / 反撃 '+Math.round(result.counterDamage)+' / 相棒追撃 '+Math.round(result.petDamage)+' ・ 相棒の軽減 '+Math.round(result.companion.turtlePrevented)+' / 魔法 '+Math.round(result.magicDamage)+' ・ 詠唱 '+result.magic.casts+' / 爆発 '+result.magic.detonations+' ・ 触媒 '+result.alchemySpent.catalyst+' / 護符液 '+result.alchemySpent.ward+'消費':result.reason);return;}
  if(button.dataset.buyRank||button.dataset.refundRank||button.dataset.toggleRank||button.dataset.resetRanks||button.dataset.cancelDraft){
    const key=button.dataset.buyRank||button.dataset.refundRank||button.dataset.toggleRank,type=button.dataset.cancelDraft?'cancel':button.dataset.resetRanks?'reset':button.dataset.buyRank?'buy':button.dataset.refundRank?'refund':'toggle';
    const result=editStoredLegacyRank(localStorage,state,{key,type},{isOwner:()=>session.owned});
    if(result.ok){state=result.state;refreshCatalog();saveFailed=false;toast(type==='refund'?uiText('unlock.refunded'):uiText('unlock.savedRank'));}else toast(result.reason);
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
    if (!result.ok) toast(result.reason,button.dataset.queueWork);
    else if(result.skipped)toast(uiText('notice.skipReached'));
    else { resumeSelectedWork(); toast(uiText('notice.queued')); }
    saveGame();
  }
  if(button.dataset.useMeal){const result=useMeal(state,button.dataset.useMeal);toast(result.ok?uiText('notice.mealUsed'):result.reason);saveGame();}
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
      button.dataset.smartCraft,
    );
    saveGame();
  }
  if (button.dataset.marketSide) {
    marketSide = button.dataset.marketSide;saveUiPreference(localStorage,"loopkeeper-market-side-v1",marketSide);
  }
  if(button.dataset.merchantTrade){const r=editStoredMerchant(localStorage,state,{id:button.dataset.merchantTrade,side:marketSide,count:marketCount,visit:Number(button.dataset.merchantVisit)},{isOwner:()=>session.owned});if(r.ok){state=r.state;refreshCatalog();toast(uiText('market.traded',{count:r.count}));}else toast(r.reason);render();return;}
  if (button.dataset.tradeResource) {
    const result = tradeResource(state, button.dataset.tradeResource, marketSide, marketCount);
    toast(result.ok ? uiText(marketSide==='sell'?'market.sold':'market.bought',{count:result.count}) : tradeReason(state,button.dataset.tradeResource,marketSide,marketCount,result));
    saveGame();
  }
  if (button.dataset.buySupply) {
    const result = buySupply(state, button.dataset.buySupply);
    toast(result.ok ? uiText('market.supplyDone') : result.reason,button.dataset.buySupply);
    saveGame();
  }
  if(button.dataset.gatherView){const result=saveGatherView(localStorage,button.dataset.gatherView);if(result.ok){gatherView=result.view;gatherTried=result.tried;}else toast("表示設定を保存できませんでした。現在の表示を保持します。");}
  if(button.dataset.gatherDetail){const id=button.dataset.gatherDetail,card=document.querySelector('[data-action="'+CSS.escape(id)+'"]')?.closest(".gather-card"),action=ACTIONS.find(a=>a.id===id);if(card && action){gatherDetailId=id;state.settings.paused=true;gatherDetailDialog.innerHTML='<div class="dialog-heading"><h2 id="gather-detail-title">'+escape(entityText('action',action))+'</h2><button class="icon-button" data-close="gather-detail-dialog" aria-label="閉じる" data-ui-aria="common.close">×</button></div>'+card.querySelector(".action-summary").innerHTML+card.querySelector(".action-details").innerHTML+(card.querySelector(".gather-reservation")?.outerHTML || "");gatherDetailDialog.showModal();}}
  if (button.dataset.action) {
    const result = selectManualAction(state, button.dataset.action);
    if (!result.ok) toast(result.reason,button.dataset.action);
    else if (!resumeSelectedWork())
      toast(uiText('notice.workBeforeAugment'));
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
      
      setHTML('#material-priority-dialog',materialPriorityMarkup(state,result.proposal));
      showCampDialog(materialPriorityDialog,button);
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
      toast(uiText(result.changed===false?'priority.unchangedToast':'priority.savedToast'));
      break;
    }
    case "takeover":
      session.takeover().then((acquired) => {
        if (!acquired) toast(uiText('notice.otherTabs'));
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
      toast(uiText('template.savedOverwrite',{name:result.name}));
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
      else toast(uiText('notice.rerolled'));
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
        manualPauseKey=state.settings.paused?"queueUi.manualPause":"";manualPauseReason=state.settings.paused?"手動で一時停止しています。":"";
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
      if(result.ok&&!wasActive&&state.settings.paused)toast(uiText('notice.speedPrepared'));
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
      manualPauseKey="queueUi.interrupted";manualPauseReason="作業を中断しました。";
      stopAction(state);
      if (!state.run.activeAction && state.run.status === "preparing")
        state.settings.paused = true;
      saveGame();
      break;
    case "help":
      showHelp(button);
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
      const dialog = document.querySelector("#updates-dialog");
      dialog.innerHTML = changelogMarkup();
      showCampDialog(dialog,button);
      dialog.scrollTop = 0;
      render();
      break;
    }
    case "return-title": {
      if(!session.owned){toast(titleText('title.returnFailed'));break;}
      state.settings.paused=true;
      saveFailed=true;
      saveGame(true,true);
      if(saveFailed||foundationPending||farmOfflinePending||!session.owned){render();toast(titleText('title.returnFailed'));break;}
      location.reload();
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
          ? uiText('save.failed')
          : uiText('save.saved'),
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
      const result = trainingMode(state,queueDraftId)?queueTraining(state,queueDraftId,trainingDraftTarget(state,queueDraftId,queueDraftCount),button.dataset.command === "queue-add-front" ? "front" : "end"):queueAction(state, queueDraftId, singleUse(queueDraftId) ? 1 : queueDraftCount, button.dataset.command === "queue-add-front" ? "front" : "end");
      if (!result.ok) toast(result.reason);
      else if(result.skipped)toast(uiText('notice.skipReached'));
      saveGame();
      break;
    }
    case "queue-condition-add": {
      if (!isLegacy(state)) {
        const request = conditionalRequest();
        const result = enqueueConditional(state, request.id, request.until);
        toast(result.ok ? uiText('notice.conditionalQueued') : result.reason);
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
      dialog.innerHTML = `<div class="dialog-heading"><h2 id="reset-title">${copySpan('reset.heading')}</h2><button class="icon-button" data-close="reset-dialog" aria-label="${uiText('common.close')}" data-ui-aria="common.close">${icon("close")}</button></div><p class="dialog-lead">${copySpan('reset.body',{generation:state.meta.generation})}</p><p class="fine-print">${copySpan('reset.keeps')}</p><label class="reset-ack"><input type="checkbox" id="replay-reset-ack"> ${copySpan('reset.ack')}</label><div class="save-options"><button class="button muted" data-close="reset-dialog">${copySpan('common.cancel')}</button><button class="button gold" data-command="reset-confirm" disabled>${copySpan('reset.confirm')}</button></div>`;
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
        toast(uiText('reset.failed'));
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
      toast(uiText('reset.started'));
      break;
    }
    case "restore-reset": {
      const previous = readResetBackup(localStorage);
      if (!previous) { toast(uiText('reset.missing')); break; }
      const dialog = document.querySelector("#reset-dialog");
      dialog.dataset.restore = "true";
      dialog.innerHTML = `<div class="dialog-heading"><h2 id="reset-title">${copySpan('reset.restoreHeading')}</h2><button class="icon-button" data-close="reset-dialog" aria-label="${uiText('common.close')}" data-ui-aria="common.close">${icon("close")}</button></div><p class="dialog-lead">${copySpan('reset.restoreBody',{generation:previous.meta.generation,wave:previous.meta.bestWave})}</p><div class="save-options"><button class="button muted" data-close="reset-dialog">${copySpan('common.cancel')}</button><button class="button gold" data-command="restore-reset-confirm">${copySpan('reset.restoreConfirm')}</button></div>`;
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
        toast(uiText('reset.restoreFailed'));
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
      toast(uiText('notice.resetRestored'));
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
      toast(uiText('notice.endlessStarted'));
      break;
    }
    case "abandon-menu":
      if (!["preparing", "combat"].includes(state.run.status)) {toast("進行中の周回だけ切り上げられます。");break;}
      if(button.closest('#header-menu-dialog'))showCampDialog(abandonDialog,button);
      else {overlayPause.set(abandonDialog,state.settings.paused);state.settings.paused=true;abandonDialog.showModal();}
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
function applyQueuedNumberInput(input){const draft=queuedNumberContext(input),index=queuedNumberEditIndex(state,draft);if(index<0){toast(uiText('notice.queueStale'));return false;}if(input.value===draft.displayedValue||queuedNumberEditValue(state,draft)===input.valueAsNumber)return true;const result=input.dataset.queueTrainingLevel!==undefined?editQueuedTrainingLevel(state,index,input.valueAsNumber):editQueuedAction(state,index,input.valueAsNumber);if(!result.ok)toast(result.reason);else {queuedNumberDrafts.set(input,captureQueuedNumberEdit(state,input));saveGame();}return result.ok;}
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
    queueDraftCount = trainingMode(state,queueDraftId)?undefined:1;
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
  toast(uiText('save.exported'));
}

document
  .querySelector("#import-input")
  .addEventListener("change", async (event) => {
    const file = event.target.files[0];
    event.target.value = "";
    if (!file) return;
    if (file.size > 1_000_000) {
      toast(uiText('save.tooLarge'));
      return;
    }
    try {
      importSaveText(await file.text());
    } catch {
      toast(uiText('save.readFailed'));
    }
  });

function importSaveText(text) {
  // File reads are asynchronous; another tab may have taken over meanwhile.
  if (!session.owned) {
    toast(uiText('save.notOwner'));
    return;
  }
  const imported = parseSave(text);
  if (!imported) {
    toast(uiText('save.invalid'));
    return;
  }
  try {
    state = replaceStoredGame(localStorage, state, imported);
  } catch {
    toast(uiText('save.importFailed'));
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
  toast(uiText('save.imported',{generation:state.meta.generation}));
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
    toast(uiText('notice.queueReordered'));
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
    toast(uiText('notice.chooseFirstAugment'));
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
  if(villageDashboard){villageDashboard.updateWork(state.run.activeAction,state.settings.effectsEnabled&&!state.settings.paused&&state.run.status==='preparing'&&!document.querySelector('dialog[open]'));return;}
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
  if (label && action) setTextIfChanged(label, uiText('work.elapsed',{current:Math.min(action.progress,action.duration).toFixed(1),total:action.duration.toFixed(1)}));
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
  toast(optional ? uiText('notice.optionalFailure') : uiText('notice.engineFailure'));
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

// Locale updates redraw only the existing live shell, never the game state.
subscribeLocale(()=>{const dialog=document.querySelector('#death-dialog[open]:not([data-setup])');if(dialog)preserveRenderScroll(document,()=>{const result=dialog.querySelector('.run-result');if(result)result.outerHTML=runResultMarkup(state);const early=dialog.querySelector('[data-early-defeat]');if(early)early.outerHTML=earlyDefeatMarkup(state);for(const [selector,markup]of [['.battle-recaps',reportMarkup],['.challenges',challengesMarkup]]){const node=dialog.querySelector(selector);if(node){const open=node.open,focused=node.contains(document.activeElement);node.outerHTML=markup(state);const next=dialog.querySelector(selector);if(next){next.open=open;if(focused)next.querySelector('summary').focus({preventScroll:true});}}}if(state.run.endless?.active)dialog.querySelector('#death-title').textContent=uiText('death.endlessTitle',{wave:state.run.wave});else if(state.run.status==='cleared'&&!isFrontierFinish(state)){dialog.querySelector('#death-title').textContent=uiText('death.finalClear');dialog.querySelector('.dialog-lead').textContent=uiText('death.clearLead',{generation:state.meta.generation});}const achievements=dialog.querySelector('.replay-achievements');if(achievements){const list=achievements.querySelector('[data-replay-list]'),open=list?.open,focused=list?.contains(document.activeElement);achievements.outerHTML=replayAchievementsMarkup(state);const next=dialog.querySelector('.replay-achievements [data-replay-list]');if(next){next.open=!!open;if(focused)next.querySelector('summary').focus({preventScroll:true});}}const hit=dialog.querySelector('.last-hit-report');if(hit&&state.run.deathReport)hit.outerHTML=lastHitMarkup(state.run.deathReport,format,state);const legacy=dialog.querySelector('.death-legacy');if(legacy)legacy.outerHTML=deathLegacyMarkup(state);refreshFrontierFinishCopy(dialog,state);});render();});

subscribeLocale(()=>{if(!companionDialog.open||!companionProposal?.ok)return;const index=[...companionDialog.querySelectorAll('button')].indexOf(document.activeElement),error=companionDialog.querySelector('[data-companion-error]')?.textContent||'',top=companionDialog.scrollTop;preserveRenderScroll(document,()=>{companionDialog.innerHTML=companionConfirmation(state,companionProposal.id);companionDialog.querySelector('[data-companion-error]').textContent=error;if(index>=0)companionDialog.querySelectorAll('button')[index]?.focus({preventScroll:true});companionDialog.scrollTop=top;});});

subscribeLocale(()=>{if(!buildRestoreDialog.open||!buildProposal?.ok)return;const index=[...buildRestoreDialog.querySelectorAll('button')].indexOf(document.activeElement),error=buildRestoreDialog.querySelector('[data-build-error]')?.textContent||'',top=buildRestoreDialog.scrollTop;preserveRenderScroll(document,()=>{buildRestoreDialog.innerHTML=buildRestoreMarkup(state,buildProposal);buildRestoreDialog.querySelector('[data-build-error]').textContent=error;if(index>=0)buildRestoreDialog.querySelectorAll('button')[index]?.focus({preventScroll:true});buildRestoreDialog.scrollTop=top;});});

subscribeLocale(()=>{const dialog=document.querySelector('#augment-exclude-dialog[open]');if(!dialog||!pendingAugmentExclude)return;const index=[...dialog.querySelectorAll('button')].indexOf(document.activeElement),error=dialog.querySelector('[data-exclusion-error]')?.textContent||'',top=dialog.scrollTop;preserveRenderScroll(document,()=>{dialog.innerHTML=augmentExclusionMarkup(state,pendingAugmentExclude,error);if(index>=0)dialog.querySelectorAll('button')[index]?.focus({preventScroll:true});dialog.scrollTop=top;});});

subscribeLocale(()=>{if(!templateOverwriteDialog.open||!templateOverwriteProposal)return;const index=[...templateOverwriteDialog.querySelectorAll('button')].indexOf(document.activeElement),top=templateOverwriteDialog.scrollTop;preserveRenderScroll(document,()=>{templateOverwriteDialog.innerHTML=templateOverwriteMarkup(state,templateOverwriteProposal);if(index>=0)templateOverwriteDialog.querySelectorAll('button')[index]?.focus({preventScroll:true});templateOverwriteDialog.scrollTop=top;});});

subscribeLocale(()=>{const dialog=document.querySelector('#updates-dialog[open]');if(!dialog)return;const focused=[...dialog.querySelectorAll('button')].indexOf(document.activeElement),top=dialog.scrollTop;preserveRenderScroll(document,()=>{dialog.innerHTML=changelogMarkup();if(focused>=0)dialog.querySelectorAll('button')[focused]?.focus({preventScroll:true});dialog.scrollTop=top;});});
