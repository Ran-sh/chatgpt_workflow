# ChatGPT Workflow

Reusable, agent-neutral workflow infrastructure for handing structured engineering work from ChatGPT to external execution platforms through GitHub.

Current version: **1.7.0**

## Core idea

**Tasks define the work. Agents are interchangeable executors.**

Codex, ZCode, Claude Code, DeepSeek Harness, or another compatible platform may execute the same Task Contract. Permissions come from the task mode and scope, never from the executor name.

```text
ChatGPT / coordinator
   ↓
Generate + validate Task Contract
   ↓
GitHub (shared source of truth)
   ↓
Any compatible executor
   ↓
Result Contract
   ↓
Validate + coordinator review / next task
```

## What this repository provides

- Agent-neutral handoff protocol
- `IMPLEMENT`, `TEST_ONLY`, and `REVIEW_ONLY` task modes
- Machine-readable Task and Result JSON Schemas
- Zero-dependency Node contract validator
- Executable `agent-workflow` CLI
- Machine Task Generator with `agent-workflow task create`
- Safe install/uninstall ownership manifest
- Canonical lifecycle smoke tests in CI
- Executor adapter guidance for Codex, ZCode, Claude Code, and DeepSeek Harness
- Project adapters and reference examples
- One-sentence install and uninstall prompts for agent-driven migration

## Fast path: install into a fresh project

With Node.js 20+:

```bash
npm exec --yes --package=github:Ran-sh/chatgpt_workflow -- agent-workflow install .
```

The installer:

- detects only repository facts it can verify;
- copies a local workflow snapshot;
- installs Task/Result schemas and the canonical validator;
- writes `docs/.agent-workflow-install.json` with exact file/directory ownership;
- refuses to overwrite pre-existing managed files;
- does **not** create an ACTIVE task.

The target repository receives a local development snapshot. Product runtime does not depend on this mother repository.

## Existing project / migration path

If the target already contains workflow/agent files, do not force-copy over them. Give any capable coding agent this one sentence:

```text
Install the latest stable workflow from `Ran-sh/chatgpt_workflow` into this repository, following `install/ONE_COMMAND_INSTALL_PROMPT.md` exactly.
```

The full prompt requires repository inspection, project-specific adaptation from verified facts only, ownership tracking, no business-code changes, and no ACTIVE task during installation.

## Generate an active task

The canonical active task is:

```text
docs/agent-tasks/ACTIVE_TASK.json
```

Generate it non-interactively:

```bash
agent-workflow task create \
  --mode TEST_ONLY \
  --objective "Run the targeted release retest" \
  --validate "npm test" \
  --accept "All required checks are reported" \
  --companion
```

The generator:

- requires an explicit mode, objective, validation, and acceptance criterion;
- uses the current Git branch and exact commit when available, or accepts `--source-branch` / `--source-commit` explicitly;
- requires at least one `--allow` path for `IMPLEMENT`;
- defaults `TEST_ONLY` / `REVIEW_ONLY` writable scope to the Result Contract only;
- refuses to overwrite an existing ACTIVE task;
- validates generated JSON before activating it;
- writes optional `ACTIVE_TASK.md` only as a non-authoritative human companion;
- records `executor: ANY` so platform choice cannot change permissions.

Example implementation task:

```bash
agent-workflow task create \
  --mode IMPLEMENT \
  --objective "Fix the requested regression" \
  --allow "src/**" \
  --allow "test/**" \
  --validate "npm test" \
  --accept "The regression is fixed and required tests pass"
```

Run `agent-workflow --help` for all generator flags.

## Execute a task

Every executor uses the same trigger and same task path:

```text
Pull the latest target branch. Read `docs/agent-workflow.md`, then read and validate `docs/agent-tasks/ACTIVE_TASK.json`. Execute exactly that task and do not expand scope. Write the required Result Contract/report, remove `ACTIVE_TASK.json` only when the task is complete, and commit/push only paths authorized by the Task Contract. If the ACTIVE task is missing or invalid, stop instead of inferring work.
```

The selected executor must obey the Task Contract's mode, source revision, allowed/forbidden scope, validations, acceptance criteria, result path, and completion commit contract.

If the active task is missing, the executor stops. It must not infer work from chat history, issues, old reports, or another platform's prior task files.

## Validate contracts

```bash
agent-workflow validate task docs/agent-tasks/ACTIVE_TASK.json
agent-workflow validate result <result-file>
```

The canonical examples can also be checked from this repository:

```bash
node bin/agent-workflow.mjs validate task examples/contracts/task-contract.example.json
node bin/agent-workflow.mjs validate result examples/contracts/result-contract.example.json
```

## Release / uninstall

The workflow is development infrastructure, not a required product runtime dependency.

To remove a CLI-installed workflow:

```bash
agent-workflow uninstall .
```

Uninstall is ownership-based. It reads `docs/.agent-workflow-install.json`, removes only recorded workflow-owned files, and removes only directories that the installer itself created and that are still empty. Pre-existing/unmanaged files and directories are preserved.

Uninstall **refuses to run while `ACTIVE_TASK.json` or its companion exists**. Complete or intentionally abandon the task first.

For agent-driven release cleanup, give the executor:

```text
Uninstall the Agent Workflow from this repository by following `Ran-sh/chatgpt_workflow/install/ONE_COMMAND_UNINSTALL_PROMPT.md` exactly.
```

## Development

```bash
node bin/agent-workflow.mjs --help
npm test
npm run validate:examples
```

CI validates schemas, canonical contracts, task generation, lifecycle behavior, uninstall safety, and version consistency.

## Repository layout

```text
protocol/      workflow lifecycle and execution rules
templates/     reusable workflow/task templates and machine task scaffold
schema/        machine-readable Task and Result contracts
validator/     executable contract validation reference
bin/           executable CLI and Task Generator
cli/           CLI behavior and lifecycle documentation
generator/     project detection and installation manifest schema
agents/        executor-platform adapters
adapters/      project/stack adaptation guidance
examples/      real and generic reference implementations
install/       universal install and uninstall prompts
test/          CLI lifecycle and task-generation tests
```

## Reference implementations

- `Ran-sh/dsh-vision` — product/plugin project reference
- `Ran-sh/dsh-crew` — agent-platform/orchestration project reference

Project-specific business rules belong in consumer repositories, not in this mother template.
