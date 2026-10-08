import { icon } from "./icons.js?v=0.2.7";
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
export function updatePresentation(state) {
  preferences = state.settings;
  const next = { state, generation: state.meta.generation, logSeq: state.run.logSeq, resources: { ...state.run.resources } };
  if (previous?.state === state && previous.generation === next.generation && !document.hidden) {
    const events = state.run.log.filter(entry => entry.id > previous.logSeq);
    const important = ['death', 'raid', 'victory', 'craft'].find(kind => events.some(entry => entry.type === kind));
    if (important) cue(important);
    if (state.settings.effectsEnabled && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
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
