# Agent Handoff Protocol

## Principles

GitHub is the shared source of truth.
ACTIVE task files define permissions.
Agents must not infer missing work.

## Modes

- IMPLEMENT
- TEST_ONLY
- REVIEW_ONLY

## ACTIVE lifecycle

1. Create ACTIVE task.
2. Agent reads workflow and ACTIVE task.
3. Agent executes only permitted scope.
4. Agent writes result.
5. Agent removes ACTIVE task.
6. Agent commits allowed changes.

## Safety

- Respect Source Commit SHA.
- Protect dirty worktrees.
- Follow Allowed Changes and Forbidden Changes.
- Never expose secrets.
