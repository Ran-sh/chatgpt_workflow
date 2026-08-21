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
  return spawnSync(process.execPath, [cli, ...args], {
    cwd,
    encoding: 'utf8'
  });
}

test('CLI installs, validates, and uninstalls without touching project files', () => {
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
    assert.equal(fs.existsSync(path.join(temp, 'docs', 'agent-tasks', 'ACTIVE_TASK.json')), false);

    const manifestPath = path.join(temp, 'docs', '.agent-workflow-install.json');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    assert.equal(manifest.workflow_version, '1.6.0');
    assert.equal(manifest.project_facts.package_manager, 'pnpm');
    assert.equal(manifest.project_facts.build_command, 'pnpm run build');
    assert.equal(manifest.project_facts.test_command, 'pnpm test');
    assert.ok(Array.isArray(manifest.generated_dirs));

    const taskValidation = run([
      'validate',
      'task',
      path.join(root, 'examples', 'contracts', 'task-contract.example.json')
    ]);
    assert.equal(taskValidation.status, 0, taskValidation.stderr || taskValidation.stdout);

    const resultValidation = run([
      'validate',
      'result',
      path.join(root, 'examples', 'contracts', 'result-contract.example.json')
    ]);
    assert.equal(resultValidation.status, 0, resultValidation.stderr || resultValidation.stdout);

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
