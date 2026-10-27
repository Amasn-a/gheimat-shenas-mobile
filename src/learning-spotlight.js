import { fa } from './fmt.js';
export const TOUR_STEPS=[
  {target:'.q-cmp > .q-img',title:'اول، این کالا رو ببین',copy:'قراره قیمت همین هدفون رو حدس بزنی. عکسش رو نگاه کن؛ قیمتش فعلاً مخفیه.',next:'خب، سؤال چیه؟'},
  {target:'[data-tour="question"]',title:'سؤال دقیقاً اینه',copy:'هدفون گرون‌تره یا ارزون‌تر؟ برای جواب، با ماگی که بالای صفحه می‌بینی مقایسه‌اش کن.',next:'با کدوم کالا؟'},
  {target:'[data-tour="first"]',title:'با این ماگ مقایسه کن',copy:'قیمت ماگ ۲۴۵٬۰۰۰ تومنه. فکر می‌کنی قیمت هدفون بیشتر از اینه یا کمتر؟',next:'فهمیدم، کجا جواب بدم؟'},
  {target:'[data-tour="answers"]',title:'انتخابت رو اینجا بزن',copy:'اگه هدفون از ماگ گرون‌تره، «گرون‌تره» رو بزن؛ اگه ارزون‌تره، دکمهٔ کناری رو.',next:'چقدر وقت دارم؟'},
  {target:'[data-tour="timer"]',title:'حالا آماده‌ای!',copy:'بعد از شروع تمرین، {seconds} ثانیه وقت داری. تا اینجا هیچ زمانی ازت کم نشده.',next:'آماده‌ام، شروع تمرین'}
];
export function tourMarkup(step,seconds){
  const t=TOUR_STEPS[step]||TOUR_STEPS[0],last=step===TOUR_STEPS.length-1;
  return `<div class="l-tour" data-mkey="practice-tour"><div class="l-spotlight-ring" aria-hidden="true"></div><section class="l-coach" role="dialog" aria-modal="true" aria-labelledby="tour-title" aria-describedby="tour-copy"><div class="l-coach-meta"><span>فوت‌وفن بازی · ${fa(step+1)} از ${fa(TOUR_STEPS.length)}</span><button data-act="learn-back" aria-label="خروج از تمرین">×</button></div><h2 id="tour-title">${t.title}</h2><p id="tour-copy">${t.copy.replace('{seconds}',fa(seconds))}</p><div class="l-coach-actions"><button class="l-coach-prev" data-act="learn-prev"${step?'':' disabled aria-hidden="true" tabindex="-1"'}>قبلی</button><button class="l-btn" data-act="${last?'learn-start':'learn-next'}" data-tour-next>${t.next}</button></div><div class="l-coach-dots" aria-hidden="true">${TOUR_STEPS.map((_,i)=>`<i class="${i===step?'is-active':''}"></i>`).join('')}</div></section></div>`;
}
// Same dock geometry during the actual practice and its result, without a scrim.
export function practiceCoachMarkup(phase,seconds){
  const feedback=phase==='feedback';
  const title=feedback?'جواب رو بررسی کن':'حالا خودت انتخاب کن';
  const copy=feedback?'قیمت هدفون ۸۹۰٬۰۰۰ تومنه؛ از ماگ ۲۴۵٬۰۰۰ تومنی گرون‌تره. نگران نباش، تمرین رایگان بود!':`هدفون از ماگ بالایی گرون‌تره یا ارزون‌تر؟ یکی از دو دکمهٔ پاسخ رو بزن؛ ${fa(seconds)} ثانیه وقت داری.`;
  return `<section class="l-coach l-coach--practice" aria-label="راهنمای تمرین"><div class="l-coach-meta"><span>تمرین رایگان</span><span>${feedback?'پایان تمرین':'نوبت توئه'}</span></div><h2>${title}</h2><p>${copy}</p><div class="l-coach-actions"><span aria-hidden="true"></span>${feedback?'<button class="l-btn" data-act="learn-done">فهمیدم، ادامه بدیم</button>':'<span class="l-coach-wait">از دکمه‌های پاسخ استفاده کن</span>'}</div><div class="l-coach-dots" aria-hidden="true"></div></section>`;
}
let cleanup=null;
export function syncLearningSpotlight(root,step){
  cleanup?.();cleanup=null;
  if(step===null){
    const stage=root.querySelector('.l-coach-space'),dock=root.querySelector('.l-coach--practice'),answers=stage?.querySelector('.q-ans');
    if(stage&&dock&&answers){const r=answers.getBoundingClientRect(),p=dock.getBoundingClientRect();if(r.bottom>p.top-18)stage.scrollTop+=r.bottom-p.top+18;}
    return;
  }
  const layer=root.querySelector('.l-tour'),ring=layer?.querySelector('.l-spotlight-ring'),panel=layer?.querySelector('.l-coach'),target=root.querySelector(TOUR_STEPS[step]?.target);
  if(!ring||!panel||!target)return;
  const stage=root.querySelector('.l-tour-active');
  // The dock never moves. Only the small-phone canvas scrolls to expose a target.
  if(stage){
    const tr=target.getBoundingClientRect(),pr=panel.getBoundingClientRect(),sr=stage.getBoundingClientRect();
    const low=pr.top-18,high=Math.max(8,sr.top+8);
    if(tr.bottom>low)stage.scrollTop+=tr.bottom-low;
    else if(tr.top<high)stage.scrollTop-=high-tr.top;
  }
  function position(){
    const r=target.getBoundingClientRect(),w=window.innerWidth,h=window.innerHeight,pad=7;
    const x=Math.max(8,r.left-pad),y=Math.max(8,r.top-pad),right=Math.min(w-8,r.right+pad),bottom=Math.min(h-8,r.bottom+pad);
    Object.assign(ring.style,{left:`${x}px`,top:`${y}px`,width:`${right-x}px`,height:`${bottom-y}px`});
    layer.dataset.step=String(step);layer.classList.add('is-positioned');
  }
  position();
  const ro=new ResizeObserver(position);ro.observe(target);window.addEventListener('resize',position);stage?.addEventListener('scroll',position);window.visualViewport?.addEventListener('resize',position);
  cleanup=()=>{ro.disconnect();stage?.removeEventListener('scroll',position);window.removeEventListener('resize',position);window.visualViewport?.removeEventListener('resize',position);};
}
