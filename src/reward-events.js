// Ephemeral inheritance-point ledger. XP never enters the notification queue.
const ledgers = new WeakMap();
const SCALE = 1e6;
export function recordReward(state, kind, skill, before, after) {
  if (kind !== 'points') return;
  if (!Number.isFinite(before) || !Number.isFinite(after)) return;
  const units = Math.round(after*SCALE) - Math.round(before*SCALE);
  if (units <= 0) return;
  let ledger=ledgers.get(state);if(!ledger){ledger=new Map();ledgers.set(state,ledger);}
  const key=kind+':'+(skill||'');
  const previous=ledger.get(key);
  ledger.set(key,{kind,skill:skill||'',units:(previous?.units||0)+units});
}
export function drainRewards(state) {
  const ledger=ledgers.get(state);ledgers.delete(state);
  return ledger ? [...ledger.values()] : [];
}
export function discardRewards(state) { ledgers.delete(state); }
export function createRewardBatcher() {
  let entries=new Map(), started=null, offline=false;
  return {
    add(rewards,now,catchup=false){
      rewards = rewards.filter(reward => reward.kind === 'points' && Number.isFinite(reward.units) && reward.units > 0);
      if (!rewards.length) return;
      if(started===null)started=now;
      offline ||= catchup;
      for(const reward of rewards){const key=reward.kind+':'+reward.skill,old=entries.get(key);entries.set(key,{...reward,units:(old?.units||0)+reward.units});}
    },
    take(now,ready=true){
      if(!ready||started===null||now-started<1200)return null;
      const batch={entries:[...entries.values()],offline};entries=new Map();started=null;offline=false;return batch;
    },
    clear(){entries.clear();started=null;offline=false;}
  };
}
