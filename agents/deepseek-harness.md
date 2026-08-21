# DeepSeek Harness Adapter

DeepSeek Harness is an execution platform, not a workflow role.

It follows the same protocol and may execute any valid Task Contract mode:

- IMPLEMENT
- TEST_ONLY
- REVIEW_ONLY

Runtime/provider details belong in this adapter only. The executor must read `docs/agent-workflow.md` and the canonical `docs/agent-tasks/ACTIVE_TASK.json`, validate the contract, and obey its source revision, scope, validation, acceptance, result, and completion rules.

If the ACTIVE task is missing or invalid, stop. Provider/runtime identity never grants task permissions.
