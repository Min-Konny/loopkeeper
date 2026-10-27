export const QUEST_REWARD_VERSION=2;
export const QUEST_REWARDS={first_steel_equipment:2,first_facility_level_2:2,first_synergy:2,frontier_wave_12:2,specialist_stage_2:3,outposts_3:3,first_silver_equipment:3,first_mithril_equipment:5,frontier_wave_24:5,outposts_8:6,first_diamond_equipment:7,first_orichalcum_equipment:10,first_accessory:2,accessories_3:4};
export const questReward=id=>QUEST_REWARDS[id]||1;
// Version0: original15 quests,1pt each. Version1:20 quests, orichalcum10.
export function questRewardDifference(completed,version){if(version>=QUEST_REWARD_VERSION)return 0;return completed.reduce((sum,id)=>sum+Math.max(0,questReward(id)-(version===1&&id==='first_orichalcum_equipment'?10:1)),0);}
