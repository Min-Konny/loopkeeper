import {text as t,getUILocale,setUILocale,subscribeLocale,isLocaleComplete} from './i18n.js?v=0.6.140';
export const escapeCopy=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function copySpan(key,values={}){return '<span data-ui-copy="'+key+'" data-ui-values="'+escapeCopy(JSON.stringify(values))+'">'+escapeCopy(t(key,values))+'</span>';}
export function languageControlMarkup(){const active=getUILocale(),options=[['ja','日本語'],['en',t('locale.english')],['zh-CN',t('locale.chineseSimplified')],['ko',t('locale.korean')]];return '<section class="language-control"><label>'+copySpan('locale.label')+' <select data-ui-locale aria-label="'+escapeCopy(t('locale.label'))+'" data-ui-aria="locale.label">'+options.map(([value,label])=>'<option value="'+value+'" lang="'+value+'"'+(active===value?' selected':'')+'>'+escapeCopy(label)+'</option>').join('')+'</select></label><p class="fine-print">'+copySpan('locale.immediate')+'</p><p class="fine-print" data-locale-preview'+(active==='en'?'':' hidden')+'>'+copySpan('locale.preview')+'</p><p class="fine-print" data-locale-fallback'+(['zh-CN','ko'].includes(active)&&!isLocaleComplete(active)?'':' hidden')+'>'+copySpan('locale.fallbackEnglish')+'</p><p role="status" data-locale-error></p></section>';}

export function applyLocaleCopy(root){
  for(const node of root.querySelectorAll('[data-ui-copy]')){let values={};try{values=JSON.parse(node.dataset.uiValues||'{}');}catch{}node.textContent=t(node.dataset.uiCopy,values);}
  for(const [data,attribute] of [['uiAria','aria-label'],['uiTitle','title'],['uiPlaceholder','placeholder']])for(const node of root.querySelectorAll('[data-'+data.replace(/[A-Z]/g,c=>'-'+c.toLowerCase())+']'))node.setAttribute(attribute,t(node.dataset[data]));
  for(const select of root.querySelectorAll('[data-ui-locale]')){select.value=getUILocale();select.querySelector('[value=en]').textContent=t('locale.english');select.querySelector('[value="zh-CN"]').textContent=t('locale.chineseSimplified');select.querySelector('[value=ko]').textContent=t('locale.korean');}
  for(const node of root.querySelectorAll('[data-locale-preview]'))node.hidden=getUILocale()!=='en';
  for(const node of root.querySelectorAll('[data-locale-fallback]'))node.hidden=!['zh-CN','ko'].includes(getUILocale())||isLocaleComplete();
  for(const node of root.querySelectorAll('[data-locale-error]'))node.textContent='';
}
const mounted=new WeakSet();
export function mountLocaleControls(document,storage){
  if(mounted.has(document))return;mounted.add(document);
  const apply=()=>{document.documentElement.lang=getUILocale();applyLocaleCopy(document);};
  document.addEventListener('change',event=>{if(!event.target.matches('[data-ui-locale]'))return;event.stopImmediatePropagation();if(!setUILocale(event.target.value,storage)){apply();event.target.closest('.language-control').querySelector('[data-locale-error]').textContent=t('locale.failed');}},true);
  subscribeLocale(apply);apply();
}
