import {REPLAY_ACHIEVEMENTS} from './replay-achievements.js?v=0.6.123';
export function replayAchievementsMarkup(s){
  if(s.version!==2)return '';
  const records=s.replay?.unlocked||[],a=s.replay?.attempt;
  const progress=id=>{
    if(!a?.known&&id!=='frontier_clear')return '過去の条件履歴なし：新しい挑戦から記録';
    if(a?.finished)return 'この挑戦は36波クリア済み：新しい挑戦で再挑戦';
    if(id==='frontier_15_generations')return s.meta.generation>15?'この挑戦では対象外（世代上限なしの他実績は継続可能）':'現在 第'+s.meta.generation+'世代 / 15世代';
    if(id==='frontier_without_market')return a?.usedMarket?'この挑戦では対象外：市場の建設を開始済み':'市場の建設なしを継続中';
    if(id==='frontier_without_towers')return a?.usedTowers?'この挑戦では対象外：弓塔・衛兵所の建設を開始済み':'弓塔・衛兵所の建設なしを継続中';
    const type=id.slice('frontier_'.length);
    if(['martial','fortress','economy'].includes(type))return a?.packs.some(t=>t!==type)?'この挑戦では対象外：別タイプの集を購入済み':'該当集で開始 '+(a?.started[type]||0)+' / 3世代以上・専門施設II '+(a?.specialists.includes(type)?'達成':'未達成');
    return '通常36波のクリアを目指す';
  };
  return '<section class="replay-achievements" aria-label="リプレイ実績"><h3>リプレイ実績 <small>'+records.length+' / '+REPLAY_ACHIEVEMENTS.length+'</small></h3><p class="fine-print">継承ポイントとは別の収集記録。強化報酬はなく、新しい挑戦でも解除済み実績は残ります。</p><details data-replay-list><summary>条件・挑戦中の状態を確認</summary><div class="replay-achievement-list">'+REPLAY_ACHIEVEMENTS.map(d=>{const r=records.find(x=>x.id===d.id);return '<article data-replay-achievement="'+d.id+'" class="replay-achievement '+(r?'earned':'')+'"><h4>'+d.name+' <small>'+(r?'解除済み':'未解除')+'</small></h4><p>'+d.rule+'</p><small>'+(r?'第'+r.generation+'世代で解除':progress(d.id))+'</small></article>';}).join('')+'</div></details><p class="fine-print">縛りとタイプ条件は第1世代から全世代を記録。設定の「新しい挑戦」から始められます。転生は同じ挑戦の続きです。</p></section>';
}
