import {cycleGoalsMarkup} from './cycle-goals-ui.js?v=0.6.102';
import{questStage}from './quest-content.js?v=0.6.102';
import{questProgress}from './quest-progress.js?v=0.6.102';
import{merchantMarkup}from './merchant-ui.js?v=0.6.102';
import {visibleWorkerUpgrade}from './worker-legacy.js?v=0.6.102';
import {cookingChoiceText,cookingBatchText}from './automation-status-ui.js?v=0.6.102';
import {inheritanceMapMarkup,inheritanceMapReturnMarkup}from './inheritance-map.js?v=0.6.102';
import {stockIcon as icon}from './stock-icons.js?v=0.6.102';
import {LEGACY_CATEGORIES,inheritanceMapTabs}from './legacy-categories.js?v=0.6.102';
import {finalWaveForRun}from './campaign-rules.js?v=0.6.102';
import {legacyRanksMarkup}from './legacy-ranks-ui.js?v=0.6.102';
import {isFreeFeature,freeFeatureMarkup}from './free-features.js?v=0.6.102';
import {hasUpgrade}from './free-features.js?v=0.6.102';
import { getStartingResources } from './engine.js?v=0.6.102';
import { challengesMarkup } from './strategy-ui.js?v=0.6.102';
import { getUpgradeDescription } from "./upgrades-ui.js?v=0.6.102";
import { CONTENT as C } from "./content.js?v=0.6.102";
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
} from "./engine.js?v=0.6.102";
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
const setupCategories=LEGACY_CATEGORIES.filter(c=>c.id!=='all');

function setupFooter(){return '<div class="setup-footer"><p data-setup-save-error role="alert" class="danger-text"></p><button class="button muted full-width" data-cancel-draft="1" data-focus="cancel-draft">今回の配分変更を取り消す</button><button class="button gold full-width" data-command="confirm-run">この構成で開始</button></div>';}
export function setupMarkup(s, category = "combat", mapOptions = {}) {
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
  const mapActive=category==='map'&&s.version!==1;
  const selected = setupCategories.find(c => c.id === category) || setupCategories[0];
  if(mapActive)return `<div class="setup-header"><h2 id="death-title">次の命への継承</h2><div class="setup-points">残り <strong>${d.points} pt</strong></div></div><div class="setup-tabs" role="tablist" aria-label="継承の表示">${inheritanceMapTabs('setup',true)}</div><div class="setup-upgrades setup-map-view" id="setup-upgrades" role="tabpanel" aria-labelledby="setup-inheritance-map-tab">${inheritanceMapMarkup(s,'setup',mapOptions)}</div>${setupFooter()}`;
  return `<div class="setup-header"><h2 id="death-title">次の命への継承</h2><div class="setup-points">残り <strong>${d.points} pt</strong></div></div><div class="setup-tabs" role="tablist" aria-label="継承の分類">${setupCategories.map(c => `<button role="tab" id="setup-tab-${c.id}" aria-selected="${c.id === selected.id}" aria-controls="setup-upgrades" tabindex="${c.id===selected.id?0:-1}" data-setup-category="${c.id}">${c.name}</button>`).join("")}${s.version!==1?inheritanceMapTabs('setup'):''}</div><div class="setup-upgrades" id="setup-upgrades" role="tabpanel" aria-labelledby="setup-tab-${selected.id}">${inheritanceMapReturnMarkup(s,'setup',mapOptions)}${selected.rankGroup?legacyRanksMarkup(s,true,selected.rankGroup):LEGACY_UPGRADES.filter(u => selected.kinds.includes(u.kind)&&!isFreeFeature(u.id)&&visibleWorkerUpgrade(u,d)&&!["cycle_acceleration","acceleration_extension"].includes(u.id)).map(
    (u) => {
      const owned = d.upgrades.includes(u.id),
        allowed = canPurchaseUpgrade(preview, u.id);
      const child = LEGACY_UPGRADES.some(
        (x) => d.upgrades.includes(x.id) && x.unlock.requires?.includes(u.id),
      );
      
      return `<div class="setup-upgrade" data-upgrade-state="${owned?'owned':allowed.ok?'available':'locked'}"><span>${esc(u.name)}<small>${owned ? d.paidCosts[u.id] : u.cost} pt · ${esc(getUpgradeDescription(s, u))}</small>${!owned && !allowed.ok ? `<small class="setup-unlock-hint">${esc(allowed.reason)}</small>` : ""}</span>${owned ? (u.kind!=="augment_reroll"&&!u.workerId?button((s.run.legacyDraft.disabledUpgrades??s.settings.disabledUpgrades).includes(u.id)?"次の命で有効":"次の命で無効", `data-toggle-upgrade="${u.id}"`):"")+button("外す", `data-refund="${u.id}" title="${child ? "先に上位の解放を外してください。" : "購入時のポイントを返却"}"`, child) : button("解放", `data-purchase="${u.id}" title="${esc(allowed.reason)}"`, !allowed.ok)}</div>`;
    },
  ).join(
    "",
  )}${selected.free?freeFeatureMarkup(s,selected.free):''}${challengesMarkup(s)}<section class="setup-notes" aria-label="次の命への引き継ぎ"><details class="setup-info"><summary>引き継ぎについて</summary><p class="fine-print campaign-transition">次の人生は本編36波。現在の人生は本編${finalWaveForRun(s)}波の構成で、過去のクリア記録・獲得済み報酬は引き継ぎます。</p></details><details class="starting-grant"><summary>次の転生で受け取る資源</summary><div>${Object.keys(getStartingResources(s)).length ? Object.entries(getStartingResources(s)).map(([id,n])=>`<span>${esc(RESOURCES[id]?.name || id)} <b>${n}</b></span>`).join("") : "初期支給なし"}</div><small>転生を確定した時だけ支給。現在の手持ちは持ち越しません。</small></details>${s.meta.templates.length ? '<p class="fine-print">保存手順は維持されます。返却した機能はこの周では使えません。</p>' : ""}</section></div>${setupFooter()}`;
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
export function diplomacyMarkup(s) {
 return '<div class="diplomacy-countries">'+C.diplomacy.filter(c=>s.run.countries[c.id].status!=='locked').map(c=>{
 const r=s.run.countries[c.id],pending=r.status==='pending',ready=s.run.status==='preparing',affordable=Object.entries(c.cost).every(([id,n])=>s.run.resources[id]>=n),status={pending:'返答待ち',allied:'同盟中',hostile:'敵対中',defeated:'撃退済み'}[r.status];
 const aid=c.id==='saphra'?'準備中15秒ごとに金貨1':'鉱石採集が15%高速化',victory=c.id==='saphra'?'金貨24・攻撃+4。攻撃+10%・以後の撃退金貨+50%':'鉄塊6・獣皮4';
 return '<section class="diplomacy-card country-card '+r.status+'"><div class="diplomacy-heading"><span class="country-emblem">'+icon(c.id==='saphra'?'flag':'pickaxe')+'</span><h3>'+esc(c.name)+'</h3><span class="diplomacy-status">'+status+'</span></div>'+(pending?
 '<div class="diplomacy-deadline '+(r.deadline-s.run.elapsed<=30?'danger-text':'')+'">返答まで <strong>'+Math.max(0,Math.ceil(r.deadline-s.run.elapsed))+'秒</strong><small>期限後は敵対</small></div><div class="diplomacy-costs">'+Object.entries(c.cost).map(([id,n])=>'<span class="payment-item '+(s.run.resources[id]<n?'is-short':'')+'">'+icon(id)+'<span>'+esc(label(id))+'<b>'+n+'</b><small>所持 '+Math.floor(s.run.resources[id])+(s.run.resources[id]<n?' ・不足 '+Math.ceil(n-s.run.resources[id]):' ・支払い可')+'</small></span></span>').join('')+'</div><div class="diplomacy-choice-grid"><div><h4>援助して同盟</h4><p>'+aid+'</p>'+button('援助する', 'data-aid="'+c.id+'"',!ready||!affordable)+'<small>'+(!ready?'準備中に返答できます':!affordable?'支払い素材が不足しています':'上記の素材を支払います')+'</small></div><div><h4>拒否して迎え撃つ</h4><p>次の襲撃で敵軍が加勢</p>'+button('迎え撃つ','data-refuse="'+c.id+'"',!ready)+'</div></div><details class="diplomacy-details" data-detail-key="country-'+c.id+'"><summary data-focus="country-detail-'+c.id+'">敵軍の強化・撃退報酬</summary><p>敵軍はHP+15%・攻撃+10%'+(c.id==='mining_realm'?'・防御+3':'')+'。撃退：'+victory+'（この命）。</p></details>':
 '<p class="diplomacy-result">'+(r.status==='allied'?(c.id==='saphra'?'交易収入 '+Math.floor(r.incomeTotal)+'金貨 ・ '+aid:aid):r.status==='hostile'?'予定された次の襲撃に加勢します。':victory+'（この命）。')+'</p>')+'</section>';
 }).join('')+'</div>';
}
export function marketMarkup(s,marketSide="buy",marketCount=1){return (
    `<div class="market-heading"><h3>市場</h3><span>金貨 ${Number(s.run.resources.gold.toFixed(2))}</span></div>${
      !s.run.facilities.market
        ? "<p>村に市場を建設すると取引できます。</p>"
        : `<div class="market-tabs" role="tablist" aria-label="売買の切り替え"><button role="tab" aria-selected="${marketSide === 'buy'}" data-market-side="buy">買う</button><button role="tab" aria-selected="${marketSide === 'sell'}" data-market-side="sell">売る</button></div><div class="market-options"><label>数量<select id="market-count" data-focus="market-count">${[1,10,100,"all"].map(n=>`<option value="${n}" ${marketCount === n ? 'selected' : ''}>${n === 'all' ? '全て' : n+'個'}</option>`).join('')}</select></label><small>${marketSide === 'sell' ? '売値は買値より低くなります。' : '発見済みの品を購入できます。'}</small></div>${merchantMarkup(s,marketSide,marketCount)}<h3>常設市場</h3><div class="market-list" role="tabpanel" aria-label="${marketSide === 'sell' ? '売る' : '買う'}">${C.resources.filter(r=>r.id !== 'gold' && resourceKnown(s,r.id)).map(r=>{
          const q=getTradeQuote(s,r.id,marketSide,marketCount);
          return `<article class="market-item"><div><h4>${esc(r.name)}</h4><p>所持 ${Number(s.run.resources[r.id].toFixed(2))} · ${q.count ?? 0}個 → ${q.total ?? 0}金貨</p></div><div>${button(`${q.count ?? 0}個${marketSide === 'sell' ? '売る' : '買う'} · ${q.total ?? 0}金貨`, `data-trade-resource="${r.id}" data-focus="trade-${r.id}"`, !q.ok)}${!q.ok ? `<small class="trade-reason">${esc(q.reason)}</small>` : ''}</div></article>`;
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
  return `<section class="auto-cooking-panel"><div class="auto-cooking-heading"><h3>自動調理 <small>${esc(cookingBatchText(s)||cookingChoiceText(s))}</small></h3><button data-toggle-upgrade="auto_cook" data-focus="auto-cooking-toggle" aria-label="自動調理を${enabled ? "OFF" : "ON"}にする" aria-pressed="${enabled}">${enabled ? "ON" : "OFF"}</button></div><div class="auto-cooking-controls"><strong>食料 ${Math.floor(status.food)}</strong><label>補充目標<input type="number" min="0" max="9999" value="${status.target}" data-target="foodTarget" data-focus="cooking-food-target"></label>${s.settings.paused && enabled && s.run.status === "preparing" && (status.code === "paused") ? '<button class="button small gold-outline" data-command="auto-cook-start" data-focus="auto-cook-start">調理を開始</button>' : ""}</div><p>${esc(autoCookStatus(s))}</p><small>${esc(getUpgradeDescription(s,{id:"auto_cook"}))} 素材集めは別途必要。</small></section>`;
}
function workerUpgradeMarkup(s,worker){const rank=s.run.workers[worker.id].level+1;return `<div class="worker-upgrade"><small>${rank>=20?'最大Lv.20':`転生時に継承 ${Math.ceil((rank+1)/4)}pt で Lv.${rank+1}へ強化`}</small></div>`;}
export function processingMarkup(s) {
  if (!s.meta.upgrades.includes("processing_worker")) return "";
  const status = getProcessingStatus(s), enabled = status.code !== "disabled";
  const worker = C.workers.find(w=>w.id === "processing_worker"), rw = s.run.workers.processing_worker;
  const recipe = RECIPES.find(r=>r.id === status.recipe);
  const options = worker.recipeChoices.filter(id=>resourceKnown(s,id) || id === rw.target).map(id=>`<option value="${id}" ${rw.target === id ? 'selected' : ''} ${enabled && !canConfigureWorker(s,worker.id,id).ok ? 'disabled' : ''}>${esc(label(id))}${enabled && !canConfigureWorker(s,worker.id,id).ok ? '（強化が必要）' : ''}</option>`).join('');
  const progress = status.code === "processing" ? ` ${status.batch.progress.toFixed(1)} / ${status.batch.duration.toFixed(1)}秒` : '';
  return `<section class="auto-cooking-panel processing-panel"><div class="auto-cooking-heading"><h3>加工職人 <small>永続Lv.${rw.level + 1}/20</small></h3><button data-toggle-upgrade="processing_worker" data-focus="processing-toggle" aria-label="加工職人を${enabled ? 'OFF' : 'ON'}にする" aria-pressed="${enabled}">${enabled ? 'ON' : 'OFF'}</button></div><div class="auto-cooking-controls"><label>加工する品<select data-worker="processing_worker" data-focus="processing-recipe" aria-label="加工する品" ${enabled ? '' : 'disabled'}>${options}</select></label><strong>${esc(label(status.output))} ${Math.floor(status.stock)}</strong><label>補充目標<input type="number" min="0" max="9999" value="${status.target}" data-target="processingTarget" data-focus="processing-target" aria-label="加工品の補充目標"></label>${s.settings.paused && enabled && status.code === 'paused' ? '<button class="button small gold-outline" data-command="processing-start">加工を開始</button>' : ''}</div><p>${esc(status.text)}${progress}</p><div class="processing-footer"><small>${Object.entries(getRecipeCost(s, recipe)).map(([id,n])=>`${esc(label(id))}${n}`).join('・')} → ${Object.entries(recipe.yields).map(([id,n])=>`${esc(label(id))}${n}`).join('・')}。素材集めは別途必要。</small>${workerUpgradeMarkup(s, worker)}</div></section>`;
}
export function automationMarkup(s) {
  let out = "";
  for (const w of C.workers.filter((w) => w.id !== "processing_worker" && s.meta.upgrades.includes(w.id))) {
    const rw = s.run.workers[w.id],
      l = w.levels[rw.level];
    out += `<article class="worker-control"><div><strong>${esc(LEGACY_UPGRADES.find((u) => u.id === w.id).name)}</strong><small>永続Lv.${rw.level + 1}/20${l.interval ? ` / ${l.interval}秒ごと ${l.quantity}個` : ""}</small></div><label>作業<select data-worker="${w.id}" data-focus="worker-${w.id}">${[
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
  if (hasUpgrade(s,"stock_targets"))
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
  if (!hasUpgrade(s,"queue_templates")) return "";
  return `<details class="template-controls" data-detail-key="templates"><summary>保存した手順 (${s.meta.templates.length}/8)</summary><div class="queue-controls"><input id="template-name" maxlength="40" placeholder="手順の名前" aria-label="手順の名前">${button("予約を保存", 'data-command="template-save"', !s.run.queue.length || s.meta.templates.length >= 8)}</div>${s.meta.templates.map((t, i) => {
    const p = getTemplatePreview(s, i);
    return `<details class="template-preview" data-detail-key="template-${i}"><summary>${esc(t.name)}<small>追加 ${p.additions.length} · 省略 ${p.items.filter(g => g.status === "skip").length} · 要確認 ${p.items.filter(g => g.status === "blocked").length}</small></summary><ul>${p.items.map(g => `<li class="${g.status}"><span>${g.status === "ready" ? "＋" : g.status === "skip" ? "✓" : "!"} ${esc(g.name)}${g.count > 1 ? ` ×${g.count}` : ""}</span><small>${esc(g.reason)}</small></li>`).join("")}</ul><div class="template-preview-actions">${button(`${p.additions.length}件を追加`, `data-template="${i}"`, !p.ok)}${button("現在の予約で上書き", `data-template-overwrite="${i}" data-focus="template-overwrite-${i}"`, !s.run.queue.length || s.settings.disabledUpgrades.includes("queue_templates"))}${button("手順を削除", `data-template-delete="${i}"`)}${p.reason ? `<small>${esc(p.reason)}</small>` : ""}</div></details>`;
  }).join("")}</details>`;
}
export function milestoneMarkup(s) {
 let stage='';const items=MILESTONES.map(q=>{const group=questStage(q),heading=stage!==group?'<h4 class="quest-stage">'+esc(group)+'</h4>':'';stage=group;const done=s.meta.completedMilestones.includes(q.id),progress=done?q.target:questProgress(s,q);return heading+'<div data-quest="'+q.id+'" data-completed="'+done+'"><span>'+(done?'✓ ':'○ ')+esc(q.name)+(q.description?'<br><small>'+esc(q.description)+(progress===null?'':' '+progress+' / '+q.target)+'</small>':'')+'</span><strong>'+q.reward+' pt</strong></div>';}).join('');
 return '<details class="milestone-list"><summary>初達成 '+s.meta.completedMilestones.length+'/'+MILESTONES.length+'</summary><p class="fine-print">報酬はセーブ全体で一度だけ自動反映。転生・振り直し後も受取済みを保持します。</p>'+cycleGoalsMarkup(s,getRecipeCost,label)+items+'</details>';
}
export function synergyMarkup(s) {
  const selected = getSynergies(s);
  return selected.length
    ? `<div class="synergy-strip">${selected.map((id) => `<span>${{ economy: "交易の連携", martial: "武勇の連携", fortress: "防衛の連携" }[id]}</span>`).join("")}</div>`
    : "";
}
