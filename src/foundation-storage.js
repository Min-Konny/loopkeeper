import {synchronizeFreeFeatures}from './free-features.js?v=0.6.42';import {commitStoredGameEdit}from './save-storage.js?v=0.6.42';
export function migrateStoredFoundation(storage,current,{isOwner=()=>false,now=Date.now()}={}){
 if(!isOwner())return {ok:false,state:current,reason:'別タブが所有しています。'};
 const next=structuredClone(current);let result;
 try{result=synchronizeFreeFeatures(next);}catch{return {ok:false,state:current,reason:'ポイント移行を確認できませんでした。'};}
 if(!result.changed)return {ok:true,state:current,refunded:0};
 if(!isOwner())return {ok:false,state:current,reason:'操作権が移ったため移行を保留しました。'};
 try{return {ok:true,state:commitStoredGameEdit(storage,current,next,{now}),refunded:result.refunded};}
 catch{return {ok:false,state:current,reason:'保存できないためポイント移行を保留しました。保存を再試行してください。'};}
}
