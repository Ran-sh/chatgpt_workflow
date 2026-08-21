import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cli = path.join(root, 'bin', 'agent-workflow.mjs');

function run(args, cwd = root) {
  return spawnSync(process.execPath, [cli, ...args], { cwd, encoding: 'utf8' });
}

function git(cwd, ...args) {
  return spawnSync('git', ['-C', cwd, ...args], { encoding: 'utf8' });
}

function createTask(temp, extra = []) {
  return run([
    'task', 'create',
    '--target', temp,
    '--mode', 'TEST_ONLY',
    '--objective', 'Run local validation.',
    '--validate', 'echo validate',
    '--accept', 'Validation is reported.',
    ...extra
  ]);
}

test('task create defaults source_commit to LATEST when task will be committed later', () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-workflow-source-latest-'));
  try {
    const install = run(['install', temp]);
    assert.equal(install.status, 0, install.stderr || install.stdout);

    const create = createTask(temp, ['--source-branch', 'main']);
    assert.equal(create.status, 0, create.stderr || create.stdout);

    const task = JSON.parse(fs.readFileSync(path.join(temp, 'docs', 'agent-tasks', 'ACTIVE_TASK.json'), 'utf8'));
    assert.equal(task.source_branch, 'main');
    assert.equal(task.source_commit, 'LATEST');
    assert.equal(task.metadata.prepared_from_commit, null);
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
});

test('task create records preparation HEAD for audit without pinning execution to it', () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-workflow-source-audit-'));
  try {
    assert.equal(git(temp, 'init', '-b', 'main').status, 0);
    assert.equal(git(temp, 'config', 'user.email', 'workflow-test@example.invalid').status, 0);
    assert.equal(git(temp, 'config', 'user.name', 'Workflow Test').status, 0);
    fs.writeFileSync(path.join(temp, 'README.md'), 'fixture\n');
    assert.equal(git(temp, 'add', 'README.md').status, 0);
    assert.equal(git(temp, 'commit', '-m', 'fixture').status, 0);
    const prepared = git(temp, 'rev-parse', 'HEAD').stdout.trim();

    const install = run(['install', temp]);
    assert.equal(install.status, 0, install.stderr || install.stdout);

    const create = createTask(temp);
    assert.equal(create.status, 0, create.stderr || create.stdout);

    const task = JSON.parse(fs.readFileSync(path.join(temp, 'docs', 'agent-tasks', 'ACTIVE_TASK.json'), 'utf8'));
    assert.equal(task.source_branch, 'main');
    assert.equal(task.source_commit, 'LATEST');
    assert.equal(task.metadata.prepared_from_commit, prepared);
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
});
