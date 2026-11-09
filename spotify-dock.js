/* Terço — Spotify incorporado (sem autenticação própria nem acesso à conta).
 * O iframe fica fora de #app, preservado durante a navegação SPA.
 * Só carrega conteúdo do domínio oficial open.spotify.com/embed.
 */
const cuiudoSpotify=(()=>{
 'use strict';
 const STORAGE_KEY='terco-spotify-embed-v1';
 const kinds=new Set(['track','playlist','album','artist','episode','show']);
 let root=null,iframe=null,active=null;
 const locale=()=>typeof state!=='undefined'&&['pt','en','es','la'].includes(state.appLang)?state.appLang:'pt';
 const copy={
  pt:{title:'Spotify no Terço',intro:'Cole o link de uma música, álbum ou playlist do Spotify.',placeholder:'https://open.spotify.com/playlist/…',listen:'Ouvir',close:'Parar e fechar',hint:'A reprodução é feita pelo Spotify. Ele pode solicitar login e limitar algumas faixas.',error:'Cole um link válido de música, álbum ou playlist do Spotify.',open:'Ouvir no Spotify',mini:'Spotify'},
  en:{title:'Spotify in Rosary',intro:'Paste a Spotify song, album, or playlist link.',placeholder:'https://open.spotify.com/playlist/…',listen:'Listen',close:'Stop and close',hint:'Playback comes from Spotify. Sign-in or playback restrictions may apply.',error:'Paste a valid Spotify song, album, or playlist link.',open:'Listen on Spotify',mini:'Spotify'},
  es:{title:'Spotify en Rosario',intro:'Pega un enlace de canción, álbum o lista de Spotify.',placeholder:'https://open.spotify.com/playlist/…',listen:'Escuchar',close:'Detener y cerrar',hint:'La reproducción depende de Spotify. Puede pedir iniciar sesión.',error:'Pega un enlace válido de Spotify.',open:'Escuchar en Spotify',mini:'Spotify'},
  la:{title:'Spotify in Rosario',intro:'Vinculum cantus vel indicis Spotify insere.',placeholder:'https://open.spotify.com/playlist/…',listen:'Audi',close:'Claude',hint:'Cantus per Spotify auditur; accessus posci potest.',error:'Vinculum Spotify rectum insere.',open:'Spotify',mini:'Spotify'}
 };
 function parse(value){
  const text=String(value||'').trim();
  let category='',id='';
  const uri=text.match(/^spotify:(track|playlist|album|artist|episode|show):([a-zA-Z0-9]{22})$/);
  if(uri){category=uri[1];id=uri[2];}
  else{
   try{
    const u=new URL(text);
    if(u.protocol!=='https:'||u.hostname!=='open.spotify.com'||u.username||u.password)return null;
    let segments=u.pathname.split('/').filter(Boolean);
    if(/^intl-[a-z]{2}(?:-[a-z]{2})?$/i.test(segments[0]||''))segments=segments.slice(1);
    if(segments.length!==2)return null;
    [category,id]=segments;
   }catch{return null;}
  }
  if(!kinds.has(category)||!/^[a-zA-Z0-9]{22}$/.test(id))return null;
  return 'https://open.spotify.com/embed/'+category+'/'+id;
 }
 function remember(value){try{localStorage.setItem(STORAGE_KEY,value);}catch{}}
 function saved(){try{return localStorage.getItem(STORAGE_KEY)||'';}catch{return '';}}
 function ensure(){
  if(root)return root;
  if(typeof document==='undefined'||!document.body)return null;
  root=document.createElement('section');
  root.id='terco-spotify-dock';
  root.className='terco-spotify-dock';
  root.setAttribute('aria-label','Spotify');
  root.hidden=true;
  const header=document.createElement('div');
  header.className='terco-spotify-head';
  const name=document.createElement('strong');name.className='terco-spotify-name';
  const close=document.createElement('button');close.type='button';close.className='terco-spotify-close';
  close.setAttribute('data-spotify-close','');close.setAttribute('aria-label','Fechar Spotify');
  close.textContent='×';header.append(name,close);
  const intro=document.createElement('p');intro.className='terco-spotify-description';
  const form=document.createElement('form');form.id='terco-spotify-form';
  const input=document.createElement('input');input.type='text';input.name='spotify';input.required=true;
  input.autocomplete='off';input.spellcheck=false;input.setAttribute('aria-label','Link do Spotify');
  const button=document.createElement('button');button.type='submit';button.className='terco-spotify-load';
  form.append(input,button);
  const error=document.createElement('p');error.className='terco-spotify-error';error.setAttribute('role','alert');error.hidden=true;
  const player=document.createElement('div');player.className='terco-spotify-iframe-slot';
  const hint=document.createElement('p');hint.className='terco-spotify-hint';
  root.append(header,intro,form,error,player,hint);
  document.body.appendChild(root);
  root.addEventListener('click',e=>{if(e.target.closest('[data-spotify-close]'))stop();});
  form.addEventListener('submit',e=>{
   e.preventDefault();
   const url=parse(input.value);
   if(!url){error.textContent=copy[locale()].error;error.hidden=false;return;}
   error.hidden=true;
   mount(url);remember(input.value.trim());
  });
  return root;
 }
 function translate(){
  const t=copy[locale()],r=ensure();if(!r)return;
  r.querySelector('.terco-spotify-name').textContent=t.title;
  r.querySelector('.terco-spotify-description').textContent=t.intro;
  r.querySelector('input[name=spotify]').placeholder=t.placeholder;
  r.querySelector('.terco-spotify-load').textContent=t.listen;
  r.querySelector('.terco-spotify-close').title=t.close;
  r.querySelector('.terco-spotify-hint').textContent=t.hint;
 }
 function mount(url){
  const r=ensure();if(!r)return;
  if(url===active&&iframe)return;
  // Evita que o player local toque simultaneamente com o Spotify.
  if(typeof cuiudoMusic!=='undefined'&&cuiudoMusic.isPlaying())cuiudoMusic.stop();
  const slot=r.querySelector('.terco-spotify-iframe-slot');
  if(iframe)iframe.remove();
  iframe=document.createElement('iframe');
  iframe.className='terco-spotify-frame';
  iframe.title='Spotify';
  iframe.src=url;
  iframe.width='100%';iframe.height='352';
  iframe.setAttribute('loading','eager');
  iframe.setAttribute('allow','autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture');
  iframe.setAttribute('referrerpolicy','strict-origin-when-cross-origin');
  iframe.setAttribute('allowfullscreen','');
  slot.appendChild(iframe);
  active=url;
 }
 function open(){
  const r=ensure();if(!r)return;
  translate();
  r.hidden=false;
  const input=r.querySelector('input[name=spotify]');
  if(!input.value)input.value=saved();
  const source=parse(input.value);
  if(source&&!iframe)mount(source);
  if(!source)input.focus({preventScroll:true});
 }
 function stopPlayback(){
  if(iframe)iframe.remove();
  iframe=null;active=null;
 }
 function stop(){
  stopPlayback();
  if(root)root.hidden=true;
 }
 if(typeof document!=='undefined'&&document.addEventListener){
  document.addEventListener('click',e=>{
   const button=e.target.closest?.('[data-action="cuiudo-spotify-open"]');
   if(button){e.preventDefault();open();}
  });
 }
 return {open,stop,stopPlayback,parse,isActive:()=>Boolean(iframe)};
})();
