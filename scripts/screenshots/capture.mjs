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

// Saves come from the checkout under test, so they always match its save format.
async function fixtures() {
  const load=name=>import(pathToFileURL(path.join(root,'src',name)).href);
  const E=await load('engine.js'),S=await load('save-storage.js');
  const dump=game=>{const m=new Map();S.writeStoredGame({getItem:k=>m.has(k)?m.get(k):null,setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k)},game);return Object.fromEntries(m);};
  const valid=game=>Boolean(E.parseSave(E.serializeGame(game)));
  const made={fresh:null};
  if(states.includes('busy')) {
    // An active job, a full reservation list and large stock: the crowded case for layout checks.
    const game=E.createGame();game.meta.points=5000;game.meta.totalPoints=5000;game.meta.bestWave=10;
    E.purchaseUpgrade?.(game,'action_queue');
    for(const id of ['chop_wood','quarry_stone','gather_food','chop_wood','quarry_stone'])E.enqueueAction?.(game,id,99);
    for(const id of ['wood','stone','food','gold'])if(id in game.run.resources)game.run.resources[id]=98765;
    E.startAction(game,'chop_wood');if(game.run.activeAction)game.run.activeAction.progress=game.run.activeAction.duration*.4;
    if(!valid(game))throw Error('The busy fixture is not a valid save for this checkout');
    made.busy=dump(game);
  }
  return made;
}

const playwright=await import(process.env.PLAYWRIGHT_MODULE?pathToFileURL(process.env.PLAYWRIGHT_MODULE).href:'playwright');
const server=await serve(),origin='http://127.0.0.1:'+server.address().port;
const saves=await fixtures();
const browser=await (playwright.chromium||playwright.default.chromium).launch({executablePath:process.env.CHROME_PATH||undefined,args:['--no-sandbox']});
fs.mkdirSync(out,{recursive:true});
const report=[];
for(const state of states) for(const [width,height] of sizes) {
  const context=await browser.newContext({viewport:{width,height},reducedMotion:'reduce'});
  const page=await context.newPage(),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  if(saves[state])await page.addInitScript(save=>{if(!localStorage.getItem('__seeded')){for(const [k,v] of Object.entries(save))localStorage.setItem(k,v);localStorage.setItem('__seeded','1');}},saves[state]);
  const shot=async screen=>{const file=`${screen}-${state}-${width}x${height}.png`;await page.screenshot({path:path.join(out,file)});
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
    report.push({file,screen,state,width,height,horizontalOverflow:Math.max(0,overflow),errors:[...errors]});};
  try {
    await page.goto(origin+'/index.html');await page.waitForSelector('#title-screen nav button',{timeout:20000});await page.waitForTimeout(600);
    if(screens.includes('title')&&state===states[0])await shot('title');
    if(screens.some(s=>s!=='title')) {
      await page.click(saves[state]?'[data-title-action="continue"]':'[data-title-action="new"]');
      await page.waitForSelector('#navigation .nav-item',{timeout:20000});await page.waitForTimeout(2500);
      for(const screen of screens.filter(s=>s!=='title')) {
        const tab=page.locator(`#navigation [data-tab="${screen}"]`);
        if(!await tab.count()){report.push({screen,state,width,height,skipped:'no such tab in this checkout or state'});continue;}
        // Narrow layouts keep navigation in a menu; selecting through the DOM works at every width.
        await tab.first().evaluate(node=>node.click());await page.waitForTimeout(900);
        const expanded=page.locator('#expanded-work-dialog[open] [data-close], #expanded-work-dialog[open] button[aria-label]');
        await shot(screen);
        if(await expanded.count())await page.keyboard.press('Escape');
      }
    }
  } catch(error) {report.push({state,width,height,failed:String(error.message||error).split('\n')[0]});}
  await context.close();
}
await browser.close();server.close();
const meta={label:args.label||'',root,screens,states,sizes,shots:report};
fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(meta,null,1));
for(const r of report)console.log(r.file||`${r.screen||''} ${r.state} ${r.width}x${r.height}`,r.failed?'FAILED '+r.failed:r.skipped?'skipped: '+r.skipped:`overflow=${r.horizontalOverflow}px errors=${r.errors.length}`);
