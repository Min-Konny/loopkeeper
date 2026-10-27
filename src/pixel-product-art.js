import{housingArtFile}from './housing-art.js?v=0.6.85';
import {SPECIALISTS}from './specialist-content.js?v=0.6.85';
import {facilityFrame} from './facility-art.js?v=0.6.85';
import {equipmentMaterial} from './visual-design.js?v=0.6.85';
import {createPixelCampRenderer,PIXEL_FACILITIES} from './pixel-camp-art.js?v=0.6.85';
const r=(x,y,w,h,c)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}"/>`;
const cache=new Map(),failedFacilitySheets=new Set();
const url=svg=>'data:image/svg+xml,'+encodeURIComponent(svg);
const wrap=(art,box='0 0 64 64')=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${box}" width="128" height="128" shape-rendering="crispEdges">${art}</svg>`;
function facilityArt(id,level){
 const parts=[],c={fillStyle:'#000',globalAlpha:1,fillRect(x,y,w,h){parts.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${this.fillStyle}" opacity="${this.globalAlpha}"/>`);}};
 createPixelCampRenderer({getContext:()=>c})(0,{facilities:{[id]:level},portraitFacility:id});
 const [x,y]=PIXEL_FACILITIES[id];
 return wrap(parts.join(''),id==='workshop'?'282 72 132 132':`${x-43} ${y-76} 86 90`);
}
const housingFallbacks=new Map();
function housingFallbackSvg(level){
  let a=r(5,55,54,4,'#40594d')+r(12,29,40,25,'#b7a27b')+r(12,30,3,24,'#655345')+r(49,30,3,24,'#655345');
  for(let y=0;y<6;y++)a+=r(7+y*3,26-y*3,50-y*6,3,y%2?'#795d48':'#96734e');
  a+=r(28,37,10,17,'#39433c')+r(30,39,6,15,'#6f5842')+r(34,45,2,2,'#ddc175')+r(17,35,8,8,'#4b605c')+r(18,36,5,5,'#e5c77d')+r(40,35,6,8,'#4b605c')+r(41,36,4,5,'#e5c77d');
  for(let n=1;n<level;n++)a+=r(13+n*8,49,4,3,'#d8ba78');
  a+=r(43,9,5,13,'#706a5f')+r(42,8,7,3,'#8d8673');return wrap(a);
}
export function housingFallbackSource(level=1){const n=Math.max(1,Math.min(5,Math.floor(Number(level)||1)));if(!housingFallbacks.has(n))housingFallbacks.set(n,url(housingFallbackSvg(n)));return housingFallbacks.get(n);}
export function pixelProductSource(recipe){
 const id=recipe.id||'',facility=recipe.facility?.id||recipe.facilityId||recipe.endlessFacility,level=recipe.facility?.level||recipe.level||(recipe.endlessFacility?5:1);
 const specialist=SPECIALISTS.find(f=>f.id===facility);if(specialist)return './assets/pixel-v2/'+specialist.image;
 if(facility==='housing'){const file='./assets/pixel-v2/'+housingArtFile(level);return failedFacilitySheets.has(file)?housingFallbackSource(level):file;}
 const key=[id,facility,level,recipe.slot||recipe.equipment?.slot,recipe.kind].join(':');
 if(cache.has(key))return cache.get(key);
 let svg;
 if(facility==='training_yard')svg=wrap(r(9,48,46,6,'#68796b')+r(18,22,5,26,'#a67d4e')+r(10,27,23,5,'#cbb98c')+r(15,14,11,12,'#cbb98c')+r(38,22,5,26,'#a67d4e')+r(31,27,20,5,'#cbb98c')+r(35,14,11,12,'#cbb98c'));

 else if(PIXEL_FACILITIES[facility])svg=facilityArt(facility,level);
 else{
  const m=equipmentMaterial({id}),metal=m.metal,shade=m.cloth,light=m.glow,gold='#d5b578',wood='#a67d4e',dark='#304b42';
  const slot=recipe.slot||recipe.equipment?.slot;let a=r(9,56,46,3,'#182c26');
  if(id==='cook_meal'||/^mix_/.test(id)){
   const liquid=id==='cook_meal'?'#c96672':id==='mix_spark'?'#e3ae64':'#9a8ace';
   a+=r(25,7,14,7,'#a98558')+r(27,14,10,10,'#adcec3')+r(21,24,22,6,'#adcec3')+r(15,30,34,23,'#75978b')+r(19,35,26,16,liquid)+r(21,51,22,5,'#55796c')+r(19,31,3,14,'#d1e5c8')+r(25,38,14,9,'#e1d3a5')+r(30,35,4,15,liquid)+r(25,40,14,4,liquid);
  }else if(/crossbow/.test(id)){
   a+=r(30,15,6,40,wood)+r(13,24,39,5,metal)+r(10,19,5,8,metal)+r(49,19,5,8,metal)+r(13,20,39,1,gold)+r(32,8,2,35,light)+r(29,7,8,4,metal)+r(26,41,14,3,gold);
  }else if(/bow/.test(id)){
   for(let i=0;i<5;i++){a+=r(22+i*3,10+i*5,4,7,metal)+r(34-i*3,34+i*5,4,7,metal);}
   a+=r(21,10,1,45,gold)+r(12,31,39,2,wood)+r(48,29,6,6,metal)+r(32,29,5,10,wood);
  }else if(/staff/.test(id)){
   a+=r(30,23,4,33,wood)+r(25,13,14,13,gold)+r(28,9,8,18,metal)+r(27,15,10,7,light)+r(30,11,3,6,'#f3e8bd')+r(29,32,6,3,gold);
  }else if(slot==='weapon'){
   const spear=/spear/.test(id);a+=r(30,spear?20:36,4,spear?36:18,wood)+r(28,52,8,4,gold);
   a+=r(spear?29:27,13,spear?6:10,spear?15:24,metal)+r(30,7,4,6,metal)+r(29,17,2,spear?9:17,light);
   if(!spear)a+=r(21,36,22,4,gold)+r(23,39,3,3,wood)+r(38,39,3,3,wood);
  }else if(slot==='armor'){
   a+=r(19,17,26,36,metal)+r(11,19,8,17,metal)+r(45,19,8,17,metal)+r(24,14,16,5,metal)+r(27,14,10,8,dark)+r(21,23,3,23,light)+r(38,23,5,23,shade)+r(25,28,15,2,shade)+r(25,34,15,2,shade)+r(20,45,24,4,wood)+r(29,44,6,6,gold)+r(19,52,26,3,shade);
  }else if(slot==='shield'){
   a+=r(15,13,34,30,gold)+r(19,43,26,7,gold)+r(24,50,16,5,gold)+r(29,55,6,3,gold)+r(18,16,28,24,metal)+r(22,40,20,7,metal)+r(27,47,10,5,metal)+r(30,18,4,31,shade)+r(20,29,24,4,shade)+r(28,27,8,8,gold)+r(19,17,2,20,light);
  }else if(slot==='tool'){
   a+=r(19,20,4,35,wood)+r(14,14,21,11,metal)+r(15,15,17,2,light)+r(39,29,4,27,wood)+r(34,23,17,10,metal)+r(47,24,5,14,metal)+r(35,24,13,2,light)+r(26,45,8,10,shade);
  }else if(/ring|bracelet/.test(id)){
   const b=id.includes('bracelet'),x=b?13:19,w=b?38:26;
   a+=r(x,26,w,6,gold)+r(x,32,6,15,gold)+r(x+w-6,32,6,15,gold)+r(x+5,47,w-10,6,gold)+r(x+7,29,w-14,3,'#f0d8a0')+r(26,18,12,12,shade)+r(29,15,6,17,light);
  }else if(/boots/.test(id)){
   a+=r(20,12,20,33,shade)+r(20,44,29,10,shade)+r(17,53,35,4,wood)+r(22,15,16,3,gold);for(let i=0;i<4;i++)a+=r(23,23+i*5,12,2,gold);
  }else if(/pendant/.test(id)){
   a+=r(15,10,3,22,gold)+r(46,10,3,22,gold)+r(18,31,6,6,gold)+r(40,31,6,6,gold)+r(24,36,16,3,gold)+r(23,41,18,12,gold)+r(27,38,10,20,gold)+r(27,43,10,8,shade)+r(30,42,4,6,light);
  }else if(recipe.kind==='alchemy'||id==='cook_meal'){
   a+=r(27,10,10,12,gold)+r(25,17,14,10,'#bfd5bd')+r(18,27,28,23,'#8ba99b')+r(21,50,22,5,'#8ba99b')+r(21,34,22,16,id.includes('spark')?'#d8a965':'#91c4a6')+r(21,28,3,13,'#e4e7c5');
  }else if(/smelt|coal|ingot/.test(id)){
   for(let i=0;i<3;i++){const x=12+i%2*22,y=43-Math.floor(i/2)*17;a+=r(x,y,22,10,metal)+r(x+3,y-4,17,4,light)+r(x+1,y+7,21,3,shade);}
  }else{
   a+=r(12,30,40,5,'#d6c699')+r(15,35,34,12,'#899b80')+r(21,47,22,5,'#687d67')+r(17,29,30,3,'#b18a51')+r(22,27,7,3,'#a6be7e')+r(36,27,6,3,'#d9b66f')+r(24,16,2,8,'#a5b6a1')+r(37,12,2,11,'#a5b6a1');
  }
  svg=wrap(a);
 }
 const result=url(svg);if(cache.size>=192)cache.delete(cache.keys().next().value);cache.set(key,result);return result;
}
export function pixelFacilityProduct(recipe){const id=recipe.facility?.id||recipe.facilityId||recipe.endlessFacility,level=recipe.facility?.level||recipe.level||(recipe.endlessFacility?5:1),f=facilityFrame(id,level);if(!f||failedFacilitySheets.has(f.src)){const src=pixelProductSource(recipe),tag=id==='housing'?' data-facility-level="'+level+'" '+(src.startsWith('data:')?'data-housing-fallback':'data-housing-art'+(level===2?' style="transform:scale(1.18);transform-origin:50% 70%"':'')):'';return '<div class="facility-product" aria-hidden="true"><img'+tag+' src="'+src+'" width="128" height="128" alt=""></div>';} const b=f.frame,z=.9/Math.max(b.width,b.height),clip=[b.y/f.sheet.height*100,(f.sheet.width-b.x-b.width)/f.sheet.width*100,(f.sheet.height-b.y-b.height)/f.sheet.height*100,b.x/f.sheet.width*100].map(v=>v+'%').join(' ');return '<div class="facility-product" aria-hidden="true"><span class="facility-atlas-frame"><img data-facility-sheet data-facility-id="'+id+'" data-facility-level="'+level+'" src="'+f.src+'" style="width:'+(f.sheet.width*z*100)+'%;height:'+(f.sheet.height*z*100)+'%;left:'+((.5-b.width*z/2-b.x*z)*100)+'%;top:'+((.95-b.height*z-b.y*z)*100)+'%;clip-path:inset('+clip+')" alt="" decoding="async"></span></div>';}
if(typeof document!=='undefined')document.addEventListener('error',event=>{const img=event.target;if(img?.hasAttribute?.('data-housing-art')){failedFacilitySheets.add(img.getAttribute('src'));img.removeAttribute('data-housing-art');img.removeAttribute('style');img.setAttribute('data-housing-fallback','');img.src=housingFallbackSource(Number(img.dataset.facilityLevel));return;}if(!img?.hasAttribute?.('data-facility-sheet'))return;failedFacilitySheets.add(img.getAttribute('src'));img.removeAttribute('data-facility-sheet');img.setAttribute('data-facility-fallback','');img.src=pixelProductSource({id:img.dataset.facilityId,facilityId:img.dataset.facilityId,level:Number(img.dataset.facilityLevel)});},true);
