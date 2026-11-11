'use strict';
const fs=require('node:fs'),path=require('node:path');
function evidence(messages,expectedModel){
 if(!Array.isArray(messages)||messages.length>1000)throw Error('Invalid execution log');
 const init=messages.filter(m=>m.type==='system'&&m.subtype==='init');
 const results=messages.filter(m=>m.type==='result');
 if(init.length!==1||results.length!==1)throw Error('Missing unique initialization/result');
 const i=init[0],r=results[0];
 for(const k of ['tools','mcp_servers','skills','slash_commands'])if(!Array.isArray(i[k])||i[k].length)throw Error('Generator tool boundary failed');
 if(i.claude_code_version!=='2.1.322')throw Error('Unverified Claude Code version');
 if(typeof i.model!=='string'||!i.model||expectedModel&&i.model!==expectedModel)throw Error('Unexpected initialized model');
 if(r.subtype!=='success'||r.is_error!==false||!Number.isSafeInteger(r.num_turns)||r.num_turns<1||r.num_turns>2||typeof r.result!=='string')throw Error('No successful bounded proposal');
 const assistants=messages.filter(m=>m.type==='assistant');
 if(!assistants.length||assistants.some(m=>m.error||m.is_api_error_message||m.message?.model!==i.model||(m.message?.content||[]).some(b=>b.type==='tool_use')))throw Error('Missing actual model reply or tool use found');
 const usage=r.modelUsage;
 if(!usage||Object.keys(usage).length!==1||!usage[i.model]||!(Number(usage[i.model].inputTokens)>0||Number(usage[i.model].outputTokens)>0))throw Error('No matching actual model usage');
 const proposal=r.result;
 JSON.parse(proposal); // Plain JSON only; no markdown extraction or tool-backed schema.
 if(Buffer.byteLength(proposal)>100000)throw Error('Proposal too large');
 return {proposal,summary:{model:i.model,claudeCodeVersion:i.claude_code_version,tools:0,mcpServers:0,actualModelResponse:true}};
}
function readResult(filename,temp,expectedModel){
 const root=fs.realpathSync(temp),resolved=fs.realpathSync(filename);
 if(!resolved.startsWith(root+path.sep)||fs.lstatSync(filename).isSymbolicLink())throw Error('Unexpected execution-file location');
 const st=fs.statSync(resolved);if(!st.isFile()||st.size>2000000)throw Error('Invalid execution-file');
 return evidence(JSON.parse(fs.readFileSync(resolved,'utf8')),expectedModel);
}
module.exports={evidence,readResult};
if(require.main===module)try{
 const {proposal,summary}=readResult(process.env.FACTORY_EXECUTION_FILE,process.env.RUNNER_TEMP,process.env.FACTORY_EXPECTED_MODEL||undefined);
 fs.writeFileSync(path.join(process.env.RUNNER_TEMP,'proposal.json'),proposal,{flag:'wx',mode:0o600});
 console.log('Verified generator metadata: '+JSON.stringify(summary));
}catch{console.error('Factory model/tool evidence failed; no proposal admitted.');process.exitCode=1;}
