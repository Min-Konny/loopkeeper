import{MEALS}from './meal-content.js?v=0.6.66';
import{mealStatus,totalFood}from './meals.js?v=0.6.66';
import{automationStatusMarkup,cookingChoiceText,cookingBatchText,escapeText as esc}from './automation-status-ui.js?v=0.6.66';
const option=(id,label,value)=>`<option value="${id}" ${id===value?'selected':''}>${esc(label)}</option>`;
export function mealEffectText(s){const m=mealStatus(s);return m?`${m.name}：${m.label} · 残り${Math.ceil(m.remaining)}戦闘秒`:'食事効果なし';}
export function mealMarkup(s){
 if(s.version!==2)return'';
 const locked=s.run.augments.offer.length||!['preparing','combat'].includes(s.run.status);
 const preference=MEALS.find(m=>m.id===s.settings.mealPreference);
 const missing=preference&&!(s.run.resources[preference.id]>0);
 const batch=cookingBatchText(s);
 return `${automationStatusMarkup(s)}<section class="meal-overview" aria-label="食料と料理"><div class="meal-stock"><strong>食料合計 ${totalFood(s)}食</strong><span>汎用 ${s.run.resources.food||0} · 魚 ${s.run.resources.fish_meal||0} · 卵 ${s.run.resources.egg_meal||0}</span></div><p class="meal-current-effect">${mealEffectText(s)}</p><details class="meal-panel" data-detail-key="meal-panel"><summary>料理と自動消費の設定 <small>優先：${preference?.name||'汎用食料'}</small></summary><div class="meal-settings"><label>戦闘で優先する食料<select data-meal-preference data-focus="meal-preference">${option('food','汎用食料（回復のみ）',s.settings.mealPreference)}${MEALS.map(m=>option(m.id,`${m.name}（${m.label}）`,s.settings.mealPreference)).join('')}</select></label><label>次から自動調理する料理<select data-auto-cook-recipe data-focus="auto-cook-recipe">${option('auto','おまかせ（卵優先設定に従う）',s.settings.autoCookRecipe)}${option('cook_meal','薬草のスープ（汎用食料）',s.settings.autoCookRecipe)}${MEALS.map(m=>option(m.recipe,m.name,s.settings.autoCookRecipe)).join('')}</select></label></div><p class="meal-plan">${batch?`現在の調理：${esc(batch)}（材料支払済み）<br>`:''}次の調理：${esc(cookingChoiceText(s))}</p>${missing?'<p class="meal-stock-warning">優先料理の在庫がありません。戦闘開始時の自動消費はできません。回復には他の食料を使います。</p>':''}<div class="meal-buttons">${MEALS.map(m=>`<button class="button small gold-outline" data-use-meal="${m.id}" data-focus="use-${m.id}" ${locked||!s.run.resources[m.id]?'disabled':''}>${m.name}を今食べる（${s.run.resources[m.id]||0}）</button>`).join('')}</div><p class="fine-print">満タンでも1食で効果を付与。効果は90戦闘秒・同時に1種類。同種は時間更新、別種は置換します。卵の攻撃速度には上限があります。</p><p class="fine-print">優先料理は戦闘開始時も1食消費。回復は優先→汎用→他の料理の順。自動調理は準備中のみ、食料合計が補充目標に達すると止まります。外交・契約・売買には汎用食料を使います。</p></details></section>`;
}
