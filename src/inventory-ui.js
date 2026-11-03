import {text as t,getUILocale,formatNumber} from './i18n.js?v=0.6.140';
import {entityText} from './entity-copy.js?v=0.6.140';
import {getCatalog}from './engine.js?v=0.6.140';
import {BOSS_MATERIALS}from './boss-materials.js?v=0.6.140';import {REGIONAL_MATERIALS}from './regional-content.js?v=0.6.140';import {WORK_MILESTONES}from './work-milestone-content.js?v=0.6.140';import {COMPANIONS}from './companion-content.js?v=0.6.140';
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const number=x=>formatNumber(Math.floor(Number(x)||0));
export const BAG_CATEGORIES=[['all','すべて'],['resources','素材・金貨'],['supplies','食料・魚・錬金'],['equipment','装備'],['permanent','永久所持']];
const supplies=new Set(['food','herb_soup','fish_meal','egg_meal','fish','eggs','fodder','spark_catalyst','ward_essence','armor_oil','hunting_oil','impact_charm']);
export function inventoryGroups(s,visibleIds=Object.keys(getCatalog(s).RESOURCES),{showZero=false}={}){
 const {RESOURCES,RECIPES}=getCatalog(s),groups=[['resources','素材・金貨'],['supplies','食料・魚・錬金'],['equipment','この人生の装備'],['materials','特殊素材（永久保持）'],['accessories','永久アクセサリー'],['companions','相棒']].map(([id,name])=>({id,name,category:['materials','accessories','companions'].includes(id)?'permanent':id,entries:[]})),add=(group,e)=>groups.find(g=>g.id===group).entries.push(e);
 for(const [id,d]of Object.entries(RESOURCES)){const count=s.run.resources[id]||0;if(count>0||(showZero&&visibleIds.includes(id)))add(supplies.has(id)?'supplies':'resources',{id,name:d.name,count});}
 const owned=new Set([...(s.run.ownedEquipment||[]),...Object.values(s.run.equipment).map(x=>x?.id).filter(Boolean)]),ordered=[...RECIPES.map(r=>r.id),...[...owned].sort()];for(const id of new Set(ordered))if(owned.has(id))add('equipment',{id,name:RECIPES.find(r=>r.id===id)?.name||id,count:1,note:Object.values(s.run.equipment).some(x=>x?.id===id)?'装備中':'所持'});
 const definitions=[...BOSS_MATERIALS,...REGIONAL_MATERIALS,...WORK_MILESTONES.map(d=>({...d,id:d.material}))],materials=new Set([...Object.keys(s.meta.trophyEarned||{}),...Object.keys(s.meta.trophies||{}),...Object.keys(s.meta.trophySpent||{})]);for(const id of new Set([...definitions.map(d=>d.id),...[...materials].sort()]))if(materials.has(id)){const count=s.meta.trophies?.[id]||0,d=definitions.find(d=>d.id===id);if(count>0||showZero)add('materials',{id,name:d?.name||d?.materialName||id,count,note:'特殊素材'});}
 const accessories=new Set(s.meta.accessories||[]);for(const id of new Set([...RECIPES.filter(r=>r.accessory).map(r=>r.accessory),...[...accessories].sort()]))if(accessories.has(id)){const phases=Object.entries(s.meta.accessorySets||{}).filter(([,slots])=>Object.values(slots).includes(id)).map(([phase])=>phase==='combat'?'戦闘中':'準備中');add('accessories',{id,name:RECIPES.find(r=>r.accessory===id||r.id===id)?.name||id,count:1,note:phases.length?phases.join('・')+'に装備':'永久所持'});}
 const companions=new Set(s.meta.companions||[]);for(const id of new Set([...COMPANIONS.map(d=>d.id),...[...companions].sort()]))if(companions.has(id))add('companions',{id,name:COMPANIONS.find(d=>d.id===id)?.name||id,count:1,note:s.meta.activeCompanion===id?'同行中':'解放済み'});
 return groups;
}

function entryName(group,e){const kind=['resources','supplies'].includes(group.id)?'resource':group.id==='materials'?'material':group.id==='companions'?'companion':'recipe';return entityText(kind,e);}
function entryNote(s,group,e){if(getUILocale()==='ja')return e.note||'';
 if(group.id==='equipment')return t(Object.values(s.run.equipment).some(x=>x?.id===e.id)?'bag.equipped':'bag.owned');
 if(group.id==='materials')return t('bag.material');
 if(group.id==='companions')return t(s.meta.activeCompanion===e.id?'bag.accompanying':'bag.unlocked');
 if(group.id==='accessories'){const phases=Object.entries(s.meta.accessorySets||{}).filter(([,slots])=>Object.values(slots).includes(e.id)).map(([phase])=>t(phase==='combat'?'bag.phase.combat':'bag.phase.preparation'));return phases.length?t('bag.phases',{phases:phases.join(' / ')}):t('bag.permanent');}
 return e.note||'';
}
export function inventoryMarkup(s,category='all',visibleIds=Object.keys(getCatalog(s).RESOURCES),options={}){
 const selected=BAG_CATEGORIES.some(([id])=>id===category)?category:'all',groups=inventoryGroups(s,visibleIds,options),shown=groups.filter(g=>selected==='all'||selected===g.category),total=groups.reduce((n,g)=>n+g.entries.length,0);
 const tabs='<div class="bag-tabs" role="group" aria-label="'+esc(t('bag.categories'))+'">'+BAG_CATEGORIES.map(([id])=>'<button class="button small '+(selected===id?'gold-outline':'muted')+'" data-bag-category="'+id+'" data-focus="bag-'+id+'" aria-pressed="'+(selected===id)+'">'+esc(t('bag.category.'+id))+' <span class="bag-count">'+groups.filter(g=>id==='all'||id===g.category).reduce((n,g)=>n+g.entries.length,0)+'</span></button>').join('')+'</div>';
 return tabs+'<div class="bag-toolbar"><span>'+esc(t('bag.total',{count:total}))+'</span><label><input type="checkbox" data-bag-zero data-focus="bag-zero" '+(options.showZero?'checked':'')+'> '+esc(t('bag.zero'))+'</label></div><div class="inventory-scroll" data-scroll-key="inventory">'+(shown.some(g=>g.entries.length)?shown.filter(g=>g.entries.length).map(g=>'<section class="inventory-group" aria-label="'+esc(t('bag.group.'+g.id))+'"><h3>'+esc(t('bag.group.'+g.id))+' <small>'+esc(t('bag.entries',{count:g.entries.length}))+'</small></h3><div class="inventory-list">'+g.entries.map(e=>{const note=entryNote(s,g,e);return '<div class="inventory-item '+(e.count===0?'inventory-empty':'')+'" data-inventory-item="'+esc(e.id)+'"><span>'+esc(entryName(g,e))+(note?'<small>'+esc(note)+'</small>':'')+'</span><strong>'+number(e.count)+'</strong></div>';}).join('')+'</div></section>').join(''):'<p class="fine-print">'+esc(t('bag.empty'))+'</p>')+'</div>'+(selected==='equipment'||selected==='permanent'?'<button class="button muted" data-info="status">'+esc(t('bag.settings'))+'</button>':'');
}
