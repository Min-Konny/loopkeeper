import {text as t,getUILocale} from './i18n.js?v=0.6.140';
import {copySpan,applyLocaleCopy} from './locale-controls.js?v=0.6.140';
import { villageEnemyArt } from './village-art.js?v=0.6.140';
import { frameStaticPortrait } from './portrait-frame.js?v=0.6.140';
import { workScene, syncWorkAnimation } from './work-scene.js?v=0.6.140';
import { icon } from './icons.js?v=0.6.140';
import { speedControls } from './interface-controls.js?v=0.6.140';
import { mountVillageScene } from './village-scene.js?v=0.6.140';

export const villageDashboardMarkup = `<section class="village-dashboard" data-ui-aria="village.dashboard" aria-label="${t('village.dashboard')}">
  <div class="village-view"><div class="village-landscape"></div>
    <div class="village-hud"><span>${copySpan('village.forest')} <small data-village-generation></small></span><button class="village-clock-control" data-command="pause" data-village-control>${t('controls.resume')}</button></div>
    <div class="village-speed" data-village-speed></div><div class="village-health"><span class="village-heading-label">${icon("shield")}${copySpan('village.hp')}</span><meter data-ui-aria="village.hp" aria-label="${t('village.hp')}" data-village-hp min="0" max="100" value="100"></meter><b data-village-health></b></div>
  </div>
  <aside class="village-raid village-panel"><div class="village-panel-heading"><span class="village-heading-label">${icon("sword")}${copySpan('village.raid')}</span><b data-village-wave></b></div>
    <div class="village-enemy-preview"><div class="village-enemy-art" data-village-enemy-art><img data-village-enemy-image alt=""></div><div class="village-enemy-copy"><h3 data-village-enemy></h3><p data-village-enemy-stats></p><strong class="village-countdown" data-village-countdown></strong></div></div>
    <button class="button gold-outline" data-village-results data-command="show-clear-results" hidden>${copySpan('village.results')}</button><button class="button gold-outline" data-village-equip data-tab="craft">${copySpan('village.equip')}</button>
    <div class="village-panel-heading village-queue-heading"><span class="village-heading-label">${icon("queue")}${copySpan('village.queue')}</span><button data-info="queue" data-ui-aria="village.editQueue" aria-label="${t('village.editQueue')}">${copySpan('village.edit')}</button></div>
    <ol data-village-queue></ol><small class="village-queue-more" data-village-queue-more></small><button class="button muted" data-tab="gather">${copySpan('village.choose')}</button>
  </aside>
  <div class="village-cards">
    <section class="village-panel village-work-panel"><div class="village-panel-heading"><span class="village-heading-label">${icon("axe")}${copySpan('village.work')}</span></div><div class="village-worker-row"><div class="village-worker-art" data-village-worker-art aria-hidden="true"></div><div class="village-worker-copy"><h3 data-village-work></h3><p data-village-work-detail></p></div></div><progress data-ui-aria="village.progress" aria-label="${t('village.progress')}" data-village-progress max="1" value="0"></progress><button class="button muted" data-tab="gather">${copySpan('village.gather')}</button></section>
    <section class="village-panel"><div class="village-panel-heading"><span class="village-heading-label">${icon("flag")}${copySpan('village.goal')}</span></div><div class="village-card-title"><span class="village-emblem" aria-hidden="true">${icon("flag")}</span><h3 data-village-goal></h3></div><p data-village-goal-detail></p><button class="button muted" data-info="quests">${copySpan('village.quests')}</button></section>
    <section class="village-panel"><div class="village-panel-heading"><span class="village-heading-label">${icon("bag")}${copySpan('village.reserves')}</span></div><h3 data-village-facilities></h3><div class="village-reserves" data-village-reserves></div><button class="button muted" data-info="status">${copySpan('village.status')}</button></section>
  </div>
</section>`;

export function mountVillageDashboard(root) {
  const scene=mountVillageScene(root.querySelector('.village-landscape'));
  const fields=new Map();
  const el=name=>{if(!fields.has(name))fields.set(name,root.querySelector(`[data-village-${name}]`));return fields.get(name);};
  const text=(name,value)=>{const node=el(name);if(node.textContent!==String(value))node.textContent=String(value);};
  let queueSignature='',reserveSignature='',workerSignature='',enemySignature='',locale='';
  el('speed').innerHTML=speedControls(1).replaceAll('data-focus="speed-','data-focus="village-speed-');
  const updateWork=(action,animate)=>{
    for(const portrait of el('worker-art').querySelectorAll('.work-vignette'))syncWorkAnimation(portrait,action,{animate});
    el('progress').value=action&&action.duration>0?Math.max(0,Math.min(1,action.progress/action.duration)):0;
  };
  return {
    updateWork,
    update(view) {
      if(locale!==getUILocale()){locale=getUILocale();applyLocaleCopy(root);root.setAttribute('aria-label',t('village.dashboard'));queueSignature='';workerSignature='';}
      el('results').hidden=!view.finished;el('equip').hidden=view.finished;el('enemy-art').hidden=view.finished;
      root.classList.toggle('village-finished',view.finished);
      scene.setState(view.village);scene.setActive(view.animate);
      const enemyKey=JSON.stringify([view.enemyData.id,view.enemyData.wave,view.enemyData.trait,view.enemyData.isBoss,view.routeId]);
      if(enemyKey!==enemySignature){
        enemySignature=enemyKey;const art=villageEnemyArt(view.enemyData,view.routeId),img=el('enemy-image');
        img.alt='';img.onerror=()=>{img.onerror=null;img.src=art.fallback;frameStaticPortrait(img,false);};
        img.src=art.source;frameStaticPortrait(img,art.generated);
      }
      const workerKey=JSON.stringify([view.worker,view.partyEquipment]);
      if(workerKey!==workerSignature){
        workerSignature=workerKey;
        el('worker-art').innerHTML=view.worker ? workScene(view.worker.skill,view.worker.id,view.worker.equipment,view.displayState)
          : '<div class="village-worker-idle">'+['logging','mining','foraging'].map((skill,index)=>workScene(skill,['chop_wood','quarry_stone','gather_food'][index])).join('')+'</div>';
      }
      updateWork(view.workerAction,view.workerAnimate);
      const reserves=JSON.stringify(view.reserves);
      if(reserves!==reserveSignature){reserveSignature=reserves;el('reserves').replaceChildren(...view.reserves.map(item=>{const row=document.createElement('span');row.innerHTML=icon(item.icon);row.setAttribute('role','img');row.setAttribute('aria-label',item.label+' '+item.fullAmount);row.title=item.label+' '+item.fullAmount;const label=document.createElement('span');label.textContent=item.label;const amount=document.createElement('b');amount.textContent=item.amount;row.append(label,amount);return row;}));}
      for(const key of ['generation','health','wave','enemy','enemy-stats','countdown','work','work-detail','goal','goal-detail','facilities']) text(key,view[key]);
      text('control',view.control);el('control').dataset.command=view.controlCommand || 'pause';el('control').disabled=Boolean(view.controlDisabled);
      for(const button of el('speed').querySelectorAll('[data-game-speed-choice]')){const n=Number(button.dataset.gameSpeedChoice);button.setAttribute('aria-pressed',String(n===(view.speed||1)));button.setAttribute('aria-label',t('speed.choice',{speed:n}));button.title=t('speed.hint',{speed:n});button.querySelector('small').textContent=t('speed.unit');}
      el('speed').querySelector('[role=group]').setAttribute('aria-label',t('speed.label'));
      text('queue-more',view.queueMore?t('village.more',{count:view.queueMore}):'');el('queue-more').hidden=!view.queueMore;
      el('hp').max=view.maxHp;el('hp').value=view.hp;el('progress').value=view.progress;
      const signature=JSON.stringify(view.queue);
      if(signature!==queueSignature){
        queueSignature=signature;
        const items=view.queue.length?view.queue:[{label:t('village.empty'),icon:'queue'}];
        el('queue').replaceChildren(...items.map((item,index)=>{const li=document.createElement('li');const order=document.createElement('span');order.className='village-queue-order';order.textContent=view.queue.length?String(index+1):'—';const art=document.createElement('span');art.className='village-queue-icon';art.innerHTML=icon(item.icon);const label=document.createElement('span');label.className='village-queue-label';label.textContent=item.label;li.append(order,art,label);return li;}));
      }
    },
    destroy(){scene.destroy();},
  };
}
