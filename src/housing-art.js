// Dedicated II/III artwork. Unmade IV/V retain the existing base and level marks.
export const housingArtFile=level=>({2:'housing-stage-2-v1.png',3:'housing-stage-3-v1.png'})[Math.max(1,Math.min(5,Math.floor(Number(level)||1)))]||'housing-v1.png';
