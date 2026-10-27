import { fa } from './fmt.js';
export const TOUR_STEPS=[
  {target:'.q-cmp > .q-img',title:'اول، این کالا رو ببین',copy:'قراره قیمت همین هدفون رو حدس بزنی. عکسش رو نگاه کن؛ قیمتش فعلاً مخفیه.',next:'خب، سؤال چیه؟'},
  {target:'[data-tour="question"]',title:'سؤال دقیقاً اینه',copy:'هدفون گرون‌تره یا ارزون‌تر؟ برای جواب، باید با یه کالای دیگه مقایسه‌اش کنی.',next:'با کدوم کالا؟'},
  {target:'[data-tour="first"]',title:'با این ماگ مقایسه کن',copy:'قیمت ماگ ۲۴۵٬۰۰۰ تومنه. فکر می‌کنی قیمت هدفون بیشتر از اینه یا کمتر؟',next:'فهمیدم، کجا جواب بدم؟'},
  {target:'[data-tour="answers"]',title:'انتخابت رو اینجا بزن',copy:'اگه هدفون از ماگ گرون‌تره، «گرون‌تره» رو بزن؛ اگه ارزون‌تره، دکمهٔ کناری رو.',next:'چقدر وقت دارم؟'},
  {target:'[data-tour="timer"]',title:'حالا آماده‌ای!',copy:'بعد از شروع تمرین، {seconds} ثانیه وقت داری. تا اینجا هیچ زمانی ازت کم نشده.',next:'آماده‌ام، شروع تمرین'}
];
export function tourMarkup(step,seconds){
  const t=TOUR_STEPS[step]||TOUR_STEPS[0],last=step===TOUR_STEPS.length-1;
  return `<div class="l-tour" data-mkey="practice-tour"><div class="l-spotlight-ring" aria-hidden="true"></div><section class="l-coach" role="dialog" aria-modal="true" aria-labelledby="tour-title" aria-describedby="tour-copy"><div class="l-coach-meta"><span>فوت‌وفن بازی · ${fa(step+1)} از ${fa(TOUR_STEPS.length)}</span><button data-act="learn-back" aria-label="خروج از تمرین">×</button></div><h2 id="tour-title">${t.title}</h2><p id="tour-copy">${t.copy.replace('{seconds}',fa(seconds))}</p><div class="l-coach-actions">${step?'<button class="l-coach-prev" data-act="learn-prev">قبلی</button>':''}<button class="l-btn" data-act="${last?'learn-start':'learn-next'}" data-tour-next>${t.next}</button></div><div class="l-coach-dots" aria-hidden="true">${TOUR_STEPS.map((_,i)=>`<i class="${i===step?'is-active':''}"></i>`).join('')}</div></section></div>`;
}
let cleanup=null;
export function syncLearningSpotlight(root,step){
  cleanup?.();cleanup=null;
  if(step===null)return;
  const layer=root.querySelector('.l-tour'),ring=layer?.querySelector('.l-spotlight-ring'),panel=layer?.querySelector('.l-coach'),target=root.querySelector(TOUR_STEPS[step]?.target);
  if(!ring||!panel||!target)return;
  function position(){
    const r=target.getBoundingClientRect(),w=window.innerWidth,h=window.innerHeight,pad=7;
    const x=Math.max(8,r.left-pad),y=Math.max(8,r.top-pad),right=Math.min(w-8,r.right+pad),bottom=Math.min(h-8,r.bottom+pad);
    Object.assign(ring.style,{left:`${x}px`,top:`${y}px`,width:`${right-x}px`,height:`${bottom-y}px`});
    const ph=panel.offsetHeight,pw=Math.min(360,w-32),below=h-bottom-18,above=y-18;
    const top=below>=ph?bottom+18:above>=ph?y-ph-18:Math.max(12,Math.min(h-ph-12,bottom+14));
    Object.assign(panel.style,{width:`${pw}px`,left:`${Math.max(16,Math.min(w-pw-16,(r.left+r.right-pw)/2))}px`,top:`${top}px`});
    layer.dataset.position=top>y?'below':'above';layer.dataset.step=String(step);layer.classList.add('is-positioned');
  }
  position();
  const ro=new ResizeObserver(position);ro.observe(target);ro.observe(panel);window.addEventListener('resize',position);window.visualViewport?.addEventListener('resize',position);
  cleanup=()=>{ro.disconnect();window.removeEventListener('resize',position);window.visualViewport?.removeEventListener('resize',position);};
}
