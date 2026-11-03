import {reasonText} from './reason-copy.js?v=0.6.140';
import {encounterName} from './encounter-copy.js?v=0.6.140';
import {getUILocale,text as t} from './i18n.js?v=0.6.140';import {entityText} from './entity-copy.js?v=0.6.140';
// New events only. Metadata is ephemeral and deliberately absent from exported saves.
// Historical opaque text is never reverse-translated or overwritten.
const copies=new WeakMap();
export function registerLogCopy(entry,copy){if(copy)copies.set(entry,copy);}
export function logText(entry,state){const c=copies.get(entry);if(getUILocale()==='ja'||!c)return entry.text;const values={...c.values};if(c.descriptionEntity)values.description=entityText(c.descriptionEntity.kind,{...c.descriptionEntity.definition,id:c.descriptionEntity.id},'description');if(c.reason&&state)values.reason=reasonText(state,c.reason.text,c.reason.id);if(c.entity)values.name=entityText(c.entity.kind,{...c.entity.definition,id:c.entity.id});if(c.entity?.kind==='country')values.name=t('country.'+c.entity.id);if(c.entity?.kind==='party')values.name=t('party.'+c.entity.id);if(c.encounter)values.name=encounterName(c.encounter);return t(c.key,values);}
