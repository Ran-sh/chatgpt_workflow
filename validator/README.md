# Task Contract Validator

Purpose:
Validate Agent Workflow task contracts before execution.

Checks:

- required task fields exist
- mode is supported
- source commit is defined
- allowed and forbidden scopes are declared
- validation criteria exist
- result contract exists

The validator ensures tasks are machine-readable before any execution agent starts.
