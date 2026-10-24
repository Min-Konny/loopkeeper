// Optional depth opens after the introductory bosses; all effects last one life.
export const STRATEGY_AUGMENTS = [
  { id: 'construction_rush', name: '開拓の連鎖', family: 'economy', unlockBestWave: 6, description: '施設完成後90秒、本人の伐採・採掘・採集の作業時間−20%。重ねても残り90秒まで。', tags: ['建設', '採集'], pairs: ['builder', 'investment'], hint: '先に施設を建て、加速中に次の建材を集める。' },
  { id: 'salvage', name: '端材の再利用', family: 'economy', unlockBestWave: 6, description: '施設完成時、支払った木材・石材の15%を回収。割引後の消費量が対象。', tags: ['建設', '資源'], pairs: ['construction_rush', 'investment'], hint: '施設の段階強化を続けるほど、次の投資へつながる。' },
  { id: 'well_stocked', name: '豊かな食卓', family: 'economy', unlockBestWave: 9, description: '食料20個以上で、本人の伐採・採掘の獲得量＋1。食料は消費しない。', tags: ['食料', '採集'], pairs: ['supply_lines', 'forestry'], hint: '売り切らずに備蓄し、採集と防衛を両立する。' },
  { id: 'trade_school', name: '交易都市の道場', family: 'economy', unlockBestWave: 9, description: '交易所1段階につき本人の訓練時間−4%（最大−20%）。', tags: ['交易所', '訓練'], pairs: ['drill', 'last_stand'], hint: '内政への投資を、自分の成長にも生かす。', facility: 'market' },
  { id: 'last_stand', name: '決戦前の追い込み', family: 'martial', unlockBestWave: 6, description: '襲撃まで45秒以内に開始した訓練の作業時間−35%。', tags: ['訓練', '準備時間'], pairs: ['drill', 'trade_school'], hint: '前半で生産を済ませ、襲撃直前は訓練に集中する。' },
  { id: 'weapon_master', name: '研ぎ澄ます一撃', family: 'martial', unlockBestWave: 6, description: '素振り1回につき次の戦闘で敵の防御を本人だけ1%無視（最大30%）。戦闘終了でリセット。', tags: ['訓練', '装甲対策'], pairs: ['last_stand', 'executioner'], hint: '装備を整えた後も、次の戦いへ鍛錬を積む。' },
  { id: 'executioner', name: '追撃の刃', family: 'martial', unlockBestWave: 9, description: '敵の残りHPが35%以下のとき、本人の攻撃＋30%。', tags: ['攻撃', '支援連携'], pairs: ['piercing_volley', 'warrior'], hint: '施設で削った敵を、本人の一撃で仕留める。' },
  { id: 'shield_master', name: '盾を武器に', family: 'martial', unlockBestWave: 9, description: '本人の防御力の20%を攻撃力に追加。', tags: ['防御', '攻撃'], pairs: ['guard', 'thorn_wall'], hint: '防御訓練と柵への投資が、攻撃にもつながる。' },
  { id: 'supply_lines', name: '守備隊への兵糧', family: 'fortress', unlockBestWave: 6, description: '襲撃開始時に食料20個以上なら、その戦闘の守備隊攻撃＋35%。食料は消費しない。', tags: ['食料', '守備隊'], pairs: ['well_stocked', 'provisions'], hint: '食料を売るか、守備隊のために残すか。', facility: 'guardhouse' },
  { id: 'piercing_volley', name: '破甲の斉射', family: 'fortress', unlockBestWave: 6, description: '弓塔の攻撃後、敵の防御を開始時の8%ずつ削る（最大40%）。', tags: ['弓塔', '装甲対策'], pairs: ['executioner', 'weapon_master'], hint: '長期戦ほど、本人も守備隊も攻撃を通しやすくなる。', facility: 'archery_tower' },
  { id: 'thorn_wall', name: '反撃の防塁', family: 'fortress', unlockBestWave: 9, description: '防護柵があれば、敵の攻撃を生き残るたび防御力の25%で反撃。敵防御の影響を受ける。', tags: ['防護柵', '防御'], pairs: ['guard', 'shield_master'], hint: '被害を抑えながら、反撃で敵を削る。', facility: 'barricade' },
  { id: 'triage', name: '救護からの反攻', family: 'fortress', unlockBestWave: 9, description: '救護所II以上の戦闘中の処置後、次の本人の攻撃＋50%。食料回復では発動しない。', tags: ['救護所', '攻撃'], pairs: ['healing_patrol', 'warrior'], hint: '救護所と体力への投資を、攻勢へ変える。', facility: 'infirmary', facilityLevel: 2 },
  {id:'hands_on',name:'現場第一',family:'economy',unlockBestWave:6,description:'本人の伐採・採掘・採集時間−20%。人員の作業時間＋25%。',tags:['本人','採集'],pairs:['forestry'],hint:'自分で建材を確保する周回に。'},
  {id:'delegation',name:'分業体制',family:'economy',unlockBestWave:6,requiresPurchasedWorker:true,description:'人員の作業時間−25%。本人の伐採・採掘・採集時間＋15%。',tags:['人員','投資'],pairs:['artisan_guild'],hint:'育てた人員に任せ、本人は訓練や製作へ。'},
  {id:'paid_repairs',name:'評判の修繕屋',family:'economy',unlockBestWave:6,description:'修繕の仕事の金貨＋1。本人の訓練時間＋10%。',tags:['金貨','仕事'],pairs:['builder'],hint:'金策へ時間を割いて施設に投資する。'},
  {id:'frugal_building',name:'村営工事',family:'economy',unlockBestWave:9,description:'施設の金貨費用−25%。建設時間＋20%。',tags:['施設','金貨'],pairs:['investment'],hint:'建設に時間を使い、金貨を他の投資へ。'},
  {id:'food_warrior',name:'腹ごしらえの猛攻',family:'martial',unlockBestWave:6,description:'料理の強化効果中、本人の攻撃＋15%、防御−10%。',tags:['料理','短期決戦'],pairs:['warrior'],hint:'貴重な料理を使う戦闘で攻め切る。'},
  {id:'potion_focus',name:'濃縮処方',family:'fortress',unlockBestWave:9,description:'ポーションの基礎回復量＋50%。1戦の携行上限−1本（最低1本）。',tags:['ポーション','携行枠'],pairs:['provisions'],hint:'少ない本数で大きく回復。携行枠への投資と組み合わせる。'},
].map(a => ({ ...a, pack: `${a.family}_augments`, values: {}, requiresPurchasedWorker: !!a.requiresPurchasedWorker }));

export const CHALLENGES = [
  { id: 'independent', name: '独立の守り手', description: '外交援助を一度もせずにクリア', color: '#bd9263' },
  { id: 'architect', name: '城塞の設計者', description: '累計ダメージの40%以上を守備隊・弓塔・反撃で与えてクリア', color: '#81b5a9' },
  { id: 'champion', name: '一騎の英雄', description: '累計ダメージの80%以上を本人の攻撃で与えてクリア', color: '#d0a3b6' },
];
export const newStrategy = () => ({ constructionUntil: 0, focus: 0, playerDamage: 0, facilityDamage: 0, aidUsed: false, eligible: false });
export function strategy(s) { return s.run.strategy ||= newStrategy(); }
export const chapterOf = s => Math.min(s.run.campaign==='frontier36'?11:6, Math.floor(s.run.wave / 3));
export const CHAPTERS = ['灰の辺境', '深緑の森', '霧の谷', '赤銅の山脈', '蒼晶の峡谷', '黄昏の荒野', '夜明け前の砦', '暁の門外', '渓流の渡し場', '灰燼の工房街', '星見の遺跡', '氷冠の辺境'];
export function challengeResults(s) {
  const r = s.run.strategy;
  if (!r?.eligible || s.run.status !== 'cleared') return [];
  const total = r.playerDamage + r.facilityDamage;
  return CHALLENGES.filter(c => c.id === 'independent' ? !r.aidUsed : total > 0 && (c.id === 'architect' ? r.facilityDamage / total >= .4 : r.playerDamage / total >= .8)).map(c => c.id);
}
