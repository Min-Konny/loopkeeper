import {text as t} from './i18n.js?v=0.6.140';
import {escapeCopy as esc} from './locale-controls.js?v=0.6.140';
// Presentation of verified version-1 encounters only. Unknown saved prose stays verbatim.
export function legacyEncounterName(enemy){
 const wave=enemy?.wave;
 if(!Number.isSafeInteger(wave)||wave<1||enemy.isBoss!==(wave%3===0)||typeof enemy.invasion!=='boolean')return enemy?.name||'';
 const key=enemy.isBoss?(wave===3?'entity.enemy.forest_chief.name':'legacy.encounter.boss'):'legacy.encounter.'+Math.min(wave-1,4);
 const suffix=!enemy.isBoss&&wave>5,values={wave};
 const native=t(key,values,'ja')+(suffix?t('legacy.encounter.wave',values,'ja'):'')+(enemy.invasion?t('legacy.encounter.invasion',{},'ja'):'');
 if(enemy.name!==native)return enemy.name||'';
 return t(key,values)+(suffix?t('legacy.encounter.wave',values):'')+(enemy.invasion?t('legacy.encounter.invasion'):'');
}
export function legacyQueueUnlockMarkup(s,icon){
 const locked=s.meta.bestWave<3&&s.meta.completedMilestones.length<2;
 return '<section class="queue-unlock-card"><h3>'+icon('book')+esc(t('queueUi.unlock'))+'</h3><p>'+esc(t('queueUi.unlockHint'))+'</p><div class="queue-unlock-condition">'+esc(t(locked?'legacy.queue.gate':'legacy.queue.buy',{count:s.meta.completedMilestones.length}))+'</div><button class="button gold" '+(locked?'data-info="quests"':'data-tab="legacy"')+' data-focus="queue-unlock">'+esc(t(locked?'legacy.queue.viewGoals':'legacy.queue.inheritance'))+icon('chevron')+'</button></section>';
}
