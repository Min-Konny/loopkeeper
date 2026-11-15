import { createTitleNature } from './title-nature.js?v=0.6.140';
export function mountTitleArtwork(root, getPreferences) {
 let active=true, motion=true, frameId=0;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const canvas = root.querySelector('canvas');
  canvas.width = 1280; canvas.height = 720;
  const ctx = canvas.getContext('2d');
  const background = root.querySelector('img');
  // Regions traced against the supplied 1672 × 941 artwork, in original pixels.
  const region = points => points.map(([x,y]) => [x * 1280 / 1672, y * 720 / 941]);
  const cloak = region([[845,607],[875,610],[850,660],[826,709],[800,768],[778,752],[754,747],[754,716],[731,701],[707,714],[719,686],[760,670],[807,650],[830,622]]);
  const fire = region([[994,783],[990,748],[1008,723],[1012,696],[1023,730],[1033,735],[1045,765],[1037,787]]);
  const nature = createTitleNature(background);
  let lastDraw = -Infinity;
  function enabled() { return motion && !reduced.matches && getPreferences().effectsEnabled !== false; }
  function backgroundReady() { return background.complete && background.naturalWidth > 0; }
  // Displacement is reserved for the fabric and flame, never the water.
  function ripple(points, t, strength, vertical = false) {
    ctx.save(); ctx.beginPath();
    points.forEach(([x,y],i) => i ? ctx.lineTo(x,y) : ctx.moveTo(x,y));
    ctx.closePath(); ctx.clip();
    const minY = Math.floor(Math.min(...points.map(p=>p[1])));
    const maxY = Math.ceil(Math.max(...points.map(p=>p[1])));
    const minX = Math.floor(Math.min(...points.map(p=>p[0]))) - 4;
    const width = Math.ceil(Math.max(...points.map(p=>p[0]))) - minX + 4;
    for(let y=minY; y<maxY; y+=2) {
      const edge = Math.sin(Math.PI * (y-minY) / Math.max(1,maxY-minY));
      const dx = Math.sin(y*.075-t*2.2)*strength*edge;
      const sourceY = Math.min(717.5,Math.max(0,y+(vertical ? Math.sin(t*2-y*.04)*2*edge : 0)));
      ctx.drawImage(background, minX*background.naturalWidth/1280, sourceY*background.naturalHeight/720,
        width*background.naturalWidth/1280, 2.5*background.naturalHeight/720, minX+dx, y, width, 2.5);
    }
    ctx.restore();
  }
  function draw(now) {
    if (!active || document.hidden || !enabled() || !backgroundReady()) { frameId=0; ctx?.clearRect(0,0,1280,720); return; }
    // Keep the atmosphere light enough to leave running on a title screen.
    if (now-lastDraw < 1000/30) { frameId=requestAnimationFrame(draw); return; }
    lastDraw=now;
    const t = now/1000;
    ctx.clearRect(0,0,1280,720);
    if (background.complete && background.naturalWidth) {
      nature.draw(ctx,t);
      ripple(cloak,t,1.6);
      ripple(fire,t*3.2,2.4,true);
    }
    // Pixel-sized embers and a warm halo; no large screen-space glow or camera shake.
    const fireX=780, fireY=594;
    const glow=ctx.createRadialGradient(fireX,fireY,2,fireX,fireY,72);
    glow.addColorStop(0,`rgba(255,142,40,${.13+Math.sin(t*4)*.025})`);
    glow.addColorStop(1,'rgba(255,100,20,0)');
    ctx.fillStyle=glow;ctx.fillRect(fireX-72,fireY-72,144,144);
    for(let i=0;i<18;i++) {
      const phase=(t*(.19+(i%4)*.023)+i*.173)%1;
      const x=fireX+Math.sin(i*2.7+phase*4)*14+phase*9;
      const y=fireY-12-phase*82;
      ctx.globalAlpha=(1-phase)*.8;
      ctx.fillStyle=i%3?'#ffc569':'#fff0b2';
      ctx.fillRect(Math.round(x/2)*2,Math.round(y/2)*2,2,i%3?2:4);
    }
    ctx.globalAlpha=1;
    const lamp=ctx.createRadialGradient(493,219,3,493,219,41);
    lamp.addColorStop(0,`rgba(255,190,75,${.08+Math.sin(t*2.7)*.018})`);
    lamp.addColorStop(1,'rgba(255,180,65,0)');
    ctx.fillStyle=lamp;ctx.fillRect(452,178,82,82);
    frameId=requestAnimationFrame(draw);
  }
  function sync() {
    cancelAnimationFrame(frameId);frameId=0;ctx?.clearRect(0,0,1280,720);
    if(active&&ctx&&!document.hidden&&enabled()&&backgroundReady())frameId=requestAnimationFrame(draw);
  }
  background.addEventListener('load',sync);background.addEventListener('error',sync);
  document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);sync();
  return {sync,destroy(){active=false;cancelAnimationFrame(frameId);nature.dispose();background.removeEventListener('load',sync);background.removeEventListener('error',sync);document.removeEventListener('visibilitychange',sync);reduced.removeEventListener('change',sync);}};
}
