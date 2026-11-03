import {text as t} from './i18n.js?v=0.6.140';
export const LEGACY_CATEGORIES=[
 {id:'combat',name:'戦闘',rankGroup:'combat'},
 {id:'investment',name:'生産',rankGroup:'production'},
 {id:'trade',name:'交易',rankGroup:'trade'},
 {id:'automation',name:'自動化・人員',kinds:['automation','worker'],free:['action_queue','queue_templates','stock_targets']},
 {id:'augment',name:'オーグメント',kinds:['augment_pack','augment_reroll']},
 {id:'starting',name:'備蓄',kinds:['starting_resources']},
 {id:'time',name:'便利・復帰',kinds:['time'],free:['cycle_acceleration','acceleration_extension']},
 {id:'all',name:'すべて'},
];
export function legacyUpgradeCategory(upgrade){
 if(upgrade.kind==='combat')return 'combat';
 if(upgrade.kind==='investment')return Object.hasOwn(upgrade.effect||{},'tradeSaleBonus')?'trade':'investment';
 return LEGACY_CATEGORIES.find(c=>c.kinds?.includes(upgrade.kind))?.id||null;
}
export const legacyRankCategory=rank=>rank.key==='tradeSaleBonus'?'trade':rank.group==='production'?'investment':'combat';
export function legacyCategoryTabs(selected,showMap=true){if(selected==='map'&&showMap)return '<div class="craft-category-tabs legacy-category-tabs" role="tablist" aria-label="'+t('legacy.display')+'">'+inheritanceMapTabs('live',true)+'</div>';return '<div class="craft-category-tabs legacy-category-tabs" role="tablist" aria-label="'+t('legacy.categories')+'">'+LEGACY_CATEGORIES.map(c=>'<button type="button" role="tab" id="legacy-category-'+c.id+'" class="button small '+(c.id===selected?'gold-outline':'muted')+'" aria-selected="'+(c.id===selected)+'" tabindex="'+(c.id===selected?0:-1)+'" aria-controls="legacy-category-content" data-legacy-category="'+c.id+'" data-focus="legacy-category-'+c.id+'">'+t('legacy.category.'+c.id)+'</button>').join('')+(showMap?inheritanceMapTabs('live'):'' )+'</div>';}
export function inheritanceMapTabs(scope,active=false){const controls=scope==='setup'?'setup-upgrades':'legacy-category-content';return (active?'<button type="button" role="tab" data-inheritance-cards data-inheritance-scope="'+scope+'" aria-controls="'+controls+'" aria-selected="false" tabindex="-1">'+t('legacy.cards')+'</button>':'')+'<button type="button" role="tab" id="'+scope+'-inheritance-map-tab" data-inheritance-view="map" data-inheritance-scope="'+scope+'" data-focus="'+scope+'-inheritance-map-tab" aria-controls="'+controls+'" aria-selected="'+active+'" tabindex="'+(active?0:-1)+'">'+(active?t('legacy.tree'):t('legacy.viewTree'))+'</button>';}
