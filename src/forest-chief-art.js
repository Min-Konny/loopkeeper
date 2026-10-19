// Dedicated portrait for forest_chief; existing family/player renderers stay separate.
const rect=(x,y,w,h,c)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}"/>`;
const ink='#233737',shade='#586e62',fur='#7b8e87',light='#9eaaa0',bone='#eee0b7',gold='#dab77a',moss='#697f52',bark='#81765b';
let cached;
export function forestChiefPortrait(){
 if(cached)return cached;
 let art=rect(9,97,79,3,ink);
 // Raised, ragged tail and the far legs sit behind the broad alpha's shoulders.
 art+=rect(74,41,12,20,ink)+rect(83,29,8,21,ink)+rect(87,19,6,16,ink)+rect(78,40,7,14,shade)+rect(86,30,4,13,fur)+rect(89,21,3,10,light);
 art+=rect(44,66,10,28,shade)+rect(39,92,18,5,shade)+rect(71,66,9,27,shade)+rect(69,92,16,5,shade);
 // Stepped silhouette, heavy chest and a dark belly keep the wolf readable at 1x.
 art+=rect(26,34,43,43,ink)+rect(36,39,43,39,ink)+rect(68,46,17,28,ink)+rect(23,43,12,28,ink);
 art+=rect(30,35,30,38,fur)+rect(46,42,30,32,fur)+rect(69,49,13,22,shade)+rect(38,65,32,12,shade);
 art+=rect(35,35,22,6,light)+rect(54,42,20,5,light)+rect(35,44,5,22,light)+rect(41,48,3,17,light);
 // Strong front paw and bent hind leg, with pale claws against the ground shadow.
 art+=rect(28,67,15,28,ink)+rect(30,70,11,23,fur)+rect(22,91,22,7,ink)+rect(24,92,18,5,shade);
 art+=rect(62,69,14,22,ink)+rect(62,72,10,19,fur)+rect(60,91,23,7,ink)+rect(63,92,18,5,shade);
 for(const x of [24,30,36,64,70,76])art+=rect(x,95,3,2,bone);
 // Pale, jagged neck ruff frames the lowered head; moss and bark mark the forest.
 art+=rect(29,20,15,8,ink)+rect(24,27,26,33,ink)+rect(26,56,18,18,ink)+rect(33,70,9,9,ink);
 art+=rect(32,24,9,10,light)+rect(27,32,18,25,light)+rect(29,54,12,17,light)+rect(35,68,5,7,bone);
 art+=rect(39,32,7,25,fur)+rect(40,55,6,12,fur)+rect(30,47,4,19,bone)+rect(35,53,3,16,bone);
 for(const [x,y]of [[44,28],[50,30],[57,33],[64,36],[71,39]])art+=rect(x,y,7,4,moss)+rect(x+2,y+4,4,3,bark);
 art+=rect(47,26,3,3,light)+rect(59,31,3,3,light)+rect(73,38,3,3,light);
 // Long muzzle, pointed ears, amber eye and exposed fangs distinguish this boss.
 art+=rect(21,15,25,29,ink)+rect(16,26,24,26,ink)+rect(7,34,26,15,ink)+rect(13,45,25,13,ink);
 art+=rect(23,6,8,20,ink)+rect(37,10,8,18,ink)+rect(25,9,4,13,fur)+rect(39,13,3,11,fur)+rect(26,11,2,7,bone);
 art+=rect(24,19,18,19,fur)+rect(19,29,19,16,light)+rect(10,37,22,9,light)+rect(8,38,7,6,ink);
 art+=rect(20,26,13,4,shade)+rect(23,30,9,5,ink)+rect(25,31,4,3,gold)+rect(24,26,9,2,bone);
 art+=rect(33,23,3,6,bark)+rect(35,29,3,5,bark)+rect(14,47,20,7,ink)+rect(17,53,18,3,light);
 art+=rect(15,44,4,9,bone)+rect(25,44,3,8,bone)+rect(31,47,3,5,bone)+rect(11,36,8,2,bone);
 cached='data:image/svg+xml,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 104" width="192" height="208" shape-rendering="crispEdges"><title>群狼の主</title>${art}</svg>`);
 return cached;
}
