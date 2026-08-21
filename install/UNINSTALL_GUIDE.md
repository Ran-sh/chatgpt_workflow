# Workflow Uninstall Guide

Purpose: remove workflow infrastructure before project release if required.

Steps:

1. Stop creating new ACTIVE tasks.
2. Archive completed task results if needed.
3. Remove project-local workflow files:
   - docs/agent-workflow.md
   - docs/agent-tasks/
   - docs/agent-results/
4. Remove CI checks dedicated only to workflow validation.
5. Keep normal project documentation and history.

Uninstall must never remove source code or business logic.
