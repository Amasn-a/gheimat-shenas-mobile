export const GAME_URL='https://amasn-a.github.io/gheimat-shenas-mobile/';
export const SHARE_SIZE={width:1080,height:1920};
export function shareCaption(score,url=GAME_URL) {
  const n=new Intl.NumberFormat('fa-IR').format(score);
  return `من این دست توی قیمت‌شناس ${n} امتیاز گرفتم! 🎯\nفکر می‌کنی قیمت‌ها رو بهتر حدس می‌زنی؟ بیا بازی کنیم؛ ببین چند امتیاز می‌گیری!\n${url}`;
}
export function buildSharePayload(blob,text,url=GAME_URL) {
  const caption=singleShareLink(text,url);
  return {title:'قیمت‌شناس | بازی دیجی‌کالا',text:caption,files:[new File([blob],'gheimat-shenas-digikala.png',{type:'image/png'})]};
}

export function shareStats(value,...records){
  const count=v=>Number.isFinite(Number(v))?Math.max(0,Math.trunc(Number(v))):0;
  const score=count(value);return {score,record:Math.max(score,...records.map(count))};
}

export function shareRecordLabel(score,record){return score>0&&score>=record?'رکوردمو زدم!':null;}

export function singleShareLink(text,url=GAME_URL){return `${String(text).split(url).join('').trim()}\n${url}`.trim();}
