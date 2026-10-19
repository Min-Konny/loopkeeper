import {preparationBalance}from './preparation-balance.js?v=0.6.36';
import {LEGACY_CATEGORIES,legacyUpgradeCategory,legacyCategoryTabs}from './legacy-categories.js?v=0.6.36';
import {legacyRanksMarkup}from './legacy-ranks-ui.js?v=0.6.36';
import {isFreeFeature,freeFeatureMarkup}from './free-features.js?v=0.6.36';
import { startingGrant, STARTING_UPGRADES } from './starting-resources.js?v=0.6.36';
import {
  ACCELERATION,
  LEGACY_UPGRADES,
  canPurchaseUpgrade,
  getAccelerationStatus,
  getCatalog,
  getRecipeCost,
} from "./engine.js?v=0.6.36";
import { icon } from "./icons.js?v=0.6.36";

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
  economy_augments: "基本候補に収入・投資の4種類を追加。最高6・9波で建設連鎖や備蓄など計8種類まで増える。",
  martial_augments: "基本候補に賞金・鍛錬の4種類を追加。最高6・9波で追い込みや追撃など計8種類まで増える。",
  fortress_augments: "基本候補に初撃・救護の2種類を追加。最高6・9波で兵糧・破甲・反撃など計6種類まで増える。",
  foraging_worker: "準備中、8秒ごとに薬草または食料を集める。",
  processing_worker: "材料を使い、指定した金属を並行して加工。",
  queue_templates: "手順の保存・呼出と、在庫数・Lvを目標にする条件付き予約。",
  stock_targets: "主作業が空いたとき、指定した在庫を補充。",
};

export function getUpgradeDescription(state, upgrade) {
  if(upgrade.kind==="starting_resources"){const owned=state.run.status==="legacy_setup"?state.run.legacyDraft.upgrades:state.meta.upgrades,ids=new Set([...owned,upgrade.id]);for(const id of [...ids])for(const parent of STARTING_UPGRADES.find(u=>u.id===id)?.unlock.requires || [])ids.add(parent);const grant=startingGrant([...ids],state.settings.disabledUpgrades);return "次回の支給合計："+Object.entries(grant).map(([id,n])=>({wood:"木材",stone:"石材",gold:"金貨"}[id] || id)+n).join("・")+"。転生を確定した時に受け取ります。";}

  const effect = upgrade.effect;
  if (upgrade.id === "auto_cook" && state.version !== 1) {
    const recipe = getCatalog(state).RECIPES.find(r => r.id === "cook_meal"), cost = getRecipeCost(state, recipe);
    return `主作業と並行して、薬草${cost.herbs}・木材${cost.wood} → 食料${recipe.yields.food}。${preparationBalance(state)?"ゆっくり備蓄を補充。急ぐときは本人が調理。":"補充目標まで自動で作る。"}`;
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

export function renderUpgradeSections(state,category='all') {
  const selected=LEGACY_CATEGORIES.find(c=>c.id===category)||LEGACY_CATEGORIES.at(-1);
  if (
    state.meta.bestWave < 3 &&
    !state.meta.points &&
    !state.meta.upgrades.length
  )
    return freeFeatureMarkup(state);
  const acceleration = getAccelerationStatus(state);
  const catalog = getCatalog(state).LEGACY_UPGRADES;

  function card(upgrade) {
    const owned = state.meta.upgrades.includes(upgrade.id);
    const enabled = !state.settings.disabledUpgrades.includes(upgrade.id);
    const pack = upgrade.kind === "augment_pack";
    // Read-only preview of the next rebirth. Never enable purchases during life.
    const preview = state.version === 1 || state.run.status === 'legacy_setup' ? state : {
      ...state, run: {...state.run, status:'legacy_setup', augments:{...state.run.augments,offer:[]},
        legacyDraft:{upgrades:[...state.meta.upgrades],points:state.meta.points,paidCosts:{...state.meta.paidCosts}}},
    };
    const available = canPurchaseUpgrade(preview, upgrade.id);
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
    return `<article class="upgrade-card" data-upgrade-state="${owned?'owned':available.ok?'available':'locked'}" data-legacy-upgrade="${upgrade.id}"><span class="upgrade-symbol">${icon(symbols[upgrade.id] || "spark")}</span><div class="upgrade-details"><h3>${escape(upgrade.name)}</h3><small class="upgrade-parent">${(gate.requires||[]).map(id=>escape(catalog.find(u=>u.id===id)?.name||id)).join(" → ")}${gate.requires?.length?" → ":""}${owned?"取得済み":available.ok?"転生時に取得可能":"条件不足"}</small><p>${escape(description)}</p></div><div class="legacy-upgrade-command">${
      owned ? '<span class="equipped-tag">'+(enabled?'継承済み・有効':'継承済み・無効')+'</span>' : '<span class="upgrade-price">'+upgrade.cost+' pt · 転生時に配分</span>'
    }${!owned && unlockHint ? `<small class="upgrade-unlock-hint">${escape(unlockHint)}</small>` : ""}</div></article>`;
  }

  function group(id, name, symbol, kinds, description = "", note = "") {
    const upgrades = catalog.filter(
      (upgrade) =>
        kinds.includes(upgrade.kind) && (selected.id==='all'||legacyUpgradeCategory(upgrade)===selected.id) && !(state.version!==1&&isFreeFeature(upgrade.id)),
    );
    if (!upgrades.length) return "";
    return `<section class="legacy-upgrade-group legacy-${id}" aria-labelledby="legacy-${id}-title"><div class="legacy-group-heading">${icon(symbol)}<div><h3 id="legacy-${id}-title">${name}</h3>${description ? `<p>${description}</p>` : ""}</div></div><div class="upgrade-grid">${upgrades.map(card).join("")}</div>${note ? `<p class="workers-info">${note}</p>` : ""}</section>`;
  }

  return legacyCategoryTabs(selected.id)+(selected.id==='all'||selected.free?.length?'<details class="legacy-free-guide" data-detail-key="legacy-free"><summary data-focus="legacy-free">無料の便利機能</summary>'+freeFeatureMarkup(state,selected.id==='all'?null:selected.free||[])+'</details>':'')+`<section id="legacy-category-content" role="tabpanel" aria-labelledby="legacy-category-${selected.id}" class="upgrade-section legacy-upgrades" aria-label="継承ポイントと技能"><div class="points-banner"><div><h3>次の命を支える力</h3><p>配分・振り直しは転生時。確定した次の命から反映します。</p><p>${state.run.earlyLoopVersion===1?"前線への復帰・善戦で毎周回獲得。初達成の報酬も保持。":"クエストの初達成・ボスの初撃破で獲得"}</p></div><strong>${state.meta.points}<small>継承 pt</small></strong></div>${state.version===1?group("combat", "戦闘の備え", "shield", ["combat"], "序盤の防衛を支え、内政へ時間を回す。"):selected.id==='all'?legacyRanksMarkup(state):selected.rankGroup?legacyRanksMarkup(state,false,selected.rankGroup):''}${group("starting","再出発の備蓄","wood",["starting_resources"],"転生を確定すると初期資源を受け取る。")}${group("automation", "作業を任せる", "tool", ["automation", "worker"])}${group("augment", "周回の選択肢", "spark", ["augment_pack", "augment_reroll"], "選んだ効果はその周回だけ。", "基本6種類は無料。継承する抽選候補の変更は転生時に反映。")}${group("time", "周回の復帰", "clock", ["time"], "突破した区間の準備を速める。")}<p class="workers-info">解放した技能・人員・種類は、次の命にも残ります。</p></section>`;
}
