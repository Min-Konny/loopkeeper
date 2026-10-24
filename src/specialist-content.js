// Optional specialist investments compete with defensive construction.
export const SPECIALISTS=[
 {id:'kitchen',name:'炊事場',skill:'cooking',label:'料理',wave:3,image:'specialist-kitchen-v1.png'},
 {id:'laboratory',name:'錬金工房',skill:'alchemy',label:'錬金',wave:6,image:'specialist-laboratory-v1.png'},
 {id:'workhouse',name:'仕事場',skill:'commerce',label:'商業',wave:3,image:'specialist-workhouse-v1.png'},
 {id:'archery_range',name:'弓術場',skill:'archery',label:'弓術訓練',wave:3,image:'specialist-archery_range-v1.png'},
 {id:'arcane_study',name:'魔術研究所',skill:'sorcery',label:'魔術訓練',wave:6,image:'specialist-arcane_study-v1.png'},
];
export const SPECIALIST_FACILITIES=SPECIALISTS.flatMap(f=>[1,2,3].map(n=>({
 id:f.id+(n===1?'':'_level_'+n),facilityId:f.id,name:f.name,skill:'smithing',level:n,
 duration:[30,55,90][n-1],cost:{wood:[70,170,340][n-1],stone:[40,100,220][n-1],herbs:[12,30,60][n-1],gold:[18,45,95][n-1],...(n>1?{ingot:[0,5,12][n-1]}:{})},
 effect:{specialistSpeed:.2*n},unlockLevel:1,unlockBestWave:f.wave+[0,3,9][n-1],
 requires:n===1?[]:[f.id+(n===2?'':'_level_'+(n-1))],xpCoefficient:.5,
 description:f.label+'速度 +'+20*n+'%'+(f.id==='kitchen'?'（自動調理にも適用）':''),
})));
export const SPECIALIST_AUGMENTS=[
 {id:'camp_cuisine',name:'野営の美食',family:'economy',wave:6,facility:'kitchen',description:'炊事場があれば料理時間−25%。強化料理の攻撃・攻撃速度補正が+5ポイント。',tags:['料理','炊事場'],pairs:['food_warrior']},
 {id:'measured_doses',name:'精密な処方',family:'fortress',wave:6,facility:'laboratory',description:'錬金工房があればポーション回復量+20%。代わりに錬金時間+15%。携行本数は変わらない。',tags:['錬金','ポーション'],pairs:['potion_focus']},
 {id:'steady_commissions',name:'評判の工房街',family:'economy',wave:6,facility:'workhouse',description:'仕事場があれば修繕の仕事1回の金貨+1。交易・自動収入は変わらない。',tags:['商業','仕事場'],pairs:['paid_repairs']},
 {id:'archer_drill',name:'射手の教本',family:'martial',wave:6,facility:'archery_range',description:'弓術場があれば弓術訓練時間−25%、弓使いの攻撃+10%。',tags:['弓術','弓術場'],pairs:['heavy_arrows']},
 {id:'arcane_curriculum',name:'魔導の学び舎',family:'martial',wave:9,facility:'arcane_study',description:'魔術研究所があれば魔術訓練時間−25%、魔法使いの火球威力+10%。',tags:['魔術','魔術研究所'],pairs:['mana_cycle','volatile_ink']},
 {id:'heavy_arrows',name:'重矢の構え',family:'martial',wave:6,description:'弓使いの攻撃+25%。代わりに射撃間隔+15%。弓塔の攻撃は変わらない。',tags:['弓術','一撃'],pairs:['archer_drill']},
 {id:'mana_cycle',name:'静かな魔力循環',family:'martial',wave:9,description:'魔法使いのMP回復+0.5/秒。代わりに火球威力−10%。長期戦向け。',tags:['魔術','MP'],pairs:['arcane_curriculum']},
 {id:'settled_outposts',name:'開拓村の連携',family:'economy',wave:6,facility:'housing',description:'住宅があれば開拓拠点の生産速度+25%。配置人数と人口上限は変わらない。',tags:['人口','開拓'],pairs:['investment']},
].map(a=>({...a,unlockBestWave:a.wave,pack:{economy:'economy_augments',martial:'martial_augments',fortress:'fortress_augments'}[a.family],values:{},requiresPurchasedWorker:false}));
export function specialistAug(s,id){const a=SPECIALIST_AUGMENTS.find(a=>a.id===id);return !!a&&s.run.augments.selected.includes(id)&&(!a.facility||(s.run.facilities[a.facility]||0)>=1);}
export function specialistDuration(s,skill){const f=SPECIALISTS.find(f=>f.skill===skill);let factor=1/(1+.2*(f?(s.run.facilities[f.id]||0):0));
 if(skill==='cooking'&&specialistAug(s,'camp_cuisine'))factor*=.75;
 if(skill==='alchemy'&&specialistAug(s,'measured_doses'))factor*=1.15;
 if(skill==='archery'&&specialistAug(s,'archer_drill'))factor*=.75;
 if(skill==='sorcery'&&specialistAug(s,'arcane_curriculum'))factor*=.75;
 return factor;
}
