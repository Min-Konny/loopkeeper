import {hasUpgrade}from './free-features.js?v=0.6.101';
import { icon } from './icons.js?v=0.6.101';
import { getCatalog, resourceKnown, getUnlocks, isLegacy, setMaterialPriority } from './engine.js?v=0.6.101';
import { commitStoredGameEdit } from './save-storage.js?v=0.6.101';
export function materialPriorityChoices(state) {
  return Object.entries(getCatalog(state).RESOURCES).filter(([id]) => isLegacy(state) || resourceKnown(state, id) && (id !== 'gold' || getUnlocks(state).facilities)).map(([id, resource]) => ({ id, name: resource.name }));
}
export function prepareMaterialPriority(state) {
  if (!hasUpgrade(state,"action_queue")) return {ok:false,reason:'行動予約を解放してください。'};
  const allowed = new Set(materialPriorityChoices(state).map(resource => resource.id));
  return {ok:true, proposal:{state, run:state.run, originalJSON:JSON.stringify(state.settings.craftMaterialPriority || []), draft:[...(state.settings.craftMaterialPriority || [])], error:''}};
}
export function commitMaterialPriority(storage, state, proposal, {isOwner=()=>false, now=Date.now()}={}) {
  if (!isOwner()) return {ok:false,reason:'別のタブでプレイ中です。設定を開き直してください。'};
  if (!proposal || proposal.state!==state || proposal.run!==state.run || proposal.originalJSON!==JSON.stringify(state.settings.craftMaterialPriority || [])) return {ok:false,reason:'進行または設定が変わりました。素材の優先順を開き直してください。'};
  if (JSON.stringify(proposal.draft)===proposal.originalJSON) return {ok:true,state,changed:false};
  const candidate = structuredClone(state), result=setMaterialPriority(candidate, proposal.draft);
  if (!result.ok) return result;
  if (!isOwner()) return {ok:false,reason:'操作権が移りました。設定を開き直してください。'};
  try { return {ok:true,state:commitStoredGameEdit(storage,state,candidate,{now})}; }
  catch { return {ok:false,reason:'保存できないため変更を中止しました。元の優先順と作業は残っています。'}; }
}
const esc = value => String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
export function allMaterialPriorityChoices(state) {
  const allowed = new Set(materialPriorityChoices(state).map(r=>r.id));
  return Object.entries(getCatalog(state).RESOURCES).map(([id,r])=>({id,name:allowed.has(id)?r.name:'未発見の素材',known:allowed.has(id)}));
}
export function editMaterialPriority(state, proposal, {toggle, move, direction, reset} = {}) {
  if (!proposal || proposal.state!==state || proposal.run!==state.run || proposal.originalJSON!==JSON.stringify(state.settings.craftMaterialPriority || [])) return false;
  const allowed = new Set(materialPriorityChoices(state).map(r=>r.id));
  if(reset) proposal.draft=[];
  if(toggle && allowed.has(toggle)) proposal.draft=proposal.draft.includes(toggle)?proposal.draft.filter(id=>id!==toggle):[...proposal.draft,toggle];
  if(move && [-1,1].includes(direction)) {
    const i=proposal.draft.indexOf(move),j=i+direction;
    if(i>=0 && j>=0 && j<proposal.draft.length) [proposal.draft[i],proposal.draft[j]]=[proposal.draft[j],proposal.draft[i]];
  }
  proposal.error='';
  return true;
}
export function materialPriorityMarkup(state, proposal) {
  const choices=allMaterialPriorityChoices(state),names=new Map(choices.filter(r=>r.known).map(r=>[r.id,r.name]));
  const draft=proposal.draft,stale=proposal.state!==state || proposal.run!==state.run || proposal.originalJSON!==JSON.stringify(state.settings.craftMaterialPriority || []);
  const groups=[
    {name:'採集・食料',items:choices.filter(r=>r.known && ['wood','stone','herbs','food','fish','hide'].includes(r.id))},
    {name:'鉱石・加工材',items:choices.filter(r=>r.known && !['wood','stone','herbs','food','fish','hide','gold'].includes(r.id))},
    {name:'金貨',items:choices.filter(r=>r.known && r.id==='gold')},
    {name:'未発見',items:choices.filter(r=>!r.known)}
  ];
  const tile = r => {
    const rank=draft.indexOf(r.id)+1;
    return '<button type="button" class="priority-tile'+(rank?' selected':'')+'" data-priority-toggle="'+r.id+'" data-focus="priority-tile-'+r.id+'" aria-pressed="'+!!rank+'" '+(stale || !r.known?'disabled':'')+'>'+icon(r.known?r.id:'lock')+'<span class="priority-name">'+esc(r.name)+'</span><span class="priority-rank">'+(r.known?(rank?rank+'位':'＋'):'🔒')+'</span></button>';
  };
  const row = (id,i) => {
    const name=names.get(id) || '未発見の素材';
    return '<li data-priority-row><span class="priority-row-name" data-priority-focus tabindex="-1">'+icon(names.has(id)?id:'lock')+'<b>'+(i+1)+'位</b> '+esc(name)+'</span><div class="priority-row-buttons"><button type="button" class="icon-button" data-priority-move="'+id+'" data-direction="-1" data-focus="priority-up-'+id+'" aria-label="'+esc(name)+'を上へ" '+(stale || i===0?'disabled':'')+'>↑</button><button type="button" class="icon-button" data-priority-move="'+id+'" data-direction="1" data-focus="priority-down-'+id+'" aria-label="'+esc(name)+'を下へ" '+(stale || i===draft.length-1?'disabled':'')+'>↓</button><button type="button" class="icon-button" data-priority-toggle="'+id+'" data-focus="priority-remove-'+id+'" aria-label="'+esc(name)+'の優先を解除" '+(stale?'disabled':'')+'>×</button></div></li>';
  };
  const changed=JSON.stringify(draft)!==proposal.originalJSON;
  return '<div class="dialog-heading"><h2 id="material-priority-title">素材集めの優先順</h2><button type="button" class="icon-button" data-close="material-priority-dialog" data-focus="priority-close" aria-label="閉じる">×</button></div>'
    +'<p class="fine-print">素材をクリックして指定・解除。選んだ順に優先します。指定しない素材は従来の順で集めます。</p>'
    +'<p class="priority-timing">'+(isLegacy(state)?'旧形式：新しく予約した自動作成から反映します。既存の予約はそのまま。転生は不要です。':'現在の作業はそのまま完了し、次の材料選びから反映します。進行中の製作予約にも適用します。')+'</p>'
    +(stale?'<p class="save-warning" role="alert">進行または設定が変わりました。閉じて開き直してください。</p>':'')
    +(proposal.error?'<p class="save-warning" role="alert" tabindex="-1" data-priority-error>'+esc(proposal.error)+'</p>':'')
    +'<div class="priority-editor"><section class="priority-catalog" aria-label="全素材">'+groups.filter(g=>g.items.length).map(g=>'<section><h3>'+g.name+'</h3><div class="priority-tiles">'+g.items.map(tile).join('')+'</div></section>').join('')+'<p class="fine-print">未発見素材はロック表示。発見後に名前が表示され、選べます。</p></section>'
    +'<section class="priority-order" aria-labelledby="priority-order-title"><h3 id="priority-order-title" tabindex="-1">選択した優先順</h3><p class="priority-draft-status" role="status" aria-live="polite">'+draft.length+'素材を指定 · '+(changed?'未保存':'変更なし')+'</p>'
    +(draft.length?'<ol class="priority-list" data-scroll-key="material-priority-list">'+draft.map(row).join('')+'</ol>':'<p class="priority-default">初期順です。左の素材から優先したいものを選んでください。</p>')+'</section></div>'
    +'<div class="save-options priority-footer"><button type="button" class="button muted" data-priority-reset data-focus="priority-reset" '+(stale || !draft.length?'disabled':'')+'>初期順へ戻す</button><button type="button" class="button muted" data-close="material-priority-dialog" data-focus="priority-cancel">キャンセル</button><button type="button" class="button gold" data-command="material-priority-apply" data-focus="priority-apply" '+(stale?'disabled':'')+'>'+(changed?'この順で保存':'変更せず閉じる')+'</button></div>';
}
