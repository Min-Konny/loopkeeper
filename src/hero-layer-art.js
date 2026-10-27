import{alphaBounds}from './generated-camp-art.js?v=0.6.107';
import{createPortraitFrame}from './portrait-frame.js?v=0.6.107';
const families=['sword','spear','bow','crossbow','magic','unarmed'];
export const WOOD_ARMOR_REGIONS=Object.freeze([
 [[0,0],[512,0],[512,512],[0,512]],
 [[512,0],[1120,0],[1120,190],[1088,190],[1088,512],[512,512]],
 [[1120,0],[1536,0],[1536,512],[1088,512],[1088,190],[1120,190]],
 [[0,512],[512,512],[512,1024],[0,1024]],
 [[512,512],[1024,512],[1024,1024],[512,1024]],
 [[1024,512],[1536,512],[1536,1024],[1024,1024]]
]);
// Existing baked iron outfits retain their original selection path.
export function heroLayerPlan(equipment={},family='sword'){
 if(!families.includes(family))return null;
 const armor=equipment.armor?.id,shield=equipment.shield?.id;
 const body=armor==='wooden_armor'?'wood':armor==='iron_armor'?'iron':'family';
 if(body!=='wood'&&shield!=='wooden_shield'&&!(body==='iron'&&shield&&shield!=='iron_shield'))return null;
 return{body,shield:shield==='wooden_shield'?'wood':shield==='iron_shield'?'iron':null,behind:['spear','bow','crossbow'].includes(family)};
}
export function shieldPlacement(family,bounds,aspect,body='family'){
 const positions={sword:[.72,.38],magic:[.08,.35],unarmed:[.70,.22],spear:[.20,.20],bow:[.10,.25],crossbow:[.12,.18]};
 const back=['spear','bow','crossbow'].includes(family),[x,y]=positions[family]||positions.sword,height=bounds.height*(back?.45:.40),width=height*aspect;
 let left=bounds.x+bounds.width*x;
 if(back)left=(body==='iron'?{spear:30,bow:30,crossbow:26}:{spear:30,bow:22,crossbow:15})[family];
 else if(body==='iron'&&family==='sword')left=bounds.x+bounds.width*.51;
 else if(body==='iron'&&family==='magic')left=bounds.x;
 return{x:Math.max(0,Math.min(192-width,left)),y:Math.max(0,Math.min(208-height,bounds.y+bounds.height*y)),width,height};
}
const root=new URL('../assets/pixel-v2/',import.meta.url),woodFrames=new Map(),shields=new Map(),bodyImages=new Map(),composites=new Map();let woodStarted=false,shieldsStarted=false;
function primeWood(){if(woodStarted||typeof Image==='undefined')return;woodStarted=true;const img=new Image();img.onload=()=>{try{const ready=new Map();for(const[n,polygon]of WOOD_ARMOR_REGIONS.entries()){const xs=polygon.map(p=>p[0]),ys=polygon.map(p=>p[1]),x=Math.min(...xs),y=Math.min(...ys),c=document.createElement('canvas');c.width=Math.max(...xs)-x;c.height=Math.max(...ys)-y;const ctx=c.getContext('2d');ctx.imageSmoothingEnabled=false;ctx.beginPath();polygon.forEach(([xx,yy],i)=>ctx[i?'lineTo':'moveTo'](xx-x,yy-y));ctx.closePath();ctx.clip();ctx.drawImage(img,-x,-y);const b=alphaBounds(c);if(b.width<=0||b.height<=0)throw Error('Empty wooden armor frame');const out=createPortraitFrame(c);ready.set(families[n],out.toDataURL());}for(const[k,v]of ready)woodFrames.set(k,v);}catch{/* Keep current generated family body. */}};img.onerror=()=>{};img.src=new URL('hero-wooden-armor-v1-sheet.png',root).href;}
function primeShields(){if(shieldsStarted||typeof Image==='undefined')return;shieldsStarted=true;const img=new Image();img.onload=()=>{try{const ready=new Map();for(let n=0;n<4;n++){const x=Math.round(n%2*img.width/2),y=Math.round(Math.floor(n/2)*img.height/2),right=Math.round((n%2+1)*img.width/2),bottom=Math.round((Math.floor(n/2)+1)*img.height/2),b=alphaBounds(img,x,y,right-x,bottom-y);if(b.width<=0||b.height<=0)throw Error('Empty shield layer');ready.set(['wood:front','wood:back','iron:front','iron:back'][n],{img,x:x+b.x,y:y+b.y,width:b.width,height:b.height});}for(const[k,v]of ready)shields.set(k,v);}catch{/* Body remains usable when an overlay cannot load. */}};img.onerror=()=>{};img.src=new URL('hero-shield-layers-v1.png',root).href;}
function bodyFrame(source){if(!bodyImages.has(source)&&typeof Image!=='undefined'){const record={frame:null};bodyImages.set(source,record);const img=new Image();img.onload=()=>{try{record.frame=createPortraitFrame(img);}catch{/* Keep source body. */}};img.onerror=()=>{};img.src=source;}return bodyImages.get(source)?.frame;}
export function layeredHeroSource(equipment,family,familySource,ironSource){
 const plan=heroLayerPlan(equipment,family);if(!plan)return null;
 let source=familySource;if(plan.body==='wood'){primeWood();source=woodFrames.get(family)||familySource;}else if(plan.body==='iron')source=ironSource(family)||familySource;
 if(!plan.shield)return source;
 primeShields();const layer=shields.get(plan.shield+':'+(plan.behind?'back':'front')),body=bodyFrame(source);if(!layer||!body)return source;
 const key=plan.body+':'+family+':'+plan.shield,old=composites.get(key);if(old?.source===source)return old.result;
 try{const c=document.createElement('canvas');c.width=192;c.height=208;const ctx=c.getContext('2d'),b=alphaBounds(body),p=shieldPlacement(family,b,layer.width/layer.height,plan.body);ctx.imageSmoothingEnabled=false;const paintShield=()=>ctx.drawImage(layer.img,layer.x,layer.y,layer.width,layer.height,p.x,p.y,p.width,p.height);if(plan.behind)paintShield();ctx.drawImage(body,0,0);if(!plan.behind)paintShield();const result=c.toDataURL();composites.set(key,{source,result});return result;}catch{return source;}
}
