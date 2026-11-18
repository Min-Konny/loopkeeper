# Claude implementation / Codex review loop

Status: the title pilot created PR #22, received Codex feedback, applied a Claude repair, then passed re-review. Dashboard PR #39 passed visual acceptance and was merged into the integration branch. The active issue, source paths and baseline SHA come from `scripts/factory/graphics-catalog.json` on main.

The user approved this role split on 2026-11-13. One screen corresponds to one graphics Issue. Original and widescreen visual references live in PR #3. The integrated baseline is pinned at codex/graphics-baseline (PR #16); do not merge it into main merely to activate automation. GitHub Pages serves main directly. The old local 0.6.81 checkout must not be used.

## Implemented path

`graphics-loop.yml` runs on trusted main, manually for the first bootstrap, when Codex updates its review summary or posts a receipt on the active PR, and on a fallback schedule. Both `GRAPHICS_LOOP_ENABLED=true` and an enabled reviewed catalog are required. It shares repository-wide concurrency with the existing minimal pilot.

The catalog binds one approved Issue's exact title/body digest and 1–4 existing UI JS/CSS files. An atomic GitHub file update on `factory/graphics-state` reserves a running round before invoking Claude. The generator reuses the existing pinned official Claude Action/CLI launcher, subscription OAuth only, no tools, no candidate checkout, no GitHub credential in the model subprocess. Candidate files are JSON data. A separate runner overlays the scoped files on trusted base and runs regression in a secret-free, non-root, no-network Docker container. The data-only publisher advances a dedicated branch and creates a draft PR.

The publisher saves the new PR head and marks the draft ready for Codex. During a repair it returns the PR to draft before updating the branch. Enable automatic code review for all PRs in the repository. The ready event has been verified with a maintainer action on PR #22. Verify the same event from the Actions publisher before relying on it. The coordinator reads official reviews and inline comments only from `chatgpt-codex-connector[bot]` for that exact current head. Findings trigger another Claude proposal on the same branch. Initial implementation plus at most three repair rounds. A clean/empty review goes to human/visual acceptance; it never means automatic approval, merge or deployment.

## Intentional limits

- This bounded zero-tool generator can edit small existing UI modules, not autonomously generate binary artwork, inspect screenshots or restructure the whole monolithic UI. It receives the Issue and source as text. Shared PNGs are available to human and interactive agents, but this generator does not fetch them. Use the reference-derived acceptance criteria; actual visual matching still requires screenshot review. Do not claim automatic visual acceptance.
- Only one catalog task is active. After its PR is reviewed/merged, prepare the next scope and snapshot; the twelve Issues are a backlog, not twelve concurrently running agents.
- Failed/uncertain runs leave `running` reserved. Never automatically rerun a charged invocation, delete the reservation, or recreate a missing initialized state. Reconcile official run, branch, PR and checkpoint first. Changes to main/Issue/catalog stop the loop.
- Source regression is not independent proof of correctness. The trusted tests run in the same language runtime as candidate JS. Browser checks and screenshots remain separate and must name their SHA.

## One-time activation

1. Review/merge only the control workflow PR into main. Keep graphics baseline PR #16 unmerged. Candidate PRs target codex/graphics-baseline, never main; the verifier checks out its pinned SHA in a separate candidate directory. This control-only change does not modify the game files served by Pages. Retain required branch/workflow protection; restrict state branch writes to trusted maintainers/coordinator. No auto merge is provided.
2. In this repo only, register `CLAUDE_CODE_OAUTH_TOKEN` from the owner's `claude setup-token`. Never paste it in chat or transfer another repo's secret. No API-key fallback.
3. In [Codex Code Review settings](https://chatgpt.com/settings/code-review), connect Min-Konny/loopkeeper and enable review. Verify a real manual `@codex review` works; bot-to-bot requests and draft PR behavior must be proven during the pilot, not assumed.
4. Confirm Actions can write contents, issues and PRs. Review catalog paths and exact Issue snapshot, add `factory:approved` to that Issue, set its SHA256(title + newline + body) in the catalog, and enable the catalog in a reviewed commit. Do not change Issue reference links afterward without reapproval.
5. Set `GRAPHICS_LOOP_ENABLED=true`; dispatch `Graphics Claude Codex Loop` once with bootstrap=true. Later runs use bootstrap=false. Missing state after bootstrap is an incident, not a fresh start.
6. Confirm actual Claude model evidence, isolated regression, one draft PR and exact-head Codex review. A real finding and repair/re-review is needed to demonstrate the return path. Only after this evidence call the loop operational.

The pilot authenticated Claude, published a title repair and verified Codex review triggered by an Actions-authored ready event (run 43423734927). Scheduled runs have read the resulting human acceptance checkpoint.

Read-only setup audit on 2026-11-13 found no repository Actions secrets or variables. Actions default token permission is read and `can_approve_pull_request_reviews` is false, this setting was subsequently enabled for this repository on 2026-11-13. Default token permission remains read. The workflow declares job-specific scopes; there is no need to broaden every workflow's default token permission.

- [Repository Actions secrets](https://github.com/Min-Konny/loopkeeper/settings/secrets/actions)
- [Repository Actions permissions](https://github.com/Min-Konny/loopkeeper/settings/actions)
- [Codex review connection](https://chatgpt.com/settings/code-review)

Previous stacked implementation validation: 491 tests passed, zero failed, one Windows-inapplicable test skipped. The revised control-only branch passes eight focused tests; full GitHub-hosted regression is checked separately. Includes a mocked implementation/review/repair round trip and rejection of stale reviews, duplicate running jobs, unauthorized reviewers, scope escapes and revoked approval. YAML parsing and all embedded GitHub JavaScript syntax checks passed. These are local tests, not evidence of authenticated model execution.

Official reference: https://learn.chatgpt.com/docs/third-party/github

Observed Minsai PR #6: Codex can report a clean result through a bot-authored summary comment rather than a formal review. The coordinator accepts only the observed structured v1 summary with exact full HEAD SHA, completed status and both findings flags false, and stops for human checks. Unknown formats or ordinary prose wait; this is not a guaranteed public schema.

## Publication separation (2026-11-13)
The control workflow is installed on main, but the source and PR target are fixed to codex/graphics-baseline at an approved immutable SHA. Both control-main and integration-base changes stop the current task. This supersedes the earlier instruction to merge the graphics baseline before activation. The control-only PR replaces stacked PR #17. Main/game content, Pages source settings and the live game remain unchanged by activation preparation.


## Screen rollout (2026-11-15)

All twelve screens are in scope, in issue order. The coordinator operates on one Issue at a time. Confirm the scope and activate the next catalog entry after the current candidate reaches its review checkpoint. Candidates continue to target the graphics integration branch.

| Issue | Screen |
| --- | --- |
| #4 | Title (visual review pending) |
| #5 | Base dashboard |
| #6 | Work and action queue |
| #7 | Village and construction |
| #8 | Equipment and inventory |
| #9 | Party and training |
| #10 | Exploration |
| #11 | Raids and battle |
| #12 | Augments |
| #13 | Inheritance |
| #14 | Generation results |
| #15 | Records and achievements |

The dashboard pilot owns only the dashboard markup and stylesheet. Keep the enemy-art call compatible with PR #28. At 1280x720 and 1920x1080 the village, enemy preview and usual queue must be visible together without page scrolling. Longer queues or translations can scroll inside the corresponding panel. Review the layout against 02-dashboard.png before integrating.

For a future village ambience pass, see [SpriteCook's tree wind guide](https://www.spritecook.ai/blog/pixel-art-trees-wind-animation). Anchor the trunk, move canopy clumps by whole pixels and stagger gusts with pauses. Keep this work separate from the dashboard layout pilot.
