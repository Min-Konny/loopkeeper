import {text as t,getUILocale} from './i18n.js?v=0.6.140';
import {entityText} from './entity-copy.js?v=0.6.140';
import {automationText} from './automation-copy.js?v=0.6.140';
import {staffing}from './settlement.js?v=0.6.140';
import {CONTENT as C} from './content.js?v=0.6.140';
import {RECIPES,LEGACY_UPGRADES,getAutoCookingStatus,getProcessingStatus,canConfigureWorker} from './engine.js?v=0.6.140';

export const escapeText=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const recipes=new Map(RECIPES.map(r=>[r.id,r]));
export function cookingChoiceText(s){
  if(s.settings.autoCookRecipe==='auto'||!s.settings.autoCookRecipe)return s.settings.farmAutoCook?t('auto.choiceEgg'):t('auto.choiceHerbs');
  return s.settings.autoCookRecipe==='rations'||s.settings.autoCookRecipe==='cook_meal'?t('auto.rations'):t('auto.foodResult',{name:entityText('recipe',recipes.get(s.settings.autoCookRecipe))||t('auto.unselected')});
}
export function cookingBatchText(s){return s.run.autoCraft?s.run.autoCraft.id==='cook_meal'?t('auto.rations'):t('auto.foodResult',{name:entityText('recipe',recipes.get(s.run.autoCraft.id))||t('auto.cookingItem')}):null;}
const remaining=batch=>Math.max(0,batch.duration-batch.progress).toFixed(1);
function statusText(status,kind){const text=automationText(status,kind);return status.batch?t('auto.left',{text,seconds:remaining(status.batch)}):text;}
export function automationRows(s){
  if(s.version!==2)return [];
  const rows=[];
  for(const [id,name,get] of [['auto_cook',t('auto.cook'),getAutoCookingStatus],['processing_worker',t('auto.processing'),getProcessingStatus]]){
    if(!s.meta.upgrades.includes(id))continue;
    const status=get(s);rows.push({id,name,code:status.code,text:statusText(status,id==='auto_cook'?'cook':'processing'),tab:'craft'});
  }
  for(const w of C.workers.filter(w=>w.id!=='processing_worker'&&s.meta.upgrades.includes(w.id))){
    const worker=s.run.workers[w.id],batch=worker.batch;
    let code='ready',text=t('auto.waiting');
    if(s.settings.disabledUpgrades.includes(w.id)){code='disabled';text='OFF';}
    else if(!staffing(s,w.id)){code='unstaffed';text=t('auto.unstaffed');}
    else if(s.run.status!=='preparing'){code='inactive';text=t('auto.inactive');}
    else if(batch){code=s.settings.paused?'paused':'working';text=t('auto.left',{text:t(s.settings.paused?'auto.paused':'auto.working'),seconds:remaining(batch)});}
    else {const allowed=canConfigureWorker(s,w.id,worker.target);if(!allowed.ok){code='unavailable';text=allowed.reason;}else if(s.settings.paused){code='paused';text=t('auto.clockPaused');}}
    const target=batch?.target||worker.target;
    const label=C.resources.some(r=>r.id===target)?entityText('resource',target):entityText('recipe',recipes.get(target))||target;
    rows.push({id:w.id,name:getUILocale()==='ja'?(LEGACY_UPGRADES.find(u=>u.id===w.id)?.name||w.name||w.id):t('worker.name.'+w.id),code,text:`${label} · ${text}`,tab:'workers'});
  }
  return rows;
}
export function automationStatusMarkup(s){
  const rows=automationRows(s);if(!rows.length)return '';
  const active=rows.filter(r=>['cooking','processing','working'].includes(r.code)).length;
  const waiting=rows.filter(r=>r.code==='materials').length;
  return `<details class="automation-overview" data-detail-key="automation-overview"><summary>${t('auto.heading')} <small>${t('auto.running',{active,total:rows.length})}${waiting?t('auto.materialsWaiting',{count:waiting}):''}</small></summary><ul>${rows.map(r=>`<li data-automation-status="${r.id}" data-status="${r.code}"><div><strong>${escapeText(r.name)}</strong><span>${escapeText(r.text)}</span></div><button class="button small gold-outline" data-tab="${r.tab}">${t(r.tab==='craft'?'auto.goCraft':'auto.goWorkers')}</button></li>`).join('')}</ul><small>${t('auto.timeHint')}</small></details>`;
}
