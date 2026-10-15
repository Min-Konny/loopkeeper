import {getCatalog}from './engine.js?v=0.6.3';
import {BOSS_MATERIALS}from './boss-materials.js?v=0.6.3';
import {REGIONAL_MATERIALS}from './regional-content.js?v=0.6.3';
import {WORK_MILESTONES}from './work-milestone-content.js?v=0.6.3';
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const number=x=>Math.floor(Number(x)||0).toLocaleString('ja-JP');
export const BAG_CATEGORIES=[['resources','資源・金貨'],['supplies','食料・錬金'],['equipment','装備'],['permanent','永久所持']];
const supplies=new Set(['food','fish','eggs','feed','spark_catalyst','ward_essence']);
export function compactResourceIds(state){const d=[...getCatalog(state).ACTIONS,...getCatalog(state).RECIPES].find(x=>x.id===state.run.activeAction?.id);return [...new Set(['food','gold',...Object.keys(d?.yields||{}).slice(0,1)])].filter(id=>Object.hasOwn(state.run.resources,id));}
export function inventoryMarkup(s,category='resources',visibleIds=Object.keys(getCatalog(s).RESOURCES)){
 const {RESOURCES,RECIPES}=getCatalog(s);const selected=BAG_CATEGORIES.some(([id])=>id===category)?category:'resources';let entries=[];
 if(['resources','supplies'].includes(selected))entries=Object.entries(RESOURCES).filter(([id])=>(visibleIds.includes(id)||s.run.resources[id]>0)&&supplies.has(id)===(selected==='supplies')).map(([id,d])=>({id,name:d.name,count:s.run.resources[id]}));
 if(selected==='equipment')entries=(s.run.ownedEquipment||Object.values(s.run.equipment).map(x=>x?.id).filter(Boolean)).map(id=>({id,name:RECIPES.find(r=>r.id===id)?.name||id,count:1,note:Object.values(s.run.equipment).some(x=>x?.id===id)?'装備中':'所持'}));
 if(selected==='permanent'){
  entries=(s.meta.accessories||[]).map(id=>({id,name:RECIPES.find(r=>r.accessory===id||r.id===id)?.name||id,count:1,note:'永久所持'}));
  for(const id of Object.keys(s.meta.trophyEarned||{})){const d=BOSS_MATERIALS.find(x=>x.id===id)||REGIONAL_MATERIALS.find(x=>x.id===id)||WORK_MILESTONES.find(x=>x.material===id);entries.push({id,name:d?.name||d?.materialName||id,count:s.meta.trophies?.[id]||0,note:'特殊素材'});}
 }
 return '<div class="bag-tabs" role="group" aria-label="所持品の分類">'+BAG_CATEGORIES.map(([id,name])=>'<button class="button small '+(selected===id?'gold-outline':'muted')+'" data-bag-category="'+id+'" data-focus="bag-'+id+'" aria-pressed="'+(selected===id)+'">'+name+'</button>').join('')+'</div><div class="inventory-list">'+(entries.length?entries.map(e=>'<div class="inventory-item" data-inventory-item="'+esc(e.id)+'"><span>'+esc(e.name)+(e.note?'<small>'+esc(e.note)+'</small>':'')+'</span><strong>'+number(e.count)+'</strong></div>').join(''):'<p class="fine-print">この分類の所持品はありません。</p>')+'</div>'+(['equipment','permanent'].includes(selected)?'<button class="button muted" data-info="status">装備・相棒の設定</button>':'');
}
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
