// Missing stamp means the released 21-wave rules. Loading never upgrades a run.
export const CLASSIC_CAMPAIGN='classic21';
export const EXTENDED_CAMPAIGN='extended24';
export const validCampaign=id=>id===CLASSIC_CAMPAIGN||id===EXTENDED_CAMPAIGN;
export const finalWaveForRun=s=>s.run.campaign===EXTENDED_CAMPAIGN?24:21;
export const campaignForRun=s=>s.run.campaign||CLASSIC_CAMPAIGN;
export const EXTENDED_ENCOUNTERS=[
 {id:'dawn_sky_patrol',name:'暁空の巡察隊',wave:22,chapter:7,boss:false,hp:4000,attack:310,defense:32,trait:'flying',traitParams:{every:4,multiplier:1.6},bossPoint:0,gold:18,hide:2,combatXpBudget:230,image:'assets/winged.svg'},
 {id:'dawn_iron_legion',name:'門外の鉄甲軍',wave:23,chapter:7,boss:false,hp:4300,attack:330,defense:45,trait:'armor',traitParams:null,bossPoint:0,gold:18,hide:2,combatXpBudget:230},
 {id:'dawn_last_sentinel',name:'夜明けの最後の番人',wave:24,chapter:7,boss:true,hp:4800,attack:310,defense:36,trait:'heavy',traitParams:{every:4,multiplier:1.6},bossPoint:1,gold:48,hide:3,combatXpBudget:750},
];
export const encountersForRun=(s,base)=>s.run.campaign===EXTENDED_CAMPAIGN?[...base,...EXTENDED_ENCOUNTERS]:base;
