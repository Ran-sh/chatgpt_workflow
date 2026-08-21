import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cli = path.join(root, 'bin', 'agent-workflow.mjs');
const expectedVersion = fs.readFileSync(path.join(root, 'VERSION'), 'utf8').trim();

function run(args, cwd = root) {
  return spawnSync(process.execPath, [cli, ...args], {
    cwd,
    encoding: 'utf8'
  });
}

function removeActiveTask(temp) {
  fs.rmSync(path.join(temp, 'docs', 'agent-tasks', 'ACTIVE_TASK.json'), { force: true });
  fs.rmSync(path.join(temp, 'docs', 'agent-tasks', 'ACTIVE_TASK.md'), { force: true });
}

test('CLI installs, generates/validates a task, and uninstalls without touching project files', () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-workflow-'));
  try {
    fs.writeFileSync(path.join(temp, 'package.json'), JSON.stringify({
      name: 'fixture',
      scripts: { build: 'echo build', test: 'echo test' }
    }, null, 2));
    fs.writeFileSync(path.join(temp, 'pnpm-lock.yaml'), 'lockfileVersion: 9\n');

    const install = run(['install', temp]);
    assert.equal(install.status, 0, install.stderr || install.stdout);
    assert.match(install.stdout, /No ACTIVE task was created/);
    assert.equal(fs.existsSync(path.join(temp, 'docs', 'agent-workflow.md')), true);
    assert.equal(fs.existsSync(path.join(temp, 'docs', 'agent-tasks', 'TEMPLATE_TASK.json')), true);
    assert.equal(fs.existsSync(path.join(temp, 'docs', 'agent-tasks', 'ACTIVE_TASK.json')), false);

    const manifestPath = path.join(temp, 'docs', '.agent-workflow-install.json');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    assert.equal(manifest.workflow_version, expectedVersion);
    assert.equal(manifest.project_facts.package_manager, 'pnpm');
    assert.equal(manifest.project_facts.build_command, 'pnpm run build');
    assert.equal(manifest.project_facts.test_command, 'pnpm test');
    assert.ok(Array.isArray(manifest.generated_dirs));

    const create = run([
      'task', 'create',
      '--target', temp,
      '--id', 'release-retest-001',
      '--mode', 'TEST_ONLY',
      '--source-branch', 'main',
      '--source-commit', 'abc123',
      '--objective', 'Run the targeted release retest.',
      '--validate', 'pnpm test',
      '--accept', 'All required checks are reported.',
      '--companion'
    ]);
    assert.equal(create.status, 0, create.stderr || create.stdout);
    assert.match(create.stdout, /Executor: ANY/);

    const activePath = path.join(temp, 'docs', 'agent-tasks', 'ACTIVE_TASK.json');
    const companionPath = path.join(temp, 'docs', 'agent-tasks', 'ACTIVE_TASK.md');
    assert.equal(fs.existsSync(activePath), true);
    assert.equal(fs.existsSync(companionPath), true);

    const active = JSON.parse(fs.readFileSync(activePath, 'utf8'));
    const resultPath = 'docs/agent-results/release-retest-001-result.json';
    assert.equal(active.id, 'release-retest-001');
    assert.equal(active.mode, 'TEST_ONLY');
    assert.equal(active.source_branch, 'main');
    assert.equal(active.source_commit, 'abc123');
    assert.deepEqual(active.allowed_changes, [resultPath]);
    assert.ok(active.completion_commit_contract.includes(resultPath));
    assert.ok(active.completion_commit_contract.includes('docs/agent-tasks/ACTIVE_TASK.json'));
    assert.ok(active.completion_commit_contract.includes('docs/agent-tasks/ACTIVE_TASK.md'));
    assert.equal(active.metadata.executor, 'ANY');
    assert.equal(active.metadata.generator, `agent-workflow@${expectedVersion}`);
    assert.equal(active.metadata.companion, true);

    const taskValidation = run(['validate', 'task', activePath]);
    assert.equal(taskValidation.status, 0, taskValidation.stderr || taskValidation.stdout);

    const duplicate = run([
      'task', 'create',
      '--target', temp,
      '--mode', 'REVIEW_ONLY',
      '--source-branch', 'main',
      '--source-commit', 'abc123',
      '--objective', 'Should not replace the active task.',
      '--validate', 'review files',
      '--accept', 'review complete'
    ]);
    assert.notEqual(duplicate.status, 0);
    assert.match(duplicate.stderr, /ACTIVE task already exists/);

    const blockedUninstall = run(['uninstall', temp]);
    assert.notEqual(blockedUninstall.status, 0);
    assert.match(blockedUninstall.stderr, /refusing to uninstall while an ACTIVE task exists/);

    const resultValidation = run([
      'validate',
      'result',
      path.join(root, 'examples', 'contracts', 'result-contract.example.json')
    ]);
    assert.equal(resultValidation.status, 0, resultValidation.stderr || resultValidation.stdout);

    removeActiveTask(temp);
    const uninstall = run(['uninstall', temp]);
    assert.equal(uninstall.status, 0, uninstall.stderr || uninstall.stdout);
    assert.equal(fs.existsSync(path.join(temp, 'docs', 'agent-workflow.md')), false);
    assert.equal(fs.existsSync(manifestPath), false);
    assert.equal(fs.existsSync(path.join(temp, 'package.json')), true);
    assert.equal(fs.existsSync(path.join(temp, 'pnpm-lock.yaml')), true);
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
});

test('installer refuses to overwrite pre-existing managed paths', () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-workflow-conflict-'));
  try {
    fs.mkdirSync(path.join(temp, 'docs'), { recursive: true });
    fs.writeFileSync(path.join(temp, 'docs', 'agent-workflow.md'), 'existing\n');
    const install = run(['install', temp]);
    assert.notEqual(install.status, 0);
    assert.match(install.stderr, /refusing to overwrite pre-existing files/);
    assert.equal(fs.readFileSync(path.join(temp, 'docs', 'agent-workflow.md'), 'utf8'), 'existing\n');
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
});

test('uninstall preserves pre-existing directories and unrelated files', () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-workflow-owned-dirs-'));
  try {
    fs.mkdirSync(path.join(temp, 'docs'), { recursive: true });
    fs.writeFileSync(path.join(temp, 'docs', 'product-notes.md'), 'keep me\n');

    const install = run(['install', temp]);
    assert.equal(install.status, 0, install.stderr || install.stdout);

    const manifest = JSON.parse(fs.readFileSync(path.join(temp, 'docs', '.agent-workflow-install.json'), 'utf8'));
    assert.equal(manifest.generated_dirs.includes('docs'), false);

    const uninstall = run(['uninstall', temp]);
    assert.equal(uninstall.status, 0, uninstall.stderr || uninstall.stdout);
    assert.equal(fs.existsSync(path.join(temp, 'docs')), true);
    assert.equal(fs.readFileSync(path.join(temp, 'docs', 'product-notes.md'), 'utf8'), 'keep me\n');
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
});

test('IMPLEMENT task generation requires explicit writable scope and always includes result contract', () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-workflow-implement-'));
  try {
    const install = run(['install', temp]);
    assert.equal(install.status, 0, install.stderr || install.stdout);

    const missingAllow = run([
      'task', 'create',
      '--target', temp,
      '--mode', 'IMPLEMENT',
      '--source-branch', 'main',
      '--source-commit', 'abc123',
      '--objective', 'Implement the requested change.',
      '--validate', 'run configured tests',
      '--accept', 'requested behavior is implemented'
    ]);
    assert.notEqual(missingAllow.status, 0);
    assert.match(missingAllow.stderr, /IMPLEMENT tasks require at least one --allow path/);

    const create = run([
      'task', 'create',
      '--target', temp,
      '--id', 'implement-001',
      '--mode', 'IMPLEMENT',
      '--source-branch', 'main',
      '--source-commit', 'abc123',
      '--objective', 'Implement the requested change.',
      '--allow', 'src/**',
      '--allow', 'test/**',
      '--validate', 'run configured tests',
      '--accept', 'requested behavior is implemented'
    ]);
    assert.equal(create.status, 0, create.stderr || create.stdout);

    const activePath = path.join(temp, 'docs', 'agent-tasks', 'ACTIVE_TASK.json');
    const active = JSON.parse(fs.readFileSync(activePath, 'utf8'));
    const resultPath = 'docs/agent-results/implement-001-result.json';
    assert.deepEqual(active.allowed_changes, ['src/**', 'test/**', resultPath]);
    assert.ok(active.completion_commit_contract.includes(resultPath));
    assert.ok(active.completion_commit_contract.includes('docs/agent-tasks/ACTIVE_TASK.json'));
    assert.ok(active.forbidden_changes.includes('secrets and credentials'));

    const validation = run(['validate', 'task', activePath]);
    assert.equal(validation.status, 0, validation.stderr || validation.stdout);

    removeActiveTask(temp);
    const uninstall = run(['uninstall', temp]);
    assert.equal(uninstall.status, 0, uninstall.stderr || uninstall.stdout);
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
});

test('read-only modes reject non-result writable scope', () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-workflow-review-'));
  try {
    const install = run(['install', temp]);
    assert.equal(install.status, 0, install.stderr || install.stdout);

    const create = run([
      'task', 'create',
      '--target', temp,
      '--mode', 'REVIEW_ONLY',
      '--source-branch', 'main',
      '--source-commit', 'abc123',
      '--objective', 'Review the requested area.',
      '--allow', 'src/**',
      '--validate', 'inspect relevant files',
      '--accept', 'findings are reported'
    ]);
    assert.notEqual(create.status, 0);
    assert.match(create.stderr, /REVIEW_ONLY --allow paths must be under docs\/agent-results\//);
    assert.equal(fs.existsSync(path.join(temp, 'docs', 'agent-tasks', 'ACTIVE_TASK.json')), false);

    const uninstall = run(['uninstall', temp]);
    assert.equal(uninstall.status, 0, uninstall.stderr || uninstall.stdout);
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
});
