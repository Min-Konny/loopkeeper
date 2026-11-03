import {text as t,getUILocale} from './i18n.js?v=0.6.140';
import {upgradeReason} from './unlock-copy.js?v=0.6.140';
import {LEGACY_UPGRADES} from './engine.js?v=0.6.140';
import {LEGACY_RANKS,rankId} from './legacy-rank-definitions.js?v=0.6.140';
import {purchaseUpgrade,refundUpgrade,toggleUpgrade,purchaseLegacyRank,refundLegacyRank,toggleLegacyRank,resetLegacyRankDraft,cancelLegacyDraft}from './engine.js?v=0.6.140';import {commitStoredGameEdit}from './save-storage.js?v=0.6.140';
export function editStoredLegacyRank(storage,current,{key,type},{isOwner=()=>false,now=Date.now()}={}){
 if(!isOwner())return {ok:false,reason:t('unlock.storageOwner')};
 const next=structuredClone(current),fn={upgrade:purchaseUpgrade,remove:refundUpgrade,switch:toggleUpgrade,buy:purchaseLegacyRank,refund:refundLegacyRank,toggle:toggleLegacyRank,reset:resetLegacyRankDraft,cancel:cancelLegacyDraft}[type];if(!fn)return {ok:false,reason:t('unlock.unknownAction')};
 const result=fn(next,key);if(!result.ok){if(getUILocale()!=='ja'&&['buy','upgrade'].includes(type)){const rank=type==='buy'?LEGACY_RANKS.find(d=>d.key===key):null,id=rank?rankId(rank,1+[1,2,3,4,5].filter(n=>next.run.legacyDraft?.upgrades.includes(rankId(rank,n))).length):key,u=LEGACY_UPGRADES.find(d=>d.id===id);return {...result,reason:upgradeReason(next,u,result.reason)};}return result;}if(!isOwner())return {ok:false,reason:t('unlock.storageChanged')};
 try{return {ok:true,state:commitStoredGameEdit(storage,current,next,{now})};}catch{return {ok:false,reason:t('unlock.storageFailed')};}
}
