# Minimal Executor Trigger

Use this after ChatGPT has generated `docs/agent-tasks/ACTIVE_TASK.json`.

```text
Execute ACTIVE_TASK.json according to Agent Workflow Protocol.
Return Result Contract when complete.
```

## Purpose

The trigger starts execution only. The Task Contract remains the single source of truth.

Do not put project requirements, implementation details, validation steps, or permissions into this trigger. They belong in `ACTIVE_TASK.json`.

Compatible executors:

- Codex
- ZCode
- Claude Code
- DeepSeek Harness
- Any future compatible executor
