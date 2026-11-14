/* Diário da Gratidão Católica — ação de graças, confiança na Providência e ação concreta.
 * Dados exclusivamente locais. Jamais enviar para o quadro público de metas / D1.
 * Pensamento positivo não é uma lei espiritual nem causa automática de acontecimentos.
 */
(function(){
 'use strict';
 const KEY='terco-gratidao-catolica-v1';
 const MAX_RECORDS=1500;
 const T={
  pt:{
   nav:'Gratidão',title:'Diário da Gratidão',subtitle:'Reconhecer os dons de Deus, confiar na Providência e responder com atitudes.',
   eyebrow:'ORAÇÃO · GRATIDÃO · PROPÓSITO',verse:'Em todas as circunstâncias, dai graças.',source:'1 Tessalonicenses 5,18',
   first:'Agradecer',second:'Confiar',third:'Agir',firstHelp:'Nomeie as graças, mesmo as pequenas.',secondHelp:'Entregue o que você não controla.',thirdHelp:'Escolha o bem que pode realizar.',
   today:'Registro de',backToday:'Voltar a hoje',prompt:'Três motivos para agradecer',grat:['Primeira gratidão','Segunda gratidão','Terceira gratidão'],
   placeholder:['Uma graça que reconheço hoje...','Uma pessoa, oportunidade ou pequeno bem...','Algo simples que não quero esquecer...'],
   hardship:'Uma dificuldade que entrego a Deus',hardshipHint:'Nem toda dificuldade é castigo ou culpa sua. Você não precisa fingir que tudo está bem.',
   vision:'A pessoa que desejo me tornar',visionHint:'Qual virtude, vocação ou responsabilidade desejo cultivar? Visualizar ajuda a planejar; não determina o futuro.',
   action:'Uma ação concreta para amanhã',actionHint:'Um passo pequeno, verificável e possível: estudar, servir, trabalhar, pedir perdão...',
   prayer:'Minha oração de confiança',prayerHint:'Senhor, acolhe meus planos. Conduze-me ao que é bom, segundo a tua vontade.',
   save:'Salvar registro',saved:'Registro salvo neste aparelho.',empty:'Escreva ao menos uma reflexão antes de salvar.',
   error:'Não foi possível salvar. Verifique o espaço do navegador e exporte seus registros para protegê-los.',
   privacy:'Privado neste aparelho · Sem publicação no quadro público · Não sincroniza entre aparelhos.',
   warning:'Isto não é Lei da Atração: Deus não é controlado por pensamentos. A oração une confiança, discernimento e ação.',
   count:'dias registrados',week:'registros nos últimos 7 dias',history:'Meu caminho',noHistory:'Seu diário começa com um primeiro agradecimento, não com um dia perfeito.',
   recorded:'Salvo',edit:'Rever',remove:'Excluir',deletePrompt:'Excluir permanentemente o registro deste dia?',
   download:'Exportar histórico',upload:'Importar backup',importPrompt:'Importar registros do arquivo? Datas já existentes serão mantidas; somente dias ausentes serão adicionados.',
   imported:'Backup importado. Seus registros antigos foram preservados.',badFile:'Backup inválido ou maior que 250 KB.',noNew:'Nenhum registro novo encontrado no backup.',
   close:'Fechar mensagem',homeKicker:'UM MINUTO DE GRATIDÃO',homeTitle:'Agradeça. Confie. Faça a sua parte.',
   homeDesc:'Três graças, uma oração e uma decisão concreta. A fé não é uma técnica para controlar o futuro.',
   homeButton:'Escrever minha gratidão',todayDone:'Hoje já existe um registro. Você pode revisá-lo.',
   homeMiniTitle:'Hoje sou grato por...',homeMiniPrompt:'Minha moto, minha vida, o terço, minha família...',homeMiniSave:'Salvar',homeMiniOpen:'Diário',homeMiniSaved:'Salvo',
   prayerDefault:'Senhor, agradeço pelas graças deste dia. Dá-me serenidade para aceitar o que não controlo, coragem para agir onde posso e sabedoria para discernir a tua vontade. Amém.',
   reflection:'A gratidão não precisa negar a dor para ser sincera.'
  },
  en:{
   nav:'Gratitude',title:'Catholic Gratitude Journal',subtitle:'Recognize God’s gifts, trust Providence, and take meaningful action.',
   eyebrow:'PRAYER · GRATITUDE · PURPOSE',verse:'Give thanks in all circumstances.',source:'1 Thessalonians 5:18',
   first:'Give thanks',second:'Trust',third:'Act',firstHelp:'Notice even small blessings.',secondHelp:'Entrust what you cannot control.',thirdHelp:'Choose a good action within your reach.',
   today:'Entry for',backToday:'Return to today',prompt:'Three reasons to give thanks',grat:['First gratitude','Second gratitude','Third gratitude'],
   placeholder:['A gift I noticed today...','A person or small good thing...','Something I do not want to forget...'],
   hardship:'A difficulty I entrust to God',hardshipHint:'Suffering is not always punishment or your fault. You need not pretend everything is fine.',
   vision:'The person I wish to become',visionHint:'Which virtue, vocation, or responsibility do I want to grow in? Visualization is planning, not a guarantee.',
   action:'One concrete action for tomorrow',actionHint:'A small, achievable step: study, serve, work, make peace...',
   prayer:'My prayer of trust',prayerHint:'Lord, receive my plans. Lead me toward what is good, according to Your will.',
   save:'Save entry',saved:'Saved on this device.',empty:'Write at least one reflection before saving.',
   error:'Unable to save. Check browser storage and export your entries for safekeeping.',
   privacy:'Private to this device · Never shared on the public goals board · No cross-device sync.',
   warning:'This is not the Law of Attraction: thoughts cannot control God. Prayer joins trust, discernment and action.',
   count:'recorded days',week:'entries in the last 7 days',history:'My journey',noHistory:'Your journal begins with one thanksgiving, not a perfect day.',
   recorded:'Saved',edit:'Review',remove:'Delete',deletePrompt:'Permanently delete this day’s entry?',
   download:'Export history',upload:'Import backup',importPrompt:'Import entries? Existing dates will remain unchanged; only missing days will be added.',
   imported:'Backup imported. Previous entries were preserved.',badFile:'Invalid backup or file over 250 KB.',noNew:'No new entries found in the backup.',
   close:'Dismiss',homeKicker:'A MINUTE OF GRATITUDE',homeTitle:'Give thanks. Trust. Do your part.',
   homeDesc:'Three gifts, one prayer and one practical decision. Faith is not a way to control the future.',
   homeButton:'Write my gratitude',todayDone:'You already have an entry for today. You can review it.',
   homeMiniTitle:'Today I’m grateful for...',homeMiniPrompt:'My life, my family, prayer, small blessings...',homeMiniSave:'Save',homeMiniOpen:'Journal',homeMiniSaved:'Saved',
   prayerDefault:'Lord, thank You for the gifts of this day. Grant me serenity, courage and wisdom to follow Your will. Amen.',
   reflection:'Gratitude does not need to deny pain to be sincere.'
  },
  es:{
   nav:'Gratitud',title:'Diario Católico de Gratitud',subtitle:'Reconoce los dones de Dios, confía en la Providencia y actúa con amor.',
   eyebrow:'ORACIÓN · GRATITUD · PROPÓSITO',verse:'Den gracias en toda circunstancia.',source:'1 Tesalonicenses 5,18',
   first:'Agradecer',second:'Confiar',third:'Actuar',firstHelp:'Reconoce los dones pequeños.',secondHelp:'Entrega lo que no puedes controlar.',thirdHelp:'Elige una acción buena y posible.',
   today:'Registro del',backToday:'Volver a hoy',prompt:'Tres motivos de gratitud',grat:['Primera gratitud','Segunda gratitud','Tercera gratitud'],
   placeholder:['Una gracia de hoy...','Una persona o un pequeño bien...','Algo que deseo recordar...'],
   hardship:'Una dificultad que entrego a Dios',hardshipHint:'No todo sufrimiento es castigo o culpa tuya.',
   vision:'La persona que deseo llegar a ser',visionHint:'¿Qué virtud o responsabilidad deseo cultivar? Imaginar ayuda a planificar, no garantiza resultados.',
   action:'Una acción concreta para mañana',actionHint:'Un paso pequeño y posible: estudiar, servir, trabajar, reconciliarme...',
   prayer:'Mi oración de confianza',prayerHint:'Señor, recibe mis planes y guíame según tu voluntad.',
   save:'Guardar registro',saved:'Guardado en este dispositivo.',empty:'Escribe al menos una reflexión.',
   error:'No se pudo guardar. Comprueba el almacenamiento y exporta tus registros.',
   privacy:'Privado en este dispositivo · No aparece en las metas públicas · Sin sincronización.',
   warning:'Esto no es la Ley de Atracción: los pensamientos no controlan a Dios. La oración exige confianza y acción.',
   count:'días registrados',week:'registros en los últimos 7 días',history:'Mi camino',noHistory:'Tu diario empieza con un agradecimiento, no con un día perfecto.',
   recorded:'Guardado',edit:'Revisar',remove:'Eliminar',deletePrompt:'¿Eliminar definitivamente el registro de este día?',
   download:'Exportar historial',upload:'Importar copia',importPrompt:'¿Importar registros? Los días existentes se conservarán.',
   imported:'Copia importada. Se conservaron los registros anteriores.',badFile:'Copia inválida o archivo mayor de 250 KB.',noNew:'No se encontraron registros nuevos.',
   close:'Cerrar',homeKicker:'UN MINUTO DE GRATITUD',homeTitle:'Agradece. Confía. Haz tu parte.',
   homeDesc:'Tres gracias, una oración y una decisión concreta. La fe no controla el futuro.',
   homeButton:'Escribir gratitud',todayDone:'Ya hay un registro de hoy. Puedes revisarlo.',
   homeMiniTitle:'Hoy doy gracias por...',homeMiniPrompt:'Mi vida, mi familia, el rosario...',homeMiniSave:'Guardar',homeMiniOpen:'Diario',homeMiniSaved:'Guardado',
   prayerDefault:'Señor, te doy gracias por este día. Dame serenidad, valor y sabiduría para seguir tu voluntad. Amén.',
   reflection:'La gratitud sincera no niega el dolor.'
  },
  la:{
   nav:'Gratitudo',title:'Diarium Gratitudinis',subtitle:'Dona Dei agnosce, Providentiae confide et bonum age.',
   eyebrow:'ORATIO · GRATITUDO · PROPOSITUM',verse:'In omnibus gratias agite.',source:'1 Thessalonicenses 5,18',
   first:'Gratias agere',second:'Confidere',third:'Agere',firstHelp:'Parva quoque dona agnosce.',secondHelp:'Deo committe quod regere non potes.',thirdHelp:'Bonum possibile elige.',
   today:'Dies',backToday:'Ad hodiernum',prompt:'Tres causae gratitudinis',grat:['Prima gratitudo','Secunda gratitudo','Tertia gratitudo'],
   placeholder:['Donum hodiernum...','Persona vel bonum parvum...','Quod memorare volo...'],
   hardship:'Difficultas Deo commissa',hardshipHint:'Dolor non semper poena neque culpa tua est.',
   vision:'Qualis homo fieri desidero',visionHint:'Virtutes et officia cole. Meditatio non futurum regit.',
   action:'Unum opus crastinum',actionHint:'Parvum opus verum et possibile...',
   prayer:'Oratio fiduciae',prayerHint:'Domine, tua voluntas fiat.',
   save:'Servare',saved:'In hoc instrumento servatum.',empty:'Aliquid prius scribe.',
   error:'Servare non licuit. Exporta notas tuas.',
   privacy:'Privatum in hoc instrumento · Non publicatur · Sine synchronisatione.',
   warning:'Cogitationes Deum non regunt. Ora, discerne et age.',
   count:'dies scripti',week:'ultimi septem dies',history:'Iter meum',noHistory:'Gratias agendo incipe.',
   recorded:'Servatum',edit:'Revidere',remove:'Delere',deletePrompt:'Hunc diem delere?',
   download:'Exportare',upload:'Importare',importPrompt:'Importare? Dies iam scripti servantur.',
   imported:'Importatum; priora servata.',badFile:'Documentum invalidum.',noNew:'Nihil novi.',
   close:'Claudere',homeKicker:'MOMENTUM GRATITUDINIS',homeTitle:'Gratias age. Confide. Age.',
   homeDesc:'Dona, oratio et unum opus. Fides futurum non regit.',
   homeButton:'Gratitudinem scribere',todayDone:'Hodie iam scripsisti.',
   homeMiniTitle:'Hodie gratias ago pro...',homeMiniPrompt:'Vita mea, familia, rosario...',homeMiniSave:'Servare',homeMiniOpen:'Diarium',homeMiniSaved:'Servatum',
   prayerDefault:'Domine, gratias tibi ago. Da mihi serenitatem, fortitudinem et sapientiam. Fiat voluntas tua. Amen.',
   reflection:'Gratitudo dolorem non negat.'
  }
 };
 const locale=()=>typeof cuiudoLocale==='function'&&T[cuiudoLocale()]?cuiudoLocale():'pt';
 const tr=()=>T[locale()];
 const esc=v=>escapeHtml(String(v??''));
 const cap=(v,n)=>String(v??'').trim().slice(0,n);
 const DATE=/^\d{4}-\d{2}-\d{2}$/;
 const today=()=>currentDay();
 let selected=today(),notice='';
 function validDate(s){
  if(!DATE.test(s)||s>today())return false;
  const d=new Date(s+'T12:00:00');
  return !Number.isNaN(d.getTime())&&
   d.getFullYear()===Number(s.slice(0,4))&&d.getMonth()+1===Number(s.slice(5,7))&&d.getDate()===Number(s.slice(8,10));
 }
 function normalize(raw){
  if(!raw||typeof raw!=='object'||Array.isArray(raw))return null;
  const thanks=Array.isArray(raw.thanks)?raw.thanks.slice(0,3).map(x=>cap(x,260)):[];
  return {thanks:[0,1,2].map(i=>thanks[i]||''),
   hardship:cap(raw.hardship,600),vision:cap(raw.vision,600),
   action:cap(raw.action,400),prayer:cap(raw.prayer,800),
   updatedAt:typeof raw.updatedAt==='string'?raw.updatedAt.slice(0,35):''};
 }
 function read(){
  try{
   const raw=JSON.parse(localStorage.getItem(KEY)||'null');
   if(!raw||raw.version!==1||!raw.days||typeof raw.days!=='object'||Array.isArray(raw.days))return {};
   const entries=Object.entries(raw.days).filter(([d,v])=>validDate(d)&&v&&typeof v==='object').slice(0,MAX_RECORDS);
   return Object.fromEntries(entries.map(([d,v])=>[d,normalize(v)]));
  }catch{return {};}
 }
 function write(days){
  try{localStorage.setItem(KEY,JSON.stringify({version:1,days}));return true;}catch{return false;}
 }
 function friendly(d){
  try{return new Intl.DateTimeFormat(({pt:'pt-BR',en:'en-US',es:'es-ES',la:'la'}[locale()]||'pt-BR'),{day:'numeric',month:'long',year:'numeric'}).format(new Date(d+'T12:00:00'));}
  catch{return d;}
 }
 function recentCount(days){
  const start=new Date();start.setHours(12,0,0,0);start.setDate(start.getDate()-6);
  const limit=start.getFullYear()+'-'+String(start.getMonth()+1).padStart(2,'0')+'-'+String(start.getDate()).padStart(2,'0');
  return Object.keys(days).filter(d=>d>=limit&&d<=today()).length;
 }
 function field(id,label,hint,value,max,rows=2,placeholder=''){
  return '<div class="grat-field"><label for="'+id+'">'+esc(label)+'</label>'+
   (hint?'<p class="grat-hint">'+esc(hint)+'</p>':'')+
   '<textarea id="'+id+'" name="'+id+'" maxlength="'+max+'" rows="'+rows+'" placeholder="'+esc(placeholder)+'">'+esc(value||'')+'</textarea></div>';
 }
 function homeTile(){
  const t=tr(),record=read()[today()],first=record?.thanks?.[0]||'';
  return '<section class="grat-home" aria-label="'+esc(t.homeMiniTitle)+'">'+
   '<div class="grat-home-heading"><span class="grat-home-cross" aria-hidden="true">✝</span>'+
   '<strong>'+esc(t.homeMiniTitle)+'</strong>'+
   '<span class="grat-home-status" data-grat-status role="status" aria-live="polite">'+esc(first?t.homeMiniSaved:'')+'</span></div>'+
   '<form id="grat-home-form" class="grat-home-inline">'+
   '<textarea id="grat-home-text" name="gratitude" maxlength="260" rows="2" '+
    'aria-label="'+esc(t.homeMiniTitle)+'" placeholder="'+esc(t.homeMiniPrompt)+'">'+esc(first)+'</textarea></form></section>';
 }
 function page(){
  const t=tr(),days=read(),record=days[selected]||null,list=Object.keys(days).sort().reverse(),
   saved=record||{thanks:['','',''],hardship:'',vision:'',action:'',prayer:''};
  return '<div class="grat-page">'+
   '<header class="grat-hero"><div><span class="grat-kicker">'+esc(t.eyebrow)+'</span>'+
   '<h1>'+esc(t.title)+'</h1><p>'+esc(t.subtitle)+'</p></div>'+
   '<div class="grat-scripture"><span class="grat-cross" aria-hidden="true">✝</span><blockquote>'+esc(t.verse)+'</blockquote><small>'+esc(t.source)+'</small></div></header>'+
   '<div class="grat-pillars" aria-label="'+esc(t.eyebrow)+'">'+
   [[t.first,t.firstHelp],[t.second,t.secondHelp],[t.third,t.thirdHelp]].map(([head,desc],i)=>
    '<div class="grat-pillar"><span class="grat-pillar-number">0'+(i+1)+'</span><strong>'+esc(head)+'</strong><small>'+esc(desc)+'</small></div>').join('')+'</div>'+
   '<div class="grat-main"><section class="grat-writing card">'+
   '<div class="grat-form-header"><div><span class="grat-kicker">'+esc(t.today)+'</span><h2>'+esc(friendly(selected))+'</h2></div>'+
   (selected!==today()?'<button type="button" data-grat-action="today" class="grat-quiet">'+esc(t.backToday)+'</button>':'')+'</div>'+
   '<form id="cuiudo-gratidao-form" novalidate><fieldset class="grat-thanks"><legend>'+esc(t.prompt)+'</legend>'+
   t.grat.map((label,i)=>field('grat-thanks-'+i,label,'',saved.thanks[i],260,2,t.placeholder[i])).join('')+'</fieldset>'+
   '<div class="grat-other">'+field('grat-hardship',t.hardship,t.hardshipHint,saved.hardship,600,2)+
   field('grat-vision',t.vision,t.visionHint,saved.vision,600,2)+
   field('grat-action',t.action,t.actionHint,saved.action,400,2)+
   field('grat-prayer',t.prayer,t.prayerHint,saved.prayer,800,3,t.prayerDefault)+'</div>'+
   '<div class="grat-form-footer"><button type="submit" class="btn btn-primary">'+esc(t.save)+'</button>'+
   '<span class="grat-private">'+esc(t.privacy)+'</span></div></form>'+
   '<div class="grat-message" role="status" aria-live="polite">'+esc(notice)+'</div>'+
   '</section><aside class="grat-aside"><article class="grat-side-card"><span class="grat-kicker">'+esc(t.first)+' · '+esc(t.second)+' · '+esc(t.third)+'</span>'+
   '<p>'+esc(t.reflection)+'</p><div class="grat-side-warning">'+esc(t.warning)+'</div>'+
   '<small>1Ts 5,18 · Fl 4,8 · Tg 2,17 · Lc 22,42</small></article>'+
   '<article class="grat-stats"><div><strong>'+list.length+'</strong><span>'+esc(t.count)+'</span></div><div><strong>'+recentCount(days)+'</strong><span>'+esc(t.week)+'</span></div></article>'+
   '<div class="grat-tools"><button type="button" class="grat-quiet" data-grat-action="export">'+esc(t.download)+'</button>'+
   '<label class="grat-quiet grat-upload" for="grat-import">'+esc(t.upload)+'</label>'+
   '<input id="grat-import" type="file" accept=".json,application/json" aria-label="'+esc(t.upload)+'" /></div></aside></div>'+
   '<section class="grat-history"><div class="grat-history-head"><h2>'+esc(t.history)+'</h2><span>'+list.length+' '+esc(t.count)+'</span></div>'+
   (list.length?'<div class="grat-history-grid">'+list.map(day=>{
    const entry=days[day],preview=entry.thanks.find(Boolean)||entry.action||entry.vision||entry.hardship||entry.prayer||'';
    return '<article class="grat-history-item"><div><time datetime="'+day+'">'+esc(friendly(day))+'</time>'+
     '<p>'+esc(preview)+'</p></div><div class="grat-history-actions">'+
     '<button type="button" data-grat-action="edit" data-day="'+day+'">'+esc(t.edit)+'</button>'+
     '<button type="button" data-grat-action="delete" data-day="'+day+'">'+esc(t.remove)+'</button></div></article>';
   }).join('')+'</div>':'<p class="grat-empty">'+esc(t.noHistory)+'</p>')+'</section></div>';
 }
 for(const id of ['pt','en','es','la']){if(typeof cuiudoNav!=='undefined'&&cuiudoNav[id])cuiudoNav[id].gratidao=T[id].nav;}
 if(typeof combatTabs!=='undefined'&&!combatTabs.some(x=>x.id==='gratidao'))
  combatTabs.push({id:'gratidao',label:'Gratidão e Propósito',mobile:'Gratidão',icon:'heart'});
 const previousHome=combatHome;
 combatHome=function(){
  const home=previousHome();
  const opener='<section class="cuiudo-punch-strip"';
  const start=home.indexOf(opener);
  const end=start>=0?home.indexOf('</section>',start):-1;
  // Mostrar a gratidão logo depois da faixa de abertura, antes do checklist e da imagem principal.
  return end>=0?home.slice(0,end+10)+homeTile()+home.slice(end+10):homeTile()+home;
 };
 const previousRender=render;
 render=function(){
  if(state.tab!=='gratidao'){previousRender();return;}
  setTheme();
  document.documentElement.lang=({pt:'pt-BR',en:'en',es:'es',la:'la'}[locale()]||'pt-BR');
  app.innerHTML=renderShell(page());
  document.title=tr().title+' | Terço';
 };
 function saveQuick(form){
  const field=form?.querySelector('[name="gratitude"]');
  if(!field)return;
  const value=cap(field.value,260),days=read(),current=days[today()];
  if(!value&&!current)return;
  const entry=current||normalize({});
  entry.thanks[0]=value;
  entry.updatedAt=new Date().toISOString();
  days[today()]=entry;
  const status=form.closest?.('.grat-home')?.querySelector('[data-grat-status]');
  if(write(days)){
   if(status)status.textContent=value?tr().homeMiniSaved:'';
  }else if(status)status.textContent=tr().error;
 }
 app.addEventListener('input',e=>{
  if(e.target?.id==='grat-home-text')saveQuick(e.target.form);
 });
 app.addEventListener('submit',e=>{
  if(e.target?.id==='grat-home-form'){
   e.preventDefault();
   saveQuick(e.target);
   return;
  }
  if(e.target?.id!=='cuiudo-gratidao-form')return;
  e.preventDefault();
  const get=id=>e.target.querySelector('#'+id)?.value||'';
  const entry=normalize({thanks:[0,1,2].map(i=>get('grat-thanks-'+i)),hardship:get('grat-hardship'),
   vision:get('grat-vision'),action:get('grat-action'),prayer:get('grat-prayer'),updatedAt:new Date().toISOString()});
  if(![...entry.thanks,entry.hardship,entry.vision,entry.action,entry.prayer].some(Boolean)){
   notice=tr().empty;render();return;
  }
  const days=read();days[selected]=entry;
  notice=write(days)?tr().saved:tr().error;
  render();
 });
 app.addEventListener('click',e=>{
  const b=e.target?.closest?.('[data-grat-action]');
  if(!b)return;
  const action=b.dataset.gratAction;
  if(action==='today'){selected=today();notice='';render();return;}
  if(action==='edit'&&validDate(b.dataset.day)){selected=b.dataset.day;notice='';render();
   document.getElementById('grat-thanks-0')?.focus();return;}
  if(action==='delete'&&validDate(b.dataset.day)){
   if(!confirm(tr().deletePrompt))return;
   const days=read();delete days[b.dataset.day];
   if(write(days)){notice='';if(selected===b.dataset.day)selected=today();render();}
   else{notice=tr().error;render();}
   return;
  }
  if(action==='export'){
   const payload={version:1,kind:'terco-gratidao-catolica',exportedAt:new Date().toISOString(),days:read()};
   const url=URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}));
   const a=document.createElement('a');a.href=url;a.download='terco-gratidao-'+today()+'.json';
   document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
 });
 app.addEventListener('change',async e=>{
  if(e.target?.id!=='grat-import')return;
  const file=e.target.files?.[0];e.target.value='';
  if(!file)return;
  if(file.size>250000){notice=tr().badFile;render();return;}
  try{
   const json=JSON.parse(await file.text());
   if(json?.version!==1||json?.kind!=='terco-gratidao-catolica'||!json.days||
      typeof json.days!=='object'||Array.isArray(json.days)||Object.keys(json.days).length>MAX_RECORDS)throw Error('format');
   const incoming=Object.entries(json.days);
   if(incoming.some(([d,v])=>!validDate(d)||!v||typeof v!=='object'||Array.isArray(v)))throw Error('records');
   if(!confirm(tr().importPrompt))return;
   const days=read();let added=0;
   for(const [d,v] of incoming){if(!Object.prototype.hasOwnProperty.call(days,d)){days[d]=normalize(v);added++;}}
   notice=added?(write(days)?tr().imported:tr().error):tr().noNew;
  }catch{notice=tr().badFile;}
  render();
 });
 window.cuiudoGratidao={read};
})();
