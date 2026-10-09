export function workSoundKind(actionId, skill) {
  if (actionId === 'train_defense') return 'shield';
  if (actionId === 'train_vitality') return 'weight';
  if (skill === 'combat') return 'swing';
  if (actionId?.includes('fish') && !actionId?.includes('cook')) return 'water';
  if (/cook|meal|stew|soup/.test(actionId || '')) return 'cook';
  if (skill === 'logging') return 'wood';
  if (skill === 'mining') return actionId === 'quarry_stone' || actionId === 'mine_coal' ? 'stone' : 'ore';
  if (skill === 'foraging') return 'leaves';
  if (skill === 'smithing') return /wood|spear|work_tools/.test(actionId || '') ? 'wood' : 'metal';
  return null;
}
export function completedWorkKind(before, after) {
  if (before.paused || after.elapsed <= before.elapsed || after.status !== 'preparing') return null;
  const skill = before.actionSkill;
  const training = before.actionId === 'train_defense' ? 'defense' : before.actionId === 'train_vitality' ? 'vitality' : null;
  const gained = training ? (after.trainingXp?.[training] || 0) > (before.trainingXp?.[training] || 0) : (after.skillXp?.[skill] || 0) > (before.skillXp?.[skill] || 0);
  if (!gained || before.actionKind === 'craft') return null;
  return workSoundKind(before.actionId, skill);
}
export function workImpactKind(before, after) {
  if (before.paused || after.paused || after.status !== 'preparing' || after.elapsed <= before.elapsed || before.batchKey !== after.batchKey || !after.batchKey) return null;
  const impactAt = after.actionDuration * .55;
  return before.actionProgress < impactAt && after.actionProgress >= impactAt ? workSoundKind(after.actionId, after.actionSkill) : null;
}
const cache = new WeakMap();
// Original physical-style synthesis: filtered texture and irregular resonances,
// rather than a pitched electronic beep. No third-party samples are used.
function soundBuffer(audio, kind) {
  let bank = cache.get(audio); if (!bank) { bank = new Map(); cache.set(audio, bank); }
  if (bank.has(kind)) return bank.get(kind);
  const textures = {swing:[.30,900,5200],leaves:[.38,1300,7000],water:[.44,120,1800],cook:[.42,90,1300],steps:[.35,60,1000]};
  const impacts = {wood:[.25,[173,327,511,743],9],stone:[.24,[680,1231,2197,3371],15],ore:[.32,[920,1687,2813,4021],12],metal:[.45,[1130,1771,2687,4223],8],shield:[.32,[210,431,837,1319],10],weight:[.28,[89,173,311],14],hit:[.22,[110,231,457],14]};
  const bells = {craft:[.45,[880,1403,2077],8],heal:[.50,[740,1181,1757],6],victory:[.65,[659,988,1318],5],warning:[.6,[392,629,947],6],raid:[.6,[98,203,317],5],death:[.65,[146,239,367],5]};
  const texture = textures[kind], impact = impacts[kind] || bells[kind] || impacts.wood;
  const duration = texture?.[0] || impact[0], rate = audio.sampleRate;
  const buffer = audio.createBuffer(1, Math.ceil(rate * duration), rate), data = buffer.getChannelData(0);
  let low = 0, highBase = 0;
  const cutoff = texture?.[2] || 6500, highCut = texture?.[1] || 60;
  const a = 1 - Math.exp(-2 * Math.PI * cutoff / rate), b = 1 - Math.exp(-2 * Math.PI * highCut / rate);
  for (let i = 0; i < data.length; i++) {
    const t = i / rate, noise = Math.random() * 2 - 1;
    low += a * (noise - low); highBase += b * (low - highBase);
    let value;
    if (texture) {
      const u = t / duration;
      const swell = Math.sin(Math.PI * u) ** (kind === 'swing' ? 2 : 1);
      const pulses = kind === 'steps' ? Math.exp(-t * 38) + .7 * Math.exp(-Math.abs(t - .20) * 65) : kind === 'leaves' ? .6 + .4 * Math.sin(t * 95) ** 2 : 1;
      value = (low - highBase) * swell * pulses;
      if (kind === 'water' || kind === 'cook') value += .13 * Math.sin(2 * Math.PI * (170 * t + 140 * t * t)) * Math.exp(-t * 8);
    } else {
      value = (low - highBase) * Math.exp(-t * 85) * .8;
      impact[1].forEach((f, j) => { value += Math.sin(2 * Math.PI * f * t) * Math.exp(-t * impact[2] * (1 + j * .25)) * .26 / (j + 1); });
      value *= Math.min(1, t / .002);
    }
    data[i] = Math.tanh(value * 1.4) * Math.min(1, (duration - t) / .025);
  }
  bank.set(kind,buffer);return buffer;
}
export function playWorkSound(audio, kind, volume) {
  if (!audio || audio.state !== 'running' || volume <= 0) return false;
  const source = audio.createBufferSource(), gain = audio.createGain();
  source.buffer = soundBuffer(audio,kind);
  if (source.playbackRate) source.playbackRate.value = .97 + Math.random() * .06;
  gain.gain.setValueAtTime(Math.min(1,Math.max(0,volume)) * .34,audio.currentTime);
  source.connect(gain);gain.connect(audio.destination);
  source.onended = () => {source.disconnect();gain.disconnect();};
  source.start(audio.currentTime);return true;
}
