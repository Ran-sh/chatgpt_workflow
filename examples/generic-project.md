# Generic Project Example

A new project follows this lifecycle:

1. Install the workflow snapshot with `agent-workflow install .` or the universal install prompt.
2. Confirm installation created `docs/agent-workflow.md`, machine schemas/validator, templates, and `docs/.agent-workflow-install.json` — but no ACTIVE task.
3. When work is assigned, generate the one authoritative task at `docs/agent-tasks/ACTIVE_TASK.json` with `agent-workflow task create ...` or create an equivalent schema-valid contract.
4. Any compatible executor (Codex, ZCode, Claude Code, DeepSeek Harness, or another platform) reads the same workflow and same ACTIVE Task Contract.
5. The executor validates the task, performs only authorized scope, writes the required Result Contract under `docs/agent-results/**`, removes the ACTIVE task/companion on completion, and commits only the completion contract paths.
6. The coordinator validates the result and decides the next task.
7. Before release, either keep the development workflow or remove it with `agent-workflow uninstall .` / the universal uninstall prompt. Uninstall is ownership-based and refuses to run while an ACTIVE task exists.

The workflow is platform-neutral: tasks define permissions; executors are interchangeable.
