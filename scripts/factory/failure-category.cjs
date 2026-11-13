'use strict';
const fs=require('node:fs'),path=require('node:path');
function category(messages){
 const errors=messages.filter(m=>m.type==='result'||m.type==='assistant'&&m.error);
 const text=JSON.stringify(errors).toLowerCase();
 if(/invalid.*token|expired.*token|authentication|oauth|unauthorized|401/.test(text))return 'authentication';
 if(/model.*not.*found|model.*not.*available|invalid.*model|model.*access|404/.test(text))return 'model-unavailable';
 if(/rate.limit|usage.limit|429|quota/.test(text))return 'usage-limit';
 if(/billing|credit|payment/.test(text))return 'billing';
 if(/network|connection|timeout|timed.out/.test(text))return 'network';
 return 'unclassified';
}
module.exports={category};
if(require.main===module){
 try{
  const root=fs.realpathSync(process.env.RUNNER_TEMP),file=fs.realpathSync(process.env.FACTORY_EXECUTION_FILE);
  if(!file.startsWith(root+path.sep)||fs.statSync(file).size>2000000)throw Error();
  console.log('Factory failure category: '+category(JSON.parse(fs.readFileSync(file,'utf8'))));
 }catch{console.log('Factory failure category: unavailable');}
}
