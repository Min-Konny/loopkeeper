export const WORK_MILESTONES=[
 {id:'logging',material:'timber_mark',name:'森仕事の証',action:'chop_wood',label:'木を伐る',count:30,wave:3,recipe:'work_boots'},
 {id:'smithing',material:'artisan_mark',name:'仕立ての証',equipment:true,label:'武器・防具・道具・アクセサリー製作',count:30,wave:3,recipe:'artisan_bracelet'},
 {id:'smelting',material:'forge_mark',name:'炉仕事の証',action:'smelt_iron',label:'鉄を精錬',count:30,wave:9,recipe:'guild_pendant'},
 {id:'fishing',material:'river_pearl',name:'川の真珠',action:'fish_river',label:'川で釣る',count:30,wave:3,recipe:'angler_pendant'},
];
export const workMaterialById=id=>WORK_MILESTONES.find(x=>x.material===id);
