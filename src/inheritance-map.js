import {LEGACY_UPGRADES,canPurchaseUpgrade,getLegacyRankStatus}from './engine.js?v=0.6.43';
import {LEGACY_RANKS,rankId}from './legacy-rank-definitions.js?v=0.6.43';
import {legacyRankCategory}from './legacy-categories.js?v=0.6.43';

// Neighbouring branches have related roles. These are display positions, not prerequisites.
export const MAP_ORDER=['attack','maxHp','defense','haste','critRate','spellPower','castHaste','alchemySpeed','craftSpeed','gatherSpeed','returnSpeed','tradeSaleBonus'];
export const MAP_SIZE=700,MAP_RADIUS=250;
const escape=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const groups={combat:'戦闘・魔法',investment:'生産・復帰',trade:'交易'};
const glyph={owned:'✓',available:'○',insufficient:'!',locked:'―',max:'★'};
export function mapPosition(index){const a=(-105+index*30)*Math.PI/180;return {x:350+MAP_RADIUS*Math.cos(a),y:350+MAP_RADIUS*Math.sin(a)};}

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
   return {id,rank:n,cost:upgrade.cost,owned,off,status,label,reason:owned?(off?'この段階は無効です。':'取得済みです。'):available.reason||'',effect:definition.label+' +'+format(definition.increment(n))};
  });
  const next=ranks.find(x=>!x.owned),status=next?.status||'max';
  return {key,name:definition.name,category:legacyRankCategory(definition),currentRank:current.rank,activeEffect:definition.label+' +'+format(current.activeEffect),ranks,next,status,position:mapPosition(index)};
 });
 return {draft,points:source.points,branches};
}

function selector(scope,selected){return '<label class="inheritance-branch-picker">系統<select data-inheritance-branch data-inheritance-scope="'+scope+'" data-focus="'+scope+'-map-picker"><option value="">全体 · 12系統</option>'+['combat','investment','trade'].map(group=>'<optgroup label="'+groups[group]+'">'+MAP_ORDER.map(key=>LEGACY_RANKS.find(x=>x.key===key)).filter(d=>legacyRankCategory(d)===group).map(d=>'<option value="'+d.key+'" '+(d.key===selected?'selected':'')+'>'+d.name+'</option>').join('')+'</optgroup>').join('')+'</select></label>';}
export function inheritanceMapMarkup(s,scope='live',options={}){
 const model=inheritanceMapModel(s);if(!model)return '';
 const selected=model.branches.find(x=>x.key===options.branch),heading=selected?selected.name:'継承 · 12系統';
 const toolbar='<div class="inheritance-map-tools">'+selector(scope,selected?.key||'')+'<div class="inheritance-map-actions">'+(selected?'<button type="button" data-inheritance-overview>全体</button>':'<button type="button" data-inheritance-center>中央</button>')+'</div></div>';
 let content;
 if(!selected){
  const lines=model.branches.map(b=>'<line x1="350" y1="350" x2="'+b.position.x+'" y2="'+b.position.y+'"/>').join('');
  const dots=model.branches.map(b=>b.ranks.map((r,i)=>{const t=(80+i*28)/MAP_RADIUS,x=350+(b.position.x-350)*t,y=350+(b.position.y-350)*t;return '<circle cx="'+x+'" cy="'+y+'" r="9" class="'+(r.owned?'map-dot-owned':'')+'"/>';}).join('')).join('');
  content='<div class="inheritance-overview-canvas"><svg viewBox="0 0 700 700" aria-hidden="true" focusable="false">'+lines+dots+'</svg><div class="inheritance-map-center"><strong>継承</strong><span>'+model.points+' pt</span></div>'+model.branches.map(b=>'<button type="button" class="inheritance-branch-node map-state-'+b.status+'" style="left:'+b.position.x+'px;top:'+b.position.y+'px" data-inheritance-open="'+b.key+'" data-focus="'+scope+'-map-branch-'+b.key+'" aria-label="'+escape(b.name+'、R'+b.currentRank+'/5、'+(b.next?'次 '+b.next.cost+'ポイント、'+b.next.label:'最大段階')+'。段階を見る')+'"><strong>'+b.name+'</strong><span>R'+b.currentRank+'/5 · '+(b.next?'次 '+b.next.cost+'pt':'★ 最大')+'</span><span>'+glyph[b.status]+' '+(b.next?b.next.label:'最大段階')+'</span></button>').join('')+'</div>';
 }else{
  content='<div class="inheritance-rank-track"><button type="button" class="inheritance-rank-root" data-inheritance-overview>継承<br><small>全体へ</small></button>'+selected.ranks.map(r=>'<button type="button" class="inheritance-rank-node map-state-'+r.status+'" data-inheritance-detail="'+selected.key+'" data-inheritance-rank="'+r.rank+'" data-focus="'+scope+'-map-rank-'+selected.key+'-'+r.rank+'" aria-label="'+escape(selected.name+' R'+r.rank+'、'+r.cost+'ポイント、'+r.effect+'、'+r.label+(r.reason?'、'+r.reason:'')+'。カード詳細へ')+'"><strong>R'+r.rank+' <small>'+r.cost+'pt</small></strong><span>'+escape(r.effect)+'</span><span>'+glyph[r.status]+' '+r.label+'</span><small>'+(r.status==='locked'?'前提条件あり':'カード詳細へ')+'</small></button>').join('')+'</div>';
 }
 const key=scope+'-inheritance-'+(selected?.key||'overview');
 return '<section class="inheritance-map" data-inheritance-scope="'+scope+'"><div class="inheritance-map-heading"><h3>'+heading+'</h3><span>'+model.points+' pt · '+(model.draft?'次の命の配分':'現在の配分・閲覧')+'</span></div>'+toolbar+'<div class="inheritance-map-viewport" data-inheritance-viewport="'+(selected?.key||'overview')+'" data-scroll-key="'+key+'" tabindex="0" role="region" aria-label="'+escape(heading+'。スクロールまたは矢印キーで移動')+'">'+content+'</div><p class="inheritance-map-caption">'+(selected?escape(selected.activeEffect)+' · ノードから既存カードへ':'枝を選ぶと5段階の費用と効果を表示')+'</p></section>';
}
export function inheritanceMapReturnMarkup(s,scope,options={}){
 if(s.version===1||!options.detail)return '';const model=inheritanceMapModel(s),b=model.branches.find(x=>x.key===options.detail.key),r=b?.ranks.find(x=>x.rank===options.detail.rank);if(!r)return '';
 return '<div class="inheritance-map-return" data-inheritance-scope="'+scope+'"><button type="button" data-inheritance-back data-focus="'+scope+'-map-back">← マップへ</button><span class="inheritance-return-summary">'+escape(b.name+' R'+r.rank+' · '+r.cost+'pt · '+r.effect)+'</span><span class="inheritance-return-stage">R'+r.rank+' · '+r.cost+'pt</span></div>';
}
