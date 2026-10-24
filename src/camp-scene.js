import {mountBattleBackdrop}from './battle-backdrop.js?v=0.6.62';
import { mountPixelCamp } from './pixel-camp-scene.js?v=0.6.62';
import {mountPhaserCamp}from './phaser-camp-scene.js?v=0.6.62';

export function mountCampScene(host, {variant = 'camp'} = {}) {
 const scene=variant==='battle'?mountBattleBackdrop(host):mountPhaserCamp(host);
 if(variant==='battle'){host.classList.add('pixel-battle-scene');scene.setNight(true);}
 return scene;
}
