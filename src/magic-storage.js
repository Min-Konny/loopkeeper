import {magicChoice}from './magic-state.js?v=0.6.7';import {setStockTarget}from './engine.js?v=0.6.7';import {commitStoredGameEdit}from './save-storage.js?v=0.6.7';
export function editStoredMagic(storage,current,choice,{isOwner=()=>false,now=Date.now()}={}){
 if(!isOwner())return {ok:false,reason:'別タブでプレイ中です。'};const next=structuredClone(current);let r;
 if(choice.type==='target'){
  if(next.run.status!=='preparing'||next.run.augments.offer.length||!['fill','off'].includes(choice.id))return {ok:false,reason:'準備中に補充を設定してください。'};
  r=setStockTarget(next,'spark_catalyst',choice.id==='fill'?12:0);if(r.ok)r=setStockTarget(next,'ward_essence',choice.id==='fill'?6:0);
 }else r=magicChoice(next,choice);if(!r.ok)return r;
 if(!isOwner())return {ok:false,reason:'操作権が移ったため中止しました。'};
 try{return {ok:true,state:commitStoredGameEdit(storage,current,next,{now})};}catch{return {ok:false,reason:'保存できなかったため錬金設定を中止しました。'};}
}
