import {WORK_MILESTONES}from './work-milestone-content.js?v=0.6.128';import {writeStoredGame}from './save-storage.js?v=0.6.128';
// Acknowledge durably before showing the one-time notice; failed writes show nothing.
export function acknowledgeWorkRewards(storage,current,{isOwner=()=>false,now=Date.now()}={}){
 if(!isOwner())return {ok:false,rewards:[]};
 const ids=(current.meta.workClaims||[]).filter(id=>!current.meta.workNotified.includes(id));if(!ids.length)return {ok:true,rewards:[]};
 const next=structuredClone(current);next.meta.workNotified.push(...ids);
 try{if(!isOwner())return {ok:false,rewards:[]};writeStoredGame(storage,next,{now});current.meta.workNotified=[...next.meta.workNotified];return {ok:true,rewards:ids.map(id=>WORK_MILESTONES.find(x=>x.id===id))};}catch{return {ok:false,rewards:[]};}
}
