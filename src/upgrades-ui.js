import {
  ACCELERATION,
  LEGACY_UPGRADES,
  canPurchaseUpgrade,
  getAccelerationStatus,
  getCatalog,
  getRecipeCost,
} from "./engine.js?v=0.3.12";
import { icon } from "./icons.js?v=0.3.12";

const escape = (value) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        character
      ],
  );
const symbols = {
  action_queue: "book",
  auto_cook: "food",
  lumber_worker: "axe",
  mining_worker: "pickaxe",
  inherited_blade: "sword",
  inherited_guard: "shield",
  inherited_vitality: "heart",
  economy_augments: "gold",
  martial_augments: "sword",
  cycle_acceleration: "clock",
};
const descriptions = {
  action_queue: "素材集めから製作まで予約。最大8件。",
  auto_cook: "材料を使い、食料を並行して調理。",
  lumber_worker: "準備中、6秒ごとに木材 +1。",
  mining_worker: "準備中、7秒ごとに石材 +1。",
  economy_augments: "伐採収入・施設投資など4種類を候補に追加。",
  martial_augments: "賞金稼ぎ・勝利の勢いなど4種類を候補に追加。",
  fortress_augments: "初撃への備え・救護巡回の2種類を候補に追加。",
  foraging_worker: "準備中、8秒ごとに薬草または食料を集める。",
  processing_worker: "材料を使い、指定した金属を並行して加工。",
  queue_templates: "予約の手順を保存し、次の命でも呼び出す。",
  stock_targets: "主作業が空いたとき、指定した在庫を補充。",
};

export function getUpgradeDescription(state, upgrade) {
  const effect = upgrade.effect;
  if (upgrade.id === "auto_cook" && state.version !== 1) {
    const recipe = getCatalog(state).RECIPES.find(r => r.id === "cook_meal"), cost = getRecipeCost(state, recipe);
    return `主作業と並行して、薬草${cost.herbs}・木材${cost.wood} → 食料${recipe.yields.food}。補充目標まで自動で作る。`;
  }
  if (upgrade.kind === "combat")
    return effect.attack
      ? "基礎攻撃力 +" + effect.attack + "。"
      : effect.defense
        ? "基礎防御力 +" + effect.defense + "。"
        : "最大生命力 +" + effect.maxHp + "。購入時の回復なし。";
  if (upgrade.kind === "time")
    return upgrade.id === "acceleration_extension"
      ? "復帰の持続を、周回開始時の既知波数×57実秒へ延長。"
      : state.version === 1
        ? "突破済み区間の準備を5倍速に。1周120実秒。"
        : "突破済みの準備・戦闘を5倍速に。1周120実秒。";
  return descriptions[upgrade.id] || upgrade.description;
}

export function renderUpgradeSections(state) {
  if (
    state.meta.bestWave < 3 &&
    !state.meta.points &&
    !state.meta.upgrades.length
  )
    return "";
  const acceleration = getAccelerationStatus(state);
  const catalog = getCatalog(state).LEGACY_UPGRADES;

  function card(upgrade) {
    const owned = state.meta.upgrades.includes(upgrade.id);
    const enabled = !state.settings.disabledUpgrades.includes(upgrade.id);
    const pack = upgrade.kind === "augment_pack";
    const available = canPurchaseUpgrade(state, upgrade.id);
    const toggleLabel = pack
      ? enabled
        ? "抽選に含む"
        : "抽選から除外"
      : enabled
        ? "有効"
        : "無効";
    const description = getUpgradeDescription(state, upgrade);
    const gate = upgrade.unlock || {};
    const unlockHint = gate.bestWave && state.meta.bestWave < gate.bestWave
      ? `第${gate.bestWave}波の撃退で解放`
      : gate.completedQuests && state.meta.completedMilestones.length < gate.completedQuests && state.meta.bestWave < 3
        ? `クエスト${gate.completedQuests}件で解放`
        : gate.requires?.some((id) => !state.meta.upgrades.includes(id))
          ? "前提の技能を解放"
          : gate.generation && state.meta.generation < gate.generation
            ? "次の世代で解放"
            : gate.automationCount && state.meta.upgrades.filter((id) => ["automation", "worker"].includes(catalog.find((u) => u.id === id)?.kind)).length < gate.automationCount
              ? `自動化${gate.automationCount}種類で解放`
              : !available.ok && !owned ? available.reason : "";
    return `<article class="upgrade-card"><span class="upgrade-symbol">${icon(symbols[upgrade.id] || "spark")}</span><div class="upgrade-details"><h3>${escape(upgrade.name)}</h3><p>${escape(description)}</p></div><div class="legacy-upgrade-command">${
      owned
        ? `<button class="button small ${enabled ? "gold-outline" : "muted"}" data-toggle-upgrade="${upgrade.id}" data-focus="toggle-${upgrade.id}" aria-pressed="${enabled}" aria-label="${escape(upgrade.name)} ${toggleLabel}">${icon(enabled ? "check" : "pause")}${toggleLabel}</button>`
        : `<button class="button small gold-outline" data-purchase="${upgrade.id}" data-focus="purchase-${upgrade.id}" ${available.ok ? "" : "disabled"}${available.ok ? "" : ` title="${escape(available.reason)}"`}>${upgrade.cost} pt で解放</button>`
    }${!owned && unlockHint ? `<small class="upgrade-unlock-hint">${escape(unlockHint)}</small>` : ""}</div></article>`;
  }

  function group(id, name, symbol, kinds, description = "", note = "") {
    const upgrades = catalog.filter(
      (upgrade) =>
        kinds.includes(upgrade.kind),
    );
    if (!upgrades.length) return "";
    return `<section class="legacy-upgrade-group legacy-${id}" aria-labelledby="legacy-${id}-title"><div class="legacy-group-heading">${icon(symbol)}<div><h3 id="legacy-${id}-title">${name}</h3>${description ? `<p>${description}</p>` : ""}</div></div><div class="upgrade-grid">${upgrades.map(card).join("")}</div>${note ? `<p class="workers-info">${note}</p>` : ""}</section>`;
  }

  return `<section class="upgrade-section legacy-upgrades" aria-label="継承ポイントと技能"><div class="points-banner"><div><h3>次の命を支える力</h3><p>クエストの初達成・ボスの初撃破で獲得</p></div><strong>${state.meta.points}<small>継承 pt</small></strong></div>${group("combat", "戦闘の備え", "shield", ["combat"], "序盤の防衛を支え、内政へ時間を回す。")}${group("automation", "作業を任せる", "tool", ["automation", "worker"])}${group("augment", "周回の選択肢", "spark", ["augment_pack"], "選んだ効果はその周回だけ。", "基本6種類は無料。抽選の切り替えは、次の3択から反映。")}${group("time", "周回の復帰", "clock", ["time"], "突破した区間の準備を速める。")}<p class="workers-info">解放した技能・人員・種類は、次の命にも残ります。</p></section>`;
}
