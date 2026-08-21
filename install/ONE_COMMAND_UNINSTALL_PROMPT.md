# One-Command Uninstall Prompt

Use this when preparing a project to remove the Agent Workflow infrastructure:

```text
Remove the Agent Workflow from this repository using the installation ownership manifest and the latest stable uninstall guidance from `Ran-sh/chatgpt_workflow`.

Requirements:
1. Read `docs/.agent-workflow-install.json` first.
2. Confirm `source_repository` identifies `Ran-sh/chatgpt_workflow` and the manifest is valid enough to determine ownership.
3. Remove only files explicitly listed in `generated_files`.
4. Remove only directories explicitly listed in `generated_dirs`, and only when they are empty after owned files are removed.
5. Never infer ownership from filenames or directory names. Preserve all pre-existing and unmanaged files/directories.
6. If the manifest is missing, invalid, ambiguous, or unsafe, stop and report BLOCKED rather than guessing.
7. Confirm there is no ACTIVE task still in progress. If there is, stop and report it.
8. Preserve result reports the project explicitly wants to keep by removing them from the owned removal set before cleanup and documenting that decision.
9. Do not modify business source, product configuration, existing tests, normal CI, release logic, or unrelated documentation.
10. Remove the installation manifest last.
11. Run the target project's normal release validation after removal.
12. Follow the repository's branch/PR policy and do not bypass protection rules.

Report only:
Target Repository:
Source Commit:
Workflow Version:
Files Removed:
Directories Removed:
Files/Directories Preserved:
Release Validation:
Result Commit / PR:
Blocked Items:
```

## Short form

```text
Uninstall the Agent Workflow from this repository using `docs/.agent-workflow-install.json`. Remove only `generated_files` and empty `generated_dirs`, never guess ownership, preserve unmanaged project content, then run the project's normal release validation.
```

## CLI equivalent

For a workflow installed by the v1.6+ CLI:

```bash
agent-workflow uninstall .
```
