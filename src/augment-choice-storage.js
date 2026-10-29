import {rerollAugments,excludeAugment}from './engine.js?v=0.6.139';import {commitStoredGameEdit}from './save-storage.js?v=0.6.139';
export function editStoredAugment(storage,current,{type,id},{isOwner=()=>false,now=Date.now()}={}){
 if(!isOwner())return {ok:false,reason:'別のタブでプレイ中です。'};
 const next=structuredClone(current),fn={reroll:rerollAugments,exclude:excludeAugment}[type];if(!fn)return {ok:false,reason:'不正な候補操作です。'};
 const result=fn(next,id);if(!result.ok)return result;if(!isOwner())return {ok:false,reason:'操作権が移ったため候補変更を中止しました。'};
 try{return {ok:true,state:commitStoredGameEdit(storage,current,next,{now})};}catch{return {ok:false,reason:'保存できなかったため候補変更を中止しました。候補・乱数・残り回数は変更していません。'};}
}
