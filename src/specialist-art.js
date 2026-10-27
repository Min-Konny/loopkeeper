import {SPECIALISTS}from './specialist-content.js?v=0.6.94';
export function specialistArtFile(id,level=1){const f=SPECIALISTS.find(f=>f.id===id);if(!f)return null;const n=Math.max(1,Math.min(3,Math.floor(Number(level)||1)));return id==='kitchen'&&n>1?'specialist-kitchen-stage-'+n+'-v1.png':f.image;}
