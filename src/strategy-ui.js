import { CONTENT } from './content.js?v=0.4.3';
import { CHALLENGES, CHAPTERS, chapterOf } from './strategy.js?v=0.4.3';
import { getNextEnemy, tick, getSkillProgress } from './mvp-engine.js?v=0.4.3';
import { conditionLabel } from './queue-conditions.js?v=0.4.3';
const esc = x => String(x ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const number = n => Math.round(n).toLocaleString('ja-JP');
const duration = n => `${Math.floor(n/60)}:${String(Math.ceil(n%60)).padStart(2,'0')}`;
export function reportMarkup(s) {
  const reports = s.run.battleReports || [];
  if (!reports.length) return '';
  return `<details data-detail-key="battle-recaps" class="strategy-details battle-recaps"><summary>戦闘の振り返り · 第${reports[0].wave}波 ${reports[0].won ? '撃退' : '敗北'}</summary>${reports.map(r=>{
    const total = r.player+r.guards+r.tower+r.counter;
    return `<article class="battle-recap"><h4>第${r.wave}波 · ${esc(r.enemy)}</h4><div class="damage-segments" aria-label="与えたダメージの内訳">${[['player','本人'],['guards','守備隊'],['tower','弓塔'],['counter','反撃']].map(([k,label])=>`<i class="source-${k}" style="flex:${total ? r[k]/total : 0}" title="${label} ${number(r[k])}"></i>`).join('')}</div><dl>${[['player','本人の攻撃'],['guards','守備隊'],['tower','弓塔'],['counter','反撃'],['prevented','防いだダメージ'],['damageTaken','受けたダメージ'],['foodHealing','食料の回復'],['treatmentHealing','救護所の回復']].map(([k,label])=>`<div><dt>${label}</dt><dd>${number(r[k])}</dd></div>`).join('')}</dl>${!r.won ? `<p>敵の残りHP ${number(r.remainingHp)} / ${number(r.maxHp)}（${Math.ceil(r.remainingHp/r.maxHp*100)}%）</p>`:''}</article>`;
  }).join('')}</details>`;
}
const traitHints = {flying:'飛行：弓塔が有効。本人の攻撃でも対処可能。',combo:'連撃：防御を高めて一撃ずつ軽減。体力と回復でも耐えられる。',heavy:'強打：4回ごとに大技。最大HP・防御・短期決戦で備える。',armor:'装甲：高い攻撃力、破甲の斉射、研ぎ澄ます一撃が有効。'};
export function enemyRoadmap(s) {
  if (s.version !== 2 || s.meta.bestWave < 3 || s.run.wave >= 21) return '';
  const waves = [0,1,2].filter(n=>s.run.wave+n<21).map(n=>{
    const e = getNextEnemy({...s,run:{...s.run,wave:s.run.wave+n,hostileQueue:n ? [] : s.run.hostileQueue}});
    const pressure = e.pressure === 'rally' ? '戦意高揚：4回攻撃するごとに攻撃＋5%（最大＋30%）。火力で早く倒すか、十分な防御・回復を用意。' : e.pressure === 'sunder' ? '崩し：4回目の攻撃は防御を40%無視。体力・回復・短期決戦で対処。' : '';
    return `<article><strong>WAVE ${String(e.wave).padStart(2,'0')} · ${esc(e.name)}</strong><span>HP ${number(e.hp)} · 攻撃 ${number(e.attack)} · 防御 ${number(e.defense)}</span><p>${pressure || traitHints[e.trait] || '通常：攻撃・防御・回復の配分で備える。'}</p></article>`;
  });
  return `<details data-detail-key="enemy-roadmap" class="strategy-details enemy-roadmap"><summary>この先の襲撃 · ${waves.length}波</summary>${waves.join('')}<small>外交による敵の強化は、現在の次の襲撃だけに反映。</small></details>`;
}
export function challengesMarkup(s) {
  if (!s.meta.clears) return '';
  return `<details data-detail-key="challenges" class="strategy-details challenges"><summary>クリア後の挑戦 · ${(s.meta.challengeBadges || []).length}/3</summary><p>初クリア後に始めた周回で自由に挑戦。報酬は記念称号と記録画像の装飾です。</p>${CHALLENGES.map(c=>`<article><strong style="color:${c.color}">${s.meta.challengeBadges?.includes(c.id) ? '✓ ' : ''}${c.name}</strong><p>${c.description}</p></article>`).join('')}</details>`;
}
export function chapterPresentation(s) {
  const chapter = chapterOf(s);
  document.body.dataset.chapter = chapter;
  const title = document.querySelector('.camp-caption h2');
  if (title) title.textContent = CHAPTERS[chapter];
  const subtitle = document.querySelector('.camp-caption p');
  if (subtitle) subtitle.textContent = ['まだ、火は灯っている。','葉の間から、灯りがこぼれる。','霧の向こうに、次の敵が待つ。','赤い岩肌に、槌音が響く。','青い結晶が、夜道を照らす。','長い影が、砦へと伸びる。','あと少し。夜明けは近い。'][chapter];
}
let cache = {key:'',value:null};
export function queueForecast(s) {
  if (s.version !== 2 || !s.run.queue.length || s.run.status !== 'preparing') return null;
  // Reuse within a 3-second window. Simulate a copy only up to the next raid,
  // including paid work, workers, income and skill growth. No speculative combat.
  const key = JSON.stringify([s.meta.generation, Math.floor(s.run.elapsed/3), s.run.queue, s.settings.workerTargets, s.settings.disabledUpgrades, s.run.equipment, s.run.facilities, s.run.augments.selected, s.run.activeAction?.id, s.run.nextWaveAt]);
  if (cache.state === s && key === cache.key) return cache.value;
  const copy = structuredClone(s), start = copy.run.elapsed;
  copy.settings.paused = false; copy.run.augments.offer = [];
  copy.settings.disabledUpgrades = copy.settings.disabledUpgrades.filter(id=>id!=='action_queue');
  const rows = s.run.queue.map(q=>({goalId:q.goalId,seconds:null,reason:''}));
  let budget = 900; // Hard bound, including malformed or distant raid timers.
  while (budget-- > 0 && copy.run.status === 'preparing' && !copy.settings.paused && copy.run.queue.length) {
    tick(copy, 1);
    for (const r of rows) if (r.seconds === null && !copy.run.queue.some(q=>q.goalId===r.goalId)) r.seconds = copy.run.elapsed-start;
  }
  const blocked = copy.run.status === 'preparing' && copy.settings.paused && copy.run.queue.length;
  if (blocked) for (const r of rows) if (r.seconds === null) r.reason = copy.run.blockedReason || '目標達成で停止';
  const value = {rows, raid:Math.max(0,s.run.nextWaveAt-s.run.elapsed), bounded:budget<0};
  cache={key,value,state:s}; return value;
}
export function queueTimingMarkup(s) {
  const f = queueForecast(s);
  if (!f) return '';
  const firstLate = f.rows.findIndex(r=>r.seconds === null);
  return `<details data-detail-key="queue-timing" class="strategy-details queue-timing"><summary>襲撃まで ${duration(f.raid)} · ${f.rows.filter(r=>r.seconds!==null).length}/${f.rows.length}件が完了見込み</summary><ol>${f.rows.map((r,i)=>`${i===firstLate ? `<li class="raid-boundary">${r.reason ? esc(r.reason) : 'ここまでに襲撃 · 以後は戦闘後'}</li>`:''}<li><span>${esc([...CONTENT.actions,...CONTENT.equipment,...CONTENT.processing,...CONTENT.facilities].find(d=>d.id===s.run.queue[i].id)?.name)}</span><b>${r.seconds===null ? '—' : `約${duration(r.seconds)}後`}</b></li>`).join('')}</ol><small>予約を有効にして続けた場合の目安。進行・人員・目標到達で変わります。</small></details>`;
}
export { conditionLabel };

let draftLevel = 1;
const draft = { action: 'chop_wood', type: 'stock', target: 50, recipe: '', pause: false };
export function updateConditionDraft(element) {
  const key = element.dataset.conditionField;
  if (!key) return false;
  if (key === 'type') draft.target = element.value === 'level' ? Math.min(100,draftLevel+1) : 50;
  draft[key] = key === 'pause' ? element.checked : key === 'target' ? element.valueAsNumber : element.value;
  return true;
}
export function conditionalRequest() {
  const d = [...CONTENT.actions,...CONTENT.processing].find(a=>a.id===draft.action);
  return {id:draft.action,until:{type:draft.type,target:draft.target,resource:Object.keys(d?.yields || {})[0],recipe:draft.recipe,pauseAfter:draft.type === 'unlock' || draft.pause}};
}
export function conditionalMarkup(s) {
  if (s.version !== 2 || !s.meta.upgrades.includes('queue_templates')) return '';
  const actions = [...CONTENT.actions,...CONTENT.processing].filter(d=>(d.unlockBestWave || 0)<=s.meta.bestWave && (!d.knownAfterBoss || CONTENT.encounters.find(e=>e.id===d.knownAfterBoss)?.wave<=s.meta.bestWave));
  if (!actions.some(d=>d.id===draft.action)) draft.action = actions[0]?.id;
  const action = actions.find(d=>d.id===draft.action);
  draftLevel = getSkillProgress(["defense","vitality"].includes(action?.trainingStat) ? s.run.training?.[action.trainingStat] || 0 : s.run.skills[action?.skill]?.xp || 0).level;
  const hasStock = Object.keys(action?.yields || {}).length > 0;
  const gear = CONTENT.equipment.filter(d=>d.skill===action?.skill && d.unlockLevel > getSkillProgress(s.run.skills[d.skill].xp).level && (!d.knownAfterBoss || CONTENT.encounters.find(e=>e.id===d.knownAfterBoss)?.wave<=s.meta.bestWave));
  if (!gear.some(d=>d.id===draft.recipe)) draft.recipe=gear[0]?.id || '';
  if ((!hasStock && draft.type==='stock') || (!gear.length && draft.type==='unlock')) draft.type='level';
  const options=[...(hasStock ? [['stock','在庫が目標に達するまで']] : []),['level','この作業のLvが目標に達するまで'],...(gear.length ? [['unlock','装備の製作Lvに達したら停止']] : [])];
  return `<details data-detail-key="condition-form" class="strategy-details condition-form"><summary>条件を指定して予約</summary><div class="condition-fields"><label>作業<select data-condition-field="action" data-focus="condition-action">${actions.map(d=>`<option value="${d.id}" ${draft.action===d.id?'selected':''}>${esc(d.name)}</option>`).join('')}</select></label><label>終了条件<select data-condition-field="type" data-focus="condition-type">${options.map(([id,name])=>`<option value="${id}" ${draft.type===id?'selected':''}>${name}</option>`).join('')}</select></label>${draft.type==='unlock' ? `<label>装備<select data-condition-field="recipe" data-focus="condition-recipe">${gear.map(d=>`<option value="${d.id}" ${draft.recipe===d.id?'selected':''}>${esc(d.name)}（製作Lv.${d.unlockLevel}）</option>`).join('')}</select></label>` : `<label>${draft.type==='stock' ? esc(CONTENT.resources.find(r=>r.id===Object.keys(action?.yields || {})[0])?.name)+'の所持数' : '目標Lv'}<input data-condition-field="target" data-focus="condition-target" type="number" min="${draft.type==='stock'?1:2}" max="${draft.type==='stock'?9999:100}" value="${Number.isFinite(draft.target)?draft.target:''}"></label><label class="condition-pause"><input type="checkbox" data-condition-field="pause" data-focus="condition-pause" ${draft.pause?'checked':''}>達成したら一時停止</label>`}<button class="button small gold-outline" data-command="queue-condition-add">条件付きで末尾に追加</button></div></details>`;
}
