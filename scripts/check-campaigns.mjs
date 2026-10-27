import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { activeMarketingCampaign, campaignById, campaignDiscounts, campaignTime, MARKETING_CAMPAIGNS, isDigitalProduct } from '../src/marketing-campaign.js';
const now=Date.parse('2026-10-26T12:00:00Z');
const challenge={...MARKETING_CAMPAIGNS[0]}, offers={...MARKETING_CAMPAIGNS[1]};
const products={items:[{productId:'a',deal:{discountPercent:20}},{productId:'a',deal:{discountPercent:20}},{productId:'b',deal:{coinBack:2}},{productId:'c',deal:{discountPercent:10,endsAt:new Date(now-1).toISOString()}}]};
assert.equal(activeMarketingCampaign([challenge,offers],{now})?.type,'challenge');
assert.equal(activeMarketingCampaign([challenge,offers],{now,products})?.type,'offers');
assert.equal(campaignDiscounts(products,now).length,1,'Only unique, still-valid discounts of seen products qualify');
for(const feed of [null,[],[{...challenge,enabled:false}],[{...challenge,endsAt:new Date(now).toISOString()}],[{...challenge,startsAt:new Date(now+1).toISOString()}],[{...challenge,type:'unknown'}],[offers]])assert.equal(activeMarketingCampaign(feed,{now}),null);
assert.equal(campaignTime(new Date(now+1000).toISOString(),now).text,'۰۰:۰۰:۰۱');
assert.equal(campaignTime(new Date(now).toISOString(),now).expired,true);
assert.equal(campaignById(challenge.id,Date.parse(challenge.endsAt)),null,'Entry closes exactly at its deadline');
// Exercise the browser demo server at its normal HTTP boundary, without real network or real coins.
const clock=Date.now, interval=globalThis.setInterval, intervals=[];
Date.now=()=>now;
globalThis.setInterval=(...args)=>{const id=interval(...args);intervals.push(id);return id;};
const memory=new Map();globalThis.localStorage={getItem:k=>memory.get(k)||null,setItem:(k,v)=>memory.set(k,v)};
globalThis.window={fetch:()=>{throw new Error('Unexpected real network');}};
try {
 const { install,setCatalog,API_ORIGIN,net }=await import('../play/server.js');
 const catalog=JSON.parse(await readFile(new URL('../play/catalog.json',import.meta.url)));
 setCatalog(catalog);install();net.latencyMs=0;
 const headers={'Authorization':'Bearer demo','X-Device-Id':'11111111-1111-4111-8111-111111111111','Content-Type':'application/json'};
 const request=async(path,body,key=crypto.randomUUID())=>{
  const res=await window.fetch(API_ORIGIN+'/v1/gamification/price-expert'+path,{method:body===undefined?'GET':'POST',headers:{...headers,'Idempotency-Key':key},body:body===undefined?undefined:JSON.stringify(body)});
  return {status:res.status,body:await res.json()};
 };
 const bad=await request('/runs',{campaign_id:'missing'});assert.equal(bad.body.code,'CAMPAIGN_ENDED');
 const startKey=crypto.randomUUID(), started=await request('/runs',{campaign_id:challenge.id},startKey);
 assert.equal(started.status,201);const id=started.body.run.run_id;
 assert.equal((await request('/runs',{campaign_id:challenge.id},startKey)).body.run.run_id,id,'Start retries reuse the same run');
 assert.ok(isDigitalProduct(started.body.run.reference.display_title));
 assert.equal(started.body.run.category_label,challenge.categoryLabel);
 for(let n=0;n<8;n++){
  const r=await request(`/runs/${id}/reveal`,{now:true});const q=r.body.question;
  assert.ok(q,'A valid question exists');assert.ok(isDigitalProduct(q.product.display_title),'Every comparison stays in the chosen category');
  const product=catalog.find(p=>p[2]===q.product.display_title);
  const choice=product[4]>=r.body.reference.price?'higher':'lower';
  const answer=await request(`/questions/${q.question_id}/answer`,{choice});assert.equal(answer.body.result,'correct');
 }
 await request(`/runs/${id}/leave`,{});
 const standard=await request('/runs',{});assert.equal(standard.status,201);assert.equal(standard.body.run.category_label,null,'A category run does not change the next standard run');
 await request(`/runs/${standard.body.run.run_id}/leave`,{});
 const expiredClock=Date.parse(challenge.endsAt)+1;Date.now=()=>expiredClock;
 const expired=await request('/runs',{campaign_id:challenge.id});assert.equal(expired.body.code,'CAMPAIGN_ENDED');
 console.log('Campaigns: selection, absence, personal discounts, absolute expiry, category-only questions, idempotent entry and normal-run isolation passed.');
} finally {intervals.forEach(clearInterval);globalThis.setInterval=interval;Date.now=clock;}
