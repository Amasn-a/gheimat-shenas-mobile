import { GAME_URL } from './share-payload.mjs';
import { renderStreakSheet } from './streak-view.js';
import { productPriceMarkup } from './product-pricing.mjs';
import { soundControl } from './feedback.mjs';
import { entryArt, loadingDots } from './entry-art.js';
import { renderLearning } from './learning.js';
import { renderMobileHome } from './mobile-home.js';
// Screen markup of the redesign of 2026-10-21 (white base, Digikala red actions, badge family). Views are pure functions
// of the view model: they never read the network or the clock. All text from data goes through esc()/title().
// Direction rules (§2): back/close sit at the physical right (first in RTL DOM order) and point right. Inside a button the
// icon is written before the label, so it sits at the label's right; the play triangle is mirrored to point at the label (owner 2026-10-25).
import { I } from './icons.js';
import { fa, money, esc, title } from './fmt.js';

const L = ' disabled aria-disabled="true"';
const ICO = (k, s = 20) => I[k].replace('width="24" height="24"', `width="${s}" height="${s}"`);
const SPIN = '<span class="q-spin" aria-hidden="true"></span>';
/** Official DigiCoin asset downloaded from Digikala's own static asset endpoint. */
export const COIN = '<img class="q-coin" src="assets/digicoin-game.svg" width="24" height="23" alt="" aria-hidden="true">';
export const TAG = '<img class="q-logomark" src="assets/game-logo.webp" width="40" height="56" alt="" aria-hidden="true">';
// ?v=3: the badges-v3 artwork (title inside the art) reuses the old file names, so a cached old badge is never shown
export const BADGE_SRC = id => `assets/badges/${encodeURIComponent(id)}.webp?v=3`;
export const BADGES = ['badge_5', 'badge_10', 'badge_15', 'badge_20'];
/** A checkpoint's badge image; an unknown id (a checkpoint added later in A02) gets the badge of its position. */
export const badgeId = (c, i) => BADGES.includes(c.badgeAssetId) ? c.badgeAssetId : BADGES[Math.min(BADGES.length - 1, Math.max(0, i))];
export const TIER = [['#087f73', '#edf9f5'], ['#3457d5', '#eff3ff'], ['#b96813', '#fff6e9'], ['#7950bf', '#f6f0ff']];   // badge manifest accents
/** Badge (owner 2026-10-25, badges-v3): the art carries its own title, so there is no frame, no white plate and no name
 *  caption; the title is the image's alt text. The square slot is reserved before the image loads; a failed image leaves a
 *  quiet tile with the title as text, so it is never an unexplained blank. */
export function badge(c, i, cls = '', threshold = false) {
  const [a, t] = TIER[Math.min(TIER.length - 1, Math.max(0, i))];
  return `<figure class="q-badgecard ${cls}" style="--badge-accent:${a};--badge-tint:${t}"><span class="q-badgecard__art" data-title="${esc(c.title)}"><img src="${BADGE_SRC(badgeId(c, i))}" width="512" height="512" alt="${esc(c.title)}" decoding="async"></span>` +
    (threshold ? `<figcaption><span>${fa(c.requiredCorrect)} جواب درست</span><span class="q-badgecard__reward${c.rewardAmount > 0 ? ' is-coin' : ''}">${c.rewardAmount > 0 ? `${fa(c.rewardAmount)} دیجی‌کوین جایزه` : 'فقط نشان'}</span></figcaption>` : '') + '</figure>';
}


export const Q_PROMPT = 'این کالا از کالای اول گرون‌تره یا ارزون‌تر؟';   // names both items, so the buttons cannot be misread
export const DIRW = { up: 'گرون‌تر', down: 'ارزون‌تر', eq: 'قیمت برابر' };
export const dirOf = d => d === 'higher' ? 'up' : d === 'lower' ? 'down' : 'eq';

// ---------------------------------------------------------------- primitives
export const keyOf = card => 'p' + hash(card.imageUrl || card.displayTitle || '');
function hash(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0).toString(36); }
const mk = (k, fx) => k ? ` data-m="${k}" data-mfx="${fx}"` : '';
export function img(card, keyed, onload) {
  const key = keyed ? mk('img:' + keyOf(card), 'box') : '';
  if (card.art) return `<span class="q-img"${key}>${card.art}</span>`;   // onboarding demo: drawn art, never a catalog product
  if (!card.imageUrl) return `<span class="q-img q-img--none"${key}></span>`;
  return `<span class="q-img"${key}><img src="${esc(card.imageUrl)}" alt="" decoding="async"${onload ? ` data-onload="${onload}"` : ''}></span>`;
}
/** Price with its unit; the number is isolated LTR so digits, separators and «تومان» are read in the right place. */
export const price = (n, cls = '', attrs = '') => `<p class="q-price${cls}"${attrs}><b dir="ltr">${money(n)}</b><small>تومان</small></p>`;
const ICON = icon => icon ? `<i class="q-btn__i${icon === I.play ? ' q-btn__i--play' : ''}">${icon}</i>` : '';
export const BTN = (cls, label, a = '', icon = '') => `<button class="q-btn ${cls}"${a}>${ICON(icon)}<span>${label}</span></button>`;
export const PRIMARY = (label, a, icon) => BTN('q-btn--primary', label, a, icon);
export const BUSY = (label, cls = 'q-btn--primary') => `<button class="q-btn ${cls}" disabled aria-disabled="true" aria-busy="true"><i class="q-btn__i">${SPIN}</i><span>${label}</span></button>`;
export const SECONDARY = (label, a, icon) => BTN('q-btn--secondary', label, a, icon);
export function status(kind, text, icon, spin, alert) {
  const lead = spin ? SPIN : icon ? ICO(icon, 18) : '';
  return `<p class="q-status${kind ? ' q-status--' + kind : ''}" role="${alert ? 'alert' : 'status'}">${lead ? `<span class="q-status__i" aria-hidden="true">${lead}</span>` : ''}<span>${text}</span></p>`;
}
export function toastHTML(t) {
  if (!t) return '';
  return `<div class="q-toast${t.no ? ' q-toast--no' : ''}" role="${t.no ? 'alert' : 'status'}">${ICO(t.no ? 'alert' : 'check', 18)}<span>${t.text}</span></div>`;
}
/** Page header: back/close at the physical right, title, an optional end slot at the left. */
export function hdr(t, act, label, end = '', cls = '') {
  return `<header class="q-hdr${cls}"><button class="q-iconbtn" data-act="${act}" aria-label="${label}">${I.back}</button>${t ? `<h1 class="q-hdr__t">${t}</h1>` : '<span></span>'}<div class="q-hdr__end">${end}</div></header>`;
}
// a modal on top makes the page behind it inert (focus, taps, screen readers)
export const page = (cls, inner, extra = '') => `<div class="q-page ${cls}"${/q-modal/.test(extra) ? ' inert' : ''}>${inner}</div>${extra}`;
export function sheet(t, text, body, btns, icon) {
  const lead = icon ? `<span class="q-sheet__icon q-sheet__icon--${icon[0]}" aria-hidden="true">${ICO(icon[1], 26)}</span>` : '';
  return `<div class="q-scrim q-modal"><section class="q-sheet" role="dialog" aria-modal="true" aria-labelledby="sh-t">${lead}<h2 id="sh-t">${t}</h2>${text ? `<p>${text}</p>` : ''}${body || ''}<div class="q-sheet__btns">${btns}</div></section></div>`;
}
export const statecard = (ic, kind, t, text, actions) => `<div class="q-state"><span class="q-state__i${kind ? ' q-state__i--' + kind : ''}" aria-hidden="true">${ICO(ic, 30)}</span><h2>${t}</h2>${text ? `<p>${text}</p>` : ''}<div class="q-state__a">${actions}</div></div>`;

// ---------------------------------------------------------------- G00 splash (§3)
export function vSplash(error) {
  if (!error) return '<div class="q-page q-entry" aria-label="قیمت‌شناس"></div>';
  return page('q-sys', statecard('wifi', 'no', 'بازی باز نشد', 'اتصال اینترنت رو بررسی کن و دوباره امتحان کن.', PRIMARY('تلاش دوباره', ' data-act="boot"', I.refresh)));
}

export function vRunLoading(soundOn=true) {
  return page('p-run-loading',`<header class="p-launch-header"><span>قیمت‌شناس</span>${soundControl(soundOn)}</header><main><span class="p-entry-kicker">دست تازه، رکورد تازه</span><h1>حدست رو آماده کن!</h1><div class="p-launch-art">${entryArt()}</div><div class="p-connecting" role="status">${loadingDots}<b>داریم کالاها رو می‌چینیم…</b></div><p>قیمت اولی معلومه؛ دومی رو تو حدس بزن.</p></main><footer>۲ کالا <i>✦</i> ۱۰ ثانیه <i>✦</i> یه حدس درست</footer>`);
}

// ---------------------------------------------------------------- G01 home (§4, §5)
export function balance(b) {
  if (b == null) return '<span class="q-bal is-unknown" aria-label="موجودی دیجی‌کوین نامعلوم">' + COIN + '<b>—</b></span>';
  return `<span class="q-bal" role="img" aria-label="موجودی: ${fa(b)} دیجی‌کوین">${COIN}<b>${fa(b)}</b></span>`;
}
/** The home's bottom sheet (owner 2026-10-25): full-bleed, curved top; the chances line and the one main action. v: the G01 state. */
function homeSheet(v, m) {
  const b = m.boot, q = b.quota;
  const chances = `<p class="q-chances">${ICO('info', 18)}<span>هنوز <b>${fa(q.playsLeft)}</b> شانس داری</span></p>`;
  let cta, pre = '';
  if (v === 'G01.ACTIVE_RUN') {
    const r = b.activeRun;
    pre = status('', `یه دست نیمه‌کاره داری با ${fa(r.score)} جواب درست؛ از همون‌جا ادامه بده.`, 'info');
    cta=m.resumeBusy?`<button class="q-btn q-btn--primary" data-act="resume" disabled aria-busy="true">${SPIN}<span>در حال ادامهٔ دست…</span></button>`:PRIMARY('ادامه دست', ' data-act="resume"', I.play);
  } else if (v === 'G01.OPERATION_PENDING') {
    pre = status('', 'پرداخت قبلیت هنوز در حال بررسیه. دوباره کسر نمی‌شه؛ چند لحظه صبر کن.', null, true);
    cta = `<button class="q-btn q-btn--primary" data-act="start" disabled aria-busy="true">${SPIN}<span>در حال شروع بازی…</span></button>`;
  } else if (v === 'G01.STARTING' || v === 'G01.REFRESHING') cta = `<button class="q-btn q-btn--primary" data-act="start" disabled aria-busy="true">${SPIN}<span>در حال شروع بازی…</span></button>`;
  else if (v === 'G01.QUOTA_CHECKING') cta = `<button class="q-btn q-btn--primary" disabled aria-disabled="true" aria-busy="true"><span>در حال بررسی شانس بعدی...</span></button>`;
  else if (v === 'G01.QUOTA_EXHAUSTED') cta = `<button class="q-btn q-btn--primary" disabled aria-disabled="true"><i class="q-btn__i">${ICO('clock')}</i><span>تا شانس بعدی <b dir="ltr" data-countdown>${m.untilReset}</b></span></button>`;
  else if (m.offline) { pre = status('warn', 'اتصال برقرار نیست؛ برای شروع بازی به اینترنت وصل شو.', 'wifi'); cta = `<button class="q-btn q-btn--primary" disabled aria-disabled="true">${ICON(I.play)}<span>شروع بازی</span></button>`; }
  else cta = PRIMARY('شروع بازی', ' data-act="start"', I.play);
  return `<section class="q-homesheet" aria-label="شروع بازی">${pre}${v === 'G01.ACTIVE_RUN' ? '' : chances}${cta}</section>`;
}
/** Promo under the record card: opens the discounted products the player has seen (G12.DEALS). */
const DEALS_BANNER = `<button class="q-dealbanner" data-act="deals" aria-label="تا ۹۰ درصد تخفیف روی کالاهایی که دیدی؛ دیدن کالاها">` +
  `<b>تا ۹۰ درصد تخفیف روی کالاهایی که دیدی!</b><span class="q-dealbanner__go">از دستشون نده و کلیک کن ${ICO('fwd', 16)}</span></button>`;
function homeRewardHistory(history, limit = 3) {
  const h = history || { items: [], count: 0, totalCoins: 0 };
  const date = value => new Intl.DateTimeFormat('fa-IR', { timeZone:'Asia/Tehran', day:'numeric', month:'long', hour:'2-digit', minute:'2-digit' }).format(new Date(value));
  const rows = h.items.slice(0,limit).map(r => `<li class="h-reward-row"><span class="h-earned-coin" aria-hidden="true">${COIN}</span><div class="h-earned-info"><b>${esc(r.title)}</b><time datetime="${esc(r.receivedAt)}">${date(r.receivedAt)}</time></div><span class="h-earned-state">${ICO('check',12)} واریز شد</span><div class="h-earned-amount"><b dir="ltr">+${fa(r.amount)}</b><small>دیجی‌کوین</small></div></li>`).join('');
  const more = h.items.length > limit ? `<button class="h-history-more" data-act="rewards-more" aria-expanded="${limit > 3}">دیدن ${fa(Math.min(10,h.items.length-limit))} جایزهٔ دیگر ${ICO('down',13)}</button>` : '';
  const less = limit > 3 ? `<button class="h-history-more" data-act="rewards-less">جمع کردن فهرست ${ICO('up',13)}</button>` : '';
  const body = rows ? `<ol class="h-earned-list" aria-label="جوایز دریافت‌شده، از جدید به قدیم">${rows}</ol>${more}${less}` : `<div class="h-history-empty"><span>${ICO('gift',28)}</span><div><b>اولین جایزه‌ات همین نزدیکی‌هاست!</b><p>بازی کن؛ دیجی‌کوین‌هایی که می‌گیری اینجا ثبت می‌شن.</p></div></div>`;
  return `<section class="h-earned" aria-labelledby="earned-title"><div class="h-earned-heading"><div><span class="h-section-kicker">تاریخچهٔ جوایز</span><h2 id="earned-title">جایزه‌هایی که گرفتی</h2></div><div class="h-earned-total"><small>مجموع جایزه‌ها</small><span>${COIN}<b>${fa(h.totalCoins)}</b><small>دیجی‌کوین</small></span></div></div>${body}</section>`;
}
export function vHome(v, m) {
  return renderMobileHome(v, m, { COIN, BADGE_SRC, badgeId, homeSheet, page, toastHTML, dealsOf });
}

// ---------------------------------------------------------------- G01 daily reward modal
export function dailyModal(d,ui) { return renderStreakSheet(d,ui,{COIN,PRIMARY,SECONDARY,BUSY,status}); }

// ---------------------------------------------------------------- G02 guide (§15) and onboarding (§14)
const learningHelpers = () => ({ page, hdr, refCard, cmpCard, timer, decide, game, COIN, BADGE_SRC, badgeId });
export function vGuide(m) { return renderLearning({ ...m, from: 'guide' }, learningHelpers()); }
export function vOnboard(m) { return renderLearning({ ...m, from: 'onb' }, learningHelpers()); }

// ---------------------------------------------------------------- gameplay (§6, §7, §8, §10)
/** Top bar: back at the right, the game name, the correct-answer count at the left. No balance (§1). */
export function gameTop(score, backLocked, soundOn=true) {
  return `<header class="q-hdr q-hdr--game"><button class="q-iconbtn" data-act="back" aria-label="خروج از دست"${backLocked ? L : ''}>${I.back}</button><h1 class="q-hdr__t">قیمت‌شناس</h1>` +
    `<div class="q-hdr__end">${soundControl(soundOn)}<span class="q-score" aria-live="polite"><b>${fa(score)}</b><small>جواب درست</small></span></div></header>`;
}
/** A paying checkpoint shows the DigiCoin alone (owner 2026-10-25: no amount on it, the coin says «you earn DigiCoin here»). */
const coinStack = () => `<span class="q-stack">${COIN}</span>`;
/** Main progress bar (kept, §10): fills with the score; each checkpoint shows its real reward — the badge when it pays no coin. */
export function track(score, cps) {
  const last = cps.length ? cps[cps.length - 1].requiredCorrect : 1;
  const f = Math.min(1, score / last);
  const nodes = cps.map((c, i) => {
    const ic = c.rewardAmount > 0 ? coinStack() : `<img src="${BADGE_SRC(badgeId(c, i))}" alt="" width="34" height="33">`;
    return `<li class="${c.requiredCorrect <= score ? 'is-done' : ''}" style="--x:${(100 * c.requiredCorrect / last).toFixed(2)}%"><span class="q-track__ic">${ic}</span><span class="q-track__n">${fa(c.requiredCorrect)}</span></li>`;
  }).join('');
  const next = cps.find(c => c.requiredCorrect > score);
  const label = next ? `${fa(score)} جواب درست؛ چک‌پوینت بعدی با ${fa(next.requiredCorrect)} جواب درست${next.rewardAmount > 0 ? ` و ${fa(next.rewardAmount)} دیجی‌کوین` : ''}` : `${fa(score)} جواب درست؛ همه‌ی چک‌پوینت‌ها رو گرفتی`;
  return `<div class="q-track" role="progressbar" aria-valuemin="0" aria-valuemax="${last}" aria-valuenow="${Math.min(score, last)}" aria-label="${label}">` +
    `<div class="p-track-heading" aria-hidden="true"><span>${next ? `${fa(next.requiredCorrect - score)} تا جواب کم داری تا ${esc(next.title)} بشی` : 'همهٔ نشان‌ها رو گرفتی!'}</span><small>${next?.rewardAmount > 0 ? `${fa(next.rewardAmount)} دیجی‌کوین جایزه` : 'هر حدس، یک قدم جلوتر'}</small></div><div class="q-track__line"><i style="--f:${f.toFixed(4)}"></i></div><ol aria-hidden="true">${nodes}</ol></div>`;
}
/**
 * Timer plate above the products (§7): the words on the right, the seconds on the left in a pulsing cap, no bar.
 * mode: idle · run · low (last 3 s: only the digits and their ring turn red) · zero · busy (answer sent) ·
 * verdict (owner 2026-10-26: the result shows here, in place of the seconds, until the next question).
 */
export function timer(o) {
  const mode = o.mode;
  if (mode === 'verdict') {
    const ic = { ok: 'check', no: 'x', time: 'clock' }[o.kind];
    return `<div class="q-timer is-verdict is-${o.kind}" data-tour="timer" role="status"><span class="q-timer__l"><b>${o.title}</b>${o.sub ? `<span>${o.sub}</span>` : ''}</span>` +
      `<span class="q-timer__n q-timer__v${o.pop ? ' q-pop-once' : ''}" aria-hidden="true">${ICO(ic, 24)}</span></div>`;
  }
  const n = mode === 'idle' ? fa(10) : mode === 'zero' ? fa(0) : o.t;
  const lab = { idle: 'برای هر حدس، ۱۰ ثانیه', run: 'ثانیه برای انتخابت', low: 'زود باش، وقت داره تموم می‌شه!', zero: 'زمان تموم شد', busy: 'در حال بررسی پاسخ…' }[mode];
  const num = mode === 'busy' ? `<span class="q-timer__n">${SPIN}</span>` : `<b class="q-timer__n">${n}</b>`;
  const live = mode === 'run' || mode === 'low';
  return `<div class="q-timer is-${mode}" style="--p:${o.p ?? (mode === 'zero' ? 0 : 1)}" data-tour="timer" ${live ? 'role="timer" data-timer' : 'role="status"'} aria-label="${mode === 'zero' ? lab : mode === 'busy' ? 'در حال بررسی پاسخ' : `${n} ${lab}`}">` +
    `<span class="q-timer__l">${lab}</span>${num}<span class="p-time-track" aria-hidden="true"><i></i></span></div>`;
}
export function refCard(card, strip) {
  const k = keyOf(card);
  return `<article class="q-ref${strip ? ' q-ref--strip' : ''}" aria-label="کالای اول، ${money(card.price)} تومان"${mk('card:' + k, 'frame')} data-tour="first">${img(card, true)}` +
    `<div class="q-ref__b"><h2 class="q-ref__t"${mk('ttl:' + k, 'text')}>${title(card.displayTitle)}</h2>${price(card.price, '', mk('prc:' + k, 'text'))}</div></article>`;
}
/**
 * Between questions (owner 2026-10-26): «نشان بده» fills over the 5 s lead and the next product then shows by itself; a tap
 * shows it at once. state: wait (asking for the next product) · count ({total, left} ms) · failed · off.
 */
export function revealCard(state, lead) {
  const failed = state === 'failed', off = state === 'off', loading=state==='loading';
  const t = failed ? 'کالا آماده نشد' : 'بعدی رو حدس می‌زنی؟';
  const p = failed ? 'امتیاز و زمانت سالمه؛ دوباره امتحان کن.' : off ? 'اتصال قطع شد. هنوز سؤالی شروع نشده؛ دستت محفوظه.' : '';
  const fill = state === 'count' && lead ? ` style="--lead-total:${lead.total}ms;--lead-delay:${lead.left - lead.total}ms"` : '';
  const b = loading?`<button class="q-btn q-btn--primary" data-act="reveal" disabled aria-disabled="true" aria-busy="true">${SPIN}<span>در حال نمایش…</span></button>`:off ? `<button class="q-btn q-btn--primary" disabled aria-disabled="true"><span>در انتظار اتصال…</span></button>`
    : failed ? PRIMARY('دوباره امتحان کن', ' data-act="reveal" data-tour="reveal"', I.refresh)
    : `<button class="q-btn q-btn--primary q-btn--lead${state === 'count' ? ' is-counting' : ''}" data-act="reveal" data-tour="reveal" aria-label="نشان بده؛ کالای بعدی خودکار نشون داده می‌شه"${fill}>` +
      `<i class="q-btn__fill" aria-hidden="true"></i><i class="q-btn__i q-btn__i--play">${I.play}</i><span>نشان بده</span></button>`;
  return `<section class="q-invite${failed ? ' is-failed' : ''}"${mk('slot', 'fade')} aria-labelledby="inv-t"><span class="q-invite__tag" aria-hidden="true">${TAG}</span><img class="p-ready-mascot" src="assets/brand-smile-v2.png" alt="" aria-hidden="true"><h2 id="inv-t">${t}</h2>${p ? `<p>${p}</p>` : ''}</section><div class="p-ready-action"><small>قیمت کالای بالا رو به خاطر بسپار</small>${b}</div>`;
}
/** Comparison product. Its price is never in the page before the answer; afterwards the server's revealed price fills the same row. */
export function cmpCard(card, st, revealedPrice, slow, decision='') {
  const k = keyOf(card);
  const cls = { hidden: '', ok: ' is-ok', no: ' is-no', time: ' is-time' }[st];
  const row = st === 'hidden'
    ? `<p class="q-price q-price--hidden"${mk('prc:' + k, 'text')}><b>؟</b><small>تومان</small><span class="pe-sr">قیمت مخفی</span></p>`
    : price(revealedPrice, ' q-price--reveal', mk('prc:' + k, 'text'));
  const hint = slow ? '<p class="q-cmp__hint">عکس در راهه؛ از روی اسم هم می‌تونی جواب بدی.</p>' : '';
  return `<article class="q-cmp${cls}${decision?' p-cmp--answer':''}" aria-label="کالای دوم${st === 'hidden' ? '، قیمت مخفی' : `، ${money(revealedPrice)} تومان`}"${mk('card:' + k, 'frame')} data-tour="second">` +
    `${img(card, true, st === 'hidden' ? 'q' : '')}<div class="p-cmp-info"><h2 class="q-cmp__t"${mk('ttl:' + k, 'text')}>${title(card.displayTitle)}</h2>${hint}${row}</div>${decision}</article>`;
}
/**
 * Decision area: the prompt (or, after the server's verdict, the verdict in the same place) and the two answers at a
 * fixed size and position. st: on · off · pending · ok · no · truth. Text marks («انتخاب تو», «درست») never rely on colour.
 */
export function decide(st, side, line, refPrice, scope = 'ans') {
  const A = { cls: '', a: ` data-act="${scope}-higher"`, i: I.up, m: '' }, B = { cls: '', a: ` data-act="${scope}-lower"`, i: I.down, m: '' };
  const me = side === 'higher' ? A : B, ot = side === 'higher' ? B : A;
  const ok = `<span class="q-ab__m">${ICO('check', 18)}</span>`, no = `<span class="q-ab__m">${ICO('x', 18)}</span>`;
  if (st === 'off') A.a = B.a = L;
  else if (st === 'pending') { me.cls = ' is-picked'; me.a = ' aria-pressed="true" aria-busy="true"' + L; me.i = SPIN; ot.cls = ' is-dim'; ot.a = L; }
  else if (st === 'ok') { me.cls = ' is-ok'; me.a = ' aria-pressed="true"' + L; me.i = ok; me.m = 'انتخاب تو، درست'; ot.cls = ' is-dim'; ot.a = L; }
  else if (st === 'no') { me.cls = ' is-no'; me.a = ' aria-pressed="true"' + L; me.i = no; me.m = 'انتخاب تو، غلط'; ot.cls = ' is-truth'; ot.a = L; ot.i = ok; ot.m = 'جواب درست'; }
  else if (st === 'truth') { me.cls = ' is-truth'; me.a = L; me.i = ok; me.m = 'جواب درست'; ot.cls = ' is-dim'; ot.a = L; }
  const rp = st === 'on' && refPrice ? money(refPrice) : '';
  const btn = (o, w) => `<button class="q-ab${o.cls}"${o.a}${rp ? ` aria-label="${w} از ${rp} تومان"` : ''}><i class="q-ab__i">${o.i}</i><span>${w}${o.m ? `<small class="pe-sr">، ${o.m}</small>` : ''}</span></button>`;
  return `<div class="q-decide"${mk('decide', 'fade')}><p class="p-question" data-tour="question"><span>به نظرت این کالا</span><b>گرون‌تره یا ارزون‌تر؟</b><small>با کالای بالایی مقایسه کن <i aria-hidden="true">↑</i></small></p><div class="q-ans" role="group" aria-label="قیمت کالای دوم نسبت به کالای اول" data-tour="answers">${btn(A, 'گرون‌تره')}${btn(B, 'ارزون‌تره')}</div></div>`;
}
export const prompt = (text, muted) => `<p class="q-prompt${muted ? ' is-muted' : ''}">${text}</p>`;
export function verdict(k, t, sub, pop) {
  const ic = { ok: 'check', no: 'x', time: 'clock' }[k];
  return `<p class="q-verdict q-verdict--${k}" role="status"><span class="q-verdict__i${pop ? ' q-pop-once' : ''}" aria-hidden="true">${ICO(ic, 18)}</span><b>${t}</b>${sub ? `<span>${sub}</span>` : ''}</p>`;
}
export const pill = (t, ic, btn) => `<p class="q-pill" role="status">${ICO(ic, 16)}<span>${t}</span>${btn || ''}</p>`;
export function game(top, trk, tmr, main, dec, extra, toast) {
  const attached=main.includes('p-cmp--answer');
  return page(`q-game p-game${attached?' p-game--answers':dec?'':' p-game--ready'}`, top+trk+`<main class="q-game__main" aria-label="مقایسهٔ دو کالا">${main}${tmr}</main>`+(attached?'':dec||'<div class="p-ready-space" aria-hidden="true"></div>'),(extra||'')+toastHTML(toast));
}

export function leaveSheet(m) {
  if (!m.leave) return '';
  const txt = `دست با ${fa(m.score)} جواب درست تموم می‌شه و دیگه نمی‌تونی ادامه بدی.${m.checkpoint ? ' جایزه‌ی چک‌پوینت‌هایی که گرفتی سر جاشه.' : ''}`;
  return sheet('از این دست خارج می‌شی؟', txt, m.questionOpen ? status('warn', 'زمان سؤال متوقف نمی‌شه.', 'clock') : '',
    PRIMARY('ادامه بازی', ' data-act="leave-no"', I.fwd) + BTN('q-btn--danger', 'خروج و پایان دست', ' data-act="leave-yes"'), ['warn', 'alert']);
}

// ---------------------------------------------------------------- G04 checkpoint celebration (§10)
/**
 * Mounted once per (run, checkpoint) outside the re-rendered screen. Badge, «{title} رو گرفتی!»,
 * «{n} جواب درست دادی», the reward line only for a paying checkpoint, and one «ادامه بده». No countdown, no automatic
 * continue, no second «دریافت» step: the reward was registered by the server with the answer that crossed the line.
 */
export function cpOverlay(c,index,reward,next) {
  const amount=c.rewardAmount||0,late=reward?.status==='delayed';
  return `<div class="q-cp q-cp--compact tier-${index}" role="dialog" aria-modal="true" aria-labelledby="cp-t" aria-describedby="cp-d"><section class="p-checkpoint-card"><small class="p-checkpoint-kicker">یه نشان تازه برای تو</small>${badge(c,index,'q-cp__badge')}<h2 id="cp-t">نشان «${esc(c.title)}» رو گرفتی!</h2><p id="cp-d">${fa(c.requiredCorrect)} حدس درست پشت‌سرهم</p>${amount?`<p class="p-checkpoint-prize">${COIN}<b>${fa(amount)} دیجی‌کوین جایزه</b><small>${late?'واریزش کمی طول می‌کشه':reward?.status==='succeeded'?'واریز شد':''}</small></p>`:''}<p class="p-checkpoint-next">${next?`${fa(next.requiredCorrect-c.requiredCorrect)} جواب دیگه تا نشان «${esc(next.title)}»`:'همهٔ نشان‌ها رو گرفتی؛ رکوردت رو بالاتر ببر!'}</p>${PRIMARY('ادامهٔ بازی',' data-act="cp-go"',I.fwd)}</section></div>`;
}

// ---------------------------------------------------------------- G05/G06 end of a run (owner 2026-10-25)
/**
 * End screen 1 — the continue offer as a modal over the game screen (the revealed price and verdict stay visible behind a
 * blur). m: { cost, balance, state: offer|loading|ending|pending|unknown|failed, left (offer seconds or null) }.
 */
export function offerModal(m) {
  const busy = { loading: 'در حال آماده‌سازی…', ending: 'در حال ثبت نتیجه…', pending: 'در حال دریافت جون…' }[m.state];
  const locked = !!busy || m.state === 'unknown' || m.state==='skipping';
  let note = '', main;
  if (m.state === 'pending') note = status('', 'هزینه فقط یک بار کسر می‌شه.', 'info');
  if (m.state === 'unknown') note = status('warn', 'وضعیت پرداخت در حال بررسیه؛ دوباره سکه کسر نمی‌شه.', null, true);
  if (m.state === 'failed') note = status('no', 'پرداخت انجام نشد و سکه‌ای کسر نشد.', 'alert', false, true);
  if (busy) main=`<button class="q-btn q-btn--secondary q-offer__go" data-act="continue" disabled aria-busy="true">${SPIN}<span>${busy}</span></button>`;
  else if (m.state === 'unknown') main = BTN('q-btn--secondary q-offer__go', 'بررسی وضعیت پرداخت', ' data-act="recheck"', I.refresh);
  else main = BTN('q-btn--secondary q-offer__go', `یه جون اضافه با ${fa(m.cost)} دیجی‌کوین`, ' data-act="continue"'+(locked?L:''), COIN);
  const skip = m.state==='skipping'?`<button class="q-btn q-btn--primary q-offer__skip" data-act="offer-skip" disabled aria-busy="true">${SPIN}<span>در حال ثبت نتیجه…</span></button>`:BTN('q-btn--primary q-offer__skip', 'دیدن نتیجهٔ این دست', ' data-act="offer-skip"' + (locked ? L : ''));
  const why = m.reason === 'timeout' ? 'وقتت تموم شد و این دور رو باختی.' : 'این حدس درست نبود و این دور رو باختی.';

  return `<div class="q-scrim q-modal q-offerlayer"><section class="q-offer p-revive" role="dialog" aria-modal="true" aria-labelledby="offer-t" aria-describedby="offer-d">` +
    `<button class="q-iconbtn q-offer__x" data-act="offer-skip" aria-label="بستن و دیدن نتیجهٔ این دست"${locked?L:''}>${I.x}</button><span class="p-heart" aria-hidden="true"><svg viewBox="0 0 64 64" fill="none"><path d="M32 53S7 37 7 20C7 5 26 3 32 15 38 3 57 5 57 20c0 17-25 33-25 33Z" fill="#e6b0a0" stroke="#92533e" stroke-width="2.5"/><path d="m34 11-7 13 10 5-8 16" stroke="#fffaf0" stroke-width="4" stroke-linejoin="round"/></svg></span>` +
    `<h2 id="offer-t">هنوز می‌تونی برگردی!</h2><p id="offer-d">${why}</p>` +
    `<div class="p-revive-score"><b>${fa(m.score || 0)}</b><span>امتیاز گرفتی!</span></div>` +
    `<p class="p-revive-explain">با دادن <b>${fa(m.cost)} تا دیجی کوین</b> یه جون اضافه میگیری و ادامه میدی!</p>` +
    (m.nextGoal ? `<p class="p-revive-goal">${fa(m.nextGoal.requiredCorrect-(m.score || 0))} تا جواب کم داری تا ${esc(m.nextGoal.title)} بشی</p>` : '') +
    `${m.left != null ? `<p class="q-offer__left">${ICO('clock',16)}<b data-offer-left>${m.left}</b> ثانیه برای تصمیم</p>` : ''}${note}` +
    `<div class="q-offer__btns">${skip}${main}</div><p class="p-revive-wallet">موجودی: ${fa(m.balance ?? 0)} دیجی‌کوین</p></section></div>`;
}
/** A seen product with its (simulated) deal: tile for the result screen and the deals page. */
function dealTile(p, big) {
  const d = p.deal || {};
  const tag = d.discountPercent ? `<span class="q-deal__off">${fa(d.discountPercent)}٪</span>` : '';
  const coin = d.coinBack ? `<span class="q-deal__coin">${COIN}${fa(d.coinBack)}</span>` : '';
  const open = p.link ? ` data-act="open-product" data-link="${esc(p.link)}"` : ' disabled';
  return `<li><button class="q-deal${big ? ' q-deal--row' : ''}"${open} aria-label="${esc(p.displayTitle)}${d.discountPercent ? `، ${fa(d.discountPercent)} درصد تخفیف` : ''}، مشاهده کالا">` +
    `<span class="q-deal__img">${p.imageUrl ? `<img src="${esc(p.imageUrl)}" alt="" decoding="async">` : ''}${tag}</span>` +
    `${big ? `<span class="q-deal__b"><span class="q-deal__t">${title(p.displayTitle)}</span>${coin}${productPriceMarkup(p)}<span class="q-deal__go">مشاهده کالا ${ICO('fwd', 16)}</span></span>` : coin}</button></li>`;
}
export const dealsOf = list => (list?.items || []).filter(p => p.deal && (p.deal.discountPercent || p.deal.coinBack));
/**
 * End screen 2 — the result. m: { title, score, best, newRecord, cp, cpIndex, better (percent or null), deals, dealsState,
 * note (payment message html), code, shareable, balance, toast }.
 */
/** Compact, truthful preview: at most three seen products, with a responsive remainder count. */
function resultDeals(items) {
  if (!items.length) return '';
  const thumbs = items.slice(0,3).map((p,i)=>`<span class="p-deal-thumb" data-preview="${i}">${p.imageUrl ? `<img src="${esc(p.imageUrl)}" alt="" decoding="async">` : ''}${p.deal?.discountPercent > 0 ? `<b>${fa(p.deal.discountPercent)}٪</b>` : p.deal?.coinBack > 0 ? `<small>${COIN}${fa(p.deal.coinBack)}</small>` : ''}</span>`).join('');
  const more = items.length > 3 ? `<span class="p-deals-more"><b class="p-more-wide" dir="ltr">+${fa(items.length-3)}</b><b class="p-more-small" dir="ltr">+${fa(items.length-2)}</b><small>کالای دیگه</small></span>` : '';
  return `<button class="p-result-deals" data-act="deals-end" aria-label="دیدن ${fa(items.length)} کالای دیده‌شده با تخفیف یا دیجی‌کوین"><span class="p-deals-heading"><b>کالاهایی که دیدی، با جایزه!</b><span>مشاهدهٔ همه ${ICO('fwd',14)}</span></span><span class="p-deals-thumbs">${thumbs}${more}</span></button>`;
}
export function vEnd(m) {
  const headline = m.newRecord ? 'رکوردت رو شکستی!' : m.cp ? 'چه دست خوبی!' : m.score > 0 ? 'هر بار، یه قدم جلوتر!' : 'دست بعدی مال توئه!';
  const earned = m.reward?.amount > 0 ? `<div class="p-result-reward">${COIN}<span><b>${fa(m.reward.amount)} دیجی‌کوین</b> ${m.reward.status === 'succeeded' ? 'جایزه گرفتی' : 'جایزه در حال واریزه'}</span></div>` : '';
  const art = m.cp ? `<img src="${BADGE_SRC(badgeId(m.cp,m.cpIndex))}" alt="نشان ${esc(m.cp.title)}">` : '<img src="assets/brand-smile-v2.png" alt="">';
  const goal = m.nextGoal ? `${fa(m.nextGoal.remaining)} تا جواب کم آوردی تا ${esc(m.nextGoal.title)} بشی!` : 'همهٔ نشان‌ها رو گرفتی؛ رکورد بعدی منتظرته!';
  const share = m.shareable;
  const deals = resultDeals(m.deals || []);
  const limit = m.noOfferReason === 'no_funds' ? '<p class="p-result-limit">موجودی برای جون اضافه کافی نبود؛ دست جدید با شانس روزانه شروع می‌شه.</p>' : '';
  return page(`q-end p-end${m.newRecord ? ' p-end--record' : ''}`, `<header class="q-hdr q-end__hd"><button class="q-iconbtn" data-act="end-home" aria-label="رفتن به صفحه اصلی">${ICO('home',22)}</button><h2>نتیجهٔ این دست</h2>${soundControl(m.soundOn!==false)}</header>` +
    `<main class="q-end__main"><section class="p-result" aria-label="نتیجه و رکورد"><span class="p-result-kicker">${m.newRecord ? '✦ رکورد شخصی جدید ✦' : m.cp ? `نشان «${esc(m.cp.title)}» برای تو` : 'شمّ اقتصادی‌ات قوی‌تر می‌شه'}</span>` +
    `<div class="p-result-art" aria-hidden="true">${art}<i>✦</i><i>✧</i><i>✦</i></div><h1 class="q-end__h">${headline}</h1><div class="p-result-number"><b>${fa(m.score)}</b><span>حدس درست<br>در این دست</span></div>` +
    `<p class="p-result-best">بهترین رکوردت: <b>${fa(m.best)}</b>${m.newRecord && m.previousRecord > 0 ? `<span>↑ ${fa(m.score-m.previousRecord)} بهتر از قبل</span>` : ''}</p></section>` +
    `${earned}<p class="p-result-goal">${goal}</p>${limit}${m.note || ''}${m.code || ''}${deals}</main>` +
    `<footer class="q-end__foot">${share ? `<p>این دست ${fa(m.score)} امتیاز گرفتی؛ دوستات چند می‌گیرن؟</p>${m.sharing?`<button class="q-btn q-btn--primary" data-act="share-result" disabled aria-busy="true">${SPIN}<span>در حال آماده‌سازی تصویر…</span></button>`:BTN('q-btn--primary','امتیاز این دستم رو بفرست',' data-act="share-result"',I.share)}` : ''}` +
    `${m.restarting?`<button class="q-btn q-btn--secondary" data-act="play-again" disabled aria-busy="true">${SPIN}<span>در حال آماده‌سازی…</span></button>`:BTN(share ? 'q-btn--secondary' : 'q-btn--primary','یه دست دیگه',' data-act="play-again"',I.play)}</footer>`,toastHTML(m.toast));
}
/** G12.DEALS — the products the player has seen that are discounted now or pay DigiCoin back (data simulated in Play). */
export function vDeals(m) {
  const items = m.deals;
  const body = m.state === 'loading' ? `<div class="q-state" role="status">${SPIN}<p>در حال آوردن کالاها…</p></div>`
    : m.state === 'error' ? statecard('alert', 'no', 'کالاها نیومد', 'اتصال رو بررسی کن و دوباره امتحان کن.', PRIMARY('دوباره امتحان کن', ' data-act="deals-retry"', I.refresh))
    : !items.length ? statecard('gift', '', m.played ? 'فعلاً تخفیفی نیست' : 'هنوز کالایی ندیدی', m.played ? 'کالاهایی که توی بازی دیدی الان تخفیف ندارن؛ بعداً سر بزن.' : 'یه دست بازی کن؛ کالاهایی که می‌بینی و تخفیف می‌خورن اینجا جمع می‌شن.', '')
    : `<p class="q-deals__lead">تا ۹۰ درصد تخفیف روی کالاهایی که توی بازی دیدی</p><ul class="q-deals__list">${items.map(p => dealTile(p, true)).join('')}</ul>`;
  return page('q-deals', hdr('کالاهایی که دیدی', 'deals-close', 'بازگشت') + `<main class="q-deals__main">${body}</main>`, toastHTML(m.toast));
}
export function codeCard(c, copied) {
  const body = c.status === 'pending' ? `<p class="q-code__val">${SPIN}<span>در حال صدور کد…</span></p>`
    : `<p class="q-code__val"><b dir="ltr">${esc(c.code)}</b>${BTN('q-btn--text', copied ? 'کپی شد' : 'کپی کد', ' data-act="copy"')}</p>`;
  return `<section class="q-code" aria-label="کد تخفیف جایزه"><b>کد تخفیف ${money(c.amountToman)} تومانی</b>${body}<small>${esc(c.terms || '')}</small></section>`;
}

// ---------------------------------------------------------------- G10 connection, G11 unavailable
export function vSystem(v, m) {
  const pg = (ic, k, t, p, a) => page('q-sys', hdr('', 'exit-app', 'بازگشت به اپ') + statecard(ic, k, t, p, a), toastHTML(m.toast));
  const R = m.ended || {};
  const HOME = SECONDARY('صفحه اصلی', ' data-act="home"', I.home);
  if (v === 'G10.RESUMING') return page('q-sys', hdr('', 'exit-app', 'بازگشت به اپ') + `<div class="q-state" role="status">${SPIN}<h2>برگشتی!</h2><p>داریم آخرین وضعیت دستت رو از سرور می‌گیریم…</p></div>`);
  if (v === 'G10.INACTIVITY_END') return pg('clock', 'warn', 'این دست تموم شد', `بیشتر از ۳ دقیقه بین سؤال‌ها کاری انجام نشد. دستت با ${fa(R.score || 0)} جواب درست ثبت شد.`, PRIMARY('صفحه اصلی', ' data-act="home"', I.home));
  if (v === 'G11.GAME_OFF') return pg('power', '', 'بازی موقتاً در دسترس نیست', m.playerMessage ? esc(m.playerMessage) : 'در حال به‌روزرسانی هستیم. کمی بعد دوباره سر بزن.', SECONDARY('بازگشت به اپ', ' data-act="exit-app"'));
  if (v === 'G11.AUTH_ERROR') return pg('user', 'no', 'ورود انجام نشد', 'برای بازی باید وارد حساب دیجی‌کالا باشی. از داخل اپ دوباره وارد شو.', PRIMARY('بازگشت به اپ', ' data-act="exit-app"'));
  if (v === 'G11.SERVICE_ERROR') return pg('alert', 'no', 'یه مشکلی پیش اومد', 'سرویس بازی الان جواب نمی‌ده. امتیاز و دست‌هات محفوظه؛ چند لحظه دیگه دوباره امتحان کن.', PRIMARY('تلاش دوباره', ' data-act="boot"', I.refresh) + SECONDARY('بازگشت به اپ', ' data-act="exit-app"'));
  if (v === 'G11.OTHER_DEVICE') return pg('devices', '', 'این دست تموم شد', `روی دستگاه دیگه‌ای دست جدید شروع کردی. این دست با ${fa(R.score || 0)} جواب درست ثبت شد.`, HOME);
  if (v === 'G11.BLOCKED') return pg('lock', 'no', 'بازی غیرفعال شده است', '', SECONDARY('بازگشت به اپ', ' data-act="exit-app"'));   // exact copy (R-61)
  if (v === 'G03.NO_PRODUCTS_LEFT') return pg('check', 'ok', 'کالاها تموم شد!', `کالای مناسب دیگه‌ای برای این دست نمونده. دستت با ${fa(R.score || 0)} جواب درست ثبت شد.`, PRIMARY('صفحه اصلی', ' data-act="home"', I.home));
  return '';
}

export { L, ICO, SPIN };

export function shareModal(s) {
  return `<div class="q-scrim q-modal" data-key="share-modal"><section class="q-sheet q-share" role="dialog" aria-modal="true" aria-labelledby="share-title"><button class="q-iconbtn q-sheet__x" data-act="share-close" aria-label="بستن اشتراک‌گذاری">${I.x}</button><h2 id="share-title">دوستات رو به چالش بکش!</h2><img class="q-share-preview" src="${s.url}" alt="امتیاز این دست در قیمت‌شناس، بازی دیجی‌کالا"><p class="p-share-caption">امتیاز این دستت رو با دوستات مقایسه کن!</p><div class="q-share-actions">${s.sending?`<button class="q-btn q-btn--primary" data-act="share-send" disabled aria-busy="true">${SPIN}<span>در حال ارسال…</span></button>`:PRIMARY('ارسال امتیاز و دعوت',' data-act="share-send"',I.share)}<a class="q-btn q-btn--secondary" href="${s.url}" download="gheimat-shenas-digikala.png">${ICO('download',20)}<span>ذخیره تصویر</span></a></div><button class="p-copy-invite" data-act="share-copy-link">${I.share}<span>کپی متن دعوت</span></button>${s.notice?`<p class="p-share-notice" role="status">${esc(s.notice)}</p>`:''}</section></div>`;
}
