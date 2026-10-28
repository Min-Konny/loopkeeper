import{outpostArtMarkup}from './outpost-art.js?v=0.6.129';
import {hasUpgrade}from './free-features.js?v=0.6.129';
import {OUTPOSTS,outpostId,outpostRecipe,expeditionId}from './settlement-content.js?v=0.6.129';
import {allocationControls}from './settlement-ui.js?v=0.6.129';
import {outpostRate,staffing}from './settlement.js?v=0.6.129';
import {RECIPES,getRecipeCost,getActionDuration,canStartAction}from './mvp-engine.js?v=0.6.129';
import {getClockStatus} from './engine.js?v=0.6.129';
import {preparationRoute} from './preparation-balance.js?v=0.6.129';
import {earlyRoutePoints} from './early-loop.js?v=0.6.129';
import {lateLoop,repeatRouteValue} from './late-loop.js?v=0.6.129';
import {ROUTES,canEnterRoute,routeEffects,routeGoldReward} from './routes.js?v=0.6.129';

const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const order=['forest','lake','road','forest_depth','quarry','quarry_depth','marsh','marsh_depth','citadel','river','forge','observatory','ice'];
const labels={attack:'攻撃',defense:'防御',maxHp:'HP',manaRegen:'MP再生',loggingSpeed:'伐採速度'};
export function routeBuffText(buff={}) {
  return Object.entries(buff).filter(([,v])=>v).map(([k,v])=>(labels[k]||k)+'+'+(k==='loggingSpeed'?Math.round(v*100)+'%':v)+(k==='manaRegen'?'/秒':'')).join('・');
}
const requirement=d=>'この命でWAVE'+(d.wave||3)+'突破'+(d.parent?'・'+ROUTES.find(x=>x.id===d.parent).name+'突破':'');
const unlocked=(s,d)=>s.run.wave>=(d.wave||3)&&(!d.parent||s.run.routes?.cleared.includes(d.parent));
export function routeChoices(s) {
  const all=ROUTES.filter(d=>!d.campaign||d.campaign===s.run.campaign).map(d=>preparationRoute(s,d)).sort((a,b)=>order.indexOf(a.id)-order.indexOf(b.id));
  const completed=all.filter(d=>s.run.routes?.cleared.includes(d.id)),pending=all.filter(d=>!s.run.routes?.cleared.includes(d.id));
  const choices=pending.filter(d=>unlocked(s,d)).map(d=>({definition:d,entry:canEnterRoute(s,d.id)}));
  choices.sort((a,b)=>Number(b.entry.ok)-Number(a.entry.ok));
  return {choices,completed,locked:pending.filter(d=>!unlocked(s,d))};
}
function pointReward(s,d) {
  return !s.meta.routeClears?.includes(d.id)?'初回永久突破 +'+earlyRoutePoints(s,d)+'継承pt':repeatRouteValue(s,d)?'再挑戦 +'+repeatRouteValue(s,d)+'継承pt/命':'初回継承ptは獲得済み';
}
function card(s,{definition:d,entry}) {
  if(OUTPOSTS.some(p=>p.id===d.id))return outpostCard(s,d,entry);

  return '<article class="route-card" data-route-card="'+d.id+'" data-route-state="'+(entry.ok?'ready':'blocked')+'">'
    +'<header><h4>'+esc(d.name)+'</h4><span class="route-danger">'+esc(d.danger)+'</span></header>'
    +'<p class="route-requirement">'+esc(requirement(d))+'</p>'
    +'<p class="route-main-reward">'+esc(routeBuffText(d.buff))+' <small>この命</small></p>'
    +'<p class="route-extra-reward">'+esc(pointReward(s,d))+'／金貨 +'+routeGoldReward(d.id)+(d.material?'／'+esc(d.materialName)+' +1/命':'')+'</p>'
    +(!entry.ok?'<p class="route-blocked">'+esc(entry.reason)+'</p>':'')
    +'<div class="route-card-actions"><details class="route-details" data-detail-key="route-detail-'+d.id+'"><summary data-focus="route-detail-'+d.id+'">敵・攻略の詳細</summary><p>HP '+d.hp+' / 攻撃 '+d.attack+' / 防御 '+d.defense+'</p><p>'+esc(d.hint)+'</p></details>'
    +'<button class="button small" data-route="'+d.id+'" data-focus="route-start-'+d.id+'" '+(entry.ok?'':'disabled')+' aria-label="'+esc(d.name)+'へ出発">出発</button></div></article>';
}
function result(s) {
  const last=s.run.routes?.last;if(!last)return '';
  const d=ROUTES.find(x=>x.id===last.id),clock=getClockStatus(s);
  const next=s.settings.paused?'時間停止中。次の道や作業を選べます。':clock.kind==='work'?'作業を再開：'+clock.label:clock.kind==='automation'||clock.kind==='wait'?'時間進行中：'+clock.label:'行動がないため時間停止中。次の道や作業を選べます。';
  return '<div class="route-result" role="status" tabindex="-1" data-focus="route-result"><strong>帰還：'+esc(d?.name)+' — '+esc(last.reason)+'</strong><span>'+Number(last.seconds).toFixed(1)+'秒／継承 +'+last.points+'pt'+(last.won?'／金貨 +'+routeGoldReward(last.id):'')+(last.won&&d?.material?'／'+esc(d.materialName)+' +1':'')+'</span><p>'+esc(next)+'</p></div>';
}
export function routesMarkup(s,showCompleted=false) {
  if(s.version===1||s.meta.bestWave<3)return '';
  const {choices,completed,locked}=routeChoices(s),ready=choices.filter(x=>x.entry.ok).length;
  return '<section class="routes-panel" aria-label="開拓と遠征"><div class="route-heading"><h3>開拓と遠征</h3><button class="button small" data-tab="workers">人口を配分</button></div>'+result(s)
    +'<p class="route-duration">開拓工事 → 守護敵 → 人員を配置。襲撃の予定は進みます。</p><h4 class="route-group-title">'+(ready?'今行ける道 '+ready+'件':'今回の行き先')+'</h4>'
    +(choices.length?'<div class="route-grid">'+choices.map(x=>card(s,x)).join('')+'</div>':'<p class="routes-empty">今出発できる道はありません。'+(completed.length?'突破済みの道は次の命で再挑戦できます。':'この命でWAVE3突破後から出発できます。')+'</p>')
    +(locked.length?'<details class="route-fold" data-route-group="locked" data-detail-key="routes-locked"><summary data-focus="routes-locked">これから開く道 '+locked.length+'件</summary><ul class="route-goal-list">'+locked.map(d=>'<li data-route-goal="'+d.id+'"><strong>'+esc(d.name)+'</strong><span>'+esc(requirement(d))+'</span></li>').join('')+'</ul></details>':'')
    +completed.filter(d=>OUTPOSTS.some(p=>p.id===d.id)).map(d=>outpostCard(s,d,{ok:false})).join('')
    +(completed.filter(d=>!OUTPOSTS.some(p=>p.id===d.id)).length?'<details class="route-fold" data-route-group="completed" data-detail-key="routes-completed" '+(showCompleted?'open':'')+'><summary data-focus="routes-completed">この命でクリア済み '+completed.length+'件</summary><p>次の命で再挑戦できます。継承ptの初回報酬は重複しません。</p><ul class="route-goal-list">'+completed.filter(d=>!OUTPOSTS.some(p=>p.id===d.id)).map(d=>'<li data-route-completed="'+d.id+'"><strong>'+esc(d.name)+'</strong><span>'+esc(routeBuffText(d.buff))+'（適用中）</span></li>').join('')+'</ul></details>':'')
    +'<details class="route-guide route-fold" data-detail-key="route-guide"><summary data-focus="route-guide">共通ルール・獲得中の効果</summary><p>開拓拠点の生産は準備中のみ。人口は人員画面で共有します。初回突破後は次の命で再開拓を予約できます。入口はこの命でWAVE3突破後。出発には次の本線襲撃まで30秒以上必要です。襲撃予定は変わりません。敗北時はHP1で帰還し、使った食料・錬金材料は戻りません。各地域は1回/命です。</p><p>獲得中：'+esc(routeBuffText(routeEffects(s))||'なし')+'。'+(lateLoop(s)?'星見・氷冠は永久突破済みでも各1継承pt/命。':'')+'専用素材は1個/命、永久保持して工房の装備に使えます。</p></details></section>';
}

function outpostCard(s,d,entry){
 const p=OUTPOSTS.find(p=>p.id===d.id),level=s.run.facilities[outpostId(d.id)]||0,cleared=s.run.routes?.cleared.includes(d.id);
 const recipe=RECIPES.find(r=>r.id===outpostRecipe(d.id,Math.min(3,level+1))),active=s.run.activeAction?.id===recipe.id,suspended=s.run.suspendedActions[recipe.id];
 const costs=Object.entries(getRecipeCost(s,recipe)).map(([id,n])=>({wood:'木材',stone:'石材',gold:'金貨'}[id]||id)+' '+n).join(' / ');
 const buildCheck=canStartAction(s,recipe.id);
 const queue=s.run.queue.some(q=>q.id===expeditionId(d.id)),known=s.meta.routeClears?.includes(d.id),canBuild=canStartAction(s,recipe.id).ok;
 let controls='';
 if(!level||cleared&&level<3)controls=`<p>${costs} · ${getActionDuration(s,recipe).toFixed(1)}秒</p><div class="route-card-actions"><button class="button small gold-outline" data-action="${recipe.id}" data-focus="build-${recipe.id}" ${!canBuild?'disabled':''}>${active?'工事中':suspended?'工事を再開':level?'拠点を増築':'開拓工事'}</button>${hasUpgrade(s,'action_queue')?`<button class="button small" data-smart-craft="${recipe.id}" data-focus="queue-${recipe.id}" ${s.run.queue.some(q=>q.id===recipe.id)||active?'disabled':''}>材料集めから予約</button>`:''}</div>${!canBuild&&!active?`<small>${esc(buildCheck.reason)}</small>`:''}`;
 if(!cleared&&level)controls+=`<button class="button gold-outline" data-route="${d.id}" data-focus="route-${d.id}" ${!entry.ok?'disabled':''}>守護敵に挑む</button><small>${entry.ok?'':esc(entry.reason||'')}</small>`;
 if(!cleared&&known)controls+=`<button class="button small" data-reopen="${d.id}" data-focus="reopen-${d.id}" ${queue||!hasUpgrade(s,'action_queue')?'disabled':''}>${queue?'再開拓を予約済み':'再開拓を予約'}</button><small>材料調達・工事・守護敵まで。襲撃が近い時は保留。</small>`;
 return `<article class="route-card outpost-card" data-route-card="${d.id}">${outpostArtMarkup(p.id,level)}<header><h4>${p.name}${level?' '+['','I','II','III'][level]:''}</h4><span>${cleared?'稼働可能':level?'守護敵が残っています':'未開拓'}</span></header><p>${p.label} 約${outpostRate(s,p.id).toFixed(1)}個/分・人${level<3?' ／ 増築で人数枠・速度UP':''}</p>${cleared?allocationControls(s,outpostId(d.id),p.name):`<details><summary>守護敵</summary>HP ${d.hp} / 攻撃 ${d.attack} / 防御 ${d.defense} · 最大30秒<p>${esc(pointReward(s,d))}／金貨 +${routeGoldReward(d.id)}${d.material?'／'+esc(d.materialName)+' +1/命':''}</p></details>`}${controls}</article>`;
}
