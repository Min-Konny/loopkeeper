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
  const details = [...dialog.querySelectorAll('details[data-detail-key]')].map(node => [node.dataset.detailKey, node.open]);
  dialog.innerHTML = markup;
  for (const node of dialog.querySelectorAll('details[data-detail-key]')) {
    const saved = details.find(([key]) => key === node.dataset.detailKey);
    if (saved) node.open = saved[1];
  }
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
