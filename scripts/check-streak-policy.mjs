import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { firstWeekCompletion, streakProgress, streakRewardForDay } from '../play/streak-policy.mjs';
const date=n=>new Date(Date.UTC(2026,8,n,12)).toISOString().slice(0,10);
assert.equal(firstWeekCompletion(Array.from({length:7},(_,i)=>date(i+1))),date(7));
assert.equal(firstWeekCompletion([date(1),date(2),date(4),date(5),date(6),date(7),date(8)]),null);
assert.equal(streakProgress([date(1)],date(3),date(0)).streakDays,0);
assert.equal(streakProgress([date(1)],date(3),date(0)).mode,'weekly','Graduation survives absence');
assert.equal(streakRewardForDay([date(1)],date(1),null),1);
const actualNow=Date.now,originalInterval=globalThis.setInterval,intervals=[];
let now=Date.parse(date(1)+'T12:00:00Z');Date.now=()=>now;
globalThis.setInterval=(...args)=>{const id=originalInterval(...args);intervals.push(id);return id;};
const memory=new Map();globalThis.localStorage={getItem:k=>memory.get(k)||null,setItem:(k,v)=>memory.set(k,v)};globalThis.window={fetch:()=>{throw new Error('Unexpected network');}};
try {
 const {install,setCatalog,API_ORIGIN,net}=await import('../play/server.js');
 setCatalog(JSON.parse(await readFile(new URL('../play/catalog.json',import.meta.url))));install();net.latencyMs=0;
 const headers={Authorization:'Bearer demo','X-Device-Id':'11111111-1111-4111-8111-111111111111','Content-Type':'application/json'};
 const request=async(path,body,key=crypto.randomUUID())=>{const res=await window.fetch(API_ORIGIN+'/v1/gamification/price-expert'+path,{method:body===undefined?'GET':'POST',headers:{...headers,'Idempotency-Key':key},body:body===undefined?undefined:JSON.stringify(body)});const json=await res.json();assert.ok(res.ok,JSON.stringify(json));return json;};
 let total=0;
 for(const day of [...Array.from({length:21},(_,i)=>i+1),...Array.from({length:7},(_,i)=>i+23)]) {
  now=Date.parse(date(day)+'T12:00:00Z');
  const before=await request('/bootstrap');
  if(day===23){assert.equal(before.daily_reward.streak_days,0);assert.equal(before.daily_reward.schedule.mode,'weekly');}
  const run=await request('/runs',{});await request(`/runs/${run.run.run_id}/leave`,{});
  // Multiple finished runs in one day cannot advance attendance or create another award.
  const second=await request('/runs',{});await request(`/runs/${second.run.run_id}/leave`,{});
  const daily=await request('/player/daily-reward');
  assert.equal(daily.streak_days,day<=21?day:day-22,'The counter advances daily, including non-reward days');
  const due=day<=7?1:[14,21,29].includes(day)?3:0;
  if(due){assert.equal(daily.state,'claimable');assert.equal(daily.amount,due);const key=crypto.randomUUID();await request('/player/daily-reward/claim',{},key);await request('/player/daily-reward/claim',{},key);total+=due;}
  else assert.notEqual(daily.state,'claimable','No daily award after the introductory week');
  const boot=await request('/bootstrap');assert.equal(boot.reward_history.total_coins,total);
 }
 const history=(await request('/bootstrap')).reward_history.items;
 assert.ok(history.some(r=>r.title==='جایزهٔ حضور ۷روزه'&&r.amount===3));
 assert.equal(total,16);
 console.log('Streak: seven daily awards, daily counting, 14/21-day rewards, absence reset with permanent weekly tier, claim idempotency and history passed.');
}finally{intervals.forEach(clearInterval);globalThis.setInterval=originalInterval;Date.now=actualNow;}
