import{alphaBounds}from './generated-camp-art.js?v=0.6.111';
import{createPortraitFrame}from './portrait-frame.js?v=0.6.111';
const families=['sword','spear','bow','crossbow','magic','unarmed'];
export const WOOD_ARMOR_REGIONS=Object.freeze([
 [[0,0],[512,0],[512,512],[0,512]],
 [[512,0],[1120,0],[1120,190],[1088,190],[1088,512],[512,512]],
 [[1120,0],[1536,0],[1536,512],[1088,512],[1088,190],[1120,190]],
 [[0,512],[512,512],[512,1024],[0,1024]],
 [[512,512],[1024,512],[1024,1024],[512,1024]],
 [[1024,512],[1536,512],[1536,1024],[1024,1024]]
]);
export const STEEL_ARMOR_REGIONS=Object.freeze([
 [[0,0],[512,0],[512,512],[0,512]],
 [[512,0],[1120,0],[1120,190],[1080,190],[1080,512],[512,512]],
 [[1120,0],[1536,0],[1536,512],[1080,512],[1080,190],[1120,190]],
 [[0,512],[544,512],[544,1024],[0,1024]],
 [[544,512],[1024,512],[1024,1024],[544,1024]],
 [[1024,512],[1536,512],[1536,1024],[1024,1024]]
]);
export const SILVER_ARMOR_REGIONS=Object.freeze([
 [[0,0],[512,0],[512,512],[0,512]],
 [[512,0],[1120,0],[1120,190],[1064,190],[1064,512],[512,512]],
 [[1120,0],[1536,0],[1536,512],[1064,512],[1064,190],[1120,190]],
 [[0,512],[544,512],[544,1024],[0,1024]],
 [[544,512],[1024,512],[1024,1024],[544,1024]],
 [[1024,512],[1536,512],[1536,1024],[1024,1024]]
]);
export const MITHRIL_ARMOR_REGIONS=Object.freeze([
 [[0,0],[512,0],[512,512],[0,512]],
 [[512,0],[1120,0],[1120,190],[1064,190],[1064,512],[512,512]],
 [[1120,0],[1536,0],[1536,512],[1064,512],[1064,190],[1120,190]],
 [[0,512],[544,512],[544,1024],[0,1024]],
 [[544,512],[1024,512],[1024,1024],[544,1024]],
 [[1024,512],[1536,512],[1536,1024],[1024,1024]]
]);
export const CRYSTAL_ARMOR_REGIONS=Object.freeze([
 [[0,0],[512,0],[512,512],[0,512]],
 [[512,0],[1120,0],[1120,190],[1064,190],[1064,512],[512,512]],
 [[1120,0],[1536,0],[1536,512],[1064,512],[1064,190],[1120,190]],
 [[0,512],[544,512],[544,1024],[0,1024]],
 [[544,512],[1024,512],[1024,1024],[544,1024]],
 [[1024,512],[1536,512],[1536,1024],[1024,1024]]
]);
const armorStyles=Object.freeze({wooden_armor:'wood',iron_armor:'iron',steel_armor:'steel',silver_armor:'silver',mithril_armor:'mithril',diamond_armor:'crystal'}),shieldStyles=Object.freeze({wooden_shield:'wood',iron_shield:'iron',steel_shield:'steel',silver_shield:'silver',mithril_shield:'mithril',diamond_shield:'crystal'});
const bodySheets=Object.freeze({wood:{file:'hero-wooden-armor-v1-sheet.png',regions:WOOD_ARMOR_REGIONS},steel:{file:'hero-steel-armor-v1-sheet.png',regions:STEEL_ARMOR_REGIONS},silver:{file:'hero-silver-armor-v1-sheet.png',regions:SILVER_ARMOR_REGIONS},mithril:{file:'hero-mithril-armor-v1-sheet.png',regions:MITHRIL_ARMOR_REGIONS},crystal:{file:'hero-crystal-armor-v1-sheet.png',regions:CRYSTAL_ARMOR_REGIONS}});
const commonShieldPack={file:'hero-shield-layers-v1.png',columns:2,rows:2,keys:['wood:front','wood:back','iron:front','iron:back']};
const shieldPacks=Object.freeze({wood:commonShieldPack,iron:commonShieldPack,steel:{file:'hero-steel-shield-v1-sheet.png',columns:2,rows:1,keys:['steel:front','steel:back']},silver:{file:'hero-silver-shield-v1-sheet.png',columns:2,rows:1,keys:['silver:front','silver:back']},mithril:{file:'hero-mithril-shield-v1-sheet.png',columns:2,rows:1,keys:['mithril:front','mithril:back']},crystal:{file:'hero-crystal-shield-v1-sheet.png',columns:2,rows:1,keys:['crystal:front','crystal:back']}});
// Existing baked iron outfits retain their original selection path.
export function heroLayerPlan(equipment={},family='sword'){
 if(!families.includes(family))return null;
 const armor=equipment.armor?.id,shield=equipment.shield?.id;
 const body=Object.hasOwn(armorStyles,armor)?armorStyles[armor]:'family',layer=Object.hasOwn(shieldStyles,shield)?shieldStyles[shield]:null;
 if(!Object.hasOwn(bodySheets,body)&&!(layer&&layer!=='iron')&&!(body==='iron'&&shield&&shield!=='iron_shield'))return null;
 return{body,shield:layer,behind:['spear','bow','crossbow'].includes(family)};
}
export function shieldPlacement(family,bounds,aspect,body='family',shield='wood'){
 const positions={sword:[.72,.38],magic:[.08,.35],unarmed:[.70,.22],spear:[.20,.20],bow:[.10,.25],crossbow:[.12,.18]};
 const back=['spear','bow','crossbow'].includes(family),[x,y]=positions[family]||positions.sword,height=bounds.height*(back?.45:shield==='steel'?.37:.40),width=height*aspect;
 let left=bounds.x+bounds.width*x;
 if(back)left=(body==='iron'?{spear:30,bow:30,crossbow:26}:{spear:30,bow:22,crossbow:15})[family];
 else if(body==='iron'&&family==='sword')left=bounds.x+bounds.width*.51;
 else if(body==='iron'&&family==='magic')left=bounds.x;
 return{x:Math.max(0,Math.min(192-width,left)),y:Math.max(0,Math.min(208-height,bounds.y+bounds.height*y)),width,height};
}
const root=new URL('../assets/pixel-v2/',import.meta.url),bodyFrames=new Map(),shields=new Map(),bodyImages=new Map(),composites=new Map(),bodyStarted=new Set(),shieldStarted=new Set();
function primeBody(style){const sheet=bodySheets[style];if(!sheet||bodyStarted.has(style)||typeof Image==='undefined')return;bodyStarted.add(style);const img=new Image();img.onload=()=>{try{const ready=new Map();for(const[n,polygon]of sheet.regions.entries()){const xs=polygon.map(p=>p[0]),ys=polygon.map(p=>p[1]),x=Math.min(...xs),y=Math.min(...ys),c=document.createElement('canvas');c.width=Math.max(...xs)-x;c.height=Math.max(...ys)-y;const ctx=c.getContext('2d');ctx.imageSmoothingEnabled=false;ctx.beginPath();polygon.forEach(([xx,yy],i)=>ctx[i?'lineTo':'moveTo'](xx-x,yy-y));ctx.closePath();ctx.clip();ctx.drawImage(img,-x,-y);const b=alphaBounds(c);if(b.width<=0||b.height<=0)throw Error('Empty armor frame');const out=createPortraitFrame(c);ready.set(style+':'+families[n],out.toDataURL());}for(const[k,v]of ready)bodyFrames.set(k,v);}catch{/* Keep current generated family body. */}};img.onerror=()=>{};img.src=new URL(sheet.file,root).href;}
function primeShields(style){const pack=shieldPacks[style];if(!pack||shieldStarted.has(pack.file)||typeof Image==='undefined')return;shieldStarted.add(pack.file);const img=new Image();img.onload=()=>{try{const ready=new Map();for(let n=0;n<pack.keys.length;n++){const x=Math.round(n%pack.columns*img.width/pack.columns),y=Math.round(Math.floor(n/pack.columns)*img.height/pack.rows),right=Math.round((n%pack.columns+1)*img.width/pack.columns),bottom=Math.round((Math.floor(n/pack.columns)+1)*img.height/pack.rows),b=alphaBounds(img,x,y,right-x,bottom-y);if(b.width<=0||b.height<=0)throw Error('Empty shield layer');ready.set(pack.keys[n],{img,x:x+b.x,y:y+b.y,width:b.width,height:b.height});}for(const[k,v]of ready)shields.set(k,v);}catch{/* Body remains usable when an overlay cannot load. */}};img.onerror=()=>{};img.src=new URL(pack.file,root).href;}
function bodyFrame(source){if(!bodyImages.has(source)&&typeof Image!=='undefined'){const record={frame:null};bodyImages.set(source,record);const img=new Image();img.onload=()=>{try{record.frame=createPortraitFrame(img);}catch{/* Keep source body. */}};img.onerror=()=>{};img.src=source;}return bodyImages.get(source)?.frame;}
export function layeredHeroSource(equipment,family,familySource,ironSource){
 const plan=heroLayerPlan(equipment,family);if(!plan)return null;
 let source=familySource;if(Object.hasOwn(bodySheets,plan.body)){primeBody(plan.body);source=bodyFrames.get(plan.body+':'+family)||familySource;}else if(plan.body==='iron')source=ironSource(family)||familySource;
 if(!plan.shield)return source;
 primeShields(plan.shield);const layer=shields.get(plan.shield+':'+(plan.behind?'back':'front')),body=bodyFrame(source);if(!layer||!body)return source;
 const key=plan.body+':'+family+':'+plan.shield,old=composites.get(key);if(old?.source===source)return old.result;
 try{const c=document.createElement('canvas');c.width=192;c.height=208;const ctx=c.getContext('2d'),b=alphaBounds(body),p=shieldPlacement(family,b,layer.width/layer.height,plan.body,plan.shield);ctx.imageSmoothingEnabled=false;const paintShield=()=>ctx.drawImage(layer.img,layer.x,layer.y,layer.width,layer.height,p.x,p.y,p.width,p.height);if(plan.behind)paintShield();ctx.drawImage(body,0,0);if(!plan.behind)paintShield();const result=c.toDataURL();composites.set(key,{source,result});return result;}catch{return source;}
}
