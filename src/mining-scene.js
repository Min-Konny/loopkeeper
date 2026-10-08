const deposits = {
  quarry_stone: { type: 'stone', base: '#697b80', face: '#99a8a8', vein: '#c0b7a0', particle: '#b7c7ca' },
  mine_ore: { type: 'iron', base: '#655c53', face: '#9a8070', vein: '#d5a47c', particle: '#e0b18c' },
  mine_coal: { type: 'coal', base: '#26343a', face: '#46565d', vein: '#83959c', particle: '#81949d' },
  mine_silver: { type: 'silver', base: '#576877', face: '#8d9baa', vein: '#e2eaf0', particle: '#e2eaf0' },
  mine_mithril: { type: 'mithril', base: '#3a6266', face: '#648c8c', vein: '#85e2d5', particle: '#a5eee1' },
  mine_diamond: { type: 'diamond', base: '#496579', face: '#8fb6d3', vein: '#d3f3ff', particle: '#ddf8ff' },
  mine_orichalcum: { type: 'orichalcum', base: '#705541', face: '#a18452', vein: '#f3ca6e', particle: '#ffe2a0' },
};

function crystal(x, y, scale, deposit) {
  return `<g transform="translate(${x} ${y}) scale(${scale})"><path d="M0 0 9-27 19-34 30-23 27 0Z" fill="${deposit.vein}"/><path d="M0 0 9-27 19-34 15 0Z" fill="${deposit.face}"/><path d="M19-34 30-23 27 0 15 0Z" fill="${deposit.vein}"/><path d="M9-27 19-34 22-20 15 0" fill="none" stroke="#f0ffff" stroke-opacity=".65" stroke-width="1.2"/></g>`;
}

export function miningScene(actionId) {
  const deposit = deposits[actionId] || deposits.quarry_stone;
  const { type, base, face, vein, particle } = deposit;
  const rock = `<path d="M66 73 75 48 100 33 128 42 144 70Z" fill="${base}"/><path d="M75 48 100 33 94 67 66 73Z" fill="${face}"/><path d="M100 33 128 42 109 54 94 67Z" fill="${vein}" opacity=".28"/>`;
  const shapes = {
    stone: '<path d="M77 55 91 51M103 62 118 58 129 65" fill="none" stroke="#c1cbcb" stroke-width="2" opacity=".6"/>',
    iron: `<g fill="${vein}" stroke="#6c5142" stroke-width="1"><path d="M81 53 91 47 97 54 89 64 79 60Z"/><path d="M109 42 121 46 118 55 107 51Z"/><path d="M118 62 132 55 137 65 126 70Z"/></g>`,
    coal: `<path d="M72 67 78 48 90 40 99 52 108 38 121 43 136 56 141 70 121 76 101 69 86 77Z" fill="${base}" stroke="${face}" stroke-width="2"/><path d="M78 48 90 56 86 70M108 38 110 56 121 76M110 56 132 57" fill="none" stroke="${vein}" stroke-opacity=".6" stroke-width="1.5"/>`,
    silver: `<path d="M77 59 92 54 101 43 115 48 127 44M92 54 98 66 125 61 136 67" fill="none" stroke="${vein}" stroke-width="4" stroke-linejoin="round"/><path d="M102 44 112 47" stroke="#ffffff" stroke-width="1.5"/>`,
    mithril: crystal(80, 66, .65, deposit) + crystal(103, 65, .9, deposit) + crystal(125, 70, .5, deposit),
    diamond: crystal(72, 72, .7, deposit) + crystal(92, 71, 1.35, deposit) + crystal(127, 73, .65, deposit),
    orichalcum: `<path d="M77 65 88 58 99 61 108 48 126 46M99 61 105 69 131 61M108 48 104 39" fill="none" stroke="${vein}" stroke-width="5" stroke-linejoin="round"/><path d="M116 52 125 49 130 55 124 63 115 60Z" fill="#ffe39b"/>`,
  };
  const gleam = ['silver', 'mithril', 'diamond', 'orichalcum'].includes(type)
    ? `<g class="ore-gleam" fill="${particle}"><path d="M119 32 121 38 127 40 121 42 119 48 117 42 111 40 117 38Z"/><path d="M86 50 87 53 90 54 87 55 86 58 85 55 82 54 85 53Z"/></g>` : '';
  return { type, particle, markup: `<g class="work-target ore-${type}">${rock}${shapes[type]}${gleam}</g>` };
}
