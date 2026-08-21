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

Or use the packaged CLI:

```bash
agent-workflow validate task path/to/task.json
agent-workflow validate result path/to/result.json
```

Exit behavior:

- `0` — contract is valid
- `1` — contract was parsed but violates workflow rules
- `2` — CLI usage error

## Task validation

The executable validator checks, among other things:

- only schema-supported top-level properties are present;
- supported mode: `IMPLEMENT | TEST_ONLY | REVIEW_ONLY`;
- source branch and source commit are declared;
- objective/context are present;
- scope, validation, and acceptance arrays have valid non-empty string items and no duplicates where required;
- `result_contract` is under `docs/agent-results/**`;
- `allowed_changes` includes the Result Contract;
- `completion_commit_contract` includes the Result Contract and `docs/agent-tasks/ACTIVE_TASK.json`;
- `metadata.companion=true` requires `docs/agent-tasks/ACTIVE_TASK.md` in the completion contract;
- ACTIVE task deletion is required on completion;
- `TEST_ONLY` and `REVIEW_ONLY` writable scope is limited to result files, with completion writes limited to result files plus ACTIVE task deletion;
- metadata values remain primitive and machine-safe.

## Result validation

The validator checks:

- only schema-supported result/test properties are present;
- task/source identity;
- unified status vocabulary: `PASS | FAIL | PARTIAL | SKIP | BLOCKED | NOT RUN`;
- changed files, test results, blockers, and result path have valid shapes;
- `result_path` is under `docs/agent-results/**`;
- nested test states use the same vocabulary;
- `BLOCKED` includes a concrete blocker;
- an overall `PASS` cannot contain non-PASS test states.

## CI

`.github/workflows/agent-workflow-check.yml` validates the JSON Schemas, canonical Task/Result examples, the schema-valid machine task template, Task Generator behavior, and the install→task→validate→uninstall lifecycle.

The TypeScript validator modules remain useful to consumers embedding validation in their own tooling, while `validate-contract.mjs` is the portable zero-dependency reference implementation.
