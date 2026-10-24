import fs from 'node:fs';
import assert from 'node:assert/strict';
import * as E from '../src/engine.js';
import {CONTENT as C} from '../src/content.js';
import {memberFor} from '../src/party.js';
import {changeGear} from '../src/gear-state.js';
import {allocatePopulation} from '../src/settlement.js';
import {canEnterRoute} from '../src/routes.js';
import {potionCapacity} from '../src/meals.js';
import {LEGACY_RANKS,rankId} from '../src/legacy-rank-definitions.js';
const options={earlyLoopPrototype:true,lateLoopPrototype:true,preparationBalancePrototype:true};
const arg=process.argv.slice(2),policy=arg[0]||'martial',seed=+(arg[1]||1),maxRuns=+(process.env.RUNS||40);
// Only the offer RNG seed is controlled; no inventory, XP, rewards, or enemy values are assigned.
const output=process.env.BALANCE_OUTPUT||'output/balance77';fs.mkdirSync(output,{recursive:true});
const s=E.createGame(options),runs=[],ledger=[];let ticks=0,steps=0,category='',timeByCategory={},waveMetrics=[],lastWave=0;
const level=(id)=>E.getSkillProgress(s.run.skills[id].xp).level;
const training=id=>E.getSkillProgress(s.run.training[id]||0).level;
const owned=id=>s.run.ownedEquipment.includes(id);
function advance(){const before=s.run.status;E.advanceTime(s,.25);if(before==='preparing'&&s.run.status==='combat'&&!s.run.routes.active&&s.run.enemy.wave===36)fs.writeFileSync(`${output}/${policy}-${seed}-boss.json`,E.serializeGame(s));ticks++;timeByCategory[category]=(timeByCategory[category]||0)+.25;if(s.run.wave>lastWave){waveMetrics.push({wave:s.run.wave,seconds:s.run.elapsed,stats:E.getStats(s),resources:{...s.run.resources},facilities:{...s.run.facilities},allocation:{...s.run.population.assigned},time:{...timeByCategory}});lastWave=s.run.wave;}}
function batch(id){const d=[...E.ACTIONS,...E.RECIPES].find(x=>x.id===id);if(!d)return false;const r=E.startAction(s,id);if(!r.ok)return false;ledger.push([s.meta.generation,+s.run.elapsed.toFixed(2),'action',id]);s.settings.paused=false;const instance=s.run.activeAction?.instanceId;let limit=0;while(instance&&s.run.activeAction?.instanceId===instance&&s.run.status==='preparing'&&!s.run.augments.offer.length&&!s.settings.paused){advance();if(++limit>20000)throw Error('batch stall '+id);}return true;}
function goal(id){const d=E.RECIPES.find(x=>x.id===id);if(!d||!E.isKnown(s,d))return false;const r=E.resolveGoal(s,id);if(r.done)return false;if(r.equipId){assert.ok(changeGear(s,{type:'equipment',id:r.equipId},E.RECIPES).ok);return true;}if(r.ok&&r.id)return batch(r.id);if(s.run.facilities.market){if(s.run.resources.hide<20&&E.tradeResource(s,'hide','buy',1).ok)return true;}
 return false;}
function buy(){if(s.run.status!=='legacy_setup')return;
 const preferences=policy==='martial'?['attack','maxHp','haste','defense','spellPower','potionCapacity','gatherSpeed','craftSpeed']:policy==='fortress'?['defense','maxHp','potionCapacity','attack','gatherSpeed','craftSpeed','haste']:['gatherSpeed','maxHp','defense','craftSpeed','attack','potionCapacity','haste'];
 const pack={martial:'martial_augments',fortress:'fortress_augments',economic:'economy_augments'}[policy];
 for(let rank=1;rank<=5;rank++){for(const key of preferences){const d=LEGACY_RANKS.find(x=>x.key===key),id=rankId(d,rank);if(E.canPurchaseUpgrade(s,id).ok){E.purchaseUpgrade(s,id);ledger.push([s.meta.generation,0,'inherit',id]);}}if(rank===1)for(const id of [pack,'auto_cook',...(policy==='economic'?['lumber_worker','mining_worker']:[])])if(E.canPurchaseUpgrade(s,id).ok)E.purchaseUpgrade(s,id);}
}
const augPreferences={martial:['weapon_master','warrior','drill','executioner','food_warrior','field_training','volatile_ink','potion_focus','last_stand','shield_master'],fortress:['supply_lines','piercing_volley','triage','guard','thorn_wall','healing_patrol','provisions','wall_readiness','ward_distillation'],economic:['investment','construction_rush','joint_procurement','artisan_guild','forestry','frugal_building','hands_on','paid_repairs','salvage','well_stocked']};
function choose(){let pick=augPreferences[policy].find(id=>s.run.augments.offer.includes(id));if(!pick&&E.rerollAugments(s).ok)pick=augPreferences[policy].find(id=>s.run.augments.offer.includes(id));pick||=s.run.augments.offer[0];assert.ok(E.chooseAugment(s,pick).ok);ledger.push([s.meta.generation,s.run.elapsed,'augment',pick]);}
function facility(id,target){const current=s.run.facilities[id]||0;if(current>=target)return false;return goal(current===0?id:id+'_level_'+(current+1));}
function train(){category='training';const list=policy==='martial'?['combat','archery','combat','vitality','sorcery','defense']:policy==='fortress'?['vitality','defense','combat','vitality','archery','sorcery']:['vitality','combat','defense','archery','sorcery'];const id=list[steps%list.length];const action={combat:'train_combat',vitality:'train_vitality',defense:'train_defense',archery:'train_archery',sorcery:'train_magic'}[id];return batch(E.isKnown(s,action)?action:'train_combat');}
function prepare(){steps++;const stats=E.getStats(s),wave=s.run.wave,remaining=s.run.nextWaveAt-s.run.elapsed;
 for(const id of ['lumber_worker','mining_worker'])if(s.meta.upgrades.includes(id))allocatePopulation(s,id,1);
 for(const c of C.diplomacy)if(s.run.countries[c.id].status==='pending')E.aidCountry(s,c.id);
 category='supplies';
 if(remaining<65&&s.run.resources.herb_soup<potionCapacity(s)&&goal('cook_meal'))return;
 if(s.run.facilities.infirmary&&s.run.hp<stats.maxHp*.8&&s.run.resources.food<3&&goal('cook_simple'))return;
 // Spend some of each preparation interval on actual training instead of exhausting every building upgrade.
 if(steps%4===0&&train())return;
 category='equipment';
 const tier=Math.min(7,1+Math.floor((wave+1)/3),1+Math.floor(s.meta.bestWave/3));
 for(const slot of (policy==='martial'?['weapon','archer','armor','shield','tool','mage']:['armor','shield','weapon','tool','archer','mage'])){
 const list=E.RECIPES.filter(d=>d.equipment&&d.tier<=tier&&E.isKnown(s,d)&&(['archer','mage'].includes(slot)?memberFor(d.id)===slot:d.slot===slot&&!memberFor(d.id))).sort((a,b)=>b.tier-a.tier);
 const d=list[0];if(d&&!owned(d.id)&&goal(d.id))return;
 }
 category='supplies';if(s.run.resources.herb_soup<potionCapacity(s)&&goal('cook_meal'))return;
 category='facilities';
 const cap=Math.min(5,1+Math.floor(wave/4));
 const facilities=policy==='martial'?['infirmary','training_yard','barricade','market','watchtower']:policy==='fortress'?['infirmary','barricade','archery_tower','guardhouse','market','watchtower','training_yard']:['infirmary','market','workshop','watchtower','guardhouse','barricade','archery_tower','training_yard'];
 for(const f of facilities)if(facility(f,f==='market'?1:cap))return;
 category='food';if(wave>=3&&s.run.resources.fish_meal<1&&goal('cook_fish')){E.setMealPreference(s,'fish_meal');return;}
 category='alchemy';if(wave>=3&&s.run.resources.ward_essence<2&&goal('mix_ward'))return;if(s.run.augments.selected.includes('volatile_ink')&&s.run.resources.spark_catalyst<3&&goal('mix_spark'))return;
 category='outposts';
 if(policy==='economic'&&wave>=3&&remaining>70){for(const id of ['forest','quarry']){if(s.run.routes.cleared.includes(id)){for(const job of ['lumber_worker','mining_worker'])allocatePopulation(s,job,0);allocatePopulation(s,'outpost_'+id,1);continue;}if(!(s.run.facilities['outpost_'+id])){if(goal('outpost_'+id))return;}else if(canEnterRoute(s,id).ok){const r=E.startRoute(s,id);assert.ok(r.ok);ledger.push([s.meta.generation,s.run.elapsed,'route',id]);return;}}}
 train();}
for(let n=0;n<maxRuns;n++){
 lastWave=0;steps=0;timeByCategory={};waveMetrics=[];s.run.augments.seed=(Math.imul(seed+s.meta.generation,1664525)+1013904223)>>>0;
 let guard=0,idles=0;while(!['dead','cleared'].includes(s.run.status)&&guard++<200000){if(s.run.augments.offer.length){choose();continue;}if(s.run.status==='combat'){category='combat';s.settings.paused=false;advance();continue;}if(s.run.status!=='preparing')throw Error('status '+s.run.status);const before=ticks;prepare();if(ticks===before){if(++idles>100){fs.writeFileSync(`${output}/stalled.json`,E.serializeGame(s));throw Error('no advancing '+s.run.status);}}else idles=0;}
 assert.ok(E.parseSave(E.serializeGame(s)),'save valid');const report={generation:s.meta.generation,wave:s.run.wave,status:s.run.status,seconds:s.run.elapsed,points:s.meta.totalPoints,stats:E.getStats(s),skills:s.run.skills,permanent:s.meta.skills,training:s.run.training,facilities:s.run.facilities,gear:s.run.equipment,party:s.run.party,upgrades:s.meta.upgrades,augments:s.run.augments.selected,resources:s.run.resources,routes:s.run.routes,report:s.run.battleReports[0],time:timeByCategory,waveMetrics};runs.push(structuredClone(report));
 console.log(policy,seed,'generation',s.meta.generation,'wave',s.run.wave,'pts',s.meta.totalPoints,'hp',E.getStats(s).maxHp);
 if(s.run.status==='cleared'){fs.writeFileSync(`${output}/${policy}-${seed}-clear.json`,E.serializeGame(s));break;}if(guard>=200000)throw Error('operations exhausted');E.restartRun(s);buy();E.confirmRun(s,options);
}
const result={policy,seed,cleared:s.run.status==='cleared',ticks,simulatedSeconds:ticks*.25,runs,ledger};fs.writeFileSync(`${output}/${policy}-${seed}.json`,JSON.stringify(result,null,2));if(!result.cleared)process.exitCode=1;
