import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import os from 'node:os';import path from 'node:path';
import {createRequire} from 'node:module';
const {validate,summary}=createRequire(import.meta.url)('../scripts/screenshots/validate-artifact.cjs');
const jpeg=Buffer.from([0xff,0xd8,0xff,0xe0,0,0]);
function folder(files){const dir=fs.mkdtempSync(path.join(os.tmpdir(),'shots-'));for(const [name,data] of Object.entries(files))fs.writeFileSync(path.join(dir,name),data);return dir;}
test('accepts only flat JPEG sheets and the two summaries',()=>{
  assert.deepEqual(validate(folder({'gather-busy-1280x720.jpg':jpeg,'comparison.json':'{}','report.json':'{"shots":[]}'})),['gather-busy-1280x720.jpg']);
  for(const bad of [{'a.jpg':'not an image'},{'a.png':jpeg},{'a.jpg':jpeg,'run.sh':'x'},{'../a.jpg':jpeg,'comparison.json':'{'},{'comparison.json':'{}'},{'A B.jpg':jpeg}]){
    let dir;try{dir=folder(bad);}catch{continue;}
    assert.throws(()=>validate(dir),JSON.stringify(Object.keys(bad)));
  }
  const dir=folder({'a.jpg':jpeg});fs.symlinkSync(path.join(dir,'a.jpg'),path.join(dir,'b.jpg'));assert.throws(()=>validate(dir),/regular files/);
  const sub=folder({'a.jpg':jpeg});fs.mkdirSync(path.join(sub,'nested'));assert.throws(()=>validate(sub),/regular files/);
});
test('summary reports counts and never candidate text',()=>{
  const dir=folder({'a.jpg':jpeg,'report.json':JSON.stringify({label:'<img src=x>',shots:[{file:'a.png',horizontalOverflow:0,errors:[]},{file:'b.png',horizontalOverflow:12,errors:['@someone <script>']},{failed:'boom'},{skipped:'no tab'},null,'text']})});
  assert.deepEqual(summary(dir),{shots:2,failed:1,skipped:1,overflow:1,errors:1});
  assert.deepEqual(summary(folder({'a.jpg':jpeg,'report.json':'{"shots":"x"}'})),{shots:0,failed:0,skipped:0,overflow:0,errors:0});
  assert.deepEqual(summary(folder({'a.jpg':jpeg})),{shots:0,failed:0,skipped:0,overflow:0,errors:0});
});
