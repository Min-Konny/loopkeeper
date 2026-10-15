// Fixed optional goals. Depths of existing regions are not additional regions.
export const FRONTIER_REGIONS=[
 {id:'river',name:'渓流の集落',wave:6,campaign:'frontier36',danger:'中盤・連撃',hint:'料理と耐久で連撃を受ける。HP+25・MP再生+0.25/秒。',hp:420,attack:32,defense:10,trait:'combo',image:'assets/raider.svg',points:2,buff:{maxHp:25,manaRegen:.25},material:'river_token',materialName:'渓流の結び石'},
 {id:'forge',name:'灰燼の工房街',wave:12,campaign:'frontier36',danger:'後半・装甲',hint:'貫通・魔法と回復の両立。攻撃+3。',hp:1450,attack:110,defense:48,trait:'armor',image:'assets/knight.svg',points:2,buff:{attack:3},material:'forge_token',materialName:'灰燼の鋼印'},
 {id:'observatory',name:'星見の遺跡',wave:18,campaign:'frontier36',danger:'後半・飛行',hint:'弓の飛行特効・魔法と耐久。HP+10・MP再生+0.25/秒。',hp:3100,attack:195,defense:28,trait:'flying',image:'assets/winged.svg',points:2,buff:{maxHp:10,manaRegen:.25},material:'star_token',materialName:'星見の欠片'},
 {id:'ice',name:'氷冠の辺境',wave:24,campaign:'frontier36',danger:'終盤・重撃',hint:'回復と速攻を選ぶ。防御+4。',hp:4800,attack:290,defense:48,trait:'heavy',image:'assets/giant.svg',points:2,buff:{defense:4},material:'ice_token',materialName:'氷冠の晶片'},
];
export const REGIONAL_MATERIALS=FRONTIER_REGIONS.map(d=>({id:d.material,name:d.materialName,wave:d.wave,region:d.id,enemy:d.name}));
export const REGIONAL_ACCESSORIES=[
 {id:'river_pendant',name:'渓流の首飾り',slot:'necklace',effect:{manaRegen:.75,spellPower:-.05},description:'MP再生+0.75/秒、魔法ダメージ−5%。長期戦のMP維持と一撃の火力を選ぶ。'},
 {id:'forge_ring',name:'灰燼の指輪',slot:'ring',effect:{critPower:.5,defense:-3},description:'会心倍率+50%、防御−3。会心ゲージは継承・武器で組む。'},
 {id:'star_bracelet',name:'星見の腕輪',slot:'bracelet',effect:{spellPower:.15,defense:-3},description:'魔法ダメージ+15%、防御−3。反撃・防御の腕輪との選択。'},
 {id:'ice_boots',name:'氷冠の靴',slot:'boots',effect:{defense:8,haste:-.1},description:'防御+8、攻撃速度−10%。速攻と耐久を選ぶ。'},
];
export const REGIONAL_REQUIREMENTS={
 river_pendant:['river_token',1,4,{steel_ingot:4,herbs:12,gold:18}],
 forge_ring:['forge_token',1,8,{silver_ingot:5,gold:24,hide:6}],
 star_bracelet:['star_token',1,12,{diamond:3,herbs:18,gold:30}],
 ice_boots:['ice_token',1,12,{orichalcum_ingot:5,hide:16,gold:36}],
};
