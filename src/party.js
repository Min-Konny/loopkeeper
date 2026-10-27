import {specialistAug}from './specialist-content.js?v=0.6.88';
import {getSkillProgress} from './legacy-engine.js?v=0.6.88';
import {weaponById} from './gear-content.js?v=0.6.88';
export const PARTY=[{id:'archer',name:'弓使い',wave:3,image:'party-archer-v1.png',action:'train_archery'},{id:'mage',name:'魔法使い',wave:6,image:'party-mage-v1.png',action:'train_magic'}];
export const memberFor=id=>{const type=weaponById(id)?.combat?.type;return type==='magic'?'mage':['bow','crossbow'].includes(type)?'archer':null;};
export const memberJoined=(s,id)=>s.version===2&&s.meta.bestWave>=(PARTY.find(x=>x.id===id)?.wave??Infinity);
export const partyRequirement=d=>d.partyMember||memberFor(d.id);
export function initializeParty(s,recipes=[]){
 if(s.version!==2)return;
 if(!s.run.party){
  s.run.party={equipment:{},archerTimer:0,archerHits:0};
  // Preserve earned weapons, assigning the strongest owned bow/staff to its owner.
  for(const id of s.run.ownedEquipment||[]){const who=memberFor(id),d=weaponById(id),old=weaponById(s.run.party.equipment[who]);if(who&&memberJoined(s,who)&&(!old||d.tier>old.tier||d.tier===old.tier&&d.stats.attack>old.stats.attack))s.run.party.equipment[who]=id;}
  const old=s.run.equipment.weapon;if(old&&memberFor(old.id)&&memberJoined(s,memberFor(old.id))){s.run.party.equipment[memberFor(old.id)]=old.id;delete s.run.equipment.weapon;const melee=recipes.filter(d=>d.slot==='weapon'&&!memberFor(d.id)&&s.run.ownedEquipment?.includes(d.id)).sort((a,b)=>(b.equipment?.attack||0)-(a.equipment?.attack||0))[0];if(melee)s.run.equipment.weapon={id:melee.id,...melee.equipment};}
 }
 s.run.training??={defense:0,vitality:0};s.run.training.archer??=0;s.run.training.mage??=0;
}
export function equipParty(s,d){const who=memberFor(d.id);if(!who)return false;initializeParty(s);if(memberJoined(s,who))s.run.party.equipment[who]=d.id;return true;}
export const partyWeapon=(s,id)=>weaponById(s.run.party?.equipment?.[id]);
export function memberStats(s,id){
 const level=getSkillProgress(s.run.skills[id==='archer'?'archery':'sorcery']?.xp||0).level,w=partyWeapon(s,id);
 const permanent=getSkillProgress(s.meta.skills[id==='archer'?'archery':'sorcery']?.xp||0,true).level;
 if(id==='archer')return {level,attack:(8+(level-1)*2+(permanent-1)*.35+(w?.stats.attack||0))*(specialistAug(s,'heavy_arrows')?1.25:1)*(specialistAug(s,'archer_drill')?1.1:1),interval:1.5/(w?.combat.rate||1.25)*(specialistAug(s,'heavy_arrows')?1.15:1),pierce:w?.combat.pierce||0,weapon:w};
 return {level,attack:(18+(level-1)*3+(permanent-1)*.5)*(specialistAug(s,"arcane_curriculum")?1.1:1)*(specialistAug(s,"mana_cycle")?.9:1),interval:4,weapon:w};
}
export function advanceArcher(s,dt,damage){
 if(!memberJoined(s,'archer'))return;initializeParty(s);const p=s.run.party,b=memberStats(s,'archer');p.archerTimer=Math.min(4,p.archerTimer+dt);
 if(p.archerTimer+1e-8<b.interval)return;p.archerTimer=Math.max(0,p.archerTimer-b.interval);p.archerHits++;
 damage(b.attack*(s.run.enemy.trait==='flying'?1.35:1),b.pierce);
 const markEvery=b.weapon?(b.weapon.combat.markEvery||0):3;
 if(markEvery&&p.archerHits%markEvery===0)s.run.enemy.defense=Math.max((s.run.enemy.baseDefense??s.run.enemy.defense)*.7,s.run.enemy.defense-2);
}
export function validParty(s){
 const p=s.run.party;if(p===undefined)return true;
 if(!p||typeof p!=='object'||!p.equipment||typeof p.equipment!=='object'||Array.isArray(p.equipment)||!Number.isFinite(p.archerTimer)||p.archerTimer<0||p.archerTimer>4||!Number.isSafeInteger(p.archerHits)||p.archerHits<0)return false;
 return Object.entries(p.equipment).every(([who,id])=>memberJoined(s,who)&&memberFor(id)===who&&s.run.ownedEquipment?.includes(id))&&['archer','mage'].every(w=>s.run.training?.[w]===undefined||Number.isFinite(s.run.training[w])&&s.run.training[w]>=0&&s.run.training[w]<=1e9);
}
