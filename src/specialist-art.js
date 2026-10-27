import {SPECIALISTS}from './specialist-content.js?v=0.6.99';
export function specialistArtFile(id,level=1){const f=SPECIALISTS.find(f=>f.id===id);if(!f)return null;const n=Math.max(1,Math.min(3,Math.floor(Number(level)||1)));return ['kitchen','laboratory','workhouse','archery_range','arcane_study'].includes(id)&&n>1?'specialist-'+id+'-stage-'+n+'-v1.png':f.image;}
