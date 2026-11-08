/* CUIÚDO — três trilhas para a oração.
 * As gravações são mantidas em assets/audio, com créditos e licença.
 * A música de relaxamento é instrumental e ORIGINAL (Web Audio).
 * Nada toca automaticamente; o usuário escolhe e toca no botão.
 */
const cuiudoMusic=(()=>{
 const tracks=Object.freeze({
  catolico:{
   id:'catolico',src:'./assets/audio/cantico-catolico.mp3',kind:'file',
   title:'Ave Maria — Schola Gregoriana',
   author:'Schola Gregoriana de Ołtarzew, sob direção de Pe. Dariusz Smolarek',
   source:'https://commons.wikimedia.org/wiki/File:Schola_Gregoriana-Ave_Maria.ogg',
   license:'CC BY-SA 3.0',
   licenseUrl:'https://creativecommons.org/licenses/by-sa/3.0/',
   description:'Canto gregoriano católico autêntico'
  },
  templario:{
   id:'templario',src:'./assets/audio/cantico-medieval.mp3',kind:'file',
   title:'Cum Angelis — antífona medieval',
   author:'Paterm (interpretação vocal)',
   source:'https://commons.wikimedia.org/wiki/File:Gregorian_chant_-_Procedamus_in_pace_-_Cum_angelis_-_Psalm_24_(23)_(German-Polish_accent).ogg',
   license:'CC BY-SA 3.0',
   licenseUrl:'https://creativecommons.org/licenses/by-sa/3.0/',
   description:'Canto gregoriano medieval em estilo templário; não é gravação histórica dos templários'
  },
  relaxar:{
   id:'relaxar',src:null,kind:'ambient',
   title:'Silêncio e oração — instrumental original',
   author:'Composição original gerada no próprio aplicativo CUIÚDO',
   source:null,license:'Original',licenseUrl:null,
   description:'Notas leves de música ambiente para concentração na oração'
  }
 });
 const labels={
  pt:{title:'Trilha de oração',catolico:'Cântico católico',templario:'Cântico templário',relaxar:'Relaxar',play:'Tocar música',pause:'Pausar música',noAudio:'Não foi possível reproduzir o cântico. Verifique sua conexão.',note:'Cântico medieval em estilo templário; não é gravação dos Cavaleiros Templários.',credit:'Gravação e licença'},
  en:{title:'Prayer soundtrack',catolico:'Catholic chant',templario:'Templar-style chant',relaxar:'Relaxing',play:'Play music',pause:'Pause music',noAudio:'Unable to play this chant. Check your connection.',note:'Medieval chant in a Templar-inspired style; not a recording of the Knights Templar.',credit:'Recording and license'},
  es:{title:'Música para rezar',catolico:'Canto católico',templario:'Canto templario',relaxar:'Relajarse',play:'Reproducir música',pause:'Pausar música',noAudio:'No se pudo reproducir el canto. Comprueba tu conexión.',note:'Canto medieval de estilo templario; no es una grabación de los caballeros templarios.',credit:'Grabación y licencia'},
  la:{title:'Musica ad orandum',catolico:'Cantus catholicus',templario:'Cantus medievalis',relaxar:'Quies',play:'Musicam incipe',pause:'Musicam siste',noAudio:'Cantus reddi non potest. Rete inspice.',note:'Cantus medii aevi, specie templaria; non est sonus Templariorum antiquorum.',credit:'Cantus et licentia'}
 };
 let track='catolico',media=null,active=false,vol=.22,error='';
 const valid=x=>Object.prototype.hasOwnProperty.call(tracks,x)?x:'catolico';
 function ensure(){
  if(media)return media;
  if(typeof document==='undefined'||typeof document.createElement!=='function')return null;
  media=document.createElement('audio');
  media.preload='none';media.loop=true;media.controls=false;media.playsInline=true;
  media.volume=vol;
  media.addEventListener('error',()=>{active=false;error='playback';});
  media.addEventListener('ended',()=>{active=false;});
  return media;
 }
 function stop(){
  if(media){try{media.pause();}catch{}}
  if(cuiudoAmbient.isPlaying())cuiudoAmbient.stop();
  active=false;
 }
 function select(value){
  const next=valid(value);
  if(next===track)return Promise.resolve(active);
  const resume=active;
  stop();
  track=next;error='';
  if(media){media.removeAttribute('src');media.load();}
  if(resume)return play();
  return Promise.resolve(false);
 }
 async function play(){
  if(active)return true;
  error='';
  if(track==='relaxar'){
   try{
    cuiudoAmbient.setVolume(vol);
    const ok=await cuiudoAmbient.start();
    active=Boolean(ok);
    if(!ok)error='playback';
    return active;
   }catch{error='playback';active=false;return false;}
  }
  const audio=ensure();
  if(!audio){error='playback';return false;}
  const src=tracks[track].src;
  if(audio.getAttribute('src')!==src){audio.src=src;audio.load();}
  audio.volume=Math.min(1,vol*1.75);
  try{
   await audio.play();
   active=true;return true;
  }catch{error='playback';active=false;return false;}
 }
 function setVolume(next){
  vol=Math.max(0,Math.min(.5,Number(next)||0));
  cuiudoAmbient.setVolume(vol);
  if(media)media.volume=Math.min(1,vol*1.75);
 }
 function getLabels(locale){return labels[locale]||labels.pt;}
 return {play,stop,select,setVolume,getTrack:()=>track,isPlaying:()=>active,hasError:()=>Boolean(error),
  clearError:()=>{error='';},getVolume:()=>vol,tracks,labels:getLabels,
  isSupported:()=>Boolean(typeof window!=='undefined'&&(window.AudioContext||window.webkitAudioContext||typeof document?.createElement==='function'))};
})();