#!/usr/bin/env node
'use strict';
// DRAFT: trusted integration supplies fixed config; never use issue/env for config.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const crypto=require('node:crypto'),cp=require('node:child_process');
function validate(argv,model){
 const values=new Map(),flags=new Set();
 const valued=new Set(['output-format','input-format','max-turns','model','disallowedTools','setting-sources','tools','mcp-config','settings']);
 const booleans=new Set(['verbose','strict-mcp-config','disable-slash-commands']);
 for(let i=0;i<argv.length;i++){
  const m=/^--([A-Za-z-]+)(?:=(.*))?$/s.exec(argv[i]);
  if(!m)throw Error('unexpected argument');
  const [,k,inline]=m;if(values.has(k)||flags.has(k))throw Error('duplicate option');
  if(booleans.has(k)){if(inline!==undefined)throw Error('boolean value');flags.add(k);continue;}
  if(!valued.has(k))throw Error('unapproved option');
  const v=inline===undefined?argv[++i]:inline;
  if(typeof v!=='string'||(inline===undefined&&v.startsWith('--')))throw Error('missing value');
  values.set(k,v);
 }
 for(const [k,v] of Object.entries({'output-format':'stream-json','input-format':'stream-json','max-turns':'2',disallowedTools:'*','setting-sources':'user',tools:''}))if(values.get(k)!==v)throw Error('required option mismatch: '+k);
 for(const f of booleans)if(!flags.has(f))throw Error('missing flag');
 function exactJSON(k,expected){let x;try{x=JSON.parse(values.get(k));}catch{throw Error('invalid JSON');}if(JSON.stringify(x)!==JSON.stringify(expected))throw Error('nonempty configuration');}
 exactJSON('mcp-config',{mcpServers:{}});exactJSON('settings',{disableAllHooks:true});
 if(model!==undefined&&model!=='claude-fable-5-2')throw Error('invalid trusted model');
 if(model===undefined?values.has('model'):values.get('model')!==model)throw Error('model policy mismatch');
 return argv.slice();
}
function environment(home,token){return {PATH:'/usr/bin:/bin',HOME:home,CLAUDE_CONFIG_DIR:path.join(home,'.claude'),...(token?{CLAUDE_CODE_OAUTH_TOKEN:token}:{})};}
async function run(config,argv,inputEnv=process.env){
 validate(argv,config.model);
 if(!path.isAbsolute(config.executable)||!/^[a-f0-9]{64}$/.test(config.sha256))throw Error('invalid trusted executable pin');
 const st=fs.lstatSync(config.executable);if(!st.isFile()||st.isSymbolicLink())throw Error('not regular binary');
 if(crypto.createHash('sha256').update(fs.readFileSync(config.executable)).digest('hex')!==config.sha256)throw Error('binary digest mismatch');
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'factory-launcher-'));fs.chmodSync(dir,0o700);
 const home=path.join(dir,'home'),cwd=path.join(dir,'cwd');fs.mkdirSync(home,{mode:0o700});fs.mkdirSync(cwd,{mode:0o700});fs.mkdirSync(path.join(home,'.claude'),{mode:0o700});
 try{
  const v=cp.spawnSync(config.executable,['--version'],{cwd,env:environment(home),encoding:'utf8',timeout:10000,maxBuffer:4096});
  if(v.status!==0||v.stdout.trim()!=='2.1.322 (Claude Code)')throw Error('CLI version mismatch');
  // Deliberately do not echo credentials or inherited environment in errors.
  if(typeof inputEnv.CLAUDE_CODE_OAUTH_TOKEN!=='string'||!inputEnv.CLAUDE_CODE_OAUTH_TOKEN.trim())throw Error('OAuth required');
  return await new Promise((resolve,reject)=>{
   const child=cp.spawn(config.executable,argv,{cwd,env:environment(home,inputEnv.CLAUDE_CODE_OAUTH_TOKEN),stdio:'inherit'});
   const forward=s=>child.kill(s),term=()=>forward('SIGTERM'),int=()=>forward('SIGINT');process.once('SIGTERM',term);process.once('SIGINT',int);
   function cleanup(){process.removeListener('SIGTERM',term);process.removeListener('SIGINT',int);}
   child.once('error',()=>{cleanup();reject(Error('CLI spawn failed'));});child.once('exit',(code)=>{cleanup();resolve(code===null?1:code);});
  });
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
}
module.exports={validate,environment,run};
// Integration wrapper must import this and supply reviewed executable+digest/model constants.
