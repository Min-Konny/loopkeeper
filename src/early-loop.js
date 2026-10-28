import {battleFood}from './meals.js?v=0.6.122';
import {preparationDefinition}from './preparation-balance.js?v=0.6.122';
// Local W1–12 study only. Unstamped saves retain released rules.
export const earlyLoop=s=>s?.version===2&&s.meta.earlyLoopVersion===1&&s.run.earlyLoopVersion===1;
export const earlyJobMultiplier=id=>['fish_river','mine_coal','mine_silver','smelt_steel'].includes(id)?2:1;
export function earlyDefinition(s,d,{paid=false}={}){
 d=preparationDefinition(s,d);
 if(!d||!earlyLoop(s)||d.earlyLoopDefinition||(s.meta.earlyLoopBatching===false||d.id==='fish_river'&&s.meta.earlyLoopFishBatching===false)&&!paid)return d;
 const multiplier=earlyJobMultiplier(d.id);if(multiplier===1)return d;
 return {...d,earlyLoopDefinition:true,earlyLoopUnits:multiplier,duration:d.duration*multiplier,
  yields:Object.fromEntries(Object.entries(d.yields||{}).map(([k,n])=>[k,n*multiplier])),
  ...(d.cost?{cost:Object.fromEntries(Object.entries(d.cost).map(([k,n])=>[k,n*multiplier]))}:{}),
  description:(d.description||'')+'（試作：2回分をまとめる。量・素材・XPも2倍）'};
}
export function earlyEncounter(s,e){if(!earlyLoop(s)||e.wave>14)return e;const attacks={6:105,7:72,8:76,12:190,13:138,14:148};return {...e,...(attacks[e.wave]?{attack:attacks[e.wave]}:{}),...([7,8,13,14].includes(e.wave)?{pressure:null}:{})};}
export const earlyRoutePoints=(s,d)=>earlyLoop(s)&&s.run.wave<=12&&d.id==='citadel'?2:d.points;
export function earlyDefeatMarkup(s){
 if(!earlyLoop(s)||!['dead','legacy_setup'].includes(s.run.status)||!s.run.battleReports?.length)return '';
 const current=s.run.battleReports[0],previous=(s.meta.history||[]).find(h=>h.generation<s.meta.generation&&h.result?.earlyLoopVersion===1)?.result;
 const remaining=current.maxHp?Math.round(current.remainingHp/current.maxHp*100):0;
 let comparison='';if(previous?.wallWave===current.wave&&previous.enemyRemainingPercent!=null)comparison=`前回の同じ壁：敵HP ${previous.enemyRemainingPercent}% → 今回 ${remaining}%。`;
 const hasFood=battleFood(s)>0,usedFood=current.foodHealing>0;
 const advice=!hasFood
  ? usedFood?'ポーションを使い切った。補充するか、防御・火力で消費を抑えよう。':'ポーションを用意するか、火力で戦闘を短くしよう。'
  : usedFood?'ポーションは残った。ポーションで回復しても押し切られたため、防御・火力・救護の配分を見直そう。':'ポーションを使う前に倒れた。HP・防御や先に倒す火力を確保しよう。';

 const missing=[];if(current.wave===6){if((s.run.equipment.shield?.tier||0)<2)missing.push('鉄の盾');if((s.run.facilities.infirmary||0)<2)missing.push('救護所II');}if(current.wave===12){if((s.run.equipment.armor?.tier||0)<4)missing.push('銀の防具');if((s.run.equipment.shield?.tier||0)<4)missing.push('銀の盾');}
 return `<section class="defeat-report"><h3>次の再挑戦へ</h3><p>${comparison||'今回の壁：敵HP '+remaining+'%まで削った。'}</p><p>この人生の再挑戦報酬 ${(s.run.progression?.checkpointAward||0)+(s.run.progression?.attemptAward||0)+(s.run.progression?.routeAward||0)} pt。永続経験は保持。</p>${missing.length?'<p>この壁までに未完成：'+missing.join('・')+'。次の人生はこの準備を先に。</p>':''}<p>${advice}</p></section>`;
}
