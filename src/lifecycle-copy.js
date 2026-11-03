import {text as t,getUILocale} from './i18n.js?v=0.6.140';
import {escapeCopy as esc} from './locale-controls.js?v=0.6.140';
import {entityText} from './entity-copy.js?v=0.6.140';
import {earlyLoop,earlyDefeatMarkup as originalEarlyDefeatMarkup} from './early-loop.js?v=0.6.140';
import {battleFood} from './meals.js?v=0.6.140';
import {CHALLENGES} from './strategy.js?v=0.6.140';
const p=value=>'<p>'+esc(value)+'</p>',number=n=>Math.round(n).toLocaleString(getUILocale());
export function earlyDefeatMarkup(s){
 if(getUILocale()==='ja')return originalEarlyDefeatMarkup(s).replace('<section class="defeat-report">','<section class="defeat-report" data-early-defeat>');
 if(!earlyLoop(s)||!['dead','legacy_setup'].includes(s.run.status)||!s.run.battleReports?.length)return '';
 const current=s.run.battleReports[0],previous=(s.meta.history||[]).find(h=>h.generation<s.meta.generation&&h.result?.earlyLoopVersion===1)?.result,remaining=current.maxHp?Math.round(current.remainingHp/current.maxHp*100):0;
 const comparison=previous?.wallWave===current.wave&&previous.enemyRemainingPercent!=null?t('retry.comparison',{previous:previous.enemyRemainingPercent,current:remaining}):t('retry.remaining',{remaining});
 const hasFood=battleFood(s)>0,usedFood=current.foodHealing>0,advice=!hasFood?(usedFood?'retry.usedAll':'retry.noneUsed'):(usedFood?'retry.overwhelmed':'retry.beforePotion');
 const missing=[];if(current.wave===6){if((s.run.equipment.shield?.tier||0)<2)missing.push(entityText('recipe','iron_shield'));if((s.run.facilities.infirmary||0)<2)missing.push(entityText('facility','infirmary')+' II');}if(current.wave===12){if((s.run.equipment.armor?.tier||0)<4)missing.push(t('retry.silverArmor'));if((s.run.equipment.shield?.tier||0)<4)missing.push(entityText('recipe','silver_shield'));}
 return '<section class="defeat-report" data-early-defeat><h3>'+esc(t('retry.title'))+'</h3>'+p(comparison)+p(t('retry.points',{points:(s.run.progression?.checkpointAward||0)+(s.run.progression?.attemptAward||0)+(s.run.progression?.routeAward||0)}))+(missing.length?p(t('retry.missing',{names:missing.join(', ')})):'')+p(t(advice))+'</section>';
}
export function englishReportMarkup(s){
 const reports=s.run.battleReports||[];if(!reports.length)return '';
 return '<details data-detail-key="battle-recaps" class="strategy-details battle-recaps"><summary data-focus="battle-recaps">'+esc(t('recap.title',{wave:reports[0].wave,result:t(reports[0].won?'recap.won':'recap.lost')}))+'</summary>'+reports.map(r=>{
 const total=r.player+r.guards+r.tower+r.counter+(r.magic||0)+(r.pet||0)+(r.archer||0),damage=['player',...((r.archer||0)>0?['archer']:[]),'guards','tower','counter',...((r.magic||0)>0?['magic']:[]),...((r.pet||0)>0?['pet']:[])],stats=['player',...((r.archer||0)>0?['archer']:[]),'guards','tower','counter',...((r.magic||0)>0?['magic']:[]),'prevented','damageTaken','foodHealing','treatmentHealing'];
 // Reports persist prose, not an enemy ID. Preserve the recorded name verbatim.
 return '<article class="battle-recap"><h4>'+esc(t('recap.enemy',{wave:r.wave,name:r.enemy}))+'</h4><div class="damage-segments" aria-label="'+esc(t('recap.damageAria'))+'">'+damage.map(k=>'<i class="source-'+k+'" style="flex:'+(total?r[k]/total:0)+'" title="'+esc(t('recap.'+k)+' '+number(r[k]))+'"></i>').join('')+'</div><dl>'+stats.map(k=>'<div><dt>'+esc(t('recap.'+k))+'</dt><dd>'+number(r[k])+'</dd></div>').join('')+'</dl>'+(!r.won?p(t('recap.remaining',{remaining:number(r.remainingHp),max:number(r.maxHp),percent:Math.ceil(r.remainingHp/r.maxHp*100)})):'')+'</article>';
 }).join('')+'</details>';
}
export function englishChallengesMarkup(s){if(!s.meta.clears)return '';return '<details data-detail-key="challenges" class="strategy-details challenges"><summary data-focus="legacy-challenges">'+esc(t('challenges.title',{count:(s.meta.challengeBadges||[]).length}))+'</summary>'+p(t('challenges.hint'))+CHALLENGES.map(c=>'<article><strong style="color:'+c.color+'">'+(s.meta.challengeBadges?.includes(c.id)?'✓ ':'')+esc(entityText('challenge',c))+'</strong>'+p(entityText('challenge',c,'description'))+'</article>').join('')+'</details>';}
