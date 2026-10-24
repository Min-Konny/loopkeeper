import {getCatalog}from './engine.js?v=0.6.70';
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export {BAG_CATEGORIES,inventoryMarkup}from './inventory-ui.js?v=0.6.70';
export function compactResourceIds(state){return ['food','gold'].filter(id=>Object.hasOwn(state.run.resources,id));}
export function queueStopStatus(s,issue,{manualReason=''}={}){
 if(s.run.status!=='preparing'||!s.settings.paused||!s.run.queue.length)return null;
 const disabled=s.settings.disabledUpgrades.includes('action_queue'),head=s.run.queue[0],d=[...getCatalog(s).ACTIONS,...getCatalog(s).RECIPES].find(x=>x.id===head.id);
 const reason=disabled?'行動予約を無効にしています。':issue?.reason||manualReason||'時間は停止しています。準備ができたら予約を再開できます。';
 return {key:[s.meta.generation,head.goalId,head.id,reason].join(':'),reason,name:d?.name||'行動予約',disabled,blocked:!!issue,skill:issue?.skill||null,count:s.run.queue.length};
}
export function queueStopMarkup(stop){return '<p class="dialog-lead">'+esc(stop.name)+'</p><p role="status">'+esc(stop.reason)+'</p><p class="fine-print">閉じても停止を維持します。</p><div class="stop-actions">'+(!stop.blocked?'<button class="button gold" data-queue-resume="1">'+(stop.disabled?'予約を有効にして再開':'予約を再開')+'</button>':'<button class="button muted" data-queue-fix="remove">この予約を削除</button>'+(stop.count>1?'<button class="button muted" data-queue-fix="defer">最後へ回す</button>':''))+'<button class="button muted" data-info="queue">予約を編集</button>'+(stop.skill?'<button class="button muted" data-skill="'+esc(stop.skill)+'">必要な技能の作業へ</button>':stop.blocked?'<button class="button muted" data-tab="gather">材料を集める作業へ</button>':'')+'</div>';}
export function createStopTransition(){let shown=null;return {take(stop,{blocked=false}={}){if(!stop){shown=null;return null;}if(blocked||shown===stop.key)return null;shown=stop.key;return stop;}};}
export const QUEST_SEEN_KEY='loopkeeper-quest-seen-v1';
export function createQuestSeen(storage,initial){let seen=new Set(initial),lastRaw=null;
 function persist(){try{const text=JSON.stringify([...seen]);storage.setItem(QUEST_SEEN_KEY,text);lastRaw=text;}catch{}}
 try{lastRaw=storage.getItem(QUEST_SEEN_KEY);if(lastRaw!==null){const ids=JSON.parse(lastRaw);if(Array.isArray(ids)&&ids.every(x=>typeof x==='string'))seen=new Set(ids);}else persist();}catch{}
 function sync(ids){const available=new Set(ids);try{const text=storage.getItem(QUEST_SEEN_KEY);if(text!==lastRaw){const raw=JSON.parse(text);if(Array.isArray(raw)&&raw.every(x=>typeof x==='string'))seen=new Set(raw);lastRaw=text;}}catch{}const next=new Set([...seen].filter(id=>available.has(id)));if(next.size!==seen.size){seen=next;persist();}else seen=next;}
 return {unseen(ids){sync(ids);return ids.filter(id=>!seen.has(id)).length;},acknowledge(ids){seen=new Set(ids);persist();},};
}
