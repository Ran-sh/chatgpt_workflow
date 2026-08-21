# Agent Results

Durable Result Contracts must contain:

- source commit
- overall status
- exact validation commands and evidence
- changed files and blockers
- result path / result commit when available
- a second-precision execution timeline with timezone
- validator-owned Result Contract evidence

## Timeline

Use ISO 8601 timestamps with **year, month, day, hour, minute, second, and timezone**. Milliseconds are intentionally omitted.

Example:

```text
2026-08-21T15:12:04+08:00
```

Required Result Contract timeline:

```json
"timeline": {
  "started_at": "2026-08-21T15:12:04+08:00",
  "completed_at": "2026-08-21T15:13:41+08:00"
}
```

`completed_at` must not be earlier than `started_at`.

## Result validator evidence

Do not manually claim that the Result Contract validated successfully.

After all execution evidence is written and `timeline.completed_at` is final, run the installed validator with `--stamp`:

```bash
node .agent-workflow/validator/validate-contract.mjs result <result-json> --stamp
```

On success the validator itself writes `result_validation` into the Result Contract, including:

- `status: PASS`
- the validator command
- `validated_at` to the second with timezone
- validator success evidence

A Result Contract without this stamped `result_validation` is incomplete and normal result validation must reject it.

The intended timeline is therefore:

```text
started_at
   ↓
local work / tests
   ↓
completed_at
   ↓
validator --stamp
   ↓
result_validation.validated_at
```

Do not include private chain-of-thought, secrets, credentials, private local paths, or sensitive environment values.
