import { fa, untilInstant } from './fmt.js';
import { I } from './icons.js';
export function renderStreakSheet(d,ui,h) {
  const schedule=d.schedule||{},n=d.streakDays||0,weekly=schedule.mode==='weekly';
  const todayAttended=schedule.todayAttended??d.days?.some(x=>x.today&&x.attended)??false;
  const count=schedule.cycleDay??(n?(todayAttended?(n-1)%7+1:n%7):0);
  const p=ui.phase,available=['claimable','claiming','processing','slow','error'].includes(p),busy=['claiming','processing'].includes(p),success=p==='success';
  const day=Array.from({length:7},(_,i)=>{const v=i+1,done=v<=count,current=v===(todayAttended?count:count+1);return `<li class="${done?'is-done':''} ${current?'is-current':''} ${weekly&&v===7?'is-reward':''}"${current?' aria-current="step"':''} aria-label="روز ${fa(v)}، ${done?'حضور ثبت شده':current?'نوبت امروز':'پیش رو'}${weekly&&v===7?'، ۳ دیجی‌کوین':''}"><span>${fa(v)}</span><small>${weekly?(v===7?'۳ سکه':current?'امروز':''):'۱ سکه'}</small></li>`;}).join('');
  const title=success?'جایزه‌ات واریز شد!':n?`${fa(n)} روز پشت‌سرهم!`:'یه زنجیرهٔ تازه بساز';
  const reward=available||success?d.amount:weekly?3:1;
  const explain=success?'به دیجی‌کوین‌هات اضافه شد':available?'جایزه‌ات آمادهٔ دریافته':weekly?(count===7?'دورهٔ هفت‌روزه‌ات کامل شد':`${fa(7-count)} روز تا جایزهٔ بعدی`):todayAttended?'فردا دوباره یک دیجی‌کوین بگیر':'حضور امروزت رو با یک دست بازی ثبت کن';
  let notice='',buttons='';
  if(busy){buttons=`<button class="q-btn q-btn--primary" data-act="daily-claim" disabled aria-disabled="true" aria-busy="true"><span class="q-spin" aria-hidden="true"></span><span>در حال دریافت…</span></button>`;}
  else if(p==='slow'){notice=h.status('warn','جایزه‌ات محفوظه؛ وضعیت واریز رو دوباره بررسی کن.','clock');buttons=h.PRIMARY('بررسی دوباره',' data-act="daily-check"',I.refresh);}
  else if(p==='error'){notice=h.status('no',ui.message||'اتصال برقرار نشد؛ جایزه‌ات محفوظه.','alert',false,true);buttons=h.PRIMARY('تلاش دوباره',' data-act="daily-claim"',I.refresh);}
  else if(p==='claimable')buttons=h.PRIMARY(`دریافت ${fa(d.amount)} دیجی‌کوین`,' data-act="daily-claim"',I.gift);
  else if(success&&!weekly&&ui.nextRewardAt)buttons=`<button class="q-btn q-btn--primary p-streak-countdown" disabled aria-disabled="true"><span>تا دریافت جایزهٔ بعدی</span><b dir="ltr" data-streak-countdown data-until="${ui.nextRewardAt}">${untilInstant(Math.max(0,Date.parse(ui.nextRewardAt)-(ui.now||Date.now())))}</b></button>`;
  else if(success)buttons=h.PRIMARY('عالیه، ادامه بدیم',' data-act="daily-close" data-step="streak-primary"');
  else if(!todayAttended&&ui.canPlay)buttons=h.PRIMARY('ثبت حضور امروز با بازی',' data-act="streak-play"',I.play);
  else buttons=h.SECONDARY('بریم ادامه بدیم',' data-act="daily-close" data-step="streak-primary"',I.fwd);
  return `<div class="q-scrim q-modal"><section class="q-sheet q-daily p-streak" role="dialog" aria-modal="true" aria-labelledby="daily-t" data-phase="${p}"><header>${`<button class="q-iconbtn" data-act="daily-close" data-step="streak-dismiss" aria-label="بستن حضور روزانه"${busy?' disabled':''}>${I.x}</button>`}<div><h2 id="daily-t">${title}</h2></div><span class="p-streak-flame" aria-hidden="true"${success?' hidden':''}>${success?'':'<svg viewBox="0 0 32 38" fill="none"><path d="M18 2c2 10 11 11 11 22a13 13 0 0 1-26 0c0-6 3-10 7-14-1 6 2 7 4 6 4-3 3-9 4-14Z" fill="#f6a153" stroke="#8b4d2c" stroke-width="1.5"/><path d="M17 21c1 4 5 5 5 9a6 6 0 0 1-12 0c0-4 4-6 7-9Z" fill="#ffe6a0"/></svg>'}</span></header><div class="p-streak-body"><div class="p-streak-prize ${success?'is-success':''}"><span>${h.COIN}</span><div><b>${fa(reward)} <small>دیجی‌کوین</small></b><p>${explain}</p></div></div><div class="p-streak-cycle"><b>${weekly?'دورهٔ هفت‌روزهٔ تو':'هفتهٔ اول تو'}</b><small>${fa(count)} از ۷ روز</small></div><ol class="p-streak-days" aria-label="پیشرفت روزهای یک تا هفت">${day}</ol><div class="p-streak-rule">${I.gift}<p>${weekly?'هر ۷ روز پشت‌سرهم، <b>۳ دیجی‌کوین</b> می‌گیری.':'۷ روز اول، هر روز <b>۱ دیجی‌کوین</b>؛ بعدش هر ۷ روز، <b>۳ دیجی‌کوین</b>.'}</p></div><p class="p-streak-note">هر روز یک دست رو تموم کن تا حضورت ثبت بشه.${weekly?' با یک روز غیبت، شمارش از صفر شروع می‌شه؛ جایزه همچنان هر ۷ روزه.':''}</p>${notice}</div><footer>${buttons}</footer></section></div>`;
}
