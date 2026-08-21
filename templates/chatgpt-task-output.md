# ChatGPT Task Handoff Output

Use this presentation when ChatGPT has created and committed an ACTIVE Task for remote execution.

Do not duplicate the task body in the chat message.

## Default output

```text
Task is ready in GitHub.

Execute ACTIVE_TASK.json according to Agent Workflow Protocol.
```

If the user prefers Chinese:

```text
任务已经写入 GitHub。

执行 ACTIVE_TASK.json，按 Agent Workflow Protocol 完成即可。
```

## After execution

The user can return with a short completion signal:

```text
Codex finished. Check GitHub.
```

or:

```text
Codex 做完了，检查 GitHub。
```

ChatGPT then reads the Result Contract and repository state directly.

## Rule

The chat trigger starts execution. `ACTIVE_TASK.json` defines execution.
