// A deliberate backdrop tap closes; dragging or scrolling cannot dismiss a dialog.
export function installDialogDismissal(dialog,{onClose=()=>{}}={}){
 let press=null,ready=false;const clear=()=>{press=null;ready=false;};
 const outside=e=>{const r=dialog.getBoundingClientRect();return e.target===dialog&&(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom);};
 dialog.addEventListener('pointerdown',e=>{clear();if(e.button===0&&e.isPrimary!==false&&outside(e))press={id:e.pointerId,x:e.clientX,y:e.clientY};});
 dialog.addEventListener('pointermove',e=>{if(press&&Math.hypot(e.clientX-press.x,e.clientY-press.y)>8)clear();});
 dialog.addEventListener('pointerup',e=>{const p=press;press=null;ready=!!p&&p.id===e.pointerId&&outside(e)&&Math.hypot(e.clientX-p.x,e.clientY-p.y)<=8;});
 dialog.addEventListener('pointercancel',clear);dialog.addEventListener('wheel',clear,{passive:true});
 dialog.addEventListener('click',e=>{const close=ready&&outside(e);clear();if(close){e.preventDefault();e.stopPropagation();dialog.close();}});
 dialog.addEventListener('close',()=>{clear();onClose();});return {reset:clear};
}
