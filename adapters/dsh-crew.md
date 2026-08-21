# dsh-crew Adapter

Reference implementation:
- Repository: Ran-sh/dsh-crew

Project profile:
- Agent orchestration / runtime platform.
- Uses worker and reviewer roles.
- Requires adapting runtime validation, CI and package commands from the target repository.

Install principle:
- Import the generic Agent Handoff Protocol.
- Keep dsh-crew-specific runtime rules in the project repository.
- Do not copy project-specific execution policies into the mother template.
