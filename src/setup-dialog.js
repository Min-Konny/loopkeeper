// The death summary shares this dialog with setup. A cached setup string alone
// cannot prove that the dialog still contains the setup controls.
export function updateSetupDialog(dialog, markup) {
  const list = dialog.querySelector(".setup-upgrades");
  if (dialog.dataset.setup === markup && list) return false;
  const scroll = list?.scrollTop || 0;
  const outerScroll = dialog.scrollTop || 0;
  const active = dialog.ownerDocument?.activeElement;
  const focused = active && dialog.contains?.(active) ? active : null;
  const focusKey = focused?.dataset?.focus;
  const focusId = focused?.id;
  dialog.innerHTML = markup;
  dialog.dataset.setup = markup;
  dialog.querySelector(".setup-upgrades").scrollTop = scroll;
  dialog.scrollTop = outerScroll;
  if (focusKey || focusId) {
    const replacement = [...dialog.querySelectorAll('[data-focus], [id]')].find(node =>
      focusKey ? node.dataset?.focus === focusKey : node.id === focusId);
    if (replacement && !replacement.disabled) replacement.focus({ preventScroll: true });
  }
  return true;
}
