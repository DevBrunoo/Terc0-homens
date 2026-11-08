/* CUIÚDO v16 — sete trilhas DE VERDADE, seis gravações católicas licenciadas
 * armazenadas no aplicativo e uma faixa ambiente original. SEM YOUTUBE.
 * Nenhum áudio é iniciado automaticamente. Cada faixa usa o controle do app.
 */
const cuiudoMusic=(()=>{
 const by3='https://creativecommons.org/licenses/by-sa/3.0/';
 const by4='https://creativecommons.org/licenses/by-sa/4.0/';
 const files=Object.freeze({
  catolico:{kind:'file',src:'./assets/audio/cantico-catolico.mp3',title:'Ave Maria — canto gregoriano',
   author:'Schola Gregoriana de Ołtarzew · Pe. Dariusz Smolarek',
   source:'https://commons.wikimedia.org/wiki/File:Schola_Gregoriana-Ave_Maria.ogg',license:'CC BY-SA 3.0',licenseUrl:by3},
  templario:{kind:'file',src:'./assets/audio/cantico-medieval.mp3',title:'Cum Angelis — canto medieval',
   author:'Paterm · interpretação de canto gregoriano medieval',
   source:'https://commons.wikimedia.org/wiki/File:Gregorian_chant_-_Procedamus_in_pace_-_Cum_angelis_-_Psalm_24_(23)_(German-Polish_accent).ogg',
   license:'CC BY-SA 3.0',licenseUrl:by3},
  pater:{kind:'file',src:'./assets/audio/cantico-pater-noster.mp3',title:'Pater Noster — canto gregoriano',
   author:'Schola Gregoriana de Ołtarzew · Pe. Dariusz Smolarek',
   source:'https://commons.wikimedia.org/wiki/File:Schola_Gregoriana-Pater_Noster.ogg',license:'CC BY-SA 3.0',licenseUrl:by3},
  pange:{kind:'file',src:'./assets/audio/cantico-pange-lingua.mp3',title:'Pange Lingua — canto eucarístico',
   author:'Gareth Hughes · canto tradicional em latim',
   source:'https://commons.wikimedia.org/wiki/File:Pange_Lingua_Latin_in_Latin.ogg',license:'CC BY-SA 3.0',licenseUrl:by3},
  tantum:{kind:'file',src:'./assets/audio/cantico-tantum-ergo.mp3',title:'Tantum Ergo — canto gregoriano',
   author:'Gareth Hughes · edição Richardprins',
   source:'https://commons.wikimedia.org/wiki/File:Tantum_Ergo_I_Gregorian.ogg',license:'CC BY-SA 3.0',licenseUrl:by3},
  rorate:{kind:'file',src:'./assets/audio/cantico-rorate-caeli.mp3',title:'Rorate Caeli — canto de Advento',
   author:'Inritter · canto gregoriano',
   source:'https://commons.wikimedia.org/wiki/File:Rorate_Caeli_~_Gregorian_Chant.ogg',license:'CC BY-SA 4.0',licenseUrl:by4},
  relaxar:{kind:'ambient',src:null,title:'Música instrumental suave',
   author:'Composição original do CUIÚDO, sintetizada no navegador',
   source:null,license:'Original',licenseUrl:null}
 });
 const labels={
  pt:{title:'Música para rezar',catolico:'Ave Maria',templario:'Templário',pater:'Pai-Nosso',pange:'Pange Lingua',tantum:'Tantum Ergo',rorate:'Rorate Caeli',relaxar:'Relaxar',
   play:'Tocar música',pause:'Pausar música',noAudio:'Não foi possível reproduzir. Verifique os arquivos ou sua conexão.',
   note:'Canto medieval em estilo templário; áudio no próprio app, não é a gravação do vídeo do YouTube.',credit:'Créditos / licença'},
  en:{title:'Music for prayer',catolico:'Ave Maria',templario:'Medieval chant',pater:'Our Father',pange:'Pange Lingua',tantum:'Tantum Ergo',rorate:'Rorate Caeli',relaxar:'Relax',
   play:'Play music',pause:'Pause music',noAudio:'Unable to play this track. Check your connection or file.',note:'Medieval chant in a Templar-inspired style, played inside the app, not the YouTube recording.',credit:'Credits / license'},
  es:{title:'Música para rezar',catolico:'Ave María',templario:'Canto medieval',pater:'Padrenuestro',pange:'Pange Lingua',tantum:'Tantum Ergo',rorate:'Rorate Caeli',relaxar:'Relajarse',
   play:'Reproducir',pause:'Pausar',noAudio:'No se pudo reproducir este canto. Comprueba la conexión.',note:'Canto medieval de estilo templario dentro de la aplicación; no es el audio de YouTube.',credit:'Créditos / licencia'},
  la:{title:'Musica ad orandum',catolico:'Ave Maria',templario:'Cantus medii aevi',pater:'Pater noster',pange:'Pange lingua',tantum:'Tantum ergo',rorate:'Rorate caeli',relaxar:'Quies',
   play:'Incipe',pause:'Siste',noAudio:'Cantus reddi non potest.',note:'Cantus medii aevi in hoc ipso instrumento auditur, non e YouTube.',credit:'Auctor / licentia'}
 };
 let selected='catolico',playing=false,volume=.22,audio=null,error='';
 const key=k=>Object.hasOwn(files,k)?k:'catolico';
 function ensureAudio(){
  if(audio)return audio;
  if(typeof document==='undefined'||typeof document.createElement!=='function')return null;
  audio=document.createElement('audio');
  audio.preload='none';audio.loop=true;audio.playsInline=true;
  audio.controls=false;audio.volume=volume;
  audio.addEventListener('error',()=>{playing=false;error='playback';});
  audio.addEventListener('ended',()=>{playing=false;});
  return audio;
 }
 function stop(){
  if(audio){try{audio.pause();}catch{}}
  if(cuiudoAmbient.isPlaying())cuiudoAmbient.stop();
  playing=false;
 }
 function select(id){
  const next=key(id);
  if(next!==selected){stop();selected=next;error='';
   if(audio){audio.removeAttribute('src');audio.load();}
  }
  return Promise.resolve(false);
 }
 async function play(){
  if(playing)return true;error='';
  if(files[selected].kind==='ambient'){
   try{cuiudoAmbient.setVolume(volume);playing=Boolean(await cuiudoAmbient.start());if(!playing)error='playback';return playing;}
   catch{error='playback';playing=false;return false;}
  }
  const element=ensureAudio();if(!element){error='playback';return false;}
  const src=files[selected].src;
  if(element.getAttribute('src')!==src){element.src=src;element.load();}
  element.volume=Math.max(0,Math.min(1,volume*1.75));
  try{await element.play();playing=true;return true;}
  catch{error='playback';playing=false;return false;}
 }
 function setVolume(v){
  volume=Math.max(0,Math.min(.5,Number(v)||0));
  cuiudoAmbient.setVolume(volume);
  if(audio)audio.volume=Math.max(0,Math.min(1,volume*1.75));
 }
 return{tracks:files,labels:(locale)=>labels[locale]||labels.pt,play,stop,select,setVolume,
  getTrack:()=>selected,getVolume:()=>volume,isPlaying:()=>playing,
  hasError:()=>Boolean(error),clearError:()=>{error='';},
  isSupported:()=>Boolean(typeof window!=='undefined'&&(
   window.AudioContext||window.webkitAudioContext||(typeof document!=='undefined'&&document.createElement)))};
})();
