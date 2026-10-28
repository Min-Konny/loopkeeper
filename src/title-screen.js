import {titleText as t,readUILocale} from './title-copy.js?v=0.6.130';
import {inspectTitleSave,titlePreferences,saveTitlePreferences,startTitleChallenge,withTitleWriter} from './title-state.js?v=0.6.130';
import {createGame} from './engine.js?v=0.6.130';
import {replayAchievementsMarkup} from './replay-achievements-ui.js?v=0.6.130';
const VERSION='0.6.130';
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let storage;try{storage=localStorage;}catch{storage={getItem(){throw Error('Storage unavailable');}};}
const locale=readUILocale(storage);
let slot=inspectTitleSave(storage),busy=false,opener;
const root=document.createElement('section');root.id='title-screen';root.setAttribute('role','main');root.lang=locale;
const dialog=document.createElement('dialog');dialog.id='title-dialog';dialog.setAttribute('aria-labelledby','title-dialog-heading');
document.body.classList.add('title-mode');document.getElementById('app').hidden=true;
document.getElementById('boot-state')?.remove();document.body.prepend(root);document.body.append(dialog);
function render(){
  slot=inspectTitleSave(storage);
  const valid=!!slot.game,unavailable=slot.kind==='unavailable';
  const hint=t(slot.kind==='backup'?'title.backupHint':slot.kind==='corrupt'?'title.corruptHint':unavailable?'title.storageError':valid?'title.resumeHint':'title.emptyHint');
  root.innerHTML=`<div class="title-landscape" aria-hidden="true"><img src="./assets/pixel-v2/forest-clearing-v1.png" alt=""></div><div class="title-layout"><header class="title-brand"><img src="./assets/mark.svg" width="46" height="46" alt=""><p class="title-eyebrow">IDLE DEFENSE · REBIRTH</p><h1>LOOP<span>KEEPER</span></h1><p class="title-tagline">${t('title.tagline')}</p><p class="title-description">${t('title.description')}</p></header><section class="title-menu" aria-label="${t('title.menu')}"><div class="title-record">${valid?escape(t('title.record',{generation:slot.game.meta.generation,wave:slot.game.meta.bestWave})):t('title.new')}</div><nav>${['continue','new','settings','achievements'].map(action=>`<button type="button" data-title-action="${action}" ${action==='continue'&&!valid||action==='new'&&unavailable?'disabled':''} class="${(valid?action==='continue':action==='new')?'title-primary':''}"><span>${t('title.'+action)}</span><span aria-hidden="true">${action==='continue'||action==='new'?'→':'＋'}</span></button>`).join('')}</nav><p class="title-hint">${escape(hint)}</p><p id="title-status" role="status" aria-live="polite"></p></section><footer>LoopKeeper: Idle Defense <span>v${VERSION}</span></footer></div>`;
}
function message(text){root.querySelector('#title-status').textContent=text;}
function showDialog(heading,body){opener=document.activeElement;dialog.innerHTML=`<div class="title-dialog-header"><h2 id="title-dialog-heading">${escape(heading)}</h2><button type="button" data-title-close aria-label="${t('title.close')}">×</button></div>${body}`;dialog.showModal();}
dialog.addEventListener('close',()=>{if(opener?.isConnected)opener.focus({preventScroll:true});});
dialog.addEventListener('click',e=>{if(e.target.closest('[data-title-close]'))dialog.close();});
dialog.addEventListener('change',e=>{if(e.target.id==='title-reset-ack')dialog.querySelector('[data-title-reset]').disabled=!e.target.checked;});
async function openGame(){
  if(busy)return;busy=true;root.querySelectorAll('button').forEach(b=>b.disabled=true);message(t('title.loading'));
  try{
    const loading=document.createElement('section');loading.className='boot-screen';loading.setAttribute('role','status');loading.textContent=t('title.loading');document.getElementById('app').replaceChildren(loading);
    document.getElementById('app').hidden=false;root.hidden=true;document.body.classList.remove('title-mode');
    await import('./main.js?v=0.6.130');dialog.close();
  }catch(error){console.error('Game startup failed',error);document.getElementById('app').hidden=true;root.hidden=false;document.body.classList.add('title-mode');render();message(t('title.loadError'));const retry=document.createElement('button');retry.textContent=t('title.retry');retry.onclick=()=>location.reload();root.querySelector('.title-menu').append(retry);}
  // A partially imported game must be reloaded, rather than initialized twice.
}
async function newChallenge(){
  if(busy)return;busy=true;
  try{await withTitleWriter(navigator.locks,()=>startTitleChallenge(storage,slot.raw));dialog.close();busy=false;await openGame();}
  catch(error){busy=false;console.error('New challenge failed',error);message(t(error.message==='Writer busy'?'title.busy':'title.error'));dialog.close();render();message(t(error.message==='Writer busy'?'title.busy':'title.error'));}
}
root.addEventListener('click',e=>{
  const action=e.target.closest('[data-title-action]')?.dataset.titleAction;if(!action||busy)return;
  // Refresh without replacing focused controls, so a changed save cannot be reset
  // under an obsolete confirmation. The mutation itself compares the raw record.
  slot=inspectTitleSave(storage);
  if(action==='continue'){if(slot.game)openGame();return;}
  if(action==='new'){
    if(slot.kind==='unavailable'){message(t('title.storageError'));return;}
    if(slot.kind==='empty'){newChallenge();return;}
    showDialog(t('title.resetHeading'),`<p>${t(slot.game?'title.resetBody':'title.corruptReset')}</p><label class="title-check"><input type="checkbox" id="title-reset-ack">${t('title.resetAck')}</label><div class="title-dialog-actions"><button data-title-close>${t('title.cancel')}</button><button data-title-reset disabled>${t('title.resetConfirm')}</button></div>`);
  }
  if(action==='achievements'){
    showDialog(t('title.achievements'),slot.kind==='corrupt'||slot.kind==='unavailable'?`<p>${t('title.achievementUnavailable')}</p>`:replayAchievementsMarkup(slot.game||createGame()));
    dialog.insertAdjacentHTML('beforeend',`<div class="title-dialog-actions"><button type="button" data-title-close>${t('title.close')}</button></div>`);
    const details=dialog.querySelector('details');if(details)details.open=true;
  }
  if(action==='settings'){
    if(!['valid','empty'].includes(slot.kind)){showDialog(t('title.settings'),`<p>${t('title.settingsUnavailable')}</p>`);return;}
    const prefs=titlePreferences(storage,slot);
    showDialog(t('title.settings'),`<p>${t('title.settingsHint')}</p><form id="title-settings-form">${['sound','music','ambient'].map(key=>`<label class="title-range">${t('settings.'+key)}<input name="${key}Volume" type="range" min="0" max="1" step="0.05" value="${prefs[key+'Volume']}"></label>`).join('')}${[['effectsEnabled','effects'],['pauseWhenHidden','hiddenPause']].map(([key,label])=>`<label class="title-check"><input name="${key}" type="checkbox" ${prefs[key]?'checked':''}>${t('settings.'+label)}</label>`).join('')}<div class="title-dialog-actions"><button type="button" data-title-close>${t('title.cancel')}</button><button type="submit">${t('title.save')}</button></div></form>`);
  }
});
dialog.addEventListener('click',e=>{if(e.target.closest('[data-title-reset]')&&dialog.querySelector('#title-reset-ack')?.checked)newChallenge();});
dialog.addEventListener('submit',async e=>{
  if(e.target.id!=='title-settings-form')return;e.preventDefault();if(busy)return;busy=true;
  const form=new FormData(e.target),prefs={};for(const key of ['soundVolume','musicVolume','ambientVolume'])prefs[key]=Number(form.get(key));for(const key of ['effectsEnabled','pauseWhenHidden'])prefs[key]=form.has(key);
  try{await withTitleWriter(navigator.locks,()=>saveTitlePreferences(storage,prefs,slot.raw));dialog.close();render();message(t('title.saved'));}
  catch(error){dialog.close();message(t(error.message==='Writer busy'?'title.busy':'title.error'));}
  finally{busy=false;}
});
render();
