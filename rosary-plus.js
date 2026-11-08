/* CUIÚDO 12 — Rosário com música original, medalha de São Bento,
   20 pinturas locais e meditações Pequena / Média / Grande em 4 línguas.
   A configuração do contador permanece inalterada: 5 mistérios por terço. */
const cuiudoLangLabels={pt:'Português',en:'English',es:'Español',la:'Latina'};
const cuiudoNav={
 pt:{inicio:'Início',terco:'Terço',devocionario:'São Miguel',palavra:'Bíblia',diario:'Diário',verdade:'Reflexões',desafios:'Ação',exame:'Exame'},
 en:{inicio:'Home',terco:'Rosary',devocionario:'St Michael',palavra:'Bible',diario:'Journal',verdade:'Reflections',desafios:'Action',exame:'Examination'},
 es:{inicio:'Inicio',terco:'Rosario',devocionario:'San Miguel',palavra:'Biblia',diario:'Diario',verdade:'Reflexiones',desafios:'Acción',exame:'Examen'},
 la:{inicio:'Domus',terco:'Rosarium',devocionario:'S. Michael',palavra:'Biblia',diario:'Diarium',verdade:'Meditationes',desafios:'Opera',exame:'Examen'}
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
  '<img class="benedict-medal-photo" src="./assets/medalha-sao-bento-real.webp" fetchpriority="high" alt="'+escapeHtml(lines[2])+' frente e verso" width="900" height="540" onerror="this.src=\'./assets/medalha-sao-bento.svg\'">'+
  '<span class="benedict-medal-credit">Gec00 · CC0 · <a href="https://commons.wikimedia.org/wiki/File:Saint_Benedict_Medal.jpg" target="_blank" rel="noopener noreferrer">Wikimedia Commons ↗</a></span></div></section>';
}
const cuiudoBaseHome=combatHome;
combatHome=function(){
 return cuiudoBaseHome().replace(/<section class="cuiudo-hero">[\s\S]*?<\/section>/,cuiudoBenedictBanner());
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
   state.verseLang=l;
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
 const personalized=rosaryLanguageExtras.mysteries[m.id]?.[l];
 const strong=l==='pt'?mm.hard:loc.meditation;
 const question=l==='pt'?mm.question:(personalized?.question||t.question);
 const concrete=l==='pt'?m.action:(personalized?.action||extra.challenge);
 const prayer=l==='pt'?(mm.prayer||'Senhor, dai-me a coragem de viver o que acabo de contemplar. Amém.'):extra.offering;
 const fullPrayerList=cuiudoPrayersList();
 const credits=art.source?'<a href="'+escapeHtml(art.source)+'" target="_blank" rel="noopener noreferrer">'+escapeHtml(art.credit)+' ↗</a>':escapeHtml(art.credit);
 const musicLabel=cuiudoMusic.isSupported()?musicLabels.title:t.musicUnsupported;
 const artworkAlt={pt:'Pintura ilustrativa: ',en:'Illustrative painting: ',es:'Pintura ilustrativa: ',la:'Imago sacra: '}[l];
 const meditationBlock='<div class="rosary-meditation-block"><span class="card-meta">'+escapeHtml(t.meditation)+'</span>'+
  '<p class="readable">'+escapeHtml(loc.meditation)+'</p>'+
  (length==='small'?'':('<div class="virtue-strip"><span>'+escapeHtml(t.virtue)+'</span><strong>'+escapeHtml(loc.virtue)+'</strong></div>'+
    '<div class="question"><strong>'+escapeHtml(t.examine)+':</strong> '+escapeHtml(question)+'</div>'))+
  (length==='large'?('<div class="rosary-long"><h3>'+escapeHtml(t.reflection)+'</h3>'+
   '<blockquote class="confront">'+escapeHtml(strong)+'</blockquote>'+
   '<p>'+escapeHtml(t.act)+': '+escapeHtml(concrete)+'</p>'+
   '<div class="prayer-response"><span>'+escapeHtml(t.offering)+'</span><p>'+escapeHtml(prayer)+'</p></div></div>'):'')+'</div>';
 return '<section class="rosary-plus-header"><div><span class="eyebrow">'+escapeHtml(t.today)+': '+escapeHtml(cuiudoGroupName(dayGroup()))+'</span>'+
  '<h1 class="page-title">'+escapeHtml(t.rosary)+'</h1><p class="page-desc">'+escapeHtml(t.intro)+'</p></div>'+
  '<aside class="rosary-music-control rosary-music-v13" aria-label="'+escapeHtml(musicLabel)+'"><div class="music-heading">'+
   '<span class="music-disc" aria-hidden="true">♫</span><div><strong>'+escapeHtml(musicLabel)+'</strong>'+
   '<small>'+escapeHtml(musicInfo.title)+'</small></div></div>'+
   '<div class="rosary-track-options" role="group" aria-label="'+escapeHtml(musicLabels.title)+'">'+
     Object.keys(cuiudoMusic.tracks).map(id=>'<button type="button" class="rosary-track-option '+(musicTrack===id?'selected':'')+
      '" data-action="combat-rosary-track" data-track="'+id+'" aria-pressed="'+(musicTrack===id)+'">'+
       escapeHtml(musicLabels[id])+'</button>').join('')+'</div>'+
   '<div class="music-buttons"><button class="btn '+(musicOn?'music-active':'btn-secondary')+
   '" type="button" data-action="combat-rosary-music" aria-pressed="'+musicOn+'" '+(cuiudoMusic.isSupported()?'':'disabled')+'>'+
   '<span aria-hidden="true">'+(musicOn?'Ⅱ':'▶')+'</span> '+escapeHtml(musicOn?musicLabels.pause:musicLabels.play)+'</button>'+
   '<input type="range" id="rosary-volume" min="0" max="50" step="1" value="'+volume+
   '" aria-label="'+escapeHtml(t.volume)+'" title="'+escapeHtml(t.volume)+'"></div>'+
   (cuiudoMusic.hasError()?'<p class="audio-error" role="alert">'+escapeHtml(musicLabels.noAudio)+'</p>':'')+
   '<p class="rosary-music-credit">'+escapeHtml(musicInfo.author)+' · '+escapeHtml(musicInfo.license)+
    (musicInfo.source?' · <a href="'+escapeHtml(musicInfo.source)+'" target="_blank" rel="noopener noreferrer">'+escapeHtml(musicLabels.credit)+' ↗</a>':'')+'</p>'+
   (musicTrack==='templario'?'<p class="rosary-music-note">'+escapeHtml(musicLabels.note)+'</p>':'')+
   '</aside></section>'+
  '<section class="benedict-rosary-tip"><img src="./assets/medalha-sao-bento-real.webp" alt="Medalha de São Bento" loading="lazy" onerror="this.src=\'./assets/medalha-sao-bento.svg\'">'+
   '<div><strong>CRUX SACRA SIT MIHI LUX</strong><p>'+escapeHtml(t.notMagic)+'</p></div></section>'+
  '<div class="group-picker" role="group" aria-label="'+escapeHtml(t.today)+'">'+
    groupNames.map(id=>'<button class="group-button '+(state.group===id?'active':'')+
    '" type="button" data-action="group" data-id="'+id+'" aria-pressed="'+(state.group===id)+'">'+
    escapeHtml(cuiudoGroupName(id))+'</button>').join('')+'</div>'+
  '<section class="rosary-length"><div><span class="card-meta">'+escapeHtml(cuiudoLengthHeading[l])+'</span>'+
   '<p>'+escapeHtml({pt:'As cinco dezenas permanecem iguais; só muda a profundidade da meditação.',en:'The five decades stay the same; only the depth of each meditation changes.',es:'Las cinco decenas permanecen iguales; solo cambia la profundidad de la meditación.',la:'Quinque decades manent; tantum meditationis profunditas mutatur.'}[l])+'</p></div>'+
   '<div class="meditation-size-buttons" role="group" aria-label="'+escapeHtml(cuiudoLengthHeading[l])+'">'+
   ['small','medium','large'].map((size,i)=>'<button type="button" class="meditation-size '+(length===size?'active':'')+
   '" data-action="combat-meditation-length" data-length="'+size+'" aria-pressed="'+(length===size)+'">'+
   escapeHtml(cuiudoLengthLabels[l][i])+'</button>').join('')+'</div></section>'+
  '<section class="mystery-layout rosary-plus-layout"><div class="mystery-visual rosary-photo-wrap">'+
   '<span class="eyebrow">'+['I','II','III','IV','V'][state.mystery]+' · '+escapeHtml(cuiudoGroupName(state.group))+'</span>'+
   '<div class="rosary-painting"><img src="'+escapeHtml(art.url)+'" alt="'+escapeHtml(artworkAlt+loc.title)+'" loading="eager" decoding="async" width="800" height="1000" '+
    'onerror="if(!this.dataset.fallback){this.dataset.fallback=1;this.src=\'./assets/misterios/'+m.id+'.svg\';}">'+
   '</div><h2>'+escapeHtml(loc.title)+'</h2><small>'+escapeHtml(m.ref)+'</small>'+
   '<span class="rosary-art-credit">'+credits+'</span></div>'+
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
 if(state.tab!=='terco'&&cuiudoMusic.isPlaying())cuiudoMusic.stop();
 setTheme();
 const pages={
  inicio:combatHome,terco:cuiudoRosary,devocionario:devocionario,
  palavra:combatBible,diario:diary,verdade:truth,desafios:challenges,exame:examine
 };
 app.innerHTML=renderShell((pages[state.tab]||combatHome)());
 document.title=(cuiudoNav[cuiudoLocale()][state.tab]||'CUIÚDO')+' | CUIÚDO';
 if(document.body?.classList)document.body.classList.toggle('combat-modal-open',Boolean(state.feedOpen));
};
state.appLang=['pt','en','es','la'].includes(state.appLang)?state.appLang:'pt';
state.rosaryLength=['small','medium','large'].includes(state.rosaryLength)?state.rosaryLength:'medium';
state.musicVolume=Number.isFinite(Number(state.musicVolume))?Math.max(0,Math.min(.5,Number(state.musicVolume))):.22;
state.rosaryIntention=String(state.rosaryIntention||'').slice(0,800);
state.musicTrack=['catolico','templario','relaxar'].includes(state.musicTrack)?state.musicTrack:'catolico';
cuiudoMusic.select(state.musicTrack);
cuiudoMusic.setVolume(state.musicVolume);
app.addEventListener('click',evt=>{
 const el=evt.target.closest?.('[data-action]');if(!el)return;
 const action=el.dataset.action;
 if(action==='combat-rosary-music'){
  if(cuiudoMusic.isPlaying()){cuiudoMusic.stop();render();}
  else cuiudoMusic.play().then(()=>render()).catch(()=>render());
 }
 if(action==='combat-rosary-track'){
  state.musicTrack=['catolico','templario','relaxar'].includes(el.dataset.track)?el.dataset.track:'catolico';
  save();
  cuiudoMusic.select(state.musicTrack).then(()=>render()).catch(()=>render());
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
if(document.addEventListener)document.addEventListener('visibilitychange',()=>{
 if(document.hidden&&cuiudoMusic.isPlaying()){cuiudoMusic.stop();render();}
});
render();