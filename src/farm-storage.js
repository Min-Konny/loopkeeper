import {setStockTarget}from './engine.js?v=0.6.72';import {commitStoredGameEdit}from './save-storage.js?v=0.6.72';
export function editStoredFarm(storage,current,choice,{isOwner=()=>false,now=Date.now()}={}){
 if(!isOwner())return {ok:false,reason:'別のタブでプレイ中です。'};
 if(current.version===1||current.meta.bestWave<3||current.run.status!=='preparing'||current.run.augments.offer.length)return {ok:false,reason:'WAVE3以降の準備中に設定できます。'};
 const next=structuredClone(current);let r={ok:true};
 if(choice==='offline')next.settings.farmOffline=!next.settings.farmOffline;
 else if(choice==='cook')next.settings.farmAutoCook=!next.settings.farmAutoCook;
 else if(['fill','off'].includes(choice))r=setStockTarget(next,'fodder',choice==='fill'?12:0);
 else return {ok:false,reason:'不明な農場設定です。'};
 if(!r.ok)return r;if(!isOwner())return {ok:false,reason:'操作権が移ったため中止しました。'};
 try{return {ok:true,state:commitStoredGameEdit(storage,current,next,{now})};}catch{return {ok:false,reason:'保存できなかったため農場設定を変更しませんでした。'};}
}
