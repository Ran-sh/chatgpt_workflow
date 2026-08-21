# ChatGPT Workflow

Reusable, agent-neutral workflow infrastructure for handing structured engineering work from ChatGPT to external execution platforms through GitHub.

Current version: **1.5.0**

## Core idea

**Tasks define the work. Agents are interchangeable executors.**

Codex, ZCode, Claude Code, DeepSeek Harness, or another compatible platform may execute the same task contract. Permissions come from the task mode and scope, never from the executor name.

```text
ChatGPT
   ↓
Task Contract
   ↓
GitHub (shared source of truth)
   ↓
Any execution agent
   ↓
Result Contract
   ↓
ChatGPT review / next task
```

## What this repository provides

- Agent-neutral handoff protocol
- `IMPLEMENT`, `TEST_ONLY`, and `REVIEW_ONLY` task modes
- Machine-readable Task and Result JSON Schemas
- Zero-dependency Node contract validator
- Canonical executable examples checked by GitHub Actions
- Executor adapter guidance for Codex, ZCode, Claude Code, and DeepSeek Harness
- Project adapters and real reference examples
- One-command installation prompt for new repositories
- Installation ownership manifest for safe removal
- One-command uninstall/release-removal prompt

## Install into a new project

Use the short prompt from `install/ONE_COMMAND_INSTALL_PROMPT.md`:

```text
Install the latest stable workflow from `Ran-sh/chatgpt_workflow` into this repository, following `install/ONE_COMMAND_INSTALL_PROMPT.md` exactly. Adapt it to this project's real commands and policies, install the machine-readable contracts and validator, create the installation ownership manifest, do not modify business code, and do not create an ACTIVE task.
```

The target repository receives its own adapted snapshot. It does **not** depend on this mother repository at runtime.

## Execute a task

A normal task uses a machine-readable contract such as `docs/agent-tasks/ACTIVE_TASK.json`. The selected executor reads the project workflow and task, validates it, performs only the authorized work, writes the required result contract/report, removes the ACTIVE task on completion, and commits only the allowed paths.

See:

- `schema/task-contract.schema.json`
- `schema/result-contract.schema.json`
- `examples/contracts/`
- `validator/README.md`

## Validate contracts

```bash
node validator/validate-contract.mjs task examples/contracts/task-contract.example.json
node validator/validate-contract.mjs result examples/contracts/result-contract.example.json
```

## Release / uninstall

The workflow is development infrastructure, not a required product runtime component. A project may keep it or remove it before release.

Safe removal is ownership-based: the installer records workflow-created files in `docs/.agent-workflow-install.json`. Uninstall removes only those owned files and never guesses ownership or automatically reverts pre-existing files.

Use `install/ONE_COMMAND_UNINSTALL_PROMPT.md` for the universal removal instruction.

## Repository layout

```text
protocol/      workflow lifecycle and execution rules
templates/     reusable task/workflow/installation templates
schema/        machine-readable Task and Result contracts
validator/     executable validation reference implementation
agents/        executor-platform adapters
adapters/      project/stack adaptation guidance
examples/      real and generic reference implementations
install/       universal install and uninstall prompts
```

## Reference implementations

- `Ran-sh/dsh-vision` — product/plugin project reference
- `Ran-sh/dsh-crew` — agent-platform/orchestration project reference

Project-specific business rules belong in consumer repositories, not in this mother template.
