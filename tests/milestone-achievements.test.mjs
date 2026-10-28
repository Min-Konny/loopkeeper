import test from'node:test';import assert from'node:assert/strict';
import*as E from'../src/engine.js';import{MILESTONE_ACHIEVEMENTS,milestoneAchievementProgress}from'../src/milestone-achievements.js';import{recordReplayMilestones,initializeReplay,REPLAY_ACHIEVEMENTS}from'../src/replay-achievements.js';import{replayAchievementsMarkup}from'../src/replay-achievements-ui.js';import{writeStoredGame,loadStoredGame,resetStoredGame,replaceStoredGame,STORAGE_KEY}from'../src/save-storage.js';
const fresh=()=>E.createGame({earlyLoopPrototype:true,lateLoopPrototype:true,preparationBalancePrototype:true});
const memory=()=>{const m=new Map();return{getItem:k=>m.get(k)??null,setItem:(k,v)=>m.set(k,String(v))};};
test('ten stable cosmetic milestones extend rather than replace seven clear challenges',()=>{
 assert.equal(MILESTONE_ACHIEVEMENTS.length,10);assert.equal(REPLAY_ACHIEVEMENTS.length,17);assert.equal(new Set(REPLAY_ACHIEVEMENTS.map(d=>d.id)).size,17);assert.equal(REPLAY_ACHIEVEMENTS.filter(d=>d.id.startsWith('frontier_')).length,7);
 const s=fresh(),before=E.serializeGame(s);assert.deepEqual(recordReplayMilestones(s),[]);assert.equal(E.serializeGame(s),before);const html=replayAchievementsMarkup(s);assert(html.includes('旅の節目'));assert(html.includes('クリアへの挑戦'));assert(html.includes('強化報酬はなく'));assert.equal((html.match(/data-replay-achievement=/g)||[]).length,17);
});
test('owned equipment reaches correct tiers; higher equipment counts lower milestones without rewards',()=>{
 const s=fresh();s.run.ownedEquipment.push('orichalcum_staff');const before=structuredClone(s),events=recordReplayMilestones(s);assert.equal(events.length,6);assert(events.some(e=>e.id==='milestone_iron_equipment'));assert(events.some(e=>e.id==='milestone_orichalcum_equipment'));const after=structuredClone(s);after.replay=before.replay;assert.deepEqual(after,before);assert.deepEqual(recordReplayMilestones(s),[]);assert(E.parseSave(E.serializeGame(s)));
});
test('pending/paid recipe does not unlock until actual equipment completion',()=>{
 const s=fresh();s.run.skills.smithing.xp=10000;s.run.resources.ingot=6;s.run.resources.wood=8;s.run.facilities.workshop=1;s.run.ownedEquipment=['wooden_spear'];s.run.equipment.weapon={id:'wooden_spear',...E.RECIPES.find(r=>r.id==='wooden_spear').equipment};s.settings.paused=false;assert(E.startAction(s,'iron_sword').ok);assert(s.run.activeAction);recordReplayMilestones(s);assert(!s.replay.unlocked.some(e=>e.id==='milestone_iron_equipment'));E.advanceTime(s,s.run.activeAction.duration+.2);assert(s.run.ownedEquipment.includes('iron_sword'));assert(s.replay.unlocked.some(e=>e.id==='milestone_iron_equipment'));assert(!s.replay.unlocked.some(e=>e.id==='milestone_steel_equipment'));const points=s.meta.points,total=s.meta.totalPoints;assert.deepEqual(recordReplayMilestones(s),[]);assert.equal(s.meta.points,points);assert.equal(s.meta.totalPoints,total);
});
test('old explicit completion facts recover milestones without inferring constraint history',()=>{
 const s=fresh();delete s.replay;s.meta.completedMilestones=['first_orichalcum_equipment','first_accessory','accessories_3','specialist_stage_2','outposts_3'];const points=s.meta.points;initializeReplay(s);assert.equal(s.replay.unlocked.length,10);assert(s.replay.unlocked.every(e=>e.id.startsWith('milestone_')));assert.equal(s.replay.attempt.known,false);assert.equal(s.meta.points,points);initializeReplay(s);assert.equal(s.replay.unlocked.length,10);
});
test('specialist construction starts and ordinary buildings do not count; completed stageII does',()=>{
 const s=fresh(),d=MILESTONE_ACHIEVEMENTS.find(d=>d.id==='milestone_specialist_2');s.run.facilities.housing=2;s.meta.completedMilestones=['first_facility_level_2'];s.run.facilities.kitchen=1;assert.equal(milestoneAchievementProgress(s,d).complete,false);s.run.facilities.kitchen=2;assert.equal(milestoneAchievementProgress(s,d).complete,true);assert(recordReplayMilestones(s).some(e=>e.id===d.id));
});
test('accessory/outpost diversity counts actual distinct permanent facts rather than repetitions or construction',()=>{
 const s=fresh(),accessory=MILESTONE_ACHIEVEMENTS.find(d=>d.id==='milestone_accessories_3'),outpost=MILESTONE_ACHIEVEMENTS.find(d=>d.id==='milestone_outposts_3');s.meta.accessories=['tempo_ring','tempo_ring','tempo_ring'];assert.equal(milestoneAchievementProgress(s,accessory).complete,false);s.meta.accessories=['tempo_ring','steady_ring','guard_bracelet'];assert.equal(milestoneAchievementProgress(s,accessory).complete,true);s.run.facilities.outpost_forest=3;s.meta.routeClears=['forest','forest','forest'];assert.equal(milestoneAchievementProgress(s,outpost).complete,false);s.meta.routeClears=['forest','quarry','marsh'];assert.equal(milestoneAchievementProgress(s,outpost).complete,true);
});
test('new milestone records remain available after normal clear and have no point side effects',()=>{
 const s=fresh();s.replay.attempt.finished=true;s.run.ownedEquipment.push('iron_sword');const before=s.meta.points;assert.equal(recordReplayMilestones(s).length,1);assert(s.replay.attempt.finished);assert.equal(s.meta.points,before);
});
test('actual abandon/confirm generation pipeline preserves an earned milestone once',()=>{
 const s=fresh();s.run.ownedEquipment.push('iron_sword');recordReplayMilestones(s);const collection=structuredClone(s.replay.unlocked);assert(E.abandonRun(s).ok);assert.equal(s.run.status,'legacy_setup');assert(E.confirmRun(s,{earlyLoopPrototype:true,lateLoopPrototype:true,preparationBalancePrototype:true}).ok);assert.equal(s.meta.generation,2);assert.deepEqual(s.replay.unlocked,collection);assert.deepEqual(recordReplayMilestones(s),[]);assert(E.parseSave(E.serializeGame(s)));
});
test('high wave and currency alone never prove equipment milestones in old records',()=>{
 const s=fresh();delete s.replay;s.meta.bestWave=36;s.meta.points=100;s.meta.totalPoints=100;initializeReplay(s);assert.equal(s.replay.attempt.known,false);assert(!s.replay.unlocked.some(r=>r.id.startsWith('milestone_')));
});
test('save/reload/new challenge/restore/import retain collection once and never silently reset progress',()=>{
 const s=fresh(),st=memory();s.run.ownedEquipment.push('orichalcum_staff');recordReplayMilestones(s);writeStoredGame(st,s);const raw=st.getItem(STORAGE_KEY),loaded=loadStoredGame(st).game;assert(loaded);assert.deepEqual(loaded.replay.unlocked,s.replay.unlocked);assert.equal(st.getItem(STORAGE_KEY),raw);const n=resetStoredGame(st,loaded);assert.deepEqual(n.replay.unlocked,s.replay.unlocked);assert.equal(n.meta.generation,1);const merged=replaceStoredGame(st,n,fresh());assert.deepEqual(merged.replay.unlocked,s.replay.unlocked);assert.equal(new Set(merged.replay.unlocked.map(e=>e.id)).size,6);assert(E.parseSave(E.serializeGame(merged)));
});
test('new IDs validate, unknown/duplicate forged IDs still reject and failed reset preserves primary',()=>{
 const s=fresh(),st=memory();s.run.ownedEquipment.push('iron_sword');recordReplayMilestones(s);assert(E.parseSave(E.serializeGame(s)));writeStoredGame(st,s);const raw=st.getItem(STORAGE_KEY);assert.throws(()=>resetStoredGame({...st,setItem(){throw Error('quota');}},s));assert.equal(st.getItem(STORAGE_KEY),raw);s.replay.unlocked.push({...s.replay.unlocked[0]});assert.equal(E.parseSave(E.serializeGame(s)),null);s.replay.unlocked.pop();s.replay.unlocked.push({id:'milestone_unknown',generation:1,seconds:0});assert.equal(E.parseSave(E.serializeGame(s)),null);
});
