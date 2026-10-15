export function manualRepeatMarkup(state,recipe,check){
 if(state.version===1||recipe.id!=='smelt_iron')return '';
 const active=state.run.manualRepeat===recipe.id;
 return '<button type="button" class="button small '+(active?'gold-outline':'muted')+'" data-repeat-craft="'+recipe.id+'" data-focus="repeat-'+recipe.id+'" aria-pressed="'+active+'" '+(!active&&!check.ok?'disabled':'')+'>'+(active?'連続製作を停止':'材料が尽きるまで連続')+'</button><small>'+(active?'鉄を連続精錬中':!check.ok?check.reason:'手持ちの材料のみ。素材不足・停止・再読込で終了。')+'</small>';
}
