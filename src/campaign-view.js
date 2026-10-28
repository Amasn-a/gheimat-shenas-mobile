import { productPriceMarkup } from './product-pricing.mjs?v=e3889d140bf3';
import { I } from './icons.js?v=e3889d140bf3';
import { esc, fa } from './fmt.js?v=e3889d140bf3';
import { campaignTime, campaignDiscounts } from './marketing-campaign.js?v=e3889d140bf3';
const digitalArt = '<svg viewBox="0 0 44 44" fill="none" aria-hidden="true"><path d="M11 24v-5a11 11 0 0 1 22 0v5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><rect x="7" y="21" width="9" height="15" rx="4" fill="#fffaf1" stroke="currentColor" stroke-width="2"/><rect x="28" y="21" width="9" height="15" rx="4" fill="#fffaf1" stroke="currentColor" stroke-width="2"/><path d="m24 9-4 8h5l-4 8" stroke="#b996e2" stroke-width="2" stroke-linejoin="round"/></svg>';
export function campaignClock(c, now) {
  const t=campaignTime(c.endsAt,now);
  return `<span class="m-campaign-clock${t.urgent?' is-urgent':''}" data-campaign-clock="${esc(c.endsAt)}">${I.clock}<span>تا پایان</span><b dir="auto">${t.text}</b></span>`;
}
export function campaignCard(c, products, now) {
  if (!c) return '';
  const offers=c.type==='offers', items=campaignDiscounts(products,now);
  const art=offers?`<span class="m-campaign-products">${items.slice(0,2).map(p=>`<img src="${esc(p.imageUrl)}" alt="" decoding="async">`).join('')}<i>٪</i></span>`:digitalArt;
  const cta=offers?`دیدن ${fa(items.length)} کالا`:'ورود به چالش';
  return `<button class="m-campaign m-campaign--${c.type}" data-act="campaign-open" data-campaign-id="${esc(c.id)}" aria-haspopup="dialog" aria-label="${esc(c.title)}، ${cta}"><span class="m-campaign-art" aria-hidden="true">${art}</span><span class="m-campaign-copy"><small>${offers?'فرصت خرید محدود':'چالش دسته‌بندی'}${c.demo?' · نمونه':''}</small><b>${esc(c.title)}</b>${campaignClock(c,now)}</span><span class="m-campaign-cta">${cta}${I.fwd}</span></button>`;
}
export function campaignDialog(c, m, now) {
  if (!c) return '';
  const offers=c.type==='offers', items=campaignDiscounts(m.products,now);
  const running=m.homeView==='G01.ACTIVE_RUN', canStart=m.homeView==='G01.READY'&&!m.offline;
  const tiles=items.map(p=>`<li><button data-act="open-product" data-link="${esc(p.link)}" aria-label="مشاهدهٔ ${esc(p.displayTitle)}"><span class="m-product-art"><img src="${esc(p.imageUrl)}" alt="" loading="lazy"><b>${fa(p.deal.discountPercent)}٪</b></span><b class="m-product-title">${esc(p.displayTitle)}</b>${productPriceMarkup(p)}<span class="m-product-go">دیدن کالا ${I.fwd}</span></button></li>`).join('');
  const body=offers?`<p>${fa(items.length)} کالایی که توی این دست دیدی، تخفیف دارن.</p><ol class="m-product-grid">${tiles}</ol>`:`<span class="m-campaign-detail-art" aria-hidden="true">${digitalArt}</span><h3>توی دیجیتال، قیمت‌شناس شو!</h3><p>این بار فقط قیمت ${esc(c.categoryLabel)} رو مقایسه کن. همون بازی، با یک دستهٔ مشخص.</p><div class="m-campaign-rules"><span>${I.clock}۱۰ ثانیه برای هر حدس</span><span>${I.play}یک شانس معمول بازی</span></div><p class="m-campaign-entry-note">این مهلت برای ورود به چالشه؛ دستت بعد از پایان مهلت هم ادامه پیدا می‌کنه.</p>${running?'<p class="m-campaign-warning">اول دست فعلی رو تموم کن؛ بعد وارد چالش شو.</p>':!canStart?`<p class="m-campaign-warning">${m.offline?'برای ورود، اتصال اینترنت رو بررسی کن.':'الان امکان شروع دست تازه نیست؛ وضعیت شروع بازی رو در خانه ببین.'}</p>`:''}`;
  const action=offers?'':`<footer><button class="q-btn q-btn--primary" data-act="${running?'campaign-resume':'campaign-play'}" data-campaign-id="${esc(c.id)}"${!canStart&&!running?' disabled':''}>${running?'ادامهٔ دست فعلی':'شروع چالش'} ${I.play}</button></footer>`;
  return `<div class="q-scrim q-modal"><section class="q-sheet m-campaign-sheet m-campaign-sheet--${c.type}" role="dialog" aria-modal="true" aria-labelledby="campaign-title"><header><button class="q-iconbtn" data-act="campaign-close" aria-label="بستن کمپین">${I.x}</button><div><small>${offers?'تخفیف کالاهای دیده‌شده':'چالش زمان‌دار'}${c.demo?' · نمونه':''}</small><h2 id="campaign-title">${esc(c.title)}</h2></div></header><div class="m-campaign-detail-time">${campaignClock(c,now)}</div><div class="m-campaign-body">${body}</div>${c.demo?'<small class="m-campaign-demo-note">این کمپین نمونهٔ طراحی است؛ قیمت‌ها و تخفیف‌ها آزمایشی‌اند.</small>':''}${action}</section></div>`;
}
