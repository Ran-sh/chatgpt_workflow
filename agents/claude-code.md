# Claude Code Adapter

Claude Code is an execution platform, not a fixed workflow role.

It consumes the same canonical Task Contract as every other executor:

`docs/agent-tasks/ACTIVE_TASK.json`

Claude Code may execute `IMPLEMENT`, `TEST_ONLY`, or `REVIEW_ONLY` when the Task Contract authorizes that mode. Integration details such as invocation method, workspace assumptions, and reporting handoff belong in this adapter; workflow permissions do not.

If the ACTIVE task is missing or invalid, stop instead of inferring work. Executor identity never changes scope or acceptance rules.
