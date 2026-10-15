// Alternatives to the existing tier7 sword, paid from the same earned metal.
// Only extended campaigns expose these recipes; old runs keep their catalog.
export const LATE_WEAPONS=[
 {id:'orichalcum_bow',name:'オリハルコンの弓',tier:7,slot:'weapon',skill:'smithing',unlockLevel:12,unlockBestWave:18,knownAfterBoss:'crystal_guardian',campaign:'extended24',duration:34,cost:{orichalcum_ingot:12,wood:16,hide:4},stats:{attack:92},xpCoefficient:1.3,combat:{type:'bow',rate:1.25,pierce:0,opening:.75,markEvery:3},description:'終盤の弓。3射ごとに敵防御を2減らす（最大30%）。手数と先制で飛行敵にも備える。'},
 {id:'orichalcum_crossbow',name:'オリハルコンの弩',tier:7,slot:'weapon',skill:'smithing',unlockLevel:12,unlockBestWave:18,knownAfterBoss:'crystal_guardian',campaign:'extended24',duration:38,cost:{orichalcum_ingot:12,wood:12,stone:8},stats:{attack:158},xpCoefficient:1.3,combat:{type:'crossbow',rate:.7,pierce:.45,opening:.75},description:'終盤の弩。遅い一撃、敵防御45%無視と会心威力+25%。'},
 {id:'orichalcum_staff',name:'オリハルコンの火杖',tier:7,slot:'weapon',skill:'smithing',unlockLevel:12,unlockBestWave:18,knownAfterBoss:'crystal_guardian',campaign:'extended24',duration:38,cost:{orichalcum_ingot:12,wood:8,herbs:16},stats:{attack:34},xpCoefficient:1.3,combat:{type:'magic',rate:1,pierce:0,spellMultiplier:4},description:'終盤の杖。火種・燃焼・触媒爆発の威力4倍。MP30、詠唱4秒、消費10、毎秒2回復は共通。物理攻撃は弱い。'},
];
