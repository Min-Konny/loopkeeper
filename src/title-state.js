import {createGame,parseSave,serializeGame} from './engine.js?v=0.6.131';
import {STORAGE_KEY,decodeRecord,loadStoredGame,resetStoredGame,writeStoredGame} from './save-storage.js?v=0.6.131';
export const TITLE_PREFERENCES_KEY='loopkeeper-title-preferences-v1';
const KEYS=['soundVolume','musicVolume','ambientVolume','effectsEnabled','pauseWhenHidden'];
export function inspectTitleSave(storage){
  try{const raw=storage.getItem(STORAGE_KEY),loaded=loadStoredGame(storage);
    return{kind:!raw?'empty':loaded.game?(decodeRecord(raw)?'valid':'backup'):'corrupt',raw,game:loaded.game};
  }catch{return{kind:'unavailable',raw:null,game:null};}
}
function checkedPreferences(input){
  const out={};for(const key of KEYS){if(!Object.hasOwn(input,key))continue;const value=input[key];
    if(key.endsWith('Volume')?typeof value!=='number'||!Number.isFinite(value)||value<0||value>1:typeof value!=='boolean')throw Error('Invalid preference');
    out[key]=value;}return out;
}
export function titlePreferences(storage,slot=inspectTitleSave(storage)){
  const defaults={soundVolume:.3,musicVolume:.15,ambientVolume:0,effectsEnabled:true,pauseWhenHidden:false,...createGame().settings};
  if(slot.game)return Object.fromEntries(KEYS.map(k=>[k,slot.game.settings[k]??defaults[k]]));
  try{return {...Object.fromEntries(KEYS.map(k=>[k,defaults[k]])),...checkedPreferences(JSON.parse(storage.getItem(TITLE_PREFERENCES_KEY)||'{}'))};}
  catch{return Object.fromEntries(KEYS.map(k=>[k,defaults[k]]));}
}
// Preserve raw pause/work fields and the envelope's offline timestamp. Parsing
// validates, but its import-time normalization must never be written here.
export function saveTitlePreferences(storage,input,expectedRaw){
  const prefs=checkedPreferences(input),raw=storage.getItem(STORAGE_KEY);
  if(raw!==expectedRaw)throw Error('Save changed in another tab');
  if(!raw){storage.setItem(TITLE_PREFERENCES_KEY,JSON.stringify(prefs));return;}
  if(!decodeRecord(raw))throw Error('Unreadable primary');
  const record=JSON.parse(raw),wrapped=Object.hasOwn(record,'storageVersion');
  const game=wrapped?JSON.parse(record.payload):record;
  game.settings={...game.settings,...prefs};
  const payload=JSON.stringify(game);if(!parseSave(payload))throw Error('Invalid edited save');
  const next=wrapped?JSON.stringify({...record,payload}):payload;
  if(storage.getItem(STORAGE_KEY)!==raw)throw Error('Save changed in another tab');
  storage.setItem(STORAGE_KEY,next);
}
export function startTitleChallenge(storage,expectedRaw,{now=Date.now()}={}){
  const slot=inspectTitleSave(storage);if(slot.kind==='unavailable'||slot.raw!==expectedRaw)throw Error('Save changed or unavailable');
  if(slot.game)return resetStoredGame(storage,slot.game,{now});
  const fresh=createGame();Object.assign(fresh.settings,titlePreferences(storage,slot));
  if(!parseSave(serializeGame(fresh)))throw Error('Invalid fresh save');
  writeStoredGame(storage,fresh,{now});return fresh;
}
// Same writer boundary as the running game. Never reset a different active tab.
export async function withTitleWriter(locks,operation){
  if(!locks?.request)throw Error('Writer lock unavailable');
  return locks.request('tomori-save-writer',{mode:'exclusive',ifAvailable:true},lock=>{
    if(!lock)throw Error('Writer busy');return operation();
  });
}
