import {legacyEntityCopy} from './legacy-progress-copy.js?v=0.6.140';
import {getUILocale} from './i18n.js?v=0.6.140';
import {facilityCopy} from './facility-copy.js?v=0.6.140';
import {text,hasCopy} from './i18n.js?v=0.6.140';
export function entityText(kind,definition,field='name'){if(typeof definition==='object'){const legacy=legacyEntityCopy(kind,definition,field);if(legacy!==null)return legacy;}const id=typeof definition==='string'?definition:definition?.id,key='entity.'+kind+'.'+id+'.'+field;if(hasCopy(key))return text(key);if(getUILocale()!=='ja'&&kind==='recipe'&&typeof definition==='object'&&definition?.facility){const value=facilityCopy(definition,field);if(value!==null)return value;}return (typeof definition==='object'?definition?.[field]:null)??id??'';}
