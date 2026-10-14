import { icon } from './icons.js?v=0.4.9';
import { equipmentMaterial } from './visual-design.js?v=0.4.9';
const art=new Map(),materials=new Map();
const image=svg=>'data:image/svg+xml,'+encodeURIComponent(svg);
export function materialShortage(required,available){return Number.isFinite(required)&&required>=0?Math.max(0,required-available):0;}
export function workshopMaterialIcon(id){
 if(!materials.has(id))materials.set(id,image(icon(id).replace('<svg ','<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" color="#cbb98c" ')));
 return '<img class="workshop-material-icon" src="'+materials.get(id)+'" width="20" height="20" alt="" aria-hidden="true" decoding="async">';
}
export function workshopProduct(recipe){
 const key=recipe.id;
 if(!art.has(key)){
  const m=equipmentMaterial({id:key}),slot=recipe.slot||recipe.equipment?.slot,output=Object.keys(recipe.yields||{})[0];
  let shape;
  if(slot==='weapon')shape=key.includes('spear')?'<path d="M30 100 81 28" stroke="#ad8858" stroke-width="6"/><path d="m78 30 5-20 12-5-3 18-12 10Z" fill="'+m.metal+'" stroke="#e5d9ad" stroke-width="1.5"/><path d="m35 91 9 6m-4-14 9 6" stroke="#4b4434" stroke-width="3"/>':'<path d="m32 95 12-17 8 5-13 20Z" fill="#8e653d"/><path d="m48 80 26-46 17-21 2 28-34 43Z" fill="'+m.metal+'" stroke="#e0debc" stroke-width="1.5"/><path d="m42 74 25 13" stroke="#c6a160" stroke-width="7"/><path d="m58 70 24-36" stroke="#ffffff55" stroke-width="2"/>';
  else if(slot==='armor')shape='<path d="m31 31 15-10 11 9 12-9 17 10 9 31-15 4-2 32H36L34 65 21 61Z" fill="'+m.metal+'" stroke="#c1c7b0" stroke-width="2"/><path d="m46 24 12 12 11-12m-32 8 8 54m33-52-7 50" fill="none" stroke="#17272080" stroke-width="4"/><path d="M39 67h38M42 81h32" stroke="#dfd9b45c" stroke-width="2"/><path d="M46 49h24v11H46Z" fill="'+m.cloth+'" stroke="#dfce9366"/>';
  else if(slot==='shield')shape='<path d="m23 29 37-15 36 15-5 43Q77 96 59 104 38 93 27 73Z" fill="'+m.metal+'" stroke="#d8c695" stroke-width="4"/><path d="m60 20-1 75M30 50l57 1" stroke="'+m.cloth+'" stroke-width="7"/><circle cx="59" cy="51" r="10" fill="#b99a61" stroke="#e2ce9d" stroke-width="2"/><path d="m31 32 14-6" stroke="#fff5" stroke-width="3"/>';
  else if(slot==='tool')shape='<path d="m29 91 49-53" stroke="#99754c" stroke-width="8"/><path d="m65 35 30 7-11 17-28-13Z" fill="'+m.metal+'" stroke="#d4d1b1" stroke-width="2"/><path d="M27 45v43m-9-48 20 5-3 17-19-7Z" stroke="#aab49c" fill="'+m.metal+'" stroke-width="3"/><path d="m59 83 24-12 11 11-19 15Z" fill="'+m.cloth+'" stroke="#bda973"/>';
  else if(/ingot|coal/.test(output||'')){const color=equipmentMaterial({id:key.replace('smelt_','')}).metal;shape='<path d="m21 75 40-14 34 9-4 17-43 15-30-12Z" fill="'+color+'" stroke="#bfc4ac" stroke-width="2"/><path d="m29 46 35-13 33 9-3 17-39 13-29-10Z" fill="'+color+'" stroke="#d9d9ba" stroke-width="2"/><path d="m35 48 53-5M28 78l53-10" stroke="#ffffff60" stroke-width="3"/>';}
  else shape='<path d="M20 51h77q-5 45-39 45T20 51Z" fill="#9ca990" stroke="#d8d6b1" stroke-width="3"/><ellipse cx="59" cy="51" rx="38" ry="12" fill="#9f7a42" stroke="#e2c987" stroke-width="2"/><g fill="#bfd09a"><ellipse cx="40" cy="51" rx="7" ry="3" transform="rotate(-20 40 51)"/><ellipse cx="68" cy="48" rx="8" ry="3" transform="rotate(20 68 48)"/></g><path d="m78 73 13-40" stroke="#bd9b66" stroke-width="5"/><path d="M45 34q-8-7 0-14m18 10q-7-6 0-12" fill="none" stroke="#d0cead77" stroke-width="2"/>';
  const svg='<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><defs><linearGradient id="back" x2="0" y2="1"><stop stop-color="#445442"/><stop offset="1" stop-color="#1b3028"/></linearGradient></defs><rect width="120" height="120" rx="10" fill="url(#back)"/><path d="M7 91h106v19H7Z" fill="#6b583b"/><path d="M10 92h100M15 101h27m7 0h54" stroke="#b8a06a55"/><ellipse cx="60" cy="101" rx="44" ry="7" fill="#0c1c1880"/>'+shape+'<path d="M9 18V9h9m84 0h9v9M9 102v9h9m84 0h9v-9" fill="none" stroke="#cbb37b66"/></svg>';
  if(art.size>=96)art.delete(art.keys().next().value);art.set(key,image(svg));
 }
 return '<div class="workshop-product" aria-hidden="true"><img src="'+art.get(key)+'" width="120" height="120" alt="" decoding="async"><span>完成品</span></div>';
}
