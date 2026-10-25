import {equipmentMaterial} from './visual-design.js?v=0.6.81';
const r=(x,y,w,h,c)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}"/>`;
const cache=new Map();
const ink='#233737',gold='#dab77a',skin='#d6b38b';
function fighter(e,boss=false){
 const a=equipmentMaterial(e.armor),s=equipmentMaterial(e.shield),w=equipmentMaterial(e.weapon);
 let v=r(26,96,46,4,ink)+r(30,46,34,39,boss?'#784f50':a.cloth)+r(35,77,9,19,ink)+r(53,77,9,19,ink)+r(32,93,13,5,'#76664d')+r(53,93,13,5,'#76664d');
 v+=r(36,24,22,23,skin)+r(34,22,27,7,'#76664a')+r(34,29,5,12,'#76664a')+r(54,33,3,3,ink)+r(48,42,10,2,'#a47b5d');
 v+=r(32,49,28,27,e.armor?a.metal:a.cloth)+r(34,50,4,22,'#e0d5ae')+r(41,52,17,3,'#f1e2b8')+r(40,58,18,2,a.cloth)+r(40,65,18,2,a.cloth)+r(32,76,30,4,'#826845')+r(44,75,6,6,gold);
 for(let i=0;i<4;i++)v+=r(58,52+i*5,2,3,a.cloth)+r(35,83+i*3,3,1,'#879381');
 if(e.armor)v+=r(33,21,28,9,a.metal)+r(37,17,20,5,a.metal)+r(57,29,4,13,a.metal)+r(37,18,16,2,'#f0e3bd');
 if(boss)v+=r(32,18,30,5,gold)+r(32,10,5,10,gold)+r(45,7,5,13,gold)+r(57,10,5,10,gold)+r(46,16,3,4,'#d98d69');
 v+=r(61,47,8,19,a.cloth)+r(65,62,9,5,skin);
 if(/bow/.test(e.weapon?.id||''))v+=r(80,27,3,51,'#b59063')+r(76,23,4,5,'#b59063')+r(76,77,4,5,'#b59063')+r(75,28,1,49,'#e5d6a7')+r(68,56,22,2,w.metal);
 else if(/staff/.test(e.weapon?.id||''))v+=r(76,33,4,59,'#ad8d5d')+r(72,22,12,13,w.metal)+r(75,25,6,7,'#b9e7bd');
 else v+=r(75,27,5,36,w.metal)+r(76,20,3,7,w.metal)+r(76,28,1,31,'#f5edc9')+r(69,63,17,3,gold)+r(76,66,3,13,'#a18557')+r(74,79,7,3,gold);
 if(e.shield)v+=r(19,49,22,27,s.metal)+r(23,76,14,6,s.metal)+r(27,82,6,4,s.metal)+r(21,51,18,2,gold)+r(29,54,2,25,gold)+r(23,63,14,2,gold);
 else v+=r(25,50,7,20,a.cloth)+r(25,69,7,7,skin);
 return v;
}
function beast(kind){
 let v=r(13,96,70,3,ink);
 if(kind==='wolf'){
  v+=r(27,54,50,22,'#7b8e87')+r(20,47,25,25,'#9eaaa0')+r(12,59,24,12,'#abb5a4')+r(12,59,7,5,ink)+r(23,37,7,15,'#7b8e87')+r(36,40,7,13,'#7b8e87')+r(25,54,3,3,gold);
  v+=r(29,75,7,20,'#697c75')+r(65,75,7,20,'#697c75')+r(73,59,12,7,'#7b8e87')+r(81,51,7,11,'#7b8e87');
  for(let i=0;i<5;i++)v+=r(41+i*6,55+i%2*4,4,3,'#b3bba8');
  v+=r(18,70,3,4,'#eee0b7')+r(29,70,3,4,'#eee0b7');
 }else if(kind==='winged'){
  for(let i=0;i<6;i++)v+=r(5+i*5,27+i*5,5,29-i*3,'#746978')+r(66+i*5,52-i*5,5,14+i*3,'#746978')+r(5+i*5,27+i*5,5,3,'#b0a093');
  v+=r(36,43,27,35,'#697f72')+r(39,30,22,21,'#9aab88')+r(33,34,9,6,'#c9b781')+r(43,37,3,3,'#f3d489')+r(38,23,5,10,'#a9b89b')+r(55,23,5,10,'#a9b89b');
  for(let i=0;i<4;i++)v+=r(41,52+i*6,18-i*3,2,'#c4c5a0');
  v+=r(38,77,6,15,'#9a9e75')+r(55,77,6,15,'#9a9e75')+r(33,91,12,3,gold)+r(54,91,12,3,gold);
 }else{
  v+=r(23,38,49,46,'#748b7c')+r(30,19,35,28,'#93a28b')+r(32,17,31,7,'#586e62')+r(33,32,5,3,gold)+r(54,32,5,3,gold)+r(38,41,18,3,ink)+r(11,48,12,36,'#748b7c')+r(72,47,13,33,'#748b7c')+r(27,82,13,15,'#586e62')+r(57,82,13,15,'#586e62');
  for(let i=0;i<7;i++)v+=r(29+i%3*12,49+Math.floor(i/3)*11,9,7,'#a2ad91');
  v+=r(79,62,5,34,'#a3895c')+r(73,54,17,12,'#53685f');
 }
 return v;
}
export function pixelBattlePortrait(kind,equipment={}){
 const safe=['player','wolf','raider','boss','knight','giant','winged'].includes(kind)?kind:'raider';
 const key=JSON.stringify([safe,...['weapon','armor','shield'].map(k=>equipment[k]?.id)]);
 if(cache.has(key))return cache.get(key);
 const enemyGear={armor:safe==='raider'?null:{id:safe==='boss'?'orichalcum_armor':'iron_armor'},weapon:{id:'iron_sword'},shield:safe==='knight'?{id:'iron_shield'}:null};
 const art=safe==='player'?fighter(equipment):['boss','knight','raider'].includes(safe)?fighter(enemyGear,safe==='boss'):beast(safe);
 const facingArt=safe==='boss'?`<g transform="translate(96 0) scale(-1 1)">${art}</g>`:art;
 const url='data:image/svg+xml,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 104" width="192" height="208" shape-rendering="crispEdges">${facingArt}</svg>`);
 if(cache.size>=96)cache.delete(cache.keys().next().value);cache.set(key,url);return url;
}
