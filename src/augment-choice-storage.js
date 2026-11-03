import {getUILocale,text as t} from './i18n.js?v=0.6.140';
import {augmentReason} from './augment-copy.js?v=0.6.140';
import {rerollAugments,excludeAugment}from './engine.js?v=0.6.140';import {commitStoredGameEdit}from './save-storage.js?v=0.6.140';
export function editStoredAugment(storage,current,{type,id},{isOwner=()=>false,now=Date.now()}={}){
 if(!isOwner())return {ok:false,reason:t('unlock.storageOwner')};
 const next=structuredClone(current),fn={reroll:rerollAugments,exclude:excludeAugment}[type];if(!fn)return {ok:false,reason:t('augmentUi.operation')};
 const result=fn(next,id);if(!result.ok)return getUILocale()!=='ja'?{...result,reason:augmentReason(current,type,id,result.reason)}:result;if(!isOwner())return {ok:false,reason:t('unlock.storageChanged')};
 try{return {ok:true,state:commitStoredGameEdit(storage,current,next,{now})};}catch{return {ok:false,reason:t('augmentUi.saveFailed')};}
}
