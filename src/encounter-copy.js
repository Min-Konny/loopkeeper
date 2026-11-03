import {legacyEncounterName} from './legacy-ui-copy.js?v=0.6.140';
import {text as t,getUILocale,hasCopy} from './i18n.js?v=0.6.140';
import {campaignForRun} from './campaign-rules.js?v=0.6.140';
const verified=new Set(["1.chapter_1_scout","2.chapter_1_vanguard","3.forest_chief","4.chapter_2_scout","5.chapter_2_vanguard","6.ironfang_captain","7.chapter_3_scout","8.chapter_3_vanguard","9.twinblade_raider","10.chapter_4_scout","11.chapter_4_vanguard","12.silver_bandit_king","13.chapter_5_scout","14.chapter_5_vanguard","15.mountain_colossus","16.chapter_6_scout","17.chapter_6_vanguard","18.crystal_guardian","19.chapter_7_scout","20.chapter_7_vanguard","21.dawn_gate_king","22.dawn_sky_patrol","23.dawn_iron_legion","24.dawn_last_sentinel","25.river_scouts","26.forge_guard","27.river_captain","28.forge_hammer","29.star_wings","30.forge_master","31.ice_wings","32.star_blades","33.star_keeper","34.ice_armor","35.ice_blades","36.ice_crown"]);
export function encounterName(s,enemy=s.run.enemy){if(!enemy)return '';if(getUILocale()==='ja')return enemy.name||'';if(s.version===1)return legacyEncounterName(enemy);const route=s.run.routes?.active?.id;
 if(route){const key='encounter.route.'+route;return hasCopy(key)?t(key):enemy.name||'';}
 if(s.run.endless?.active&&enemy.id==='endless_wave_'+enemy.wave&&Number.isInteger(enemy.wave)&&['combo','flying','armor','heavy'].includes(enemy.trait))return t('encounter.endless.name',{title:t(enemy.isBoss?'encounter.endless.boss':'encounter.endless.normal'),trait:t('encounter.endless.'+enemy.trait)});
 const id=enemy.wave+'.'+enemy.id,key='encounter.frontier36.'+id;
 return campaignForRun(s)==='frontier36'&&!s.run.endless?.active&&verified.has(id)?t(key):enemy.name||'';
}
