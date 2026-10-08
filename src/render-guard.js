// Keep a pressed control attached until the browser has dispatched its click.
// In particular, blur/change fires between pointerdown and click on number inputs.
export function createRenderGuard({ document, window, onReady, schedule = setTimeout, cancel = clearTimeout }) {
  const pointers = new Set();
  const keys = new Set();
  let pending = false;
  let rendering = false;
  let releaseTimer = null;
  function flushLater() {
    if (releaseTimer !== null) cancel(releaseTimer);
    releaseTimer = schedule(() => {
      releaseTimer = null;
      if (pointers.size || keys.size || rendering || !pending) return;
      pending = false;
      onReady();
    }, 0);
  }
  document.addEventListener("pointerdown", (event) => pointers.add(event.pointerId), true);
  window.addEventListener("pointerup", (event) => {
    pointers.delete(event.pointerId);
    flushLater();
  }, true);
  window.addEventListener("pointercancel", (event) => {
    pointers.delete(event.pointerId);
    flushLater();
  }, true);
  document.addEventListener("keydown", (event) => {
    if ((event.key === "Enter" || event.key === " ") && event.target.closest("button, a")) keys.add(event.key);
  }, true);
  window.addEventListener("keyup", (event) => {
    if (!keys.delete(event.key)) return;
    flushLater();
  }, true);
  function reset() {
    pointers.clear();
    keys.clear();
    flushLater();
  }
  window.addEventListener("blur", reset);
  document.addEventListener("visibilitychange", () => { if (document.hidden) reset(); });
  const guard = {
    defer() {
      if (!rendering && !pointers.size && !keys.size && releaseTimer === null) return false;
      pending = true;
      return true;
    },
    run(draw) {
      if (guard.defer()) return;
      rendering = true;
      try { draw(); }
      finally {
        rendering = false;
        // Removing a focused input may synchronously fire change/blur and render.
        if (pending && !pointers.size && !keys.size && releaseTimer === null) flushLater();
      }
    },
  };
  return guard;
}
