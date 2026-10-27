// Only stage II has a new dedicated image; unmade stages retain their existing art.
export const housingArtFile=level=>Math.max(1,Math.min(5,Math.floor(Number(level)||1)))===2?'housing-stage-2-v1.png':'housing-v1.png';
