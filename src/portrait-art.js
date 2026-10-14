import { workScene } from './work-scene.js?v=0.4.9';
import { icon } from './icons.js?v=0.4.9';

// Decorative SVGs render as images, outside the live work-animation DOM.
// Stable URLs let the browser reuse decoded images across pane changes.
const scenes = new Map(), badges = new Map();
const LIMIT = 96;
const asImage = svg => `data:image/svg+xml,${encodeURIComponent(svg)}`;
function remember(cache, key, value) {
  if (cache.size >= LIMIT) cache.delete(cache.keys().next().value);
  cache.set(key, value);
  return value;
}
export function portraitSource(skill, actionId, equipment = {}, effectsEnabled = true) {
  const key = JSON.stringify([skill, actionId, equipment.tool?.id, equipment.weapon?.id, !!equipment.armor, equipment.armor?.id, !!equipment.shield, equipment.shield?.id, effectsEnabled]);
  if (scenes.has(key)) return scenes.get(key);
  const scene = workScene(skill, actionId, equipment);
  const svg = scene.match(/<svg\b[\s\S]*?<\/svg>/)?.[0];
  if (!svg) return '';
  const variables = Object.fromEntries((scene.match(/style="([^"]*)"/)?.[1] || '').split(';').filter(Boolean).map(entry => entry.split(':')));
  let resolved = svg.replace(/var\((--[\w-]+)\)/g, (_, name) => variables[name]);
  const styles = `${skill === 'foraging' ? '.work-particles{fill:#a7c19b}' : ''}.ore-mithril .ore-gleam{filter:drop-shadow(0 0 2px #85e2d580)}.ore-orichalcum .ore-gleam{filter:drop-shadow(0 0 2px #f3ca6e80)}${effectsEnabled ? '' : '.ore-gleam{opacity:.6}'}@media(prefers-reduced-motion:reduce){.ore-gleam{opacity:.6}}`;
  resolved = resolved.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" width="170" height="90" ').replace(/(<svg\b[^>]*>)/, `$1<style>${styles}</style>`);
  return remember(scenes, key, asImage(resolved));
}
export function portraitImage(skill, actionId, equipment, effectsEnabled) {
  const src = portraitSource(skill, actionId, equipment, effectsEnabled);
  return src ? `<img class="portrait-vignette" src="${src}" width="170" height="90" alt="" aria-hidden="true" decoding="async">` : '';
}
export function portraitBadge(name) {
  let src = badges.get(name);
  if (!src) src = remember(badges, name, asImage(icon(name).replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" color="#ddca9b" ')));
  return `<img class="portrait-badge" src="${src}" width="16" height="16" alt="" aria-hidden="true" decoding="async">`;
}
