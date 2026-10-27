import {BPM,BASS,CHORDS,MELODY,midi} from './music-score.mjs';
export const HAPTIC_PATTERNS={tap:10,start:[15,35,22],correct:18,wrong:[35,45,35],loss:[60,70,100],revive:[18,45,18],record:[20,35,20,35,65],checkpoint:[18,35,18,35,35],tick:9,urgent:14};
const NOTES={tap:[[520,0,.035]],start:[[392,0,.09],[587,.075,.16]],correct:[[659,0,.09],[880,.065,.13]],wrong:[[277,0,.11],[220,.09,.18]],loss:[[330,0,.16],[261.6,.14,.18],[196,.3,.34]],revive:[[392,0,.1],[493.9,.12,.12],[587.3,.25,.24]],record:[[659,0,.1],[784,.1,.1],[988,.2,.12],[1318,.32,.3]],checkpoint:[[523,0,.1],[659,.08,.1],[784,.16,.1],[1046,.24,.2]],tick:[[720,0,.035]],urgent:[[960,0,.045]]};
export function createFeedback({storage,createContext,visible=()=>true,haptic=()=>{},setIntervalFn=setInterval,clearIntervalFn=clearInterval}={}){
  let enabled=true,music=true,haptics=true,ctx=null,sfxBus=null,musicBus=null,unlocked=false,musicTimer=null,nextBeat=0,step=0,urgent=false,active=true;
  const effects=new Set(),musicVoices=new Set(),seen=new Set();
  try{enabled=storage?.getItem('pe.sound.enabled')!=='off';music=(storage?.getItem('pe.audio.music')|| (enabled?'on':'off'))!=='off';haptics=storage?.getItem('pe.audio.haptics')!=='off';}catch{}
  const save=(k,v)=>{try{storage?.setItem(k,v?'on':'off');}catch{}};
  const stopSet=set=>{for(const o of set){try{o.stop();}catch{}}set.clear();};
  function stopMusic(){if(musicTimer!==null)clearIntervalFn(musicTimer);musicTimer=null;stopSet(musicVoices);}
  function stop(){stopSet(effects);stopMusic();}
  function tone(hz,at,duration,bus,volume=.4,type='triangle',set=effects){
    const o=ctx.createOscillator(),g=ctx.createGain();o.type=type;o.frequency.setValueAtTime(hz,at);
    g.gain.setValueAtTime(.0001,at);g.gain.linearRampToValueAtTime(volume,at+.008);g.gain.exponentialRampToValueAtTime(.0001,at+duration);
    o.connect(g);g.connect(bus);set.add(o);o.onended=()=>{set.delete(o);o.disconnect();g.disconnect();};o.start(at);o.stop(at+duration+.025);
  }
  function scheduleMusic(){
    if(!music||!unlocked||!active||!visible()||ctx?.state!=='running')return;
    const beat=60/BPM;
    if(nextBeat<ctx.currentTime-.2){nextBeat=ctx.currentTime+.04;step=0;}
    while(nextBeat<ctx.currentTime+.18){
      const q=step%128,b=q/4,bar=Math.floor(b/4),chord=CHORDS[bar];
      if(q%4===0)tone(midi(BASS[bar]),nextBeat,.22,musicBus,.55,'sine',musicVoices);
      if(q%8===2)for(const n of chord)tone(midi(n),nextBeat,.16,musicBus,.12,'triangle',musicVoices);
      const note=MELODY.find(([offset])=>offset===b);
      if(note)tone(midi(note[1]),nextBeat,.24,musicBus,.35,'sine',musicVoices);
      if(q%4===2)tone(1600,nextBeat,.025,musicBus,.035,'triangle',musicVoices);
      step++;nextBeat+=beat/4;
    }
  }
  function syncMusic(){
    if(!music||!active||!visible()||!unlocked||ctx?.state!=='running'){stopMusic();return;}
    if(musicTimer===null){nextBeat=ctx.currentTime+.04;step=0;scheduleMusic();musicTimer=setIntervalFn(scheduleMusic,80);musicTimer?.unref?.();}
  }
  function unlock(){
    if(!visible())return;unlocked=true;
    try{
      if(!ctx&&(enabled||music)){ctx=createContext?.();if(!ctx)return;sfxBus=ctx.createGain();musicBus=ctx.createGain();sfxBus.gain.value=.09;musicBus.gain.value=.065;sfxBus.connect(ctx.destination);musicBus.connect(ctx.destination);}
      if(ctx?.state==='suspended')Promise.resolve(ctx.resume()).then(syncMusic).catch(()=>{});else syncMusic();
    }catch{ctx=null;unlocked=false;}
  }
  function setEnabled(v){enabled=!!v;save('pe.sound.enabled',enabled);if(!enabled)stopSet(effects);else unlock();return enabled;}
  function setMusic(v){music=!!v;save('pe.audio.music',music);if(music)unlock();else stopMusic();return music;}
  function setHaptics(v){haptics=!!v;save('pe.audio.haptics',haptics);return haptics;}
  function setActive(v){active=!!v;if(!active)stop();else syncMusic();}
  function setUrgent(v){if(urgent===v)return;urgent=v;if(musicBus&&ctx){musicBus.gain.cancelScheduledValues?.(ctx.currentTime);musicBus.gain.setTargetAtTime?.(urgent?.025:.065,ctx.currentTime,.12);}}
  function react(kind,{key,haptics:allowHaptics=true}={}){
    if(!NOTES[kind]||!visible())return false;const id=key&&`${kind}:${key}`;
    if(id&&seen.has(id))return false;if(id){seen.add(id);if(seen.size>180)seen.delete(seen.values().next().value);}
    if(haptics&&allowHaptics&&unlocked){try{haptic(kind);}catch{}}
    if(!enabled||!unlocked||ctx?.state!=='running')return false;
    try{const at=ctx.currentTime+.005;for(const [hz,offset,duration]of NOTES[kind])tone(hz,at+offset,duration,sfxBus,kind==='tick'?.23:kind==='urgent'?.32:.65,kind==='wrong'||kind==='loss'?'sine':'triangle');return true;}catch{return false;}
  }
  return {unlock,react,stop,setEnabled,setMusic,setHaptics,setActive,setUrgent,isEnabled:()=>enabled,settings:()=>({effects:enabled,music,haptics}),diagnostics:()=>({state:ctx?.state||'locked',unlocked,musicPlaying:musicTimer!==null,effectVoices:effects.size,musicVoices:musicVoices.size})};
}
export function soundControl(enabled=true){return `<button class="p-sound" data-act="sound-toggle" aria-label="تنظیمات صدا" aria-expanded="false" aria-controls="audio-options" title="موزیک، صدای بازی و ویبره"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m11 4-5 4H3v8h3l5 4V4Z"/>${enabled?'<path d="M15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/>':'<path d="m16 9 6 6m0-6-6 6"/>'}</svg></button>`;}
export function audioMenu(settings){const row=(key,label,sub)=>`<button class="p-audio-row" role="switch" aria-checked="${settings[key]}" data-act="audio-${key}"><span><b>${label}</b><small>${sub}</small></span><i aria-hidden="true"><em></em></i></button>`;return `<section class="p-audio-menu" id="audio-options" aria-label="تنظیمات صدا"><header><b>صدای بازی، به سلیقهٔ تو</b><button data-act="sound-close" aria-label="بستن تنظیمات صدا">×</button></header>${row('music','موزیک پس‌زمینه','یه ریتم آروم برای همراهی بازی')}${row('effects','صدای بازی','جواب‌ها، تایمر و برد و باخت')}${row('haptics','ویبره','بازخورد کوتاه برای اتفاق‌های بازی')}<button class="p-audio-test" data-act="test-setup">عوض کردن حالت تست</button></section>`;}
