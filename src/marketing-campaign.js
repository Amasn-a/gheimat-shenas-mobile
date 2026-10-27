// Demo feed for this prototype. Use [] / null, or enabled:false, to remove the slot.
// Absolute deadlines never restart on reload. Production must supply campaigns and category IDs from its feed.
export const MARKETING_CAMPAIGNS = [
  { id:'digital-week', type:'challenge', enabled:true, category:'digital', categoryLabel:'کالای دیجیتال',
    title:'چالش کالای دیجیتال', subtitle:'قیمت گجت‌ها رو بلدی؟', demo:true,
    startsAt:'2026-10-25T00:00:00+03:30', endsAt:'2026-11-02T23:59:59+03:30' },
  { id:'seen-deals-week', type:'offers', enabled:true, title:'تخفیف کالاهای این دست', demo:true,
    startsAt:'2026-10-25T00:00:00+03:30', endsAt:'2026-11-02T23:59:59+03:30' },
];
const entries = feed => Array.isArray(feed) ? feed : feed ? [feed] : [];
export function campaignById(id, now, feed = MARKETING_CAMPAIGNS) {
  return entries(feed).find(c => c?.id === id && c.enabled && ['challenge','offers'].includes(c.type)
    && Number.isFinite(Date.parse(c.endsAt)) && Date.parse(c.endsAt) > now
    && (!c.startsAt || Date.parse(c.startsAt) <= now)) || null;
}
export function campaignDiscounts(list, now) {
  const seen = new Set();
  return (list?.items || []).filter(p => {
    const key = p.productId || p.link;
    const until = p.deal?.endsAt || p.deal?.expiresAt;
    if (!key || seen.has(key) || !(p.deal?.discountPercent > 0) || (until && !(Date.parse(until) > now))) return false;
    seen.add(key); return true;
  });
}
export function activeMarketingCampaign(feed = MARKETING_CAMPAIGNS, { now = Date.now(), products = null } = {}) {
  const active = entries(feed).map(c => campaignById(c?.id,now,feed)).filter(Boolean);
  // A personal offer takes precedence only when there are discounted products the player has actually seen.
  return (campaignDiscounts(products,now).length && active.find(c => c.type === 'offers'))
    || active.find(c => c.type === 'challenge' && c.category === 'digital') || null;
}
export function campaignTime(endsAt, now) {
  const seconds = Math.max(0,Math.ceil((Date.parse(endsAt)-now)/1000));
  if (!Number.isFinite(seconds) || !seconds) return { text:'مهلت تموم شد', urgent:false, expired:true };
  const hours = Math.floor(seconds/3600), minutes = Math.floor(seconds%3600/60), secs = seconds%60;
  const fa = n => String(n).replace(/\d/g,d=>'۰۱۲۳۴۵۶۷۸۹'[d]);
  return { text:hours>=24 ? `${fa(Math.floor(hours/24))} روز و ${fa(hours%24)} ساعت` : fa([hours,minutes,secs].map(n=>String(n).padStart(2,'0')).join(':')),
    urgent:seconds<=300, expired:false };
}
// Prototype-only category mapping: the catalog has no taxonomy IDs. Persist the category on the run, never a global filter.
export const isDigitalProduct = title => /^(هدفون|هندزفری|اسپیکر|ساعت هوشمند|گوشی|تبلت|لپ[‌ -]?تاپ|کنسول|ماوس|موس|کیبورد|صفحه کلید|پاوربانک|شارژر|پرینتر|مانیتور|دوربین|فلش مموری|هارد|مودم|روتر)/.test(title || '');
