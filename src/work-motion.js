// Presentation derives exclusively from the real paid batch progress. No timers or game writes.
const clamp=n=>Math.min(1,Math.max(0,Number.isFinite(n)?n:0));
export function workKind(skill,id=''){
 if(skill==='logging')return'logging';
 if(skill==='mining')return'mining';
 if(skill==='smithing')return'smithing';
 return null;
}
export function workPose(kind,action,{animate=true}={}){
 const phase=animate?clamp(action?.progress/action?.duration):.18;
 if(kind==='logging'){
  if(phase<.18)return{phase,frame:Math.min(3,Math.floor(phase/.045)),x:48+phase/.18*20,stage:'approach',impact:0};
  if(phase<.72){const hit=(phase-.18)/.54;return{phase,frame:4+Math.min(3,Math.floor(hit*4)),x:68,stage:hit<.5?'swing':'impact',impact:hit>=.5&&hit<.86?1:0};}
  return{phase,frame:8+Math.min(3,Math.floor((phase-.72)/.28*4)),x:68-(phase-.72)/.28*20,stage:'carry',impact:0};
 }
 if(kind==='mining'){
  const strike=phase<.76;return{phase,frame:strike?Math.min(3,Math.floor(phase/.76*4)):4+Math.min(3,Math.floor((phase-.76)/.24*4)),x:68,stage:strike?(phase<.38?'swing':'impact'):'collect',impact:phase>=.38&&phase<.66?1:0};
 }
 if(kind==='smithing'){
  if(phase<.2)return{phase,frame:4,x:68,stage:'material',impact:0};
  if(phase<.8){const hit=(phase-.2)/.6;return{phase,frame:Math.min(3,Math.floor(hit*4)),x:68,stage:hit<.5?'swing':'impact',impact:hit>=.5&&hit<.86?1:0};}
  const frame=/smelt/.test(action?.id||'')?4:/sword|blade/.test(action?.id||'')?(phase<.94?5:6):0;
  return{phase,frame,x:68,stage:'finish',impact:0};
 }
 return{phase,frame:0,x:68,stage:'ready',impact:0};
}
