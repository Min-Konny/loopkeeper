import { getCatalog, getAugmentStatus, getSynergies } from "./engine.js?v=0.4.2";
import { icon } from "./icons.js?v=0.4.2";

const families = {
  economy: { name: "生産・投資", icon: "gold" },
  martial: { name: "武勇", icon: "sword" },
  fortress: { name: "防衛", icon: "shield" },
};
const hints = {
  forestry: "資源集めを速め、装備や施設を先に整える。",
  builder: "施設への投資を抑え、食料や武器にも資源を残す。",
  warrior: "武器と組み合わせ、敵を倒すまでの被害を減らす。",
  drill: "訓練に時間を割き、自分自身を主力に育てる。",
  provisions: "回復食を備蓄して、長い戦闘を支える。",
  guard: "盾や防護柵と重ね、毎回の被害を抑える。",
  timber_contract: "伐採で資源と収入を得て、食料や傭兵へ回す。",
  investment: "村に施設を増やすほど、継続収入が育つ。",
  bounty: "戦闘力を高め、撃退の報酬を次の備えへ回す。",
  momentum: "勝つほど強くなり、勝利の回復で次の敵へ備える。",
};
const escape = (value) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        character
      ],
  );

export function augmentInsight(state, augment) {
  const selected = state.run.augments.selected;
  const pairs = (augment.pairs || []).filter(id => selected.includes(id));
  const { AUGMENTS, FACILITIES } = getCatalog(state);
  let readiness = '選ぶと有効';
  if (augment.facility) readiness = (state.run.facilities[augment.facility] || 0) >= (augment.facilityLevel || 1) ? '施設の準備OK' : `${FACILITIES[augment.facility]?.name || '対応施設'}${augment.facilityLevel ? ' Lv.' + augment.facilityLevel : ''}の建設が必要`;
  if (augment.id === 'well_stocked' || augment.id === 'supply_lines') readiness = `食料 ${Math.floor(state.run.resources.food)}/20${augment.facility && !state.run.facilities[augment.facility] ? ' · 守備隊が必要' : ''}`;
  if (augment.id === 'construction_rush') readiness = (state.run.strategy?.constructionUntil || 0) > state.run.elapsed ? `採集加速 残り${Math.ceil(state.run.strategy.constructionUntil-state.run.elapsed)}秒` : '施設完成で90秒発動';
  if (augment.id === 'weapon_master') readiness = `次の戦闘の防御無視 ${state.run.strategy?.focus || 0}% / 30%`;
  if (augment.id === 'last_stand') readiness = state.run.nextWaveAt-state.run.elapsed <= 45 ? '追い込み時間中' : '襲撃45秒前から発動';
  return {readiness, pairs:pairs.map(id=>AUGMENTS.find(a=>a.id===id)?.name).filter(Boolean)};
}

function synergyGuide(state) {
  if (state.version === 1 || state.meta.bestWave < 6) return '';
  const active = getSynergies(state);
  return `<details class="strategy-details"><summary>施設と組み合わせる連携</summary>${[
    ['economy','生産・投資の方針 ＋ 交易所II','資源の購入価格−10%'],
    ['martial','武勇の方針 ＋ 守備隊II または攻撃訓練Lv10','本人の攻撃＋12%・撃退金貨＋20%'],
    ['fortress','防衛の方針 ＋ 防護柵II または救護所II','柵の防御＋25%・戦闘の救護回復＋20%']
  ].map(([id,need,effect])=>`<p>${active.includes(id)?'✓ 発動中：':''}${need}<br><small>${effect}</small></p>`).join('')}</details>`;
}
function insightMarkup(state, augment) {
  const info = augmentInsight(state, augment);
  return `<div class="augment-tags">${(augment.tags || []).map(t=>`<span>${escape(t)}</span>`).join('')}</div><small class="augment-readiness">${escape(info.readiness)}</small>${info.pairs.length ? `<small class="augment-combo">組み合わせ：${info.pairs.map(escape).join('・')}</small>` : ''}`;
}

export function augmentStatusMarkup(state) {
  const { AUGMENTS } = getCatalog(state);
  const selected = state.run.augments.selected.map(id => AUGMENTS.find(a=>a.id===id)).filter(Boolean);
  if (!selected.length) return '';
  return `<details data-detail-key="augment-status" class="strategy-details"><summary>この命のオーグメント · ${selected.length}/4</summary>${selected.map(a=>`<article><strong>${escape(a.name)}</strong><p>${escape(a.description)}</p>${a.tags ? insightMarkup(state,a) : ''}</article>`).join('')}${synergyGuide(state)}</details>`;
}

export function renderAugments(state, { offer = false } = {}) {
  const { AUGMENTS } = getCatalog(state);
  const status = getAugmentStatus(state);
  if (!status.unlocked || state.run.status === "dead") return "";
  const selected = status.selected
    .map((id) => AUGMENTS.find((augment) => augment.id === id))
    .filter(Boolean);
  const selectedMarkup = selected.length
    ? `<div class="chosen-augments" aria-label="この周回のオーグメント">${selected.map((augment) => `<div class="chosen-augment ${augment.family}" title="${escape(augment.description)}"><span>${icon(families[augment.family].icon)}${escape(augment.name)}</span><small>${escape(augment.description)}</small>${augment.tags ? insightMarkup(state, augment) : ""}</div>`).join("")}</div>`
    : "";
  if (offer && !status.offer.length) return "";
  if (!offer)
    return selectedMarkup
      ? `<section class="augment-summary ${status.offer.length ? "has-offer" : ""}"><div class="augment-summary-label">${icon("spark")}この命の方針 ${status.offer.length ? '<button class="button small gold-outline" data-command="show-augments">オーグメントを選ぶ</button>' : '<span>次の命で選び直す</span>'}</div>${selectedMarkup}</section>`
      : status.offer.length ? `<button class="button gold-outline augment-pending" data-command="show-augments">${icon("spark")}オーグメントを選ぶ${icon("arrow")}</button>` : "";
  return `<div class="dialog-heading"><span class="eyebrow">A DIFFERENT WAY TO SURVIVE</span><button class="icon-button" data-close="augment-dialog" aria-label="閉じる">${icon("close")}</button></div><section class="augment-offer" aria-labelledby="augment-title"><div class="augment-offer-heading"><div><h2 id="augment-title">この命で、何を伸ばす？</h2><p>3つから1つ。効果はこの周回だけ続きます。</p></div><button class="button small muted" data-command="abandon-menu">周回を切り上げる</button><span class="choice-paused">${icon("pause")}選択中は時間停止</span></div>${selectedMarkup}<div class="augment-choices">${status.offer
    .map((id) => {
      const augment = AUGMENTS.find((item) => item.id === id);
      if (!augment) return "";
      const family = families[augment.family];
      return `<article class="augment-choice ${augment.family}"><div class="augment-card-top"><span class="augment-symbol">${icon(family.icon)}</span><span class="augment-family">${family.name} · ${augment.pack ? "追加候補" : "基本候補"}</span></div><h3>${escape(augment.name)}</h3><p class="augment-effect">${escape(augment.description)}</p>${insightMarkup(state, augment)}<p class="augment-hint">${escape(augment.hint || hints[augment.id] || "")}</p><button class="button gold-outline" data-choose-augment="${augment.id}" data-focus="augment-${augment.id}" aria-label="${escape(augment.name)}を選ぶ">この方針を選ぶ ${icon("arrow")}</button></article>`;
    })
    .join(
      "",
    )}</div>${synergyGuide(state)}<div class="augment-offer-footer"><span>${icon("memory")}解放した自動化は、どの方針でも使えます。</span></div></section>`;
}
