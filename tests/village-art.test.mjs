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
