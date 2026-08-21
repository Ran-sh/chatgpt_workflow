# Uninstall / Release Removal Guide

The Agent Workflow is development infrastructure, not a product runtime dependency. A project may keep it or remove it before a public/production release.

## Safety rule

Uninstall from the installation ownership manifest, never from guessed path names.

Expected manifest:

`docs/.agent-workflow-install.json`

The v1.6+ manifest records:

- `source_repository`
- `workflow_version`
- `generated_files`
- `generated_dirs`
- detected project facts

Only `generated_files` are automatically eligible for file removal. A `generated_dirs` entry may be removed only if it is empty after owned files are deleted. Pre-existing/unmanaged files and directories are never inferred to be workflow-owned.

## Preconditions

Before uninstalling:

1. Confirm there is no active task still in progress.
2. Archive or explicitly retain any result reports the project wants to preserve.
3. Confirm the working tree has no unrelated user changes that would be affected by the release operation.
4. Read `docs/.agent-workflow-install.json` and verify `source_repository` identifies `Ran-sh/chatgpt_workflow`.
5. Inspect every planned deletion.

If the manifest is missing, corrupt, ambiguous, unsafe, or does not clearly identify ownership, stop with `BLOCKED`. Do not guess which files belong to the workflow.

## Removal procedure

1. Remove only manifest-owned `generated_files`.
2. Remove an ACTIVE task only after confirming the task is finished or intentionally abandoned.
3. Remove only manifest-owned `generated_dirs` that are empty after file removal.
4. Never delete project source, existing tests, product configuration, normal CI, release logic, or unrelated project documentation.
5. Remove `docs/.agent-workflow-install.json` last.
6. Run the project's normal release validation after removal.
7. Commit through the repository's normal branch/PR policy.

For v1.6+ CLI installations, the canonical command is:

```bash
agent-workflow uninstall .
```

## Keep vs remove

A release may choose either policy:

- **Keep workflow** — useful for open-source or continuously maintained projects. The workflow remains development-only infrastructure.
- **Remove workflow** — useful when the release repository/artifact should contain only product-facing material.

There is no requirement to remove the workflow if it does not affect the runtime or packaged artifact.

## Final uninstall report

Report:

- Target repository
- Source commit before removal
- Manifest workflow version
- Files removed
- Directories removed
- Files/directories intentionally retained
- Release validation executed
- Result commit / PR
- Blocked items
