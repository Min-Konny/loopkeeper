import {text as t,formatNumber} from './i18n.js?v=0.6.140';
import {escapeCopy as esc} from './locale-controls.js?v=0.6.140';
import {getNextEnemy,getClockStatus,getAccelerationStatus} from './engine.js?v=0.6.140';
import {encounterName} from './encounter-copy.js?v=0.6.140';
import {isFrontierFinish} from './frontier-finish.js?v=0.6.140';
import {campHealthMarkup} from './camp-health.js?v=0.6.140';
import {raidEnemyStats} from './raid-info-ui.js?v=0.6.140';
const number=n=>formatNumber(n,{maximumFractionDigits:2});
const time=n=>Math.floor(n/60)+':'+String(n%60).padStart(2,'0');
export function campForecast(s){
 if(isFrontierFinish(s))return '<div class="raid-summary"><div><b>'+esc(t('camp.clear'))+'</b><button data-command="show-clear-results">'+esc(t('camp.dawn'))+'</button>'+campHealthMarkup(s)+'</div><span class="raid-clock" aria-label="'+esc(t('camp.clear'))+'"><b>'+esc(t('camp.complete'))+'</b><small>'+esc(t('camp.optional'))+'</small></span></div>';
 const enemy=s.run.enemy||getNextEnemy(s),name=encounterName(s,enemy),combat=s.run.status==='combat',dead=s.run.status==='dead',remaining=Math.max(0,s.run.nextWaveAt-s.run.elapsed),acceleration=getAccelerationStatus(s),speed=number(acceleration.multiplier),until=t('camp.until',{time:time(Math.ceil(remaining))});
 const small=combat?t('camp.autoBattle'):dead?t('camp.end'):s.settings.paused?t('camp.paused'):getClockStatus(s).kind==='wait'?t('camp.wait')+(acceleration.active?' · '+speed+'×':''):acceleration.active&&acceleration.canStart?t('camp.accelerated',{speed}):t('camp.next');
 return '<div class="raid-summary"><div><b>WAVE '+String(enemy.wave??s.run.wave+1).padStart(2,'0')+(enemy.isBoss?' · BOSS':'')+'</b><button data-info="status" title="'+esc(t('camp.enemyStats',{name,hp:number(enemy.maxHp||enemy.hp),attack:number(enemy.attack),defense:number(enemy.defense)}))+'">'+esc(name)+'</button>'+campHealthMarkup(s)+'</div><span class="raid-clock '+(remaining<15?'urgent':'')+'" aria-label="'+esc(combat?t('camp.invasion'):dead?t('camp.end'):until)+'"><b>'+esc(combat?t('camp.defending'):dead?'—':time(Math.ceil(remaining)))+'</b><small>'+esc(small)+'</small></span>'+raidEnemyStats(enemy)+'</div>';
}
