import { money } from './fmt.js';
const positive=n=>Number.isFinite(Number(n))&&Number(n)>0?Number(n):null;
export function productPrices(p) {
  const original=positive(p.originalPrice??p.deal?.originalPrice??p.gamePrice);
  const explicit=positive(p.salePrice??p.currentPrice??p.deal?.salePrice??p.price);
  const percent=Number(p.deal?.discountPercent)||0;
  const current=explicit||(original&&percent>0&&percent<100?Math.floor(original*(100-percent)/100):original);
  return {original,current,discounted:!!(original&&current&&current<original)};
}
export function productPriceMarkup(p) {
  const price=productPrices(p);
  if(!price.current)return '<span class="m-product-price m-product-price--unknown">قیمت در دسترس نیست</span>';
  return `<span class="m-product-price">${price.discounted?`<del aria-label="قیمت قبل از تخفیف ${money(price.original)} تومان" dir="ltr">${money(price.original)}</del>`:''}<span><b dir="ltr">${money(price.current)}</b><small>تومان</small></span></span>`;
}
