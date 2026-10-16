import { mountPixelCamp } from './pixel-camp-scene.js?v=0.6.27';

export function mountCampScene(host, {variant = 'camp'} = {}) {
 const scene=mountPixelCamp(host);
 if(variant==='battle'){host.classList.add('pixel-battle-scene');scene.setNight(true);}
 return scene;
}
