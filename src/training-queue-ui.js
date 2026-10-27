import {isCombatTraining,trainingProgress}from './queue-conditions.js?v=0.6.99';
export const trainingMode=(s,id)=>s.version===2&&isCombatTraining(id);
export const nextTrainingLevel=(s,id)=>Math.min(100,(trainingProgress(s,id)?.level||1)+1);
export function trainingLevelEditor(s,id,value,attributes){const level=trainingProgress(s,id)?.level||1,target=value===undefined?nextTrainingLevel(s,id):value;return '<label class="training-level-editor">目標 進行Lv<input type="number" min="2" max="100" step="1" inputmode="numeric" title="この命の進行レベル・2〜100の整数" data-training-level '+attributes+' value="'+(Number.isFinite(target)?target:'')+'"><small>現在Lv.'+level+'（この命）</small></label>';}
export const trainingQueueEditor=(s,q,index,focus)=>trainingLevelEditor(s,q.id,q.until.target,'data-queue-training-level="'+index+'" data-training-goal="'+q.goalId+'" data-focus="'+focus+'" aria-label="目標の進行レベル"')+(q.until.pauseAfter?'<small>達成で停止</small>':'');
