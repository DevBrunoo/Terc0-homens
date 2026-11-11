
/* Caminhos da Santidade — lembretes pessoais, sem superstição.
 * Este quadro fica só no aparelho; nunca é enviado ao D1 público. */
(function(){
 'use strict';
 const KEY='terco-caminhos-da-santidade-v1';
 const labels={
  pt:['Caminhos da Santidade','O que me aproxima de Deus','O que me afasta de Deus','Adicionar','Excluir','Escreva uma atitude que deseja cultivar','Escreva um hábito que deseja combater','Comece sua lista aqui.','Anote o que deseja mudar.','Não se trata de sorte ou azar: são escolhas que nos aproximam ou afastam de Deus. A graça é dom; nossa resposta é amar e agir.','Salvo apenas neste aparelho. Nada é apagado automaticamente.'],
  en:['Paths to Holiness','What draws me closer to God','What leads me away from God','Add','Delete','Add a practice to nurture','Add a habit to overcome','Start your list here.','Write what you want to change.','Not good or bad luck: these are choices that draw us closer to God or lead us away. Grace is a gift; we respond through love.','Saved only on this device; never automatically cleared.'],
  es:['Caminos de Santidad','Lo que me acerca a Dios','Lo que me aleja de Dios','Añadir','Eliminar','Añade una práctica buena','Añade un hábito para superar','Empieza tu lista.','Anota lo que deseas cambiar.','No es suerte ni mala suerte: son elecciones que nos acercan o alejan de Dios. La gracia es un don; respondemos con amor.','Guardado solo en este dispositivo; no se borra automáticamente.'],
  la:['Viae Sanctitatis','Quae me Deo appropinquant','Quae me a Deo avertunt','Adde','Dele','Bonum opus adde','Vitium superandum adde','Hic incipe.','Quod mutare velis scribe.','Non fortuna, sed electiones nos ad Deum ducunt vel ab eo avertunt. Gratia donum est; amore respondeamus.','In hoc instrumento tantum servatur; non deletur sponte.']
 };
 const examples=['Rezar o terço','Pedir ajuda a Nossa Senhora e a Deus','Amar a Deus e ao próximo','Escutar louvores','Estudar com disciplina','Trabalhar com honestidade'];
 const valid=x=>x&&typeof x.id==='string'&&typeof x.text==='string'&&x.text.length>0&&x.text.length<=180;
 function read(){
  try{const v=JSON.parse(localStorage.getItem(KEY)||'null');if(v&&Array.isArray(v.good)&&Array.isArray(v.bad))return {good:v.good.filter(valid).slice(0,150),bad:v.bad.filter(valid).slice(0,150)};}catch{}
  return {good:examples.map((text,n)=>({id:'initial-'+n,text})),bad:[]};
 }
 let lists=read();
 function persist(){try{localStorage.setItem(KEY,JSON.stringify(lists));return true}catch{return false}}
 function section(type,t){
  const good=type==='good',title=t[good?1:2],items=lists[type];
  return '<section class="holiness-side '+(good?'holiness-good':'holiness-bad')+'"><div class="holiness-side-title">'+
   '<span aria-hidden="true">'+(good?'✦':'✝')+'</span><h2>'+escapeHtml(title)+'</h2></div>'+
   '<ul class="holiness-items">'+(items.length?items.map(item=>
    '<li><span>'+escapeHtml(item.text)+'</span><button type="button" data-action="holiness-remove" data-type="'+type+'" data-id="'+escapeHtml(item.id)+'" aria-label="'+escapeHtml(t[4]+': '+item.text)+'">×</button></li>'
   ).join(''):'<li class="holiness-empty">'+escapeHtml(t[good?7:8])+'</li>')+'</ul>'+
   '<form class="holiness-form" data-holiness-add="'+type+'"><label class="sr-only" for="holiness-'+type+'">'+escapeHtml(title)+'</label>'+
   '<input id="holiness-'+type+'" name="item" type="text" required maxlength="180" autocomplete="off" placeholder="'+escapeHtml(t[good?5:6])+'">'+
   '<button type="submit">'+escapeHtml(t[3])+' +</button></form></section>';
 }

 /* Meditações autorais e citações atribuídas conforme documentos da Santa Sé.
  * Traduções de EN/ES/LA são versões de leitura do app, não transcrições literais. */
 const holinessReflections={"pt":{"tag":"TEMPO DE RECOMEÇAR","title":"Quando a vida volta a fazer sentido","body":"Depois de tantas lutas, pode chegar um momento em que o coração encontra paz e a vida começa a fazer mais sentido. Deus nos fala pela Palavra, pela oração, pelos sacramentos e pelo amor que colocamos em prática. Escute com discernimento: nem toda coincidência é um sinal, nem toda dificuldade é castigo.","closing":"Quando as coisas começam a dar certo, agradeça. Quando ainda não dão, persevere. Santidade é caminhar com Cristo nos dois momentos.","saints":"PALAVRAS DOS SANTOS","source":"Ver fonte"},"en":{"tag":"A TIME TO BEGIN AGAIN","title":"When life begins to make sense again","body":"After many struggles, peace may return and life may begin to make sense again. God speaks through Scripture, prayer, the sacraments, and love put into action. Discern carefully: not every coincidence is a sign, and not every hardship is punishment.","closing":"When things go well, give thanks. When they do not, persevere. Holiness means walking with Christ through both.","saints":"WORDS OF THE SAINTS","source":"Source"},"es":{"tag":"TIEMPO DE RECOMENZAR","title":"Cuando la vida vuelve a tener sentido","body":"Después de muchas luchas, puede llegar la paz y la vida vuelve a tener sentido. Dios nos habla por la Escritura, la oración, los sacramentos y el amor que ponemos en práctica. Discierne: no toda coincidencia es una señal ni toda dificultad es un castigo.","closing":"Cuando las cosas salen bien, agradece. Cuando todavía no, persevera. La santidad es caminar con Cristo en ambos momentos.","saints":"PALABRAS DE LOS SANTOS","source":"Ver fuente"},"la":{"tag":"TEMPUS RENOVATIONIS","title":"Cum vita iterum sensum invenit","body":"Post multas difficultates pax redire potest et vita novum sensum accipere. Deus nobis per Scripturam, orationem, sacramenta et caritatem operibus expressam loquitur. Prudenter discerne: non omnis casus signum est, nec omnis difficultas poena.","closing":"Cum res bene eveniunt, gratias age. Cum difficiles sunt, persevera. Sanctitas est cum Christo in utroque tempore ambulare.","saints":"VERBA SANCTORUM","source":"Fons"}};
 const holinessQuotes=[{"who":{"pt":"Santo Agostinho","en":"Saint Augustine","es":"San Agustín","la":"Sanctus Augustinus"},"text":{"pt":"Fizeste-nos para ti, e inquieto está o nosso coração, enquanto não repousa em ti.","en":"You have made us for yourself, and our heart is restless until it rests in you.","es":"Nos hiciste para ti, y nuestro corazón está inquieto hasta que descanse en ti.","la":"Fecisti nos ad te et inquietum est cor nostrum, donec requiescat in te."},"source":"https://www.vatican.va/content/leo-xiv/pt/speeches/2025/august/documents/20250802-veglia-tor-vergata.html"},{"who":{"pt":"Santa Teresa de Jesus","en":"Saint Teresa of Ávila","es":"Santa Teresa de Jesús","la":"Sancta Teresia a Iesu"},"text":{"pt":"Só Deus basta.","en":"God alone suffices.","es":"Solo Dios basta.","la":"Solus Deus sufficit."},"source":"https://www.vatican.va/archive/cathechism_po/index_new/p1s2c1_198-421_po.html"},{"who":{"pt":"Santa Teresinha do Menino Jesus","en":"Saint Thérèse of Lisieux","es":"Santa Teresita del Niño Jesús","la":"Sancta Teresia a Iesu Infante"},"text":{"pt":"Tudo é graça.","en":"Everything is grace.","es":"Todo es gracia.","la":"Omnia gratia sunt."},"source":"https://www.vatican.va/content/john-paul-ii/pt/speeches/1986/march/documents/hf_jp-ii_spe_19860315_vescovi-brasile-curia.html"},{"who":{"pt":"São João da Cruz","en":"Saint John of the Cross","es":"San Juan de la Cruz","la":"Sanctus Ioannes a Cruce"},"text":{"pt":"No entardecer da vida, seremos julgados sobre o amor.","en":"At the evening of life, we shall be judged on love.","es":"Al atardecer de la vida, seremos juzgados sobre el amor.","la":"In vitae vespera de amore iudicabimur."},"source":"https://www.vatican.va/content/john-paul-ii/pt/letters/1994/documents/hf_jp-ii_let_02021994_families.html"}];
 function holinessWisdom(lang){
  const l=['pt','en','es','la'].includes(lang)?lang:'pt';
  const t=holinessReflections[l];
  return '<section class="holiness-wisdom" aria-label="'+escapeHtml(t.title)+'">'+
   '<div class="holiness-wisdom-intro">'+
    '<span class="eyebrow">'+escapeHtml(t.tag)+'</span>'+
    '<h2>'+escapeHtml(t.title)+'</h2>'+
    '<p>'+escapeHtml(t.body)+'</p>'+
    '<p class="holiness-wisdom-emphasis">'+escapeHtml(t.closing)+'</p>'+
   '</div>'+
   '<h3 class="holiness-quotes-label">'+escapeHtml(t.saints)+'</h3>'+
   '<div class="holiness-quotes">'+holinessQuotes.map(q=>
    '<figure class="holiness-saint-quote">'+
     '<blockquote>“'+escapeHtml(q.text[l])+'”</blockquote>'+
     '<figcaption><strong>'+escapeHtml(q.who[l])+'</strong>'+
     '<a href="'+escapeHtml(q.source)+'" rel="noopener noreferrer" target="_blank" aria-label="'+escapeHtml(t.source+': '+q.who[l])+'">'+escapeHtml(t.source)+' ↗</a>'+
     '</figcaption></figure>'
   ).join('')+'</div>'+
  '</section>';
 }

 function page(){
  const t=labels[cuiudoLocale()]||labels.pt;
  return '<section class="holiness-page"><header class="holiness-header"><span class="eyebrow">✝ '+escapeHtml(t[0])+'</span>'+
   '<h1>'+escapeHtml(t[0])+'</h1><p>'+escapeHtml(t[9])+'</p></header>'+holinessWisdom(cuiudoLocale())+
   '<div class="holiness-grid">'+section('good',t)+section('bad',t)+'</div>'+
   '<p class="holiness-bible">1Ts 5,21 — discernir e guardar o que é bom.</p><p class="holiness-privacy">'+escapeHtml(t[10])+'</p></section>';
 }
 if(!combatTabs.some(t=>t.id==='santidade'))combatTabs.push({id:'santidade',label:'Caminhos da Santidade',mobile:'Santidade',icon:'heart'});
 for(const [lang,text] of [['pt','Caminhos da Santidade'],['en','Paths to Holiness'],['es','Caminos de Santidad'],['la','Viae Sanctitatis']])cuiudoNav[lang].santidade=text;
 const before=render;
 render=function(){
  if(state.tab!=='santidade')return before();
  document.documentElement.lang=({pt:'pt-BR',en:'en',es:'es',la:'la'}[cuiudoLocale()]||'pt-BR');
  setTheme();app.innerHTML=renderShell(page());
  document.title=cuiudoNav[cuiudoLocale()].santidade+' | Terço';
 };
 app.addEventListener('submit',event=>{
  const form=event.target.closest?.('[data-holiness-add]');if(!form)return;
  event.preventDefault();
  const type=form.dataset.holinessAdd;if(type!=='good'&&type!=='bad')return;
  const text=String(form.querySelector('input[name="item"]')?.value||'').trim().slice(0,180);
  if(!text||lists[type].length>=150)return;
  lists[type].unshift({id:String(Date.now())+'-'+Math.random().toString(36).slice(2),text});
  if(persist())render();
 });
 app.addEventListener('click',event=>{
  const button=event.target.closest?.('[data-action="holiness-remove"]');if(!button)return;
  const type=button.dataset.type,id=button.dataset.id;
  if(type!=='good'&&type!=='bad')return;
  const index=lists[type].findIndex(item=>item.id===id);if(index<0)return;
  lists[type].splice(index,1);if(persist())render();
 });
 render();
})();
