export const CRAFT_CATEGORIES=[['tool','道具'],['weapon','武器'],['armor','防具'],['accessory','アクセサリー'],['food','料理'],['alchemy','錬金'],['processing','素材加工'],['all','すべて']];
export function craftCategory(d){
 if(d.facility||d.endlessFacility)return 'village';
 if(d.accessory)return 'accessory';
 if(d.equipment)return ['armor','shield'].includes(d.equipment.slot)?'armor':d.equipment.slot;
 if(d.kind==='alchemy')return 'alchemy';
 if(d.yields?.food)return 'food';
 return 'processing';
}
export function readUiPreference(storage,key,values,fallback){try{const x=storage.getItem(key);return values.includes(x)?x:fallback;}catch{return fallback;}}
export function saveUiPreference(storage,key,value){try{storage.setItem(key,value);}catch{}}
export function craftCategoryMarkup(selected){return '<div class="craft-category-tabs" role="group" aria-label="製作ジャンル">'+CRAFT_CATEGORIES.map(([id,name])=>`<button type="button" class="button small ${selected===id?'gold-outline':'muted'}" aria-pressed="${selected===id}" data-craft-category="${id}" data-focus="craft-category-${id}">${name}</button>`).join('')+'</div>';}
