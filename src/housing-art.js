// Dedicated stage images; levels are bounded consistently with facility rendering.
export const housingArtFile=level=>{const n=Math.max(1,Math.min(5,Math.floor(Number(level)||1)));return n===1?'housing-v1.png':`housing-stage-${n}-v1.png`;};
