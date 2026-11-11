import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
export function validateTask(task) {
  const errors = [];
  for (const key of ['goal', 'baseSha', 'owner', 'acceptance', 'verification']) {
    if (typeof task?.[key] !== 'string' || !task[key].trim()) errors.push(`${key} is required`);
  }
  if (!/^[0-9a-f]{40}$/.test(task?.baseSha ?? '')) errors.push('baseSha must be a full commit SHA');
  if (!Array.isArray(task?.paths) || !task.paths.length) errors.push('paths must be nonempty');
  else for (const p of task.paths) {
    if (typeof p !== 'string' || !/^(src|tests|docs)\/[A-Za-z0-9_./-]+$/.test(p) || p.split('/').some(s => s === '..' || s === '.' || !s)) errors.push(`path is outside permitted source/test/docs scope: ${p}`);
  }
  if (task?.publish !== false || task?.merge !== false) errors.push('publish and merge must be false');
  if (task?.newDependencies !== false || task?.paidServices !== false) errors.push('newDependencies and paidServices must be false');
  return errors;
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const task = JSON.parse(readFileSync(process.argv[2], 'utf8'));
    const errors = validateTask(task);
    if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
    else console.log('Task structure valid. This is not authorization, execution, or acceptance.');
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
