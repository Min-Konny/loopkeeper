import { setTextIfChanged } from './dom-text.js?v=0.6.5';

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
  const toggle=document.querySelector('#recipe-search-toggle'),tools=document.querySelector('#recipe-search-tools'),summary=document.querySelector('#recipe-search-summary'),reset=document.querySelector('#recipe-search-reset');
  const queries = { craft: '', village: '' };
  const opened={craft:!toggle,village:!toggle};let count='';
  let context = null, composing = false;
  function refresh(){
    host.hidden=!context||!opened[context];if(tools)tools.hidden=!context;
    if(toggle){const expanded=String(!!context&&opened[context]);if(toggle.getAttribute?.('aria-expanded')!==expanded)toggle.setAttribute('aria-expanded',expanded);setTextIfChanged(toggle,context&&opened[context]?'検索を閉じる':'検索');}
    const term=context?queries[context].trim():'';if(summary){setTextIfChanged(summary,(term?'検索中：'+term+' · ':'')+count);summary.title=term;}if(reset)reset.hidden=!term;
  }
  function commit() {
    if (!context || queries[context] === input.value) return;
    queries[context] = input.value;
    clear.disabled = !input.value;
    refresh();onChange();
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
  toggle?.addEventListener('click',event=>{event.stopPropagation();if(!context)return;opened[context]=!opened[context];refresh();if(opened[context])input.focus({preventScroll:true});});
  reset?.addEventListener('click',event=>{event.stopPropagation();if(!context)return;composing=false;input.value='';commit();toggle?.focus({preventScroll:true});});
  return {
    show(next) {
      if (next === context) {refresh();return;}
      context = next;
      composing = false;
      if (context) {
        input.value = queries[context];
        clear.disabled = !input.value;
        setTextIfChanged(label, context === 'village' ? '施設の名前検索' : '工房の名前検索');
      }
      count='';refresh();
    },
    query() { return context ? queries[context] : ''; },
    report(shown,total){count='表示 '+shown+' / '+total+'件';setTextIfChanged(result,count);refresh();},
  };
}
