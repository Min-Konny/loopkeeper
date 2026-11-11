'use strict';
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),crypto=require('node:crypto'),{spawn}=require('node:child_process'),assert=require('node:assert/strict');
const binary=path.join(process.env.FACTORY_SDK_ROOT||path.join(__dirname,'sdk'),'node_modules/@anthropic-ai/claude-agent-sdk-linux-x64/claude');
assert.equal(crypto.createHash('sha256').update(fs.readFileSync(binary)).digest('hex'),'bfb3703ad5380242328459bc62ada4bde8ae7ba57c6e1eeadb9c00e08874c478');
const argv=['--output-format','stream-json','--verbose','--input-format','stream-json','--max-turns=2','--model=claude-fable-5-2','--disallowedTools=*','--setting-sources=user','--tools=','--strict-mcp-config','--mcp-config','{"mcpServers":{}}','--disable-slash-commands','--settings','{"disableAllHooks":true}'];
require('./action-launcher.cjs').validate(argv,'claude-fable-5-2');
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'factory-offline-'));
let initialized=false,authenticationFailed=false,buffer='',failed=false;
const child=spawn(binary,argv,{cwd:dir,env:{PATH:'/usr/bin:/bin',HOME:dir,CLAUDE_CONFIG_DIR:path.join(dir,'.claude'),CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC:'1',ANTHROPIC_BASE_URL:'http://127.0.0.1:9'},stdio:['pipe','pipe','pipe']});
const timeout=setTimeout(()=>{failed=true;child.kill();},15000);
child.stderr.resume();
child.stdout.on('data',chunk=>{buffer+=chunk;let end;while((end=buffer.indexOf('\n'))>=0){const line=buffer.slice(0,end);buffer=buffer.slice(end+1);if(!line)continue;try{const m=JSON.parse(line);
 if(m.type==='control_response')child.stdin.write(JSON.stringify({type:'user',message:{role:'user',content:'Offline initialization verification only.'},parent_tool_use_id:null,session_id:''})+'\n');
 if(m.type==='system'&&m.subtype==='init'){for(const k of ['tools','mcp_servers','skills','slash_commands'])assert.deepEqual(m[k],[]);assert.equal(m.model,'claude-fable-5-2');assert.equal(m.claude_code_version,'2.1.322');initialized=true;}
 if(m.type==='result'){assert.equal(m.is_error,true);assert.equal(m.total_cost_usd,0);assert.equal(m.duration_api_ms,0);assert.deepEqual(m.modelUsage,{});authenticationFailed=true;child.kill();}
 }catch{failed=true;child.kill();}}});
child.stdin.write(JSON.stringify({type:'control_request',request_id:'probe',request:{subtype:'initialize'}})+'\n');
child.on('error',()=>{failed=true;});
child.on('exit',()=>{clearTimeout(timeout);fs.rmSync(dir,{recursive:true,force:true});if(failed||!initialized||!authenticationFailed){console.error('Offline zero-tool CLI probe failed');process.exitCode=1;}else console.log('PASS official CLI2.1.322 initialized with zero tools/MCP/skills/commands; model configured Fable5.2; no authentication/API usage.');});
