import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {VERSION} from '../src/version.js';
const read=name=>fs.readFileSync(new URL('../'+name,import.meta.url),'utf8');
const sources=fs.readdirSync(new URL('../src/',import.meta.url)).filter(name=>name.endsWith('.js'));

test('the displayed version has one source and matches the package',()=>{
  assert.equal(VERSION,JSON.parse(read('package.json')).version);
  for(const name of ['src/main.js','src/title-screen.js','src/help-copy.js']){
    const literal=read(name).replace(/\?v=\d+\.\d+\.\d+[\w-]*/g,'').match(/v?\d+\.\d+\.\d{2,}/);
    assert.equal(literal,null,name+' must show VERSION instead of a typed release number');
  }
});

test('every stylesheet and local module is requested with a cache-busting version',()=>{
  const html=read('index.html');
  const sheets=[...html.matchAll(/<link[^>]+rel="stylesheet"[^>]*>/g)].map(tag=>tag[0].match(/href="([^"]+)"/)[1]);
  assert.ok(sheets.length>10);
  for(const href of sheets)assert.match(href,/\?v=\d+\.\d+\.\d+/,'index.html: '+href);
  assert.match(html,/const entry = "\.\/src\/[\w-]+\.js\?v=\d+\.\d+\.\d+/);
  for(const name of sources){
    const source=read('src/'+name);
    for(const [,specifier] of source.matchAll(/(?:\bfrom\s*|\bimport\s*\(?\s*)(["'])(\.\.?\/[^"']+\.js[^"']*)\1/g).map(m=>[m[0],m[2]]))
      // Vendored files carry their own version in the file name.
      if(!/\/vendor\/[^/]*\d+\.\d+\.\d+/.test(specifier))assert.match(specifier,/\?v=\d+\.\d+\.\d+/,'src/'+name+': '+specifier);
  }
});
