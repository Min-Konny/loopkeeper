// Balance applies to new frontier lives; an imported/current life is never stamped on load.
export const lateLoop=s=>s?.version===2&&s.meta.lateLoopVersion===1&&s.run.lateLoopVersion===1&&s.run.campaign==='frontier36';
const attacks={18:285,19:230,20:285,24:375,25:285,26:310};
export const lateEncounter=(s,e)=>lateLoop(s)&&attacks[e.wave]?{...e,attack:attacks[e.wave]}:e;
export const lateRelief=(s,wave)=>lateLoop(s)&&[19,20,25,26].includes(wave);
export const repeatRouteValue=(s,d)=>lateLoop(s)&&['observatory','ice'].includes(d.id)&&s.meta.routeClears?.includes(d.id)?1:0;
