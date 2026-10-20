// Decorative edges use the actual control positions; they never capture input or change game data.
const documents=new WeakMap();
const n=x=>Math.round(x*10)/10;
const point=(x,y)=>[n(x),n(y)];
const path=points=>points.map(([x,y],i)=>(i?'L':'M')+x+' '+y).join(' ');
const edge=(kind,from,to,points,extra='')=>'<path class="map-connection" data-map-connection="'+kind+'" data-map-from="'+from+'" data-map-to="'+to+'" d="'+path(points)+'" '+extra+'/>';
function draw(root){
 if(!root.isConnected)return;const bounds=root.getBoundingClientRect();if(!bounds.width||!bounds.height)return;
 const rect=node=>{const r=node.getBoundingClientRect();return {left:r.left-bounds.left,top:r.top-bounds.top,right:r.right-bounds.left,bottom:r.bottom-bounds.top,width:r.width,height:r.height};};
 const overview=root.querySelector('[data-map-overview-connections]'),center=rect(root.querySelector('.inheritance-map-root')),junction=center.bottom+10;let html='';
 for(const domain of root.querySelectorAll('[data-map-domain]')){
  const d=rect(domain),heading=rect(domain.querySelector('h3')),key='domain:'+domain.dataset.mapDomain,x=d.left+3,y=heading.top+heading.height/2;
  html+=edge('domain','inheritance',key,[point((center.left+center.right)/2,center.bottom),point((center.left+center.right)/2,junction),point(x,junction),point(x,y)]);
  html+='<circle class="map-domain-port" cx="'+n(x)+'" cy="'+n(y)+'" r="3"/>';
  for(const branch of domain.querySelectorAll('[data-map-branch]')){const b=rect(branch),title=rect(branch.querySelector('.map-branch-title'));html+=edge('branch',key,'branch:'+branch.dataset.mapBranch,[point(x,y),point(x,title.top+title.height/2),point(b.left,title.top+title.height/2)]);}
 }
 update(overview,bounds.width,bounds.height,html);
 for(const branch of root.querySelectorAll('.map-branch-open')){
  const svg=branch.querySelector('[data-map-stage-connections]');if(!svg)continue;const b=branch.getBoundingClientRect(),title=branch.querySelector('.map-branch-title').getBoundingClientRect(),stages=[...branch.querySelectorAll('[data-map-stage-id]')],byId=new Map(stages.map(node=>[node.dataset.mapStageId,node]));
  let local='';const first=stages[0];if(first){const r=first.getBoundingClientRect();local+=edge('stage-entry','branch:'+branch.dataset.mapBranch,first.dataset.mapStageId,[point(0,title.top+title.height/2-b.top),point(4,title.top+title.height/2-b.top),point(4,r.top+r.height/2-b.top),point(r.left-b.left,r.top+r.height/2-b.top)]);}
  for(const node of stages){const from=byId.get(node.dataset.mapRequires);if(!from)continue;const a=from.getBoundingClientRect(),z=node.getBoundingClientRect(),x=z.left-b.left,y=z.top+z.height/2-b.top,owned=node.dataset.mapOwned==='true';
   local+=edge('stage',from.dataset.mapStageId,node.dataset.mapStageId,[point(a.right-b.left,a.top+a.height/2-b.top),point(x,y)]).replace('class="map-connection"','class="map-connection'+(owned?' map-connection-owned':'')+'"');
   local+='<path class="map-connection'+(owned?' map-connection-owned':'')+'" data-map-arrow aria-hidden="true" d="'+path([point(x-3,y-3),point(x,y),point(x-3,y+3)])+'"/>';
  }
  update(svg,b.width,b.height,local);
 }
}
function update(svg,width,height,html){if(!svg)return;const box='0 0 '+n(width)+' '+n(height);if(svg.getAttribute('viewBox')!==box)svg.setAttribute('viewBox',box);if(svg.dataset.lines!==html){svg.innerHTML=html;svg.dataset.lines=html;}}
export function syncInheritanceConnections(document){
 const view=document.defaultView;let entries=documents.get(document);if(!entries){entries=new Map();documents.set(document,entries);}
 const roots=[...document.querySelectorAll('.inheritance-map[data-inheritance-scope]')],present=new Set(roots);
 for(const [scope,entry]of entries)if(!present.has(entry.root)){entry.observer?.disconnect();if(entry.frame)view.cancelAnimationFrame(entry.frame);entries.delete(scope);}
 for(const root of roots){const scope=root.dataset.inheritanceScope;let entry=entries.get(scope);if(!entry||entry.root!==root){entry?.observer?.disconnect();if(entry?.frame)view.cancelAnimationFrame(entry.frame);entry={root,frame:null,observer:null};if(view.ResizeObserver){entry.observer=new view.ResizeObserver(()=>{if(entry.frame)return;entry.frame=view.requestAnimationFrame(()=>{entry.frame=null;draw(root);});});entry.observer.observe(root);}entries.set(scope,entry);}draw(root);}
}
