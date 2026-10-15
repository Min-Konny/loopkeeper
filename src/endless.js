// Post-clear tuning is isolated from the 21-wave campaign.
export const REINFORCEMENTS = [
  ['watchtower','見張り台','襲撃猶予 +3秒（追加は最大60秒）',{wood:180,stone:100,gold:25}],
  ['barricade','防護柵','防御 +10 / 最大HP +30',{wood:220,stone:160,ingot:12}],
  ['infirmary','救護所','準備回復 +4 / 戦闘処置の回復 +10',{wood:160,stone:100,herbs:200}],
  ['workshop','工房','製作速度 +10%',{wood:200,stone:140,ingot:16}],
  ['market','市場','15秒ごとに金貨 +2',{wood:200,stone:120,gold:40}],
  ['guardhouse','衛兵所','支援攻撃 +35',{wood:240,stone:160,herbs:100,gold:30}],
  ['archery_tower','弓塔','弓支援 +30 / 飛行に2.5倍',{wood:260,stone:120,ingot:12}],
].map(([id,name,description,cost]) => ({id:`reinforce_${id}`,name:`${name}の追加強化`,description,cost,endlessFacility:id,skill:'smithing',unlockLevel:1,unlockBestWave:21,duration:60,xpCoefficient:1,yields:{}}));
export function reinforcementCost(s, d) {
  const rank = s.run.endless?.levels[d.endlessFacility] || 0;
  return Object.fromEntries(Object.entries(d.cost).map(([id,n])=>[id,Math.min(1e8,Math.ceil(n * 1.18 ** Math.min(rank,120)))]));
}
export function reinforcementEffect(id, rank, base) {
  if (!rank) return base;
  const e = {...base};
  if(id==='watchtower') e.raidDelay=(e.raidDelay||0)+Math.min(60,rank*3);
  if(id==='barricade') {e.defense=(e.defense||0)+rank*10;e.maxHp=rank*30;}
  if(id==='infirmary') {e.prepHealFlat=(e.prepHealFlat||0)+rank*4;e.treatmentFlat=rank*10;}
  if(id==='workshop') e.craftSpeed=(e.craftSpeed||0)+rank*.1;
  if(id==='market') e.income=rank*2;
  if(id==='guardhouse') e.supportAttack=(e.supportAttack||0)+rank*35;
  if(id==='archery_tower') e.rangedAttack=(e.rangedAttack||0)+rank*30;
  return e;
}
export function endlessEnemy(wave, encounters,anchor=21) {
  const n=wave-anchor, boss=wave%3===0;
  const template=encounters[anchor-3+(n-1)%3];
  const king=encounters[anchor-1];
  const trait=['combo','flying','armor','heavy'][(n-1)%4];
  const scale=(value,rate)=>Math.min(1e8,Math.ceil(value*.9*rate**Math.min(n,400)*(boss?1.12:1)));
  return {...template,id:`endless_wave_${wave}`,name:`${boss?'深夜の主':'終わらぬ夜'} · ${{combo:'群れの猛攻',flying:'空からの襲撃',armor:'鋼の軍勢',heavy:'巨獣の進撃'}[trait]}`,wave,chapter:7,boss,isBoss:boss,trait,
    hp:scale(king.hp,1.075),maxHp:scale(king.hp,1.075),attack:scale(king.attack,1.045),defense:scale(king.defense,1.04),
    pressure:boss?(wave%2?'rally':'sunder'):null, combatXpBudget:210,gold:Math.min(10000,20+n*2),hide:3,bossPoint:0,invasion:false,country:null};
}
