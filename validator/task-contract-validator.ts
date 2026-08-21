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

  if (task.mode === 'TEST_ONLY' && (task.allowed_changes ?? []).some(path => !/^docs\/agent-results\//.test(path))) {
    errors.push('TEST_ONLY allowed_changes may only include docs/agent-results/**');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
