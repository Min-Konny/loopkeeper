// The capture job runs candidate code, so everything it uploads is untrusted data.
// The publishing job accepts only a flat folder of small JPEG sheets and two JSON summaries.
const fs=require('node:fs'),path=require('node:path');
const LIMITS={files:80,bytes:25*1024*1024,json:256*1024};
function validate(dir){
  const names=fs.readdirSync(dir).sort();
  if(!names.length||names.length>LIMITS.files)throw Error('Unexpected number of files');
  let total=0;const images=[];
  for(const name of names){
    const file=path.join(dir,name),stat=fs.lstatSync(file);
    if(!stat.isFile()||stat.nlink!==1)throw Error('Only regular files are accepted: '+name);
    total+=stat.size;if(total>LIMITS.bytes)throw Error('Screenshots exceed the size limit');
    if(/^[a-z0-9-]{1,60}\.jpg$/.test(name)){
      const head=Buffer.alloc(3),fd=fs.openSync(file,'r');fs.readSync(fd,head,0,3,0);fs.closeSync(fd);
      if(head[0]!==0xff||head[1]!==0xd8||head[2]!==0xff)throw Error('Not a JPEG: '+name);
      images.push(name);
    }else if(name==='comparison.json'||name==='report.json'){
      if(stat.size>LIMITS.json)throw Error('Summary too large: '+name);JSON.parse(fs.readFileSync(file,'utf8'));
    }else throw Error('Unexpected file: '+name);
  }
  if(!images.length)throw Error('No screenshots');
  return images;
}
// Summaries are shown as numbers only; no text from the candidate reaches the PR comment.
function summary(dir){
  let shots=[];try{shots=JSON.parse(fs.readFileSync(path.join(dir,'report.json'),'utf8')).shots;}catch{}
  shots=Array.isArray(shots)?shots:[];
  const count=key=>shots.filter(s=>s&&typeof s==='object'&&key(s)).length;
  return {shots:count(s=>typeof s.file==='string'),failed:count(s=>'failed' in s),skipped:count(s=>'skipped' in s),overflow:count(s=>Number(s.horizontalOverflow)>0),errors:count(s=>Array.isArray(s.errors)&&s.errors.length>0)};
}
module.exports={validate,summary,LIMITS};
if(require.main===module)console.log(validate(process.argv[2]).join('\n'));
