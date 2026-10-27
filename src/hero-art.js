import{outfitHeroSource}from './hero-outfit-art.js?v=0.6.86';
import {HERO_LAYOUT} from './hero-atlas-layout.js?v=0.6.86';
import {spritePlacement} from './enemy-art.js?v=0.6.86';
// Exact authored builds plus a common generated body for every other equipment combination.
export const HERO_BUILDS=Object.freeze([
 {weapon:'iron_bow',armor:null,shield:null,file:'hero-iron-bow-v1.png'},
 {weapon:'iron_crossbow',armor:null,shield:null,file:'hero-iron-crossbow-v1.png'},
 {weapon:'ember_staff',armor:null,shield:null,file:'hero-ember-staff-v1.png'},
 {weapon:'iron_sword',armor:'iron_armor',shield:'iron_shield',file:'hero-iron-guard-v1.png'},
]);
const common=new URL('../assets/pixel-v2/hero-common-v2.png',import.meta.url).href;
const families=['sword','spear','bow','crossbow','magic','unarmed'],familyImages=new Map();let atlasStarted=false;
export function heroFamily(equipment={}){const id=equipment.weapon?.id||'';return !id?'unarmed':id.includes('crossbow')?'crossbow':id.includes('bow')?'bow':id.includes('staff')?'magic':id.includes('spear')?'spear':'sword';}
function primeHeroAtlas(){if(atlasStarted||typeof Image==='undefined')return;atlasStarted=true;const img=new Image();img.onload=()=>{try{const cw=img.width/3,ch=img.height/2;for(const[kind,n]of families.map((k,i)=>[k,i])){const c=document.createElement('canvas');c.width=192;c.height=208;const ctx=c.getContext('2d');ctx.imageSmoothingEnabled=false;const b=HERO_LAYOUT.frames[n],p=spritePlacement(b);ctx.drawImage(img,b.x,b.y,b.width,b.height,p.x,p.y,p.width,p.height);familyImages.set(kind,c.toDataURL());}}catch{/* Common original sprite remains available. */}};img.src=new URL('../assets/pixel-v2/hero-families-v2-sheet.png',import.meta.url).href;}
export function generatedHeroSource(equipment={}){
 primeHeroAtlas();const weapon=equipment.weapon?.id||null,armor=equipment.armor?.id||null,shield=equipment.shield?.id||null;
 const exact=HERO_BUILDS.find(b=>b.weapon===weapon&&b.armor===armor&&b.shield===shield);
 const outfit=outfitHeroSource(equipment,heroFamily(equipment));if(outfit)return outfit;
 return exact?new URL('../assets/pixel-v2/'+exact.file,import.meta.url).href:familyImages.get(heroFamily(equipment))||common;
}
export function playerVisualKind(equipment={}){
 const id=equipment.weapon?.id||'';
 return id.includes('crossbow')?'crossbow':id.includes('bow')?'bow':id.includes('staff')?'magic':'melee';
}
export function playerPose(kind,pose){return {...pose,step:pose.step*(kind==='crossbow'?.1:kind==='bow'?.15:kind==='magic'?.25:1)};}
