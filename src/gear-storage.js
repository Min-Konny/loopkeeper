import {changeGear}from './gear-state.js?v=0.6.61';import {RECIPES,getStats}from './engine.js?v=0.6.61';import {commitStoredGameEdit}from './save-storage.js?v=0.6.61';
export function editStoredGear(storage,current,choice,{isOwner=()=>false,now=Date.now()}={}){
 if(!isOwner())return {ok:false,reason:'別のタブでプレイ中です。'};
 const next=structuredClone(current),r=changeGear(next,choice,RECIPES);if(!r.ok)return r;next.run.hp=Math.min(next.run.hp,getStats(next).maxHp);
 if(!isOwner())return {ok:false,reason:'操作権が移ったため中止しました。'};
 try{return {ok:true,state:commitStoredGameEdit(storage,current,next,{now})};}catch{return {ok:false,reason:'保存できなかったため装備変更を中止しました。'};}
}
