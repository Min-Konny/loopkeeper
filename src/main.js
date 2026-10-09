import { tradeResource } from "./engine.js?v=0.3.11";
import { changelogMarkup } from "./changelog.js?v=0.3.11";
import { createBackgroundClock } from "./background-clock.js?v=0.3.11";
import { updateSetupDialog } from "./setup-dialog.js?v=0.3.11";
import { compareRun } from './visual-design.js?v=0.3.11';
import { createRenderGuard } from './render-guard.js?v=0.3.11';
import { installQueueDrag } from './queue-drag.js?v=0.3.11';
import { preparationMarkup } from './preparation-ui.js?v=0.3.11';
import { saveClearCard } from './clear-card.js?v=0.3.11';
import { runFrameTasks } from './frame-loop.js?v=0.3.11';
import { getCatalog } from "./engine.js?v=0.3.11";
import { CONTENT } from "./content.js?v=0.3.11";
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
} from "./engine.js?v=0.3.11";
import {
  setupMarkup,
  diplomacyMarkup,
  autoCookingMarkup,
  processingMarkup,
  diplomacyDeadlineMarkup,
  automationMarkup,
  templatesMarkup,
  milestoneMarkup,
  synergyMarkup,
} from "./mvp-ui.js?v=0.3.11";
import { createSessionOwner } from "./session-owner.js?v=0.3.11";
import { editQueuedAction, moveQueuedAction } from "./engine.js?v=0.3.11";
import {
  loadStoredGame,
  writeStoredGame,
  readBackups,
  decodeRecord,
  unreadableRecord,
} from "./save-storage.js?v=0.3.11";
import {
  updatePresentation,
  markQueueEdited,
  unlockAudio,
  previewSound,
} from "./presentation.js?v=0.3.11";
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
  serializeGame,
  parseSave,
} from "./engine.js?v=0.3.11";
import { icon } from "./icons.js?v=0.3.11";
import { planCraft, queueCraft, queueAction, queueWork, selectManualAction, blockedReservation, recoverReservation } from "./planner.js?v=0.3.11";
import {
  FIRST_RAID_DELAY,
  getUnlocks,
  getAugmentStatus,
  chooseAugment,
  getRecipeCost,
  getFoodHealing,
  getSkillEffects,
} from "./engine.js?v=0.3.11";
import { renderAugments } from "./augments-ui.js?v=0.3.11";
import { renderUpgradeSections } from "./upgrades-ui.js?v=0.3.11";
import { renderBattle, suspendBattle } from "./battle-ui.js?v=0.3.11";
import { mountCampScene } from "./camp-scene.js?v=0.3.11";
import { workScene, syncWorkAnimation } from "./work-scene.js?v=0.3.11";
import { getRecipeVisibility } from "./workshop.js?v=0.3.11";
import { getMilestoneStatus } from "./engine.js?v=0.3.11";
import {
  advanceTime,
  getAccelerationStatus,
  startAcceleration,
  stopAcceleration,
} from "./engine.js?v=0.3.11";

history.scrollRestoration = "manual";
let queueExpanded = false;
let loadWarning = "";
let state = loadGame();
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
let tab = "gather";
let selectedSkill = null;
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
let marketSide = "buy", marketCount = 1;
let craftFilter = "all";
const craftQuantities = {};
let activeBattle = null;
const skillIcons = {
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
  diplomacy: ["外交と交易", "食料を分かち合うか、武器を手に迎えるか。"],
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
  return `作業速度 +${effects.runSpeedPercent}%${skill === "combat" ? ` · 攻撃 +${effects.runAttack} · 最大HP +${effects.runMaxHp}` : ""}`;
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
  return createGame();
}

function saveGame(force = false, checkpoint = false) {
  if (!session.owned || (loadWarning && !force)) return;
  try {
    writeStoredGame(localStorage, state, { checkpoint });
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
  return element?.contains(active) && active.matches('input, textarea, select') && active !== committedSelect;
}

function setHTML(selector, html) {
  const el = document.querySelector(selector);
  if (el.dataset.lastHtml === html) return;
  // Keep selection and partially typed values intact until the editor loses focus.
  if (editingWithin(el)) return;
  const focusKey = el.contains(document.activeElement)
    ? document.activeElement.dataset.focus
    : null;
  const scrollPositions = [...el.querySelectorAll('[data-scroll-key]')].map(node => ({
    key: node.dataset.scrollKey, top: node.scrollTop,
  }));
  el.innerHTML = html;
  el.dataset.lastHtml = html;
  for (const position of scrollPositions) {
    const scroller = el.querySelector(`[data-scroll-key="${CSS.escape(position.key)}"]`);
    if (scroller) scroller.scrollTop = position.top;
  }
  if (focusKey)
    el.querySelector(`[data-focus="${CSS.escape(focusKey)}"]`)?.focus({
      preventScroll: true,
    });
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
    <button class="prototype-label updates-link" data-command="updates-menu">更新履歴 <b>v0.3.11</b></button>
  </aside>
  <div class="workspace">
    <header class="topbar"><div class="breadcrumb">${icon("camp")}<span>灰の辺境</span>${icon("chevron")}<strong>野営地</strong></div><div class="topbar-actions"><button class="dashboard-button" data-info="queue">行動予約</button><button class="dashboard-button" data-info="status">状態・装備</button><button class="dashboard-button" data-info="quests">クエスト</button><button class="dashboard-button" data-info="journal">記録</button><span id="save-status"></span><button class="icon-button" data-command="save-menu" title="データの保存" aria-label="データの保存">${icon("save")}</button><button class="icon-button" data-command="updates-menu" title="更新履歴" aria-label="更新履歴">${icon("history")}</button><button class="icon-button" data-command="settings-menu" title="設定" aria-label="設定">${icon("settings")}</button><button class="icon-button" data-command="help" title="遊び方" aria-label="遊び方">${icon("help")}</button></div></header>
    <main>
      <section class="page-heading"><div><div class="eyebrow">A LIFE TO REMEMBER</div><h1>辺境の野営地</h1><p>備え、抗い、次の命へつなぐ。</p></div><div id="time-controls" class="time-controls"></div></section>
      <div id="milestone"></div>
      <section class="camp-banner" aria-label="野営地と襲撃予報"><div class="camp-caption"><span class="location-tag"><i></i> THE ASHEN FRONTIER</span><h2>まだ、火は灯っている。</h2><p>森の向こうから、足音が近づいてくる。</p></div><div id="raid-forecast" class="raid-forecast"></div></section>
      <section id="resource-bar" class="resource-bar" aria-label="所持資源"></section><div id="diplomacy-notice"></div><div id="augments-panel"></div>
      <div id="session-notice"></div><div id="prep-status" class="prep-status" aria-label="準備状況"></div><div id="queue-warning"></div><div class="play-layout"><section class="work-area"><div class="section-heading"><div><h2 id="section-title"></h2><p id="section-description"></p></div><span id="work-label" class="subtle-label"></span></div><div id="active-work"></div><div id="content"></div></section><aside id="queue-preview" class="queue-preview" aria-label="行動予約の一覧"></aside></div>

      <footer><span>一度にひとつの行動。どんな順番で、何を残すか。</span><span>時間停止中・画面を離れている間は襲撃も停止します。</span></footer>
    </main>
  </div>`;

const infoDialog = document.createElement("dialog");
infoDialog.id = "info-dialog";
infoDialog.setAttribute("aria-labelledby", "info-title");
infoDialog.innerHTML = `<div class="dialog-heading"><h2 id="info-title">状態・装備</h2><button class="icon-button" data-close="info-dialog" aria-label="閉じる">${icon("close")}</button></div><div data-info-panel="status"><div id="survivor"></div><div id="equipment"></div><div id="facilities"></div><div id="next-goal"></div></div><div data-info-panel="queue" hidden><div id="queue-panel"></div></div><div data-info-panel="quests" hidden id="quest-list"></div><div data-info-panel="journal" hidden><section class="journal"><div class="journal-title">${icon("book")}<h2>焚き火の記録</h2><span>この命の足跡</span></div><div id="journal-entries" role="log" aria-label="ゲームの記録"></div></section></div>`;
document.body.append(infoDialog);
const singleUse = (id) => RECIPES.some((r) => r.id === id && (r.equipment || r.facility));

const resourceObserver = new ResizeObserver((entries) => {
  document.documentElement.style.setProperty(
    "--resource-height",
    `${entries[0].borderBoxSize?.[0]?.blockSize || entries[0].target.getBoundingClientRect().height}px`,
  );
});
resourceObserver.observe(document.querySelector("#resource-bar"));

const campScene = mountCampScene(document.querySelector(".camp-banner"));

function renderNavigation() {
  const unlocks = getUnlocks(state);
  setHTML(
    "#navigation",
    [
      ["gather", "leaf", "採集と訓練"],
      ["craft", "hammer", "工房"],
      ["village", "camp", "村の施設"],
      ["diplomacy", "flag", "外交と交易"],
      ["legacy", "memory", hasLegacyOptions() ? "継承" : "経験の継承"],
      ["workers", "people", "人員"],
    ]
      .filter(([id]) =>
        id === "workers" ? !isLegacy(state) && hasLegacyOptions() : id === "village"
          ? unlocks.facilities
          : id === "diplomacy"
            ? unlocks.diplomacy
            : true,
      )
      .map(
        ([id, symbol, name]) =>
          `<button class="nav-item ${tab === id ? "selected" : ""}" data-tab="${id}" data-focus="nav-${id}" aria-label="${name}" aria-current="${tab === id ? "page" : "false"}">${icon(symbol)}<span>${name}</span>${id === "legacy" && hasLegacyOptions() ? `<small>${state.meta.points} pt</small>` : icon("chevron")}</button>`,
      )
      .join(""),
  );
  setHTML(
    "#skill-list",
    SKILLS.map((skill) => {
      const run = skillLevel(skill.id),
        permanent = skillLevel(skill.id, true);
      return `<button class="sidebar-skill ${selectedSkill === skill.id ? "selected" : ""}" data-skill="${skill.id}" data-focus="skill-${skill.id}" aria-label="${escape(skill.name)}の技能、進行レベル${run.level}、永続レベル${permanent.level}" aria-pressed="${selectedSkill === skill.id}"><span class="skill-symbol ${skill.id}">${icon(skillIcons[skill.id])}</span><span class="compact-skill-level" aria-hidden="true">Lv.${run.level}</span><span class="skill-data"><span class="skill-row"><span>${escape(skill.name)}</span><span class="skill-numbers">${run.level} <b>/ ${permanent.level}</b></span></span><span class="thin-track"><i style="width:${progress(run.progress)}%"></i></span></span></button>`;
    }).join(""),
  );
  setHTML(
    "#generation",
    `<span class="generation-symbol">${icon("memory")}</span><div><small>繰り返す命</small><strong>第 ${format(state.meta.generation)} 世代</strong></div><span class="generation-number">${String(state.meta.generation).padStart(2, "0")}</span><span class="generation-compact" aria-label="第${state.meta.generation}世代"><b>${format(state.meta.generation)}</b>世代</span>`,
  );
}

function renderControls() {
  document.documentElement.classList.toggle(
    "effects-disabled",
    !state.settings.effectsEnabled,
  );
  const awaitingChoice = getAugmentStatus(state).offer.length > 0;
  const acceleration = getAccelerationStatus(state);
  const accelerationControl = acceleration.unlocked
    ? `<button class="button ${acceleration.active ? "gold-outline" : "muted"} acceleration-button" data-command="acceleration" data-focus="acceleration" aria-pressed="${acceleration.active}" title="${escape(acceleration.reason || "撃退済み区間の準備を5倍速で進める")}" ${!acceleration.active && !acceleration.eligible ? "disabled" : ""}>${icon("clock")}<span>${acceleration.active ? "加速中" : "周回復帰"} <small>5× · ${time(Math.ceil(acceleration.remainingSeconds))}</small></span></button>`
    : "";
  setHTML(
    "#time-controls",
    `${accelerationControl}<button class="button ${state.settings.paused ? "gold" : "muted"} pause-button" data-command="${awaitingChoice ? "show-augments" : "pause"}" data-focus="pause" ${["dead", "cleared", "legacy_setup"].includes(state.run.status) ? "disabled" : ""}>${icon(awaitingChoice ? "spark" : state.settings.paused ? "play" : "pause")}<span>${awaitingChoice ? "方針を選ぶ" : state.settings.paused ? "時間を進める" : "一時停止"}</span></button>`,
  );
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
  campScene.setActive(state.settings.effectsEnabled && !state.settings.paused && state.run.status === "preparing");
  campScene.setSettlement(state.run.facilities, state.meta.generation);
  const construction = RECIPES.find(d => d.id === state.run.activeAction?.id && d.facility);
  campScene.setConstruction(construction?.facility?.id, state.run.activeAction ? state.run.activeAction.progress / state.run.activeAction.duration : 0);
  campScene.setThreat(state.run.status === "preparing" ? Math.max(0, 1 - (state.run.nextWaveAt - state.run.elapsed) / 45) : 0, state.settings.paused);
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
  setHTML(
    "#raid-forecast",
    `<div class="forecast-top"><span class="${combat ? "danger-text" : ""}">${icon(combat ? "sword" : "eye")}${dead ? "この命は尽きた" : combat ? "襲撃中 · 自動戦闘" : "次の襲撃"}</span><b>${enemy.isBoss ? "BOSS · " : ""}WAVE ${String(state.run.wave + 1).padStart(2, "0")}</b></div><div class="forecast-main"><div><strong>${escape(enemy.name)}${enemy.trait === "flying" ? " · 飛行" : ""}</strong><small>${icon("sword")} ${enemy.attack} <span>·</span> ${icon("shield")} ${enemy.defense} <span>·</span> HP ${format(enemy.maxHp || enemy.hp)}</small></div><div class="countdown ${remaining < 15 ? "urgent" : ""}">${dead ? "—" : combat ? icon("sword") : time(Math.ceil(remaining))}<small>${combat ? "防衛中" : dead ? "輪廻へ" : state.settings.paused ? "時間停止中" : "到着まで"}</small></div></div><div class="forecast-track"><i style="width:${combat || dead ? 100 : progress(1 - remaining / (state.run.wave === 0 ? FIRST_RAID_DELAY + (state.run.facilities.watchtower ? 15 : 0) : getRaidInterval(state)))}%"></i></div><div class="forecast-bottom"><span>${enemy.isBoss ? (state.meta.defeatedBosses.includes(isLegacy(state) ? state.run.wave + 1 : enemy.id) ? "討伐済み · 報酬獲得済み" : "初撃破で継承 +1pt") : `撃退 ${state.run.wave} 回`}</span><span>${icon("trophy")}最高 ${state.meta.bestWave} 回</span></div>`,
  );
  setHTML(
    "#resource-bar",
    Object.entries(RESOURCES)
      .filter(([id]) => visibleResource(id))
      .map(
        ([id, resource]) =>
          `<div class="resource" data-resource="${id}" title="${escape(resource.name)}"><span class="resource-icon resource-${id}">${icon(id)}</span><div><small>${escape(resource.name)}</small><strong>${format(state.run.resources[id] || 0)}</strong></div></div>`,
      )
      .join(""),
  );
  if (!getUnlocks(state).diplomacy) {
    setHTML("#diplomacy-notice", "");
    return;
  }
  const quest = state.run.diplomacy;
  if (!isLegacy(state)) {
    setHTML("#diplomacy-notice", diplomacyDeadlineMarkup(state) + synergyMarkup(state));
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
    `<div class="active-work ${working ? "working" : ""} ${combat ? "battle" : ""}">${working && !combat ? workScene(activeDefinition.skill, activeDefinition.id, state.run.equipment) : `<div class="active-icon">${icon(combat ? "shield" : "clock")}</div>`}<div class="active-detail"><div><strong>${combat ? "野営地を防衛中" : working ? escape(activeDefinition.name) : "次の行動を選びましょう"}</strong><span>${combat ? "作業は戦闘後に再開" : working ? `<span data-work-time></span>` : state.settings.paused ? "時間は止まっています" : "襲撃までの時間は進みます"}</span></div><div class="work-track"><i data-live-work style="width:0%"></i></div>${preparationMarkup(state)}</div>${working ? `<button class="stop-button" data-command="stop" data-focus="stop" title="作業を中断" aria-label="作業を中断">${icon("close")}</button>` : ""}</div>`,
  );
  if (tab === "gather") renderGather();
  if (tab === "craft" || tab === "village") renderCraft();
  if (tab === "legacy") renderLegacy();
  if (tab === "workers") setHTML("#content", automationMarkup(state) || '<div class="village-intro">継承ポイントで仲間を雇うと、ここで作業先と強化を選べます。</div><button class="button gold-outline" data-tab="legacy">継承で人員を解放</button>');
  if (tab === "diplomacy") renderDiplomacy();
  renderQueue();
  document.querySelector('[data-info="queue"]').textContent = state.run.queue.length ? `行動予約 ${state.run.queue.length}` : "行動予約";
}

function renderGather() {
  setHTML(
    "#content",
    `${renderSkillOverview()}<div class="action-grid ${selectedSkill ? "filtered" : ""}">${ACTIONS.filter(
      (action) =>
        isLegacy(state) ? !action.knownAfterBoss : isKnown(state, action),
    )
      .filter((action) => !selectedSkill || action.skill === selectedSkill)
      .map((action) => {
        const focusedTraining = action.trainingStat && !isLegacy(state);
        const current = focusedTraining ? getSkillProgress(action.trainingStat === "attack" ? state.run.skills.combat.xp : state.run.training?.[action.trainingStat] || 0) : skillLevel(action.skill),
          permanent = skillLevel(action.skill, true);
        const active = state.run.activeAction?.id === action.id;
        const suspended = state.run.suspendedActions?.[action.id];
        const check = canStartAction(state, action.id);
        const locked = !check.ok && !active;
        const levelLocked = current.level < (action.unlockLevel || 1);
        const yields = Object.entries(action.yields || {});
        return `<article class="gather-card"><button class="action-card ${active ? "active" : ""} ${locked ? "locked" : ""}" data-action="${action.id}" data-focus="action-${action.id}" ${locked ? "disabled" : ""} aria-pressed="${active}"><div class="card-top"><span class="action-icon ${action.skill}">${icon(skillIcons[action.skill])}</span><span class="action-time">${icon(locked ? "lock" : "clock")}${levelLocked ? `進行 Lv.${action.unlockLevel}` : state.run.status === "combat" ? "襲撃中" : `${getActionDuration(state, action).toFixed(1)}秒`}</span></div><div class="action-name"><h3>${escape(action.name)}</h3>${active ? '<span class="active-pill">選択中</span>' : ""}</div>${action.id === "gather_food" || !yields.length ? `<p>${escape(action.id === "gather_food" ? `戦闘中、体力が55%以下になると自動で食べて${getFoodHealing(state)}回復。` : action.description)}</p>` : ""}<div class="action-yield">${yields.length ? yields.map(([id, amount]) => `<span>${icon(id)}${escape(resourceName(id))}<b>+${amount}</b></span>`).join("") : `<span>${icon(action.trainingStat === "defense" ? "shield" : action.trainingStat === "vitality" ? "heart" : "sword")}${focusedTraining ? `${{attack:"攻撃",defense:"防御",vitality:"最大HP"}[action.trainingStat]} +${(current.level-1)*({attack:2,defense:1.5,vitality:18}[action.trainingStat])}` : "戦闘経験を積む"}</span>`}${icon("arrow", "card-arrow")}</div><div class="card-levels"><span>${focusedTraining ? "訓練" : "進行"} <b>Lv.${current.level}</b></span><span class="permanent-text">${icon("memory")}永続 <b>Lv.${permanent.level}</b></span></div>${!focusedTraining && current.level > 1 ? `<div class="run-growth"><b>${runGrowth(action.skill)}</b></div>` : ""}${savedWorkNote(suspended)}<div class="card-skill-track"><i style="width:${progress(current.progress)}%"></i></div>${levelLocked ? `<div class="lock-reason">${escape(check.reason)}</div>` : ""}</button>${state.meta.upgrades.includes("action_queue") ? `<div class="gather-reservation"><label>回数<input type="number" min="1" max="99" step="1" inputmode="numeric" data-craft-count="${action.id}" data-focus="work-count-${action.id}" aria-label="${escape(action.name)}の予約回数" value="${craftQuantities[action.id] || 1}"></label><button data-queue-work="${action.id}" data-focus="queue-work-${action.id}" ${locked ? "disabled" : ""}>${state.run.queue.length ? "末尾に予約" : "行動予約"}</button>${state.run.queue.length ? `<button data-queue-work="${action.id}" data-queue-position="front" data-focus="queue-work-front-${action.id}" ${locked ? "disabled" : ""}>先頭に予約</button>` : ""}</div>` : ""}</article>`;
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
  const owned = state.meta.upgrades.includes("action_queue");
  const host = document.querySelector("#queue-preview");
  host.hidden = !owned;
  if (!owned) return;
  const enabled = !state.settings.disabledUpgrades.includes("action_queue");
  const issue = queueIssue();
  const status = issue ? "要確認" : !enabled ? "保留中" : state.settings.paused ? "時間停止中" : "実行中";
  setHTML("#queue-preview", `<div class="queue-preview-heading"><h3>${icon("book")}行動予約 <small>${state.run.queue.length}/8</small></h3><button data-info="queue">編集</button></div><div class="queue-preview-status ${issue ? "needs-attention" : ""}">${status}</div>${state.run.queue.length ? `<ol data-scroll-key="queue-preview">${state.run.queue.map((entry,index) => `<li data-queue-row="${index}" data-preview-goal="${entry.goalId ?? index}" class="${index === 0 && state.run.queueManaged && enabled ? "current" : ""}"><button class="queue-number queue-drag-handle" data-queue-drag="${index}" aria-label="予約${index + 1}の順番をドラッグで変更" title="ドラッグで並べ替え"><span class="queue-grip" aria-hidden="true">⋮⋮</span>${index+1}</button><span class="queue-preview-name">${escape([...ACTIONS,...RECIPES].find(d=>d.id===entry.id)?.name || entry.id)}</span><small>${singleUse(entry.id) ? "1回" : `残り${entry.count}回`}</small><button class="queue-preview-remove icon-button" data-queue-remove="${index}" ${entry.goalId !== undefined ? `data-queue-goal="${entry.goalId}"` : ""} aria-label="${escape([...ACTIONS,...RECIPES].find(d=>d.id===entry.id)?.name || entry.id)}の予約を削除">${icon("close")}</button></li>`).join("")}</ol><button class="button small" data-toggle-upgrade="action_queue">${enabled ? "予約を保留" : "予約を有効にする"}</button>` : '<p class="queue-preview-empty">予約した行動がここに並びます。</p>'}`);
}
function renderQueue() {
  renderQueuePreview();
  const unlocked = state.meta.upgrades.includes("action_queue");
  if (!unlocked) {
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
    `<section class="queue-box" aria-label="行動予約"><div class="queue-heading"><h3>${icon("book")}行動予約 <small>${state.run.queue.length} / 8</small></h3><button data-command="queue-expand" data-focus="queue-expand" aria-expanded="${queueExpanded}">${queueExpanded ? "追加欄を閉じる" : "作業を追加"}</button><button class="button small ${enabled ? "gold-outline" : "muted"}" data-toggle-upgrade="action_queue" data-focus="queue-toggle" aria-pressed="${enabled}">${enabled ? "予約を保留" : "予約を有効にする"}</button></div>${queueExpanded ? `<div class="queue-controls"><label>予約する作業<select id="queue-action" data-focus="queue-action" aria-label="予約する作業">${definitions.map((item) => `<option value="${item.id}" ${queueDraftId === item.id ? "selected" : ""}>${escape(item.name)}</option>`).join("")}</select></label>${draftSingle ? '<span class="queue-single">1回</span>' : `<label>回数<input id="queue-count" data-focus="queue-count" type="number" min="1" max="99" step="1" inputmode="numeric" aria-label="予約回数" value="${Number.isFinite(queueDraftCount) ? queueDraftCount : ""}"></label>`}<button class="button small gold-outline" data-command="queue-add" data-focus="queue-add" ${draftQueued >= 0 || state.run.queue.length >= 8 || state.run.status === "dead" ? "disabled" : ""}>末尾に追加</button><button class="button small gold-outline" data-command="queue-add-front" data-focus="queue-add-front" ${draftQueued === 0 || (draftQueued < 0 && state.run.queue.length >= 8) || state.run.status === "dead" ? "disabled" : ""}>${draftQueued >= 0 ? "先頭へ移す" : "先頭に追加"}</button></div>` : ""}${state.run.queue.length ? `<ol class="queue-list">${state.run.queue.map((entry, index) => `<li data-queue-row="${index}" class="${index === 0 && state.run.queueManaged ? "current" : ""}"><button class="queue-number queue-drag-handle" data-queue-drag="${index}" aria-label="予約${index + 1}の順番をドラッグで変更" title="ドラッグで並べ替え"><span class="queue-grip" aria-hidden="true">⋮⋮</span>${index + 1}</button><span>${escape(definitions.find((item) => item.id === entry.id)?.name)}</span>${singleUse(entry.id) ? '<span class="queue-single">1回</span>' : `<label class="queue-entry-count">残り <input type="number" min="1" max="99" step="1" value="${entry.count}" data-queue-count="${index}" data-focus="queue-count-${index}" aria-label="予約${index + 1}の残り回数"> 回</label>`}<button class="icon-button" data-queue-move="${index}" data-direction="-1" aria-label="予約${index + 1}を上へ" ${index === 0 ? "disabled" : ""}>↑</button><button class="icon-button" data-queue-move="${index}" data-direction="1" aria-label="予約${index + 1}を下へ" ${index === state.run.queue.length - 1 ? "disabled" : ""}>↓</button><button class="icon-button" data-queue-remove="${index}" data-focus="queue-remove-${index}" aria-label="予約${index + 1}を削除">${icon("close")}</button></li>`).join("")}</ol><div class="queue-footer"><span>${state.settings.paused ? "時間停止中" : escape(queueStatus.reason || (enabled ? "順番に実行します" : "手動作業中・予約は保留"))}</span><button data-command="queue-clear" data-focus="queue-clear">予約を全消去</button></div>` : ""}${queueExpanded ? '<p class="queue-help">素材不足では待機。手動作業を選ぶと予約を保留します。</p>' : ""}</section>`,
  );
}

function renderCraft() {
  const smartUnlocked = state.meta.upgrades.includes("action_queue");
  const village = tab === "village";
  const catalog = RECIPES.filter(visibleRecipe)
    .sort(
      (a, b) =>
        (a.tier || 0) - (b.tier || 0) ||
        (a.slot === "weapon" ? -1 : b.slot === "weapon" ? 1 : 0),
    )
    .filter((recipe) => (village ? Boolean(recipe.facility) : !recipe.facility))
    .filter(
      (recipe) =>
        village ||
        craftFilter === "all" ||
        (craftFilter === "processing"
          ? !recipe.equipment && !recipe.facility
          : recipe.equipment?.slot === craftFilter),
    );
  const hiddenCount = catalog.filter(
    (recipe) => getRecipeVisibility(state, recipe).hidden,
  ).length;
  const queueNotice = state.run.queue.length >= 8 ? '<div class="queue-warning"><span>行動予約が8件でいっぱいです。不要な予約を削除してください。</span><button data-info="queue">予約を整理</button></div>' : "";
  const slotFilter = !village
    ? `<div class="craft-filters"><label>表示 <select id="craft-filter" data-focus="craft-filter">${[
        ["all", "すべて"],
        ["weapon", "武器"],
        ["armor", "鎧"],
        ["shield", "盾"],
        ["tool", "道具"],
        ["processing", "加工・調理"],
      ]
        .map(
          ([id, name]) =>
            `<option value="${id}" ${craftFilter === id ? "selected" : ""}>${name}</option>`,
        )
        .join("")}</select></label></div>`
    : "";
  const filter =
    hiddenCount || state.settings.showHiddenRecipes
      ? `<div class="craft-filters"><button class="craft-visibility" data-command="toggle-hidden-recipes" data-focus="hidden-filter" aria-pressed="${state.settings.showHiddenRecipes}">${icon(state.settings.showHiddenRecipes ? "check" : "eye")}非表示も表示${hiddenCount ? `<small>${hiddenCount}</small>` : ""}</button></div>`
      : "";
  setHTML(
    "#content",
    `${renderSkillOverview()}${village ? '<div class="village-intro">武器にするか、村の備えに使うか。施設は5段階まで強化でき、次の命では建て直します。</div>' : ""}${!village && !isLegacy(state) ? `<div class="workshop-automation">${autoCookingMarkup(state)}${processingMarkup(state)}</div>` : ""}${slotFilter}${filter}${queueNotice}<div class="craft-list">${catalog
      .filter(
        (recipe) =>
          state.settings.showHiddenRecipes ||
          !getRecipeVisibility(state, recipe).hidden,
      )
      .map((recipe) => {
        const craftCount = singleUse(recipe.id) ? 1 : craftQuantities[recipe.id] || 1;
        const check = canStartAction(state, recipe.id);
        const active = state.run.activeAction?.id === recipe.id;
        const queuedIndex = singleUse(recipe.id) ? state.run.queue.findIndex(q => q.id === recipe.id) : -1;
        const suspended = state.run.suspendedActions?.[recipe.id];
        const equipped = recipe.facility
          ? (state.run.facilities[recipe.facility.id] || 0) >=
            (recipe.level || 1)
          : Object.values(state.run.equipment).some(
              (item) =>
                item?.id === recipe.id || item?.name === recipe.equipment?.name,
            );
        const plan =
          smartUnlocked && !suspended ? planCraft(state, recipe.id, craftCount) : null;
        const resumable =
          ((active && state.settings.paused) || Boolean(suspended)) &&
          state.run.status === "preparing";
        const allowed = active
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
            ? `<button class="craft-hide" data-hide-recipe="${recipe.id}" data-focus="hide-${recipe.id}" aria-pressed="${visibility.manuallyHidden}" aria-label="${escape(recipe.name)}${visibility.manuallyHidden ? "の非表示を解除" : "を隠す"}" title="${visibility.inProgress ? "進行中の製作は隠せません" : visibility.manuallyHidden ? "非表示を解除" : "この品を隠す"}" ${visibility.inProgress ? "disabled" : ""}>${icon(visibility.manuallyHidden ? "eye" : "eye-off")}</button>`
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
                .filter(([key]) => eq[key])
                .map(([key, label]) => {
                  const current = state.run.equipment[eq.slot]?.[key] || 0;
                  const value = (number) =>
                    key === "speed" ? Math.round(number * 100) + "%" : number;
                  return `${label} ${value(current)} → ${value(eq[key])}`;
                })
                .join(" / ")
            : Object.entries(recipe.yields || {})
                .map(([id, amount]) => `${resourceName(id)} +${amount}`)
                .join(" / ");
        return `<article class="craft-card ${active ? "active" : ""} ${visibility.manuallyHidden ? "craft-hidden" : ""}"><div class="craft-icon">${icon(recipe.facility ? (recipe.id === "watchtower" ? "eye" : recipe.id === "barricade" ? "shield" : "heart") : eq ? slotIcons[eq.slot] : recipe.id === "smelt_iron" ? "ingot" : "food")}</div><div class="craft-info"><h3>${escape(recipe.name)}${equipped ? `<span class="equipped-tag">${village ? "建設済み" : "装備中"}</span>` : visibility.inferior ? '<span class="equipped-tag">下位装備</span>' : ""}</h3><p>${escape(recipe.description)}</p><div class="craft-benefits">${escape(benefits)}<span>${benefits ? " · " : ""}${getActionDuration(state, recipe).toFixed(1)}秒</span></div><div class="recipe-cost">${Object.entries(
          active || suspended ? {} : Object.fromEntries(Object.entries(getRecipeCost(state, recipe)).map(([id,amount]) => [id, amount * (smartUnlocked ? craftCount : 1)])),
        )
          .map(
            ([id, amount]) =>
              `<span class="${(state.run.resources[id] || 0) < amount ? "insufficient" : ""}">${icon(id)}${escape(resourceName(id))} ${format(state.run.resources[id] || 0)}<b>/${amount}</b></span>`,
          )
          .join(
            "",
          )}</div>${plan?.ok ? `<small class="craft-eta" title="現在の速度による追加手順の概算。今ある予約の待ち時間・襲撃・今後のレベル成長は含みません">${state.run.queue.length || state.run.activeAction?.kind === "craft" ? "追加手順" : "素材集め込み"} 約${time(Math.ceil(plan.seconds))}</small>` : ""}${savedWorkNote(active ? state.run.activeAction : suspended)}${skillLevel("smithing").level > 1 ? `<div class="craft-growth">製作 Lv.${skillLevel("smithing").level} · 作業速度 +${getSkillEffects(state, "smithing").runSpeedPercent}%</div>` : ""}${plan?.ok && plan.steps.length > 1 ? `<div class="plan-preview">${icon("book")}<span>${escape(plan.summary)}</span></div>` : ""}</div><div class="craft-command">${smartUnlocked && !singleUse(recipe.id) && !active && !suspended ? `<label class="craft-quantity">製作回数<input type="number" min="1" max="99" step="1" inputmode="numeric" data-craft-count="${recipe.id}" data-focus="craft-count-${recipe.id}" aria-label="${escape(recipe.name)}の製作回数" value="${craftCount}"></label><small class="craft-total">${Object.entries(recipe.yields || {}).map(([id,amount]) => `${escape(resourceName(id))} ${format(amount * craftCount)}個`).join(" / ")}</small>` : ""}<div class="craft-buttons"><button class="button small ${allowed ? "gold-outline" : "muted"}" ${smartUnlocked && !active && !suspended ? "data-smart-craft" : "data-action"}="${recipe.id}" data-focus="recipe-${recipe.id}" ${!allowed || queuedIndex >= 0 || (active && !resumable) ? "disabled" : ""}>${queuedIndex >= 0 && !active ? "予約済み" : active && !resumable ? (village ? "建設中" : "製作中") : equipped ? (village ? "建設済み" : "装備済み") : smartUnlocked && state.run.queue.length > 0 && !active && !suspended ? "末尾に予約" : village ? "建設する" : "製作する"}</button>${smartUnlocked && state.run.queue.length > 0 && queuedIndex !== 0 && !active && !suspended && !equipped ? `<button class="button small gold-outline" data-smart-craft="${recipe.id}" data-queue-position="front" data-focus="recipe-front-${recipe.id}" ${!allowed ? "disabled" : ""}>${queuedIndex > 0 ? "先頭へ移す" : "先頭に予約"}</button>` : ""}${visibilityButton}</div>${!allowed && !active && !equipped ? `<small>${escape(reason)}</small>` : smartUnlocked && !active && !suspended && !equipped ? '<small class="permanent-text">材料集めからおまかせ</small>' : ""}</div></article>`;
      })
      .join(
        "",
      )}</div><div class="context-hint">${icon("hammer")}<span>${smartUnlocked ? (village ? "「建設する」で足りない材料の採集から予約します。" : "予約すると、足りない材料の採集・加工も行います。獣皮や技能条件は別途必要です。") : village ? "完成すると施設の効果が働きます。" : "完成すると自動で装備します。"}</span></div>`,
  );
}

function renderLegacy() {
  const history = state.meta.history || [];
  setHTML(
    "#content",
    `${renderUpgradeSections(state)}<div class="legacy-intro"><span>${icon("memory")}</span><div><h3>身体は還る。記憶は残る。</h3><p>行動した技能に永続経験が蓄積します。永続レベルが高いほど、次の命では作業と進行レベルの成長が速くなります。</p></div></div><div class="legacy-skills">${SKILLS.map(
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

function renderDiplomacy() {
  if (!isLegacy(state)) {
    setHTML("#content", diplomacyMarkup(state, marketSide, marketCount));
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
  const f = CONTENT.facilities.find(
    (f) => f.facilityId === id && f.level === l,
  ).effect;
  return (
    "Lv." +
    l +
    " · " +
    {
      watchtower: "+" + f.raidDelay + "秒",
      barricade: "防御 +" + f.defense,
      infirmary: "処置 " + f.treatmentCharges + "回",
      workshop: "製作 +" + Math.round(f.craftSpeed * 100) + "%",
      market: "割引 " + Math.round(f.purchaseDiscount * 100) + "%",
      guardhouse: "支援 " + f.supportAttack,
    }[id]
  );
}
function renderSurvivor() {
  const stats = getStats(state),
    health = Math.max(0, state.run.hp);
  setHTML(
    "#survivor",
    `<div class="panel-heading"><h2>${icon("shield")}灯守の状態</h2><span class="status-dot ${state.run.status}">${state.run.status === "combat" ? "戦闘中" : state.run.status === "dead" ? "死亡" : "準備中"}</span></div><div class="health-heading"><span>${icon("heart")}生命力</span><strong>${Math.ceil(health)} <small>/ ${stats.maxHp}</small></strong></div><div class="health-track"><i style="width:${progress(health / stats.maxHp)}%"></i></div><div class="combat-stats"><div>${icon("sword")}<span>攻撃力</span><strong>${stats.attack}</strong></div><div>${icon("shield")}<span>防御力</span><strong>${stats.defense}</strong></div></div>${skillLevel("combat").level > 1 ? `<div class="combat-growth"><span>周回の戦闘 Lv.${skillLevel("combat").level}</span><strong>攻撃 +${getSkillEffects(state, "combat").runAttack} · 最大HP +${getSkillEffects(state, "combat").runMaxHp}</strong></div>` : ""}<div class="survival-time"><span>${icon("clock")}この命の時間</span><strong>${time(state.run.elapsed)}</strong></div><div class="auto-food">${icon("food")}<span>食料はピンチになると自動で使用</span><b>${format(state.run.resources.food || 0)}</b></div>`,
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
      .join("")}</div>`,
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
    };
    renderBattle(dialog, state);
    mountCampScene(dialog.querySelector(".battle-scene"), {
      variant: "battle",
      focusY: 0.45,
    }).setActive(state.settings.effectsEnabled && !state.settings.paused);
    if (!dialog.open && !document.querySelector("dialog[open]"))
      dialog.showModal();
    campScene.setActive(false);
    return;
  }
  suspendBattle(dialog);
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
    extra.innerHTML = html;
    extra.dataset.html = html;
    if (focus)
      extra
        .querySelector('[data-focus="' + CSS.escape(focus) + '"]')
        ?.focus({ preventScroll: true });
  }
}
function render() {
  renderGuard.run(() => {
    try { renderScreen(); }
    finally { committedSelect = null; }
  });
}
function renderScreen() {
  if (!session.owned) state.settings.paused = true;
  const unlocks = getUnlocks(state);
  if (
    (tab === "village" && !unlocks.facilities) ||
    (tab === "diplomacy" && !unlocks.diplomacy)
  )
    tab = "gather";
  renderNavigation();
  renderControls();
  renderWorld();
  renderWork();
  renderSurvivor();
  renderJournal();
  const milestone = getMilestoneStatus(state);
  const next = milestone.next;
  setHTML(
    "#milestone",
    next && tab !== "legacy" && tab !== "diplomacy"
      ? `<div class="milestone-card" aria-label="初達成のクエスト">${icon("book")}<div><small>初達成のクエスト · ${milestone.completed}/${milestone.total}</small><strong>${escape(next.name)}</strong></div><span>+${next.reward} 継承 pt</span><button data-tab="${milestone.available ? next.tab : "gather"}" data-focus="milestone">${milestone.available ? "開く" : "第1波を撃退"}${icon("chevron")}</button></div>`
      : "",
  );
  syncBattleDialog();
  setHTML("#augments-panel", renderAugments(state));
  setHTML(
    "#prep-status",
    `<span>${state.run.activeAction ? escape([...ACTIONS, ...RECIPES].find((item) => item.id === state.run.activeAction.id)?.name) : "作業なし"}</span><b>${state.run.status === "combat" ? "襲撃中" : state.run.status === "dead" ? "旅の終わり" : `襲撃まで ${time(Math.ceil(state.run.nextWaveAt - state.run.elapsed))}`}</b><button data-command="${getAugmentStatus(state).offer.length ? "show-augments" : "pause"}" aria-label="${getAugmentStatus(state).offer.length ? "方針を選ぶ" : state.settings.paused ? "時間を進める" : "一時停止"}">${icon(getAugmentStatus(state).offer.length ? "spark" : state.settings.paused ? "play" : "pause")}</button>`,
  );
  const issue = queueIssue();
  setHTML("#queue-warning", issue ? `<div class="queue-warning"><span><strong>${escape([...ACTIONS,...RECIPES].find(d=>d.id===state.run.queue[0]?.id)?.name || "行動予約")}：予約を停止中</strong> · ${escape(issue.reason)}</span><button class="button small" data-queue-fix="remove">この予約を削除</button>${state.run.queue.length > 1 ? `<button class="button small" data-queue-fix="defer">最後へ回す</button>` : ""}<button class="button small gold-outline" ${issue.skill ? `data-skill="${issue.skill}"` : 'data-tab="gather"'}>別の作業を選ぶ</button><button data-info="queue">予約を見直す</button></div>` : "");
  const offer = getAugmentStatus(state);
  const offerKey = offer.offer.length
    ? `${state.meta.generation}:${offer.selected.length}:${offer.offer.join(",")}`
    : "";
  const augmentDialog = document.querySelector("#augment-dialog");
  if (offerKey) setHTML("#augment-dialog", renderAugments(state, { offer: true }));
  else if (augmentDialog.open) augmentDialog.close();
  if (
    offerKey &&
    offerKey !== displayedOffer &&
    !document.querySelector("dialog[open]")
  ) {
    augmentDialog.showModal();
    displayedOffer = offerKey;
  }
  if (!offerKey) displayedOffer = "";
  if (["dead", "cleared"].includes(state.run.status) && !deadShown) showDeath();
  document.querySelector("#death-dialog").classList.toggle("legacy-setup", state.run.status === "legacy_setup");
  if (state.run.status === "legacy_setup") {
    const dialog = document.querySelector("#death-dialog");
    const markup = setupMarkup(state, setupCategory);
    updateSetupDialog(dialog, markup);
    if (!dialog.open) dialog.showModal();
    setupShown = true;
  } else setupShown = false;
  if (tab === "legacy" && !isLegacy(state)) {
    renderExtra("#content", milestoneMarkup(state));
  }
  if (!isLegacy(state) && state.meta.upgrades.includes("action_queue"))
    renderExtra("#queue-panel", templatesMarkup(state));
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
}

function showHelp() {
  state.settings.paused = true;
  document.querySelector("#help-dialog").innerHTML =
    `<div class="dialog-heading"><div class="eyebrow">HOW TO SURVIVE · v0.3.11</div><button class="icon-button" data-close="help-dialog" aria-label="閉じる">${icon("close")}</button></div><h2 id="help-title">ひとつ先の夜を、目指して。</h2><p class="dialog-lead">最初は短い命でも、その経験は無駄になりません。</p><ol class="guide-steps"><li><span>01</span><div><h3>資源を集める</h3><p>伐採・採掘・採集を選ぶと時間が動き、繰り返し作業します。一時停止後も、作業を選べば再開できます。最初の襲撃は${FIRST_RAID_DELAY / 60}分後です。</p></div></li><li><span>02</span><div><h3>工房で備える</h3><p>まずは木材4・石材2で石の槍を製作。装備は完成時に自動装着されます。食料は戦闘中に自動で回復に使われます。</p></div></li><li><span>03</span><div><h3>襲撃を生き延びる</h3><p>敵が野営地へ攻めてきます。大きな戦闘画面で自動防衛を見守ります。一時停止も可能です。撃退後は元の作業へ戻ります。</p></div></li><li><span>04</span><div><h3>経験を次の命へ</h3><p>死亡すると資源・装備・進行レベルは失われます。使った技能の永続経験は残り、次の命の成長を速めます。</p></div></li></ol><p class="fine-print">初めて襲撃を防ぐと村の施設が解放されます。初達成のクエストで継承ポイントを得て、自動化などを解放できます。最初のボスを倒すと外交とオーグメントの3択が登場します。まずは資源・装備・食料の準備に集中しましょう。</p><div class="guide-tip">${icon("pause")}いつでも一時停止して計画できます。<br />裏画面でも進みます。設定で自動停止を選べます。ゲームを閉じている間は進みません。</div><button class="button gold full-width" data-close="help-dialog">野営地に戻る${icon("arrow")}</button>`;
  document.querySelector("#help-dialog").showModal();
  render();
}

function showSettingsMenu() {
  state.settings.paused = true;
  document.querySelector("#settings-dialog").innerHTML = `<div class="dialog-heading"><div class="eyebrow">SETTINGS</div><button class="icon-button" data-close="settings-dialog" aria-label="閉じる">${icon("close")}</button></div><h2 id="settings-title">設定</h2><section class="presentation-settings settings-options"><h3>ゲームの進行</h3><label><input id="pause-when-hidden" type="checkbox" ${state.settings.pauseWhenHidden ? "checked" : ""}> 別のタブ・アプリへ移ったら一時停止</label><h3>音と演出</h3><label>BGM音量 <input id="music-volume" type="range" min="0" max="1" step="0.05" value="${state.settings.musicVolume ?? .15}"></label><label>効果音量 <input id="sound-volume" type="range" min="0" max="1" step="0.05" value="${state.settings.soundVolume}"></label><label><input id="effects-enabled" type="checkbox" ${state.settings.effectsEnabled ? "checked" : ""}> 演出を表示</label></section>`;
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
  const backups = readBackups(localStorage);
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
    `<div class="death-emblem">${icon("flame")}</div><div class="eyebrow">THE EMBER REMAINS</div><h2 id="death-title">火は消えても、記憶は残る。</h2><p class="dialog-lead">第 ${state.meta.generation} 世代の旅が終わりました。<br />積み重ねた経験が、次の命を少し強くする。</p><div class="death-stats"><div><small>この命の時間</small><strong>${time(state.run.elapsed)}</strong></div><div><small>撃退した襲撃</small><strong>${state.run.wave}<span> 波</span></strong></div><div><small>最高記録</small><strong>${state.meta.bestWave}<span> 波</span></strong></div></div>${comparisonMarkup}<div class="inheritance-heading">${icon("memory")}次の命へ引き継ぐ経験</div><div class="inheritance-list">${SKILLS.map((skill) => `<div><span>${icon(skillIcons[skill.id])}${escape(skill.name)}</span><b>永続 Lv.${getSkillProgress(state.run.startPermanentXp?.[skill.id] ?? Math.max(0,state.meta.skills[skill.id].xp-(gains[skill.id] || 0)),true).level} → ${skillLevel(skill.id, true).level}</b><small>+${format(gains[skill.id] || 0)} XP</small></div>`).join("")}</div><p class="death-tip">${state.run.equipment.weapon ? "鍛えた技能で準備を速め、次は装備と食料をひとつ多く。" : "次の命では、伐採から武器を作る順番を試してみよう。"}</p><button class="button gold full-width" data-command="rebirth">次の命を灯す${icon("arrow")}</button><p class="fine-print">資源・装備・進行レベル・オーグメントの効果はリセットされます。</p>`;
  const report = state.run.deathReport;
  if (report) {
    const tip = document.querySelector("#death-dialog .death-tip");
    const advice =
      report.food > 0
        ? "食料は残っていました。防御や最大体力を増やし、一撃を耐える備えを。"
        : "食料がありませんでした。食料の備蓄と、戦闘を短くする攻撃力を見直しましょう。";
    tip.textContent = advice;
    tip.insertAdjacentHTML(
      "beforebegin",
      `<section class="defeat-report"><h3>第${report.wave}波 · ${escape(report.enemy)}</h3><p>直前のHP <b>${report.beforeHit}</b> ／ 最後の被害 <b>${report.damage}</b></p><p>残った食料 <b>${format(report.food)} 個</b></p></section>`,
    );
  }
  document
    .querySelector("#death-dialog .death-tip")
    .insertAdjacentHTML(
      "beforebegin",
      `<div class="death-legacy">${icon("trophy")}<span>継承ポイント <b>${state.meta.points} pt</b> ・ 初撃破 ${state.meta.defeatedBosses.length} 体 ・ クエスト ${state.meta.completedMilestones.length}/${MILESTONES.length}<br /><small>${retainedUnlocks.length ? `引き継ぐ解放：${retainedUnlocks.map(escape).join("、")}` : "初達成のクエストと、ボスの初撃破で継承ポイントを獲得。"}</small></span></div>`,
    );
  if (state.run.status === "cleared") {
    document.querySelector("#death-title").textContent = "最終襲撃を撃退。";
    document.querySelector("#death-dialog .dialog-lead").textContent =
      `第${state.meta.generation}世代で村を守り抜きました。次は別の構成で挑戦できます。`;
    document.querySelector("#death-dialog .death-stats").insertAdjacentHTML('beforebegin', `<div class="clear-achievement">${icon('trophy')}<strong>第${state.meta.generation}世代でクリア</strong><button class="button gold-outline" data-command="share-clear">${icon('save')}記録画像を保存</button></div>`);
  }
  document.querySelector("#death-dialog").showModal();
  document.querySelector("#death-dialog").scrollTop = 0;
}

document.addEventListener("click", (event) => {
  unlockAudio(state.settings);
  const button = event.target.closest("button, .brand");
  if (!button || button.disabled) return;
  if (
    !session.owned &&
    !["takeover", "save-menu", "export", "code-export", "help"].includes(
      button.dataset.command,
    ) &&
    !button.dataset.tab &&
    !button.dataset.skill &&
    !button.dataset.close &&
    !button.dataset.info
  ) {
    toast("別のタブでプレイ中です。");
    return;
  }
  if (button.dataset.refund) {
    const r = refundUpgrade(state, button.dataset.refund);
    if (!r.ok) toast(r.reason);
    saveGame();
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
  if (button.dataset.tab) {
    infoDialog.close();
    document.querySelector("#content").scrollTop = 0;
    tab = button.dataset.tab;
    selectedSkill = null;
  }
  if (button.dataset.skill) {
    document.querySelector("#content").scrollTop = 0;
    selectedSkill = button.dataset.skill;
    tab = selectedSkill === "smithing" ? "craft" : "gather";
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
  if (button.dataset.purchase) {
    const result = purchaseUpgrade(state, button.dataset.purchase);
    toast(
      result.ok
        ? "新しい力を解放しました。次の世代にも引き継がれます。"
        : result.reason,
    );
    saveGame();
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
    const result = moveQueuedAction(
      state,
      Number(button.dataset.queueMove),
      Number(button.dataset.direction),
    );
    if (!result.ok) toast(result.reason);
    saveGame();
  }
  if (button.dataset.queueRemove !== undefined) {
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
    const result = queueWork(state, button.dataset.queueWork, craftQuantities[button.dataset.queueWork] || 1, button.dataset.queuePosition || "end");
    if (!result.ok) toast(result.reason);
    else { resumeSelectedWork(); toast("行動を予約しました。"); }
    saveGame();
  }
  if (button.dataset.smartCraft) {
    const result = queueCraft(state, button.dataset.smartCraft, button.dataset.queuePosition || "end", craftQuantities[button.dataset.smartCraft] || 1);
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
    marketSide = button.dataset.marketSide;
  }
  if (button.dataset.tradeResource) {
    const result = tradeResource(state, button.dataset.tradeResource, marketSide, marketCount);
    toast(result.ok ? `${marketCount}個${marketSide === 'sell' ? '売却' : '購入'}しました。` : result.reason);
    saveGame();
  }
  if (button.dataset.buySupply) {
    const result = buySupply(state, button.dataset.buySupply);
    toast(result.ok ? "交易が成立しました。" : result.reason);
    saveGame();
  }
  if (button.dataset.action) {
    const result = selectManualAction(state, button.dataset.action);
    if (!result.ok) toast(result.reason);
    else if (!resumeSelectedWork())
      toast("作業を選択しました。先にオーグメントを選んでください。");
    saveGame();
  }
  if (button.dataset.info) {
    state.settings.paused = true;
    const name = button.dataset.info;
    infoDialog.dataset.panel = name;
    document.querySelector("#info-title").textContent = {queue: "行動予約", status: "状態・装備", quests: "初達成のクエスト", journal: "焚き火の記録"}[name];
    for (const panel of infoDialog.querySelectorAll("[data-info-panel]")) panel.hidden = panel.dataset.infoPanel !== name;
    setHTML("#quest-list", milestoneMarkup(state));
    const list = infoDialog.querySelector(".milestone-list");
    if (list) list.open = true;
    render();
    infoDialog.showModal();
  }
  if (button.dataset.close)
    document.getElementById(button.dataset.close).close();
  switch (button.dataset.command) {
    case "takeover":
      session.takeover().then((acquired) => {
        if (!acquired) toast("他のタブを閉じて再度お試しください。");
        render();
      });
      break;
    case "confirm-run": {
      const r = confirmRun(state);
      if (!r.ok) toast(r.reason);
      else {
        document.querySelector("#death-dialog").close();
        deadShown = false;
        saveGame();
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
    case "show-augments":
      if (getAugmentStatus(state).offer.length && !document.querySelector("dialog[open]")) {
        setHTML("#augment-dialog", renderAugments(state, { offer: true }));
        document.querySelector("#augment-dialog").showModal();
      }
      break;
    case "share-clear":
      saveClearCard(state).catch(error => toast(error.message));
      break;
    case "pause":
      if (
        !["dead", "cleared", "legacy_setup"].includes(state.run.status) &&
        !getAugmentStatus(state).offer.length
      ) {
        state.settings.paused = !state.settings.paused;
        if (!isLegacy(state)) state.run.idleWait = !state.settings.paused;
        lastTick = performance.now();
        saveGame();
      }
      break;
    case "acceleration": {
      const result = getAccelerationStatus(state).active
        ? stopAcceleration(state)
        : startAcceleration(state);
      if (!result.ok) toast(result.reason);
      lastTick = performance.now();
      saveGame();
      break;
    }
    case "toggle-hidden-recipes":
      state.settings.showHiddenRecipes = !state.settings.showHiddenRecipes;
      saveGame();
      break;
    case "stop":
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
        if (!state.run.activeAction && !state.run.queue.length) state.run.idleWait = true;
        lastTick = performance.now();
      }
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
      const result = queueAction(state, queueDraftId, singleUse(queueDraftId) ? 1 : queueDraftCount, button.dataset.command === "queue-add-front" ? "front" : "end");
      if (!result.ok) toast(result.reason);
      saveGame();
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

document.addEventListener("input", (event) => {
  if (!session.owned) return;
  if (event.target.dataset.target && Number.isInteger(event.target.valueAsNumber) && event.target.valueAsNumber >= 0 && event.target.valueAsNumber <= 9999) {
    state.settings[event.target.dataset.target] = event.target.valueAsNumber;
    saveGame();
  }
  if (
    event.target.dataset.queueCount !== undefined &&
    Number.isInteger(event.target.valueAsNumber) &&
    event.target.valueAsNumber >= 1 &&
    event.target.valueAsNumber <= 99
  ) {
    editQueuedAction(
      state,
      Number(event.target.dataset.queueCount),
      event.target.valueAsNumber,
    );
    saveGame();
  }
  if (event.target.dataset.craftCount !== undefined && Number.isInteger(event.target.valueAsNumber) && event.target.valueAsNumber >= 1 && event.target.valueAsNumber <= 99)
    craftQuantities[event.target.dataset.craftCount] = event.target.valueAsNumber;
  if (event.target.id === "queue-count")
    queueDraftCount = event.target.valueAsNumber;
});

document.addEventListener("change", (event) => {
  if (!session.owned) return;
  if (event.target.matches('select')) committedSelect = event.target;
  if (event.target.dataset.craftCount !== undefined) {
    if (!Number.isInteger(event.target.valueAsNumber) || event.target.valueAsNumber < 1 || event.target.valueAsNumber > 99) {
      event.target.value = craftQuantities[event.target.dataset.craftCount] || 1;
      toast("回数は1〜99の整数で指定してください。");
    }
    render();
  }
  if (event.target.id === "craft-filter") {
    craftFilter = event.target.value;
    render();
  }
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
  if (event.target.dataset.queueCount !== undefined) {
    const result = editQueuedAction(
      state,
      Number(event.target.dataset.queueCount),
      event.target.valueAsNumber,
    );
    if (!result.ok) toast(result.reason);
    saveGame();
    render();
  }
  if (event.target.id === "market-count") {
    marketCount = Number(event.target.value);
    render();
  }
  if (event.target.id === "music-volume") {
    state.settings.musicVolume = Number(event.target.value);
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
  if (event.target.id === "queue-action") {
    queueDraftId = event.target.value;
    queueDraftCount = 1;
    render();
  }
  if (event.target.dataset.craftCount !== undefined && Number.isInteger(event.target.valueAsNumber) && event.target.valueAsNumber >= 1 && event.target.valueAsNumber <= 99)
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
  const imported = parseSave(text);
  if (!imported) {
    toast("読み込めないセーブデータです。現在の記録は変更していません。");
    return;
  }
  saveGame(false, true);
  activeBattle = null;
  state = imported;
  refreshCatalog();
  state.settings.paused = true;
  deadShown = false;
  lastTick = performance.now();
  saveGame(true);
  document.querySelector("#save-dialog").close();
  render();
  toast(`第 ${state.meta.generation} 世代の記録を読み込みました。`);
}

function resumeAfterDialogClose() {
  if (queueIssue()) { state.settings.paused = true; render(); return; }
  const queued = state.run.queue.length > 0 && state.meta.upgrades.includes("action_queue") && !state.settings.disabledUpgrades.includes("action_queue");
  if (!session.owned || document.hidden || document.querySelector("dialog[open]") || !["preparing", "combat"].includes(state.run.status) || getAugmentStatus(state).offer.length || (!state.run.activeAction && !queued)) return;
  state.settings.paused = false;
  lastTick = performance.now();
  saveGame();
  render();
}
const temporaryDialogs = [document.querySelector("#updates-dialog"), document.querySelector("#settings-dialog"), infoDialog, document.querySelector("#save-dialog"), document.querySelector("#help-dialog"), document.querySelector("#augment-dialog")];
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
  dialog.addEventListener("close", resumeAfterDialogClose);
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
document.addEventListener("keydown", (event) => {
  if (!event.repeat) unlockAudio(state.settings);
  if (
    event.code !== "Space" ||
    event.repeat ||
    document.querySelector("dialog[open]:not(#battle-dialog)") ||
    ["INPUT", "TEXTAREA", "BUTTON", "A", "SELECT"].includes(
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
window.addEventListener("pagehide", () => {
  state.settings.paused = true;
  saveGame();
});

function updateLiveWork() {
  const action = state.run.activeAction;
  const bar = document.querySelector("[data-live-work]");
  const label = document.querySelector("[data-work-time]");
  if (!bar) return;
  if (state.settings.effectsEnabled && state.run.status === "preparing") syncWorkAnimation(document.querySelector(".work-vignette"), action);
  bar.style.width = `${action && state.run.status !== "dead" ? progress(action.progress / action.duration) : 0}%`;
  if (label && action) label.textContent = `${Math.min(action.progress, action.duration).toFixed(1)} / ${action.duration.toFixed(1)} 秒`;
}

let presentationFailed = false;
let lastFrameError = '';
function frameError(stage, error) {
  if (stage === 'presentation') presentationFailed = true;
  else state.settings.paused = true;
  const key = `${stage}:${error?.message}`;
  if (key === lastFrameError) return;
  lastFrameError = key;
  console.error(`Game frame (${stage})`, error);
  toast(stage === 'presentation' ? '演出に問題が起きたため、演出を止めて作業を続けます。' : '処理に問題が起きたため一時停止しました。再開できない場合は記録を書き出してください。');
}
const backgroundClock = createBackgroundClock();
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
    blocked: !session.owned || temporaryDialogs.some(dialog => dialog.open) || state.settings.paused || !["preparing","combat"].includes(state.run.status),
  });
  lastTick = now;
  const presentationDue = !document.hidden && now - lastRender > 150;
  runFrameTasks([
    ['advance', () => {
      if (session.owned && (!document.hidden || !state.settings.pauseWhenHidden) && !temporaryDialogs.some(dialog => dialog.open) && !state.settings.paused && state.run.status !== 'dead')
        advanceTime(state, elapsed);
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
    state = loadGame();
    refreshCatalog();
    state.settings.paused = true;
    deadShown = false;
    lastTick = performance.now();
  },
  onRelease() {
    state.settings.paused = true;
    saveGame();
  },
  onChange() {
    render();
  },
});
window.addEventListener("pagehide", () => session.relinquish());
session.acquire();
render();
if (loadWarning) toast(loadWarning);
scheduleFrame();

window.addEventListener("pageshow", (event) => {
  if (event.persisted) session.acquire();
});
