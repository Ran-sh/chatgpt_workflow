# Workflow Lifecycle

## Install

Create project-local workflow files from the mother template.

Steps:
1. Detect project environment.
2. Generate workflow manifest.
3. Generate local protocol files.
4. Do not modify business logic.

## Validate

Check:
- Task Contract schema
- Result Contract schema
- source revision metadata
- execution report completeness

## Uninstall

Remove generated workflow artifacts recorded in the install manifest.

Never remove:
- source code
- product assets
- user data
- unrelated documentation
