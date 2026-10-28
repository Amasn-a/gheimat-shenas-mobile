// Launch splash (mobile visual language): shown on every page boot, never between questions or on internal navigation.
// Imported first by play/boot.js so it mounts before anything else; main.js reuses the same instance (one module = one splash).
import { createPriceShenasSplash } from './splash.js?v=7afa2313a516';

export const splash = createPriceShenasSplash({
  artUrl: new URL('../assets/brand-smile-v2.png', import.meta.url).href,
  minVisibleMs: 2000,
});

export const BOOT_ERROR = 'بارگذاری انجام نشد. دوباره تلاش کن.';

/** Resolves with the next boot outcome game.js reports on #app (true = a real screen is showing). */
export const nextBoot = app => new Promise(res => app.addEventListener('qs:boot', e => res(e.detail.ok), { once: true }));

/** Waits for the first paint and the real boot; dismisses only on success. Retry re-runs the game's own boot (reads state, never starts a run or charges). */
export async function gate(app, firstBoot, boot) {
  const ok = await Promise.all([splash.ready, firstBoot]).then(([, ok]) => ok, () => null);
  if (ok === null) return;
  if (ok) return splash.complete();
  const retry = async () => { const next = nextBoot(app); boot(); if (!(await next)) throw new Error('boot'); splash.complete(); };
  splash.showError(BOOT_ERROR, retry);
}
