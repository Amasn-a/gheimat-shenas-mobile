// Current-run score leads; personal best is secondary, with a playable QR.
import { fa } from './fmt.js?v=7afa2313a516';
import { BADGES, BADGE_SRC } from './views.js?v=7afa2313a516';
import { GAME_URL, SHARE_SIZE, shareStats, shareRecordLabel } from './share-payload.mjs?v=7afa2313a516';
export { GAME_URL };
const load=src=>new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=reject;im.src=src;});
const rounded=(c,x,y,w,h,r,fill,stroke)=>{c.beginPath();c.roundRect(x,y,w,h,r);c.fillStyle=fill;c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=3;c.stroke();}};
function number(c,value,x,y,maxSize,width){let size=maxSize;const text=fa(value);do{c.font=`950 ${size}px Digikala`;if(c.measureText(text).width<=width)break;size-=2;}while(size>32);c.fillText(text,x,y);}
export async function createShareCard({score,record=score,title,badgeAssetId,streakDays=0}){
  ({score,record}=shareStats(score,record));
  await document.fonts.load('900 48px Digikala');
  const [mascot,mark,logo,qr]=await Promise.all([load('assets/brand-smile-v2.png'),title&&BADGES.includes(badgeAssetId)?load(BADGE_SRC(badgeAssetId)).catch(()=>null):null,load('assets/digikala-logo.svg'),load('assets/share-qr.png')]);
  const canvas=document.createElement('canvas');canvas.width=SHARE_SIZE.width;canvas.height=SHARE_SIZE.height;
  const c=canvas.getContext('2d');
  rounded(c,0,0,1080,1920,0,'#fffaf0');
  c.fillStyle='#dce0cb';for(let x=20;x<1080;x+=32)for(let y=20;y<1920;y+=32){c.beginPath();c.arc(x,y,1.5,0,Math.PI*2);c.fill();}
  c.fillStyle='#d9edcf';c.beginPath();c.arc(1020,70,245,0,Math.PI*2);c.fill();
  c.fillStyle='#ffe5a5';c.beginPath();c.arc(0,1870,245,0,Math.PI*2);c.fill();
  rounded(c,38,38,1004,1844,54,'#fffaf090','#bec8ad');
  // Keep key content clear of the top and bottom Story interface areas.
  c.drawImage(logo,375,240,330,86);
  c.direction='rtl';c.textAlign='center';c.fillStyle='#233f35';c.font='950 68px Digikala';c.fillText('قیمت‌شناس',540,422);
  c.font='600 30px Digikala';c.fillStyle='#687b5b';c.fillText('گرون‌تره یا ارزون‌تر؟',540,475);
  rounded(c,90,500,900,860,46,'#d6edbf','#4f7045');
  rounded(c,330,532,420,60,30,'#fffaf0');c.fillStyle='#324c2e';c.font='850 30px Digikala';c.fillText('امتیاز این دست من',540,573);
  const artSize=mark?360:320;c.drawImage(mark||mascot,540-artSize/2,600,artSize,artSize);
  rounded(c,235,977,610,140,30,'#ffcf43','#536b3e');
  c.fillStyle='#233f35';number(c,score,540,1082,112,540);
  rounded(c,185,1140,710,180,24,'#fffaf0','#b4c99f');
  const recordMessage=shareRecordLabel(score,record);
  if(recordMessage){c.font='900 43px Digikala';c.fillStyle='#355433';c.fillText(recordMessage,540,1202);}
  else{c.font='750 30px Digikala';c.fillStyle='#405b36';c.fillText('بهترین رکوردم',665,1202);c.fillStyle='#233f35';number(c,record,354,1207,52,230);}
  c.beginPath();c.moveTo(225,1230);c.lineTo(855,1230);c.strokeStyle='#d2ddc8';c.lineWidth=2;c.stroke();
  c.font='750 30px Digikala';c.fillStyle='#405b36';c.fillText('استریکم',665,1286);
  c.font='900 42px Digikala';c.fillStyle='#233f35';c.fillText(`${fa(Math.max(0,Math.trunc(Number(streakDays)||0)))} روز`,354,1288,270);
  c.font='900 43px Digikala';c.fillStyle='#233f35';c.fillText('تو چند امتیاز می‌گیری؟',540,1446);
  rounded(c,100,1490,880,290,34,'#fffdf7','#d7dfca');
  c.imageSmoothingEnabled=false;c.drawImage(qr,686,1509,252,252);c.imageSmoothingEnabled=true;
  c.fillStyle='#233f35';c.font='900 40px Digikala';c.fillText('نوبت توئه!',380,1580);
  c.font='650 28px Digikala';c.fillStyle='#485c3f';c.fillText('اسکن کن و وارد بازی شو',380,1664);
  return new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error('PNG export failed')),'image/png'));
}
