import {legacyFixedReason,sharedNoticeText} from './legacy-reasons.js?v=0.6.140';
import {routeReturnReason}from './route-reason-copy.js?v=0.6.140';
import {text as t,getUILocale} from './i18n.js?v=0.6.140';
import {entityText} from './entity-copy.js?v=0.6.140';
import {getCatalog,getRecipeCost} from './engine.js?v=0.6.140';
const fixed=["tail.endlessUnlock","tail.add","tail.targetReached","tail.queued","tail.market","tail.hired","tail.woodTen","tail.goldCap","tail.freeSpeed","tail.freeWave","tail.noUnlock","tail.purchased","tail.unlockPreparation","tail.freePoints","tail.notPurchased","tail.rerollsAlways","tail.returnShortened","tail.returnUnavailable","tail.afterFinal","tail.rankFive","tail.noRankAdd","tail.noRankRefund","native.raidActive","native.repeatQueued","native.materialCycle","native.outpostFirst","native.outpostRequeue","native.conditionUnlock","native.conditionInvalid","native.equipmentUnknown","native.levelRange","native.notLevelQueue","native.countRange","native.queueMove","native.queueMissing","native.workerTarget","native.workerUnlock","native.workerUpgrade","native.stockRange","native.templateRange","native.templateMissing","native.augmentNoReplacement","native.augmentSelect","native.aidMissing","native.aidShortage","native.tradeUnknown","native.tradeRange","native.resourceCap","native.goldShortage","native.pointsShortage","native.pointsRebirth","native.respecBefore","native.removeHigher","native.inheritanceChange","native.invalidState","native.abandonState","native.restartState","native.legacyState","native.respecTiming","native.undoTiming","native.routeBattle","native.mealTiming","native.earlyPreparing","native.earlyAugment","native.earlyRange","native.earlyWaiting","native.earlyStale","native.outpostCampaign","native.outpostEntrance","native.outpostGuardian","native.actionMissing","native.populationTiming","native.populationTarget","native.populationUnlock","native.populationCap","native.routeUnknown","native.routeStart","native.routeCampaign","native.materialCap","native.pointsCap","native.routeCleared","native.routeConstruction","native.routeTime","native.enchantmentTiming","native.enchantmentGear","native.enchantmentCraft","repeatPreparation","repeatQueue","repeatStopped","repeatStarted","repeatStopSave","repeatChangeSave","preparationCheck","foundationPending","backupRead","viewSave","queueUnlock","notFoundCraft","queuePreparation","queueFull","alreadyQueued","notFound","count","noBlocked","noDefer","priorityDuplicate","priorityUnknown","priorityOwner","priorityStale","priorityMoved","prioritySave","storageOther","storageMoved","storageUnknown","storageChanged",'missingAction','alchemyCap','preparing','augment','unknown','expedition','active','reinforcementCap','endless','built','previousStage','permanent','owned','disabled','empty','waiting','locked'];
// Presentation only: match a verified source message against the known action ID.
// Never use translated text to decide eligibility or infer an ID from a user's prose.
export function reasonText(s,reason,id){
 if(getUILocale()==='ja'||!reason)return reason||'';
 const shared=sharedNoticeText(reason);if(shared!==null)return shared;
 if(s.version===1){const known=legacyFixedReason(reason);if(known!==null)return known;}
 if(s.version===1)for(const key of ['dead','combat'])if(reason===t('legacy.reason.'+key,{},'ja'))return t('legacy.reason.'+key);
 for(const key of fixed)if(reason===t('reason.'+key,{},'ja'))return t('reason.'+key);
 for(const key of ['withdraw','defeat','timeout','abandon']){const native=t('route.reason.'+key,{},'ja');if(reason===t('reason.routeRetry',{reason:native},'ja'))return t('reason.routeRetry',{reason:routeReturnReason(native)});}
 const c=getCatalog(s);if(s.version===1){const food=c.DIPLOMACY.foodCost;if(reason===t('legacy.reason.aidFood',{food},'ja'))return t('legacy.reason.aidFood',{food});for(const item of c.BUYABLES){if(id&&item.id!==id)continue;const count=item.cost-s.run.resources.gold;if(count>0&&reason===t('legacy.reason.goldShortage',{count},'ja'))return t('legacy.reason.goldShortage',{count});}}const d=[...c.ACTIONS,...c.RECIPES].find(d=>d.id===id);
 if(!d)return reason;
 const skill=c.SKILLS.find(x=>x.id===d.skill);
 if(skill&&reason===`${skill.name} Lv.${d.unlockLevel}が必要。`)return t('reason.skill',{name:entityText('skill',skill),level:d.unlockLevel});
 if(s.version===1&&skill&&reason===`${skill.name}の進行レベル${d.unlockLevel}で解放。`)return t('legacy.reason.skill',{name:entityText('skill',skill),level:d.unlockLevel});
 const previous=c.RECIPES.find(x=>x.id===d.previousEquipmentId);
 if(previous&&reason===`${previous.name}から強化してください。`)return t('reason.upgrade',{name:entityText('recipe',previous)});
 for(const [r,n]of Object.entries(getRecipeCost(s,d))){const count=s.version===1?n-(s.run.resources[r]||0):Math.ceil(n-(s.run.resources[r]||0)),def=c.RESOURCES[r];if(def&&count>0&&reason===`${def.name}が${count}不足。`)return t('reason.material',{name:entityText('resource',r),count});}
 return reason;
}
