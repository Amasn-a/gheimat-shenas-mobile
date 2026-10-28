import { I } from './icons.js?v=fdc36ae507bc';
// Shared CSS motion scene: the existing brand smile remains the central visual.
export function entryArt(url='assets/brand-smile-v2.png'){
  return `<div class="p-energy" aria-hidden="true"><div class="p-energy__disc"></div><div class="p-energy__ring"></div><i class="p-energy__spark p-energy__spark--a">✦</i><i class="p-energy__spark p-energy__spark--b">✧</i><i class="p-energy__dash"></i><img class="p-energy__smile" src="${url}" alt="" width="1280" height="1280"><span class="p-energy__tag p-energy__tag--up">${I.up} گرون‌تره</span><span class="p-energy__tag p-energy__tag--down">${I.down} ارزون‌تره</span></div>`;
}
export const loadingDots='<span class="p-loading-dots" aria-hidden="true"><i></i><i></i><i></i></span>';
