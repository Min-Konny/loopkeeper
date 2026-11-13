# Graphics integration decisions

The graphics baseline is integrated onto main d06339a (0.6.140), not the older local 0.5/0.6.81 game. Engine, balance and save code remain the main versions.

Use the shared UI references in PR #3. Their example values and imagined functionality are not game specifications. Keep existing functionality, four languages, actual quantities and keyboard access.

Desktop dashboard fits one screen in ordinary use. Exceptional notifications and long translated content may scroll inside panels so controls remain reachable. Mobile may scroll vertically.

Village ambient animation continues while paused, but simulation, resources, work progress and raid countdown do not advance. Respect reduced motion and hidden/offscreen suspension. Background and animated entities remain separate; paths and water masks constrain animation.

2026-11-13: user approved one graphics Issue per screen (12 total) and Claude implementation/fixes with Codex review. At most three repair rounds. Human merge/release decision; no automatic deployment or API billing fallback. Authentication and a real end-to-end pilot must be verified before calling automation operational.
