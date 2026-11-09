/* CUIÚDO 12 — Rosário com música original, medalha de São Bento,
   20 pinturas locais e meditações Pequena / Média / Grande em 4 línguas.
   A configuração do contador permanece inalterada: 5 mistérios por terço. */
const cuiudoLangLabels={pt:'Português',en:'English',es:'Español',la:'Latina'};
const cuiudoNav={
 pt:{inicio:'Início',terco:'Terço',devocionario:'Santos',palavra:'Bíblia',diario:'Diário',verdade:'Reflexões',desafios:'Ação',exame:'Exame'},
 en:{inicio:'Home',terco:'Rosary',devocionario:'Saints',palavra:'Bible',diario:'Journal',verdade:'Reflections',desafios:'Action',exame:'Examination'},
 es:{inicio:'Inicio',terco:'Rosario',devocionario:'Santos',palavra:'Biblia',diario:'Diario',verdade:'Reflexiones',desafios:'Acción',exame:'Examen'},
 la:{inicio:'Domus',terco:'Rosarium',devocionario:'Sancti',palavra:'Biblia',diario:'Diarium',verdade:'Meditationes',desafios:'Opera',exame:'Examen'}
};
const cuiudoLengthLabels={
 pt:['Pequena','Média','Grande'],
 en:['Short','Medium','Long'],
 es:['Pequeña','Mediana','Larga'],
 la:['Brevis','Media','Longa']
};
const cuiudoLengthHeading={pt:'Tamanho da meditação',en:'Meditation length',es:'Duración de la meditación',la:'Longitudo meditationis'};
function cuiudoLocale(){return ['pt','en','es','la'].includes(state.appLang)?state.appLang:'pt';}
function cuiudoStrings(){return rosaryLocales[cuiudoLocale()];}
function cuiudoGroupName(id){return cuiudoStrings().groups[id]||groups[id].short;}
function cuiudoMystery(m){
 const l=cuiudoLocale();
 return l==='pt'?
  {title:m.title,meditation:m.summary,virtue:'Fidelidade e coragem'}:
  (rosaryMysteries[m.id]?.[l]||{title:m.title,meditation:m.summary,virtue:''});
}
function cuiudoPrayersList(){
 const l=cuiudoLocale();
 return l==='pt'?prayers:rosaryPrayers[l].map(([name,text])=>({name,text}));
}
function cuiudoVerse(m){
 const l=cuiudoLocale(),v=versiculosPorMisterio[m.id];
 if(l==='pt'||l==='en')return {
  text:l==='pt'?v.pt:v.en,
  name:l==='pt'?'Figueiredo (domínio público)':'Douay-Rheims (public domain)',
  adaptation:false,
  url:l==='pt'?v.ptSource:v.enSource
 };
 return {
  text:rosaryMysteries[m.id][l].meditation,
  name:cuiudoStrings().adapted,
  adaptation:true,
  url:l==='es'?
    'https://www.vatican.va/special/rosary/documents/misteri_sp.html':
    'https://www.vatican.va/archive/bible/nova_vulgata/documents/nova-vulgata_index_lt.html'
 };
}
function cuiudoArtwork(id){
 const local=typeof rosaryArtwork!=='undefined'?rosaryArtwork[id]:null;
 return local||{url:'./assets/misterios/'+id+'.svg',credit:'Arte simbólica original CUIÚDO',source:'',license:'Arte original'};
}
function cuiudoSelectLanguage(){
 const l=cuiudoLocale();
 const label=cuiudoStrings().locale;
 return '<label class="cuiudo-locale" for="cuiudo-language"><span aria-hidden="true">◎</span>'+
  '<span class="locale-label">'+escapeHtml(label)+'</span><select id="cuiudo-language" aria-label="'+escapeHtml(label)+'">'+
  Object.entries(cuiudoLangLabels).map(([id,name])=>'<option value="'+id+'" '+(l===id?'selected':'')+'>'+name+'</option>').join('')+
  '</select></label>';
}
function cuiudoBenedictBanner(){
 const l=cuiudoLocale();
 const lines={
  pt:['A Cruz Sagrada seja a minha luz.','Fé para enfrentar. Coragem para agir.','Medalha de São Bento','Rezar agora'],
  en:['May the Holy Cross be my light.','Faith to endure. Courage to act.','Saint Benedict Medal','Pray now'],
  es:['Que la Santa Cruz sea mi luz.','Fe para resistir. Valor para actuar.','Medalla de San Benito','Rezar ahora'],
  la:['Crux sacra sit mihi lux.','Fides ad perseverandum. Fortitudo ad agendum.','Medalia Sancti Benedicti','Ora nunc']
 }[l];
 return '<section class="benedict-hero">'+
  '<div class="benedict-hero-copy"><span class="benedict-eyebrow">✝ '+escapeHtml(lines[2])+'</span>'+
  '<h1>'+escapeHtml(lines[0])+'</h1><p>'+escapeHtml(lines[1])+'</p>'+
  '<div class="benedict-hero-actions"><button type="button" class="btn btn-primary" data-action="navigate" data-tab="terco">'+escapeHtml(lines[3])+' ↗</button>'+
  '</div><div class="benedict-motto">PAX · CRUX SACRA SIT MIHI LUX · NON DRACO SIT MIHI DUX</div></div>'+
  '<div class="benedict-hero-art"><div class="medal-halo"></div>'+
  '<div class="benedict-medal-single" aria-label="'+escapeHtml(lines[2])+'">'+
  '<img class="benedict-medal-premium" src="https://commons.wikimedia.org/wiki/Special:FilePath/Saint_Benedict_Medal_icon.svg" alt="'+escapeHtml(lines[2])+'" width="512" height="512" loading="eager" fetchpriority="high" onerror="this.onerror=null;this.src=\'./assets/medalha-sao-bento-hd.svg\'"></div>'+
  '<span class="benedict-medal-credit">PAX · C S P B · <a href="https://jovensconectados.org.br/7-coisas-que-devemos-saber-sobre-a-medalha-e-cruz-de-sao-bento.html" target="_blank" rel="noopener noreferrer">Significado da medalha ↗</a></span></div></section>';
}

/* CUIÚDO — mais imagens, arte sacra e coragem, com fontes identificadas. */
const cuiudoGalleryItems=Object.freeze([
 {tag:'ORAÇÃO',title:'REZE. LEVANTE.',description:'A fé começa no coração e chega às atitudes.',url:'./assets/feed/rosario.webp',fallback:'./assets/feed/rosario.webp',source:'https://unsplash.com/photos/a-person-holding-a-rosary-with-a-cross-on-it-CCC0CdEsI7E',credit:'Dolina Modlitwy · Unsplash',post:'f01'},
 {tag:'DISCIPLINA',title:'VENÇA A SI MESMO.',description:'Coragem também é fazer o que precisa ser feito.',url:'./assets/feed/cristo-deserto.webp',fallback:'./assets/feed/cristo-deserto.webp',source:'https://commons.wikimedia.org/wiki/File:Christ_in_the_Wilderness_-_Ivan_Kramskoy_-_Google_Cultural_Institute.jpg',credit:'Ivan Kramskoy · domínio público',post:'j01'},
 {tag:'CORAGEM',title:'VÁ PRA CIMA.',description:'Levante-se e faça a sua parte.',url:'./assets/feed/vai-pra-cima.webp',fallback:'./assets/feed/vai-pra-cima.webp',source:'https://commons.wikimedia.org/wiki/File:Frederic_Remington_-_A_New_Year_on_the_Cimarron_-_Google_Art_Project.jpg',credit:'Frederic Remington · domínio público',post:'r09'},
 {tag:'VIGILÂNCIA',title:'VIGIAI E ORAI.',description:'Não durma diante dos seus deveres.',url:'https://commons.wikimedia.org/wiki/Special:FilePath/Christ_in_Gethsemane.jpg?width=900',fallback:'./assets/misterios/fotos/agonia.webp',source:'https://commons.wikimedia.org/wiki/File:Christ_in_Gethsemane.jpg',credit:'Heinrich Hofmann · domínio público',tab:'terco'},
 {tag:'COMBATE ESPIRITUAL',title:'PERMANEÇA FIRME.',description:'A vitória não é feita de desculpas.',url:'./assets/feed/miguel-rafael.webp',fallback:'./assets/feed/miguel-rafael.webp',source:'https://commons.wikimedia.org/wiki/File:Raphael_Saint_Michael_and_the_Dragon.jpg',credit:'Rafael · domínio público',post:'m02'},
 {tag:'PERSEVERANÇA',title:'LEVANTE OUTRA VEZ.',description:'Recomeçar também exige humildade.',url:'https://commons.wikimedia.org/wiki/Special:FilePath/Rembrandt_Christ_Resurrected.jpg?width=900',fallback:'./assets/misterios/fotos/ressurreicao.webp',source:'https://commons.wikimedia.org/wiki/File:Rembrandt_Christ_Resurrected.jpg',credit:'Rembrandt · domínio público',tab:'terco'},
 {tag:'CARIDADE',title:'NÃO ABANDONE O OUTRO.',description:'Fé verdadeira aprende a servir.',url:'./assets/feed/ajudar-companheiro.webp',fallback:'./assets/feed/ajudar-companheiro.webp',source:'https://commons.wikimedia.org/wiki/File:Frederic_Remington_-_Aiding_a_Comrade_-_Google_Art_Project.jpg',credit:'Frederic Remington · domínio público',post:'r08'},
 {tag:'CAMINHO',title:'FOCO NO QUE IMPORTA.',description:'Menos ruído. Mais direção.',url:'./assets/feed/foco-estrada.webp',fallback:'./assets/feed/foco-estrada.webp',source:'https://commons.wikimedia.org/wiki/File:The_Smoke_Signal,_1905,_by_Frederic_S._Remington.jpg',credit:'Frederic Remington · domínio público',post:'r10'},
 {tag:'ESPERANÇA',title:'A LUZ VAI ENTRAR.',description:'Volte à oração, sem abandonar a ação.',url:'./assets/feed/luz.webp',fallback:'./assets/feed/luz.webp',source:'https://unsplash.com/photos/sunlight-beams-inside-ornate-cathedral--0gBnnMdQPw',credit:'Chad Greiter · Unsplash',post:'f02'},
 {tag:'CRUZ',title:'NÃO FUJA DA CRUZ.',description:'Cristo ensina fidelidade no sofrimento.',url:'./assets/misterios/fotos/cruz.webp',fallback:'./assets/misterios/fotos/cruz.webp',source:'https://commons.wikimedia.org/wiki/File:El_Greco_-_Christ_Carrying_the_Cross_-_WGA10559.jpg',credit:'El Greco · domínio público',tab:'terco'}
]);
function cuiudoPhotoGallery(){
 const labels={
  pt:['CUIÚDO EM IMAGENS','FÉ QUE SE VÊ. CORAGEM QUE SE VIVE.','Deslize para explorar'],
  en:['CUIÚDO IN PICTURES','FAITH TO SEE. COURAGE TO LIVE.','Swipe to explore'],
  es:['CUIÚDO EN IMÁGENES','FE QUE SE VE. VALENTÍA PARA VIVIR.','Desliza para explorar'],
  la:['CUIÚDO IN IMAGINIBUS','FIDES ET FORTITUDO.','Immagines percurre']
 }[cuiudoLocale()]||['CUIÚDO EM IMAGENS','FÉ QUE SE VÊ. CORAGEM QUE SE VIVE.','Deslize para explorar'];
 return '<section class="cuiudo-photo-gallery" aria-label="'+escapeHtml(labels[0])+'">'+
  '<div class="cuiudo-gallery-heading"><div><span class="eyebrow">'+escapeHtml(labels[0])+'</span>'+
  '<h2>'+escapeHtml(labels[1])+'</h2></div><p>'+escapeHtml(labels[2])+' <span aria-hidden="true">→</span></p></div>'+
  '<div class="cuiudo-photo-rail" role="region" tabindex="0" aria-label="'+escapeHtml(labels[0])+'">'+
  cuiudoGalleryItems.map((item,i)=>{
   const act=item.post?'combat-open':'navigate';
   const data=item.post?' data-id="'+escapeHtml(item.post)+'"':' data-tab="'+escapeHtml(item.tab)+'"';
   return '<figure class="cuiudo-gallery-card"><button type="button" class="cuiudo-gallery-open" data-action="'+act+'"'+data+
    ' aria-label="'+escapeHtml(item.title+' — '+item.description)+'">'+
    '<img src="'+escapeHtml(item.url)+'" loading="lazy" decoding="async" alt="'+escapeHtml(item.credit)+'"'+
    ' onerror="this.onerror=null;this.src=\''+escapeHtml(item.fallback)+'\'">'+
    '<span class="cuiudo-gallery-gradient" aria-hidden="true"></span>'+
    '<span class="cuiudo-gallery-copy"><small>'+escapeHtml(item.tag)+' <span aria-hidden="true">· '+String(i+1).padStart(2,'0')+'</span></small>'+
    '<strong>'+escapeHtml(item.title)+'</strong><span>'+escapeHtml(item.description)+'</span></span></button>'+
    '<figcaption><a href="'+escapeHtml(item.source)+'" rel="noopener noreferrer" target="_blank">'+escapeHtml(item.credit)+' ↗</a></figcaption></figure>';
  }).join('')+'</div></section>';
}

const cuiudoBaseHome=combatHome;
combatHome=function(){
 return cuiudoBaseHome().replace(/<section class="cuiudo-hero">[\s\S]*?<\/section>/,cuiudoBenedictBanner()).replace('<section class="cuiudo-feed-toolbar">',cuiudoPhotoGallery()+'<section class="cuiudo-feed-toolbar">');
};
const cuiudoBaseNavButton=combatNavBtn;
combatNavBtn=function(tab,cls='nav-button'){
 const name=cuiudoNav[cuiudoLocale()][tab.id]||tab.label;
 return cuiudoBaseNavButton({...tab,label:name,mobile:name},cls);
};
const cuiudoBaseShell=renderShell;
renderShell=function(content){
 return cuiudoBaseShell(content).replace('<div class="header-tools">','<div class="header-tools">'+cuiudoSelectLanguage());
};
const cuiudoBaseBible=combatBible;
combatBible=function(){
 const l=cuiudoLocale();
 if(l==='pt'||l==='en'){
   // The existing Bible screen uses state.verseLang, not the new UI locale.
   // O botão PT / English governa state.verseLang sem sobrescrever o clique.
   return cuiudoBaseBible();
 }
 const t=cuiudoStrings();
 return '<section class="bible-intro"><span class="eyebrow">'+escapeHtml(t.scripture)+'</span>'+
 '<h1 class="page-title">'+escapeHtml(t.scripture)+'</h1><p class="page-desc">'+escapeHtml(t.adapted)+
 '. <a target="_blank" rel="noopener noreferrer" href="'+(l==='es'?'https://www.vatican.va/special/rosary/documents/misteri_sp.html':'https://www.vatican.va/archive/bible/nova_vulgata/documents/nova-vulgata_index_lt.html')+'">'+escapeHtml(t.chapter)+' ↗</a></p></section>'+
 '<section class="bible-grid">'+Object.entries(versiculosPorMisterio).map(([id,v],i)=>{
  const m=Object.values(groups).flatMap(g=>g.mysteries).find(x=>x.id===id);
  const tr=cuiudoMystery(m);
  return '<article class="card bible-card"><span class="card-meta">'+(i+1)+' · '+escapeHtml(v.ref)+'</span>'+
   '<h2 class="card-title">'+escapeHtml(tr.title)+'</h2><blockquote>'+escapeHtml(tr.meditation)+'</blockquote>'+
   '<small>'+escapeHtml(t.adapted)+'</small></article>';
 }).join('')+'</section>';
};
function cuiudoRosary(){
 const t=cuiudoStrings(),l=cuiudoLocale(),g=groups[state.group],m=g.mysteries[state.mystery];
 const mm=mysteryText(m),loc=cuiudoMystery(m),verse=cuiudoVerse(m);
 const progress=readProgress(),count=progress[state.mystery],extra=rosaryExtras[l];
 const musicOn=cuiudoMusic.isPlaying(),volume=Math.round(Number(state.musicVolume)*100);
 const musicTrack=cuiudoMusic.getTrack(),musicLabels=cuiudoMusic.labels(l),musicInfo=cuiudoMusic.tracks[musicTrack];
 const length=['small','medium','large'].includes(state.rosaryLength)?state.rosaryLength:'medium';
 const art=cuiudoArtwork(m.id),lang={pt:'pt-BR',en:'en',es:'es',la:'la'}[l];
 const context=cuiudoMysteryContext[m.id]?.[l],contextLabels=cuiudoContextTitles[l];
 const personalized=rosaryLanguageExtras.mysteries[m.id]?.[l];
 const strong=l==='pt'?mm.hard:loc.meditation;
 const question=l==='pt'?mm.question:(personalized?.question||t.question);
 const concrete=l==='pt'?m.action:(personalized?.action||extra.challenge);
 const prayer=l==='pt'?(mm.prayer||'Senhor, dai-me a coragem de viver o que acabo de contemplar. Amém.'):extra.offering;
 const fullPrayerList=cuiudoPrayersList();
 const credits=art.source?'<a href="'+escapeHtml(art.source)+'" target="_blank" rel="noopener noreferrer">'+escapeHtml(art.credit)+' ↗</a>':escapeHtml(art.credit);
 const musicLabel=cuiudoMusic.isSupported()?musicLabels.title:t.musicUnsupported;
 const artworkAlt={pt:'Pintura ilustrativa: ',en:'Illustrative painting: ',es:'Pintura ilustrativa: ',la:'Imago sacra: '}[l];
 const todayGroup=dayGroup(),todayName=cuiudoGroupName(todayGroup);
 const dateLocale={pt:'pt-BR',en:'en-US',es:'es-ES',la:'pt-BR'}[l];
 const todayDate=new Intl.DateTimeFormat(dateLocale,{weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(new Date());
 const todayMessage={pt:'Hoje rezamos os Mistérios',en:'Today we pray the',es:'Hoy rezamos los Misterios',la:'Hodie contemplamur mysteria'}[l];
 const todaySuffix={pt:'',en:' mysteries',es:'',la:''}[l];
 const meditationBlock='<div class="rosary-meditation-block"><span class="card-meta">'+escapeHtml(t.meditation)+'</span>'+
  '<p class="readable">'+escapeHtml(loc.meditation)+'</p>'+
  (context?'<div class="rosary-story-grid rosary-reflection-grid">'+
    [['think',1,'02'],['apply',2,'03']].map(([key,i,number])=>
      '<article class="rosary-story-card rosary-story-'+key+'">'+
      '<div class="rosary-story-heading"><span>'+number+'</span><h3>'+escapeHtml(contextLabels[key])+'</h3></div>'+
      '<p>'+escapeHtml(context[i])+'</p></article>').join('')+
    '</div>':'')+
  (length==='small'?'':('<div class="virtue-strip"><span>'+escapeHtml(t.virtue)+'</span><strong>'+escapeHtml(loc.virtue)+'</strong></div>'+
    '<div class="question rosary-conscience-question"><strong>'+escapeHtml(t.examine)+':</strong> '+escapeHtml(question)+'</div>'))+
  (length==='large'?('<div class="rosary-long"><h3>'+escapeHtml(t.reflection)+'</h3>'+
   '<blockquote class="confront">'+escapeHtml(strong)+'</blockquote>'+
   '<p class="rosary-action-concrete"><strong>'+escapeHtml(t.act)+':</strong> '+escapeHtml(concrete)+'</p>'+
   '<div class="prayer-response rosary-offering"><span>'+escapeHtml(t.offering)+'</span><p>'+escapeHtml(prayer)+'</p></div></div>'):'')+'</div>';
 return '<section class="rosary-plus-header"><div><span class="eyebrow">'+escapeHtml(t.today)+': '+escapeHtml(cuiudoGroupName(dayGroup()))+'</span>'+
  '<h1 class="page-title">'+escapeHtml(t.rosary)+'</h1><p class="page-desc">'+escapeHtml(t.intro)+'</p></div>'+
   '<aside class="rosary-music-control rosary-music-v13 cuiudo-tiny-player" aria-label="'+escapeHtml(musicLabel)+'">'+
   '<span class="music-disc" aria-hidden="true">♫</span>'+
   '<div class="cuiudo-track-info" aria-live="polite" aria-atomic="true">'+
   '<strong title="'+escapeHtml(musicInfo.title)+'">'+escapeHtml(musicLabels[musicTrack]||musicInfo.title)+'</strong>'+
   '<small title="'+escapeHtml(musicInfo.title)+'">'+escapeHtml(musicInfo.title)+'</small></div>'+
   '<div class="cuiudo-skip-controls" role="group" aria-label="'+escapeHtml(musicLabel)+'">'+
   '<button type="button" class="cuiudo-skip" data-action="combat-rosary-prev-track" aria-label="'+escapeHtml({pt:'Música anterior',en:'Previous track',es:'Canción anterior',la:'Cantus prior'}[l])+'"><span aria-hidden="true">‹</span></button>'+
   '<button type="button" class="cuiudo-play-toggle" data-action="combat-rosary-music" aria-pressed="'+musicOn+'" aria-label="'+escapeHtml(musicOn?musicLabels.pause:musicLabels.play)+'" title="'+escapeHtml(musicOn?musicLabels.pause:musicLabels.play)+'" '+(cuiudoMusic.isSupported()?'':'disabled')+'><span aria-hidden="true">'+(musicOn?'Ⅱ':'▶')+'</span></button>'+
   '<button type="button" class="cuiudo-skip" data-action="combat-rosary-next-track" aria-label="'+escapeHtml({pt:'Próxima música',en:'Next track',es:'Siguiente canción',la:'Cantus sequens'}[l])+'"><span aria-hidden="true">›</span></button></div>'+
   '<input class="cuiudo-mini-volume" type="range" id="rosary-volume" min="0" max="50" step="1" value="'+volume+'" aria-label="'+escapeHtml(t.volume)+'" title="'+escapeHtml(t.volume)+'">'+
   '<button type="button" class="cuiudo-spotify-launch" data-action="cuiudo-spotify-open" title="Spotify" aria-label="'+escapeHtml({pt:'Ouvir no Spotify',en:'Listen on Spotify',es:'Escuchar en Spotify',la:'Spotify audi'}[l])+'"><span aria-hidden="true">◉</span> Spotify</button>'+
   '<details class="rosary-music-credits"><summary aria-label="'+escapeHtml(musicLabels.credit)+'" title="'+escapeHtml(musicLabels.credit)+'"><span aria-hidden="true">ⓘ</span></summary>'+
   '<p class="rosary-music-credit">'+escapeHtml(musicInfo.author)+' · '+escapeHtml(musicInfo.license)+
   (musicInfo.source?' · <a href="'+escapeHtml(musicInfo.source)+'" target="_blank" rel="noopener noreferrer">'+escapeHtml(musicLabels.credit)+' ↗</a>':'')+'</p>'+
   (musicTrack==='templario'?'<p class="rosary-music-note">'+escapeHtml(musicLabels.note)+'</p>':'')+
   (musicInfo.src?.startsWith('https://')?'<p class="rosary-music-note">'+escapeHtml(musicLabels.online)+'</p>':'')+
   '</details>'+
   (cuiudoMusic.hasError()?'<p class="audio-error" role="alert">'+escapeHtml(musicLabels.noAudio)+'</p>':'')+
   '</aside></section>'+
  '<section class="benedict-rosary-tip"><img src="./assets/medalha-sao-bento-hd.svg" alt="Medalha de São Bento colorida" loading="lazy" onerror="if(!this.dataset.failed){this.dataset.failed=1;this.src=\'./assets/medalha-sao-bento-colorida.webp\';}">'+
   '<div><strong>CRUX SACRA SIT MIHI LUX</strong><p>'+escapeHtml(t.notMagic)+'</p></div></section>'+
  '<section class="rosary-today-callout" aria-label="'+escapeHtml(t.today)+'">'+
   '<div><span class="rosary-today-date">✝ '+escapeHtml(todayDate)+'</span>'+
   '<strong>'+escapeHtml(todayMessage+' '+todayName+todaySuffix)+'</strong>'+
   '<small>'+escapeHtml({pt:'Hoje este conjunto de mistérios é o recomendado. Os outros continuam disponíveis.',en:'These mysteries are recommended for today. Others remain available.',es:'Estos misterios corresponden a hoy. Los demás siguen disponibles.',la:'Haec mysteria diei conveniunt; alia praesto sunt.'}[l])+'</small></div>'+
   (state.group!==todayGroup?'<button type="button" class="rosary-today-button" data-action="group" data-id="'+todayGroup+'">'+escapeHtml({pt:'Rezar o de hoje',en:'Pray today’s',es:'Rezar el de hoy',la:'Hodierna'}[l])+' ↗</button>':'')+
  '</section>'+
  '<div class="group-picker" role="group" aria-label="'+escapeHtml(t.today)+'">'+
    groupNames.map(id=>'<button class="group-button '+(state.group===id?'active':'')+
    '" type="button" data-action="group" data-id="'+id+'" aria-pressed="'+(state.group===id)+'">'+
    escapeHtml(cuiudoGroupName(id))+(id===todayGroup?' <span class="rosary-today-chip">'+escapeHtml({pt:'HOJE',en:'TODAY',es:'HOY',la:'HODIE'}[l])+'</span>':'')+'</button>').join('')+'</div>'+
  '<section class="rosary-length"><div><span class="card-meta">'+escapeHtml(cuiudoLengthHeading[l])+'</span>'+
   '<p>'+escapeHtml({pt:'As cinco dezenas permanecem iguais; só muda a profundidade da meditação.',en:'The five decades stay the same; only the depth of each meditation changes.',es:'Las cinco decenas permanecen iguales; solo cambia la profundidad de la meditación.',la:'Quinque decades manent; tantum meditationis profunditas mutatur.'}[l])+'</p></div>'+
   '<div class="meditation-size-buttons" role="group" aria-label="'+escapeHtml(cuiudoLengthHeading[l])+'">'+
   ['small','medium','large'].map((size,i)=>'<button type="button" class="meditation-size '+(length===size?'active':'')+
   '" data-action="combat-meditation-length" data-length="'+size+'" aria-pressed="'+(length===size)+'">'+
   escapeHtml(cuiudoLengthLabels[l][i])+'</button>').join('')+'</div></section>'+
  '<section class="mystery-layout rosary-plus-layout"><div class="mystery-visual rosary-photo-wrap">'+
   '<span class="eyebrow">'+['I','II','III','IV','V'][state.mystery]+' · '+escapeHtml(cuiudoGroupName(state.group))+'</span>'+
   '<h2 class="rosary-mystery-title">'+escapeHtml(loc.title)+'</h2><small class="rosary-mystery-reference">'+escapeHtml(m.ref)+'</small>'+
   '<div class="rosary-painting"><img src="'+escapeHtml(art.url)+'" alt="'+escapeHtml(artworkAlt+loc.title)+'" loading="eager" decoding="async" width="800" height="1000" '+
    'onerror="if(!this.dataset.fallback){this.dataset.fallback=1;this.src=\'./assets/misterios/'+m.id+'.svg\';}">'+
   '</div>'+
   '<span class="rosary-art-credit">'+credits+'</span>'+
   (context?'<article class="rosary-history-card" aria-label="'+escapeHtml(contextLabels.history)+'">'+
     '<div class="rosary-story-heading"><span>01</span><h3>'+escapeHtml(contextLabels.history)+'</h3></div>'+
     '<p>'+escapeHtml(context[0])+'</p>'+
     '<a class="rosary-story-source" href="'+escapeHtml(cuiudoMysteryContextSource)+'" target="_blank" rel="noopener noreferrer">'+
       'Rosarium Virginis Mariae · Vatican ↗</a></article>':'')+'</div>'+
  '<div class="mystery-detail"><article class="card rosary-reading"><div class="scripture-verse">'+
   '<div class="scripture-top"><span class="card-meta">'+escapeHtml(t.scripture)+' · '+escapeHtml(versiculosPorMisterio[m.id].ref)+'</span>'+
   '<span class="scripture-language">'+escapeHtml(cuiudoLangLabels[l])+'</span></div>'+
   '<blockquote lang="'+lang+'">'+(verse.adaptation?'':'“')+escapeHtml(verse.text)+(verse.adaptation?'':'”')+'</blockquote>'+
   '<div class="scripture-footer"><span>'+escapeHtml(verse.name)+'</span>'+
   '<a href="'+escapeHtml(verse.url)+'" target="_blank" rel="noopener noreferrer">'+escapeHtml(t.chapter)+' ↗</a></div></div>'+
   meditationBlock+'</article></div></section>'+
  '<section class="decade-panel"><div class="decade-header"><strong>'+escapeHtml(t.decade)+'</strong>'+
   '<span class="card-meta">'+count+' / 10 '+escapeHtml(t.hailCount)+'</span></div>'+
   '<p class="decade-description">'+escapeHtml(t.decadeGuide)+'</p>'+
   '<div class="count-bubbles" aria-label="'+count+'/10">'+Array.from({length:10},(_,i)=>'<span class="bead '+(i<count?'done':'')+'"></span>').join('')+'</div>'+
   '<div class="decade-buttons"><button class="btn" data-action="add-bead" '+(count>=10?'disabled':'')+'>'+
    icon('plus')+' '+escapeHtml(count>=10?t.done:t.add)+'</button>'+
    '<button class="btn btn-muted" data-action="undo-bead" '+(count===0?'disabled':'')+'>'+escapeHtml(t.undo)+'</button>'+
    '<button class="btn btn-ghost" data-action="reset-decade">'+escapeHtml(t.reset)+'</button></div>'+
   '<div class="stepper">'+g.mysteries.map((item,i)=>'<button class="step '+(i===state.mystery?'current':'')+' '+(progress[i]===10?'finished':'')+
    '" data-action="mystery" data-index="'+i+'" aria-label="'+escapeHtml(cuiudoMystery(item).title)+'">'+
    (progress[i]===10?'✓':i+1)+'</button>').join('')+'</div>'+
   '<div class="two-buttons"><button class="btn btn-muted" data-action="prev-mystery" '+(state.mystery===0?'disabled':'')+'>'+
    icon('arrowLeft')+' '+escapeHtml(t.previous)+'</button>'+
    '<button class="btn btn-ghost" data-action="next-mystery" '+(state.mystery===4?'disabled':'')+'>'+
    escapeHtml(t.next)+' '+icon('arrow')+'</button></div>'+
   (progress.every(n=>n===10)?'<div class="action-line">✓ '+escapeHtml(t.complete)+'</div>':'')+'</section>'+
  '<section class="rosary-guidance"><h2>'+escapeHtml(t.stepByStep)+'</h2>'+
    [['opening','openingGuide'],['decades','decadeGuide'],['closing','closingGuide']].map(([name,content],i)=>
    '<article class="card"><span class="rosary-guidance-number">0'+(i+1)+'</span>'+
    '<h3>'+escapeHtml(t[name])+'</h3><p>'+escapeHtml(t[content])+'</p></article>').join('')+'</section>'+
  '<section class="rosary-intention-card"><form id="rosary-intention-form">'+
    '<label for="rosary-intention"><strong>'+escapeHtml(t.intention)+'</strong></label>'+
    '<p>'+escapeHtml(t.intentionHelp)+'</p><textarea id="rosary-intention" rows="2" maxlength="800" '+
     'placeholder="'+escapeHtml(t.intentionPlaceholder)+'">'+escapeHtml(state.rosaryIntention||'')+'</textarea>'+
    '<div class="intention-footer"><span>'+escapeHtml(t.localNote)+'</span>'+
    '<button class="btn btn-secondary" type="submit">'+escapeHtml(t.saveIntention)+'</button></div></form></section>'+
  '<section class="rosary-prayers"><h2>'+escapeHtml(t.prayers)+'</h2>'+
   '<div class="prayer-list">'+fullPrayerList.map((p,i)=>'<details class="card prayer-card" '+(i===2?'open':'')+'>'+
     '<summary>'+escapeHtml(p.name)+'</summary><p>'+escapeHtml(p.text)+'</p></details>').join('')+'</div>'+
   '<h2>'+escapeHtml(t.prayersMore)+'</h2><div class="prayer-list">'+
    [[t.offering,extra.offering],[t.fatima,extra.fatima],[t.benedict,extra.benedict]].map(([name,words])=>
     '<details class="card prayer-card"><summary>'+escapeHtml(name)+'</summary><p>'+escapeHtml(words)+'</p></details>').join('')+
   '<details class="card prayer-card"><summary>'+escapeHtml(rosaryLanguageExtras.saintMichael[l].name)+'</summary>'+
    '<p>'+escapeHtml(rosaryLanguageExtras.saintMichael[l].text)+'</p></details>'+
   '<details class="card prayer-card"><summary>'+escapeHtml(rosaryLanguageExtras.litany[l].name)+'</summary><p>'+
    escapeHtml(rosaryLanguageExtras.litany[l].text.join('\n'))+'</p></details></div></section>';
}
const cuiudoPreviousRender=render;
render=function(){
 document.documentElement.lang=({pt:'pt-BR',en:'en',es:'es',la:'la'}[cuiudoLocale()]||'pt-BR');
 setTheme();
 const pages={
  inicio:combatHome,terco:cuiudoRosary,devocionario:devocionario,
  palavra:combatBible,diario:diary,verdade:truth,desafios:challenges,exame:examine
 };
 app.innerHTML=renderShell((pages[state.tab]||combatHome)());
 document.title=(cuiudoNav[cuiudoLocale()][state.tab]||'Terço')+' | Terço';
 if(document.body?.classList)document.body.classList.toggle('combat-modal-open',Boolean(state.feedOpen));
};
state.appLang=['pt','en','es','la'].includes(state.appLang)?state.appLang:'pt';
state.rosaryLength=['small','medium','large'].includes(state.rosaryLength)?state.rosaryLength:'medium';
state.musicVolume=Number.isFinite(Number(state.musicVolume))?Math.max(0,Math.min(.5,Number(state.musicVolume))):.22;
state.rosaryIntention=String(state.rosaryIntention||'').slice(0,800);
state.musicTrack=Object.keys(cuiudoMusic.tracks).includes(state.musicTrack)?state.musicTrack:'catolico';
cuiudoMusic.select(state.musicTrack);
cuiudoMusic.setVolume(state.musicVolume);
app.addEventListener('click',evt=>{
 const el=evt.target.closest?.('[data-action]');if(!el)return;
 const action=el.dataset.action;
 if(action==='combat-rosary-music'){
  if(cuiudoMusic.isPlaying()){cuiudoMusic.stop();render();}
  else{
   if(typeof cuiudoSpotify!=='undefined')cuiudoSpotify.stopPlayback();
   cuiudoMusic.play().then(()=>render()).catch(()=>render());
  }
 }
 if(action==='combat-rosary-prev-track'||action==='combat-rosary-next-track'){
  const tracks=Object.keys(cuiudoMusic.tracks);
  const index=tracks.indexOf(cuiudoMusic.getTrack());
  const delta=action==='combat-rosary-next-track'?1:-1;
  const next=tracks[(Math.max(0,index)+delta+tracks.length)%tracks.length];
  const wasPlaying=cuiudoMusic.isPlaying();
  state.musicTrack=next;
  save();
  cuiudoMusic.select(next).then(()=>wasPlaying?cuiudoMusic.play():false)
   .then(()=>render()).catch(()=>render());
 }
 if(action==='combat-meditation-length'){
  state.rosaryLength=['small','medium','large'].includes(el.dataset.length)?el.dataset.length:'medium';
  save();render();
 }
});
app.addEventListener('change',evt=>{
 if(evt.target.id==='cuiudo-language'){
  state.appLang=['pt','en','es','la'].includes(evt.target.value)?evt.target.value:'pt';
  state.verseLang=state.appLang==='en'?'en':'pt';
  save();render();
 }
});
app.addEventListener('input',evt=>{
 if(evt.target.id==='rosary-volume'){
  state.musicVolume=Math.max(0,Math.min(.5,Number(evt.target.value)/100));
  cuiudoMusic.setVolume(state.musicVolume);save();
 }
});
app.addEventListener('submit',evt=>{
 if(evt.target.id!=='rosary-intention-form')return;
 evt.preventDefault();
 state.rosaryIntention=String(evt.target.querySelector('textarea')?.value||'').slice(0,800);
 save();render();
});
render();