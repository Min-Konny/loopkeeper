import {PARTY,memberJoined,memberStats,memberFor}from './party.js?v=0.6.85';
import {fireballPower}from './magic-state.js?v=0.6.85';
export function partyMarkup(s,recipes=[]){
 if(s.version!==2)return '';
 return `<section class="party-panel"><h3>防衛隊</h3><p class="fine-print">前衛が攻撃を受け止め、後衛は自動攻撃。加入は永続、装備・訓練はこの命で育成。</p><div class="party-grid">${PARTY.map(m=>{
 const joined=memberJoined(s,m.id),b=memberStats(s,m.id),blocked=s.run.status!=='preparing'||s.run.augments.offer.length;
 return `<article class="party-member ${joined?'':'party-locked'}"><img src="./assets/pixel-v2/${m.image}" alt="" width="96" height="112"><div><h4>${m.name}</h4>${joined?`<strong>Lv.${b.level} · ${m.id==='mage'?'火球 '+fireballPower(s).toFixed(1):'攻撃 '+b.attack.toFixed(1)}</strong><small>${m.id==='archer'?(b.weapon?.combat.type==='crossbow'?'飛行に+35% / 防御45%無視':'飛行に+35% / 3射で敵防御低下'):'防御無視 / 燃焼 / MP自動回復'}</small><p>${b.weapon?.name||'初期装備'}</p><button class="button small" data-action="${m.action}" ${blocked?'disabled':''}>訓練する</button><div class="party-equipment">${recipes.filter(d=>memberFor(d.id)===m.id&&s.run.ownedEquipment?.includes(d.id)).map(d=>`<button class="button small muted" data-equip-equipment="${d.id}" aria-pressed="${b.weapon?.id===d.id}" ${blocked?'disabled':''}>${d.name}</button>`).join('')}</div>`:`<strong>WAVE ${m.wave} 撃破で加入</strong><small>加入時に専用装備と技能を解放</small>`}</div></article>`;
 }).join('')}</div></section>`;
}
export function mountBattleParty(host){
 host.innerHTML=PARTY.map(m=>`<div class="party-battle-member" data-member="${m.id}" hidden><img src="./assets/pixel-v2/${m.image}" width="100" height="112" alt="${m.name}"><div><b>${m.name}</b><small data-party-power></small><span class="party-cast-track"><i></i></span></div><span class="party-projectile" aria-hidden="true"></span></div>`).join('');
}
export function updateBattleParty(host,s,motion){
 for(const m of PARTY){const el=host.querySelector(`[data-member="${m.id}"]`);el.hidden=!memberJoined(s,m.id);if(el.hidden)continue;
 const b=memberStats(s,m.id),count=m.id==='archer'?s.run.party?.archerHits||0:s.run.magicState?.casts||0;
 const prior=Number(el.dataset.hits||0);if(count>prior&&motion){el.classList.remove('party-firing');void el.offsetWidth;el.classList.add('party-firing');}
 el.dataset.hits=count;el.querySelector('[data-party-power]').textContent=m.id==='archer'?`攻撃 ${b.attack.toFixed(1)}`:`MP ${Math.floor(s.run.magicState?.mana||0)}/30`;
 el.querySelector('i').style.width=Math.min(100,100*(m.id==='archer'?(s.run.party?.archerTimer||0)/b.interval:(s.run.magicState?.castTimer||0)/4))+'%';
 }
 host.hidden=!PARTY.some(m=>memberJoined(s,m.id));host.classList.toggle('party-still',!motion);
}
