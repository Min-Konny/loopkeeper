import {text as t,getUILocale} from './i18n.js?v=0.6.140';
import {routeReason} from './route-copy.js?v=0.6.140';
import {routeById} from './routes.js?v=0.6.140';
import {startRoute,withdrawRoute}from './mvp-engine.js?v=0.6.140';import {commitStoredGameEdit}from './save-storage.js?v=0.6.140';
export function editStoredRoute(storage,current,id,{withdraw=false,isOwner=()=>false,now=Date.now()}={}){if(!isOwner())return {ok:false,reason:t('unlock.storageOwner')};const next=structuredClone(current),r=withdraw?withdrawRoute(next):startRoute(next,id);if(!r.ok)return getUILocale()!=='ja'&&!withdraw?{...r,reason:routeReason(current,routeById(id),r.reason)}:r;if(!isOwner())return {ok:false,reason:t('unlock.storageChanged')};try{return {ok:true,state:commitStoredGameEdit(storage,current,next,{now})};}catch{return {ok:false,reason:t('route.saveFailed')};}}
