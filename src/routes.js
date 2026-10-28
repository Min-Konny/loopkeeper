import {OUTPOSTS,outpostId}from './settlement-content.js?v=0.6.136';
import {earlyRoutePoints}from './early-loop.js?v=0.6.136';
import {repeatRouteValue}from './late-loop.js?v=0.6.136';import {rewardRepeatRoute}from './progression-rewards.js?v=0.6.136';
import {FRONTIER_REGIONS}from './regional-content.js?v=0.6.136';
import {initializeRegionalRewards,awardRegionalMaterial}from './regional-rewards.js?v=0.6.136';
export const ROUTES=[
 {id:'forest',name:'風の森',danger:'通常・軽装飛行',hint:'弓の飛行特効。攻撃+2・木材作業10%短縮。',hp:130,attack:9,defense:2,trait:'flying',points:1,buff:{attack:2,loggingSpeed:.1}},
 {id:'quarry',name:'岩の峠',danger:'通常・重装',hint:'貫通・魔法が有効。防御+3。',hp:160,attack:8,defense:14,trait:'heavy',points:1,buff:{defense:3}},
 {id:'marsh',name:'霧の湿地',danger:'通常・連撃',hint:'防御・ポーションが有効。HP+20・MP再生+0.5/秒。',hp:110,attack:10,defense:5,trait:'combo',points:1,buff:{maxHp:20,manaRegen:.5}},
 {id:'citadel',name:'黒曜の砦',danger:'極危険・長期目標',hint:'初期戦力では困難。継承・貫通・回復を揃えて挑戦。攻撃+6。',hp:900,attack:60,defense:28,trait:'heavy',points:4,buff:{attack:6}},
];
// Entrance routes retain all existing rewards and strength. Depths are fixed optional goals.
ROUTES.splice(3,0,
 {id:'forest_depth',name:'風の森・奥地',parent:'forest',wave:6,danger:'中盤・軽装飛行',hint:'弓と回復で短期決戦。攻撃+2・木材作業5%短縮。',hp:380,attack:24,defense:8,trait:'flying',points:2,buff:{attack:2,loggingSpeed:.05}},
 {id:'quarry_depth',name:'岩の峠・奥地',parent:'quarry',wave:9,danger:'中盤・重装',hint:'硬い敵。貫通・魔法と耐久を両立。防御+3。',hp:900,attack:85,defense:40,trait:'heavy',points:2,buff:{defense:3}},
 {id:'marsh_depth',name:'霧の湿地・奥地',parent:'marsh',wave:12,danger:'高難度・連撃',hint:'連撃に備える。HP+20・MP再生+0.25/秒。',hp:4200,attack:290,defense:45,trait:'combo',points:2,buff:{maxHp:20,manaRegen:.25}},
);
ROUTES.push(...FRONTIER_REGIONS);
ROUTES.push({id:'lake',name:'静かな湖畔',danger:'序盤・連撃',hint:'防御と回復で備える。突破後は漁場を稼働。',hp:500,attack:25,defense:5,trait:'combo',points:1,buff:{}},
{id:'road',name:'交易街道',danger:'序盤・重装',hint:'貫通と訓練で備える。突破後は仕事場を稼働。',hp:620,attack:26,defense:12,trait:'heavy',points:1,buff:{}});

const routeGold={forest:12,quarry:18,marsh:12,forest_depth:30,quarry_depth:45,marsh_depth:60,citadel:60,river:75,forge:100,observatory:140,ice:180};
export const routeGoldReward=id=>routeGold[id]||0;
export const routeById=id=>ROUTES.find(x=>x.id===id);
export const freshRoutes=()=>({cleared:[],active:null,last:null});
export function initializeRoutes(s){if(s.version===1)return;s.meta.routeVersion=1;s.meta.routeClears??=[];s.run.routes??=freshRoutes();initializeRegionalRewards(s);for(const p of OUTPOSTS)if(s.run.routes.cleared.includes(p.id)&&!s.run.facilities[outpostId(p.id)])s.run.facilities[outpostId(p.id)]=1;}
export function routeEffects(s){return (s.run.routes?.cleared||[]).reduce((sum,id)=>{for(const [k,v]of Object.entries(OUTPOSTS.some(p=>p.id===id)?{}:routeById(id)?.buff||{}))sum[k]=(sum[k]||0)+v;return sum;},{});}
export function canEnterRoute(s,id){const d=routeById(id);if(!d)return {ok:false,reason:'不明な地域です。'};if(s.version===1||s.run.status!=='preparing'||s.run.wave<3||s.run.endless?.active||s.run.augments.offer.length)return {ok:false,reason:'この周回でWAVE3を突破した準備中に出発できます。'};if(d.campaign&&s.run.campaign!==d.campaign)return {ok:false,reason:'次の36波の人生で開放されます。'};if(d.campaign&&s.run.wave<d.wave)return {ok:false,reason:'この周回のWAVE'+d.wave+'突破後に出発できます。'};if(d.material&&(s.meta.trophyEarned?.[d.material]||0)>=1e9)return {ok:false,reason:'素材の保存上限です。'};if(d.parent&&(!s.run.routes?.cleared.includes(d.parent)||s.run.wave<d.wave))return {ok:false,reason:'この周回で入口を突破し、WAVE'+d.wave+'を撃退すると奥地へ進めます。'};if(s.meta.totalPoints+(!s.meta.routeClears?.includes(id)?earlyRoutePoints(s,d):repeatRouteValue(s,d))>1e9)return {ok:false,reason:'継承ポイントの保存上限です。'};if(s.run.routes?.cleared.includes(id))return {ok:false,reason:'この周回では突破済みです。'};if(OUTPOSTS.some(p=>p.id===id)&&!(s.run.facilities[outpostId(id)]>=1))return {ok:false,reason:'先に開拓工事を完了してください。'};if(s.run.nextWaveAt-s.run.elapsed<30)return {ok:false,reason:'次の本線襲撃まで30秒以上必要です。'};return {ok:true};}
export function finishRoute(s,won,reason){const active=s.run.routes?.active,d=routeById(active?.id);if(!d)return 0;let points=0;if(won){s.run.resources.gold=Math.min(1e9,s.run.resources.gold+routeGoldReward(d.id));s.run.routes.cleared.push(d.id);awardRegionalMaterial(s,d);if(!s.meta.routeClears.includes(d.id)){s.meta.routeClears.push(d.id);points=earlyRoutePoints(s,d);s.meta.points+=points;s.meta.totalPoints+=points;}else points=rewardRepeatRoute(s,d);}s.run.routes.last={id:d.id,won,reason,seconds:Math.max(0,s.run.elapsed-active.startedAt),points};s.run.routes.active=null;s.run.enemy=null;s.run.status='preparing';s.run.hp=Math.max(1,s.run.hp);return points;}
