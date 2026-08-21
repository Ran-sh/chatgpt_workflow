#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import process from 'node:process';

const STATUSES = new Set(['PASS', 'FAIL', 'PARTIAL', 'SKIP', 'BLOCKED', 'NOT RUN']);
const MODES = new Set(['IMPLEMENT', 'TEST_ONLY', 'REVIEW_ONLY']);

function fail(message) {
  console.error(`INVALID: ${message}`);
  process.exitCode = 1;
}

function validateTask(value) {
  const errors = [];
  if (!value || typeof value !== 'object' || Array.isArray(value)) return ['task must be an object'];
  if (!value.id) errors.push('missing id');
  if (!value.mode) errors.push('missing mode');
  else if (!MODES.has(value.mode)) errors.push(`invalid mode: ${value.mode}`);
  if (!value.source_commit) errors.push('missing source_commit');
  if (!value.objective) errors.push('missing objective');
  if (!Array.isArray(value.validation) || value.validation.length === 0) errors.push('missing validation');
  if (!value.result_contract) errors.push('missing result_contract');
  return errors;
}

function validateResult(value) {
  const errors = [];
  if (!value || typeof value !== 'object' || Array.isArray(value)) return ['result must be an object'];
  if (!value.task_id) errors.push('missing task_id');
  if (!value.source_commit) errors.push('missing source_commit');
  if (!value.status) errors.push('missing status');
  else if (!STATUSES.has(value.status)) errors.push(`invalid status: ${value.status}`);
  if (!Array.isArray(value.changed_files)) errors.push('missing changed_files');
  if (!Array.isArray(value.tests)) errors.push('missing tests');
  if (!Array.isArray(value.blockers)) errors.push('missing blockers');
  if (!value.result_path) errors.push('missing result_path');

  for (const [index, test] of (value.tests ?? []).entries()) {
    if (!test || typeof test !== 'object' || Array.isArray(test)) {
      errors.push(`tests[${index}] must be an object`);
      continue;
    }
    if (!test.name) errors.push(`tests[${index}]: missing name`);
    if (!test.status) errors.push(`tests[${index}]: missing status`);
    else if (!STATUSES.has(test.status)) errors.push(`tests[${index}]: invalid status: ${test.status}`);
  }
  return errors;
}

async function main() {
  const [kind, path] = process.argv.slice(2);
  if (!['task', 'result'].includes(kind) || !path) {
    console.error('Usage: node validator/validate-contract.mjs <task|result> <path-to-json>');
    process.exit(2);
  }

  let value;
  try {
    value = JSON.parse(await readFile(path, 'utf8'));
  } catch (error) {
    fail(`cannot read/parse ${path}: ${error instanceof Error ? error.message : String(error)}`);
    return;
  }

  const errors = kind === 'task' ? validateTask(value) : validateResult(value);
  if (errors.length > 0) {
    for (const error of errors) fail(error);
    return;
  }

  console.log(`VALID ${kind.toUpperCase()} CONTRACT: ${path}`);
}

await main();
