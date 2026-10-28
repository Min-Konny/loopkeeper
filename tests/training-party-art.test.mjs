import test from'node:test';import assert from'node:assert/strict';
import*as E from'../src/engine.js';import{changeGear}from'../src/gear-state.js';import{memberFor}from'../src/party.js';import{partyArtPlan,partyArtSource}from'../src/party-art.js';import{workScene}from'../src/work-scene.js';import{portraitSource,portraitImage}from'../src/portrait-art.js';
function fixture(){const s=E.createGame();s.meta.bestWave=36;s.run.augments.offer=[];s.run.ownedEquipment=E.RECIPES.filter(r=>r.slot==='weapon').map(r=>r.id);s.run.party={equipment:{},archerTimer:0,archerHits:0};s.run.equipment={};return s;}
test('training active scene and action card use each of the14 actual companion weapons without mutating progress',()=>{
  let count=0;for(const r of E.RECIPES.filter(r=>r.slot==='weapon'&&memberFor(r.id))){const s=fixture(),member=memberFor(r.id),action=member==='archer'?'train_archery':'train_magic',skill=member==='archer'?'archery':'magic';assert(changeGear(s,{type:'equipment',id:r.id},E.RECIPES).ok);const before=E.serializeGame(s),source=partyArtSource(s,member),plan=partyArtPlan(s,member);
    for(const html of[workScene(skill,action,s.run.equipment,s),portraitImage(skill,action,s.run.equipment,true,s),portraitImage(skill,action,s.run.equipment,false,s)]){assert(html.includes('src="'+source+'"'),r.id);assert(html.includes('data-party-art-file="'+plan.file+'"'));assert(html.includes('party-training-target'));assert(!/ width="\d+" height="\d+"/.test(html),'training CSS owns intrinsic sizing');}
    assert.equal(portraitSource(skill,action,s.run.equipment,true,s),source);assert.equal(E.serializeGame(s),before);count++;
  }assert.equal(count,14);
});
test('training distinguishes party equipment from hero gear and follows equip/unequip/reload',()=>{
  const s=fixture();assert(changeGear(s,{type:'equipment',id:'orichalcum_sword'},E.RECIPES).ok);const hero=JSON.stringify(s.run.equipment);
  for(const id of['iron_bow','iron_crossbow','orichalcum_crossbow','silver_bow','orichalcum_bow']){assert(changeGear(s,{type:'equipment',id},E.RECIPES).ok);assert.equal(JSON.stringify(s.run.equipment),hero);const source=partyArtSource(s,'archer');assert(workScene('archery','train_archery',s.run.equipment,s).includes(source));const restored=E.parseSave(E.serializeGame(s));assert(restored);assert(workScene('archery','train_archery',restored.run.equipment,restored).includes(source));}
  delete s.run.party.equipment.archer;assert(workScene('archery','train_archery',s.run.equipment,s).includes('party-archer-v1.png'));assert(!workScene('archery','train_archery',s.run.equipment,s).includes('orichalcum'));
});
test('non-party work/training markup stays identical and legacy callers keep initial artwork',()=>{
  const s=fixture();for(const[skill,id]of[['logging','chop_wood'],['combat','train_combat'],['combat','train_defense'],['combat','train_vitality'],['smithing','smelt_iron'],['cooking','cook_meal']]){
    assert.equal(workScene(skill,id,s.run.equipment,s),workScene(skill,id,s.run.equipment));assert.equal(portraitImage(skill,id,s.run.equipment,true,s),portraitImage(skill,id,s.run.equipment,true));
  }
  assert(workScene('archery','train_archery').includes('party-archer-v1.png'));assert(portraitSource('magic','train_magic').includes('party-mage-v1.png'));
});
