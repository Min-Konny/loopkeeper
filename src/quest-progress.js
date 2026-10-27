import{PROGRESSION_QUESTS}from './quest-content.js?v=0.6.99';
import{SPECIALISTS}from './specialist-content.js?v=0.6.99';
import{OUTPOSTS}from './settlement-content.js?v=0.6.99';
import {QUEST_REWARD_VERSION,questRewardDifference} from './quest-rewards.js?v=0.6.99';
const regions=new Set(OUTPOSTS.map(p=>p.id));
export function creditQuestPoints(s,amount){if(s.meta.totalPoints+amount>1e9)return false;s.meta.points+=amount;s.meta.totalPoints+=amount;if(s.run.status==='legacy_setup'&&s.run.legacyDraft)s.run.legacyDraft.points+=amount;return true;}
export function initializeQuestRewards(s){if(s.version!==2||s.meta.questRewardVersion===QUEST_REWARD_VERSION)return{ready:true,bonus:0};const bonus=questRewardDifference(s.meta.completedMilestones,s.meta.questRewardVersion||0);if(bonus&&!creditQuestPoints(s,bonus))return{ready:false,bonus:0};s.meta.questRewardVersion=QUEST_REWARD_VERSION;return{ready:true,bonus};}
export function questProgress(s,q){if(q.kind==='wave')return Math.min(q.target,s.meta.bestWave);if(q.kind==='outposts')return Math.min(q.target,new Set((s.meta.routeClears||[]).filter(id=>regions.has(id))).size);if(q.kind==='specialist')return Math.min(q.target,Math.max(0,...SPECIALISTS.map(f=>s.run.facilities[f.id]||0)));if(q.kind==='accessories')return Math.min(q.target,new Set(s.meta.accessories||[]).size);return null;}
export const earnedProgressQuests=s=>PROGRESSION_QUESTS.filter(q=>questProgress(s,q)>=q.target);
