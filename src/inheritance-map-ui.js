import {syncInheritanceConnections}from './inheritance-map-connections.js?v=0.6.69';
// Keep comparison and allocation in one view. Commands use main's existing stored transactions.
export function createInheritanceMapUI({document,getCategory,setCategory,render}){
 const states=Object.fromEntries(['live','setup'].map(scope=>[scope,{branch:null,stage:null,affordable:false,returnCard:null,pending:null,scroll:0}]));
 const scopeFor=n=>n?.closest?.('[data-inheritance-scope]')?.dataset.inheritanceScope||(n?.closest?.('#death-dialog')?'setup':'live');
 const list=scope=>document.querySelector(scope==='setup'?'#death-dialog .setup-upgrades':'#content');
 function redraw(scope,focus){const s=states[scope];s.scroll=list(scope)?.scrollTop||0;s.pending={focus,top:s.scroll};render();}
 function cards(scope){const s=states[scope],previous=s.returnCard||{category:'combat',top:0};setCategory(scope,previous.category);s.pending={focus:scope==='setup'?'setup-tab-'+previous.category:'legacy-category-'+previous.category,top:previous.top};render();}
 function handleClick(button){const scope=scopeFor(button),s=states[scope];
  if(button.dataset.inheritanceView==='map'){if(getCategory(scope)!=='map')s.returnCard={category:getCategory(scope),top:list(scope)?.scrollTop||0};setCategory(scope,'map');s.pending={focus:scope+'-inheritance-map-tab',top:s.scroll,scrollToFirst:scope==='setup'&&!s.scroll&&document.defaultView.innerHeight<=420};render();return true;}
  if(button.hasAttribute('data-inheritance-cards')){s.scroll=list(scope)?.scrollTop||0;cards(scope);return true;}
  if(button.dataset.inheritanceOpen){s.branch=s.branch===button.dataset.inheritanceOpen?null:button.dataset.inheritanceOpen;s.stage=null;redraw(scope,'map-open-'+button.dataset.inheritanceOpen);return true;}
  if(button.dataset.inheritanceStage){s.branch=button.dataset.inheritanceKey;s.stage=Number(button.dataset.inheritanceStage);redraw(scope,'map-stage-'+s.branch+'-'+s.stage);return true;}
  if(button.hasAttribute('data-inheritance-affordable')){s.affordable=!s.affordable;redraw(scope,'map-affordable-'+scope);return true;}
  if(button.closest('.inheritance-map')&&(button.dataset.buyRank||button.dataset.refundRank||button.dataset.toggleRank)){const key=button.dataset.buyRank||button.dataset.refundRank||button.dataset.toggleRank;if(s.affordable)s.branch=key;s.pending={focus:button.dataset.focus,fallback:'map-open-'+key,top:list(scope)?.scrollTop||0};}
  return false;
 }
 function handleKey(event){if(event.isComposing||event.keyCode===229)return;const tab=event.target.closest?.('[role=tab]'),tabs=tab?.closest('[role=tablist]');if(tabs?.querySelector('[data-inheritance-view]')&&['ArrowLeft','ArrowRight','Home','End'].includes(event.key)){const all=[...tabs.querySelectorAll('[role=tab]')],i=all.indexOf(tab),next=event.key==='Home'?0:event.key==='End'?all.length-1:(i+(event.key==='ArrowRight'?1:-1)+all.length)%all.length;event.preventDefault();event.stopImmediatePropagation();all[next]?.click();return;}
  const root=event.target.closest?.('.inheritance-map');if(root&&event.key==='Escape'){event.preventDefault();event.stopImmediatePropagation();const scope=scopeFor(root),s=states[scope];if(s.branch){const key=s.branch;s.branch=null;s.stage=null;redraw(scope,'map-open-'+key);}else cards(scope);}
 }
 function sync(){syncInheritanceConnections(document);for(const scope of ['live','setup']){const s=states[scope],pending=s.pending;if(!pending)continue;const host=list(scope);if(host)host.scrollTop=pending.top;if(host&&pending.scrollToFirst){const first=host.querySelector('[data-map-branch]');if(first)host.scrollTop+=first.getBoundingClientRect().top-host.getBoundingClientRect().top;}const panel=document.querySelector(scope==='setup'?'#death-dialog':'#content'),nodes=[...(panel?.querySelectorAll('[data-focus],[id]')||[])];let node=nodes.find(n=>n.dataset.focus===pending.focus||n.id===pending.focus);if(!node||node.disabled)node=nodes.find(n=>n.dataset.focus===pending.fallback);node?.focus({preventScroll:true});s.pending=null;}}
 document.addEventListener('keydown',handleKey,true);
 return {options:scope=>({branch:states[scope].branch,stage:states[scope].stage,affordable:states[scope].affordable}),handleClick,handleChange:()=>false,sync};
}
