const paths = {
  settings: '<path d="m9 3-1 3-3 1 1 3-2 2 2 2-1 3 3 1 1 3h6l1-3 3-1-1-3 2-2-2-2 1-3-3-1-1-3H9Z"/><circle cx="12" cy="12" r="3"/>',
  fish: '<path d="M3 12q7-10 15 0-8 10-15 0Zm15 0 5-5v10Z"/><circle cx="7" cy="11" r="1"/>',
  bow: '<path d="M6 3q18 9 0 18V3Zm0 9h16m-4-4 4 4-4 4"/>',
  spark:
    '<path d="m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3 3-7Z"/><path d="m20 2 1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2Z"/>',
  flag: '<path d="M4 22V3m0 1c5-4 10 4 16 0v11c-6 4-11-4-16 0"/>',
  gold: '<ellipse cx="12" cy="7" rx="9" ry="4"/><path d="M3 7v5c0 5 18 5 18 0V7M3 12v5c0 5 18 5 18 0v-5"/>',
  flame:
    '<path d="M13 2c2 6-4 6-2 11 2-1 3-3 3-5 5 5 6 9 2 12-4 3-10 1-11-3-1-4 2-6 3-9 2 1 2 3 2 4 2-4 0-6 3-10Z"/>',
  leaf: '<path d="M20 3C9 2 3 7 4 14c1 7 10 8 14 1 2-4 2-8 2-12Z"/><path d="m3 21 12-12M8 16v-5m0 5h5"/>',
  axe: '<path d="m5 21 12-17m-7 3 6-4 6 5-3 7-9-8Z"/>',
  pickaxe: '<path d="m5 21 12-14M3 5c8-5 16-1 18 7l-8-7L3 5Z"/>',
  sword:
    '<path d="m14 3 7-1-1 7-11 11-5-5L14 3Zm-6 9 4 4m-8-1-2 2m7 3-2 2m-2-4-3 3"/>',
  shield:
    '<path d="m12 2 9 4v6c0 5-5 8-9 10-4-2-9-5-9-10V6l9-4Z"/><path d="M12 6v11m-5-6h10"/>',
  hammer: '<path d="m4 21 11-12M9 4l5-2 8 8-5 4-8-8V4Z"/>',
  memory: '<path d="M4 11a8 8 0 1 1 2 7M4 4v7h7"/><path d="M12 7v5l3 2"/>',
  camp: '<path d="m2 20 10-17 10 17H2Zm6 0 4-8 4 8M9 3l6 5"/>',
  wood: '<path d="m3 15 10-11 7 6-10 11-7-6Z"/><ellipse cx="6.5" cy="18" rx="4.5" ry="3" transform="rotate(40 6.5 18)"/><path d="m7 13 8-8m-5 11 8-8"/>',
  stone:
    '<path d="m3 10 5-6 10 2 4 10-7 5-10-2-2-9Z"/><path d="m3 10 9 2 6-6m-6 6 3 9"/>',
  ore: '<path d="m3 16 3-9 6-5 7 5 3 10-10 5-9-6Z"/><path d="m6 7 6 15 7-15M3 16l9-4 10 5M12 2v10"/>',
  herbs:
    '<path d="M12 22V7m0 9C3 17 2 11 3 7c5 0 9 3 9 9Zm0-5c0-7 4-9 9-9 1 5-2 10-9 9Z"/>',
  food: '<path d="M5 9C0 3 7 1 12 4c5-3 12-1 7 5v12H5V9Z"/><path d="M9 10v5m6-5v5"/>',
  hide: '<path d="m8 2 4 2 4-2 4 5-3 4 3 9-8 2-8-2 3-9-3-4 4-5Z"/>',
  ingot:
    '<path d="m5 7 12-3 5 12-14 5-6-7 3-7Z"/><path d="m5 7 6 7 11 2m-11-2-3 7"/>',
  heart: '<path d="M12 21 3 12C-2 5 7-1 12 6c5-7 14-1 9 6l-9 9Z"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>',
  eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
  "eye-off":
    '<path d="m3 3 18 18M10.6 5.1A11.6 11.6 0 0 1 12 5c6 0 10 7 10 7a18 18 0 0 1-3.2 3.8M6.2 6.2A18 18 0 0 0 2 12s4 7 10 7a11 11 0 0 0 5.8-1.8M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9 9a3 3 0 1 1 5 2c-2 1-2 2-2 3m0 3v.1"/>',
  save: '<path d="M3 3h15l3 3v15H3V3Z"/><path d="M7 3v6h10V3M7 21v-8h10v8"/>',
  pause: '<path d="M8 5v14M16 5v14"/>',
  play: '<path d="m7 4 13 8-13 8V4Z"/>',
  chevron: '<path d="m9 5 7 7-7 7"/>',
  arrow: '<path d="M3 12h18m-7-7 7 7-7 7"/>',
  check: '<path d="m4 12 5 5L20 6"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  lock: '<rect x="5" y="10" width="14" height="12" rx="2"/><path d="M8 10V6a4 4 0 0 1 8 0v4m-4 5v3"/>',
  skull:
    '<path d="M7 17C0 13 3 2 12 2s12 11 5 15v5H7v-5Z"/><circle cx="8" cy="11" r="1.5"/><circle cx="16" cy="11" r="1.5"/><path d="m11 16 1-2 1 2m-3 3v3m4-3v3"/>',
  trophy:
    '<path d="M7 3h10v6c0 4-2 6-5 6s-5-2-5-6V3Zm5 12v6m-5 0h10M7 5H3v3c0 3 2 4 5 4m9-7h4v3c0 3-2 4-5 4"/>',
  book: '<path d="M12 5C9 3 5 3 2 4v16c3-1 7-1 10 1 3-2 7-2 10-1V4c-3-1-7-1-10 1Zm0 0v16"/>',
  volume:
    '<path d="m3 9 5 0 5-5v16l-5-5H3V9Zm14-1c3 2 3 6 0 8m3-11c5 4 5 10 0 14"/>',
  armor:
    '<path d="m7 3 5 3 5-3 5 5-4 4v10H6V12L2 8l5-5Z"/><path d="M9 3c0 6 6 6 6 0"/>',
  tool: '<path d="m14 3 1 5 4 1 3-3c1 6-3 9-7 8L6 22l-4-4 9-9c-1-4 1-7 6-8l-3 2Z"/>',
};
export function icon(name, className = "") {
  if (["silver_ore", "mithril_ore", "orichalcum_ore"].includes(name))
    name = "ore";
  if (
    [
      "steel_ingot",
      "silver_ingot",
      "mithril_ingot",
      "orichalcum_ingot",
    ].includes(name)
  )
    name = "ingot";
  if (name === "coal") name = "stone";
  if (name === "diamond")
    return `<svg class="icon ${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M5 3h14l4 6-11 13L1 9Z M1 9h22 M5 3l7 19 7-19 M8 9l4-6 4 6"/></svg>`;
  return `<svg class="icon ${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.leaf}</svg>`;
}
