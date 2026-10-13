// Assigning textContent rebuilds text nodes, even when the string is unchanged.
// Compare against the actual node so replaced UI elements are initialized too.
export function setTextIfChanged(element, value) {
  if (!element) return false;
  const text = String(value);
  if (element.textContent === text) return false;
  element.textContent = text;
  return true;
}
