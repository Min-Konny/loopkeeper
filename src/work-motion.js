// Presentation derives exclusively from the real paid batch progress. No timers or game writes.
const clamp=n=>Math.min(1,Math.max(0,Number.isFinite(n)?n:0));
export function workKind(skill,id=''){
 if(skill==='cooking')return'cooking';
 if(skill==='alchemy'||skill==='commerce')return'smithing';
 if(skill==='combat'&&['train_combat','train_defense','train_vitality'].includes(id))return'training';
 if(skill==='foraging')return id==='fish_river'?'fishing':'foraging';
 if(skill==='smithing'&&/^cook_/.test(id))return'cooking';
 if(skill==='logging')return'logging';
 if(skill==='mining')return'mining';
 if(skill==='smithing')return'smithing';
 return null;
}
export function workPose(kind,action,{animate=true}={}){
 const phase=animate?clamp(action?.progress/action?.duration):(['foraging','fishing','cooking'].includes(kind)?.4:.18);
 if(kind==='training'){const group=action?.id==='train_defense'?4:action?.id==='train_vitality'?8:0;return{phase,frame:group+(animate?Math.min(3,Math.floor(phase*4)):0),x:84,stage:phase<.25?'ready':phase<.5?'prepare':phase<.75?'effort':'recover',impact:0};}
 if(kind==='foraging'){
  const frame=Math.min(7,Math.floor(phase*8));return{phase,frame,x:phase<.2?58+phase*40:phase>.8?66-(phase-.8)*40:66,stage:phase<.2?'approach':phase<.55?'gather':phase<.8?'collect':'carry',impact:animate&&phase>=.35&&phase<.55?1:0};
 }
 if(kind==='fishing')return{phase,frame:phase<.2?Math.min(2,Math.floor(phase*15)):phase<.65?3:phase<.82?4+Math.min(1,Math.floor((phase-.65)/.17*2)):6+Math.min(1,Math.floor((phase-.82)/.18*2)),x:63,stage:phase<.2?'cast':phase<.65?'wait':phase<.82?'bite':'catch',impact:animate&&phase>=.65&&phase<.82?1:0};
 if(kind==='cooking')return{phase,frame:phase<.2?Math.min(1,Math.floor(phase*10)):phase<.75?2+Math.min(2,Math.floor((phase-.2)/.55*3)):phase<.88?5:6+Math.min(1,Math.floor((phase-.88)/.12*2)),x:66,stage:phase<.2?'material':phase<.75?'stir':phase<.88?'inspect':'finish',impact:0};
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
