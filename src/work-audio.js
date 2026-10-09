export function workSoundKind(actionId, skill) {
  if (actionId === 'train_defense') return 'shield';
  if (actionId === 'train_vitality') return 'weight';
  if (skill === 'combat') return 'swing';
  if (actionId?.includes('fish') && !actionId?.includes('cook')) return 'fish';
  if (/cook|meal|stew|soup/.test(actionId || '')) return 'cook';
  if (skill === 'logging') return 'wood';
  if (skill === 'mining') return actionId === 'quarry_stone' || actionId === 'mine_coal' ? 'stone' : 'ore';
  if (skill === 'foraging') return 'leaves';
  if (skill === 'smithing') return /^(wooden_|work_tools$)/.test(actionId || '') ? 'wood' : 'metal';
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
// Original procedural foley. Material sounds use damped noise, not ringing
// oscillator chords. Three independently seeded takes avoid identical repeats.
export function createWorkSamples(kind, rate, take = 0) {
  const durations = {wood:.27,swing:.36,fish:.64,leaves:.38,stone:.25,ore:.28,metal:.34,shield:.26,weight:.27,cook:.48,steps:.35};
  const duration = durations[kind] || .6;
  const data = new Float32Array(Math.ceil(rate * duration));
  let seed = (0x9e3779b9 ^ (take + 1) * 7919 ^ [...kind].reduce((n,c)=>n*31+c.charCodeAt(0),0)) >>> 0;
  const noise = () => { seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5; return (seed >>> 0) / 2147483648 - 1; };
  const burst = (start, length, lowHz, highHz, gain, shape = 'hit') => {
    let low = 0, base = 0;
    const lowPass = 1 - Math.exp(-2*Math.PI*highHz/rate), highPass = 1 - Math.exp(-2*Math.PI*lowHz/rate);
    const first = Math.round(start*rate), count = Math.round(length*rate);
    for (let j = 0; j < count && first+j < data.length; j++) {
      low += lowPass*(noise()-low); base += highPass*(low-base);
      const u = j/count;
      const envelope = shape === 'air' ? Math.sin(Math.PI*u)**2 : Math.min(1,j/(rate*.002))*Math.exp(-u*7)*(1-u);
      data[first+j] += (low-base)*envelope*gain;
    }
  };
  const body = (start, length, hz, gain, decay) => {
    for (let j=0;j<length*rate && Math.round(start*rate)+j<data.length;j++) {
      const t=j/rate;
      data[Math.round(start*rate)+j] += Math.sin(2*Math.PI*hz*t)*Math.exp(-t*decay)*Math.min(1,t/.002)*gain;
    }
  };
  const shift = take * .003;
  switch (kind) {
    case 'wood':
      // Dry low knock, followed by tiny irregular fibre cracks. No ring.
      burst(.008,.095,55,1150,.9);
      burst(.016,.055,450,2400,.45);
      for (const t of [.047,.072,.11]) burst(t+shift,.027,700,3400,.13);
      break;
    case 'swing':
      // Smooth acceleration and deceleration of air; nothing is struck.
      burst(0,.34,170,2200,1.25,'air');
      burst(.09,.18,1400,5500,.30,'air');
      break;
    case 'fish':
      // Three wet tail flicks, not a continuous splash or a musical bubble.
      for (const [t,g] of [[.02,.85],[.22,.65],[.43,.5]]) {
        burst(t+shift,.06,150,2600,g);
        burst(t+.012+shift,.095,1100,5800,g*.23);
        body(t+shift,.028,130+take*9,g*.13,130);
      }
      break;
    case 'leaves':
      for (const t of [0,.065,.15]) burst(t+shift,.16,1100,6000,.36,'air');
      break;
    case 'stone':
      burst(.004,.065,170,2800,.9);burst(.02,.08,1600,6200,.32);
      for(const t of [.06,.095,.14]) burst(t+shift,.025,900,4600,.12);
      break;
    case 'ore':
      burst(.004,.06,220,3500,.8);burst(.025,.08,1300,6200,.28);
      body(.006,.095,1800+take*67,.07,55);
      break;
    case 'metal':
      burst(.004,.045,500,6200,.65);
      for (const [hz,g] of [[1531,.14],[2677,.07],[3911,.04]]) body(.005,.25,hz+take*17,g,24);
      break;
    case 'shield':
      burst(.004,.085,80,1700,1);body(.004,.12,185+take*11,.16,45);
      burst(.035,.06,800,3400,.15);break;
    case 'weight': case 'hit':
      burst(.005,.1,35,1000,1.15);burst(.022,.075,500,2800,.22);break;
    case 'cook':
      for (const t of [.01,.12,.20,.35]) burst(t+shift,.075,180,1900,.26);
      break;
    case 'steps':
      burst(.01,.10,60,1500,.7);burst(.21,.10,60,1500,.55);break;
    default: {
      const tones = {craft:[880,1403],heal:[740,1181],victory:[659,988,1318],warning:[392,629],raid:[98,203],death:[146,239]};
      for (const [j,hz] of (tones[kind] || []).entries()) body(j*.025,.45,hz,.15/(j+1),9);
    }
  }
  // Gentle boundary fades and headroom, without distortion or auto-normalizing
  // every subtle rustle to the same loudness as an impact.
  for (let i=0;i<data.length;i++) data[i] *= Math.min(1,i/(rate*.002),(data.length-1-i)/(rate*.015))*.85;
  return data;
}
function soundBuffer(audio, kind) {
  let bank = cache.get(audio); if (!bank) { bank = new Map(); cache.set(audio, bank); }
  if (!bank.has(kind)) bank.set(kind, Array.from({length:3}, (_, take) => {
    const data = createWorkSamples(kind,audio.sampleRate,take);
    const buffer = audio.createBuffer(1,data.length,audio.sampleRate);
    buffer.getChannelData(0).set(data);return buffer;
  }));
  return bank.get(kind)[Math.floor(Math.random()*3)];
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
