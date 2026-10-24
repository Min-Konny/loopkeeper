// Population is a run investment. Permanent worker ranks improve each villager.
export const JOBS={lumber_worker:'木こり',mining_worker:'採掘師',foraging_worker:'採集人',processing_worker:'加工職人'};
export const OUTPOSTS=[
 {id:'forest',name:'森の伐採拠点',resource:'wood',label:'木材',interval:20,wood:45,stone:20,gold:8},
 {id:'quarry',name:'峠の採掘拠点',resource:'stone',label:'石材',interval:22,wood:40,stone:35,gold:10},
 {id:'marsh',name:'湿地の薬草園',resource:'herbs',label:'薬草',interval:24,wood:35,stone:20,gold:8},
 {id:'lake',name:'湖畔の漁場',resource:'fish',label:'魚',interval:26,wood:50,stone:15,gold:10},
 {id:'road',name:'街道の仕事場',resource:'gold',label:'金貨',interval:45,wood:40,stone:30,gold:8},
 {id:'forest_depth',name:'深森の伐採拠点',resource:'wood',label:'木材',interval:10,wood:120,stone:65,gold:25,wave:6,parent:'forest'},
 {id:'quarry_depth',name:'峠奥地の鉱山',resource:'ore',label:'鉄鉱石',interval:15,wood:150,stone:100,gold:35,wave:9,parent:'quarry'},
 {id:'marsh_depth',name:'湿地奥地の薬草園',resource:'herbs',label:'薬草',interval:10,wood:180,stone:100,gold:45,wave:12,parent:'marsh'},
 {id:'citadel',name:'砦の交易拠点',resource:'gold',label:'金貨',interval:18,wood:220,stone:180,gold:55},
 {id:'river',name:'渓流の漁場',resource:'fish',label:'魚',interval:14,wood:100,stone:55,gold:24,wave:6,campaign:'frontier36'},
 {id:'forge',name:'工房街の製錬所',resource:'ingot',label:'鉄塊',interval:25,wood:200,stone:160,gold:60,wave:12,campaign:'frontier36'},
 {id:'observatory',name:'星見の宝石採掘場',resource:'diamond',label:'ダイヤモンド',interval:50,wood:320,stone:220,gold:90,wave:18,campaign:'frontier36'},
 {id:'ice',name:'氷冠の鉱山',resource:'orichalcum_ore',label:'オリハルコン鉱石',interval:50,wood:400,stone:300,gold:120,wave:24,campaign:'frontier36'},
];
export const outpostId=id=>'outpost_'+id;
export const outpostRecipe=(id,level=1)=>outpostId(id)+(level===1?'':'_level_'+level);
export const expeditionId=id=>'reopen_'+id;
export const HOUSING=Array.from({length:5},(_,i)=>{const n=i+1;return {id:n===1?'housing':'housing_level_'+n,facilityId:'housing',name:'住宅',level:n,duration:20*n,cost:{wood:[35,90,180,320,500][i],stone:[15,50,100,180,300][i],gold:[6,18,36,65,100][i]},effect:{population:n},skill:'smithing',unlockLevel:1,unlockBestWave:[1,3,6,9,12][i],requires:n===1?[]:[n===2?'housing':'housing_level_'+(n-1)],xpCoefficient:.5,description:'人口上限 '+(2+n)+'人。村の仕事と開拓地で共有。'};});
export const OUTPOST_BUILDINGS=OUTPOSTS.flatMap(p=>[1,2,3].map(n=>({id:outpostRecipe(p.id,n),facilityId:outpostId(p.id),name:p.name,level:n,duration:35*n,cost:{wood:p.wood*n*n,stone:p.stone*n*n,gold:p.gold*n*n},effect:{},skill:'smithing',unlockLevel:1,unlockBestWave:p.wave||3,campaign:p.campaign,requires:n===1?[]:[outpostRecipe(p.id,n-1)],xpCoefficient:.5,outpost:p.id,description:n===1?'開拓工事。完成後に守護敵を突破して稼働。':`配置上限${n}人・一人あたりの生産速度 +${(n-1)*25}%`})));
export const EXPEDITIONS=OUTPOSTS.map(p=>({id:expeditionId(p.id),name:p.name+'を再開拓',skill:'smithing',duration:1,cost:{},yields:{},unlockLevel:1,unlockBestWave:p.wave||3,campaign:p.campaign,xpCoefficient:0,expedition:p.id,description:'材料調達 → 開拓工事 → 守護敵。襲撃が近い時は帰還後まで保留。'}));
