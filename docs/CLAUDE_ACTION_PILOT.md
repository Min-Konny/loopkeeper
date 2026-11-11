# Official Claude Action pilot (disabled until reviewed activation)

The generate job uses reviewed v1 commit 4fa93a88de49bbef68b10eb15aabedf28ca0e1ed with claude_code_oauth_token. It does not directly call Agent SDK. The locked SDK package is retained solely to supply the exact official Linux CLI 2.1.322 (SHA256 checked), satisfying the requested >=2.1.321.

## Exact zero-tool behavior
The official Action parser turns spaced `--tools ""` into a missing value. Use `--tools=""` instead: the unchanged upstream parser plus real SDK serializer produces `--tools=`. A secret-free real CLI initialization test verifies tools/MCP/skills/slash_commands all empty. Do not add --json-schema: it adds a StructuredOutput tool even when tools is empty. Prior typed SDK option tests did not prove the absence of that synthetic tool.

A trusted launcher rejects unknown or duplicate options, nonempty MCP, settings other than disableAllHooks, plugins, additional dirs, resume and schema. The model child runs in a new empty cwd/HOME with only fixed PATH, HOME, CLAUDE_CONFIG_DIR and OAuth. This is an argv/environment boundary, not an OS/network sandbox. The Action parent still holds its read-only GitHub token. Action git setup cannot grant write permission; no candidate checkout occurs in generate. Fresh HOME receives disableAllHooks via mandatory CLI settings, not by inheriting Action settings.

## Model evidence
Loop only is pinned to claude-fable-5-2. The post-step checks CLI exact version, empty tools, successful result, actual assistant model and matching positive modelUsage. An init label alone is not evidence of model use. Raw responses/credentials are not uploaded; only a validated proposal JSON is passed onward. Ordinary text JSON is parsed strictly; markdown or malformed output fails closed. The first authenticated pilot must pass and expose only allowlisted model/version metadata.

## Preserved boundaries and remaining steps
Owner-only exact issue digest/main SHA/approved paths, atomic single reservation, bounded four-file output, separate secret-free isolated regression and data-only draft publisher remain. No automatic merge, deployment, paid API fallback, or extra permissions. Factory remains disabled.
Need reviewed main merge, repository-scoped OAuth secret supplied by the owner, verified Actions PR/write and protected-control settings, explicit activation, and one authenticated pilot. No authenticated model request has been made by these tests. OAuth availability/usage allowance is not inferred from API pricing.
Official API release notes identify Fable5.2 at $8 input/$40 output per million tokens (https://platform.claude.com/docs/en/release-notes/overview); that is not an OAuth subscription charge estimate.
