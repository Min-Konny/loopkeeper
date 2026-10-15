import {purchaseLegacyRank,refundLegacyRank,toggleLegacyRank,resetLegacyRankDraft,cancelLegacyDraft}from './engine.js?v=0.6.10';import {commitStoredGameEdit}from './save-storage.js?v=0.6.10';
export function editStoredLegacyRank(storage,current,{key,type},{isOwner=()=>false,now=Date.now()}={}){
 if(!isOwner())return {ok:false,reason:'別のタブでプレイ中です。'};
 const next=structuredClone(current),fn={buy:purchaseLegacyRank,refund:refundLegacyRank,toggle:toggleLegacyRank,reset:resetLegacyRankDraft,cancel:cancelLegacyDraft}[type];if(!fn)return {ok:false,reason:'不明な操作です。'};
 const result=fn(next,key);if(!result.ok)return result;if(!isOwner())return {ok:false,reason:'操作権が移ったため中止しました。'};
 try{return {ok:true,state:commitStoredGameEdit(storage,current,next,{now})};}catch{return {ok:false,reason:'保存できないためポイント変更を中止しました。'};}
}
