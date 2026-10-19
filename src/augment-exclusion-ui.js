import {getAugmentExclusionStatus,getCatalog}from './engine.js?v=0.6.38';
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function augmentExclusionMarkup(s,id,error=''){
 const status=getAugmentExclusionStatus(s,id),d=getCatalog(s).AUGMENTS.find(a=>a.id===id);
 return '<h2 id="augment-exclude-title">この候補を外す</h2><p><strong>'+esc(d?.name||id)+'</strong>を、この人生の候補から外します。</p><p>残る2候補を保持し、1候補だけ補充します。今後の提示にも出なくなります。</p><p>除外はこの人生で1回だけ。再抽選の残り回数を1回消費します。次の人生では除外は解除されます。</p><p data-exclusion-error role="alert" class="danger-text">'+esc(error||status.reason)+'</p><div class="confirm-actions"><button class="button muted" data-close="augment-exclude-dialog">取消</button><button class="button gold" data-command="confirm-exclude-augment" '+(status.canExclude?'':'disabled')+'>再抽選1回を使って除外</button></div>';
}
