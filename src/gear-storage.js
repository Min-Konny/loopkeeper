import {text as t} from './i18n.js?v=0.6.140';
import {changeGear}from './gear-state.js?v=0.6.140';import {RECIPES,getStats}from './engine.js?v=0.6.140';import {commitStoredGameEdit}from './save-storage.js?v=0.6.140';
export function editStoredGear(storage,current,choice,{isOwner=()=>false,now=Date.now()}={}){
 if(!isOwner())return {ok:false,reason:t('unlock.storageOwner')};
 const next=structuredClone(current),r=changeGear(next,choice,RECIPES);if(!r.ok)return r;next.run.hp=Math.min(next.run.hp,getStats(next).maxHp);
 if(!isOwner())return {ok:false,reason:t('unlock.storageChanged')};
 try{return {ok:true,state:commitStoredGameEdit(storage,current,next,{now})};}catch{return {ok:false,reason:t('gear.saveFailed')};}
}
