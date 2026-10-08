const scenes = new WeakMap();
let nextScene = 0;

/** A persistent illustration layer. Animation never rewrites the game's controls. */
export function mountCampScene(host, { variant = "camp", focusY = 0.55 } = {}) {
  if (scenes.has(host)) return scenes.get(host);
  const id = `camp-scene-${++nextScene}`;
  const art = new URL("../assets/camp-dusk.png", import.meta.url).href;
  const layer = document.createElement("div");
  layer.className = `camp-art camp-art-${variant}`;
  layer.setAttribute("aria-hidden", "true");
  layer.innerHTML = `<svg class="camp-art-stage" viewBox="0 0 1536 1024" focusable="false" aria-hidden="true">
    <defs>
      <radialGradient id="${id}-soft"><stop offset="45%" stop-color="white"/><stop offset="100%" stop-color="white" stop-opacity="0"/></radialGradient>
      <radialGradient id="${id}-warm"><stop stop-color="#ffe3a0" stop-opacity=".6"/><stop offset=".28" stop-color="#ffac50" stop-opacity=".25"/><stop offset="1" stop-color="#ff922e" stop-opacity="0"/></radialGradient>
      <radialGradient id="${id}-mist"><stop stop-color="#c4d1c1" stop-opacity=".14"/><stop offset="1" stop-color="#c4d1c1" stop-opacity="0"/></radialGradient>
      <mask id="${id}-pine-left"><ellipse cx="367" cy="382" rx="225" ry="235" fill="url(#${id}-soft)"/></mask>
      <mask id="${id}-pine-right"><ellipse cx="1170" cy="290" rx="125" ry="155" fill="url(#${id}-soft)"/></mask>
      <mask id="${id}-canopy"><ellipse cx="260" cy="53" rx="470" ry="210" fill="url(#${id}-soft)"/></mask>
    </defs>
    <image href="${art}" width="1536" height="1024"/>
    <g class="camp-tree camp-tree-left"><image href="${art}" width="1536" height="1024" mask="url(#${id}-pine-left)"/></g>
    <g class="camp-tree camp-tree-right"><image href="${art}" width="1536" height="1024" mask="url(#${id}-pine-right)"/></g>
    <g class="camp-tree camp-canopy"><image href="${art}" width="1536" height="1024" mask="url(#${id}-canopy)"/></g>
    <g class="camp-mist"><ellipse cx="775" cy="420" rx="260" ry="56" fill="url(#${id}-mist)"/><ellipse cx="660" cy="540" rx="210" ry="45" fill="url(#${id}-mist)"/></g>
    <ellipse class="camp-fire-glow" cx="1034" cy="582" rx="100" ry="74" fill="url(#${id}-warm)"/>
    <ellipse class="camp-torch-glow" cx="1116" cy="481" rx="32" ry="45" fill="url(#${id}-warm)"/>
    <g class="camp-flame camp-flame-outer"><path d="M1022 591 Q1018 582 1025 573 Q1029 565 1026 556 Q1038 565 1037 579 Q1044 572 1043 567 Q1056 584 1045 592Z" fill="#eaa24f" opacity=".72"/></g>
    <g class="camp-flame camp-flame-inner"><path d="M1028 591 Q1026 584 1033 577 Q1037 571 1035 564 Q1045 577 1041 586 L1045 591Z" fill="#ffebad" opacity=".9"/></g>
    <g class="camp-embers">${Array.from({ length: 7 }, (_, i) => `<circle class="camp-ember" cx="${1027 + ((i * 7) % 19)}" cy="${580 + (i % 3)}" r="${i % 2 ? 1.3 : 1.8}" fill="#ffce7e" style="--ember-drift:${i % 2 ? -14 - i * 2 : 11 + i * 2}px;--ember-delay:${-i * 0.67}s;--ember-duration:${3.2 + i * 0.3}s"/>`).join("")}</g>
    <g class="camp-motes" fill="#dbce9b">${[
      [410, 370],
      [800, 460],
      [586, 525],
      [316, 467],
    ]
      .map(
        ([x, y], i) =>
          `<circle class="camp-mote" cx="${x}" cy="${y}" r="1.5" style="--mote-delay:${-i * 3.3}s"/>`,
      )
      .join("")}</g>
  </svg>`;
  host.prepend(layer);
  host.classList.add("has-camp-art");
  const stage = layer.querySelector("svg");
  const resize = () => {
    const { width, height } = layer.getBoundingClientRect();
    if (!width || !height) return;
    const scale = Math.max(width / 1536, height / 1024);
    stage.style.width = `${1536 * scale}px`;
    stage.style.height = `${1024 * scale}px`;
    stage.style.left = `${(width - 1536 * scale) / 2}px`;
    stage.style.top = `${(height - 1024 * scale) * focusY}px`;
  };
  let visible = true;
  let active = true;
  const update = () =>
    layer.classList.toggle(
      "camp-art-resting",
      !visible || !active || document.hidden,
    );
  const observer = new ResizeObserver(resize);
  observer.observe(layer);
  const visibility = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    update();
  });
  visibility.observe(layer);
  document.addEventListener("visibilitychange", update);
  const buildings = document.createElement("div");
  buildings.className = "camp-buildings";
  const symbols = {
    watchtower: '<path d="M9 28V7h14v21 M6 7h20L16 1Z M12 13h8 M12 19h8"/>',
    barricade:
      '<path d="M3 28V9l4-5 4 5v19 M13 28V9l4-5 4 5v19 M23 28V9l4-5 4 5v19 M1 15h30 M1 23h30"/>',
    infirmary:
      '<path d="M3 28V12L16 3l13 9v16Z M12 12h8v4h4v8h-4v4h-8v-4H8v-8h4Z"/>',
    workshop:
      '<path d="M3 28V12l13-9 13 9v16Z M8 22h16 M10 22v6 M22 22v6 M10 15l12 6 M13 12l-5 5"/>',
    market:
      '<path d="M4 28V14h24v14 M1 14 5 3h22l4 11 M8 14V3 M16 14V3 M24 14V3 M10 28v-7h12v7"/>',
    guardhouse:
      '<path d="M4 28V9h24v19 M3 3v6h26V3 M8 3v6 M16 3v6 M24 3v6 M12 28v-9h8v9"/>',
  };
  for (const [id, paths] of Object.entries(symbols)) {
    const b = document.createElement("span");
    b.dataset.building = id;
    b.innerHTML = `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">${paths}</svg>`;
    buildings.append(b);
  }
  host.append(buildings);
  const scene = {
    setActive(value) {
      active = value;
      update();
    },
    setSettlement(facilities) {
      for (const b of buildings.children) {
        const n = Number(facilities[b.dataset.building] || 0);
        b.hidden = !n;
        b.dataset.level = n;
      }
    },
  };
  scenes.set(host, scene);
  resize();
  update();
  return scene;
}
