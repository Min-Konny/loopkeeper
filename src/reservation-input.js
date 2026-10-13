export function isReservationInput(input) {
  return input?.type === 'number' && (input.id === 'queue-count' || input.dataset.craftCount !== undefined || input.dataset.queueCount !== undefined || input.dataset.conditionField === 'target');
}

export function reservationInputError(input) {
  if (!isReservationInput(input)) return '';
  const min = Number(input.min), max = Number(input.max);
  const name = input.dataset.conditionField === 'target' ? '目標' : '回数';
  if (!input.value.trim()) return `${name}を入力してください（${min}〜${max}の整数）。`;
  return Number.isInteger(input.valueAsNumber) && input.valueAsNumber >= min && input.valueAsNumber <= max
    ? '' : `${name}は${min}〜${max}の整数で入力してください。`;
}

// Report errors beside the editor without replacing it or discarding its value.
export function validateReservationInput(input) {
  if (!isReservationInput(input)) return true;
  const message = reservationInputError(input);
  input.setCustomValidity(message);
  const label = input.closest('label');
  let error = label?.querySelector('.reservation-input-error');
  if (message) {
    input.setAttribute('aria-invalid', 'true');
    if (!error && label) {
      error = input.ownerDocument.createElement('small');
      error.className = 'reservation-input-error';
      error.id = `${input.dataset.focus}-error`;
      label.append(error);
      const describedBy = input.getAttribute('aria-describedby') || '';
      input.setAttribute('aria-describedby', [describedBy, error.id].filter(Boolean).join(' '));
    }
    if (error && error.textContent !== message) error.textContent = message;
  } else {
    input.removeAttribute('aria-invalid');
    if (error) {
      const ids = (input.getAttribute('aria-describedby') || '').split(/\s+/).filter(id => id && id !== error.id);
      if (ids.length) input.setAttribute('aria-describedby', ids.join(' '));
      else input.removeAttribute('aria-describedby');
      error.remove();
    }
  }
  return !message;
}

// Enter confirms the editor only. Adding, purchasing and executing still require
// activation of their own buttons; a held key or IME confirmation never repeats it.
export function installReservationKeyboard({ document, onInvalid }) {
  document.addEventListener('keydown', event => {
    if (event.key !== 'Enter' || !isReservationInput(event.target) || event.isComposing) return;
    event.preventDefault();
    if (event.repeat) return;
    if (!validateReservationInput(event.target)) { onInvalid(reservationInputError(event.target)); return; }
    event.target.dispatchEvent(new Event('change', { bubbles: true }));
  });
}

// Queue rows can change position. Follow the goal, and use its inert handle when
// the previous arrow becomes disabled at the top/bottom boundary.
export function restoreControlFocus(container, focusKey) {
  if (!focusKey) return;
  const target = [...container.querySelectorAll('[data-focus]')].find(node => node.dataset.focus === focusKey);
  const fallback = target?.disabled ? target.closest('[data-queue-row], [data-priority-row]')?.querySelector('[data-queue-drag], [data-priority-focus]') : null;
  (fallback || (target?.disabled ? null : target))?.focus({ preventScroll: true });
}
