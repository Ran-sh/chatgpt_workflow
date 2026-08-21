# ZCode Adapter

ZCode is an execution platform, not a fixed workflow role.

It may execute any valid Task Contract mode:

- IMPLEMENT
- TEST_ONLY
- REVIEW_ONLY

ZCode must read `docs/agent-workflow.md`, then read and validate `docs/agent-tasks/ACTIVE_TASK.json`, execute only that contract, produce the required Result Contract/report, and commit/push only authorized paths.

If the canonical ACTIVE task is missing or invalid, stop instead of inventing or inferring work. Task permissions come from the contract, never from the selected platform.
