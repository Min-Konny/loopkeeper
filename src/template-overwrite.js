import {hasUpgrade}from './free-features.js?v=0.6.36';
import { getCatalog } from './engine.js?v=0.6.36';
import { commitStoredGameEdit } from './save-storage.js?v=0.6.36';
import { conditionLabel } from './queue-conditions.js?v=0.6.36';

const fail = reason => ({ ok: false, reason });
const enabled = state => state.version === 2 && hasUpgrade(state,"queue_templates") && !state.settings.disabledUpgrades.includes('queue_templates');
const queueGoals = state => state.run.queue.map(({ id, count, kind, until }) => ({ id, count, kind, ...(until ? { until: { ...until } } : {}) }));

export function prepareTemplateOverwrite(state, index) {
  if (!enabled(state)) return fail('手順テンプレートを有効にしてください。');
  if (!Number.isInteger(index) || index < 0 || !state.meta.templates[index]) return fail('上書きする手順がありません。');
  if (!state.run.queue.length) return fail('保存する行動予約を作ってください。');
  const target = state.meta.templates[index];
  return { ok: true, proposal: { index, target, originalJSON: JSON.stringify(target), queueJSON: JSON.stringify(queueGoals(state)) } };
}

// A dialog proposal is ephemeral. Object identity detects shifted entries and
// a reloaded/taken-over session even if two templates have identical contents.
export function commitTemplateOverwrite(storage, state, proposal, { isOwner = () => false, now = Date.now() } = {}) {
  if (!isOwner()) return fail('別のタブでプレイ中です。このタブで続けてから確認し直してください。');
  if (!enabled(state)) return fail('手順テンプレートを有効にしてください。');
  if (!Number.isInteger(proposal?.index) || proposal.index < 0) return fail('上書きする手順がありません。');
  const target = state.meta.templates[proposal?.index];
  if (!target || target !== proposal.target || JSON.stringify(target) !== proposal.originalJSON)
    return fail('保存した手順が変わりました。閉じて上書き対象を確認し直してください。');
  if (JSON.stringify(queueGoals(state)) !== proposal.queueJSON)
    return fail('行動予約が変わりました。閉じて上書き内容を確認し直してください。');
  if (!isOwner()) return fail('操作権が移りました。上書き内容を確認し直してください。');
  const candidate = structuredClone(state);
  candidate.meta.templates[proposal.index] = { name: target.name, goals: JSON.parse(proposal.queueJSON) };
  try {
    return { ok: true, state: commitStoredGameEdit(storage, state, candidate, { now }), name: target.name };
  } catch {
    return fail('保存できないため上書きを中止しました。元の手順と現在の予約は残っています。');
  }
}

const esc = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
export function templateOverwriteMarkup(state, proposal) {
  const recipes = [...getCatalog(state).ACTIONS, ...getCatalog(state).RECIPES];
  const original = JSON.parse(proposal.originalJSON), replacement = JSON.parse(proposal.queueJSON);
  function list(goals) {
    return `<ol>${goals.map(goal => `<li><span>${esc(recipes.find(recipe => recipe.id === goal.id)?.name || goal.id)}</span><small>${esc(conditionLabel(goal))}</small></li>`).join('')}</ol>`;
  }
  return `<div class="dialog-heading"><h2 id="template-overwrite-title">手順を上書きしますか？</h2><button class="icon-button" data-close="template-overwrite-dialog" aria-label="閉じる">×</button></div><p class="dialog-lead">「${esc(original.name)}」を現在の予約で更新します。</p><div class="template-overwrite-summary"><section><h3>保存済み · ${original.goals.length}件</h3>${list(original.goals)}</section><section><h3>今回保存 · ${replacement.length}件</h3>${list(replacement)}</section></div><p class="fine-print">現在の予約・作業・素材は変更しません。元の手順は保存前のバックアップに残します。</p><div class="save-options"><button class="button muted" data-close="template-overwrite-dialog">キャンセル</button><button class="button gold" data-command="template-overwrite-confirm">この内容で上書き</button></div>`;
}
