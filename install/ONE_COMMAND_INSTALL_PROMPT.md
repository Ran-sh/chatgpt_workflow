# One-Command Install Prompt

Use this as the universal prompt in any new repository:

```text
Install the latest stable Agent Workflow from `Ran-sh/chatgpt_workflow` into this repository.

Requirements:
1. Read the mother repository protocol, schemas, validator, install guidance, and generic example first.
2. Analyze this target repository before writing anything: default branch, language/runtime, package manager, source/test layout, build/test/typecheck/lint commands, CI, release/PR policy, generated files, protected paths, and existing agent/workflow documentation.
3. Install a project-local snapshot of the workflow. The target project must not depend on `Ran-sh/chatgpt_workflow` at runtime.
4. Keep the workflow agent-neutral. Codex, ZCode, Claude Code, DeepSeek Harness, or another executor may execute the same task contract. Do not bind IMPLEMENT/TEST_ONLY/REVIEW_ONLY to a specific platform.
5. Install machine-readable Task and Result Contract schemas plus the zero-dependency validator CLI.
6. Adapt project-specific commands and constraints only from facts found in this repository. Do not invent build/test/lint/typecheck commands.
7. Do not modify business source code, existing tests, product configuration, CI, or release logic unless a conflicting pre-existing workflow file makes installation impossible. In that case, stop and report BLOCKED rather than overwriting it.
8. Do not create any ACTIVE task during installation.
9. Create `docs/.agent-workflow-install.json` from the mother template installation manifest. Record every workflow-owned file created by this installation. Record pre-existing files separately as modified_files; never claim ownership of unrelated project files.
10. Validate the installed canonical Task and Result examples with the validator before completing.
11. Follow the target repository's normal branch/PR policy. Do not bypass branch protection.

Minimum project-local installation:
- `docs/agent-workflow.md`
- `docs/agent-short-triggers.md`
- `docs/agent-tasks/README.md`
- `docs/agent-results/README.md`
- `docs/agent-contracts/task-contract.schema.json`
- `docs/agent-contracts/result-contract.schema.json`
- `docs/agent-contracts/validate-contract.mjs`
- `docs/.agent-workflow-install.json`

After installation, report only:
Target Repository:
Target Source Commit:
Workflow Source Commit:
Workflow Version:
Files Created:
Files Modified:
Detected Project Commands:
Validation Result:
Result Commit / PR:
Blocked Items:

Explicitly confirm: No ACTIVE task was created.
```

## Short form

When the executor can access GitHub, this shorter instruction is enough:

```text
Install the latest stable workflow from `Ran-sh/chatgpt_workflow` into this repository, following `install/ONE_COMMAND_INSTALL_PROMPT.md` exactly. Adapt it to this project's real commands and policies, install the machine-readable contracts and validator, create the installation ownership manifest, do not modify business code, and do not create an ACTIVE task.
```
