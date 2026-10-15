// Reparent the existing pane: there is one DOM, one set of controls, one game state.
export function createExpandedPane({document,area,title,extraNodes=[]}){
 const dialog=document.createElement('dialog');dialog.id='expanded-work-dialog';dialog.setAttribute('aria-labelledby','expanded-work-title');
 dialog.innerHTML='<div class="expanded-heading"><h2 id="expanded-work-title"></h2><button type="button" class="button muted" data-expanded-close autofocus aria-label="拡大表示を閉じる">閉じる ×</button></div><div class="expanded-body"></div>';
 document.body.append(dialog);const body=dialog.querySelector('.expanded-body');let saved=null;
 const heading=dialog.querySelector('h2');
 function restore(){
  if(!saved)return;const previous=saved;saved=null;
  for(const entry of previous.nodes){entry.marker.replaceWith(entry.node);}
  document.body.classList.remove('pane-expanded');
  for(const entry of previous.scrolls){entry.node.scrollTop=entry.top;entry.node.scrollLeft=entry.left;}
  if(previous.opener?.isConnected&&!document.querySelector('dialog[open]'))previous.opener.focus({preventScroll:true});
 }
 function close(){if(dialog.open)dialog.close();restore();}
 dialog.addEventListener('close',()=>{if(!dialog.open)restore();});dialog.querySelector('[data-expanded-close]').addEventListener('click',close);
 dialog.addEventListener('keydown',event=>{if(event.key==='Escape'&&!event.isComposing){event.preventDefault();event.stopPropagation();close();}},true);
 return {
  dialog,
  open(opener){
   if(dialog.open)return;
   if(saved)restore();
   const nodes=[area,...extraNodes.filter(Boolean)],scrolls=[document.querySelector('.workspace main'),area,...area.querySelectorAll('#content,[data-scroll-key]')].filter(Boolean).map(node=>({node,top:node.scrollTop,left:node.scrollLeft}));
   saved={opener,scrolls,nodes:nodes.map(node=>{const marker=document.createComment('expanded-pane-position');node.before(marker);return {node,marker};})};
   try{body.append(area);for(const node of extraNodes.filter(Boolean))dialog.append(node);document.body.classList.add('pane-expanded');heading.textContent=title()+' · 拡大';dialog.showModal();dialog.querySelector('[data-expanded-close]').focus();}catch(error){restore();throw error;}
  },
  update(){if(dialog.open)heading.textContent=title()+' · 拡大';},
  close,
 };
}
