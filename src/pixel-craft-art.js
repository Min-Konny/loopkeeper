import {equipmentMaterial} from './visual-design.js?v=0.6.70';
const r=(x,y,w,h,c)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}"/>`;
export function pixelCraftScene(skill,id,mat){
 let target='',arm='',fx='',back='';
 if(skill==='logging'){
  const ancient=id==='chop_ancient_tree',hard=id==='chop_hardwood',w=ancient?23:hard?15:10;
  target+=r(110,18,w,57,'#75543b')+r(112,20,3,52,'#bc9664')+r(110+w-3,23,3,48,'#493f30');
  for(let i=0;i<8;i++)target+=r(115+i%3*3,28+i*5,2,3,'#99754d');
  if(hard||ancient){
   target+=r(94,27,23,5,'#75543b')+r(125,21,22,5,'#75543b');
   for(const [x,y,w] of [[84,20,28],[96,9,31],[119,12,28],[135,24,22],[106,29,31]]){target+=r(x,y+3,w,13,'#3b6245')+r(x+4,y,w-8,20,'#587b4c')+r(x+5,y,w-11,3,'#91a364')+r(x+2,y+7,9,2,'#718e55')+r(x+w-9,y+11,6,3,'#2e563e');}
  }else for(let i=0;i<5;i++){const w=18+i*10;target+=r(116-Math.floor(w/2),5+i*9,w,9,'#456b48')+r(119-Math.floor(w/2),5+i*9,w-8,2,'#8a9f61');}
  target+=r(105,73,w+18,4,'#75543b')+r(108,56,7,5,'#e0bb80');
  if(ancient)target+=r(121,47,7,13,'#273f32')+r(124,49,2,8,'#131f23')+r(131,62,8,3,'#9ea36a')+r(139,66,5,2,'#dbb37b');
  target+=r(78,76,24,6,'#85613e')+r(79,76,4,6,'#d2af75');
  arm=r(56,51,15,4,'#d9bc91')+r(70,30,3,28,'#c8a878')+r(73,29,10,12,mat.metal)+r(80,31,3,8,'#eee1b6');
  fx=r(99,52,4,2,'#d8b778')+r(95,45,2,3,'#b08a54')+r(104,42,3,2,'#dec795');
 }else if(skill==='foraging'){
  const fodder=id==='collect_fodder',herb=id.includes('herb')||fodder,patch=id.includes('patch'),hill=id.includes('highland');
  if(hill)back+=r(81,20,21,34,'#71867a')+r(87,12,10,12,'#a9b9a2')+r(124,29,26,27,'#566e65')+r(132,19,11,12,'#99aa94');
  const count=patch?11:herb?5:7;
  for(let i=0;i<count;i++){
   const x=81+(i*19)%67,y=54+(i*11)%23;
   target+=r(x,y-9,2,17,'#7e9960')+r(x-6,y-7,6,4,'#a8ba77')+r(x+2,y-12,7,4,'#7eaa6c')+r(x-4,y,5,3,'#527d50');
   if(!herb)target+=r(x+1,y-10,5,5,hill?'#d4aa68':'#ce7c65')+r(x+2,y-10,2,1,'#f3c58d');
   if(patch&&i%3===0)target+=r(x-2,y-15,5,3,'#d2bdcb');
  }
  if(fodder)for(let i=0;i<8;i++)target+=r(95+i*4,39+i%3*3,2,35,'#c3b97c');
  target+=r(69,70,17,10,'#9e7849')+r(68,69,19,2,'#d6b57a')+r(72,66,11,2,'#d6b57a');
  for(let i=0;i<4;i++)target+=r(71+i*4,73,1,6,'#624e34');
  if(hill)target+=r(126,72,2,8,'#d9c89a')+r(122,69,10,4,'#b17d55');
  arm=r(57,51,6,5,'#d9bc91')+r(62,54,12,4,'#d9bc91')+r(71,50,2,8,'#7c9b65')+r(68,49,7,3,'#b2bf7b');
  fx=r(75,46,2,2,'#d4dda2')+r(81,52,2,3,'#9cb778');
 }else if(skill==='smithing'){
  const product=equipmentMaterial({id});
  const cook=/meal|cook|soup|roast/.test(id),smelt=/smelt|ingot|refine/.test(id);
  back=r(0,0,170,90,'#37443c')+r(0,73,170,17,'#6e624a');
  for(let i=0;i<30;i++)back+=r((i*29)%170,5+Math.floor(i/7)*14,22,10,i%2?'#5b6350':'#4b584b');
  back+=r(9,0,5,74,'#947346')+r(153,0,5,74,'#947346')+r(8,10,149,4,'#b79861');
  target+=r(128,29,26,45,'#84735a')+r(132,24,18,7,'#a39674')+r(133,46,16,22,'#303932')+r(135,56,12,11,'#ba6e3e')+r(139,52,5,14,'#f4c873');
  for(let i=0;i<5;i++)target+=r(129,34+i*8,24,1,'#b6a381');
  target+=r(18,19,37,3,'#b79764')+r(22,23,2,11,'#c4c6a0')+r(20,23,7,4,'#9ba999')+r(35,23,2,13,'#b9935b')+r(33,23,7,5,'#a7b7a5')+r(146,72,13,10,'#947344')+r(147,74,11,2,'#d0af74');
  target+=r(81,66,38,4,'#af8957')+r(85,70,5,10,'#775b3d')+r(111,70,5,10,'#775b3d');
  if(cook)target+=r(85,48,31,14,'#465957')+r(88,62,25,3,'#718879')+r(83,46,35,3,'#a7ad89')+r(89,49,23,3,'#c5a069')+r(90,38,2,6,'#bdc6a7')+r(103,33,2,10,'#bdc6a7');
  else if(smelt)target+=r(86,56,25,7,product.metal)+r(89,54,19,2,'#f4cf8a')+r(89,62,23,2,'#6c6251');
  else{
   target+=r(84,57,31,5,'#9eada1')+r(92,62,14,4,'#63776c');
   if(/shield/.test(id))target+=r(91,39,18,15,product.metal)+r(95,54,10,4,product.metal)+r(99,41,2,14,'#ead7a4');
   else if(/armor/.test(id))target+=r(90,40,22,7,product.metal)+r(94,47,14,10,product.metal)+r(98,40,6,3,'#354b43');
   else if(/bow/.test(id))target+=r(92,34,3,24,'#b58e5e')+r(95,38,3,16,'#d9c38b')+r(101,34,1,24,'#d9c38b');
   else if(/staff/.test(id))target+=r(98,38,3,20,'#a18860')+r(95,32,9,7,'#9ed5bb');
   else target+=r(88,52,27,3,product.metal)+r(91,49,2,9,'#d6b675');
  }
  arm=r(56,51,14,4,'#d9bc91')+r(70,34,3,24,'#bd965d')+(cook?r(69,31,5,7,'#d7be88'):r(65,31,14,8,mat.metal));
  fx=r(83,48,2,3,'#f8d68b')+r(77,42,2,2,'#eab774')+r(90,40,2,3,'#f8d68b');
 }else return null;
 return {back,target,arm,fx};
}
