# Screenshots for visual acceptance

Source tests cannot show whether a screen looks right. These scripts capture the same screens from a
base checkout and a PR checkout and lay them side by side, so a person (or a reviewer that can read
images) can accept or reject the look against the exact commit.

- `capture.mjs` serves a checkout on a private port, builds test saves with that checkout's own engine
  (`fresh`, and `busy` = an active job, five reservations and large stock), and saves PNG files plus
  `report.json` (horizontal overflow and page errors per shot). It uses a fresh browser profile and never
  touches a player's save.
- `compare.mjs` turns two capture folders into "before | after" JPEG sheets.
- `validate-artifact.cjs` is the gate the publishing job applies to the untrusted capture output.

Locally:

```
node scripts/screenshots/capture.mjs --root ../base --out /tmp/before
node scripts/screenshots/capture.mjs --root . --out /tmp/after
node scripts/screenshots/compare.mjs --before /tmp/before --after /tmp/after --out /tmp/sheets
```

On GitHub: run the "PR screenshots" workflow from `main` with a PR number. It posts the sheets as a PR
comment and stores them on the `screenshots` branch under `pr-<number>/<sha>/`. That branch holds images
only and is never merged.

Limits: animation is frozen (reduced motion, paused), so motion is not judged. A byte difference between
two shots does not always mean a visible change. Add states to `fixtures()` when an Issue needs one that
is not covered, for example combat, a cleared run or another language.
