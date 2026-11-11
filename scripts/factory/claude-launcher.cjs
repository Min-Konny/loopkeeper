#!/usr/bin/env node
'use strict';
const path=require('node:path');
require('./action-launcher.cjs').run({
 executable:path.join(__dirname,'factory-sdk/node_modules/@anthropic-ai/claude-agent-sdk-linux-x64/claude'),
 sha256:'bfb3703ad5380242328459bc62ada4bde8ae7ba57c6e1eeadb9c00e08874c478',
 model:'claude-fable-5-2'
},process.argv.slice(2)).then(code=>{process.exitCode=code;}).catch(()=>{console.error('Trusted launcher rejected invocation');process.exitCode=1;});
