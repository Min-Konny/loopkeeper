import {text as t} from './i18n.js?v=0.6.140';
export function manualRepeatMarkup(state,recipe,check){
 if(state.version===1||recipe.id!=='smelt_iron')return '';
 const active=state.run.manualRepeat===recipe.id;
 return '<button type="button" class="button small '+(active?'gold-outline':'muted')+'" data-repeat-craft="'+recipe.id+'" data-focus="repeat-'+recipe.id+'" aria-pressed="'+active+'" '+(!active&&!check.ok?'disabled':'')+'>'+(active?t('repeat.stop'):t('repeat.start'))+'</button><small>'+(active?t('repeat.active'):!check.ok?check.reason:t('repeat.hint'))+'</small>';
}
