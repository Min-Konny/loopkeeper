import test from 'node:test';import assert from 'node:assert/strict';import{createRequire}from'node:module';const require=createRequire(import.meta.url),{evidence}=require('../scripts/factory/action-result.cjs');
const model='claude-fable-5-2',json=JSON.stringify({files:[{path:'src/a.js',content:'x'}]});
function data(){return[{type:'system',subtype:'init',tools:[],mcp_servers:[],skills:[],slash_commands:[],model,claude_code_version:'2.1.322'},{type:'assistant',message:{model,content:[{type:'text',text:json}]}},{type:'result',subtype:'success',is_error:false,num_turns:1,result:json,modelUsage:{[model]:{inputTokens:10,outputTokens:5}}}];}
test('admits matching actual model response with zero tools',()=>assert.equal(evidence(data(),model).proposal,json));
for(const [name,change]of Object.entries({
 tool:d=>d[0].tools=['Bash'],schemaTool:d=>d[0].tools=['StructuredOutput'],mcp:d=>d[0].mcp_servers=['x'],skills:d=>d[0].skills=['x'],commands:d=>d[0].slash_commands=['x'],version:d=>d[0].claude_code_version='2.1.320',
 wrongInit:d=>d[0].model='other',wrongReply:d=>d[1].message.model='other',synthetic:d=>d[1].message.model='<synthetic>',toolUse:d=>d[1].message.content.push({type:'tool_use'}),
 failed:d=>d[2].is_error=true,multipleResults:d=>d.push(d[2]),noUsage:d=>d[2].modelUsage={},zeroUsage:d=>d[2].modelUsage[model]={inputTokens:0,outputTokens:0},fallbackUsage:d=>d[2].modelUsage.other={inputTokens:1},
 excessTurns:d=>d[2].num_turns=3,markdown:d=>d[2].result='markdown',large:d=>d[2].result=JSON.stringify('x'.repeat(100001))
}))test('refuses '+name,()=>{const d=data();change(d);assert.throws(()=>evidence(d,model));});
test('Rust observes selected model without imposing Loop Fable',()=>{const d=data();for(const m of d){if(m.model)m.model='claude-opus-5-5';if(m.message)m.message.model='claude-opus-5-5';}d[2].modelUsage={'claude-opus-5-5':{inputTokens:3}};assert.equal(evidence(d).summary.model,'claude-opus-5-5');});
