# Uninstall / Release Removal Guide

The Agent Workflow is development infrastructure, not a product runtime dependency. A project may remove it before a public or production release when desired.

## Safety rule

Uninstall from the installation ownership manifest, not from guessed path names.

Expected manifest:

`docs/.agent-workflow-install.json`

Only files listed under `created_files` are automatically eligible for removal. Files listed under `modified_files` must never be deleted or reverted automatically; review them manually because they existed before workflow installation.

## Preconditions

Before uninstalling:

1. Confirm there is no active task still in progress.
2. Archive or retain any result reports the project wants to preserve.
3. Confirm the working tree has no unrelated user changes that would be overwritten.
4. Read `docs/.agent-workflow-install.json` and verify it belongs to `Ran-sh/chatgpt_workflow`.
5. Inspect every planned deletion.

If the manifest is missing, corrupt, or does not clearly identify ownership, stop with `BLOCKED`. Do not guess which files belong to the workflow.

## Removal procedure

1. Remove only manifest-owned `created_files` that still contain workflow infrastructure.
2. Remove any ACTIVE task file only after confirming the task is finished or intentionally abandoned.
3. Do not delete project source, existing tests, product configuration, normal CI, release logic, or project documentation that was not created by the workflow installer.
4. Remove `docs/.agent-workflow-install.json` last.
5. Run the project's normal release validation after removal.
6. Commit through the repository's normal branch/PR policy.

## Keep vs remove

A release may choose either policy:

- **Keep workflow** — useful for open-source or continuously maintained projects. The workflow remains development-only documentation/tooling.
- **Remove workflow** — useful when the release artifact/repository should contain only product-facing material.

There is no requirement to remove the workflow if it does not affect runtime/package output.

## Final uninstall report

Report:

- Target repository
- Source commit before removal
- Manifest workflow version/source commit
- Files removed
- Files intentionally retained
- Modified pre-existing files requiring manual review
- Release validation executed
- Result commit / PR
- Blocked items
