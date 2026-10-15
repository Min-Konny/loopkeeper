// Missing stamp means the released 21-wave rules. Loading never upgrades a run.
export const CLASSIC_CAMPAIGN='classic21';
export const EXTENDED_CAMPAIGN='extended24';
export const FRONTIER_CAMPAIGN='frontier36';
export const validCampaign=id=>[CLASSIC_CAMPAIGN,EXTENDED_CAMPAIGN,FRONTIER_CAMPAIGN].includes(id);
export const campaignFinalWave=id=>id===FRONTIER_CAMPAIGN?36:id===EXTENDED_CAMPAIGN?24:21;
export const finalWaveForRun=s=>campaignFinalWave(s.run.campaign);
export const campaignForRun=s=>s.run.campaign||CLASSIC_CAMPAIGN;
export const EXTENDED_ENCOUNTERS=[
 {id:'dawn_sky_patrol',name:'暁空の巡察隊',wave:22,chapter:7,boss:false,hp:4000,attack:310,defense:32,trait:'flying',traitParams:{every:4,multiplier:1.6},bossPoint:0,gold:18,hide:2,combatXpBudget:230,image:'assets/winged.svg'},
 {id:'dawn_iron_legion',name:'門外の鉄甲軍',wave:23,chapter:7,boss:false,hp:4300,attack:330,defense:45,trait:'armor',traitParams:null,bossPoint:0,gold:18,hide:2,combatXpBudget:230},
 {id:'dawn_last_sentinel',name:'夜明けの最後の番人',wave:24,chapter:7,boss:true,hp:4800,attack:310,defense:36,trait:'heavy',traitParams:{every:4,multiplier:1.6},bossPoint:1,gold:48,hide:3,combatXpBudget:750},
];
// The unchanged 1–24 prefix remains available to both historical and new runs.
export const FRONTIER_ENCOUNTERS=[
 {
  "id": "river_scouts",
  "name": "渓流の斥候",
  "wave": 25,
  "chapter": 9,
  "boss": false,
  "hp": 4400,
  "attack": 310,
  "defense": 34,
  "trait": "flying",
  "traitParams": {
   "every": 4,
   "multiplier": 1.6
  },
  "bossPoint": 0,
  "gold": 18,
  "hide": 2,
  "combatXpBudget": 230,
  "image": "assets/winged.svg"
 },
 {
  "id": "forge_guard",
  "name": "灰燼の鋼衛",
  "wave": 26,
  "chapter": 9,
  "boss": false,
  "hp": 4600,
  "attack": 330,
  "defense": 70,
  "trait": "armor",
  "traitParams": null,
  "bossPoint": 0,
  "gold": 18,
  "hide": 2,
  "combatXpBudget": 230
 },
 {
  "id": "river_captain",
  "name": "渡し場の双刃長",
  "wave": 27,
  "chapter": 9,
  "boss": true,
  "hp": 5200,
  "attack": 300,
  "defense": 42,
  "trait": "combo",
  "traitParams": null,
  "bossPoint": 1,
  "gold": 48,
  "hide": 3,
  "combatXpBudget": 750
 },
 {
  "id": "forge_hammer",
  "name": "炉前の大槌兵",
  "wave": 28,
  "chapter": 10,
  "boss": false,
  "hp": 5200,
  "attack": 370,
  "defense": 65,
  "trait": "heavy",
  "traitParams": {
   "every": 4,
   "multiplier": 1.6
  },
  "bossPoint": 0,
  "gold": 18,
  "hide": 2,
  "combatXpBudget": 230
 },
 {
  "id": "star_wings",
  "name": "星渡りの翼",
  "wave": 29,
  "chapter": 10,
  "boss": false,
  "hp": 4700,
  "attack": 365,
  "defense": 40,
  "trait": "flying",
  "traitParams": {
   "every": 4,
   "multiplier": 1.6
  },
  "bossPoint": 0,
  "gold": 18,
  "hide": 2,
  "combatXpBudget": 230,
  "image": "assets/winged.svg"
 },
 {
  "id": "forge_master",
  "name": "灰燼の炉主",
  "wave": 30,
  "chapter": 10,
  "boss": true,
  "hp": 5800,
  "attack": 365,
  "defense": 80,
  "trait": "armor",
  "traitParams": null,
  "bossPoint": 1,
  "gold": 48,
  "hide": 3,
  "combatXpBudget": 750
 },
 {
  "id": "ice_wings",
  "name": "氷原の滑空兵",
  "wave": 31,
  "chapter": 11,
  "boss": false,
  "hp": 5300,
  "attack": 380,
  "defense": 45,
  "trait": "flying",
  "traitParams": {
   "every": 4,
   "multiplier": 1.6
  },
  "bossPoint": 0,
  "gold": 18,
  "hide": 2,
  "combatXpBudget": 230,
  "image": "assets/winged.svg"
 },
 {
  "id": "star_blades",
  "name": "星見の双剣兵",
  "wave": 32,
  "chapter": 11,
  "boss": false,
  "hp": 5600,
  "attack": 350,
  "defense": 42,
  "trait": "combo",
  "traitParams": null,
  "bossPoint": 0,
  "gold": 18,
  "hide": 2,
  "combatXpBudget": 230
 },
 {
  "id": "star_keeper",
  "name": "星環の守護者",
  "wave": 33,
  "chapter": 11,
  "boss": true,
  "hp": 6300,
  "attack": 410,
  "defense": 65,
  "trait": "heavy",
  "traitParams": {
   "every": 4,
   "multiplier": 1.6
  },
  "bossPoint": 1,
  "gold": 48,
  "hide": 3,
  "combatXpBudget": 750
 },
 {
  "id": "ice_armor",
  "name": "氷冠の甲冑兵",
  "wave": 34,
  "chapter": 12,
  "boss": false,
  "hp": 5900,
  "attack": 420,
  "defense": 70,
  "trait": "armor",
  "traitParams": null,
  "bossPoint": 0,
  "gold": 18,
  "hide": 2,
  "combatXpBudget": 230
 },
 {
  "id": "ice_blades",
  "name": "吹雪の双刃",
  "wave": 35,
  "chapter": 12,
  "boss": false,
  "hp": 6000,
  "attack": 390,
  "defense": 50,
  "trait": "combo",
  "traitParams": null,
  "bossPoint": 0,
  "gold": 18,
  "hide": 2,
  "combatXpBudget": 230
 },
 {
  "id": "ice_crown",
  "name": "氷冠の王",
  "wave": 36,
  "chapter": 12,
  "boss": true,
  "hp": 6800,
  "attack": 430,
  "defense": 72,
  "trait": "heavy",
  "traitParams": {
   "every": 4,
   "multiplier": 1.6
  },
  "bossPoint": 1,
  "gold": 48,
  "hide": 3,
  "combatXpBudget": 750
 }
];
export const campaignIncludes=(s,required)=>!required||campaignForRun(s)===required||campaignForRun(s)===FRONTIER_CAMPAIGN&&required===EXTENDED_CAMPAIGN;
export const encountersForRun=(s,base)=>s.run.campaign===FRONTIER_CAMPAIGN?[...base,...EXTENDED_ENCOUNTERS,...FRONTIER_ENCOUNTERS]:s.run.campaign===EXTENDED_CAMPAIGN?[...base,...EXTENDED_ENCOUNTERS]:base;
