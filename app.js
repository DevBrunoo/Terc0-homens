const STORE_KEY = 'cuiudo-v1';
const groupNames = ['gozosos', 'dolorosos', 'gloriosos', 'luminosos'];
const navItems = [
  {id:'inicio',label:'Início',mobile:'Início',icon:'home'},
  {id:'terco',label:'Terço diário',mobile:'Terço',icon:'rosary'},
  {id:'devocionario',label:'Santos e Anjos',mobile:'Santos',icon:'angel'},
  {id:'verdade',label:'Tapa na cara',mobile:'Verdade',icon:'flame'},
  {id:'desafios',label:'Desafios',mobile:'Ação',icon:'target'},
  {id:'exame',label:'Exame de consciência',mobile:'Exame',icon:'heart'},
  {id:'diario',label:'Meu diário',mobile:'Diário',icon:'book'}
];
const app = document.getElementById('app');
function escapeHtml(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function currentDay(){const d=new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
function dayGroup(){return ['gloriosos','gozosos','dolorosos','gloriosos','luminosos','dolorosos','gozosos'][new Date().getDay()];}
function truthDeck(){return state.mode==='brutal'?confrontosBrutais:confrontos;}
function dailyIndex(){let n=0; for(const c of currentDay().replaceAll('-','')) n=(n*31+c.charCodeAt(0))>>>0;return n%truthDeck().length;}
function storedState(){try{return JSON.parse(localStorage.getItem(STORE_KEY)||'{}')||{};}catch{return {};}}
const state={ tab:'inicio',group:dayGroup(),mystery:0,truthOffset:0,mode:'brutal',prayerOpen:false,devFilter:'todos',theme:'light',verseLang:'pt',mobileMore:false,designVersion:'apple-v11',...storedState()};
state.tab='inicio'; // Sempre abrir na home.
state.group=dayGroup(); // O dia determina o primeiro conjunto exibido.
state.mystery=0;
state.truthOffset=0;
if(state.designVersion!=='apple-v11'){state.theme='light';state.designVersion='apple-v11';save();}
state.theme=['light','dark','system'].includes(state.theme)?state.theme:'light';
state.mobileMore=false;
state.verseLang=state.verseLang==='en'?'en':'pt';
function save(){try{const {tab,prayerOpen,...keep}=state;localStorage.setItem(STORE_KEY,JSON.stringify(keep));}catch{ /* O app continua utilizável sem armazenamento */ }}
function readProgress(group=state.group){return state.progress?.[`${currentDay()}:${group}`] || [0,0,0,0,0];}
function changeCount(n){state.progress??={};const key=`${currentDay()}:${state.group}`;let arr=[...readProgress()];arr[state.mystery]=Math.max(0,Math.min(10,n));state.progress[key]=arr;save();}
function checkChallenge(n,checked){state.challengeDays??={};const key=currentDay();const arr=[...(state.challengeDays[key]||[false,false,false,false])];arr[n]=checked;state.challengeDays[key]=arr;save();}
function checkExamine(n,checked){state.examineDays??={};const key=currentDay();const arr=[...(state.examineDays[key]||[] )];arr[n]=checked;state.examineDays[key]=arr;save();}
function getChecks(){return state.challengeDays?.[currentDay()]||[false,false,false,false];}
function getExamine(){return state.examineDays?.[currentDay()]||[];}
function getTruth(){const deck=truthDeck();return deck[(dailyIndex()+state.truthOffset)%deck.length];}
function mysteryText(m){return state.mode==='brutal'?(marteladas[m.id]||m):m;}
function missionId(){return `${currentDay()}:${state.mode}:${getTruth().title}`;}
function missionDone(){return Boolean(state.missionDays?.[missionId()]);}
function missionButton(){return `<button class="btn ${missionDone()?'btn-muted':''}" data-action="mission-done" aria-pressed="${missionDone()}">${icon('check')} ${missionDone()?'Missão cumprida — desfazer':'Marcar missão cumprida'}</button>`;}
function countDone(){return readProgress().filter(n=>n===10).length;}
function icon(name,extra=''){
  const icons={
    home:'<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>',
    rosary:'<circle cx="12" cy="12" r="3"/><path d="M12 2v7M12 15v7M2 12h7M15 12h7M5 5l4 4M15 15l4 4M19 5l-4 4M9 15l-4 4"/>',
    angel:'<ellipse cx="12" cy="3.5" rx="4" ry="1.5"/><circle cx="12" cy="10" r="3"/><path d="M9 13c-3 0-6 2-7 5 4 1 7 0 10-3 3 3 6 4 10 3-1-3-4-5-7-5M9 21l3-6 3 6"/>',
    flame:'<path d="M12 22c5 0 8-3.3 8-8 0-3.3-2-6-5-9 .3 3-1.2 4.4-2.6 4.6C13 6 10.5 3.5 9 2 9.1 6.5 4 9.5 4 14c0 4.7 3 8 8 8Z"/><path d="M12 22c2.5 0 4-1.8 4-4 0-1.8-1-3-3-5 0 2-3 3-3 5 0 2.2.7 4 2 4Z"/>',
    target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    heart:'<path d="M20.8 4.6c-2.1-2.1-5.5-2.1-7.6 0L12 5.8l-1.2-1.2a5.4 5.4 0 0 0-7.6 7.6L12 21l8.8-8.8a5.4 5.4 0 0 0 0-7.6Z"/>',
    book:'<path d="M3 5.5C6 4 9 4 12 6c3-2 6-2 9-.5v13c-3-1.5-6-1.5-9 .5-3-2-6-2-9-.5zM12 6v13"/>',
    calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18"/>',
    arrow:'<path d="M5 12h14m-6-6 6 6-6 6"/>',
    arrowLeft:'<path d="M19 12H5m6-6-6 6 6 6"/>',
    check:'<path d="m4 12 5 5L20 6"/>',
    plus:'<path d="M12 4v16M4 12h16"/>',
    rotate:'<path d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5"/>',
    sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon:'<path d="M20.7 13.2A9 9 0 0 1 10.8 3.3 9 9 0 1 0 20.7 13.2Z"/>',
    shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/>',
    quote:'<path d="M10 11H4V5h6v7l-5 5M20 11h-6V5h6v7l-5 5"/>',
    save:'<path d="M4 3h14l3 3v15H3V3Zm3 0v6h10V3M7 21v-8h10v8"/>',
    trash:'<path d="M3 6h18M8 6V4h8v2M5 6l1 15h12l1-15M10 10v7m4-7v7"/>',
    lock:'<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>'
  };
  return `<svg class="icon ${extra}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name]||icons.home}</svg>`;
}
function scriptureText(v){return v[state.verseLang]||v.pt;}
function resolvedTheme(){return state.theme==='system'?(window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):state.theme;}
function setTheme(){const current=resolvedTheme();document.documentElement.dataset.theme=current;document.documentElement.style.colorScheme=current;const meta=document.querySelector('meta[name="theme-color"]');if(meta)meta.content=current==='dark'?'#0f1012':'#f5f5f7';}
function dateDisplay(){return new Intl.DateTimeFormat('pt-BR',{weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(new Date());}
function stats(){
  const all=Object.values(state.progress||{}).filter(x=>Array.isArray(x));
  const full=all.filter(arr=>arr.every(x=>x===10)).length;
  const activeDays=Object.values(state.challengeDays||{}).filter(arr=>arr.some(Boolean)).length;
  const todayChecks=getChecks().filter(Boolean).length;
  return {full,activeDays,todayChecks};
}
function navButton(item,cls='nav-button'){
  return `<button type="button" class="${cls}" data-action="navigate" data-tab="${item.id}" aria-current="${state.tab===item.id?'page':'false'}">${icon(item.icon)}<span>${cls==='nav-button'?item.label:item.mobile}</span></button>`;
}
function renderShell(content){
 const themes=[{id:'light',label:'Claro',ico:'sun'},{id:'dark',label:'Escuro',ico:'moon'},{id:'system',label:'Auto',ico:'rotate'}];
 const themeControl=`<div class="appearance-control" role="group" aria-label="Escolher tema">${themes.map(t=>`<button type="button" class="theme-option ${state.theme===t.id?'selected':''}" data-action="set-theme" data-theme="${t.id}" title="Tema ${t.label}" aria-label="Tema ${t.label}" aria-pressed="${state.theme===t.id}">${icon(t.ico)}<span>${t.label}</span></button>`).join('')}</div>`;
 const more=state.mobileMore?`<button type="button" class="more-backdrop" data-action="close-more" aria-label="Fechar menu"></button><div class="more-panel" role="dialog" aria-modal="true" aria-label="Mais áreas"><div class="more-panel-head"><strong>Explorar</strong><button class="more-close" data-action="close-more" aria-label="Fechar menu">✕</button></div>${navItems.map(x=>navButton(x,'more-nav-button')).join('')}</div>`:'';
 return `<div class="app-shell">
  <a href="#main-content" class="skip-link">Ir para o conteúdo</a>
  <header class="site-header">
    <div class="header-inner">
      <a class="logo" href="#inicio" data-action="navigate" data-tab="inicio" aria-label="CUIÚDO — início"><span class="logo-mark" aria-hidden="true">✝</span><span class="logo-type">cuiúdo<span class="logo-dot">.</span></span></a>
      <nav class="desktop-nav" aria-label="Navegação principal">${navItems.slice(0,4).map(x=>navButton(x)).join('')}<button type="button" class="nav-more ${state.mobileMore?'active':''}" data-action="toggle-more" aria-expanded="${Boolean(state.mobileMore)}">Mais ${icon('arrow')}</button></nav>
      <div class="header-tools"><button type="button" class="compact-menu" data-action="toggle-more" aria-expanded="${Boolean(state.mobileMore)}" title="Abrir menu">${icon('book')}<span>Menu</span></button>${themeControl}<button type="button" class="mode-switch ${state.mode==='brutal'?'on':''}" data-action="toggle-mode" aria-pressed="${state.mode==='brutal'}" title="Alternar intensidade das reflexões">${icon('flame')}<span>${state.mode==='brutal'?'Sem desculpas':'Modo firme'}</span></button></div>
    </div>
  </header>
  <main class="main" id="main-content">${content}
    <footer class="site-footer"><span>© CUIÚDO · FÉ, CORAGEM E AÇÃO</span><p>Projeto independente de espiritualidade católica. Versículos em traduções católicas históricas. As meditações são autorais; o exame não substitui a Confissão.</p></footer>
  </main>
  <nav class="mobile-nav" aria-label="Navegação do celular">${navItems.slice(0,4).map(x=>navButton(x,'mobile-nav-button')).join('')}<button type="button" class="mobile-nav-button mobile-more ${state.mobileMore?'more-active':''}" data-action="toggle-more" aria-expanded="${Boolean(state.mobileMore)}" aria-label="Mais opções">${icon('book')}<span>Mais</span></button></nav>
  ${more}
 </div>`;
}
function home(){
 const g=groups[dayGroup()];const progress=readProgress(dayGroup());const statsNow=stats();const truth=getTruth();
 const count=progress.reduce((a,b)=>a+b,0),pos=progress.findIndex(x=>x<10);
 const mystery=g.mysteries[Math.max(0,pos)],verse=versiculosPorMisterio[mystery.id];
 return `<section class="home-hero photo-hero">
   <div class="hero-main">
     <span class="kicker"><span class="kicker-mark">✦</span> FÉ QUE VIRA ATITUDE</span>
     <h1>Reza. Levanta.<br><span>Vai pra cima.</span></h1>
     <p>Nem tudo depende de você. Mas o que depende, você faz. Reze com verdade, encare o que precisa ser encarado e pare de negociar com a própria desculpa. <strong>Tem que fazer as coisas dar certo.</strong></p>
     <div class="hero-actions"><button class="btn btn-primary" data-action="navigate" data-tab="terco">Rezar o terço ${icon('arrow')}</button><button class="btn btn-secondary" data-action="navigate" data-tab="desafios">Partir para a ação</button></div>
     <div class="hero-note"><span class="hero-note-line"></span> SE FODA A DESCULPA. FAÇA A SUA PARTE. COM FÉ, JUÍZO E CARIDADE.</div>
   </div>
   <figure class="hero-photo-card">
     <img src="https://images.unsplash.com/photo-1654157632898-858fdbee3087?auto=format&fit=crop&q=86&w=1600" alt="Pessoa segurando um rosário com crucifixo" fetchpriority="high" decoding="async">
     <div class="hero-photo-shade"></div>
     <figcaption><span class="photo-kicker">TERÇO DE HOJE · ${g.short}</span><strong>${g.title}</strong><button class="photo-link" data-action="navigate" data-tab="terco">Começar oração ${icon('arrow')}</button></figcaption>
     <a class="photo-credit" href="https://unsplash.com/photos/a-person-holding-a-rosary-with-a-cross-on-it-CCC0CdEsI7E" target="_blank" rel="noopener noreferrer">Foto: Dolina Modlitwy / Unsplash ↗</a>
   </figure>
 </section>

 <section class="action-banner">
   <div class="action-copy"><span class="card-meta">MENTALIDADE CUIÚDO</span><h2>Tem hora que é oração.<br>Tem hora que é atitude.</h2><p>Ser forte não é bancar o invencível. É rezar, assumir responsabilidade, tomar a decisão difícil e continuar. Caiu? Levanta. Deu errado? Corrige. Ficou com medo? Vai com medo e com prudência.</p><div class="action-tags"><span>REZA</span><span>LEVANTA</span><span>FAZ</span><span>CONTINUA</span></div></div>
   <div class="fist-palm" aria-label="Animação simbólica de punho batendo na palma, representando determinação"><span class="palm" aria-hidden="true">✋</span><span class="fist" aria-hidden="true">👊</span><span class="impact" aria-hidden="true">✦</span><strong>VAI PRA CIMA.</strong><small>Sem teatrinho. Com atitude.</small></div>
 </section>

 <section class="overview-heading"><div><span class="kicker">CONTINUE SUA JORNADA</span><h2>Um próximo passo. Depois outro.</h2></div><span class="overview-date">${escapeHtml(dateDisplay())}</span></section>
 <section class="home-dashboard">
   <article class="card rosary-feature">
     <div class="feature-top"><span class="card-meta">01 / ORAÇÃO</span><span class="feature-icon">${icon('rosary')}</span></div>
     <h3 class="card-title">Seu terço de hoje.</h3><p>${g.title}. Uma dezena por vez, um encontro de cada vez.</p>
     <div class="feature-progress"><div class="progress"><div class="progress-fill" style="width:${count*2}%"></div></div><div class="progress-label"><span>${progress.filter(x=>x===10).length} de 5 dezenas</span><strong>${count}/50</strong></div></div>
     <button class="text-link" data-action="navigate" data-tab="terco">${count===50?'Revisitar oração':'Continuar rezando'} ${icon('arrow')}</button>
   </article>
   <article class="card truth-card">
     <div class="feature-top"><span class="card-meta">02 / REFLEXÃO</span><span class="feature-icon">${icon('flame')}</span></div>
     <h3 class="card-title">A verdade transforma.</h3><p class="truth-topic">${escapeHtml(truth.title)}</p><blockquote>${escapeHtml(truth.quote)}</blockquote>
     <button class="text-link" data-action="navigate" data-tab="verdade">Refletir agora ${icon('arrow')}</button>
   </article>
 </section>

 <section class="photo-story-grid" aria-label="Momentos de fé">
   <figure class="story-photo story-photo-wide">
     <img loading="lazy" decoding="async" src="https://images.unsplash.com/photo-1491566102020-21838225c3c8?auto=format&fit=crop&q=86&w=1600" alt="Feixes de luz entrando no interior da Basílica de São Pedro">
     <div class="story-overlay"></div><figcaption><span>SILÊNCIO TAMBÉM É FORÇA.</span><strong>Você não precisa correr o tempo todo. Precisa saber por que está correndo.</strong><a href="https://unsplash.com/photos/sunlight-beams-inside-ornate-cathedral--0gBnnMdQPw" target="_blank" rel="noopener noreferrer">Chad Greiter / Unsplash ↗</a></figcaption>
   </figure>
   <figure class="story-photo">
     <img loading="lazy" decoding="async" src="https://images.unsplash.com/photo-1762967020428-66cdb1a6d789?auto=format&fit=crop&q=86&w=1600" alt="Interior minimalista de uma igreja moderna iluminada pela luz natural">
     <div class="story-overlay"></div><figcaption><span>VOLTE AO ESSENCIAL.</span><strong>Menos barulho. Mais presença.</strong><a href="https://unsplash.com/photos/modern-concrete-church-interior-with-sunlight-streaming-in-ioHO90sxxJA" target="_blank" rel="noopener noreferrer">Julia Taubitz / Unsplash ↗</a></figcaption>
   </figure>
 </section>

 <section class="home-bottom">
   <article class="card scripture-card"><div class="feature-top"><span class="card-meta">03 / PALAVRA DE DEUS</span><span class="scripture-ref">${escapeHtml(verse.ref)}</span></div>
      <blockquote lang="${state.verseLang==='pt'?'pt-BR':'en'}">“${escapeHtml(scriptureText(verse))}”</blockquote>
      <div class="scripture-card-foot"><span>${state.verseLang==='pt'?'Pe. Antônio Pereira de Figueiredo':'Douay-Rheims 1899'}</span><button class="text-link" data-action="navigate" data-tab="terco">Meditar ${icon('arrow')}</button></div>
   </article>
   <article class="card progress-card"><div class="feature-top"><span class="card-meta">04 / SEU PROGRESSO</span><span class="feature-icon">${icon('check')}</span></div><h3 class="card-title">Pequenas vitórias.</h3>
     <div class="stat-row"><div><strong>${statsNow.full}</strong><span>Terços completos</span></div><div><strong>${statsNow.activeDays}</strong><span>Dias de atitude</span></div><div><strong>${statsNow.todayChecks}<small>/4</small></strong><span>Hábitos de hoje</span></div></div>
     <button class="text-link" data-action="navigate" data-tab="diario">Abrir diário ${icon('arrow')}</button>
   </article>
 </section>
 <section class="prayer-cta"><div><span class="card-meta">ORE COM A IGREJA</span><h2>Santos, anjos e orações.</h2><p>Intercessão, perseverança e um coração voltado para Cristo.</p></div><button class="btn btn-secondary" data-action="navigate" data-tab="devocionario">Explorar orações ${icon('arrow')}</button></section>`;
}
function rosary(){
 const g=groups[state.group]; const arr=readProgress(); const m=g.mysteries[state.mystery];const mm=mysteryText(m);const n=arr[state.mystery];const versiculo=versiculosPorMisterio[m.id];
 return `<h1 class="page-title">O Santo Terço</h1><p class="page-desc">Contemple a vida de Cristo, examine a própria consciência e transforme a oração em caridade. Mistérios tradicionais organizados por dia da semana; você também pode escolher outros.</p>
 <div class="eyebrow">Mistérios de hoje: ${groups[dayGroup()].short}</div><div class="group-picker" role="group" aria-label="Escolher grupo de mistérios">${groupNames.map(id=>`<button type="button" class="group-button ${state.group===id?'active':''}" data-action="group" data-id="${id}" aria-pressed="${state.group===id}">${groups[id].short}</button>`).join('')}</div>
 <section class="mystery-layout"><div class="mystery-visual"><div class="eyebrow">${state.mystery+1}º mistério • ${g.short}</div><img src="./assets/misterios/${m.id}.svg" alt="Arte simbólica: ${escapeHtml(m.title)}"/><h2>${m.title}</h2><small>${m.ref}</small></div>
 <div class="mystery-detail"><div class="card"><div class="scripture-verse"><div class="scripture-top"><span class="card-meta">ESCRITURA SAGRADA · ${escapeHtml(versiculo.ref)}</span><div class="verse-switch" role="group" aria-label="Idioma do versículo"><button type="button" data-action="verse-lang" data-lang="pt" aria-pressed="${state.verseLang==='pt'}" class="${state.verseLang==='pt'?'active':''}">PT</button><button type="button" data-action="verse-lang" data-lang="en" aria-pressed="${state.verseLang==='en'}" class="${state.verseLang==='en'?'active':''}">EN</button></div></div><blockquote lang="${state.verseLang==='pt'?'pt-BR':'en'}">“${escapeHtml(scriptureText(versiculo))}”</blockquote><div class="scripture-footer"><span>${state.verseLang==='pt'?'Pe. Antônio Pereira de Figueiredo':'Douay-Rheims 1899'} · ${versiculo.excerptPt&&state.verseLang==='pt'?'Excerto literal · ':''}Domínio público</span><a href="${state.verseLang==='pt'?versiculo.ptSource:versiculo.enSource}" rel="noopener noreferrer" target="_blank">Ler capítulo completo ↗</a></div></div><div class="card-meta">Meditação do Evangelho</div><p class="readable">${m.summary}</p><div class="kicker-line"></div><div class="card-meta">${state.mode==='brutal'?'SEM DESCULPAS · A VERDADE QUE DÓI':'Tapa na cara da realidade'}</div><blockquote class="confront">“${escapeHtml(mm.hard)}”</blockquote><div class="question"><strong>Exame de consciência:</strong> ${escapeHtml(mm.question)}</div>${mm.prayer?`<div class="prayer-response"><span>ORAÇÃO DE COMBATE</span><p>${escapeHtml(mm.prayer)}</p></div>`:''}</div></div></section>
 <section class="decade-panel"><div class="decade-header"><strong>Contador da dezena</strong><span class="card-meta">${n} / 10 Ave-Marias</span></div><p class="decade-description">Antes de cada dezena, reze um Pai-Nosso. Reze 10 Ave-Marias e encerre com o Glória ao Pai. O contador registra apenas as Ave-Marias.</p><div class="count-bubbles" aria-label="${n} de 10 Ave-Marias rezadas">${Array.from({length:10},(_,i)=>`<span class="bead ${i<n?'done':''}" aria-hidden="true"></span>`).join('')}</div><div class="decade-buttons"><button class="btn" data-action="add-bead" ${n>=10?'disabled':''}>${icon('plus')} ${n===10?'Dezena concluída':'Rezei uma Ave-Maria'}</button><button class="btn btn-muted" data-action="undo-bead" ${n===0?'disabled':''}>Desfazer 1</button><button class="btn btn-ghost" data-action="reset-decade">Reiniciar dezena</button></div><div class="stepper" role="group" aria-label="Selecionar mistério">${g.mysteries.map((x,i)=>`<button class="step ${i===state.mystery?'current':''} ${arr[i]===10?'finished':''}" data-action="mystery" data-index="${i}" aria-label="${i+1}º mistério: ${x.title}" aria-current="${i===state.mystery?'step':'false'}">${arr[i]===10?icon('check'):i+1}</button>`).join('')}</div><div class="two-buttons"><button class="btn btn-muted" data-action="prev-mystery" ${state.mystery===0?'disabled':''}>${icon('arrowLeft')} Anterior</button><button class="btn btn-ghost" data-action="next-mystery" ${state.mystery===4?'disabled':''}>Próximo mistério ${icon('arrow')}</button></div>${arr.every(x=>x===10)?'<div class="action-line">'+icon('check')+'<span>Terço concluído! Ofereça esta oração a Deus e leve um gesto de amor ao seu dia.</span></div>':''}</section>
 <div class="section-head"><h2>Orações do terço</h2></div><p class="page-desc">Comece com o Sinal da Cruz e o Credo; reze um Pai-Nosso, três Ave-Marias e um Glória. Em cada mistério, reze um Pai-Nosso, dez Ave-Marias e um Glória. Conclua com a Salve-Rainha.</p><section class="prayer-list">${prayers.map((p,i)=>`<details class="card prayer-card" ${i===2?'open':''}><summary>${escapeHtml(p.name)}</summary><p>${escapeHtml(p.text)}</p></details>`).join('')}</section><div class="section-head"><h2>Ladainha e orações especiais</h2></div><section class="prayer-list"><details class="card prayer-card" id="ladainha"><summary>Ladainha de Nossa Senhora — versão breve</summary><p>${escapeHtml(ladainhaBreve.join('\n'))}</p><p class="devotional-source">Esta é uma ladainha autoral breve. <a target="_blank" rel="noopener noreferrer" href="${fonteLadainhaOficial}">Ler a Ladainha Lauretana completa no Vaticano</a>.</p></details><details class="card prayer-card"><summary>Oração a São Miguel Arcanjo</summary><p>${escapeHtml(oracoesDevocionario.find(x=>x.id==='miguel').text)}</p><p><a href="#" data-action="navigate" data-tab="devocionario">Mais orações aos santos e anjos ${icon('arrow')}</a></p></details></section>`;
}
function truth(){const t=getTruth();return `<h1 class="page-title">${state.mode==='brutal'?'SEM DESCULPAS.':'Tapa na cara da realidade'}</h1><p class="page-desc">${state.mode==='brutal'?'VAI PRA CIMA. SEJA CUIÚDO. O CONFRONTO NÃO É CONTRA VOCÊ. É CONTRA AS SUAS DESCULPAS. Examine-se com coragem e faça o que é certo, sem vender a alma ao comodismo.':'Palavras firmes para sacudir a consciência, sem destruir a dignidade. A verdade conduz à misericórdia e à ação.'}</p>
 <section class="truth-large"><div class="eyebrow">Confronto nº ${String(((dailyIndex()+state.truthOffset)%truthDeck().length)+1).padStart(2,'0')} • ${escapeHtml(t.topic)}</div><h2>${escapeHtml(t.title)}</h2><div class="quote-mark">“</div><blockquote>${escapeHtml(t.quote)}</blockquote><div class="kicker-line"></div><p class="readable"><strong style="color:var(--gold)">A verdade:</strong> ${escapeHtml(t.truth)}</p><div class="action-line">${icon('target')}<span><strong>Sua missão:</strong> ${escapeHtml(t.action)}</span></div><div class="truth-footer"><span class="filter-tag">${escapeHtml(t.ref)}</span><span class="filter-tag">Sem desculpas. Com caridade.</span></div><div class="mission-commit"><div><span class="card-meta">NÃO É FRASE BONITA. É DECISÃO.</span><p>${missionDone()?'Você marcou esta missão como cumprida. Continue com humildade.':'Só marque depois que cumprir a ação de verdade. Sem mentir para si mesmo.'}</p></div>${missionButton()}</div><div class="two-buttons"><button class="btn btn-ghost" data-action="next-truth">Outro confronto ${icon('arrow')}</button><button class="btn btn-ghost" data-action="navigate" data-tab="desafios">Partir para a ação ${icon('arrow')}</button></div></section>`;}
function challenges(){const checks=getChecks();const done=checks.filter(Boolean).length;return `<h1 class="page-title">VAI PRA CIMA. SEJA CUIÚDO.</h1><p class="page-desc">Fé sem atitude não é projeto de vida. Tem que fazer acontecer! Quatro compromissos simples para hoje. Sua vida não muda só porque você pensou bonito. Faça o bem possível, sem espetáculo e sem fugir das responsabilidades.</p><div class="card" style="margin-bottom:20px"><div class="decade-header"><div><div class="card-meta">Disciplina do dia</div><h2 class="card-title">${done} de 4 compromissos cumpridos</h2></div><div class="stat-value">${done===4?'✝':`${Math.round(done/4*100)}%`}</div></div><div class="progress"><div class="progress-fill" style="width:${done*25}%"></div></div><p>${done===4?'Você cumpriu os compromissos de hoje. Agradeça a Deus e mantenha o coração humilde.':'A prática diária, mesmo pequena, constrói constância.'}</p></div>
 <section class="checklist">${baseChallenges.map((x,i)=>`<label class="checkrow"><input type="checkbox" data-kind="challenge" data-index="${i}" ${checks[i]?'checked':''}/><span><strong>${escapeHtml(x.label)}</strong><small>${escapeHtml(x.details)} • ${escapeHtml(x.type)}</small></span></label>`).join('')}</section><div class="section-head"><h2>Missão extra</h2></div><div class="card"><div class="card-meta">Não adie</div><h3 class="card-title">${escapeHtml(getTruth().action)}</h3><p>Esta missão é uma proposta de ação, não uma cobrança impossível. Priorize o que é seguro, justo e compatível com seus deveres.</p></div>`;}
function examine(){const arr=getExamine();const selected=arr.filter(Boolean).length;return `<h1 class="page-title">Exame de consciência</h1><p class="page-desc">Não é um tribunal para esmagar você. É um encontro honesto com a verdade diante de Deus. Marque os pontos que precisam de revisão, reze e planeje um passo de conversão.</p>
 <div class="card" style="margin-bottom:18px"><div class="card-meta">Pelo amor à verdade</div><h2 class="card-title">“Senhor, mostra-me o que preciso mudar.”</h2><p>Faça silêncio. Examine atitudes, omissões e intenções. Diferencie tentações de escolhas conscientes; procure o sacramento da Reconciliação quando necessário.</p></div>
 <section class="checklist">${examineItems.map((x,i)=>`<label class="checkrow"><input type="checkbox" data-kind="examine" data-index="${i}" ${arr[i]?'checked':''}/><span>${escapeHtml(x)}</span></label>`).join('')}</section>
 <div class="completion-row"><span>${selected} ponto(s) selecionado(s) para refletir</span><span>Privado • salvo somente neste navegador</span></div>
 <div class="card"><div class="card-meta">Oração de arrependimento</div><blockquote class="confront" style="font-size:21px">Meu Deus, reconheço minhas faltas. Dai-me humildade para pedir perdão, coragem para reparar o mal e força para recomeçar na vossa graça. Amém.</blockquote><p>Se você reconheceu um pecado grave, procure a Confissão sacramental. Nenhum checklist substitui a conversa com um sacerdote.</p><button class="btn btn-ghost" data-action="navigate" data-tab="diario">Registrar meu propósito ${icon('arrow')}</button></div>`;}
function diary(){const notes=Array.isArray(state.notes)?state.notes:[];return `<h1 class="page-title">Diário de conversão</h1><p class="page-desc">A mudança ganha forma quando você assume sua história. Escreva com sinceridade o que precisa enfrentar e qual será seu próximo passo.</p>
 <section class="grid-2"><div class="card"><div class="card-meta">Meu compromisso com a verdade</div><h2 class="card-title">O que eu preciso mudar hoje?</h2><form id="journal-form"><label class="input-label" for="journal-text">Escreva uma reflexão ou resolução concreta</label><textarea id="journal-text" name="journal-text" maxlength="2000" placeholder="Hoje eu percebi que... A partir de agora vou..." required></textarea><div class="two-buttons"><button class="btn" type="submit">${icon('save')} Salvar reflexão</button></div></form><p class="disclaimer">${icon('lock')} Suas anotações ficam apenas no armazenamento local deste navegador. Não escreva dados extremamente sensíveis; limpar os dados do navegador pode apagá-las.</p></div>
 <div class="card"><div class="card-meta">Um princípio inegociável</div><h2 class="card-title">Arrependimento sem atitude vira promessa vazia.</h2><p>Não escreva para impressionar ninguém. Reconheça uma decisão objetiva, possível e caridosa. Amanhã, volte e avalie se cumpriu.</p><div class="action-line">${icon('sun')}<span>Uma queda não torna você incapaz de recomeçar. Graça, oração e um passo de cada vez.</span></div></div></section>
 <div class="section-head"><h2>Reflexões salvas</h2><span class="card-meta">${notes.length} registro(s)</span></div>${notes.length?notes.map((n,i)=>`<article class="note"><div class="decade-header"><span class="note-date">${escapeHtml(new Date(n.time).toLocaleDateString('pt-BR',{day:'2-digit',month:'long',year:'numeric'}))}</span><button class="link-button" data-action="delete-note" data-index="${i}" aria-label="Excluir esta anotação">${icon('trash')} Excluir</button></div><p>${escapeHtml(n.text)}</p></article>`).join(''):'<div class="empty">Seu diário está vazio. O primeiro passo é admitir a verdade e escolher uma atitude.</div>'}`;}
function devocionario(){
 const filters=[{id:'todos',label:'Todas as orações'},{id:'anjos',label:'Anjos e arcanjos'},{id:'santos',label:'Santos'},{id:'mariana',label:'Nossa Senhora'}];
 const active=filters.some(f=>f.id===state.devFilter)?state.devFilter:'todos';
 const list=oracoesDevocionario.filter(p=>active==='todos'||p.category===active);
 return `<div class="devotional-hero"><span class="eyebrow">CÉU, INTERCESSÃO E COMBATE INTERIOR</span><h1 class="page-title">Santos & Anjos</h1><p class="page-desc">Não adoramos os santos nem os anjos: pedimos sua intercessão diante de Deus. A adoração pertence somente à Santíssima Trindade. Abre uma oração, recolhe o coração e fala com Deus.</p><div class="angel-mark" aria-hidden="true">${icon('angel')}</div></div>
 <div class="devotion-filters" role="group" aria-label="Filtrar orações">${filters.map(f=>`<button class="group-button ${active===f.id?'active':''}" data-action="dev-filter" data-filter="${f.id}" aria-pressed="${active===f.id}">${escapeHtml(f.label)}</button>`).join('')}</div>
 <div class="card-meta" style="margin:0 0 12px">${list.length} ORAÇÕES DISPONÍVEIS · ANJOS RECONHECIDOS NA TRADIÇÃO CATÓLICA</div>
 <section class="devotion-grid">${list.map(p=>`<details class="card devotion-card" id="oracao-${p.id}"><summary><span class="devotion-symbol" aria-hidden="true">${p.category==='anjos'?icon('angel'):p.category==='mariana'?'✝':'✦'}</span><span><strong>${escapeHtml(p.name)}</strong><small>${escapeHtml(p.type)} • ${escapeHtml(p.ref)}</small></span></summary><div class="devotion-text">${escapeHtml(p.text)}</div>${p.source?`<a class="devotion-link" href="${escapeHtml(p.source)}" target="_blank" rel="noopener noreferrer">Fonte e referência devocional ↗</a>`:''}</details>`).join('')}</section>
 <div class="card devotional-note"><h2 class="card-title">Oração não é magia.</h2><p>Os santos intercedem; quem salva é Jesus Cristo. Não há promessa de resultados automáticos, cura garantida ou bênção comprada. A oração verdadeira abre o coração à graça e à conversão.</p><button class="btn btn-ghost" data-action="navigate" data-tab="terco">Voltar ao Santo Terço ${icon('arrow')}</button></div>`;
}
function render(){
 setTheme();
 const pages={inicio:home,terco:rosary,devocionario:devocionario,verdade:truth,desafios:challenges,exame:examine,diario:diary};
 app.innerHTML=renderShell((pages[state.tab]||home)());
 document.title=`${navItems.find(n=>n.id===state.tab)?.label||'Início'} | CUIÚDO`;
}
app.addEventListener('click',evt=>{
 const target=evt.target.closest('[data-action]');if(!target)return;
 const a=target.dataset.action;
 if(a.startsWith('combat-'))return; // ações pertencem ao módulo visual v9
 if(a==='navigate') {evt.preventDefault();state.tab=target.dataset.tab;state.mobileMore=false;window.scrollTo({top:0,behavior:'instant'});}
 if(a==='group') {state.group=target.dataset.id;state.mystery=0;save();}
 if(a==='dev-filter'){state.devFilter=target.dataset.filter;save();}
 if(a==='mystery')state.mystery=Number(target.dataset.index);
 if(a==='next-mystery')state.mystery=Math.min(4,state.mystery+1);
 if(a==='prev-mystery')state.mystery=Math.max(0,state.mystery-1);
 if(a==='add-bead')changeCount(readProgress()[state.mystery]+1);
 if(a==='undo-bead')changeCount(readProgress()[state.mystery]-1);
 if(a==='reset-decade'&&confirm('Reiniciar a contagem desta dezena?'))changeCount(0);
 if(a==='next-truth')state.truthOffset=(state.truthOffset+1)%truthDeck().length;
 if(a==='toggle-mode'){state.mode=state.mode==='brutal'?'firme':'brutal';state.truthOffset=0;save();}
 if(a==='toggle-theme'){state.theme=state.theme==='light'?'dark':'light';save();}
 if(a==='set-theme'){state.theme=['light','dark','system'].includes(target.dataset.theme)?target.dataset.theme:'light';state.designVersion='apple-v11';save();}
 if(a==='toggle-more'){
   state.mobileMore=!state.mobileMore;
   // Na navbar, abrir as opções imediatamente abaixo do botão clicado.
   if(state.mobileMore && typeof target.getBoundingClientRect==='function'){
    const rect=target.getBoundingClientRect();
    const viewport=Number(window.innerWidth)||1024;
    const width=Math.min(265,viewport-24);
    state.moreMenuLeft=Math.max(12,Math.min(rect.left,viewport-width-12));
    state.moreMenuTop=Math.max(54,rect.bottom+7);
   }
  }
 if(a==='close-more'){state.mobileMore=false;}
 if(a==='verse-lang'){state.verseLang=target.dataset.lang==='en'?'en':'pt';state.appLang=state.verseLang;save();}
 if(a==='mission-done'){state.missionDays??={};state.missionDays[missionId()]=!missionDone();save();}
 if(a==='delete-note'){
   const i=Number(target.dataset.index);
   if(confirm('Excluir esta reflexão do diário?')){state.notes.splice(i,1);save();}else return;
 }
 render();
});
app.addEventListener('change',evt=>{
 const t=evt.target;if(t.dataset.kind==='challenge'){checkChallenge(Number(t.dataset.index),t.checked);render();}
 if(t.dataset.kind==='examine'){checkExamine(Number(t.dataset.index),t.checked);render();}
});
app.addEventListener('submit',evt=>{
 if(evt.target.id!=='journal-form')return;
 evt.preventDefault();const text=evt.target.querySelector('textarea')?.value.trim();
 if(!text)return;
 state.notes??=[];state.notes.unshift({time:new Date().toISOString(),text:text.slice(0,2000)});state.notes=state.notes.slice(0,100);
 save();render();
});
render();
if(window.matchMedia){const query=window.matchMedia('(prefers-color-scheme: dark)');if(query.addEventListener)query.addEventListener('change',()=>{if(state.theme==='system')render();});}
if('serviceWorker' in navigator && location.protocol!=='file:')navigator.serviceWorker.register('./sw.js').catch(()=>{});

