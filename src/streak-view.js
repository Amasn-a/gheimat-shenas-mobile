import {fa} from './fmt.js';
import {I} from './icons.js';
export function renderStreakSheet(d,ui,h){
 const days=(d.days||[]).slice(-7);
 const fallback=Array.from({length:7},(_,i)=>({attended:i<(d.schedule?.cycleDay||0),today:i===(d.schedule?.cycleDay||1)-1}));
 const list=days.length?days:fallback;
 return `<div class="q-scrim q-modal"><section class="q-sheet q-daily p-streak" role="dialog" aria-modal="true" aria-labelledby="daily-t"><button class="q-iconbtn modal-close" data-act="daily-close" aria-label="بستن حضور روزانه">${I.x}</button><h2 id="daily-t">حضور تو در بازی</h2><p class="streak-summary">${fa(d.streakDays||0)} روز پشت‌سرهم</p><ol class="p-streak-days" aria-label="حضور در هفت روز اخیر">${list.map((day,i)=>`<li class="${day.attended?'is-done':''} ${day.today?'is-current':''}" aria-label="${day.today?'امروز':`روز ${fa(i+1)}`}، ${day.attended?'حضور داشته‌ای':'حضور ثبت نشده'}"><span>${fa(day.date?new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Tehran',day:'numeric'}).format(new Date(day.date+'T12:00:00Z')):i+1)}</span><small>${day.today?'امروز':day.attended?'حاضر':''}</small></li>`).join('')}</ol></section></div>`;
}
