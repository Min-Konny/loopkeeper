export const FARM_RESOURCES=[{id:'fodder',name:'飼料'},{id:'eggs',name:'卵'}];
export const farmResource=id=>FARM_RESOURCES.some(r=>r.id===id);
export const resourceCap=id=>id==='fodder'?80:id==='eggs'?40:['spark_catalyst','ward_essence','armor_oil','hunting_oil','impact_charm'].includes(id)?12:1e9;
export const FARM_ACTION={id:'collect_fodder',name:'飼料の採集',skill:'foraging',unlockLevel:1,unlockBestWave:3,knownAfterBoss:null,duration:9,yields:{fodder:4},xpCoefficient:1};
export const FARM_FACILITY={id:'henhouse',facilityId:'henhouse',name:'鶏小屋',level:1,skill:'smithing',unlockLevel:2,unlockBestWave:3,requires:[],duration:16,cost:{wood:24,stone:12,gold:8},effect:{},effectMode:'replace_previous_level_totals',xpCoefficient:1,description:'鶏1羽付き。飼料2を先払いし、20秒で卵2。餌切れ・満杯なら停止。死亡や世話の罰則なし。村と一緒に周回でリセット。'};
export const FARM_RECIPE={id:'egg_stew',name:'卵の煮込み',kind:'cooking',skill:'foraging',unlockLevel:2,unlockBestWave:3,knownAfterBoss:null,duration:6,cost:{eggs:2,herbs:1,wood:1},yields:{food:5},xpCoefficient:1,description:'卵2・薬草1・木材1を6秒で食料5に。卵の生産時間と飼料が必要。'};
