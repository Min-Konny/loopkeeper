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
  const shared = '<ellipse cx="48" cy="82" rx="45" ry="7" fill="#14281e"/><path d="M13 78h69" stroke="#718265" stroke-width="3"/>';
  const house = '<path d="M21 76V43h54v33Z" fill="#80755f"/><path d="M15 45 47 20 81 45Z" fill="var(--roof,#586e66)"/><path d="M21 45h54" stroke="#c2ad7e" stroke-width="3"/><path d="M43 76V58h13v18" fill="#293b34"/><path class="village-window" d="M28 52h9v10h-9M62 52h8v10h-8" fill="#e5ba69"/>';
  const symbols = {
    watchtower: '<path d="M35 80V29h27v51Z" fill="#80755f"/><path d="M29 30h39L48 10Z" fill="#57746d"/><path d="M39 40h19v13H39" fill="#273e35"/><path d="M34 63h29M34 72h29" stroke="#c0a576" stroke-width="3"/><path d="M60 13V2" stroke="#b6ac87"/><path class="village-flag" d="M61 2h16l-5 5 5 5H61" fill="#d7b470"/>',
    barricade: '<g fill="#8d7350" stroke="#b99a67" stroke-width="1">'+[9,25,41,57,73].map(x=>`<path d="M${x} 79V46l6-10 6 10v33Z"/>`).join('')+'</g><path d="M5 57h84M5 70h84" stroke="#584632" stroke-width="5"/>',
    infirmary: house+'<path d="M45 32v14M38 39h14" stroke="#d6ddd0" stroke-width="5"/>',
    workshop: house+'<path d="M64 31V13h10v25" fill="#69766b"/><g class="village-smoke" fill="#c4ccc0" opacity=".45"><circle cx="68" cy="8" r="5"/><circle cx="63" cy="1" r="4"/></g><path class="village-flame" d="M43 70q-3-7 5-13l3 6 4-4q6 10-1 12Z" fill="#f4b969"/>',
    market: house+'<path d="M16 50h66l-8-17H24Z" fill="#baa075"/><path d="M29 35v15M47 33v17M65 35v15" stroke="#677b68" stroke-width="8"/><path d="M18 65h64v8H18Z" fill="#b59664"/><g fill="#d7b866"><circle cx="29" cy="63" r="4"/><circle cx="37" cy="63" r="4"/></g>',
    guardhouse: house+'<path d="M18 26h62v13H18Z" fill="#8c9584"/><path d="M24 18v13M40 18v13M57 18v13M74 18v13" stroke="#b0b6a0" stroke-width="8"/><path d="M48 47l9 3v10l-9 7-9-7V50Z" fill="#b7b992"/>',
  };
  for (const [id, paths] of Object.entries(symbols)) {
    const b = document.createElement("span");
    b.dataset.building = id;
    b.hidden = true;
    b.innerHTML = `<svg viewBox="0 0 96 90" aria-hidden="true">${shared}${paths}</svg>`;
    buildings.append(b);
  }
  host.append(buildings);
  const threat = document.createElement('div');
  threat.className = 'camp-threat';
  threat.hidden = true;
  threat.setAttribute('aria-hidden', 'true');
  threat.innerHTML = `<svg viewBox="0 0 180 70"><g fill="#344442" stroke="#778374" stroke-width=".6">${[0,35,75].map((x,i)=>`<g class="approaching-enemy" style="animation-delay:${i*-.4}s" transform="translate(${x} 0)"><path d="M20 50l5-22h15l7 22-6 16h-7l-2-15-4 15h-7Z"/><circle cx="32" cy="19" r="8"/><path d="M20 29l-9 20M40 29l14 11" stroke="#142022" stroke-width="6"/><path d="M52 44V9l4-6 4 6v35Z" fill="#3c4440"/><circle cx="30" cy="19" r="1" fill="#bd805d"/></g>`).join('')}</g></svg>`;
  host.append(threat);
  let threatPaused = true;
  const scene = {
    setActive(value) {
      active = value;
      update();
      buildings.classList.toggle('settlement-paused', !active);
      threat.classList.toggle('threat-paused', !active || threatPaused);
    },
    setThreat(progress, paused) {
      threatPaused = paused;
      threat.hidden = progress <= 0;
      host.classList.toggle("threat-visible", progress > 0);
      threat.style.opacity = String(Math.min(.8, progress));
      threat.style.transform = `translateX(${(1-progress)*34}px)`;
      threat.classList.toggle('threat-paused', paused || !active);
    },
    setSettlement(facilities) {
      host.classList.toggle("has-settlement", Object.values(facilities).some(n => n > 0));
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
