import test from 'node:test';
import assert from 'node:assert/strict';
import { mountVillageScene } from '../src/village-scene.js';

test('village sprite scene waits for assets, stops while hidden/reduced/disabled, and releases callbacks', async () => {
  const names=['document','Image','matchMedia','IntersectionObserver','requestAnimationFrame','cancelAnimationFrame'];
  const previous=Object.fromEntries(names.map(name=>[name,globalThis[name]]));
  const frames=new Map(), images=[], listeners=new Map();let frame=0, visibility, draws=0, removed=0, disconnected=0;
  const ctx={clearRect(){},drawImage(){draws++;},save(){},restore(){},translate(){},rotate(){},scale(){},beginPath(){},moveTo(){},lineTo(){},closePath(){},clip(){},fillRect(){},
    getImageData(){return {data:new Uint8ClampedArray(16).fill(255)};},putImageData(){},createRadialGradient(){return {addColorStop(){}};},createLinearGradient(){return {addColorStop(){}};}};
  const doc={hidden:false,createElement(){return {width:0,height:0,setAttribute(){},getContext:()=>ctx,remove(){removed++;}};},addEventListener:(k,f)=>listeners.set(k,f),removeEventListener:k=>listeners.delete(k)};
  const reduced={matches:false,addEventListener(k,f){this.change=f;},removeEventListener(){this.change=null;}};
  const host={isConnected:true,dataset:{},append(){}};
  try {
    Object.assign(globalThis,{document:doc,Image:class {constructor(){this.naturalWidth=8;this.naturalHeight=8;images.push(this);}},matchMedia:()=>reduced,
      IntersectionObserver:class {constructor(fn){visibility=fn;}observe(){}disconnect(){disconnected++;}},requestAnimationFrame:fn=>{frames.set(++frame,fn);return frame;},cancelAnimationFrame:id=>frames.delete(id)});
    const scene=mountVillageScene(host);scene.setActive(true);visibility([{isIntersecting:true}]);
    assert.equal(frames.size,0,'do not animate undecoded sprites');
    for(const img of images)img.onload();await new Promise(resolve=>setImmediate(resolve));
    assert.equal(host.dataset.loaded,'true');assert.ok(draws>20);assert.equal(frames.size,1);
    const [id,fn]=frames.entries().next().value;frames.delete(id);fn(1000);assert.equal(frames.size,1);
    scene.setActive(false);assert.equal(frames.size,0);
    const still=draws;scene.setState({facilities:{watchtower:1,workshop:1},threat:.5});assert.ok(draws>still,'a still scene repaints when the settlement changes');
    const same=draws;scene.setState({facilities:{watchtower:1,workshop:1},threat:.5});assert.equal(draws,same,'unchanged state costs no repaint');assert.equal(host.dataset.threat,'0.50');
    scene.setActive(true);assert.equal(frames.size,1);
    doc.hidden=true;listeners.get('visibilitychange')();assert.equal(frames.size,0);
    doc.hidden=false;listeners.get('visibilitychange')();assert.equal(frames.size,1);
    reduced.matches=true;reduced.change();assert.equal(frames.size,0);
    reduced.matches=false;reduced.change();assert.equal(frames.size,1);
    visibility([{isIntersecting:false}]);assert.equal(frames.size,0);
    visibility([{isIntersecting:true}]);scene.destroy();assert.equal(frames.size,0);
    assert.equal(listeners.size,0);assert.equal(reduced.change,null);assert.equal(disconnected,1);assert.equal(removed,1);
    scene.setActive(true);assert.equal(frames.size,0,'destroyed scenes cannot restart');
  } finally {for(const name of names){if(previous[name]===undefined)delete globalThis[name];else globalThis[name]=previous[name];}}
});
