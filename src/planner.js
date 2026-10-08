import * as old from "./legacy-planner.js?v=0.2.6";
import {
  isLegacy,
  ACTIONS,
  RECIPES,
  RESOURCES,
  isKnown,
  getActionDuration,
  getRecipeCost,
  getSkillProgress,
  enqueueGoal,
  getProductionSources,
} from "./engine.js?v=0.2.6";
const fail = (reason) => ({ ok: false, reason, steps: [], summary: "" });
export function planCraft(s, id) {
  if (isLegacy(s)) return old.planCraft(s, id);
  if (!s.meta.upgrades.includes("action_queue"))
    return fail("行動予約を解放してください。");
  const d = RECIPES.find((x) => x.id === id);
  if (!d || !isKnown(s, d)) return fail("未発見の製作です。");
  if (s.run.status !== "preparing") return fail("準備中に予約してください。");
  const inventory = { ...s.run.resources },
    steps = [];
  let seconds = 0;
  const paid = new Set();
  function append(x, n) {
    const saved =
      !paid.has(x.id) &&
      (s.run.activeAction?.id === x.id
        ? s.run.activeAction
        : s.run.suspendedActions[x.id]);
    seconds +=
      (saved ? saved.duration - saved.progress : getActionDuration(s, x)) +
      getActionDuration(s, x) * (n - 1);
    paid.add(x.id);
    while (n) {
      const count = Math.min(99, n);
      steps.push({ id: x.id, count });
      n -= count;
    }
  }
  function craft(x, n, seen = new Set()) {
    if (seen.has(x.id)) throw Error("材料の循環。");
    if (!isKnown(s, x)) throw Error("未発見です。");
    if (getSkillProgress(s.run.skills[x.skill].xp).level < x.unlockLevel)
      throw Error(x.skill + " Lv." + x.unlockLevel + "が必要。");
    const next = new Set([...seen, x.id]);
    if (x.facility) {
      if ((s.run.facilities[x.facility.id] || 0) >= x.level) return;
      if ((s.run.facilities[x.facility.id] || 0) < x.level - 1)
        craft(
          RECIPES.find((r) => r.id === x.requires[0]),
          1,
          next,
        );
    }
    const saved =
      !paid.has(x.id) &&
      (s.run.activeAction?.id === x.id
        ? s.run.activeAction
        : s.run.suspendedActions[x.id]);
    for (const [r, cost] of Object.entries(getRecipeCost(s, x))) {
      const needed = cost * (n - (saved?.kind === "craft" ? 1 : 0)),
        short = needed - (inventory[r] || 0);
      if (short > 0) {
        const sources = getProductionSources(
          s,
          r,
          short,
          inventory,
          next,
          paid,
        );
        const p = sources[0];
        if (!p)
          throw Error(
            RESOURCES[r].name +
              "不足。" +
              (r === "hide"
                ? "撃退または市場で入手。"
                : r === "gold"
                  ? "市場で木材を納入。"
                  : "技能を上げてください。"),
          );
        craft(p, Math.ceil(short / p.yields[r]), next);
      }
      inventory[r] = (inventory[r] || 0) - needed;
    }
    append(x, n);
    for (const [r, v] of Object.entries(x.yields || {}))
      inventory[r] = (inventory[r] || 0) + v * n;
  }
  try {
    craft(d, 1);
    return {
      ok: true,
      reason: "",
      steps,
      seconds,
      summary: steps
        .map(
          (x) =>
            [...ACTIONS, ...RECIPES].find((d) => d.id === x.id).name +
            " ×" +
            x.count,
        )
        .join(" → "),
    };
  } catch (e) {
    return { ...fail(e.message), known: true };
  }
}
export function queueCraft(s, id) {
  if (isLegacy(s)) return old.queueCraft(s, id);
  const d = RECIPES.find((x) => x.id === id);
  if (!d || !isKnown(s, d)) return fail("未発見です。");
  s.settings.disabledUpgrades = s.settings.disabledUpgrades.filter(
    (x) => x !== "action_queue",
  );
  const result = enqueueGoal(s, id);
  if (!result.ok) return fail(result.reason);
  return { ok: true, reason: "", steps: [{ id, count: 1 }] };
}
