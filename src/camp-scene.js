import { mountPixelCamp } from './pixel-camp-scene.js?v=0.6.54';
import {mountPhaserCamp}from './phaser-camp-scene.js?v=0.6.54';

export function mountCampScene(host, {variant = 'camp'} = {}) {
 const scene=variant==='battle'?mountPixelCamp(host):mountPhaserCamp(host);
 if(variant==='battle'){host.classList.add('pixel-battle-scene');scene.setNight(true);}
 return scene;
}
