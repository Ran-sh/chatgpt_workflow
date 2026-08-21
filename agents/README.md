# Agent Adapters

Agents are execution platforms, not workflow roles.

The same machine-readable Task Contract can be executed by different agents.

Examples:

- Codex
- ZCode
- Claude Code
- DeepSeek Harness

Every compatible executor reads the same authoritative task path:

`docs/agent-tasks/ACTIVE_TASK.json`

Each adapter documents only platform integration concerns such as:

- trigger/invocation method;
- environment assumptions;
- workspace/runtime details;
- result handoff mechanics.

Adapters must not redefine mode semantics, task permissions, writable scope, acceptance criteria, or result requirements. Those come only from the Task Contract and project workflow.
