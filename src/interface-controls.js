import{readUiPreference,saveUiPreference}from './craft-categories.js?v=0.6.136';
export const NAV_SHORT={gather:'採集',craft:'工房',village:'施設',diplomacy:'外交',trade:'交易',legacy:'継承',workers:'人員'};
export function speedControls(speed){return '<div class="speed-options" role="group" aria-label="ゲーム速度">'+[1,2,5].map(n=>'<button type="button" data-game-speed-choice="'+n+'" data-focus="speed-'+n+'" aria-pressed="'+((speed||1)===n)+'" aria-label="'+n+'倍速" title="生産・訓練・戦闘を'+n+'倍で進める">'+n+'<small>倍</small></button>').join('')+'</div>';}
const esc=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function queueContext(s,nameOf){const q=s.run.queue[0];return q?'<span><strong>予約 '+s.run.queue.length+'件</strong><small>先頭：'+esc(nameOf(q.id))+(q.until?' · 目標指定':' · 残り'+q.count+'回')+'</small></span><button type="button" class="button small muted" data-info="queue" data-focus="mobile-queue-edit">予約を編集</button>':'';}
export function mountResponsiveControls({document,window,storage,camp,menu}){
 const media=window.matchMedia('(max-width:690px)'),skills=document.getElementById('skill-list'),marker=document.createComment('desktop-skill-list');skills.before(marker);
 const details=document.createElement('details');details.id='mobile-skill-menu';details.innerHTML='<summary>技能・進行レベル</summary><div id="mobile-skill-slot"></div>';menu.append(details);const slot=details.querySelector('div');
 const key=()=>media.matches?'loopkeeper-mobile-camp-view-v2':'loopkeeper-camp-view-v1';
 function apply(){if(media.matches)slot.append(skills);else marker.after(skills);camp.open=readUiPreference(storage,key(),['open','closed'],media.matches?'closed':'open')==='open';}
 apply();media.addEventListener('change',apply);camp.addEventListener('toggle',()=>saveUiPreference(storage,key(),camp.open?'open':'closed'));
}
