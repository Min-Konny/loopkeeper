import {selectCompanion}from './companion-state.js?v=0.6.34';import {commitStoredGameEdit}from './save-storage.js?v=0.6.34';
const signature=s=>JSON.stringify({owned:s.meta.companions,active:s.meta.activeCompanion,generation:s.meta.generation,best:s.meta.bestWave});
export function proposeCompanion(s,id){const next=structuredClone(s),r=selectCompanion(next,id);return r.ok?{ok:true,id,signature:signature(s)}:r;}
export function confirmStoredCompanion(storage,current,proposal,{isOwner=()=>false,now=Date.now()}={}){
 if(!isOwner())return {ok:false,reason:'別のタブでプレイ中です。'};
 if(!proposal?.ok||proposal.signature!==signature(current))return {ok:false,reason:'構成が変わったため相棒を選び直してください。'};
 const next=structuredClone(current),r=selectCompanion(next,proposal.id);if(!r.ok)return r;
 if(!isOwner())return {ok:false,reason:'操作権が移ったため中止しました。'};
 try{return {ok:true,state:commitStoredGameEdit(storage,current,next,{now})};}catch{return {ok:false,reason:'保存できなかったため同行変更を中止しました。'};}
}
