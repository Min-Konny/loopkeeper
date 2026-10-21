// Cosmetic time only. Never used by the simulation, save or production logic.
export function lumberjackPose(seconds,working){
 if(!working)return{x:126,y:202,frame:0,flip:false,chips:false};
 const t=seconds%14;
 if(t<3)return{x:126-(t/3)*65,y:202-(t/3)*27,frame:Math.floor(t*7)%4,flip:true,chips:false};
 if(t<8)return{x:61,y:175,frame:4+Math.floor((t-3)*5)%4,flip:false,chips:Math.floor((t-3)*5)%4===2};
 if(t<12)return{x:61+(t-8)/4*65,y:175+(t-8)/4*27,frame:8+Math.floor(t*7)%4,flip:false,chips:false};
 return{x:126,y:202,frame:8,flip:false,chips:false};
}
export const campSnapshot=model=>({facilities:{...model.facilities},construction:model.construction?{...model.construction}:null,night:!!model.night,chopping:!!model.chopping,threat:Number(model.threat)||0,dynamicActors:true});
