# Workflow Lifecycle

## Install

```bash
agent-workflow install [target]
```

The installer:

1. detects conservative repository facts;
2. computes the managed file plan;
3. refuses to overwrite any pre-existing managed file;
4. records directories that did not exist before installation;
5. writes a project-local workflow snapshot;
6. writes `docs/.agent-workflow-install.json` last;
7. creates no ACTIVE task.

Installation is development tooling only and must not change business logic.

## Validate

```bash
agent-workflow validate task <file>
agent-workflow validate result <file>
```

Validation uses the canonical packaged validator and returns its exit status.

Task permissions remain independent of the chosen executor.

## Execute

After installation, ChatGPT or another coordinator creates a platform-neutral active Task Contract. Any compatible executor may run it. The executor must obey the contract's mode, scope, source revision, validation requirements, and result contract.

## Uninstall / release cleanup

```bash
agent-workflow uninstall [target]
```

Uninstall:

1. requires a valid ownership manifest;
2. removes only `generated_files`;
3. removes only empty `generated_dirs` that were absent before installation;
4. removes the manifest last;
5. never infers ownership from filenames.

Pre-existing source code, product assets, tests, configuration, user data, CI, release logic, and unrelated documentation are outside automatic removal scope.
