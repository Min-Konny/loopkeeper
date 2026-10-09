import { completedQueueEntries } from './visual-design.js?v=0.3.6';
import { getCatalog } from "./engine.js?v=0.3.6";
import { icon } from "./icons.js?v=0.3.6";
import { availableDiscoveries } from './preparation-ui.js?v=0.3.6';
let audio;
let preferences = { soundVolume: 0.3, effectsEnabled: true };
let previous;
let queueEdited = false;
let pendingDiscoveries = [];
export function markQueueEdited() { queueEdited = true; }
const transientAnimations = new Set();
function trackTransient(animation) {
  transientAnimations.add(animation);
  animation.finished.catch(()=>{}).finally(()=>transientAnimations.delete(animation));
  return animation;
}
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
  const notes = { craft: [440, 660], victory: [392, 494, 587], raid: [110, 82], warning: [523, 392, 523], death: [196, 147, 98], heal: [660, 880], hit: [130] }[kind] || [440];
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
  const animation = trackTransient(pop.animate([{ opacity: 0, transform: 'translateY(8px) scale(.8)' }, { opacity: 1, transform: 'translateY(-10px) scale(1)', offset: .2 }, { opacity: 0, transform: 'translateY(-42px) scale(1)' }], { duration: 1100, easing: 'ease-out' }));
  animation.finished.catch(() => {}).finally(() => pop.remove());
}
function materialFlight(from, to, id, spent = false) {
  if (!from || !to || document.querySelectorAll('.material-flight').length >= 4 || document.querySelector('dialog[open]')) return;
  const a = from.getBoundingClientRect(), b = to.getBoundingClientRect();
  if (!a.width || !b.width || a.right <= 0 || b.right <= 0 || a.left >= innerWidth || b.left >= innerWidth) return;
  const particle = document.createElement('span');
  particle.className = `material-flight ${spent ? 'spent' : ''}`;
  particle.innerHTML = icon(id);
  particle.style.left = `${a.left + a.width / 2 - 12}px`;
  particle.style.top = `${a.top + a.height / 2 - 12}px`;
  document.body.append(particle);
  const dx = b.left + b.width / 2 - a.left - a.width / 2, dy = b.top + b.height / 2 - a.top - a.height / 2;
  const animation = trackTransient(particle.animate([{opacity:0,transform:'translate(0,0) scale(.6)'},{opacity:1,transform:`translate(${dx * .45}px,${dy * .45 - 22}px) scale(1.15)`,offset:.45},{opacity:0,transform:`translate(${dx}px,${dy}px) scale(.5)`}],{duration:650,easing:'ease-in-out'}));
  animation.finished.catch(()=>{}).finally(()=>particle.remove());
}
function discoveryFeedback(discoveries) {
  document.querySelector('.discovery-pop')?.remove();
  const pop = document.createElement('div');
  pop.className = 'completion-pop discovery-pop';
  pop.setAttribute('role','status');
  pop.innerHTML = icon(discoveries[0].icon);
  const text = document.createElement('div'), label = document.createElement('small'), name = document.createElement('strong');
  label.textContent = '新しい選択肢が解放';
  name.textContent = discoveries.slice(0,2).map(d=>d.name).join('・') + (discoveries.length > 2 ? ` ほか${discoveries.length - 2}件` : '');
  text.append(label,name);pop.append(text);document.body.append(pop);
  const animation = trackTransient(pop.animate([{opacity:0,transform:'translate(-50%,12px) scale(.94)'},{opacity:1,transform:'translate(-50%,0) scale(1)',offset:.12},{opacity:1,transform:'translate(-50%,0) scale(1)',offset:.82},{opacity:0,transform:'translate(-50%,-8px) scale(1)'}],{duration:2600,easing:'ease-out'}));
  animation.finished.catch(()=>{}).finally(()=>pop.remove());
}
function completionFeedback(state, previous) {
  const { RECIPES } = getCatalog(state);
  const equipment = Object.entries(state.run.equipment).find(([slot, item]) => item?.id && item.id !== previous.equipment[slot]);
  const facility = Object.entries(state.run.facilities).find(([id, level]) => level > (previous.facilities[id] || 0));
  const recipe = equipment ? RECIPES.find(r => r.id === equipment[1].id) : facility ? RECIPES.find(r => r.facility?.id === facility[0] && (r.level || 1) === facility[1]) : null;
  if (!recipe) return;
  const isFacility = !equipment && !!facility;
  document.querySelector('.completion-pop')?.remove();
  const pop = document.createElement('div');
  pop.className = 'completion-pop';
  pop.setAttribute('role', 'status');
  pop.innerHTML = icon(isFacility ? 'camp' : {weapon:'sword',armor:'shield',shield:'shield',tool:'hammer'}[equipment[0]] || 'spark');
  const text = document.createElement('div');
  const label = document.createElement('small');
  label.textContent = isFacility ? '村が育ちました' : '装備が完成';
  const name = document.createElement('strong');
  name.textContent = recipe.name;
  text.append(label, name); pop.append(text); document.body.append(pop);
  const animation = trackTransient(pop.animate([
    {opacity:0,transform:'translate(-50%,14px) scale(.9)'},
    {opacity:1,transform:'translate(-50%,0) scale(1)',offset:.12},
    {opacity:1,transform:'translate(-50%,0) scale(1)',offset:.8},
    {opacity:0,transform:'translate(-50%,-12px) scale(1)'},
  ], {duration:2300,easing:'ease-out'}));
  animation.finished.catch(()=>{}).finally(()=>pop.remove());
}
function queueFeedback(state, previous, next) {
  const advanced = !queueEdited && next.elapsed > previous.elapsed && next.xp > previous.xp;
  const completed = completedQueueEntries(previous.queue,next.queue,advanced);
  const host = document.querySelector('#queue-preview');
  if (!host || host.hidden || host.getBoundingClientRect().width === 0) return;
  if (completed.length) {
    const names = getCatalog(state);
    const rect=host.getBoundingClientRect();
    const pop=document.createElement('div');pop.className='queue-completion';
    const name=[...names.ACTIONS,...names.RECIPES].find(d=>d.id===completed[0].id)?.name || '';
    pop.textContent=`✓ ${name} 完了`;
    pop.style.left=`${rect.left+12}px`;pop.style.top=`${rect.top+70}px`;pop.style.width=`${Math.max(100,rect.width-24)}px`;
    document.body.append(pop);
    const animation=trackTransient(pop.animate([{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)',offset:.2},{opacity:0,transform:'translateY(-28px)'}],{duration:950,easing:'ease-out'}));
    animation.finished.catch(()=>{}).finally(()=>pop.remove());
  }
  const first=next.queue[0];
  if (first && (first.goalId !== previous.queue[0]?.goalId || first.count !== previous.queue[0]?.count)) {
    host.querySelector('[data-preview-goal]')?.animate?.([{backgroundColor:'#596148',transform:'translateY(7px)'},{backgroundColor:'transparent',transform:'translateY(0)'}],{duration:600,easing:'ease-out'});
  }
}
export function updatePresentation(state) {
  preferences = state.settings;
  const discoveries = availableDiscoveries(state);
  const unseen = state.meta.discovered ? discoveries.filter(d => !state.meta.discovered.includes(d.id)) : [];
  if (previous?.state !== state || previous.generation !== state.meta.generation) pendingDiscoveries = [];
  pendingDiscoveries.push(...unseen);
  state.meta.discovered = [...new Set([...(state.meta.discovered || []), ...discoveries.map(d=>d.id)])];
  if (!state.settings.effectsEnabled || document.hidden || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    for (const animation of transientAnimations) animation.cancel();
    transientAnimations.clear();
  }
  const next = { actionId:state.run.activeAction?.id, batchKey:state.run.activeAction ? `${state.run.activeAction.id}:${state.run.activeAction.instanceId}` : null, elapsed:state.run.elapsed, remaining:state.run.nextWaveAt-state.run.elapsed, nextWaveAt:state.run.nextWaveAt, xp:Object.values(state.run.skills).reduce((sum,skill)=>sum+skill.xp,0), queue:state.run.queue.map(entry=>({...entry})), state, generation: state.meta.generation, logSeq: state.run.logSeq, resources: { ...state.run.resources }, equipment: Object.fromEntries(Object.entries(state.run.equipment).map(([slot,item]) => [slot,item?.id])), facilities: { ...state.run.facilities } };
  if (previous?.state === state && previous.generation === next.generation && !document.hidden) {
    if (!state.settings.paused && state.run.status === 'preparing' && previous.nextWaveAt === next.nextWaveAt && previous.remaining > 15 && next.remaining <= 15) cue('warning');
    const events = state.run.log.filter(entry => entry.id > previous.logSeq);
    const important = ['death', 'raid', 'victory', 'craft'].find(kind => events.some(entry => entry.type === kind));
    if (important) cue(important);
    if (state.settings.effectsEnabled && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      if (pendingDiscoveries.length && !document.querySelector("dialog[open]")) { discoveryFeedback(pendingDiscoveries); pendingDiscoveries = []; }
      completionFeedback(state, previous);
      queueFeedback(state,previous,next);
      for (const [id, amount] of Object.entries(next.resources)) {
        const element = document.querySelector(`.resource-bar .resource[data-resource="${id}"]`) || [...document.querySelectorAll('.resource-bar .resource')].find(el => el.title === id);
        if (amount < previous.resources[id] && state.run.status === 'preparing' && state.run.activeAction?.kind === 'craft' && next.batchKey !== previous.batchKey) materialFlight(element, document.querySelector('.work-vignette'), id, true);
        if (amount <= previous.resources[id]) continue;
        if (next.elapsed > previous.elapsed && state.run.status === 'preparing' && [...getCatalog(state).ACTIONS,...getCatalog(state).RECIPES].find(d=>d.id===previous.actionId)?.yields?.[id]) materialFlight(document.querySelector('.work-vignette'), element, id);
        productionFeedback(element, id, amount - previous.resources[id]);
        element?.animate?.([{ boxShadow: 'inset 0 0 0 1px #d1b56b', backgroundColor: '#4b5030' }, { boxShadow: 'inset 0 0 0 1px transparent' }], { duration: 550 });
      }
      if (important === 'craft' || important === 'victory') document.querySelector('#active-work')?.animate?.([{ opacity: .65 }, { opacity: 1 }], { duration: 400 });
    }
  }
  previous = next;
  queueEdited = false;
}
