// Exact equipment matches only: unsupported combinations keep the accurate SVG.
export const HERO_BUILDS=Object.freeze([
 {weapon:'iron_bow',armor:null,shield:null,file:'hero-iron-bow-v1.png'},
 {weapon:'iron_crossbow',armor:null,shield:null,file:'hero-iron-crossbow-v1.png'},
 {weapon:'ember_staff',armor:null,shield:null,file:'hero-ember-staff-v1.png'},
 {weapon:'iron_sword',armor:'iron_armor',shield:'iron_shield',file:'hero-iron-guard-v1.png'},
]);
export function generatedHeroSource(equipment={}){
 const weapon=equipment.weapon?.id||null,armor=equipment.armor?.id||null,shield=equipment.shield?.id||null;
 const file=!armor&&!shield&&(!weapon||weapon==='wooden_spear')?'survivor-v1.png':HERO_BUILDS.find(b=>b.weapon===weapon&&b.armor===armor&&b.shield===shield)?.file;
 return file?new URL('../assets/pixel-v2/'+file,import.meta.url).href:null;
}
export function playerVisualKind(equipment={}){
 const id=equipment.weapon?.id||'';
 return id.includes('crossbow')?'crossbow':id.includes('bow')?'bow':id.includes('staff')?'magic':'melee';
}
export function playerPose(kind,pose){return {...pose,step:pose.step*(kind==='crossbow'?.1:kind==='bow'?.15:kind==='magic'?.25:1)};}
