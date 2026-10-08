// Pointer gestures support both a mouse and a touch screen; arrow buttons remain available.
export function installQueueDrag({ document, window, onStart, onDrop, onEnd }) {
  let drag = null;
  function clearMarks() {
    if (!drag) return;
    for (const row of drag.list.querySelectorAll('[data-queue-row]')) {
      row.classList.remove('queue-dragging', 'queue-drop-before', 'queue-drop-after');
    }
  }
  function finish(commit) {
    if (!drag) return;
    const current = drag;
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
    onStart();
  });
  document.addEventListener('pointermove', event => {
    if (!drag || event.pointerId !== drag.pointerId) return;
    if (!drag.moved && Math.hypot(event.clientX - drag.x, event.clientY - drag.y) < 6) return;
    drag.moved = true;
    event.preventDefault();
    clearMarks();
    drag.row.classList.add('queue-dragging');
    const bounds = drag.list.getBoundingClientRect();
    drag.to = drag.from;
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top - 24 || event.clientY > bounds.bottom + 24) return;
    // Scrolling is limited to the dragged list, never the page or its other panels.
    if (event.clientY < bounds.top + 30) drag.list.scrollTop -= 18;
    if (event.clientY > bounds.bottom - 30) drag.list.scrollTop += 18;
    const rows = [...drag.list.querySelectorAll('[data-queue-row]')];
    const before = rows.findIndex(row => {
      const rect = row.getBoundingClientRect();
      return event.clientY < rect.top + rect.height / 2;
    });
    const insertion = before < 0 ? rows.length : before;
    drag.to = insertion > drag.from ? insertion - 1 : insertion;
    if (drag.to === drag.from) return;
    if (before < 0) rows.at(-1).classList.add('queue-drop-after');
    else rows[before].classList.add('queue-drop-before');
  }, { passive: false });
  document.addEventListener('pointerup', event => { if (event.pointerId === drag?.pointerId) finish(true); });
  document.addEventListener('pointercancel', event => { if (event.pointerId === drag?.pointerId) finish(false); });
  document.addEventListener('lostpointercapture', event => { if (event.pointerId === drag?.pointerId) finish(false); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') finish(false); });
  document.addEventListener('close', () => finish(false), true);
  document.addEventListener('visibilitychange', () => { if (document.hidden) finish(false); });
  window.addEventListener('blur', () => finish(false));
}
