import test from 'node:test';
import assert from 'node:assert/strict';
import { alongPath, residentRoutes, backTrees, isRiverPixel } from '../src/village-layout.js';

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
