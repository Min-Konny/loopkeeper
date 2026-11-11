import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
const entries=['legacy-engine.js','mvp-engine.js','gear-state.js','training-queue-ui.js','log-copy.js','engine.js'];
for (const entry of entries) test(`fresh process can initialize ${entry} before the public engine`,()=>{
 const first=new URL('../src/'+entry+'?v=0.6.140',import.meta.url).href;
 const engine=new URL('../src/engine.js?v=0.6.140',import.meta.url).href;
 const result=spawnSync(process.execPath,['--input-type=module','-e',`await import(${JSON.stringify(first)}); const E=await import(${JSON.stringify(engine)}); const s=E.createGame(); if(!s.run.skills.logging) throw Error('engine not initialized');`],{encoding:'utf8',timeout:10000});
 assert.equal(result.status,0,result.stderr||String(result.error));
});
test('log metadata stays ephemeral and shares identity through presentation re-export',async()=>{
 const state=await import('../src/log-copy-state.js?v=0.6.140');
 const ui=await import('../src/log-copy.js?v=0.6.140');
 assert.equal(ui.registerLogCopy,state.registerLogCopy);
 const entry={text:'original'},copy={key:'example'},before=JSON.stringify(entry);
 ui.registerLogCopy(entry,copy);
 assert.equal(state.getLogCopy(entry),copy);
 assert.equal(JSON.stringify(entry),before);
 assert.equal(state.getLogCopy(JSON.parse(before)),undefined);
 assert.equal(ui.logText(entry),'original');
});
