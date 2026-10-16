// Drafts never rewind time or queue progress. Identity guards prevent stale edits.
export const isQueuedNumberInput=input=>Boolean(input?.dataset&&(input.dataset.queueTrainingLevel!==undefined||input.dataset.queueCount!==undefined));
export function captureQueuedNumberEdit(state,input){
 if(!isQueuedNumberInput(input))return null;
 const level=input.dataset.queueTrainingLevel!==undefined;
 const entry=level?state.run.queue.find(q=>q.goalId===Number(input.dataset.trainingGoal)):state.run.queue[Number(input.dataset.queueCount)];
 return entry?{state,run:state.run,entry,level,displayedValue:String(level?entry.until?.target:entry.count)}:null;
}
export function queuedNumberEditIndex(state,draft){return draft&&state===draft.state&&state.run===draft.run?state.run.queue.indexOf(draft.entry):-1;}
export function queuedNumberEditValue(state,draft){const i=queuedNumberEditIndex(state,draft);if(i<0)return undefined;const q=state.run.queue[i];return draft.level?q.until?.target:q.count;}
export function restoreQueuedNumberEdit(state,input,draft){const value=queuedNumberEditValue(state,draft);if(value===undefined||input.value===draft.displayedValue||input.value===String(value))return false;input.value=String(value);draft.displayedValue=input.value;input.setCustomValidity?.('');return true;}
