export type TaskMode = 'IMPLEMENT' | 'TEST_ONLY' | 'REVIEW_ONLY';

export interface TaskContract {
  id: string;
  mode: TaskMode;
  source_commit: string;
  objective: string;
  validation: string[];
  result_contract: string;
}

export function validateTaskContract(task: Partial<TaskContract>) {
  const errors: string[] = [];

  if (!task.id) errors.push('missing id');
  if (!task.mode) errors.push('missing mode');
  if (!task.source_commit) errors.push('missing source_commit');
  if (!task.objective) errors.push('missing objective');
  if (!task.validation?.length) errors.push('missing validation');
  if (!task.result_contract) errors.push('missing result_contract');

  return {
    valid: errors.length === 0,
    errors,
  };
}
