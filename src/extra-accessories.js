import {REGIONAL_ACCESSORIES}from './regional-content.js?v=0.6.20';
export const EXTRA_ACCESSORIES=[
 ...REGIONAL_ACCESSORIES,
 {id:'angler_pendant',name:'釣り人の首飾り',slot:'necklace',effect:{fishingSpeed:.15},description:'本人の釣り速度+15%。採集職人・料理・戦闘には効果なし。'},
 {id:'runner_boots',name:'疾走の靴',slot:'boots',effect:{haste:.1,defense:-2},description:'戦闘の攻撃速度+10%、防御−2。武器速度1.6倍が上限。'},
 {id:'work_boots',name:'作業の靴',slot:'boots',effect:{workSpeed:.1},description:'準備中の採集・製造速度+10%。訓練/採集職人/産卵の時計は変えない。'},
 {id:'sage_boots',name:'賢者の靴',slot:'boots',effect:{spellPower:.1,manaRegen:.25},description:'戦闘の魔法ダメージ+10%、MP再生+0.25/秒。最大MP30。'},
 {id:'battle_pendant',name:'戦士の首飾り',slot:'necklace',effect:{critPower:.15,defense:-1},description:'会心倍率+15%、防御−1。会心ゲージは指輪と継承で選ぶ。'},
 {id:'guild_pendant',name:'工匠の首飾り',slot:'necklace',effect:{workSpeed:.1},description:'準備中の採集・製造速度+10%。採集職人/産卵/訓練は別。'},
 {id:'ember_pendant',name:'火種の首飾り',slot:'necklace',effect:{spellPower:.15},description:'戦闘の魔法ダメージ+15%。物理会心・MP消費・呪文間隔は変えない。'},
];
export const EXTRA_ACCESSORY_RECIPES=EXTRA_ACCESSORIES.map(a=>({id:a.id,name:a.name,accessory:a.id,kind:'accessory',...(REGIONAL_ACCESSORIES.some(x=>x.id===a.id)?{campaign:'frontier36'}:{}),skill:'smithing',unlockLevel:2,unlockBestWave:3,knownAfterBoss:null,duration:18,cost:a.slot==='boots'?{wood:8,hide:6,ingot:2,gold:10}:{herbs:6,ingot:2,gold:10},yields:{},xpCoefficient:1,description:a.description+' 一度製造すると永久所持。'}));
