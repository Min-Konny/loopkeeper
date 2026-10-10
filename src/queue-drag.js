// Pointer gestures support both a mouse and a touch screen; arrow buttons remain available.
export function installQueueDrag({ document, window, onStart, onDrop, onEnd }) {
  let drag = null;
  let scrollFrame = null;
  function scroll(time) {
    scrollFrame = null;
    if (!drag) return;
    const dt = Math.min(32, Math.max(0, time - (drag.scrollTime ?? time)));
    drag.scrollTime = time;
    const bounds = drag.list.getBoundingClientRect();
    if (drag.moved && drag.lastX >= bounds.left - 40 && drag.lastX <= bounds.right + 40) {
      const edge = 32;
      const speed = drag.lastY < bounds.top + edge ? -Math.min(1, (bounds.top + edge - drag.lastY) / edge)
        : drag.lastY > bounds.bottom - edge ? Math.min(1, (drag.lastY - bounds.bottom + edge) / edge) : 0;
      drag.list.scrollTop += speed * 150 * dt / 1000;
      updateTarget(drag.lastX, drag.lastY);
    }
    scrollFrame = window.requestAnimationFrame(scroll);
  }
  function updateTarget(x, y) {
    clearMarks();
    drag.row.classList.add('queue-dragging');
    const bounds = drag.list.getBoundingClientRect();
    if (x < bounds.left - 40 || x > bounds.right + 40 || y < bounds.top - 48 || y > bounds.bottom + 48) {
      drag.to = drag.from;
      return;
    }
    const rows = [...drag.list.querySelectorAll('[data-queue-row]')];
    const remaining = rows.filter(row => row !== drag.row);
    let target = drag.to;
    // A dead band prevents the insertion mark flickering at a row midpoint.
    while (target < remaining.length) {
      const r = remaining[target].getBoundingClientRect();
      if (y <= r.top + r.height / 2 + 10) break;
      target++;
    }
    while (target > 0) {
      const r = remaining[target - 1].getBoundingClientRect();
      if (y >= r.top + r.height / 2 - 10) break;
      target--;
    }
    drag.to = target;
    if (target === drag.from) return;
    if (target === remaining.length) remaining.at(-1).classList.add('queue-drop-after');
    else remaining[target].classList.add('queue-drop-before');
  }
  function clearMarks() {
    if (!drag) return;
    for (const row of drag.list.querySelectorAll('[data-queue-row]')) {
      row.classList.remove('queue-dragging', 'queue-drop-before', 'queue-drop-after');
    }
  }
  function finish(commit) {
    if (!drag) return;
    const current = drag;
    if (scrollFrame !== null) window.cancelAnimationFrame(scrollFrame);
    scrollFrame = null;
    clearMarks();
    drag = null;
    if (current.handle.hasPointerCapture(current.pointerId)) current.handle.releasePointerCapture(current.pointerId);
    try {
      if (commit && current.moved && current.to !== current.from) onDrop(current.from, current.to);
    } finally { onEnd(); }
  }
  document.addEventListener('pointerdown', event => {
    const handle = event.target.closest('[data-queue-drag]');
    if (!handle || event.button !== 0 || event.isPrimary === false || drag) return;
    const row = handle.closest('[data-queue-row]'), list = row?.parentElement;
    if (!list || list.querySelectorAll('[data-queue-row]').length < 2) return;
    event.preventDefault();
    drag = { handle, list, row, pointerId: event.pointerId, from: Number(handle.dataset.queueDrag), to: Number(handle.dataset.queueDrag), x: event.clientX, y: event.clientY, moved: false };
    handle.setPointerCapture(event.pointerId);
    handle.focus({ preventScroll: true });
    drag.lastX = event.clientX;
    drag.lastY = event.clientY;
    onStart();
    scrollFrame = window.requestAnimationFrame(scroll);
  });
  document.addEventListener('pointermove', event => {
    if (!drag || event.pointerId !== drag.pointerId) return;
    if (!drag.moved && Math.hypot(event.clientX - drag.x, event.clientY - drag.y) < 6) return;
    drag.moved = true;
    event.preventDefault();
    drag.lastX = event.clientX;
    drag.lastY = event.clientY;
    updateTarget(event.clientX, event.clientY);
  }, { passive: false });
  document.addEventListener('pointerup', event => { if (event.pointerId === drag?.pointerId) finish(true); });
  document.addEventListener('pointercancel', event => { if (event.pointerId === drag?.pointerId) finish(false); });
  document.addEventListener('lostpointercapture', event => { if (event.pointerId === drag?.pointerId) finish(false); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') finish(false); });
  document.addEventListener('close', () => finish(false), true);
  document.addEventListener('visibilitychange', () => { if (document.hidden) finish(false); });
  window.addEventListener('blur', () => finish(false));
}
