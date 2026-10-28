import {CONTENT} from './content.js?v=0.6.138';
import {PROGRESSION_QUESTS} from './quest-content.js?v=0.6.138';
import {questProgress} from './quest-progress.js?v=0.6.138';

// Cosmetic records only. These proof IDs refer to existing earned progression
// facts; they never call a point/reward function or create a new requirement.
const tiers=[
 ['iron','鉄を手に','鉄',2],['steel','鋼の備え','鋼',3],['silver','銀の光','銀',4],
 ['mithril','ミスリルの技','ミスリル',5],['diamond','晶石を鍛える','水晶・ダイヤモンド',6],['orichalcum','伝説の金属','オリハルコン',7],
];
export const MILESTONE_ACHIEVEMENTS=Object.freeze([
 ...tiers.map(([material,name,label,target])=>({id:'milestone_'+material+'_equipment',name,kind:'milestone',proof:'first_'+material+'_equipment',target,metric:'equipmentTier',rule:label+'等級以上の装備を手に入れる。武器・防具・道具のいずれかで達成。上位等級でも対象。'})),
 {id:'milestone_first_accessory',name:'最初のお守り',kind:'milestone',proof:'first_accessory',target:1,metric:'quest',rule:'アクセサリーを初めて永久解放する。装備セットへの装着は不要。'},
 {id:'milestone_accessories_3',name:'三つの選択肢',kind:'milestone',proof:'accessories_3',target:3,metric:'quest',rule:'異なるアクセサリーを3種類永久解放する。作り直しでは数を増やせない。'},
 {id:'milestone_specialist_2',name:'専門家の拠点',kind:'milestone',proof:'specialist_stage_2',target:2,metric:'quest',rule:'専門施設のいずれかをIIへ増築する。通常施設IIや増築の予約だけでは対象外。'},
 {id:'milestone_outposts_3',name:'開拓の足跡',kind:'milestone',proof:'outposts_3',target:3,metric:'quest',rule:'異なる3地域で拠点の守護者を倒す。建設だけや同じ地域の再戦では数を増やせない。'},
]);
const equipmentTiers=new Map(CONTENT.equipment.map(d=>[d.id,d.tier]));
export function milestoneAchievementProgress(s,definition){
 const claims=new Set(s.meta?.completedMilestones||[]);
 if(definition.metric==='equipmentTier'){
  const owned=Math.max(0,...(s.run?.ownedEquipment||[]).map(id=>equipmentTiers.get(id)||0));
  const proven=Math.max(0,...MILESTONE_ACHIEVEMENTS.filter(d=>d.metric==='equipmentTier'&&claims.has(d.proof)).map(d=>d.target));
  const current=Math.min(definition.target,Math.max(owned,proven));return{current,target:definition.target,complete:current>=definition.target};
 }
 const quest=PROGRESSION_QUESTS.find(q=>q.id===definition.proof),current=claims.has(definition.proof)?definition.target:Math.min(definition.target,quest?questProgress(s,quest)||0:0);
 return{current,target:definition.target,complete:current>=definition.target};
}
