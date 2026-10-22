// Original generated sprites; special encounters keep their existing authored art.
const sprites=Object.freeze(Object.fromEntries(['wolf','raider','knight','giant','boss'].map(id=>[id,new URL(`../assets/pixel-v2/${id}-v1.png`,import.meta.url).href])));
export function generatedEnemySource(kind,{regional=false,forestChief=false}={}){
  return regional||forestChief?null:sprites[kind]||null;
}
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
