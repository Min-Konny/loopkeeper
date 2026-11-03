import {text as t,formatNumber} from './i18n.js?v=0.6.140';
import{getStats}from './engine.js?v=0.6.140';
export const formatHealth=value=>formatNumber(Math.max(0,value),{maximumFractionDigits:2});
export function campHealth(s){
 const current=Math.max(0,s.run.hp),maximum=getStats(s).maxHp;
 return{current,maximum,percent:Math.max(0,Math.min(100,maximum>0?current/maximum*100:0)),critical:current<=maximum*.3};
}
export function campHealthMarkup(s){
 const h=campHealth(s);
 return '<div class="camp-health'+(h.critical?' is-critical':'')+'" data-camp-health aria-label="'+t('health.aria')+'"><span class="camp-health-label">'+t('health.label')+'</span><strong><span data-camp-hp-current>'+formatHealth(h.current)+'</span><span class="camp-health-divider"> / </span><span data-camp-hp-max>'+formatHealth(h.maximum)+'</span></strong><span class="camp-health-track" aria-hidden="true"><i style="width:'+h.percent+'%"></i></span></div>';
}
