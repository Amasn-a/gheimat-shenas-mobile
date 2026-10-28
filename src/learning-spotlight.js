import { fa, esc } from './fmt.js?v=183490631a6f';
export const TOUR_STEPS=[
 {target:'[data-tour="first"]',title:'این کالای اوله',copy:'قیمت و اسمش رو ببین.',next:'کالای دوم رو ببینیم'},
 {target:'[data-tour="second"]',title:'این کالای دومه',copy:'اینجا اسم و عکس کالای دوم رو می‌بینی و حدس می‌زنی که از کالای اول گرون‌تره یا ارزون‌تره!',next:'بریم انتخاب کنیم'},
 {target:'[data-tour="answers"]',title:'حالا انتخاب کن',copy:'حالا بین این دو تا گزینه انتخاب کن.',next:''}
];
export function tourMarkup(step,seconds,answerGuide=false,result=null){
  const t=TOUR_STEPS[step]||TOUR_STEPS[0],last=step===TOUR_STEPS.length-1;
  const title=result?(result.outcome==='correct'?'درست انتخاب کردی!':'این بار درست نبود'):t.title;
  const copy=result?(result.outcome==='correct'?'هدفون از ماگ گرون‌تره. حالا آماده‌ای بازی اصلی رو شروع کنی!':'جواب درست «گرون‌تره» بود؛ هدفون از ماگ گرون‌تره. حالا بریم بازی اصلی!'):t.copy.replace('{seconds}',fa(seconds));
  const locked=result?.busy?' disabled aria-busy="true"':'';
  const actions=result?`<div class="l-coach-actions"><button class="l-coach-prev" data-act="learn-back"${locked}>قبلی</button><button class="l-btn" data-act="learn-play"${locked}>${result.busy?'<span class="q-spin" aria-hidden="true"></span><span>داریم شروع می‌کنیم…</span>':'بزن بریم!'}</button></div>`:answerGuide?'<div class="l-coach-actions is-empty" aria-hidden="true"></div>':`<div class="l-coach-actions"><button class="l-coach-prev" data-act="${step?'learn-prev':'learn-back'}">قبلی</button><button class="l-btn" data-act="${last?'learn-start':'learn-next'}" data-tour-next>${t.next}</button></div>`;
  return `<div class="l-tour is-positioned${answerGuide?' l-tour--answer':''}${result?' l-tour--result':''}" data-key="practice-tour"><div class="l-spotlight-ring" data-key="practice-ring" aria-hidden="true"></div><section class="l-coach${answerGuide?' l-coach--practice':''}" data-key="practice-coach" role="region"${answerGuide?' data-answer-guide':''} aria-labelledby="tour-title" aria-describedby="tour-copy"><div class="l-coach-meta">${answerGuide?'':'<button data-act="learn-back" aria-label="خروج از تمرین"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>'}</div><div class="l-coach-body" data-key="practice-copy-${step}-${result?result.outcome:'intro'}"${result?' role="status" aria-live="polite"':''}><h2 id="tour-title">${title}</h2><p id="tour-copy">${copy}</p><p class="l-coach-error"${result?.error?' role="alert"':' aria-hidden="true"'}>${result?.error?esc(result.error):''}</p></div>${actions}</section></div>`;
}
let cleanup=null;
const spotlightState=new WeakMap();
export function syncLearningSpotlight(root,step){
  cleanup?.();cleanup=null;
  if(step===null)return;
  const layer=root.querySelector('.l-tour'),ring=layer?.querySelector('.l-spotlight-ring'),panel=layer?.querySelector('.l-coach'),target=TOUR_STEPS[step]?.target?root.querySelector(TOUR_STEPS[step].target):null;
  if(!ring||!panel)return;
  layer.classList.toggle('l-tour--overview',!target);
  ring.hidden=!target;
  if(!target){layer.dataset.step=String(step);layer.classList.add('is-positioned');return;}
  const extra=TOUR_STEPS[step]?.include?root.querySelector(TOUR_STEPS[step].include):null;
  const targetBox=()=>spotlightBounds([target,extra].filter(Boolean).map(el=>el.getBoundingClientRect()));
  const stage=root.querySelector('.l-coach-space'),canvas=stage?.querySelector('.q-game__main');
  const previous=spotlightState.get(layer);
  // Keep the page and sheet still. Only the bounded card canvas may scroll on
  // short screens; ordinary re-renders preserve the player's scroll position.
  let shouldMove=previous?.step!==step;
  function position(reveal=false){
    // The coach owns a real grid row. The canvas cannot extend beneath it.
    let scrolled=false;
    if(canvas&&reveal){
      const viewport=canvas.getBoundingClientRect();
      const fits=target.getBoundingClientRect().height<=viewport.height-24;
      const anchor=step===1&&!fits?target.querySelector('.p-cmp-info')||target:target;
      const visibleTarget=anchor.getBoundingClientRect();
      const before=canvas.scrollTop;
      if(visibleTarget.top<viewport.top+12)canvas.scrollTop-=viewport.top+12-visibleTarget.top;
      else if(visibleTarget.bottom>viewport.bottom-12)canvas.scrollTop+=visibleTarget.bottom-(viewport.bottom-12);
      scrolled=canvas.scrollTop!==before;
    }
    const r=targetBox(),w=window.innerWidth,h=window.innerHeight,pad=7;
    const visible=canvas?.getBoundingClientRect(),dockTop=panel.getBoundingClientRect().top;
    const x=Math.max(8,r.left-pad),y=Math.max(8,visible?.top||0,r.top-pad),right=Math.min(w-8,r.right+pad),bottom=Math.min(h-8,dockTop-8,visible?.bottom||h,r.bottom+pad);
    const rect={left:`${x}px`,top:`${y}px`,width:`${Math.max(0,right-x)}px`,height:`${Math.max(0,bottom-y)}px`};
    const old=spotlightState.get(layer);
    const moved=!old?.rect||Object.keys(rect).some(k=>old.rect[k]!==rect[k]);
    if(moved||shouldMove)old?.animation?.cancel();
    ring.hidden=right<=x||bottom<=y;
    Object.assign(ring.style,rect);
    if(shouldMove&&old?.rect&&!scrolled&&!ring.hidden&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
      const animation=ring.animate([old.rect,rect],{duration:240,easing:'cubic-bezier(.2,.8,.2,1)'});
      spotlightState.set(layer,{step,rect,animation});
    }else spotlightState.set(layer,{step,rect,animation:old?.animation});
    shouldMove=false;
    layer.dataset.step=String(step);layer.classList.add('is-positioned');
  }
  position(shouldMove);
  const resize=()=>position(true),scroll=()=>position(false);
  const size=()=>[target.offsetWidth,target.offsetHeight,panel.offsetWidth,panel.offsetHeight,canvas?.clientWidth,canvas?.clientHeight].join(':');
  let lastSize=size();
  const ro=new ResizeObserver(()=>{const next=size();if(next!==lastSize){lastSize=next;resize();}});ro.observe(target);ro.observe(panel);if(canvas)ro.observe(canvas);if(extra)ro.observe(extra);
  canvas?.addEventListener('scroll',scroll,{passive:true});window.addEventListener('resize',resize);window.visualViewport?.addEventListener('resize',resize);
  cleanup=()=>{ro.disconnect();canvas?.removeEventListener('scroll',scroll);window.removeEventListener('resize',resize);window.visualViewport?.removeEventListener('resize',resize);};
}

export function spotlightBounds(rects){return {left:Math.min(...rects.map(r=>r.left)),top:Math.min(...rects.map(r=>r.top)),right:Math.max(...rects.map(r=>r.right)),bottom:Math.max(...rects.map(r=>r.bottom))};}
