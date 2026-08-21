# One-Command Uninstall Prompt

Use this when preparing a project to remove the Agent Workflow infrastructure:

```text
Remove the Agent Workflow from this repository by following `Ran-sh/chatgpt_workflow/install/UNINSTALL_GUIDE.md`.

Requirements:
1. Read `docs/.agent-workflow-install.json` first.
2. Remove only files explicitly owned under `created_files` in that manifest.
3. Never automatically delete or revert anything under `modified_files`.
4. If the manifest is missing, invalid, ambiguous, or does not identify `Ran-sh/chatgpt_workflow`, stop and report BLOCKED. Do not infer ownership from filenames.
5. Confirm there is no active task still in progress. If there is, stop and report it.
6. Preserve any result reports the project explicitly wants to keep.
7. Do not modify business source, product configuration, existing tests, normal CI, release logic, or unrelated documentation.
8. Remove the installation manifest last.
9. Run the target project's normal release validation after removal.
10. Follow the repository's branch/PR policy and do not bypass protection rules.

Report only:
Target Repository:
Source Commit:
Workflow Version:
Files Removed:
Files Retained:
Modified Pre-existing Files Requiring Review:
Release Validation:
Result Commit / PR:
Blocked Items:
```

## Short form

```text
Uninstall the Agent Workflow from this repository using its `docs/.agent-workflow-install.json` ownership manifest and `Ran-sh/chatgpt_workflow/install/UNINSTALL_GUIDE.md`. Remove only workflow-owned created files, never guess ownership or revert pre-existing files, then run the project's normal release validation.
```
