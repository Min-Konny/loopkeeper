import {startManualRepeat,stopAction}from './mvp-engine.js?v=0.6.116';
import {commitStoredGameEdit}from './save-storage.js?v=0.6.116';
export function editStoredManualRepeat(storage,current,{stop=false,isOwner=()=>false,now=Date.now()}={}){
 if(!isOwner())return {ok:false,reason:'別のタブでプレイ中です。'};
 const next=structuredClone(current),result=stop?stopAction(next):startManualRepeat(next);if(!result.ok)return result;
 if(!isOwner())return {ok:false,reason:'操作権が移ったため中止しました。'};
 if(stop){
  // Stopping must be immediate even when storage is full. Loading also clears repeat permission.
  stopAction(current);
  try{return {ok:true,stopped:true,state:commitStoredGameEdit(storage,current,next,{now})};}catch{return {ok:false,stopped:true,state:current,reason:'連続製作は停止しました。保存できなかったため、保存状況を確認してください。'};}
 }
 try{return {ok:true,state:commitStoredGameEdit(storage,current,next,{now})};}catch{return {ok:false,reason:'保存できなかったため連続精錬の変更を中止しました。'};}
}
