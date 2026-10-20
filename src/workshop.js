import {weaponById}from './gear-content.js?v=0.6.47';
/** Visibility is a display preference; it never cancels or forbids crafting. */
export function getRecipeVisibility(state, recipe) {
  if (!recipe.equipment && !recipe.facility) return { hidden: false, manuallyHidden: false, equipped: false, inferior: false, inProgress: false };
  const current = recipe.equipment && state.run.equipment[recipe.equipment.slot];
  const equipped = recipe.facility ? Number(state.run.facilities[recipe.facility.id]||0) >= (recipe.facility.level||1) : current?.id === recipe.id;
  // Hide only equipment dominated in every attribute of the same slot.
  // Trade-offs and equipment for a different slot remain choices.
  const owned = state.version!==1 && Boolean(recipe.equipment && state.run.ownedEquipment?.includes(recipe.id));
  const obsolete = owned || equipped || Boolean(current && !recipe.combat && !weaponById(current.id)?.combat && ['attack', 'defense', 'maxHp', 'speed'].every(stat => (current[stat] || 0) >= (recipe.equipment[stat] || 0)));
  const manuallyHidden = state.settings.hiddenRecipes.includes(recipe.id);
  const inProgress = state.run.activeAction?.id === recipe.id || Boolean(state.run.suspendedActions[recipe.id]);
  const chainHidden = Boolean(recipe.previousEquipmentId && (current?.tier || 0) + 1 < recipe.tier || recipe.facility && (state.run.facilities[recipe.facility.id] || 0) + 1 < recipe.level);
  return { chainHidden, hidden: !inProgress && (manuallyHidden || obsolete || chainHidden), manuallyHidden, equipped, owned, inferior: obsolete && !equipped && !owned, inProgress };
}
