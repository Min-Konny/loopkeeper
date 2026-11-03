import {text as t,getUILocale} from './i18n.js?v=0.6.140';
import {entityText} from './entity-copy.js?v=0.6.140';
import {RECIPES,getCatalog,getRecipeCost} from './engine.js?v=0.6.140';
import {getUpgradeDescription} from './upgrades-ui.js?v=0.6.140';
import {preparationBalance} from './preparation-balance.js?v=0.6.140';
export function automationText(status,kind='cook'){
 if(getUILocale()==='ja')return status.text;
 const cooking=kind==='cook';
 switch(status.code){
 case 'locked':return t('auto.status.locked');case 'disabled':return 'OFF';case 'inactive':return t(cooking?'auto.status.inactiveCook':'auto.status.inactiveProcessing');case 'unstaffed':return t('auto.unstaffed');
 case 'unavailable':return cooking?t('auto.status.unavailableCook'):status.text;
 case 'target':return t('auto.status.target',{target:status.target});
 case 'materials':return status.materials.filter(m=>m.available<m.required).map(m=>t('auto.status.missing',{name:entityText('resource',m.id),amount:cooking?m.required-m.available:Math.ceil(m.required-m.available)})+(m.reserved?t('auto.status.reserved',{count:m.reserved}):'')).join(' · ');
 case 'cooking':return t('auto.status.cooking');case 'processing':return t('auto.status.processing',{name:entityText('recipe',RECIPES.find(r=>r.id===status.batch?.id))});
 case 'paused':return status.batch?t(cooking?'auto.status.pausedCook':'auto.status.pausedProcess',{name:entityText('recipe',RECIPES.find(r=>r.id===status.batch.id))}):t(cooking?'auto.status.resumeCook':'auto.status.resumeProcess');
 case 'ready':return t(cooking?'auto.status.readyCook':'auto.status.readyProcess');default:return status.text;
 }
}
export function autoCookDescription(s){if(getUILocale()==='ja')return getUpgradeDescription(s,{id:'auto_cook'});const recipe=getCatalog(s).RECIPES.find(r=>r.id==='cook_meal'),cost=getRecipeCost(s,recipe);return t('auto.description',{herbs:cost.herbs,wood:cost.wood})+' '+t(preparationBalance(s)?'auto.slow':'auto.toTarget');}
