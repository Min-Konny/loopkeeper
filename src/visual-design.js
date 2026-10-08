// Presentation-only values. They never change combat, production, or saved data.
const materials = {
  wood: {metal:'#b69868',cloth:'#788d72',glow:'#ceb17a'},
  iron: {metal:'#b9c5ca',cloth:'#677e86',glow:'#d0e2ec'},
  steel: {metal:'#dae5e9',cloth:'#526b87',glow:'#d3edff'},
  silver: {metal:'#e6e3f7',cloth:'#887ca4',glow:'#ece1ff'},
  mithril: {metal:'#86d7cf',cloth:'#477f85',glow:'#8ff5e8'},
  crystal: {metal:'#a9c3ff',cloth:'#6965a7',glow:'#c7baff'},
  orichalcum: {metal:'#f3d283',cloth:'#956345',glow:'#ffe8a5'},
};
export function equipmentMaterial(item) {
  const id = (item?.id || '').replace('diamond','crystal');
  const tier = ['orichalcum','crystal','mithril','silver','steel','iron'].find(x => id.includes(x)) || 'wood';
  return {tier,...materials[tier]};
}
export function compareRun(state) {
  const previous = (state.meta.history || []).find(record => record.generation < state.meta.generation);
  if (!previous) return null;
  return {wave:state.run.wave-previous.wave, seconds:state.run.elapsed-previous.elapsed, generation:previous.generation};
}
export function completedQueueEntries(previous, next, advanced) {
  if (!advanced) return [];
  const ids = new Set(next.map(entry => entry.goalId));
  return previous.filter(entry => entry.goalId !== undefined && !ids.has(entry.goalId));
}
