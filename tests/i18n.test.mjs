import test from 'node:test';
import assert from 'node:assert/strict';
import {JA} from '../src/ui-copy-ja.js';
import {EN} from '../src/ui-copy-en.js';
import {text,resolveText,setUILocale,getUILocale,readUILocale,subscribeLocale,UI_LOCALE_KEY,SUPPORTED_LOCALES,formatNumber,formatDate} from '../src/i18n.js?v=0.6.140';
import {createGame} from '../src/engine.js';
import {replayAchievementsMarkup} from '../src/replay-achievements-ui.js';
const storage=()=>{const data=new Map([['progress','unchanged']]);return{getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v)};};
const variables=value=>[...String(value).matchAll(/\{(\w+)\}/g)].map(x=>x[1]).sort();
test('English batch has identical stable keys and interpolation contracts',()=>{
 assert.deepEqual(Object.keys(EN).sort(),Object.keys(JA).sort());
 for(const key of Object.keys(JA)){const source=JA[key],target=EN[key];for(const value of typeof target==='object'?Object.values(target):[target])assert.deepEqual(variables(value),variables(typeof source==='object'?source.other:source),key);assert.doesNotMatch(JSON.stringify(target),/undefined-tier/);}
 assert.deepEqual(SUPPORTED_LOCALES,['ja','en']);
});
test('locale preference only writes its own key; failed writes do not switch or notify',()=>{
 const s=storage();let calls=0;const unsubscribe=subscribeLocale(()=>calls++);
 assert.equal(setUILocale('en',s),true);assert.equal(getUILocale(),'en');assert.equal(readUILocale(s),'en');assert.equal(s.getItem('progress'),'unchanged');assert.equal(s.getItem(UI_LOCALE_KEY),'en');
 assert.equal(setUILocale('ja',{setItem(){throw Error('quota');}}),false);assert.equal(getUILocale(),'en');assert.equal(calls,1);
 assert.equal(setUILocale('zh-Hans',s),false);assert.equal(calls,1);unsubscribe();setUILocale('ja',s);
});
test('missing translations fall back to Japanese, unknown locales to Japanese, missing keys remain visible',()=>{
 const d={ja:{greeting:'こんにちは {name}'},en:{}};assert.equal(resolveText(d,'greeting',{name:'A'},'en'),'こんにちは A');assert.equal(resolveText(d,'greeting',{name:'B'},'ko'),'こんにちは B');assert.equal(resolveText(d,'missing',{},'en'),'[missing]');assert.equal(resolveText(d,'greeting',{},'en'),'こんにちは {name}');
});
test('English quantities pluralize and formatting does not change numeric values',()=>{
 assert.equal(text('queue.count',{count:1},'en'),'1 queued action');assert.equal(text('queue.count',{count:2},'en'),'2 queued actions');assert.equal(text('queue.count',{count:2},'ja'),'予約 2件');
 assert.equal(formatNumber(1234.56,{maximumFractionDigits:2},'ja'),'1,234.56');assert.equal(formatNumber(1234.56,{maximumFractionDigits:2},'en'),'1,234.56');const date=new Date('2026-10-29T10:00:00Z');assert.equal(formatDate(date,{timeZone:'UTC',year:'numeric'},'en'),'2026');assert.equal(date.toISOString(),'2026-10-29T10:00:00.000Z');
});
test('achievement translation does not mutate game records or conditions',()=>{
 const game=createGame(),before=JSON.stringify(game),s=storage();setUILocale('en',s);const markup=replayAchievementsMarkup(game);assert.match(markup,/Replay Achievements/);assert.match(markup,/Iron in Hand/);assert.doesNotMatch(markup,/[ぁ-んァ-ヶ一-龯]/);assert.equal(JSON.stringify(game),before);setUILocale('ja',s);assert.match(replayAchievementsMarkup(game),/リプレイ実績/);
});
test('invalid historical date metadata has a readable localized fallback',()=>{
 assert.equal(formatDate(new Date(1e100),{},'en'),'Unknown date');assert.equal(formatDate(NaN,{},'ja'),JA['common.unknownDate']);
});
