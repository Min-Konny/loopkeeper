import {text as sceneText,subscribeLocale} from './i18n.js?v=0.6.140';
// Independent transparent sprites over a clean plate; no pixels sampled from the landscape.
import { residentRoutes, riverRoute, backTrees, alongPath, isRiverPixel } from './village-layout.js?v=0.6.140';
const W = 1672, H = 941;
const backgroundURL = new URL('../assets/village/background-v1.png', import.meta.url).href;
const spritesURL = new URL('../assets/village/sprites-v1.png', import.meta.url).href;
const river = [[0,510],[135,510],[262,554],[285,606],[376,624],[478,650],[540,682],[640,704],[739,722],[820,752],[917,782],[1000,816],[1080,840],[1080,876],[1001,915],[899,920],[805,890],[727,859],[660,828],[580,798],[511,769],[460,737],[405,711],[333,689],[259,667],[191,641],[116,613],[60,600],[0,595]];
function polygon(ctx, points) {ctx.beginPath(); points.forEach(([x,y], i) => i ? ctx.lineTo(x,y) : ctx.moveTo(x,y));ctx.closePath();}

export function mountVillageScene(host) {
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  canvas.className = 'village-canvas';
  canvas.setAttribute('role','img');
  canvas.setAttribute('aria-label',sceneText('village.scene'));
  const unsubscribeLocale=subscribeLocale(()=>canvas.setAttribute('aria-label',sceneText('village.scene')));
  host.append(canvas);
  const ctx = canvas.getContext('2d');
  const waterLayer=document.createElement('canvas');waterLayer.width=W;waterLayer.height=H;
  const waterCtx=waterLayer.getContext('2d');
  const waterMask=document.createElement('canvas');waterMask.width=W;waterMask.height=H;
  const background = new Image(), atlas = new Image();
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let ready = false, destroyed = false, active = false, visible = false, raf = 0, last = 0, t = 0;
  const bounds = [];
  function prepareWaterMask() {
    const m=waterMask.getContext('2d',{willReadFrequently:true});
    m.drawImage(background,0,0,W,H);
    const pixels=m.getImageData(0,0,W,H),original=new Uint8ClampedArray(pixels.data);
    // A 3px dry margin protects bank edges and bridge piers, including anti-aliased pixels.
    for(let y=0;y<H;y++)for(let x=0;x<W;x++) {
      const i=(y*W+x)*4;
      let wet=y>=510 && y<925 && x<1090;
      if(wet)for(const [dx,dy] of [[0,0],[-3,0],[3,0],[0,-3],[0,3]]) {
        const nx=x+dx,ny=y+dy,j=(ny*W+nx)*4;
        if(nx<0||nx>=W||ny<0||ny>=H||!isRiverPixel(original[j],original[j+1],original[j+2])) {wet=false;break;}
      }
      pixels.data[i]=pixels.data[i+1]=pixels.data[i+2]=255;pixels.data[i+3]=wet?255:0;
    }
    m.putImageData(pixels,0,0);
  }
  // Trim transparent margins once. Coordinates remain local to each atlas cell.
  function prepareAtlas() {
    const scratch = document.createElement('canvas'); scratch.width = atlas.naturalWidth; scratch.height = atlas.naturalHeight;
    const s = scratch.getContext('2d',{willReadFrequently:true}); s.drawImage(atlas,0,0);
    const cw = scratch.width / 4, ch = scratch.height / 4;
    for(let i=0;i<16;i++) {
      const sx = (i%4)*cw, sy = Math.floor(i/4)*ch;
      const pixels = s.getImageData(sx,sy,cw,ch).data;
      let left=cw, top=ch, right=0, bottom=0;
      for(let y=0;y<ch;y++) for(let x=0;x<cw;x++) if(pixels[(y*cw+x)*4+3]>100) {
        left=Math.min(left,x);top=Math.min(top,y);right=Math.max(right,x);bottom=Math.max(bottom,y);
      }
      bounds.push(right>left ? [sx+left,sy+top,right-left+1,bottom-top+1] : [sx,sy,cw,ch]);
    }
    scratch.width = scratch.height = 0;
  }
  function sprite(id,x,y,w,h,{angle=0,flip=false,alpha=1}={}) {
    ctx.save();ctx.translate(Math.round(x),Math.round(y));ctx.rotate(angle);ctx.scale(flip?-1:1,1);ctx.globalAlpha=alpha;
    ctx.drawImage(atlas,...bounds[id],-w/2,-h,w,h);ctx.restore();
  }
  function water() {
    waterCtx.clearRect(0,0,W,H);
    waterCtx.save(); polygon(waterCtx,river);waterCtx.clip();
    // Small downstream streaks, never deforming banks, bridges or buildings.
    for(let i=0;i<100;i++) {
      const p=((i*0.103+t*0.025)%1), [x,y]=alongPath(riverRoute,p);
      waterCtx.fillStyle=i%3?'#558e9d':'#a4c4c0';waterCtx.globalAlpha=.12+(i%5)*.035;
      waterCtx.fillRect(x,y+Math.sin(i*4.7)*14,5+i%13,2);
    }
    waterCtx.restore();
    waterCtx.globalCompositeOperation='destination-in';waterCtx.drawImage(waterMask,0,0);waterCtx.globalCompositeOperation='source-over';
    ctx.drawImage(waterLayer,0,0);
    // Narrow channels traced inside the dry cascade beds; even foam stays clipped.
    for(const points of [ [[174,338],[190,340],[182,365],[191,384],[170,391],[161,374]], [[163,447],[181,450],[173,474],[181,492],[161,505],[150,496],[160,470]] ]) {
      const xs=points.map(p=>p[0]),ys=points.map(p=>p[1]);
      const x=Math.min(...xs),y=Math.min(...ys),w=Math.max(...xs)-x,h=Math.max(...ys)-y;
      ctx.save();polygon(ctx,points);ctx.clip();
      ctx.fillStyle='#4c8296';ctx.globalAlpha=.3;ctx.fillRect(x,y,w,h);
      for(let i=0;i<18;i++) {ctx.globalAlpha=.12+(i%4)*.09;ctx.fillStyle=i%3?'#a9d2d4':'#e1eece';ctx.fillRect(x+(i*11)%w,y+((i*19+t*65)%h),1+i%2,7+i%13);}
      ctx.fillStyle='#b5d8d1';ctx.globalAlpha=.4;
      for(let i=0;i<5;i++) ctx.fillRect(x+i*6,y+h-3+Math.sin(t*3+i),4,2);
      ctx.restore();
    }
  }
  function draw() {
    if(!ready||destroyed)return;
    ctx.clearRect(0,0,W,H);ctx.imageSmoothingEnabled=true;ctx.drawImage(background,0,0,W,H);
    water();
    sprite(12,1020+Math.sin(t*.025)*170,80,370,75,{alpha:.3});
    sprite(12,340+Math.sin(t*.02+2)*130,105,280,50,{alpha:.2});
    // Back vegetation, rooted independently from the terrain.
    for(const [i,x,y,w,h] of backTrees)
      sprite(4,x,y,w,h,{angle:Math.sin(t*1.15+i)*.018});
    // Waterwheel: rotate in its own plane, then project to the mill's side wall.
    ctx.save();ctx.translate(314,525);ctx.scale(.66,1);ctx.rotate(t*.45);
    ctx.drawImage(atlas,...bounds[8],-68,-68,136,136);ctx.restore();
    for(const [x,y,phase] of [[1110,282,0],[1430,300,2]]) sprite(10,x,y,20+Math.sin(t*9+phase)*2,31+Math.sin(t*7+phase)*4);
    // Banner's pole remains fixed, cloth is displaced in narrow strips.
    for(const [x,y] of [[1035,390],[1549,290]]) {
      const [sx,sy,sw,sh]=bounds[9],w=33,h=73;
      ctx.drawImage(atlas,sx,sy,sw*.2,sh,x-w/2,y-h,w*.2,h);
      for(let j=0;j<8;j++) {const u=.2+j*.1;ctx.drawImage(atlas,sx+sw*u,sy,sw*.1,sh,x-w/2+w*u,y-h+Math.sin(t*3-j*.5)*u*4,w*.1+.5,h);}
    }
    // Two populated plots, one meadow for sheep; fences remain visible.
    for(let row=0;row<4;row++) for(let col=0;col<10;col++) {
      const x=1240+col*20+row*18, y=505+row*12-col*2.3;
      sprite(6,x,y,28,32,{angle:Math.sin(t*2+row*.6+col*.3)*.045});
    }
    for(let row=0;row<3;row++) for(let col=0;col<9;col++) sprite(6,1408+col*21+row*16,559+row*13-col*2,27,30,{angle:Math.sin(t*1.8+col*.4)*.04});
    for(const [i,x,y] of [[0,1190,609],[1,1250,628],[2,1302,609]]) {
      const phase=(t+i*2)%12, walk=phase<4;
      sprite(walk? (Math.floor(t*3+i)%2?13:2):3,x+Math.sin(t*.25+i)*12,y,43,33,{flip:i===1});
    }
    // Path-following residents. Feet alternate while walking, rest at each end.
    residentRoutes.forEach((route,i)=>{
      const p=(t/(22+i*3)+i*.23)%1, f=p<.5?p*2:2-p*2;
      const moving=Math.max(0,Math.min(1,(f-.08)/.84));
      const [x,y]=alongPath(route,moving);
      const [nextX]=alongPath(route,Math.min(1,moving+.01));
      const faceLeft=p<.5?nextX<x:nextX>=x;
      sprite(i===3?14:(moving>0&&moving<1?Math.floor(t*5)%2:0),x,y,29,48,{flip:faceLeft});
    });
    for(const [x,y] of [[386,345],[671,438]]) for(let j=0;j<4;j++) {
      const life=(t*.18+j*.25)%1;
      sprite(11,x+life*20+Math.sin(life*5)*7,y-life*98,20+life*35,28+life*40,{alpha:(1-life)*.28});
    }
    for(const [x,y] of [[557,447],[624,554]]) {
      sprite(10,x,y,18,25+Math.sin(t*8)*3);
      const glow=ctx.createRadialGradient(x,y-10,2,x,y-10,29);glow.addColorStop(0,'#ffb84c40');glow.addColorStop(1,'#ffb84c00');
      ctx.fillStyle=glow;ctx.fillRect(x-30,y-40,60,60);
    }
    sprite(15,1018,431,13,23,{angle:Math.sin(t*1.6)*.06});
    // Front plants mask sprite feet naturally, without touching any road pixels.
    for(const [i,x,y,w,h] of [[0,67,730,190,235],[1,1519,862,220,260],[2,1205,850,140,170],[3,365,902,180,220]]) sprite(4,x,y,w,h,{angle:Math.sin(t*1.1+i)*.014});
    for(const [i,x,y] of [[0,440,660],[1,1020,708],[2,1410,742],[3,580,910],[4,183,823],[5,1163,423]]) sprite(5,x,y,65,40,{angle:Math.sin(t*1.4+i)*.025});
    [[100,790],[230,800],[300,850],[430,902],[543,895],[675,925],[1120,770],[1260,794],[1370,843],[1510,925],[1600,780],[1010,724],[458,632],[1090,455]].forEach(([x,y],i)=>sprite(7,x,y,27,20,{angle:Math.sin(t*2+i)*.06}));
    host.dataset.frame=String(Math.round(t*30));
  }
  function running(){return ready&&!destroyed&&active&&visible&&!document.hidden&&!reduced.matches&&host.isConnected;}
  function tick(now){raf=0;if(!running()){last=0;return;}if(!last||now-last>=1000/30){t+=last?Math.min((now-last)/1000,.1):0;last=now;draw();}raf=requestAnimationFrame(tick);}
  function sync(){if(destroyed)return;if(running()){if(!raf)raf=requestAnimationFrame(tick);}else{cancelAnimationFrame(raf);raf=0;last=0;}host.dataset.animated=String(running());}
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync();});observer.observe(host);
  document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);
  Promise.all([new Promise((resolve,reject)=>{background.onload=resolve;background.onerror=reject;background.src=backgroundURL;}),new Promise((resolve,reject)=>{atlas.onload=resolve;atlas.onerror=reject;atlas.src=spritesURL;})]).then(()=>{
    if(destroyed)return;prepareAtlas();prepareWaterMask();ready=true;host.dataset.loaded='true';draw();sync();
  }).catch(()=>{if(!destroyed){host.dataset.loaded='error';if(background.complete&&background.naturalWidth)ctx.drawImage(background,0,0,W,H);}});
  return {setActive(value){active=Boolean(value);sync();},destroy(){unsubscribeLocale();destroyed=true;cancelAnimationFrame(raf);observer.disconnect();document.removeEventListener('visibilitychange',sync);reduced.removeEventListener('change',sync);background.onload=background.onerror=atlas.onload=atlas.onerror=null;canvas.remove();}};
}
