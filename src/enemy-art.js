// Original generated sprites; unknown encounters retain their authored fallback.
const forestChiefSprite=new URL('../assets/pixel-v2/forest-chief-v2.png',import.meta.url).href;
const sprites=Object.freeze(Object.fromEntries(['wolf','raider','knight','giant','boss','winged'].map(id=>[id,new URL(`../assets/pixel-v2/${id}-v1.png`,import.meta.url).href])));
export const BOSS_ART=Object.freeze({
 ironfang_captain:{file:'ironfang-captain-v1.png',kind:'knight'},
 twinblade_raider:{file:'twinblade-raider-v1.png',kind:'raider'},
});
export const REGION_ART=Object.freeze({
 forest:{file:'winged-v1.png',kind:'winged'},forest_depth:{file:'winged-v1.png',kind:'winged'},
 quarry:{file:'giant-v1.png',kind:'giant'},quarry_depth:{file:'giant-v1.png',kind:'giant'},
 marsh:{file:'river-skirmisher-v1.png',kind:'raider'},marsh_depth:{file:'river-skirmisher-v1.png',kind:'raider'},
 citadel:{file:'boss-v1.png',kind:'boss'},river:{file:'river-skirmisher-v1.png',kind:'raider'},
 forge:{file:'forge-sentinel-v1.png',kind:'knight'},observatory:{file:'winged-v1.png',kind:'winged'},
 ice:{file:'ice-giant-v3.png',kind:'giant'},
});
export function generatedEnemySource(kind,{regional=false,forestChief=false,routeId=null,enemyId=null,isBoss=false}={}){
  if(forestChief&&!regional)return forestChiefSprite;
  if(regional){const region=Object.hasOwn(REGION_ART,routeId)?REGION_ART[routeId]:null;return region?new URL('../assets/pixel-v2/'+region.file,import.meta.url).href:null;}
  if(isBoss&&Object.hasOwn(BOSS_ART,enemyId))return new URL('../assets/pixel-v2/'+BOSS_ART[enemyId].file,import.meta.url).href;
  return Object.hasOwn(sprites,kind)?sprites[kind]:null;
}
export function enemyVisualKind(kind,routeId,bossId=null){return routeId?(Object.hasOwn(REGION_ART,routeId)?REGION_ART[routeId].kind:kind):Object.hasOwn(BOSS_ART,bossId)?BOSS_ART[bossId].kind:kind;}
// One shared, aspect-preserving frame. Feet are anchored even for wide weapons.
export function spritePlacement(bounds){
  const scale=Math.min(184/bounds.width,194/bounds.height);
  const width=bounds.width*scale,height=bounds.height*scale;
  return {x:(192-width)/2,y:202-height,width,height};
}
export function enemyPose(kind,pose){
  const weight=kind==='giant'?.58:kind==='boss'?.78:1;
  return {...pose,step:pose.step*weight,recoil:pose.recoil*(kind==='giant'?.55:1)};
}
