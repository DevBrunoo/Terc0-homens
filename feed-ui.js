/* CUIÚDO V9 — UI de feed, combate espiritual e arte clássica.
   Carregado depois do app base; preserva dados, terço, diário e orações. */
const combatTabs=[
 {id:'inicio',label:'Feed',mobile:'Feed',icon:'home'},
 {id:'terco',label:'Rezar',mobile:'Rezar',icon:'rosary'},
 {id:'devocionario',label:'Santos',mobile:'Santos',icon:'angel'},
 {id:'palavra',label:'Versículos',mobile:'Bíblia',icon:'book'},
 {id:'diario',label:'Diário',mobile:'Diário',icon:'book'},
 {id:'verdade',label:'Sem desculpas',mobile:'Verdade',icon:'flame'},
 {id:'desafios',label:'Ir pra cima',mobile:'Ação',icon:'target'},
 {id:'exame',label:'Exame',mobile:'Exame',icon:'heart'}
];
function combatNavBtn(tab,cls='nav-button'){
 const saints={pt:'Santos',en:'Saints',es:'Santos',la:'Sancti'};
 const title=tab.id==='devocionario'?(saints[state.appLang]||saints.pt):(cls==='nav-button'?tab.label:tab.mobile);
 return `<button type="button" class="${cls}" data-action="navigate" data-tab="${tab.id}" aria-current="${state.tab===tab.id?'page':'false'}">${icon(tab.icon)}<span>${escapeHtml(title)}</span></button>`;
}
function combatNormalize(s){return String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('pt-BR');}
function combatSaved(id){return Boolean(state.feedSaved?.[id]);}
function combatDone(id){return Boolean(state.feedDone?.[currentDay()]?.[id]);}
function combatMatches(p){
 if(state.feedFilter==='salvos'&&!combatSaved(p.id))return false;
 if(state.feedFilter!=='salvos'&&state.feedFilter!=='todos'&&p.category!==state.feedFilter)return false;
 const q=combatNormalize(state.feedTerm).trim();
 return !q||combatNormalize([p.title,p.kicker,p.ref,p.reflection,p.action].join(' ')).includes(q);
}
function combatPoster(p,i){
 const art=feedArtwork[p.art];
 return `<article class="poster-card ${i===0?'wide':''}" data-feed-id="${escapeHtml(p.id)}">
   <button type="button" class="poster-open" data-action="combat-open" data-id="${p.id}" aria-label="Abrir reflexão ${escapeHtml(p.title)}">
    <img src="${escapeHtml(art.url)}" loading="lazy" decoding="async" alt="${escapeHtml(art.credit)}" onerror="if(!this.dataset.fallback){this.dataset.fallback='1';this.src='./assets/feed/fallback.svg';this.style.objectFit='cover';}" />
    <span class="poster-shade" aria-hidden="true"></span>
    <span class="poster-topline"><span class="poster-label">${escapeHtml(p.kicker)}</span><span class="poster-index">${String(i+1).padStart(2,'0')}</span></span>
    <strong class="poster-words">${escapeHtml(p.title)}</strong>
   </button>
   <div class="poster-control-row"><span class="post-topic">${escapeHtml(p.ref)}</span><span class="poster-actions">
    <button type="button" data-action="combat-save" data-id="${p.id}" aria-pressed="${combatSaved(p.id)}" aria-label="${combatSaved(p.id)?'Remover dos salvos':'Salvar reflexão'}">${combatSaved(p.id)?'♥':'♡'}</button>
    <button type="button" data-action="combat-share" data-id="${p.id}" aria-label="Compartilhar reflexão">${icon('arrow')}</button>
   </span></div>
  </article>`;
}
function combatPostDetail(p){
 const a=feedArtwork[p.art];
 return `<div class="feed-overlay" data-action="combat-close" role="presentation">
   <div class="feed-modal" role="dialog" aria-modal="true" aria-label="${escapeHtml(p.title)}">
    <button type="button" data-action="combat-close" class="feed-close" aria-label="Fechar reflexão">×</button>
    <div class="feed-modal-image"><img src="${escapeHtml(a.url)}" alt="${escapeHtml(a.credit)}" onerror="if(!this.dataset.fallback){this.dataset.fallback='1';this.src='./assets/feed/fallback.svg';this.style.objectFit='cover';}" /><span class="poster-shade" aria-hidden="true"></span><strong class="poster-words">${escapeHtml(p.title)}</strong></div>
    <div class="feed-modal-content">
      <span class="feed-modal-kicker">${escapeHtml(p.kicker)} • CUIÚDO</span>
      <h2>SEM DESCULPA. COM FÉ E ATITUDE.</h2>
      <div class="modal-ref">Medite: ${escapeHtml(p.ref)} · frase autoral, não versículo literal</div>
      <p>${escapeHtml(p.reflection)}</p>
      <div class="modal-task"><strong>AÇÃO CUIÚDA</strong><p>${escapeHtml(p.action)}</p></div>
      <div class="modal-toolbar">
       <button type="button" class="btn btn-primary" data-action="combat-done" data-id="${p.id}">${combatDone(p.id)?'✓ Ação cumprida':'Marcar ação cumprida'}</button>
       <button type="button" class="btn btn-secondary" data-action="combat-save" data-id="${p.id}">${combatSaved(p.id)?'♥ Salvo':'♡ Salvar'}</button>
       <button type="button" class="btn btn-secondary" data-action="combat-share" data-id="${p.id}">Compartilhar</button>
      </div>
      <div class="feed-credit">Imagem: ${escapeHtml(a.credit)}. ${escapeHtml(a.license)}. <a target="_blank" rel="noopener noreferrer" href="${escapeHtml(a.source)}">Ver origem e licença ↗</a></div>
    </div>
   </div>
  </div>`;
}
function combatHome(){
 const g=groups[dayGroup()],prog=readProgress(dayGroup()),done=prog.reduce((n,v)=>n+v,0);
 const picks=feedPosts.filter(combatMatches),selected=feedPosts.find(p=>p.id===state.feedOpen);
 const lead=feedArtwork['miguel-reni'],daily=feedPosts[(new Date().getDate()+new Date().getDay())%feedPosts.length];
 return `<section class="cuiudo-punch-strip" aria-label="Coragem e ação"><div class="punch-symbol" aria-hidden="true"><span class="punch-palm">✋</span><span class="punch-fist">👊</span><span class="punch-spark">✦</span></div><div><strong>Tem que fazer dar certo, SFD!<br>Vai para cima.</strong></div><button type="button" class="punch-link" data-action="navigate" data-tab="desafios">PARTIR PRA AÇÃO ↗</button></section>
 <section class="cuiudo-hero">
  <img class="cuiudo-hero-photo" src="${escapeHtml(lead.url)}" alt="São Miguel derrotando Satanás, pintura clássica de Guido Reni" fetchpriority="high" decoding="async" onerror="if(!this.dataset.fallback){this.dataset.fallback='1';this.src='./assets/feed/fallback.svg';this.style.objectFit='cover';}">
  <div class="cuiudo-hero-content">
    <div class="cuiudo-hero-kicker"><span class="cuiudo-star">✠</span> FÉ EM DEUS E PÉ NA TÁBUA</div>
    <h1>TEM QUE SER<em>CUIÚDO.</em></h1>
    <p>A vida exige coragem. <strong>Reza. Levanta. Vai pra cima.</strong> Quem ama a Deus não foge da verdade, não vende a consciência e não deixa a preguiça decidir o futuro.</p>
    <div class="cuiudo-hero-actions"><button type="button" class="btn btn-primary" data-action="navigate" data-tab="terco">REZAR O TERÇO ${icon('arrow')}</button><button type="button" class="btn btn-secondary" data-action="navigate" data-tab="desafios">FAZER ACONTECER</button></div>
    <div class="cuiudo-hero-footer">SEM DESCULPA. SEM FUGA. COM FÉ, JUÍZO E AÇÃO.</div>
  </div>
  <div class="cuiudo-hero-credit"><a href="${escapeHtml(lead.source)}" target="_blank" rel="noopener noreferrer">Guido Reni · domínio público ↗</a></div>
 </section>
 <section class="cuiudo-grace-reflection" aria-labelledby="cuiudo-grace-title">
  <span class="cuiudo-grace-eyebrow">✝ COMUNHÃO • GRAÇA • SANTIDADE</span>
  <h2 id="cuiudo-grace-title">Ansiedade, mente acelerada, medo e tristeza é falta de Deus.</h2>
  <p>Ele morreu na cruz por você e sofreu chicotadas e tudo de mal. <strong>Sfd o problema, vai para cima!</strong></p>
 </section>
 <section class="cuiudo-feed-toolbar"><div><h2>CONFRONTO DO DIA.</h2><p>Arte, fé, trabalho e coragem. Sem passar a mão na cabeça.</p></div><label class="feed-searchbar"><span aria-hidden="true">⌕</span><input type="search" id="feed-search" placeholder="Buscar fé, São Miguel, trabalho..." autocomplete="off" value="${escapeHtml(state.feedTerm)}" aria-label="Pesquisar reflexões"></label></section>
 <div class="feed-filters" role="group" aria-label="Escolher tema do feed">${feedFilters.map(([id,label])=>`<button type="button" class="feed-filter" data-action="combat-filter" data-filter="${id}" aria-pressed="${state.feedFilter===id}">${escapeHtml(label)}</button>`).join('')}</div>
 <div class="feed-results" aria-live="polite"><span id="feed-result-count">${picks.length}</span> reflexões • conteúdo autoral • imagens licenciadas</div>
 <section class="poster-grid" id="feed-posts" aria-label="Feed de reflexões">${picks.length?picks.map((p,i)=>combatPoster(p,i)).join(''):'<div class="poster-empty">Nenhuma reflexão encontrada. Experimente outra busca.</div>'}</section>
 <section class="feed-action-panel" aria-label="Fé em ação">
   <section><span class="feed-action-label">TERÇO DE HOJE</span><h2>${escapeHtml(g.title)}. Reza e começa.</h2><p>Cinco mistérios. Uma dezena por vez. Que a oração te leve a viver melhor o dia.</p><div class="feed-progress-info"><div class="progress"><div class="progress-fill" style="width:${done*2}%"></div></div><strong>${done}/50</strong></div><button class="text-link" data-action="navigate" data-tab="terco">Rezar agora ${icon('arrow')}</button></section>
   <section><span class="feed-action-label">ATITUDE DE HOJE</span><h2>Menos promessa. Mais execução.</h2><p>${escapeHtml(daily.action)}</p><button class="text-link" data-action="combat-open" data-id="${daily.id}">Encarar esta reflexão ${icon('arrow')}</button></section>
 </section>
 ${selected?combatPostDetail(selected):''}
 ${state.feedToast?`<div class="feed-toast" role="status">${escapeHtml(state.feedToast)}</div>`:''}
 `;
}
function combatBible(){
 const verses=Object.entries(versiculosPorMisterio);
 return `<section class="bible-intro"><span class="eyebrow">A VERDADE NÃO É DE ACORDO COM O SEU HUMOR.</span><h1 class="page-title">PALAVRA DE DEUS.</h1><p class="page-desc">20 passagens para meditar o terço, com traduções católicas históricas em português e inglês. Reflita, reze e pratique.</p>
 <div class="bible-switch" role="group" aria-label="Escolher idioma dos versículos"><button type="button" class="group-button ${state.verseLang==='pt'?'active':''}" data-action="verse-lang" data-lang="pt">Português · Figueiredo</button><button type="button" class="group-button ${state.verseLang==='en'?'active':''}" data-action="verse-lang" data-lang="en">English · Douay-Rheims</button></div></section>
 <section class="bible-grid">${verses.map(([id,v],i)=>`<article class="card bible-card"><span class="card-meta">${String(i+1).padStart(2,'0')} / ${escapeHtml(v.ref)}</span><blockquote lang="${state.verseLang==='pt'?'pt-BR':'en'}">“${escapeHtml(scriptureText(v))}”</blockquote><small>${state.verseLang==='pt'?'Pe. Antônio Pereira de Figueiredo':'Douay-Rheims 1899'} · ${v.excerptPt&&state.verseLang==='pt'?'excerto · ':''}domínio público</small><a href="${escapeHtml(state.verseLang==='pt'?v.ptSource:v.enSource)}" class="text-link" target="_blank" rel="noopener noreferrer">Ler capítulo completo ↗</a></article>`).join('')}</section>
 <p class="bible-note">Estas não são citações da Bíblia Ave-Maria. Ap 12 é referência tipológica dos mistérios marianos, não uma descrição literal da Assunção.</p>`;
}
const combatOldDevotion=devocionario;
devocionario=function(){
 const a=feedArtwork['miguel-reni'];
 return `<section class="sao-miguel-cover"><img src="${escapeHtml(a.url)}" alt="São Miguel Arcanjo, pintura de Guido Reni" onerror="if(!this.dataset.fallback){this.dataset.fallback='1';this.src='./assets/feed/fallback.svg';this.style.objectFit='cover';}"><div><span>COMBATE ESPIRITUAL</span><h1>SÃO MIGUEL.<br>DEFENDEI-NOS NO COMBATE.</h1><p>Firmeza, oração e conversão. Quem vence o mal é Cristo. São Miguel intercede por nós.</p><a class="btn btn-primary" href="#oracao-miguel">REZAR A ORAÇÃO</a></div></section>`+combatOldDevotion();
};
renderShell=function(content){
 const themeItems=[['light','Claro','sun'],['dark','Escuro','moon'],['system','Auto','rotate']];
 const settings=`<div class="appearance-control" role="group" aria-label="Mudar tema">${themeItems.map(([id,label,ico])=>`<button type="button" class="theme-option ${state.theme===id?'selected':''}" data-action="set-theme" data-theme="${id}" aria-label="Tema ${label}" title="${label}" aria-pressed="${state.theme===id}">${icon(ico)}<span>${label}</span></button>`).join('')}</div>`;
 const popupX=Math.max(12,Math.round(Number(state.moreMenuLeft)||12));
 const popupY=Math.max(54,Math.round(Number(state.moreMenuTop)||75));
 const more=state.mobileMore?`<button class="more-backdrop" data-action="close-more" aria-label="Fechar menu"></button><div id="cuiudo-more-menu" class="more-panel cuiudo-more-menu" style="--cuiudo-more-x:${popupX}px;--cuiudo-more-y:${popupY}px" role="dialog" aria-label="Mais seções"><div class="more-panel-head"><strong>EXPLORAR</strong><button class="more-close" data-action="close-more" aria-label="Fechar">✕</button></div>${combatTabs.slice(5).map(t=>combatNavBtn(t,'more-nav-button')).join('')}</div>`:'';
 return `<div class="app-shell"><a class="skip-link" href="#main-content">Pular para conteúdo</a><header class="site-header"><div class="header-inner">
 <a class="logo" href="#inicio" data-action="navigate" data-tab="inicio" aria-label="Terço — início"><span class="logo-mark">✠</span><span class="logo-type">Terço<span class="logo-dot">.</span></span></a>
 <nav class="desktop-nav" aria-label="Principal">${combatTabs.slice(0,5).map(t=>combatNavBtn(t)).join('')}<button type="button" class="nav-more" data-action="toggle-more" aria-controls="cuiudo-more-menu" aria-haspopup="true" aria-expanded="${Boolean(state.mobileMore)}"><span class="more-hamburger" aria-hidden="true">☰</span> Mais</button></nav>
 <div class="header-tools"><button type="button" class="compact-menu" data-action="toggle-more" aria-label="Abrir mais seções" aria-controls="cuiudo-more-menu" aria-haspopup="true" aria-expanded="${Boolean(state.mobileMore)}">☰ <span>Menu</span></button>${settings}<button class="mode-switch ${state.mode==='brutal'?'on':''}" data-action="toggle-mode" title="Intensidade das reflexões">${icon('flame')}<span>${state.mode==='brutal'?'SEM DESCULPAS':'FIRME'}</span></button></div></div></header>
 <main class="main" id="main-content">${content}<footer class="site-footer"><span>TERÇO — FÉ EM DEUS E PÉ NA TÁBUA ✠</span><p>Conteúdo autoral de combate espiritual e disciplina. Imagens de domínio público e Unsplash, creditadas em cada post. Sem violência física, garantias de sucesso ou substituição da Confissão sacramental.</p></footer></main>
 <nav class="mobile-nav" aria-label="Principal no celular">${combatTabs.slice(0,5).map(t=>combatNavBtn(t,'mobile-nav-button')).join('')}</nav>${more}</div>`;
};
home=combatHome;
render=function(){
 setTheme();
 const pages={inicio:combatHome,terco:rosary,devocionario:devocionario,palavra:combatBible,diario:diary,verdade:truth,desafios:challenges,exame:examine};
 app.innerHTML=renderShell((pages[state.tab]||combatHome)());
 document.title=(combatTabs.find(t=>t.id===state.tab)?.label||'Início')+' | Terço';
 if(document.body?.classList)document.body.classList.toggle('combat-modal-open',Boolean(state.feedOpen));
};
state.feedSaved=state.feedSaved&&typeof state.feedSaved==='object'?state.feedSaved:{};
state.feedDone=state.feedDone&&typeof state.feedDone==='object'?state.feedDone:{};
state.feedFilter=feedFilters.some(([id])=>id===state.feedFilter)?state.feedFilter:'todos';
state.feedTerm='';
state.feedOpen=null;
state.feedToast='';
if(state.designVersion!=='apple-v11'){state.theme='light';state.designVersion='apple-v11';save();}
if(!['dark','light','system'].includes(state.theme))state.theme='light';
app.addEventListener('click',event=>{
 const target=event.target.closest?.('[data-action]');if(!target)return;
 const action=target.dataset.action;
 if(action==='combat-close'&&target!==event.target&&event.target.closest('.feed-modal'))return;
 if(action==='combat-filter'){state.feedFilter=target.dataset.filter;save();}
 else if(action==='combat-open'){state.feedOpen=target.dataset.id;state.feedToast='';}
 else if(action==='combat-close'){state.feedOpen=null;state.feedToast='';}
 else if(action==='combat-save'){const id=target.dataset.id;state.feedSaved[id]=!combatSaved(id);save();}
 else if(action==='combat-done'){const id=target.dataset.id;state.feedDone[currentDay()]??={};state.feedDone[currentDay()][id]=!combatDone(id);save();}
 else if(action==='combat-share'){
   const p=feedPosts.find(p=>p.id===target.dataset.id);
   if(p){
    const url=(location.origin||'https://devbrunoo.github.io')+(location.pathname||'/Terc0-homens/')+'#post='+encodeURIComponent(p.id);
    const content={title:p.title,text:'CUIÚDO — '+p.title,url};
    if(navigator.share)navigator.share(content).catch(()=>{});
    else if(navigator.clipboard?.writeText)navigator.clipboard.writeText(p.title+'\n'+url).then(()=>{state.feedToast='Link copiado para compartilhar';render();},()=>{state.feedToast='Não foi possível copiar. Link: '+url;render();});
    else state.feedToast='Compartilhe: '+url;
   }
 }else return;
 render();
});
app.addEventListener('input',event=>{
 if(event.target.id!=='feed-search')return;
 state.feedTerm=event.target.value;
 let count=0;
 for(const element of app.querySelectorAll('[data-feed-id]')){
  const p=feedPosts.find(x=>x.id===element.dataset.feedId);
  const visible=Boolean(p&&combatMatches(p));element.hidden=!visible;if(visible)count++;
 }
 const counter=app.querySelector('#feed-result-count');if(counter)counter.textContent=String(count);
});
if(document.addEventListener)document.addEventListener('keydown',event=>{
 if(event.key==='Escape'&&state.feedOpen){state.feedOpen=null;render();}
});
render();
if(window.location?.hash?.startsWith('#post=')){
 const id=decodeURIComponent(window.location.hash.slice(6));
 if(feedPosts.some(p=>p.id===id)){state.tab='inicio';state.feedOpen=id;render();}
}
