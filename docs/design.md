# Graphics implementation guide

Core concept: a Melvor Idle-style management game inspired by Super Fantasy Kingdom. Production and preparation happen in management screens; raids use automatic combat. Graphics work must not change this loop.

## Shared references

The original seven unique images and twelve widescreen screen references are maintained in docs/references/ui on branch codex/ui-reference-library (PR #3). Each graphics Issue identifies its screen and acceptance criteria. Treat images as visual targets, not authority for numerical balance or new mechanics.

## Implemented baseline

Title artwork and nature effects are separate from title-state/save handling. The village dashboard uses actual workScene and enemy portraits, localized labels, resource summaries and existing speed controls. The village scene uses independent actors/effects over a static background.

Review fixes include cleared-run result reopening, four-language copy, focus-preserving speed controls, resource accessibility labels, queue overflow count, equipped worker art and accessible overflow.

## Next work

Update one screen per Issue. Use deep green surfaces, thin brass/gold borders, cream icons, turquoise progress and readable pixel artwork. Preserve the title's achievements/settings actions even if a reference omits them. Compare 1280x720, 1920x1080 and mobile 390px. Record screenshots against the exact PR SHA; source tests alone do not prove visual acceptance.

The approved development loop is Claude implementation and repair followed by Codex review, with three repair rounds maximum. Queue shared-file work serially. Reference assets and the current integrated baseline must be available before an Issue is activated.

### Village life and encounter illustration (2026-11-14)

`villageLife()` in `src/village-layout.js` turns facility levels (endless levels included, outposts excluded), "a facility recipe is active" and a 0–1 threat into what the scene draws: 1–3 residents, the timber carrier, the planted share of two plots, 0–3 sheep, 0–2 smoke plumes, wall torches and the dusk tint. `mountVillageScene().setState()` accepts that input; a still scene (effects off, reduced motion, dialog open) repaints once per change and otherwise keeps to the existing 30fps loop and its suspension rules. Thresholds are presentation tuning and may change without affecting balance or saves.

`enemyPortraitKind()` in `src/enemy-art.js` is the single choice of regular enemy artwork for the battle screen and the dashboard forecast: flying → winged, boss → boss (named boss art still resolved by id), then encounter id, then trait (armor → knight, heavy → giant, combo → raider), then the original wave order as the fallback.
