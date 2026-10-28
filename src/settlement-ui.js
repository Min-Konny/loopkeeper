import {JOBS,OUTPOSTS,outpostId,outpostRecipe}from './settlement-content.js?v=0.6.128';
import {populationCapacity,assigned,staffing,allocationLimit,outpostRate}from './settlement.js?v=0.6.128';
export function allocationControls(s,id,name){
 const n=staffing(s,id),limit=allocationLimit(s,id),disabled=s.run.status!=='preparing';
 return `<div class="population-stepper"><button class="button small" data-population="${id}" data-population-count="${n-1}" data-focus="population-minus-${id}" aria-label="${name}から1人外す" ${disabled||n===0?'disabled':''}>−</button><strong>${n} / ${limit}人</strong><button class="button small" data-population="${id}" data-population-count="${n+1}" data-focus="population-plus-${id}" aria-label="${name}に1人配置" ${disabled||n>=limit||assigned(s)>=populationCapacity(s)?'disabled':''}>＋</button></div>`;
}
export function populationMarkup(s){
 if(s.version!==2)return '';
 const cap=populationCapacity(s),used=assigned(s),level=s.run.facilities.housing||0;
 const rows=Object.entries(JOBS).filter(([id])=>s.meta.upgrades.includes(id)).map(([id,name])=>`<div class="population-row"><span>${name}<small>${!staffing(s,id)?'人員未配置':s.settings.disabledUpgrades.includes(id)?'作業OFF':'配置中'}</small></span>${allocationControls(s,id,name)}</div>`);
 for(const p of OUTPOSTS)if(s.run.routes?.cleared.includes(p.id)&&s.run.facilities[outpostId(p.id)])rows.push(`<div class="population-row"><span>${p.name}<small>${staffing(s,outpostId(p.id))?`${p.label} 約${(outpostRate(s,p.id)*staffing(s,outpostId(p.id))).toFixed(1)}個/分`:'人員未配置'}</small></span>${allocationControls(s,outpostId(p.id),p.name)}</div>`);
 return `<section class="population-panel" aria-label="人口と配置"><header><h3>人口 ${used} / ${cap}人</h3><span>空き ${cap-used}人</span><button class="button small" data-tab="village">住宅${level<5?'を増築':' V'}</button></header><p class="fine-print">村の仕事と開拓地で共有。外しても作業の進行は残ります。</p><div class="population-grid">${rows.join('')||'<p>継承で仲間を雇うか、道を開拓すると配置できます。</p>'}</div></section>`;
}
