import { setTextIfChanged } from './dom-text.js?v=0.4.8';

// Call only after the existing discovery, category and visibility filters.
export function filterRecipeNames(recipes, query) {
  const term = String(query ?? '').trim().toLowerCase();
  return term ? recipes.filter(recipe => String(recipe.name).toLowerCase().includes(term)) : recipes;
}

// The search editor lives outside the refreshed recipe list, so game updates
// keep flowing without replacing the focused editor or interrupting IME input.
export function createRecipeSearch({ document, onChange }) {
  const host = document.querySelector('#recipe-search');
  const input = host.querySelector('input');
  const label = host.querySelector('[data-search-label]');
  const clear = host.querySelector('button');
  const result = host.querySelector('[data-search-result]');
  const queries = { craft: '', village: '' };
  let context = null, composing = false;
  function commit() {
    if (!context || queries[context] === input.value) return;
    queries[context] = input.value;
    clear.disabled = !input.value;
    onChange();
  }
  input.addEventListener('compositionstart', () => { composing = true; });
  input.addEventListener('compositionend', () => { composing = false; commit(); });
  input.addEventListener('input', event => { if (!composing && !event.isComposing) commit(); });
  input.addEventListener('keydown', event => {
    if (event.key === 'Enter' && !event.isComposing) event.preventDefault();
  });
  clear.addEventListener('click', event => {
    event.stopPropagation();
    if (!context) return;
    composing = false;
    input.value = '';
    commit();
    input.focus({ preventScroll: true });
  });
  return {
    show(next) {
      host.hidden = !next;
      if (next === context) return;
      context = next;
      composing = false;
      if (context) {
        input.value = queries[context];
        clear.disabled = !input.value;
        setTextIfChanged(label, context === 'village' ? '施設の名前検索' : '工房の名前検索');
      }
    },
    query() { return context ? queries[context] : ''; },
    report(shown, total) { setTextIfChanged(result, `表示 ${shown} / ${total}件`); },
  };
}
