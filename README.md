# ChatGPT Workflow

Reusable, agent-neutral workflow infrastructure for handing structured engineering work from ChatGPT to external execution platforms through GitHub.

Current version: **1.6.0**

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
- Executable `agent-workflow` CLI
- Safe install/uninstall ownership manifest
- Canonical lifecycle smoke tests in CI
- Executor adapter guidance for Codex, ZCode, Claude Code, and DeepSeek Harness
- Project adapters and reference examples
- One-sentence install and uninstall prompts for agent-driven migration

## Fast path: fresh project

With Node.js 20+, a fresh repository can install the workflow directly from the GitHub source package:

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

The target repository does not depend on this mother repository at product runtime.

## Existing project / migration path

If the target already contains workflow/agent files, do not force-copy over them. Use the universal prompt in `install/ONE_COMMAND_INSTALL_PROMPT.md` so the executor can inspect the repository and adapt safely.

Short form:

```text
Install the latest stable workflow from `Ran-sh/chatgpt_workflow` into this repository, following `install/ONE_COMMAND_INSTALL_PROMPT.md` exactly. Adapt it only from verified project facts, keep every executor interchangeable, do not modify business code, and do not create an ACTIVE task.
```

## Execute a task

A normal machine-readable task lives at a project-local path such as:

```text
docs/agent-tasks/ACTIVE_TASK.json
```

The selected executor must:

1. read the project workflow;
2. read and validate the active Task Contract;
3. perform only authorized work;
4. produce the required Result Contract/report;
5. remove the active task only when the contract says the task is complete;
6. commit/push only allowed paths.

If the active task is missing, the executor stops. It must not infer work from chat history, issues, old reports, or another platform's prior task files.

## Validate contracts

```bash
node bin/agent-workflow.mjs validate task examples/contracts/task-contract.example.json
node bin/agent-workflow.mjs validate result examples/contracts/result-contract.example.json
```

Or through the installed command:

```bash
agent-workflow validate task <file>
agent-workflow validate result <file>
```

## Release / uninstall

The workflow is development infrastructure, not a required product runtime dependency.

To remove a CLI-installed workflow:

```bash
agent-workflow uninstall .
```

Uninstall is ownership-based. It reads `docs/.agent-workflow-install.json`, removes only recorded workflow-owned files, and removes only directories that the installer itself created and that are still empty. Pre-existing/unmanaged files and directories are preserved.

For agent-driven release cleanup, use `install/ONE_COMMAND_UNINSTALL_PROMPT.md`.

## Development

```bash
node bin/agent-workflow.mjs --help
npm test
npm run validate:examples
```

CI validates schemas, canonical contracts, CLI lifecycle behavior, and version consistency.

## Repository layout

```text
protocol/      workflow lifecycle and execution rules
templates/     reusable workflow and task-mode templates
schema/        machine-readable Task and Result contracts
validator/     executable contract validation reference
bin/           executable CLI entrypoint
cli/           CLI behavior and lifecycle documentation
generator/     project detection and installation manifest schema
agents/        executor-platform adapters
adapters/      project/stack adaptation guidance
examples/      real and generic reference implementations
install/       universal install and uninstall prompts
test/          CLI lifecycle smoke tests
```

## Reference implementations

- `Ran-sh/dsh-vision` — product/plugin project reference
- `Ran-sh/dsh-crew` — agent-platform/orchestration project reference

Project-specific business rules belong in consumer repositories, not in this mother template.
