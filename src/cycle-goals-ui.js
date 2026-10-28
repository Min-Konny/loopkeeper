import {ACCESSORIES,ACCESSORY_RECIPES} from './gear-content.js?v=0.6.129';
import {trophyMarkup} from './boss-materials.js?v=0.6.129';
const esc=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function cycleGoalsMarkup(s,costOf,nameOf=id=>id){
 const owned=s.meta.accessories||[], candidates=[...new Set(['work_boots','guard_bracelet','artisan_bracelet','tempo_ring','guild_pendant','steady_ring',...ACCESSORIES.map(a=>a.id)])].filter(id=>!owned.includes(id)).slice(0,2);
 const cards=candidates.map(id=>{const a=ACCESSORIES.find(x=>x.id===id),d=ACCESSORY_RECIPES.find(x=>x.id===id),paid=s.run.activeAction?.id===id||s.run.suspendedActions[id];return '<div class="cycle-accessory"><strong>'+esc(a.name)+' · 永久解放</strong><p>'+esc(a.description)+'</p><small>必要：製作Lv'+d.unlockLevel+'・最高'+d.unlockBestWave+'波</small>'+trophyMarkup(s,id,!!paid)+'<small>'+ (paid?'製作費は支払い済み。残りの作業を続けられます。':'製作費：'+Object.entries(costOf(s,d)).map(([k,n])=>esc(nameOf(k))+' '+n+'（不足'+Math.max(0,n-(s.run.resources[k]||0))+'）').join(' / '))+'</small></div>';}).join('');
 return '<section class="cycle-goals"><h4>この周で何を残す？</h4><p><b>準備周</b>：未達成の報酬や永久アクセサリーを狙う。最高Waveを更新しなくても成果は残ります。</p><p><b>攻略周</b>：準備用・戦闘用の装備セットと食事を整え、最高'+s.meta.bestWave+'波の先へ。</p><small>ポイントは継承時に配分。ボス・作業素材と解放済みアクセサリーは転生後も保持。通常装備・施設は持ち越しません。周の種類を固定する操作は不要です。</small><details data-detail-key="cycle-accessory-targets"><summary>次の永久解放候補（現在'+owned.length+'種類）</summary>'+cards+'<p class="fine-print">工房 → アクセサリーで製作。バッグ → 装備セットで準備用・戦闘用に選択します。未解放の効果はまだ適用されません。</p></details></section>';
}
