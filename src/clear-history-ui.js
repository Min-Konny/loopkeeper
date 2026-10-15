export function clearHistoryMarkup(s){
 const first=s.meta.firstClear,extended=s.meta.firstExtendedClear,frontier=s.meta.firstFrontierClear;
 const card=(r,label,command)=>'<div class="clear-achievement"><strong>'+label+' 本編'+r.wave+'波・第'+r.generation+'世代</strong><button class="button gold-outline" data-command="'+command+'">記録画像を保存</button></div>';
 return (first?card(first,'初クリア','share-first-clear'):'')+(extended&&first?.wave!==24?card(extended,'24波の初クリア','share-first-extended-clear'):'')+(frontier&&first?.wave!==36?card(frontier,'36波の初クリア','share-first-frontier-clear'):'');
}
