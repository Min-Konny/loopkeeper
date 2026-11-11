// Dependency-free ephemeral metadata shared by simulation and presentation.
// Do not import UI or engine modules here: simulation must initialize independently.
const copies = new WeakMap();
export function registerLogCopy(entry, copy) { if (copy) copies.set(entry, copy); }
export function getLogCopy(entry) { return copies.get(entry); }
