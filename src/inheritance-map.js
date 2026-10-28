import {LEGACY_UPGRADES,canPurchaseUpgrade,getLegacyRankStatus}from './engine.js?v=0.6.130';
import {LEGACY_RANKS,rankId}from './legacy-rank-definitions.js?v=0.6.130';
import {legacyRankCategory}from './legacy-categories.js?v=0.6.130';
import {icon}from './icons.js?v=0.6.130';

// Related branches stay together within their existing domains.
export const MAP_ORDER=['attack','maxHp','defense','haste','critRate','spellPower','castHaste','alchemySpeed','craftSpeed','gatherSpeed','returnSpeed','tradeSaleBonus'];
const escape=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const groups={combat:'戦闘・魔法',investment:'生産・復帰',trade:'交易'};
const glyph={owned:'✓',available:'○',insufficient:'!',locked:'―',max:'★'};

export function inheritanceMapModel(s){
 if(s.version===1)return null;
 const draft=s.run.status==='legacy_setup',source=draft?s.run.legacyDraft:s.meta,disabled=draft?(source.disabledUpgrades??s.settings.disabledUpgrades):s.settings.disabledUpgrades;
 const preview={...s,meta:{...s.meta,upgrades:source.upgrades,points:source.points,paidCosts:source.paidCosts},settings:{...s.settings,disabledUpgrades:disabled},run:{...s.run,status:'legacy_setup',legacyDraft:source,augments:{...s.run.augments,offer:[]}}};
 const branches=MAP_ORDER.map((key,index)=>{
  const definition=LEGACY_RANKS.find(x=>x.key===key),current=getLegacyRankStatus(s,key),format=definition.format||String;
  const ranks=[1,2,3,4,5].map(n=>{
   const id=rankId(definition,n),upgrade=LEGACY_UPGRADES.find(x=>x.id===id),owned=source.upgrades.includes(id),off=owned&&disabled.includes(id),available=canPurchaseUpgrade(preview,id);
   const enough={...preview,meta:{...preview.meta,points:Math.max(source.points,upgrade.cost)},run:{...preview.run,legacyDraft:{...source,points:Math.max(source.points,upgrade.cost)}}};
   const shortage=!owned&&!available.ok&&upgrade.cost>source.points&&canPurchaseUpgrade(enough,id).ok;
   const status=owned?(n===5?'max':'owned'):available.ok?'available':shortage?'insufficient':'locked';
   const label=owned?(n===5?'最大段階':'取得済')+(off?'・無効':''):available.ok?'未取得・取得可':shortage?'ポイント不足':'未取得';
   const prior=n>1?rankId(definition,n-1):null,predecessor=prior&&upgrade.unlock.requires?.includes(prior)?prior:null;
   return {id,predecessor,rank:n,cost:upgrade.cost,owned,off,status,label,reason:owned?(off?'この段階は無効です。':'取得済みです。'):available.reason||'',effect:definition.label+' +'+format(definition.increment(n))};
  });
  const next=ranks.find(x=>!x.owned),status=next?.status||'max';
  return {key,name:definition.name,category:legacyRankCategory(definition),currentRank:current.rank,activeEffect:definition.label+' +'+format(current.activeEffect),statLabel:definition.label,currentValue:format(current.activeEffect),nextValue:format(current.activeEffect+(current.nextIncrement||0)),canBuy:current.canBuy,canToggle:current.canToggle,toggleLabel:current.toggleLabel,refundCost:current.refundCost,reason:current.reason,icon:definition.icon,description:definition.description||'',ranks,next,status};
 });
 return {draft,points:source.points,branches};
}

export function inheritanceMapMarkup(s,scope='live',options={}){
 const m=inheritanceMapModel(s);if(!m)return '';
 const selected=options.branch,only=!!options.affordable,available=m.branches.filter(b=>b.next?.status==='available').length;
 const command=b=>m.draft?(b.next?'<button type="button" class="map-allocate" data-buy-rank="'+b.key+'" data-focus="map-buy-'+b.key+'" '+(!b.canBuy?'disabled':'')+' aria-label="'+escape(b.name+'をR'+b.next.rank+'に割り振る、'+b.next.cost+'ポイント')+'">R'+b.next.rank+' に割り振る <strong>'+b.next.cost+' pt</strong></button>':'<span class="map-max">最大 R5</span>'):'<span class="map-live-only">次の命で配分</span>';
 const branch=b=>{
  const open=selected===b.key,stage=b.ranks.find(r=>r.rank===(options.stage||b.next?.rank||5))||b.ranks[0],definition=LEGACY_RANKS.find(d=>d.key===b.key),fmt=definition.format||String,total=fmt(b.ranks.filter(r=>r.rank<=stage.rank).reduce((sum,r)=>sum+definition.increment(r.rank),0));
  const adjust=(m.draft&&b.currentRank?'<div class="map-adjust"><button type="button" data-refund-rank="'+b.key+'" data-focus="map-refund-'+b.key+'">R'+b.currentRank+'を戻す · '+b.refundCost+'pt</button><button type="button" data-toggle-rank="'+b.key+'" data-focus="map-toggle-'+b.key+'" '+(!b.canToggle?'disabled':'')+'>'+escape(b.toggleLabel)+'</button></div>':'');
  const detail=open?'<div class="map-branch-detail">'+adjust+'<div class="map-stage-picker" role="group" aria-label="'+escape(b.name+'の段階比較')+'">'+b.ranks.map(r=>'<button type="button" class="map-stage '+(stage.rank===r.rank?'selected':'')+'" data-map-stage-id="'+r.id+'" data-map-requires="'+(r.predecessor||'')+'" data-map-owned="'+r.owned+'" data-inheritance-stage="'+r.rank+'" data-inheritance-key="'+b.key+'" data-focus="map-stage-'+b.key+'-'+r.rank+'" aria-pressed="'+(stage.rank===r.rank)+'" aria-label="R'+r.rank+'、'+r.cost+'ポイント、'+escape(r.label)+(r.predecessor?'、前段階R'+(r.rank-1)+'が必要':'')+'"><strong>R'+r.rank+'</strong><span>'+r.cost+'pt</span><span>'+(r.owned?'取得済':'未取得')+'</span></button>').join('')+'</div><p class="map-stage-summary">R'+stage.rank+'：'+escape(stage.effect)+' · 全段階有効時 '+escape(total)+'<br>'+escape(stage.reason||stage.label)+'</p>'+(b.description?'<p class="map-description">'+escape(b.description)+'</p>':'')+'</div>':'';
  return '<article class="map-branch map-state-'+b.status+' '+(open?'map-branch-open':'')+'" data-map-branch="'+b.key+'">'+(open?'<svg class="map-stage-connections" data-map-stage-connections aria-hidden="true" focusable="false"></svg>':'')+'<div class="map-branch-top"><button type="button" class="map-branch-title" data-inheritance-open="'+b.key+'" data-focus="map-open-'+b.key+'" aria-expanded="'+open+'" aria-controls="'+scope+'-map-detail-'+b.key+'">'+icon(b.icon)+'<strong>'+b.name+'</strong><span>R'+b.currentRank+'/5 '+(open?'−':'+')+'</span></button><div class="map-effect"><span>'+escape(b.statLabel)+'</span><strong>'+escape(b.currentValue)+(b.next?' <span aria-hidden="true">→</span> '+escape(b.nextValue):'')+'</strong></div><div class="map-branch-action"><span class="map-status">'+glyph[b.status]+' '+escape(b.next?.label||'最大段階')+'</span>'+command(b)+'</div>'+(b.next&&b.status==='locked'?'<p class="map-unlock-reason">'+escape(b.next.reason)+'</p>':'')+'</div><div id="'+scope+'-map-detail-'+b.key+'">'+detail+'</div></article>';
 };
 const domains=[{key:'combat',name:'戦闘・魔法',icon:'sword'},{key:'investment',name:'生産・帰還',icon:'tool'},{key:'trade',name:'交易',icon:'gold'}];
 const domainMarkup=domains.map(d=>{const all=m.branches.filter(b=>b.category===d.key),visible=all.filter(b=>!only||b.status==='available'||b.key===selected);return '<section class="map-domain map-domain-'+d.key+'" data-map-domain="'+d.key+'" aria-labelledby="'+scope+'-domain-'+d.key+'"><h3 id="'+scope+'-domain-'+d.key+'">'+icon(d.icon)+d.name+'<small>'+visible.length+'/'+all.length+'</small></h3><div class="map-domain-branches">'+(visible.map(branch).join('')||'<p class="map-empty">今取得できる系統はありません</p>')+'</div></section>';});
 return '<section class="inheritance-map" data-inheritance-scope="'+scope+'"><svg class="map-overview-connections" data-map-overview-connections aria-hidden="true" focusable="false"></svg><div class="map-control-bar"><button type="button" class="map-affordable-filter" data-inheritance-affordable aria-pressed="'+only+'" data-focus="map-affordable-'+scope+'">'+(m.draft?'取得可能 ':'次回の候補 ')+''+available+'系統'+(only?' · 表示中':'')+'</button><span>'+(m.draft?'現在 → 次の効果':'確定した配分 · 変更は次の命で')+'</span></div><div class="inheritance-map-root"><strong>継承</strong>'+ (scope==='setup'?'':'<span>'+m.points+' pt</span>') +'</div><div class="inheritance-domains">'+domainMarkup[0]+'<div class="map-domain-column">'+domainMarkup.slice(1).join('')+'</div></div></section>';
}
// Older card deep links no longer need a return bar: map details stay in place.
export function inheritanceMapReturnMarkup(){return '';}
