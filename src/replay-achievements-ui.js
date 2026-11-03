import {text as t} from './i18n.js?v=0.6.140';
import {escapeCopy as esc} from './locale-controls.js?v=0.6.140';
import {REPLAY_ACHIEVEMENTS} from './replay-achievements.js?v=0.6.140';
import {milestoneAchievementProgress} from './milestone-achievements.js?v=0.6.140';
export function replayAchievementsMarkup(s){
  if(s.version!==2)return '';
  const records=s.replay?.unlocked||[],a=s.replay?.attempt;
  const progress=id=>{
    const definition=REPLAY_ACHIEVEMENTS.find(d=>d.id===id);
    if(definition?.kind==='milestone'){
      const p=milestoneAchievementProgress(s,definition);
      return t(definition.metric==='equipmentTier'?'achievements.tierProgress':'achievements.progress',p);
    }
    if(!a?.known&&id!=='frontier_clear')return t('achievements.unknown');
    if(a?.finished)return t('achievements.finished');
    if(id==='frontier_15_generations')return s.meta.generation>15?t('achievements.overLimit'):t('achievements.generations',{generation:s.meta.generation});
    if(id==='frontier_without_market')return a?.usedMarket?t('achievements.marketFailed'):t('achievements.marketActive');
    if(id==='frontier_without_towers')return a?.usedTowers?t('achievements.towersFailed'):t('achievements.towersActive');
    const type=id.slice('frontier_'.length);
    if(['martial','fortress','economy'].includes(type))return a?.packs.some(t=>t!==type)?t('achievements.typeFailed'):t('achievements.typeProgress',{count:a?.started[type]||0,status:t(a?.specialists.includes(type)?'common.done':'common.notDone')});
    return t('achievements.aim');
  };
  const article=d=>{const r=records.find(x=>x.id===d.id);return '<article data-replay-achievement="'+d.id+'" class="replay-achievement '+(r?'earned':'')+'"><h4>'+esc(t('achievement.'+d.id+'.name'))+' <small>'+(r?t('common.unlocked'):t('common.locked'))+'</small></h4><p>'+esc(t('achievement.'+d.id+'.rule'))+'</p><small>'+(r?t('achievements.recorded',{generation:r.generation}):progress(d.id))+'</small></article>';};
  const groups=[['milestones',t('achievements.milestones'),REPLAY_ACHIEVEMENTS.filter(d=>d.kind==='milestone')],['challenges',t('achievements.challenges'),REPLAY_ACHIEVEMENTS.filter(d=>d.kind!=='milestone')]];
  const list=groups.map(([id,label,definitions])=>'<section data-achievement-group="'+id+'"><p><strong>'+label+' '+definitions.filter(d=>records.some(x=>x.id===d.id)).length+' / '+definitions.length+'</strong></p><div class="replay-achievement-list">'+definitions.map(article).join('')+'</div></section>').join('');
  return '<section class="replay-achievements" aria-label="'+t('achievements.heading')+'"><h3>'+t('achievements.heading')+' <small>'+records.length+' / '+REPLAY_ACHIEVEMENTS.length+'</small></h3><p class="fine-print">'+t('achievements.note')+'</p><details data-replay-list><summary>'+t('achievements.show')+'</summary>'+list+'</details><p class="fine-print">'+t('achievements.historyNote')+'</p></section>';
}
