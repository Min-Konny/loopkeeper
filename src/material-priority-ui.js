import { getCatalog, resourceKnown, getUnlocks, isLegacy, setMaterialPriority } from './engine.js?v=0.4.7';
import { commitStoredGameEdit } from './save-storage.js?v=0.4.7';
export function materialPriorityChoices(state) {
  return Object.entries(getCatalog(state).RESOURCES).filter(([id]) => isLegacy(state) || resourceKnown(state, id) && (id !== 'gold' || getUnlocks(state).facilities)).map(([id, resource]) => ({ id, name: resource.name }));
}
export function prepareMaterialPriority(state) {
  if (!state.meta.upgrades.includes('action_queue')) return {ok:false,reason:'行動予約を解放してください。'};
  const allowed = new Set(materialPriorityChoices(state).map(resource => resource.id));
  return {ok:true, proposal:{state, run:state.run, originalJSON:JSON.stringify(state.settings.craftMaterialPriority || []), draft:(state.settings.craftMaterialPriority || []).filter(id=>allowed.has(id)), choice:''}};
}
export function commitMaterialPriority(storage, state, proposal, {isOwner=()=>false, now=Date.now()}={}) {
  if (!isOwner()) return {ok:false,reason:'別のタブでプレイ中です。設定を開き直してください。'};
  if (!proposal || proposal.state!==state || proposal.run!==state.run || proposal.originalJSON!==JSON.stringify(state.settings.craftMaterialPriority || [])) return {ok:false,reason:'進行または設定が変わりました。素材の優先順を開き直してください。'};
  const candidate = structuredClone(state), result=setMaterialPriority(candidate, proposal.draft);
  if (!result.ok) return result;
  if (!isOwner()) return {ok:false,reason:'操作権が移りました。設定を開き直してください。'};
  try { return {ok:true,state:commitStoredGameEdit(storage,state,candidate,{now})}; }
  catch { return {ok:false,reason:'保存できないため変更を中止しました。元の優先順と作業は残っています。'}; }
}
const esc = value => String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
export function materialPriorityMarkup(state, proposal) {
  const choices=materialPriorityChoices(state), names=new Map(choices.map(resource=>[resource.id,resource.name]));
  const draft=proposal.draft.filter(id=>names.has(id)), remaining=choices.filter(resource=>!draft.includes(resource.id));
  const stale=proposal.state!==state || proposal.run!==state.run || proposal.originalJSON!==JSON.stringify(state.settings.craftMaterialPriority || []);
  const selected=remaining.some(resource=>resource.id===proposal.choice) ? proposal.choice : remaining[0]?.id;
  return `<div class="dialog-heading"><h2 id="material-priority-title">素材集めの優先順</h2><button class="icon-button" data-close="material-priority-dialog" aria-label="閉じる">×</button></div><p class="fine-print">製作・建設目標の不足素材に適用。前提や採集・加工の可否を守り、指定していない素材は従来の順です。</p><p class="priority-timing">${isLegacy(state)?'旧方式：新しく予約した自動作成から反映します。今ある予約はそのまま。転生は不要です。':'現在の作業はそのまま完了し、次の材料選びから反映します。今ある製作予約にも適用します。'}</p>${stale?'<p class="save-warning">進行または設定が変わりました。閉じて開き直してください。</p>':''}<div class="priority-add"><label>優先する素材<select data-priority-choice data-focus="priority-choice" ${stale || !remaining.length?'disabled':''}>${remaining.map(resource=>`<option value="${resource.id}" ${resource.id===selected?'selected':''}>${esc(resource.name)}</option>`).join('')}</select></label><button class="button small gold-outline" data-priority-add data-focus="priority-add" ${stale || !remaining.length?'disabled':''}>末尾に追加</button></div>${draft.length?`<ol class="priority-list" data-scroll-key="material-priority-list">${draft.map((id,index)=>`<li data-priority-row><span data-priority-focus tabindex="-1">${esc(names.get(id))}</span><button class="icon-button" data-priority-move="${id}" data-direction="-1" data-focus="priority-up-${id}" aria-label="${esc(names.get(id))}を上へ" ${stale || index===0?'disabled':''}>↑</button><button class="icon-button" data-priority-move="${id}" data-direction="1" data-focus="priority-down-${id}" aria-label="${esc(names.get(id))}を下へ" ${stale || index===draft.length-1?'disabled':''}>↓</button><button class="icon-button" data-priority-remove="${id}" data-focus="priority-remove-${id}" aria-label="${esc(names.get(id))}の優先を解除" ${stale?'disabled':''}>×</button></li>`).join('')}</ol>`:'<p class="priority-default">初期順です。素材を追加すると優先順を指定できます。</p>'}<div class="save-options"><button class="button muted" data-priority-reset ${stale || !draft.length?'disabled':''}>初期順へ戻す</button><button class="button muted" data-close="material-priority-dialog">キャンセル</button><button class="button gold" data-command="material-priority-apply" ${stale?'disabled':''}>この順で保存</button></div>`;
}
