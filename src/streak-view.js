import {fa} from './fmt.js';
import {I} from './icons.js';
// The calendar follows the current uninterrupted streak, never the last seven wall-clock dates.
export function streakCells(d){
 const count=Math.max(0,Math.floor(Number(d.schedule?.streakDays??d.streakDays)||0));
 const todayAttended=d.schedule?.todayAttended??d.days?.find(day=>day.today)?.attended??(count>0);
 const offset=Math.floor(Math.max(0,count-(todayAttended?1:0))/7)*7;
 const filled=Math.min(7,Math.max(0,count-offset));
 const current=todayAttended?Math.max(0,filled-1):Math.min(filled,6);
 return Array.from({length:7},(_,i)=>({number:offset+i+1,attended:i<filled,today:i===current}));
}
export function renderStreakSheet(d,ui,h){
 const list=streakCells(d);
 return `<div class="q-scrim q-modal"><section class="q-sheet q-daily p-streak" role="dialog" aria-modal="true" aria-labelledby="daily-t"><button class="q-iconbtn modal-close" data-act="daily-close" aria-label="بستن حضور روزانه">${I.x}</button><h2 id="daily-t">حضور تو در بازی</h2><p class="streak-summary">${fa(d.streakDays||0)} روز پشت‌سرهم</p><ol class="p-streak-days" dir="rtl" aria-label="هفت روز از استریک فعلی؛ از راست به چپ">${list.map(day=>`<li class="${day.attended?'is-done':''} ${day.today?'is-current':''}" aria-label="روز ${fa(day.number)}${day.today?'، امروز':''}، ${day.attended?'حضور داشته‌ای':'حضور ثبت نشده'}"><span>${fa(day.number)}${day.attended?`<i aria-hidden="true">${I.check}</i>`:''}</span><small>${day.today?'امروز':`روز ${fa(day.number)}`}</small></li>`).join('')}</ol></section></div>`;
}
