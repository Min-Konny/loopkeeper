import { equipmentMaterial } from './visual-design.js?v=0.3.12';
import { icon } from './icons.js?v=0.3.12';
import { miningScene } from './mining-scene.js?v=0.3.12';

// Decorative work scenes follow the actual selected skill; no separate timer or game state.
export function workScene(skill, actionId, equipment = {}) {
  const toolMaterial = equipmentMaterial(skill === 'combat' ? equipment.weapon : equipment.tool);
  const armorMaterial = equipmentMaterial(equipment.armor);
  const shieldMaterial = equipmentMaterial(equipment.shield);
  const shield = equipment.shield ? `<path d="M26 51l14 4v14L26 79 15 69V55Z" fill="${shieldMaterial.metal}" stroke="${shieldMaterial.cloth}" stroke-width="2"/>` : '';
  const armor = equipment.armor ? `<path d="M38 50h21l4 19H35Z" fill="${armorMaterial.metal}"/><path d="M40 32q8-12 17 0v8H40Z" fill="${armorMaterial.metal}"/>` : '';
  const cooking = actionId?.includes('meal') || actionId?.includes('cook');
  const deposit = skill === 'mining' ? miningScene(actionId) : null;
  const fishing = actionId === 'fish_river';
  const tool = fishing ? 'fish' : actionId === 'train_defense' ? 'shield' : actionId === 'train_vitality' ? 'heart' : cooking ? 'food' : { logging: 'axe', mining: 'pickaxe', foraging: 'leaf', smithing: 'hammer', combat: 'sword' }[skill];
  const objects = {
    logging: '<path d="M103 65V30" stroke="#916844" stroke-width="10"/><g class="work-target"><path d="M103 5L72 38H88L67 53H138L117 38H133Z" fill="#65836d"/><path d="M103 10L85 34H121Z" fill="#93ab7c"/></g><path d="M75 71l29-5 17 4-29 6Z" fill="#af875b"/>',
    mining: deposit?.markup,
    foraging: '<g class="work-target" fill="#6e9674"><ellipse cx="95" cy="54" rx="26" ry="15"/><ellipse cx="120" cy="56" rx="23" ry="17"/><ellipse cx="108" cy="42" rx="21" ry="17"/></g><g fill="#d6ad76"><circle cx="89" cy="48" r="3"/><circle cx="114" cy="37" r="3"/><circle cx="123" cy="57" r="3"/></g><path d="M67 66h30l-5 13H72Z" fill="#9d744b"/>',
    smithing: '<path d="M85 60h36l-7 18H93Z" fill="#687477"/><path d="M77 46h56v11l-19 5H90L73 51Z" fill="#a9ada1"/><path d="M129 57h19v20h-19Z" fill="#675c51"/><path class="work-flame" d="M136 70q-8-8 1-20 0 8 6 10l2-8q8 15-2 18Z" fill="#f0b365"/>',
    combat: '<path d="M112 21v55M96 77h32" stroke="#9d7d56" stroke-width="6"/><g class="work-target"><path d="M97 24h30v32H97Z" fill="#a58f68"/><path d="M89 30h46" stroke="#7d664d" stroke-width="6"/><circle cx="112" cy="40" r="9" fill="#7b6853"/><circle cx="112" cy="40" r="4" fill="#c9b17c"/></g>',
  };
  const object = fishing ? '<path class="fishing-water" d="M80 62q20-10 40 0t40 0v22H80Z" fill="#487b7b"/><path d="M63 54 107 15l15 47" fill="none" stroke="#c9b789" stroke-width="2"/><circle class="fishing-float" cx="122" cy="63" r="3" fill="#e3bd79"/>' : actionId === 'train_defense' ? '<path class="work-target" d="M103 24l25 9v25l-25 20-25-20V33Z" fill="#879c8c" stroke="#c4c2a2" stroke-width="3"/>' : actionId === 'train_vitality' ? '<path class="work-target" d="M79 51h59M82 40v23m8-25v27m40-27v27m8-25v23" stroke="#adbca0" stroke-width="7"/>' : cooking ? '<path d="M79 48h49q0 26-25 26T79 48Z" fill="#758780"/><path d="M77 47h53" stroke="#b9bdaa" stroke-width="4"/><path class="work-flame" d="M90 81q-4-11 6-18l4 9 7-11q12 12 7 20Z" fill="#e9af64"/>' : objects[skill];
  if (!object) return '';
  return `<div class="work-vignette work-${skill} material-${toolMaterial.tier}" style="--ore-particle:${deposit?.particle || "#ddc393"};--tool-metal:${toolMaterial.metal};--tool-glow:${toolMaterial.glow};--work-cloth:${armorMaterial.cloth}" aria-hidden="true"><svg viewBox="0 0 170 90"><ellipse cx="92" cy="76" rx="72" ry="11" fill="#10201f"/><path d="M5 69Q38 45 80 66T167 66V90H5Z" fill="#2a4037"/><g class="work-person"><path d="M35 75l4-24h19l6 24" fill="var(--work-cloth)"/><path d="M41 51l-8 15m22-15 18 4" stroke="#a0a997" stroke-width="6" stroke-linecap="round"/><circle cx="48" cy="38" r="10" fill="#c5b091"/><path d="M37 35q3-17 17-8l7 10H37Z" fill="#91a28b"/>${armor}${shield}</g>${object}<g class="work-particles" fill="var(--ore-particle)"><circle cx="87" cy="42" r="2"/><circle cx="77" cy="35" r="1.5"/><circle cx="95" cy="29" r="2"/></g></svg><span class="work-tool">${icon(tool)}</span></div>`;
}

// The tool, target and chips share the real action progress, including resumed work.
export function syncWorkAnimation(scene, action) {
  if (!scene || !action || !scene.getAnimations) return;
  const phase = Math.min(1, Math.max(0, action.progress / action.duration));
  for (const animation of scene.getAnimations({subtree:true})) {
    if (!['work-swing','work-impact','work-chips'].includes(animation.animationName)) continue;
    const duration = animation.effect?.getTiming().duration;
    if (typeof duration === 'number') animation.currentTime = phase * duration;
  }
}
