import test from 'node:test';
import assert from 'node:assert/strict';
import {villageEnemyArt} from '../src/village-art.js';
test('dashboard encounter illustration follows regular, flying, named boss and regional art',()=>{
 assert.match(villageEnemyArt({wave:1}).source,/wolf-v1\.png$/);
 assert.match(villageEnemyArt({wave:2}).source,/raider-v1\.png$/);
 assert.match(villageEnemyArt({wave:2,trait:'flying'}).source,/winged-v1\.png$/);
 assert.match(villageEnemyArt({wave:12,id:'ironfang_captain',isBoss:true}).source,/ironfang-captain-v1\.png$/);
 assert.match(villageEnemyArt({wave:3,id:'forest_chief',isBoss:true}).source,/forest-chief-v2\.png$/);
 assert.match(villageEnemyArt({wave:20,isBoss:true},'ice').source,/ice-giant-v3\.png$/);
 const unknown=villageEnemyArt({wave:1},'unknown');assert.equal(unknown.generated,false);assert.equal(unknown.source,unknown.fallback);
});

test('regular encounters are drawn as what they are, not by wave number',async()=>{
 const E=await import('../src/engine.js?v=0.6.140');const {enemyPortraitKind}=await import('../src/enemy-art.js?v=0.6.140');
 const g=E.createGame(),kinds={};for(let w=0;w<36;w++){g.run.wave=w;const e=E.getNextEnemy(g);kinds[e.id]=enemyPortraitKind(e);if(e.trait==='flying')assert.equal(kinds[e.id],'winged',e.id);if(e.isBoss)assert.equal(kinds[e.id],'boss',e.id);}
 assert.deepEqual(Object.fromEntries(['chapter_1_scout','chapter_1_vanguard','chapter_2_scout','chapter_3_scout','chapter_4_scout','chapter_5_scout','chapter_6_scout','chapter_7_scout','dawn_iron_legion','forge_guard','forge_hammer','star_blades','ice_armor','ice_blades'].map(id=>[id,kinds[id]])),
  {chapter_1_scout:'wolf',chapter_1_vanguard:'raider',chapter_2_scout:'knight',chapter_3_scout:'knight',chapter_4_scout:'raider',chapter_5_scout:'knight',chapter_6_scout:'raider',chapter_7_scout:'raider',dawn_iron_legion:'knight',forge_guard:'knight',forge_hammer:'giant',star_blades:'raider',ice_armor:'knight',ice_blades:'raider'});
 assert.match(villageEnemyArt({wave:23,id:'dawn_iron_legion',trait:'armor'}).source,/knight-v1\.png$/);
 // Unknown encounters keep the original wave order, so older content and endless waves are unchanged.
 assert.deepEqual([1,2,3,4,5,40].map(wave=>enemyPortraitKind({wave})),['wolf','raider','boss','knight','giant','giant']);assert.equal(enemyPortraitKind(),'wolf');
});
