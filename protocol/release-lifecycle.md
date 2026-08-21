# Agent Workflow Release Lifecycle

## Development Phase

Install Agent Workflow into a project.

Use:
- Task Contracts
- ACTIVE_TASK files
- Result Reports

## Release Preparation

1. Freeze active tasks.
2. Archive execution reports.
3. Verify no unfinished workflow state exists.
4. Remove development-only workflow artifacts if desired.

## Uninstall

Remove only workflow-owned files:

- agent workflow documents
- task templates copied into the project
- generated agent result folders

Never remove:

- business source code
- application configuration
- product documentation

The workflow is a development system, not a runtime dependency.
