import {mountBattleBackdrop}from './battle-backdrop.js?v=0.6.114';
import { mountPixelCamp } from './pixel-camp-scene.js?v=0.6.114';
import {mountPhaserCamp}from './phaser-camp-scene.js?v=0.6.114';

export function mountCampScene(host, {variant = 'camp'} = {}) {
 const scene=variant==='battle'?mountBattleBackdrop(host):mountPhaserCamp(host);
 if(variant==='battle'){host.classList.add('pixel-battle-scene');scene.setNight(true);}
 return scene;
}
