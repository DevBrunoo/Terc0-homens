/* CUIÚDO — Trilha ambiente original. Sem MP3 externo, sem autoplay e sem
 * reprodução de melodias protegidas. Só toca após um toque do usuário.
 * Tecnologia Web Audio: pads suaves, notas delicadas e fade in/out.
 */
const cuiudoAmbient = (()=>{
 let context=null,master=null,clock=null,bar=0,nextBar=0,playing=false;
 let volume=0.22;
 const AudioCtor=()=>window.AudioContext||window.webkitAudioContext;
 const chords=[
  [174.61,220,261.63,329.63], // Fmaj7
  [146.83,174.61,220,293.66], // Dm7
  [196,246.94,293.66,369.99], // Gmaj9
  [130.81,196,246.94,329.63]  // Cmaj7
 ];
 const melodic=[
  [523.25,440,392,440],
  [349.23,440,523.25,440],
  [493.88,392,369.99,293.66],
  [392,329.63,293.66,261.63]
 ];
 const beat=60/66;
 function tone(freq,when,duration,level,shape='sine',attack=.18,release=.75){
  const osc=context.createOscillator(),env=context.createGain();
  osc.type=shape;osc.frequency.setValueAtTime(freq,when);
  env.gain.setValueAtTime(.00001,when);
  env.gain.exponentialRampToValueAtTime(Math.max(.0001,level),when+attack);
  env.gain.setValueAtTime(Math.max(.0001,level),when+Math.max(attack+.04,duration-release));
  env.gain.exponentialRampToValueAtTime(.00001,when+duration);
  osc.connect(env);env.connect(master);
  osc.start(when);osc.stop(when+duration+.02);
  osc.onended=()=>{try{osc.disconnect();env.disconnect();}catch{}};
 }
 function scheduleBar(t){
  const index=bar++%chords.length;
  const length=beat*4;
  chords[index].forEach((freq,j)=>{
    tone(freq,t+.02,length+.65,.011-j*.001,'sine',1.25,1.6);
    if(j===0)tone(freq/2,t,length+.6,.006,'triangle',.7,1.3);
  });
  melodic[index].forEach((freq,j)=>{
    // Notas espaçadas; descanso intencional no segundo pulso.
    if(j===1&&index%2===1)return;
    tone(freq,t+.18+j*beat,beat*2.1,.018,'sine',.035,.95);
    tone(freq*2,t+.18+j*beat,beat*1.2,.0028,'sine',.035,.85);
  });
 }
 function tick(){
  if(!context||!playing)return;
  const now=context.currentTime;
  if(nextBar<now-.2)nextBar=now+.09;
  while(nextBar<now+2.2){scheduleBar(nextBar);nextBar+=beat*4;}
 }
 async function start(){
  if(playing)return true;
  const Constructor=AudioCtor();
  if(!Constructor)return false;
  const c=new Constructor();context=c;
  master=c.createGain();master.gain.setValueAtTime(0,c.currentTime);master.connect(c.destination);
  try{await c.resume();}catch{await c.close();context=null;return false;}
  if(context!==c)return false;
  playing=true;bar=0;nextBar=c.currentTime+.08;
  master.gain.setTargetAtTime(volume,c.currentTime,.32);
  tick();clock=window.setInterval(tick,410);
  return true;
 }
 function stop(){
  if(!playing&&!context)return;
  playing=false;window.clearInterval(clock);clock=null;
  const c=context,g=master;context=null;master=null;
  if(c&&g){g.gain.setTargetAtTime(0,c.currentTime,.10);
   window.setTimeout(()=>c.close().catch(()=>{}),420);}
 }
 function setVolume(value){
  volume=Math.min(.5,Math.max(0,Number(value)||0));
  if(playing&&context&&master)master.gain.setTargetAtTime(volume,context.currentTime,.09);
 }
 return {start,stop,setVolume,isPlaying:()=>playing,isSupported:()=>Boolean(AudioCtor()),getVolume:()=>volume};
})();