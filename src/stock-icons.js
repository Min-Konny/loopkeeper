import {icon} from './icons.js?v=0.6.129';
// Use the established material icons; supply distinct silhouettes for newer goods.
const shapes={
 eggs:'<path d="M18 15c0 4-3 7-6 7s-6-3-6-7S9 2 12 2s6 9 6 13Z"/><path d="m9 13 2-2 2 3 2-2"/>',
 fodder:'<path d="M3 10h18v10H3Zm3-8 3 8m3-9v9m6-8-3 8M7 10v10m10-10v10M3 15h18"/>',
 spark_catalyst:'<path d="M9 2h6M10 2v7L4 19q-1 3 3 3h10q4 0 3-3L14 9V2M7 15h10"/><path d="m12 10-2 5h4l-2 5"/>',
 ward_essence:'<path d="M8 2h8v4H8ZM9 6v3c-6 4-6 12 3 13 9-1 9-9 3-13V6"/><path d="m12 11 4 2v3l-4 3-4-3v-3Z"/>'
};
export function stockIcon(id){return shapes[id==='egg_meal'?'eggs':id]?'<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" aria-hidden="true">'+shapes[id==='egg_meal'?'eggs':id]+'</svg>':icon(id);}
