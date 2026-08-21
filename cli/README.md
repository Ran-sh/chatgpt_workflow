# Agent Workflow CLI

Executable, zero-dependency Node.js interface for the Agent Workflow Framework.

The CLI does not assign work to a specific executor. Task permissions remain platform-neutral and come only from the active Task Contract.

## Requirements

- Node.js 20+

## Commands

### Install

```bash
agent-workflow install [target]
```

Installs a project-local snapshot of the workflow. It:

- detects conservative project facts such as language, package manager, configured package scripts, and GitHub Actions files;
- writes workflow documentation, task templates, schemas, and the validator;
- records exact file/directory ownership in `docs/.agent-workflow-install.json`;
- refuses to overwrite pre-existing managed paths;
- never creates an ACTIVE task.

### Create a task

```bash
agent-workflow task create \
  --mode TEST_ONLY \
  --objective "Run the targeted release retest" \
  --validate "npm test" \
  --accept "All required checks are reported"
```

Important options:

- `--target <dir>` — target project; defaults to current directory.
- `--id <id>` — task ID; generated when omitted.
- `--mode IMPLEMENT|TEST_ONLY|REVIEW_ONLY` — required.
- `--source-branch <branch>` / `--source-commit <sha-or-symbolic-ref>` — detected from Git when omitted.
- `--allow <path>` — repeatable; at least one explicit path is required for `IMPLEMENT`; read-only modes accept result paths only.
- `--forbid <path-or-rule>` — repeatable; conservative defaults are used when omitted.
- `--validate <check>` — repeatable and required at least once.
- `--accept <criterion>` — repeatable and required at least once.
- `--result <path>` — optional Result Contract path, but it must remain under `docs/agent-results/**`.
- `--complete <path>` — repeatable completion-commit additions; mandatory Result/ACTIVE deletion entries are added automatically.
- `--companion` — also writes non-authoritative `ACTIVE_TASK.md` and adds its deletion to the completion contract.

`task create` always writes the authoritative task to `docs/agent-tasks/ACTIVE_TASK.json`. The Result Contract is automatically added to writable scope. The generator validates JSON before activation and refuses to replace an existing ACTIVE task.

`TEST_ONLY` and `REVIEW_ONLY` are machine-enforced as result-only write modes.

### Validate

```bash
agent-workflow validate task <file>
agent-workflow validate result <file>
```

Validates machine-readable Task and Result Contracts using the canonical zero-dependency validator shipped with this repository.

### Uninstall

```bash
agent-workflow uninstall [target]
```

Reads the installation manifest, verifies its workflow source, and removes only recorded workflow-owned files and empty installer-created directories. Unmanaged project files are not touched.

Uninstall refuses to run while `docs/agent-tasks/ACTIVE_TASK.json` or `ACTIVE_TASK.md` exists.

## Development

From this repository:

```bash
node bin/agent-workflow.mjs --help
npm test
```

The implementation is intentionally conservative. When safe automation cannot determine scope or ownership, it fails instead of guessing.
