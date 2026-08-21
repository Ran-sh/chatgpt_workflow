# Agent Task Contracts

Task templates define work. They do not define which executor must perform it.

Supported modes:

- `IMPLEMENT` — code or documentation changes explicitly allowed by the task scope.
- `TEST_ONLY` — validation and reporting only; no implementation changes unless the task explicitly says otherwise.
- `REVIEW_ONLY` — inspection, analysis, and reporting only.

Any compatible executor (Codex, ZCode, Claude Code, DeepSeek Harness, or another platform) may execute any mode if the Task Contract authorizes it.

## Active task

A project should use one platform-neutral active task contract, normally:

- `docs/agent-tasks/ACTIVE_TASK.json` for machine execution; and optionally
- `docs/agent-tasks/ACTIVE_TASK.md` as a human-readable companion.

Do not create an ACTIVE task during workflow installation.

If the active task is missing, the executor must stop instead of inferring work from chat history, old reports, issues, or another executor's files.

## Source of authority

Permissions come only from the active Task Contract, especially:

- mode;
- source commit/ref;
- objective;
- allowed changes;
- forbidden changes;
- validation requirements;
- result contract.

Executor adapters may document platform-specific startup or environment details, but they must not grant or remove task permissions.
