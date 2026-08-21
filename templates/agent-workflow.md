# Agent Handoff Protocol

## 1. Operating model

GitHub is the durable source of truth. ChatGPT is the orchestrator; Codex, ZCode, Claude Code, DeepSeek Harness, and other compatible agents are remote execution platforms.

The intended loop is:

```text
User request
  -> ChatGPT inspects/changes GitHub directly
  -> local or real-environment work remains
  -> ChatGPT commits ACTIVE_TASK.json
  -> user sends one short executor trigger
  -> executor performs the task and commits a Result Contract
  -> ChatGPT reads GitHub and continues
```

Do not create executor work for repository operations ChatGPT can already complete safely through GitHub.

## 2. Task authority

The machine-readable active task is:

`docs/agent-tasks/ACTIVE_TASK.json`

It is the only task authority. Executor names never grant permissions.

If the active task is missing or invalid, stop. Do not infer work from chat history, issues, old result reports, source code, or a previous executor's task.

The normal user-facing trigger is intentionally minimal:

```text
Execute ACTIVE_TASK.json according to Agent Workflow Protocol.
```

Project requirements must not be duplicated into the trigger.

## 3. Modes

- `IMPLEMENT` — implementation changes only inside `allowed_changes`.
- `TEST_ONLY` — validation/reporting only. Writable paths are limited to `docs/agent-results/**`.
- `REVIEW_ONLY` — inspection/reporting only. Writable paths are limited to `docs/agent-results/**`.

The Task Contract, not the executor, determines scope.

## 4. Source revision

Before executing, resolve `source_branch` and `source_commit` from the Task Contract and confirm the working copy matches the requested revision.

`source_commit: LATEST` means: after fetching/pulling according to repository policy, resolve and execute the current tip of `source_branch`, and record the exact SHA actually used in the Result Contract. This is the normal value for a queued task committed to the same branch because the task commit itself moves the branch tip.

Use an explicit commit SHA only when the orchestrator intentionally wants execution pinned to that immutable revision. Other explicitly documented symbolic values may be used when the project workflow defines their resolution semantics.

Do not silently reset, clean, stash, overwrite, or discard unrelated user changes.

## 5. Scope and safety

- Modify only paths authorized by `allowed_changes`.
- Treat `forbidden_changes` as hard prohibitions.
- Everything not authorized is read-only.
- `result_contract` must be inside `docs/agent-results/**` and must appear in `allowed_changes`.
- Never expose credentials, tokens, cookies, private keys, signed URLs, secret environment values, or sensitive local paths.
- Do not invent build, test, lint, typecheck, release, or project commands.
- Preserve dirty worktrees and unrelated changes.

## 6. Validation statuses

Use only:

`PASS`, `FAIL`, `PARTIAL`, `SKIP`, `BLOCKED`, `NOT RUN`

Never convert an unexecuted or blocked check into PASS.

## 7. Execution lifecycle

1. Read this workflow.
2. Read and validate `docs/agent-tasks/ACTIVE_TASK.json`.
3. Confirm source revision and worktree safety.
4. Execute only the authorized scope in the real environment.
5. Run every required validation or record why it is `BLOCKED`, `SKIP`, or `NOT RUN`.
6. Write the required Result Contract/report.
7. Verify completion against `acceptance_criteria`.
8. When completion is real and `delete_active_task_on_completion` is true, remove `ACTIVE_TASK.json` and its companion when required.
9. Commit/push only paths allowed by `completion_commit_contract` and repository policy.
10. Stop. Do not self-assign follow-up work.

`completion_commit_contract` must include the Result Contract and `docs/agent-tasks/ACTIVE_TASK.json`. If task metadata says a human companion was generated, include `docs/agent-tasks/ACTIVE_TASK.md` too.

## 8. Result handoff

The Result Contract must identify the task/source revision, execution status, changed files, validation outcomes, blockers, and result path required by the project schema.

After execution, the user may simply tell ChatGPT that the executor is finished. ChatGPT should inspect GitHub directly, evaluate the result, and decide the next action.

## 9. Orchestrator boundary

ChatGPT should create an ACTIVE Task only for work it cannot actually complete through GitHub or that requires the user's real execution environment, credentials, devices, runtime, or release tooling.

Repository edits that ChatGPT can safely perform through GitHub should be performed directly rather than delegated by default.

## 10. Installation and removal

Workflow installation must not create an ACTIVE task. Workflow removal must be ownership-based using `docs/.agent-workflow-install.json` and must refuse to proceed while an ACTIVE task exists.
