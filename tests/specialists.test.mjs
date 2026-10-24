import {resourceCap} from '../src/farm-content.js';
import {getActionYields} from '../src/mvp-engine.js';
import test from 'node:test';import assert from 'node:assert/strict';
import * as E from '../src/engine.js';
import {SPECIALISTS,SPECIALIST_AUGMENTS,specialistAug} from '../src/specialist-content.js';
import {memberStats} from '../src/party.js';import {fireballPower,manaRegeneration} from '../src/magic-state.js';
import {mealEffects,consumeFood,potionCapacity} from '../src/meals.js';
import {outpostRate,advanceOutposts,allocatePopulation} from '../src/settlement.js';
import {preparationChannelDuration} from '../src/preparation-balance.js';
function fixture(){const s=E.createGame({preparationBalancePrototype:true});s.meta.bestWave=18;s.run.wave=6;s.run.nextWaveAt=10000;return s;}
const recipe=id=>E.RECIPES.find(x=>x.id===id)||E.ACTIONS.find(x=>x.id===id);
const save=s=>{const p=E.parseSave(E.serializeGame(s));assert.ok(p,'save valid');return p;};
const near=(a,b)=>assert.ok(Math.abs(a-b)<.002,`${a} != ${b}`);
test('five specialist facilities have three ordered stages, unlock progressively and reset on rebirth',()=>{
 for(const f of SPECIALISTS){const s=fixture();for(const id in s.run.resources)s.run.resources[id]=Math.min(10000,resourceCap(id));s.run.skills.smithing.xp=10000;
 assert.equal(E.canStartAction(s,f.id+'_level_2').ok,false);
 for(let n=1;n<=3;n++){const id=f.id+(n===1?'':'_level_'+n);assert.ok(E.startAction(s,id).ok,id);s.settings.paused=false;for(let i=0;i<400&&s.run.activeAction;i++)E.advanceTime(s,.25);assert.equal(s.run.facilities[f.id],n);save(s);}
 E.abandonRun(s);E.confirmRun(s);assert.equal(s.run.facilities[f.id],undefined);save(s);
 }const s=E.createGame();for(const f of SPECIALISTS)assert.equal(E.isKnown(s,f.id),false);
});
test('specialist speed targets only its own skill and paid work duration survives reload',()=>{
 for(const [f,id]of SPECIALISTS.map(f=>[f,({cooking:'cook_simple',alchemy:'cook_meal',commerce:'repair_work',archery:'train_archery',sorcery:'train_magic'})[f.skill]])){
 const s=fixture(),d=recipe(id),base=E.getActionDuration(s,d),other=E.getActionDuration(s,'chop_wood');for(let n=1;n<=3;n++){s.run.facilities[f.id]=n;near(E.getActionDuration(s,d),base/(1+.2*n));assert.equal(E.getActionDuration(s,'chop_wood'),other);} }
 const s=fixture();s.run.resources.herbs=30;s.run.resources.wood=30;assert.ok(E.startAction(s,'cook_simple').ok);E.advanceTime(s,.25);const duration=s.run.activeAction.duration;s.run.facilities.kitchen=3;assert.equal(save(s).run.activeAction.duration,duration);
});
test('kitchen speeds automatic cooking but never turns automatic food into potions',()=>{
 const s=fixture(),d=recipe('cook_meal'),base=preparationChannelDuration(s,d,'auto_cook',10,1);s.run.facilities.kitchen=3;near(preparationChannelDuration(s,d,'auto_cook',10,1),base/1.6);assert.deepEqual(getActionYields(s,d,'auto_cook'),{food:3});
});
test('facility augments are dormant until built; food strength and potion capacity stay separate',()=>{
 const s=fixture();s.run.augments.selected=['camp_cuisine','measured_doses'];s.run.mealEffect={id:'fish_meal',remaining:90};assert.equal(mealEffects(s).attack,.1);const heal=E.getFoodHealing(s),cap=potionCapacity(s);s.run.facilities.kitchen=1;s.run.facilities.laboratory=1;near(mealEffects(s).attack,.15);assert.ok(E.getFoodHealing(s)>heal);assert.equal(potionCapacity(s),cap);const base=E.getActionDuration(s,'cook_meal');s.run.augments.selected=[];near(base,E.getActionDuration(s,'cook_meal')*1.15);s.run.augments.selected=['camp_cuisine'];s.run.mealEffect.id='egg_meal';near(mealEffects(s).haste,.2);save(s);
});
test('commerce commissions add to paid repairs without multiplying other income',()=>{
 const s=fixture();s.run.augments.selected=['steady_commissions','paid_repairs'];assert.equal(E.getActionYields(s,'repair_work').gold,3);s.run.facilities.workhouse=1;assert.equal(E.getActionYields(s,'repair_work').gold,4);assert.deepEqual(E.getActionYields(s,'chop_wood'),{wood:2});
});
test('archery and mana augments apply the described gains and tradeoffs independently',()=>{
 const s=fixture(),bow=memberStats(s,'archer'),spell=fireballPower(s),mana=manaRegeneration(s);s.run.augments.selected=['heavy_arrows','mana_cycle'];near(memberStats(s,'archer').attack,bow.attack*1.25);near(memberStats(s,'archer').interval,bow.interval*1.15);near(fireballPower(s),spell*.9);near(manaRegeneration(s),mana+.5);
 s.run.augments.selected=['archer_drill','arcane_curriculum'];near(memberStats(s,'archer').attack,bow.attack);near(fireballPower(s),spell);s.run.facilities.archery_range=1;s.run.facilities.arcane_study=1;near(memberStats(s,'archer').attack,bow.attack*1.1);near(fireballPower(s),spell*1.1);save(s);
});
test('settled outposts require housing and staff; production preserves fractional progress through save',()=>{
 const s=fixture();s.run.facilities.outpost_forest=1;s.run.routes.cleared.push('forest');s.meta.routeClears.push('forest');s.run.augments.selected=['settled_outposts'];near(outpostRate(s,'forest'),3);s.run.facilities.housing=1;near(outpostRate(s,'forest'),3.75);const wood=s.run.resources.wood;advanceOutposts(s,16);assert.equal(s.run.resources.wood,wood);assert.ok(allocatePopulation(s,'outpost_forest',1).ok);advanceOutposts(s,8);const p=save(s);advanceOutposts(s,8);advanceOutposts(p,8);assert.equal(s.run.resources.wood,wood+1);assert.equal(s.run.resources.wood,p.run.resources.wood);
});
test('new augment catalog is gated by later waves and existing paid packs',()=>{
 assert.equal(SPECIALIST_AUGMENTS.length,8);for(const a of SPECIALIST_AUGMENTS){assert.ok(a.unlockBestWave>=6);assert.ok(['economy_augments','fortress_augments','martial_augments'].includes(a.pack));assert.ok(a.description);}
 const s=fixture();for(const a of SPECIALIST_AUGMENTS){s.run.augments.selected=[a.id];save(s);}
});
