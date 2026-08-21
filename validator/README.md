# Contract Validator

The validator enforces the machine-readable Agent Workflow contracts before and after execution.

## Contracts

- Task Contract: `schema/task-contract.schema.json`
- Result Contract: `schema/result-contract.schema.json`

## Executable CLI

No project dependency installation is required. Use Node.js directly:

```bash
node validator/validate-contract.mjs task path/to/task.json
node validator/validate-contract.mjs result path/to/result.json
```

Exit behavior:

- `0` — contract is valid
- `1` — contract was parsed but violates workflow rules
- `2` — CLI usage error

## Task validation

The executable validator checks, among other things:

- supported mode: `IMPLEMENT | TEST_ONLY | REVIEW_ONLY`
- source branch and source commit are declared
- objective/context are present
- allowed and forbidden scopes are explicit
- validation and acceptance criteria are present
- result and completion-commit contracts are declared
- ACTIVE task deletion is required on completion
- TEST_ONLY cannot declare ordinary source paths as writable

## Result validation

The validator checks:

- task/source identity
- unified status vocabulary: `PASS | FAIL | PARTIAL | SKIP | BLOCKED | NOT RUN`
- changed files, test results, blockers, and result path are present
- nested test states use the same vocabulary
- `BLOCKED` includes a concrete blocker
- an overall `PASS` cannot contain non-PASS test states

## CI

`.github/workflows/agent-workflow-check.yml` executes the CLI against canonical Task and Result examples on pushes and pull requests.

The TypeScript validator modules remain useful to consumers embedding validation in their own tooling, while `validate-contract.mjs` is the portable zero-dependency reference implementation.
