import {INVESTMENT_BRANCHES}from './investments.js?v=0.6.92';
export const LEGACY_RANKS=[
 {key:'potionCapacity',baseId:'potion_pouch',name:'ポーション携行枠',stat:'potionCapacity',label:'携行本数',icon:'herb_soup',increment:r=>1,description:'基本3本。1戦ごとの上限を増やす。倉庫の作り置きは制限しない。'},
 {key:'attack',baseId:'inherited_blade',name:'継承の攻撃力',stat:'attack',label:'攻撃',icon:'sword',increment:r=>4*r},
 {key:'defense',baseId:'inherited_guard',name:'継承の防御力',stat:'defense',label:'防御',icon:'shield',increment:r=>4*r-1},
 {key:'maxHp',baseId:'inherited_vitality',name:'継承の生命力',stat:'maxHp',label:'最大HP',icon:'heart',increment:r=>30*r},
 ...INVESTMENT_BRANCHES,
];
export const rankId=(rank,n)=>n===1?rank.baseId:rank.baseId+'_'+n;
export const MAX_LEGACY_RANK=5; // Initial playable range; the expansion's final cap is undecided.
export const EXTRA_LEGACY_RANKS=LEGACY_RANKS.filter(rank=>!rank.investment).flatMap(rank=>[3,4,5].map(n=>({
 id:rankId(rank,n),name:rank.name+' '+n,cost:n,rank:n,kind:'combat',
 unlock:{requires:[rankId(rank,n-1)]},
 effect:{[rank.stat]:rank.increment(n)},rankEffectMode:'add_to_lower_rank',
 description:rank.label+' +'+rank.increment(n),
})));
