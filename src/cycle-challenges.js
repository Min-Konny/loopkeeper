// Existing lives/instantiated battles keep their rules; subsequent lives opt in.
export function cycleEncounter(s,e){if(s.version!==2||s.meta.cycleGoalsVersion!==1||s.run.cycleGoalsVersion!==1||s.run.campaign!=='frontier36'||e.invasion||!e.isBoss)return e;const pressure={27:'rally',33:'sunder',36:'rally'}[e.wave];return pressure?{...e,pressure}:e;}
