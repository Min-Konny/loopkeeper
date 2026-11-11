// Offline check of the installed SDK serializer. No child process or model may start.
const assert=require('node:assert/strict');
const {options}=require('./proposal-generator.cjs');
(async()=>{
 const {query}=await import(process.env.FACTORY_SDK_MODULE);let captured=false;
 try{
  for await(const ignored of query({prompt:'Offline serialization probe',options:{
   ...options({token:'offline-dummy-not-a-secret',home:'/tmp',cwd:'/tmp',pathEnv:'/usr/bin'}),
   spawnClaudeCodeProcess(o){
    assert.ok(o.args.includes('--tools='));assert.ok(o.args.includes('--setting-sources='));
    assert.ok(o.args.includes('--disallowedTools=*'));assert.ok(o.args.includes('--strict-mcp-config'));
    assert.equal(o.env.GITHUB_TOKEN,undefined);assert.equal(o.env.ANTHROPIC_API_KEY,undefined);
    assert.equal(o.env.CLAUDE_CODE_OAUTH_TOKEN,'offline-dummy-not-a-secret');
    captured=true;throw Error('Expected stop before child spawn');
   }
  }})){}
 }catch(error){if(!captured)throw error;}
 assert.equal(captured,true);console.log('PASS fixed SDK zero-tool serialization; no process/model spawned');
})().catch(()=>{console.error('SDK isolation options failed validation');process.exitCode=1;});
