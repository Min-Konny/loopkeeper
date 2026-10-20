export const MEALS = [
  {id:'fish_meal',recipe:'cook_fish',name:'魚料理',units:6,duration:90,attack:.1,label:'本人の通常攻撃 +10%'},
  {id:'egg_meal',recipe:'egg_stew',name:'卵料理',units:5,duration:90,haste:.15,label:'通常攻撃速度 +15%'},
];
export const mealById=id=>MEALS.find(x=>x.id===id);
export const mealByRecipe=id=>MEALS.find(x=>x.recipe===id);
export const MEAL_RESOURCES=MEALS.map(x=>({id:x.id,name:x.name}));
export const PRESSURE_FACILITY={id:'signal_post',facilityId:'signal_post',name:'警鐘台',level:1,skill:'smithing',unlockLevel:3,unlockBestWave:6,requires:[],duration:24,cost:{wood:48,stone:36,ingot:4,gold:18},effect:{pressureSlow:.3},effectMode:'replace_previous_level_totals',xpCoefficient:1,description:'長期戦の敵攻撃力上昇を30%遅らせる。猶予は延ばさず、強化は停止しない。'};
