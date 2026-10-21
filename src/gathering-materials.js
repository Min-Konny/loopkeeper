// A bounded saving on a finite normal construction/equipment bill, never output.
const materials=new Set(['wood','stone','hide','ore','ingot','steel_ingot','silver_ore','silver_ingot','mithril_ore','mithril_ingot','diamond','orichalcum_ore','orichalcum_ingot']);
export function gatheringSavingBasisPoints(activeEffect){
 return Number.isFinite(activeEffect)?Math.min(2000,Math.max(0,Math.round(activeEffect*2000/.30))):0;
}
export const gatheringMaterialSaving=activeEffect=>gatheringSavingBasisPoints(activeEffect)/10000;
export const gatheringMaterialRecipe=d=>!!d&&!d.endlessFacility&&!!(d.facility||(d.equipment&&['weapon','tool','armor','shield'].includes(d.slot)));
export function applyGatheringMaterialSaving(cost,d,activeEffect){
 const bps=gatheringMaterialRecipe(d)?gatheringSavingBasisPoints(activeEffect):0;
 return Object.fromEntries(Object.entries(cost).map(([id,n])=>[id,bps&&materials.has(id)?Math.max(1,Math.ceil(n*(10000-bps)/10000)):n]));
}
