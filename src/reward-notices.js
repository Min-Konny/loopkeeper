import { drainRewards, discardRewards, createRewardBatcher } from './reward-events.js?v=0.6.28';
const format=new Intl.NumberFormat('ja-JP',{maximumFractionDigits:6});
export function rewardRows(state,batch) {
  return batch.entries.filter(entry=>entry.kind==='points' && entry.units>0).map(entry=>({label:'継承ポイント',amount:format.format(entry.units/1e6),kind:'points',skill:''}));
}
export function createRewardDisplay(document,clock=()=>performance.now()) {
  const batcher=createRewardBatcher();
  let bound,boundRun,boundGeneration,ownedBefore=false,feed,announcer,active=false,until=0,lastUpdate=0,lastAnnouncement=-Infinity,focusBefore;
  function hide(){if(feed)feed.hidden=true;active=false;}
  function setup(){
    if(feed)return;
    feed=document.createElement('aside');feed.id='reward-feed';feed.hidden=true;feed.setAttribute('aria-label','継承ポイントの獲得');
    announcer=document.createElement('div');announcer.className='reward-announcer';announcer.setAttribute('role','status');announcer.setAttribute('aria-live','polite');announcer.setAttribute('aria-atomic','true');
    document.body.append(feed,announcer);
  }
  function bind(state,{owned=false}={}){
    if(bound!==state||boundRun!==state.run||boundGeneration!==state.meta.generation||ownedBefore!==owned){if(bound)discardRewards(bound);discardRewards(state);batcher.clear();hide();bound=state;boundRun=state.run;boundGeneration=state.meta.generation;ownedBefore=owned;}
  }
  function update(state,{owned=false,hidden=false,catchup=false}={}){
    bind(state,{owned});
    if(!owned){discardRewards(state);return;}
    const now=clock();batcher.add(drainRewards(state),now,catchup||hidden);
    if(hidden){hide();lastUpdate=now;return;}
    const priority=!!document.querySelector('.completion-pop,dialog[open]');
    if(priority){if(active){until+=Math.max(0,now-lastUpdate);feed.hidden=true;}lastUpdate=now;return;}
    lastUpdate=now;
    if(active){feed.hidden=false;if(now>=until&&!feed.contains(document.activeElement))hide();else return;}
    const batch=batcher.take(now);if(!batch)return;
    setup();feed.replaceChildren();feed.classList.toggle('reward-static',!state.settings.effectsEnabled);
    const heading=document.createElement('div');heading.className='reward-heading';
    const title=document.createElement('strong');title.textContent=batch.offline?'留守中・復帰時の継承ポイント獲得':'継承ポイントを獲得';
    const close=document.createElement('button');close.type='button';close.className='reward-close';close.textContent='×';close.setAttribute('aria-label','獲得通知を閉じる');
    focusBefore=document.activeElement;close.addEventListener('click',()=>{const focused=feed.contains(document.activeElement);hide();if(focused){if(focusBefore?.isConnected&&focusBefore!==document.body&&!focusBefore.disabled)focusBefore.focus();else document.querySelector('[data-tab].selected')?.focus();}});
    heading.append(title,close);feed.append(heading);
    const list=document.createElement('dl');list.className='reward-rows';list.tabIndex=0;list.setAttribute('aria-label','獲得量');
    const rows=rewardRows(state,batch);for(const row of rows){const pair=document.createElement('div'),label=document.createElement('dt'),amount=document.createElement('dd');label.textContent=row.label;amount.textContent='＋'+row.amount;pair.append(label,amount);list.append(pair);}
    feed.append(list);feed.hidden=false;active=true;until=now+4000;
    const points=rows.find(row=>row.kind==='points');
    if(points||now-lastAnnouncement>=8000){announcer.textContent=(batch.offline?'留守中の獲得。':'')+(points?'継承ポイント＋'+points.amount+'。':'');lastAnnouncement=now;}
  }
  return {bind,update};
}
