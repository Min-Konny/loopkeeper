// Original local simulation. All mutations stay in this module; no wall-clock or random input.
export const FIRST_RAID_DELAY = 180;
export const BASE_RAID_INTERVAL = 180;
export const RAID_TIMING_VERSION = 2;
export const ACCELERATION = { duration: 120, multiplier: 5, bestWave: 9, automationCount: 3, generation: 2 };

export const SKILLS = [
  { id: 'logging', name: '伐採', description: '木材を集める速さが上がる。', color: '#8bb59a' },
  { id: 'mining', name: '採掘', description: '石材と鉄鉱石を集める速さが上がる。', color: '#9faebc' },
  { id: 'foraging', name: '採集', description: '食料と薬草を集める速さが上がる。', color: '#c5c17d' },
  { id: 'smithing', name: '製作', description: '調理や装備の製作が速くなる。', color: '#dfa56b' },
  { id: 'combat', name: '戦闘', description: '訓練と実戦で攻撃力・最大体力が上がる。', color: '#d1807e' },
];

export const RESOURCES = {
  wood: { name: '木材', icon: '🪵' },
  stone: { name: '石材', icon: '🪨' },
  ore: { name: '鉄鉱石', icon: '⛏' },
  herbs: { name: '薬草', icon: '🌿' },
  food: { name: '食料', icon: '🍞' },
  hide: { name: '獣皮', icon: '◇' },
  ingot: { name: '鉄塊', icon: '▰' },
  gold: { name: '金貨', icon: '◉' },
};

export const DIPLOMACY = { country: 'サフラ辺境国', foodCost: 6, deadline: 140, incomeInterval: 10, incomeAmount: 1 };
export const BUYABLES = [
  { id: 'rations', name: '食料を購入', cost: 3, description: '食料を2獲得。' },
  { id: 'mercenary', name: '傭兵を雇う', cost: 8, description: 'この周回の攻撃力 +2。雇用は1人まで。' },
];

export const AUGMENTS = [
  { id: 'forestry', name: '森と鉱脈の知恵', family: 'economy', description: '伐採・採掘の採集時間を20%短縮。' },
  { id: 'builder', name: '倹約建築', family: 'economy', description: '村施設の必要素材を25%削減（端数切り上げ）。' },
  { id: 'warrior', name: '勇士の心得', family: 'martial', description: '攻撃力 +3。' },
  { id: 'drill', name: '鍛錬の習慣', family: 'martial', description: '素振りの時間を30%短縮し、攻撃力 +1。' },
  { id: 'provisions', name: '滋養食', family: 'fortress', description: '食料1つの回復量 +10。' },
  { id: 'guard', name: '守りの構え', family: 'fortress', description: '防御力 +2。' },
  { id: 'timber_contract', name: '木材納入契約', family: 'economy', description: '自分の伐採が完了するたびに金貨1を獲得。', pack: 'economy_augments' },
  { id: 'investment', name: '村への投資', family: 'economy', description: '建設済み施設1つにつき10秒ごとに金貨1。戦闘中も継続。', pack: 'economy_augments' },
  { id: 'bounty', name: '賞金稼ぎ', family: 'martial', description: '攻撃力 +2。襲撃を撃退するたびに金貨4を獲得。', pack: 'martial_augments' },
  { id: 'momentum', name: '勝利の勢い', family: 'martial', description: 'この周回の撃退数だけ攻撃力上昇。勝利時に体力8回復。', pack: 'martial_augments' },
];

export const ACTIONS = [
  { id: 'chop_wood', name: '木を伐る', description: '森の縁で木材を集める。', skill: 'logging', duration: 5, yields: { wood: 2 } },
  { id: 'quarry_stone', name: '石を掘る', description: '装備の素材になる石材を採る。', skill: 'mining', duration: 6, yields: { stone: 2 } },
  { id: 'mine_ore', name: '鉄鉱石を掘る', description: '鉄の装備に必要な鉱石を採る。', skill: 'mining', duration: 8, yields: { ore: 2 }, unlockLevel: 2 },
  { id: 'gather_food', name: '食料を集める', description: '戦闘中、体力が55%以下になると自動で食べて28回復。', skill: 'foraging', duration: 7, yields: { food: 1 } },
  { id: 'gather_herbs', name: '薬草を摘む', description: '調理すると効率よく食料を作れる。', skill: 'foraging', duration: 5, yields: { herbs: 2 } },
  { id: 'train_combat', name: '素振りする', description: '戦闘レベルを鍛え、攻撃力と最大体力を上げる。', skill: 'combat', duration: 6, yields: {} },
];

export const FACILITIES = {
  watchtower: { name: '見張り台', description: '現在の襲撃を15秒遅らせ、以降の襲撃間隔も15秒延ばす。', icon: '♜' },
  barricade: { name: '防護柵', description: '村を守る柵。戦闘中の防御力が3上がる。', icon: '▥' },
  infirmary: { name: '救護所', description: '戦闘準備中、4秒ごとに体力を2回復する。', icon: '✚' },
};

export const RECIPES = [
  { id: 'wooden_spear', name: '石の槍', description: '最初の襲撃に備える基本の武器。攻撃 +6。', skill: 'smithing', duration: 8, cost: { wood: 4, stone: 2 }, equipment: { slot: 'weapon', name: '石の槍', attack: 6 } },
  { id: 'wooden_shield', name: '木の盾', description: '一撃ごとの被害を減らす。防御 +2。', skill: 'smithing', duration: 8, cost: { wood: 6, stone: 2 }, equipment: { slot: 'shield', name: '木の盾', defense: 2 } },
  { id: 'work_tools', name: '作業道具', description: 'すべての作業速度 +18%。', skill: 'smithing', duration: 10, cost: { wood: 4, stone: 4 }, equipment: { slot: 'tool', name: '作業道具', speed: 0.18 } },
  { id: 'cook_meal', name: '薬草のスープ', description: '薬草と薪で食料を3つ作る。', skill: 'smithing', duration: 6, cost: { herbs: 2, wood: 1 }, yields: { food: 3 } },
  { id: 'smelt_iron', name: '鉄を精錬', description: '鉄鉱石を装備用の鉄塊にする。', skill: 'smithing', duration: 9, cost: { ore: 3, wood: 2 }, yields: { ingot: 1 } },
  { id: 'leather_armor', name: '革の鎧', description: '襲撃で得た獣皮から作る。防御 +3。', skill: 'smithing', duration: 10, cost: { hide: 2, wood: 4 }, equipment: { slot: 'armor', name: '革の鎧', defense: 3 } },
  { id: 'iron_sword', name: '鉄の剣', description: '石の槍に代わる武器。攻撃 +15。', skill: 'smithing', duration: 14, cost: { ingot: 3, wood: 2 }, equipment: { slot: 'weapon', name: '鉄の剣', attack: 15 }, unlockLevel: 2 },
  { id: 'iron_armor', name: '鉄の鎧', description: '革の鎧に代わる装備。防御 +7。', skill: 'smithing', duration: 18, cost: { ingot: 5, hide: 4 }, equipment: { slot: 'armor', name: '鉄の鎧', defense: 7 }, unlockLevel: 3 },
  { id: 'watchtower', name: FACILITIES.watchtower.name, description: FACILITIES.watchtower.description, skill: 'smithing', duration: 12, cost: { wood: 12, stone: 8 }, facility: { id: 'watchtower', name: FACILITIES.watchtower.name } },
  { id: 'barricade', name: FACILITIES.barricade.name, description: FACILITIES.barricade.description, skill: 'smithing', duration: 10, cost: { wood: 10, stone: 6 }, facility: { id: 'barricade', name: FACILITIES.barricade.name } },
  { id: 'infirmary', name: FACILITIES.infirmary.name, description: FACILITIES.infirmary.description, skill: 'smithing', duration: 14, cost: { wood: 10, stone: 4, herbs: 6 }, facility: { id: 'infirmary', name: FACILITIES.infirmary.name } },
];

// First-time learning rewards use the same currency as boss discoveries.
export const MILESTONES = [
  { id: 'first_weapon', action: 'wooden_spear', name: '石の槍を作る', tab: 'craft', reward: 1 },
  { id: 'first_meal', action: 'cook_meal', name: '薬草のスープを作る', tab: 'craft', reward: 1 },
  { id: 'first_tower', action: 'watchtower', name: '見張り台を建てる', tab: 'village', reward: 1 },
];

export const LEGACY_UPGRADES = [
  { id: 'action_queue', name: '行動予約・おまかせ製作', description: '素材集めから製作までおまかせで予約。最大8件、各1〜99回。素材不足では待機し、予約は次の世代に持ち越さない。', cost: 1, kind: 'automation' },
  { id: 'auto_cook', name: '自動調理', description: '薬草2と木材1を使い、食料3を自動で調理。主作業と並行して動く。', cost: 1, kind: 'automation' },
  { id: 'lumber_worker', name: '木こりを雇う', description: '戦闘準備中、6秒ごとに木材1を集める。雇用は次の世代にも残る。', cost: 1, kind: 'worker' },
  { id: 'mining_worker', name: '採掘師を雇う', description: '戦闘準備中、7秒ごとに石材1を集める。雇用は次の世代にも残る。', cost: 1, kind: 'worker' },
  { id: 'inherited_blade', name: '剣技の継承', description: '基礎攻撃力 +8。装備がなくても、次の世代の戦いを支える。', cost: 1, kind: 'combat', effect: { attack: 8 } },
  { id: 'inherited_guard', name: '守備の継承', description: '基礎防御力 +18。襲撃の一撃ごとの被害を減らす。', cost: 1, kind: 'combat', effect: { defense: 18 } },
  { id: 'inherited_vitality', name: '生命力の継承', description: '最大体力 +50。購入時やONへの切替では回復しない。', cost: 1, kind: 'combat', effect: { maxHp: 50 } },
  { id: 'cycle_acceleration', name: '周回復帰', description: '各周回120秒間、以前に撃退済みの範囲の準備時間を5倍速にする。戦闘は等速。', cost: 1, kind: 'time' },
  { id: 'economy_augments', name: '経済オーグメント', description: '今後の3択に「木材納入契約」「村への投資」を追加。購入だけでは効果は発動しない。', cost: 1, kind: 'augment_pack' },
  { id: 'martial_augments', name: '武勇オーグメント', description: '今後の3択に「賞金稼ぎ」「勝利の勢い」を追加。購入だけでは効果は発動しない。', cost: 1, kind: 'augment_pack' },
];

const SKILL_IDS = SKILLS.map(({ id }) => id);
const RESOURCE_IDS = Object.keys(RESOURCES);
const STEP = 0.1;
const MAX_NUMBER = 1e9;
const MAX_LOG = 40;
const DEFINITIONS = new Map([...ACTIONS, ...RECIPES].map((entry) => [entry.id, entry]));
const RECIPE_IDS = new Set(RECIPES.map(({ id }) => id));
const HIDEABLE_RECIPE_IDS = new Set(RECIPES.filter(recipe => recipe.equipment || recipe.facility).map(recipe => recipe.id));
const UPGRADE_IDS = new Set(LEGACY_UPGRADES.map(({ id }) => id));
const HELPER_UPGRADE_IDS = new Set(LEGACY_UPGRADES.filter(({ kind }) => ['automation', 'worker'].includes(kind)).map(({ id }) => id));
const AUGMENT_BY_ID = new Map(AUGMENTS.map((entry) => [entry.id, entry]));
const WORKERS = { lumber_worker: { resource: 'wood', duration: 6 }, mining_worker: { resource: 'stone', duration: 7 } };
const emptySkills = () => Object.fromEntries(SKILL_IDS.map((id) => [id, { xp: 0 }]));
const rounded = (n) => Math.round(n * 1e8) / 1e8 + 0;
const freshDiplomacy = (elapsed = 0, unlocked = false) => ({ status: unlocked ? 'pending' : 'locked', deadline: rounded(elapsed + DIPLOMACY.deadline), incomeTimer: 0, incomeTotal: 0, mercenary: false });
const freshAugments = (meta) => ({ seed: (Math.imul(meta.generation, 0x9e3779b1) ^ 0xa5f1523d) >>> 0, offer: [], selected: [], offeredStages: [], investmentTimer: 0 });
const hasAugment = (state, id) => state.run.augments.selected.includes(id);
const upgradeEnabled = (state, id) => state.meta.upgrades.includes(id) && !state.settings.disabledUpgrades.includes(id);
const freshAcceleration = (meta) => ({ active: false, remainingSeconds: ACCELERATION.duration, limitWave: meta.bestWave });

export function getSkillProgress(xp, permanent = false) {
  let remaining = Number.isFinite(xp) ? Math.max(0, Math.min(MAX_NUMBER, xp)) : 0;
  let level = 1;
  const needed = (current) => Math.round((permanent ? 20 : 50) * current ** 1.3);
  while (remaining >= needed(level)) {
    remaining -= needed(level);
    level += 1;
  }
  const xpNeeded = needed(level);
  return { level, xpInto: rounded(remaining), xpNeeded, progress: remaining / xpNeeded };
}

function newRun(meta) {
  return {
    status: 'preparing', elapsed: 0, wave: 0, nextWaveAt: FIRST_RAID_DELAY, raidTimingVersion: RAID_TIMING_VERSION, hp: 100,
    resources: Object.fromEntries(RESOURCE_IDS.map((id) => [id, 0])),
    skills: emptySkills(), equipment: {}, activeAction: null, suspendedActions: {}, enemy: null,
    combatTimer: 0, simRemainder: 0, logSeq: 0, log: [],
    helpers: Object.fromEntries(meta.upgrades.filter((id) => HELPER_UPGRADE_IDS.has(id)).map((id) => [id, 0])), autoCraft: null,
    queue: [], queueManaged: false, deathReport: null,
    facilities: {}, healTimer: 0,
    diplomacy: freshDiplomacy(0, meta.bestWave >= 3),
    augments: freshAugments(meta),
    acceleration: freshAcceleration(meta),
    startPermanentXp: Object.fromEntries(SKILL_IDS.map((id) => [id, meta.skills[id].xp])),
  };
}

export function createGame() {
  const meta = { generation: 1, bestWave: 0, skills: emptySkills(), history: [], points: 0, defeatedBosses: [], upgrades: [], completedMilestones: [] };
  const state = { version: 1, meta, run: newRun(meta), settings: { paused: true, speed: 1, disabledUpgrades: [], showHiddenRecipes: false, hiddenRecipes: [], soundVolume: 0.3, musicVolume: 0.15, effectsEnabled: true, pauseWhenHidden: false } };
  addLog(state, `最初の襲撃まで、あと${FIRST_RAID_DELAY}秒。作業を選んで備えよう。`, 'info');
  return state;
}

function level(state, skill, permanent = false) {
  return getSkillProgress((permanent ? state.meta : state.run).skills[skill].xp, permanent).level;
}

export function getSkillEffects(state, id) {
  if (!SKILL_IDS.includes(id)) return null;
  const runLevel = level(state, id);
  const permanentLevel = level(state, id, true);
  return {
    runLevel, permanentLevel,
    runSpeedPercent: (runLevel - 1) * 10,
    permanentSpeedPercent: (permanentLevel - 1) * 8,
    runAttack: id === 'combat' ? (runLevel - 1) * 1.25 : 0,
    runMaxHp: id === 'combat' ? (runLevel - 1) * 5 : 0,
  };
}

export function getUnlocks(state) {
  return {
    facilities: state.meta.bestWave >= 1 || Object.keys(state.run.facilities).length > 0,
    diplomacy: state.meta.bestWave >= 3 || ['allied', 'hostile', 'defeated'].includes(state.run.diplomacy.status),
  };
}

export function getMilestoneStatus(state) {
  const completed = state.meta.completedMilestones;
  const next = MILESTONES.find(entry => !completed.includes(entry.id));
  return { completed: completed.length, total: MILESTONES.length, next: next || null, available: !next || next.tab !== 'village' || getUnlocks(state).facilities };
}

function awardMilestone(state, actionId) {
  const entry = MILESTONES.find(entry => entry.action === actionId);
  if (!entry || state.meta.completedMilestones.includes(entry.id)) return;
  state.meta.completedMilestones.push(entry.id);
  state.meta.points += entry.reward;
  addLog(state, `初達成：${entry.name}。継承ポイント +${entry.reward}。`, 'permanent');
}

export function getAugmentStatus(state) {
  return { unlocked: state.meta.bestWave >= 3, offer: [...state.run.augments.offer], selected: [...state.run.augments.selected], remaining: 2 - state.run.augments.selected.length };
}

function offerAugments(state, stage) {
  const augments = state.run.augments;
  if (state.meta.bestWave < 3 || state.run.status === 'dead' || augments.offer.length || augments.selected.length >= 2 || augments.offeredStages.includes(stage)) return;
  const pool = AUGMENTS.filter((entry) => !augments.selected.includes(entry.id) && (!entry.pack || (state.meta.upgrades.includes(entry.pack) && !state.settings.disabledUpgrades.includes(entry.pack)))).map(({ id }) => id);
  const offer = [];
  for (let index = 0; index < 3; index += 1) {
    augments.seed = (Math.imul(augments.seed, 1664525) + 1013904223) >>> 0;
    const chosen = Math.floor((augments.seed / 0x100000000) * pool.length);
    offer.push(pool.splice(chosen, 1)[0]);
  }
  augments.offer = offer;
  augments.offeredStages.push(stage);
  state.settings.paused = true;
  state.run.simRemainder = 0;
  state.run.acceleration.active = false;
  addLog(state, 'オーグメントの3択。この周回で使う力を1つ選ぼう。選択後は手動で時間を再開。', 'info');
}

function introduceAugments(state) {
  if (state.run.status === 'preparing' && state.run.augments.offeredStages.length === 0) offerAugments(state, 'start');
}

export function chooseAugment(state, id) {
  const augments = state.run.augments;
  if (state.run.status !== 'preparing' || !augments.offer.includes(id) || augments.selected.includes(id) || augments.selected.length >= 2) return { ok: false, reason: '提示されているオーグメントから1つ選んでください。' };
  augments.selected.push(id);
  augments.offer = [];
  state.settings.paused = true;
  addLog(state, `${AUGMENT_BY_ID.get(id).name}を選択。この効果は今回の周回で有効。`, 'info');
  return { ok: true, reason: '' };
}

export function getRecipeCost(state, recipeOrId) {
  const recipe = typeof recipeOrId === 'string' ? DEFINITIONS.get(recipeOrId) : recipeOrId;
  if (!recipe?.cost) return {};
  return Object.fromEntries(Object.entries(recipe.cost).map(([id, quantity]) => [id, recipe.facility && hasAugment(state, 'builder') ? Math.max(1, Math.ceil(quantity * 0.75)) : quantity]));
}

export function getFoodHealing(state) {
  return 28 + (hasAugment(state, 'provisions') ? 10 : 0);
}

function unlockDiplomacy(state) {
  if (state.meta.bestWave < 3 || state.run.diplomacy.status !== 'locked') return;
  state.run.diplomacy = freshDiplomacy(state.run.elapsed, true);
  addLog(state, '外交が解放された。サフラ辺境国から食料援助の依頼。回答期限は今から140秒。', 'info');
}

export function getStats(state) {
  const effects = getSkillEffects(state, 'combat');
  const memoryLevel = effects.permanentLevel - 1;
  let attack = 6 + effects.runAttack + memoryLevel * 1.5 + (state.run.diplomacy.status === 'defeated' ? 3 : 0) + (state.run.diplomacy.mercenary ? 2 : 0);
  let defense = memoryLevel * 0.25 + (state.run.facilities.barricade ? 3 : 0);
  attack += (hasAugment(state, 'warrior') ? 3 : 0) + (hasAugment(state, 'drill') ? 1 : 0) + (hasAugment(state, 'bounty') ? 2 : 0) + (hasAugment(state, 'momentum') ? state.run.wave : 0);
  defense += hasAugment(state, 'guard') ? 2 : 0;
  let workSpeed = 1;
  let extraMaxHp = 0;
  for (const upgrade of LEGACY_UPGRADES) {
    if (upgrade.kind !== 'combat' || !upgradeEnabled(state, upgrade.id)) continue;
    attack += upgrade.effect.attack || 0;
    defense += upgrade.effect.defense || 0;
    extraMaxHp += upgrade.effect.maxHp || 0;
  }
  for (const item of Object.values(state.run.equipment)) {
    attack += item.attack || 0;
    defense += item.defense || 0;
    workSpeed += item.speed || 0;
  }
  return { maxHp: 100 + effects.runMaxHp + memoryLevel * 6 + extraMaxHp, attack: rounded(attack), defense: rounded(defense), workSpeed: rounded(workSpeed) };
}

export function getRaidInterval(state) {
  return BASE_RAID_INTERVAL + (state.run.facilities.watchtower ? 15 : 0);
}

export function getActionDuration(state, definition) {
  if (typeof definition === 'string') definition = DEFINITIONS.get(definition);
  if (!definition || !SKILL_IDS.includes(definition.skill)) return 0;
  const effects = getSkillEffects(state, definition.skill);
  const runBonus = 1 + effects.runSpeedPercent / 100;
  const permanentBonus = 1 + effects.permanentSpeedPercent / 100;
  const augmentMultiplier = ((hasAugment(state, 'forestry') && ['logging', 'mining'].includes(definition.skill) && !RECIPE_IDS.has(definition.id)) ? 0.8 : 1) * (hasAugment(state, 'drill') && definition.id === 'train_combat' ? 0.7 : 1);
  return Math.max(0.25, definition.duration * augmentMultiplier / (getStats(state).workSpeed * runBonus * permanentBonus));
}

export function getNextEnemy(state) {
  const wave = state.run.wave + 1;
  const names = ['飢えた狼', '荒野の略奪者', '牙の群れ', '黒鉄の追跡者', '霧の巨獣'];
  const isBoss = wave % 3 === 0;
  const invasion = state.run.diplomacy.status === 'hostile';
  const baseName = isBoss ? (wave === 3 ? '群狼の主' : `夜霧の王・第${wave}波`) : names[Math.min(wave - 1, names.length - 1)] + (wave > 5 ? `・第${wave}波` : '');
  const baseHp = Math.round(80 + (wave - 1) * 65 + (wave - 1) ** 1.8 * 18);
  return {
    name: baseName + (invasion ? '＋サフラ軍' : ''),
    hp: invasion ? Math.ceil(baseHp * 1.25) : baseHp,
    attack: Math.round(9 + (wave - 1) * 18 + (wave - 1) ** 1.4) + (invasion ? 3 : 0),
    defense: Math.floor(wave * 1.2), wave, isBoss,
    reward: isBoss && !state.meta.defeatedBosses.includes(wave) ? 1 : 0,
    invasion, invasionReason: invasion ? '援助交渉が決裂し、サフラ軍が次の襲撃に加わる。' : '',
  };
}

function canResolveDiplomacy(state) {
  if (!getUnlocks(state).diplomacy) return { ok: false, reason: '外交は第3波の初ボス撃破で解放されます。' };
  if (state.run.status !== 'preparing') return { ok: false, reason: '外交は戦闘準備中に行ってください。' };
  if (state.run.diplomacy.status !== 'pending') return { ok: false, reason: 'この周回の外交方針は決定済みです。' };
  if (state.run.elapsed >= state.run.diplomacy.deadline) return { ok: false, reason: '援助の回答期限を過ぎています。' };
  return { ok: true, reason: '' };
}

export function aidCountry(state) {
  const allowed = canResolveDiplomacy(state);
  if (!allowed.ok) return allowed;
  if (state.run.resources.food < DIPLOMACY.foodCost) return { ok: false, reason: `援助には食料${DIPLOMACY.foodCost}が必要です。` };
  state.run.resources.food -= DIPLOMACY.foodCost;
  state.run.diplomacy.status = 'allied';
  state.run.diplomacy.incomeTimer = 0;
  addLog(state, `${DIPLOMACY.country}へ食料を援助。10秒ごとに金貨1を受け取る同盟を結んだ。`, 'info');
  return { ok: true, reason: '' };
}

function turnHostile(state, ignored = false) {
  state.run.diplomacy.status = 'hostile';
  addLog(state, ignored ? '援助の期限が過ぎた。次の襲撃にはサフラ軍も加わる。' : '援助を断った。次の襲撃にはサフラ軍も加わる。', 'raid');
}

export function refuseCountry(state) {
  const allowed = canResolveDiplomacy(state);
  if (!allowed.ok) return allowed;
  turnHostile(state);
  return { ok: true, reason: '' };
}

export function buySupply(state, id) {
  const supply = BUYABLES.find((entry) => entry.id === id);
  if (!supply) return { ok: false, reason: 'その商品は存在しません。' };
  if (!getUnlocks(state).diplomacy) return { ok: false, reason: '交易は第3波の初ボス撃破で解放されます。' };
  if (state.run.status !== 'preparing') return { ok: false, reason: '購入は戦闘準備中に行ってください。' };
  if (id === 'mercenary' && state.run.diplomacy.mercenary) return { ok: false, reason: '傭兵は雇用済みです。' };
  if (state.run.resources.gold < supply.cost) return { ok: false, reason: `金貨が${supply.cost - state.run.resources.gold}不足しています。` };
  state.run.resources.gold -= supply.cost;
  if (id === 'rations') state.run.resources.food = Math.min(MAX_NUMBER, state.run.resources.food + 2);
  else state.run.diplomacy.mercenary = true;
  addLog(state, id === 'rations' ? '金貨3で食料2を購入した。' : '金貨8で傭兵を雇った。この周回の攻撃力 +2。', 'info');
  return { ok: true, reason: '' };
}

function advanceDiplomacyIncome(state) {
  if (state.run.status === 'dead' || state.run.diplomacy.status !== 'allied') return;
  const diplomacy = state.run.diplomacy;
  diplomacy.incomeTimer = rounded(diplomacy.incomeTimer + STEP);
  if (diplomacy.incomeTimer + 1e-8 >= DIPLOMACY.incomeInterval) {
    diplomacy.incomeTimer = rounded(diplomacy.incomeTimer - DIPLOMACY.incomeInterval);
    diplomacy.incomeTotal = Math.min(MAX_NUMBER, diplomacy.incomeTotal + DIPLOMACY.incomeAmount);
    state.run.resources.gold = Math.min(MAX_NUMBER, state.run.resources.gold + DIPLOMACY.incomeAmount);
  }
}

function accelerationGate(state) {
  if (state.meta.bestWave < ACCELERATION.bestWave) return '第9波を撃退すると解放条件の一つを満たします。';
  if (state.meta.upgrades.filter((id) => HELPER_UPGRADE_IDS.has(id)).length < ACCELERATION.automationCount) return '自動化・人員を合計3種類解放してください。';
  if (state.meta.generation < ACCELERATION.generation) return '第2世代以降に解放できます。';
  return '';
}

export function canPurchaseUpgrade(state, id) {
  const upgrade = LEGACY_UPGRADES.find((entry) => entry.id === id);
  if (!upgrade) return { ok: false, reason: 'その継承は存在しません。' };
  if (state.meta.upgrades.includes(id)) return { ok: false, reason: 'すでに解放済みです。' };
  if (id === 'action_queue' && state.meta.bestWave < 3 && state.meta.completedMilestones.length < 2) return { ok: false, reason: '初達成のクエストを2つ終えると解放できます。' };
  if (id === 'cycle_acceleration') {
    const reason = accelerationGate(state);
    if (reason) return { ok: false, reason };
  }
  if (state.meta.points < upgrade.cost) return { ok: false, reason: '継承ポイントが不足しています。初達成のクエストやボスの初撃破で獲得できます。' };
  return { ok: true, reason: '' };
}

export function purchaseUpgrade(state, id) {
  const allowed = canPurchaseUpgrade(state, id);
  if (!allowed.ok) return allowed;
  const upgrade = LEGACY_UPGRADES.find((entry) => entry.id === id);
  state.meta.points -= upgrade.cost;
  state.meta.upgrades.push(id);
  if (HELPER_UPGRADE_IDS.has(id)) state.run.helpers[id] = 0;
  addLog(state, `${upgrade.name}を解放した。次の世代にも受け継がれる。`, 'permanent');
  return { ok: true, reason: '' };
}

export function toggleUpgrade(state, id) {
  if (!UPGRADE_IDS.has(id) || !state.meta.upgrades.includes(id)) return { ok: false, reason: '先に解放してください。' };
  if (state.settings.disabledUpgrades.includes(id)) state.settings.disabledUpgrades = state.settings.disabledUpgrades.filter((entry) => entry !== id);
  else state.settings.disabledUpgrades.push(id);
  state.run.hp = Math.min(state.run.hp, getStats(state).maxHp);
  if (id === 'cycle_acceleration' && !upgradeEnabled(state, id)) stopAcceleration(state);
  return { ok: true, reason: '' };
}

function accelerationFrontier(state) {
  if (state.run.wave >= state.run.acceleration.limitWave) return 'この周回の開始時に撃退済みだった範囲へ到達しました。';
  const nextWave = state.run.wave + 1;
  if (nextWave % 3 === 0 && !state.meta.defeatedBosses.includes(nextWave)) return '初討伐のボスに備えるため、ここから等速で進みます。';
  return '';
}

export function getAccelerationStatus(state) {
  const acceleration = state.run.acceleration;
  const unlocked = state.meta.upgrades.includes('cycle_acceleration');
  let reason = '';
  if (!unlocked) reason = accelerationGate(state) || '継承ポイントで周回復帰を解放してください。';
  else if (!upgradeEnabled(state, 'cycle_acceleration')) reason = '周回復帰はOFFです。';
  else if (state.run.status === 'dead') reason = '次の世代で利用できます。';
  else if (state.run.augments.offer.length) reason = 'オーグメント選択中です。';
  else if (acceleration.remainingSeconds <= 0) reason = 'この周回の加速時間を使い切りました。';
  else reason = accelerationFrontier(state);
  if (!reason && state.run.status === 'combat') reason = '戦闘は等速で進み、加速時間は消費しません。';
  const eligible = !reason;
  return {
    available: !accelerationGate(state), unlocked,
    canPurchase: canPurchaseUpgrade(state, 'cycle_acceleration').ok,
    eligible, active: acceleration.active, remainingSeconds: acceleration.remainingSeconds,
    multiplier: acceleration.active && eligible && !state.settings.paused ? ACCELERATION.multiplier : 1,
    reason,
  };
}

export function startAcceleration(state) {
  const status = getAccelerationStatus(state);
  if (!status.eligible) return { ok: false, reason: status.reason };
  state.run.acceleration.active = true;
  state.settings.paused = false;
  state.settings.speed = 1;
  return { ok: true, reason: '' };
}

export function stopAcceleration(state) {
  state.run.acceleration.active = false;
  return { ok: true, reason: '' };
}

function enforceAccelerationBoundary(state) {
  if (!state.run.acceleration.active) return;
  if (!upgradeEnabled(state, 'cycle_acceleration') || state.run.status === 'dead' || state.run.augments.offer.length || state.run.acceleration.remainingSeconds <= 0 || accelerationFrontier(state)) stopAcceleration(state);
}

export function enqueueAction(state, id, count = 1) {
  if (!state.meta.upgrades.includes('action_queue')) return { ok: false, reason: '継承ポイントで行動予約を解放してください。' };
  if (state.run.status === 'dead') return { ok: false, reason: '次の世代で予約してください。' };
  if (!DEFINITIONS.has(id)) return { ok: false, reason: 'その作業は存在しません。' };
  if (!Number.isInteger(count) || count < 1 || count > 99) return { ok: false, reason: '実行回数は1〜99回で指定してください。' };
  if (state.run.queue.length >= 8) return { ok: false, reason: '予約は最大8件です。' };
  const d = DEFINITIONS.get(id);
  if (d.equipment || d.facility) {
    if (state.run.queue.some(q => q.id === id)) return {ok:false,reason:'既に予約しています。'};
    count = 1;
  }
  state.run.queue.push({ id, count });
  return { ok: true, reason: '' };
}

export function editQueuedAction(state, index, count) {
  if (!Number.isInteger(index) || !state.run.queue[index]) return { ok: false, reason: 'その予約は存在しません。' };
  if (!Number.isInteger(count) || count < 1 || count > 99) return { ok: false, reason: '実行回数は1〜99回で指定してください。' };
  const d = DEFINITIONS.get(state.run.queue[index].id);
  state.run.queue[index].count = d.equipment || d.facility ? 1 : count;
  return { ok: true, reason: '' };
}

export function moveQueuedAction(state, index, direction) {
  const next = index + direction;
  if (!Number.isInteger(index) || ![-1, 1].includes(direction) || !state.run.queue[index] || !state.run.queue[next]) return { ok: false, reason: '移動できません。' };
  // Detach the running reservation before changing its owner. Paid work is retained.
  if (index === 0 || next === 0) detachQueueAction(state);
  [state.run.queue[index], state.run.queue[next]] = [state.run.queue[next], state.run.queue[index]];
  return { ok: true, reason: '' };
}

function detachQueueAction(state) {
  // A paid craft remains as ordinary work, so deleting a queue entry wastes no ingredients.
  if (state.run.queueManaged && state.run.activeAction?.kind === 'gather') suspendAction(state);
  const id = state.run.queue[0]?.id;
  if (state.run.activeAction && state.run.activeAction.id === id) delete state.run.activeAction.queueCredit;
  if (state.run.suspendedActions[id]) delete state.run.suspendedActions[id].queueCredit;
  state.run.queueManaged = false;
}

function pauseAfterQueueRemoval(state, hadWork) {
  const hasFollowup = state.run.queue.length > 0 && state.meta.upgrades.includes('action_queue') && !state.settings.disabledUpgrades.includes('action_queue');
  if (hadWork && !state.run.activeAction && !hasFollowup && state.run.status === 'preparing') state.settings.paused = true;
}

export function removeQueuedAction(state, index) {
  if (!Number.isInteger(index) || index < 0 || index >= state.run.queue.length) return { ok: false, reason: 'その予約は存在しません。' };
  const hadWork = Boolean(state.run.activeAction);
  if (index === 0) detachQueueAction(state);
  state.run.queue.splice(index, 1);
  pauseAfterQueueRemoval(state, hadWork);
  return { ok: true, reason: '' };
}

export function clearQueue(state) {
  const hadWork = Boolean(state.run.activeAction);
  detachQueueAction(state);
  state.run.queue = [];
  pauseAfterQueueRemoval(state, hadWork);
  return { ok: true, reason: '' };
}

export function getQueueStatus(state) {
  if (!state.meta.upgrades.includes('action_queue')) return { active: false, reason: '行動予約は未解放です。' };
  if (state.run.status === 'dead') return { active: false, reason: '次の世代で予約してください。' };
  if (state.run.queue.length === 0) return { active: false, reason: '予約はありません。' };
  if (state.settings.disabledUpgrades.includes('action_queue')) return { active: false, reason: '行動予約を保留中。ONで再開します。' };
  if (state.settings.paused) return { active: false, reason: '一時停止中です。' };
  if (state.run.status === 'combat') return { active: false, reason: '襲撃中は予約を停止します。' };
  if (state.run.queueManaged && state.run.activeAction) return { active: true, reason: '予約した作業を実行中です。' };
  if (state.run.activeAction?.kind === 'craft') return { active: false, reason: '現在の製作が終わるまで待機します。' };
  const allowed = canStartAction(state, state.run.queue[0].id, true);
  return allowed.ok ? { active: true, reason: '次の予約を開始します。' } : { active: false, reason: allowed.reason };
}

export function canStartAction(state, id, ignoreActive = false) {
  const definition = DEFINITIONS.get(id);
  if (!definition) return { ok: false, reason: 'その作業は存在しません。' };
  if (definition.facility && !getUnlocks(state).facilities) return { ok: false, reason: '村の施設は第1波を撃退すると解放されます。' };
  if (state.run.status === 'dead') return { ok: false, reason: '次の世代で、もう一度。' };
  if (state.run.status === 'combat') return { ok: false, reason: '襲撃中は作業を変更できません。' };
  if (!ignoreActive && state.run.activeAction?.id === id) return { ok: false, reason: 'この作業を実行中です。' };
  if (!state.run.suspendedActions[id] && level(state, definition.skill) < (definition.unlockLevel || 1)) {
    return { ok: false, reason: `${SKILLS.find((skill) => skill.id === definition.skill).name}の進行レベル${definition.unlockLevel}で解放。` };
  }
  if (definition.facility && state.run.facilities[definition.facility.id]) return { ok: false, reason: 'この施設は建設済みです。' };
  if (definition.equipment) {
    const current = state.run.equipment[definition.equipment.slot];
    if (current && (current.attack || current.defense || current.speed || 0) >= (definition.equipment.attack || definition.equipment.defense || definition.equipment.speed || 0)) {
      return { ok: false, reason: '同等以上の装備を装着済みです。' };
    }
  }
  if (state.run.suspendedActions[id]) return { ok: true, reason: '' };
  for (const [resource, amount] of Object.entries(getRecipeCost(state, definition))) {
    if (state.run.resources[resource] < amount) return { ok: false, reason: `${RESOURCES[resource].name}が${amount - state.run.resources[resource]}不足。` };
  }
  return { ok: true, reason: '' };
}

export function startAction(state, id) {
  const allowed = canStartAction(state, id);
  if (!allowed.ok) return allowed;
  if (state.run.queue.length > 0 && !state.settings.disabledUpgrades.includes('action_queue')) state.settings.disabledUpgrades.push('action_queue');
  state.run.queueManaged = false;
  beginAction(state, id);
  return { ok: true, reason: '' };
}

function beginAction(state, id) {
  if (state.run.activeAction?.id === id) return;
  suspendAction(state);
  const suspended = state.run.suspendedActions[id];
  if (suspended) {
    state.run.activeAction = suspended;
    delete state.run.suspendedActions[id];
    return;
  }
  const definition = DEFINITIONS.get(id);
  // Pay only for a new batch. Suspended crafting has already paid its ingredients.
  for (const [resource, amount] of Object.entries(getRecipeCost(state, definition))) state.run.resources[resource] -= amount;
  state.run.activeAction = { id, kind: RECIPE_IDS.has(id) ? 'craft' : 'gather', progress: 0, duration: getActionDuration(state, definition) };
}

function suspendAction(state) {
  const active = state.run.activeAction;
  if (!active) return;
  state.run.suspendedActions[active.id] = active;
  state.run.activeAction = null;
}

export function stopAction(state) {
  if (state.run.status !== 'preparing') return;
  if (state.run.queue.length > 0 && !state.settings.disabledUpgrades.includes('action_queue')) state.settings.disabledUpgrades.push('action_queue');
  state.run.queueManaged = false;
  suspendAction(state);
}

function addLog(state, text, type = 'info') {
  state.run.logSeq += 1;
  state.run.log.unshift({ id: state.run.logSeq, time: state.run.elapsed, text, type });
  state.run.log.length = Math.min(state.run.log.length, MAX_LOG);
}

function gainXp(state, skill, runAmount = 10, permanentAmount = 2) {
  const oldRunLevel = level(state, skill);
  const oldPermanentLevel = level(state, skill, true);
  const oldHp = getStats(state).maxHp;
  state.run.skills[skill].xp = Math.min(MAX_NUMBER, rounded(state.run.skills[skill].xp + runAmount * (1 + (oldPermanentLevel - 1) * 0.08)));
  state.meta.skills[skill].xp = Math.min(MAX_NUMBER, rounded(state.meta.skills[skill].xp + permanentAmount));
  state.run.hp += getStats(state).maxHp - oldHp;
  const skillName = SKILLS.find(({ id }) => id === skill).name;
  if (level(state, skill) > oldRunLevel) {
    const effects = getSkillEffects(state, skill);
    const battleBonus = skill === 'combat' ? `・攻撃+${effects.runAttack}・最大HP+${effects.runMaxHp}` : '';
    addLog(state, `${skillName}Lv.${effects.runLevel}：この周回の作業速度+${effects.runSpeedPercent}%${battleBonus}。`, 'level');
  }
  if (level(state, skill, true) > oldPermanentLevel) addLog(state, `${skillName}の永続レベルが${level(state, skill, true)}になった。次の世代にも残る。`, 'permanent');
}

function finishAction(state) {
  const active = state.run.activeAction;
  const definition = DEFINITIONS.get(active.id);
  if (active.id === 'chop_wood' && hasAugment(state, 'timber_contract')) state.run.resources.gold = Math.min(MAX_NUMBER, state.run.resources.gold + 1);
  for (const [resource, amount] of Object.entries(definition.yields || {})) state.run.resources[resource] = Math.min(MAX_NUMBER, state.run.resources[resource] + amount);
  if (definition.equipment) {
    state.run.equipment[definition.equipment.slot] = { id: definition.id, ...definition.equipment };
    addLog(state, `${definition.name}を装備した。`, 'craft');
  } else if (definition.facility) {
    state.run.facilities[definition.facility.id] = true;
    if (definition.facility.id === 'watchtower') state.run.nextWaveAt = rounded(state.run.nextWaveAt + 15);
    if (definition.facility.id === 'infirmary') state.run.healTimer = 0;
    addLog(state, `${definition.name}が完成した。${definition.description}`, 'craft');
  } else if (active.kind === 'craft') addLog(state, `${definition.name}が完成した。`, 'craft');
  awardMilestone(state, definition.id);
  gainXp(state, definition.skill);
  if (active.kind === 'craft') state.run.activeAction = null;
  else {
    active.progress = 0;
    active.duration = getActionDuration(state, definition);
  }
  if (active.queueCredit && state.run.queue[0]?.id === active.id) {
    const managed = state.run.queueManaged;
    state.run.queue[0].count -= 1;
    if (state.run.queue[0].count <= 0) {
      state.run.queue.shift();
      delete active.queueCredit;
      if (managed) state.run.activeAction = null;
      if (state.run.queue.length === 0) addLog(state, '予約した作業がすべて完了した。', 'info');
    }
    state.run.queueManaged = managed && state.run.activeAction !== null;
  }
}

function advanceQueue(state) {
  if (!state.meta.upgrades.includes('action_queue') || state.settings.disabledUpgrades.includes('action_queue') || state.run.queue.length === 0) return;
  if (state.run.queueManaged && state.run.activeAction) return;
  if (state.run.activeAction?.kind === 'craft') return;
  // Keep interrupted gathering progress, and let a paid preexisting craft finish.
  const next = state.run.queue[0];
  if (state.run.activeAction?.id !== next.id) suspendAction(state);
  if (!canStartAction(state, next.id, true).ok) return;
  beginAction(state, next.id);
  state.run.activeAction.queueCredit = true;
  state.run.queueManaged = true;
}

function queuedResourceCosts(state) {
  const reserved = {};
  const countedSuspensions = new Set();
  if (state.settings.disabledUpgrades.includes('action_queue')) return reserved;
  for (const [index, entry] of state.run.queue.entries()) {
    const definition = DEFINITIONS.get(entry.id);
    // The active queued batch is already paid; only reserve its remaining repetitions.
    const activePaid = index === 0 && state.run.activeAction?.kind === 'craft' && state.run.activeAction.queueCredit;
    const suspendedPaid = !countedSuspensions.has(entry.id) && state.run.suspendedActions[entry.id]?.kind === 'craft';
    const paidBatch = activePaid || suspendedPaid ? 1 : 0;
    if (suspendedPaid) countedSuspensions.add(entry.id);
    for (const [id, quantity] of Object.entries(getRecipeCost(state, definition))) reserved[id] = (reserved[id] || 0) + quantity * (entry.count - paidBatch);
  }
  return reserved;
}

// Hired workers gather resources without awarding the player's skill XP.
// Automated cooking is a real paid recipe and awards normal crafting XP.
// All helpers stop during raids, death and pause. Disabling preserves paid work.
function advanceHelpers(state) {
  const enabled = (id) => state.meta.upgrades.includes(id) && !state.settings.disabledUpgrades.includes(id);
  for (const [id, worker] of Object.entries(WORKERS)) {
    if (!enabled(id)) continue;
    state.run.helpers[id] = rounded(state.run.helpers[id] + STEP);
    if (state.run.helpers[id] + 1e-8 >= worker.duration) {
      state.run.helpers[id] = rounded(state.run.helpers[id] - worker.duration);
      state.run.resources[worker.resource] = Math.min(MAX_NUMBER, state.run.resources[worker.resource] + 1);
    }
  }
  if (!enabled('auto_cook')) return;
  const recipe = DEFINITIONS.get('cook_meal');
  if (!state.run.autoCraft) {
    const reserved = queuedResourceCosts(state);
    if (Object.entries(recipe.cost).some(([id, quantity]) => state.run.resources[id] - (reserved[id] || 0) < quantity)) return;
    for (const [id, quantity] of Object.entries(recipe.cost)) state.run.resources[id] -= quantity;
    state.run.autoCraft = { id: recipe.id, duration: getActionDuration(state, recipe) };
    state.run.helpers.auto_cook = 0;
  }
  state.run.helpers.auto_cook = rounded(state.run.helpers.auto_cook + STEP);
  if (state.run.helpers.auto_cook + 1e-8 >= state.run.autoCraft.duration) {
    state.run.resources.food = Math.min(MAX_NUMBER, state.run.resources.food + recipe.yields.food);
    state.run.helpers.auto_cook = 0;
    state.run.autoCraft = null;
    gainXp(state, 'smithing');
    awardMilestone(state, recipe.id);
    addLog(state, '自動調理：薬草のスープが完成した。', 'craft');
  }
}

function advanceHealing(state) {
  state.run.healTimer = rounded(state.run.healTimer + STEP);
  if (state.run.healTimer + 1e-8 >= 4) {
    state.run.healTimer = rounded(state.run.healTimer - 4);
    state.run.hp = rounded(Math.min(getStats(state).maxHp, state.run.hp + 2));
  }
}

function advanceAugmentIncome(state, facilityCount) {
  if (state.run.status === 'dead' || !hasAugment(state, 'investment') || facilityCount === 0) return;
  const augments = state.run.augments;
  augments.investmentTimer = rounded(augments.investmentTimer + STEP);
  if (augments.investmentTimer + 1e-8 >= 10) {
    augments.investmentTimer = rounded(augments.investmentTimer - 10);
    state.run.resources.gold = Math.min(MAX_NUMBER, state.run.resources.gold + facilityCount);
  }
}

function beginRaid(state) {
  const next = getNextEnemy(state);
  state.run.status = 'combat';
  state.run.enemy = { name: next.name, hp: next.hp, maxHp: next.hp, attack: next.attack, defense: next.defense, wave: next.wave, isBoss: next.isBoss, invasion: next.invasion };
  state.run.combatTimer = 0;
  addLog(state, `第${next.wave}波：${next.name}が襲ってきた。`, 'raid');
}

function eatFood(state) {
  const maxHp = getStats(state).maxHp;
  if (state.run.hp > 0 && state.run.hp <= maxHp * 0.55 && state.run.resources.food > 0) {
    state.run.resources.food -= 1;
    const healing = getFoodHealing(state);
    state.run.hp = Math.min(maxHp, state.run.hp + healing);
    addLog(state, `食料を1つ使い、体力を${healing}回復した。`, 'heal');
  }
}

function die(state) {
  state.run.hp = 0;
  state.run.status = 'dead';
  state.run.activeAction = null;
  state.run.suspendedActions = {};
  state.run.queue = [];
  state.run.queueManaged = false;
  state.run.enemy = null;
  state.run.simRemainder = 0;
  state.settings.paused = true;
  addLog(state, '力尽きた。得た経験は、次の世代の力になる。', 'death');
  state.meta.history.unshift({
    generation: state.meta.generation, wave: state.run.wave, elapsed: state.run.elapsed,
    skillGains: Object.fromEntries(SKILL_IDS.map((id) => [id, rounded(state.meta.skills[id].xp - state.run.startPermanentXp[id])])),
  });
  state.meta.history.length = Math.min(state.meta.history.length, 20);
}

function combatRound(state) {
  eatFood(state);
  const stats = getStats(state);
  const enemy = state.run.enemy;
  enemy.hp = rounded(Math.max(0, enemy.hp - Math.max(1, stats.attack - enemy.defense)));
  gainXp(state, 'combat', 2, 0.8);
  // The player's decisive blow ends the fight before the enemy can retaliate.
  if (enemy.hp <= 0) {
    state.run.wave += 1;
    const previousBest = state.meta.bestWave;
    state.meta.bestWave = Math.max(state.meta.bestWave, state.run.wave);
    if (previousBest < 1) addLog(state, '村の施設が解放された。製作から防護柵・見張り台・救護所を建設できる。', 'info');
    unlockDiplomacy(state);
    if (enemy.isBoss && !state.meta.defeatedBosses.includes(enemy.wave)) {
      state.meta.defeatedBosses.push(enemy.wave);
      state.meta.points += 1;
      addLog(state, `${enemy.name}を初めて撃破。継承ポイント +1。`, 'permanent');
    }
    if (enemy.invasion && state.run.diplomacy.status === 'hostile') {
      state.run.diplomacy.status = 'defeated';
      state.run.resources.gold = Math.min(MAX_NUMBER, state.run.resources.gold + 10);
      addLog(state, 'サフラ軍を撃退。金貨10を獲得し、この周回の攻撃力が3上がった。', 'victory');
    }
    state.run.resources.hide = Math.min(MAX_NUMBER, state.run.resources.hide + 2);
    state.run.status = 'preparing';
    state.run.nextWaveAt = rounded(state.run.elapsed + getRaidInterval(state));
    state.run.enemy = null;
    state.run.combatTimer = 0;
    gainXp(state, 'combat', 10, 4);
    if (hasAugment(state, 'bounty')) state.run.resources.gold = Math.min(MAX_NUMBER, state.run.resources.gold + 4);
    if (hasAugment(state, 'momentum')) state.run.hp = Math.min(getStats(state).maxHp, state.run.hp + 8);
    addLog(state, `第${state.run.wave}波を撃退。獣皮を2つ手に入れた。次の襲撃まで${getRaidInterval(state)}秒。`, 'victory');
    if (state.run.wave === 3) offerAugments(state, 'boss3');
    else introduceAugments(state);
    return;
  }
  const beforeHit = state.run.hp;
  const damage = Math.max(1, enemy.attack - getStats(state).defense);
  state.run.hp = rounded(state.run.hp - damage);
  if (state.run.hp <= 0) state.run.deathReport = { enemy: enemy.name, wave: enemy.wave, beforeHit, damage, food: state.run.resources.food, maxHp: getStats(state).maxHp };
  if (state.run.hp <= 0) die(state);
  else eatFood(state);
}

/** Advance at most 60 game seconds. Offline time is never simulated. */
export function tick(state, dt) {
  if (!Number.isFinite(dt) || dt <= 0) return;
  introduceAugments(state);
  if (state.run.augments.offer.length) return;
  if (state.settings.paused || state.run.status === 'dead' || !Number.isFinite(dt) || dt <= 0) return;
  const accumulated = rounded(state.run.simRemainder + Math.min(dt, 60));
  const steps = Math.floor((accumulated + 1e-9) / STEP);
  state.run.simRemainder = rounded(accumulated - steps * STEP);
  for (let i = 0; i < steps && state.run.status !== 'dead' && state.run.augments.offer.length === 0; i += 1) {
    const facilityCount = Object.keys(state.run.facilities).length;
    state.run.elapsed = rounded(state.run.elapsed + STEP);
    if (state.run.status === 'preparing' && state.run.diplomacy.status === 'pending' && state.run.elapsed >= state.run.diplomacy.deadline) turnHostile(state, true);
    if (state.run.status === 'preparing' && state.run.elapsed + 1e-8 >= state.run.nextWaveAt) beginRaid(state);
    if (state.run.status === 'combat') {
      state.run.combatTimer = rounded(state.run.combatTimer + STEP);
      if (state.run.combatTimer + 1e-8 >= 1.5) {
        state.run.combatTimer = rounded(state.run.combatTimer - 1.5);
        combatRound(state);
      }
    } else {
      const hadInfirmary = state.run.facilities.infirmary === true;
      advanceQueue(state);
      const queuePaused = state.run.queueManaged && state.settings.disabledUpgrades.includes('action_queue');
      if (state.run.activeAction && !queuePaused) {
        state.run.activeAction.progress = rounded(state.run.activeAction.progress + STEP);
        if (state.run.activeAction.progress + 1e-8 >= state.run.activeAction.duration) finishAction(state);
      }
      advanceHelpers(state);
      if (hadInfirmary) advanceHealing(state);
    }
    if (state.run.augments.offer.length === 0) {
      advanceDiplomacyIncome(state);
      advanceAugmentIncome(state, facilityCount);
    }
    enforceAccelerationBoundary(state);
  }
}

/** Spend real time on preparation acceleration; battles always use real time. */
export function advanceTime(state, realSeconds) {
  if (!Number.isFinite(realSeconds) || realSeconds <= 0) return;
  let remaining = Math.min(realSeconds, 60);
  while (remaining > 1e-8 && !state.settings.paused && state.run.status !== 'dead') {
    enforceAccelerationBoundary(state);
    const accelerated = getAccelerationStatus(state).multiplier === ACCELERATION.multiplier;
    const slice = Math.min(remaining, STEP / ACCELERATION.multiplier, accelerated ? state.run.acceleration.remainingSeconds : remaining);
    const hadWork = Boolean(state.run.activeAction);
    if (accelerated) state.run.acceleration.remainingSeconds = rounded(Math.max(0, state.run.acceleration.remainingSeconds - slice));
    tick(state, slice * (accelerated ? ACCELERATION.multiplier : 1));
    // The real-time driver waits for the next decision after a finite task.
    // An explicit resume with no work can still advance the clock.
    const hasFollowup = state.run.queue.length > 0 && state.meta.upgrades.includes('action_queue') && !state.settings.disabledUpgrades.includes('action_queue');
    if (hadWork && !state.run.activeAction && !hasFollowup && state.run.status === 'preparing') state.settings.paused = true;
    enforceAccelerationBoundary(state);
    remaining = rounded(remaining - slice);
  }
}

/** Restarts only a completed life, preserving meta exactly and pausing the new life. */
export function restartRun(state) {
  if (state.run.status !== 'dead') return state;
  state.meta.generation += 1;
  state.run = newRun(state.meta);
  state.run.hp = getStats(state).maxHp;
  state.settings.paused = true;
  addLog(state, `第${state.meta.generation}世代。継承した経験とともに、新たな夜明けを目指す。`, 'info');
  introduceAugments(state);
  return state;
}

export function serializeGame(state) {
  return JSON.stringify(state);
}

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const isNumber = (value, min = 0, max = MAX_NUMBER) => typeof value === 'number' && Number.isFinite(value) && value >= min && value <= max;
const isInteger = (value, min = 0, max = MAX_NUMBER) => isNumber(value, min, max) && Number.isInteger(value);
const requireValid = (condition) => { if (!condition) throw new Error('Invalid save'); };

/** Strict bounded parsing; never evaluates input or trusts saved equipment/combat statistics. */
export function parseSave(text) {
  try {
    requireValid(typeof text === 'string' && text.length > 0 && text.length <= 100_000);
    const input = JSON.parse(text);
    requireValid(isObject(input) && input.version === 1 && isObject(input.meta) && isObject(input.run) && isObject(input.settings));
    const state = createGame();
    const { meta, run, settings } = input;
    requireValid(isInteger(meta.generation, 1, 1_000_000) && isInteger(meta.bestWave, 0, 10_000));
    requireValid(typeof settings.paused === 'boolean' && [1, 2, 5].includes(settings.speed));
    requireValid(isObject(meta.skills) && isObject(run.skills) && isObject(run.startPermanentXp));
    for (const id of SKILL_IDS) {
      requireValid(isObject(meta.skills[id]) && isNumber(meta.skills[id].xp));
      requireValid(isObject(run.skills[id]) && isNumber(run.skills[id].xp));
      requireValid(isNumber(run.startPermanentXp[id], 0, meta.skills[id].xp));
      state.meta.skills[id].xp = meta.skills[id].xp;
      state.run.skills[id].xp = run.skills[id].xp;
      state.run.startPermanentXp[id] = run.startPermanentXp[id];
    }
    state.meta.generation = meta.generation;
    state.meta.bestWave = meta.bestWave;
    const points = Object.hasOwn(meta, 'points') ? meta.points : 0;
    const defeatedBosses = Object.hasOwn(meta, 'defeatedBosses') ? meta.defeatedBosses : [];
    const upgrades = Object.hasOwn(meta, 'upgrades') ? meta.upgrades : [];
    const completedMilestones = Object.hasOwn(meta, 'completedMilestones') ? meta.completedMilestones : [];
    const disabledUpgrades = Object.hasOwn(settings, 'disabledUpgrades') ? settings.disabledUpgrades : [];
    requireValid(isInteger(points, 0, 3333 + MILESTONES.length));
    requireValid(Array.isArray(completedMilestones) && completedMilestones.length <= MILESTONES.length && new Set(completedMilestones).size === completedMilestones.length && completedMilestones.every(id => MILESTONES.some(entry => entry.id === id)));
    requireValid(Array.isArray(defeatedBosses) && defeatedBosses.length <= 3333 && new Set(defeatedBosses).size === defeatedBosses.length && defeatedBosses.every((wave) => isInteger(wave, 3, meta.bestWave) && wave % 3 === 0));
    requireValid(Array.isArray(upgrades) && upgrades.length <= LEGACY_UPGRADES.length && new Set(upgrades).size === upgrades.length && upgrades.every((id) => UPGRADE_IDS.has(id)));
    requireValid(points + upgrades.reduce((sum, id) => sum + LEGACY_UPGRADES.find(upgrade => upgrade.id === id).cost, 0) === defeatedBosses.length + completedMilestones.reduce((sum, id) => sum + MILESTONES.find(entry => entry.id === id).reward, 0));
    requireValid(Array.isArray(disabledUpgrades) && disabledUpgrades.length <= upgrades.length && new Set(disabledUpgrades).size === disabledUpgrades.length && disabledUpgrades.every((id) => upgrades.includes(id)));
    Object.assign(state.meta, { points, defeatedBosses: [...defeatedBosses], upgrades: [...upgrades], completedMilestones: [...completedMilestones] });
    requireValid(!Object.hasOwn(settings, 'showEquippedRecipes') || typeof settings.showEquippedRecipes === 'boolean');
    const showHiddenRecipes = Object.hasOwn(settings, 'showHiddenRecipes') ? settings.showHiddenRecipes : (settings.showEquippedRecipes ?? false);
    const hiddenRecipes = Object.hasOwn(settings, 'hiddenRecipes') ? settings.hiddenRecipes : [];
    const soundVolume = settings.soundVolume ?? 0.3;
    const musicVolume = settings.musicVolume ?? (soundVolume === 0 ? 0 : .15);
    requireValid(isNumber(musicVolume, 0, 1));
    const effectsEnabled = settings.effectsEnabled ?? true;
    const pauseWhenHidden = settings.pauseWhenHidden ?? false;
    requireValid(typeof pauseWhenHidden === "boolean");
    requireValid(isNumber(soundVolume, 0, 1) && typeof effectsEnabled === 'boolean');
    requireValid(typeof showHiddenRecipes === 'boolean');
    requireValid(Array.isArray(hiddenRecipes) && hiddenRecipes.length <= HIDEABLE_RECIPE_IDS.size && new Set(hiddenRecipes).size === hiddenRecipes.length && hiddenRecipes.every(id => HIDEABLE_RECIPE_IDS.has(id)));
    state.settings = { paused: settings.paused, speed: 1, disabledUpgrades: [...disabledUpgrades], showHiddenRecipes, hiddenRecipes: [...hiddenRecipes], soundVolume, musicVolume, effectsEnabled, pauseWhenHidden };
    requireValid(!upgrades.includes('cycle_acceleration') || !accelerationGate(state));
    requireValid(['preparing', 'combat', 'dead'].includes(run.status));
    requireValid(isNumber(run.elapsed) && isInteger(run.wave, 0, meta.bestWave) && isNumber(run.nextWaveAt, 60));
    const raidTimingVersion = Object.hasOwn(run, 'raidTimingVersion') ? run.raidTimingVersion : 1;
    requireValid(raidTimingVersion === 1 || raidTimingVersion === RAID_TIMING_VERSION);
    requireValid(isNumber(run.combatTimer, 0, 1.5) && isNumber(run.simRemainder, 0, STEP) && isInteger(run.logSeq));
    Object.assign(state.run, { status: run.status, elapsed: run.elapsed, wave: run.wave, nextWaveAt: run.nextWaveAt, combatTimer: run.combatTimer, simRemainder: run.simRemainder, logSeq: run.logSeq });
    const acceleration = Object.hasOwn(run, 'acceleration') ? run.acceleration : freshAcceleration(state.meta);
    requireValid(isObject(acceleration) && typeof acceleration.active === 'boolean' && isNumber(acceleration.remainingSeconds, 0, ACCELERATION.duration) && isInteger(acceleration.limitWave, 0, meta.bestWave));
    requireValid(!acceleration.active || upgrades.includes('cycle_acceleration'));
    state.run.acceleration = { active: acceleration.active, remainingSeconds: acceleration.remainingSeconds, limitWave: acceleration.limitWave };
    if (raidTimingVersion < RAID_TIMING_VERSION && run.status === 'preparing') state.run.nextWaveAt = rounded(state.run.nextWaveAt + (run.wave === 0 ? FIRST_RAID_DELAY - 60 : BASE_RAID_INTERVAL - 55));
    state.run.raidTimingVersion = RAID_TIMING_VERSION;
    requireValid(isNumber(state.run.nextWaveAt, run.status === 'preparing' ? FIRST_RAID_DELAY : 60));
    const facilities = Object.hasOwn(run, 'facilities') ? run.facilities : {};
    const healTimer = Object.hasOwn(run, 'healTimer') ? run.healTimer : 0;
    requireValid(isObject(facilities) && Object.keys(facilities).length <= Object.keys(FACILITIES).length);
    for (const [id, built] of Object.entries(facilities)) {
      requireValid(Object.hasOwn(FACILITIES, id) && built === true);
      state.run.facilities[id] = true;
    }
    requireValid(isNumber(healTimer, 0, 4) && healTimer < 4 && (facilities.infirmary === true || healTimer === 0));
    state.run.healTimer = healTimer;
    const diplomacy = Object.hasOwn(run, 'diplomacy') ? run.diplomacy : freshDiplomacy(run.elapsed, meta.bestWave >= 3);
    requireValid(isObject(diplomacy) && ['locked', 'pending', 'allied', 'hostile', 'defeated'].includes(diplomacy.status) && isNumber(diplomacy.deadline, DIPLOMACY.deadline, rounded(run.elapsed + DIPLOMACY.deadline)));
    requireValid(typeof diplomacy.mercenary === 'boolean' && isNumber(diplomacy.incomeTimer, 0, DIPLOMACY.incomeInterval) && diplomacy.incomeTimer < DIPLOMACY.incomeInterval);
    requireValid(isInteger(diplomacy.incomeTotal, 0, Math.floor(run.elapsed / DIPLOMACY.incomeInterval)));
    requireValid(diplomacy.status === 'allied' || (diplomacy.incomeTimer === 0 && diplomacy.incomeTotal === 0));
    requireValid(diplomacy.status !== 'defeated' || run.wave > 0);
    state.run.diplomacy = { status: diplomacy.status, deadline: diplomacy.deadline, incomeTimer: diplomacy.incomeTimer, incomeTotal: diplomacy.incomeTotal, mercenary: diplomacy.mercenary };
    // Keep already-resolved old diplomacy, while withdrawing an unaccepted early quest.
    if (diplomacy.status === 'pending' && meta.bestWave < 3) state.run.diplomacy.status = 'locked';
    if (diplomacy.status === 'locked' && meta.bestWave >= 3) state.run.diplomacy = freshDiplomacy(run.elapsed, true);
    const augments = Object.hasOwn(run, 'augments') ? run.augments : freshAugments(state.meta);
    requireValid(isObject(augments) && isInteger(augments.seed, 0, 0xffffffff));
    requireValid(Array.isArray(augments.selected) && augments.selected.length <= 2 && new Set(augments.selected).size === augments.selected.length);
    requireValid(Array.isArray(augments.offer) && [0, 3].includes(augments.offer.length) && new Set(augments.offer).size === augments.offer.length);
    for (const id of [...augments.selected, ...augments.offer]) {
      const entry = AUGMENT_BY_ID.get(id);
      requireValid(entry && (!entry.pack || upgrades.includes(entry.pack)));
    }
    requireValid(augments.offer.every((id) => !augments.selected.includes(id)));
    requireValid(Array.isArray(augments.offeredStages) && augments.offeredStages.length <= 2 && new Set(augments.offeredStages).size === augments.offeredStages.length && augments.offeredStages.every((stage) => ['start', 'boss3'].includes(stage)));
    requireValid(augments.offeredStages.length === augments.selected.length + (augments.offer.length > 0 ? 1 : 0));
    requireValid(!augments.offeredStages.includes('boss3') || run.wave >= 3);
    requireValid(augments.offeredStages.length === 0 || meta.bestWave >= 3);
    requireValid(augments.offer.length === 0 || run.status === 'preparing');
    requireValid(isNumber(augments.investmentTimer, 0, 10) && augments.investmentTimer < 10 && (augments.selected.includes('investment') || augments.investmentTimer === 0));
    state.run.augments = { seed: augments.seed, offer: [...augments.offer], selected: [...augments.selected], offeredStages: [...augments.offeredStages], investmentTimer: augments.investmentTimer };
    const helperIds = upgrades.filter((id) => HELPER_UPGRADE_IDS.has(id));
    const helpers = Object.hasOwn(run, 'helpers') ? run.helpers : Object.fromEntries(helperIds.map((id) => [id, 0]));
    const autoCraft = Object.hasOwn(run, 'autoCraft') ? run.autoCraft : null;
    requireValid(isObject(helpers) && Object.keys(helpers).length === helperIds.length && Object.keys(helpers).every((id) => helperIds.includes(id)));
    if (autoCraft !== null) {
      requireValid(upgrades.includes('auto_cook') && isObject(autoCraft) && autoCraft.id === 'cook_meal' && isNumber(autoCraft.duration, 0.25, 6));
      state.run.autoCraft = { id: 'cook_meal', duration: autoCraft.duration };
    }
    for (const id of helperIds) {
      const maximum = id === 'auto_cook' ? (autoCraft?.duration || 0) : (WORKERS[id]?.duration || 0);
      requireValid(isNumber(helpers[id], 0, maximum));
      state.run.helpers[id] = helpers[id];
    }
    requireValid(isObject(run.resources) && isObject(run.equipment));
    for (const id of RESOURCE_IDS) {
      const quantity = id === 'gold' && !Object.hasOwn(run.resources, id) ? 0 : run.resources[id];
      requireValid(isInteger(quantity));
      state.run.resources[id] = quantity;
    }
    requireValid(Object.keys(run.equipment).length <= 4);
    for (const [slot, saved] of Object.entries(run.equipment)) {
      requireValid(isObject(saved));
      const recipe = DEFINITIONS.get(saved.id);
      requireValid(recipe?.equipment?.slot === slot);
      state.run.equipment[slot] = { id: recipe.id, ...recipe.equipment };
    }
    requireValid(isNumber(run.hp, 0, getStats(state).maxHp));
    state.run.hp = run.hp;
    requireValid(run.status === 'dead' ? run.hp === 0 && settings.paused : run.hp > 0);
    const readAction = (active) => {
      requireValid(isObject(active));
      const definition = DEFINITIONS.get(active.id);
      requireValid(definition && active.kind === (RECIPE_IDS.has(active.id) ? 'craft' : 'gather'));
      requireValid(isNumber(active.duration, 0.25, definition.duration) && isNumber(active.progress, 0, active.duration));
      requireValid(active.progress < active.duration && (!Object.hasOwn(active, 'queueCredit') || active.queueCredit === true));
      requireValid(run.status !== 'dead');
      return { id: active.id, kind: active.kind, duration: active.duration, progress: active.progress, ...(active.queueCredit ? { queueCredit: true } : {}) };
    };
    if (run.activeAction !== null) state.run.activeAction = readAction(run.activeAction);
    const suspendedActions = Object.hasOwn(run, 'suspendedActions') ? run.suspendedActions : {};
    requireValid(isObject(suspendedActions) && Object.keys(suspendedActions).length <= DEFINITIONS.size);
    for (const [id, saved] of Object.entries(suspendedActions)) {
      requireValid(DEFINITIONS.has(id) && saved?.id === id && state.run.activeAction?.id !== id);
      state.run.suspendedActions[id] = readAction(saved);
    }
    const queue = Object.hasOwn(run, 'queue') ? run.queue : [];
    const queueManaged = Object.hasOwn(run, 'queueManaged') ? run.queueManaged : false;
    requireValid(Array.isArray(queue) && queue.length <= 8 && typeof queueManaged === 'boolean');
    requireValid(queue.length === 0 || (upgrades.includes('action_queue') && run.status !== 'dead'));
    state.run.queue = queue.map((entry) => {
      requireValid(isObject(entry) && DEFINITIONS.has(entry.id) && isInteger(entry.count, 1, 99));
      return { id: entry.id, count: entry.count };
    });
    requireValid(!queueManaged || (queue.length > 0 && state.run.activeAction?.id === queue[0].id));
    state.run.queueManaged = queueManaged;
    // Older queued work did not carry its reservation ownership on the action.
    if (queueManaged) state.run.activeAction.queueCredit = true;
    for (const action of [state.run.activeAction, ...Object.values(state.run.suspendedActions)]) {
      requireValid(!action?.queueCredit || queue[0]?.id === action.id);
    }
    if (run.status === 'combat') {
      const enemy = run.enemy;
      const expected = getNextEnemy(state);
      requireValid(isObject(enemy));
      const oldNames = ['飢えた狼', '荒野の略奪者', '牙の群れ', '黒鉄の追跡者', '霧の巨獣'];
      const oldName = oldNames[Math.min(expected.wave - 1, oldNames.length - 1)] + (expected.wave > 5 ? `・第${expected.wave}波` : '');
      const legacyEnemy = !Object.hasOwn(enemy, 'wave') && !Object.hasOwn(enemy, 'isBoss');
      requireValid((enemy.name === expected.name || (legacyEnemy && enemy.name === oldName)) && enemy.maxHp === expected.hp && enemy.attack === expected.attack && enemy.defense === expected.defense && isNumber(enemy.hp, Number.MIN_VALUE, expected.hp));
      requireValid((!Object.hasOwn(enemy, 'wave') || enemy.wave === expected.wave) && (!Object.hasOwn(enemy, 'isBoss') || enemy.isBoss === expected.isBoss));
      const invasion = Object.hasOwn(enemy, 'invasion') ? enemy.invasion : false;
      requireValid(typeof invasion === 'boolean' && invasion === expected.invasion);
      state.run.enemy = { name: expected.name, hp: enemy.hp, maxHp: enemy.maxHp, attack: enemy.attack, defense: enemy.defense, wave: expected.wave, isBoss: expected.isBoss, invasion };
    } else requireValid(run.enemy === null);
    const report = run.deathReport ?? null;
    if (report !== null) {
      requireValid(run.status === 'dead' && isObject(report) && typeof report.enemy === 'string' && report.enemy.length <= 100 && isInteger(report.wave, 1, 10001));
      requireValid(report.wave === run.wave + 1 && isNumber(report.beforeHit, Number.MIN_VALUE) && isNumber(report.damage, report.beforeHit) && isNumber(report.food) && isNumber(report.maxHp, report.beforeHit));
      state.run.deathReport = { enemy: report.enemy, wave: report.wave, beforeHit: report.beforeHit, damage: report.damage, food: report.food, maxHp: report.maxHp };
    }
    requireValid(Array.isArray(run.log) && run.log.length <= MAX_LOG);
    state.run.log = run.log.map((entry) => {
      requireValid(isObject(entry) && isInteger(entry.id, 0, run.logSeq) && isNumber(entry.time, 0, run.elapsed) && typeof entry.text === 'string' && entry.text.length <= 250 && ['info', 'level', 'permanent', 'craft', 'raid', 'heal', 'death', 'victory'].includes(entry.type));
      return { id: entry.id, time: entry.time, text: entry.text, type: entry.type };
    });
    requireValid(Array.isArray(meta.history) && meta.history.length <= 20);
    state.meta.history = meta.history.map((entry) => {
      requireValid(isObject(entry) && isInteger(entry.generation, 1, meta.generation) && isInteger(entry.wave, 0, meta.bestWave) && isNumber(entry.elapsed) && isObject(entry.skillGains));
      const skillGains = {};
      for (const id of SKILL_IDS) {
        requireValid(isNumber(entry.skillGains[id], 0, meta.skills[id].xp));
        skillGains[id] = entry.skillGains[id];
      }
      return { generation: entry.generation, wave: entry.wave, elapsed: entry.elapsed, skillGains };
    });
    // Old saves have no learning ledger. Credit only surviving, proven crafts.
    // Do not infer cooking from food, or a skipped spear from an iron weapon.
    if (!Object.hasOwn(meta, 'completedMilestones')) {
      for (const equipment of Object.values(state.run.equipment)) awardMilestone(state, equipment.id);
      for (const id of Object.keys(state.run.facilities)) awardMilestone(state, id);
    }
    introduceAugments(state);
    if (state.run.augments.offer.length > 0) {
      state.settings.paused = true;
      state.run.simRemainder = 0;
    }
    enforceAccelerationBoundary(state);
    return state;
  } catch {
    return null;
  }
}

