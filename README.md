# ChatGPT Workflow

A GitHub-centered remote execution workflow: **ChatGPT acts as the orchestrator; Codex, ZCode, Claude Code, DeepSeek Harness, or another compatible agent acts as the remote executor when real local execution is required.**

Current version: **1.7.0**

## The goal

The user should be able to work like this:

```text
User request
   ↓
ChatGPT inspects the repository and changes what it can through GitHub
   ↓
Something requires the user's real machine/runtime/account/device/release environment
   ↓
ChatGPT writes and commits docs/agent-tasks/ACTIVE_TASK.json
   ↓
User sends one short message to Codex or another executor
   ↓
Executor runs the task locally and commits the Result Contract
   ↓
User says "finished"
   ↓
ChatGPT reads GitHub, reviews the result, and continues
```

The workflow is designed to minimize manual relaying between ChatGPT and the execution agent.

## Three core rules

1. **ChatGPT is the orchestrator.** It analyzes, makes GitHub-side changes, creates tasks only when remote execution is actually needed, reviews results, and decides the next step.
2. **GitHub is the durable handoff layer.** Task details and execution evidence live in the repository, not in long chat prompts.
3. **Executors are interchangeable remote hands.** Codex, ZCode, Claude Code, DeepSeek Harness, or another compatible executor follows the same Task Contract. Executor identity never grants permissions.

## The one-line executor workflow

After ChatGPT has committed a valid task, the normal message to the executor is only:

```text
Execute ACTIVE_TASK.json according to Agent Workflow Protocol.
```

Chinese:

```text
执行 ACTIVE_TASK.json，按 Agent Workflow Protocol 完成即可。
```

That trigger contains no task detail by design. Everything the executor needs is already in:

```text
docs/agent-workflow.md
docs/agent-tasks/ACTIVE_TASK.json
```

After execution, the user can simply tell ChatGPT:

```text
Codex finished. Check GitHub.
```

ChatGPT then reads the Result Contract and repository changes directly.

See `install/EXECUTE_TASK_PROMPT.md`, `protocol/orchestrator-executor-boundary.md`, and `protocol/local-execution-handoff.md`.

## When ChatGPT delegates

ChatGPT should **not** create an executor task for work it can already complete safely through GitHub.

Create an ACTIVE Task when the remaining work requires something ChatGPT cannot truly perform through GitHub, such as:

- running builds, tests, benchmarks, applications, GUIs, plugins, devices, GPUs, or platform-specific environments on the user's machine;
- using local-only files or workspace state;
- exercising credentials, accounts, registries, signing/release tools, or provider configuration;
- publishing/deploying through locally authorized tooling;
- validating behavior that only exists in a real runtime environment.

This gives the shortest useful loop: **ChatGPT changes GitHub -> executor performs real-world execution -> ChatGPT checks GitHub -> continue.**

## Task authority

The one authoritative active task is:

```text
docs/agent-tasks/ACTIVE_TASK.json
```

Tasks define the work. Agents only execute the work.

Supported modes:

- `IMPLEMENT`
- `TEST_ONLY`
- `REVIEW_ONLY`

The Task Contract owns source revision, scope, forbidden paths, validation, acceptance criteria, Result Contract path, and completion commit rules.

## What this repository provides

- Orchestrator / remote-executor operating model
- Agent-neutral handoff protocol
- Machine-readable Task and Result JSON Schemas
- Zero-dependency Node contract validator
- Executable `agent-workflow` CLI and task generator
- Safe install/uninstall ownership manifest
- One-sentence install, execute, and uninstall prompts
- Executor adapter guidance
- Project adapters and reference examples

## Install into a fresh project

With Node.js 20+:

```bash
npm exec --yes --package=github:Ran-sh/chatgpt_workflow -- agent-workflow install .
```

Installation creates a project-local workflow snapshot and never creates an ACTIVE task.

For an existing project with workflow files, give a capable coding agent this one sentence:

```text
Install the latest stable workflow from `Ran-sh/chatgpt_workflow` into this repository, following `install/ONE_COMMAND_INSTALL_PROMPT.md` exactly.
```

## Generate an active task

The CLI can generate a machine-valid task non-interactively:

```bash
agent-workflow task create \
  --mode TEST_ONLY \
  --objective "Run the targeted release retest" \
  --validate "npm test" \
  --accept "All required checks are reported"
```

For `IMPLEMENT`, explicitly authorize writable paths with `--allow`.

The generator validates the task before activation, records `executor: ANY`, and refuses to overwrite an existing ACTIVE task.

## Validate contracts

```bash
agent-workflow validate task docs/agent-tasks/ACTIVE_TASK.json
agent-workflow validate result <result-file>
```

Result statuses are limited to:

`PASS`, `FAIL`, `PARTIAL`, `SKIP`, `BLOCKED`, `NOT RUN`.

## Release / uninstall

The workflow is development infrastructure, not a product runtime dependency.

For CLI installations:

```bash
agent-workflow uninstall .
```

For agent-driven release cleanup:

```text
Uninstall the Agent Workflow from this repository by following `Ran-sh/chatgpt_workflow/install/ONE_COMMAND_UNINSTALL_PROMPT.md` exactly.
```

Uninstall is manifest-owned and refuses to run while an ACTIVE task exists.

## Repository layout

```text
protocol/      orchestrator/executor boundary and execution lifecycle
templates/     project workflow, task scaffolds, and short-trigger output
schema/        Task and Result contracts
validator/     executable contract validation
bin/           CLI and Task Generator
cli/           CLI lifecycle documentation
generator/     project detection and installation manifest schema
agents/        executor-platform integration guidance
adapters/      project/stack adaptation guidance
examples/      reference implementations
install/       one-sentence install/execute/uninstall entry points
test/          lifecycle and task-generation tests
```

## Reference projects

- `Ran-sh/dsh-vision`
- `Ran-sh/dsh-crew`

Project-specific business rules stay in the consumer repository. The mother workflow defines the handoff loop, not the product architecture.
