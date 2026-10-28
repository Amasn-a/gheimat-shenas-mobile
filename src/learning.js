import {tourMarkup} from './learning-spotlight.js';
import {soundControl} from './feedback.mjs';
import {I} from './icons.js';
import {fa,esc} from './fmt.js';
import {DEMO_FIRST,DEMO_SECOND} from './demo.js';
export function renderLearning(m,h){
 const phase=m.learn?.phase||'overview',onb=m.from==='onb',c=m.config;
 const button=(text,act,secondary=false)=>`<button class="l-btn${secondary?' l-btn--secondary':''}" data-act="${act}"${m.busy?' disabled aria-busy="true"':''}>${m.busy?'<span class="q-spin"></span>':text}</button>`;
 const badges=`<ol class="l-outcome-badges">${c.checkpoints.map((cp,i)=>`<li><img src="${h.BADGE_SRC(h.badgeId(cp,i))}" alt="نشان ${esc(cp.title)}"><span>${fa(cp.requiredCorrect)} جواب درست</span></li>`).join('')}</ol>`;
 const header=text=>`<header class="l-header"><button data-act="back" aria-label="بازگشت به صفحهٔ قبل">${I.back}</button><h1>${text}</h1>${soundControl(m.soundOn!==false)}</header>`;
 if(phase==='feedback'||phase==='done'){
  const ok=m.learn?.outcome==='correct';
  return h.page('l-guide l-outcome',header('یه دور تمرینی')+`<main class="l-main"><h2>${ok?'درست انتخاب کردی!':'این بار درست نبود'}</h2><p>توی این بازی هم نشان می‌گیری، هم کد تخفیف و هم دیجی‌کوین!</p>${badges}</main><footer class="l-footer l-footer-pair">${button('صفحه اصلی',onb?'onb-finish':'guide-close')}${button('قبلی','learn-practice',true)}</footer>`);
 }
 if(phase==='intro'||phase==='question'){
  const first={...DEMO_FIRST,displayTitle:'ماگ سرامیکی'},second={...DEMO_SECOND,displayTitle:'هدفون بی‌سیم'};
  const top=`<header class="q-hdr q-hdr--game"><button class="q-iconbtn" data-act="back" aria-label="برگشت به راهنما">${I.back}</button><h1 class="q-hdr__t">یه دور تمرینی</h1>${soundControl(m.soundOn!==false)}</header>`;
  const decision=h.decide(phase==='question'?'on':'off',null,'',first.price,'learn');
  const main=h.refCard(first,true)+h.cmpCard(second,'hidden',0,false,decision);
  let page=h.page('q-game p-game l-practice l-coach-space',top+`<main class="q-game__main">${main}</main>`);
  if(phase==='intro')page=page.replace('<div class="q-page','<div inert class="q-page l-tour-active')+tourMarkup(m.learn?.tourStep||0,0);
  else page=page.replace('data-act="back"','disabled data-act="back"').replace('data-act="sound-toggle"','disabled data-act="sound-toggle"')+tourMarkup(2,0,true);
  return page;
 }
 const rules=[['اسم و قیمت کالای اول رو ببین','کالای اول، مرجع مقایسه‌ست. اسم و قیمتش رو بخون تا قیمت کالای بعدی رو باهاش مقایسه کنی.'],['اسم و عکس کالای دوم رو ببین','قیمت کالای دوم مخفیه. با کمک عکس و اسمش تخمین بزن چقدر می‌ارزه.'],['حالا حدس بزن که گرون‌تره یا ارزون‌تر!','یکی از دو دکمه رو بزن. هر جواب درست، یه امتیاز به همین دست اضافه می‌کنه.'],['جواب‌های درستت جایزه دارن','در چک‌پوینت‌ها نشان می‌گیری و جایزهٔ همون مرحله بهت تعلق می‌گیره. آستانهٔ هر نشان رو پایین می‌بینی.']];
 const steps=rules.map(([title,copy],i)=>{const open=(m.learn?.openRules||[]).includes(i);return `<li class="l-rule${open?' is-open':''}"><button data-act="learn-rule" data-step="rule-${i}" data-rule="${i}" aria-expanded="${open}" aria-controls="learning-rule-${i}"><b>${fa(i+1)}</b><span class="l-rule-title">${title}</span><svg viewBox="0 0 16 16" aria-hidden="true"><path d="m3 5 5 6 5-6Z" fill="currentColor"/></svg></button><p id="learning-rule-${i}"${open?'':' hidden'}>${copy}</p></li>`;}).join('');
 return h.page('l-guide l-overview',header('چطور بازی کنیم؟')+`<main class="l-main"><ol class="l-steps">${steps}</ol>${badges}</main><footer class="l-footer">${m.error?`<p role="alert">${esc(m.error)}</p>`:''}${button('یه دور تمرینی و مجانی بزنیم!','learn-practice')}</footer>`);
}
