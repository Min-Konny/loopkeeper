// Browser-only collection records. No currency, stats, or platform API calls.
import {MILESTONE_ACHIEVEMENTS,milestoneAchievementProgress} from './milestone-achievements.js?v=0.6.138';
export const REPLAY_ACHIEVEMENTS = [
  ...MILESTONE_ACHIEVEMENTS,
  {id:'frontier_clear',name:'夜明けを取り戻す',rule:'通常36波をクリア。旧セーブの36波クリア記録も対象。'},
  {id:'frontier_15_generations',name:'十五の灯で夜明けへ',rule:'新しい挑戦の第15世代以内に通常36波をクリア。縛りとの同時達成は不要。'},
  ...[['martial','武勇','弓術場'],['fortress','要塞','錬金工房'],['economy','経済','仕事場']].map(([type,label,facility])=>({id:'frontier_'+type,name:label+'の夜明け',rule:'挑戦全体で購入した追加オーグメント集は'+label+'だけ。その集を有効にして3世代以上を開始し、'+facility+'IIを一度建て、集が有効なまま通常36波をクリア。'})),
  {id:'frontier_without_towers',name:'自らの手で守る',rule:'新しい挑戦の全世代で弓塔・衛兵所の建設を開始せず、通常36波をクリア。仲間・防護柵・継承は利用可能。'},
  {id:'frontier_without_market',name:'自給の夜明け',rule:'新しい挑戦の全世代で市場の建設を開始せず、通常36波をクリア。行商人・外交・継承は利用可能。'},
];
const IDS=new Set(REPLAY_ACHIEVEMENTS.map(x=>x.id));
const TYPES=['martial','fortress','economy'];
const PACKS={martial:'martial_augments',fortress:'fortress_augments',economy:'economy_augments'};
const FACILITIES={martial:'archery_range',fortress:'laboratory',economy:'workhouse'};
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const integer=(x,min=0,max=1e9)=>Number.isInteger(x)&&x>=min&&x<=max;
let fallbackSequence=0;
function attemptId(){return globalThis.crypto?.randomUUID?.()||('local-'+Date.now().toString(36)+'-'+(++fallbackSequence));}
export function newReplayRecord(known=true){return {version:1,unlocked:[],attempt:{id:attemptId(),known,finished:false,generation:0,started:{martial:0,fortress:0,economy:0},packs:[],specialists:[],usedMarket:false,usedTowers:false}};}
export function validReplayRecord(s){
  if(s.replay===undefined)return true;
  const r=s.replay,a=r?.attempt;
  return object(r)&&r.version===1&&Array.isArray(r.unlocked)&&r.unlocked.length<=IDS.size&&new Set(r.unlocked.map(x=>x?.id)).size===r.unlocked.length&&r.unlocked.every(x=>object(x)&&IDS.has(x.id)&&integer(x.generation,1)&&Number.isFinite(x.seconds)&&x.seconds>=0&&x.seconds<=1e9)&&object(a)&&typeof a.id==='string'&&/^[a-zA-Z0-9-]{1,80}$/.test(a.id)&&typeof a.known==='boolean'&&typeof a.finished==='boolean'&&integer(a.generation,0,s.meta.generation)&&object(a.started)&&TYPES.every(t=>integer(a.started[t],0,a.generation))&&TYPES.reduce((n,t)=>n+a.started[t],0)<=a.generation&&['packs','specialists'].every(k=>Array.isArray(a[k])&&a[k].length<=3&&new Set(a[k]).size===a[k].length&&a[k].every(t=>TYPES.includes(t)))&&typeof a.usedMarket==='boolean'&&typeof a.usedTowers==='boolean';
}
export function initializeReplay(s,{fresh=false}={}){
  if(s.version!==2)return;
  s.replay??=newReplayRecord(fresh);
  observeReplay(s);
  // Only the ordinary clear is provable from an old save. Never infer constraints.
  const old=s.meta.firstFrontierClear;
  if(old&&!s.replay.unlocked.some(x=>x.id==='frontier_clear'))s.replay.unlocked.push({id:'frontier_clear',generation:old.generation,seconds:old.seconds});
}
export function observeReplay(s,recipe=null){
  recordReplayMilestones(s);
  const a=s.replay?.attempt;if(!a||a.finished)return;
  const owned=s.meta.upgrades||[],disabled=s.settings.disabledUpgrades||[];
  for(const t of TYPES){
    if(owned.includes(PACKS[t])&&!a.packs.includes(t))a.packs.push(t);
    if((s.run.facilities?.[FACILITIES[t]]||0)>=2&&!a.specialists.includes(t))a.specialists.push(t);
  }
  if(a.generation<s.meta.generation){
    // Only a single active collection at the generation boundary qualifies.
    const active=TYPES.filter(t=>owned.includes(PACKS[t])&&!disabled.includes(PACKS[t]));
    if(active.length===1)a.started[active[0]]++;
    a.generation=s.meta.generation;
  }
  const ids=[recipe?.facility?.id,recipe?.facilityId,...Object.keys(s.run.facilities||{}).filter(k=>s.run.facilities[k]>0)];
  if(ids.includes('market'))a.usedMarket=true;
  if(ids.some(id=>['archery_tower','guardhouse'].includes(id)))a.usedTowers=true;
}
// Independent unlock-event boundary: valid ownership/completion facts only.
// A paid recipe, reservation, or offered item does not qualify. No rewards.
export function recordReplayMilestones(s){
  if(s.version!==2||!s.replay)return [];
  const records=s.replay.unlocked;
  const events=MILESTONE_ACHIEVEMENTS.filter(d=>!records.some(x=>x.id===d.id)&&milestoneAchievementProgress(s,d).complete).map(d=>({id:d.id,generation:s.meta.generation,seconds:s.run.elapsed}));
  records.push(...events);return events;
}
// Stable platform-neutral unlock-event boundary. Called only at a genuine clear.
export function recordReplayClear(s){
  initializeReplay(s);observeReplay(s);
  const r=s.replay,a=r?.attempt;
  if(!r||a.finished||s.run.campaign!=='frontier36'||s.run.status!=='cleared'||s.run.wave!==36||s.run.endless?.active)return [];
  const ids=['frontier_clear'];
  if(a.known){
    if(s.meta.generation<=15)ids.push('frontier_15_generations');
    for(const t of TYPES)if(a.packs.length===1&&a.packs[0]===t&&a.started[t]>=3&&a.specialists.includes(t)&&s.meta.upgrades.includes(PACKS[t])&&!s.settings.disabledUpgrades.includes(PACKS[t]))ids.push('frontier_'+t);
    if(!a.usedTowers)ids.push('frontier_without_towers');
    if(!a.usedMarket)ids.push('frontier_without_market');
  }
  const events=ids.filter(id=>!r.unlocked.some(x=>x.id===id)).map(id=>({id,generation:s.meta.generation,seconds:s.run.elapsed}));
  r.unlocked.push(...events);a.finished=true;return events;
}
export function retainReplayCollection(next,current){
  if(next.version!==2)return next;
  initializeReplay(next);
  const records=[...(current.replay?.unlocked||[]),...next.replay.unlocked];
  next.replay.unlocked=records.filter((x,i)=>records.findIndex(y=>y.id===x.id)===i).map(x=>({...x}));
  const a=next.replay.attempt,previous=current.replay?.attempt;
  if(previous?.id===a.id){
    // Restoring an earlier snapshot of this same challenge cannot erase an
    // already-started forbidden building or a committed collection switch.
    a.known&&=previous.known;a.finished||=previous.finished;
    a.usedMarket||=previous.usedMarket;a.usedTowers||=previous.usedTowers;
    for(const k of ['packs','specialists'])a[k]=[...new Set([...previous[k],...a[k]])];
    // Do not add counts from parallel snapshots or credit future generations.
  }
  return next;
}
