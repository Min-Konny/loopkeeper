import{MEALS}from './meal-content.js?v=0.6.72';
import{mealStatus,totalFood}from './meals.js?v=0.6.72';
import{automationStatusMarkup,cookingChoiceText,cookingBatchText,escapeText as esc}from './automation-status-ui.js?v=0.6.72';
const option=(id,label,value)=>`<option value="${id}" ${id===value?'selected':''}>${esc(label)}</option>`;
export function mealEffectText(s){const m=mealStatus(s);return m?`${m.name}：${m.label} · 残り${Math.ceil(m.remaining)}戦闘秒`:'食事効果なし';}
export function mealMarkup(s){
 if(s.version!==2)return'';
 const locked=s.run.augments.offer.length||!['preparing','combat'].includes(s.run.status);
 const preference=MEALS.find(m=>m.id===s.settings.mealPreference);
 const missing=preference&&!(s.run.resources[preference.id]>0);
 const batch=cookingBatchText(s);
 return `${automationStatusMarkup(s)}<section class="meal-overview" aria-label="食料と料理"><div class="meal-stock"><strong>食料合計 ${totalFood(s)}食</strong><span>救護所用 ${s.run.resources.food||0} · スープ ${s.run.resources.herb_soup||0} · 魚 ${s.run.resources.fish_meal||0} · 卵 ${s.run.resources.egg_meal||0}</span></div><p class="meal-current-effect">${mealEffectText(s)}</p><details class="meal-panel" data-detail-key="meal-panel"><summary>料理と自動消費の設定 <small>優先：${preference?.name||'薬草のスープ'}</small></summary><div class="meal-settings"><label>戦闘で優先する食料<select data-meal-preference data-focus="meal-preference">${option('herb_soup','薬草のスープ（戦闘回復）',s.settings.mealPreference)}${MEALS.map(m=>option(m.id,`${m.name}（${m.label}）`,s.settings.mealPreference)).join('')}</select></label><label>次から自動調理する料理<select data-auto-cook-recipe data-focus="auto-cook-recipe">${option('auto','おまかせ（卵優先設定に従う）',s.settings.autoCookRecipe)}${option('rations','薬草の煮込み（救護所用食料）',s.settings.autoCookRecipe)}${MEALS.map(m=>option(m.recipe,m.name,s.settings.autoCookRecipe)).join('')}</select></label></div><p class="meal-plan">${batch?`現在の調理：${esc(batch)}（材料支払済み）<br>`:''}次の調理：${esc(cookingChoiceText(s))}</p>${missing?'<p class="meal-stock-warning">優先料理の在庫がありません。戦闘開始時の自動消費はできません。回復には薬草のスープを使います。</p>':''}<div class="meal-buttons">${MEALS.map(m=>`<button class="button small gold-outline" data-use-meal="${m.id}" data-focus="use-${m.id}" ${locked||!s.run.resources[m.id]?'disabled':''}>${m.name}を今食べる（${s.run.resources[m.id]||0}）</button>`).join('')}</div><p class="fine-print">魚・卵料理は回復せず、満タンでも1食で効果を付与。効果は90戦闘秒・同時に1種類。同種は時間更新、別種は置換します。卵の攻撃速度には上限があります。</p><p class="fine-print">優先料理は戦闘開始時も1食消費。戦闘回復は工房で製作・予約した薬草のスープを使用。自動調理は救護所用の食料だけを補充します。食料は救護所で戦闘外回復に消費し、外交・契約・売買にも使えます。</p></details></section>`;
}
