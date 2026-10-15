const percent=n=>Math.round(n*1000)/10+'%';
export const INVESTMENT_BRANCHES=[
 {key:'haste',baseId:'inherited_haste',name:'攻撃の手数',stat:'haste',label:'攻撃速度',icon:'sword',increment:r=>.025*r,format:percent,group:'combat',description:'武器の速度に加算。実攻撃速度の上限1.6倍。'},
 {key:'critRate',baseId:'inherited_precision',name:'会心の心得',stat:'critRate',label:'会心ゲージ',icon:'spark',increment:r=>.02*r,format:percent,group:'combat',description:'確定会心ゲージに加算。指輪と合わせ最大50%。'},
 {key:'spellPower',baseId:'inherited_spellcraft',name:'魔法の威力',stat:'spellPower',label:'魔法ダメージ',icon:'flame',increment:r=>.04*r,format:percent,group:'combat',description:'呪文・燃焼・触媒爆発に適用。MPと触媒の消費は維持。'},
 {key:'gatherSpeed',baseId:'inherited_gathering',name:'採集の技法',stat:'gatherSpeed',label:'本人採集速度',icon:'axe',increment:r=>.03*r,format:percent,group:'production',description:'本人の採集だけ。職人・産卵・訓練には適用しない。'},
 {key:'craftSpeed',baseId:'inherited_crafting',name:'製造の技法',stat:'craftSpeed',label:'製造速度',icon:'tool',increment:r=>.03*r,format:percent,group:'production',description:'武器・防具・村・料理の製造。調合は別。'},
 {key:'alchemySpeed',baseId:'inherited_alchemy',name:'調合の技法',stat:'alchemySpeed',label:'調合速度',icon:'spark',increment:r=>.03*r,format:percent,group:'production',description:'触媒・護液の調合だけ。材料消費と最大在庫12は維持。'},
 {key:'tradeSaleBonus',baseId:'inherited_trade',name:'交易の交渉',stat:'tradeSaleBonus',label:'売価補正',icon:'gold',increment:r=>.01*r,format:percent,group:'production',description:'売却金貨に加算。今の買値80%が上限。購入即売却は利益にならない。'},
].map(x=>({...x,investment:true}));
export const investmentRankId=(d,n)=>n===1?d.baseId:d.baseId+'_'+n;
export const INVESTMENT_UPGRADES=INVESTMENT_BRANCHES.flatMap(d=>Array.from({length:5},(_,i)=>{const n=i+1;return {id:investmentRankId(d,n),name:d.name+' R'+n,cost:n,rank:n,kind:d.group==='production'?'investment':'combat',unlock:n===1?{bestWave:3}:{requires:[investmentRankId(d,n-1)]},effect:{[d.stat]:d.increment(n)},rankEffectMode:'add_to_lower_rank',description:d.description};}));
export function investmentEffect(s,key){if(s.version===1)return 0;const d=INVESTMENT_BRANCHES.find(x=>x.key===key);if(!d)return 0;let sum=0;for(let n=1;n<=5;n++){const id=investmentRankId(d,n);if(s.meta.upgrades.includes(id)&&!s.settings.disabledUpgrades.includes(id))sum+=d.increment(n);}return Math.round(sum*1e8)/1e8;}
