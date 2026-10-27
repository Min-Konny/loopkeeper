import {runSummary} from './run-results.js?v=0.6.112';
import {ACCESSORIES} from './gear-content.js?v=0.6.112';
import {OUTPOSTS} from './settlement-content.js?v=0.6.112';
import {REPLAY_ACHIEVEMENTS} from './replay-achievements.js?v=0.6.112';
import {MILESTONES} from './engine.js?v=0.6.112';
const esc=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ids=x=>Array.isArray(x)?x:[];
export const isFrontierFinish=s=>s.version===2&&s.run.campaign==='frontier36'&&s.run.status==='cleared'&&s.run.wave===36&&!s.run.endless?.active;
export function finishToken(s){return isFrontierFinish(s)?[s.replay?.attempt.id||'old',s.meta.generation,s.run.clearRecord?.seconds??Math.floor(s.run.elapsed)].join(':'):null;}
const KEY='loopkeeper-finish-dismissed-v1';
export function finishDismissed(storage,s){const token=finishToken(s);try{return !!token&&storage.getItem(KEY)===token;}catch{return false;}}
export function dismissFinish(storage,s){const token=finishToken(s);if(token)try{storage.setItem(KEY,token);}catch{/* Presentation preference must never block progression. */}}
export function permanentGains(s){
 const r=s.run.results,summary=runSummary(s);
 if(s.version!==2||!r||!summary)return null;
 const names=(list,defs)=>list.map(id=>defs.find(d=>d.id===id)?.name||id);
 return {points:summary.pointsGained,xp:Math.round(Object.entries(s.meta.skills).reduce((n,[id,skill])=>n+Math.max(0,skill.xp-(s.run.startPermanentXp?.[id]||0)),0)),partial:r.partial,
  accessories:Array.isArray(r.startAccessories)?names(ids(s.meta.accessories).filter(id=>!r.startAccessories.includes(id)),ACCESSORIES):null,
  outposts:Array.isArray(r.startRouteClears)?names(ids(s.meta.routeClears).filter(id=>!r.startRouteClears.includes(id)),OUTPOSTS):null,
  achievements:ids(s.run.clearAchievements).map(id=>REPLAY_ACHIEVEMENTS.find(d=>d.id===id)?.name).filter(Boolean)};
}
export function permanentGainsMarkup(s){
 const g=permanentGains(s);if(!g)return '';
 return '<section class="permanent-gains" data-permanent-gains><h3>今回、次へ持ち帰るもの</h3><p><b>継承 +'+g.points+' pt</b> ・ 永続XP +'+g.xp+'</p>'+
  (g.accessories===null||g.outposts===null?'<p class="fine-print">この世代の解放内訳は旧保存に記録されていません。既存の永久所持・開拓記録は保持されています。</p>':
   '<p>新しい永久アクセサリー：'+(g.accessories.length?g.accessories.map(esc).join('、'):'今回の追加なし')+'</p><p>新たに開拓した地域：'+(g.outposts.length?g.outposts.map(esc).join('、'):'今回の追加なし')+'</p>')+
  (g.achievements.length?'<p>今回解除したリプレイ実績：'+g.achievements.map(esc).join('、')+'</p>':'')+
  (g.partial?'<small>旧保存の途中から記録しているため、上の集計は記録開始以降です。</small>':'')+'</section>';
}
export function nextPermanentTargets(s){return MILESTONES.filter(q=>!s.meta.completedMilestones.includes(q.id)).slice(0,2);}
export function nextPermanentTargetsMarkup(s){
 if(s.version!==2)return '';
 const targets=nextPermanentTargets(s);
 return '<section class="next-permanent-targets"><h3>次に狙える永続成果</h3>'+(targets.length?targets.map(q=>'<p><b>'+esc(q.name)+' ・ '+q.reward+'pt</b><br><small>'+esc(q.description||'')+'</small></p>').join(''):'<p>初達成目標はすべて達成済み。別構成の実績やエンドレスの記録に挑戦できます。</p>')+'<small>この挑戦で未達成の目標です。今すぐ作れるとは限りません。条件と解放はクエストから確認できます。</small></section>';
}
export function finishChoicesMarkup(s){
 if(!isFrontierFinish(s))return '';
 const next=REPLAY_ACHIEVEMENTS.filter(d=>!ids(s.replay?.unlocked).some(x=>x.id===d.id)).slice(0,2);
 return '<section class="frontier-resolution" data-frontier-resolution><span class="finish-kicker">通常クリア · 36 / 36 WAVE</span>'+permanentGainsMarkup(s)+'<div class="finish-choices"><div><button class="button gold" data-command="start-endless">エンドレスへ続ける</button><small>現在の装備・施設・資源で37波以降へ。通常クリアは達成済みです。</small></div><div><button class="button gold-outline" data-command="rebirth">継承して次の世代へ</button><small>ポイント・永続経験・解放を引き継ぎ、装備と施設を建て直します。</small></div><div><button class="button muted" data-command="reset-menu">別の構成で新しい挑戦</button><small>第1世代から再出発。解除済み実績と音・演出の設定を残します。確認画面が開きます。</small></div></div>'+(next.length?'<p class="finish-next-replay">次の挑戦候補：'+next.map(d=>esc(d.name)).join(' ／ ')+'。詳しい条件は下のリプレイ実績で確認できます。</p>':'<p>リプレイ実績はすべて解除済みです。</p>')+nextPermanentTargetsMarkup(s)+'</section>';
}
export function finishReturnMarkup(s){return isFrontierFinish(s)?'<button class="button gold pause-button" data-command="show-clear-results" data-focus="clear-results" aria-label="クリア結果を見る">クリア結果を見る</button>':'';}
export function mountFrontierFinish(dialog,s){
 if(!isFrontierFinish(s))return;
 const title=dialog.querySelector('#death-title'),lead=dialog.querySelector('.dialog-lead');
 title.textContent=s.meta.firstFrontierClear?.generation===s.meta.generation?'夜明けを取り戻した。':'もう一度、夜明けへ。';
 lead.textContent='第'+s.meta.generation+'世代で全36波を守り抜きました。通常の物語はここで一区切りです。';
 for(const n of dialog.querySelectorAll(':scope > .death-emblem,:scope > .eyebrow,:scope > .death-tip,:scope > .fine-print,:scope > [data-command="rebirth"],:scope > [data-command="start-endless"]'))n.remove();
 const wrapper=dialog.ownerDocument.createElement('div');wrapper.innerHTML=finishChoicesMarkup(s);const resolution=wrapper.firstElementChild;lead.after(resolution);
 const detail=dialog.ownerDocument.createElement('details');detail.className='finish-details';detail.innerHTML='<summary>戦闘と継承の詳しい記録</summary>';
 for(const n of [...dialog.children])if(n!==title&&n!==lead&&n!==resolution&&!n.matches('.replay-achievements'))detail.append(n);
 dialog.append(detail);const close=dialog.ownerDocument.createElement('button');close.className='icon-button finish-close';close.dataset.close='death-dialog';close.setAttribute('aria-label','結果を閉じる');close.autofocus=true;close.textContent='×';dialog.append(close);
}
