import { pixelCraftScene } from './pixel-craft-art.js?v=0.6.25';
import { equipmentMaterial } from './visual-design.js?v=0.6.25';

const r=(x,y,w,h,color)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${color}"/>`;
const p=(points,color)=>`<polygon points="${points}" fill="${color}"/>`;
const veins={quarry_stone:['#748276','#aeb19a'],mine_ore:['#796151','#d3a17a'],mine_coal:['#293e41','#617574'],mine_silver:['#6a7b85','#dfebdf'],mine_mithril:['#467878','#9ae0bc'],mine_diamond:['#729bb0','#d2f2ee'],mine_orichalcum:['#876345','#f2d486']};
export function pixelWorkScene(skill,id,equipment={}){
 if(!['logging','foraging','smithing','mining','combat'].includes(skill))return null;
 const mat=equipmentMaterial(skill==='combat'?equipment.weapon:equipment.tool),armor=equipmentMaterial(equipment.armor),shield=equipmentMaterial(equipment.shield);
 const fish=id==='fish_river',defense=id==='train_defense',vitality=id==='train_vitality';
 let back=r(0,0,170,90,'#233e3c')+r(0,57,170,33,'#506448'),target='',arm='',fx='';
 for(let i=0;i<12;i++)back+=p(`${i*16-6},60 ${i*16+3},${12+(i%4)*7} ${i*16+14},60`,'#355448')+r(i*16+3,46,2,16,'#5e6345');
 for(let i=0;i<38;i++)back+=r((i*31)%170,64+(i*13)%24,3,1,i%2?'#829064':'#354e39');
 const craft=id==='fish_river'?null:pixelCraftScene(skill,id,mat);
 if(craft){back+=craft.back;target=craft.target;arm=craft.arm;fx=craft.fx;}else if(skill==='mining'){
  const [base,light]=veins[id]||veins.quarry_stone;
  back=r(0,0,170,90,'#243b37')+p('0,0 170,0 170,78 125,65 91,76 41,64 0,77','#465a4a');
  for(let i=0;i<24;i++){const x=(i*37)%170,y=(i*19)%65;back+=p(`${x},${y+9} ${x+3},${y} ${x+15},${y+1} ${x+19},${y+10}`,'#5c6c54')+r(x+3,y,11,1,'#899278');}
  back+=r(0,76,170,14,'#5c6045')+r(10,9,5,63,'#7e6847')+r(151,9,5,63,'#7e6847')+r(8,8,150,5,'#ab8c59');
  for(let i=0;i<9;i++)back+=r(18+i*15,9,1,2,'#d1b77f');
  target=p('81,72 87,51 103,39 130,43 146,62 142,77',base)+p('87,51 103,39 111,55 99,73 81,72',light);
  if(id==='mine_diamond'||id==='mine_mithril')for(let i=0;i<3;i++){
   const x=96+i*16,y=60+(i%2)*8;target+=p(`${x},${y+10} ${x-4},${y-8} ${x+4},${y-19} ${x+11},${y-12} ${x+9},${y+9}`,light)+p(`${x+4},${y-19} ${x+4},${y+9} ${x-4},${y-8}`,base)+r(x+4,y-15,1,12,'#f1f5d8');
  }else if(id==='quarry_stone'){target+=p('96,46 98,46 104,58 99,69 97,69 101,58','#465c50')+r(115,64,21,2,'#c4c4a7');}
  else if(id==='mine_silver'||id==='mine_orichalcum'){for(let i=0;i<3;i++)target+=p(`${94+i*12},70 ${99+i*11},56 ${96+i*12},50 ${100+i*12},50 ${103+i*11},56 ${98+i*12},70`,light);if(id==='mine_orichalcum')target+=r(118,45,9,5,'#fbe8a6');}
  else for(let i=0;i<(id==='mine_coal'?8:6);i++){const x=94+(i*13)%38,y=50+(i*7)%22;target+=p(`${x},${y} ${x+6},${y-3} ${x+10},${y+3} ${x+5},${y+7}`,light)+r(x+2,y,4,1,'#d4d5b2');}
  if(id==='mine_diamond')target+=p('114,28 126,28 132,36 120,49 108,36',light)+r(114,29,10,1,'#ffffff');
  target+=r(132,75,20,9,'#8c6e49')+r(134,77,16,2,'#bd9b64')+r(134,84,3,3,'#273d36')+r(147,84,3,3,'#273d36');
  arm=r(57,51,15,4,'#d9bc91')+r(71,35,3,23,'#b99861')+p('62,33 72,29 86,32 90,38 77,34 64,37',mat.metal);
  fx=r(90,48,3,2,light)+r(83,42,2,2,light)+r(97,38,2,2,light);
 }else if(fish){
  back+=p('74,47 170,40 170,90 65,90','#346a72')+p('74,47 170,40 170,44 75,51','#739b91');
  for(let i=0;i<24;i++)back+=r(78+(i*23)%88,50+(i*7)%39,4+i%7,1,i%3?'#5c9394':'#a2b7a3');
  back+=r(31,69,59,4,'#b49665')+r(38,73,3,13,'#65543a')+r(83,73,3,13,'#65543a');
  for(let i=0;i<7;i++)back+=r(35+i*8,69,1,4,'#5d563d');
  target=r(101,62,3,4,'#debb7a')+r(101,62,3,2,'#b97e58')+r(97,67,12,1,'#bbd0b3')+r(113,81,13,1,'#83b6ac');
  arm=r(56,52,15,3,'#d9bc91')+p('66,53 91,20 94,20 69,55','#c8b080')+p('93,20 103,62 102,62 92,23','#e4d5a6');
  target+=r(21,65,12,9,'#aa8552')+r(22,63,10,2,'#d8b87b');
  for(let i=0;i<7;i++)target+=r(143+i*3,53-i%3*4,1,11,'#b6b47d');
  fx=r(97,60,2,2,'#d7e7cc')+r(107,59,2,3,'#d7e7cc')+r(94,64,3,1,'#d7e7cc');
 }else{
  back+=r(73,64,81,14,'#8f8660');for(let i=0;i<8;i++)back+=r(76+i*10,67,7,1,'#b3aa7a');
  if(defense){target=r(118,39,4,33,'#9f8254')+p('105,28 134,28 138,44 122,61 102,44','#ac9463')+r(108,34,24,2,'#d7bb80')+r(109,47,21,2,'#6e6446');arm=r(55,51,9,4,'#d9bc91')+p('61,43 78,43 81,55 71,66 60,56',shield.metal)+r(69,46,2,15,'#e2d2a4');}
  else if(vitality){target=r(109,59,24,3,'#aaad8e')+r(106,54,5,13,'#536c60')+r(132,54,5,13,'#536c60');arm=r(54,46,6,10,'#d9bc91')+r(41,44,25,2,'#abb9a3')+r(38,39,5,12,'#6e8777')+r(64,39,5,12,'#6e8777');}
  else{target=r(121,31,3,42,'#9f8254')+r(111,43,25,2,'#c4a471')+r(116,27,15,14,'#b39868')+r(119,29,9,2,'#ddc486')+r(113,74,19,3,'#756347');arm=r(55,50,13,4,'#d9bc91')+r(68,33,3,24,'#ac8c5e')+p('66,33 68,17 71,13 74,17 73,33',mat.metal)+r(65,34,10,2,'#d9b97a');}
  fx=r(78,32,2,8,'#d5dcb7')+r(81,41,2,5,'#b9c9a8');
 }
 let person=r(37,76,27,3,'#293f32')+r(44,65,5,11,'#33473e')+r(55,65,5,11,'#33473e')+r(42,49,19,17,armor.cloth)+r(44,50,4,14,'#aab894')+r(45,34,12,14,'#d7b98d')+r(43,32,15,5,'#87916b')+r(40,36,21,2,'#c4b880')+r(56,39,1,2,'#2a4037');
 if(equipment.armor)person+=r(44,51,14,10,armor.metal)+r(46,33,11,3,armor.metal);
 return `<div class="work-vignette work-${skill} pixel-work material-${mat.tier}" style="--tool-metal:${mat.metal};--work-cloth:${armor.cloth}" aria-hidden="true"><svg viewBox="0 0 170 90" shape-rendering="crispEdges">${back}<g class="pixel-target">${target}</g>${person}<g data-pixel-arm="">${arm}</g><g data-pixel-effect="" opacity="0">${fx}</g></svg></div>`;
}
