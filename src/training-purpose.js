import {isLegacy,getCatalog,getSkillProgress,resolveGoal} from './engine.js?v=0.6.54';
export function trainingPurpose(state){
 const catalog=getCatalog(state),active=state.run.activeAction,queue=state.run.queue;
 if(!queue.length || state.settings.disabledUpgrades.includes('action_queue'))return '';
 let goal,training;
 if(!isLegacy(state)){
  if(queue[0].kind!=='goal' || active && active.goalId!==queue[0].goalId)return '';
  goal=catalog.RECIPES.find(d=>d.id===queue[0].id);training=resolveGoal(state,queue[0].id).training;
 }else{
  if(active && !state.run.queueManaged)return '';
  goal=[...queue].reverse().map(q=>catalog.RECIPES.find(d=>d.id===q.id)).find(Boolean);
  const locked=queue.map(q=>[...catalog.ACTIONS,...catalog.RECIPES].find(d=>d.id===q.id)).find(d=>d && getSkillProgress(state.run.skills[d.skill].xp).level<(d.unlockLevel || 1));
  if(locked)training={skill:locked.skill,level:locked.unlockLevel};
 }
 if(!goal || !training)return '';
 const name=catalog.SKILLS.find(s=>s.id===training.skill)?.name || training.skill;
 return goal.name+'のため'+name+'Lv.'+training.level+(active && [...catalog.ACTIONS,...catalog.RECIPES].find(d=>d.id===active.id)?.skill===training.skill?'を育成中':'を育成する準備');
}
