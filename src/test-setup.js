import {fa} from './fmt.js?v=e3889d140bf3';
const titles=['قیمت‌شناس','تریدر','بازاری','تاجر'],ids=['cp_5','cp_10','cp_15','cp_20'];
export function configureDemo(reviewer){
 return new Promise(resolve=>{
  const v=reviewer.snapshot(),box=document.createElement('div');box.className='p-test-setup';box.dir='rtl';
  box.innerHTML=`<main><header><img src="assets/digikala-logo.svg" alt="دیجی‌کالا"><span>قیمت‌شناس · نسخهٔ نمایشی</span></header><h1>این بار چه حالتی رو تست کنیم؟</h1><p class="p-test-lead">وضعیت کاربر رو انتخاب کن، بعد برو سراغ صفحه‌ای که می‌خوای ببینی.</p><form><div class="p-test-presets" aria-label="حالت‌های آماده"><button type="button" data-preset="new">کاربر تازه</button><button type="button" data-preset="near">نزدیک نشان بعدی</button><button type="button" data-preset="pro">کاربر حرفه‌ای</button></div><div class="p-test-fields">${[['balance','موجودی دیجی‌کوین',v.balance,1000000],['record','بهترین رکورد',v.record,10000],['streak','روزهای استریک',v.streak,365],['playsLeft','شانس باقی‌مانده',v.playsLeft,100],['score','امتیاز دست آزمایشی',0,100]].map(([key,label,value,max])=>`<label>${label}<input name="${key}" type="number" min="0" max="${max}" step="1" value="${value}" required inputmode="numeric"></label>`).join('')}<label>صفحهٔ شروع<select name="screen"><option value="home">خانه</option><option value="game">وسط بازی</option><option value="badges">نشان‌ها</option><option value="rewards">جوایز</option><option value="streak">حضور روزانه</option><option value="result">پایان دست</option></select></label></div><fieldset class="p-test-counts"><legend>تعداد دریافت هر نشان</legend>${ids.map((id,i)=>`<label>${titles[i]}<input type="number" name="${id}" min="0" max="9999" step="1" value="${v.badgeCounts[id]||0}" inputmode="numeric" required></label>`).join('')}</fieldset><label class="p-test-first"><input type="checkbox" name="firstVisit" ${v.firstVisit?'checked':''}>تمرین اولین ورود رو هم ببینم</label><p class="p-test-hint">این‌ها فقط دادهٔ نمایشی همین مرورگرند. «ساخت این حالت» وضعیت قبلی تست رو جایگزین می‌کنه.</p><p class="p-test-error" role="alert" hidden></p><button type="submit" class="q-btn q-btn--primary">ساخت این حالت و ورود به بازی</button><button type="button" class="p-test-continue">ادامه با وضعیت قبلی</button></form></main>`;
  const behind=[document.getElementById('app'),document.querySelector('.ps-splash')].filter(Boolean);behind.forEach(el=>el.inert=true);
  document.body.appendChild(box);box.querySelector('h1').tabIndex=-1;box.querySelector('h1').focus();
  const form=box.querySelector('form'),field=name=>form.elements.namedItem(name),error=box.querySelector('.p-test-error');
  const finish=value=>{behind.forEach(el=>el.inert=false);box.remove();resolve(value);};
  const update=()=>{};
  box.querySelectorAll('[data-preset]').forEach(button=>button.addEventListener('click',()=>{
    const preset=button.dataset.preset,o=preset==='new'?{balance:0,record:0,streak:0,playsLeft:100,score:0,screen:'home',count:0}:preset==='near'?{balance:10,record:8,streak:6,playsLeft:10,score:4,screen:'game',count:1}:{balance:1001,record:24,streak:14,playsLeft:100,score:12,screen:'badges',count:3};
    for(const [key,value]of Object.entries(o))if(field(key))field(key).value=value;
    field('firstVisit').checked=preset==='new';ids.forEach((id,i)=>field(id).value=preset==='pro'?3:preset==='near'&&i===0?1:0);update();
  }));
  form.addEventListener('submit',async e=>{
    e.preventDefault();if(!form.reportValidity())return;
    const data=new FormData(form),opts={revive:false,balance:Number(data.get('balance')),record:Number(data.get('record')),streak:Number(data.get('streak')),playsLeft:Number(data.get('playsLeft')),score:Number(data.get('score')),screen:data.get('screen'),firstVisit:!!data.get('firstVisit'),badgeCounts:Object.fromEntries(ids.map(id=>[id,Number(data.get(id))]))};
    if(opts.firstVisit&&opts.screen!=='home'){error.hidden=false;error.textContent='برای دیدن صفحهٔ انتخابی، تیک تمرین اولین ورود رو بردار یا صفحهٔ خانه رو انتخاب کن.';return;}
    if(['game','result'].includes(opts.screen)&&opts.playsLeft===0){error.hidden=false;error.textContent='برای ساخت دست آزمایشی، حداقل یک شانس بذار.';return;}
    const button=form.querySelector('[type=submit]');button.disabled=true;button.setAttribute('aria-busy','true');button.innerHTML='<span class="q-spin"></span><span>در حال ساخت حالت تست…</span>';
    reviewer.configure(opts);finish(opts);
  });
  box.querySelector('.p-test-continue').addEventListener('click',()=>finish(null));
 });
}
