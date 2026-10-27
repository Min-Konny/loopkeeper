import {confirmRun} from './engine.js?v=0.6.108';
import {commitStoredGameEdit} from './save-storage.js?v=0.6.108';
export function confirmStoredRun(storage,current,{isOwner=()=>false,now=Date.now(),earlyLoopPrototype=false,lateLoopPrototype=false,preparationBalancePrototype=false}={}){
 if(!isOwner())return {ok:false,reason:'別のタブでプレイ中です。操作権を確認してください。'};
 const next=structuredClone(current),result=confirmRun(next,{earlyLoopPrototype,lateLoopPrototype,preparationBalancePrototype});if(!result.ok)return result;
 if(!isOwner())return {ok:false,reason:'操作権が移ったため転生を中止しました。'};
 try{return {ok:true,state:commitStoredGameEdit(storage,current,next,{now})};}
 catch{return {ok:false,reason:'保存できなかったため転生を中止しました。支給と世代はまだ確定していません。'};}
}
