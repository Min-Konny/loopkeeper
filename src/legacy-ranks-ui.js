import {LEGACY_UPGRADES} from './engine.js?v=0.6.140';
import {text as t,getUILocale} from './i18n.js?v=0.6.140';
import {escapeCopy as esc} from './locale-controls.js?v=0.6.140';
import {rankId} from './legacy-rank-definitions.js?v=0.6.140';
import{rankTimingMarkup}from './effective-inheritance.js?v=0.6.140';
import {legacyRankCategory}from './legacy-categories.js?v=0.6.140';
import {LEGACY_RANKS}from './legacy-rank-definitions.js?v=0.6.140';import {getLegacyRankStatus}from './engine.js?v=0.6.140';import {icon}from './icons.js?v=0.6.140';
function legacyRanksJapanese(s,setup=false,group='all'){
 if(s.version===1)return '';
 if(group==='all')return legacyRanksJapanese(s,setup,'combat')+legacyRanksJapanese(s,false,'production')+legacyRanksJapanese(s,false,'trade');
 const ranks=LEGACY_RANKS.filter(d=>legacyRankCategory(d)===(group==='production'?'investment':group)),name=group==='trade'?'交易の投資':group==='production'?'生産の投資':'戦闘・魔法の投資';
 return (setup?'<button class="button small muted" data-reset-ranks="1" data-focus="reset-ranks">ランク投資を全て戻す</button>':'')+'<section class="legacy-upgrade-group"><div class="legacy-group-heading">'+icon(group==='production'?'tool':'shield')+'<div><h3>'+name+'</h3><p>'+(setup?'各枝R5まで · 追加1/2/3/4/5pt':'追加費用1/2/3/4/5pt、各枝R5まで。現在の効果と実際の投資総額を表示します。')+'</p></div></div><div class="upgrade-grid">'+ranks.map(rank=>{
  const r=getLegacyRankStatus(s,rank.key),committed=setup?getLegacyRankStatus({...s,run:{...s.run,status:'preparing'}},rank.key):r,fmt=rank.format||String,next=r.nextRank?'次 R'+r.nextRank+'（追加 '+r.nextCost+'pt）：'+rank.label+' +'+fmt(r.nextIncrement)+'（全段階有効時 +'+fmt(r.nextTotal)+'）':'最高ランク R5';
  const refund=setup&&r.rank?'<button class="button small muted" data-refund-rank="'+rank.key+'" data-focus="rank-refund-'+rank.key+'">R'+r.rank+'を戻す ・ '+r.refundCost+'pt</button>':'';
  const toggle=setup&&r.rank?'<button class="button small muted" data-toggle-rank="'+rank.key+'" data-focus="rank-toggle-'+rank.key+'" '+(!r.canToggle?'disabled':'')+'>'+r.toggleLabel+'</button>':'';
  return '<article class="upgrade-card rank-card" data-legacy-rank="'+rank.key+'"><span class="upgrade-symbol">'+icon(rank.icon)+'</span><div class="upgrade-details"><h3>'+rank.name+' ・ R'+r.rank+'</h3><p>'+(setup?'次の命の効果：':'現在の効果：')+''+rank.label+' +'+fmt(r.activeEffect)+(setup&&committed.activeEffect!==r.activeEffect?'（確定済み +'+fmt(committed.activeEffect)+'）':'')+'</p><p>'+next+'</p>'+(rank.description?'<small>'+rank.description+'</small>':'')+rankTimingMarkup(s,rank.key)+'<small>現在の投資合計 '+r.paidTotal+'pt</small></div><div class="legacy-upgrade-command">'+(setup&&r.nextRank?'<button class="button small gold-outline" data-buy-rank="'+rank.key+'" data-focus="rank-buy-'+rank.key+'" '+(!r.canBuy?'disabled':'')+'>追加 '+r.nextCost+'pt で R'+r.nextRank+'</button>':'')+refund+toggle+(setup&&!r.canBuy&&r.nextRank?'<small>'+r.reason+'</small>':'')+'</div></article>';
 }).join('')+'</div></section>';
}

function rankReason(s,rank,r){if(!r.nextRank)return t('rank.max');if(s.run.status!=='legacy_setup'||s.run.augments.offer.length)return t('rank.rebirthOnly');const target=s.run.legacyDraft;
 if(target.points<r.nextCost)return t('rank.noPoints');const u=LEGACY_UPGRADES.find(d=>d.id===rankId(rank,r.nextRank)),g=u?.unlock||{},needed=g.bestWave;if(needed&&s.meta.bestWave<needed)return t('rank.bestWave',{wave:needed});
 if(g.completedQuests&&s.meta.completedMilestones.length<g.completedQuests&&s.meta.bestWave<3)return t('rank.milestones',{count:g.completedQuests});if(r.nextRank>1&&!target.upgrades.includes(rankId(rank,r.nextRank-1)))return t('rank.previous',{rank:r.nextRank-1});return r.reason||'';
}
export function legacyRanksMarkup(s,setup=false,group='all'){
 if(getUILocale()==='ja')return legacyRanksJapanese(s,setup,group);if(s.version===1)return '';if(group==='all')return legacyRanksMarkup(s,setup,'combat')+legacyRanksMarkup(s,false,'production')+legacyRanksMarkup(s,false,'trade');
 const ranks=LEGACY_RANKS.filter(d=>legacyRankCategory(d)===(group==='production'?'investment':group));
 return (setup?'<button class="button small muted" data-reset-ranks="1" data-focus="reset-ranks">'+esc(t('rank.reset'))+'</button>':'')+'<section class="legacy-upgrade-group"><div class="legacy-group-heading">'+icon(group==='production'?'tool':'shield')+'<div><h3>'+esc(t('rank.group.'+group))+'</h3><p>'+esc(t(setup?'rank.setupHint':'rank.currentHint'))+'</p></div></div><div class="upgrade-grid">'+ranks.map(rank=>{
  const r=getLegacyRankStatus(s,rank.key),committed=setup?getLegacyRankStatus({...s,run:{...s.run,status:'preparing'}},rank.key):r,fmt=rank.format||String,label=t('rank.'+rank.key+'.label');
  const next=r.nextRank?t('rank.next',{rank:r.nextRank,cost:r.nextCost,label,increment:fmt(r.nextIncrement),total:fmt(r.nextTotal)}):t('rank.max');
  const refund=setup&&r.rank?'<button class="button small muted" data-refund-rank="'+rank.key+'" data-focus="rank-refund-'+rank.key+'">'+esc(t('rank.refund',{rank:r.rank,points:r.refundCost}))+'</button>':'';
  const target=s.run.status==='legacy_setup'?s.run.legacyDraft:s.meta,disabled=target.disabledUpgrades??s.settings.disabledUpgrades;
  const enable=Array.from({length:r.rank},(_,i)=>rankId(rank,i+1)).some(id=>disabled.includes(id));
  const toggle=setup&&r.rank?'<button class="button small muted" data-toggle-rank="'+rank.key+'" data-focus="rank-toggle-'+rank.key+'" '+(!r.canToggle?'disabled':'')+'>'+esc(t(enable?'rank.enable':'rank.disable'))+'</button>':'';
  return '<article class="upgrade-card rank-card" data-legacy-rank="'+rank.key+'"><span class="upgrade-symbol">'+icon(rank.icon)+'</span><div class="upgrade-details"><h3>'+esc(t('rank.'+rank.key+'.name'))+' · R'+r.rank+'</h3><p>'+esc(t(setup?'rank.effectNext':'rank.effectCurrent')+label+' +'+fmt(r.activeEffect)+(setup&&committed.activeEffect!==r.activeEffect?t('rank.committed',{value:fmt(committed.activeEffect)}):''))+'</p><p>'+esc(next)+'</p>'+(rank.description?'<small>'+esc(t('rank.'+rank.key+'.description'))+'</small>':'')+rankTimingMarkup(s,rank.key)+'<small>'+esc(t('rank.paid',{points:r.paidTotal}))+'</small></div><div class="legacy-upgrade-command">'+(setup&&r.nextRank?'<button class="button small gold-outline" data-buy-rank="'+rank.key+'" data-focus="rank-buy-'+rank.key+'" '+(!r.canBuy?'disabled':'')+'>'+esc(t('rank.buy',{cost:r.nextCost,rank:r.nextRank}))+'</button>':'')+refund+toggle+(setup&&!r.canBuy&&r.nextRank?'<small>'+esc(rankReason(s,rank,r))+'</small>':'')+'</div></article>';
 }).join('')+'</div></section>';
}
