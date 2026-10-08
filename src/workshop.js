/** Visibility is a display preference; it never cancels or forbids crafting. */
export function getRecipeVisibility(state, recipe) {
  if (!recipe.equipment && !recipe.facility) return { hidden: false, manuallyHidden: false, equipped: false, inferior: false, inProgress: false };
  const current = recipe.equipment && state.run.equipment[recipe.equipment.slot];
  const equipped = recipe.facility ? Number(state.run.facilities[recipe.facility.id]||0) >= (recipe.facility.level||1) : current?.id === recipe.id;
  // Hide only equipment dominated in every attribute of the same slot.
  // Trade-offs and equipment for a different slot remain choices.
  const obsolete = equipped || Boolean(current && ['attack', 'defense', 'maxHp', 'speed'].every(stat => (current[stat] || 0) >= (recipe.equipment[stat] || 0)));
  const manuallyHidden = state.settings.hiddenRecipes.includes(recipe.id);
  const inProgress = state.run.activeAction?.id === recipe.id || Boolean(state.run.suspendedActions[recipe.id]);
  return { hidden: !inProgress && (manuallyHidden || obsolete), manuallyHidden, equipped, inferior: obsolete && !equipped, inProgress };
}
