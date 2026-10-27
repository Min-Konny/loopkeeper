import {investmentEffect}from './investments.js?v=0.6.85';
// Explicit investments change sale income, never purchase prices or gathered XP.
export const FISH_FACILITIES = [{
  id: 'smokehouse', facilityId: 'smokehouse', name: '燻製小屋', level: 1,
  duration: 18, cost: {wood: 24, stone: 12, fish: 12, gold: 6},
  effect: {fishCookingSpeed: .25, foodHealingFlat: 4},
  effectMode: 'replace_previous_level_totals', skill: 'smithing',
  unlockLevel: 2, unlockBestWave: 3, requires: [], xpCoefficient: 1,
}];
export const TRADE_AUGMENTS = [
  {id: 'fish_export', name: '川魚の出荷契約', family: 'economy', unlockBestWave: 6,
   description: '市場と燻製小屋があれば、魚の売値＋30%。釣りの量・経験値は変わらない。',
   tags: ['魚', '燻製小屋'], pairs: ['bulk_shipping'], facility: 'smokehouse',
   hint: '魚を備蓄や料理に残すか、設備を整えて出荷するかを選ぶ。'},
  {id: 'bulk_shipping', name: '商隊の定期便', family: 'economy', unlockBestWave: 6,
   description: '市場II以降で10個以上まとめて売ると売値＋10%。売値は現在の買値の80%まで。',
   tags: ['市場II', 'まとめ売り'], pairs: ['fish_export', 'joint_procurement'],
   facility: 'market', facilityLevel: 2,
   hint: '市場を強化し、売却用の在庫を残してからまとめて出荷する。'},
].map(a=>({...a,pack:'economy_augments',values:{},requiresPurchasedWorker:false}));
export function tradeSaleUnit(s, resource, count, buyUnit, ordinaryUnit) {
  let unit = resource === 'fish' ? 1 : ordinaryUnit;
  const selected = s.run.augments.selected;
  if (resource === 'fish' && selected.includes('fish_export') && s.run.facilities.market && s.run.facilities.smokehouse) unit *= 1.3;
  if (selected.includes('bulk_shipping') && s.run.facilities.market >= 2 && count >= 10) unit *= 1.1;
  // Recompute against today's discounts; reselling purchases always loses money.
  return Math.min(unit*(1+investmentEffect(s,"tradeSaleBonus")), buyUnit * .8);
}
