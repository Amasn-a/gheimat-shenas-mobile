import { fa } from './fmt.js';
export const TOUR_STEPS=[
 {target:'[data-tour="first"]',title:'این کالای اوله',copy:'قیمت و اسمش رو ببین.',next:'کالای دوم رو ببینیم'},
 {target:'[data-tour="second"]',title:'این کالای دومه',copy:'اینجا اسم و عکس کالای دوم رو می‌بینی و حدس می‌زنی که از کالای اول گرون‌تره یا ارزون‌تره!',next:'بریم انتخاب کنیم'},
 {target:'[data-tour="answers"]',title:'حالا انتخاب کن',copy:'حالا بین این دو تا گزینه انتخاب کن.',next:''}
];
export function tourMarkup(step,seconds,answerGuide=false){
  const t=TOUR_STEPS[step]||TOUR_STEPS[0],last=step===TOUR_STEPS.length-1;
  return `<div class="l-tour${answerGuide?' l-tour--answer':''}" data-mkey="practice-tour"><div class="l-spotlight-ring" aria-hidden="true"></div><section class="l-coach" role="${answerGuide?'region':'dialog'}"${answerGuide?' data-answer-guide':' aria-modal="true"'} aria-labelledby="tour-title" aria-describedby="tour-copy"><div class="l-coach-meta"><span>${fa(step+1)} از ${fa(TOUR_STEPS.length)}</span>${answerGuide?'':'<button data-act="learn-back" aria-label="خروج از تمرین">×</button>'}</div><h2 id="tour-title">${t.title}</h2><p id="tour-copy">${t.copy.replace('{seconds}',fa(seconds))}</p>${answerGuide?'':`<div class="l-coach-actions"><button class="l-coach-prev" data-act="${step?'learn-prev':'learn-back'}">${step?'قبلی':'راهنما'}</button><button class="l-btn" data-act="${last?'learn-start':'learn-next'}" data-tour-next>${t.next}</button></div>`}<div class="l-coach-dots" aria-hidden="true">${TOUR_STEPS.map((_,i)=>`<i class="${i===step?'is-active':''}"></i>`).join('')}</div></section></div>`;
}
let cleanup=null;
export function syncLearningSpotlight(root,step){
  cleanup?.();cleanup=null;
  if(step===null){
    const stage=root.querySelector('.l-coach-space'),dock=root.querySelector('.l-coach--practice'),answers=stage?.querySelector('.q-ans');
    if(stage&&dock&&answers){const r=answers.getBoundingClientRect(),p=dock.getBoundingClientRect();if(r.bottom>p.top-18)stage.scrollTop+=r.bottom-p.top+18;}
    return;
  }
  const layer=root.querySelector('.l-tour'),ring=layer?.querySelector('.l-spotlight-ring'),panel=layer?.querySelector('.l-coach'),target=TOUR_STEPS[step]?.target?root.querySelector(TOUR_STEPS[step].target):null;
  if(!ring||!panel)return;
  layer.classList.toggle('l-tour--overview',!target);
  ring.hidden=!target;
  if(!target){layer.dataset.step=String(step);layer.classList.add('is-positioned');return;}
  const extra=TOUR_STEPS[step]?.include?root.querySelector(TOUR_STEPS[step].include):null;
  const targetBox=()=>spotlightBounds([target,extra].filter(Boolean).map(el=>el.getBoundingClientRect()));
  const stage=root.querySelector('.l-tour-active')||root.querySelector('.l-coach-space');
  // The dock never moves. Only the small-phone canvas scrolls to expose a target.
  if(stage){
    const tr=targetBox(),pr=panel.getBoundingClientRect(),sr=stage.getBoundingClientRect();
    const low=pr.top-18,high=Math.max(8,sr.top+8);
    if(tr.bottom>low)stage.scrollTop+=tr.bottom-low;
    else if(tr.top<high)stage.scrollTop-=high-tr.top;
  }
  function position(){
    const r=targetBox(),w=window.innerWidth,h=window.innerHeight,pad=7;
    const x=Math.max(8,r.left-pad),y=Math.max(8,r.top-pad),right=Math.min(w-8,r.right+pad),bottom=Math.min(h-8,r.bottom+pad);
    Object.assign(ring.style,{left:`${x}px`,top:`${y}px`,width:`${right-x}px`,height:`${bottom-y}px`});
    layer.dataset.step=String(step);layer.classList.add('is-positioned');
  }
  position();
  const ro=new ResizeObserver(position);ro.observe(target);if(extra)ro.observe(extra);window.addEventListener('resize',position);stage?.addEventListener('scroll',position);window.visualViewport?.addEventListener('resize',position);
  cleanup=()=>{ro.disconnect();stage?.removeEventListener('scroll',position);window.removeEventListener('resize',position);window.visualViewport?.removeEventListener('resize',position);};
}

export function spotlightBounds(rects){return {left:Math.min(...rects.map(r=>r.left)),top:Math.min(...rects.map(r=>r.top)),right:Math.max(...rects.map(r=>r.right)),bottom:Math.max(...rects.map(r=>r.bottom))};}
