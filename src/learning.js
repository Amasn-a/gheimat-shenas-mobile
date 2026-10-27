// Practice is local and uses invented products. It never starts a run, spends a
// chance, charges coins or awards a badge. Only the final explicit play action does.
import { tourMarkup, practiceCoachMarkup } from './learning-spotlight.js';
import { soundControl } from './feedback.mjs';
import { I } from './icons.js';
import { fa, money, esc } from './fmt.js';
import { DEMO_FIRST, DEMO_SECOND, DEMO_SECOND_PRICE } from './demo.js';

export function renderLearning(m,h) {
  const l=m.learn || {phase:'overview'}, phase=l.phase, c=m.config;
  const seconds=Math.round(c.inputMs/1000), from=m.from, onb=from==='onb';
  const button=(label,act,secondary=false,icon='')=>`<button class="l-btn${secondary?' l-btn--secondary':''}${icon===I.play?' l-btn--play':''}" data-act="${act}"${m.busy?' disabled aria-disabled="true"':''}>${icon}<span>${label}</span></button>`;
  const exit=onb?'onb-skip':'guide-close';
  const save=m.error?`<p class="l-error" role="alert">${esc(m.error)}</p>`:m.busy?'<p class="l-save" role="status">در حال ثبت…</p>':'';
  const header=(text,back='learn-back')=>`<header class="l-header"><button data-act="${back}" aria-label="${phase==='overview'?'بستن راهنما':'بازگشت به راهنما'}"${m.busy?' disabled':''}>${I.back}</button><h1 tabindex="-1">${text}</h1>${soundControl(m.soundOn!==false)}</header>`;
  const finish=button(m.busy?'در حال آماده‌سازی…':m.hasActive?'ادامهٔ دست من':m.hasChances===false?'برگشت به خانه':'بریم بازی کنیم',onb?'onb-start':'guide-play',false,I.play);
  if(['intro','question','feedback'].includes(phase)) {
    const feedback=phase==='feedback', correct=l.outcome==='correct';
    const top=`<header class="q-hdr q-hdr--game"><button class="q-iconbtn" data-act="learn-back" aria-label="بازگشت به راهنما">${I.back}</button><h1 class="q-hdr__t">تمرین رایگان</h1><span class="l-demo-pill">آموزشی</span>${soundControl(m.soundOn!==false)}</header>`;
    const progress=`<div class="l-progress"><span>${phase==='intro'?'قدم‌به‌قدم با هم یاد می‌گیریم':phase==='question'?'حالا خودت انتخاب کن':'جواب رو بررسی کن'}</span><small>${phase==='intro'?'زمان هنوز شروع نشده':'تمرین رایگان'}</small></div>`;
    const tm=feedback?h.timer({mode:'verdict',kind:correct?'ok':l.outcome==='timeout'?'time':'no',title:correct?'درست گفتی!':l.outcome==='timeout'?'زمان تمرین تموم شد':'این بار گرون‌تر بود',sub:'هدفون از ماگ گرون‌تره'}):phase==='question'?h.timer({mode:m.remaining<=3000?'low':'run',t:fa(Math.ceil(m.remaining/1000)),p:Math.max(0,m.remaining/c.inputMs).toFixed(3)}):h.timer({mode:'idle'});
    const first={...DEMO_FIRST,displayTitle:'ماگ سرامیکی'},second={...DEMO_SECOND,displayTitle:'هدفون بی‌سیم'};
    const decision=h.decide(phase==='intro'||feedback?'off':'on',null,'',first.price,'learn');
    const main=h.refCard(first,true)+h.cmpCard(second,feedback?(correct?'ok':l.outcome==='timeout'?'time':'no'):'hidden',feedback?DEMO_SECOND_PRICE:0,false,decision);
    let page=h.game(top,progress,tm,main,'','').replace('q-game p-game',`q-game p-game l-practice l-coach-space`);
    if(phase==='intro') page=page.replace('<div class="q-page','<div inert class="q-page l-tour-active')+tourMarkup(l.tourStep||0,seconds);
    if(phase!=='intro')page+=practiceCoachMarkup(phase,seconds);
    return page;
  }
  let body='',foot='',title='چطور بازی کنیم؟';
  if(phase==='rewards') {
    title='نشان‌ها و جایزه‌ها';
    body=`<div class="l-section-intro"><span>هر حدس، یک قدم جلوتر</span><h2>برای نشان بعدی بازی کن</h2><p>تعداد جواب‌های درست در یک دست، نشان تو رو مشخص می‌کنه.</p></div><ol class="l-badge-map">${c.checkpoints.map((cp,i)=>`<li><img src="${h.BADGE_SRC(h.badgeId(cp,i))}" alt="نشان ${esc(cp.title)}"><b>${fa(cp.requiredCorrect)} جواب درست</b><span>${cp.rewardAmount>0?`${h.COIN}${fa(cp.rewardAmount)} دیجی‌کوین`:'نشان افتخاری'}</span></li>`).join('')}</ol><p class="l-note">جایزهٔ هر نشان هنگام رسیدن به آن ثبت می‌شه. رکورد و نشان‌هات در بخش «نشان‌ها» می‌مونن.</p>`;
    foot=button('یه دور تمرینی','learn-practice',false,I.play)+button('برگشت به راهنما','learn-overview',true);
  } else if(phase==='revive') {
    title='بعد از باخت چی می‌شه؟';
    const r=c.continueRule;
    body=`<div class="l-section-intro"><span class="l-rule-icon">${I.undo}</span><h2>انتخاب با خودته</h2><p>جواب اشتباه یا تمام شدن زمان، این دست رو متوقف می‌کنه.</p></div><section class="l-option l-option--free"><span>${I.check}</span><div><small>انتخاب اصلی · بدون هزینه</small><h3>نتیجه‌ام رو ببینم</h3><p>امتیازت ثبت می‌شه؛ می‌تونی امتیاز این دستت رو به اشتراک بذاری یا با شانس روزانه یک دست تازه شروع کنی.</p></div></section>${r.enabled&&r.cap>0?`<section class="l-option"><span>${h.COIN}</span><div><small>اختیاری · ${fa(r.cost)} دیجی‌کوین</small><h3>یه جون اضافه بگیرم</h3><p>همین دست رو با حفظ امتیاز ادامه می‌دی. حداکثر ${fa(r.cap)} بار در هر دست؛ فقط با انتخاب خودت سکه خرج می‌شه.</p></div></section>`:''}<p class="l-note">این صفحه فقط توضیحه؛ اینجا هیچ سکه‌ای خرج نمی‌شه.</p>`;
    foot=button('متوجه شدم','learn-overview',false,I.check)+button('یه دور تمرینی','learn-practice',true,I.play);
  } else if(phase==='done') {
    title='تمرین تموم شد';
    body=`<section class="l-done"><span class="l-done-check">${I.check}</span><img src="assets/brand-smile-v2.png" alt=""><h2>حالا نوبت خودته!</h2><p>قیمت دو کالا رو مقایسه کن، به زمان توجه کن و رکوردت رو بساز.</p><div class="l-takeaways"><span>۲ کالا</span><span>${fa(seconds)} ثانیه</span><span>۲ انتخاب</span></div></section><p class="l-note">نگران نباش، تمرین رایگان بود!</p>`;
    foot=finish+button('دوباره تمرین کنم','learn-practice',true,I.refresh);
  } else {
    body=`<section class="l-hero"><div><span>فوت‌وفن بازی، در یک دقیقه</span><h2>دو کالا،<br>یه حدس درست!</h2><p>شمّ اقتصادی‌ات رو امتحان کن.</p></div><img src="assets/brand-smile-v2.png" alt=""></section><ol class="l-steps"><li><b>۱</b><div><h3>قیمت اولی رو ببین</h3><p>عکس و قیمت کالای اول، مرجع توئه.</p></div>${I.image}</li><li><b>۲</b><div><h3>برای دومی حدس بزن</h3><p>نسبت به اولی، گرون‌تره یا ارزون‌تر؟</p></div>${I.up}</li><li><b>۳</b><div><h3>${fa(seconds)} ثانیه وقت داری</h3><p>از لحظهٔ نمایش کالای دوم؛ سریع انتخاب کن.</p></div>${I.clock}</li></ol><div class="l-shortcuts"><button data-act="learn-rewards">${I.gift}<span>نشان‌ها و جایزه‌ها</span>${I.fwd}</button><button data-act="learn-revive">${I.undo}<span>بعد از باخت چی؟</span>${I.fwd}</button></div>`;
    foot=`<p class="l-free-hint">بدون کسر شانس و دیجی‌کوین</p>${button('یه دور تمرینی','learn-practice',false,I.play)}${button(onb?'فعلاً رد کن':'فهمیدم، برگردیم',exit,true)}`;
  }
  return h.page('l-guide',header(title,phase==='overview'?exit:'learn-overview')+`<main class="l-main">${body}</main><footer class="l-footer">${save}${foot}</footer>`);
}
