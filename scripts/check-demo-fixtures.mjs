import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const realInterval=globalThis.setInterval,intervals=[];globalThis.setInterval=(...a)=>{const id=realInterval(...a);intervals.push(id);return id;};
const memory=new Map();globalThis.localStorage={getItem:k=>memory.get(k)||null,setItem:(k,v)=>memory.set(k,v)};globalThis.window={fetch:()=>{throw Error('Unexpected network')}};
try{
 const {install,setCatalog,API_ORIGIN,net,reviewer}=await import('../play/server.js');const catalog=JSON.parse(await readFile(new URL('../play/catalog.json',import.meta.url)));setCatalog(catalog);install();net.latencyMs=0;
 const headers={Authorization:'Bearer demo','X-Device-Id':'11111111-1111-4111-8111-111111111111','Content-Type':'application/json'};
 const req=async(path,body,key=crypto.randomUUID())=>{const r=await window.fetch(API_ORIGIN+'/v1/gamification/price-expert'+path,{method:body===undefined?'GET':'POST',headers:{...headers,'Idempotency-Key':key},body:body===undefined?undefined:JSON.stringify(body)});return {status:r.status,body:await r.json()};};
 const seed=(extra={})=>reviewer.configure({revive:true,balance:12,record:0,streak:0,playsLeft:10,firstVisit:false,badgeCounts:{},...extra});
 seed({revive:false,balance:2,record:9,streak:14,badgeCounts:{cp_5:3}});let boot=(await req('/bootstrap')).body;
 assert.equal(boot.balance,2);assert.equal(boot.record,9);assert.equal(boot.quota.plays_left,10);assert.equal(boot.config.continue_rule.enabled,false);assert.equal(boot.config.continue_rule.cap,0);assert.equal(boot.daily_reward.amount,3);assert.equal(boot.badge_counts[0].count,3);
 let run=(await req('/runs',{})).body.run;let reveal=(await req(`/runs/${run.run_id}/reveal`,{now:true})).body;let q=reveal.question,p=catalog.find(p=>p[3]===q.product.image_url),choice=p[4]>reveal.reference.price?'lower':'higher';
 let answer=(await req(`/questions/${q.question_id}/answer`,{choice})).body;assert.equal(answer.run.state,'FINISHED','Without-revive mode finishes at the miss');assert.equal(answer.run.no_offer_reason,'disabled');
 seed();run=(await req('/runs',{})).body.run;
 for(let i=0;i<5;i++){reveal=(await req(`/runs/${run.run_id}/reveal`,{now:true})).body;q=reveal.question;p=catalog.find(p=>p[3]===q.product.image_url);choice=p[4]>=reveal.reference.price?'higher':'lower';const key=crypto.randomUUID();answer=(await req(`/questions/${q.question_id}/answer`,{choice},key)).body;assert.equal(answer.result,'correct');const retry=await req(`/questions/${q.question_id}/answer`,{choice},key);assert.equal(retry.body.run.score,i+1);}
 assert.equal((await req('/bootstrap')).body.badge_counts[0].count,1,'One count for a crossing, even with answer retries');
 reveal=(await req(`/runs/${run.run_id}/reveal`,{now:true})).body;q=reveal.question;p=catalog.find(p=>p[3]===q.product.image_url);choice=p[4]>reveal.reference.price?'lower':'higher';answer=(await req(`/questions/${q.question_id}/answer`,{choice})).body;assert.equal(answer.run.state,'AWAITING_OFFER');
 const offer=(await req(`/runs/${run.run_id}/offer`,{})).body.offer,key=crypto.randomUUID();const bought=await req(`/offers/${offer.offer_id}/continue`,{},key);assert.ok([200,201,202].includes(bought.status));await req(`/offers/${offer.offer_id}/continue`,{},key);assert.equal((await req('/bootstrap')).body.balance,7,'Extra-life retries charge five coins once');
 console.log('Fixtures: exact wallet/record/quota, weekly reward, both revive modes, badge crossing idempotency and single debit passed.');
}finally{intervals.forEach(clearInterval);globalThis.setInterval=realInterval;}
