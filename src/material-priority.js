import { CONTENT } from './content.js?v=0.6.15';
const resources = new Set(CONTENT.resources.map(resource => resource.id));
export function validMaterialPriority(priority) {
  return Array.isArray(priority) && priority.length <= resources.size && new Set(priority).size === priority.length && priority.every(id => resources.has(id));
}
export function orderedMaterialCosts(cost, priority = [], rankFor = null) {
  const entries = Object.entries(cost);
  if (!priority.length) return entries;
  const ranks = new Map(priority.map((id, index) => [id, index]));
  return entries.map((entry,index)=>({entry,index,rank:rankFor?rankFor(...entry):(ranks.get(entry[0])??priority.length)})).sort((a,b)=>a.rank-b.rank||a.index-b.index).map(item=>item.entry);
}

export function dependencyOrderedCosts(cost, priority, { inventory, count=1, sourceFor, costFor, isPaid=()=>false, visiting=new Set() }) {
  if (!priority.length) return Object.entries(cost);
  const ranks=new Map(priority.map((id,index)=>[id,index]));
  function rank(id, amount, seen) {
    let value=ranks.get(id)??priority.length;
    if(value===0 || amount<=(inventory[id]||0) || seen.has(`resource:${id}`))return value;
    const next=new Set([...seen,`resource:${id}`]), source=sourceFor(id,amount-(inventory[id]||0),next);
    if(!source)return value;
    next.add(source.id);
    const runs=Math.max(0,Math.ceil((amount-(inventory[id]||0))/source.yields[id])-(isPaid(source)?1:0));
    for(const [child,n] of Object.entries(costFor(source))) if(n*runs>(inventory[child]||0))value=Math.min(value,rank(child,n*runs,next));
    return value;
  }
  return orderedMaterialCosts(cost,priority,(id,amount)=>rank(id,amount*count,visiting));
}
