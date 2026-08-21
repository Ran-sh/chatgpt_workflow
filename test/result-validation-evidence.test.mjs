import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const validator = path.join(root, 'validator', 'validate-contract.mjs');
const timestampPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:Z|[+-]\d{2}:\d{2})$/;

function secondPrecision(date) {
  return date.toISOString().replace(/\.\d{3}Z$/, 'Z');
}

function run(args) {
  return spawnSync(process.execPath, [validator, ...args], {
    cwd: root,
    encoding: 'utf8'
  });
}

function draftResult() {
  const now = Date.now();
  return {
    task_id: 'stamp-test-001',
    source_commit: '0123456789abcdef0123456789abcdef01234567',
    result_commit: null,
    status: 'PASS',
    summary: 'Validator stamping regression fixture.',
    timeline: {
      started_at: secondPrecision(new Date(now - 2000)),
      completed_at: secondPrecision(new Date(now - 1000))
    },
    changed_files: ['docs/agent-results/stamp-test-001-result.json'],
    tests: [
      {
        name: 'fixture check',
        status: 'PASS',
        evidence: 'fixture passed'
      }
    ],
    blockers: [],
    result_path: 'docs/agent-results/stamp-test-001-result.json',
    notes: []
  };
}

test('result validator --stamp writes validator-owned evidence and second-precision timeline', () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-result-stamp-'));
  try {
    const resultPath = path.join(temp, 'result.json');
    fs.writeFileSync(resultPath, `${JSON.stringify(draftResult(), null, 2)}\n`);

    const beforeStamp = run(['result', resultPath]);
    assert.notEqual(beforeStamp.status, 0);
    assert.match(beforeStamp.stderr, /result_validation must be an object/);

    const stamp = run(['result', resultPath, '--stamp']);
    assert.equal(stamp.status, 0, stamp.stderr || stamp.stdout);
    assert.match(stamp.stdout, /VALID RESULT CONTRACT/);
    assert.match(stamp.stdout, /STAMPED RESULT VALIDATION/);

    const stamped = JSON.parse(fs.readFileSync(resultPath, 'utf8'));
    assert.equal(stamped.result_validation.status, 'PASS');
    assert.match(stamped.result_validation.validated_at, timestampPattern);
    assert.equal(
      stamped.result_validation.validator,
      'node .agent-workflow/validator/validate-contract.mjs result docs/agent-results/stamp-test-001-result.json --stamp'
    );
    assert.equal(
      stamped.result_validation.evidence,
      'Exit 0: VALID RESULT CONTRACT: docs/agent-results/stamp-test-001-result.json'
    );
    assert.ok(Date.parse(stamped.timeline.completed_at) <= Date.parse(stamped.result_validation.validated_at));

    const finalValidation = run(['result', resultPath]);
    assert.equal(finalValidation.status, 0, finalValidation.stderr || finalValidation.stdout);
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
});

test('result validator rejects timestamps with milliseconds and reversed timelines', () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-result-time-'));
  try {
    const value = draftResult();
    value.timeline.started_at = '2026-08-21T15:12:04.123Z';
    value.timeline.completed_at = '2026-08-21T15:12:03Z';
    value.result_validation = {
      status: 'PASS',
      validator: 'validator',
      validated_at: '2026-08-21T15:12:02Z',
      evidence: 'evidence'
    };

    const resultPath = path.join(temp, 'invalid-result.json');
    fs.writeFileSync(resultPath, `${JSON.stringify(value, null, 2)}\n`);
    const check = run(['result', resultPath]);

    assert.notEqual(check.status, 0);
    assert.match(check.stderr, /second-precision ISO 8601 with timezone/);
    assert.match(check.stderr, /validated_at must not be earlier than timeline.completed_at/);
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
});
