// The death summary shares this dialog with setup. A cached setup string alone
// cannot prove that the dialog still contains the setup controls.
export function updateSetupDialog(dialog, markup) {
  const list = dialog.querySelector(".setup-upgrades");
  if (dialog.dataset.setup === markup && list) return false;
  const scroll = list?.scrollTop || 0;
  dialog.innerHTML = markup;
  dialog.dataset.setup = markup;
  dialog.querySelector(".setup-upgrades").scrollTop = scroll;
  return true;
}
