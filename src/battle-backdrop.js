import {mountPixelCamp}from './pixel-camp-scene.js?v=0.6.64';
import {loadCampArt,paintGeneratedCamp}from './generated-camp-art.js?v=0.6.64';
const mounted=new WeakMap();
// A static authored environment; confirmed duel events alone move the fighters.
export function mountBattleBackdrop(host){
 if(mounted.has(host))return mounted.get(host);
 host.dataset.battleBackdrop='loading';const fallback=mountPixelCamp(host);let art,facilities={},night=true,active=false,disposed=false;
 const paint=()=>{if(!art||disposed)return;const canvas=host.querySelector('.pixel-camp-layer canvas');if(canvas){fallback.setActive(false);paintGeneratedCamp(canvas,{facilities,night},art);host.dataset.battleBackdrop='generated';}};
 loadCampArt().then(value=>{art=value;paint();}).catch(()=>{if(!disposed)host.dataset.battleBackdrop='fallback';});
 const api={setSettlement(value){facilities={...value};fallback.setSettlement(value);paint();},setNight(value){night=!!value;fallback.setNight(value);paint();},setActive(value){active=!!value;fallback.setActive(active&&!art);paint();},destroy(){disposed=true;fallback.destroy();mounted.delete(host);}};
 mounted.set(host,api);return api;
}
