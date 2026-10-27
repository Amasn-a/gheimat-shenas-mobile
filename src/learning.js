import {tourMarkup} from './learning-spotlight.js';
import {soundControl} from './feedback.mjs';
import {I} from './icons.js';
import {fa,esc} from './fmt.js';
import {DEMO_FIRST,DEMO_SECOND} from './demo.js';
export function renderLearning(m,h){
 const phase=m.learn?.phase||'overview',onb=m.from==='onb',c=m.config;
 const button=(text,act,secondary=false)=>`<button class="l-btn${secondary?' l-btn--secondary':''}" data-act="${act}"${m.busy?' disabled aria-busy="true"':''}>${m.busy?'<span class="q-spin"></span>':text}</button>`;
 const badges=`<ol class="l-outcome-badges">${c.checkpoints.map((cp,i)=>`<li><img src="${h.BADGE_SRC(h.badgeId(cp,i))}" alt="نشان ${esc(cp.title)}"><span>${fa(cp.requiredCorrect)} جواب درست</span></li>`).join('')}</ol>`;
 const header=text=>`<header class="l-header"><button data-act="${onb?'onb-skip':'guide-close'}" aria-label="برگشت به خانه">${I.back}</button><h1>${text}</h1>${soundControl(m.soundOn!==false)}</header>`;
 if(phase==='feedback'||phase==='done'){
  const ok=m.learn?.outcome==='correct';
  return h.page('l-guide l-outcome',header(ok?'درست انتخاب کردی!':'این بار درست نبود')+`<main class="l-main"><h2>${ok?'آفرین، گرون‌تر بود!':'هدفون از ماگ گرون‌تر بود'}</h2><p>توی این بازی هم نشان می‌گیری، هم کد تخفیف و هم دیجی‌کوین!</p>${badges}</main><footer class="l-footer l-footer-pair">${button('صفحه اصلی',onb?'onb-finish':'guide-close')}${button('نفهمیدم، یه بار دیگه','learn-practice',true)}</footer>`);
 }
 if(phase==='intro'||phase==='question'){
  const first={...DEMO_FIRST,displayTitle:'ماگ سرامیکی'},second={...DEMO_SECOND,displayTitle:'هدفون بی‌سیم'};
  const top=`<header class="q-hdr q-hdr--game"><button class="q-iconbtn" data-act="learn-back" aria-label="برگشت به راهنما">${I.back}</button><h1 class="q-hdr__t">یه دور تمرینی</h1>${soundControl(m.soundOn!==false)}</header>`;
  const decision=h.decide(phase==='question'?'on':'off',null,'',first.price,'learn');
  const main=h.refCard(first,true)+h.cmpCard(second,'hidden',0,false,decision);
  let page=h.page('q-game p-game l-practice l-coach-space',top+`<main class="q-game__main">${main}</main>`);
  if(phase==='intro')page=page.replace('<div class="q-page','<div inert class="q-page l-tour-active')+tourMarkup(m.learn?.tourStep||0,0);
  else page=page.replace('data-act="learn-back"','disabled data-act="learn-back"').replace('data-act="sound-toggle"','disabled data-act="sound-toggle"')+tourMarkup(2,0,true);
  return page;
 }
 return h.page('l-guide',header('چطور بازی کنیم؟')+`<main class="l-main"><ol class="l-steps"><li><b>۱</b><div><h3>اسم و قیمت کالای اول رو ببین</h3></div>${I.image}</li><li><b>۲</b><div><h3>اسم و عکس کالای دوم رو ببین</h3></div>${I.image}</li><li><b>۳</b><div><h3>حالا حدس بزن که گرون‌تره یا ارزون‌تر!</h3></div>${I.help}</li><li><b>۴</b><div><h3>جواب‌های درستت جایزه دارن</h3></div>${I.gift}</li></ol><h2 class="l-inline-rewards">نشان‌ها و جایزه‌ها</h2>${badges}</main><footer class="l-footer">${m.error?`<p role="alert">${esc(m.error)}</p>`:''}${button('یه دور تمرینی و مجانی بزنیم!','learn-practice')}</footer>`);
}
