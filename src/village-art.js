import { generatedEnemySource } from './enemy-art.js?v=0.6.140';
import { pixelBattlePortrait } from './pixel-battle-art.js?v=0.6.140';
import { forestChiefPortrait } from './forest-chief-art.js?v=0.6.140';
import { routeById } from './routes.js?v=0.6.140';

// Match the encounter artwork used by the battle screen, including regional bosses.
export function villageEnemyArt(enemy, routeId = null) {
  const kind = enemy.trait === 'flying' ? 'winged' : enemy.isBoss ? 'boss'
    : ['wolf','raider','boss','knight','giant'][Math.max(0, Math.min((enemy.wave || 1)-1,4))];
  const forestChief = enemy.id === 'forest_chief' && enemy.isBoss && !routeId;
  const region = routeById(routeId)?.image;
  const fallback = forestChief ? forestChiefPortrait()
    : pixelBattlePortrait(region ? region.split('/').pop().replace('.svg','') : kind);
  const source = generatedEnemySource(kind, {regional:!!routeId, forestChief, routeId, enemyId:enemy.id, isBoss:!!enemy.isBoss});
  return {source:source || fallback, fallback, generated:!!source};
}
