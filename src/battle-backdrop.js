import {mountPixelCamp}from './pixel-camp-scene.js?v=0.6.101';
import {loadCampArt,paintGeneratedCamp}from './generated-camp-art.js?v=0.6.101';
const mounted=new WeakMap();
// A static authored environment; confirmed duel events alone move the fighters.
export function mountBattleBackdrop(host){
 if(mounted.has(host))return mounted.get(host);
 host.dataset.battleBackdrop='loading';const fallback=mountPixelCamp(host);let art,facilities={},night=true,active=false,disposed=false,visible=false,key=null,request=0;
 const paint=()=>{if(!art||disposed)return;const canvas=host.querySelector('.pixel-camp-layer canvas');if(canvas){fallback.setActive(false);paintGeneratedCamp(canvas,{facilities,night},art);host.dataset.battleBackdrop='generated';}};
 const ensure=()=>{if(!visible||disposed)return;const next=JSON.stringify(facilities);if(key===next)return;key=next;const token=++request;loadCampArt({...facilities}).then(value=>{if(disposed||token!==request)return;art=value;paint();}).catch(()=>{if(!disposed&&token===request)host.dataset.battleBackdrop=art?'generated':'fallback';});};const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;ensure();});observer.observe(host);
 const api={setSettlement(value){facilities={...value};fallback.setSettlement(value);ensure();paint();},setNight(value){night=!!value;fallback.setNight(value);paint();},setActive(value){active=!!value;fallback.setActive(active&&!art);paint();},destroy(){disposed=true;observer.disconnect();fallback.destroy();mounted.delete(host);}};
 mounted.set(host,api);return api;
}
