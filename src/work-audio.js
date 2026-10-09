export function completedWorkKind(before, after) {
  if (before.paused || after.elapsed <= before.elapsed || after.status !== 'preparing') return null;
  const skill = before.actionSkill;
  if (!['logging', 'mining'].includes(skill) || after.skillXp[skill] <= before.skillXp[skill]) return null;
  return skill === 'logging' ? 'wood' : 'stone';
}

// Short original synthesized impacts; no external sound assets or downloads.
export function playWorkSound(audio, kind, volume) {
  if (!audio || audio.state !== 'running' || volume <= 0) return false;
  const stone = kind === 'stone', duration = stone ? .14 : .19;
  const start = audio.currentTime, level = Math.min(1, Math.max(0, volume));
  const buffer = audio.createBuffer(1, Math.ceil(audio.sampleRate * duration), audio.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const noise = audio.createBufferSource(), filter = audio.createBiquadFilter(), noiseGain = audio.createGain();
  noise.buffer = buffer;
  filter.type = stone ? 'highpass' : 'lowpass';
  filter.frequency.setValueAtTime(stone ? 1100 : 1400, start);
  noiseGain.gain.setValueAtTime(level * (stone ? .11 : .15), start);
  noiseGain.gain.exponentialRampToValueAtTime(.0001, start + duration);
  noise.connect(filter); filter.connect(noiseGain); noiseGain.connect(audio.destination);
  const tone = audio.createOscillator(), toneGain = audio.createGain();
  tone.type = 'sine';
  tone.frequency.setValueAtTime((stone ? 780 : 180) * (.96 + Math.random() * .08), start);
  tone.frequency.exponentialRampToValueAtTime(stone ? 520 : 85, start + duration);
  toneGain.gain.setValueAtTime(level * (stone ? .045 : .09), start);
  toneGain.gain.exponentialRampToValueAtTime(.0001, start + duration);
  tone.connect(toneGain); toneGain.connect(audio.destination);
  tone.onended = () => { for (const node of [noise, filter, noiseGain, tone, toneGain]) node.disconnect(); };
  noise.start(start); tone.start(start);
  noise.stop(start + duration); tone.stop(start + duration);
  return true;
}
