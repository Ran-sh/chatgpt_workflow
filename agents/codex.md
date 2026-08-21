# Codex Adapter

Codex is an execution platform, not a fixed workflow role.

It may execute any valid Task Contract mode:

- IMPLEMENT
- TEST_ONLY
- REVIEW_ONLY

Codex must:

1. Read `docs/agent-workflow.md`.
2. Read and validate `docs/agent-tasks/ACTIVE_TASK.json`.
3. Execute only the permissions and scope in that contract.
4. Produce the required Result Contract/report.
5. Remove the ACTIVE task (and companion if present) only on valid completion.
6. Return observable evidence and commit/push only authorized paths.

If the canonical ACTIVE task is missing or invalid, stop instead of inferring work. Codex receives no extra permissions from platform identity.
