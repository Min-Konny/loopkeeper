import {REGIONAL_MATERIALS,REGIONAL_REQUIREMENTS}from './regional-content.js?v=0.6.126';
import {WORK_MILESTONES,workMaterialById}from './work-milestone-content.js?v=0.6.126';
// Permanent trophies never enter ordinary inventory, shops or worker targets.
export const BOSS_MATERIALS = [
 ['wolf_fang','群狼の牙','forest_chief','群狼の主',3],
 ['iron_badge','鉄牙の徽章','ironfang_captain','鉄牙の隊長',6],
 ['twin_seal','双刃の印','twinblade_raider','双刃の襲撃者',9],
 ['silver_crown','白銀の王冠片','silver_bandit_king','白銀の略奪王',12],
 ['colossus_core','巨兵の核','mountain_colossus','山嶺の巨兵',15],
 ['crystal_heart','守護者の結晶','crystal_guardian','水晶の守護者',18],
 ['dawn_sigil','夜明けの封印','dawn_gate_king','夜明けを塞ぐ王',21],
].map(([id,name,boss,enemy,wave])=>({id,name,boss,enemy,wave}));
export const ACCESSORY_REQUIREMENTS = {
 guard_bracelet:['wolf_fang',2,2,{wood:16,ingot:4,gold:12}],
 artisan_bracelet:['iron_badge',2,4,{steel_ingot:4,wood:20,gold:16}],
 work_boots:['iron_badge',2,4,{steel_ingot:3,hide:8,gold:16}],
 runner_boots:['twin_seal',2,6,{steel_ingot:5,hide:10,gold:20}],
 tempo_ring:['twin_seal',3,6,{steel_ingot:6,gold:24,herbs:8}],
 steady_ring:['silver_crown',2,8,{silver_ingot:6,gold:30,herbs:10}],
 guild_pendant:['silver_crown',3,8,{silver_ingot:5,wood:24,gold:28}],
 battle_pendant:['colossus_core',2,10,{mithril_ingot:6,hide:10,gold:35}],
 sage_boots:['crystal_heart',2,12,{diamond:4,herbs:20,gold:40}],
 ember_pendant:['dawn_sigil',2,12,{orichalcum_ingot:6,herbs:24,gold:45}],
};
export const LEGACY_ACCESSORY_REQUIREMENTS={...ACCESSORY_REQUIREMENTS};
Object.assign(ACCESSORY_REQUIREMENTS,{
 artisan_bracelet:['artisan_mark',1,3,{wood:20,ingot:6,gold:16}],
 work_boots:['timber_mark',1,2,{wood:16,ingot:4,hide:8,gold:16}],
 guild_pendant:['forge_mark',1,6,{steel_ingot:6,wood:24,gold:24}],
 runner_boots:['iron_badge',2,4,{steel_ingot:5,hide:10,gold:20}],
 angler_pendant:['river_pearl',1,2,{wood:10,ingot:3,fish:12,gold:12}],
});
Object.assign(ACCESSORY_REQUIREMENTS,REGIONAL_REQUIREMENTS);
export const SPECIAL_MATERIALS=[...BOSS_MATERIALS,...REGIONAL_MATERIALS,...WORK_MILESTONES.map(x=>({id:x.material,name:x.name,wave:x.wave,work:x}))];
export function trophyCost(id,version=2){const r=(version===1?LEGACY_ACCESSORY_REQUIREMENTS:ACCESSORY_REQUIREMENTS)[id];return r?{[r[0]]:r[1]}:{};}
const jobs=s=>[s.run.activeAction,...Object.values(s.run.suspendedActions||{})].filter(Boolean);
export function initializeTrophies(s){
 if(s.meta.trophyVersion===undefined){
  s.meta.trophyVersion=1;s.meta.trophies={};s.meta.trophyEarned={};s.meta.trophySpent={};
  // Only batches already paid under the old rules are grandfathered.
  for(const a of jobs(s))if(ACCESSORY_REQUIREMENTS[a.id])a.trophyReceipt={version:0,cost:{}};
 }
 s.run.trophyClaims??=BOSS_MATERIALS.filter(x=>x.wave<=s.run.wave).map(x=>x.boss);
}
export function awardTrophy(s,e){
 initializeTrophies(s);
 const m=BOSS_MATERIALS.find(x=>x.boss===e.id&&x.wave===e.wave);
 if(!m||!e.boss||s.run.endless?.active||s.run.routes?.active||s.run.trophyClaims.includes(e.id))return null;
 s.run.trophyClaims.push(e.id);
 s.meta.trophies[m.id]=(s.meta.trophies[m.id]||0)+1;
 s.meta.trophyEarned[m.id]=(s.meta.trophyEarned[m.id]||0)+1;
 return m;
}
export function trophyShortage(s,id){
 for(const [key,n]of Object.entries(trophyCost(id))){const have=s.meta.trophies?.[key]||0,m=SPECIAL_MATERIALS.find(x=>x.id===key);if(have<n&&m.work)return `${m.name}が${n-have}不足。${m.work.label} ${Math.min(m.work.count,s.meta.workCounts?.[m.work.id]||0)}/${m.work.count}回完了（素材獲得は一度・永久保持）。`;if(have<n&&m.region)return `${m.name}が${n-have}不足。${m.enemy}を突破（1周回1個・永久保持）。`;if(have<n)return `${m.name}が${n-have}不足。WAVE ${m.wave}「${m.enemy}」を撃退（1周回1個・転生後も保持）。`;}
 return '';
}
export function payTrophies(s,id){
 initializeTrophies(s);const cost=trophyCost(id);
 if(!Object.keys(cost).length)return undefined;
 if(trophyShortage(s,id))throw Error('専用素材が不足しています。');
 for(const[k,n]of Object.entries(cost)){s.meta.trophies[k]-=n;s.meta.trophySpent[k]=(s.meta.trophySpent[k]||0)+n;}
 return {version:1,recipeVersion:2,cost};
}
export function refundUnfinishedTrophies(s){
 initializeTrophies(s);const seen=new Set();
 for(const a of jobs(s))if(a.trophyReceipt?.version===1&&!seen.has(a.instanceId)){
  seen.add(a.instanceId);for(const[k,n]of Object.entries(a.trophyReceipt.cost)){s.meta.trophies[k]=(s.meta.trophies[k]||0)+n;s.meta.trophySpent[k]-=n;}
  delete a.trophyReceipt;
 }
}
export function validTrophies(s){
 const m=s.meta,r=s.run,object=x=>x&&typeof x==='object'&&!Array.isArray(x),count=x=>Number.isSafeInteger(x)&&x>=0&&x<=1e9;
 if(m.trophyVersion===undefined)return m.trophies===undefined&&m.trophyEarned===undefined&&m.trophySpent===undefined&&r.trophyClaims===undefined&&jobs(s).every(a=>a.trophyReceipt===undefined);
 if(m.trophyVersion!==1)return false;
 const keys=new Set((m.workMilestoneVersion===1?SPECIAL_MATERIALS:BOSS_MATERIALS).filter(x=>!x.region||m.regionalVersion===1).map(x=>x.id));
 for(const map of[m.trophies,m.trophyEarned,m.trophySpent])if(!object(map)||Object.entries(map).some(([k,n])=>!keys.has(k)||!count(n)))return false;
 for(const k of keys)if((m.trophies[k]||0)+(m.trophySpent[k]||0)!==(m.trophyEarned[k]||0))return false;
 if(!Array.isArray(r.trophyClaims)||new Set(r.trophyClaims).size!==r.trophyClaims.length||r.trophyClaims.some(id=>!BOSS_MATERIALS.some(x=>x.boss===id)))return false;
 const escrow={},seen=new Set();
 for(const a of jobs(s)){
  const receipt=a.trophyReceipt,recipeVersion=receipt?.recipeVersion??(m.workMilestoneVersion===undefined?1:2),expected=trophyCost(a.id,recipeVersion);
  if(receipt?.version===1&&(![1,2].includes(recipeVersion)||m.workMilestoneVersion===1&&receipt.recipeVersion===undefined))return false;
  if(!Object.keys(expected).length){if(receipt!==undefined)return false;continue;}
  if(!object(receipt)||!object(receipt.cost)||seen.has(a.instanceId))return false;
  seen.add(a.instanceId);
  if(receipt.version===0){if(Object.keys(receipt.cost).length) return false;continue;}
  if(receipt.version!==1||Object.keys(receipt.cost).length!==Object.keys(expected).length||Object.entries(expected).some(([k,n])=>receipt.cost[k]!==n))return false;
  for(const[k,n]of Object.entries(receipt.cost))escrow[k]=(escrow[k]||0)+n;
 }
 return Object.entries(escrow).every(([k,n])=>n<=(m.trophySpent[k]||0));
}
export function trophyMarkup(s,id,paid=false){
 return Object.entries(trophyCost(id)).map(([key,n])=>{const m=SPECIAL_MATERIALS.find(x=>x.id===key),have=s.meta.trophies?.[key]||0;return `<p class="boss-material ${!paid&&have<n?'insufficient':''}"><strong>${m.name} ${paid?'支払済み':`${have} / ${n}`}</strong><small>${m.work?`${m.work.label} ${Math.min(m.work.count,s.meta.workCounts?.[m.work.id]||0)}/${m.work.count}回完了 · ${s.meta.workClaims?.includes(m.work.id)?'素材獲得済み':'未達成'} · 一度だけ獲得・永久保持`:m.region?`${m.enemy}突破 · この周回WAVE${m.wave}から · 1周回1個 · 永久保持`:`WAVE ${m.wave}「${m.enemy}」撃退 · 1周回1個 · 永久保持`}</small></p>`;}).join('');
}
