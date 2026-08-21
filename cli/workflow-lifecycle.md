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
5. writes a project-local workflow snapshot, templates, schemas, and validator;
6. writes `docs/.agent-workflow-install.json` last;
7. creates no ACTIVE task.

Installation is development tooling only and must not change business logic.

## Create Task Contract

```bash
agent-workflow task create --mode <MODE> --objective <TEXT> --validate <CHECK> --accept <CRITERION> [options]
```

The generator:

1. requires an installed project workflow;
2. refuses to replace an existing ACTIVE task;
3. resolves source branch/commit from explicit flags or local Git facts;
4. requires explicit writable scope for `IMPLEMENT`;
5. restricts default `TEST_ONLY` / `REVIEW_ONLY` writable scope to the Result Contract;
6. validates the generated Task Contract before activation;
7. writes `docs/agent-tasks/ACTIVE_TASK.json` as the source of truth;
8. optionally writes non-authoritative `ACTIVE_TASK.md` with `--companion`.

## Validate

```bash
agent-workflow validate task <file>
agent-workflow validate result <file>
```

Validation uses the canonical packaged validator and returns its exit status.

Task permissions remain independent of the chosen executor.

## Execute

Any compatible executor reads the same `ACTIVE_TASK.json`. It must obey the contract's mode, scope, source revision, validation requirements, acceptance criteria, result contract, and completion commit contract.

When complete, the executor writes the Result Contract/report and removes the ACTIVE task only if the contract requires deletion.

## Uninstall / release cleanup

```bash
agent-workflow uninstall [target]
```

Uninstall:

1. requires the installation ownership manifest;
2. refuses to run while an ACTIVE task or companion exists;
3. verifies the manifest identifies `Ran-sh/chatgpt_workflow`;
4. removes only `generated_files`;
5. removes only empty `generated_dirs` that were absent before installation;
6. removes the manifest last;
7. never infers ownership from filenames.

Pre-existing source code, product assets, tests, configuration, user data, CI, release logic, and unrelated documentation are outside automatic removal scope.
