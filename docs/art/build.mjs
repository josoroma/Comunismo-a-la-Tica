/** Portable vector art for Comunismo a la tica.
 * Geometry primitives adapted from Josoroma’s Los arquitectos del Estado.
 * Editorial dioramas informed by Taster's scene/reading workflow and Anatomy’s
 * solid construction principles. No runtime dependency or external image.
 * Run: node docs/art/build.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const HERE=dirname(fileURLToPath(import.meta.url));
const OUT=join(HERE,'../assets/img');
mkdirSync(join(OUT,'capitulos'),{recursive:true});
const C={paper:'#f2eadb',white:'#fff8e9',ink:'#183c34',green:'#35604a',leaf:'#4f7152',lightLeaf:'#7d9364',red:'#9c4035',tile:'#af6048',gold:'#b58a45',stone:'#cbbd9d',wood:'#72513a',dark:'#263b36',blue:'#31566a'};
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
// Quantize trigonometric round-off before formatting: identical SVG on ARM/x64.
const num=(n,places=4)=>String(Number((Math.round(n*1e8)/1e8).toFixed(places)));
const shade=(hex,n)=>{let a=hex.slice(1).match(/../g).map(x=>parseInt(x,16));return '#'+a.map(x=>Math.min(255,Math.max(0,Math.round(x+n))).toString(16).padStart(2,'0')).join('')};
let shapes=[],count=0;
const P=([x,y,z])=>[(x-y)*.866,(x+y)*.5-z];
const D=p=>p.map((a,i)=>`${i?'L':'M'}${P(a).map(n=>num(n,2)).join(' ')}`).join('')+'Z';
function poly(points,fill,stroke=shade(fill,-34),sw=.45,extra='') {shapes.push({points,depth:points.reduce((a,p)=>a+p[0]+p[1]+p[2]*1.3,0)/points.length,svg:`<path d="${D(points)}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round" ${extra}/>`});}
function line(points,color=C.ink,sw=.65,extra=''){shapes.push({points,depth:points.reduce((a,p)=>a+p[0]+p[1]+p[2]*1.3,0)/points.length+.1,svg:`<path d="${D(points).slice(0,-1)}" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" ${extra}/>`});}
function box(x,y,z,w,d,h,c=C.stone){poly([[x+w,y,z],[x+w,y+d,z],[x+w,y+d,z+h],[x+w,y,z+h]],shade(c,-25));poly([[x,y+d,z],[x+w,y+d,z],[x+w,y+d,z+h],[x,y+d,z+h]],shade(c,-7));poly([[x,y,z+h],[x+w,y,z+h],[x+w,y+d,z+h],[x,y+d,z+h]],shade(c,18));}
function cyl(x,y,z,r,h,c=C.gold,n=20){const ring=(z)=>Array.from({length:n},(_,i)=>[x+Math.cos(i*2*Math.PI/n)*r,y+Math.sin(i*2*Math.PI/n)*r,z]); const lo=ring(z),hi=ring(z+h);for(let i=0;i<n;i++){let j=(i+1)%n; const a=(i+.5)*2*Math.PI/n;if(Math.cos(a)+Math.sin(a)>-.1)poly([lo[i],lo[j],hi[j],hi[i]],shade(c,Math.round(-16+18*Math.cos(a+1))),shade(c,-27),.25);}poly(hi,shade(c,22),shade(c,-24),.4);}
function sphere(x,y,z,r,c=C.leaf){const pts=Array.from({length:16},(_,i)=>[x+Math.cos(i*Math.PI/8)*r,y+Math.sin(i*Math.PI/8)*r,z]);const [sx,sy]=P([x,y,z]);shapes.push({points:pts,depth:x+y+z*1.3,svg:`<ellipse cx="${num(sx)}" cy="${num(sy)}" rx="${num(r)}" ry="${num(r*.84)}" fill="${c}" stroke="${shade(c,-32)}" stroke-width=".4"/><path d="M ${num(sx-r*.45)} ${num(sy-r*.2)} Q ${num(sx-r*.3)} ${num(sy-r*.7)} ${num(sx+r*.3)} ${num(sy-r*.44)}" fill="none" stroke="${shade(c,30)}" stroke-width="1.2" stroke-linecap="round"/>`});}
function topText(x,y,z,text,size=5,color=C.ink){let [a,b]=P([x,y,z]);shapes.push({points:[[x,y,z]],depth:x+y+z*1.3+.2,svg:`<text transform="matrix(.866 .5 -.866 .5 ${num(a)} ${num(b)})" fill="${color}" font-family="Georgia,serif" font-size="${num(size)}" letter-spacing=".8">${esc(text)}</text>`});}
function paper(x,y,z,w=28,d=36,lines=6){box(x,y,z,w,d,.7,C.white);for(let i=0;i<lines;i++)line([[x+4,y+6+i*3.2,z+.8],[x+w-4-(i===lines-1?5:0),y+6+i*3.2,z+.8]],'#938e76',.38);}
function book(x,y,z,w=35,d=48,h=9,c=C.red,label=''){box(x,y,z,w,d,h,c);box(x+1,y+1,z+1.4,w-2,d-.5,h-2.8,C.paper);box(x-.5,y-.5,z+h-1.3,w+1,d+1,1.5,c);for(let a=2.4;a<h-1.7;a+=1.5)line([[x+1,y+d+.03,z+a],[x+w-1,y+d+.03,z+a]],'#a79778',.28);for(let yy of [5,d-6])box(x-.55,y+yy,z,1,1.8,h,C.gold);if(label)topText(x+4,y+d*.47,z+h+.3,label,4.5,C.paper);}
function steps(x,y,z,w,d,n=3,c=C.stone){for(let k=0;k<n;k++)box(x+k*2,y+k*3,z+k*3,w-k*4,d-k*3,3,c);}
function windowY(x,y,z,w=10,h=19){box(x-1,y-.05,z-1,w+2,1.3,h+2,C.stone);poly([[x,y+1.3,z],[x+w,y+1.3,z],[x+w,y+1.3,z+h],[x,y+1.3,z+h]],C.ink,C.wood,.8);line([[x+w/2,y+1.4,z],[x+w/2,y+1.4,z+h]],C.gold,.65);line([[x,y+1.4,z+h*.55],[x+w,y+1.4,z+h*.55]],C.gold,.65);box(x-2,y,z-2,w+4,3,2,C.stone);}
function windowX(x,y,z,w=10,h=19){poly([[x+.1,y,z],[x+.1,y+w,z],[x+.1,y+w,z+h],[x+.1,y,z+h]],C.ink,C.wood,1);line([[x+.2,y+w/2,z],[x+.2,y+w/2,z+h]],C.gold,.6);line([[x+.2,y,z+h*.55],[x+.2,y+w,z+h*.55]],C.gold,.6);box(x,y-1,z-2,2,w+2,2,C.stone);}
function roof(x,y,z,w,d,rise=20){poly([[x-4,y-4,z],[x+w/2,y-4,z+rise],[x+w/2,y+d+4,z+rise],[x-4,y+d+4,z]],shade(C.tile,5));poly([[x+w/2,y-4,z+rise],[x+w+4,y-4,z],[x+w+4,y+d+4,z],[x+w/2,y+d+4,z+rise]],shade(C.tile,-18));poly([[x-4,y+d,z],[x+w+4,y+d,z],[x+w/2,y+d,z+rise]],C.paper);for(let q=-3;q<=d+3;q+=5){line([[x+w/2,y+q,z+rise+.1],[x+w+4,y+q,z+.1]],'#703e31',.6);line([[x-4,y+q,z+.1],[x+w/2,y+q,z+rise+.1]],'#cb8964',.5);}for(let s=.2;s<1;s+=.2){let xx=x+w/2+(w/2+4)*s;line([[xx,y-4,z+rise*(1-s)+.2],[xx,y+d+4,z+rise*(1-s)+.2]],'#794632',.4);}line([[x+w/2,y-5,z+rise+1],[x+w/2,y+d+5,z+rise+1]],C.tile,3);}
function house(x,y,z,w=65,d=48,h=38){box(x,y,z,w,d,6,C.blue);box(x,y,z+6,w,d,h-6,C.paper);for(let xx=x+9;xx<x+w-8;xx+=21)windowY(xx,y+d,z+12,10,15);windowX(x+w,y+12,z+14,12,15);roof(x,y,z+h,w,d,17);}
function archY(x,y,z,w,h,c=C.ink){const pts=[[x,y,z],[x+w,y,z],[x+w,y,z+h-w/2]];for(let i=0;i<=14;i++){const a=i/14*Math.PI;pts.push([x+w/2+Math.cos(a)*w/2,y,z+h-w/2+Math.sin(a)*w/2]);}poly(pts,c,shade(C.stone,-36),1);}
function palace(x,y,z,w=100,d=58,h=72){steps(x-8,y-6,z,w+16,d+24,3);z+=9;box(x,y,z,w,d,h,C.stone);box(x-2,y-2,z+h,w+4,d+4,4,C.paper);box(x-4,y-4,z+h+4,w+8,d+8,3,C.stone);for(let xx=x+7;xx<x+w-5;xx+=18){windowY(xx,y+d,z+39,9,19);archY(xx,y+d+.1,z+8,10,22);box(xx-2,y+d,z+35,14,2,2,C.paper);}for(let yy=y+9;yy<y+d-10;yy+=18){windowX(x+w+.1,yy,z+40,10,18);windowX(x+w+.1,yy,z+10,10,19);}if(h>90){for(let xx=x+7;xx<x+w-5;xx+=18)windowY(xx,y+d,z+h-33,9,19);for(let yy=y+9;yy<y+d-10;yy+=18)windowX(x+w+.1,yy,z+h-33,10,18);box(x,y+d,z+h-40,w,1.5,2,C.paper);box(x+w,y,z+h-40,1.5,d,2,C.paper);}box(x+w*.24,y+d+2,z,w*.52,13,4,C.paper);for(let xx=x+w*.28;xx<=x+w*.72;xx+=w*.146){box(xx-3,y+d+7,z+4,6,6,3,C.paper);cyl(xx,y+d+10,z+7,2.3,29,C.paper,12);box(xx-3,y+d+7,z+36,6,6,3,C.paper);}box(x+w*.22,y+d+4,z+39,w*.56,18,4,C.stone);poly([[x+w*.19,y+d+23,z+43],[x+w*.81,y+d+23,z+43],[x+w*.5,y+d+23,z+59]],C.paper,shade(C.stone,-30),.8);poly([[x+w*.25,y+d+23.1,z+45],[x+w*.75,y+d+23.1,z+45],[x+w*.5,y+d+23.1,z+55]],C.stone);for(let a=0;a<h;a+=8)line([[x+w+.15,y,z+a],[x+w+.15,y+d,z+a]],shade(C.stone,-27),.35);for(let a=0;a<h;a+=10){line([[x,y+d+.1,z+a],[x+5,y+d+.1,z+a]],shade(C.stone,-28),.4);line([[x+w-5,y+d+.1,z+a],[x+w,y+d+.1,z+a]],shade(C.stone,-28),.4);}roof(x+3,y+3,z+h+7,w-6,d-6,13);}
function plant(x,y,z=0,s=1){cyl(x,y,z,1.2,16*s,C.wood,8);for(let [dx,dy,dz,r] of [[-5,0,12,7],[4,2,16,7],[-3,3,21,6],[1,-2,25,5]])sphere(x+dx*s,y+dy*s,z+dz*s,r*s,C.leaf);for(let i=0;i<6;i++){const a=i*2.3;sphere(x+Math.cos(a)*5*s,y+Math.sin(a)*4*s,z+(13+i)*s,1.1*s,C.red);}}
function palm(x,y,z=0,s=1){for(let i=0;i<8;i++)cyl(x+i*.25,y,z+i*6*s,1.8*s,6*s,C.wood,9);for(let a=0;a<Math.PI*2;a+=Math.PI/4){const end=[x+Math.cos(a)*29*s,y+Math.sin(a)*29*s,z+37*s];const mid=[x+Math.cos(a)*14*s,y+Math.sin(a)*14*s,z+56*s];poly([[x+2,y,z+48*s],mid,end,[mid[0]+4*s,mid[1]-3*s,mid[2]-8*s]],C.green);line([[x+2,y,z+48*s],mid,end],shade(C.green,-20),.5);}}
function slab(x=-170,y=-120,w=340,d=240,z=-12){box(x,y,z,w,d,10,C.ink);box(x-2,y-2,z+10,w+4,d+4,2,C.gold);box(x,y,z+12,w,d,4,C.stone);for(let a=x+20;a<x+w;a+=20)line([[a,y,z+16.1],[a,y+d,z+16.1]],'#b9ad91',.25);for(let b=y+20;b<y+d;b+=20)line([[x,b,z+16.1],[x+w,b,z+16.1]],'#b9ad91',.25);}
function chair(x,y,z=4,c=C.green){for(let [a,b] of [[0,0],[16,0],[0,16],[16,16]])box(x+a,y+b,z,2.5,2.5,20,C.wood);box(x-1,y-1,z+20,21,21,4,c);box(x,y,z+24,3,3,25,C.wood);box(x+16,y,z+24,3,3,25,C.wood);box(x,y,z+39,19,3,9,c);}
function table(x,y,z,w=90,d=55,h=35){for(let [a,b] of [[3,3],[w-7,3],[3,d-7],[w-7,d-7]]){box(x+a,y+b,z,4,4,h,C.wood);box(x+a-.5,y+b-.5,z,5,5,3,C.gold);}box(x,y,z+h,w,d,5,C.wood);box(x+1,y+1,z+h+5,w-2,d-2,.6,C.green);}
function flag(x,y,z=4,h=85){cyl(x,y,z,4,3,C.stone);cyl(x,y,z+3,1,h,C.gold,10);sphere(x,y,z+h+4,2,C.gold);let zz=z+h-2;for(let [hh,col] of [[4,C.blue],[4,C.white],[8,C.red],[4,C.white],[4,C.blue]]){poly([[x+1,y,zz],[x+31,y,zz-4],[x+31,y,zz-4-hh],[x+1,y,zz-hh]],col,col,.3);zz-=hh;}}
function rail(x,y,z,w=100){for(let i=0;i<w;i+=10)box(x+i,y,z,5,35,2,C.wood);for(let yy of [y+5,y+27])box(x,y+yy-y,z+2,w,2,2,C.dark);}
function wheel(x,y,z,r=10,c=C.red,axis='y'){const [sx,sy]=P([x,y,z]);const pts=Array.from({length:24},(_,i)=>axis==='y'?[x+Math.cos(i*Math.PI/12)*r,y,z+Math.sin(i*Math.PI/12)*r]:[x,y+Math.cos(i*Math.PI/12)*r,z+Math.sin(i*Math.PI/12)*r]);poly(pts,c,C.dark,1.5);for(let i=0;i<12;i++){let a=i*Math.PI/6;line([[x,y+.03,z],axis==='y'?[x+Math.cos(a)*r*.86,y+.03,z+Math.sin(a)*r*.86]:[x+.03,y+Math.cos(a)*r*.86,z+Math.sin(a)*r*.86]],C.gold,1.2);}sphere(x,y+.1,z,2,C.gold);}
function cart(x,y,z=4){wheel(x+22,y-2,z+11,15);box(x,y,z+16,44,28,4,C.wood);box(x,y,z+20,44,3,16,C.red);box(x,y+25,z+20,44,3,16,C.red);for(let a=5;a<40;a+=7){poly([[x+a,y+28.1,z+22],[x+a+4,y+28.1,z+28],[x+a,y+28.1,z+34],[x+a-4,y+28.1,z+28]],C.gold,C.gold,.3);}wheel(x+22,y+31,z+11,15);for(let yy of [6,20])box(x+44,y+yy,z+17,26,2,2,C.wood);}
function train(x,y,z=4){rail(x-7,y-6,z,125);box(x,y,z+16,100,30,5,C.dark);for(let xx of [12,35,58,84]){wheel(x+xx,y-1,z+11,10,C.dark);wheel(x+xx,y+32,z+11,10,C.dark);}box(x+65,y,z+21,31,30,36,C.green);box(x+62,y-3,z+57,38,36,4,C.dark);windowY(x+70,y+30,z+37,18,13);box(x+10,y+3,z+23,54,24,22,C.dark);for(let xx of [15,32,50])box(x+xx,y+2,z+22,2,26,23,C.gold);cyl(x+17,y+15,z+45,5,20,C.dark);cyl(x+17,y+15,z+63,7,4,C.dark);cyl(x+48,y+15,z+45,7,9,C.gold);line([[x+12,y+33,z+11],[x+58,y+33,z+11]],C.gold,2);}
function press(x,y,z=4){box(x,y,z,65,50,5,C.wood);for(let xx of [4,54]){box(x+xx,y+5,z+5,7,10,92,C.wood);box(x+xx-2,y+3,z+5,11,14,4,C.gold);}box(x,y+3,z+86,65,14,10,C.wood);box(x+4,y+8,z+35,57,40,5,C.dark);paper(x+12,y+14,z+40,42,27,4);box(x+10,y+12,z+52,45,32,5,C.dark);cyl(x+32,y+25,z+57,4,32,C.gold,14);for(let zz=60;zz<87;zz+=3)cyl(x+32,y+25,z+zz,5,.6,C.dark,12);box(x+13,y+24,z+80,39,2,2,C.gold);for(let yy of [19,33])box(x+6,y+yy,z+25,54,3,5,C.wood);}
function ballot(x,y,z=4,w=48){box(x,y,z,w,w*.75,38,C.wood);box(x-1,y-1,z+38,w+2,w*.75+2,4,C.green);box(x+w*.28,y+9,z+42,w*.45,2,.2,C.ink);paper(x+w*.33,y+8,z+43,14,22,3);poly([[x+6,y+w*.75+.1,z+8],[x+w-6,y+w*.75+.1,z+8],[x+w-6,y+w*.75+.1,z+29],[x+6,y+w*.75+.1,z+29]],C.paper);}
function fortress(x,y,z=4){box(x,y,z,105,50,59,C.stone);for(let xx of [x-9,x+90]){box(xx,y-4,z,24,61,78,C.stone);for(let k=0;k<3;k++)box(xx+k*9,y+51,z+78,6,6,7,C.stone);windowY(xx+7,y+57,z+43,7,18);}for(let xx=x+17;xx<x+90;xx+=20)windowY(xx,y+50,z+37,9,14);archY(x+39,y+50.2,z,26,34,C.ink);for(let a=0;a<59;a+=8)line([[x,y+50.3,z+a],[x+105,y+50.3,z+a]],'#ae9c80',.3);box(x-11,y-6,z+78,28,65,2,C.paper);box(x+88,y-6,z+78,28,65,2,C.paper);for(let xx of [x-9,x+90])for(let k=0;k<3;k++)box(xx+k*9,y+51,z+80,6,6,7,C.stone);}
function coin(x,y,z=4,r=8){cyl(x,y,z,r,2,C.gold,24);const pts=Array.from({length:24},(_,i)=>[x+Math.cos(i*Math.PI/12)*r*.72,y+Math.sin(i*Math.PI/12)*r*.72,z+2.1]);line([...pts,pts[0]],shade(C.gold,-25),.4);}
function seal(x,y,z=4){cyl(x,y,z,10,2,C.red,24);cyl(x,y,z+2,7,1,C.red,24);topText(x-2,y+2,z+3.2,'§',9,C.gold);}
function church(x,y,z=4){house(x,y,z,60,65,42);box(x+19,y+46,z,23,25,77,C.paper);roof(x+19,y+46,z+77,23,25,15);archY(x+24,y+71.1,z+51,13,18);box(x+29,y+60,z+92,2,2,15,C.gold);box(x+24,y+60,z+101,12,2,2,C.gold);archY(x+23,y+71.2,z,15,30);}
function plinthBook(x,y,z=4){book(x,y,z,75,92,14,C.green,'LEX');book(x+4,y+3,z+14,68,83,10,C.red);book(x-3,y-2,z+24,81,95,14,C.ink,'1821');}

// Each miniature is a composed editorial scene, not a historical reconstruction.
// Grounded objects are painted back to front, retaining their own surface order.
let groups=[];
function group(x,y,fn){const before=shapes;shapes=[];fn();groups.push({depth:x+y,shapes});shapes=before;}
function compose(items){slab();for(const [x,y,fn] of items)group(x,y,fn);}
function person(x,y,z=4,c=C.red,s=1){
  for(const dx of [-2.8,2.8])box(x+dx*s,y,z,3*s,4*s,12*s,C.dark);
  box(x-4*s,y-1*s,z+11*s,10*s,7*s,15*s,c);
  for(const dx of [-6,7])box(x+dx*s,y,z+12*s,3*s,4*s,12*s,c);
  cyl(x+1*s,y+2*s,z+27*s,3.7*s,7*s,C.gold,14);
  cyl(x+1*s,y+2*s,z+33*s,3.9*s,2*s,C.wood,14);
}
function banana(x,y,z=4,s=1){
  box(x-6*s,y-6*s,z,12*s,12*s,2,C.wood);
  cyl(x,y,z,2.8*s,55*s,C.leaf,10);
  for(let i=0;i<7;i++){const a=i*Math.PI*2/7,dx=Math.cos(a),dy=Math.sin(a),px=-dy,py=dx;
    const pts=[[x,y,z+55*s],[x+(dx*17+px*5)*s,y+(dy*17+py*5)*s,z+68*s],[x+dx*36*s,y+dy*36*s,z+44*s],[x+(dx*17-px*5)*s,y+(dy*17-py*5)*s,z+60*s]];
    poly(pts,i%2?C.green:C.leaf);line([[x,y,z+55*s],[x+dx*17*s,y+dy*17*s,z+64*s],[x+dx*36*s,y+dy*36*s,z+44*s]],shade(C.green,-12),.7);
  }
  for(let i=0;i<4;i++)cyl(x+5*s,y+2*s,z+(36-i*4)*s,3.5*s,3*s,C.gold,10);
}
function crate(x,y,z=4,w=38,d=27,h=22){box(x,y,z,w,d,h,C.wood);for(let dz=3;dz<h;dz+=6){line([[x,y+d+.1,z+dz],[x+w,y+d+.1,z+dz]],C.gold,.8);line([[x+w+.1,y,z+dz],[x+w+.1,y+d,z+dz]],C.gold,.8);}for(let xx of [3,w-6])box(x+xx,y+d,z,3,1,h,C.gold);}
function banner(x,y,z=4,w=64,h=72,c=C.red){for(let xx of [x,x+w]){cyl(xx,y,z,3,2,C.stone);box(xx-1,y-1,z+2,2,2,h,C.wood);}poly([[x+1,y,z+h-4],[x+w-1,y,z+h-4],[x+w-1,y,z+h-29],[x+1,y,z+h-29]],c);for(let yy of [11,17,23])line([[x+9,y+.1,z+h-yy],[x+w-9,y+.1,z+h-yy]],C.paper,.7);}
function podium(x,y,z=4){box(x,y,z,45,33,38,C.wood);box(x-4,y-4,z+38,53,41,4,C.red);paper(x+4,y+3,z+43,30,23,4);cyl(x+38,y+8,z+43,1,24,C.dark,8);sphere(x+38,y+8,z+68,2.4,C.dark);}
function radio(x,y,z=4,w=68){box(x,y,z,w,25,46,C.wood);box(x+2,y+25,z+2,w-4,1,42,C.gold);poly([[x+6,y+26.2,z+13],[x+w*.58,y+26.2,z+13],[x+w*.58,y+26.2,z+38],[x+6,y+26.2,z+38]],C.dark);for(let i=0;i<7;i++)line([[x+9+i*4,y+26.3,z+16],[x+9+i*4,y+26.3,z+35]],C.wood,.8);poly([[x+w*.66,y+26.2,z+23],[x+w-6,y+26.2,z+23],[x+w-6,y+26.2,z+34],[x+w*.66,y+26.2,z+34]],C.paper);for(let xx of [w*.71,w*.86])sphere(x+xx,y+26.5,z+12,3.4,C.dark);line([[x+w-10,y+7,z+46],[x+w-8,y+7,z+81]],C.gold,1.4);}
function fence(x,y,z=4,w=140,h=64){for(let xx=x;xx<=x+w;xx+=14)box(xx,y,z,3,3,h,C.dark);box(x,y,z+12,w+3,3,3,C.dark);box(x,y,z+h-13,w+3,3,3,C.dark);}
function factory(x,y,z=4){box(x,y,z,100,51,45,C.stone);for(let xx=x+8;xx<x+94;xx+=22)windowY(xx,y+51,z+20,12,15);box(x-3,y-2,z+45,106,55,4,C.dark);for(let xx of [x+9,x+41,x+72])poly([[xx,y,z+49],[xx+28,y,z+49],[xx+28,y,z+66],[xx,y,z+49]],C.red);box(x+74,y+7,z+49,10,12,49,C.wood);for(let zz=0;zz<49;zz+=7)line([[x+74,y+19.1,z+49+zz],[x+84,y+19.1,z+49+zz]],C.gold,.5);}
function globe(x,y,z=4,r=36){cyl(x,y,z,23,4,C.wood,30);cyl(x,y,z+4,3,15,C.gold,12);const [sx,sy]=P([x,y,z+19+r]);shapes.push({points:[[x-r,y,z+19],[x+r,y,z+19+2*r]],svg:`<circle cx="${num(sx)}" cy="${num(sy)}" r="${r}" fill="${C.blue}" stroke="${C.gold}" stroke-width="2"/><ellipse cx="${num(sx)}" cy="${num(sy)}" rx="${r*.48}" ry="${r}" fill="none" stroke="${C.paper}" stroke-width=".6"/><ellipse cx="${num(sx)}" cy="${num(sy)}" rx="${r}" ry="${r*.33}" fill="none" stroke="${C.paper}" stroke-width=".6"/><path d="M${num(sx-r*.52)} ${num(sy-r*.7)}l${r*.46} ${r*.15} ${r*.12} ${r*.38} ${-r*.29} ${r*.32} ${r*.17} ${r*.33} ${-r*.13} ${r*.32} ${-r*.17} ${-r*.15} ${-r*.14} ${-r*.5} ${-r*.29} ${-r*.34}Z" fill="${C.leaf}"/><path d="M${num(sx+r*.2)} ${num(sy-r*.66)}l${r*.47} ${r*.18} ${r*.13} ${r*.3} ${-r*.26} ${r*.06} ${-r*.13} ${r*.5} ${-r*.23} ${-r*.2} ${-r*.15} ${-r*.37}Z" fill="${C.leaf}"/>`});}
function openBook(x,y,z=4,w=108,d=74,h=13){
  book(x,y,z,w/2,d,h,C.red);book(x+w/2+3,y,z,w/2,d,h,C.green);
  paper(x+4,y+4,z+h+.2,w/2-7,d-8,16);paper(x+w/2+7,y+4,z+h+.2,w/2-7,d-8,16);
  line([[x+w/2+1.5,y,z+h],[x+w/2+1.5,y+d,z+h]],C.gold,1.4);
}
function laptop(x,y,z=4){box(x,y,z,42,30,2,C.dark);for(let row=0;row<4;row++)for(let col=0;col<7;col++)box(x+4+col*4.7,y+7+row*4,z+2.2,3,2,.2,C.stone);poly([[x,y,z+2],[x+42,y,z+2],[x+42,y-7,z+35],[x,y-7,z+35]],C.dark);poly([[x+3,y-.8,z+5],[x+39,y-.8,z+5],[x+39,y-6.2,z+32],[x+3,y-6.2,z+32]],C.blue);}
const scenes={
'01':()=>compose([
 [-95,-48,()=>house(-131,-87,4,86,57,45)],
 [60,-55,()=>{table(14,-82,4,94,59,25);paper(22,-73,35,42,41,9);book(70,-71,35,29,41,7,C.red);} ],
 [-101,50,()=>{plant(-127,27,4,1);plant(-95,53,4,1);plant(-63,80,4,1);} ],
 [67,51,()=>{cart(38,36,4);person(101,76,4,C.blue,1.1);} ]
]),
'02':()=>compose([
 [-71,-35,()=>press(-107,-72,4)],
 [67,-45,()=>banner(25,-80,4,80,75)],
 [45,45,()=>{chair(20,-3,4,C.red);chair(75,4,4,C.green);table(-5,24,4,122,59,26);paper(4,32,40,46,43,9);book(66,33,40,34,43,7,C.red);person(126,61,4,C.blue);} ],
 [-89,65,()=>{book(-120,42,4,60,61,10,C.green);paper(-113,49,15,46,48,10);} ]
]),
'03':()=>compose([
 [-93,-55,()=>{banana(-123,-73,4,1.22);banana(-75,-66,4,1.1);} ],
 [61,-51,()=>{house(12,-83,4,73,48,33);crate(103,-62);} ],
 [-68,52,()=>{rail(-126,59,4,113);crate(-101,61,9);crate(-56,61,9);} ],
 [65,42,()=>{banner(18,6,4,99,68);person(25,68,4,C.red);person(52,59,4,C.green);person(83,70,4,C.blue);person(115,56,4,C.red);} ]
]),
'04':()=>compose([
 [-84,-44,()=>press(-119,-80,4)],
 [72,-41,()=>{podium(38,-53);banner(39,-91,4,62,65);} ],
 [-72,59,()=>{ballot(-101,33,4,65);paper(-18,59,4,35,44,9);} ],
 [85,61,()=>{chair(35,47,4,C.red);chair(73,51,4,C.green);chair(110,60,4,C.blue);} ]
]),
'05':()=>compose([
 [-89,-55,()=>church(-126,-100,4)],
 [66,-42,()=>{house(25,-82,4,88,47,43);banner(26,-31,4,74,48);} ],
 [-57,42,()=>{chair(-66,4,4,C.red);table(-105,34,4,128,64,29);paper(-96,42,43,52,44,9);book(-34,43,43,43,47,8,C.green);seal(-12,75,52);} ],
 [94,64,()=>{book(64,39,4,56,67,13,C.red);paper(70,46,18,43,53,11);} ]
]),
'06':()=>compose([
 [-83,-55,()=>{house(-125,-91,4,93,55,39);book(-80,-10,4,42,55,10,C.red);} ],
 [70,-52,()=>{ballot(47,-79,4,61);fence(23,-23,4,113,74);} ],
 [-76,64,()=>{table(-121,37,4,85,57,24);paper(-114,45,38,68,41,9);} ],
 [52,69,()=>{person(8,53,4,C.red,1.2);person(47,74,4,C.blue,1.2);person(85,91,4,C.green,1.2);} ]
]),
'07':()=>compose([
 [-91,-54,()=>{house(-136,-97,4,83,51,43);radio(-123,-34,4,69);} ],
 [73,-43,()=>{banner(28,-69,4,89,88,C.blue);book(53,-40,4,46,57,11,C.green);} ],
 [-64,63,()=>{book(-103,33,4,61,71,10,C.red);paper(-97,40,15,48,56,12);} ],
 [87,59,()=>{table(36,30,4,94,56,23);paper(44,39,37,76,38,8);person(6,66,4,C.blue);} ]
]),
'08':()=>compose([
 [-63,-38,()=>globe(-83,-48,4,46)],
 [69,-61,()=>{radio(21,-75,4,80);book(88,-55,4,42,53,9,C.red);} ],
 [-68,66,()=>{table(-111,36,4,100,57,24);paper(-104,44,38,42,40,8);book(-51,44,38,32,41,8,C.green);} ],
 [82,64,()=>{book(30,34,4,55,71,12,C.red);book(37,40,16,43,60,9,C.blue);plant(122,61,4,1.4);} ]
]),
'09':()=>compose([
 [-74,-50,()=>{banner(-125,-85,4,102,77,C.red);podium(-96,-47);} ],
 [70,-42,()=>{flag(119,-78,4,91);house(18,-66,4,71,44,33);} ],
 [-65,65,()=>{ballot(-112,32,4,73);person(-13,69,4,C.green,1.1);} ],
 [80,64,()=>{person(42,45,4,C.red,1.2);person(76,67,4,C.blue,1.2);person(108,87,4,C.green,1.2);} ]
]),
'10':()=>compose([
 [-87,-55,()=>{house(-129,-98,4,83,50,40);banner(-125,-36,4,70,53,C.red);} ],
 [76,-53,()=>{house(33,-97,4,84,50,40);banner(40,-35,4,70,53,C.red);} ],
 [-83,60,()=>{table(-128,29,4,87,61,24);book(-120,38,38,32,40,8,C.red);paper(-80,38,38,30,40,8);chair(-101,94,4,C.red);} ],
 [77,60,()=>{table(33,29,4,87,61,24);paper(41,38,38,30,40,8);book(79,38,38,32,40,8,C.green);chair(61,94,4,C.green);} ]
]),
'11':()=>compose([
 [-78,-41,()=>factory(-135,-84)],
 [80,-39,()=>{banner(37,-77,4,86,75,C.green);chair(59,-28,4,C.red);chair(98,-16,4,C.blue);} ],
 [-63,62,()=>{crate(-120,27,4,42,33,27);crate(-69,58,4,42,33,27);person(-12,78,4,C.blue,1.2);} ],
 [78,63,()=>{table(28,38,4,96,59,23);paper(37,46,37,43,40,8);book(88,46,37,28,40,7,C.red);} ]
]),
'12':()=>compose([
 [-83,-43,()=>{box(-123,-83,4,3,3,100,C.wood);box(-123,-83,90,65,3,3,C.wood);for(let xx of [-115,-94,-73])cyl(xx,-82,93,3,7,C.paper,12);box(-59,-83,4,3,3,100,C.wood);banner(-128,-32,4,84,53,C.green);} ],
 [74,-45,()=>{banner(15,-81,4,118,83,C.red);podium(52,-33);} ],
 [-52,68,()=>{person(-114,44,4,C.blue,1.1);person(-78,67,4,C.red,1.1);person(-40,90,4,C.green,1.1);} ],
 [84,69,()=>{person(18,40,4,C.gold,1.1);person(55,63,4,C.blue,1.1);person(94,86,4,C.red,1.1);} ]
]),
'13':()=>compose([
 [-69,-49,()=>{house(-127,-93,4,117,62,50);banner(-119,-27,4,102,36,C.gold);} ],
 [90,-49,()=>{flag(123,-91,4,105);plant(83,-57,4,1.1);} ],
 [-65,63,()=>{chair(-101,12,4,C.red);chair(-52,19,4,C.blue);table(-126,43,4,117,61,24);book(-119,51,38,27,41,7,C.red);paper(-84,51,38,34,41,8);book(-42,51,38,25,41,7,C.green);} ],
 [82,60,()=>{person(26,31,4,C.red,1.1);person(61,54,4,C.green,1.1);person(97,77,4,C.blue,1.1);} ]
]),
'14':()=>compose([
 [-78,-54,()=>{house(-132,-98,4,112,54,49);flag(-139,-38,4,77);} ],
 [66,-45,()=>{podium(44,-68);chair(15,-23,4,C.red);chair(67,-8,4,C.green);chair(111,8,4,C.blue);} ],
 [-75,58,()=>{ballot(-115,30,4,67);book(-31,66,4,34,45,9,C.gold);} ],
 [78,66,()=>{table(20,45,4,110,57,22);paper(30,53,36,42,40,8);paper(80,53,36,39,40,8);} ]
]),
'15':()=>compose([
 [-78,-44,()=>factory(-135,-85)],
 [78,-42,()=>{banner(27,-81,4,101,83,C.red);podium(48,-32);} ],
 [-69,63,()=>{crate(-126,35,4,45,34,28);book(-63,57,4,46,52,10,C.red);} ],
 [78,65,()=>{person(15,30,4,C.red,1.15);person(50,53,4,C.blue,1.15);person(85,76,4,C.red,1.15);person(121,99,4,C.green,1.15);} ]
]),
'16':()=>compose([
 [-77,-48,()=>{flag(-130,-85,4,104);house(-110,-80,4,87,50,43);} ],
 [77,-40,()=>{table(16,-76,4,111,63,29);laptop(27,-64,43);paper(78,-64,43,38,47,10);} ],
 [-80,64,()=>ballot(-120,30,4,71)],
 [79,66,()=>{ballot(28,32,4,71);book(111,67,4,35,48,10,C.red);} ]
]),
'17':()=>compose([
 [-72,-54,()=>{house(-128,-96,4,98,61,42);plant(-135,-6,4,1);} ],
 [78,-49,()=>{chair(36,-73,4,C.red);chair(82,-52,4,C.green);chair(115,-27,4,C.blue);} ],
 [-40,62,()=>openBook(-110,26,4,172,91,16)],
 [104,67,()=>{ballot(89,39,4,46);plant(138,95,4,.85);} ]
]),
'portada':()=>{
  slab(-180,-140,360,280);
  group(-46,-76,()=>{book(-134,-115,4,213,115,18,C.red);book(-128,-110,22,200,106,14,C.green);house(-118,-102,36,178,88,69);for(const xx of [-103,-76,-49,-22,5,32])windowY(xx,-14,77,12,21);for(const yy of [-87,-59,-31])windowX(60,yy,77,12,21);banner(-97,-11,36,137,38,C.red);});
  group(127,-71,()=>{banana(139,-89,4,1.5);banana(99,-84,4,1.05);});
  group(-120,39,()=>press(-155,0,4));
  group(2,49,()=>{chair(-21,2,4,C.red);chair(24,15,4,C.green);table(-57,46,4,136,69,29);openBook(-49,53,43,71,49,7);paper(36,55,43,34,47,10);person(-73,92,4,C.blue,1.1);person(86,102,4,C.red,1.1);});
  group(126,65,()=>{flag(149,12,4,108);ballot(108,52,4,53);});
  group(-112,104,()=>{book(-148,86,4,52,41,10,C.green);book(-144,89,14,45,35,8,C.red);});
}
};
const metadata={
'01':['Trabajo y ayuda mutua','Una casa de tejas, cafetos, una carreta y una mesa compartida con libros.','La vida del trabajo y las redes de ayuda antes de la organización partidaria.'],
'02':['La palabra se organiza','Una imprenta de madera y una mesa de reunión con papeles, libros y sillas.','Publicar, reunirse y convertir necesidades dispersas en demandas comunes.'],
'03':['La plantación y la huelga','Bananos, un campamento, cajas sobre rieles y trabajadores ante una pancarta.','El territorio bananero y la organización de quienes lo trabajaban.'],
'04':['Votar y tomar la palabra','Una urna, una imprenta y una tribuna ante varias sillas.','La representación electoral y la circulación de un vocabulario político.'],
'05':['Pactar en un país dividido','Una iglesia, una casa de reunión y una mesa con documentos y un sello.','Alianzas, reforma social y negociaciones atravesadas por el conflicto.'],
'06':['Los derechos y la puerta cerrada','Una urna detrás de una verja y trabajadores junto a una mesa de documentos.','La exclusión política y la reconstrucción de derechos desde el trabajo.'],
'07':['El miedo en circulación','Un radio, publicaciones y una cartelera junto a una casa costarricense.','La prensa, la radio y las representaciones públicas del enemigo.'],
'08':['Ideas que cruzan fronteras','Un globo terráqueo, un radio y libros reunidos sobre una mesa.','Las revoluciones y disputas internacionales leídas desde Costa Rica.'],
'09':['La política vuelve a abrirse','Una urna, una tribuna y ciudadanos en una plaza con bandera costarricense.','Participación electoral, legalidad y nuevas generaciones de militantes.'],
'10':['Dos mesas, una historia','Dos casas y dos mesas separadas, con documentos y libros de distintos colores.','La fractura de una organización y la disputa por su continuidad.'],
'11':['El trabajo después de la ruptura','Una fábrica, cajas, una reunión y documentos sobre una mesa.','Transformaciones del empleo y esfuerzos por recomponer la representación.'],
'12':['La calle como lugar político','Una infraestructura eléctrica y una tribuna rodeada de personas con pancartas.','Organizaciones sociales, servicios públicos y acción colectiva.'],
'13':['Una casa para varias izquierdas','Una casa de reunión, libros diversos y personas ante una mesa compartida.','Pluralidad, acuerdos y la construcción de un nuevo frente político.'],
'14':['Representar y permanecer','Una urna, una tribuna, sillas y una mesa de trabajo parlamentario.','La trayectoria electoral y el trabajo cotidiano de la representación.'],
'15':['Otra tradición del trabajo','Una fábrica y una tribuna con pancarta roja ante un grupo de trabajadores.','Organización obrera y una tradición revolucionaria diferenciada.'],
'16':['Dos papeletas, un presente','Dos urnas junto a una mesa con computadora y documentos, bajo una bandera costarricense.','Resultados electorales, programas y debates abiertos al corte de 2026.'],
'17':['Leer una tradición abierta','Un gran libro abierto, una casa de reunión, sillas y una urna.','Una historia en revisión, sin un desenlace escrito de antemano.']
};
function output(id){
  shapes=[];groups=[];scenes[id]();
  for(const g of groups.sort((a,b)=>a.depth-b.depth))shapes.push(...g.shapes);
  const points=shapes.flatMap(s=>s.points.map(P));
  const minX=Math.min(...points.map(p=>p[0])),maxX=Math.max(...points.map(p=>p[0]));
  const minY=Math.min(...points.map(p=>p[1])),maxY=Math.max(...points.map(p=>p[1]));
  const cover=id==='portada',width=1000,height=cover?1000:680;
  const k=Math.min((width-85)/(maxX-minX),(height-125)/(maxY-minY));
  const tx=width/2-(minX+maxX)/2*k,ty=height/2-(minY+maxY)/2*k;
  const title=cover?'Una historia construida en común':metadata[id][0];
  const desc=(cover?'Una casa de reunión sobre libros, una imprenta, una mesa compartida, bananos y una urna en una plaza costarricense.':metadata[id][1])+' Interpretación editorial, no reconstrucción documental.';
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title desc"><title id="title">${esc(title)}</title><desc id="desc">${esc(desc)}</desc><defs><radialGradient id="shadow"><stop stop-color="#000" stop-opacity=".15"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient></defs><ellipse cx="500" cy="${height-73}" rx="360" ry="65" fill="url(#shadow)"/><g transform="translate(${num(tx,2)} ${num(ty,2)}) scale(${num(k)})">${shapes.map(s=>s.svg).join('')}</g></svg>`;
  writeFileSync(join(OUT,cover?'portada.svg':`capitulos/${id}.svg`),svg);
  console.log(`${id}: ${shapes.length} vector parts, ${Math.round(svg.length/1024)} KB`);
}
for(const id of Object.keys(scenes))output(id);
writeFileSync(join(HERE,'capitulos.json'),JSON.stringify(Object.fromEntries(Object.entries(metadata).map(([id,[titulo,alt,descripcion]])=>[id,{src:`assets/img/capitulos/${id}.svg`,titulo,alt,descripcion}])),null,2)+'\n');
writeFileSync(join(OUT,'emblema.svg'),`<svg xmlns="http://www.w3.org/2000/svg" width="80" height="96" viewBox="0 0 80 96" role="img" aria-label="Libro abierto y comunidad"><path d="M8 47 40 58 72 47v27L40 86 8 74Z" fill="#183c34"/><path d="M8 43c12-7 22-4 32 3 10-7 20-10 32-3v27c-12-5-22-2-32 6-10-8-20-11-32-6Z" fill="#f2eadb" stroke="#b58a45" stroke-width="1.5"/><path d="M40 46v30" stroke="#9c4035" stroke-width="2"/><path d="m15 51 18 6m-18 3 18 6m14-9 18-6m-18 15 18-6" stroke="#b58a45" stroke-width="1.5"/><circle cx="40" cy="15" r="8" fill="#9c4035"/><circle cx="18" cy="23" r="6" fill="#35604a"/><circle cx="62" cy="23" r="6" fill="#31566a"/><path d="M28 42V33a12 12 0 0 1 24 0v9L40 47Z" fill="#9c4035"/><path d="M8 41v-5a10 10 0 0 1 20 0v6L18 39Z" fill="#35604a"/><path d="M52 42v-6a10 10 0 0 1 20 0v5l-10-2Z" fill="#31566a"/></svg>`);
