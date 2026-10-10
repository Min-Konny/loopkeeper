import { CHALLENGES, challengeResults } from './strategy.js?v=0.4.2';
import { getCatalog } from './engine.js?v=0.4.2';
export function clearRecord(state) {
  if (state.run.status !== 'cleared') return null;
  const { AUGMENTS } = getCatalog(state);
  return { badges:challengeResults(state), generation: state.meta.generation, wave: state.run.wave, seconds: Math.floor(state.run.elapsed), augments: state.run.augments.selected.map(id => AUGMENTS.find(a => a.id === id)?.name).filter(Boolean) };
}
export function drawClearCard(canvas, record) {
  canvas.width = 1200; canvas.height = 800;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw Error('記録画像を作成できませんでした。');
  const background = ctx.createLinearGradient(0, 0, 1200, 800);
  background.addColorStop(0, '#263d35'); background.addColorStop(1, '#0d1d20');
  ctx.fillStyle = background; ctx.fillRect(0, 0, 1200, 800);
  ctx.strokeStyle = CHALLENGES.find(c=>record.badges?.includes(c.id))?.color || '#9b9258';ctx.lineWidth=2;ctx.strokeRect(28,28,1144,744);
  const glow = ctx.createRadialGradient(1000,400,0,1000,400,260);
  glow.addColorStop(0,'#baa35e40');glow.addColorStop(1,'#baa35e00');ctx.fillStyle=glow;ctx.fillRect(740,140,460,520);
  for (let i=0;i<32;i++) { ctx.fillStyle=i%3?'#9fb4a44d':'#e9cd8c';ctx.beginPath();ctx.arc(760+(i*73)%350,110+(i*97)%370,i%3?1:2,0,Math.PI*2);ctx.fill(); }
  // Fortress, windows and the surviving flame are authored vectors, so the export stays sharp.
  ctx.fillStyle='#516c5b';ctx.fillRect(918,290,142,238);
  for(let i=0;i<4;i++)ctx.fillRect(918+i*39,266,25,32);
  ctx.fillStyle='#193028';ctx.fillRect(970,414,40,114);
  ctx.fillStyle='#e8d397';ctx.fillRect(944,330,16,28);ctx.fillRect(1018,330,16,28);
  ctx.strokeStyle='#adbb8c';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(900,528);ctx.lineTo(1080,528);ctx.stroke();
  ctx.fillStyle='#e2c174';ctx.beginPath();ctx.moveTo(875,510);ctx.bezierCurveTo(838,482,884,450,875,425);ctx.bezierCurveTo(920,472,910,510,875,510);ctx.fill();
  ctx.fillStyle='#fff1b1';ctx.beginPath();ctx.moveTo(875,505);ctx.quadraticCurveTo(857,490,877,465);ctx.quadraticCurveTo(897,495,875,505);ctx.fill();
  const font=(size,weight=500)=>`${weight} ${size}px "Zen Maru Gothic", "Meiryo", sans-serif`;
  ctx.fillStyle='#e1d69e';ctx.font=font(34,700);ctx.fillText('LoopKeeper',80,105);
  ctx.fillStyle='#9cb2a5';ctx.font=font(16);ctx.fillText('IDLE DEFENSE',82,134);
  ctx.fillStyle='#b8b887';ctx.font=font(20,700);ctx.fillText(record.badges?.length ? record.badges.map(id=>CHALLENGES.find(c=>c.id===id)?.name).join(' / ') : 'CLEAR · 村を守り抜いた',82,227,1000);
  ctx.fillStyle='#f2ebcb';ctx.font=font(100,700);ctx.fillText(`第${record.generation}世代`,76,350,750);
  ctx.fillStyle='#c1d4b9';ctx.font=font(30);ctx.fillText('幾度の夜を越え、夜明けへ。',82,409);
  const minutes=Math.floor(record.seconds/60),seconds=String(record.seconds%60).padStart(2,'0');
  ctx.fillStyle='#ffffff08';ctx.fillRect(80,454,660,100);
  ctx.fillStyle='#9eb5a5';ctx.font=font(17);ctx.fillText('最終周回の時間',102,484);ctx.fillText('撃退した襲撃',440,484);
  ctx.fillStyle='#e8dbad';ctx.font=font(32,700);ctx.fillText(`${minutes}分${seconds}秒`,102,531);ctx.fillText(`${record.wave} 波`,440,531);
  ctx.fillStyle='#8ea79a';ctx.font=font(16);ctx.fillText('この命のオーグメント',82,603);
  ctx.fillStyle='#d4dcc0';ctx.font=font(22);
  const names=record.augments;
  ctx.fillText(names.slice(0,2).join('  /  ') || 'なし',82,642,1000);
  if(names.length>2)ctx.fillText(names.slice(2).join('  /  '),82,679,1000);
  ctx.fillStyle='#879f91';ctx.font=font(17);ctx.fillText('min-konny.github.io/loopkeeper/',82,738);
}
export async function saveClearCard(state) {
  const record=clearRecord(state);
  if (!record) throw Error('クリア後に記録画像を保存できます。');
  await document.fonts?.ready;
  const canvas=document.createElement('canvas');drawClearCard(canvas,record);
  const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));
  if (!blob) throw Error('記録画像を保存できませんでした。');
  const url=URL.createObjectURL(blob),link=document.createElement('a');
  link.href=url;link.download=`LoopKeeper-clear-generation-${record.generation}.png`;
  document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),10000);
}
