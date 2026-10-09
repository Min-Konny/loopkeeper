import { getUpgradeDescription } from "./upgrades-ui.js?v=0.3.17";
import { CONTENT as C } from "./content.js?v=0.3.17";
import {
  LEGACY_UPGRADES,
  MILESTONES,
  RECIPES,
  RESOURCES,
  getSynergies,
  getSupplyCost,
  getTradeQuote,
  resourceKnown,
  canPurchaseUpgrade,
  canConfigureWorker,
  getTemplatePreview,
  getAutoCookingStatus,
  getProcessingStatus,
  getRecipeCost,
} from "./engine.js?v=0.3.17";
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
// Keep the nearest unanswered request visible while working in another tab.
export function diplomacyDeadlineMarkup(s) {
  if (s.run.status !== "preparing" && s.run.status !== "combat") return "";
  const pending = C.diplomacy
    .map(c => ({...c, request:s.run.countries[c.id]}))
    .filter(c => c.request?.status === "pending")
    .sort((a,b) => a.request.deadline - b.request.deadline);
  if (!pending.length) return "";
  const c = pending[0], seconds = Math.max(0, Math.ceil(c.request.deadline - s.run.elapsed));
  const clock = `${String(Math.floor(seconds/60)).padStart(2,"0")}:${String(seconds%60).padStart(2,"0")}`;
  return `<div class="diplomacy-notice deadline-notice ${seconds <= 30 ? "deadline-urgent" : ""}"><span class="deadline-copy"><strong>${esc(c.name)}から援助要請${pending.length > 1 ? ` · 他${pending.length-1}件` : ""}</strong><small>期限を過ぎると敵対</small></span><span class="deadline-clock"><small>返答期限まで</small><strong>${clock}</strong></span><button data-tab="diplomacy" data-focus="diplomacy-deadline">返答する →</button></div>`;
}
export function diplomacyMarkup(s, marketSide = "buy", marketCount = 1) {
  return (
    C.diplomacy
      .filter((c) => s.run.countries[c.id].status !== "locked")
      .map((c) => {
        const r = s.run.countries[c.id],
          pending = r.status === "pending";
        return `<section class="diplomacy-card ${r.status}"><h3>${esc(c.name)} <small>${{ pending: "援助要請", allied: "交易中", hostile: "敵対待ち", defeated: "撃退済み" }[r.status]}</small></h3>${
          pending
            ? `<p class="diplomacy-deadline ${r.deadline - s.run.elapsed <= 30 ? "danger-text" : ""}">返答期限まで <strong>${Math.max(0, Math.ceil(r.deadline - s.run.elapsed))}秒</strong><small>期限を過ぎると敵対</small></p><div class="recipe-cost">${Object.entries(
                c.cost,
              )
                .map(([id, n]) => `${esc(label(id))} ${n}`)
                .join(
                  " / ",
                )}</div><div class="diplomacy-choices">${button("援助する", `data-aid="${c.id}"`, s.run.status !== "preparing" || Object.entries(c.cost).some(([id, n]) => s.run.resources[id] < n))}${button("迎え撃つ", `data-refuse="${c.id}"`, s.run.status !== "preparing")}</div><p class="fine-print">${c.id === "saphra" ? "援助：準備中15秒ごと金貨1。撃退：金貨24・攻撃+4。その周回の攻撃+10%、以後の撃退金貨+50%。" : "援助：鉱物購入15%割引。撃退：鋼6・銀4。"} 敵対すると次の敵のHP+15%・攻撃+10%${c.id === "mining_realm" ? "・防御+3" : ""}。</p>`
            : `<p>${r.status === "allied" ? (c.id === "saphra" ? `交易収入 ${Math.floor(r.incomeTotal)}金貨` : "鉱物購入 −15%") : r.status === "hostile" ? "予定された襲撃に加勢します。" : (c.id === "saphra" ? "金貨24・攻撃+4を獲得。攻撃+10%・以後の撃退金貨+50%（この周回）。" : "鋼6・銀4を獲得（この周回）。")}</p>`
        }</section>`;
      })
      .join("") +
    `<div class="market-heading"><h3>市場</h3><span>金貨 ${Number(s.run.resources.gold.toFixed(2))}</span></div>${
      !s.run.facilities.market
        ? "<p>村に市場を建設すると取引できます。</p>"
        : `<div class="market-tabs" role="tablist" aria-label="売買の切り替え"><button role="tab" aria-selected="${marketSide === 'buy'}" data-market-side="buy">買う</button><button role="tab" aria-selected="${marketSide === 'sell'}" data-market-side="sell">売る</button></div><div class="market-options"><label>数量<select id="market-count" data-focus="market-count">${[1,10,100].map(n=>`<option value="${n}" ${marketCount === n ? 'selected' : ''}>${n}個</option>`).join('')}</select></label><small>${marketSide === 'sell' ? '売値は買値より低くなります。' : '発見済みの品を購入できます。'}</small></div><div class="market-list" role="tabpanel" aria-label="${marketSide === 'sell' ? '売る' : '買う'}">${C.resources.filter(r=>r.id !== 'gold' && resourceKnown(s,r.id)).map(r=>{
          const q=getTradeQuote(s,r.id,marketSide,marketCount);
          return `<article class="market-item"><div><h4>${esc(r.name)}</h4><p>所持 ${Number(s.run.resources[r.id].toFixed(2))} · ${marketCount}個 → ${q.total}金貨</p></div><div>${button(`${marketCount}個${marketSide === 'sell' ? '売る' : '買う'} · ${q.total}金貨`, `data-trade-resource="${r.id}" data-focus="trade-${r.id}"`, !q.ok)}${!q.ok ? `<small class="trade-reason">${esc(q.reason)}</small>` : ''}</div></article>`;
        }).join('')}</div>${marketSide === 'buy' ? `<div class="market-hire"><strong>傭兵を雇う <small>攻撃 +5</small></strong>${button(s.run.diplomacy.mercenary ? '雇用済み' : `${getSupplyCost(s,'mercenary')}金貨`, 'data-buy-supply="mercenary"', s.run.diplomacy.mercenary || s.run.status !== 'preparing' || s.run.resources.gold < getSupplyCost(s,'mercenary'))}</div>` : ''}`
    }`
  );
}
export function autoCookStatus(s) {
  const status = getAutoCookingStatus(s);
  return status.code === "cooking" ? `${status.text} ${status.batch.progress.toFixed(1)} / ${status.batch.duration.toFixed(1)}秒` : status.text;
}
export function autoCookingMarkup(s) {
  if (!s.meta.upgrades.includes("auto_cook")) return "";
  const status = getAutoCookingStatus(s), enabled = status.code !== "disabled";
  return `<section class="auto-cooking-panel"><div class="auto-cooking-heading"><h3>自動調理 <small>薬草のスープ</small></h3><button data-toggle-upgrade="auto_cook" data-focus="auto-cooking-toggle" aria-label="自動調理を${enabled ? "OFF" : "ON"}にする" aria-pressed="${enabled}">${enabled ? "ON" : "OFF"}</button></div><div class="auto-cooking-controls"><strong>食料 ${Math.floor(status.food)}</strong><label>補充目標<input type="number" min="0" max="9999" value="${status.target}" data-target="foodTarget" data-focus="cooking-food-target"></label>${s.settings.paused && enabled && s.run.status === "preparing" && (status.code === "paused") ? '<button class="button small gold-outline" data-command="auto-cook-start" data-focus="auto-cook-start">調理を開始</button>' : ""}</div><p>${esc(autoCookStatus(s))}</p><small>${esc(getUpgradeDescription(s,{id:"auto_cook"}))} 素材集めは別途必要。</small></section>`;
}
function workerUpgradeMarkup(s, worker) {
  const next = worker.levels[s.run.workers[worker.id].level + 1];
  if (!next) return '<span>最大段階</span>';
  const reasons = [];
  if (s.meta.bestWave < next.unlockBestWave) reasons.push(`WAVE ${String(next.unlockBestWave).padStart(2,'0')}撃退で解放（最高 ${String(s.meta.bestWave).padStart(2,'0')}）`);
  if (s.run.resources.gold < next.goldCost) reasons.push(`金貨あと${Math.ceil(next.goldCost-s.run.resources.gold)}`);
  if (s.settings.disabledUpgrades.includes(worker.id)) reasons.push('人員をONにしてください');
  if (s.run.status !== 'preparing') reasons.push('準備中のみ強化可能');
  const hintId = `upgrade-hint-${worker.id}`;
  return `<div class="worker-upgrade">${button('強化 '+next.goldCost+'金貨', `data-worker-upgrade="${worker.id}"${reasons.length ? ` aria-describedby="${hintId}"` : ''}`, reasons.length > 0)}${reasons.length ? `<small id="${hintId}" class="worker-upgrade-hint">${esc(reasons.join(' · '))}</small>` : ''}</div>`;
}
export function processingMarkup(s) {
  if (!s.meta.upgrades.includes("processing_worker")) return "";
  const status = getProcessingStatus(s), enabled = status.code !== "disabled";
  const worker = C.workers.find(w=>w.id === "processing_worker"), rw = s.run.workers.processing_worker;
  const recipe = RECIPES.find(r=>r.id === status.recipe);
  const options = worker.recipeChoices.filter(id=>resourceKnown(s,id) || id === rw.target).map(id=>`<option value="${id}" ${rw.target === id ? 'selected' : ''} ${enabled && !canConfigureWorker(s,worker.id,id).ok ? 'disabled' : ''}>${esc(label(id))}${enabled && !canConfigureWorker(s,worker.id,id).ok ? '（強化が必要）' : ''}</option>`).join('');
  const progress = status.code === "processing" ? ` ${status.batch.progress.toFixed(1)} / ${status.batch.duration.toFixed(1)}秒` : '';
  return `<section class="auto-cooking-panel processing-panel"><div class="auto-cooking-heading"><h3>加工職人 <small>段階 ${rw.level + 1}</small></h3><button data-toggle-upgrade="processing_worker" data-focus="processing-toggle" aria-label="加工職人を${enabled ? 'OFF' : 'ON'}にする" aria-pressed="${enabled}">${enabled ? 'ON' : 'OFF'}</button></div><div class="auto-cooking-controls"><label>加工する品<select data-worker="processing_worker" data-focus="processing-recipe" aria-label="加工する品" ${enabled ? '' : 'disabled'}>${options}</select></label><strong>${esc(label(status.output))} ${Math.floor(status.stock)}</strong><label>補充目標<input type="number" min="0" max="9999" value="${status.target}" data-target="processingTarget" data-focus="processing-target" aria-label="加工品の補充目標"></label>${s.settings.paused && enabled && status.code === 'paused' ? '<button class="button small gold-outline" data-command="processing-start">加工を開始</button>' : ''}</div><p>${esc(status.text)}${progress}</p><div class="processing-footer"><small>${Object.entries(getRecipeCost(s, recipe)).map(([id,n])=>`${esc(label(id))}${n}`).join('・')} → ${Object.entries(recipe.yields).map(([id,n])=>`${esc(label(id))}${n}`).join('・')}。素材集めは別途必要。</small>${workerUpgradeMarkup(s, worker)}</div></section>`;
}
export function automationMarkup(s) {
  let out = "";
  for (const w of C.workers.filter((w) => w.id !== "processing_worker" && s.meta.upgrades.includes(w.id))) {
    const rw = s.run.workers[w.id],
      l = w.levels[rw.level];
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
      )}</select></label>${workerUpgradeMarkup(s, w)}</article>`;
  }
  if (s.meta.upgrades.includes("auto_cook"))
    out += '<p class="fine-print">自動調理のON/OFF・補充目標は工房で設定できます。</p><button class="button small" data-tab="craft">自動調理を開く</button>';
  if (s.meta.upgrades.includes("processing_worker"))
    out += '<p class="fine-print">加工職人の作業先・補充目標・強化は工房で設定できます。</p><button class="button small" data-tab="craft">加工職人を開く</button>';
  if (s.meta.upgrades.includes("stock_targets"))
    out += `<details><summary>在庫の補充目標</summary>${s.settings.stockTargets.map((x) => `<label class="stock-setting">${esc(label(x.id))}<input type="number" min="0" max="9999" value="${x.count}" data-stock="${x.id}" data-focus="stock-${x.id}"></label>`).join("")}<div class="queue-controls"><select id="stock-resource">${C.resources
      .filter((x) => !["hide", "gold"].includes(x.id) && resourceKnown(s, x.id))
      .map((x) => `<option value="${x.id}">${x.name}</option>`)
      .join(
        "",
      )}</select><input id="stock-quantity" type="number" min="1" max="9999" value="20" aria-label="補充数">${button("追加", 'data-command="stock-add"')}</div></details>`;
  return out
    ? `<section class="automation-controls"><h3>仲間の作業と強化</h3>${out}</section>`
    : "";
}
export function templatesMarkup(s) {
  if (!s.meta.upgrades.includes("queue_templates")) return "";
  return `<details class="template-controls"><summary>保存した手順 (${s.meta.templates.length}/8)</summary><div class="queue-controls"><input id="template-name" maxlength="40" placeholder="手順の名前" aria-label="手順の名前">${button("予約を保存", 'data-command="template-save"', !s.run.queue.length || s.meta.templates.length >= 8)}</div>${s.meta.templates.map((t, i) => {
    const p = getTemplatePreview(s, i);
    return `<details class="template-preview"><summary>${esc(t.name)}<small>追加 ${p.additions.length} · 省略 ${p.items.filter(g => g.status === "skip").length} · 要確認 ${p.items.filter(g => g.status === "blocked").length}</small></summary><ul>${p.items.map(g => `<li class="${g.status}"><span>${g.status === "ready" ? "＋" : g.status === "skip" ? "✓" : "!"} ${esc(g.name)}${g.count > 1 ? ` ×${g.count}` : ""}</span><small>${esc(g.reason)}</small></li>`).join("")}</ul><div class="template-preview-actions">${button(`${p.additions.length}件を追加`, `data-template="${i}"`, !p.ok)}${button("手順を削除", `data-template-delete="${i}"`)}${p.reason ? `<small>${esc(p.reason)}</small>` : ""}</div></details>`;
  }).join("")}</details>`;
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
