import {createSoundPalette} from './sound-design.mjs?v=e3889d140bf3';

// Game effects only: there is no background score, music bus, or audio scheduler.
export const AUDIO_LEVELS={effects:.21};
export const HAPTIC_PATTERNS={tap:10,start:[15,35,22],correct:18,wrong:[35,45,35],loss:[60,70,100],revive:[18,45,18],record:[20,35,20,35,65],checkpoint:[18,35,18,35,35],tick:9,urgent:14};
const EFFECTS=new Set(['tap','start','correct','wrong','loss','revive','record','checkpoint','tick','urgent','swoosh','spotlight','select-high','select-low','open','nav','back','share','claim','confirm']);

export function createFeedback({storage,createContext,visible=()=>true,haptic=()=>{}}={}){
  let enabled=true,haptics=true,ctx=null,sfxBus=null,unlocked=false,active=true,palette=null;
  const effects=new Set(),seen=new Set();
  try{enabled=storage?.getItem('pe.sound.enabled')!=='off';haptics=storage?.getItem('pe.audio.haptics')!=='off';}catch{}
  const save=(k,v)=>{try{storage?.setItem(k,v?'on':'off');}catch{}};
  function stop(){for(const voice of effects){try{voice.stop();}catch{}}effects.clear();}
  function syncVolume(){
    if(!sfxBus)return;
    sfxBus.gain.cancelScheduledValues?.(ctx.currentTime);
    sfxBus.gain.value=enabled?AUDIO_LEVELS.effects:0;
  }
  function unlock(){
    if(!visible())return;
    // A user gesture also unlocks haptics when audio is muted or unavailable.
    unlocked=true;
    if(!enabled)return;
    try{
      if(!ctx){
        ctx=createContext?.();if(!ctx)return;
        sfxBus=ctx.createGain();palette=createSoundPalette(ctx);syncVolume();
        const limiter=ctx.createDynamicsCompressor();
        limiter.threshold.value=-14;limiter.knee.value=12;limiter.ratio.value=5;limiter.attack.value=.004;limiter.release.value=.18;
        sfxBus.connect(limiter);limiter.connect(ctx.destination);
      }
      if(ctx.state==='suspended')Promise.resolve(ctx.resume()).catch(()=>{});
    }catch{ctx=null;sfxBus=null;palette=null;}
  }
  function setEnabled(v){
    enabled=!!v;save('pe.sound.enabled',enabled);syncVolume();
    if(enabled)unlock();else stop();
    return enabled;
  }
  function setHaptics(v){haptics=!!v;save('pe.audio.haptics',haptics);return haptics;}
  function setActive(v){active=!!v;if(!active)stop();}
  // Retained for timer callers; urgency is conveyed by the individual effect.
  function setUrgent(){}
  function react(kind,{key,haptics:allowHaptics=true}={}){
    if(!EFFECTS.has(kind)||!active||!visible())return false;
    const id=key&&`${kind}:${key}`;
    if(id&&seen.has(id))return false;
    if(id){seen.add(id);if(seen.size>180)seen.delete(seen.values().next().value);}
    if(HAPTIC_PATTERNS[kind]&&haptics&&allowHaptics&&unlocked){try{haptic(kind);}catch{}}
    if(!enabled||!unlocked||ctx?.state!=='running'||!palette)return false;
    try{return palette.effect(kind,ctx.currentTime+.005,sfxBus,effects);}catch{return false;}
  }
  return {unlock,react,stop,setEnabled,setHaptics,setActive,setUrgent,isEnabled:()=>enabled,
    settings:()=>({effects:enabled,music:false,haptics}),
    diagnostics:()=>({state:ctx?.state||'locked',unlocked,musicPlaying:false,effectVoices:effects.size,musicVoices:0})};
}

export function soundControl(enabled=true){
  const label=enabled?'قطع صدای بازی':'روشن کردن صدای بازی';
  return `<button class="p-sound${enabled?'':' is-muted'}" data-act="sound-toggle" aria-label="${label}" aria-pressed="${enabled}" title="${label}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m11 4-5 4H3v8h3l5 4V4Z"/>${enabled?'<path d="M15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/>':'<path d="m16 9 6 6m0-6-6 6"/>'}</svg></button>`;
}

export function buttonCueFor(action){
 if(action==='ans-higher'||action==='learn-higher')return 'select-high';
 if(action==='ans-lower'||action==='learn-lower')return 'select-low';
 if(action==='reveal')return 'open';
 if(['cp-go','start','play-again'].includes(action))return 'confirm';
 return null;
}
