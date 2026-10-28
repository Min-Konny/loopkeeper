import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame,serializeGame,parseSave,startAction} from '../src/engine.js';
import {STORAGE_KEY,writeStoredGame,loadStoredGame} from '../src/save-storage.js';
import {inspectTitleSave,titlePreferences,saveTitlePreferences,startTitleChallenge,withTitleWriter,TITLE_PREFERENCES_KEY} from '../src/title-state.js';
import {titleText,readUILocale,writeUILocale,UI_LOCALE_KEY} from '../src/title-copy.js';
const memory=()=>{const data=new Map();return{data,getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,String(v)),removeItem:k=>data.delete(k)};};
test('title inspection is read-only for new, valid, corrupt and unavailable storage',()=>{
  const s=memory();assert.equal(inspectTitleSave(s).kind,'empty');assert.equal(s.data.size,0);
  writeStoredGame(s,createGame(),{now:12345});let before=[...s.data];assert.equal(inspectTitleSave(s).kind,'valid');assert.deepEqual([...s.data],before);
  s.setItem(STORAGE_KEY,'broken');before=[...s.data];assert.equal(inspectTitleSave(s).kind,'corrupt');assert.deepEqual([...s.data],before);
  assert.equal(inspectTitleSave({getItem(){throw Error('blocked');}}).kind,'unavailable');
});
test('title preferences preserve savedAt, raw running state, paid work and offline settings exactly',()=>{
  const s=memory(),game=createGame();game.settings.paused=false;game.settings.farmOffline=true;game.run.resources.gold=123;game.run.resources.wood=40;game.run.resources.stone=4;assert(startAction(game,'wooden_armor').ok);writeStoredGame(s,game,{now:12345});
  const raw=s.getItem(STORAGE_KEY),before=JSON.parse(raw),payload=JSON.parse(before.payload);
  saveTitlePreferences(s,{soundVolume:.5,musicVolume:0,effectsEnabled:false},raw);
  const after=JSON.parse(s.getItem(STORAGE_KEY)),next=JSON.parse(after.payload);
  assert.equal(after.savedAt,before.savedAt);assert.equal(next.settings.paused,false);assert.equal(next.settings.farmOffline,true);
  for(const k of ['soundVolume','musicVolume','effectsEnabled'])payload.settings[k]=next.settings[k];
  assert.deepEqual(next,payload);assert(parseSave(after.payload));
});
test('title preference edits do not normalize legacy raw saves',()=>{
  const s=memory(),game=createGame();game.settings.paused=false;s.setItem(STORAGE_KEY,serializeGame(game));const raw=s.getItem(STORAGE_KEY);
  saveTitlePreferences(s,{effectsEnabled:false},raw);const next=JSON.parse(s.getItem(STORAGE_KEY));assert.equal(next.settings.paused,false);assert(!Object.hasOwn(next,'storageVersion'));
});
test('backup is inspected without repair writes; preferences cannot overwrite corrupt primary',()=>{
  const s=memory(),g=createGame(),record=JSON.stringify({storageVersion:2,savedAt:100,payload:serializeGame(g)});s.setItem(STORAGE_KEY,'broken');s.setItem(STORAGE_KEY+'-backups',JSON.stringify([{savedAt:100,record}]));
  const before=[...s.data],slot=inspectTitleSave(s);assert.equal(slot.kind,'backup');assert(slot.game);assert.deepEqual([...s.data],before);assert.throws(()=>saveTitlePreferences(s,{soundVolume:.1},slot.raw));assert.deepEqual([...s.data],before);
});
test('empty title settings never create a game; only explicit new starts one',()=>{
  const s=memory();assert.equal(titlePreferences(s).ambientVolume,0);saveTitlePreferences(s,{soundVolume:.75,effectsEnabled:false},null);assert.equal(s.getItem(STORAGE_KEY),null);assert(s.getItem(TITLE_PREFERENCES_KEY));
  startTitleChallenge(s,null,{now:100});assert.equal(loadStoredGame(s).game.settings.soundVolume,.75);assert.equal(loadStoredGame(s).game.settings.effectsEnabled,false);
});
test('stale changes, invalid preferences and corrupt-save preference writes fail without primary mutation',()=>{
  const s=memory();writeStoredGame(s,createGame());const raw=s.getItem(STORAGE_KEY);
  for(const input of [{soundVolume:NaN},{musicVolume:1.01},{ambientVolume:-1},{effectsEnabled:1},{pauseWhenHidden:'true'}])assert.throws(()=>saveTitlePreferences(s,input,raw));
  assert.equal(s.getItem(STORAGE_KEY),raw);assert.throws(()=>saveTitlePreferences(s,{effectsEnabled:false},'old'));assert.throws(()=>startTitleChallenge(s,'old'));
  s.setItem(STORAGE_KEY,'broken');assert.throws(()=>saveTitlePreferences(s,{effectsEnabled:false},'broken'));assert.equal(s.getItem(STORAGE_KEY),'broken');
});
test('new challenge uses existing reset: replay collection survives, progress resets, backup remains',()=>{
  const s=memory(),game=createGame();game.meta.bestWave=36;game.replay.unlocked=[{id:'frontier_clear',generation:1,seconds:100}];
  assert(parseSave(serializeGame(game)));writeStoredGame(s,game);const raw=s.getItem(STORAGE_KEY),next=startTitleChallenge(s,raw);
  assert.equal(next.meta.generation,1);assert.deepEqual(next.replay.unlocked,game.replay.unlocked);assert(s.getItem(STORAGE_KEY+'-before-reset'));assert(parseSave(JSON.parse(s.getItem(STORAGE_KEY)).payload));
});
test('corrupt replacement archives original only on explicit new; failed primary write preserves progress',()=>{
  const s=memory();s.setItem(STORAGE_KEY,'broken');startTitleChallenge(s,'broken');assert.equal(s.getItem(STORAGE_KEY+'-unreadable'),'broken');
  const raw=s.getItem(STORAGE_KEY),set=s.setItem;s.setItem=(k,v)=>{if(k===STORAGE_KEY)throw Error('quota');set(k,v);};assert.throws(()=>startTitleChallenge(s,raw));assert.equal(s.getItem(STORAGE_KEY),raw);
});
test('title writer refuses unavailable/busy locks and uses same running-game key',async()=>{
  let calls=0;await assert.rejects(withTitleWriter(null,()=>calls++));await assert.rejects(withTitleWriter({request:async(k,o,f)=>{assert.equal(k,'tomori-save-writer');assert.equal(o.ifAvailable,true);return f(null);}},()=>calls++));assert.equal(calls,0);
  assert.equal(await withTitleWriter({request:async(k,o,f)=>f({})},()=>++calls),1);
});
test('UI locale does not touch progress; unsupported languages are not exposed',()=>{
  const s=memory();writeStoredGame(s,createGame());const raw=s.getItem(STORAGE_KEY);assert.equal(readUILocale(s),'ja');assert.equal(s.getItem(UI_LOCALE_KEY),null);writeUILocale(s,'ja');assert.equal(s.getItem(STORAGE_KEY),raw);assert.throws(()=>writeUILocale(s,'en'));assert.equal(titleText('title.record',{generation:6,wave:36}),'第6世代 · 通常最高 36 波');assert.throws(()=>titleText('missing'));
});
