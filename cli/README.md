# Agent Workflow CLI

Executable, zero-dependency Node.js interface for the Agent Workflow Framework.

The CLI does not assign work to a specific executor. Task permissions remain platform-neutral and come only from the active Task Contract.

## Requirements

- Node.js 20+

## Commands

```bash
agent-workflow install [target]
```

Installs a project-local snapshot of the workflow. It:

- detects conservative project facts such as language, package manager, configured package scripts, and GitHub Actions files;
- writes workflow documentation, task templates, schemas, and the validator;
- records exactly which files it created in `docs/.agent-workflow-install.json`;
- refuses to overwrite pre-existing managed paths;
- never creates an ACTIVE task.

```bash
agent-workflow validate task <file>
agent-workflow validate result <file>
```

Validates machine-readable Task and Result Contracts using the canonical validator shipped with this repository.

```bash
agent-workflow uninstall [target]
```

Reads the installation manifest and removes only recorded workflow-owned files. Unmanaged project files are not touched.

## Development

From this repository:

```bash
node bin/agent-workflow.mjs --help
npm test
```

The current implementation is intentionally conservative: if installation would overwrite an existing workflow path, it fails instead of guessing how to merge it. Existing projects should use the migration/install prompt so an agent can inspect and adapt the repository safely.
