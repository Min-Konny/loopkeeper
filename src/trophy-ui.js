import {SPECIAL_MATERIALS,trophyCost} from './boss-materials.js?v=0.6.140';
import {text as t,hasCopy} from './i18n.js?v=0.6.140';
import {entityText} from './entity-copy.js?v=0.6.140';
import {escapeCopy as esc} from './locale-controls.js?v=0.6.140';
export function trophyMarkup(s,id,paid=false){return Object.entries(trophyCost(id)).map(([key,n])=>{
 const m=SPECIAL_MATERIALS.find(x=>x.id===key),have=s.meta.trophies?.[key]||0;
 let hint;
 if(m.work){const d=m.work,kind=hasCopy('entity.action.'+d.action+'.name')?'action':'recipe',work=d.equipment?t('trophy.equipmentWork'):entityText(kind,{id:d.action,name:d.label});hint=t('trophy.work',{work,current:Math.min(d.count,s.meta.workCounts?.[d.id]||0),target:d.count,status:t(s.meta.workClaims?.includes(d.id)?'trophy.claimed':'trophy.notClaimed')});}
 else if(m.region)hint=t('trophy.region',{region:entityText('region',{id:m.region,name:m.enemy}),wave:m.wave});
 else hint=t('trophy.boss',{enemy:entityText('enemy',{id:m.boss,name:m.enemy}),wave:m.wave});
 return `<p class="boss-material ${!paid&&have<n?'insufficient':''}"><strong>${esc(entityText('material',m))} ${paid?t('trophy.paid'):`${have} / ${n}`}</strong><small>${esc(hint)}</small></p>`;
 }).join('');}
