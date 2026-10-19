import {getClockStatus} from './engine.js?v=0.6.35';
import {preparationRoute} from './preparation-balance.js?v=0.6.35';
import {earlyRoutePoints} from './early-loop.js?v=0.6.35';
import {lateLoop,repeatRouteValue} from './late-loop.js?v=0.6.35';
import {ROUTES,canEnterRoute,routeEffects} from './routes.js?v=0.6.35';

const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const order=['forest','forest_depth','quarry','quarry_depth','marsh','marsh_depth','citadel','river','forge','observatory','ice'];
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
  return '<article class="route-card" data-route-card="'+d.id+'" data-route-state="'+(entry.ok?'ready':'blocked')+'">'
    +'<header><h4>'+esc(d.name)+'</h4><span class="route-danger">'+esc(d.danger)+'</span></header>'
    +'<p class="route-requirement">'+esc(requirement(d))+'</p>'
    +'<p class="route-main-reward">'+esc(routeBuffText(d.buff))+' <small>この命</small></p>'
    +'<p class="route-extra-reward">'+esc(pointReward(s,d))+(d.material?'／'+esc(d.materialName)+' +1/命':'')+'</p>'
    +(!entry.ok?'<p class="route-blocked">'+esc(entry.reason)+'</p>':'')
    +'<div class="route-card-actions"><details class="route-details" data-detail-key="route-detail-'+d.id+'"><summary data-focus="route-detail-'+d.id+'">敵・攻略の詳細</summary><p>HP '+d.hp+' / 攻撃 '+d.attack+' / 防御 '+d.defense+'</p><p>'+esc(d.hint)+'</p></details>'
    +'<button class="button small" data-route="'+d.id+'" data-focus="route-start-'+d.id+'" '+(entry.ok?'':'disabled')+' aria-label="'+esc(d.name)+'へ出発">出発</button></div></article>';
}
function result(s) {
  const last=s.run.routes?.last;if(!last)return '';
  const d=ROUTES.find(x=>x.id===last.id),clock=getClockStatus(s);
  const next=s.settings.paused?'時間停止中。次の道や作業を選べます。':clock.kind==='work'?'作業を再開：'+clock.label:clock.kind==='automation'||clock.kind==='wait'?'時間進行中：'+clock.label:'行動がないため時間停止中。次の道や作業を選べます。';
  return '<div class="route-result" role="status" tabindex="-1" data-focus="route-result"><strong>帰還：'+esc(d?.name)+' — '+esc(last.reason)+'</strong><span>'+Number(last.seconds).toFixed(1)+'秒／継承 +'+last.points+'pt'+(last.won&&d?.material?'／'+esc(d.materialName)+' +1':'')+'</span><p>'+esc(next)+'</p></div>';
}
export function routesMarkup(s,showCompleted=false) {
  if(s.version===1||s.meta.bestWave<3)return '';
  const {choices,completed,locked}=routeChoices(s),ready=choices.filter(x=>x.entry.ok).length;
  return '<section class="routes-panel" aria-label="寄り道"><div class="route-heading"><h3>寄り道</h3><span>任意・順番自由</span></div>'+result(s)
    +'<p class="route-duration">戦闘時間：最大30ゲーム秒／いつでも撤退</p><h4 class="route-group-title">'+(ready?'今行ける道 '+ready+'件':'今回の行き先')+'</h4>'
    +(choices.length?'<div class="route-grid">'+choices.map(x=>card(s,x)).join('')+'</div>':'<p class="routes-empty">今出発できる道はありません。'+(completed.length?'突破済みの道は次の命で再挑戦できます。':'この命でWAVE3突破後から出発できます。')+'</p>')
    +(locked.length?'<details class="route-fold" data-route-group="locked" data-detail-key="routes-locked"><summary data-focus="routes-locked">これから開く道 '+locked.length+'件</summary><ul class="route-goal-list">'+locked.map(d=>'<li data-route-goal="'+d.id+'"><strong>'+esc(d.name)+'</strong><span>'+esc(requirement(d))+'</span></li>').join('')+'</ul></details>':'')
    +(completed.length?'<details class="route-fold" data-route-group="completed" data-detail-key="routes-completed" '+(showCompleted?'open':'')+'><summary data-focus="routes-completed">この命でクリア済み '+completed.length+'件</summary><p>次の命で再挑戦できます。継承ptの初回報酬は重複しません。</p><ul class="route-goal-list">'+completed.map(d=>'<li data-route-completed="'+d.id+'"><strong>'+esc(d.name)+'</strong><span>'+esc(routeBuffText(d.buff))+'（適用中）</span></li>').join('')+'</ul></details>':'')
    +'<details class="route-guide route-fold" data-detail-key="route-guide"><summary data-focus="route-guide">共通ルール・獲得中の効果</summary><p>入口はこの命でWAVE3突破後。出発には次の本線襲撃まで30秒以上必要です。襲撃予定は変わりません。敗北時はHP1で帰還し、使った食料・錬金材料は戻りません。各地域は1回/命です。</p><p>獲得中：'+esc(routeBuffText(routeEffects(s))||'なし')+'。'+(lateLoop(s)?'星見・氷冠は永久突破済みでも各1継承pt/命。':'')+'専用素材は1個/命、永久保持して工房の装備に使えます。</p></details></section>';
}
