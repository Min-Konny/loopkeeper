export const STARTING_UPGRADES=[
 {id:'starting_supplies',name:'再出発の備蓄 I',kind:'starting_resources',cost:1,rank:1,unlock:{bestWave:3,generation:2},effect:{startingResources:{wood:20,stone:10,gold:6}},description:'次回の転生開始時：木材20・石材10・金貨6。現在の手持ちは変わりません。',rankEffectMode:'add_to_lower_rank_except_acceleration_extension'},
 {id:'starting_supplies_2',name:'再出発の備蓄 II',kind:'starting_resources',cost:2,rank:2,unlock:{bestWave:6,requires:['starting_supplies'],generation:2},effect:{startingResources:{wood:40,stone:20,gold:6}},description:'Iと合わせて次回の転生開始時：木材60・石材30・金貨12。手持ちの持越しではありません。',rankEffectMode:'add_to_lower_rank_except_acceleration_extension'}
];
export function startingGrant(upgrades,disabled=[]){
 const out={};for(const u of STARTING_UPGRADES)if(upgrades.includes(u.id) && !disabled.includes(u.id))for(const [id,n] of Object.entries(u.effect.startingResources))out[id]=(out[id] || 0)+n;
 return out;
}
