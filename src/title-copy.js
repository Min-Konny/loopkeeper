export {UI_LOCALE_KEY,SUPPORTED_LOCALES,readUILocale,writeUILocale} from './i18n.js?v=0.6.140';
import {text,hasCopy} from './i18n.js?v=0.6.140';
export function titleText(key,values={},locale){if(!hasCopy(key))throw Error('Missing title copy: '+key);return text(key,values,locale);}
