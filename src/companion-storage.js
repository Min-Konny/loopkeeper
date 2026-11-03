import {text as t} from './i18n.js?v=0.6.140';
import {selectCompanion}from './companion-state.js?v=0.6.140';import {commitStoredGameEdit}from './save-storage.js?v=0.6.140';
const signature=s=>JSON.stringify({owned:s.meta.companions,active:s.meta.activeCompanion,generation:s.meta.generation,best:s.meta.bestWave});
export function proposeCompanion(s,id){const next=structuredClone(s),r=selectCompanion(next,id);return r.ok?{ok:true,id,signature:signature(s)}:r;}
export function confirmStoredCompanion(storage,current,proposal,{isOwner=()=>false,now=Date.now()}={}){
 if(!isOwner())return {ok:false,reason:t('unlock.storageOwner')};
 if(!proposal?.ok||proposal.signature!==signature(current))return {ok:false,reason:t('companion.changed')};
 const next=structuredClone(current),r=selectCompanion(next,proposal.id);if(!r.ok)return r;
 if(!isOwner())return {ok:false,reason:t('unlock.storageChanged')};
 try{return {ok:true,state:commitStoredGameEdit(storage,current,next,{now})};}catch{return {ok:false,reason:t('companion.saveFailed')};}
}
