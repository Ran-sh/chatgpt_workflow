# Changelog

## 1.8.0

- Refocused the workflow on ChatGPT as the GitHub-side orchestrator and Codex/ZCode/Claude Code/DeepSeek Harness as interchangeable remote executors.
- Added the explicit orchestrator/executor boundary and local-execution handoff rules.
- Standardized the user-facing executor trigger to a short repository/branch/task-file handoff instead of duplicating task details in chat.
- Changed generated queued tasks to use `source_commit: LATEST` by default, with explicit SHA pinning still available for immutable execution.
- Added `metadata.prepared_from_commit` to preserve the task-preparation baseline for audit.
- Added Result Contract v2 with `schema_version: 2`, second-precision timezone-aware execution timelines, and validator-owned `result_validation` evidence.
- Added `validator --stamp`, which validates a draft result, writes PASS/command/validated_at/evidence itself, then validates the stamped final contract before writing it.
- Preserved backward compatibility for legacy Result Contract v1 files without `schema_version`; historical results remain valid and do not need rewriting.
- Added regression coverage for queued task source semantics, Result v2 stamping, timestamp precision/order, and legacy v1 compatibility.
- Simplified the README around the actual user experience: ChatGPT changes GitHub, remote executor performs real local work, Result Contract returns to GitHub, ChatGPT continues.
- Verified the full workflow end to end on `Ran-sh/dsh-vision`, including real local execution, Result v2 timeline evidence, validator stamping, legacy v1 validation, and ACTIVE task cleanup.

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
