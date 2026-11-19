#!/usr/bin/env node
// Captures the game's screens from any checkout, for visual acceptance of a PR.
// It serves the checkout on a private port, builds test saves with that checkout's own engine,
// and never reads or writes a real player's save (a fresh browser profile per shot).
//
//   node scripts/screenshots/capture.mjs --root <checkout> --out <dir> [--label <text>]
//        [--screens title,home,gather,craft] [--states fresh,busy] [--sizes 1280x720,1920x1080,390x844]
//
// Needs Playwright. Set PLAYWRIGHT_MODULE to its index.mjs and CHROME_PATH to a browser when they
// are not installed beside this script. Reporting only: a failed shot is listed, not thrown.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

const args=Object.fromEntries(process.argv.slice(2).join(' ').split(/\s*--/).filter(Boolean).map(a=>{const [k,...v]=a.trim().split(/\s+/);return [k,v.join(' ')||'1'];}));
const root=path.resolve(args.root||'.'),out=path.resolve(args.out||'screenshots');
const list=(value,fallback)=>(value||fallback).split(',').map(x=>x.trim()).filter(Boolean);
const screens=list(args.screens,'title,home,gather'),states=list(args.states,'fresh,busy');
const sizes=list(args.sizes,'1280x720,1920x1080,390x844').map(s=>s.split('x').map(Number));
const TYPES={'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.svg':'image/svg+xml','.woff':'font/woff','.ttf':'font/ttf','.mp3':'audio/mpeg','.wav':'audio/wav'};

function serve() {
  const server=http.createServer((request,response)=>{
    const file=path.join(root,decodeURIComponent(new URL(request.url,'http://x').pathname));
    if(!file.startsWith(root+path.sep)&&file!==root){response.writeHead(403).end();return;}
    fs.readFile(fs.existsSync(file)&&fs.statSync(file).isDirectory()?path.join(file,'index.html'):file,(error,data)=>{
      if(error){response.writeHead(404).end();return;}
      response.writeHead(200,{'content-type':TYPES[path.extname(file)]||'application/octet-stream','cache-control':'no-store'}).end(data);
    });
  });
  return new Promise(resolve=>server.listen(0,'127.0.0.1',()=>resolve(server)));
}


const load=name=>import(pathToFileURL(path.join(root,'src',name)).href);
const E=await load('engine.js'), S=await load('save-storage.js');
const modes=['title','home','gather','village','equipment','party','routes','battle','augments','inheritance','results','records'];

function fixture(mode) {
  const g=E.createGame();
  g.meta.bestWave=12;
  g.meta.points=g.meta.totalPoints=100;
  g.run.wave=6;
  g.run.nextWaveAt=180;
  g.settings.paused=true;
  for(const id of ['wood','stone','food','gold'])if(id in g.run.resources)g.run.resources[id]=100;
  if(mode==='gather'||mode==='home'){
    const jobs=['chop_wood','quarry_stone','gather_food','chop_wood','quarry_stone'];
    g.run.queue=jobs.map((id,i)=>({id,count:2,kind:'action',goalId:i+1}));
    g.run.queueSeq=jobs.length;
    E.startAction(g,'chop_wood');
    if(g.run.activeAction)g.run.activeAction.progress=g.run.activeAction.duration*.4;
  }
  if(mode==='battle'){
    g.run.nextWaveAt=g.run.elapsed;
    g.run.idleWait=true;
    g.settings.paused=false;
    E.advanceTime(g,.25);
    if(g.run.status!=='combat')throw Error('Synthetic battle did not start');
    g.settings.paused=true;
  }
  if(mode==='augments')g.run.augments.offer=['warrior','provisions','forestry'];
  if(mode==='inheritance'||mode==='results'){
    E.abandonRun(g);
    if(mode==='inheritance'&&g.run.status!=='legacy_setup')E.restartRun(g);
  }
  const saved=E.parseSave(E.serializeGame(g));
  if(!saved)throw Error('Invalid fixture: '+mode);
  const data=new Map();
  S.writeStoredGame({getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,String(v)),removeItem:k=>data.delete(k)},g);
  return Object.fromEntries(data);
}
const {chromium}=await import('playwright');
const server=await serve(),origin='http://127.0.0.1:'+server.address().port;
const browser=await chromium.launch({channel:'chrome'});
fs.mkdirSync(out,{recursive:true});
const report=[];
try{
  for(const mode of modes)for(const [width,height] of sizes){
    const context=await browser.newContext({viewport:{width,height},locale:'ja-JP',reducedMotion:'reduce'});
    const page=await context.newPage(), errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.route('**/*',r=>new URL(r.request().url()).origin===origin?r.continue():r.abort());
    try {
      if(mode!=='title')await page.addInitScript(data=>{for(const [k,v] of Object.entries(data))localStorage.setItem(k,v);},fixture(mode));
      await page.goto(origin+'/index.html');
      await page.locator('#title-screen nav button').first().waitFor();
      if(mode!=='title'){
        await page.locator('[data-title-action="continue"]').click();
        await page.locator('#navigation [data-tab="home"]').waitFor({state:'attached',timeout:6000});
        const tab={gather:'gather',village:'village',routes:'diplomacy'}[mode];
        if(tab)await page.locator('#navigation [data-tab="'+tab+'"]').evaluate(n=>n.click());
        if(['equipment','party','records'].includes(mode)){
          const info=mode==='records'?'journal':'status';
          await page.locator('[data-info="'+info+'"]').filter({visible:true}).first().click();
          await page.locator('#info-dialog[open]').waitFor();
          if(mode==='party')await page.locator('.party-panel').scrollIntoViewIfNeeded({timeout:6000});
          if(mode==='equipment'){
            const gear=page.locator('.gear-panel > summary').first();
            await gear.click({timeout:6000});
            await gear.scrollIntoViewIfNeeded();
          }
        }
        if(mode==='routes')await page.locator('.routes-panel').scrollIntoViewIfNeeded({timeout:6000});
        const dialog={battle:'#battle-dialog',augments:'#augment-dialog',results:'#death-dialog',inheritance:'#death-dialog'}[mode];
        if(dialog)await page.locator(dialog+'[open]').waitFor({timeout:6000});
      }
      await page.evaluate(()=>document.fonts.ready);
      await page.waitForTimeout(350);
      const file=mode+'-'+width+'x'+height+'.png';
      await page.screenshot({path:path.join(out,file)});
      const visible=await page.evaluate(()=>document.querySelector('dialog[open]:not(#expanded-work-dialog)')?.innerText||document.body.innerText);
      report.push({mode,width,height,file,visible,errors});
    }catch(e){report.push({mode,width,height,error:String(e.message),errors});}
    await context.close();
  }
}finally{
  await browser.close();server.close();
  fs.writeFileSync(path.join(out,'report.json'),JSON.stringify({sha:args.label,report},null,2));
}
for(const r of report)console.log(r.file||r.mode+' '+r.width, r.error||r.errors.join(' ')||'OK');
if(report.some(r=>r.error||r.errors.length))process.exitCode=1;
