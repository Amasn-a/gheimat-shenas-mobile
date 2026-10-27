// Daily attendance, introductory rewards once, then permanent seven-day reward cycles.
const add = (date,n) => {const d=new Date(date+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10);};
export function firstWeekCompletion(dates) {
  const all=[...new Set(dates)].sort();let count=0,previous=null;
  for(const date of all){count=previous&&add(previous,1)===date?count+1:1;if(count>=7)return date;previous=date;}
  return null;
}
export function streakProgress(dates,today,completedAt=null) {
  const all=[...new Set(dates.filter(d=>d<=today))].sort(), attended=new Set(all);
  const last=all.at(-1), todayAttended=attended.has(today);
  let streakDays=0;
  if(last===today||last===add(today,-1))for(let d=last;attended.has(d);d=add(d,-1))streakDays++;
  const firstWeekCompletedAt=completedAt||firstWeekCompletion(all);
  const mode=firstWeekCompletedAt&&today>firstWeekCompletedAt?'weekly':'daily';
  const cycleDay=streakDays?(todayAttended?(streakDays-1)%7+1:streakDays%7):0;
  return {streakDays,todayAttended,mode,cycleDay,todayCell:todayAttended?cycleDay:cycleDay+1,
    firstWeekCompletedAt,firstWeekCompleted:!!firstWeekCompletedAt,rewardAmount:mode==='weekly'?3:1,
    daysToReward:mode==='weekly'?(cycleDay===7?7:7-cycleDay):todayAttended?1:0};
}
export function streakRewardForDay(dates,date,completedAt=null) {
  const progress=streakProgress(dates,date,completedAt);
  return progress.mode==='daily'?1:progress.streakDays>0&&progress.streakDays%7===0?3:0;
}
