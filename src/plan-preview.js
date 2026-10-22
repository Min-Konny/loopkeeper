import {icon} from './icons.js?v=0.6.55';
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function planPreviewMarkup(plan,recipe){
 if(!plan?.ok || plan.steps.length<=1)return '';
 const text=plan.training?'必要な技能を育てながら素材を準備します。':plan.summary;
 if(!plan.training && plan.steps.length>6)return '<details class="plan-details" data-detail-key="plan-'+esc(recipe.id)+'"><summary data-focus="plan-details-'+esc(recipe.id)+'" aria-label="'+esc(recipe.name)+'の手順を確認">'+icon('book')+'手順を確認（'+plan.steps.length+'工程）</summary><p>'+esc(text)+'</p></details>';
 return '<div class="plan-preview">'+icon('book')+'<span>'+esc(text)+'</span></div>';
}
