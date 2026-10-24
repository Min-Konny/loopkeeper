import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as E from '../src/engine.js';

// These snapshots were earned by scripts/verify-campaign.mjs, not populated with gear or XP.
for (const policy of ['martial', 'fortress', 'economic']) {
  test(`earned ${policy} build clears wave 36 and preserves the outcome across reload`, () => {
    const initial=fs.readFileSync(new URL(`./fixtures/campaign/${policy}-earned-boss.json`, import.meta.url),'utf8');
    const a=E.parseSave(initial), b=E.parseSave(initial);
    assert.ok(a && b);
    assert.equal(a.run.status,'combat');
    assert.equal(a.run.enemy.wave,36);
    if(policy==='martial') {
      assert.equal(a.run.facilities.guardhouse||0,0);
      assert.equal(a.run.facilities.archery_tower||0,0);
    }
    const finish = state => {
      state.settings.paused=false;
      for(let i=0;i<1200&&state.run.status==='combat';i++)E.advanceTime(state,.25);
      assert.equal(state.run.status,'cleared');
      assert.equal(state.run.wave,36);
      assert.equal(state.run.battleReports[0].won,true);
      assert.ok(state.run.battleReports[0].archer>0);
      assert.ok(state.run.battleReports[0].magic>0);
      return state;
    };
    finish(a);
    b.settings.paused=false;
    E.advanceTime(b,1);
    const resumed=E.parseSave(E.serializeGame(b));
    assert.ok(resumed);
    finish(resumed);
    assert.deepEqual(resumed.run.battleReports[0],a.run.battleReports[0]);
    assert.deepEqual(resumed.run.resources,a.run.resources);
    assert.equal(resumed.meta.totalPoints,a.meta.totalPoints);
    const loaded=E.parseSave(E.serializeGame(a));
    assert.ok(loaded);
    E.advanceTime(loaded,30);
    assert.equal(loaded.meta.totalPoints,a.meta.totalPoints);
    assert.deepEqual(loaded.run.clearRecord,a.run.clearRecord);
  });
}
