import{alphaBounds}from './generated-camp-art.js?v=0.6.106';
import{spritePlacement}from './enemy-art.js?v=0.6.106';
// The animated scene and motion-free portrait use exactly the same visible bounds.
export function createPortraitFrame(image){
 const b=alphaBounds(image,0,0,image.naturalWidth||image.width,image.naturalHeight||image.height);if(b.width<=0||b.height<=0)throw Error('Empty portrait');
 const canvas=image.ownerDocument?.createElement('canvas')||document.createElement('canvas');canvas.width=192;canvas.height=208;
 const c=canvas.getContext('2d'),p=spritePlacement(b);if(!c)throw Error('Portrait canvas unavailable');
 c.imageSmoothingEnabled=false;c.drawImage(image,b.x,b.y,b.width,b.height,p.x,p.y,p.width,p.height);return canvas;
}
const records=new WeakMap();
export function frameStaticPortrait(image,generated){
 if(!image?.ownerDocument?.createElement||!image.parentElement)return;
 let record=records.get(image);if(!record){record={source:null,canvas:null};records.set(image,record);}
 const source=image.getAttribute('src');
 if(!generated){image.onload=null;record.source=null;if(record.canvas)record.canvas.hidden=true;image.classList.remove('portrait-frame-source');return;}
 if(record.source===source)return;
 record.source=null;if(record.canvas)record.canvas.hidden=true;image.classList.remove('portrait-frame-source');
 image.onload=()=>{if(image.getAttribute('src')!==source)return;try{const frame=createPortraitFrame(image);if(record.canvas)record.canvas.replaceWith(frame);else image.parentElement.append(frame);frame.className='static-portrait-frame';frame.setAttribute('aria-hidden','true');record.canvas=frame;record.source=source;image.classList.add('portrait-frame-source');}catch{/* Keep the original image usable when framing is unavailable. */}};
 if(image.complete&&image.naturalWidth>0)image.onload();
}
