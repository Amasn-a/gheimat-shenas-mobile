import {tourMarkup} from './learning-spotlight.js?v=e3889d140bf3';
import {soundControl} from './feedback.mjs?v=e3889d140bf3';
import {I} from './icons.js?v=e3889d140bf3';
import {fa,esc} from './fmt.js?v=e3889d140bf3';
import {DEMO_FIRST,DEMO_SECOND,DEMO_SECOND_PRICE} from './demo.js?v=e3889d140bf3';
export function renderLearning(m,h){
 const phase=m.learn?.phase||'overview',c=m.config;
 const button=(text,act,secondary=false)=>`<button class="l-btn${secondary?' l-btn--secondary':''}" data-act="${act}"${m.busy?' disabled aria-busy="true"':''}>${m.busy?'<span class="q-spin"></span>':text}</button>`;
 const badges=`<ol class="l-outcome-badges">${c.checkpoints.map((cp,i)=>`<li><img src="${h.BADGE_SRC(h.badgeId(cp,i))}" alt="نشان ${esc(cp.title)}"><span>${fa(cp.requiredCorrect)} جواب درست</span></li>`).join('')}</ol>`;
 const header=text=>`<header class="l-header"><button data-act="back" aria-label="بازگشت به صفحهٔ قبل">${I.back}</button><h1>${text}</h1>${soundControl(m.soundOn!==false)}</header>`;
 if(['intro','question','feedback','done'].includes(phase)){
  const answered=phase==='feedback'||phase==='done',ok=m.learn?.outcome==='correct';
  const first={...DEMO_FIRST,displayTitle:'ماگ سرامیکی'},second={...DEMO_SECOND,displayTitle:'هدفون بی‌سیم'};
  const top=`<header class="q-hdr q-hdr--game"><button class="q-iconbtn" data-act="back" aria-label="بازگشت به مرحلهٔ قبل"${m.busy?' disabled aria-disabled="true"':''}>${I.back}</button><h1 class="q-hdr__t">یه دور تمرینی</h1>${soundControl(m.soundOn!==false)}</header>`;
  const decision=h.decide(answered?(ok?'ok':'no'):phase==='question'?'on':'off',answered?m.learn?.choice:null,'',first.price,'learn');
  const main=h.refCard(first,true)+h.cmpCard(second,answered?(ok?'ok':'no'):'hidden',answered?DEMO_SECOND_PRICE:0,false,decision);
  let page=h.page('q-game p-game l-practice l-coach-space',top+`<main class="q-game__main"${phase==='intro'?' inert':''}>${main}</main>`);
  if(phase==='intro')page+=tourMarkup(m.learn?.tourStep||0,0);
  else page+=tourMarkup(2,0,true,answered?{outcome:m.learn?.outcome,busy:!!m.busy,error:m.error}:null);
  return page;
 }
 const rules=[['اسم و قیمت کالای اول رو ببین','کالای اول، مرجع مقایسه‌ست. اسم و قیمتش رو بخون تا قیمت کالای بعدی رو باهاش مقایسه کنی.'],['اسم و عکس کالای دوم رو ببین','قیمت کالای دوم مخفیه. با کمک عکس و اسمش تخمین بزن چقدر می‌ارزه.'],['حالا حدس بزن که گرون‌تره یا ارزون‌تر!','یکی از دو دکمه رو بزن. هر جواب درست، یه امتیاز به همین دست اضافه می‌کنه.'],['جواب‌های درستت جایزه دارن','در چک‌پوینت‌ها نشان می‌گیری و جایزهٔ همون مرحله بهت تعلق می‌گیره. آستانهٔ هر نشان رو پایین می‌بینی.']];
 const steps=rules.map(([title,copy],i)=>{const open=(m.learn?.openRules||[]).includes(i);return `<li class="l-rule${open?' is-open':''}"><button data-act="learn-rule" data-step="rule-${i}" data-rule="${i}" aria-expanded="${open}" aria-controls="learning-rule-${i}"><b>${fa(i+1)}</b><span class="l-rule-title">${title}</span><svg viewBox="0 0 16 16" aria-hidden="true"><path d="m3 5 5 6 5-6Z" fill="currentColor"/></svg></button><div class="l-rule-copy" id="learning-rule-${i}" aria-hidden="${!open}"><div><p>${copy}</p></div></div></li>`;}).join('');
 return h.page('l-guide l-overview',header('چطور بازی کنیم؟')+`<main class="l-main"><ol class="l-steps">${steps}</ol>${badges}</main><footer class="l-footer">${m.error?`<p role="alert">${esc(m.error)}</p>`:''}${button('یه دور تمرینی و مجانی بزنیم!','learn-practice')}</footer>`);
}
