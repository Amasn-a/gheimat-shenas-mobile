// Play entry (GitHub Pages). This Play-only redesign intentionally diverges from gheimat-shenas (src/, styles/, fonts/). This file
// does what the Super App and the backend do in production: it configures the host adapter for a plain browser and
// answers the player's API calls with the in-browser demo server (play/server.js). Public entry: no configuration or developer controls.
import { HAPTIC_PATTERNS } from '../src/feedback.mjs?v=ba94ef0d5297';
import { buildSharePayload } from '../src/share-payload.mjs?v=ba94ef0d5297';
import { splash, BOOT_ERROR } from '../src/launch.js?v=ba94ef0d5297';   // first: the splash mounts before anything else loads
import { configureHost } from '../src/host.js?v=ba94ef0d5297';
import { install, API_ORIGIN, setCatalog } from './server.js?v=ba94ef0d5297';

const app = document.getElementById('app');
const rev = document.documentElement.dataset.release || document.documentElement.dataset.source || '';

window.PE_API_BASE = API_ORIGIN;
configureHost({
  getToken: async () => 'demo',                  // demo account: no Digikala login is used or needed
  refreshToken: async () => 'demo',
  // Browser-only demo adapter. Native production haptics still use the supplied host bridge.
  haptic: kind => {
    if(document.visibilityState!=='visible'||typeof navigator.vibrate!=='function')return;
    const pattern=HAPTIC_PATTERNS[kind];
    if(pattern)try{navigator.vibrate(pattern);}catch{}
  },
  openProduct: async url => { const w = window.open(url, '_blank'); if (w) { try { w.opener = null; } catch (e) { /* cross-origin */ } } return !!w; },
  share: async ({blob,text,url}) => {
    const payload=buildSharePayload(blob,text,url);
    if(navigator.canShare&&navigator.canShare(payload)) {
      try{await navigator.share(payload);return 'sent';}catch(e){return e.name==='AbortError'?'cancelled':'unsupported';}
    }
    return 'unsupported';
  },
});

try {
  const res = await fetch('play/catalog.json?v=' + rev, { cache: 'no-cache' });
  if (!res.ok) throw new Error('catalog ' + res.status);
  setCatalog(await res.json());
} catch (e) {
  app.innerHTML = '<p style="color:#23252B;font:600 16px/1.8 Digikala;text-align:center;padding:40vh 24px 0">نسخهٔ نمایشی بارگذاری نشد. صفحه را دوباره باز کن.</p>';
  splash.showError(BOOT_ERROR, () => location.reload());   // the demo catalog is part of boot: never reveal home without it
  throw e;
}
install();

await import('../src/main.js?v=ba94ef0d5297');
