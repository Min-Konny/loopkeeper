// Re-query after each tab change: the setup renderer replaces the controls.
document.addEventListener('keydown',event=>{
 const target=event.target;
 if(!target.matches?.('[data-setup-category]')||!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
 const tabs=[...target.closest('[role="tablist"]').querySelectorAll('[data-setup-category]')],i=tabs.indexOf(target),next=event.key==='Home'?0:event.key==='End'?tabs.length-1:(i+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length,id=tabs[next].dataset.setupCategory;
 event.preventDefault();tabs[next].click();document.querySelector('[data-setup-category="'+id+'"]')?.focus();
});
