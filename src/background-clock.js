// Background timer throttling must not lose elapsed time or double-count RAF ticks.
export function createBackgroundClock() {
  let debt = 0, wasHidden = false;
  return {
    take(seconds, {hidden, blocked, pauseWhenHidden}) {
      const elapsed = Number.isFinite(seconds) ? Math.max(0, seconds) : 0;
      if (blocked || (hidden && pauseWhenHidden)) debt = 0;
      else debt += hidden || wasHidden ? elapsed : Math.min(.25, elapsed);
      wasHidden = hidden;
      const chunk = Math.min(10, debt);
      debt -= chunk;
      return chunk;
    },
  };
}
