'use strict';
const fs=require('node:fs'),path=require('node:path');
function options({token,home,cwd,pathEnv}){
 if(typeof token!=='string'||!token.trim())throw Error('Missing subscription OAuth credential');
 return {cwd,tools:[],allowedTools:[],disallowedTools:['*'],settingSources:[],skills:[],
  mcpServers:{},strictMcpConfig:true,hooks:{},settings:{disableAllHooks:true},
  managedSettings:{disableAllHooks:true},persistSession:false,maxTurns:2,
  systemPrompt:'Return only the requested source replacement JSON. You have no tools and must not execute code.',
  env:{PATH:pathEnv,HOME:home,CLAUDE_CONFIG_DIR:path.join(home,'.claude'),CLAUDE_CODE_OAUTH_TOKEN:token},
  canUseTool:async()=>({behavior:'deny',message:'Factory proposal generator has no tools'}),
  outputFormat:{type:'json_schema',schema:{type:'object',additionalProperties:false,required:['files'],
   properties:{files:{type:'array',maxItems:4,items:{type:'object',additionalProperties:false,
    required:['path','content'],properties:{path:{type:'string'},content:{type:'string'}}}}}}},
  stderr:()=>{}};
}
async function generate({query,prompt,token,home,cwd,pathEnv}){
 if(typeof prompt!=='string'||Buffer.byteLength(prompt)>100000)throw Error('Invalid prompt');
 let result;
 for await(const message of query({prompt,options:options({token,home,cwd,pathEnv})})){
  if(message.type==='result'){
   if(message.subtype!=='success'||message.is_error||!message.structured_output)throw Error('Proposal generation did not succeed');
   result=JSON.stringify(message.structured_output);
  }
 }
 if(!result||Buffer.byteLength(result)>100000)throw Error('Missing or oversize proposal');
 return result;
}
module.exports={options,generate};
if(require.main===module)(async()=>{
 // Never inherit GITHUB_TOKEN, provider API keys, telemetry or external MCP settings.
 if(process.env.ANTHROPIC_API_KEY)throw Error('API-key fallback forbidden');
 const temp=fs.mkdtempSync(path.join(process.env.RUNNER_TEMP||'/tmp','factory-generator-'));
 const home=path.join(temp,'home'),cwd=path.join(temp,'empty');fs.mkdirSync(home);fs.mkdirSync(cwd);
 const {query}=await import(process.env.FACTORY_SDK_MODULE);
 const result=await generate({query,prompt:process.env.FACTORY_PROMPT,token:process.env.CLAUDE_CODE_OAUTH_TOKEN,
 home,cwd,pathEnv:process.env.PATH});
 fs.writeFileSync(process.env.RUNNER_TEMP+'/proposal.json',result,{flag:'wx',mode:0o600});
})().catch(()=>{console.error('Factory proposal generation failed; no credential or model output logged.');process.exitCode=1;});
