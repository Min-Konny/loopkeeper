export const freshFarm=()=>({batch:null,feedUsed:0,eggsProduced:0,cycles:0});
export function initializeFarm(s){if(s.version===1)return;s.meta.farmVersion=1;s.run.resources.fodder??=0;s.run.resources.eggs??=0;s.run.farmState??=freshFarm();s.settings.farmAutoCook??=false;s.settings.farmOffline??=false;}
export function farmStatus(s){const p=s.run.farmState,b=p?.batch;
 if(!s.run.facilities.henhouse)return {code:'unbuilt',text:'鶏小屋を建設すると鶏1羽を飼えます。'};
 if(b?.progress>=20)return {code:'full',text:'卵が満杯。回収済みの飼料を保持して空きを待ちます。'};
 if(b)return {code:'producing',text:'産卵中 '+b.progress.toFixed(1)+'/20秒（飼料2は支払い済み）'};
 if(s.run.resources.eggs>38)return {code:'full',text:'卵の空き2が必要。飼料は消費しません。'};
 if(s.run.resources.fodder<2)return {code:'hungry',text:'飼料不足で停止。鶏は死亡せず、進行も失いません。'};
 return {code:'ready',text:s.settings.paused?'時間停止中。待機または作業開始で産卵します。':'次の産卵を待機中。'};
}
export function advanceFarm(s,dt,reserved={}){
 if(!s.run.facilities.henhouse||s.settings.paused||!['preparing','combat'].includes(s.run.status))return;
 const p=s.run.farmState??=freshFarm();
 if(!p.batch){if(s.run.resources.eggs>38||s.run.resources.fodder-(reserved.fodder||0)<2)return;s.run.resources.fodder-=2;p.feedUsed=Math.min(1e9,p.feedUsed+2);p.batch={progress:0,paidFeed:2,quantity:2};}
 p.batch.progress=Math.min(20,Math.round((p.batch.progress+dt)*1e6)/1e6);
 if(p.batch.progress+1e-8>=20&&s.run.resources.eggs<=38){s.run.resources.eggs+=2;p.eggsProduced=Math.min(1e9,p.eggsProduced+2);p.cycles=Math.min(5e8,p.cycles+1);p.batch=null;}
}
