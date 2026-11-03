import {text as t,getUILocale} from './i18n.js?v=0.6.140';
import {entityText} from './entity-copy.js?v=0.6.140';
import{gatheringMaterialSaving}from './gathering-materials.js?v=0.6.140';
import{investmentEffect}from './investments.js?v=0.6.140';
import{usefulGoals}from './useful-goals.js?v=0.6.140';
import{getCatalog,getActionDuration,getSkillProgress,isKnown,getLegacyRankStatus,getRecipeCost}from'./engine.js?v=0.6.140';
import{LEGACY_RANKS,rankId}from'./legacy-rank-definitions.js?v=0.6.140';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function rankTiming(s,key){
 if(s.version!==2||!['gatherSpeed','craftSpeed','alchemySpeed'].includes(key))return null;
 const def=LEGACY_RANKS.find(d=>d.key===key),status=getLegacyRankStatus(s,key),draft=s.run.status==='legacy_setup'?s.run.legacyDraft:null;
 const current={...s,meta:{...s.meta,...(draft?{upgrades:[...draft.upgrades],paidCosts:{...draft.paidCosts},points:draft.points}:{})},settings:{...s.settings,disabledUpgrades:[...(draft?.disabledUpgrades??s.settings.disabledUpgrades)]},run:{...s.run,status:'preparing'}};
 const ids=new Set(Array.from({length:5},(_,i)=>rankId(def,i+1))),base={...current,meta:{...current.meta,upgrades:current.meta.upgrades.filter(id=>!ids.has(id))}},next=status.nextRank?{...current,meta:{...current.meta,upgrades:[...current.meta.upgrades,rankId(def,status.nextRank)]}}:null;
 const catalog=getCatalog(s),matches=d=>d.skill!=='combat'&&(key==='gatherSpeed'?!d.cost:key==='alchemySpeed'?d.kind==='alchemy':!!d.cost&&d.kind!=='alchemy');
 const examples=[...catalog.ACTIONS,...catalog.RECIPES].filter(d=>matches(d)&&isKnown(s,d)&&getSkillProgress(s.run.skills[d.skill].xp).level>=(d.unlockLevel||1)).map(d=>({id:d.id,name:d.name,without:getActionDuration(base,d),current:getActionDuration(current,d),next:next?getActionDuration(next,d):null}));
 examples.sort((a,b)=>(a.id===s.run.activeAction?.id?-1:b.id===s.run.activeAction?.id?1:((b.without-b.current)-(a.without-a.current)))||a.id.localeCompare(b.id));
 const savings=key==='gatherSpeed'?{current:gatheringMaterialSaving(investmentEffect(current,key)),next:next?gatheringMaterialSaving(investmentEffect(next,key)):null,example:null}:null;
 if(savings&&Array.isArray(current.run.ownedEquipment)){const goal=usefulGoals(current).find(g=>!g.paid);if(goal){const without=getRecipeCost(base,goal.id),now=getRecipeCost(current,goal.id),after=next?getRecipeCost(next,goal.id):null;savings.example={id:goal.id,name:goal.name,materials:Object.keys(now).filter(id=>without[id]!==now[id]||after&&after[id]!==now[id]).slice(0,2).map(id=>({id,name:catalog.RESOURCES[id]?.name||id,without:without[id],current:now[id],next:after?.[id]??null}))};}}
 return{key,savings,examples:examples.slice(0,2),floor:.25,nextRank:status.nextRank,scope:key==='gatherSpeed'?'採集速度は本人のみ（職人・自動鉱石・襲撃を除く）。材料節約は通常装備・建築のみ。':key==='craftSpeed'?'制作・手動調理・加工に適用。現在の自動調理は別の時間計算です。':'調合に適用。採集・通常の制作には適用されません。'};
}
const percent=n=>Math.round(n*10000)/100+'%';
function savingsMarkup(r){if(!r.savings)return'';const v=r.savings,e=v.example;return '<p data-gathering-saving>材料節約 '+percent(v.current)+(v.next!==null?' → 次 '+percent(v.next):'')+'（上限20%・切上げ・最低1）</p>'+(e?.materials.length?'<p>'+esc(e.name)+'：'+e.materials.map(m=>esc(m.name)+' '+m.without+' → '+m.current+(m.next!==null?' → 次 '+m.next:'')).join(' / ')+'</p>':'')+'<small>金・食料・薬草・職人の産出・柵追加強化は対象外。支払済み作業には遡りません。</small>';}
const seconds=n=>n.toFixed(n<1?3:2)+'秒';
function rankTimingJapanese(s,key){const r=rankTiming(s,key);if(!r)return'';return'<details data-detail-key="rank-timing-'+key+'" class="rank-timing"><summary data-focus="rank-timing-'+key+'">この構成での実効時間</summary><small>'+r.scope+'</small>'+savingsMarkup(r)+(r.examples.length?r.examples.map(e=>'<p>'+esc(e.name)+'：この枝なし '+seconds(e.without)+' → 現在 '+seconds(e.current)+(e.next!==null?' → 次 '+seconds(e.next):'')+(e.current<=r.floor||e.next!==null&&e.next<=r.floor?'（下限0.25秒）':'')+(e.next!==null&&Math.abs(e.next-e.current)<1e-8?'・次のランクによる短縮なし':'')+'</p>').join(''):'<p>現在の技能で実行できる対象作業はありません。</p>')+'<small>現在の装備・技能での1回の作業時間。残り時間や予約の見積もりではありません。</small></details>';}

const enSeconds=n=>t('result.seconds',{seconds:n.toFixed(n<1?3:2)}),nextValue=n=>n!==null?t('timing.next',{value:n}):'';
const workName=(s,e)=>{const catalog=getCatalog(s),action=catalog.ACTIONS.find(d=>d.id===e.id),recipe=catalog.RECIPES.find(d=>d.id===e.id);if(recipe?.facility)return t('entity.facilityStage',{name:entityText('facility',recipe.facility),stage:['','I','II','III','IV','V'][recipe.facility.level]||recipe.facility.level});return entityText(action?'action':'recipe',action||recipe||e);};
export function rankTimingMarkup(s,key){if(getUILocale()==='ja')return rankTimingJapanese(s,key);const r=rankTiming(s,key);if(!r)return '';const v=r.savings,e=v?.example;
 const saving=v?'<p data-gathering-saving>'+esc(t('timing.saving',{current:percent(v.current),next:nextValue(v.next===null?null:percent(v.next))}))+'</p>'+(e?.materials.length?'<p>'+esc(workName(s,e))+': '+e.materials.map(m=>esc(entityText('resource',m.id))+' '+m.without+' → '+m.current+esc(nextValue(m.next))).join(' / ')+'</p>':'')+'<small>'+esc(t('timing.exclusions'))+'</small>':'';
 return '<details data-detail-key="rank-timing-'+key+'" class="rank-timing"><summary data-focus="rank-timing-'+key+'">'+esc(t('timing.summary'))+'</summary><small>'+esc(t(key==='gatherSpeed'?'timing.gather':key==='craftSpeed'?'timing.craft':'timing.alchemy'))+'</small>'+saving+(r.examples.length?r.examples.map(e=>'<p>'+esc(t('timing.example',{name:workName(s,e),without:enSeconds(e.without),current:enSeconds(e.current),next:nextValue(e.next===null?null:enSeconds(e.next)),floor:e.current<=r.floor||e.next!==null&&e.next<=r.floor?t('timing.floor'):'',unchanged:e.next!==null&&Math.abs(e.next-e.current)<1e-8?t('timing.unchanged'):''}))+'</p>').join(''):'<p>'+esc(t('timing.none'))+'</p>')+'<small>'+esc(t('timing.hint'))+'</small></details>';
}
