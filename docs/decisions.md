# Graphics integration decisions

The graphics baseline is integrated onto main d06339a (0.6.140), not the older local 0.5/0.6.81 game. Engine, balance and save code remain the main versions.

Use the shared UI references in PR #3. Their example values and imagined functionality are not game specifications. Keep existing functionality, four languages, actual quantities and keyboard access.

Desktop dashboard fits one screen in ordinary use. Exceptional notifications and long translated content may scroll inside panels so controls remain reachable. Mobile may scroll vertically.

Village ambient animation continues while paused, but simulation, resources, work progress and raid countdown do not advance. Respect reduced motion and hidden/offscreen suspension. Background and animated entities remain separate; paths and water masks constrain animation.

2026-11-13: user approved one graphics Issue per screen (12 total) and Claude implementation/fixes with Codex review. At most three repair rounds. Human merge/release decision; no automatic deployment or API billing fallback. Authentication and a real end-to-end pilot must be verified before calling automation operational.

2026-11-14: user asked Claude to implement its own proposals #24–#27 as filed. Implemented, pending human merge:
- Village life follows the run (#24). The buildings are part of the approved plate and are not hidden; growth is shown by residents, crops, sheep, hearth smoke and wall torches, a timber carrier walks only during construction, and the dusk reddens over the last 45 seconds before a raid and during combat. Presentation only: it reads facility levels, the active recipe and the raid clock, and writes nothing. Not implemented: empty lots for unbuilt facilities and scaffolding, which need a plate without buildings and separate building sprites.
- Regular enemy illustration follows the encounter id or trait instead of the wave number (#25). Flying and boss selection is unchanged, and unknown encounters keep the original wave order. Not implemented: new per-chapter artwork; the ten flying encounters still share one sprite.
- The displayed release number comes from `src/version.js` only (#26), and a test keeps every stylesheet and local module import versioned (#27).
