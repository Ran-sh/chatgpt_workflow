# Agent Task Contracts

Task Contracts define work. They do not define which executor must perform it.

Supported modes:

- `IMPLEMENT` — code or documentation changes explicitly allowed by the task scope.
- `TEST_ONLY` — validation and reporting only unless the contract explicitly authorizes another path.
- `REVIEW_ONLY` — inspection, analysis, and reporting only unless the contract explicitly authorizes another path.

Any compatible executor (Codex, ZCode, Claude Code, DeepSeek Harness, or another platform) may execute any mode if the Task Contract authorizes it.

## Active task

The canonical active task is:

`docs/agent-tasks/ACTIVE_TASK.json`

It is machine-readable and authoritative. `ACTIVE_TASK.md` may exist only as a non-authoritative human companion.

Do not create an ACTIVE task during workflow installation.

If the active task is missing or invalid, the executor must stop instead of inferring work from chat history, old reports, issues, source code, or another executor's files.

## Generate a task

With the CLI:

```bash
agent-workflow task create \
  --mode TEST_ONLY \
  --objective "Run the targeted release retest" \
  --validate "npm test" \
  --accept "All required checks are reported" \
  --companion
```

The generator attempts to read the current Git branch and exact commit. They can be supplied explicitly with `--source-branch` and `--source-commit`.

For `IMPLEMENT`, at least one `--allow` path is required. For `TEST_ONLY` and `REVIEW_ONLY`, the default writable path is the generated Result Contract only.

The generator refuses to replace an existing ACTIVE task and validates the generated JSON before making it active.

## Manual template

`TEMPLATE_TASK.json` is a schema-valid platform-neutral scaffold for cases where a task is authored without the CLI. Replace every placeholder with repository-specific facts before activating it.

## Source of authority

Permissions come only from the active Task Contract, especially:

- `mode`;
- `source_branch` and `source_commit`;
- `objective` and `context`;
- `allowed_changes`;
- `forbidden_changes`;
- `validation`;
- `acceptance_criteria`;
- `result_contract`;
- `completion_commit_contract`.

Executor adapters may document platform-specific startup or environment details, but they must not grant or remove task permissions.
