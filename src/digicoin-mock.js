// Presentation-only host mock. It reads the prototype's balance, never changes
// game progress, quota, rewards, authentication or the real DigiCoin account.
const app=document.getElementById('mock-app');
const isStore=document.body.dataset.mockPage==='store';
const asset=name=>`../assets/${name}`;
const gameURL='../?entry=digicoin';
const nf=new Intl.NumberFormat('fa-IR');
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icon=(name,extra='')=>{
 const paths={
  back:'<path d="m9 5 7 7-7 7"/>',left:'<path d="m15 5-7 7 7 7"/>',
  home:'<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z"/>',
  gift:'<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M5 12v9h14v-9M12 8v13M12 8H8a3 3 0 1 1 3-3l1 3Zm0 0h4a3 3 0 1 0-3-3l-1 3Z"/>',
  history:'<path d="M3 11a9 9 0 1 1 2 7M3 5v6h6M12 7v5l3 2"/>',
  bag:'<path d="M5 7h14l2 14H3L5 7ZM8 8V6a4 4 0 0 1 8 0v2"/>',
  grid:'<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>',
  user:'<circle cx="12" cy="7" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',
  search:'<circle cx="10" cy="10" r="7"/><path d="m15 15 6 6"/>',
  close:'<path d="m6 6 12 12M6 18 18 6"/>',
  help:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 4 2c-1 .6-1.5 1-1.5 2.5M12 17h.01"/>',
  game:'<path d="M7 7h10c3 0 6 12 3 13-2 1-4-4-6-4h-4c-2 0-4 5-6 4C1 19 4 7 7 7ZM6 11h4M8 9v4M16 11h.01M18 13h.01"/>',
  plus:'<path d="m12 2 3 6 7 4-7 4-3 6-3-6-7-4 7-4 3-6Z"/>',
  gold:'<path d="M6 7h12l4 13H2L6 7ZM8 7l2-4h4l2 4M8 12h8"/>',
  truck:'<path d="M2 5h12v12H2V5Zm12 4h4l4 5v3h-8M5 17a2 2 0 1 0 4 0M16 17a2 2 0 1 0 4 0"/>',
  tag:'<path d="M3 3h8l10 10-8 8L3 11V3Z"/><circle cx="7.5" cy="7.5" r="1"/>',
  star:'<path d="m12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1Z"/>',
  bell:'<path d="M5 17V9a7 7 0 0 1 14 0v8l2 2H3l2-2ZM9 21h6"/>'
 };
 return `<svg class="m-icon ${extra}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]||paths.gift}</svg>`;
};
function state(){try{return JSON.parse(localStorage.getItem('pe.home-redesign.state.v1'))||{};}catch{return {};}}
function balance(){const n=state().wallet?.balance;return Number.isFinite(n)&&n>=0?Math.floor(n):0;}
const coin=cls=>`<img class="m-coin ${cls||''}" src="${asset('digicoin.svg')}" alt="">`;
const head=()=>`<header class="m-header">${isStore?`<button class="m-icon-button" data-info="profile" aria-label="دیجی‌کالای من">${icon('user')}</button>`:`<a class="m-icon-button" href="../digikala/" aria-label="بازگشت به دیجی‌کالا">${icon('back')}</a>`}${isStore?`<img class="m-wordmark" src="${asset('digikala-logo.svg')}" alt="دیجی‌کالا">`:`<a class="m-coin-brand" href="./" aria-label="خانه دیجی‌کوین">${coin()}<strong>دیجی‌کوین</strong></a>`}<button class="m-icon-button" data-info="${isStore?'notifications':'about'}" aria-label="${isStore?'اعلان‌ها':'درباره این پیش‌نمایش'}">${icon(isStore?'bell':'help')}</button></header>`;
const nav=()=>`<nav class="m-nav" aria-label="ناوبری دیجی‌کالا"><a href="../digikala/" ${isStore?'aria-current="page"':''}>${icon('home')}<span>خانه</span></a><a href="../digikala/#categories">${icon('grid')}<span>دسته‌بندی</span></a><a class="m-nav-coins" href="../digicoin/" ${!isStore?'aria-current="page"':''}>${coin()}<span>دیجی‌کوین</span></a><button data-info="basket">${icon('bag')}<span>سبد خرید</span></button><button data-info="profile">${icon('user')}<span>دیجی‌کالای من</span></button></nav>`;
const footer=`<p class="m-demo-note">پیش‌نمایش طراحی · اطلاعات و پیشنهادها نمایشی‌اند.</p>`;
const banner=()=>`<a class="m-game-banner" href="${gameURL}" aria-label="شروع بازی قیمت‌شناس"><div class="m-banner-copy"><span class="m-eyebrow"><span></span>بازی جدید دیجی‌کوین</span><h2>قیمت‌شناس</h2><p>گرون‌تره یا ارزون‌تر؟<br>حدس بزن، جایزه بگیر!</p><span class="m-banner-cta">بزن بریم! ${icon('left')}</span></div><img class="m-banner-art" src="${asset('gheimat-hub-art.webp')}" alt="" fetchpriority="high"><span class="m-banner-orbit" aria-hidden="true"></span></a>`;
function hub(){return `${head()}<main class="m-main">
 <section class="m-wallet" aria-labelledby="wallet-title"><div><p id="wallet-title">دیجی‌کوین‌های تو</p><div class="m-wallet-number"><strong data-balance>${nf.format(balance())}</strong>${coin()}<span>دیجی‌کوین</span></div><span class="m-wallet-caption">یه قدم نزدیک‌تر به جایزه‌های بعدی</span></div><div class="m-wallet-art" aria-hidden="true">${coin()}${coin()}${coin()}</div><button class="m-wallet-history" data-info="history">تاریخچه ${icon('left')}</button></section>
 <div class="m-quick-actions"><a href="#earn">${icon('plus')}<span>کوین بگیر</span></a><a href="#spend">${icon('gift')}<span>جایزه‌ها رو ببین</span></a></div>
 <section class="m-play-section" aria-labelledby="play-title"><div class="m-section-head"><h1 id="play-title">بازی کن، جایزه بگیر</h1><span class="m-mini-label">یه چالش تازه</span></div>${banner()}<p class="m-banner-foot">هر دست، فقط جایزهٔ بالاترین مرحله‌ای که بهش رسیدی.</p></section>
 <section id="earn" class="m-section" aria-labelledby="earn-title"><div class="m-section-head"><h2 id="earn-title">راه‌های جمع کردن دیجی‌کوین</h2></div><div class="m-earn-grid"><a class="m-earn-card m-earn-game" href="${gameURL}"><span class="m-tile-icon">${icon('game')}</span><strong>با حدس‌های درست</strong><span>قیمت‌شناس رو امتحان کن</span>${icon('left','m-card-arrow')}</a><button class="m-earn-card m-earn-shop" data-info="shopping"><span class="m-tile-icon">${icon('bag')}</span><strong>با خریدهای بعدی</strong><span>پیشنهادهای مخصوص تو</span>${icon('left','m-card-arrow')}</button></div></section>
 <section id="spend" class="m-section" aria-labelledby="spend-title"><div class="m-section-head"><h2 id="spend-title">کوین‌هات رو به جایزه تبدیل کن</h2></div><div class="m-offer-grid"><button class="m-offer-card" data-info="plus"><div class="m-offer-art m-offer-plus">${icon('plus')}<span>plus</span></div><strong>تخفیف عضویت پلاس</strong><span>برای خریدهای همیشگی‌ات</span></button><button class="m-offer-card" data-info="gift"><div class="m-offer-art m-offer-gift">${icon('gift')}${coin()}</div><strong>پیشنهادهای دیجی‌کوینی</strong><span>جایزهٔ بعدی رو پیدا کن</span></button></div></section>
 <a class="m-game-shortcut" href="${gameURL}"><span>${icon('game')}آماده‌ای قیمت‌شناس بشی؟</span>${icon('left')}</a>${footer}</main>${nav()}`;}
function store(){return `${head()}<main class="m-main m-store-main">
 <button class="m-search" data-info="search">${icon('search')}<span>جستجو در <strong>دیجی‌کالا</strong></span></button>
 <section id="categories" class="m-services" aria-label="سرویس‌های دیجی‌کالا"><a href="../digicoin/" class="m-service m-service-coin"><span>${coin()}</span><strong>دیجی‌کوین</strong></a><button class="m-service" data-info="plus"><span class="m-service-plus">${icon('plus')}</span><strong>پلاس</strong></button><button class="m-service" data-info="gold"><span class="m-service-gold">${icon('gold')}</span><strong>طلا و نقره</strong></button><button class="m-service" data-info="shopping"><span class="m-service-shop">${icon('bag')}</span><strong>سوپرمارکت</strong></button></section>
 <a class="m-discovery-banner" href="../digicoin/"><div><span class="m-discovery-kicker">دنیای دیجی‌کوین</span><h1>از یه بازی شروع کن،<br>به جایزه برس!</h1><p>قیمت‌شناس منتظر حدس‌های توئه.</p><span class="m-discovery-cta">بریم دیجی‌کوین ${icon('left')}</span></div><div class="m-discovery-art" aria-hidden="true">${coin()}${coin()}${icon('game')}</div></a>
 <section class="m-store-benefits" aria-label="خدمات"><div>${icon('truck')}<span>ارسال سریع</span></div><div>${icon('tag')}<span>پیشنهادهای تازه</span></div><div>${icon('star')}<span>انتخاب‌های محبوب</span></div></section>
 <section class="m-section"><div class="m-section-head"><h2>یه سر به این پیشنهادها بزن</h2><span class="m-mini-label">منتخب امروز</span></div><div id="mock-products" class="m-products" aria-live="polite"><p>در حال آماده کردن پیشنهادها…</p></div></section>
 <a class="m-store-entry" href="../digicoin/">${coin()}<div><strong>دیجی‌کوین‌هات اینجان</strong><span>بازی، جایزه و یه تجربهٔ تازه</span></div>${icon('left')}</a>${footer}</main>${nav()}`;}
app.innerHTML=`<div class="m-shell">${isStore?store():hub()}</div><dialog class="m-dialog" aria-labelledby="mock-dialog-title"><button class="m-icon-button m-dialog-close" aria-label="بستن">${icon('close')}</button><div id="mock-dialog-content"></div></dialog>`;
const dialog=document.querySelector('.m-dialog');
const content=document.getElementById('mock-dialog-content');
let returnFocus=null;
const infos={
 about:['یه پیش‌نمایش از مسیر ورود','این هاب برای نمایش جایگاه بازی قیمت‌شناس طراحی شده. به حساب واقعی دیجی‌کالا یا دیجی‌کوین وصل نیست؛ موجودیِ نمایش‌داده‌شده از همین نسخهٔ آزمایشی بازی میاد.'],
 history:['دیجی‌کوین‌های همین نسخه', 'موجودی فعلی تو در این مرورگر: '+nf.format(balance())+' دیجی‌کوین. جایزه‌های هر دست و کدهای نمایشی رو داخل بازی، در تب «جوایز» می‌بینی.'],
 shopping:['پیشنهادهای مخصوص خرید','این بخش نمونهٔ جایگاه پیشنهادهای خرید در هاب دیجی‌کوینه. پیشنهاد خرید و دریافت دیجی‌کوین واقعی در این پیش‌نمایش فعال نیست.'],
 plus:['پیشنهاد پلاس','نمونهٔ جایگاه تخفیف عضویت پلاس. می‌تونی داخل قیمت‌شناس بازی کنی و کد نمایشی این جایزه رو در تب «جوایز» ببینی.'],
 gift:['یه جایزه برای حدس‌های تو','توی قیمت‌شناس، جایزهٔ بالاترین مرحلهٔ هر دست رو می‌گیری. اینجا همهٔ جایزه‌ها و کدها نمایشی‌اند.'],
 search:['این مسیر برای بازیه','برای امتحان تجربهٔ کامل، از دیجی‌کوین وارد قیمت‌شناس شو. جستجوی کالا در این ماک فعال نیست.'],
 gold:['طلا و نقره دیجیتال','این آیکون برای کامل شدن ماک خانهٔ دیجی‌کالا قرار گرفته. هیچ خرید یا معامله‌ای در این صفحه انجام نمی‌شه.'],
 basket:['سبد خرید','این پیش‌نمایش خرید یا پرداخت نداره؛ مسیر ورود به بازی از دیجی‌کوین رو می‌تونی کامل امتحان کنی.'],
 profile:['دیجی‌کالای من','ورود به حساب واقعی لازم نیست. پیشرفت بازی فقط در همین مرورگر ذخیره می‌شه.'],
 notifications:['همه‌چیز آمادهٔ بازیه','از بخش دیجی‌کوین وارد قیمت‌شناس شو و حدس اولت رو بزن.']
};
document.addEventListener('click',e=>{
 const trigger=e.target.closest('[data-info]');
 if(trigger){const [title,copy]=infos[trigger.dataset.info]||infos.about;const text=trigger.dataset.info==='history'?'موجودی فعلی تو در این مرورگر: '+nf.format(balance())+' دیجی‌کوین. جایزه‌های هر دست و کدهای نمایشی رو داخل بازی، در تب «جوایز» می‌بینی.':copy;returnFocus=trigger;content.innerHTML=`<span class="m-dialog-symbol">${coin()}</span><h2 id="mock-dialog-title">${esc(title)}</h2><p>${esc(text)}</p><a class="m-dialog-cta" href="${isStore?'../digicoin/':gameURL}">${isStore?'بریم دیجی‌کوین':'بریم قیمت‌شناس'} ${icon('left')}</a>`;dialog.showModal();}
});
document.querySelector('.m-dialog-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();});
dialog.addEventListener('close',()=>returnFocus?.focus());
window.addEventListener('pageshow',()=>{document.querySelectorAll('[data-balance]').forEach(el=>el.textContent=nf.format(balance()));});
window.addEventListener('storage',e=>{if(e.key==='pe.home-redesign.state.v1')document.querySelectorAll('[data-balance]').forEach(el=>el.textContent=nf.format(balance()));});
if(isStore){
 try{
  const response=await fetch('../play/catalog.json');if(!response.ok)throw Error('catalog');
  const rows=await response.json();
  const picks=[rows.find(r=>/هدفون/.test(r[2])),rows.find(r=>/کفش/.test(r[2]))].filter(Boolean);
  document.getElementById('mock-products').innerHTML=picks.map(r=>`<button class="m-product" data-info="shopping"><div class="m-product-image"><img src="${esc(r[3])}" alt="${esc(r[2])}" loading="lazy"></div><h3>${esc(r[2])}</h3><div class="m-product-price"><strong>${nf.format(r[4])}</strong><span>تومان</span></div></button>`).join('');
 }catch{document.getElementById('mock-products').innerHTML='<a class="m-products-fallback" href="../digicoin/">پیشنهاد تازه‌مون: یه دست قیمت‌شناس!</a>';}
}
