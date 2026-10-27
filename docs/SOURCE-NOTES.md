# قیمت‌شناس · نسخهٔ مستقل اپ موبایل

نسخهٔ اپ با هدر و نوار تب ثابت، محتوای قابل اسکرول، تصویرسازی متحرک و دکمهٔ بزرگ شروع. نسخهٔ بلند قبلی در آدرس https://gheimat-shenas-play-redesign.digikala-5029.chatgpt.site حفظ شده است.

## معماری نسخهٔ اپ

- هدر ثابت: هویت بازی، راهنما با عنوان متنی و کنترل صدا؛ موجودی دیجی‌کوین از هدر حذف شده است.
- دسترسی‌های زیر هدر فقط در تب بازی: رکورد، استریک روزانه و مجموع جوایز؛ هرکدام قابل لمس و متصل به جزئیات مرتبط.
- تب بازی: کارت اختیاری کمپین زیر سه دسترسی، تصویرسازی و شروع بزرگ. در گوشی کوتاه، محتوا اسکرول می‌خورد.
- تب جوایز: مجموع دریافتی، حضور روزانه و تاریخچهٔ کامل با اسکرول؛ بدون صفحه‌بندی.
- تب نشان‌ها: رکورد و هر چهار نشان؛ با اسکرول در صورت کمبود ارتفاع.
- تب کالاها: شبکهٔ دو ستونی همهٔ کالاهای تخفیف‌دار، با اسکرول و بارگذاری تنبل عکس‌ها؛ بدون صفحه‌بندی.
- باتم‌نویگیشن ثابت؛ موقعیت اسکرول هر تب هنگام جابه‌جایی و باز و بسته‌شدن پنجره‌ها حفظ می‌شود.
- تنظیم کمپین‌ها: `dist/src/marketing-campaign.js`، با دو نوع `challenge` و `offers`. آرایهٔ خالی، `null`، `enabled: false` یا مهلت منقضی، کارت و فضای آن را حذف می‌کنند. اتصال به فید واقعی مارکتینگ هنوز وجود ندارد.

نمای تب‌ها و کمپین در اندازه‌های ۳۹۰×۸۴۴ و ۳۲۰×۵۶۸ بررسی شد؛ فهرست آزمایشی ۱۸تایی در عرض‌های ۳۹۰، ۳۶۰ و ۳۲۰ پیکسل بررسی شد. آخرین ردیف کالاها در گوشی کوتاه قابل دسترس است و نوار پایین ثابت می‌ماند. آزمون رندر برای تمام تب‌ها، حذف صفحه‌بندی و حالت غیرفعال یا خالی کمپین و آزمون موجود دفتر جوایز پاس شدند.

## فایل‌های نسخهٔ جدید

- [نمای اپ و معماری اطلاعات](dist/src/mobile-home.js)
- [چیدمان ثابت و واکنش‌گرا](dist/styles/mobile-app.css)
- [نمای هوم موبایل](output/app-home.jpg)
- [نمای جوایز](output/app-rewards.jpg)

این نسخه از منبع منتشرشدهٔ نسخهٔ قبلی با هویت میزبانی مستقل ساخته شده است. سوابق مرورگر بین دو آدرس منتقل نمی‌شوند. عددهای موجود در تصاویر پیش‌نمایش شامل داده‌های آزمایشی‌اند؛ حساب تازه از داده‌های خالی شروع می‌شود.

## اصلاحات بازبینی محصول

کارت‌های هر دو کالا در تمام ارتفاع‌ها افقی‌اند: تصویر سمت راست، عنوان و قیمت در ستون سمت چپ با متن راست‌چین. عکس روی سطح سفید با رنگ طبیعی دیده می‌شود؛ کالای دوم فقط از طریق برچسب و حاشیهٔ ملایم متمایز است. قیمت آشکارشده در بازخورد، تیره و ثابت می‌ماند و قانون قدیمی رنگ سفید کنار گذاشته شد.

در مودال باخت، قیمت کالاها حذف شد. «دیدن نتیجهٔ این دست» دکمهٔ اصلی، اولین کنترل و مقصد فوکوس اولیه است. خرید جون یک گزینهٔ ثانویه با مبلغ صریح است؛ منطق پرداخت و جلوگیری از کسر تکراری حفظ شده است.

در نتیجه، سه تصویر از کالاهای دیده‌شده با تخفیف یا بازگشت کوین و تعداد باقی‌مانده نمایش داده می‌شود. در عرض زیر ۳۶۰ پیکسل، دو تصویر و شمارش باقی‌مانده جایگزین می‌شود. تصاویر و درصدها از همان دادهٔ واقعی این دست می‌آیند؛ کلیک، فهرست کامل را باز می‌کند.

تصویر اصلی برند با الهام از لبخند دیجی‌کالا بازطراحی شد. همهٔ کاربردهای فعال در هوم، بین سؤال‌ها، نتیجه و کارت اشتراک‌گذاری به `brand-smile-v2.png` اشاره می‌کنند. پالت کل رابط تغییر نکرده و تصویر قدیمی نیز حفظ شده است.

بررسی این اصلاحات: حالت سؤال، پاسخ درست و غلط، مودال انتخاب و پرداخت، نتیجه و امتیاز صفر در عرض‌های ۳۹۰ و ۳۲۰ بررسی شدند. در ۳۲۰×۵۶۸ پیش‌نمایش کالاها و دکمه‌های نتیجه بدون اسکرول یا بریدگی جا می‌شوند. مسیر واقعی «دیدن نتیجه» بدون کسر سکه، فوکوس اولیه روی همان دکمه و رنگ تیرهٔ قیمت در ریشه و لایهٔ انیمیشن پاسخ درست بررسی شد.

- [هوم با تصویر لبخند](output/home-smile-v2.png)
- [کارت‌های افقی و بدون پوشش رنگی](output/game-cards-v2.png)
- [اولویت دیدن نتیجه در مودال](output/revive-result-primary-v2.png)
- [پیش‌نمایش کالاها در نتیجه](output/result-products-v2.png)

## بازنگری تجربهٔ بازی · ۲۶ اکتبر ۲۰۲۶

- مقایسه: دو کارت با تصاویر هم‌ارز، قیمت مشخص برای کالای اول و قیمت مخفی برای کالای دوم. چیدمان داخلی هر دو کارت افقی و تصویر سمت راست است؛ اندازهٔ تصویر بر اساس فضای موجود تنظیم می‌شود.
- زمان: شمارش معکوس برجسته بین دو کالا، نوار زمان واقعی و تأکید رنگی در سه ثانیهٔ آخر؛ مهلت واقعی همان ده ثانیه است.
- پاسخ: دو دکمهٔ بزرگ در بخش پایینی خود کارت کالای دوم قرار دارند. بعد از پاسخ، قیمت واقعی و درستی انتخاب در همان محل دیده می‌شوند. کالای پاسخ‌داده‌شده به جای کالای مرجع منتقل می‌شود.
- باخت: بازخورد ۱٫۴ ثانیه خوانا می‌ماند، سپس دلیل باخت و امتیاز این دست نمایش داده می‌شوند. خرید اختیاری با عنوان «یه جون دیگه · ۵ سکه» و توضیح حفظ امتیاز است؛ انصراف به نتیجه می‌رود. پرداخت موفق فقط یک بار سکه کسر می‌کند.
- پایان: امتیاز، بهترین رکورد، نشان کسب‌شده، جایزهٔ واقعی این دست و هدف بعدی محور صفحه‌اند. رکورد تازه با عنوان و حرکت کوتاه جشن گرفته می‌شود. حالت امتیاز صفر متن حمایتی دارد و ادعای برد نمی‌کند.
- اشتراک: کارت PNG با رکورد شخصی واقعی، نشان مربوط، تصویرسازی هوم، هویت دیجی‌کالا و نشانی همین نسخه ساخته می‌شود. ارسال تصویر همراه لینک، ذخیرهٔ تصویر و کپی لینک در دسترس‌اند؛ جزئیات در بخش اصلاحات ورود و پیشرفت آمده است.
- تکرار: «یه دست دیگه» از نتیجه، مستقیماً یک دست تازه با شانس روزانه شروع می‌کند؛ تمام قواعد سهمیه، پرداخت و پاسخ همچنان اعمال می‌شوند.

۱۲ حالت اصلی شامل انتظار، سؤال، زمان کم، درست، غلط، اتمام زمان، پیشنهاد ادامه، پرداخت، رکورد تازه، نتیجهٔ معمولی، امتیاز صفر و نشان در ۳۹۰×۸۴۴ و ۳۲۰×۵۶۸ بررسی شدند. کنترل‌ها بریده نمی‌شوند و نماهای اصلی اسکرول ندارند. حالت پرداخت کوتاه نیز بدون اسکرول بررسی شد. در بزرگ‌نمایی شدید یا ارتفاع کمتر از ۵۱۰ پیکسل، اسکرول اضطراری برای جلوگیری از حذف محتوا مجاز است.

مسیر واقعی در مبدأ جداگانهٔ آزمایشی بررسی شد: اتمام زمان، خرید یک جون (۱۰۰۰ به ۹۹۵ دیجی‌کوین آزمایشی)، پاسخ درست، پاسخ غلط، پایان با رکورد تازه، ساخت کارت رکورد و شروع دست جدید. خطای جاوااسکریپت مشاهده نشد. ارسال واقعی به دیگران انجام نشده است.

- [سبک و چیدمان بازی](dist/styles/mobile-game.css)
- [پیش‌نمایش مقایسه](output/game-comparison.png)
- [پیش‌نمایش رکورد و نتیجه](output/game-record.png)
- [پیش‌نمایش جون اضافه](output/game-revive.png)
- [حالت‌های بررسی محلی با دادهٔ نمونه](qa/game-states.html)؛ جزو فایل‌های منتشرشده نیست.

## پیاده‌سازی مشترک و سابقهٔ طرح

## فایل‌ها

- [صفحهٔ ورودی](dist/index.html)
- [نمای هوم و داده‌های زندهٔ بازی](dist/src/views.js)
- [طراحی واکنش‌گرا و حالت جایزهٔ روزانه](dist/styles/home-redesign.css)
- [تصویر کاراکتر با زمینهٔ شفاف](dist/assets/price-mascot.png)
- [پرامپت و مشخصات تصویرسازی](ART-DIRECTION.md)
- [پیش‌نمایش موبایل](output/preview-mobile.jpg)
- [پیش‌نمایش دسکتاپ](output/preview-desktop.jpg)

## محدودهٔ تغییر

کد عمومی بازی از https://amasn-a.github.io/gheimat-shenas-play/ و مخزن عمومی https://github.com/amasn-a/gheimat-shenas-play دریافت شده است. نسخهٔ اصلی روی GitHub تغییر نکرده است. این پوشه یک نسخهٔ مستقل برای بررسی طرح است.

منطق اصلی بازی، کالاها، زمان‌سنج، پاسخ‌ها، رکورد، سهمیه و جایزه‌ها حفظ شده‌اند؛ راهنما و آموزش اولیه با جریان تازه جایگزین شده‌اند. هوم و مسیر اصلی بازی بازطراحی شده‌اند و قاب‌های قدیمی از این صفحات کنار گذاشته شده‌اند. صفحهٔ مقایسه، بازخورد پاسخ، پیشنهاد جون اضافه، پایان دست و کارت اشتراک‌گذاری نیز با معماری و طراحی تازه پیاده‌سازی شده‌اند. آموزش اولیه و دکمهٔ راهنما هر دو به مسیر یادگیری تازه می‌رسند؛ آموزش قابل رد کردن است.

داده‌های این نسخه در فضای جداگانهٔ مرورگر نگهداری می‌شوند. همهٔ دیجی‌کوین‌ها آزمایشی هستند و پرداخت واقعی انجام نمی‌شود.

## بررسی

چیدمان هوم در دسکتاپ و عرض‌های موبایل ۳۹۰ و ۳۲۰ پیکسل بررسی شد. راهنما، کالاهای دیده‌شده، شروع بازی، ثبت پاسخ درست، پایان دست و نمایش رکورد و سهمیهٔ به‌روزشده بررسی شدند. خطای جاوااسکریپت در این جریان مشاهده نشد.

منبع‌های همگام‌شدهٔ پروژه دست‌نخورده مانده‌اند.

## استریک و تاریخچهٔ جوایز

دسترسی استریک زیر هدر، تعداد روزهای پشت‌سرهم را نشان می‌دهد و باتم‌شیت مشترک حضور و دریافت جایزه را باز می‌کند. روزها با شمارهٔ ۱ تا ۷ نمایش داده می‌شوند؛ قواعد فعلی در بخش اصلاحات ورود و پیشرفت آمده است.

تاریخچهٔ جوایز مبلغ، دلیل دریافت، زمان به وقت تهران و وضعیت واریز را نشان می‌دهد. مجموع جوایز دریافتی از موجودی کیف پول جداست. فهرست کامل در تب جوایز با اسکرول در دسترس است.

دفتر جوایز فقط پاداش‌های تأییدشده را ثبت می‌کند؛ برداشت، بازگشت پول و جوایز در حال بررسی در آن شمرده نمی‌شوند. جایزه‌های موفق قدیمی هنگام بارگذاری منتقل می‌شوند؛ سوابق مستقل از پاک‌سازی دست‌های قدیمی و با شناسهٔ یکتا حفظ می‌شوند.

حالت خالی، نمونهٔ پنج روز حضور، مهاجرت جایزهٔ قبلی، دریافت جایزه و به‌روزرسانی مجموع، گسترش و جمع کردن فهرست و نبود بیرون‌زدگی در عرض ۳۲۰ پیکسل بررسی شدند. بررسی مستقل فیلتر وضعیت، شمارش یکتا، جمع، ترتیب و ماندگاری سوابق در scripts/check-reward-history.mjs موفق بود.

- [پیش‌نمایش بخش‌های جدید در موبایل](output/home-activity-mobile.jpg)
- [پیش‌نمایش هوم به‌روزشده در دسکتاپ](output/home-activity-desktop.jpg)

عددهای پنج روز و جوایز پیش‌نمایش، داده‌های نمونهٔ ابزار بررسی هستند؛ حساب تازه با استریک صفر و تاریخچهٔ خالی شروع می‌شود.


## راهنما و وضعیت نشان‌ها · بازبینی جدید

- موجودی کیف پول از هدر هوم و نتیجه حذف شده است. جمع جوایز دریافتی زیر هدر باقی می‌ماند؛ موجودی در توضیح هزینهٔ جون اضافه برای تصمیم آگاهانه نمایش داده می‌شود.
- راهنما با رنگ‌ها، تصویر لبخند و دکمه‌های نسخهٔ موبایل بازطراحی شده است: سه قانون کوتاه و دو دسترسی مستقیم به نشان‌ها و انتخاب‌های بعد از باخت.
- تور خودکار قدیمی با تمرین تعاملی جایگزین شده است. کاربر ابتدا دو کالای نمونه را می‌بیند، خودش تایمر ده‌ثانیه‌ای را شروع می‌کند و یک پاسخ می‌دهد. نتیجهٔ درست، اشتباه یا پایان زمان همراه با قیمت و توضیح روشن تا انتخاب کاربر روی صفحه می‌ماند. ادامه، تکرار تمرین، بازگشت و شروع صریح بازی اصلی مسیرهای جدا دارند.
- تمرین فقط محلی است: درخواست شروع دست، برداشت شانس، خرج سکه یا ثبت جایزه نمی‌فرستد. همان مسیر در آموزش اولین ورود استفاده می‌شود؛ ثبت یا رد کردن آموزش از API موجود با امکان تلاش دوباره استفاده می‌کند.
- صفحهٔ نشان‌ها تعداد نشان‌های کسب‌شده را نشان می‌دهد. نشان فعلی برچسب سبز تمام‌عرض «نشان فعلی تو»، کادر پررنگ و تصویر کامل دارد؛ سایر نشان‌های کسب‌شده برچسب «کسب شده» دارند و نشان‌های قفل‌شده با متن «هنوز نگرفتی» و تصویر کم‌رنگ مشخص‌اند.

بررسی: یازده حالت آموزش و نشان‌ها در ۳۹۰×۸۴۴ و ۳۲۰×۵۶۸، بدون بریدگی کنترل‌ها بررسی شدند. در گوشی کوچک همهٔ صفحات راهنما بدون اسکرول جا می‌شوند. مسیر واقعی پاسخ درست، غلط، پایان زمان، بازگشت، شروع بازی اصلی، خروج از دست و رد کردن آموزش اولین ورود آزمایش شد. پس از تمرین‌های متعدد و رد کردن آموزش، سهمیه ۹۹ باقی ماند؛ فقط یک شروع صریح بازی اصلی از ۱۰۰ شانس اولیه کم کرد. خطای جاوااسکریپت در این جریان مشاهده نشد.

- [رندر و حالت‌های یادگیری](dist/src/learning.js)
- [سبک راهنما و برچسب نشان‌ها](dist/styles/learning.css)
- [پیش‌نمایش راهنما](output/guide-overview.png)
- [بازخورد تمرین](output/guide-practice-feedback.png)
- [وضعیت واضح نشان کسب‌شده؛ دادهٔ نمونه با رکورد ۸](output/earned-badges.png)


## ورود متحرک، برگشت و واکنش‌های بازی

اسپلش اول ورود و صحنهٔ آماده‌سازی دست با پس‌زمینهٔ کرم، لبخند قرمز فعلی، صفحهٔ سبز، حلقهٔ گردان و برچسب‌های شناور ساخته شده‌اند. تصاویر قدیمی حفظ شده‌اند و پالت اصلی تغییر نکرده است. اسپلش فقط در بوت صفحه اجرا می‌شود؛ ورود به تب‌ها آن را تکرار نمی‌کند. نمایش اولیه دست‌کم دو ثانیه از زمان قابل مشاهده طول می‌کشد و فقط پس از موفقیت بوت کنار می‌رود. تصویر تزئینی مانع ورود نیست و در صورت خطا یک لبخند سادهٔ جایگزین دارد. خطای اتصال و دکمهٔ تلاش دوباره حفظ شده‌اند. محتوای زیر اسپلش تا پایان آن غیرقابل تعامل است؛ کاهش حرکت سیستم نیز رعایت می‌شود.

در شروع صریح دست، به جای هوم با دکمهٔ غیرفعال، صحنهٔ آماده‌سازی مستقل نمایش داده می‌شود. این صحنه منتظر پاسخ واقعی سرور است و تأخیر اجباری به شروع دست اضافه نمی‌کند. سپس همان مقایسه و زمان‌های قبلی بازی ادامه می‌یابند.

هر سه تب جوایز، نشان‌ها و کالاها در ابتدای راست عنوان یک دکمهٔ برگشت دارند. دکمه بدون بارگذاری مجدد یا شروع دست به ابتدای خانه می‌رود، تب بازی را فعال می‌کند و فوکوس را به عنوان خانه می‌برد. جابه‌جایی معمول با باتم‌نویگیشن همچنان جای اسکرول هر تب را نگه می‌دارد. کنار آیکون راهنما، عنوان «راهنمای بازی» اضافه شده است.

صدای کوتاه و آرام فقط برای تأیید شروع دست، پاسخ درست، پاسخ اشتباه/پایان زمان و گرفتن نشان پخش می‌شود. صدای کلیک عمومی، موسیقی و بوق شمارش ثانیه وجود ندارد. صدا بعد از تعامل واقعی کاربر باز می‌شود؛ صدای معوق در شروع صفحه یا پس‌زمینه پخش نمی‌شود. رویدادهای تکراری شبکه با شناسهٔ دست، سؤال و نشان حذف می‌شوند. خاموش کردن صدا فوراً صداهای جاری را قطع می‌کند، روی هدر خانه و بازی در دسترس است و در مرورگر حفظ می‌شود. ویبره از آداپتر میزبان می‌گذرد؛ نسخهٔ نمایشی برای دستگاه‌های دارای Vibration API الگوهای کوتاه دارد. اتصال بومی نسخهٔ واقعی همچنان به پیاده‌سازی میزبان وابسته است؛ ویبرهٔ فیزیکی روی این محیط دسکتاپ قابل بررسی نیست.

بررسی‌های این نوبت: برگشت هر سه تب در مسیر واقعی، انتخاب تب خانه، اسکرول صفر، انتقال فوکوس و ثابت ماندن سهمیهٔ بازی تأیید شد. ماندگاری بی‌صدا پس از بارگذاری مجدد بررسی شد. هر چهار واکنش در AudioContext فعال مرورگر اجرا شدند و در حالت بی‌صدا هیچ نت جدیدی ساخته نشد. آزمون مستقل `scripts/check-feedback.mjs` مرزهای تعامل، تکرار شبکه، سکوت، ماندگاری، پس‌زمینه، فلگ ویبره و دستگاه بدون پشتیبانی را بررسی می‌کند. اسپلش، خطا، آماده‌سازی، هوم و سه تب در گوشی کوتاه ۳۲۰×۵۶۸ بدون بریدگی دکمه‌ها بررسی شدند؛ هدر صدادار بازی هم در همین اندازه جا می‌شود.

- [اسپلش جدید](output/splash-energy-v3.png)
- [آماده‌سازی دست](output/run-loading-v3.png)
- [برگشت کنار عنوان و عنوان راهنما](output/internal-back-v3.png)
- [رندر مشترک صحنهٔ متحرک](dist/src/entry-art.js)
- [موتور واکنش صوتی](dist/src/feedback.mjs)


## اتصال پاسخ به کالای دوم

دکمه‌های «گرون‌تره» و «ارزون‌تره» همراه با سؤال صریح «قیمت کالای دوم نسبت به کالای اول…» داخل کادر کالای دوم قرار دارند. یک جداکنندهٔ ظریف، اطلاعات کالا را از انتخاب‌ها جدا می‌کند. فضای تصویر دو کالا تقریباً برابر باقی می‌ماند؛ در نمای ۳۹۰×۸۴۴ ارتفاع تصویرها حدود ۲۴۶ و ۲۴۹ پیکسل است. این ساختار در سؤال، ثبت پاسخ، قطع اتصال، پاسخ درست، غلط و پایان زمان ثابت است؛ تمرین تعاملی نیز از همین الگو استفاده می‌کند.

بررسی: ده حالت شامل آماده‌سازی، سؤال، زمان کم، ثبت پاسخ، قطع اتصال، درست، غلط، پایان زمان و دو مودال باخت در اندازه‌های ۳۹۰×۸۴۴ و ۳۲۰×۵۶۸ بررسی شدند. دکمه‌ها داخل کارت دوم‌اند و در این ابعاد بیرون‌زدگی، بریدگی یا اسکرول صفحهٔ بازی مشاهده نشد. سؤال تمرین در گوشی کوتاه نیز بررسی شد. شروع، آشکار کردن کالا، ثبت انتخاب درست و دریافت بازخورد «درست گفتی!» در مسیر واقعی بازی تأیید شد؛ مسیر پایان زمان و دیدن نتیجه نیز بدون خرید جون اضافه بررسی شد.

- [پیش‌نمایش پاسخ داخل کارت دوم](output/answers-in-product-v4.png)

## Two timed campaign variants in the live home

The existing footprint is preserved: 86 px, or 80 px below 360 px width. The category challenge shows its category artwork, title, deadline and entry action. Personal offers show photos of products from the latest finished run, a discount mark and an explicit product count. Details open separately, without making the home card taller.

`MARKETING_CAMPAIGNS` is a demo feed with absolute deadlines that never reset on reload. A personal offer takes priority only when the player has actually seen unique products with a positive, still-valid discount. Cashback alone does not activate it. Otherwise the category challenge is selected. An empty, disabled, future or expired feed leaves no card or gap. While previous-run history loads, an inert placeholder prevents the campaign changing underneath an attempted tap.

The countdown updates only its own text, preserving scroll and focus; the last five minutes get a warm accent. Escape and the close button restore focus to the originating card. Challenge entry is explicit and uses one normal play, with no extra entry charge. An existing run must be completed first. The demo server validates the campaign before starting, persists its category on that run and selects only digital products. Entry expiration does not interrupt an admitted run. Subsequent standard runs use the full catalog again. The catalog lacks taxonomy IDs, so this prototype maps digital products from their titles; production must supply real category IDs, campaign dates and discounts. All coins and offers here remain simulated and are labeled as examples.

Validation: challenge, offers, empty, disabled, future and expired variants at 320, 390 and 570 px; exact card height, uncut titles, 44 px action affordances, no horizontal overflow and zero leftover gap when absent. Both detail sheets were checked on a short phone. Actual UI entry produced two digital products; the personal-offer detail displayed actual seen products. Escape dismissal and focus return passed. `scripts/check-campaigns.mjs` checks selection, personal discount filtering, exact expiry, eight consecutive digital questions, idempotent entry and normal-run isolation.

- [Challenge in home](output/campaign-home-challenge-v5.png)
- [Personal offers in home](output/campaign-home-offers-v5.png)
- [Variant rendering](dist/src/campaign-view.js)
- [Local visual fixtures](qa/campaign-states.html)


## اصلاحات ورود، حضور روزانه و پیشرفت

- پیش از اجرای جاوااسکریپت نیز پس‌زمینه کرم است؛ صفحهٔ آبی اولیه حذف شده است. تصویر متحرک اسپلش و صحنهٔ آماده‌سازی داخل فضای محدود خود قرار می‌گیرند و شعار، ردیف جدا دارد. کادر فوکوس فقط از عنوان نمایشی خانه حذف شده؛ فوکوس قابل مشاهدهٔ دکمه‌ها حفظ شده است.
- باتم‌شیت حضور، شمارش واقعی روزانه، روزهای شماره‌دار ۱ تا ۷، پاداش بعدی و وضعیت ثبت امروز را یک‌جا نشان می‌دهد. پایان حداقل یک دست در روز حضور را ثبت می‌کند. در هفت روز متوالی اول، هر روز ۱ دیجی‌کوین قابل دریافت است. پس از تکمیل این مرحله، پاداش برای همیشه هر ۷ روز متوالی ۳ دیجی‌کوین است. یک روز غیبت شمارش جاری را صفر می‌کند، اما مرحلهٔ پاداش روزانه دوباره فعال نمی‌شود. دریافت، پردازش، تأخیر، خطا و موفقیت همگی در همین پنجره نمایش داده می‌شوند.
- سابقهٔ هفت روز متوالی قبلی هنگام بارگذاری تشخیص داده می‌شود. جوایز تاریخی بازنویسی نمی‌شوند؛ دریافت تکراری یا چند دست در یک روز پاداش اضافه ایجاد نمی‌کند. عنوان پاداش هفتگی در دفتر جوایز مشخص است.
- دریافت نشان به پنجرهٔ کوتاه روی صحنهٔ بازی تبدیل شده است: همان تصویر اصلی نشان، تعداد پاسخ درست، جایزه و یک دکمهٔ ادامه. تصویرهای نشان‌ها تغییر نکرده‌اند. بازی پشت پنجره متوقف و غیرقابل تعامل است و ادامه، همان دست را با امتیاز حفظ‌شده باز می‌کند.
- کارت اشتراک‌گذاری، نام دیجی‌کالا با رنگ برند و نشانی همین بازی را داخل PNG دارد. ارسال، فایل تصویر را همراه عنوان، متن و لینک قابل باز کردن به مرورگر یا میزبان می‌دهد. اگر دستگاه ارسال ترکیبی را پشتیبانی نکند، پیام روشن و گزینه‌های ذخیرهٔ تصویر و کپی لینک نشان داده می‌شوند. لغو ارسال موفقیت محسوب نمی‌شود.
- کارت‌های کالا قیمت فعلی را دارند. برای تخفیف واقعی، قیمت اصلی خط‌خورده و قیمت نهایی با واحد تومان نمایش داده می‌شود؛ بازگشت کوین به‌تنهایی تخفیف قیمت محسوب نمی‌شود. داده‌های این نمونه شبیه‌سازی‌شده‌اند؛ نسخهٔ عملیاتی باید قیمت و تخفیف معتبر را از سرویس کالا دریافت کند.

بررسی: اسپلش در ۳۲۰×۵۶۸، ۳۹۰×۸۴۴، ۵۷۰×۸۵۳ و ۸۴۴×۳۹۰ بدون هم‌پوشانی شعار و تصویر بررسی شد. ۲۸ حالت حضور، کالا، اشتراک و چهار نشان در دو اندازهٔ گوشی بررسی شدند؛ کنترل‌ها بریده نمی‌شوند. رنگ صفحه پیش از اجرای اسکریپت و نبود کادر زرد عنوان بعد از اسپلش تأیید شد. مسیر واقعی پنج پاسخ درست، دریافت نشان، ادامهٔ همان دست، نتیجه، ساخت تصویر و کپی لینک، دریافت جایزهٔ روز اول و قیمت کالاهای دیده‌شده بررسی شد. ارسال به مخاطب بیرونی انجام نشده است؛ انتقال فایل همراه لینک در مرز مرورگر و میزبان با آزمون بررسی شد.

آزمون‌های `scripts/check-streak-policy.mjs` و `scripts/check-sharing-prices.mjs` موفق‌اند. اولی هفت روز نخست، جوایز روزهای ۱۴ و ۲۱، غیبت، شروع مجدد شمارش در مرحلهٔ هفتگی و جلوگیری از واریز تکراری را با سرویس نمونه بررسی می‌کند. دومی قیمت معتبر، خط‌خوردگی، نبود قیمت ساختگی و انتقال تصویر همراه لینک را بررسی می‌کند. آزمون‌های موجود تاریخچهٔ جوایز و کمپین نیز موفق‌اند.

- [چیدمان اسپلش](output/splash-layout-v6.png)
- [حضور هفتگی](output/streak-weekly-v6.png)
- [نشان در پنجرهٔ کوتاه](output/checkpoint-compact-v6.png)
- [کارت اشتراک با برند و لینک](output/share-digikala-v6.png)
- [قیمت کالاها](output/product-prices-v6.png)
- [قواعد مستقل استریک](dist/play/streak-policy.mjs)
- [نمای مشترک حضور روزانه](dist/src/streak-view.js)
- [قیمت‌گذاری کارت‌ها](dist/src/product-pricing.mjs)
- [حالت‌های بررسی محلی](qa/polish-states.html)


## Mobile update — 2026-10-27

- First visit lands at home. Start opens the existing local practice directly, with no run or chance consumed. Explicit confirmation records onboarding and starts the real run; cancellation leaves practice pending. Fresh demo accounts now start with onboarding incomplete.
- Revive mounts only when the server offer is ready. One persistent dialog survives balance, payment and unrelated screen updates, without repeated entrance animations. The upper-right close button declines the offer using the existing idempotent path; pending payment stays locked. All offer copy is centered.
- The comparison product uses a distinct green frame, surface and question panel. Offer, progress and result copy follow the requested Persian wording.
- Result products reuse the mobile products tab and return to the same run result.
- Sharing uses the finished run score and its own earned badge, including a zero score, even when the personal best is higher. PNG export: 1080×1920 (9:16); the central composition leaves space for Story interface overlays. The official logo is a local copy of https://www.digikala.com/statics/img/svg/logo.svg. QR resolves to the current Site URL; checked by decoding the exported-size QR.
- Native sharing includes the image, invitation caption and playable URL. Receiving apps determine which fields they accept; copy-invitation and image-download fallbacks are available. The application does not silently send a second share.
- Validation: existing feedback, streak, reward-history, campaign and sharing/price checks passed. Browser regression verifies first-start practice, no chance spent, explicit entry, persistent single offer dialog, current score 2 versus personal best 19, 1080×1920 export, image/caption/URL host payload, current product-tab markup and back navigation. Visual review uses 320×568, 360×640, 390×844 and 430×932 CSS viewports rather than physical device certification.


## Interaction, audio and reviewer update — 2026-10-27

- Replaced destructive screen updates with a keyed DOM patcher. Dialog headings, controls and images remain mounted during share preparation/sending, daily reward claims and wallet refreshes. Entrance animations no longer restart on state updates. Existing product-card transition keys remain supported.
- Loading is shown on the initiating control for start/resume/restart, reveal, share, daily claim, revive/decline and product retry. Share opens only after its image is ready. Removed the visible URL row; invite copying and caption/URL payload remain.
- Reveal accepts an explicit tap during automatic preparation and transition guards; auto preparation keeps the control clickable until the player requests immediate display. No duplicate reveal request is sent.
- Added an original 104 BPM Web Audio quiz loop with separate music, effects and haptics preferences. Correct, wrong, final loss, revive, record, checkpoint, main actions and final timer seconds have distinct cues. Audio requires a gesture; one scheduler is used, the music ducks in urgent countdown, and hidden pages stop it. Unsupported audio/haptics fail safely. No third-party recording was copied. A reliable audio reference from Quiz of Kings was unavailable, so exact auditory matching is not claimed.
- Added a pre-entry demo setup screen: with/without revive, wallet, record, streak, chances, current-run score, badge counts, first-visit practice and selected start screen. Presets and continuation of existing demo state are supported. This is explicitly local demo data; it does not configure a real backend. Removed the automatic 1000-coin wallet floor.
- Without-revive mode disables the rule and cap in the demo server, so a miss finishes without creating an offer or showing revive guide content.
- Badge awards are counted at authoritative checkpoint crossing, once even with repeated answer requests. Counts persist before pruning old runs. Legacy counts use retained runs and the known record as a conservative baseline; already-pruned historical data cannot be reconstructed. Four tiles fit 360×640 without scrolling (504px content and container); 320×568 scrolls naturally and has no horizontal overflow.
- A successful bootstrap clears a stale offline flag. Seeded weekly streak rewards use the actual reward policy.
- Validation: all CLI checks for feedback/music, streak, reward history, campaigns, sharing/prices and reviewer fixtures passed. Browser baseline and interaction regressions passed, including stable dialog/button identity, current-score share, reveal during prefetch, both revive modes and product retry. AudioContext reached running and independent music control was checked in the browser. Real device vibration, native WebView audio and actual messenger targets were not certified.
- Evidence and review: `output/GheimatShenas-Review-2026-10-27.html` and `output/review-v11/`. Browser test sources are under `qa/`; none of the QA entrypoints is included in `dist/`.


## Share card personal best — 2026-10-27

- The exported card now shows both the finished-run score and the overall personal best. The current score remains the larger yellow focal point; the personal best has its own labeled, smaller row.
- The record is the maximum of the current score, result record, bootstrap record and run record, so a newly set best is never shown lower than this run.
- Retained 1080×1920 output and Story clear areas. Rebalanced the main panel and paired the QR with invitation text to use the lower horizontal space while retaining separation between content groups.
- Verified the mascot and earned-badge variants visually; checked zero and new-best data cases. Sharing regression confirms a run score of 2 and a personal best of 19 are both passed to the image. The actual exported PNG was decoded at 1080×1920 and its QR resolves to the current Site.
- Preview evidence: `output/share-card-with-personal-best.png`. The local-only visual review fixture is `qa/share-card-record-layout.html`.
