import {legacyRankCategory}from './legacy-categories.js?v=0.6.49';
import {LEGACY_RANKS}from './legacy-rank-definitions.js?v=0.6.49';import {getLegacyRankStatus}from './engine.js?v=0.6.49';import {icon}from './icons.js?v=0.6.49';
export function legacyRanksMarkup(s,setup=false,group='all'){
 if(s.version===1)return '';
 if(group==='all')return legacyRanksMarkup(s,setup,'combat')+legacyRanksMarkup(s,false,'production')+legacyRanksMarkup(s,false,'trade');
 const ranks=LEGACY_RANKS.filter(d=>legacyRankCategory(d)===(group==='production'?'investment':group)),name=group==='trade'?'交易の投資':group==='production'?'生産の投資':'戦闘・魔法の投資';
 return (setup?'<button class="button small muted" data-reset-ranks="1" data-focus="reset-ranks">ランク投資を全て戻す</button>':'')+'<section class="legacy-upgrade-group"><div class="legacy-group-heading">'+icon(group==='production'?'tool':'shield')+'<div><h3>'+name+'</h3><p>'+(setup?'各枝R5まで · 追加1/2/3/4/5pt':'追加費用1/2/3/4/5pt、各枝R5まで。現在の効果と実際の投資総額を表示します。')+'</p></div></div><div class="upgrade-grid">'+ranks.map(rank=>{
  const r=getLegacyRankStatus(s,rank.key),committed=setup?getLegacyRankStatus({...s,run:{...s.run,status:'preparing'}},rank.key):r,fmt=rank.format||String,next=r.nextRank?'次 R'+r.nextRank+'（追加 '+r.nextCost+'pt）：'+rank.label+' +'+fmt(r.nextIncrement)+'（全段階有効時 +'+fmt(r.nextTotal)+'）':'最高ランク R5';
  const refund=setup&&r.rank?'<button class="button small muted" data-refund-rank="'+rank.key+'" data-focus="rank-refund-'+rank.key+'">R'+r.rank+'を戻す ・ '+r.refundCost+'pt</button>':'';
  const toggle=setup&&r.rank?'<button class="button small muted" data-toggle-rank="'+rank.key+'" data-focus="rank-toggle-'+rank.key+'" '+(!r.canToggle?'disabled':'')+'>'+r.toggleLabel+'</button>':'';
  return '<article class="upgrade-card rank-card" data-legacy-rank="'+rank.key+'"><span class="upgrade-symbol">'+icon(rank.icon)+'</span><div class="upgrade-details"><h3>'+rank.name+' ・ R'+r.rank+'</h3><p>'+(setup?'次の命の効果：':'現在の効果：')+''+rank.label+' +'+fmt(r.activeEffect)+(setup&&committed.activeEffect!==r.activeEffect?'（確定済み +'+fmt(committed.activeEffect)+'）':'')+'</p><p>'+next+'</p>'+(rank.description?'<small>'+rank.description+'</small>':'')+'<small>現在の投資合計 '+r.paidTotal+'pt</small></div><div class="legacy-upgrade-command">'+(setup&&r.nextRank?'<button class="button small gold-outline" data-buy-rank="'+rank.key+'" data-focus="rank-buy-'+rank.key+'" '+(!r.canBuy?'disabled':'')+'>追加 '+r.nextCost+'pt で R'+r.nextRank+'</button>':'')+refund+toggle+(setup&&!r.canBuy&&r.nextRank?'<small>'+r.reason+'</small>':'')+'</div></article>';
 }).join('')+'</div></section>';
}
