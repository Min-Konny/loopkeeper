import {KO} from './ui-copy-ko.js?v=0.6.140';
import {ZH_CN} from './ui-copy-zh-cn.js?v=0.6.140';
import {JA} from './ui-copy-ja.js?v=0.6.140';
import {EN} from './ui-copy-en.js?v=0.6.140';
export const UI_LOCALE_KEY='loopkeeper-ui-locale-v1';
export const SUPPORTED_LOCALES=Object.freeze(['ja','en','zh-CN','ko']);
// Planned locales are not selectable until their dictionaries are verified.
export const PLANNED_LOCALES=Object.freeze(['zh-Hant']);
const dictionaries={ja:JA,en:EN,'zh-CN':ZH_CN,ko:KO},listeners=new Set(),formats=new Map();
const supported=locale=>SUPPORTED_LOCALES.includes(locale)?locale:'ja';
export function readUILocale(storage){try{return supported(storage.getItem(UI_LOCALE_KEY));}catch{return 'ja';}}
export function writeUILocale(storage,locale){if(!SUPPORTED_LOCALES.includes(locale))throw Error('Unsupported locale');storage.setItem(UI_LOCALE_KEY,locale);}
let locale;try{locale=readUILocale(globalThis.localStorage);}catch{locale='ja';}
export const getUILocale=()=>locale;
export function subscribeLocale(fn){listeners.add(fn);return()=>listeners.delete(fn);}
export function setUILocale(next,storage){
  if(!SUPPORTED_LOCALES.includes(next))return false;
  try{writeUILocale(storage??globalThis.localStorage,next);}catch{return false;}
  if(locale!==next){locale=next;for(const fn of listeners)fn(next);}
  return true;
}
export function resolveText(catalog,key,values={},language='ja'){
  const active=supported(language);let template=catalog[active]?.[key],templateLanguage=active;
  if(template===undefined){if(active==='zh-CN'||active==='ko'){template=catalog.en?.[key];templateLanguage='en';}else template=catalog.ja?.[key];}
  if(template===undefined)return '['+key+']';
  if(typeof template==='object')template=template[formatter('PluralRules',{},templateLanguage).select(Number(values.count))]??template.other;
  return String(template).replace(/\{(\w+)\}/g,(_,name)=>String(values[name]??'{'+name+'}'));
}
export const text=(key,values={},language=locale)=>resolveText(dictionaries,key,values,language);
export function hasCopy(key){return Object.hasOwn(JA,key);}
export function hasLocaleCopy(key,language=locale){return Object.hasOwn(dictionaries[supported(language)],key);}
function formatter(kind,options,language){const tag=supported(language),key=kind+tag+JSON.stringify(options);if(!formats.has(key))formats.set(key,new Intl[kind](tag,options));return formats.get(key);}
export const formatNumber=(value,options={},language=locale)=>formatter('NumberFormat',options,language).format(value);
export function formatDate(value,options={},language=locale){const date=value instanceof Date?value:new Date(value);return Number.isFinite(date.getTime())?formatter('DateTimeFormat',options,language).format(date):text('common.unknownDate',{},language);}

export function isLocaleComplete(language=locale){return SUPPORTED_LOCALES.includes(language)&&Object.keys(JA).every(key=>Object.hasOwn(dictionaries[language],key));}
