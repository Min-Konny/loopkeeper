import {text as t} from './i18n.js?v=0.6.140';
import {isCombatTraining,trainingProgress}from './queue-conditions.js?v=0.6.140';
export const trainingMode=(s,id)=>s.version===2&&isCombatTraining(id);
export const nextTrainingLevel=(s,id)=>Math.min(100,(trainingProgress(s,id)?.level||1)+1);
// Undefined is an unedited draft, not a snapshot of the level when selected.
// Explicit values (including an incomplete/invalid edit) remain the user's draft.
export const trainingDraftTarget=(s,id,value)=>value===undefined?nextTrainingLevel(s,id):value;
export function trainingLevelEditor(s,id,value,attributes){const level=trainingProgress(s,id)?.level||1,target=trainingDraftTarget(s,id,value);return '<label class="training-level-editor">'+t('training.target')+'<input type="number" min="2" max="100" step="1" inputmode="numeric" title="'+t('training.bounds')+'" data-training-level '+attributes+' value="'+(Number.isFinite(target)?target:'')+'"><small>'+t('training.current',{level})+'</small></label>';}
export const trainingQueueEditor=(s,q,index,focus)=>trainingLevelEditor(s,q.id,q.until.target,'data-queue-training-level="'+index+'" data-training-goal="'+q.goalId+'" data-focus="'+focus+'" aria-label="'+t('training.aria')+'"')+(q.until.pauseAfter?'<small>'+t('training.pauseAfter')+'</small>':'');
