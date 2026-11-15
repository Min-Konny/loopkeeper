// Animated layers sampled from the original title artwork. Coordinates stay in
// the artwork's 1672 × 941 space; the static illustration is never modified.
const W = 1672, H = 941;
const waterAreas = [
  {p:[[1380,451],[1425,449],[1411,463],[1373,470]],v:[-13,3]},
  {p:[[1368,470],[1390,469],[1380,491],[1345,493]],v:[-4,29]},
  {p:[[1342,488],[1384,482],[1380,498],[1314,507],[1306,499]],v:[-17,5]},
  {p:[[1316,496],[1378,494],[1360,507],[1320,513]],v:[-17,4]},
  {p:[[1296,519],[1339,516],[1328,542],[1284,542]],v:[-3,36]},
  {p:[[1283,539],[1333,535],[1342,551],[1307,559],[1265,554]],v:[-13,7]},
  {p:[[1499,503],[1517,499],[1512,525],[1506,548],[1486,559],[1485,550]],v:[-5,40]},
  {p:[[1268,609],[1290,607],[1319,639],[1307,650],[1261,638],[1258,627]],v:[8,14]},
  {p:[[1372,603],[1391,597],[1411,611],[1428,638],[1397,654],[1369,640]],v:[8,14]},
  {p:[[1280,640],[1326,636],[1377,638],[1429,639],[1460,651],[1494,668],[1510,690],[1430,676],[1370,661],[1309,657]],v:[23,8]},
  {p:[[1277,647],[1324,648],[1390,660],[1430,673],[1507,689],[1520,702],[1482,711],[1400,696],[1361,678],[1305,668]],v:[23,8]},
  {p:[[1400,713],[1425,716],[1442,721],[1453,742],[1454,766],[1434,770],[1418,750]],v:[7,61]},
  {p:[[1450,721],[1474,722],[1492,716],[1490,739],[1479,766],[1458,773]],v:[-2,66]},
  {p:[[1492,713],[1519,704],[1525,720],[1511,747],[1504,772],[1477,781],[1486,751]],v:[-5,61]},
  {p:[[1430,775],[1488,772],[1548,783],[1607,790],[1590,810],[1517,819],[1442,823],[1382,816],[1399,800]],v:[-28,8]},
  {p:[[1539,823],[1607,811],[1672,815],[1672,859],[1617,855],[1540,844],[1467,862],[1450,850],[1465,837]],v:[-31,8]},
  {p:[[1459,865],[1505,857],[1538,872],[1562,896],[1618,913],[1672,919],[1672,941],[1445,941],[1458,919],[1411,899],[1432,887]],v:[27,20]},
];
const leafAreas = [
  [[520,167],[591,173],[617,200],[594,242],[553,251],[533,218]],
  [[716,81],[778,84],[805,124],[783,155],[745,145]],
  [[930,60],[983,62],[1024,83],[1015,139],[983,150],[954,123]],
  [[1126,48],[1187,48],[1210,73],[1195,124],[1163,129],[1153,92]],
  [[1283,15],[1335,13],[1368,35],[1346,68],[1300,65]],
  [[547,406],[580,398],[613,416],[623,448],[575,454]],
];
const wheatArea = [[704,478],[790,467],[894,460],[985,470],[976,493],[913,513],[812,514],[737,501]];
const sheepHeads = [
  {p:[[754,535],[766,535],[767,543],[762,549],[755,545]],pivot:[755,541],phase:0},
  {p:[[778,540],[787,540],[789,547],[784,553],[778,549]],pivot:[786,546],phase:4.8},
  {p:[[824,557],[835,557],[835,565],[830,571],[824,566]],pivot:[825,563],phase:8.2},
];
const skyAreas = [
  [[1192,129],[1250,118],[1310,117],[1394,139],[1396,158],[1342,179],[1298,188],[1268,179],[1235,169]],
  [[1398,24],[1461,17],[1508,33],[1559,22],[1628,13],[1672,1],[1672,75],[1602,83],[1556,69],[1492,76],[1454,91],[1421,79]],
];
const smokeAreas = [
  [[728,363],[728,346],[741,330],[745,312],[762,302],[780,287],[799,289],[788,309],[775,321],[773,337],[754,347],[743,364]],
  [[1018,318],[1017,303],[1032,291],[1038,277],[1056,271],[1067,279],[1056,295],[1042,304],[1031,319]],
  [[1581,336],[1578,317],[1590,300],[1591,280],[1607,268],[1628,270],[1624,291],[1610,309],[1595,336]],
];
const flagAreas = [
  [[1292,198],[1303,201],[1315,207],[1326,202],[1323,211],[1313,216],[1301,211],[1292,212]],
  [[1083,397],[1098,398],[1097,435],[1090,444],[1083,437]],
  [[1262,308],[1273,312],[1272,347],[1266,351],[1261,344]],
  [[1304,309],[1315,308],[1313,346],[1307,352],[1303,343]],
];
const lanternArea = [[638,188],[647,188],[646,215],[656,222],[654,237],[671,250],[675,260],[667,264],[669,304],[675,311],[667,321],[651,325],[650,334],[639,334],[636,325],[619,320],[610,312],[617,305],[616,264],[608,259],[611,250],[631,238],[632,222],[638,215]];

export function createTitleNature(image, makeCanvas = () => document.createElement('canvas')) {
  let layers;
  const surface=(w,h)=>{const c=makeCanvas();c.width=w;c.height=h;return c;};
  function polygon(ctx,p,ox=0,oy=0) {
    ctx.beginPath();p.forEach(([x,y],i)=>i?ctx.lineTo(x-ox,y-oy):ctx.moveTo(x-ox,y-oy));ctx.closePath();
  }
  function layer(points, key) {
    const x=Math.floor(Math.min(...points.map(p=>p[0]))),y=Math.floor(Math.min(...points.map(p=>p[1])));
    const w=Math.ceil(Math.max(...points.map(p=>p[0])))-x,h=Math.ceil(Math.max(...points.map(p=>p[1])))-y;
    const texture=surface(w,h), tc=texture.getContext('2d',{willReadFrequently:true});
    const mask=surface(w,h),mc=mask.getContext('2d');
    tc.drawImage(image,x*image.naturalWidth/W,y*image.naturalHeight/H,w*image.naturalWidth/W,h*image.naturalHeight/H,0,0,w,h);
    polygon(mc,points,x,y);mc.fillStyle='white';mc.fill();
    if(key) {
      const pixels=tc.getImageData(0,0,w,h);
      for(let i=0;i<pixels.data.length;i+=4) {
        const r=pixels.data[i],g=pixels.data[i+1],b=pixels.data[i+2];
        // A fixed material mask excludes vegetation, masonry and dark rocks.
        const a=key(r,g,b);
        pixels.data[i+3]=Math.round(a*255);
      }
      tc.putImageData(pixels,0,0);
      mc.globalCompositeOperation='destination-in';mc.drawImage(texture,0,0);
      mc.globalCompositeOperation='source-over';
    }
    tc.globalCompositeOperation='destination-in';tc.drawImage(mask,0,0);tc.globalCompositeOperation='source-over';
    const frame=surface(w,h),fc=frame.getContext('2d');
    return {x,y,w,h,texture,mask,frame,fc};
  }
  const waterKey=(r,g,b)=>Math.min(1,Math.max(0,(Math.min(g,b)-r+8)/20))*Math.min(1,Math.max(0,(g-64)/36));
  function withBackdrop(l) {
    // Replace the original silhouette before moving it. Sample both sides of
    // each row once at preparation, so the static head/lamp cannot show through.
    const c=surface(l.w+4,l.h), g=c.getContext('2d',{willReadFrequently:true});
    g.drawImage(image,(l.x-2)*image.naturalWidth/W,l.y*image.naturalHeight/H,
      (l.w+4)*image.naturalWidth/W,l.h*image.naturalHeight/H,0,0,l.w+4,l.h);
    const pixels=g.getImageData(0,0,l.w+4,l.h);
    for(let y=0;y<l.h;y++)for(let x=1;x<l.w+3;x++) {
      const start=y*(l.w+4)*4,end=start+(l.w+3)*4,i=start+x*4,f=x/(l.w+3);
      for(let k=0;k<3;k++)pixels.data[i+k]=pixels.data[start+k]*(1-f)+pixels.data[end+k]*f;
      pixels.data[i+3]=255;
    }
    g.putImageData(pixels,0,0);
    const plate=surface(l.w,l.h),p=plate.getContext('2d');p.drawImage(c,-2,0);
    p.globalCompositeOperation='destination-in';p.drawImage(l.mask,0,0);
    return {...l,plate};
  }
  function prepare() {
    // Small bounding-box textures rather than multiple full-screen canvases.
    layers={
      river:waterAreas.map(a=>({...layer(a.p,waterKey),v:a.v})),
      leaves:leafAreas.map(p=>layer(p)),
      wheat:layer(wheatArea),
      sheep:sheepHeads.map(a=>({...withBackdrop(layer(a.p)),pivot:a.pivot,phase:a.phase})),
      lantern:withBackdrop(layer(lanternArea)),
      flags:flagAreas.map(p=>withBackdrop(layer(p))),
      smoke:smokeAreas.map(p=>layer(p,(r,g,b)=>Math.min(1,Math.max(0,(Math.min(r,g,b)-90)/55)))),
      clouds:skyAreas.map(p=>layer(p,(r,g,b)=>Math.min(1,Math.max(0,(r-115)/65))*Math.min(1,Math.max(0,(b-g-12)/22)))),
    };
  }
  function flow(ctx,l,t,speed,duration=1.6,opacity=1,foam=false) {
    const c=l.fc;c.clearRect(0,0,l.w,l.h);
    c.globalCompositeOperation='lighter';
    // Two travelling textures crossfade at opposite phases. Their geometry is
    // rigid and movement is always downstream, with no back-and-forth warping.
    for(let k=0;k<2;k++) {
      const phase=(t/duration+k*.5)%1;
      c.globalAlpha=Math.sin(Math.PI*phase)**2;
      c.drawImage(l.texture,(phase-.5)*speed[0]*duration,(phase-.5)*speed[1]*duration);
    }
    c.globalCompositeOperation='source-over';
    if(foam) {
      const falling=speed[1]>25, count=Math.min(45,Math.max(5,Math.ceil(l.w*l.h/230)));
      c.fillStyle='#e2ffff';
      for(let i=0;i<count;i++) {
        const phase=(t*.3+i*.61803398875)%1;
        c.globalAlpha=Math.sin(Math.PI*phase)*.42;
        const x=((i*47.3+t*speed[0])%l.w+l.w)%l.w;
        const y=((i*19.7+t*speed[1])%l.h+l.h)%l.h;
        c.fillRect(Math.round(x),Math.round(y),falling?1:5+i%7,falling?5+i%6:1);
      }
    }
    c.globalAlpha=1;c.globalCompositeOperation='destination-in';c.drawImage(l.mask,0,0);
    c.globalCompositeOperation='source-over';
    ctx.globalAlpha=opacity;ctx.drawImage(l.frame,l.x,l.y);ctx.globalAlpha=1;
  }
  function sway(ctx,l,t,strength,phase) {
    const c=l.fc;c.clearRect(0,0,l.w,l.h);
    // Anchor roots/branch bases; move small strips as a slow coherent gust.
    for(let y=0;y<l.h;y+=3) {
      const tip=1-y/l.h;
      const gust=Math.sin(t*1.25+phase)+.22*Math.sin(t*2.4+phase);
      const dx=gust*strength*tip;
      c.drawImage(l.texture,0,y,l.w,Math.min(3,l.h-y),dx,y,l.w,Math.min(3,l.h-y));
    }
    c.globalCompositeOperation='destination-in';c.drawImage(l.mask,0,0);c.globalCompositeOperation='source-over';
    ctx.drawImage(l.frame,l.x,l.y);
  }
  return {
    draw(ctx,t) {
      if(!layers)prepare();
      ctx.save();ctx.scale(1280/W,720/H);
      for(const l of layers.river)flow(ctx,l,t,l.v,1.25,.96,true);
      ctx.globalAlpha=1;
      layers.leaves.forEach((l,i)=>sway(ctx,l,t,5,i*.9));
      sway(ctx,layers.wheat,t,4,1.7);
      layers.smoke.forEach((l,i)=>flow(ctx,l,t+i*1.7,[5,-10],3.5,.9));
      layers.flags.forEach((l,i)=>{
        ctx.drawImage(l.plate,l.x,l.y);
        // Pole-side edge stays attached while the free fabric flutters.
        for(let x=0;x<l.w;x+=2) {
          const dy=Math.sin(t*3.1-x*.24+i)*2.8*x/l.w;
          ctx.drawImage(l.texture,x,0,Math.min(2,l.w-x),l.h,l.x+x,l.y+dy,Math.min(2,l.w-x),l.h);
        }
      });
      const lamp=layers.lantern;
      ctx.drawImage(lamp.plate,lamp.x,lamp.y);
      ctx.save();ctx.translate(642,188);ctx.rotate(Math.sin(t*1.2)*.035);
      ctx.drawImage(lamp.texture,lamp.x-642,lamp.y-188);ctx.restore();
      // Grazing is occasional and staggered, not a synchronized bobbing flock.
      for(const l of layers.sheep) {
        const p=(t+l.phase)%6;
        const nod=p<3.5?Math.sin(p/3.5*Math.PI):0;
        ctx.drawImage(l.plate,l.x,l.y);
        ctx.save();ctx.translate(l.pivot[0],l.pivot[1]);ctx.rotate(nod*.28);
        ctx.drawImage(l.texture,l.x-l.pivot[0],l.y-l.pivot[1]+nod*2.4);ctx.restore();
      }
      layers.clouds.forEach((l,i)=>flow(ctx,l,t+i*11,[4,0],18,.9));
      ctx.restore();
    },
    dispose(){layers=undefined;},
  };
}
