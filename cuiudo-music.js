/* Três opções para rezar: gravação católica licenciada, vídeo do usuário
 * pelo PLAYER OFICIAL YouTube, trilha instrumental original.
 * O vídeo nunca é baixado, convertido ou reproduzido escondido.
 * O player permanece visível (>=200x200) e só inicia após clique.
 */
const cuiudoMusic=(()=>{
 const tracks=Object.freeze({
  catolico:{id:'catolico',src:'./assets/audio/cantico-catolico.mp3',kind:'file',
   title:'Ave Maria — Schola Gregoriana',author:'Schola Gregoriana de Ołtarzew · Pe. Dariusz Smolarek',
   source:'https://commons.wikimedia.org/wiki/File:Schola_Gregoriana-Ave_Maria.ogg',
   license:'CC BY-SA 3.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/3.0/',
   description:'Cântico gregoriano católico'},
  templario:{id:'templario',kind:'youtube',videoId:'zodHltkgK1w',src:null,
   title:'Cântico templário — vídeo escolhido',
   author:'Reprodução pelo canal original no YouTube',
   source:'https://www.youtube.com/watch?v=zodHltkgK1w',
   license:'YouTube · player oficial',licenseUrl:'https://www.youtube.com/t/terms',
   description:'Vídeo indicado pelo usuário, reproduzido no player oficial do YouTube'},
  relaxar:{id:'relaxar',src:null,kind:'ambient',
   title:'Silêncio e oração — instrumental original',
   author:'Composição original gerada no próprio aplicativo CUIÚDO',source:null,
   license:'Original',licenseUrl:null,description:'Notas leves para oração'}
 });
 const labels={
  pt:{title:'Trilha de oração',catolico:'Cântico católico',templario:'Cântico templário',relaxar:'Relaxar',play:'Tocar música',pause:'Pausar música',noAudio:'Não foi possível reproduzir. Verifique a conexão.',note:'O cântico escolhido é reproduzido no player oficial do YouTube. O volume do vídeo pode ser ajustado no próprio player.',credit:'Ver origem',youtube:'Cântico templário · YouTube',close:'Fechar vídeo',open:'Abrir vídeo no YouTube'},
  en:{title:'Prayer music',catolico:'Catholic chant',templario:'Templar chant',relaxar:'Relax',play:'Play music',pause:'Pause music',noAudio:'Unable to play this recording. Check your connection.',note:'The requested chant plays through the official YouTube player. Adjust its volume in the player.',credit:'Original source',youtube:'Templar chant · YouTube',close:'Close video',open:'Open on YouTube'},
  es:{title:'Música de oración',catolico:'Canto católico',templario:'Canto templario',relaxar:'Relajarse',play:'Reproducir música',pause:'Pausar música',noAudio:'No se pudo reproducir. Comprueba tu conexión.',note:'El canto se reproduce con el reproductor oficial de YouTube. Ajusta el volumen allí.',credit:'Fuente',youtube:'Canto templario · YouTube',close:'Cerrar vídeo',open:'Abrir en YouTube'},
  la:{title:'Musica ad orandum',catolico:'Cantus catholicus',templario:'Cantus templarius',relaxar:'Quies',play:'Incipe',pause:'Siste',noAudio:'Cantus reddi non potest.',note:'Cantus per instrumentum officiale YouTube auditur; sonum ibi compone.',credit:'Fons',youtube:'Cantus · YouTube',close:'Claude',open:'YouTube aperi'}
 };
 let track='catolico',media=null,active=false,vol=.22,error='',youtubeDock=null;
 const valid=id=>Object.hasOwn(tracks,id)?id:'catolico';
 const language=()=>typeof cuiudoLocale==='function'?cuiudoLocale():'pt';
 function ensureAudio(){
  if(media)return media;
  if(typeof document==='undefined'||typeof document.createElement!=='function')return null;
  media=document.createElement('audio');media.preload='none';media.loop=true;
  media.playsInline=true;media.controls=false;media.volume=vol;
  media.addEventListener('error',()=>{active=false;error='playback';});
  media.addEventListener('ended',()=>{active=false;});
  return media;
 }
 function stop(){
  active=false;
  if(media){try{media.pause();}catch{}}
  if(cuiudoAmbient.isPlaying())cuiudoAmbient.stop();
  if(youtubeDock){youtubeDock.remove?.();youtubeDock=null;}
  if(typeof document!=='undefined'){
   const previous=document.getElementById?.('cuiudo-youtube-dock');
   previous?.remove?.();
  }
 }
 function select(value){
  const next=valid(value);
  if(next!==track){
   stop();track=next;error='';
   if(media){media.removeAttribute('src');media.load();}
  }
  // Escolher uma opção não inicia a reprodução: é preciso tocar no botão.
  return Promise.resolve(false);
 }
 function youtubePlayer(){
  if(typeof document==='undefined'||!document.createElement||!document.body)return false;
  if(youtubeDock?.isConnected)return true;
  const t=labels[language()]||labels.pt;
  const dock=document.createElement('aside');
  dock.id='cuiudo-youtube-dock';dock.className='cuiudo-youtube-dock';
  dock.setAttribute('aria-label',t.youtube);
  const head=document.createElement('div');head.className='cuiudo-youtube-top';
  const title=document.createElement('strong');title.textContent=t.youtube;
  const close=document.createElement('button');close.type='button';close.textContent='×';
  close.title=t.close;close.setAttribute('aria-label',t.close);
  close.addEventListener('click',()=>{stop();if(typeof render==='function')render();});
  head.append(title,close);
  const frame=document.createElement('iframe');frame.title=t.youtube;
  frame.src='https://www.youtube-nocookie.com/embed/zodHltkgK1w?autoplay=1&playsinline=1&controls=1&rel=0';
  frame.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
  frame.referrerPolicy='strict-origin-when-cross-origin';
  frame.allowFullscreen=true;
  frame.width='360';frame.height='224';frame.loading='eager';
  const foot=document.createElement('a');foot.href=tracks.templario.source;
  foot.target='_blank';foot.rel='noopener noreferrer';foot.textContent=t.open;
  foot.className='cuiudo-youtube-open';
  dock.append(head,frame,foot);document.body.append(dock);
  youtubeDock=dock;
  return true;
 }
 async function play(){
  if(active)return true;error='';
  if(track==='templario'){
   const ok=youtubePlayer();active=ok;if(!ok)error='playback';return ok;
  }
  if(track==='relaxar'){
   try{cuiudoAmbient.setVolume(vol);active=Boolean(await cuiudoAmbient.start());
    if(!active)error='playback';return active;
   }catch{error='playback';active=false;return false;}
  }
  const sound=ensureAudio();if(!sound){error='playback';return false;}
  const src=tracks[track].src;
  if(sound.getAttribute('src')!==src){sound.src=src;sound.load();}
  sound.volume=Math.min(1,vol*1.75);
  try{await sound.play();active=true;return true;}
  catch{error='playback';active=false;return false;}
 }
 function setVolume(next){
  vol=Math.min(.5,Math.max(0,Number(next)||0));
  cuiudoAmbient.setVolume(vol);
  if(media)media.volume=Math.min(1,vol*1.75);
 }
 return{play,stop,select,setVolume,getTrack:()=>track,isPlaying:()=>active,
  hasError:()=>Boolean(error),clearError:()=>{error='';},getVolume:()=>vol,tracks,
  labels:locale=>labels[locale]||labels.pt,
  isSupported:()=>Boolean(typeof window!=='undefined'&&(window.AudioContext||window.webkitAudioContext||typeof document?.createElement==='function'))};
})();