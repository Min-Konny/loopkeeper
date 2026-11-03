import {text as t} from './i18n.js?v=0.6.140';
import {confirmRun} from './engine.js?v=0.6.140';
import {commitStoredGameEdit} from './save-storage.js?v=0.6.140';
export function confirmStoredRun(storage,current,{isOwner=()=>false,now=Date.now(),earlyLoopPrototype=false,lateLoopPrototype=false,preparationBalancePrototype=false}={}){
 if(!isOwner())return {ok:false,reason:t('inheritance.notOwner')};
 const next=structuredClone(current),result=confirmRun(next,{earlyLoopPrototype,lateLoopPrototype,preparationBalancePrototype});if(!result.ok)return result;
 if(!isOwner())return {ok:false,reason:t('inheritance.ownerChanged')};
 try{return {ok:true,state:commitStoredGameEdit(storage,current,next,{now})};}
 catch{return {ok:false,reason:t('inheritance.saveFailed')};}
}
