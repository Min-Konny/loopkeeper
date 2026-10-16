export const MAGIC_WEAPON={id:'ember_staff',name:'火種の杖',tier:2,slot:'weapon',skill:'smithing',unlockLevel:2,unlockBestWave:3,knownAfterBoss:null,duration:18,cost:{wood:14,ingot:2,herbs:8,gold:12},stats:{attack:2},xpCoefficient:1.05,combat:{type:'magic',rate:1,pierce:0},description:'物理攻撃は弱い。基礎間隔4秒、MP10で火種を自動詠唱。防御無視の火球（現在の威力は魔法欄に表示）と6秒の燃焼（毎秒3）。MP30、毎秒2回復。'};
export const ALCHEMY_RESOURCES=[{id:'spark_catalyst',name:'火花触媒'},{id:'ward_essence',name:'護符液'}];
export const ALCHEMY_RECIPES=[
 {id:'mix_spark',name:'火花触媒の調合',kind:'alchemy',skill:'smithing',unlockLevel:2,unlockBestWave:3,knownAfterBoss:null,duration:8,cost:{herbs:4,wood:1},yields:{spark_catalyst:3},xpCoefficient:1,description:'薬草4と木材1で触媒3。最大12。対応オーグメントの発動時に1消費。'},
 {id:'mix_ward',name:'護符液の調合',kind:'alchemy',skill:'smithing',unlockLevel:2,unlockBestWave:3,knownAfterBoss:null,duration:8,cost:{herbs:3,stone:2},yields:{ward_essence:2},xpCoefficient:1,description:'薬草3と石材2で護符液2。最大12。大きな敵攻撃を18軽減して1消費（6秒間隔）。物理・魔法とも有効。'},
];
export const MAGIC_AUGMENTS=[
 {id:'volatile_ink',name:'揮発する火印',family:'martial',pack:'martial_augments',unlockBestWave:3,requiresPurchasedWorker:false,values:{},description:'杖の詠唱時、燃焼が残っていれば触媒1で残り燃焼量を5倍の爆発へ変換。燃焼を消して次の詠唱で再び着火。',tags:['火種の杖','火花触媒'],pairs:['binding_oil']},
 {id:'binding_oil',name:'火花の塗油',family:'economy',pack:'economy_augments',unlockBestWave:3,requiresPurchasedWorker:false,values:{},description:'本人の会心時、強い燃焼が残っていなければ触媒1を消費し、毎秒2の燃焼を3秒付与。通常攻撃・反撃・魔法では再発動しない。',tags:['会心','火花触媒'],pairs:['volatile_ink']},
 {id:'ward_distillation',name:'護符の還流',family:'fortress',pack:'fortress_augments',unlockBestWave:3,requiresPurchasedWorker:false,values:{},description:'護符液の軽減が18→30、発動時MP4回復。護符液は必ず1消費し、返却しない。',tags:['護符液','MP'],pairs:['volatile_ink']},
];
export const alchemyResource=id=>ALCHEMY_RESOURCES.some(x=>x.id===id);
