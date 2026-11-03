export function rewardLabel(c){
 if(c?.rewardKind==='plus_code')return 'کد تخفیف پلاس';
 if(c?.rewardKind==='gold_card')return 'کارت طلای ۱۰۰ هزار تومانی';
 return c?.rewardAmount>0?new Intl.NumberFormat('fa-IR').format(c.rewardAmount)+' دیجی‌کوین':'بدون جایزه';
}
export function finalRewardLabel(r){return r?.kind==='coin'?new Intl.NumberFormat('fa-IR').format(r.amount)+' دیجی‌کوین':r?.kind==='plus_code'?'کد تخفیف پلاس':r?.kind==='gold_card'?'کارت طلای ۱۰۰ هزار تومانی':'بدون جایزه';}
