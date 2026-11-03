import {text as t} from './i18n.js?v=0.6.140';
import {magicChoice}from './magic-state.js?v=0.6.140';import {setStockTarget}from './engine.js?v=0.6.140';import {commitStoredGameEdit}from './save-storage.js?v=0.6.140';
export function editStoredMagic(storage,current,choice,{isOwner=()=>false,now=Date.now()}={}){
 if(!isOwner())return {ok:false,reason:t('unlock.storageOwner')};const next=structuredClone(current);let r;
 if(choice.type==='target'){
  if(next.run.status!=='preparing'||next.run.augments.offer.length||!['fill','off'].includes(choice.id))return {ok:false,reason:t('magic.prepare')};
  r=setStockTarget(next,'spark_catalyst',choice.id==='fill'?12:0);if(r.ok)r=setStockTarget(next,'ward_essence',choice.id==='fill'?6:0);
 }else r=magicChoice(next,choice);if(!r.ok)return r;
 if(!isOwner())return {ok:false,reason:t('unlock.storageChanged')};
 try{return {ok:true,state:commitStoredGameEdit(storage,current,next,{now})};}catch{return {ok:false,reason:t('magic.saveFailed')};}
}
