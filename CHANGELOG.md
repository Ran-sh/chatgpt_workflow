# Changelog

## 1.7.0

- Added `agent-workflow task create` for non-interactive, machine-readable ACTIVE Task generation.
- Added automatic Git source branch/commit detection with explicit override flags.
- Added safe mode behavior: `IMPLEMENT` requires explicit writable scope; `TEST_ONLY` and `REVIEW_ONLY` default writable scope to the Result Contract only.
- Added generated Task validation before activation and refusal to overwrite an existing ACTIVE task.
- Added optional non-authoritative `ACTIVE_TASK.md` human companion.
- Added schema-valid `TEMPLATE_TASK.json` and install support for the machine task scaffold.
- Unified all executor triggers on `docs/agent-tasks/ACTIVE_TASK.json`; removed executor-specific ACTIVE task naming from canonical triggers.
- Strengthened the project workflow protocol around authority, source revisions, scope, dirty worktrees, validation statuses, result handoff, and executor neutrality.
- Added uninstall blocking when an ACTIVE task is present and verification that the ownership manifest identifies this workflow source.
- Expanded lifecycle tests for task generation, duplicate-task protection, IMPLEMENT scope requirements, and uninstall safety.

## 1.6.0

- Added executable zero-dependency `agent-workflow` CLI.
- Added `install`, `validate task`, `validate result`, and `uninstall` commands.
- Added conservative project detection for language, package manager, configured package scripts, and GitHub Actions files.
- Added ownership-based installation manifest with `generated_files` and `generated_dirs`.
- Added lifecycle smoke tests that verify install/validate/uninstall behavior and preservation of pre-existing project content.
- Updated CI to exercise the CLI and check version consistency.
- Removed the executor-specific DeepSeek Harness task template; executor choice is no longer encoded as a task type.
- Added platform-neutral task-template README and aligned install/uninstall documentation with the machine-readable ownership contract.

## 1.5.0

- Added machine-readable Task and Result contracts.
- Added canonical zero-dependency contract validation.
- Added installation/removal guidance and ownership-manifest concepts.
- Added agent-neutral executor adapters and reference examples.
