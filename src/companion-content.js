export const COMPANIONS=[
 {id:'forest_sparrow',name:'森の小鳥',icon:'leaf',role:'内政',condition:{kind:'best_wave',wave:3},description:'同行中、本人の木材作業が実際に収穫を得た3回ごとに木材+1。職人・購入には反応しない。'},
 {id:'ember_fox',name:'火花の狐',icon:'flame',role:'会心・燃焼',condition:{kind:'best_wave',wave:6},description:'本人の会心時に燃焼があれば、残り燃焼を消して「残り燃焼量×2＋6」の防御無視追撃1回へ変換。8秒間隔。追撃は会心や塗油を再発動しない。'},
 {id:'shield_tortoise',name:'盾の亀',icon:'shield',role:'防衛',condition:{kind:'best_wave',wave:9},description:'敵の第1・第4攻撃で合計14ダメージを軽減（各1回）。各打撃に最低1ダメージは残る。食料や護符を増やさない。'},
];
export const companionById=id=>COMPANIONS.find(x=>x.id===id);
export const companionEligible=(s,p)=>p.condition.kind==='best_wave'&&s.meta.bestWave>=p.condition.wave;
