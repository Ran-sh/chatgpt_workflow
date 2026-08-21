# Short Triggers

All compatible executors use the same task path and the same permissions. Executor choice never changes the task contract.

## Canonical trigger

```text
Pull the latest target branch. Read `docs/agent-workflow.md`, then read and validate `docs/agent-tasks/ACTIVE_TASK.json`. Execute exactly that task and do not expand scope. Write the required Result Contract/report, remove `ACTIVE_TASK.json` and its `ACTIVE_TASK.md` companion if present only when the task is complete, and commit/push only paths authorized by the Task Contract. If the ACTIVE task is missing or invalid, stop instead of inferring work from chat history, issues, old reports, or another executor.
```

Use this same trigger with Codex, ZCode, Claude Code, DeepSeek Harness, or any future compatible executor.

## Human companion

`docs/agent-tasks/ACTIVE_TASK.md` may exist as a non-authoritative human-readable companion. If it conflicts with `ACTIVE_TASK.json`, the JSON Task Contract wins. When the task completes, remove the companion together with the JSON task if the completion contract includes it.
