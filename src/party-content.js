export const PARTY_ACTIONS=[
 {id:'train_archery',name:'弓の稽古',partyMember:'archer',skill:'combat',trainingStat:'archer',duration:3,yields:{},unlockLevel:1,unlockBestWave:3,xpCoefficient:1,description:'弓使いの攻撃力を鍛える。'},
 {id:'train_magic',name:'魔法の鍛錬',partyMember:'mage',skill:'combat',trainingStat:'mage',duration:4,yields:{},unlockLevel:1,unlockBestWave:6,xpCoefficient:1,description:'魔法使いの魔力を鍛える。'},
];
// Middle tiers fill the gap between iron and orichalcum without mandatory lower-tier crafting.
export const PARTY_WEAPONS=[...[
 ['steel',3,'鋼',6,4,'steel_ingot',6,23,1.5],
 ['silver',4,'銀',9,6,'silver_ingot',7,37,2],
 ['mithril',5,'ミスリル',12,8,'mithril_ingot',8,54,2.6],
 ['diamond',6,'ダイヤモンド',15,10,'diamond',9,73,3.2],
].flatMap(([id,tier,label,wave,lv,material,count,attack,power])=>[
 {id:id+'_bow',name:label+'の弓',tier,slot:'weapon',skill:'smithing',unlockLevel:lv,unlockBestWave:wave,duration:14+tier*3,cost:{[material]:count,wood:16+tier*4,hide:tier},stats:{attack},xpCoefficient:1.3,combat:{type:'bow',rate:1.25,pierce:0,markEvery:3},description:'弓使い専用。飛行敵に与えるダメージ+35%。3射ごとに敵防御を低下。'},
 {id:id+'_staff',name:label+'の火杖',tier,slot:'weapon',skill:'smithing',unlockLevel:lv,unlockBestWave:wave,duration:18+tier*3,cost:{[material]:count,wood:12+tier*3,herbs:12+tier*5},stats:{attack:0},xpCoefficient:1.3,combat:{type:'magic',rate:1,pierce:0,spellMultiplier:power},description:'魔法使い専用。術の威力'+power+'倍。防御を無視する火球と燃焼。'}
])];
