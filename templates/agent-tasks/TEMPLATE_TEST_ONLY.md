# TEST_ONLY Task Template

Protocol: Agent Handoff Protocol
Mode: TEST_ONLY
Source Branch:
Source Commit:
Result Path:
Delete Active Task On Completion: YES

Executor: ANY compatible platform. Executor choice does not change permissions.

## Goal

## Context

## Read-only Constraints

- No source code changes.
- No existing test changes.
- No config/build/CI/package/release changes.
- Writable paths are limited to `docs/agent-results/**`.

## Required Validation

Use only real commands/checks established by repository facts or the Task Contract.

## Acceptance Criteria

## Result Contract

Validation statuses must be one of:

- PASS
- FAIL
- PARTIAL
- SKIP
- BLOCKED
- NOT RUN
