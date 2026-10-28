import { HAPTIC_PATTERNS } from './feedback.mjs?v=183490631a6f';
import { buildSharePayload, GAME_URL, singleShareLink } from './share-payload.mjs?v=183490631a6f';
// Host adapter: every Super App interaction goes through here. The bridge contract (login token handover, back/close,
// device id, haptics, share, deep link, WebView floor) is with the app team (D09) and is NOT in the supplied
// sources, so no bridge object name or URL scheme is invented. The integration supplies an implementation through
// configureHost(); until then each capability falls back to a browser behaviour or reports itself unsupported.
let impl = {};

export function configureHost(i) { impl = i || {}; }

export const capabilities = () => ({
  token: typeof impl.getToken === 'function',
  share: typeof impl.share === 'function' || !!(navigator.canShare && navigator.share),
  haptics: typeof impl.haptic === 'function',            // no vibration fallback: haptics only through the approved bridge (R-10)
  productLink: typeof impl.openProduct === 'function',
  back: typeof impl.onBack === 'function',
});

export async function token() { return typeof impl.getToken === 'function' ? impl.getToken() : null; }
export async function refreshToken() { return typeof impl.refreshToken === 'function' ? impl.refreshToken() : null; }

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
let device = null;
export function deviceId() {
  if (device) return device;
  const fromHost = typeof impl.deviceId === 'function' ? impl.deviceId() : null;
  if (fromHost && UUID.test(fromHost)) return (device = fromHost.toLowerCase());
  try { const v = localStorage.getItem('pe.device'); if (v && UUID.test(v)) return (device = v); } catch (e) { /* storage blocked */ }
  device = crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-8xxx-xxxxxxxxxxxx'.replace(/x/g, () => (Math.random() * 16 | 0).toString(16));
  try { localStorage.setItem('pe.device', device); } catch (e) { /* the id then lives for this page only */ }
  return device;
}

export function haptic(kind) { if (typeof impl.haptic === 'function' && Object.hasOwn(HAPTIC_PATTERNS,kind)) impl.haptic(kind); }

/** Share the image together with a playable link (owner revision). Resolves 'sent' | 'cancelled' | 'unsupported'. */
export async function share(blob, text, url=GAME_URL) {
  const caption=singleShareLink(text,url);
  if (typeof impl.share === 'function') return impl.share({ blob, text:caption, url });
  const payload=buildSharePayload(blob,caption,url);
  if (navigator.canShare && navigator.canShare(payload)) {
    try { await navigator.share(payload); return 'sent'; } catch (e) { return e.name==='AbortError'?'cancelled':'unsupported'; }
  }
  return 'unsupported';
}

/** Product links are built from a product-id template on the server, never taken from free text. */
export async function openProduct(url) {
  if (!/^https:\/\/www\.digikala\.com\/product\/dkp-\d+\/$/.test(url)) return false;
  if (typeof impl.openProduct === 'function') return impl.openProduct(url);
  return !!window.open(url, '_blank', 'noopener,noreferrer');
}

const BACK_GUARD='__gheimatShenasBackGuard';
const isBackGuard=state=>state?.[BACK_GUARD]===1||(state?.pe===1&&Object.keys(state).length===1);
// A reload keeps the current history entry. Reuse that guard instead of adding
// another one, otherwise Home's exit can land on an older copy of the game.
let backHandler=null,guardPushed=isBackGuard(history.state),exiting=false,hostBackBound=false,exitBasePending=false,exitURL='';
function pushBackGuard(){history.pushState({[BACK_GUARD]:1},'');guardPushed=true;}
export function close() {
 exiting=true;
 if(typeof impl.close==='function'){impl.close();exiting=false;return;}
 // Older releases could leave several guards after reloads. Walk past those
 // owned entries and the app's base once, rather than assuming exactly two.
 exitBasePending=guardPushed||isBackGuard(history.state);exitURL=location.href;
 guardPushed=false;history.back();
}
export function setBackHandler(fn){
 backHandler=fn;exiting=false;
 if(typeof impl.onBack==='function'){
  if(!hostBackBound){hostBackBound=true;impl.onBack(()=>backHandler?backHandler():false);}return;
 }
 if(fn&&isBackGuard(history.state)){
  guardPushed=true;
  // Upgrade the older unnamespaced marker without adding a history entry.
  if(history.state?.[BACK_GUARD]!==1)history.replaceState({[BACK_GUARD]:1},'');
 }
 if(fn&&!guardPushed)pushBackGuard();
}
window.addEventListener('popstate',event=>{
 if(exiting){
  if(isBackGuard(event.state)){exitBasePending=true;exitURL=location.href;history.back();return;}
  if(exitBasePending&&location.href===exitURL){exitBasePending=false;history.back();return;}
  exiting=false;exitBasePending=false;return;
 }
 if(!guardPushed)return;
 guardPushed=false;
 const handled=backHandler&&backHandler();
 if(handled&&!exiting&&!guardPushed)pushBackGuard();
});

export async function copy(text) {
  try { await navigator.clipboard.writeText(text); return true; } catch (e) { /* fall back */ }
  const ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
  document.body.appendChild(ta); ta.select();
  let ok = false; try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
  ta.remove(); return ok;
}
