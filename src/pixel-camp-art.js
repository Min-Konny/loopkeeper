// Original pixel art shared by the live camp and the visual study.
export const PIXEL_FACILITIES = {
 watchtower: [238, 120], archery_tower: [433, 135], infirmary: [189, 116],
 market: [129, 131], guardhouse: [66, 146], smokehouse: [16, 177],
 henhouse: [397, 216], barricade: [278, 225], workshop: [335, 173],
};
export function createPixelCampRenderer(canvas) {
const c = canvas.getContext('2d', { alpha: false });
let built = false, night = false, facilities = {}, construction = null, threat = 0, chopping = false;
const rect = (x,y,w,h,color) => {c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),w,h);};
// Scanline polygons keep diagonals on the same pixel grid as the painted details.
const poly = (points,color) => {
 const min=Math.floor(Math.min(...points.map(p=>p[1]))),max=Math.ceil(Math.max(...points.map(p=>p[1])));
 for(let y=min;y<max;y++){
  const xs=[];
  for(let i=0;i<points.length;i++){const a=points[i],b=points[(i+1)%points.length];if((a[1]<=y+.5&&b[1]>y+.5)||(b[1]<=y+.5&&a[1]>y+.5))xs.push(a[0]+(y+.5-a[1])*(b[0]-a[0])/(b[1]-a[1]));}
  xs.sort((a,b)=>a-b);for(let i=0;i+1<xs.length;i+=2)rect(Math.ceil(xs[i]),y,Math.max(1,Math.floor(xs[i+1])-Math.ceil(xs[i])+1),1,color);
 }
};
const noise = (i) => {const n=Math.sin(i*127.1+311.7)*43758.5453;return n-Math.floor(n);};
function pine(x,y,size,tone,detail=true){
 rect(x-2,y-size*.55,4,size*.6,'#263e37');
 for(let k=0;k<4;k++){
  const yy=y-size+k*size*.18, half=size*(.13+k*.04);
  poly([[x,yy],[x+half,yy+size*.36],[x+half-6,yy+size*.36],[x+half+3,yy+size*.4],[x-half-3,yy+size*.4],[x-half+3,yy+size*.34]],tone);
  if(detail)poly([[x,yy+3],[x-3,yy+size*.24],[x-half+3,yy+size*.34],[x-1,yy+size*.29]],'#496653');
  if(detail){
   // Branch fans follow the tree's silhouette; avoid uniform speckle.
   for(let j=0;j<9;j++){
    const by=yy+size*(.12+j*.027),spread=half*(.2+j*.085);
    for(const side of [-1,1]){
     const bx=x+side*spread;
     poly([[x+side*2,by-4],[bx,by+2],[bx+side*4,by],[bx+side*2,by+5],[x+side*2,by+1]],side<0?'#4a6850':'#294b3e');
     rect(bx-2,by,4,1,side<0?'#71845b':'#3c5c46');
    }
   }
  }
 }
 if(detail){rect(x-1,y-16,2,19,'#866d48');rect(x+1,y-14,2,17,'#4b4834');poly([[x,y-2],[x-8,y+3],[x+6,y+3]],'#46543b');}
}
function rock(x,y,s=1){
 poly([[x,y],[x+3*s,y-5*s],[x+10*s,y-7*s],[x+16*s,y-3*s],[x+17*s,y+2*s],[x+2*s,y+3*s]],'#485b4e');
 poly([[x+2*s,y-1*s],[x+5*s,y-5*s],[x+10*s,y-6*s],[x+13*s,y-2*s]],'#9b9e7c');
 poly([[x+3*s,y],[x+12*s,y-2*s],[x+15*s,y],[x+8*s,y+2*s]],'#747f64');
 rect(x+4*s,y-4*s,4*s,1,'#b4b38a');rect(x+1*s,y+1*s,6*s,2,'#5e7647');
}
function fern(x,y,s=1){
 for(let k=0;k<4;k++)for(const side of [-1,1]){
  const xx=x+side*(3+k*3)*s,yy=y-(12-k*2)*s;
  poly([[x,y],[xx,yy],[xx+side*3*s,yy+2*s],[x+side*2*s,y-2*s]],'#557745');
  rect(xx,yy,side<0?4:3,1,'#a0ac68');rect(xx-side*2*s,yy+3*s,3,1,'#7f9657');
 }
 rect(x,y-13*s,1,13*s,'#b0b376');
}
function shrub(x,y,seed){
 for(let i=0;i<13;i++){
  const xx=x+Math.floor(noise(seed+i)*24),yy=y+Math.floor(noise(seed+i+30)*9);
  rect(xx,yy,6,4,'#304e37');rect(xx-1,yy+1,8,2,'#304e37');
  rect(xx,yy,5,2,'#637e48');rect(xx+1,yy-1,3,1,'#8c9d5a');
  if(i%5===0){rect(xx+3,yy+2,2,2,'#c5a26a');}
 }
}
function leafyTree(x,y){
 poly([[x-4,y],[x-3,y-52],[x-16,y-66],[x-12,y-68],[x+1,y-55],[x+12,y-73],[x+15,y-71],[x+4,y-50],[x+6,y]],'#4a4932');
 rect(x-2,y-49,2,46,'#92825a');rect(x+3,y-24,1,23,'#b0a16c');
 for(let i=0;i<24;i++){
  const xx=x-25+noise(i+94)*46,yy=y-83+noise(i+120)*32;
  const w=9+Math.floor(noise(i+183)*9);
  rect(xx+2,yy-2,w-4,3,'#314d36');rect(xx,yy,w,7,'#314d36');rect(xx+2,yy+7,w-3,3,'#314d36');
  rect(xx+1,yy,w-2,4,'#617b46');rect(xx+3,yy-1,w-6,2,'#89985a');rect(xx+2,yy+1,3,1,'#b0b16c');rect(xx+5,yy+5,4,2,'#49653d');
 }
 fern(x-4,y+1,.8);
}
function barrel(x,y){
 rect(x+1,y,12,17,'#483c2e');rect(x+2,y+1,10,15,'#a07b4b');rect(x+4,y+1,2,15,'#c3a068');rect(x+8,y+1,1,15,'#6e5135');
 rect(x,y+4,14,2,'#58655c');rect(x,y+12,14,2,'#58655c');rect(x+2,y,10,2,'#d0ae76');rect(x+4,y+1,6,1,'#78603d');
}
function crate(x,y){
 rect(x,y,15,13,'#604c34');rect(x+1,y+1,13,11,'#b08a54');rect(x+4,y+2,1,9,'#7b5b38');rect(x+9,y+2,1,9,'#7b5b38');
 poly([[x+1,y+1],[x+3,y+1],[x+14,y+10],[x+14,y+12]],'#d1ac70');rect(x,y,15,1,'#e0bd82');rect(x,y+11,15,2,'#7e623e');
}
function lantern(x,y,t){
 rect(x+3,y-3,1,4,'#b2a16e');rect(x+1,y,5,1,'#302f28');rect(x,y+1,7,9,'#434332');
 rect(x+1,y+2,5,6,night?'#f6ca73':'#d8b978');rect(x+3,y+3,2,4,'#ffe3a0');rect(x,y+9,7,2,'#a68b53');
 if(night){c.globalAlpha=.08+Math.sin(t*3)*.015;rect(x-7,y-3,21,17,'#ffc36b');rect(x-3,y-1,13,14,'#ffc36b');c.globalAlpha=1;}
}
function log(x,y){rect(x,y,22,6,'#694936');rect(x,y,22,2,'#b28b56');rect(x+2,y+3,17,1,'#493d31');rect(x+20,y,5,6,'#d1a66b');rect(x+21,y+2,2,2,'#80603e');}
function person(x,y,t,wood=false){
 const swing=Math.floor(t*3)%4;
 rect(x-7,y+20,16,3,'#243c33');rect(x-3,y+14,3,7,'#343c3c');rect(x+3,y+14,3,7,'#343c3c');
 rect(x-4,y+5,11,10,'#78958a');rect(x-3,y+6,3,8,'#a6b7a0');rect(x-2,y-2,7,7,'#d9b986');rect(x-4,y-4,10,4,'#726341');rect(x-6,y-1,12,2,'#aa9258');rect(x+4,y+1,1,2,'#293e35');
 if(wood){
  if(swing<2){rect(x+6,y+5,5,3,'#d9b986');rect(x+10,y-6,2,14,'#c3a46e');rect(x+10,y-7,8,5,'#94a7a2');rect(x+16,y-7,2,5,'#d1d8b7');}
  else{rect(x+6,y+9,8,3,'#d9b986');rect(x+12,y+10,13,2,'#c3a46e');rect(x+22,y+9,4,7,'#b8c5b3');if(swing===2){rect(x+29,y+10,3,2,'#c9a46b');rect(x+31,y+16,2,2,'#d5bc83');}}
 }else{rect(x+7,y+8,3,7,'#d9b986');}
}
function workshop(t){
 rect(285,172,111,10,'#253d34');rect(294,116,89,57,'#524738');
 for(let row=0;row<9;row++){rect(296,118+row*6,84,5,row%2?'#97764e':'#aa8558');rect(299+(row%3)*22,119+row*6,13,1,'#c09b67');rect(333+(row%2)*26,121+row*6,18,1,'#76583e');}
 rect(294,115,5,58,'#594735');rect(378,115,5,58,'#594735');rect(300,144,78,4,'#604a35');rect(300,145,78,1,'#c29d68');
 rect(357,78,13,35,'#5b6460');for(let j=0;j<6;j++){rect(358,80+j*5,11,1,'#859083');rect(359+(j%2)*5,81+j*5,1,3,'#394b47');}rect(355,77,17,4,'#a0a291');
 poly([[284,116],[298,109],[336,80],[388,112],[394,120],[284,120]],'#303e37');
 for(let row=0;row<6;row++){const yy=86+row*5;const left=336-row*8;const right=341+row*9;rect(left,yy,right-left,5,row%2?'#6b8170':'#7e9074');for(let x=left+3;x<right;x+=10)rect(x+(row%2)*3,yy,1,4,'#425b50');rect(left,yy,right-left,1,'#a0ab82');}
 rect(284,116,110,4,'#c2a16c');rect(286,120,108,3,'#584630');
 rect(306,128,22,26,'#443e31');rect(309,131,16,19,night?'#f3c96c':'#d6bd7b');rect(315,131,2,19,'#675334');rect(309,139,16,2,'#675334');rect(304,154,26,3,'#d1ac73');
 rect(342,129,25,44,'#37443a');rect(345,131,20,39,'#514735');rect(347,133,3,35,'#826342');rect(361,150,2,2,'#e2c382');
 rect(337,168,35,5,'#99927a');rect(334,173,41,4,'#777d69');rect(336,173,39,1,'#b4ad8b');
 // Stone footing and carpentry: joints, end grain, iron nails, braces.
 for(let i=0;i<8;i++){rect(296+i*5,164,4,7,i%2?'#7e8270':'#99987a');rect(296+i*5,164,4,1,'#bcaf85');}
 for(let i=0;i<30;i++){const x=301+noise(i+50)*74,y=124+Math.floor(noise(i+75)*6)*6; if(x>304&&x<330&&y<158||x>339&&x<369)continue;rect(x,y,5,1,'#735239');rect(x+2,y+1,2,1,'#c19a63');}
 poly([[299,124],[302,124],[313,136],[310,136]],'#d0aa6b');poly([[374,124],[378,124],[368,136],[365,136]],'#d0aa6b');
 for(const x of [296,380]){rect(x,126,1,1,'#d3c5a0');rect(x,145,1,1,'#d3c5a0');rect(x,159,1,1,'#d3c5a0');}
 // Individually shaded shingles, staggered seams and moss along the eaves.
 for(let row=0;row<6;row++){
  const yy=86+row*5,left=336-row*8,right=341+row*9;
  for(let x=left+1;x<right-3;x+=7){rect(x,yy+1,5,3,['#788967','#889775','#627b65'][(row+Math.floor(x/7))%3]);rect(x,yy+4,5,1,'#3c594b');rect(x+1,yy+1,3,1,'#b1b591');}
 }
 for(let i=0;i<11;i++){rect(289+i*9,119,5,2,'#2e4237');rect(291+i*9,121,2,2,'#95845a');}
 rect(331,83,13,2,'#bcc09b');rect(334,81,8,2,'#8f9d7c');
 // Small dormer gives the roof depth and an inhabitable attic.
 poly([[311,106],[322,95],[333,106]],'#3a493e');rect(314,106,16,10,'#b29662');poly([[309,105],[322,93],[335,105],[333,108],[322,98],[311,108]],'#b9b28a');rect(318,104,8,10,'#3b4539');rect(319,105,6,7,'#c2be86');rect(321,105,1,7,'#62573c');
 // Shutters, window box and climbing leaves.
 rect(301,130,4,22,'#677d63');rect(329,130,4,22,'#677d63');for(let j=0;j<5;j++){rect(301,132+j*4,4,1,'#a5aa77');rect(329,132+j*4,4,1,'#a5aa77');}
 rect(305,156,25,5,'#72523a');rect(305,156,25,1,'#c29860');for(let i=0;i<8;i++){rect(307+i*3,153-(i%2)*2,2,4,'#70884d');if(i%2)rect(307+i*3,152,2,2,'#e1c092');}
 for(let i=0;i<18;i++){const x=377+Math.sin(i*.7)*3,y=123+i*2;rect(x,y,3,2,i%3?'#5f784b':'#91a25f');}
 // Hanging sign, hinges, porch lamp, side shelter and tools.
 rect(369,124,1,12,'#3b3d31');rect(365,135,13,9,'#513e2d');rect(366,136,11,7,'#c19b61');rect(369,138,6,2,'#594d36');rect(371,139,2,4,'#594d36');
 rect(346,139,4,2,'#252f2d');rect(346,160,4,2,'#252f2d');lantern(334,140,t);
 rect(409,135,3,42,'#7d6241');rect(383,135,2,15,'#7d6241');poly([[380,136],[383,123],[418,130],[420,140]],'#3e5346');
 for(let j=0;j<4;j++){rect(383+j*9,128+j,8,8,j%2?'#8c946d':'#718266');rect(383+j*9,135+j,8,1,'#bfba8b');}
 // Outdoor forge and anvil; a warm pixel light remains visible at night.
 rect(385,147,29,28,'#646c60');for(let j=0;j<4;j++)rect(386,150+j*6,27,1,'#8c9077');rect(391,152,17,18,'#332f29');rect(393,161,12,8,'#d7783e');rect(395,164-(Math.floor(t*5)%3),8,5,'#efbc60');rect(399,165,3,4,'#f7dfa1');
 rect(374,177,20,4,'#b19b71');rect(377,181,4,9,'#69533d');rect(389,181,3,9,'#69533d');poly([[374,170],[395,170],[391,174],[385,174],[385,177],[379,177],[379,174],[374,173]],'#82938b');rect(375,169,20,1,'#c5cbb0');
 for(let i=0;i<5;i++){let p=(t*.12+i*.19)%1;let sx=360+Math.sin(p*5+i)*5,sy=75-p*42;c.globalAlpha=(1-p)*.35;rect(sx,sy,6+i,4+i,'#c6d3bf');rect(sx+2,sy-3,5+i,4,'#c6d3bf');}c.globalAlpha=1;
 log(292,179);log(289,186);log(311,185);
 barrel(279,158);crate(267,176);crate(271,164);barrel(416,163);
 rect(400,179,2,15,'#d2b177');rect(397,178,8,3,'#a1ada0');rect(406,178,2,16,'#a18551');rect(404,189,6,6,'#8f9e8a');
 rock(289,174,.6);fern(428,183,.7);
 if(facilities.workshop>=2){rect(295,160,38,3,'#aaa78c');rect(297,161,2,2,'#646f61');}
 if(facilities.workshop>=3){rect(371,95,1,20,'#d5ba7c');rect(372,95,10,6,'#a7b481');rect(372,95,10,1,'#ead3a1');}
 if(facilities.workshop>=5){rect(335,81,4,3,'#e2c275');rect(336,78,2,4,'#fff0ba');}
}
function facility(id, level, t){
 const [x,y]=PIXEL_FACILITIES[id], stone=level>=2;
 const roof=level>=5?'#b8a369':level>=3?'#789b85':'#63785e';
 rect(x-23,y,48,4,'#293f32');
 if(id==='barricade'){
  for(let i=0;i<12;i++){let xx=x-30+i*5;rect(xx,y-15,4,16,stone?'#879480':'#a18455');poly([[xx,y-15],[xx+2,y-19],[xx+4,y-15]],stone?'#b9ba92':'#d4b17a');rect(xx+1,y-12,1,11,stone?'#a6ae8d':'#d2af73');}
  rect(x-31,y-9,61,2,'#4e5b44');rect(x-31,y-2,61,2,'#4e5b44');return;
 }
 const tower=id==='watchtower'||id==='archery_tower';
 const h=tower?45:25,w=tower?22:40,left=x-w/2;
 rect(left,y-h,w,h,stone?'#788570':'#a58356');
 for(let j=0;j<h;j+=5){rect(left+1,y-h+j,w-2,1,stone?'#b4b194':'#d1aa6c');for(let k=0;k<w;k+=9)rect(left+k+(j%2)*3,y-h+j+1,1,3,stone?'#4f6559':'#775839');}
 rect(left,y-h,2,h,'#485644');rect(x+w/2-2,y-h,2,h,'#485644');
 poly([[left-5,y-h+1],[x,y-h-14],[x+w/2+5,y-h+1]],'#32483c');
 for(let j=0;j<4;j++){const span=(j+1)*(w+8)/4;rect(x-span/2,y-h-11+j*3,span,3,roof);rect(x-span/2,y-h-9+j*3,span,1,'#b8b88c');}
 rect(x-5,y-13,10,13,'#334538');rect(x-4,y-12,2,11,'#77623f');
 if(tower){
  rect(x-8,y-h+5,16,10,'#253e35');rect(x-10,y-h+15,20,2,'#ceb27c');
  for(let j=0;j<5;j++)rect(x-4,y-23+j*4,8,1,'#d0b17a');
  rect(x+2,y-h-23,1,12,'#d6be85');rect(x+3,y-h-23,9+(Math.floor(t*2)%2),5,roof);rect(x+3,y-h-23,8,1,'#e0cea0');
  if(id==='archery_tower'){poly([[x-8,y-h+7],[x-4,y-h+5],[x-2,y-h+10],[x-4,y-h+14],[x-8,y-h+12],[x-5,y-h+11],[x-4,y-h+9]],'#d9bd81');rect(x-9,y-h+10,16,1,'#c8c6a1');}
  else lantern(x-2,y-h+6,t);
 }else{
  rect(left+5,y-18,7,8,night?'#edc579':'#c5bd8a');rect(left+8,y-18,1,8,'#5c6246');rect(left+4,y-10,9,2,'#cfb37e');
  if(id==='infirmary'){rect(x+8,y-21,7,9,'#d5d5b4');rect(x+10,y-20,3,7,'#739286');rect(x+8,y-18,7,3,'#739286');fern(x+19,y,.6);}
  if(id==='market'){
   for(let i=0;i<6;i++)rect(left-2+i*7,y-16,7,6,i%2?'#c9ad71':'#7c9980');rect(left-3,y-10,46,2,'#d8bd82');rect(left,y-9,2,9,'#aa8755');rect(x+w/2-1,y-9,2,9,'#aa8755');
   rect(left+3,y-5,33,3,'#b68e58');for(let i=0;i<6;i++)rect(left+5+i*5,y-8,3,3,i%2?'#be9562':'#96ad68');barrel(x+24,y-13);
  }
  if(id==='guardhouse'){rect(left-3,y-h,46,5,'#a2a78b');for(let i=0;i<6;i++)rect(left-3+i*8,y-h-4,5,5,'#b5b898');poly([[x+9,y-20],[x+17,y-18],[x+16,y-11],[x+13,y-8],[x+9,y-12]],'#799b93');rect(x+12,y-18,1,8,'#e1cf98');}
  if(id==='smokehouse'){
   rect(x+9,y-h-18,6,16,'#7f8a76');rect(x+8,y-h-19,8,2,'#b1b492');
   c.globalAlpha=.3;const p=(t*.16)%1;rect(x+10+Math.sin(p*5)*3,y-h-22-p*15,5,4,'#c9d0bb');c.globalAlpha=1;
   rect(left+2,y+3,30,1,'#d2b580');for(let i=0;i<4;i++){rect(left+6+i*6,y+1,1,5,'#c3c7a1');rect(left+5+i*6,y+4,3,4,'#a7b7a4');}
  }
  if(id==='henhouse'){
   rect(x-4,y-12,8,7,'#d5c18b');rect(x-3,y-10,5,5,'#504c31');rect(x+10,y+4,6,4,'#ede3ba');rect(x+15,y+2,3,4,'#eee7cc');rect(x+16,y+1,2,2,'#b66e4b');rect(x+18,y+4,2,1,'#d4ac5c');
   for(let i=0;i<5;i++){rect(x-18+i*9,y+5,1,5,'#b6a572');}rect(x-19,y+6,39,1,'#c1b07e');
  }
 }
 if(level>=3){rect(left,y-3,w,2,'#b7b08b');rect(x+16,y-h-8,1,8,'#e1c78f');rect(x+17,y-h-8,7,4,roof);}
 if(level>=5)rect(x-1,y-h-16,3,3,'#edd292');
}
function draw(t){
 c.imageSmoothingEnabled=false;
 rect(0,0,480,240,night?'#142838':'#6b9392');
 for(let j=0;j<7;j++)rect(0,j*15,480,15,night?['#142838','#192f40','#203b48','#294650','#34545a','#3f6262','#4b6e69'][j]:['#718f94','#7e9c9a','#8eaaa1','#a3b7a5','#b5c4ab','#becbb0','#c8cfac'][j]);
 // Fine bands soften the horizon without smoothing the pixel artwork.
 if(!night){for(let i=0;i<28;i++)rect(noise(i+3300)*480,18+noise(i+3400)*56,20+noise(i)*37,1,'#b0c1b1');
  for(const [x,y] of [[94,25],[264,39],[350,18]]){rect(x,y,32,3,'#c6d0b7');rect(x+8,y-3,19,3,'#d5d9be');rect(x-10,y+3,52,2,'#b5c6b1');}}
 if(night){for(let i=0;i<38;i++)rect(noise(i)*480,noise(i+99)*85,1,1,i%3?'#8caaa7':'#e3d6ad');rect(393,23,13,15,'#ddd9ae');rect(389,27,20,8,'#ddd9ae');rect(389,23,10,10,'#203b48');}
 poly([[0,104],[47,61],[75,77],[118,45],[173,83],[218,58],[278,88],[324,49],[390,79],[435,53],[480,81],[480,160],[0,160]],night?'#29474b':'#78958b');
 for(let i=0;i<27;i++)pine(i*20-10,145+noise(i)*12,40+noise(i+10)*40,night?'#294d49':'#54796c',false);
 rect(0,143,480,97,'#425b41');poly([[0,155],[101,146],[187,157],[266,147],[368,153],[480,143],[480,240],[0,240]],'#526747');
 poly([[150,240],[194,208],[228,181],[261,164],[302,169],[286,180],[251,193],[225,217],[217,240]],'#8a8360');
 poly([[0,197],[95,180],[174,184],[229,179],[289,174],[355,184],[480,204],[480,213],[354,194],[267,186],[183,195],[94,190],[0,210]],'#8a8360');
 for(let i=0;i<370;i++){let x=noise(i+400)*480,y=148+noise(i+900)*92;rect(x,y,2+Math.floor(noise(i)*3),1,['#65794d','#798252','#394f3b','#a29866'][i%4]);}
 for(let i=0;i<8;i++)pine(i*29-4,170+noise(i)*10,95+noise(i+5)*40,'#304f42');
 for(let i=0;i<5;i++)pine(424+i*24,163+noise(i)*10,90+noise(i+5)*40,'#304f42');
 leafyTree(43,169);
 for(const [x,y,s] of [[19,184,1.3],[129,169,.8],[255,159,.7],[448,194,1.4]])rock(x,y,s);
 for(const [x,y] of [[21,174],[44,163],[112,164],[218,157],[244,148],[402,163],[442,177]])shrub(x,y,x);
 for(const [x,y] of [[35,188],[132,183],[217,168],[261,168],[438,196]])fern(x,y,.8);
 // Raised earth and retaining walls anchor the upper village into the hillside.
 for(const id of ['watchtower','infirmary','market','guardhouse','archery_tower'])if(facilities[id]>0){
  const [x,y]=PIXEL_FACILITIES[id];
  poly([[x-27,y-2],[x+25,y-2],[x+37,174],[x-37,174]],'#4c6342');
  rect(x-25,y,51,5,'#6d7d5b');rect(x-25,y,51,1,'#a6a67a');
  for(let i=0;i<9;i++){rect(x-24+i*6,y+2,5,3,i%2?'#788568':'#909477');}
  for(let i=0;i<5;i++){rect(x+17+i*2,y+6+i*6,7,2,'#8d9571');rect(x-22+(i%2)*2,y+10+i*5,5,1,'#69814d');}
 }
 for(const id of ['watchtower','infirmary','market','guardhouse','archery_tower','smokehouse'])if(facilities[id]>0)facility(id,facilities[id],t);
 // Tent, seams and a folded bedroll.
 rect(141,174,83,8,'#344937');poly([[143,173],[175,127],[218,169],[218,176]],'#b0a377');poly([[175,127],[180,176],[218,176]],'#d1bd83');poly([[149,174],[175,135],[177,175]],'#34473b');poly([[149,174],[169,142],[158,173]],'#8c885e');rect(175,125,2,51,'#e5d097');rect(138,174,84,3,'#726440');rect(204,168,2,10,'#ead7a1');rect(136,172,2,9,'#c9af77');rect(182,181,20,5,'#596f60');rect(185,181,2,5,'#b9ad77');rect(196,181,2,5,'#b9ad77');
 poly([[179,138],[185,169],[207,173]],'#b8a673');poly([[181,147],[186,171],[193,173]],'#e0cb91');
 for(let i=0;i<13;i++){rect(180+i*2,140+i*2,1,1,'#f1dba0');rect(148+i,173-i*2,1,1,'#d1b97d');}
 poly([[175,128],[132,177],[131,177]],'#c6b783');poly([[202,156],[226,180],[225,180]],'#c6b783');rect(225,176,2,6,'#73533a');
 crate(203,180);barrel(155,179);lantern(141,161,t);
 if(built)workshop(t);else{log(305,176);log(309,169);rect(343,168,24,7,'#5d654c');rect(346,166,19,2,'#8b9472');}
 // Axe work at the chopping block.
 rect(111,189,18,10,'#695139');rect(110,186,20,5,'#c1a46c');rect(114,187,11,2,'#846340');person(89,178,t,chopping);
 log(53,205);log(62,199);log(74,206);
 for(let i=0;i<15;i++)rect(103+noise(i+800)*29,198+noise(i+830)*8,2,1,i%2?'#ccae73':'#a08450');
 // Fire ring, layered pixel flames, sparks and ground light.
 c.globalAlpha=.15;rect(214,194,53,23,'#ecbb65');rect(221,190,39,31,'#ecbb65');c.globalAlpha=1;
 for(let i=0;i<8;i++){let a=i*Math.PI/4;rect(239+Math.cos(a)*15,208+Math.sin(a)*5,7,4,i<4?'#a5a28a':'#707e68');}
 rect(230,207,23,4,'#533e2f');rect(233,211,20,2,'#b18651');
 let f=Math.floor(t*7)%4;
 poly([[231,207],[229,201],[235,196-f],[235,189],[242,195],[245,184+f],[248,197],[253,200],[250,208]],'#d97a3c');poly([[234,207],[235,198],[240,200],[244,190+f],[247,203],[250,207]],'#f2bb5f');rect(239,201-f,5,8,'#ffe0a0');
 for(let i=0;i<6;i++){let p=(t*.36+i/6)%1;rect(238+Math.sin(p*6+i)*8,197-p*27,1,2,p<.7?'#f4cb7d':'#9e9966');}
 if(built){person(320+Math.floor(Math.sin(t*.35)*13),192,t);rect(312+Math.floor(Math.sin(t*.35)*13),201,14,4,'#b49560');}
 for(const id of ['henhouse','barricade'])if(facilities[id]>0)facility(id,facilities[id],t);
 if(construction && PIXEL_FACILITIES[construction.id]){
  const [x,y]=PIXEL_FACILITIES[construction.id],w=construction.id==='workshop'?96:46,h=construction.id==='workshop'?75:48;
  rect(x-w/2,y-h,2,h,'#c5a271');rect(x+w/2,y-h,2,h,'#c5a271');
  for(let j=0;j<3;j++)rect(x-w/2,y-h+j*17,w,2,'#c5a271');
  rect(x-w/2,y+5,w,3,'#293e32');rect(x-w/2,y+5,Math.round(w*Math.max(0,Math.min(1,construction.progress))),3,'#dbbc7d');
 }
 if(threat>0){for(let i=0;i<3;i++){const x=260+i*9+Math.round((1-threat)*12);rect(x,143,4,8,'#25342f');rect(x+1,140,3,3,'#29372e');rect(x+6,139,1,11,'#576551');}rect(252,137,3,3,'#c4a36d');}
 // Foreground frames the clearing without obscuring its activities.
 pine(-8,249,142,'#213e36');pine(478,251,132,'#213e36');
 for(let i=0;i<65;i++){let x=noise(i+1500)*480,y=222+noise(i+2000)*18;rect(x,y,1,4,'#8e9a60');rect(x+2,y+2,1,3,'#6f8552');if(i%9===0)rect(x-1,y,3,2,'#d1bf80');}
 for(const [x,y] of [[30,224],[60,227],[115,232],[272,231],[370,226],[419,230]]){shrub(x,y,x+10);fern(x+17,y+7,1);}
 rock(349,228,1.3);rock(101,225,.7);
 for(const [x,y] of [[43,214],[136,222],[294,223],[410,207]]){rect(x,y,2,5,'#d6c8a0');rect(x-2,y-1,6,2,'#ba8160');rect(x-1,y-2,4,1,'#daa780');}
 if(night){
  c.globalAlpha=.22;rect(0,110,480,130,'#122b39');c.globalAlpha=1;
  for(const [x,y,w] of [[224,213,35],[134,177,20],...(built?[[302,171,31],[382,177,33]]:[])]){
   c.globalAlpha=.10;poly([[x+4,y-3],[x+w-4,y-3],[x+w+6,y+7],[x-7,y+7]],'#f9c271');c.globalAlpha=.06;rect(x-3,y+7,w+5,3,'#f9c271');
  }
  c.globalAlpha=1;rect(239,202-f,4,7,'#ffe0a0');lantern(141,161,t);
  if(built){rect(309,132,6,7,'#f3d488');rect(317,132,7,7,'#f3d488');rect(309,141,6,8,'#dba75c');rect(317,141,7,8,'#eec579');lantern(334,140,t);}
 }
}

return (time, model = {}) => {
 facilities = model.facilities || {};
 built = Number(facilities.workshop || 0) > 0;
 night = Boolean(model.night);
 construction = model.construction || null;
 threat = Number(model.threat || 0);
 chopping = Boolean(model.chopping);
 draw(time);
};
}
