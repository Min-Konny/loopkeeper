import {alphaBounds}from './generated-camp-art.js?v=0.6.99';
import {workKind,workPose}from './work-motion.js?v=0.6.99';
const root=new URL('../assets/pixel-v2/',import.meta.url),mounted=new WeakMap();let pending;
const sheets=Object.freeze({foraging:'forager-v1-sheet.png',fishing:'fisher-v2-sheet.png',cooking:'cook-v1-sheet.png',training:'training-v2-sheet.png'}),extras=new Map();let background,propsPending,miningArt;
function workProps(){return propsPending??=image('work-environment-v2.png').then(img=>{const cw=img.width/3;return{img,cw,bounds:[0,1,2].map(n=>alphaBounds(img,n*cw,0,cw,img.height))};});}
function naturalProp(c,art,index,x,y,w,h){const p=art.extraProps,b=p.bounds[index];const scale=Math.min(w/b.width,h/b.height),width=b.width*scale,height=b.height*scale;c.drawImage(p.img,index*p.cw+b.x,b.y,b.width,b.height,x+(w-width)/2,y+h-height,width,height);}

function image(name){return new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>reject(Error('Work artwork unavailable: '+name));img.src=new URL(name,root).href;});}
function atlas(img,rows,padded=false){const cw=Math.floor(img.width/4),ch=Math.floor(img.height/rows),c=document.createElement('canvas');c.width=96*4*rows;c.height=104;const ctx=c.getContext('2d');ctx.imageSmoothingEnabled=false;const bounds=Array.from({length:4*rows},(_,n)=>alphaBounds(img,n%4*cw,Math.floor(n/4)*ch,cw,ch));const scale=padded?Math.min(88/cw,94/Math.max(...bounds.map(b=>b.height))):96/cw;for(let n=0;n<4*rows;n++){const x=n%4*cw,y=Math.floor(n/4)*ch,b=bounds[n];ctx.drawImage(img,x,y,cw,ch,n*96+(96-cw*scale)/2,100-b.bottom*scale,cw*scale,ch*scale);}return c;}
function loadArt(kind){if(kind==='mining')return miningArt??=Promise.all([loadArt('logging'),image('mining-quarry-v1.png')]).then(([art,background])=>({...art,background}));if(Object.hasOwn(sheets,kind)){if(!extras.has(kind))extras.set(kind,Promise.all([kind==='fishing'?image('fishing-bank-v2.png'):(background??=image('forest-clearing-v1.png')),image(sheets[kind]),['foraging','cooking'].includes(kind)?workProps():null]).then(([background,img,extraProps])=>({background,extraProps,[kind]:atlas(img,kind==='training'?3:2,true)})));return extras.get(kind);}return pending??=Promise.all(['forest-clearing-v1.png','lumberjack-v2-sheet.png','miner-v1-sheet.png','smith-v1-sheet.png','work-props-v1.png','logging-tree-v1.png'].map(image)).then(([background,wood,miner,smith,props,tree])=>{const cw=Math.floor(props.width/2),propBounds=[alphaBounds(props,0,0,cw,props.height),alphaBounds(props,cw,0,cw,props.height)];return{background,tree,treeBounds:alphaBounds(tree),logging:atlas(wood,3),mining:atlas(miner,2),smithing:atlas(smith,2),props,propBounds,propCell:cw};});}
export function enhanceWorkScene(html,skill,id){const kind=workKind(skill,id);if(!kind)return html;return html.replace('<div class="work-vignette',`<div data-work-artwork="loading" data-generated-work="${kind}" data-work-action="${id}" class="work-vignette`).replace('<svg ', '<canvas data-work-canvas width="340" height="180" hidden></canvas><svg data-work-fallback="" ');}
function drawExtra(c,kind,pose,id,art){
 if(kind==='foraging'){naturalProp(c,art,/food/.test(id)?1:0,92,51,69,34);
 }else if(kind==='fishing'){
  // The authored bank replaces the old rectangular river and dock.
c.fillStyle='#d7b878';c.fillRect(123,63,2,4);if(pose.impact){c.fillStyle='#c1d4c4';for(let n=0;n<4;n++)c.fillRect(115+n*4,61-n%2*3,2,1);}
 }else if(kind==='cooking'){naturalProp(c,art,2,96,28,68,57);if(pose.stage==='stir'||pose.stage==='inspect'){c.fillStyle='#b4c4ac88';for(let n=0;n<3;n++)c.fillRect(117+n*7,30-n%2*7-Math.floor(pose.phase*4),2,5);}
 }
}
function draw(canvas,art,kind,pose,id){const c=canvas.getContext('2d');c.imageSmoothingEnabled=false;c.setTransform(2,0,0,2,0,0);c.clearRect(0,0,170,90);c.filter=kind==='fishing'?'saturate(.8) brightness(.9)':'saturate(.62) brightness(.65)';c.drawImage(art.background,0,0,art.background.width*(['fishing','mining'].includes(kind)?1:.65),art.background.height,0,0,170,90);c.filter='none';c.fillStyle=kind==='fishing'?'#24352e33':'#24352e99';c.fillRect(0,0,170,90);if(!['fishing','training'].includes(kind)){c.fillStyle='#17261d80';c.fillRect(8,77,155,10);}
 if(Object.hasOwn(sheets,kind))drawExtra(c,kind,pose,id,art);
 else if(kind==='logging'){const b=art.treeBounds;c.drawImage(art.tree,b.x,b.y,b.width,b.height,102,-6,53,92); }else{const index=kind==='mining'?0:1,b=art.propBounds[index];c.drawImage(art.props,index*art.propCell+b.x,b.y,b.width,b.height,94,kind==='mining'?30:23,70,kind==='mining'?53:60);if(kind==='mining'&&id!=='quarry_stone'){c.fillStyle=({mine_coal:'#535957',mine_silver:'#d6e2da',mine_mithril:'#8dcbbf',mine_diamond:'#c0dfec',mine_orichalcum:'#edca77'})[id]||'#c28e68';for(let n=0;n<4;n++)c.fillRect(111+n*9,48+n%2*8,4,2);}}
 if(kind==='smithing'){c.fillStyle=pose.stage==='finish'?'#dbe5d8':'#f3ae62';c.fillRect(112,54,pose.stage==='finish'?23:13,3);c.fillStyle='#f9d18b';c.fillRect(144,48,8,4);}
 c.fillStyle='#10231c99';c.beginPath();c.ellipse(pose.x-3,83,13,3,0,0,Math.PI*2);c.fill();c.drawImage(art[kind],pose.frame*96,0,96,104,pose.x-28,21,58,63);
 if(pose.impact){const t=pose.phase;for(let n=0;n<5;n++){c.fillStyle=kind==='smithing'?'#ffd78a':kind==='logging'?'#d6b67b':'#bdc5ad';c.fillRect(103+n*4,51-((n*7+t*26)%17),n%2+1,2);}}
}
export function syncGeneratedWork(scene,action,{animate=true}={}){
 const kind=scene?.dataset?.generatedWork;if(!kind)return false;
 let view=mounted.get(scene);if(!view){view={art:null,failed:false,last:'',action:null,animate};mounted.set(scene,view);loadArt(kind).then(art=>{view.art=art;if(scene.isConnected)syncGeneratedWork(scene,view.action,{animate:view.animate});}).catch(()=>{view.failed=true;scene.dataset.workArtwork='fallback';});}
 // Copy presentation fields. Never retain, mutate or manufacture a simulation batch.
 view.action=action?{id:action.id,progress:action.progress,duration:action.duration}:null;view.animate=animate;
 if(!view.art||view.failed||document.hidden)return true;
 const moving=animate&&!matchMedia('(prefers-reduced-motion: reduce)').matches;
 const pose=workPose(kind,view.action||{id:scene.dataset.workAction},{animate:moving});const key=[view.action?.id,kind,moving,Math.floor(pose.phase*36)].join(':');if(view.last===key)return true;const rect=scene.getBoundingClientRect();if(rect.bottom<0||rect.top>innerHeight)return true;
 try{draw(scene.querySelector('[data-work-canvas]'),view.art,kind,pose,view.action?.id||scene.dataset.workAction);scene.querySelector('[data-work-canvas]').hidden=false;scene.querySelector('[data-work-fallback]').style.display='none';scene.dataset.workArtwork='generated';scene.dataset.workStage=pose.stage;scene.dataset.workFrame=String(pose.frame);view.last=key;}catch{view.failed=true;scene.dataset.workArtwork='fallback';scene.querySelector('[data-work-canvas]').hidden=true;scene.querySelector('[data-work-fallback]').style.display='';}
 return true;
}
