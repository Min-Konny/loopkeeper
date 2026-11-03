import {text as t} from './i18n.js?v=0.6.140';
import {copySpan} from './locale-controls.js?v=0.6.140';
import{readUiPreference,saveUiPreference}from './craft-categories.js?v=0.6.140';
export const NAV_SHORT=Object.fromEntries(['gather','craft','village','diplomacy','trade','legacy','workers'].map(key=>[key,null]));
for(const key of Object.keys(NAV_SHORT))Object.defineProperty(NAV_SHORT,key,{get:()=>t('nav.'+key)});
export function speedControls(speed){return '<div class="speed-options" role="group" aria-label="'+t('speed.label')+'">'+[1,2,5].map(n=>'<button type="button" data-game-speed-choice="'+n+'" data-focus="speed-'+n+'" aria-pressed="'+((speed||1)===n)+'" aria-label="'+t('speed.choice',{speed:n})+'" title="'+t('speed.hint',{speed:n})+'">'+n+'<small>'+t('speed.unit')+'</small></button>').join('')+'</div>';}
const esc=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function queueContext(s,nameOf){const q=s.run.queue[0];return q?'<span><strong>'+esc(t('queue.count',{count:s.run.queue.length}))+'</strong><small>'+esc(t('queue.next',{name:nameOf(q.id)}))+(q.until?t('queue.goal'):t('queue.remaining',{count:q.count}))+'</small></span><button type="button" class="button small muted" data-info="queue" data-focus="mobile-queue-edit">'+t('queue.edit')+'</button>':'';}
export function mountResponsiveControls({document,window,storage,camp,menu}){
 const media=window.matchMedia('(max-width:690px)'),skills=document.getElementById('skill-list'),marker=document.createComment('desktop-skill-list');skills.before(marker);
 const details=document.createElement('details');details.id='mobile-skill-menu';details.innerHTML='<summary>'+copySpan('skills.menu')+'</summary><div id="mobile-skill-slot"></div>';menu.append(details);const slot=details.querySelector('div');
 const key=()=>media.matches?'loopkeeper-mobile-camp-view-v2':'loopkeeper-camp-view-v1';
 function apply(){if(media.matches)slot.append(skills);else marker.after(skills);camp.open=readUiPreference(storage,key(),['open','closed'],media.matches?'closed':'open')==='open';}
 apply();media.addEventListener('change',apply);camp.addEventListener('toggle',()=>saveUiPreference(storage,key(),camp.open?'open':'closed'));
}
