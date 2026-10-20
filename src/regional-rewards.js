import {FRONTIER_REGIONS}from './regional-content.js?v=0.6.43';
export function initializeRegionalRewards(s){
 if(s.version===1)return;
 if(s.meta.regionalVersion===undefined){s.meta.regionalVersion=1;s.run.regionalClaims=[];}
 s.run.regionalClaims??=[];
}
export function awardRegionalMaterial(s,d){
 initializeRegionalRewards(s);
 if(!d.material||s.run.regionalClaims.includes(d.id))return;
 s.run.regionalClaims.push(d.id);
 s.meta.trophies[d.material]=(s.meta.trophies[d.material]||0)+1;
 s.meta.trophyEarned[d.material]=(s.meta.trophyEarned[d.material]||0)+1;
}
export function validRegionalRewards(s){
 const m=s.meta,r=s.run,ids=new Set(FRONTIER_REGIONS.map(d=>d.id));
 if(m.regionalVersion===undefined)return r.regionalClaims===undefined&&FRONTIER_REGIONS.every(d=>!m.trophyEarned?.[d.material]&&!r.routes?.cleared?.includes(d.id));
 if(m.regionalVersion!==1||!Array.isArray(r.regionalClaims)||new Set(r.regionalClaims).size!==r.regionalClaims.length||r.regionalClaims.some(id=>!ids.has(id)||!r.routes?.cleared?.includes(id)))return false;
 for(const d of FRONTIER_REGIONS){const earned=m.trophyEarned?.[d.material]||0;if(earned>m.generation||r.regionalClaims.includes(d.id)&&earned<1||r.routes?.cleared?.includes(d.id)&&!r.regionalClaims.includes(d.id))return false;}
 return true;
}
