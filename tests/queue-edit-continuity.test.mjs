import test from 'node:test';
import assert from 'node:assert/strict';
import * as E from '../src/engine.js';
import * as P from '../src/planner.js';
import {preserveRenderScroll} from '../src/render-scroll.js';
function ready(){const s=E.createGame({earlyLoopPrototype:true,lateLoopPrototype:true,preparationBalancePrototype:true});s.meta.bestWave=12;return s;}
function start(s){s.settings.paused=false;E.advanceTime(s,.05);assert(s.run.activeAction);return s.run.activeAction;}
test('head and future count edits preserve running action, queue credit and progress',()=>{
 const s=ready();assert(P.queueWork(s,'chop_wood',4).ok);assert(P.queueWork(s,'quarry_stone',5).ok);const a=start(s),before=structuredClone(a);
 for(const [i,n] of [[0,3],[1,8],[0,2]]){assert(E.editQueuedAction(s,i,n).ok);assert.equal(s.settings.paused,false);assert.equal(s.run.activeAction,a);assert.deepEqual(a,before);assert.equal(s.run.queueManaged,true);}
 E.advanceTime(s,a.duration-a.progress+.001);assert.equal(s.run.queue[0].count,1);
 E.advanceTime(s,E.getActionDuration(s,E.ACTIONS.find(x=>x.id==='chop_wood'))+.01);assert.equal(s.run.queue[0].id,'quarry_stone');
});
test('manual pause, invalid edits and same-value edits never change execution',()=>{
 const s=ready();assert(P.queueWork(s,'chop_wood',4).ok);start(s);s.settings.paused=true;const a=structuredClone(s.run.activeAction);
 assert(E.editQueuedAction(s,0,2).ok);assert(s.settings.paused);assert.deepEqual(s.run.activeAction,a);
 const snapshot=E.serializeGame(s);for(const [i,n] of [[0,0],[0,100],[0,1.5],[9,4]]){assert.equal(E.editQueuedAction(s,i,n).ok,false);assert.equal(E.serializeGame(s),snapshot);}
 assert(E.editQueuedAction(s,0,2).ok);assert.equal(E.serializeGame(s),snapshot);
});
test('paid craft edits survive reload without another payment and complete exactly edited count',()=>{
 let s=ready();s.run.skills.smithing.xp=100;s.run.resources.ore=40;s.run.resources.wood=40;s.run.facilities.workshop=1;
 assert(P.queueCraft(s,'smelt_iron',4).ok);const a=start(s),paid=structuredClone(s.run.resources),goal=a.goalId,progress=a.progress;
 assert(E.editQueuedAction(s,0,2).ok);assert.deepEqual(s.run.resources,paid);assert.equal(a.goalId,goal);
 s=E.parseSave(E.serializeGame(s));assert(s);assert.equal(s.run.activeAction.progress,progress);assert.equal(s.run.activeAction.goalId,goal);assert.deepEqual(s.run.resources,paid);s.settings.paused=false;
 for(let i=0;i<100&&s.run.queue.length;i++)E.advanceTime(s,.5);
 assert.equal(s.run.queue.length,0);assert.equal(s.run.resources.ingot,2);
});
test('single-use equipment remains one and active paid equipment is not detached',()=>{
 const s=ready();s.run.resources.wood=30;s.run.resources.stone=30;assert(P.queueCraft(s,'wooden_armor',1).ok);const a=start(s),before=structuredClone(a);assert(E.editQueuedAction(s,0,99).ok);assert.equal(s.run.queue[0].count,1);assert.deepEqual(a,before);assert(s.run.queueManaged);assert.equal(s.settings.paused,false);
});
test('training target edit keeps the current repetition and honors manual pause',()=>{
 const s=ready();assert(E.enqueueTrainingLevel(s,'train_combat',5).ok);const a=start(s),before=structuredClone(a);assert(E.editQueuedTrainingLevel(s,0,6).ok);assert.equal(s.run.queue[0].until.target,6);assert.deepEqual(a,before);assert(s.run.queueManaged);assert.equal(s.settings.paused,false);s.settings.paused=true;assert(E.editQueuedTrainingLevel(s,0,7).ok);assert(s.settings.paused);assert.equal(E.editQueuedTrainingLevel(s,0,101).ok,false);
});
test('render restores current ancestor offsets even after temporary shrink and exception',()=>{
 const main={isConnected:true,scrollTop:300,scrollLeft:4},side={isConnected:true,scrollTop:20,scrollLeft:0};const doc={scrollingElement:main,querySelectorAll:()=>[main,side]};
 preserveRenderScroll(doc,()=>{main.scrollTop=0;side.scrollTop=0;});assert.equal(main.scrollTop,300);assert.equal(side.scrollTop,20);assert.equal(main.scrollLeft,4);
 // A later user scroll is the new reference, not an old saved position.
 main.scrollTop=150;assert.throws(()=>preserveRenderScroll(doc,()=>{main.scrollTop=0;throw Error('render');}));assert.equal(main.scrollTop,150);
});
