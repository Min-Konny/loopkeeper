import {FACILITY_LAYOUT} from './facility-atlas-layout.js?v=0.6.87';
// Original generated sheets: row is facility, column is its real built stage.
export const FACILITY_SHEETS=Object.freeze({
 training_yard:['training-yard-v1.png',0],
 watchtower:['facilities-a-v2.png',0],archery_tower:['facilities-a-v2.png',1],infirmary:['facilities-a-v2.png',2],market:['facilities-a-v2.png',3],guardhouse:['facilities-a-v2.png',4],
 smokehouse:['facilities-b-v2.png',0],henhouse:['facilities-b-v2.png',1],barricade:['facilities-b-v2.png',2],signal_post:['facilities-b-v2.png',3],workshop:['facilities-b-v2.png',4],
});
export function facilityFrame(id,level=1){const row=Object.hasOwn(FACILITY_SHEETS,id)?FACILITY_SHEETS[id]:null;if(!row)return null;const column=Math.max(0,Math.min(4,Math.floor(Number(level)||1)-1)),sheet=FACILITY_LAYOUT[row[0]],frame=sheet.frames[row[1]*5+column];return{src:new URL('../assets/pixel-v2/'+row[0],import.meta.url).href,row:row[1],column,frame,sheet};}
let pending;
export function loadFacilityArt(){return pending??=Promise.all([...new Set(Object.values(FACILITY_SHEETS).map(v=>v[0]))].map(name=>new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve([name,img]);img.onerror=()=>reject(Error('Facility sheet unavailable: '+name));img.src=new URL('../assets/pixel-v2/'+name,import.meta.url).href;}))).then(entries=>{const images=Object.fromEntries(entries),out={};for(const[id,[name,row]]of Object.entries(FACILITY_SHEETS)){const count=['smokehouse','henhouse','signal_post'].includes(id)?1:5,frames=FACILITY_LAYOUT[name].frames.slice(row*5,row*5+count),maxWidth=Math.max(...frames.map(f=>f.width)),maxHeight=Math.max(...frames.map(f=>f.height));for(let level=1;level<=5;level++)out[id+':'+level]={img:images[name],...FACILITY_LAYOUT[name].frames[row*5+level-1],maxWidth,maxHeight};}return out;});}
