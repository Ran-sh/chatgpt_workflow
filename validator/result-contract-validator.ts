export type ResultStatus = 'PASS' | 'FAIL' | 'PARTIAL' | 'SKIP' | 'BLOCKED' | 'NOT RUN';

export interface ResultTestEntry {
  name: string;
  status: ResultStatus;
  evidence?: string;
}

export interface ResultContract {
  task_id: string;
  source_commit: string;
  result_commit?: string | null;
  status: ResultStatus;
  summary?: string;
  changed_files: string[];
  tests: ResultTestEntry[];
  blockers: string[];
  result_path: string;
  notes?: string[];
}

const allowedStatuses = new Set<ResultStatus>([
  'PASS',
  'FAIL',
  'PARTIAL',
  'SKIP',
  'BLOCKED',
  'NOT RUN',
]);

export function validateResultContract(result: Partial<ResultContract>) {
  const errors: string[] = [];

  if (!result.task_id) errors.push('missing task_id');
  if (!result.source_commit) errors.push('missing source_commit');
  if (!result.status) errors.push('missing status');
  else if (!allowedStatuses.has(result.status)) errors.push(`invalid status: ${result.status}`);
  if (!Array.isArray(result.changed_files)) errors.push('missing changed_files');
  if (!Array.isArray(result.tests)) errors.push('missing tests');
  if (!Array.isArray(result.blockers)) errors.push('missing blockers');
  if (!result.result_path) errors.push('missing result_path');

  for (const [index, test] of (result.tests ?? []).entries()) {
    if (!test?.name) errors.push(`tests[${index}]: missing name`);
    if (!test?.status) errors.push(`tests[${index}]: missing status`);
    else if (!allowedStatuses.has(test.status)) errors.push(`tests[${index}]: invalid status: ${test.status}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
