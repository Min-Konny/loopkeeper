import{createRequire}from'node:module';const require=createRequire(import.meta.url);
const {test}=require('node:test'),assert=require('node:assert/strict');const {validate,environment}=require('../scripts/factory/action-launcher.cjs');
const args=['--output-format','stream-json','--verbose','--input-format','stream-json','--max-turns=2','--disallowedTools=*','--setting-sources=user','--tools=','--strict-mcp-config','--mcp-config','{"mcpServers":{}}','--disable-slash-commands','--settings','{"disableAllHooks":true}'];
test('Rust exact serializer accepted without model',()=>assert.deepEqual(validate(args),args));
test('Loop exact pinned model accepted',()=>validate([...args,'--model=claude-fable-5-2'],'claude-fable-5-2'));
test('schema rejected to prevent StructuredOutput tool',()=>assert.throws(()=>validate([...args,'--json-schema','{"type":"object","properties":{}}'])));
for(const extra of ['--dangerously-skip-permissions','--allowedTools=Bash','--permission-mode=bypassPermissions','--plugin-dir=/tmp','--add-dir=/workspace','--resume=abc','--model=other','--tools=Bash','--strict-mcp-config=false','--settings={}','--mcp-config={}'])test('reject '+extra,()=>assert.throws(()=>validate([...args,extra])));
for(const [old,v] of [['--tools=','--tools=Read'],['--setting-sources=user','--setting-sources=project'],['--disallowedTools=*','--disallowedTools='],['{"mcpServers":{}}','{"mcpServers":{"evil":{}}}'],['{"disableAllHooks":true}','{"disableAllHooks":false}']])test('reject mutated '+old,()=>assert.throws(()=>validate(args.map(a=>a===old?v:a))));
test('missing tools fails (empty string trap)',()=>assert.throws(()=>validate(args.filter(a=>a!=='--tools='))));
test('missing Loop model fails',()=>assert.throws(()=>validate(args,'claude-fable-5-2')));
test('positional prompt forbidden',()=>assert.throws(()=>validate([...args,'injected'])));
test('credential env strict allowlist',()=>assert.deepEqual(environment('/fresh','fake-test-token'),{PATH:'/usr/bin:/bin',HOME:'/fresh',CLAUDE_CONFIG_DIR:require('node:path').join('/fresh','.claude'),CLAUDE_CODE_OAUTH_TOKEN:'fake-test-token'}));
test('version env no credential',()=>assert.equal(Object.keys(environment('/fresh')).length,3));
test('spawn uses fresh dirs, clean env and removes them; no real CLI/model',{skip:process.platform==='win32'?'POSIX executable/shebang and 0700 permission fixture requires Linux':false},async()=>{
 const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),crypto=require('node:crypto');const {run}=require('../scripts/factory/action-launcher.cjs');
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'launcher-test-')),bin=path.join(dir,'fixture');
 const src='#!'+process.execPath+'\n'+`if(process.argv.includes('--version')){console.log('2.1.322 (Claude Code)');process.exit(0);}const fs=require('node:fs'),assert=require('node:assert/strict');assert.deepEqual(Object.keys(process.env).sort(),['PATH','HOME','CLAUDE_CONFIG_DIR','CLAUDE_CODE_OAUTH_TOKEN'].sort());assert.equal(process.env.CLAUDE_CODE_OAUTH_TOKEN,'fake-test-token');assert.notEqual(process.cwd(),${JSON.stringify(process.cwd())});assert.equal(fs.statSync(process.env.HOME).mode&511,448);assert.equal(fs.readdirSync(process.cwd()).length,0);`;
 fs.writeFileSync(bin,src,{mode:0o700});try{const sha256=crypto.createHash('sha256').update(src).digest('hex');assert.equal(await run({executable:bin,sha256},args,{CLAUDE_CODE_OAUTH_TOKEN:'fake-test-token',GH_TOKEN:'must-not-pass',ANTHROPIC_API_KEY:'must-not-pass',NODE_OPTIONS:'must-not-pass',PATH:'/untrusted'}),0);}finally{fs.rmSync(dir,{recursive:true,force:true});}
});
