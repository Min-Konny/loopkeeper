import {ENCHANTMENTS,enchantmentById} from './enchantments.js?v=0.6.140';
import {text as t} from './i18n.js?v=0.6.140';
import {entityText} from './entity-copy.js?v=0.6.140';
import {escapeText as esc} from './automation-status-ui.js?v=0.6.140';
export function enchantmentMarkup(s){
 if(s.version!==2||s.meta.bestWave<3)return '';
 const p=s.run.enchantment?.pending,a=s.run.status==='combat'?s.run.enchantment?.active:null;
 const target=p&&enchantmentById(p.id),equipment=target&&s.run.equipment[target.slot];
 const equipmentName=p&&equipment?.id===p.equipmentId?t('enchant.equipped',{name:entityText('recipe',{id:equipment.id,name:equipment.name})}):t('enchant.changed');
 return '<section class="meal-overview enchantment-panel" aria-label="'+esc(t('enchant.heading'))+'"><strong>'+esc(t('enchant.heading'))+'</strong><div class="meal-settings"><label>'+esc(t('enchant.next'))+'<select data-enchantment data-focus="enchantment" '+(s.run.status!=='preparing'||s.run.augments.offer.length?'disabled':'')+'><option value="none">'+esc(t('enchant.none'))+'</option>'+ENCHANTMENTS.map(d=>'<option value="'+d.id+'" '+(p?.id===d.id?'selected':'')+'>'+esc(t('enchant.option',{name:entityText('resource',d.id),count:s.run.resources[d.id]||0}))+'</option>').join('')+'</select></label></div><p class="fine-print">'+esc(t('enchant.hint'))+'</p>'+(p?'<p>'+esc(t('enchant.effect.'+p.id))+'<br>'+esc(t('enchant.target',{name:equipmentName}))+'</p>':'')+(a?'<p>'+esc(t('enchant.active',{name:entityText('resource',a.id)}))+'</p>':'')+'</section>';
}
