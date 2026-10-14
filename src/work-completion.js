// Frame-scoped, presentation-only notifications. Never persisted or queued.
const observers = new WeakMap();
export function observesWork(state) {
  return observers.get(state)?.run === state.run;
}
export function withWorkCompletions(state, notify, advance) {
  const previous = observers.get(state);
  observers.set(state, {run:state.run, notify});
  try { return advance(); }
  finally { if (previous) observers.set(state, previous); else observers.delete(state); }
}
export function completedWork(state, event) {
  const observer = observers.get(state);
  if (observer?.run !== state.run) return;
  try { observer.notify(Object.freeze({...event, resourceGains:Object.freeze({...event.resourceGains})})); }
  catch { /* Optional audio/visual observers must never interrupt production. */ }
}
