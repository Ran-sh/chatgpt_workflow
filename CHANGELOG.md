# Changelog

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
