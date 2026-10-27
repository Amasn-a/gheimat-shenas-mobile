import {productPriceMarkup} from './product-pricing.mjs';
import {soundControl} from './feedback.mjs';
import {I} from './icons.js';
import {fa,esc} from './fmt.js';
const svg=d=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const trophy=svg('<path d="M7 3h10v6c0 5-2 7-5 7s-5-2-5-7V3ZM7 5H3v4c0 3 2 5 5 5m9-9h4v4c0 3-2 5-5 5M12 17v4m-4 0h8"/>');
const chart=svg('<path d="M4 20V4m0 16h16M8 16v-4m5 4V8m5 8V5"/>');
const bag=svg('<path d="M5 7h14l1 14H4L5 7Zm3 1V6a4 4 0 0 1 8 0v2"/>');
const flame=svg('<path d="M13 3c1 6 6 7 6 12a7 7 0 0 1-14 0c0-3 2-5 4-7-1 4 1 5 2 4 2-2 2-5 2-9Z"/>');
const empty=(title,text)=>`<div class="m-empty"><h2>${title}</h2><p>${text}</p><button data-act="nav-game">بریم بازی کنیم ${I.fwd}</button></div>`;
const countOf=(b,c)=>(Array.isArray(b.badgeCounts)?b.badgeCounts.find(x=>x.checkpointId===c.checkpointId)?.count:b.badgeCounts?.[c.checkpointId])||0;
export function renderMobileHome(v,m,h){
 const b=m.boot,cps=b.config.checkpoints,daily=b.dailyReward,history=b.rewardHistory||{items:[],totalCoins:0};
 const tab=['game','badges','rewards','products'].includes(m.appTab)?m.appTab:'game';
 const navItems=[['game','بازی',I.home],['rewards','جوایز',I.gift],['badges','نشان‌ها',trophy],...(m.productsOn?[['products','کالاها',bag]]:[])];
 const titles={game:'قیمت‌شناس',rewards:'جایزه‌های تو',badges:'نشان‌های تو',products:'کشف تخفیف‌ها'};
 const header=`<header class="m-header"><div class="m-brand"><button class="m-app-back q-iconbtn" data-act="${tab==='game'?'exit-app':'tab-home'}" aria-label="${tab==='game'?'بازگشت به دیجی‌کوین':'برگشت به خانه'}">${I.back}</button><b>${titles[tab]}</b></div><div class="m-head-actions"><button class="m-help" data-act="guide" aria-label="راهنمای بازی">${I.help}</button>${soundControl(m.soundOn!==false)}</div></header>`;
 const nav=`<nav class="m-bottom" aria-label="ناوبری اصلی بازی">${navItems.map(([key,label,icon])=>`<button data-act="nav-${key}" data-step="tab"${tab===key?' aria-current="page"':''}><span class="m-nav-icon">${icon}</span><span>${label}</span></button>`).join('')}</nav>`;
 const quick=`<div class="m-quick" aria-label="دسترسی سریع"><button data-act="nav-badges" data-step="quick"><span class="m-quick-icon">${trophy}</span><span><b>${fa(b.record)} جواب</b><small>رکوردت</small></span></button><button data-act="nav-streak"><span class="m-quick-icon">${flame}</span><span><b>${fa(daily?.streakDays||0)} روز</b><small>حضور روزانه</small></span></button><button data-act="nav-rewards" data-step="quick"><span class="m-quick-icon">${I.gift}</span><span><b>جایزه‌ها</b><small>دریافت‌های من</small></span></button></div>`;
 let content='';
 if(tab==='game')content=`<section class="m-play" aria-labelledby="mobile-title"><div class="m-play-copy"><h1 id="mobile-title" tabindex="-1">گرون‌تره<br>یا <span>ارزون‌تر؟</span></h1></div><div class="m-stage" aria-hidden="true"><div class="m-orbit"></div><span class="m-float m-float-up">${I.up} گرون‌تره</span><img class="m-mascot" src="assets/brand-smile-v2.png" alt=""><span class="m-float m-float-down">${I.down} ارزون‌تره</span></div><div class="m-play-foot"><p class="m-play-line">حدس بزن، رکورد بزن، دیجی‌کوین بگیر!</p>${h.homeSheet(v,m)}</div></section>`;
 if(tab==='rewards'){
  const rows=history.items.map(r=>`<li><span class="m-reward-coin">${h.COIN}</span><div><b>${esc(r.title)}</b><time>${new Intl.DateTimeFormat('fa-IR',{timeZone:'Asia/Tehran',day:'numeric',month:'long'}).format(new Date(r.receivedAt))}</time></div><span class="m-reward-value"><b>+${fa(r.amount)}</b></span></li>`).join('');
  content=`<section class="m-panel m-prizes"><button class="m-daily-link" data-act="nav-streak">${flame}<span>${fa(daily?.streakDays||0)} روز حضور در بازی</span>${I.fwd}</button><div class="m-list-heading"><h2>تاریخچهٔ دریافت‌ها</h2><span>${fa(history.items.length)} جایزه</span></div>${rows?`<ol class="m-reward-list">${rows}</ol>`:empty('هنوز جایزه‌ای ثبت نشده','جواب‌های درستت جایزه دارن.')}</section>`;
 }
 if(tab==='badges')content=`<section class="m-panel m-badges"><div class="m-personal" role="status"><span>${chart}</span><div><small>بهترین رکوردت</small><b>${fa(b.record)} <small>جواب درست</small></b></div></div><ol class="m-badge-grid">${cps.map((c,i)=>{const earned=b.record>=c.requiredCorrect,count=countOf(b,c);return `<li class="${earned?'is-earned':'is-locked'}">${earned?'':`<span class="m-badge-lock" aria-label="هنوز نگرفتی">${I.lock}</span>`}<img src="${h.BADGE_SRC(h.badgeId(c,i))}" alt="نشان ${esc(c.title)}"><small class="m-badge-threshold">${fa(c.requiredCorrect)} جواب درست</small>${earned?`<span class="m-badge-times" dir="rtl">${fa(count)} بار دریافت</span>`:''}</li>`;}).join('')}</ol></section>`;
 if(tab==='products'){
  const items=h.dealsOf(m.products),state=m.productsRetry?'error':m.historyState;
  const tiles=items.map(p=>`<li><button data-act="open-product" data-link="${esc(p.link)}"><span class="m-product-art"><img src="${esc(p.imageUrl)}" alt="" loading="lazy"></span><b class="m-product-title">${esc(p.displayTitle)}</b>${productPriceMarkup(p)}<span class="m-product-go">دیدن کالا ${I.fwd}</span></button></li>`).join('');
  content=`<section class="m-panel m-products">${state==='loading'?'<div class="m-empty" role="status"><span class="q-spin"></span><p>کالاها در راهن…</p></div>':state==='error'?`<div class="m-empty"><p>کالاها بارگذاری نشدن.</p><button data-act="deals-retry"${m.productsRetry?' disabled aria-busy="true"':''}>${m.productsRetry?'<span class="q-spin"></span>':'دوباره امتحان کن'}</button></div>`:tiles?`<ol class="m-product-grid">${tiles}</ol>`:empty('هنوز کالایی اینجا نیست','بازی کن تا کالاهایی که دیدی اینجا جمع بشن.')}</section>`;
 }
 return h.page('h-home m-app',`<div class="m-shell">${header}${tab==='game'?quick:''}<main class="m-main" data-mobile-tab="${tab}">${content}</main>${nav}</div>`,(m.modal||'')+h.toastHTML(m.toast));
}
