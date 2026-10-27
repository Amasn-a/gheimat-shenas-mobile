// Animate live keyed elements only. No cloned text, ghost surfaces or inherited old strokes.
export const reducedMotion=()=>!!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches);
const EASE='cubic-bezier(.22,.75,.25,1)';
let MO=null;
export const running=()=>!!MO;
export const remaining=()=>MO?Math.max(0,MO.ms-(performance.now()-MO.t0)):0;
export function end(){MO?.end();}
function boxOf(root,el){const p=root.getBoundingClientRect(),k=p.width/root.offsetWidth||1,r=el.getBoundingClientRect();return {x:(r.left-p.left)/k,y:(r.top-p.top)/k,w:r.width/k,h:r.height/k};}
export function snapshot(root){
 const out=new Map();root.querySelectorAll('[data-m]').forEach(el=>{out.set(el.dataset.m,{r:boxOf(root,el),fx:el.dataset.mfx||'fade',text:el.textContent});});return out;
}
export function morph(root,before,ms,onEnd){
 end();if(reducedMotion()){onEnd?.();return;}
 const after=new Map();root.querySelectorAll('[data-m]').forEach(el=>after.set(el.dataset.m,el));
 root.classList.add('is-card-moving');
 const anims=[];
 const animate=(el,frames,duration=ms)=>{anims.push(el.animate(frames,{duration,easing:EASE,fill:'none'}));};
 for(const [key,el] of after){
  const old=before.get(key),r=boxOf(root,el);
  if(!old){
   const parent=el.parentElement.closest('[data-m]');
   if(!parent||before.has(parent.dataset.m))animate(el,[{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'none'}],Math.min(ms,280));
   continue;
  }
  if(!/^(img:|ttl:|prc:)/.test(key))continue;
  const dx=(old.r.x+old.r.w)-(r.x+r.w),dy=old.r.y-r.y,moved=Math.abs(dx)+Math.abs(dy)>2;
  if(moved){
   // Uniform scaling keeps photographs and Persian glyphs undistorted.
   const scale=key.startsWith('img:')?Math.max(.5,Math.min(1.8,Math.min(old.r.w/(r.w||1),old.r.h/(r.h||1)))):1;
   animate(el,[{transformOrigin:'top right',transform:`translate(${dx}px,${dy}px) scale(${scale})`,opacity:.86},{transformOrigin:'top right',transform:'none',opacity:1}]);
  }else if(key.startsWith('prc:')&&old.text!==el.textContent){
   animate(el,[{opacity:.3,transform:'scale(.96)'},{opacity:1,transform:'scale(1)'}],220);
  }
 }
 const state={t0:performance.now(),ms,end(){if(MO!==state)return;clearTimeout(state.timer);for(const a of anims)a.cancel();root.classList.remove('is-card-moving');MO=null;onEnd?.();}};
 MO=state;state.timer=setTimeout(state.end,ms+25);
}
