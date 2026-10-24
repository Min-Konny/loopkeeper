export const EXTRA_SKILLS=[
 {id:'cooking',name:'料理',description:'食料と戦闘料理を作る速さが上がる。',color:'#d9b479'},
 {id:'alchemy',name:'錬金',description:'ポーションと触媒を調合する速さが上がる。',color:'#b69bd5'},
 {id:'commerce',name:'商業',description:'修繕の仕事で金貨を稼ぐ速さが上がる。',color:'#d8bd72'},
 {id:'archery',name:'弓術',description:'弓使いの攻撃力と訓練速度が上がる。',color:'#8fb891',member:'archer'},
 {id:'sorcery',name:'魔術',description:'魔法使いの魔力と訓練速度が上がる。',color:'#b6a3dc',member:'mage'},
];
export function initializeSkills(s){
 if(s.version!==2)return;
 for(const d of EXTRA_SKILLS){s.meta.skills[d.id]??={xp:0};s.run.skills[d.id]??={xp:0};if(s.run.startPermanentXp)s.run.startPermanentXp[d.id]??=s.meta.skills[d.id].xp;}
}
export const skillVisible=(s,id)=>!!s.run.skills[id]&&(id!=='archery'||s.meta.bestWave>=3)&&(id!=='sorcery'||s.meta.bestWave>=6);
