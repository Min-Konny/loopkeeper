import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame,getNextEnemy,getMilestoneStatus} from '../src/engine.js?v=0.6.140';
import {text,setUILocale,hasLocaleCopy} from '../src/i18n.js?v=0.6.140';
import {JA} from '../src/ui-copy-ja.js?v=0.6.140';
import {encounterName} from '../src/encounter-copy.js?v=0.6.140';
import {entityText} from '../src/entity-copy.js?v=0.6.140';
import {workScene} from '../src/work-scene.js?v=0.6.140';
const storage={setItem(){}};
test('dashboard copy, current encounter and milestone resolve in all four languages',()=>{
 const s=createGame({earlyLoopPrototype:true,lateLoopPrototype:true,preparationBalancePrototype:true});
 for(const locale of ['ja','en','ko','zh-CN']){
  setUILocale(locale,storage);
  for(const key of Object.keys(JA).filter(k=>k.startsWith('village.'))){assert(hasLocaleCopy(key,locale),locale+': '+key);assert(!text(key).startsWith('['));}
  const enemy=encounterName(s,getNextEnemy(s)),goal=entityText('quest',getMilestoneStatus(s).next);
  assert(enemy&&goal);if(locale!=='ja'){assert.notEqual(enemy,'森の狼');assert.notEqual(goal,'石の槍を作る');}
 }
 setUILocale('ja',storage);
});
test('worker portraits use companion weapons rather than the keeper equipment',()=>{
 const s=createGame({earlyLoopPrototype:true});s.run.party.equipment.archer='silver_bow';s.run.party.equipment.mage='silver_staff';
 const before=JSON.stringify(s);
 assert.match(workScene('archery','train_archery',s.run.equipment,s),/party-archer-silver-bow-v1/);
 assert.match(workScene('sorcery','train_magic',s.run.equipment,s),/party-mage-silver-staff-v1/);
 assert.equal(JSON.stringify(s),before);
});
