// Runtime catalog: A2.1 strategy expansion; human strategy playtest pending.
export const CONTENT = {
  "schema": "design_numeric_candidate_v1",
  "revision": "A2.1",
  "date": "2026-10-09",
  "status": "wave4_6_investment_playtest_candidate",
  "runtimeImport": true,
  "sourcePlan": "../docs/balance/candidate-a2.1.json",
  "units": {
    "duration": "game_seconds",
    "multiplier": "1.0_is_neutral",
    "percent": "fraction_0_to_1",
    "cost": "whole_resource_units"
  },
  "resources": [
    {
      "id": "wood",
      "name": "木材"
    },
    {
      "id": "stone",
      "name": "石材"
    },
    {
      "id": "ore",
      "name": "鉄鉱石"
    },
    {
      "id": "herbs",
      "name": "薬草"
    },
    {
      "id": "food",
      "name": "食料"
    },
    {
      "id": "hide",
      "name": "獣皮"
    },
    {
      "id": "ingot",
      "name": "鉄塊"
    },
    {
      "id": "gold",
      "name": "金貨"
    },
    {
      "id": "coal",
      "name": "石炭"
    },
    {
      "id": "steel_ingot",
      "name": "鋼塊"
    },
    {
      "id": "silver_ore",
      "name": "銀鉱石"
    },
    {
      "id": "silver_ingot",
      "name": "銀塊"
    },
    {
      "id": "mithril_ore",
      "name": "ミスリル鉱石"
    },
    {
      "id": "mithril_ingot",
      "name": "ミスリル塊"
    },
    {
      "id": "diamond",
      "name": "ダイヤモンド"
    },
    {
      "id": "orichalcum_ore",
      "name": "オリハルコン鉱石"
    },
    {
      "id": "orichalcum_ingot",
      "name": "オリハルコン塊"
    },
    {
      "id": "fish",
      "name": "魚"
    }
  ],
  "timing": {
    "firstRaidSeconds": 180,
    "raidIntervalSeconds": 180,
    "roundSeconds": 1.5,
    "minActionSeconds": 0.25,
    "simulationStepSeconds": 0.1,
    "fractionalPrecision": 8
  },
  "progression": {
    "runXpNeeded": {
      "base": 50,
      "exponent": 1.3,
      "rounding": "nearest_integer"
    },
    "permanentXpNeeded": {
      "base": 20,
      "exponent": 1.3,
      "rounding": "nearest_integer"
    },
    "runSpeedPerLevel": 0.1,
    "permanentSpeedPerLevel": 0.08,
    "runXpPerPermanentLevel": 0.04,
    "runXpPermanentMultiplierCap": 2,
    "workRunXpPerBaseSecond": 2,
    "workPermanentXpPerBaseSecond": 0.3,
    "baseAttack": 6,
    "baseDefense": 0,
    "baseMaxHp": 100,
    "combatRunAttackPerLevel": 2,
    "combatRunHpPerLevel": 10,
    "combatPermanentAttackPerLevel": 0.7,
    "combatPermanentDefensePerLevel": 0.2,
    "combatPermanentHpPerLevel": 4,
    "levelBonusOrigin": 1,
    "levelUpCurrentHp": "add_actual_max_hp_increase",
    "equipmentHpChange": "keep_current_hp_clamped_to_new_max",
    "workXpFormula": "baseDuration * rate * entry.xpCoefficient; run XP then multiplied by min(2,1+0.04*(permanentLevel-1))",
    "workSpeedFormula": "(1+0.10*(runLevel-1))*(1+0.08*(permanentLevel-1))*(1+toolSpeed); crafting additionally *(1+workshopSpeed)",
    "workDurationFormula": "max(0.25,baseDuration*actionDurationMultipliers/workSpeed)",
    "noPlayerGatherXpFromWorkers": true,
    "autoCookingAndProcessingAwardCraftXp": true,
    "runDefensePerLevel": 1.5,
    "runVitalityHpPerLevel": 18
  },
  "combat": {
    "minimumDamagePerHit": 1,
    "foodThreshold": 0.55,
    "foodBaseHeal": 30,
    "foodMaxHpHeal": 0.1,
    "foodHealRounding": "floor_after_all_bonuses",
    "foodPerRound": 1,
    "foodBeforeLethalPacket": true,
    "infirmaryTrigger": 0.35,
    "enemyXpPermanentRatio": 0.2,
    "xpAttribution": "cumulative HP damage fraction including support; capped by enemy budget; lethal hit pays remainder",
    "comboHitMultipliers": [
      0.75,
      0.75
    ],
    "heavyEveryRounds": 4,
    "heavyMultiplier": 1.6,
    "firstHeavyRound": 4,
    "armorTrait": "defense field only, no second mitigation layer",
    "damageRounding": "8_decimals_after_max_1",
    "enemyGoldIncomeDuringCombat": false,
    "roundOrder": [
      "player_attack_and_xp",
      "support_attack_and_xp",
      "food",
      "enemy_packet",
      "infirmary_if_alive"
    ],
    "ordinaryStatsMultipliers": "sum additive bonuses within the same stat multiplier group; then multiply flat total once",
    "supportUsesPlayerAttackBuffs": false,
    "defenseAppliesToEachComboHit": true
  },
  "discounts": {
    "resourceCostCap": 0.5,
    "materialPurchaseCap": 0.4,
    "minimumPositiveCost": 1,
    "rounding": "ceil_each_resource_or_gold_total_per_batch",
    "stack": "add_rates_then_cap",
    "goldNotAffectedByFacilityMaterialDiscount": true
  },
  "queue": {
    "maxGoals": 8,
    "manualCountMax": 99,
    "internalChunkMax": 99,
    "maxTemplates": 8,
    "defaultFoodTarget": 12,
    "defaultProcessingTarget": 6,
    "maxStockTarget": 9999,
    "priority": [
      "manual",
      "explicit_goal",
      "stock_target"
    ],
    "newBatchSpendOrder": [
      "main",
      "auto_cook",
      "processing_worker"
    ]
  },
  "actions": [
    {
      "id": "chop_wood",
      "name": "木を伐る",
      "skill": "logging",
      "duration": 5,
      "yields": {
        "wood": 2
      },
      "unlockLevel": 1,
      "knownAfterBoss": null,
      "xpCoefficient": 1
    },
    {
      "id": "quarry_stone",
      "name": "石を掘る",
      "skill": "mining",
      "duration": 6,
      "yields": {
        "stone": 2
      },
      "unlockLevel": 1,
      "knownAfterBoss": null,
      "xpCoefficient": 1
    },
    {
      "id": "mine_ore",
      "name": "鉄鉱石を掘る",
      "skill": "mining",
      "duration": 8,
      "yields": {
        "ore": 2
      },
      "unlockLevel": 2,
      "knownAfterBoss": null,
      "xpCoefficient": 1
    },
    {
      "id": "gather_food",
      "name": "食料を集める",
      "skill": "foraging",
      "duration": 7,
      "yields": {
        "food": 1
      },
      "unlockLevel": 1,
      "knownAfterBoss": null,
      "xpCoefficient": 1
    },
    {
      "id": "gather_herbs",
      "name": "薬草を摘む",
      "skill": "foraging",
      "duration": 5,
      "yields": {
        "herbs": 2
      },
      "unlockLevel": 1,
      "knownAfterBoss": null,
      "xpCoefficient": 1
    },
    {
      "id": "train_combat",
      "name": "素振りする",
      "skill": "combat",
      "duration": 6,
      "yields": {},
      "unlockLevel": 1,
      "knownAfterBoss": null,
      "xpCoefficient": 1.25,
      "trainingStat": "attack"
    },
    {
      "id": "mine_coal",
      "name": "石炭を掘る",
      "skill": "mining",
      "duration": 8,
      "yields": {
        "coal": 3
      },
      "unlockLevel": 4,
      "knownAfterBoss": "ironfang_captain",
      "xpCoefficient": 1.1
    },
    {
      "id": "mine_silver",
      "name": "銀鉱石を掘る",
      "skill": "mining",
      "duration": 10,
      "yields": {
        "silver_ore": 2
      },
      "unlockLevel": 6,
      "knownAfterBoss": "twinblade_raider",
      "xpCoefficient": 1.15
    },
    {
      "id": "mine_mithril",
      "name": "ミスリル鉱石を掘る",
      "skill": "mining",
      "duration": 12,
      "yields": {
        "mithril_ore": 2
      },
      "unlockLevel": 8,
      "knownAfterBoss": "silver_bandit_king",
      "xpCoefficient": 1.2
    },
    {
      "id": "mine_diamond",
      "name": "ダイヤモンドを掘る",
      "skill": "mining",
      "duration": 14,
      "yields": {
        "diamond": 2
      },
      "unlockLevel": 10,
      "knownAfterBoss": "mountain_colossus",
      "xpCoefficient": 1.25
    },
    {
      "id": "mine_orichalcum",
      "name": "オリハルコン鉱石を掘る",
      "skill": "mining",
      "duration": 16,
      "yields": {
        "orichalcum_ore": 2
      },
      "unlockLevel": 12,
      "knownAfterBoss": "crystal_guardian",
      "xpCoefficient": 1.3
    },
    {
      "id": "chop_hardwood",
      "name": "硬木を伐る",
      "skill": "logging",
      "duration": 8,
      "yields": {
        "wood": 5
      },
      "unlockLevel": 4,
      "knownAfterBoss": "ironfang_captain",
      "xpCoefficient": 1.1
    },
    {
      "id": "chop_ancient_tree",
      "name": "古木を伐る",
      "skill": "logging",
      "duration": 12,
      "yields": {
        "wood": 10
      },
      "unlockLevel": 8,
      "knownAfterBoss": "silver_bandit_king",
      "xpCoefficient": 1.2
    },
    {
      "id": "gather_herb_patch",
      "name": "薬草の群生地",
      "skill": "foraging",
      "duration": 8,
      "yields": {
        "herbs": 5
      },
      "unlockLevel": 4,
      "knownAfterBoss": "ironfang_captain",
      "xpCoefficient": 1.1
    },
    {
      "id": "gather_highland_food",
      "name": "山の採集",
      "skill": "foraging",
      "duration": 10,
      "yields": {
        "food": 3
      },
      "unlockLevel": 8,
      "knownAfterBoss": "silver_bandit_king",
      "xpCoefficient": 1.2
    },
    {
      "id": "train_defense",
      "name": "防御を鍛える",
      "skill": "combat",
      "trainingStat": "defense",
      "duration": 6,
      "yields": {},
      "unlockLevel": 1,
      "unlockBestWave": 1,
      "knownAfterBoss": null,
      "xpCoefficient": 1.25
    },
    {
      "id": "train_vitality",
      "name": "体力を鍛える",
      "skill": "combat",
      "trainingStat": "vitality",
      "duration": 8,
      "yields": {},
      "unlockLevel": 1,
      "unlockBestWave": 1,
      "knownAfterBoss": null,
      "xpCoefficient": 1.25
    },
    {
      "id": "fish_river",
      "name": "川で釣る",
      "skill": "foraging",
      "duration": 14,
      "yields": {
        "fish": 3
      },
      "unlockLevel": 2,
      "unlockBestWave": 1,
      "knownAfterBoss": null,
      "xpCoefficient": 1
    }
  ],
  "equipment": [
    {
      "id": "wooden_armor",
      "name": "木の鎧",
      "tier": 1,
      "slot": "armor",
      "skill": "smithing",
      "unlockLevel": 1,
      "knownAfterBoss": null,
      "duration": 10,
      "cost": {
        "wood": 8,
        "stone": 2
      },
      "stats": {
        "defense": 1,
        "maxHp": 20
      },
      "xpCoefficient": 1,
      "requiresPreviousEquipment": false
    },
    {
      "id": "wooden_shield",
      "name": "木の盾",
      "tier": 1,
      "slot": "shield",
      "skill": "smithing",
      "unlockLevel": 1,
      "knownAfterBoss": null,
      "duration": 8,
      "cost": {
        "wood": 6,
        "stone": 2
      },
      "stats": {
        "defense": 2
      },
      "xpCoefficient": 1,
      "requiresPreviousEquipment": false
    },
    {
      "id": "work_tools",
      "name": "作業道具",
      "tier": 1,
      "slot": "tool",
      "skill": "smithing",
      "unlockLevel": 1,
      "knownAfterBoss": null,
      "duration": 10,
      "cost": {
        "wood": 4,
        "stone": 4
      },
      "stats": {
        "speed": 0.18
      },
      "xpCoefficient": 1,
      "requiresPreviousEquipment": false
    },
    {
      "id": "iron_sword",
      "name": "鉄の剣",
      "tier": 2,
      "slot": "weapon",
      "skill": "smithing",
      "unlockLevel": 2,
      "knownAfterBoss": null,
      "duration": 14,
      "cost": {
        "ingot": 6,
        "wood": 8
      },
      "stats": {
        "attack": 14
      },
      "xpCoefficient": 1.05,
      "requiresPreviousEquipment": true,
      "previousEquipmentId": "wooden_spear"
    },
    {
      "id": "iron_armor",
      "name": "鉄の鎧",
      "tier": 2,
      "slot": "armor",
      "skill": "smithing",
      "unlockLevel": 3,
      "knownAfterBoss": null,
      "duration": 18,
      "cost": {
        "ingot": 10,
        "hide": 4
      },
      "stats": {
        "defense": 3,
        "maxHp": 40
      },
      "xpCoefficient": 1.05,
      "requiresPreviousEquipment": true,
      "previousEquipmentId": "wooden_armor"
    },
    {
      "id": "iron_shield",
      "name": "鉄の盾",
      "tier": 2,
      "slot": "shield",
      "skill": "smithing",
      "unlockLevel": 2,
      "knownAfterBoss": null,
      "duration": 12,
      "cost": {
        "ingot": 6,
        "wood": 8
      },
      "stats": {
        "defense": 5
      },
      "xpCoefficient": 1.05,
      "requiresPreviousEquipment": true,
      "previousEquipmentId": "wooden_shield"
    },
    {
      "id": "iron_tools",
      "name": "鉄の道具",
      "tier": 2,
      "slot": "tool",
      "skill": "smithing",
      "unlockLevel": 2,
      "knownAfterBoss": null,
      "duration": 14,
      "cost": {
        "ingot": 4,
        "wood": 8
      },
      "stats": {
        "speed": 0.3
      },
      "xpCoefficient": 1.05,
      "requiresPreviousEquipment": true,
      "previousEquipmentId": "work_tools"
    },
    {
      "id": "steel_sword",
      "name": "鋼の剣",
      "tier": 3,
      "slot": "weapon",
      "skill": "smithing",
      "unlockLevel": 4,
      "knownAfterBoss": "ironfang_captain",
      "duration": 18,
      "cost": {
        "steel_ingot": 4,
        "wood": 4
      },
      "stats": {
        "attack": 25
      },
      "xpCoefficient": 1.1,
      "requiresPreviousEquipment": true,
      "previousEquipmentId": "iron_sword"
    },
    {
      "id": "steel_armor",
      "name": "鋼の鎧",
      "tier": 3,
      "slot": "armor",
      "skill": "smithing",
      "unlockLevel": 4,
      "knownAfterBoss": "ironfang_captain",
      "duration": 22,
      "cost": {
        "steel_ingot": 6,
        "hide": 4
      },
      "stats": {
        "defense": 5,
        "maxHp": 65
      },
      "xpCoefficient": 1.1,
      "requiresPreviousEquipment": true,
      "previousEquipmentId": "iron_armor"
    },
    {
      "id": "steel_shield",
      "name": "鋼の盾",
      "tier": 3,
      "slot": "shield",
      "skill": "smithing",
      "unlockLevel": 4,
      "knownAfterBoss": "ironfang_captain",
      "duration": 16,
      "cost": {
        "steel_ingot": 4,
        "wood": 4
      },
      "stats": {
        "defense": 9
      },
      "xpCoefficient": 1.1,
      "requiresPreviousEquipment": true,
      "previousEquipmentId": "iron_shield"
    },
    {
      "id": "steel_tools",
      "name": "鋼の道具",
      "tier": 3,
      "slot": "tool",
      "skill": "smithing",
      "unlockLevel": 4,
      "knownAfterBoss": "ironfang_captain",
      "duration": 18,
      "cost": {
        "steel_ingot": 3,
        "wood": 4
      },
      "stats": {
        "speed": 0.45
      },
      "xpCoefficient": 1.1,
      "requiresPreviousEquipment": true,
      "previousEquipmentId": "iron_tools"
    },
    {
      "id": "silver_sword",
      "name": "銀の剣",
      "tier": 4,
      "slot": "weapon",
      "skill": "smithing",
      "unlockLevel": 6,
      "knownAfterBoss": "twinblade_raider",
      "duration": 22,
      "cost": {
        "silver_ingot": 6,
        "wood": 5
      },
      "stats": {
        "attack": 40
      },
      "xpCoefficient": 1.15,
      "requiresPreviousEquipment": true,
      "previousEquipmentId": "steel_sword"
    },
    {
      "id": "silver_armor",
      "name": "銀の鎧",
      "tier": 4,
      "slot": "armor",
      "skill": "smithing",
      "unlockLevel": 6,
      "knownAfterBoss": "twinblade_raider",
      "duration": 26,
      "cost": {
        "silver_ingot": 8,
        "hide": 5
      },
      "stats": {
        "defense": 8,
        "maxHp": 90
      },
      "xpCoefficient": 1.15,
      "requiresPreviousEquipment": true,
      "previousEquipmentId": "steel_armor"
    },
    {
      "id": "silver_shield",
      "name": "銀の盾",
      "tier": 4,
      "slot": "shield",
      "skill": "smithing",
      "unlockLevel": 6,
      "knownAfterBoss": "twinblade_raider",
      "duration": 20,
      "cost": {
        "silver_ingot": 5,
        "wood": 5
      },
      "stats": {
        "defense": 14
      },
      "xpCoefficient": 1.15,
      "requiresPreviousEquipment": true,
      "previousEquipmentId": "steel_shield"
    },
    {
      "id": "silver_tools",
      "name": "銀の道具",
      "tier": 4,
      "slot": "tool",
      "skill": "smithing",
      "unlockLevel": 6,
      "knownAfterBoss": "twinblade_raider",
      "duration": 22,
      "cost": {
        "silver_ingot": 4,
        "wood": 5
      },
      "stats": {
        "speed": 0.6
      },
      "xpCoefficient": 1.15,
      "requiresPreviousEquipment": true,
      "previousEquipmentId": "steel_tools"
    },
    {
      "id": "mithril_sword",
      "name": "ミスリルの剣",
      "tier": 5,
      "slot": "weapon",
      "skill": "smithing",
      "unlockLevel": 8,
      "knownAfterBoss": "silver_bandit_king",
      "duration": 26,
      "cost": {
        "mithril_ingot": 8,
        "wood": 6
      },
      "stats": {
        "attack": 60
      },
      "xpCoefficient": 1.2,
      "requiresPreviousEquipment": true,
      "previousEquipmentId": "silver_sword"
    },
    {
      "id": "mithril_armor",
      "name": "ミスリルの鎧",
      "tier": 5,
      "slot": "armor",
      "skill": "smithing",
      "unlockLevel": 8,
      "knownAfterBoss": "silver_bandit_king",
      "duration": 30,
      "cost": {
        "mithril_ingot": 10,
        "hide": 6
      },
      "stats": {
        "defense": 11,
        "maxHp": 125
      },
      "xpCoefficient": 1.2,
      "requiresPreviousEquipment": true,
      "previousEquipmentId": "silver_armor"
    },
    {
      "id": "mithril_shield",
      "name": "ミスリルの盾",
      "tier": 5,
      "slot": "shield",
      "skill": "smithing",
      "unlockLevel": 8,
      "knownAfterBoss": "silver_bandit_king",
      "duration": 24,
      "cost": {
        "mithril_ingot": 7,
        "wood": 6
      },
      "stats": {
        "defense": 20
      },
      "xpCoefficient": 1.2,
      "requiresPreviousEquipment": true,
      "previousEquipmentId": "silver_shield"
    },
    {
      "id": "mithril_tools",
      "name": "ミスリルの道具",
      "tier": 5,
      "slot": "tool",
      "skill": "smithing",
      "unlockLevel": 8,
      "knownAfterBoss": "silver_bandit_king",
      "duration": 26,
      "cost": {
        "mithril_ingot": 5,
        "wood": 6
      },
      "stats": {
        "speed": 0.75
      },
      "xpCoefficient": 1.2,
      "requiresPreviousEquipment": true,
      "previousEquipmentId": "silver_tools"
    },
    {
      "id": "diamond_sword",
      "name": "水晶刃",
      "tier": 6,
      "slot": "weapon",
      "skill": "smithing",
      "unlockLevel": 10,
      "knownAfterBoss": "mountain_colossus",
      "duration": 30,
      "cost": {
        "diamond": 10,
        "wood": 7,
        "steel_ingot": 3
      },
      "stats": {
        "attack": 86
      },
      "xpCoefficient": 1.25,
      "requiresPreviousEquipment": true,
      "previousEquipmentId": "mithril_sword"
    },
    {
      "id": "diamond_armor",
      "name": "水晶の鎧",
      "tier": 6,
      "slot": "armor",
      "skill": "smithing",
      "unlockLevel": 10,
      "knownAfterBoss": "mountain_colossus",
      "duration": 34,
      "cost": {
        "diamond": 13,
        "hide": 7,
        "steel_ingot": 4
      },
      "stats": {
        "defense": 15,
        "maxHp": 165
      },
      "xpCoefficient": 1.25,
      "requiresPreviousEquipment": true,
      "previousEquipmentId": "mithril_armor"
    },
    {
      "id": "diamond_shield",
      "name": "水晶の盾",
      "tier": 6,
      "slot": "shield",
      "skill": "smithing",
      "unlockLevel": 10,
      "knownAfterBoss": "mountain_colossus",
      "duration": 28,
      "cost": {
        "diamond": 8,
        "wood": 7,
        "steel_ingot": 3
      },
      "stats": {
        "defense": 28
      },
      "xpCoefficient": 1.25,
      "requiresPreviousEquipment": true,
      "previousEquipmentId": "mithril_shield"
    },
    {
      "id": "diamond_tools",
      "name": "水晶の道具",
      "tier": 6,
      "slot": "tool",
      "skill": "smithing",
      "unlockLevel": 10,
      "knownAfterBoss": "mountain_colossus",
      "duration": 30,
      "cost": {
        "diamond": 6,
        "wood": 7,
        "steel_ingot": 2
      },
      "stats": {
        "speed": 0.9
      },
      "xpCoefficient": 1.25,
      "requiresPreviousEquipment": true,
      "previousEquipmentId": "mithril_tools"
    },
    {
      "id": "orichalcum_sword",
      "name": "オリハルコンの剣",
      "tier": 7,
      "slot": "weapon",
      "skill": "smithing",
      "unlockLevel": 12,
      "knownAfterBoss": "crystal_guardian",
      "duration": 34,
      "cost": {
        "orichalcum_ingot": 12,
        "wood": 8
      },
      "stats": {
        "attack": 118
      },
      "xpCoefficient": 1.3,
      "requiresPreviousEquipment": true,
      "previousEquipmentId": "diamond_sword"
    },
    {
      "id": "orichalcum_armor",
      "name": "オリハルコンの鎧",
      "tier": 7,
      "slot": "armor",
      "skill": "smithing",
      "unlockLevel": 12,
      "knownAfterBoss": "crystal_guardian",
      "duration": 38,
      "cost": {
        "orichalcum_ingot": 16,
        "hide": 8
      },
      "stats": {
        "defense": 20,
        "maxHp": 210
      },
      "xpCoefficient": 1.3,
      "requiresPreviousEquipment": true,
      "previousEquipmentId": "diamond_armor"
    },
    {
      "id": "orichalcum_shield",
      "name": "オリハルコンの盾",
      "tier": 7,
      "slot": "shield",
      "skill": "smithing",
      "unlockLevel": 12,
      "knownAfterBoss": "crystal_guardian",
      "duration": 32,
      "cost": {
        "orichalcum_ingot": 10,
        "wood": 8
      },
      "stats": {
        "defense": 38
      },
      "xpCoefficient": 1.3,
      "requiresPreviousEquipment": true,
      "previousEquipmentId": "diamond_shield"
    },
    {
      "id": "orichalcum_tools",
      "name": "オリハルコンの道具",
      "tier": 7,
      "slot": "tool",
      "skill": "smithing",
      "unlockLevel": 12,
      "knownAfterBoss": "crystal_guardian",
      "duration": 34,
      "cost": {
        "orichalcum_ingot": 8,
        "wood": 8
      },
      "stats": {
        "speed": 1.1
      },
      "xpCoefficient": 1.3,
      "requiresPreviousEquipment": true,
      "previousEquipmentId": "diamond_tools"
    },
    {
      "id": "wooden_spear",
      "name": "石の槍",
      "tier": 1,
      "slot": "weapon",
      "skill": "smithing",
      "unlockLevel": 1,
      "knownAfterBoss": null,
      "duration": 8,
      "cost": {
        "wood": 4,
        "stone": 2
      },
      "stats": {
        "attack": 6
      },
      "xpCoefficient": 1,
      "requiresPreviousEquipment": false
    },
    {
      "id": "leather_armor",
      "name": "革の鎧",
      "tier": 1,
      "slot": "armor",
      "skill": "smithing",
      "unlockLevel": 1,
      "knownAfterBoss": null,
      "duration": 10,
      "cost": {
        "hide": 2,
        "wood": 4
      },
      "stats": {
        "defense": 2,
        "maxHp": 25
      },
      "xpCoefficient": 1,
      "requiresPreviousEquipment": false
    }
  ],
  "processing": [
    {
      "id": "cook_meal",
      "name": "薬草のスープ",
      "skill": "smithing",
      "kind": "cooking",
      "duration": 6,
      "cost": {
        "herbs": 2,
        "wood": 1
      },
      "yields": {
        "food": 3
      },
      "unlockLevel": 1,
      "knownAfterBoss": null,
      "xpCoefficient": 1
    },
    {
      "id": "smelt_iron",
      "name": "鉄を精錬",
      "skill": "smithing",
      "kind": "processing",
      "duration": 9,
      "cost": {
        "ore": 3,
        "wood": 2
      },
      "yields": {
        "ingot": 1
      },
      "unlockLevel": 2,
      "knownAfterBoss": null,
      "xpCoefficient": 1
    },
    {
      "id": "smelt_steel",
      "name": "鋼を製造",
      "skill": "smithing",
      "kind": "processing",
      "duration": 14,
      "cost": {
        "ingot": 2,
        "coal": 2
      },
      "yields": {
        "steel_ingot": 1
      },
      "unlockLevel": 4,
      "knownAfterBoss": "ironfang_captain",
      "xpCoefficient": 1.1
    },
    {
      "id": "smelt_silver",
      "name": "銀を精錬",
      "skill": "smithing",
      "kind": "processing",
      "duration": 16,
      "cost": {
        "silver_ore": 3,
        "coal": 2
      },
      "yields": {
        "silver_ingot": 1
      },
      "unlockLevel": 6,
      "knownAfterBoss": "twinblade_raider",
      "xpCoefficient": 1.15
    },
    {
      "id": "smelt_mithril",
      "name": "ミスリルを精錬",
      "skill": "smithing",
      "kind": "processing",
      "duration": 20,
      "cost": {
        "mithril_ore": 3,
        "coal": 3
      },
      "yields": {
        "mithril_ingot": 1
      },
      "unlockLevel": 8,
      "knownAfterBoss": "silver_bandit_king",
      "xpCoefficient": 1.2
    },
    {
      "id": "smelt_orichalcum",
      "name": "オリハルコンを精錬",
      "skill": "smithing",
      "kind": "processing",
      "duration": 24,
      "cost": {
        "orichalcum_ore": 3,
        "coal": 3
      },
      "yields": {
        "orichalcum_ingot": 1
      },
      "unlockLevel": 12,
      "knownAfterBoss": "crystal_guardian",
      "xpCoefficient": 1.3
    },
    {
      "id": "cook_batch",
      "name": "大鍋の調理",
      "skill": "smithing",
      "kind": "cooking",
      "duration": 14,
      "cost": {
        "herbs": 6,
        "coal": 2
      },
      "yields": {
        "food": 12
      },
      "unlockLevel": 4,
      "knownAfterBoss": "ironfang_captain",
      "xpCoefficient": 1.1
    },
    {
      "id": "cook_rations",
      "name": "保存食の仕込み",
      "skill": "smithing",
      "kind": "cooking",
      "duration": 22,
      "cost": {
        "herbs": 10,
        "wood": 4,
        "coal": 3
      },
      "yields": {
        "food": 24
      },
      "unlockLevel": 8,
      "knownAfterBoss": "silver_bandit_king",
      "xpCoefficient": 1.2
    },
    {
      "id": "cook_fish",
      "name": "魚の香草焼き",
      "skill": "smithing",
      "duration": 10,
      "cost": {
        "fish": 3,
        "herbs": 2,
        "wood": 2
      },
      "yields": {
        "food": 6
      },
      "unlockLevel": 2,
      "unlockBestWave": 1,
      "knownAfterBoss": null,
      "xpCoefficient": 1,
      "tier": 1
    }
  ],
  "facilities": [
    {
      "id": "watchtower",
      "facilityId": "watchtower",
      "name": "見張り台",
      "level": 1,
      "duration": 12,
      "cost": {
        "wood": 12,
        "stone": 8
      },
      "effect": {
        "raidDelay": 15
      },
      "effectMode": "replace_previous_level_totals",
      "skill": "smithing",
      "unlockLevel": 1,
      "unlockBestWave": 1,
      "requires": [],
      "xpCoefficient": 1
    },
    {
      "id": "watchtower_level_2",
      "facilityId": "watchtower",
      "name": "見張り台",
      "level": 2,
      "duration": 24,
      "cost": {
        "wood": 70,
        "stone": 50,
        "ingot": 8,
        "gold": 15
      },
      "effect": {
        "raidDelay": 30
      },
      "effectMode": "replace_previous_level_totals",
      "skill": "smithing",
      "unlockLevel": 4,
      "unlockBestWave": 4,
      "requires": [
        "watchtower"
      ],
      "xpCoefficient": 1
    },
    {
      "id": "watchtower_level_3",
      "facilityId": "watchtower",
      "name": "見張り台",
      "level": 3,
      "duration": 40,
      "cost": {
        "wood": 120,
        "stone": 90,
        "gold": 40,
        "silver_ingot": 8
      },
      "effect": {
        "raidDelay": 45
      },
      "effectMode": "replace_previous_level_totals",
      "skill": "smithing",
      "unlockLevel": 6,
      "unlockBestWave": 10,
      "requires": [
        "watchtower_level_2"
      ],
      "xpCoefficient": 1
    },
    {
      "id": "barricade",
      "facilityId": "barricade",
      "name": "防護柵",
      "level": 1,
      "duration": 10,
      "cost": {
        "wood": 10,
        "stone": 6
      },
      "effect": {
        "defense": 4
      },
      "effectMode": "replace_previous_level_totals",
      "skill": "smithing",
      "unlockLevel": 1,
      "unlockBestWave": 1,
      "requires": [],
      "xpCoefficient": 1
    },
    {
      "id": "barricade_level_2",
      "facilityId": "barricade",
      "name": "防護柵",
      "level": 2,
      "duration": 24,
      "cost": {
        "wood": 80,
        "stone": 60,
        "ingot": 10,
        "gold": 18
      },
      "effect": {
        "defense": 11
      },
      "effectMode": "replace_previous_level_totals",
      "skill": "smithing",
      "unlockLevel": 4,
      "unlockBestWave": 5,
      "requires": [
        "barricade"
      ],
      "xpCoefficient": 1
    },
    {
      "id": "barricade_level_3",
      "facilityId": "barricade",
      "name": "防護柵",
      "level": 3,
      "duration": 40,
      "cost": {
        "wood": 135,
        "stone": 105,
        "gold": 50,
        "silver_ingot": 10
      },
      "effect": {
        "defense": 24
      },
      "effectMode": "replace_previous_level_totals",
      "skill": "smithing",
      "unlockLevel": 6,
      "unlockBestWave": 11,
      "requires": [
        "barricade_level_2"
      ],
      "xpCoefficient": 1
    },
    {
      "id": "infirmary",
      "facilityId": "infirmary",
      "name": "救護所",
      "level": 1,
      "duration": 14,
      "cost": {
        "wood": 10,
        "stone": 4,
        "herbs": 6
      },
      "effect": {
        "healInterval": 4,
        "prepHealFlat": 2,
        "prepHealHpRatio": 0.005,
        "treatmentCharges": 0,
        "treatmentHpRatio": 0
      },
      "effectMode": "replace_previous_level_totals",
      "skill": "smithing",
      "unlockLevel": 1,
      "unlockBestWave": 1,
      "requires": [],
      "xpCoefficient": 1
    },
    {
      "id": "infirmary_level_2",
      "facilityId": "infirmary",
      "name": "救護所",
      "level": 2,
      "duration": 26,
      "cost": {
        "wood": 60,
        "stone": 30,
        "herbs": 80,
        "ingot": 6,
        "gold": 20
      },
      "effect": {
        "healInterval": 4,
        "prepHealFlat": 3,
        "prepHealHpRatio": 0.01,
        "treatmentCharges": 1,
        "treatmentHpRatio": 0.22
      },
      "effectMode": "replace_previous_level_totals",
      "skill": "smithing",
      "unlockLevel": 4,
      "unlockBestWave": 5,
      "requires": [
        "infirmary"
      ],
      "xpCoefficient": 1
    },
    {
      "id": "infirmary_level_3",
      "facilityId": "infirmary",
      "name": "救護所",
      "level": 3,
      "duration": 42,
      "cost": {
        "wood": 108,
        "stone": 72,
        "herbs": 160,
        "gold": 55,
        "silver_ingot": 8
      },
      "effect": {
        "healInterval": 4,
        "prepHealFlat": 4,
        "prepHealHpRatio": 0.015,
        "treatmentCharges": 3,
        "treatmentHpRatio": 0.22
      },
      "effectMode": "replace_previous_level_totals",
      "skill": "smithing",
      "unlockLevel": 6,
      "unlockBestWave": 11,
      "requires": [
        "infirmary_level_2"
      ],
      "xpCoefficient": 1
    },
    {
      "id": "workshop",
      "facilityId": "workshop",
      "name": "工房",
      "level": 1,
      "duration": 16,
      "cost": {
        "wood": 36,
        "stone": 24,
        "ingot": 4,
        "gold": 8
      },
      "effect": {
        "craftSpeed": 0.15
      },
      "effectMode": "replace_previous_level_totals",
      "skill": "smithing",
      "unlockLevel": 1,
      "unlockBestWave": 3,
      "requires": [],
      "xpCoefficient": 1
    },
    {
      "id": "workshop_level_2",
      "facilityId": "workshop",
      "name": "工房",
      "level": 2,
      "duration": 28,
      "cost": {
        "wood": 80,
        "stone": 50,
        "ingot": 12,
        "gold": 22
      },
      "effect": {
        "craftSpeed": 0.3
      },
      "effectMode": "replace_previous_level_totals",
      "skill": "smithing",
      "unlockLevel": 4,
      "unlockBestWave": 4,
      "requires": [
        "workshop"
      ],
      "xpCoefficient": 1
    },
    {
      "id": "workshop_level_3",
      "facilityId": "workshop",
      "name": "工房",
      "level": 3,
      "duration": 44,
      "cost": {
        "wood": 132,
        "stone": 96,
        "gold": 55,
        "silver_ingot": 12
      },
      "effect": {
        "craftSpeed": 0.5
      },
      "effectMode": "replace_previous_level_totals",
      "skill": "smithing",
      "unlockLevel": 6,
      "unlockBestWave": 10,
      "requires": [
        "workshop_level_2"
      ],
      "xpCoefficient": 1
    },
    {
      "id": "market",
      "facilityId": "market",
      "name": "市場",
      "level": 1,
      "duration": 16,
      "cost": {
        "wood": 40,
        "stone": 20,
        "gold": 6
      },
      "effect": {
        "purchaseDiscount": 0,
        "woodSaleAmount": 2
      },
      "effectMode": "replace_previous_level_totals",
      "skill": "smithing",
      "unlockLevel": 1,
      "unlockBestWave": 3,
      "requires": [],
      "xpCoefficient": 1
    },
    {
      "id": "market_level_2",
      "facilityId": "market",
      "name": "市場",
      "level": 2,
      "duration": 28,
      "cost": {
        "wood": 70,
        "stone": 40,
        "ingot": 8,
        "gold": 20
      },
      "effect": {
        "purchaseDiscount": 0.1,
        "woodSaleAmount": 3
      },
      "effectMode": "replace_previous_level_totals",
      "skill": "smithing",
      "unlockLevel": 4,
      "unlockBestWave": 4,
      "requires": [
        "market"
      ],
      "xpCoefficient": 1
    },
    {
      "id": "market_level_3",
      "facilityId": "market",
      "name": "市場",
      "level": 3,
      "duration": 44,
      "cost": {
        "wood": 120,
        "stone": 84,
        "gold": 50,
        "silver_ingot": 10
      },
      "effect": {
        "purchaseDiscount": 0.2,
        "woodSaleAmount": 4
      },
      "effectMode": "replace_previous_level_totals",
      "skill": "smithing",
      "unlockLevel": 6,
      "unlockBestWave": 10,
      "requires": [
        "market_level_2"
      ],
      "xpCoefficient": 1
    },
    {
      "id": "guardhouse",
      "facilityId": "guardhouse",
      "name": "衛兵所",
      "level": 1,
      "duration": 18,
      "cost": {
        "wood": 40,
        "stone": 30,
        "ingot": 6,
        "gold": 12,
        "herbs": 20
      },
      "effect": {
        "supportAttack": 20
      },
      "effectMode": "replace_previous_level_totals",
      "skill": "smithing",
      "unlockLevel": 1,
      "unlockBestWave": 3,
      "requires": [],
      "xpCoefficient": 1
    },
    {
      "id": "guardhouse_level_2",
      "facilityId": "guardhouse",
      "name": "衛兵所",
      "level": 2,
      "duration": 30,
      "cost": {
        "wood": 90,
        "stone": 60,
        "ingot": 14,
        "gold": 32,
        "herbs": 60
      },
      "effect": {
        "supportAttack": 48
      },
      "effectMode": "replace_previous_level_totals",
      "skill": "smithing",
      "unlockLevel": 4,
      "unlockBestWave": 5,
      "requires": [
        "guardhouse"
      ],
      "xpCoefficient": 1
    },
    {
      "id": "guardhouse_level_3",
      "facilityId": "guardhouse",
      "name": "衛兵所",
      "level": 3,
      "duration": 48,
      "cost": {
        "wood": 144,
        "stone": 120,
        "gold": 85,
        "silver_ingot": 16,
        "herbs": 120
      },
      "effect": {
        "supportAttack": 125
      },
      "effectMode": "replace_previous_level_totals",
      "skill": "smithing",
      "unlockLevel": 6,
      "unlockBestWave": 11,
      "requires": [
        "guardhouse_level_2"
      ],
      "xpCoefficient": 1
    },
    {
      "id": "watchtower_level_4",
      "facilityId": "watchtower",
      "name": "見張り台",
      "level": 4,
      "duration": 52,
      "cost": {
        "wood": 180,
        "stone": 135,
        "mithril_ingot": 12,
        "gold": 60
      },
      "effect": {
        "raidDelay": 60
      },
      "effectMode": "replace_previous_level_totals",
      "skill": "smithing",
      "unlockLevel": 8,
      "unlockBestWave": 13,
      "requires": [
        "watchtower_level_3"
      ],
      "xpCoefficient": 1
    },
    {
      "id": "watchtower_level_5",
      "facilityId": "watchtower",
      "name": "見張り台",
      "level": 5,
      "duration": 64,
      "cost": {
        "wood": 240,
        "stone": 180,
        "diamond": 16,
        "gold": 80
      },
      "effect": {
        "raidDelay": 75
      },
      "effectMode": "replace_previous_level_totals",
      "skill": "smithing",
      "unlockLevel": 10,
      "unlockBestWave": 16,
      "requires": [
        "watchtower_level_4"
      ],
      "xpCoefficient": 1
    },
    {
      "id": "barricade_level_4",
      "facilityId": "barricade",
      "name": "防護柵",
      "level": 4,
      "duration": 52,
      "cost": {
        "wood": 195,
        "stone": 150,
        "mithril_ingot": 14,
        "gold": 70
      },
      "effect": {
        "defense": 34
      },
      "effectMode": "replace_previous_level_totals",
      "skill": "smithing",
      "unlockLevel": 8,
      "unlockBestWave": 14,
      "requires": [
        "barricade_level_3"
      ],
      "xpCoefficient": 1
    },
    {
      "id": "barricade_level_5",
      "facilityId": "barricade",
      "name": "防護柵",
      "level": 5,
      "duration": 64,
      "cost": {
        "wood": 255,
        "stone": 195,
        "diamond": 18,
        "gold": 90
      },
      "effect": {
        "defense": 46
      },
      "effectMode": "replace_previous_level_totals",
      "skill": "smithing",
      "unlockLevel": 10,
      "unlockBestWave": 17,
      "requires": [
        "barricade_level_4"
      ],
      "xpCoefficient": 1
    },
    {
      "id": "infirmary_level_4",
      "facilityId": "infirmary",
      "name": "救護所",
      "level": 4,
      "duration": 54,
      "cost": {
        "wood": 168,
        "stone": 117,
        "mithril_ingot": 12,
        "gold": 75,
        "herbs": 280
      },
      "effect": {
        "healInterval": 4,
        "prepHealFlat": 5,
        "prepHealHpRatio": 0.02,
        "treatmentCharges": 4,
        "treatmentHpRatio": 0.22
      },
      "effectMode": "replace_previous_level_totals",
      "skill": "smithing",
      "unlockLevel": 8,
      "unlockBestWave": 14,
      "requires": [
        "infirmary_level_3"
      ],
      "xpCoefficient": 1
    },
    {
      "id": "infirmary_level_5",
      "facilityId": "infirmary",
      "name": "救護所",
      "level": 5,
      "duration": 66,
      "cost": {
        "wood": 228,
        "stone": 162,
        "diamond": 16,
        "gold": 95,
        "herbs": 440
      },
      "effect": {
        "healInterval": 4,
        "prepHealFlat": 6,
        "prepHealHpRatio": 0.025,
        "treatmentCharges": 5,
        "treatmentHpRatio": 0.22
      },
      "effectMode": "replace_previous_level_totals",
      "skill": "smithing",
      "unlockLevel": 10,
      "unlockBestWave": 17,
      "requires": [
        "infirmary_level_4"
      ],
      "xpCoefficient": 1
    },
    {
      "id": "workshop_level_4",
      "facilityId": "workshop",
      "name": "工房",
      "level": 4,
      "duration": 56,
      "cost": {
        "wood": 192,
        "stone": 141,
        "mithril_ingot": 16,
        "gold": 75
      },
      "effect": {
        "craftSpeed": 0.65
      },
      "effectMode": "replace_previous_level_totals",
      "skill": "smithing",
      "unlockLevel": 8,
      "unlockBestWave": 13,
      "requires": [
        "workshop_level_3"
      ],
      "xpCoefficient": 1
    },
    {
      "id": "workshop_level_5",
      "facilityId": "workshop",
      "name": "工房",
      "level": 5,
      "duration": 68,
      "cost": {
        "wood": 252,
        "stone": 186,
        "diamond": 20,
        "gold": 95
      },
      "effect": {
        "craftSpeed": 0.8
      },
      "effectMode": "replace_previous_level_totals",
      "skill": "smithing",
      "unlockLevel": 10,
      "unlockBestWave": 16,
      "requires": [
        "workshop_level_4"
      ],
      "xpCoefficient": 1
    },
    {
      "id": "market_level_4",
      "facilityId": "market",
      "name": "市場",
      "level": 4,
      "duration": 56,
      "cost": {
        "wood": 180,
        "stone": 129,
        "mithril_ingot": 14,
        "gold": 70
      },
      "effect": {
        "purchaseDiscount": 0.25,
        "woodSaleAmount": 5
      },
      "effectMode": "replace_previous_level_totals",
      "skill": "smithing",
      "unlockLevel": 8,
      "unlockBestWave": 13,
      "requires": [
        "market_level_3"
      ],
      "xpCoefficient": 1
    },
    {
      "id": "market_level_5",
      "facilityId": "market",
      "name": "市場",
      "level": 5,
      "duration": 68,
      "cost": {
        "wood": 240,
        "stone": 174,
        "diamond": 18,
        "gold": 90
      },
      "effect": {
        "purchaseDiscount": 0.3,
        "woodSaleAmount": 6
      },
      "effectMode": "replace_previous_level_totals",
      "skill": "smithing",
      "unlockLevel": 10,
      "unlockBestWave": 16,
      "requires": [
        "market_level_4"
      ],
      "xpCoefficient": 1
    },
    {
      "id": "guardhouse_level_4",
      "facilityId": "guardhouse",
      "name": "衛兵所",
      "level": 4,
      "duration": 60,
      "cost": {
        "wood": 204,
        "stone": 165,
        "mithril_ingot": 20,
        "gold": 105,
        "herbs": 220
      },
      "effect": {
        "supportAttack": 165
      },
      "effectMode": "replace_previous_level_totals",
      "skill": "smithing",
      "unlockLevel": 8,
      "unlockBestWave": 14,
      "requires": [
        "guardhouse_level_3"
      ],
      "xpCoefficient": 1
    },
    {
      "id": "guardhouse_level_5",
      "facilityId": "guardhouse",
      "name": "衛兵所",
      "level": 5,
      "duration": 72,
      "cost": {
        "wood": 264,
        "stone": 210,
        "diamond": 24,
        "gold": 125,
        "herbs": 360
      },
      "effect": {
        "supportAttack": 210
      },
      "effectMode": "replace_previous_level_totals",
      "skill": "smithing",
      "unlockLevel": 10,
      "unlockBestWave": 17,
      "requires": [
        "guardhouse_level_4"
      ],
      "xpCoefficient": 1
    },
    {
      "id": "archery_tower",
      "facilityId": "archery_tower",
      "name": "弓塔",
      "level": 1,
      "duration": 20,
      "cost": {
        "wood": 70,
        "stone": 30,
        "ingot": 6,
        "gold": 12
      },
      "effect": {
        "rangedAttack": 12
      },
      "effectMode": "replace_previous_level_totals",
      "skill": "smithing",
      "unlockLevel": 3,
      "unlockBestWave": 4,
      "requires": [],
      "xpCoefficient": 1
    },
    {
      "id": "archery_tower_level_2",
      "facilityId": "archery_tower",
      "name": "弓塔",
      "level": 2,
      "duration": 30,
      "cost": {
        "wood": 130,
        "stone": 75,
        "steel_ingot": 10,
        "gold": 30
      },
      "effect": {
        "rangedAttack": 30
      },
      "effectMode": "replace_previous_level_totals",
      "skill": "smithing",
      "unlockLevel": 4,
      "unlockBestWave": 8,
      "requires": [
        "archery_tower"
      ],
      "xpCoefficient": 1
    },
    {
      "id": "archery_tower_level_3",
      "facilityId": "archery_tower",
      "name": "弓塔",
      "level": 3,
      "duration": 40,
      "cost": {
        "wood": 190,
        "stone": 120,
        "silver_ingot": 14,
        "gold": 48
      },
      "effect": {
        "rangedAttack": 65
      },
      "effectMode": "replace_previous_level_totals",
      "skill": "smithing",
      "unlockLevel": 6,
      "unlockBestWave": 11,
      "requires": [
        "archery_tower_level_2"
      ],
      "xpCoefficient": 1
    },
    {
      "id": "archery_tower_level_4",
      "facilityId": "archery_tower",
      "name": "弓塔",
      "level": 4,
      "duration": 50,
      "cost": {
        "wood": 250,
        "stone": 165,
        "mithril_ingot": 18,
        "gold": 66
      },
      "effect": {
        "rangedAttack": 100
      },
      "effectMode": "replace_previous_level_totals",
      "skill": "smithing",
      "unlockLevel": 8,
      "unlockBestWave": 14,
      "requires": [
        "archery_tower_level_3"
      ],
      "xpCoefficient": 1
    },
    {
      "id": "archery_tower_level_5",
      "facilityId": "archery_tower",
      "name": "弓塔",
      "level": 5,
      "duration": 60,
      "cost": {
        "wood": 310,
        "stone": 210,
        "diamond": 22,
        "gold": 84
      },
      "effect": {
        "rangedAttack": 145
      },
      "effectMode": "replace_previous_level_totals",
      "skill": "smithing",
      "unlockLevel": 10,
      "unlockBestWave": 17,
      "requires": [
        "archery_tower_level_4"
      ],
      "xpCoefficient": 1
    }
  ],
  "workers": [
    {
      "id": "lumber_worker",
      "resourceChoices": [
        "wood"
      ],
      "requiresPlayerSkill": false,
      "requiresDiscoveredResource": true,
      "levels": [
        {
          "level": 0,
          "goldCost": 0,
          "interval": 6,
          "quantity": 1,
          "recipeDurationMultiplier": null,
          "maxResourceTier": 2,
          "unlockBestWave": 0
        },
        {
          "level": 1,
          "goldCost": 20,
          "interval": 4,
          "quantity": 2,
          "recipeDurationMultiplier": null,
          "maxResourceTier": 4,
          "unlockBestWave": 6
        },
        {
          "level": 2,
          "goldCost": 55,
          "interval": 2.5,
          "quantity": 3,
          "recipeDurationMultiplier": null,
          "maxResourceTier": 7,
          "unlockBestWave": 12
        }
      ],
      "gatherXp": 0,
      "craftXpCoefficient": 0
    },
    {
      "id": "mining_worker",
      "resourceChoices": [
        "stone",
        "ore",
        "coal",
        "silver_ore",
        "mithril_ore",
        "diamond",
        "orichalcum_ore"
      ],
      "requiresPlayerSkill": false,
      "requiresDiscoveredResource": true,
      "levels": [
        {
          "level": 0,
          "goldCost": 0,
          "interval": 7,
          "quantity": 1,
          "recipeDurationMultiplier": null,
          "maxResourceTier": 2,
          "unlockBestWave": 0
        },
        {
          "level": 1,
          "goldCost": 20,
          "interval": 5,
          "quantity": 1,
          "recipeDurationMultiplier": null,
          "maxResourceTier": 4,
          "unlockBestWave": 6
        },
        {
          "level": 2,
          "goldCost": 55,
          "interval": 3.5,
          "quantity": 1,
          "recipeDurationMultiplier": null,
          "maxResourceTier": 7,
          "unlockBestWave": 12
        }
      ],
      "gatherXp": 0,
      "craftXpCoefficient": 0
    },
    {
      "id": "foraging_worker",
      "resourceChoices": [
        "herbs",
        "food"
      ],
      "requiresPlayerSkill": false,
      "requiresDiscoveredResource": true,
      "levels": [
        {
          "level": 0,
          "goldCost": 0,
          "interval": 8,
          "quantity": 1,
          "recipeDurationMultiplier": null,
          "maxResourceTier": 2,
          "unlockBestWave": 0
        },
        {
          "level": 1,
          "goldCost": 20,
          "interval": 5,
          "quantity": 1,
          "recipeDurationMultiplier": null,
          "maxResourceTier": 4,
          "unlockBestWave": 6
        },
        {
          "level": 2,
          "goldCost": 55,
          "interval": 3.5,
          "quantity": 1,
          "recipeDurationMultiplier": null,
          "maxResourceTier": 7,
          "unlockBestWave": 12
        }
      ],
      "gatherXp": 0,
      "craftXpCoefficient": 0
    },
    {
      "id": "processing_worker",
      "recipeChoices": [
        "smelt_iron",
        "smelt_steel",
        "smelt_silver",
        "smelt_mithril",
        "smelt_orichalcum"
      ],
      "requiresPlayerSkill": false,
      "requiresDiscoveredResource": true,
      "levels": [
        {
          "level": 0,
          "goldCost": 0,
          "interval": null,
          "quantity": 1,
          "recipeDurationMultiplier": 2,
          "maxResourceTier": 2,
          "unlockBestWave": 0
        },
        {
          "level": 1,
          "goldCost": 30,
          "interval": null,
          "quantity": 1,
          "recipeDurationMultiplier": 1.4,
          "maxResourceTier": 4,
          "unlockBestWave": 6
        },
        {
          "level": 2,
          "goldCost": 75,
          "interval": null,
          "quantity": 1,
          "recipeDurationMultiplier": 1,
          "maxResourceTier": 7,
          "unlockBestWave": 12
        }
      ],
      "gatherXp": 0,
      "craftXpCoefficient": 1
    }
  ],
  "market": [
    {
      "id": "rations",
      "direction": "buy",
      "requiresMarket": true,
      "resource": "food",
      "quantity": 2,
      "gold": 3,
      "discountEligible": false
    },
    {
      "id": "buy_hide",
      "direction": "buy",
      "requiresMarket": true,
      "resource": "hide",
      "quantity": 2,
      "gold": 4,
      "discountEligible": true
    },
    {
      "id": "sell_wood",
      "direction": "sell",
      "requiresMarket": true,
      "resource": "wood",
      "quantity": 10,
      "goldByMarketLevel": [
        2,
        3,
        4
      ],
      "discountEligible": false
    },
    {
      "id": "mercenary",
      "direction": "hire",
      "requiresMarket": true,
      "gold": 12,
      "attack": 5,
      "oncePerRun": true,
      "discountEligible": false
    },
    {
      "id": "buy_ore",
      "direction": "buy",
      "requiresMarket": true,
      "resource": "ore",
      "quantity": 1,
      "gold": 2,
      "discountEligible": true,
      "requiresDiscoveredResource": true
    },
    {
      "id": "buy_ingot",
      "direction": "buy",
      "requiresMarket": true,
      "resource": "ingot",
      "quantity": 1,
      "gold": 9,
      "discountEligible": true,
      "requiresDiscoveredResource": true
    },
    {
      "id": "buy_coal",
      "direction": "buy",
      "requiresMarket": true,
      "resource": "coal",
      "quantity": 1,
      "gold": 2,
      "discountEligible": true,
      "requiresDiscoveredResource": true
    },
    {
      "id": "buy_steel_ingot",
      "direction": "buy",
      "requiresMarket": true,
      "resource": "steel_ingot",
      "quantity": 1,
      "gold": 24,
      "discountEligible": true,
      "requiresDiscoveredResource": true
    },
    {
      "id": "buy_silver_ore",
      "direction": "buy",
      "requiresMarket": true,
      "resource": "silver_ore",
      "quantity": 1,
      "gold": 4,
      "discountEligible": true,
      "requiresDiscoveredResource": true
    },
    {
      "id": "buy_silver_ingot",
      "direction": "buy",
      "requiresMarket": true,
      "resource": "silver_ingot",
      "quantity": 1,
      "gold": 18,
      "discountEligible": true,
      "requiresDiscoveredResource": true
    },
    {
      "id": "buy_mithril_ore",
      "direction": "buy",
      "requiresMarket": true,
      "resource": "mithril_ore",
      "quantity": 1,
      "gold": 6,
      "discountEligible": true,
      "requiresDiscoveredResource": true
    },
    {
      "id": "buy_mithril_ingot",
      "direction": "buy",
      "requiresMarket": true,
      "resource": "mithril_ingot",
      "quantity": 1,
      "gold": 28,
      "discountEligible": true,
      "requiresDiscoveredResource": true
    },
    {
      "id": "buy_diamond",
      "direction": "buy",
      "requiresMarket": true,
      "resource": "diamond",
      "quantity": 1,
      "gold": 9,
      "discountEligible": true,
      "requiresDiscoveredResource": true
    },
    {
      "id": "buy_orichalcum_ore",
      "direction": "buy",
      "requiresMarket": true,
      "resource": "orichalcum_ore",
      "quantity": 1,
      "gold": 10,
      "discountEligible": true,
      "requiresDiscoveredResource": true
    },
    {
      "id": "buy_orichalcum_ingot",
      "direction": "buy",
      "requiresMarket": true,
      "resource": "orichalcum_ingot",
      "quantity": 1,
      "gold": 45,
      "discountEligible": true,
      "requiresDiscoveredResource": true
    },
    {
      "id": "buy_wood",
      "direction": "buy",
      "requiresMarket": true,
      "resource": "wood",
      "quantity": 10,
      "gold": 8,
      "discountEligible": false,
      "requiresDiscoveredResource": true
    },
    {
      "id": "buy_stone",
      "direction": "buy",
      "requiresMarket": true,
      "resource": "stone",
      "quantity": 10,
      "gold": 8,
      "discountEligible": false,
      "requiresDiscoveredResource": true
    },
    {
      "id": "buy_herbs",
      "direction": "buy",
      "requiresMarket": true,
      "resource": "herbs",
      "quantity": 10,
      "gold": 8,
      "discountEligible": false,
      "requiresDiscoveredResource": true
    },
    {
      "id": "buy_fish",
      "direction": "buy",
      "requiresMarket": true,
      "resource": "fish",
      "quantity": 1,
      "gold": 2,
      "discountEligible": false,
      "requiresDiscoveredResource": true
    }
  ],
  "encounters": [
    {
      "id": "chapter_1_scout",
      "name": "森の狼",
      "wave": 1,
      "chapter": 1,
      "boss": false,
      "hp": 80,
      "attack": 10,
      "defense": 1,
      "trait": null,
      "bossPoint": 0,
      "gold": 2,
      "hide": 2,
      "combatXpBudget": 30,
      "traitParams": null
    },
    {
      "id": "chapter_1_vanguard",
      "name": "荒野の略奪者",
      "wave": 2,
      "chapter": 1,
      "boss": false,
      "hp": 145,
      "attack": 24,
      "defense": 2,
      "trait": null,
      "bossPoint": 0,
      "gold": 2,
      "hide": 2,
      "combatXpBudget": 30,
      "traitParams": null
    },
    {
      "id": "forest_chief",
      "name": "群狼の主",
      "wave": 3,
      "chapter": 1,
      "boss": true,
      "hp": 360,
      "attack": 56,
      "defense": 4,
      "trait": null,
      "bossPoint": 1,
      "gold": 6,
      "hide": 3,
      "combatXpBudget": 100,
      "traitParams": null
    },
    {
      "id": "chapter_2_scout",
      "name": "鉄牙の斥候",
      "wave": 4,
      "chapter": 2,
      "boss": false,
      "hp": 300,
      "attack": 48,
      "defense": 5,
      "trait": null,
      "bossPoint": 0,
      "gold": 4,
      "hide": 2,
      "combatXpBudget": 60,
      "traitParams": null
    },
    {
      "id": "chapter_2_vanguard",
      "name": "夜翼の群れ",
      "wave": 5,
      "chapter": 2,
      "boss": false,
      "hp": 395,
      "attack": 62,
      "defense": 6,
      "trait": "flying",
      "bossPoint": 0,
      "gold": 4,
      "hide": 2,
      "combatXpBudget": 60,
      "traitParams": null,
      "image": "assets/winged.svg"
    },
    {
      "id": "ironfang_captain",
      "name": "鉄牙の隊長",
      "wave": 6,
      "chapter": 2,
      "boss": true,
      "hp": 758,
      "attack": 91,
      "defense": 8,
      "trait": null,
      "bossPoint": 1,
      "gold": 12,
      "hide": 3,
      "combatXpBudget": 200,
      "traitParams": null
    },
    {
      "id": "chapter_3_scout",
      "name": "砦の斥候",
      "wave": 7,
      "chapter": 3,
      "boss": false,
      "hp": 617,
      "attack": 89,
      "defense": 9,
      "trait": null,
      "bossPoint": 0,
      "gold": 6,
      "hide": 2,
      "combatXpBudget": 90,
      "traitParams": null
    },
    {
      "id": "chapter_3_vanguard",
      "name": "洞窟の飛竜",
      "wave": 8,
      "chapter": 3,
      "boss": false,
      "hp": 761,
      "attack": 94,
      "defense": 10,
      "trait": "flying",
      "bossPoint": 0,
      "gold": 6,
      "hide": 2,
      "combatXpBudget": 90,
      "traitParams": {
        "hitMultipliers": [
          0.75,
          0.75
        ]
      },
      "image": "assets/winged.svg"
    },
    {
      "id": "twinblade_raider",
      "name": "双刃の襲撃者",
      "wave": 9,
      "chapter": 3,
      "boss": true,
      "hp": 1102,
      "attack": 108,
      "defense": 12,
      "trait": "combo",
      "bossPoint": 1,
      "gold": 18,
      "hide": 3,
      "combatXpBudget": 300,
      "traitParams": {
        "hitMultipliers": [
          0.75,
          0.75
        ]
      }
    },
    {
      "id": "chapter_4_scout",
      "name": "街道の略奪者",
      "wave": 10,
      "chapter": 4,
      "boss": false,
      "hp": 894,
      "attack": 126,
      "defense": 14,
      "trait": null,
      "bossPoint": 0,
      "gold": 8,
      "hide": 2,
      "combatXpBudget": 120,
      "traitParams": null
    },
    {
      "id": "chapter_4_vanguard",
      "name": "銀翼の狩人",
      "wave": 11,
      "chapter": 4,
      "boss": false,
      "hp": 1074,
      "attack": 145,
      "defense": 22,
      "trait": "flying",
      "bossPoint": 0,
      "gold": 8,
      "hide": 2,
      "combatXpBudget": 120,
      "traitParams": null,
      "image": "assets/winged.svg"
    },
    {
      "id": "silver_bandit_king",
      "name": "白銀の略奪王",
      "wave": 12,
      "chapter": 4,
      "boss": true,
      "hp": 1649,
      "attack": 170,
      "defense": 27,
      "trait": "armor",
      "bossPoint": 1,
      "gold": 24,
      "hide": 3,
      "combatXpBudget": 400,
      "traitParams": null
    },
    {
      "id": "chapter_5_scout",
      "name": "山嶺の斥候",
      "wave": 13,
      "chapter": 5,
      "boss": false,
      "hp": 1369,
      "attack": 173,
      "defense": 22,
      "trait": null,
      "bossPoint": 0,
      "gold": 10,
      "hide": 2,
      "combatXpBudget": 150,
      "traitParams": null
    },
    {
      "id": "chapter_5_vanguard",
      "name": "山岳の翼獣",
      "wave": 14,
      "chapter": 5,
      "boss": false,
      "hp": 1560,
      "attack": 170,
      "defense": 23,
      "trait": "flying",
      "bossPoint": 0,
      "gold": 10,
      "hide": 2,
      "combatXpBudget": 150,
      "traitParams": {
        "every": 4,
        "multiplier": 1.6
      },
      "image": "assets/winged.svg"
    },
    {
      "id": "mountain_colossus",
      "name": "山嶺の巨兵",
      "wave": 15,
      "chapter": 5,
      "boss": true,
      "hp": 2366,
      "attack": 204,
      "defense": 25,
      "trait": "heavy",
      "bossPoint": 1,
      "gold": 30,
      "hide": 3,
      "combatXpBudget": 500,
      "traitParams": {
        "every": 4,
        "multiplier": 1.6
      }
    },
    {
      "id": "chapter_6_scout",
      "name": "水晶の刺客",
      "wave": 16,
      "chapter": 6,
      "boss": false,
      "hp": 1903,
      "attack": 193,
      "defense": 25,
      "trait": "combo",
      "bossPoint": 0,
      "gold": 12,
      "hide": 2,
      "combatXpBudget": 180,
      "traitParams": {
        "hitMultipliers": [
          0.75,
          0.75
        ]
      }
    },
    {
      "id": "chapter_6_vanguard",
      "name": "水晶の翼獣",
      "wave": 17,
      "chapter": 6,
      "boss": false,
      "hp": 2390,
      "attack": 241,
      "defense": 28,
      "trait": "flying",
      "bossPoint": 0,
      "gold": 12,
      "hide": 2,
      "combatXpBudget": 180,
      "traitParams": {
        "every": 4,
        "multiplier": 1.6
      },
      "image": "assets/winged.svg"
    },
    {
      "id": "crystal_guardian",
      "name": "水晶の守護者",
      "wave": 18,
      "chapter": 6,
      "boss": true,
      "hp": 3439,
      "attack": 275,
      "defense": 34,
      "trait": "armor",
      "bossPoint": 1,
      "gold": 36,
      "hide": 3,
      "combatXpBudget": 600,
      "traitParams": null
    },
    {
      "id": "chapter_7_scout",
      "name": "夜明けの先兵",
      "wave": 19,
      "chapter": 7,
      "boss": false,
      "hp": 2775,
      "attack": 250,
      "defense": 30,
      "trait": "combo",
      "bossPoint": 0,
      "gold": 14,
      "hide": 2,
      "combatXpBudget": 210,
      "traitParams": {
        "hitMultipliers": [
          0.75,
          0.75
        ]
      }
    },
    {
      "id": "chapter_7_vanguard",
      "name": "黄昏の飛竜",
      "wave": 20,
      "chapter": 7,
      "boss": false,
      "hp": 3317,
      "attack": 313,
      "defense": 32,
      "trait": "flying",
      "bossPoint": 0,
      "gold": 14,
      "hide": 2,
      "combatXpBudget": 210,
      "traitParams": {
        "every": 4,
        "multiplier": 1.6
      },
      "image": "assets/winged.svg"
    },
    {
      "id": "dawn_gate_king",
      "name": "夜明けを塞ぐ王",
      "wave": 21,
      "chapter": 7,
      "boss": true,
      "hp": 4439,
      "attack": 349,
      "defense": 34,
      "trait": "armor",
      "bossPoint": 1,
      "gold": 42,
      "hide": 3,
      "combatXpBudget": 700,
      "traitParams": null
    }
  ],
  "augments": [
    {
      "id": "forestry",
      "name": "森と鉱脈の知恵",
      "family": "economy",
      "pack": null,
      "values": {
        "gatherDurationMultiplier": 0.8
      },
      "scope": "Player logging and mining; all discovered actions; not workers",
      "requiresPurchasedWorker": false,
      "goldAccumulation": "fractional_internal_floor_visible"
    },
    {
      "id": "builder",
      "name": "倹約建築",
      "family": "economy",
      "pack": null,
      "values": {
        "facilityMaterialDiscount": 0.25
      },
      "scope": "All facility levels; no gold discount; total discount capped",
      "requiresPurchasedWorker": false,
      "goldAccumulation": "fractional_internal_floor_visible"
    },
    {
      "id": "warrior",
      "name": "勇士の心得",
      "family": "martial",
      "pack": null,
      "values": {
        "playerAttackBonus": 0.18
      },
      "scope": "Does not multiply guardhouse support",
      "requiresPurchasedWorker": false,
      "goldAccumulation": "fractional_internal_floor_visible"
    },
    {
      "id": "drill",
      "name": "鍛錬の習慣",
      "family": "martial",
      "pack": null,
      "values": {
        "trainingDurationMultiplier": 0.7
      },
      "scope": "Player train_combat only",
      "requiresPurchasedWorker": false,
      "goldAccumulation": "fractional_internal_floor_visible"
    },
    {
      "id": "provisions",
      "name": "滋養食",
      "family": "fortress",
      "pack": null,
      "values": {
        "foodHealBonus": 0.3
      },
      "scope": "Same normal food cooldown and quantity",
      "requiresPurchasedWorker": false,
      "goldAccumulation": "fractional_internal_floor_visible"
    },
    {
      "id": "guard",
      "name": "守りの構え",
      "family": "fortress",
      "pack": null,
      "values": {
        "playerDefenseBonus": 0.15
      },
      "scope": "Does not heal or replenish treatment charges",
      "requiresPurchasedWorker": false,
      "goldAccumulation": "fractional_internal_floor_visible"
    },
    {
      "id": "timber_contract",
      "name": "木材納入契約",
      "family": "economy",
      "pack": "economy_augments",
      "values": {
        "goldPerWood": 0.15
      },
      "scope": "No hired-worker trigger; no sale required",
      "requiresPurchasedWorker": false,
      "goldAccumulation": "fractional_internal_floor_visible"
    },
    {
      "id": "investment",
      "name": "村への投資",
      "family": "economy",
      "pack": "economy_augments",
      "values": {
        "interval": 15,
        "goldPerFacilityLevel": 0.5
      },
      "scope": "No battle income; max facility level sum is 18",
      "requiresPurchasedWorker": false,
      "goldAccumulation": "fractional_internal_floor_visible"
    },
    {
      "id": "bounty",
      "name": "賞金稼ぎ",
      "family": "martial",
      "pack": "martial_augments",
      "values": {
        "waveGoldBonus": 0.75
      },
      "scope": "Affects ordinary wave gold, not first-discovery points",
      "requiresPurchasedWorker": false,
      "goldAccumulation": "fractional_internal_floor_visible"
    },
    {
      "id": "momentum",
      "name": "勝利の勢い",
      "family": "martial",
      "pack": "martial_augments",
      "values": {
        "attackPerClearedWave": 0.7,
        "victoryHealHpRatio": 0.06
      },
      "scope": "Recomputed from run.wave, not repeated callback stacking",
      "requiresPurchasedWorker": false,
      "goldAccumulation": "fractional_internal_floor_visible"
    },
    {
      "id": "joint_procurement",
      "name": "資材の共同購入",
      "family": "economy",
      "pack": "economy_augments",
      "values": {
        "purchaseDiscount": 0.15
      },
      "scope": "Does not discount worker upgrades or create sell-back profit",
      "requiresPurchasedWorker": false,
      "goldAccumulation": "fractional_internal_floor_visible"
    },
    {
      "id": "artisan_guild",
      "name": "職人組合",
      "family": "economy",
      "pack": "economy_augments",
      "values": {
        "workerDurationMultiplier": 0.75
      },
      "scope": "Offer only if at least one active purchased worker profession",
      "requiresPurchasedWorker": true,
      "goldAccumulation": "fractional_internal_floor_visible"
    },
    {
      "id": "spoils_reinvestment",
      "name": "戦利品の再投資",
      "family": "martial",
      "pack": "martial_augments",
      "values": {
        "equipmentMaterialDiscount": 0.25,
        "chargeLimit": 1
      },
      "scope": "One charge maximum; consume on paid batch start",
      "requiresPurchasedWorker": false,
      "goldAccumulation": "fractional_internal_floor_visible"
    },
    {
      "id": "field_training",
      "name": "実戦教練",
      "family": "martial",
      "pack": "martial_augments",
      "values": {
        "trainingXpBonus": 0.25,
        "enemyXpBudgetBonus": 0.25
      },
      "scope": "Still capped per enemy; not time in battle",
      "requiresPurchasedWorker": false,
      "goldAccumulation": "fractional_internal_floor_visible"
    },
    {
      "id": "wall_readiness",
      "name": "城壁の備え",
      "family": "fortress",
      "pack": "fortress_augments",
      "values": {
        "firstPacketDamageMultiplier": 0.6
      },
      "scope": "Apply to full first packet including combo; once per battle",
      "requiresPurchasedWorker": false,
      "goldAccumulation": "fractional_internal_floor_visible"
    },
    {
      "id": "healing_patrol",
      "name": "巡回治療",
      "family": "fortress",
      "pack": "fortress_augments",
      "values": {
        "infirmaryHealingBonus": 0.3
      },
      "scope": "Requires infirmary discovery; does not reset treatment charges",
      "requiresPurchasedWorker": false,
      "goldAccumulation": "fractional_internal_floor_visible"
    }
  ],
  "synergies": [
    {
      "id": "economy",
      "unlockBestWave": 6,
      "requiresSelectedFamily": "economy",
      "facilityAny": [
        {
          "id": "market",
          "level": 2
        }
      ],
      "values": {
        "purchaseDiscount": 0.1
      }
    },
    {
      "id": "fortress",
      "unlockBestWave": 6,
      "requiresSelectedFamily": "fortress",
      "facilityAny": [
        {
          "id": "barricade",
          "level": 2
        },
        {
          "id": "infirmary",
          "level": 2
        }
      ],
      "values": {
        "barricadeDefenseBonus": 0.25,
        "infirmaryTreatmentBonus": 0.2
      }
    },
    {
      "id": "martial",
      "unlockBestWave": 6,
      "requiresSelectedFamily": "martial",
      "facilityAny": [
        {
          "id": "guardhouse",
          "level": 2
        }
      ],
      "orCombatRunLevel": 10,
      "values": {
        "playerAttackBonus": 0.12,
        "waveGoldBonus": 0.2
      }
    }
  ],
  "diplomacy": [
    {
      "id": "saphra",
      "name": "サフラ辺境国",
      "unlockBestWave": 3,
      "repeatArrivalWave": 1,
      "deadlineSeconds": 150,
      "cost": {
        "food": 8
      },
      "ally": {
        "incomeInterval": 15,
        "gold": 1
      },
      "invasion": {
        "hpMultiplier": 1.15,
        "attackMultiplier": 1.1,
        "defenseBonus": 0
      },
      "victory": {
        "gold": 24,
        "runAttack": 4
      }
    },
    {
      "id": "mining_realm",
      "name": "カルド鉱山国",
      "unlockBestWave": 9,
      "repeatArrivalWave": 9,
      "deadlineSeconds": 240,
      "cost": {
        "steel_ingot": 4
      },
      "ally": {
        "mineralPurchaseDiscount": 0.15
      },
      "invasion": {
        "hpMultiplier": 1.15,
        "attackMultiplier": 1.1,
        "defenseBonus": 3
      },
      "victory": {
        "steel_ingot": 6,
        "silver_ingot": 4
      }
    }
  ],
  "legacy": [
    {
      "id": "action_queue",
      "cost": 1,
      "rank": 1,
      "unlock": {
        "completedQuests": 2,
        "legacyBestWaveAlternative": 3
      },
      "effect": {
        "goalSlots": 8
      },
      "rankEffectMode": "add_to_lower_rank_except_acceleration_extension"
    },
    {
      "id": "auto_cook",
      "cost": 1,
      "rank": 1,
      "unlock": {
        "completedQuests": 2
      },
      "effect": {
        "durationMultiplier": 1,
        "defaultFoodTarget": 12
      },
      "rankEffectMode": "add_to_lower_rank_except_acceleration_extension"
    },
    {
      "id": "lumber_worker",
      "cost": 1,
      "rank": 1,
      "unlock": {
        "bestWave": 1
      },
      "effect": {
        "profession": "lumber_worker"
      },
      "rankEffectMode": "add_to_lower_rank_except_acceleration_extension"
    },
    {
      "id": "mining_worker",
      "cost": 1,
      "rank": 1,
      "unlock": {
        "bestWave": 1
      },
      "effect": {
        "profession": "mining_worker"
      },
      "rankEffectMode": "add_to_lower_rank_except_acceleration_extension"
    },
    {
      "id": "inherited_blade",
      "cost": 1,
      "rank": 1,
      "unlock": {
        "completedQuests": 1
      },
      "effect": {
        "attack": 4
      },
      "rankEffectMode": "add_to_lower_rank_except_acceleration_extension"
    },
    {
      "id": "inherited_guard",
      "cost": 1,
      "rank": 1,
      "unlock": {
        "completedQuests": 1
      },
      "effect": {
        "defense": 3
      },
      "rankEffectMode": "add_to_lower_rank_except_acceleration_extension"
    },
    {
      "id": "inherited_vitality",
      "cost": 1,
      "rank": 1,
      "unlock": {
        "completedQuests": 1
      },
      "effect": {
        "maxHp": 30
      },
      "rankEffectMode": "add_to_lower_rank_except_acceleration_extension"
    },
    {
      "id": "cycle_acceleration",
      "cost": 1,
      "rank": 1,
      "unlock": {
        "bestWave": 9,
        "automationCount": 3,
        "generation": 2
      },
      "effect": {
        "realSeconds": 120
      },
      "rankEffectMode": "add_to_lower_rank_except_acceleration_extension"
    },
    {
      "id": "economy_augments",
      "cost": 1,
      "rank": 1,
      "unlock": {
        "bestWave": 3
      },
      "effect": {
        "pack": "economy_augments"
      },
      "rankEffectMode": "add_to_lower_rank_except_acceleration_extension"
    },
    {
      "id": "martial_augments",
      "cost": 1,
      "rank": 1,
      "unlock": {
        "bestWave": 3
      },
      "effect": {
        "pack": "martial_augments"
      },
      "rankEffectMode": "add_to_lower_rank_except_acceleration_extension"
    },
    {
      "id": "foraging_worker",
      "cost": 1,
      "rank": 1,
      "unlock": {
        "bestWave": 3
      },
      "effect": {
        "profession": "foraging_worker"
      },
      "rankEffectMode": "add_to_lower_rank_except_acceleration_extension"
    },
    {
      "id": "processing_worker",
      "cost": 2,
      "rank": 1,
      "unlock": {
        "bestWave": 6
      },
      "effect": {
        "profession": "processing_worker"
      },
      "rankEffectMode": "add_to_lower_rank_except_acceleration_extension"
    },
    {
      "id": "queue_templates",
      "cost": 2,
      "rank": 1,
      "unlock": {
        "bestWave": 3,
        "requires": [
          "action_queue"
        ]
      },
      "effect": {
        "templateSlots": 8
      },
      "rankEffectMode": "add_to_lower_rank_except_acceleration_extension"
    },
    {
      "id": "stock_targets",
      "cost": 2,
      "rank": 1,
      "unlock": {
        "bestWave": 6,
        "requires": [
          "action_queue"
        ]
      },
      "effect": {
        "targetSlots": 17,
        "maxPerResource": 9999
      },
      "rankEffectMode": "add_to_lower_rank_except_acceleration_extension"
    },
    {
      "id": "fortress_augments",
      "cost": 2,
      "rank": 1,
      "unlock": {
        "bestWave": 6
      },
      "effect": {
        "pack": "fortress_augments"
      },
      "rankEffectMode": "add_to_lower_rank_except_acceleration_extension"
    },
    {
      "id": "acceleration_extension",
      "cost": 3,
      "rank": 1,
      "unlock": {
        "bestWave": 12,
        "requires": [
          "cycle_acceleration"
        ]
      },
      "effect": {
        "realSecondsPerKnownWave": 57
      },
      "rankEffectMode": "add_to_lower_rank_except_acceleration_extension"
    },
    {
      "id": "inherited_blade_2",
      "cost": 2,
      "rank": 2,
      "unlock": {
        "bestWave": 9,
        "requires": [
          "inherited_blade"
        ]
      },
      "effect": {
        "attack": 8
      },
      "rankEffectMode": "add_to_lower_rank_except_acceleration_extension"
    },
    {
      "id": "inherited_guard_2",
      "cost": 2,
      "rank": 2,
      "unlock": {
        "bestWave": 9,
        "requires": [
          "inherited_guard"
        ]
      },
      "effect": {
        "defense": 7
      },
      "rankEffectMode": "add_to_lower_rank_except_acceleration_extension"
    },
    {
      "id": "inherited_vitality_2",
      "cost": 2,
      "rank": 2,
      "unlock": {
        "bestWave": 9,
        "requires": [
          "inherited_vitality"
        ]
      },
      "effect": {
        "maxHp": 60
      },
      "rankEffectMode": "add_to_lower_rank_except_acceleration_extension"
    }
  ],
  "quests": [
    {
      "id": "first_weapon",
      "trigger": {
        "event": "recipe_completed",
        "recipeId": "wooden_spear"
      },
      "reward": 1,
      "once": "save_profile_history",
      "claim": "automatic",
      "persistentAcrossRespec": true
    },
    {
      "id": "first_meal",
      "trigger": {
        "event": "recipe_completed",
        "recipeId": "cook_meal"
      },
      "reward": 1,
      "once": "save_profile_history",
      "claim": "automatic",
      "persistentAcrossRespec": true
    },
    {
      "id": "first_tower",
      "trigger": {
        "event": "facility_completed",
        "facilityId": "watchtower",
        "minimumLevel": 1
      },
      "reward": 1,
      "once": "save_profile_history",
      "claim": "automatic",
      "persistentAcrossRespec": true
    },
    {
      "id": "first_iron_smelting",
      "trigger": {
        "event": "recipe_completed",
        "recipeId": "smelt_iron"
      },
      "reward": 1,
      "once": "save_profile_history",
      "claim": "automatic",
      "persistentAcrossRespec": true
    },
    {
      "id": "first_iron_equipment",
      "trigger": {
        "event": "equipment_completed",
        "minimumTier": 2
      },
      "reward": 1,
      "once": "save_profile_history",
      "claim": "automatic",
      "persistentAcrossRespec": true
    },
    {
      "id": "first_queue_completion",
      "trigger": {
        "event": "queue_goal_completed"
      },
      "reward": 1,
      "once": "save_profile_history",
      "claim": "automatic",
      "persistentAcrossRespec": true
    },
    {
      "id": "first_worker_purchase",
      "trigger": {
        "event": "upgrade_purchased",
        "anyOf": [
          "lumber_worker",
          "mining_worker",
          "foraging_worker",
          "processing_worker"
        ]
      },
      "reward": 1,
      "once": "save_profile_history",
      "claim": "automatic",
      "persistentAcrossRespec": true
    },
    {
      "id": "first_steel_equipment",
      "trigger": {
        "event": "equipment_completed",
        "minimumTier": 3
      },
      "reward": 1,
      "once": "save_profile_history",
      "claim": "automatic",
      "persistentAcrossRespec": true
    },
    {
      "id": "first_facility_level_2",
      "trigger": {
        "event": "facility_completed",
        "minimumLevel": 2
      },
      "reward": 1,
      "once": "save_profile_history",
      "claim": "automatic",
      "persistentAcrossRespec": true
    },
    {
      "id": "first_diplomacy_resolution",
      "trigger": {
        "anyOfEvents": [
          "country_aid_paid",
          "country_army_defeated"
        ]
      },
      "reward": 1,
      "once": "save_profile_history",
      "claim": "automatic",
      "persistentAcrossRespec": true
    },
    {
      "id": "first_synergy",
      "trigger": {
        "event": "synergy_activated"
      },
      "reward": 1,
      "once": "save_profile_history",
      "claim": "automatic",
      "persistentAcrossRespec": true
    },
    {
      "id": "first_silver_equipment",
      "trigger": {
        "event": "equipment_completed",
        "minimumTier": 4
      },
      "reward": 1,
      "once": "save_profile_history",
      "claim": "automatic",
      "persistentAcrossRespec": true
    },
    {
      "id": "first_mithril_equipment",
      "trigger": {
        "event": "equipment_completed",
        "minimumTier": 5
      },
      "reward": 1,
      "once": "save_profile_history",
      "claim": "automatic",
      "persistentAcrossRespec": true
    },
    {
      "id": "first_diamond_equipment",
      "trigger": {
        "event": "equipment_completed",
        "minimumTier": 6
      },
      "reward": 1,
      "once": "save_profile_history",
      "claim": "automatic",
      "persistentAcrossRespec": true
    },
    {
      "id": "first_orichalcum_equipment",
      "trigger": {
        "event": "equipment_completed",
        "minimumTier": 7
      },
      "reward": 1,
      "once": "save_profile_history",
      "claim": "automatic",
      "persistentAcrossRespec": true
    }
  ],
  "acceleration": {
    "multiplier": 5,
    "baseRealSeconds": 120,
    "unlock": {
      "bestWave": 9,
      "automationCount": 3,
      "generation": 2
    },
    "extensionUnlock": {
      "bestWave": 12
    },
    "extensionSecondsPerKnownWave": 57,
    "extensionFormula": "bestWaveAtRunStart * (180+45+60)/5",
    "extensionReplacesBaseBudget": true,
    "limitSnapshot": "bestWaveAtRunStart",
    "includesKnownBattles": true,
    "replenish": "new_run_only",
    "expireAtUnknownWave": true
  },
  "caps": {
    "facilityLevel": 3,
    "workerUpgradeLevel": 2,
    "activeWorkerPerProfession": 1,
    "simultaneousCountriesPerRaid": 1,
    "maxAugments": 4,
    "maxReinvestmentCharges": 1,
    "maxMomentumWaves": 21,
    "maxInvestmentFacilityLevelSum": 18
  },
  "profiles": {
    "economic": {
      "label": "設備投資",
      "upgrades": [
        "action_queue",
        "auto_cook",
        "lumber_worker",
        "mining_worker",
        "inherited_guard",
        "inherited_guard_2",
        "inherited_vitality",
        "inherited_vitality_2",
        "cycle_acceleration",
        "economy_augments",
        "processing_worker",
        "queue_templates",
        "stock_targets",
        "acceleration_extension"
      ],
      "preferredAugments": [
        "investment",
        "forestry",
        "joint_procurement",
        "artisan_guild"
      ]
    },
    "martial": {
      "label": "武勇",
      "upgrades": [
        "action_queue",
        "auto_cook",
        "lumber_worker",
        "mining_worker",
        "inherited_blade",
        "inherited_blade_2",
        "inherited_guard",
        "inherited_guard_2",
        "inherited_vitality",
        "cycle_acceleration",
        "martial_augments",
        "foraging_worker",
        "queue_templates",
        "stock_targets",
        "acceleration_extension"
      ],
      "preferredAugments": [
        "warrior",
        "drill",
        "bounty",
        "field_training"
      ]
    },
    "fortress": {
      "label": "要塞",
      "upgrades": [
        "action_queue",
        "auto_cook",
        "lumber_worker",
        "mining_worker",
        "inherited_guard",
        "inherited_guard_2",
        "inherited_vitality",
        "inherited_vitality_2",
        "cycle_acceleration",
        "fortress_augments",
        "foraging_worker",
        "queue_templates",
        "stock_targets",
        "acceleration_extension"
      ],
      "preferredAugments": [
        "guard",
        "provisions",
        "wall_readiness",
        "healing_patrol"
      ]
    }
  }
};
