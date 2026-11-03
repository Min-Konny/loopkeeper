import {getUILocale,text as t}from './i18n.js?v=0.6.140';
export function routeReturnReason(reason){if(getUILocale()==='ja')return reason||'';for(const key of ['withdraw','defeat','timeout','abandon'])if(reason===t('route.reason.'+key,{},'ja'))return t('route.reason.'+key);return reason||'';}
