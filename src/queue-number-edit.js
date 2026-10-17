// Drafts never rewind time or queue progress. Identity guards prevent stale edits.
export const isQueuedNumberInput=input=>Boolean(input?.dataset&&(input.dataset.queueTrainingLevel!==undefined||input.dataset.queueCount!==undefined));
export function captureQueuedNumberEdit(state,input){
 if(!isQueuedNumberInput(input))return null;
 const level=input.dataset.queueTrainingLevel!==undefined;
 const entry=level?state.run.queue.find(q=>q.goalId===Number(input.dataset.trainingGoal)):state.run.queue[Number(input.dataset.queueCount)];
 return entry?{state,run:state.run,entry,level,displayedValue:String(level?entry.until?.target:entry.count),workSeq:state.run.workSeq,queueSnapshot:state.run.queue.map(q=>({entry:q,count:q.count,target:q.until?.target}))}:null;
}
export function queuedNumberEditIndex(state,draft){return draft&&state===draft.state&&state.run===draft.run?state.run.queue.indexOf(draft.entry):-1;}
export function queuedNumberEditValue(state,draft){const i=queuedNumberEditIndex(state,draft);if(i<0)return undefined;const q=state.run.queue[i];return draft.level?q.until?.target:q.count;}
export function restoreQueuedNumberEdit(state,input,draft){const value=queuedNumberEditValue(state,draft);if(value===undefined||input.value===draft.displayedValue||input.value===String(value))return false;input.value=String(value);draft.displayedValue=input.value;input.setCustomValidity?.('');return true;}

// Focus alone must not freeze completed reservations. Keep a real draft attached,
// but refresh untouched controls when a reservation completes, moves or starts.
export function preserveQueuedNumberEdit(state,input,draft){
 if(queuedNumberEditIndex(state,draft)<0)return false;
 if(input.value!==draft.displayedValue)return true;
 return draft.workSeq===state.run.workSeq&&draft.queueSnapshot.length===state.run.queue.length&&draft.queueSnapshot.every((p,i)=>{const q=state.run.queue[i];return p.entry===q&&p.count===q.count&&p.target===q.until?.target;});
}
