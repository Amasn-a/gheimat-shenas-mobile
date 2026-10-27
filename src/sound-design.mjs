// Original procedural sound palette. No external recordings or network requests.
// Short noise sweeps for motion, mallet transients, and a pitched vowel cheer.
export function createSoundPalette(ctx){
  const cache=new Map();
  function noiseBuffer(seconds){
    if(cache.has(seconds))return cache.get(seconds);
    const b=ctx.createBuffer(1,Math.ceil(ctx.sampleRate*seconds),ctx.sampleRate),d=b.getChannelData(0);let seed=1731;
    for(let i=0;i<d.length;i++){seed=(seed*16807)%2147483647;d[i]=(seed/2147483647)*2-1;}cache.set(seconds,b);return b;
  }
  function voice(source,bus,at,duration,volume,set,filter=null){
    const g=ctx.createGain();g.gain.setValueAtTime(.0001,at);g.gain.linearRampToValueAtTime(volume,at+.008);g.gain.exponentialRampToValueAtTime(.0001,at+duration);
    if(filter){source.connect(filter);filter.connect(g);}else source.connect(g);g.connect(bus);set.add(source);
    source.onended=()=>{set.delete(source);source.disconnect();filter?.disconnect();g.disconnect();};source.start(at);source.stop(at+duration+.03);return source;
  }
  function note(hz,at,duration,bus,volume,set,type='triangle',endHz=hz){
    const o=ctx.createOscillator();o.type=type;o.frequency.setValueAtTime(hz,at);if(endHz!==hz)o.frequency.exponentialRampToValueAtTime(endHz,at+duration*.85);return voice(o,bus,at,duration,volume,set);
  }
  function noise(at,duration,bus,volume,set,from=1000,to=3000,q=.7){
    const src=ctx.createBufferSource();src.buffer=noiseBuffer(duration+.05);const f=ctx.createBiquadFilter();f.type='bandpass';f.Q.value=q;f.frequency.setValueAtTime(from,at);f.frequency.exponentialRampToValueAtTime(to,at+duration*.9);return voice(src,bus,at,duration,volume,set,f);
  }
  function cheer(at,bus,set){
    // A brief, musical /yæ→ei/ vowel: rising pitch and moving formants, not speech playback.
    for(const [delay,shift,level]of [[0,1,.36],[.045,1.006,.22]]){
      const o=ctx.createOscillator();o.type='sawtooth';o.frequency.setValueAtTime(330*shift,at+delay);o.frequency.exponentialRampToValueAtTime(440*shift,at+delay+.19);o.frequency.exponentialRampToValueAtTime(420*shift,at+delay+.65);
      const filters=[[680,400,5],[1750,2350,7],[2600,2900,9]].map(([a,b,q])=>{const f=ctx.createBiquadFilter();f.type='bandpass';f.Q.value=q;f.frequency.setValueAtTime(a,at+delay);f.frequency.linearRampToValueAtTime(b,at+delay+.35);return f;});
      const sum=ctx.createGain();sum.gain.value=.65;for(const f of filters){o.connect(f);f.connect(sum);}const g=ctx.createGain();sum.connect(g);g.connect(bus);g.gain.setValueAtTime(.0001,at+delay);g.gain.linearRampToValueAtTime(level,at+delay+.06);g.gain.setValueAtTime(level*.7,at+delay+.37);g.gain.exponentialRampToValueAtTime(.0001,at+delay+.78);
      set.add(o);o.onended=()=>{set.delete(o);o.disconnect();filters.forEach(f=>f.disconnect());sum.disconnect();g.disconnect();};o.start(at+delay);o.stop(at+delay+.82);
    }
  }
  function effect(kind,at,bus,set){
    const n=(hz,offset,d,v=.6,type='triangle',end=hz)=>note(hz,at+offset,d,bus,v,set,type,end);
    const whoosh=(d=.24,v=.8)=>noise(at,d,bus,v,set,550,4700,1.1);
    switch(kind){
      case 'swoosh':whoosh();n(240,.025,.16,.16,'sine',750);break;
      case 'spotlight':noise(at,.12,bus,.28,set,900,3200);n(880,.045,.1,.23,'sine');break;
      case 'tap':n(650,0,.045,.65,'sine',390);noise(at,.025,bus,.16,set,1900,1200);break;
      case 'start':whoosh(.23,.45);[523,659,784].forEach((hz,i)=>n(hz,.06+i*.075,.23,.5));break;
      case 'correct':n(740,0,.095,.6,'sine',880);n(1318,.065,.24,.55);n(1760,.08,.18,.17,'sine');break;
      case 'wrong':n(210,0,.19,.7,'sine',120);n(167,.05,.16,.35,'triangle',110);noise(at,.075,bus,.24,set,600,300);break;
      case 'loss':[330,294,220].forEach((hz,i)=>n(hz,i*.14,.28,.4,'triangle'));n(110,.31,.38,.5,'sine');break;
      case 'revive':noise(at,.3,bus,.5,set,450,3400);[392,494,587,784].forEach((hz,i)=>n(hz,.09+i*.075,.25,.45));break;
      case 'record':cheer(at+.1,bus,set);[523,659,784,1047].forEach((hz,i)=>n(hz,i*.065,.27,.42));noise(at+.02,.12,bus,.35,set,2400,5000);[1568,2093].forEach((hz,i)=>n(hz,.6+i*.09,.28,.17,'sine'));break;
      case 'checkpoint':[523,659,784,1047].forEach((hz,i)=>n(hz,i*.08,.26,.42));n(1568,.31,.35,.17,'sine');break;
      case 'tick':n(1450,0,.035,.27,'sine',1000);noise(at,.02,bus,.09,set,3400,2600);break;
      case 'urgent':n(1780,0,.045,.34,'sine',1250);n(1450,.075,.025,.19,'sine');break;
      default:return false;
    }return true;
  }
  function percussion(kind,at,bus,set){
    if(kind==='kick'){note(135,at,.15,bus,.6,set,'sine',48);noise(at,.018,bus,.055,set,1800,900);}
    if(kind==='snare'){noise(at,.11,bus,.18,set,1800,1100);note(185,at,.07,bus,.14,set,'sine',145);}
    if(kind==='hat')noise(at,.035,bus,.075,set,8500,6500,.6);
    if(kind==='shaker')noise(at,.055,bus,.042,set,6200,4600,.5);
  }
  function pluck(hz,at,d,bus,v,set){note(hz,at,d,bus,v,set,'triangle');note(hz*2,at,d*.35,bus,v*.16,set,'sine');note(hz,at+.145,d*.75,bus,v*.14,set,'sine');}
  return {effect,percussion,pluck};
}
