// Native display palette over the existing blade only. Original PNGs, alpha,
// pose, equipment stats and all pixels outside the calibrated blade stay intact.
export const SWORD_BLADE_REGIONS=Object.freeze({
 family:[[88,85],[177,52],[181,52],[176,59],[91,95]],
 wood:[[87,87],[183,53],[188,53],[183,59],[91,98]],
 iron:[[121,107],[184,79],[188,79],[184,84],[125,116]],
 steel:[[78,91],[184,55],[189,55],[184,61],[82,101]],
 silver:[[77,91],[185,55],[189,55],[184,61],[82,101]],
 mithril:[[78,91],[184,55],[189,55],[184,61],[83,101]],
 crystal:[[77,93],[184,56],[189,56],[185,62],[83,105]],
 orichalcum:[[78,94],[184,58],[189,58],[184,64],[83,105]],
 leather:[[79,95],[185,58],[189,58],[185,64],[84,106]],
 iron_guard:[[60,94],[184,66],[189,66],[184,71],[63,103]],
 iron_shield:[[77,87],[174,63],[179,63],[174,69],[81,98]],
});
const materials=Object.freeze({steel_sword:'steel',silver_sword:'silver',mithril_sword:'mithril',diamond_sword:'crystal',orichalcum_sword:'orichalcum'});
export const swordMaterialKey=(equipment={},family='sword')=>family==='sword'&&Object.hasOwn(materials,equipment.weapon?.id)?materials[equipment.weapon.id]:null;
export function insideBlade(x,y,polygon){let inside=false;for(let i=0,j=polygon.length-1;i<polygon.length;j=i++){const[a,b]=polygon[i],[c,d]=polygon[j];if((b>y)!==(d>y)&&x<(c-a)*(y-b)/(d-b)+a)inside=!inside;}return inside;}
const palettes=Object.freeze({
 steel:[[31,44,61],[68,89,112],[112,137,160],[171,196,214],[218,234,244],[250,254,255]],
 silver:[[40,33,58],[85,74,108],[135,123,159],[189,177,213],[231,220,247],[255,249,255]],
 mithril:[[22,46,44],[41,90,85],[68,143,134],[112,197,185],[174,235,220],[231,255,245]],
 crystal:[[27,31,65],[61,65,117],[104,113,173],[156,171,226],[206,216,255],[245,247,255]],
 orichalcum:[[38,28,18],[88,58,29],[146,98,42],[201,151,68],[239,203,120],[255,242,192]],
});
export function shadeSwordPixels(data,width,height,frame,material){
 const polygon=SWORD_BLADE_REGIONS[frame],palette=Object.hasOwn(palettes,material)?palettes[material]:null;if(!palette||!polygon||width!==192||height!==208)return 0;
 let changed=0;for(let y=0;y<height;y++)for(let x=0;x<width;x++){
  if(!insideBlade(x+.5,y+.5,polygon))continue;const i=(y*width+x)*4,r=data[i],g=data[i+1],b=data[i+2],a=data[i+3],hi=Math.max(r,g,b),lo=Math.min(r,g,b);
  // Keep the dark outline, transparent fringe and warm grip/skin/gold fittings.
  if(!a||hi<45||hi-lo>75||b<r*.82||g<r*.82)continue;
  const value=Math.max(0,Math.min(5,(r*.2126+g*.7152+b*.0722)/255*5)),n=Math.min(4,Math.floor(value)),t=value-n;
  for(let c=0;c<3;c++)data[i+c]=Math.round(palette[n][c]*(1-t)+palette[n+1][c]*t);changed++;
 }return changed;
}
const sources=new Map();
export function swordMaterialSource(equipment,source,frame='family',family='sword'){
 const material=swordMaterialKey(equipment,family);if(!material||!SWORD_BLADE_REGIONS[frame]||!source?.startsWith('data:image/png')||typeof Image==='undefined'||typeof document==='undefined')return source;
 let variants=sources.get(source);if(!variants){variants=new Map();sources.set(source,variants);}const key=frame+':'+material;
 if(!variants.has(key)){
  const record={result:source};variants.set(key,record);const img=new Image();
  img.onload=()=>{try{if(img.naturalWidth!==192||img.naturalHeight!==208)return;const canvas=document.createElement('canvas');canvas.width=192;canvas.height=208;const c=canvas.getContext('2d');if(!c)return;c.drawImage(img,0,0);const pixels=c.getImageData(0,0,192,208);if(shadeSwordPixels(pixels.data,192,208,frame,material)<5)return;c.putImageData(pixels,0,0);record.result=canvas.toDataURL();}catch{/* The original body is the permanent safe fallback. */}};
  img.onerror=()=>{};img.src=source;
 }return variants.get(key).result;
}
