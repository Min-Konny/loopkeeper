import {CONTENT as C} from './content.js?v=0.6.68';
import {RECIPES,LEGACY_UPGRADES,getAutoCookingStatus,getProcessingStatus,canConfigureWorker} from './engine.js?v=0.6.68';

export const escapeText=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const recipes=new Map(RECIPES.map(r=>[r.id,r]));
export function cookingChoiceText(s){
  if(s.settings.autoCookRecipe==='auto'||!s.settings.autoCookRecipe)return s.settings.farmAutoCook?'おまかせ（解放・技能・材料が揃えば卵、他はスープ）':'おまかせ（スープ）';
  return recipes.get(s.settings.autoCookRecipe)?.name||'未選択';
}
export function cookingBatchText(s){return s.run.autoCraft?recipes.get(s.run.autoCraft.id)?.name||'調理中の料理':null;}
const remaining=batch=>Math.max(0,batch.duration-batch.progress).toFixed(1);
function statusText(status){return status.batch?`${status.text} · 残り${remaining(status.batch)}ゲーム秒`:status.text;}
export function automationRows(s){
  if(s.version!==2)return [];
  const rows=[];
  for(const [id,name,get] of [['auto_cook','自動調理',getAutoCookingStatus],['processing_worker','加工職人',getProcessingStatus]]){
    if(!s.meta.upgrades.includes(id))continue;
    const status=get(s);rows.push({id,name,code:status.code,text:statusText(status),tab:'craft'});
  }
  for(const w of C.workers.filter(w=>w.id!=='processing_worker'&&s.meta.upgrades.includes(w.id))){
    const worker=s.run.workers[w.id],batch=worker.batch;
    let code='ready',text='次の作業を待っています';
    if(s.settings.disabledUpgrades.includes(w.id)){code='disabled';text='OFF';}
    else if(s.run.status!=='preparing'){code='inactive';text='準備中のみ作業';}
    else if(batch){code=s.settings.paused?'paused':'working';text=`${s.settings.paused?'一時停止中':'稼働中'} · 残り${remaining(batch)}ゲーム秒`;}
    else {const allowed=canConfigureWorker(s,w.id,worker.target);if(!allowed.ok){code='unavailable';text=allowed.reason;}else if(s.settings.paused){code='paused';text='時間停止中';}}
    const target=batch?.target||worker.target;
    const label=C.resources.find(r=>r.id===target)?.name||recipes.get(target)?.name||target;
    rows.push({id:w.id,name:LEGACY_UPGRADES.find(u=>u.id===w.id)?.name||w.name||w.id,code,text:`${label} · ${text}`,tab:'workers'});
  }
  return rows;
}
export function automationStatusMarkup(s){
  const rows=automationRows(s);if(!rows.length)return '';
  const active=rows.filter(r=>['cooking','processing','working'].includes(r.code)).length;
  const waiting=rows.filter(r=>r.code==='materials').length;
  return `<details class="automation-overview" data-detail-key="automation-overview"><summary>自動化の状況 <small>${active}/${rows.length}稼働中${waiting ? ` · 材料待ち${waiting}件` : ''}</small></summary><ul>${rows.map(r=>`<li data-automation-status="${r.id}" data-status="${r.code}"><div><strong>${escapeText(r.name)}</strong><span>${escapeText(r.text)}</span></div><button class="button small gold-outline" data-tab="${r.tab}">${r.tab==='craft'?'工房':'人員'}へ</button></li>`).join('')}</ul><small>残り時間は現在の1回分。時間停止中・戦闘中は進みません。</small></details>`;
}
