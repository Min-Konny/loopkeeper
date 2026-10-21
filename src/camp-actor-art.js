// Original LoopKeeper pixel artwork, drawn in code; no third-party image assets.
export function createCampActorAtlas(){
 const canvas=document.createElement('canvas');canvas.width=32*12;canvas.height=36;const c=canvas.getContext('2d');
 for(let frame=0;frame<12;frame++){const x=frame*32,phase=frame%4,kind=Math.floor(frame/4),step=kind===1?0:[0,2,0,-2][phase],bob=kind===1?0:phase%2;const r=(a,b,w,h,color)=>{c.fillStyle=color;c.fillRect(x+a,b+bob,w,h);};
  r(7,31,18,2,'#293f35');r(11+step,25,4,7,'#343f3d');r(19-step,25,4,7,'#343f3d');r(10+step,31,6,2,'#786247');r(18-step,31,6,2,'#786247');r(10,15,14,12,'#6e8b7c');r(12,16,3,9,'#a9b79b');r(11,26,13,2,'#94704c');r(14,6,9,9,'#d9b78a');r(13,5,11,4,'#6f6545');r(10,9,17,3,'#b49c64');r(21,12,2,2,'#293d35');
  if(kind===1){if(phase<2){r(23,16,4,3,'#d9b78a');r(26,2,2,17,'#b99b67');r(24,2,7,5,'#aebdb1');}else{r(23,21,6,3,'#d9b78a');r(24,22,7,2,'#b99b67');r(29,21,3,7,'#c6d1b6');}}
  else if(kind===2){r(7,18,23,7,'#84613e');r(8,18,21,2,'#ba9864');r(27,18,4,7,'#d4b67c');r(23,23,5,3,'#d9b78a');}
  else{r(24,18+step/2,3,7,'#d9b78a');r(27,20,2,11,'#b99b67');r(25,20,6,4,'#aebdb1');}
 }return canvas;
}
