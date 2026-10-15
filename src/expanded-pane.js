// Reparent the existing pane: there is one DOM, one set of controls, one game state.
export function createExpandedPane({document,area,title,extraNodes=[],sideNodes=[]}){
 const dialog=document.createElement('dialog');dialog.id='expanded-work-dialog';dialog.setAttribute('aria-labelledby','expanded-work-title');
 dialog.innerHTML='<div class="expanded-heading"><h2 id="expanded-work-title"></h2><button type="button" class="button muted" data-info="queue" data-focus="expanded-queue-open">予約</button><button type="button" class="button muted" data-command="settings-menu" data-focus="expanded-settings-open">設定</button><button type="button" class="button muted" data-command="header-menu" data-focus="expanded-menu-open">メニュー</button><button type="button" class="button muted" data-expanded-close autofocus aria-label="拡大表示を閉じる">閉じる ×</button></div><div class="expanded-body"></div>';
 document.body.append(dialog);const body=dialog.querySelector('.expanded-body');let saved=null,backdropPress=null,backdropClick=false;
 const heading=dialog.querySelector('h2');
 function restore(){
  if(!saved)return;const previous=saved;saved=null;
  for(const entry of previous.nodes){entry.marker.replaceWith(entry.node);}
  document.body.classList.remove('pane-expanded');
  for(const entry of previous.scrolls){entry.node.scrollTop=entry.top;entry.node.scrollLeft=entry.left;}
  const focusKey=previous.opener?.dataset?.focus;
  const target=previous.opener?.isConnected?previous.opener:focusKey?[...document.querySelectorAll('[data-focus]')].find(node=>node.dataset.focus===focusKey):null;
  if(target&&!document.querySelector('dialog[open]'))target.focus({preventScroll:true});
 }
 function clearBackdropPress(){backdropPress=null;backdropClick=false;}
 function outside(event){const rect=dialog.getBoundingClientRect();return event.target===dialog&&(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom);}
 function close(){clearBackdropPress();if(dialog.open)dialog.close();restore();}
 // Both ends must be on the backdrop. Cancel movement so a drag/scroll is not a dismissal.
 dialog.addEventListener('pointerdown',event=>{clearBackdropPress();if(event.button===0&&event.isPrimary!==false&&outside(event))backdropPress={id:event.pointerId,x:event.clientX,y:event.clientY};});
 dialog.addEventListener('pointermove',event=>{if(backdropPress&&event.pointerId===backdropPress.id&&Math.hypot(event.clientX-backdropPress.x,event.clientY-backdropPress.y)>8)clearBackdropPress();});
 dialog.addEventListener('pointerup',event=>{const press=backdropPress;backdropPress=null;backdropClick=!!press&&press.id===event.pointerId&&event.button===0&&outside(event)&&Math.hypot(event.clientX-press.x,event.clientY-press.y)<=8;});
 dialog.addEventListener('pointercancel',clearBackdropPress);
 dialog.addEventListener('wheel',clearBackdropPress,{passive:true});
 dialog.addEventListener('click',event=>{const dismiss=backdropClick&&outside(event);clearBackdropPress();if(dismiss){event.preventDefault();event.stopPropagation();close();}});
 dialog.addEventListener('close',()=>{if(!dialog.open)restore();});dialog.querySelector('[data-expanded-close]').addEventListener('click',close);
 dialog.addEventListener('keydown',event=>{if(event.key==='Escape'&&!event.isComposing){event.preventDefault();event.stopPropagation();close();}},true);
 return {
  dialog,
  getOpener:()=>saved?.opener,
  setOpener(opener){if(saved)saved.opener=opener;},
  open(opener){
   if(dialog.open)return;
   clearBackdropPress();
   if(saved)restore();
   const nodes=[area,...sideNodes.filter(Boolean),...extraNodes.filter(Boolean)],scrolls=[document.querySelector('.workspace main'),area,...area.querySelectorAll('#content,[data-scroll-key]')].filter(Boolean).map(node=>({node,top:node.scrollTop,left:node.scrollLeft}));
   saved={opener,scrolls,nodes:nodes.map(node=>{const marker=document.createComment('expanded-pane-position');node.before(marker);return {node,marker};})};
   try{body.append(area);for(const node of sideNodes.filter(Boolean))body.append(node);for(const node of extraNodes.filter(Boolean))dialog.append(node);document.body.classList.add('pane-expanded');heading.textContent=title()+' · 拡大';dialog.showModal();dialog.querySelector('[data-expanded-close]').focus();}catch(error){restore();throw error;}
  },
  update(){if(dialog.open)heading.textContent=title()+' · 拡大';},
  close,
 };
}
