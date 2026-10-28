import {pixelProductSource} from './pixel-product-art.js?v=0.6.136';
import { icon } from './icons.js?v=0.6.136';
const materials=new Map();
const image=svg=>'data:image/svg+xml,'+encodeURIComponent(svg);
export function materialShortage(required,available){return Number.isFinite(required)&&required>=0?Math.max(0,required-available):0;}
const text=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
// A shared cost chip for construction and workshop recipes; never changes costs.
export function catalogMaterialMarkup({id,label,available,required,format=String}){
 const missing=materialShortage(required,available);
 return '<span class="'+(required!=null&&available<required?'insufficient':'')+'">'+workshopMaterialIcon(id)+'<span class="material-label">'+text(label)+'</span> <span class="material-stock">'+text(format(available))+'<b>/'+(required==null?'?':text(format(required)))+'</b></span>'+(missing>0?'<small class="material-gap">不足 '+text(format(missing))+'</small>':'')+'</span>';
}
export function workshopMaterialIcon(id){
 if(!materials.has(id))materials.set(id,image(icon(id).replace('<svg ','<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" color="#cbb98c" ')));
 return '<img class="workshop-material-icon" src="'+materials.get(id)+'" width="20" height="20" alt="" aria-hidden="true" decoding="async">';
}
export function workshopProduct(recipe){
 return '<div class="workshop-product" aria-hidden="true"><img src="'+pixelProductSource(recipe)+'" width="128" height="128" alt="" decoding="async"></div>';
}
