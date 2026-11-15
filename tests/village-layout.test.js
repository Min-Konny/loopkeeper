import test from 'node:test';
import assert from 'node:assert/strict';
import { alongPath, residentRoutes, backTrees, isRiverPixel, villageLife } from '../src/village-layout.js';

test('residents follow road bends and avoid house footprints with body clearance',()=>{
  assert.deepEqual(alongPath([[0,0],[10,0],[10,30]],.5),[10,10]);
  const buildings=[[265,360,485,583],[410,320,615,480],[581,448,823,642],[723,260,1115,490],[1460,193,1582,468]];
  for(const route of residentRoutes) for(let i=0;i<=200;i++) {
    const [x,y]=alongPath(route,i/200);
    for(const [left,top,right,bottom] of buildings)assert.ok(x+15<left||x-15>right||y<top||y-48>bottom,`resident overlaps building at ${x},${y}`);
  }
  assert.ok(backTrees.every(([,x,y])=>x<500&&y<=310),'no roots placed on the northeastern palisade or tower');
});
test('water mask rejects sampled rock and timber colors but accepts the river base',()=>{
  for(const color of [[65,75,102],[33,38,53],[40,52,88],[235,167,112],[63,49,47]])assert.equal(isRiverPixel(...color),false);
  for(const color of [[11,34,60],[5,47,86]])assert.equal(isRiverPixel(...color),true);
});

test('village life grows with built facilities, ignores outposts, and follows construction and threat',()=>{
  assert.deepEqual(villageLife(),{residents:1,carrier:false,fields:[0,0],sheep:0,smoke:0,torches:false,threat:0});
  assert.deepEqual(villageLife({facilities:{watchtower:0,outpost_forest:3,housing:0}}),villageLife(),'unbuilt facilities and outposts add nothing');
  const early=villageLife({facilities:{watchtower:1,workshop:2},constructing:true,threat:.5});
  assert.deepEqual(early,{residents:2,carrier:true,fields:[.5,0],sheep:1,smoke:1,torches:true,threat:.5});
  const full=villageLife({facilities:Object.fromEntries(['watchtower','barricade','infirmary','workshop','market','guardhouse','smokehouse','kitchen','housing'].map(id=>[id,1])),threat:7});
  assert.deepEqual(full,{residents:3,carrier:false,fields:[1,1],sheep:3,smoke:2,torches:true,threat:1});
  assert.equal(villageLife({threat:-3}).threat,0);assert.equal(villageLife({threat:NaN}).threat,0);
  const input={facilities:Object.freeze({workshop:1})};Object.freeze(input);assert.doesNotThrow(()=>villageLife(input));
});
