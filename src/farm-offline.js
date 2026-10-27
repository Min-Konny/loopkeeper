import {advanceTime,parseSave}from './engine.js?v=0.6.88';import {STORAGE_KEY,writeStoredGame}from './save-storage.js?v=0.6.88';
// Opt-in, bounded full-engine replay. No independent free farm clock.
export function settleFarmOffline(storage,current,{isOwner=()=>false,now=Date.now()}={}){
 const unchanged={ok:true,state:current,seconds:0};if(!isOwner())return {ok:false,state:current,reason:'操作権がありません。'};
 let record,original;try{original=storage.getItem(STORAGE_KEY);record=JSON.parse(original);}catch{return unchanged;}
 if(record?.storageVersion!==2||!Number.isFinite(record.savedAt)||record.savedAt>now)return unchanged;
 let raw;try{raw=JSON.parse(record.payload);}catch{return unchanged;}
 if(raw.version===1||raw.settings.farmOffline!==true||raw.settings.paused||!raw.run.facilities.henhouse||!['preparing','combat'].includes(raw.run.status))return unchanged;
 const next=parseSave(record.payload);if(!next)return unchanged;
 const seconds=Math.min(60,Math.max(0,(now-record.savedAt)/1000));if(!seconds)return unchanged;
 next.settings.paused=false;next.run.acceleration.active=raw.run.acceleration.active;
 const before=next.run.results?.activeRealSeconds||0;advanceTime(next,seconds);
 const applied=(next.run.results?.activeRealSeconds||0)-before;next.settings.paused=true;next.run.acceleration.active=false;
 if(!isOwner()||storage.getItem(STORAGE_KEY)!==original)return {ok:false,state:current,reason:'操作権または保存内容が変わったため離席分を保留しました。'};
 try{writeStoredGame(storage,next,{now});return {ok:true,state:next,seconds:applied};}catch{return {ok:false,state:current,reason:'保存できなかったため離席分を保留しました。'};}
}
