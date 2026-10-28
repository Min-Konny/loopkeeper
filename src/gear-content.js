import {ACCESSORY_REQUIREMENTS,SPECIAL_MATERIALS} from './boss-materials.js?v=0.6.136';
import {EXTRA_ACCESSORIES,EXTRA_ACCESSORY_RECIPES}from './extra-accessories.js?v=0.6.136';
export const ACCESSORY_SLOTS=['ring','bracelet','boots','necklace'];
import {LATE_WEAPONS}from './late-weapons.js?v=0.6.136';
export const WEAPONS=[
 ...LATE_WEAPONS,
 {id:'iron_bow',name:'鉄弓',tier:2,slot:'weapon',skill:'smithing',unlockLevel:2,unlockBestWave:3,knownAfterBoss:null,duration:14,cost:{wood:16,ingot:4,hide:2},stats:{attack:10},xpCoefficient:1.05,combat:{type:'bow',rate:1.25,pierce:0,opening:.75,markEvery:3},description:'手数で攻める。3射ごとに敵防御を2減らす（最大30%）。先制1射。'},
 {id:'iron_crossbow',name:'鉄クロスボウ',tier:2,slot:'weapon',skill:'smithing',unlockLevel:2,unlockBestWave:3,knownAfterBoss:null,duration:18,cost:{wood:12,ingot:6,stone:4},stats:{attack:22},xpCoefficient:1.05,combat:{type:'crossbow',rate:.7,pierce:.45,opening:.75},description:'遅い一撃。敵防御45%を無視、会心威力+25%。先制1射。'},
];
export const ACCESSORIES=[
 {id:'tempo_ring',name:'疾風の指輪',slot:'ring',effect:{haste:.2,defense:-3},description:'攻撃速度+20%、防御−3。手数と耐久を選ぶ。'},
 {id:'steady_ring',name:'必中の指輪',slot:'ring',effect:{critRate:.25,critPower:.25},description:'会心ゲージ+25%。4撃ごとに会心、会心威力+25%。'},
 {id:'guard_bracelet',name:'返し刃の腕輪',slot:'bracelet',effect:{defense:4,counter:.2},description:'防御+4。敵の攻撃を生き残ると防御の20%で1回反撃。'},
 {id:'artisan_bracelet',name:'職人の腕輪',slot:'bracelet',effect:{workSpeed:.15},description:'準備中の採集・製作速度+15%。訓練は対象外。'},
];
export const ACCESSORY_RECIPES=ACCESSORIES.map(a=>({id:a.id,name:a.name,accessory:a.id,kind:'accessory',skill:'smithing',unlockLevel:2,unlockBestWave:3,knownAfterBoss:null,duration:16,cost:{wood:12,ingot:2,gold:8},yields:{},xpCoefficient:1,description:a.description+' 一度製作すると永久所持。'}));
ACCESSORIES.push(...EXTRA_ACCESSORIES);ACCESSORY_RECIPES.push(...EXTRA_ACCESSORY_RECIPES);
export const accessoryById=id=>ACCESSORIES.find(x=>x.id===id);
export const weaponById=id=>WEAPONS.find(x=>x.id===id);

for(const recipe of ACCESSORY_RECIPES){const [key,n,level,cost]=ACCESSORY_REQUIREMENTS[recipe.id];recipe.trophyCost={[key]:n};recipe.cost=cost;recipe.unlockLevel=level;recipe.unlockBestWave=SPECIAL_MATERIALS.find(x=>x.id===key).wave;}
