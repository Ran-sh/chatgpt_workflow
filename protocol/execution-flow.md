# Agent Execution Flow

## Principle

Tasks define work. Agents execute work.

An Agent is an interchangeable execution platform, not a responsibility category.

## Standard Flow

1. ChatGPT analyzes the request.
2. ChatGPT creates an ACTIVE task contract.
3. Task is stored in GitHub as the source of truth.
4. Any supported Agent reads the task.
5. Agent executes only the permitted scope.
6. Agent writes a result report.
7. ChatGPT reviews the result and decides the next action.

## Agent Independence

The same task may be executed by Codex, ZCode, Claude Code, DeepSeek Harness, or other compatible agents.

Execution platform does not change task semantics.
