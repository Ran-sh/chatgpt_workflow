export type TaskMode = 'IMPLEMENT' | 'TEST_ONLY' | 'REVIEW_ONLY';

export interface TaskContract {
  id: string;
  mode: TaskMode;
  source_branch: string;
  source_commit: string;
  objective: string;
  context: string;
  allowed_changes: string[];
  forbidden_changes: string[];
  validation: string[];
  acceptance_criteria: string[];
  result_contract: string;
  completion_commit_contract: string[];
  delete_active_task_on_completion: true;
  metadata?: Record<string, string | number | boolean | null>;
}

const allowedModes = new Set<TaskMode>(['IMPLEMENT', 'TEST_ONLY', 'REVIEW_ONLY']);
const ACTIVE_TASK_JSON = 'docs/agent-tasks/ACTIVE_TASK.json';
const ACTIVE_TASK_MD = 'docs/agent-tasks/ACTIVE_TASK.md';

export function validateTaskContract(task: Partial<TaskContract>) {
  const errors: string[] = [];

  if (!task.id) errors.push('missing id');
  if (!task.mode) errors.push('missing mode');
  else if (!allowedModes.has(task.mode)) errors.push(`invalid mode: ${task.mode}`);
  if (!task.source_branch) errors.push('missing source_branch');
  if (!task.source_commit) errors.push('missing source_commit');
  if (!task.objective) errors.push('missing objective');
  if (typeof task.context !== 'string') errors.push('missing context');
  if (!Array.isArray(task.allowed_changes)) errors.push('missing allowed_changes');
  if (!Array.isArray(task.forbidden_changes) || task.forbidden_changes.length === 0) errors.push('missing forbidden_changes');
  if (!Array.isArray(task.validation) || task.validation.length === 0) errors.push('missing validation');
  if (!Array.isArray(task.acceptance_criteria) || task.acceptance_criteria.length === 0) errors.push('missing acceptance_criteria');
  if (!task.result_contract) errors.push('missing result_contract');
  if (!Array.isArray(task.completion_commit_contract)) errors.push('missing completion_commit_contract');
  if (task.delete_active_task_on_completion !== true) errors.push('delete_active_task_on_completion must be true');

  if (task.result_contract && !/^docs\/agent-results\//.test(task.result_contract)) {
    errors.push('result_contract must be under docs/agent-results/**');
  }
  if (task.result_contract && Array.isArray(task.allowed_changes) && !task.allowed_changes.includes(task.result_contract)) {
    errors.push('allowed_changes must include result_contract');
  }
  if (Array.isArray(task.completion_commit_contract)) {
    if (task.result_contract && !task.completion_commit_contract.includes(task.result_contract)) {
      errors.push('completion_commit_contract must include result_contract');
    }
    if (!task.completion_commit_contract.includes(ACTIVE_TASK_JSON)) {
      errors.push(`completion_commit_contract must include ${ACTIVE_TASK_JSON}`);
    }
    if (task.metadata?.companion === true && !task.completion_commit_contract.includes(ACTIVE_TASK_MD)) {
      errors.push(`metadata.companion=true requires ${ACTIVE_TASK_MD} in completion_commit_contract`);
    }
  }

  if (task.mode === 'TEST_ONLY' || task.mode === 'REVIEW_ONLY') {
    if ((task.allowed_changes ?? []).some(item => !/^docs\/agent-results\//.test(item))) {
      errors.push(`${task.mode} allowed_changes may only include docs/agent-results/**`);
    }
    if ((task.completion_commit_contract ?? []).some(item =>
      !/^docs\/agent-results\//.test(item) && item !== ACTIVE_TASK_JSON && item !== ACTIVE_TASK_MD)) {
      errors.push(`${task.mode} completion_commit_contract may only include result paths and ACTIVE task deletion`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
