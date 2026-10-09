// A quiet, non-tonal wind bed. Kept separate from music and action effects.
export function createAmbience(context) {
  const buffer=context.createBuffer(1,context.sampleRate*4,context.sampleRate),data=buffer.getChannelData(0);
  let seed=7711,slow=0;
  for(let i=0;i<data.length;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;slow=.985*slow+.015*(seed/2147483648-1);data[i]=slow;}
  // Close the loop without a discontinuity.
  const fade=Math.min(1024,data.length/2);
  for(let i=0;i<fade;i++)data[data.length-fade+i]=data[data.length-fade+i]*(1-i/fade)+data[i]*(i/fade);
  const source=context.createBufferSource(),filter=context.createBiquadFilter(),gain=context.createGain();
  source.buffer=buffer;source.loop=true;filter.type='lowpass';filter.frequency.value=900;gain.gain.value=0;
  source.connect(filter);filter.connect(gain);gain.connect(context.destination);source.start();
  let last='';
  return {sync(volume,chapter,audible){const key=`${volume}:${chapter}:${audible}`;if(key===last)return;last=key;filter.frequency.setTargetAtTime([900,1400,550,1100,650,800,450][chapter]||900,context.currentTime,2);gain.gain.setTargetAtTime(audible?Math.max(0,Math.min(1,volume))*.6:0,context.currentTime,.25);},dispose(){source.stop();source.disconnect();filter.disconnect();gain.disconnect();}};
}
