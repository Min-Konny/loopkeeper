export const WORKER_NAMES={lumber_worker:'木こり',mining_worker:'採掘師',foraging_worker:'採集人',processing_worker:'加工職人'};
export const WORKER_MAX_RANK=20;
export const workerRankId=(id,n)=>n===1?id:`${id}_rank_${n}`;
export function workerRank(owner,id){let rank=owner.upgrades?.includes(id)?1:0;for(let n=2;n<=20;n++){if(!owner.upgrades?.includes(workerRankId(id,n)))break;rank=n;}return rank;}
export function workerLevel(id,n){const growth=1+.3*(n-1)+.025*(n-1)**2;return {level:n-1,goldCost:0,interval:id==='processing_worker'?null:Math.round(({lumber_worker:60,mining_worker:70,foraging_worker:80}[id]/growth)*100)/100,quantity:1,recipeDurationMultiplier:id==='processing_worker'?Math.round(6/(1+.18*(n-1))*100)/100:null,maxResourceTier:n>=10?7:n>=5?4:2,unlockBestWave:0};}
export function workerRankDescription(id,n){const l=workerLevel(id,n);return l.interval?`${l.interval}秒ごとに1個 · 永続Lv ${n}/20`:`製作時間の${l.recipeDurationMultiplier}倍で加工 · 永続Lv ${n}/20`;}
export const WORKER_RANK_UPGRADES=Object.keys(WORKER_NAMES).flatMap(id=>Array.from({length:19},(_,i)=>{const n=i+2;return{id:workerRankId(id,n),name:WORKER_NAMES[id]+' Lv.'+n,cost:Math.ceil(n/4),kind:'worker',workerId:id,workerRank:n,rank:n,unlock:{requires:[workerRankId(id,n-1)]},effect:{profession:id},description:workerRankDescription(id,n)};}));
export function visibleWorkerUpgrade(u,owner){if(!u.workerId)return true;const rank=workerRank(owner,u.workerId);return u.workerRank===rank||u.workerRank===rank+1;}
export function migrateWorkerRanks(s){if(s.version!==2)return;for(const id of Object.keys(WORKER_NAMES)){const w=s.run.workers[id];if(w)w.level=Math.max(0,workerRank(s.meta,id)-1);}s.meta.workerTrainingVersion=1;}
