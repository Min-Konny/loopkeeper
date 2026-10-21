import { createPixelCampRenderer } from './pixel-camp-art.js?v=0.6.53';

const mounted = new WeakMap();
/** Decorative view only: never reads or writes a save or advances the simulation. */
export function mountPixelCamp(host, { full = false } = {}) {
 if(mounted.has(host))return mounted.get(host);
 const layer=document.createElement('div');layer.className='pixel-camp-layer';layer.setAttribute('aria-hidden','true');
 const canvas=document.createElement('canvas');canvas.width=480;canvas.height=240;layer.append(canvas);host.prepend(layer);
 host.classList.add('has-pixel-camp');if(full)host.classList.add('pixel-camp-full');
 const paint=createPixelCampRenderer(canvas),reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let model={facilities:{}},active=false,visible=false,raf=0,time=0,last=0,dirty=true;
 function render(){paint(time,model);dirty=false;}
 function running(){return active&&visible&&!document.hidden&&!reduced.matches&&host.isConnected;}
 function tick(now){
  raf=0;if(!running()){last=0;return;}
  if(!last||now-last>=80){time+=last?Math.min(.15,(now-last)/1000):0;last=now;render();}
  raf=requestAnimationFrame(tick);
 }
 function sync(){
  if(dirty)render();
  if(running()){if(!raf)raf=requestAnimationFrame(tick);}
  else{cancelAnimationFrame(raf);raf=0;last=0;}
 }
 function change(key,value){if(JSON.stringify(model[key])===JSON.stringify(value))return;model[key]=value;dirty=true;sync();}
 const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync();});observer.observe(host);
 document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);
 const api={
  setActive(value){active=Boolean(value);sync();},
  setSettlement(facilities){change('facilities',{...facilities});},
  setConstruction(id,progress){change('construction',id?{id,progress:Math.round(progress*100)/100}:null);},
  setThreat(progress){change('threat',Math.round(progress*20)/20);},
  setWork(id){change('chopping',Boolean(id&&/wood|chop|fell|logging/i.test(id)));},
  setNight(value){change('night',Boolean(value));},
  destroy(){cancelAnimationFrame(raf);observer.disconnect();document.removeEventListener('visibilitychange',sync);reduced.removeEventListener('change',sync);layer.remove();mounted.delete(host);},
 };
 mounted.set(host,api);render();return api;
}
