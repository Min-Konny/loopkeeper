// Coordinates refer to the approved 1672 × 941 clean plate. Resident points are feet.
// Keep residents on the wide central road and its southern/eastern branches.
export const residentRoutes = [
  [[952,553],[974,590],[1003,623],[1014,652],[977,679],[924,708],[863,737],[803,768]],
  [[1145,468],[1180,451],[1216,435],[1235,420]],
  [[1029,662],[1103,684],[1180,705],[1265,723],[1352,730],[1443,732],[1530,726]],
  [[817,761],[865,738],[925,708],[978,680],[1014,652]],
];
export const riverRoute = [[30,547],[100,532],[180,530],[233,552],[250,601],[294,641],[375,678],[458,706],[540,755],[632,793],[726,831],[818,870],[918,887],[1000,867]];
export const backTrees = [[0,305,300,135,160],[1,450,302,140,170]];

/** Constant-distance movement through all bends, rather than a shortcut between endpoints. */
export function alongPath(points, fraction) {
  const lengths=points.slice(1).map(([x,y],i)=>Math.hypot(x-points[i][0],y-points[i][1]));
  let distance=Math.max(0,Math.min(1,fraction))*lengths.reduce((a,b)=>a+b,0);
  for(let i=0;i<lengths.length;i++) {
    if(distance<=lengths[i]||i===lengths.length-1) {
      const k=lengths[i]?Math.min(1,distance/lengths[i]):0;
      return [points[i][0]+(points[i+1][0]-points[i][0])*k,points[i][1]+(points[i+1][1]-points[i][1])*k];
    }
    distance-=lengths[i];
  }
  return points[0];
}

// The river base is dark saturated blue. Grey/violet rock, grass and timber must stay dry.
export function isRiverPixel(r,g,b) {return r<22 && g>24 && g<76 && b>g*1.25 && b-r>30;}

const unit=n=>Math.max(0,Math.min(1,Number.isFinite(n)?n:0));
const SMOKE_SOURCES=['workshop','kitchen','smokehouse','laboratory'];
const DEFENCES=['watchtower','barricade','guardhouse','archery_tower','signal_post'];
/**
 * Life around the village follows the run. The buildings themselves belong to the approved plate,
 * so growth is shown by people, crops, livestock, hearth smoke and wall torches. Outposts stand elsewhere.
 * Pure presentation: reads the given numbers and never touches game state.
 */
export function villageLife({facilities={},constructing=false,threat=0}={}) {
  const level=id=>Math.max(0,Number(facilities[id])||0);
  const built=Object.keys(facilities).filter(id=>!id.startsWith('outpost_')&&level(id)>0).length;
  return {
    residents:Math.min(3,1+Math.floor(built/2)),
    carrier:Boolean(constructing),
    fields:[unit(built/4),unit((built-4)/4)],
    sheep:Math.min(3,Math.floor(built/2)),
    smoke:Math.min(2,SMOKE_SOURCES.filter(id=>level(id)>0).length),
    torches:DEFENCES.some(id=>level(id)>0),
    threat:unit(threat),
  };
}
