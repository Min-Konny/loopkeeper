// Decorative/UI failures must never cancel the next game frame.
export function runFrameTasks(tasks, onError, scheduleNext) {
  try {
    for (const [stage, task] of tasks) {
      try { task(); } catch (error) { onError(stage, error); }
    }
  } finally {
    scheduleNext();
  }
}
