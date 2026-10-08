import { getCatalog, getAugmentStatus } from "./engine.js?v=0.2.3";
import { icon } from "./icons.js?v=0.2.3";

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

export function renderAugments(state) {
  const { AUGMENTS } = getCatalog(state);
  const status = getAugmentStatus(state);
  if (!status.unlocked || state.run.status === "dead") return "";
  const selected = status.selected
    .map((id) => AUGMENTS.find((augment) => augment.id === id))
    .filter(Boolean);
  const selectedMarkup = selected.length
    ? `<div class="chosen-augments" aria-label="この周回のオーグメント">${selected.map((augment) => `<div class="chosen-augment ${augment.family}" title="${escape(augment.description)}"><span>${icon(families[augment.family].icon)}${escape(augment.name)}</span><small>${escape(augment.description)}</small></div>`).join("")}</div>`
    : "";
  if (!status.offer.length)
    return selectedMarkup
      ? `<section class="augment-summary"><div class="augment-summary-label">${icon("spark")}この命の方針 <span>次の命で選び直す</span></div>${selectedMarkup}</section>`
      : "";
  return `<section class="augment-offer" aria-labelledby="augment-title"><div class="augment-offer-heading"><div><span class="eyebrow">A DIFFERENT WAY TO SURVIVE</span><h2 id="augment-title">この命で、何を伸ばす？</h2><p>3つから1つを選び、今回の育て方を決めましょう。効果はこの周回だけ続きます。</p></div><span class="choice-paused">${icon("pause")}選択中は時間停止</span></div>${selectedMarkup}<div class="augment-choices">${status.offer
    .map((id) => {
      const augment = AUGMENTS.find((item) => item.id === id);
      if (!augment) return "";
      const family = families[augment.family];
      return `<article class="augment-choice ${augment.family}"><div class="augment-card-top"><span class="augment-symbol">${icon(family.icon)}</span><span class="augment-family">${family.name}</span></div><h3>${escape(augment.name)}</h3><p class="augment-effect">${escape(augment.description)}</p><p class="augment-hint">${escape(hints[augment.id] || "")}</p><button class="button gold-outline" data-choose-augment="${augment.id}" data-focus="augment-${augment.id}" aria-label="${escape(augment.name)}を選ぶ">この方針を選ぶ ${icon("arrow")}</button></article>`;
    })
    .join(
      "",
    )}</div><div class="augment-offer-footer"><span>${icon("memory")}解放した自動化は、どの方針でも使えます。</span><span>選択後に「時間を進める」で再開</span></div></section>`;
}
