import{requestEarlyRaid}from'./engine.js?v=0.6.60';import{commitStoredGameEdit,decodeRecord,STORAGE_KEY}from'./save-storage.js?v=0.6.60';
export function editStoredEarlyRaid(storage,current,token,{isOwner=()=>false,pausedAfter=current.settings.paused,now=Date.now()}={}){
 if(!isOwner())return{ok:false,reason:'別のタブでプレイ中です。'};
 try{
  const raw=storage.getItem(STORAGE_KEY),saved=raw?decodeRecord(raw):null;
  if(raw&&!saved)return{ok:false,reason:'保存状態を確認できません。再読込して確認してください。'};
  if(saved&&(saved.meta.generation!==current.meta.generation||saved.run.status!=='preparing'||saved.run.wave!==current.run.wave||saved.run.elapsed>current.run.elapsed+1e-8))return{ok:false,reason:'保存された進行が変わりました。再読込して確認してください。'};
  const next=structuredClone(current),result=requestEarlyRaid(next,token);if(!result.ok)return result;
  next.settings.paused=!!pausedAfter;
  if(!isOwner())return{ok:false,reason:'操作権が移ったため中止しました。'};
  return{ok:true,state:commitStoredGameEdit(storage,current,next,{now})};
 }catch{return{ok:false,reason:'保存できなかったため、襲撃は始めていません。'};}
}
