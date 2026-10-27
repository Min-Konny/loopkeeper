import {preparationRevision}from './preparation-balance.js?v=0.6.112';
import {runSummary,runComparison}from './run-results.js?v=0.6.112';import {FREE_FEATURES}from './free-features.js?v=0.6.112';
const time=n=>n==null?'未記録':Math.round(n)+'秒';
const signed=n=>(n>0?'+':'')+Math.round(n);
function arrivalComparison(s,r,c){
 if(!c?.sameWall)return '<p>同じ難所の到達時間は、記録が揃う次の周回から比較できます。</p>';
 const previous=(s.meta.history||[]).find(x=>x.generation<s.meta.generation)?.result;
 const key=c.sameWall.real!=null?'real':'game',label=key==='real'?'稼働時間':'ゲーム内時間';
 const before=Math.round(previous.wallTime[key]),after=Math.round(r.wallReference[key]),difference=after-before;
 const change=difference<0?(-difference)+'秒短縮':difference>0?difference+'秒増加':'同じ';
 return '<p>前周の壁 WAVE '+c.sameWall.wave+'への到達：'+label+' '+before+'→'+after+'秒（'+change+'）</p>';
}
export function runResultMarkup(s){
 if(s.version===1)return '';
 const r=runSummary(s);if(!r)return '';
 const c=runComparison(s),xp=Object.keys(s.meta.skills).reduce((n,id)=>n+Math.max(0,s.meta.skills[id].xp-(s.run.startPermanentXp[id]||0)),0);
 const unlocks=r.freeUnlocks.map(id=>FREE_FEATURES.find(f=>f.id===id)?.name).filter(Boolean);
 const p=s.run.progression,study=s.run.earlyLoopVersion===1&&p?.startBestWave<=12;const repeat=p&&p.startBestWave>=(study?2:3)?'<p>前線の成果：'+(r.repeatPoints-(r.routeRepeatPoints||0))+'pt ・ 前回最高WAVE '+p.startBestWave+'の再突破で '+(study?Math.min(4,2+Math.floor(p.startBestWave/6)):Math.min(3,1+Math.floor(p.startBestWave/6)))+'pt、前線で敵HPを半分以上削って敗れた場合 '+(study?'W12まで+2pt、以降+1pt':'+1pt')+'（各1回）</p>':'';
 const learning=preparationRevision(s)&&p?.startBestWave>=3?'<p>前回最高まで戻り、新しい壁へ25%以上ダメージを与えて進展せずに敗れた人生は、通常の挑戦報酬に+1pt。</p>':'';
 const same=arrivalComparison(s,r,c);
 return '<section class="run-result"><h3>この命の成果</h3><p>撃退 '+r.wave+' WAVE'+(c?'（前周比 '+signed(c.wave)+' WAVE）':'')+' · 挑戦 '+r.wallWave+' WAVE'+'</p><p>ゲーム内 '+time(r.gameSeconds)+' · 稼働時間 '+time(r.realSeconds)+'</p>'+same+repeat+learning+(r.routeRepeatPoints?'<p>寄り道の再挑戦：'+r.routeRepeatPoints+'pt（星見・氷冠、各1回/人生）</p>':'')+'<p>持ち帰る成果：継承 '+r.pointsGained+'pt · 永続XP '+Math.round(xp)+'</p>'+(unlocks.length?'<p>無料解放：'+unlocks.join(' / ')+'</p>':'')+(r.partial?'<small>旧セーブのポイント獲得は、移行後から集計しています。</small>':'')+'<small>稼働時間は通常速度/周回復帰の加速を反映し、一時停止中の時間を含みません。</small></section>';
}
