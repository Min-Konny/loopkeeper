#!/usr/bin/env node
// Lays out "before | after" sheets from two capture.mjs output folders, as JPEG files small enough
// to post on a PR. Uses the same browser as capture.mjs, so it adds no image dependency.
//
//   node scripts/screenshots/compare.mjs --before <dir> --after <dir> --out <dir>
//        [--before-label <text>] [--after-label <text>]
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

const args=Object.fromEntries(process.argv.slice(2).join(' ').split(/\s*--/).filter(Boolean).map(a=>{const [k,...v]=a.trim().split(/\s+/);return [k,v.join(' ')||'1'];}));
const before=path.resolve(args.before),after=path.resolve(args.after),out=path.resolve(args.out||'comparison');
const names=fs.readdirSync(after).filter(name=>/^[\w-]+\.png$/.test(name)&&fs.existsSync(path.join(before,name))).sort();
const data=file=>'data:image/png;base64,'+fs.readFileSync(file).toString('base64');
const escape=text=>String(text).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const playwright=await import(process.env.PLAYWRIGHT_MODULE?pathToFileURL(process.env.PLAYWRIGHT_MODULE).href:'playwright');
const browser=await (playwright.chromium||playwright.default.chromium).launch({executablePath:process.env.CHROME_PATH||undefined,args:['--no-sandbox']});
fs.mkdirSync(out,{recursive:true});
const made=[];
for(const name of names) {
  const a=fs.readFileSync(path.join(before,name)),b=fs.readFileSync(path.join(after,name));
  const same=a.equals(b),width=b.readUInt32BE(16),height=b.readUInt32BE(20);
  // Each side is shown at most 960px wide; phones keep their own size.
  const shown=Math.min(960,width),page=await browser.newPage({viewport:{width:shown*2+48,height:Math.round(height*shown/width)+64}});
  await page.setContent(`<body style="margin:0;background:#101816;color:#e9e6d3;font:14px system-ui"><div style="display:flex;gap:16px;padding:16px"><figure style="margin:0"><figcaption style="padding:0 0 8px">${escape(args['before-label']||'before')}</figcaption><img width="${shown}" src="${data(path.join(before,name))}"></figure><figure style="margin:0"><figcaption style="padding:0 0 8px">${escape(args['after-label']||'after')}${same?' (identical)':''}</figcaption><img width="${shown}" src="${data(path.join(after,name))}"></figure></div></body>`);
  const file=name.replace(/\.png$/,'.jpg');
  await page.screenshot({path:path.join(out,file),type:'jpeg',quality:82,fullPage:true});await page.close();
  made.push({file,same});console.log(file,same?'identical':'changed');
}
await browser.close();
fs.writeFileSync(path.join(out,'comparison.json'),JSON.stringify({before:args['before-label']||'',after:args['after-label']||'',sheets:made},null,1));
