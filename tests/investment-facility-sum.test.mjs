import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as E from '../src/engine.js';
import {CONTENT as C} from '../src/content.js';

function ready(sum){
 const s=E.createGame({earlyLoopPrototype:true,lateLoopPrototype:true,preparationBalancePrototype:true});
 s.meta.bestWave=36;s.run.augments.offer=[];s.run.augments.selected=['investment'];
 s.run.nextWaveAt=10000;s.run.idleWait=true;s.settings.paused=false;
 s.run.facilities={workshop:5,market:5,watchtower:5,barricade:sum-15};
 s.run.resources.gold=100;s.run.augments.investmentTimer=0;
 assert(E.parseSave(E.serializeGame(s)));return s;
}
function payout(s){s.run.resources.gold=100;s.run.augments.investmentTimer=14.9;s.settings.paused=false;s.run.idleWait=true;E.advanceTime(s,.1);return s.run.resources.gold-100;}
for(const sum of [17,18,19])test(`investment pays for all ${sum} regular facility stages across boundary and reload`,()=>{
 let s=ready(sum);s.run.augments.investmentTimer=14.9;const facilities=structuredClone(s.run.facilities);
 s=E.parseSave(E.serializeGame(s));assert(s);assert.equal(s.run.augments.investmentTimer,14.9);
 assert.equal(payout(s),sum*.5);assert.equal(s.run.augments.investmentTimer,0);assert.deepEqual(s.run.facilities,facilities);
 for(let n=0;n<150;n++)E.advanceTime(s,.1);
 assert.equal(s.run.resources.gold,100+sum);assert(E.parseSave(E.serializeGame(s)));
});

test('a completed paid endless fence reinforcement does not increase the investment facility sum',()=>{
 const s=E.createGame({campaign:'classic21'});s.meta.bestWave=20;s.run.wave=20;s.run.nextWaveAt=0;
 s.settings.paused=false;s.run.idleWait=true;E.tick(s,.1);s.run.enemy.hp=1;E.tick(s,1.5);
 assert.equal(s.run.status,'cleared');assert(E.startEndless(s).ok);
 s.run.augments.offer=[];s.run.augments.selected=['investment'];s.run.nextWaveAt=10000;
 s.run.facilities={workshop:5,market:5,watchtower:3,barricade:5};
 Object.assign(s.run.resources,{wood:10000,stone:10000,ingot:1000});s.run.skills.smithing.xp=20000;
 const before=structuredClone(s.run.facilities);assert(E.parseSave(E.serializeGame(s)));
 assert(E.startAction(s,'reinforce_barricade').ok);
 for(let n=0;n<1000&&!s.run.endless.levels.barricade;n++)E.advanceTime(s,.1);
 assert.equal(s.run.endless.levels.barricade,1);assert.deepEqual(s.run.facilities,before);
 assert(E.parseSave(E.serializeGame(s)));assert.equal(payout(s),9);
 const restored=E.parseSave(E.serializeGame(s));assert(restored);assert.equal(restored.run.endless.levels.barricade,1);assert.equal(payout(restored),9);
});

test('version2 investment remains stopped during pause, native combat and augment selection',()=>{
 for(const mode of ['pause','combat','offer']){
  const s=ready(19);if(mode==='combat'){s.run.nextWaveAt=0;E.advanceTime(s,.1);assert.equal(s.run.status,'combat');}
  s.run.augments.investmentTimer=14.9;const before=s.run.resources.gold;
  if(mode==='pause')s.settings.paused=true;
  if(mode==='offer')s.run.augments.offer=['warrior','provisions','forestry'];
  E.advanceTime(s,.1);assert.equal(s.run.resources.gold,before,mode);assert.equal(s.run.augments.investmentTimer,14.9,mode);
 }
});

test('active numeric specification and runtime investment metadata agree without changing rates',()=>{
 const plan=JSON.parse(fs.readFileSync(new URL('../docs/balance/investment.json',import.meta.url),'utf8'));
 const runtime=C.augments.find(a=>a.id==='investment'),numeric=plan.augments.find(a=>a.id==='investment');
 assert.deepEqual(runtime.values,{interval:15,goldPerFacilityLevel:.5});assert.deepEqual(numeric.values,runtime.values);
 assert.equal(numeric.scope,runtime.scope);assert.match(runtime.scope,/no sum-18 cap/);assert.match(runtime.scope,/reinforcement levels excluded/);
 assert.equal(E.AUGMENTS.find(a=>a.id==='investment').description,'施設段階1につき15秒ごと金貨0.5');
});
