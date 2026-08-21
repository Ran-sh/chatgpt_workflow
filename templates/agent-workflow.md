# Agent Handoff Protocol

## 1. Authority model

GitHub is the shared source of truth.

The machine-readable active task is:

`docs/agent-tasks/ACTIVE_TASK.json`

It is the only task authority. Executor names never grant permissions. Codex, ZCode, Claude Code, DeepSeek Harness, or another compatible executor may run the same task.

If the active task is missing or invalid, stop. Do not infer work from chat history, issues, old result reports, source code, or another executor's prior task files.

## 2. Modes

- `IMPLEMENT` — implementation changes only inside `allowed_changes`.
- `TEST_ONLY` — validation/reporting only. Writable paths are limited to `docs/agent-results/**`.
- `REVIEW_ONLY` — inspection/reporting only. Writable paths are limited to `docs/agent-results/**`.

The Task Contract, not the executor adapter, determines scope. Read-only modes cannot grant themselves source/test/config write access through `allowed_changes`.

## 3. Source revision

Before executing, resolve `source_branch` and `source_commit` from the Task Contract and confirm the working copy matches the requested source revision. A symbolic value such as `LATEST_DEFAULT_BRANCH` is valid only when the task explicitly uses it and the executor resolves it before work begins.

Do not silently switch branches, reset, clean, stash, overwrite, or discard unrelated user changes.

## 4. Scope and safety

- Modify only paths authorized by `allowed_changes`.
- Treat `forbidden_changes` as hard prohibitions.
- Everything not authorized is read-only.
- `result_contract` must be inside `docs/agent-results/**` and must itself appear in `allowed_changes`.
- Never expose credentials, tokens, cookies, private keys, signed URLs, secret environment values, or sensitive local paths in reports.
- Do not invent build, test, lint, typecheck, release, or project commands. Use only commands established by repository facts or the Task Contract.
- Preserve dirty worktrees and unrelated changes.

## 5. Validation statuses

When reporting validation, use only:

`PASS`, `FAIL`, `PARTIAL`, `SKIP`, `BLOCKED`, `NOT RUN`

Do not rename these statuses.

## 6. Execution lifecycle

1. Pull/fetch the requested target branch using repository policy.
2. Read this workflow.
3. Read and validate `docs/agent-tasks/ACTIVE_TASK.json`.
4. Confirm source revision and working-tree safety.
5. Execute only the authorized scope.
6. Run every required validation or report why it is `BLOCKED`, `SKIP`, or `NOT RUN`.
7. Write the required Result Contract/report.
8. Verify completion against `acceptance_criteria`.
9. When `delete_active_task_on_completion` is true and completion has actually occurred, remove `ACTIVE_TASK.json` and remove `ACTIVE_TASK.md` too if it exists and is listed in `completion_commit_contract`.
10. Commit/push only paths allowed by `completion_commit_contract` and repository policy.

`completion_commit_contract` must include the Result Contract and `docs/agent-tasks/ACTIVE_TASK.json`. If task metadata says a human companion was generated, it must include `docs/agent-tasks/ACTIVE_TASK.md` as well.

## 7. Result handoff

The Result Contract must identify the task/source revision, execution status, changed files, validation outcomes, blockers, and report path required by the project schema. `result_path` is kept under `docs/agent-results/**`.

ChatGPT or another orchestrator may then inspect the committed result and issue the next task. Executors should not self-assign follow-up work unless a new Task Contract explicitly authorizes it.

## 8. Human companion

`docs/agent-tasks/ACTIVE_TASK.md` may be generated for readability. It is non-authoritative. If Markdown and JSON disagree, `ACTIVE_TASK.json` wins.

## 9. Installation and removal

Workflow installation must not create an ACTIVE task. Workflow removal must be ownership-based using `docs/.agent-workflow-install.json` and must refuse to proceed while an ACTIVE task exists.
