# Agent Workflow CLI

Conceptual command interface for the Agent Workflow Framework.

## Commands

```bash
agent-workflow install
```
Install a project-local workflow from the mother template.

```bash
agent-workflow validate
```
Validate Task Contracts and Result Contracts.

```bash
agent-workflow uninstall
```
Remove generated workflow artifacts while preserving business code.

The CLI is an interface layer. Task definitions remain platform-neutral and agents remain replaceable executors.
