import { getCatalog } from "./engine.js?v=0.2.11";
import { icon } from "./icons.js?v=0.2.11";
let audio;
let preferences = { soundVolume: 0.3, effectsEnabled: true };
let previous;
export function unlockAudio(settings) {
  preferences = settings;
  if (!settings.soundVolume || document.hidden) return;
  try {
    audio ||= new (window.AudioContext || window.webkitAudioContext)();
    if (audio.state === 'suspended') audio.resume().catch(() => {});
  } catch { /* Sound is optional when the platform provides no audio context. */ }
}
function cue(kind) {
  if (!audio || audio.state !== 'running' || !preferences.soundVolume || document.hidden) return;
  const notes = { craft: [440, 660], victory: [392, 494, 587], raid: [110, 82], death: [196, 147, 98], heal: [660, 880], hit: [130] }[kind] || [440];
  notes.forEach((frequency, index) => {
    const start = audio.currentTime + index * .09;
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    oscillator.type = kind === 'hit' || kind === 'raid' ? 'triangle' : 'sine';
    oscillator.frequency.setValueAtTime(frequency, start);
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(preferences.soundVolume * .10, start + .01);
    gain.gain.exponentialRampToValueAtTime(.0001, start + .16);
    oscillator.connect(gain); gain.connect(audio.destination);
    oscillator.start(start); oscillator.stop(start + .17);
    oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
  });
}
export function previewSound(settings) { unlockAudio(settings); cue('craft'); }
export function battleSound(kind) { cue(kind); }
function productionFeedback(element, id, amount) {
  if (!element || document.querySelectorAll('.production-pop').length >= 6) return;
  const rect = element.getBoundingClientRect();
  if (rect.right <= 0 || rect.left >= innerWidth) return;
  const pop = document.createElement('span');
  pop.className = 'production-pop';
  pop.innerHTML = icon(id);
  const text = document.createElement('b');
  text.textContent = `+${Number(amount.toFixed(1))}`;
  pop.append(text);
  pop.style.left = `${Math.min(innerWidth - 65, Math.max(5, rect.left + rect.width / 2 - 24))}px`;
  pop.style.top = `${rect.top + 8}px`;
  document.body.append(pop);
  const animation = pop.animate([{ opacity: 0, transform: 'translateY(8px) scale(.8)' }, { opacity: 1, transform: 'translateY(-10px) scale(1)', offset: .2 }, { opacity: 0, transform: 'translateY(-42px) scale(1)' }], { duration: 1100, easing: 'ease-out' });
  animation.finished.catch(() => {}).finally(() => pop.remove());
}
function completionFeedback(state, previous) {
  const { RECIPES } = getCatalog(state);
  const equipment = Object.entries(state.run.equipment).find(([slot, item]) => item?.id && item.id !== previous.equipment[slot]);
  const facility = Object.entries(state.run.facilities).find(([id, level]) => level > (previous.facilities[id] || 0));
  const recipe = equipment ? RECIPES.find(r => r.id === equipment[1].id) : facility ? RECIPES.find(r => r.facility?.id === facility[0] && (r.level || 1) === facility[1]) : null;
  if (!recipe) return;
  document.querySelector('.completion-pop')?.remove();
  const pop = document.createElement('div');
  pop.className = 'completion-pop';
  pop.setAttribute('role', 'status');
  pop.innerHTML = icon(facility ? 'camp' : {weapon:'sword',armor:'shield',shield:'shield',tool:'hammer'}[equipment[0]] || 'spark');
  const text = document.createElement('div');
  const label = document.createElement('small');
  label.textContent = facility ? '村が育ちました' : '装備が完成';
  const name = document.createElement('strong');
  name.textContent = recipe.name;
  text.append(label, name); pop.append(text); document.body.append(pop);
  const animation = pop.animate([
    {opacity:0,transform:'translate(-50%,14px) scale(.9)'},
    {opacity:1,transform:'translate(-50%,0) scale(1)',offset:.12},
    {opacity:1,transform:'translate(-50%,0) scale(1)',offset:.8},
    {opacity:0,transform:'translate(-50%,-12px) scale(1)'},
  ], {duration:2300,easing:'ease-out'});
  animation.finished.catch(()=>{}).finally(()=>pop.remove());
}
export function updatePresentation(state) {
  preferences = state.settings;
  const next = { state, generation: state.meta.generation, logSeq: state.run.logSeq, resources: { ...state.run.resources }, equipment: Object.fromEntries(Object.entries(state.run.equipment).map(([slot,item]) => [slot,item?.id])), facilities: { ...state.run.facilities } };
  if (previous?.state === state && previous.generation === next.generation && !document.hidden) {
    const events = state.run.log.filter(entry => entry.id > previous.logSeq);
    const important = ['death', 'raid', 'victory', 'craft'].find(kind => events.some(entry => entry.type === kind));
    if (important) cue(important);
    if (state.settings.effectsEnabled && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      completionFeedback(state, previous);
      for (const [id, amount] of Object.entries(next.resources)) {
        if (amount <= previous.resources[id]) continue;
        const element = document.querySelector(`.resource-bar .resource[data-resource="${id}"]`) || [...document.querySelectorAll('.resource-bar .resource')].find(el => el.title === id);
        productionFeedback(element, id, amount - previous.resources[id]);
        element?.animate?.([{ boxShadow: 'inset 0 0 0 1px #d1b56b', backgroundColor: '#4b5030' }, { boxShadow: 'inset 0 0 0 1px transparent' }], { duration: 550 });
      }
      if (important === 'craft' || important === 'victory') document.querySelector('#active-work')?.animate?.([{ opacity: .65 }, { opacity: 1 }], { duration: 400 });
    }
  }
  previous = next;
}
