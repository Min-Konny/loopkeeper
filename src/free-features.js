import {initializeMeals}from './meals.js?v=0.6.118';
import {QUEUE_UNLOCK_WAVE,queueUnlocked}from './queue-unlock.js?v=0.6.118';
import {initializeWorkMilestones}from './work-milestones.js?v=0.6.118';
import {initializeTrophies} from './boss-materials.js?v=0.6.118';
import {initializeContracts}from './contracts.js?v=0.6.118';
import {initializeRoutes}from './routes.js?v=0.6.118';
import {initializeFarm}from './farm-state.js?v=0.6.118';
import {synchronizeCompanions}from './companion-state.js?v=0.6.118';
import {initializeMagic}from './magic-state.js?v=0.6.118';
import {initializeGear}from './gear-state.js?v=0.6.118';
import {initializeProgression}from './progression-rewards.js?v=0.6.118';
import {initializeRunResults}from './run-results.js?v=0.6.118';
export const FREE_FEATURES = [
 {id:'action_queue',name:'行動予約',wave:QUEUE_UNLOCK_WAVE},
 {id:'queue_templates',name:'手順テンプレート',wave:3},
 {id:'stock_targets',name:'在庫目標',wave:4},
 {id:'cycle_acceleration',name:'周回復帰',wave:5},
 {id:'acceleration_extension',name:'周回復帰の延長',wave:9},
];
const ids=new Set(FREE_FEATURES.map(x=>x.id));
export const isFreeFeature=id=>ids.has(id);
export function hasUpgrade(s,id){
 if(id==='action_queue')return queueUnlocked(s);
 if(s.version===1||!ids.has(id))return s.meta.upgrades.includes(id);
 return s.meta.upgrades.includes(id)||(s.meta.freeFeatures||[]).includes(id)||s.meta.bestWave>=FREE_FEATURES.find(x=>x.id===id).wave;
}
// The caller commits the cloned result before replacing a live stored game.
export function synchronizeFreeFeatures(s){
 if(s.version===1)return {refunded:0,changed:false};
 const before=JSON.stringify(s);
 const granted=new Set(s.meta.freeFeatures||[]);let refunded=0;
 const ledgers=[s.meta,...(s.run.status==='legacy_setup'?[s.run.legacyDraft]:[])];
 for(const ledger of ledgers){for(const id of [...ledger.upgrades])if(ids.has(id)){
   granted.add(id);const paid=ledger.paidCosts[id];
   if(!Number.isInteger(paid)||paid<1)throw Error('Invalid recorded feature payment');
   ledger.points+=paid;if(ledger===s.meta)refunded+=paid;
   delete ledger.paidCosts[id];ledger.upgrades=ledger.upgrades.filter(x=>x!==id);
 }}
 for(const feature of FREE_FEATURES)if(s.meta.bestWave>=feature.wave)granted.add(feature.id);
 if(granted.has('acceleration_extension'))granted.add('cycle_acceleration');
 if(granted.has('queue_templates')||granted.has('stock_targets'))granted.add('action_queue');
 s.meta.freeFeatures=[...granted].sort();
 initializeMeals(s);initializeTrophies(s);initializeWorkMilestones(s);initializeRunResults(s);initializeProgression(s);initializeGear(s);initializeMagic(s);initializeFarm(s);initializeRoutes(s);initializeContracts(s);const companionsAdded=synchronizeCompanions(s);s.meta.foundationVersion=1;
 if(refunded)s.meta.featureRefundTotal=(s.meta.featureRefundTotal||0)+refunded;
 return {refunded,companionsAdded,changed:before!==JSON.stringify(s)};
}
export function freeFeatureMarkup(s,allowedIds=null){
 const visible=FREE_FEATURES.filter(f=>!['cycle_acceleration','acceleration_extension'].includes(f.id)&&(!allowedIds||allowedIds.includes(f.id)));if(!visible.length)return "";
 if(s.version===1)return '';
 return '<section class="strategy-details free-features"><h3>無料の便利機能</h3>'+visible.map(f=>{
  const unlocked=hasUpgrade(s,f.id),enabled=!s.settings.disabledUpgrades.includes(f.id),disabled=s.run.status!=='preparing'||s.run.augments.offer.length;
  return '<p data-free-feature="'+f.id+'"><span>'+f.name+' · '+(unlocked?'解放済み':'最高WAVE '+f.wave+'で解放')+'</span>'+(unlocked?'<button class="button small gold-outline" data-toggle-upgrade="'+f.id+'" aria-pressed="'+enabled+'" '+(disabled?'disabled':'')+'>'+ (enabled?'有効':'停止')+'</button>':'')+'</p>';
 }).join('')+(s.meta.featureRefundTotal?'<small>旧取得分 '+s.meta.featureRefundTotal+'pt を返還済み</small>':'')+'</section>';
}
