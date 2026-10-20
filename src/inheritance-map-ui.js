import {LEGACY_RANKS}from './legacy-rank-definitions.js?v=0.6.43';import {legacyRankCategory}from './legacy-categories.js?v=0.6.43';
import {MAP_SIZE}from './inheritance-map.js?v=0.6.43';

// View state only. No game object, purchase API or save transaction is held here.
export function createInheritanceMapUI({document,getCategory,setCategory,render}){
 const states=Object.fromEntries(['live','setup'].map(scope=>[scope,{branch:null,detail:null,returnCard:null,scrolls:new Map(),nodes:new Map(),dimensions:new Map(),pending:null}]));
 const state=scope=>states[scope==='setup'?'setup':'live'];
 const scopeFor=node=>node?.closest?.('[data-inheritance-scope]')?.dataset.inheritanceScope||(node?.closest?.('#death-dialog')?'setup':'live');
 const list=scope=>document.querySelector(scope==='setup'?'#death-dialog .setup-upgrades':'#content');
 const position=scope=>({top:list(scope)?.scrollTop||0,outer:scope==='live'?document.querySelector('#expanded-work-dialog')?.scrollTop||0:0});
 function remember(scope){const root=document.querySelector('.inheritance-map[data-inheritance-scope="'+scope+'"]');const viewport=root?.querySelector('[data-inheritance-viewport]');if(viewport)state(scope).scrolls.set(viewport.dataset.inheritanceViewport,{left:viewport.scrollLeft,top:viewport.scrollTop});}
 function show(scope,branch,{focus=null}={}){const s=state(scope);remember(scope);s.branch=LEGACY_RANKS.some(r=>r.key===branch)?branch:null;s.detail=null;s.pending={focus:focus||(scope+'-map-picker')};setCategory(scope,'map');render();}
 function cards(scope){const s=state(scope),category=s.returnCard?.category||'combat';remember(scope);s.detail=null;s.pending={cardPosition:s.returnCard?.position,focus:s.returnCard?.focus||(scope==='setup'?'setup-tab-':'legacy-category-')+category};setCategory(scope,category);render();}
 function detail(scope,key,rank){const definition=LEGACY_RANKS.find(x=>x.key===key);if(!definition||!Number.isInteger(rank)||rank<1||rank>5)return;remember(scope);const s=state(scope);s.detail={key,rank};s.pending={cardKey:key};setCategory(scope,legacyRankCategory(definition));render();}
 function handleClick(button){
  const scope=scopeFor(button),s=state(scope);
  if(button.dataset.inheritanceView==='map'){
   if(s.detail){const d=s.detail;show(scope,s.branch,{focus:scope+'-map-rank-'+d.key+'-'+d.rank});return true;}
   if(getCategory(scope)!=='map')s.returnCard={category:getCategory(scope),position:position(scope),focus:scope==='setup'?'setup-tab-'+getCategory(scope):'legacy-category-'+getCategory(scope)};
   show(scope,s.branch,{focus:scope+'-inheritance-map-tab'});return true;
  }
  if(button.dataset.inheritanceOpen){show(scope,button.dataset.inheritanceOpen,{focus:scope+'-map-picker'});return true;}
  if(button.hasAttribute('data-inheritance-overview')){show(scope,null,{focus:scope+'-map-picker'});return true;}
  if(button.hasAttribute('data-inheritance-center')){const viewport=button.closest('.inheritance-map')?.querySelector('[data-inheritance-viewport]');if(viewport){viewport.scrollLeft=(MAP_SIZE-viewport.clientWidth)/2;viewport.scrollTop=(MAP_SIZE-viewport.clientHeight)/2;}return true;}
  if(button.hasAttribute('data-inheritance-cards')){cards(scope);return true;}
  if(button.dataset.inheritanceDetail){detail(scope,button.dataset.inheritanceDetail,Number(button.dataset.inheritanceRank));return true;}
  if(button.hasAttribute('data-inheritance-back')){const d=s.detail;show(scope,s.branch,{focus:d?scope+'-map-rank-'+d.key+'-'+d.rank:scope+'-map-picker'});return true;}
  const category=button.dataset.setupCategory||button.dataset.legacyCategory;
  if(category&&(getCategory(scope)==='map'||s.detail)){remember(scope);s.detail=null;s.pending={focus:scope==='setup'?'setup-tab-'+category:'legacy-category-'+category};setCategory(scope,category);render();return true;}
  return false;
 }
 function handleChange(target){if(!target.hasAttribute?.('data-inheritance-branch'))return false;show(scopeFor(target),target.value||null);return true;}
 function handleKey(event){
  if(event.isComposing||event.keyCode===229)return false;
  const tab=event.target.closest?.('[role="tab"]'),tabList=tab?.closest('[role="tablist"]');
  if(tabList&&tabList.querySelector('[data-inheritance-view]')&&['ArrowLeft','ArrowRight','Home','End'].includes(event.key)){
   const tabs=[...tabList.querySelectorAll('[role="tab"]')],at=tabs.indexOf(tab),next=event.key==='Home'?0:event.key==='End'?tabs.length-1:(at+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;event.preventDefault();event.stopImmediatePropagation();tabs[next]?.click();return true;
  }
  const viewport=event.target.matches?.('[data-inheritance-viewport]')?event.target:null;
  if(viewport&&['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','PageUp','PageDown',' '].includes(event.key)){
   event.preventDefault();event.stopImmediatePropagation();const dx=event.key==='ArrowLeft'?-72:event.key==='ArrowRight'?72:0,dy=event.key==='ArrowUp'?-72:event.key==='ArrowDown'?72:event.key==='PageUp'?-viewport.clientHeight*.8:['PageDown',' '].includes(event.key)?viewport.clientHeight*.8:0;viewport.scrollLeft+=dx;viewport.scrollTop+=dy;return true;
  }
  return false;
 }
 function sync(){for(const scope of ['live','setup']){
  const s=state(scope),root=document.querySelector('.inheritance-map[data-inheritance-scope="'+scope+'"]'),viewport=root?.querySelector('[data-inheritance-viewport]');
  if(viewport){const key=viewport.dataset.inheritanceViewport,dimensions={width:viewport.clientWidth,height:viewport.clientHeight},previous=s.dimensions.get(key);if(s.nodes.get(key)!==viewport){const old=s.scrolls.get(key);s.nodes.set(key,viewport);if(old){viewport.scrollLeft=old.left;viewport.scrollTop=old.top;}else if(key==='overview'){viewport.scrollLeft=(MAP_SIZE-viewport.clientWidth)/2;viewport.scrollTop=(MAP_SIZE-viewport.clientHeight)/2;}else viewport.scrollTop=(viewport.scrollHeight-viewport.clientHeight)/2;}else if(previous&&(previous.width!==dimensions.width||previous.height!==dimensions.height)){viewport.scrollLeft+=(previous.width-dimensions.width)/2;viewport.scrollTop+=(previous.height-dimensions.height)/2;}s.dimensions.set(key,dimensions);}
  const bar=list(scope)?.querySelector('.inheritance-map-return');if(bar){const outer=document.querySelector('#expanded-work-dialog'),scrollsOuter=scope==='live'&&outer?.open&&document.defaultView.getComputedStyle(outer).overflowY==='auto',offset=scrollsOuter?Math.max(0,outer.querySelector('.expanded-heading').getBoundingClientRect().height-6):0;bar.style.top=offset+'px';}
  const pending=s.pending;if(!pending)continue;
  if(pending.cardPosition){const host=list(scope);if(host)host.scrollTop=pending.cardPosition.top;if(scope==='live'){const outer=document.querySelector('#expanded-work-dialog');if(outer)outer.scrollTop=pending.cardPosition.outer;}}
  if(pending.cardKey){const card=list(scope)?.querySelector('[data-legacy-rank="'+pending.cardKey+'"]');if(card){const bar=list(scope)?.querySelector('.inheritance-map-return');card.style.scrollMarginTop=((bar?.offsetHeight||0)+parseFloat(bar?.style.top||'0')+8)+'px';card.setAttribute('tabindex','-1');card.scrollIntoView({block:'start',behavior:'instant'});card.focus({preventScroll:true});}}
  else if(pending.focus){const target=[...document.querySelectorAll('[data-focus],[id]')].find(n=>n.dataset.focus===pending.focus||n.id===pending.focus);if(target){if(viewport&&target.closest('[data-inheritance-viewport]'))target.scrollIntoView({block:'nearest',inline:'nearest',behavior:'instant'});target.focus({preventScroll:true});}}
  s.pending=null;
 }}
 // Run before the existing category-only keyboard handler, whose tab list does not include the map.
 document.addEventListener('keydown',handleKey,true);
 document.addEventListener('scroll',event=>{const viewport=event.target;if(viewport?.hasAttribute?.('data-inheritance-viewport'))state(scopeFor(viewport)).scrolls.set(viewport.dataset.inheritanceViewport,{left:viewport.scrollLeft,top:viewport.scrollTop});},true);
 document.addEventListener('keydown',event=>{const root=event.target.closest?.('.inheritance-map');if(event.key==='Escape'&&root&&!event.isComposing&&event.keyCode!==229&&event.target.tagName!=='SELECT'){event.preventDefault();event.stopImmediatePropagation();const scope=scopeFor(root);if(state(scope).branch)show(scope,null);else cards(scope);}},true);
 return {options:scope=>({branch:state(scope).branch,detail:state(scope).detail}),handleClick,handleChange,handleKey,sync};
}
