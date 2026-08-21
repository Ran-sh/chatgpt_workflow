# Install Agent Workflow

There are two supported installation paths.

## Fresh repository: executable CLI

When Node.js 20+ is available and none of the workflow-managed paths already exist:

```bash
npm exec --yes --package=github:Ran-sh/chatgpt_workflow -- agent-workflow install .
```

The CLI performs conservative project detection, installs a local snapshot, writes `docs/.agent-workflow-install.json`, and never creates an ACTIVE task.

It refuses to overwrite pre-existing managed files.

## Existing repository: agent-guided migration

If the repository already contains agent/workflow documentation, use `ONE_COMMAND_INSTALL_PROMPT.md` instead of forcing the CLI through conflicts.

The executor must:

1. inspect the target repository first;
2. detect real stack, CI, tests, release rules, and protected paths;
3. preserve the agent-neutral protocol model;
4. adapt commands only from repository evidence;
5. avoid business-code changes merely for installation;
6. create no ACTIVE task during installation;
7. record exact workflow ownership in the install manifest.

## Uninstall / release cleanup

Use the ownership manifest rather than guessed filenames. For v1.6+ CLI installations:

```bash
agent-workflow uninstall .
```

See `UNINSTALL_GUIDE.md` and `ONE_COMMAND_UNINSTALL_PROMPT.md` for agent-driven release cleanup.
