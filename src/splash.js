import {SplashTiming} from './splash-timing.mjs?v=fdc36ae507bc';
import {entryArt,loadingDots} from './entry-art.js?v=fdc36ae507bc';
/** UI only. Does not start a paid game, fetch questions or change game rules. */
export function createPriceShenasSplash({mount=document.body,artUrl,minVisibleMs=2000}={}){
  const root=document.createElement('section');
  root.className='ps-splash';root.lang='fa';root.dir='rtl';
  root.setAttribute('aria-label','بارگذاری بازی قیمت شناس');root.setAttribute('aria-busy','true');
  root.innerHTML=`<div class="ps-splash__safe"><div class="ps-splash__stage">
    <header class="ps-splash__brand"><span class="ps-splash__brand-dot"></span> قیمت‌شناس</header>
    <main class="ps-splash__scene"><span class="p-entry-kicker">شمّ اقتصادی‌ات رو به چالش بکش</span><h1>یه حدس<br><span>تا هیجان!</span></h1><div class="ps-splash__art">${entryArt(artUrl)}</div><p class="ps-splash__promise">مقایسه کن. رکورد بزن. جایزه بگیر.</p></main>
    <footer class="ps-splash__loader"><div class="ps-splash__track" role="progressbar" aria-label="آماده‌سازی بازی"><i class="ps-splash__fill"></i></div><div class="ps-splash__status">${loadingDots}<p class="ps-splash__label" role="status" aria-live="polite">داریم بازی رو آماده می‌کنیم…</p></div><div class="ps-splash__actions" hidden><button class="ps-splash__retry" type="button">تلاش دوباره</button></div><small>گرون‌تره یا ارزون‌تره؟</small></footer>
  </div></div>`;
  const find=n=>root.querySelector('.ps-splash__'+n);
  const track=find('track'),label=find('label'),actions=find('actions'),retry=find('retry');
  let timing=new SplashTiming(minVisibleMs),removed=false,painted=false,frame=0;
  let finishing=false,finishPromise=null,resolveFinish=null,retryCallback=null;
  let lastFrame=null,hold=0,holding=false,closingAt=null;
  mount.append(root);
  const app=document.getElementById('app');
  const lock=app&&!app.contains(root),wasInert=app?.inert;
  if(lock)app.inert=true;
  function visibility(){timing.pause();lastFrame=null;}
  document.addEventListener('visibilitychange',visibility);
  function destroy(){
    if(removed)return;removed=true;cancelAnimationFrame(frame);
    document.removeEventListener('visibilitychange',visibility);
    retry.removeEventListener('click',onRetry);root.remove();delete document.documentElement.dataset.launch;
    if(lock){app.inert=!!wasInert;if(!wasInert){const target=app.querySelector('[role="dialog"] button,h1[tabindex="-1"]');target?.focus({preventScroll:true});}}
    resolveFinish?.();
  }
  function loop(now){
    if(removed)return;
    const visible=document.visibilityState==='visible';
    timing.tick(now,visible,painted);
    root.style.setProperty('--ps-progress',String(timing.progress));

    if(visible&&painted&&!timing.failed){
      const delta=lastFrame===null?0:Math.max(0,now-lastFrame);
      if(timing.canLeave&&!finishing){
        if(!holding){holding=true;hold=0;}else hold+=delta;
        // Allow the final CSS fill to visibly reach 100 before the fade.
        if(hold>=240){finishing=true;root.setAttribute('aria-busy','false');root.classList.add('ps-splash--closing');closingAt=now;}
      }
      if(finishing&&now-closingAt>=180){destroy();return;}
      lastFrame=now;
    }else lastFrame=null;
    frame=requestAnimationFrame(loop);
  }
  frame=requestAnimationFrame(loop);
  // CSS and text are sufficient to render the launch; artwork is decorative and never blocks boot.
  const art=root.querySelector('.p-energy__smile');
  art.addEventListener('error',()=>{art.hidden=true;art.parentElement.classList.add('p-energy--fallback');});
  const ready=new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>{
    if(!removed){painted=true;timing.pause();}resolve();
  })));
  function showError(message='بارگذاری انجام نشد. دوباره تلاش کن.',callback){
    if(removed)return;timing.failed=true;timing.pause();
    root.dataset.error='true';root.setAttribute('aria-busy','false');
    label.textContent=message;retryCallback=typeof callback==='function'?callback:null;
    actions.hidden=!retryCallback;if(retryCallback)retry.focus({preventScroll:true});
  }
  function showLoading(){
    if(removed)return;
    timing=new SplashTiming(minVisibleMs);lastFrame=null;holding=false;hold=0;
    delete root.dataset.error;root.setAttribute('aria-busy','true');
    label.textContent='داریم بازی رو آماده می‌کنیم…';actions.hidden=true;root.classList.remove('is-ready');track.removeAttribute('aria-valuenow');
  }
  function onRetry(){
    const cb=retryCallback;if(!cb)return;showLoading();
    Promise.resolve().then(cb).catch(()=>showError(undefined,cb));
  }
  retry.addEventListener('click',onRetry);
  function complete(){
    if(removed)return Promise.resolve();
    if(!finishPromise)finishPromise=new Promise(resolve=>{resolveFinish=resolve;});
    timing.markReady();root.classList.add('is-ready');label.textContent='همه‌چی آماده‌ست!';track.setAttribute('aria-valuenow','100');return finishPromise;
  }
  return {element:root,ready,setProgress:p=>timing.setProgress(p),showLoading,showError,complete,destroy};
}
