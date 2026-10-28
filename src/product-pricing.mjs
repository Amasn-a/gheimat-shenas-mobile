import { money, fa, esc } from './fmt.js?v=7afa2313a516';
const amount=n=>n!==null&&n!==undefined&&n!==''&&typeof n!=='boolean'&&Number.isFinite(Number(n))&&Number(n)>=0?Number(n):null;
const firstAmount=(values,positive=false)=>values.map(amount).find(n=>n!==null&&(!positive||n>0))??null;
export function productPrices(p) {
  const original=firstAmount([p.originalPrice,p.deal?.originalPrice,p.gamePrice],true);
  const explicit=firstAmount([p.salePrice,p.currentPrice,p.deal?.salePrice,p.price]);
  const percent=Number(p.deal?.discountPercent??p.discountPercent)||0;
  const current=explicit??(original&&percent>0&&percent<=100?Math.floor(original*(100-percent)/100):original);
  const discounted=original!==null&&current!==null&&current<original;
  // The tag describes the same prices the player sees, even when deal metadata is absent or stale.
  const discountPercent=discounted?Math.min(100,Math.floor((original-current)*100/original+1e-7)):0;
  return {original,current,discounted,discountPercent};
}
export function productDiscountMarkup(p,className) {
  const price=productPrices(p);
  if(!price.discounted)return '';
  const label=price.discountPercent>0?`${fa(price.discountPercent)}٪`:'کمتر از ۱٪';
  return `<span class="${esc(className)}" aria-label="${label} تخفیف">${label}</span>`;
}
export function productPriceMarkup(p) {
  const price=productPrices(p);
  if(price.current===null)return '<span class="m-product-price m-product-price--unknown">قیمت در دسترس نیست</span>';
  return `<span class="m-product-price">${price.discounted?`<del aria-label="قیمت قبل از تخفیف ${money(price.original)} تومان" dir="ltr">${money(price.original)}</del>`:''}<span><b dir="ltr">${money(price.current)}</b><small>تومان</small></span></span>`;
}
