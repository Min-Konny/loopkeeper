import { getUpgradeDescription } from "./upgrades-ui.js?v=0.2.11";
import { CONTENT as C } from "./content.js?v=0.2.11";
import {
  LEGACY_UPGRADES,
  MILESTONES,
  RECIPES,
  RESOURCES,
  getSynergies,
  getSupplyCost,
  resourceKnown,
  canPurchaseUpgrade,
  canConfigureWorker,
} from "./engine.js?v=0.2.11";
const esc = (x) =>
  String(x ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const label = (id) =>
  RESOURCES[id]?.name || RECIPES.find((x) => x.id === id)?.name || id;
const button = (text, attr, disabled = false) =>
  `<button class="button small gold-outline" ${attr} ${disabled ? "disabled" : ""}>${text}</button>`;
const setupCategories = [
  { id: "combat", name: "戦闘", kinds: ["combat"] },
  { id: "automation", name: "自動化・人員", kinds: ["automation", "worker"] },
  { id: "augment", name: "オーグメント", kinds: ["augment_pack"] },
  { id: "time", name: "周回復帰", kinds: ["time"] },
];
export function setupMarkup(s, category = "combat") {
  const d = s.run.legacyDraft,
    preview = {
      ...s,
      meta: {
        ...s.meta,
        upgrades: d.upgrades,
        points: d.points,
        paidCosts: d.paidCosts,
      },
    };
  const selected = setupCategories.find(c => c.id === category) || setupCategories[0];
  return `<div class="setup-header"><h2 id="death-title">次の命への継承</h2><div class="setup-points">残り <strong>${d.points} pt</strong></div></div><div class="setup-tabs" role="tablist" aria-label="継承の分類">${setupCategories.map(c => `<button role="tab" id="setup-tab-${c.id}" aria-selected="${c.id === selected.id}" aria-controls="setup-upgrades" data-setup-category="${c.id}">${c.name}</button>`).join("")}</div><div class="setup-upgrades" id="setup-upgrades" role="tabpanel" aria-labelledby="setup-tab-${selected.id}">${LEGACY_UPGRADES.filter(u => selected.kinds.includes(u.kind)).map(
    (u) => {
      const owned = d.upgrades.includes(u.id),
        allowed = canPurchaseUpgrade(preview, u.id);
      const child = LEGACY_UPGRADES.some(
        (x) => d.upgrades.includes(x.id) && x.unlock.requires?.includes(u.id),
      );
      return `<div class="setup-upgrade"><span>${esc(u.name)}<small>${owned ? d.paidCosts[u.id] : u.cost} pt · ${esc(getUpgradeDescription(s, u))}</small></span>${owned ? button("外す", `data-refund="${u.id}" title="${child ? "先に上位の解放を外してください。" : "購入時のポイントを返却"}"`, child) : button("解放", `data-purchase="${u.id}" title="${esc(allowed.reason)}"`, !allowed.ok)}</div>`;
    },
  ).join(
    "",
  )}</div><div class="setup-footer">${s.meta.templates.length ? '<p class="fine-print">保存手順は維持されます。返却した機能はこの周では使えません。</p>' : ""}<button class="button gold full-width" data-command="confirm-run">この構成で開始</button></div>`;
}
export function diplomacyMarkup(s) {
  return (
    C.diplomacy
      .filter((c) => s.run.countries[c.id].status !== "locked")
      .map((c) => {
        const r = s.run.countries[c.id],
          pending = r.status === "pending";
        return `<section class="diplomacy-card ${r.status}"><h3>${esc(c.name)} <small>${{ pending: "援助要請", allied: "交易中", hostile: "敵対待ち", defeated: "撃退済み" }[r.status]}</small></h3>${
          pending
            ? `<p>返答まで ${Math.max(0, Math.ceil(r.deadline - s.run.elapsed))}秒</p><div class="recipe-cost">${Object.entries(
                c.cost,
              )
                .map(([id, n]) => `${esc(label(id))} ${n}`)
                .join(
                  " / ",
                )}</div><div class="diplomacy-choices">${button("援助する", `data-aid="${c.id}"`, s.run.status !== "preparing" || Object.entries(c.cost).some(([id, n]) => s.run.resources[id] < n))}${button("迎え撃つ", `data-refuse="${c.id}"`, s.run.status !== "preparing")}</div><p class="fine-print">${c.id === "saphra" ? "援助：準備中15秒ごと金貨1。撃退：金貨24・攻撃+4。" : "援助：鉱物購入15%割引。撃退：鋼6・銀4。"} 敵対すると次の敵のHP+15%・攻撃+10%${c.id === "mining_realm" ? "・防御+3" : ""}。</p>`
            : `<p>${r.status === "allied" ? (c.id === "saphra" ? `交易収入 ${Math.floor(r.incomeTotal)}金貨` : "鉱物購入 −15%") : r.status === "hostile" ? "予定された襲撃に加勢します。" : "この周回の戦利品を獲得しました。"}</p>`
        }</section>`;
      })
      .join("") +
    `<div class="market-heading"><h3>市場</h3><span>金貨 ${Math.floor(s.run.resources.gold)}</span></div>${
      !s.run.facilities.market
        ? "<p>村に市場を建設すると取引できます。</p>"
        : `<div class="market-list">${C.market
            .filter((m) => !m.resource || resourceKnown(s, m.resource))
            .map((m) => {
              const sell = m.id === "sell_wood",
                price = getSupplyCost(s, m.id),
                hired = m.oncePerRun && s.run.diplomacy.mercenary;
              return `<article class="market-item"><div><h4>${sell ? "木材を納入" : m.id === "mercenary" ? "傭兵を雇う" : esc(label(m.resource))}</h4><p>${sell ? "木材10を金貨" + [2, 3, 4][s.run.facilities.market - 1] + "へ" : m.attack ? "攻撃 +5" : m.quantity + "個"}</p></div>${button(hired ? "雇用済み" : sell ? "木材10" : price + " 金貨", `data-buy-supply="${m.id}"`, hired || s.run.status !== "preparing" || (sell ? s.run.resources.wood < 10 : s.run.resources.gold < price))}</article>`;
            })
            .join("")}</div>`
    }`
  );
}
export function automationMarkup(s) {
  let out = "";
  for (const w of C.workers.filter((w) => s.meta.upgrades.includes(w.id))) {
    const rw = s.run.workers[w.id],
      l = w.levels[rw.level],
      next = w.levels[rw.level + 1];
    out += `<article class="worker-control"><div><strong>${esc(LEGACY_UPGRADES.find((u) => u.id === w.id).name)}</strong><small>段階 ${rw.level + 1}${l.interval ? ` / ${l.interval}秒ごと ${l.quantity}個` : ""}</small></div><label>作業<select data-worker="${w.id}" data-focus="worker-${w.id}">${[
      ...(w.resourceChoices || []),
      ...(w.recipeChoices || []),
    ]
      .filter((id) => resourceKnown(s, id))
      .map(
        (id) =>
          `<option value="${id}" ${rw.target === id ? "selected" : ""} ${canConfigureWorker(s, w.id, id).ok ? "" : "disabled"}>${esc(label(id))}${canConfigureWorker(s, w.id, id).ok ? "" : "（強化が必要）"}</option>`,
      )
      .join(
        "",
      )}</select></label>${next ? button("強化 " + next.goldCost + "金貨", `data-worker-upgrade="${w.id}"`, s.meta.bestWave < next.unlockBestWave || s.run.resources.gold < next.goldCost || s.run.status !== "preparing") : "<span>最大段階</span>"}</article>`;
  }
  if (s.meta.upgrades.includes("auto_cook"))
    out += `<label class="stock-setting">食料の補充目標 <input type="number" min="0" max="9999" value="${s.settings.foodTarget}" data-target="foodTarget" data-focus="food-target"></label>`;
  if (s.meta.upgrades.includes("processing_worker"))
    out += `<label class="stock-setting">加工品の補充目標 <input type="number" min="0" max="9999" value="${s.settings.processingTarget}" data-target="processingTarget" data-focus="processing-target"></label>`;
  if (s.meta.upgrades.includes("stock_targets"))
    out += `<details><summary>在庫の補充目標</summary>${s.settings.stockTargets.map((x) => `<label class="stock-setting">${esc(label(x.id))}<input type="number" min="0" max="9999" value="${x.count}" data-stock="${x.id}" data-focus="stock-${x.id}"></label>`).join("")}<div class="queue-controls"><select id="stock-resource">${C.resources
      .filter((x) => !["hide", "gold"].includes(x.id) && resourceKnown(s, x.id))
      .map((x) => `<option value="${x.id}">${x.name}</option>`)
      .join(
        "",
      )}</select><input id="stock-quantity" type="number" min="1" max="9999" value="20" aria-label="補充数">${button("追加", 'data-command="stock-add"')}</div></details>`;
  return out
    ? `<section class="automation-controls"><h3>仲間と自動化</h3>${out}</section>`
    : "";
}
export function templatesMarkup(s) {
  if (!s.meta.upgrades.includes("queue_templates")) return "";
  return `<details class="template-controls"><summary>保存した手順 (${s.meta.templates.length}/8)</summary><div class="queue-controls"><input id="template-name" maxlength="40" placeholder="手順の名前" aria-label="手順の名前">${button("予約を保存", 'data-command="template-save"', !s.run.queue.length || s.meta.templates.length >= 8)}</div>${s.meta.templates.map((t, i) => `<div class="template-row"><span>${esc(t.name)}</span>${button("追加", `data-template="${i}"`)}${button("削除", `data-template-delete="${i}"`)}</div>`).join("")}</details>`;
}
export function milestoneMarkup(s) {
  return `<details class="milestone-list"><summary>初達成 ${s.meta.completedMilestones.length}/${MILESTONES.length}</summary>${MILESTONES.map((q) => `<div>${s.meta.completedMilestones.includes(q.id) ? "✓" : "○"} ${esc(q.name)} <small>1 pt</small></div>`).join("")}</details>`;
}
export function synergyMarkup(s) {
  const selected = getSynergies(s);
  return selected.length
    ? `<div class="synergy-strip">${selected.map((id) => `<span>${{ economy: "交易の連携", martial: "武勇の連携", fortress: "防衛の連携" }[id]}</span>`).join("")}</div>`
    : "";
}
