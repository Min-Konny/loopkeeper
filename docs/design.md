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


## 2026-11-13 Graphics development loop
Claude implements and repairs; Codex reviews the exact PR head. Twelve screen Issues (#4–#15) use shared widescreen references in PR #3 and the integrated baseline in PR #16. At most three repair rounds, serial scope ownership, no automatic merge/deployment or API fallback. The prepared workflow is disabled pending repo-scoped OAuth, Codex review connection, reviewed main activation and a real end-to-end pilot. The bounded zero-tool generator handles scoped JS/CSS edits, not image generation or screenshot acceptance. See docs/GRAPHICS_LOOP.md for limits and activation.
