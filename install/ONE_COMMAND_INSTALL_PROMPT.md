# One-Command Install Prompt

Use this as the universal prompt in any new or existing repository:

```text
Install the latest stable Agent Workflow from `Ran-sh/chatgpt_workflow` into this repository.

Requirements:
1. Read the mother repository protocol, schemas, validator, CLI/install guidance, and generic example first.
2. Analyze this target repository before writing anything: default branch, language/runtime, package manager, source/test layout, build/test/typecheck/lint commands, CI, release/PR policy, generated files, protected paths, and existing agent/workflow documentation.
3. Keep the workflow agent-neutral. Codex, ZCode, Claude Code, DeepSeek Harness, or another executor may execute the same Task Contract. Do not bind IMPLEMENT/TEST_ONLY/REVIEW_ONLY to a platform.
4. If there are no conflicting workflow paths, prefer the canonical CLI installer from the workflow source. If conflicts exist, do not force-overwrite them; adapt/merge only after inspecting the target repository and respecting its policies.
5. Install a project-local snapshot. The product must not depend on `Ran-sh/chatgpt_workflow` at runtime.
6. Install machine-readable Task and Result Contract schemas, the canonical validator, and the platform-neutral `TEMPLATE_TASK.json` scaffold.
7. Adapt project-specific commands and constraints only from facts found in this repository. Do not invent build/test/lint/typecheck commands.
8. Do not modify business source code, existing tests, product configuration, CI, or release logic merely to install the workflow.
9. Do not create any ACTIVE task during installation. Task generation is a separate explicit operation after installation.
10. Create `docs/.agent-workflow-install.json`. Record every workflow-owned file under `generated_files` and every directory newly created by the installer under `generated_dirs`. Never claim ownership of pre-existing project files or directories.
11. Validate canonical Task and Result contracts after installation.
12. Confirm the installed short trigger points every executor to `docs/agent-tasks/ACTIVE_TASK.json`, not executor-specific task files.
13. Follow the target repository's branch/PR policy. Do not bypass branch protection.

After installation, report only:
Target Repository:
Target Source Commit:
Workflow Source Commit / Version:
Files Created:
Directories Created:
Existing Files Preserved:
Detected Project Commands:
Validation Result:
Result Commit / PR:
Blocked Items:

Explicitly confirm: No ACTIVE task was created.
```

## Short form

```text
Install the latest stable workflow from `Ran-sh/chatgpt_workflow` into this repository, following `install/ONE_COMMAND_INSTALL_PROMPT.md` exactly. Adapt it only from verified project facts, keep every executor interchangeable, do not modify business code, create the ownership manifest, and do not create an ACTIVE task.
```

## Fresh-repository CLI equivalent

When the repository has no conflicting workflow paths and Node.js 20+ is available:

```bash
npm exec --yes --package=github:Ran-sh/chatgpt_workflow -- agent-workflow install .
```

After installation, a coordinator may explicitly generate a task with `agent-workflow task create ...`. Installation itself never assigns work.
