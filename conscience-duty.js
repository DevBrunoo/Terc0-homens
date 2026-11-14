/* CUIÚDO — preguiça, omissão e deveres: exame de consciência católico.
 * Fundamentos: Catecismo 1853, 1857, 2094, 2427, 2447 e 2733;
 * Tg 4,17; Mt 25,14-46; Cl 3,23.
 * Uma meta pessoal não cumprida, isoladamente, não define pecado mortal.
 */
const cuiudoDutyReferences=Object.freeze({
 sins:'https://www.vatican.va/archive/cathechism_po/index_new/p3s1cap1_1699-1876_po.html',
 acedia:'https://www.vatican.va/archive/cathechism_po/index_new/p3s2cap1_2083-2195_po.html',
 prayer:'https://www.vatican.va/archive/cathechism_po/index_new/p4s1cap3_2697-2758_po.html',
 charity:'https://www.vatican.va/archive/cathechism_po/index_new/p3s2cap2_2196-2557_po.html',
 bible:'https://www.vatican.va/archive/bible/index_po.htm'
});
const cuiudoDutyItems=Object.freeze([
 {number:'01',label:'Preguiça espiritual — acédia',subtitle:'A oração abandonada por indiferença voluntária',
  description:'Quando você escolhe alimentar o desinteresse por Deus e se recusa, sem motivo justo, a cuidar da vida espiritual, não é simplesmente falta de ânimo: a acédia pode ferir a caridade.',
  question:'Estou procurando Deus com fidelidade ou deixei a oração sempre para depois por comodismo?',
  action:'Separe dez minutos de oração atenta e cumpra esse compromisso hoje.',
  bible:'CIC 2094; 2733',url:cuiudoDutyReferences.acedia},
 {number:'02',label:'Pecado por omissão',subtitle:'Saber o bem devido e escolher não fazê-lo',
  description:'Omissão pode ser pecado quando você sabe que tem obrigação real de agir, pode fazê-lo e, deliberadamente, deixa de praticar o bem. Não basta dizer que não fez nada de errado: às vezes o erro está no bem que você recusou.',
  question:'Que atitude justa eu sabia que devia tomar e deixei de tomar sem motivo sério?',
  action:'Repare uma omissão concreta enquanto ainda há tempo.',
  bible:'Tg 4,17; CIC 1853',url:cuiudoDutyReferences.sins},
 {number:'03',label:'Negligência nos deveres',subtitle:'Compromissos assumidos não são decoração',
  description:'Trabalho, estudo, família, honestidade e cuidado com os outros pedem responsabilidade. A omissão culpável é diferente de estar exausto, adoecido ou realmente impedido.',
  question:'Tenho prejudicado outras pessoas porque trato obrigações sérias como opcionais?',
  action:'Conclua a tarefa mais importante que depende de você, sem atalhos desonestos.',
  bible:'Cl 3,23; CIC 2427',url:cuiudoDutyReferences.charity},
 {number:'04',label:'Procrastinação deliberada',subtitle:'O amanhã virou desculpa para não fazer o necessário',
  description:'Adiar tudo não é automaticamente pecado. Mas escolher repetidamente fugir de um dever importante, sem razão proporcional, pode expressar negligência e falta de amor.',
  question:'Estou organizando meu tempo ou disfarçando a fuga do dever como planejamento?',
  action:'Trabalhe vinte minutos agora na obrigação que você vem adiando.',
  bible:'CIC 1853; 2094',url:cuiudoDutyReferences.sins},
 {number:'05',label:'Enterrar os próprios talentos',subtitle:'Dons são chamados ao serviço, não à vaidade',
  description:'Na parábola dos talentos, Jesus confronta a irresponsabilidade diante do que foi confiado. Não é uma promessa de riqueza nem a exigência de transformar todo sonho em sucesso; é um chamado a servir com coragem.',
  question:'Tenho escondido uma capacidade que poderia colocar honestamente a serviço do bem?',
  action:'Use hoje uma habilidade para cumprir um dever ou ajudar alguém.',
  bible:'Mt 25,14–30',url:cuiudoDutyReferences.bible},
 {number:'06',label:'Omissão da caridade',subtitle:'A fé não deve ignorar quem precisa',
  description:'Ignorar voluntariamente uma necessidade grave quando você pode oferecer ajuda proporcionada pode ser falta de caridade. Ter fé também significa reconhecer o próximo.',
  question:'Quem poderia ter recebido minha ajuda e encontrou apenas indiferença?',
  action:'Faça um ato real de misericórdia, com discrição e respeito.',
  bible:'Mt 25,31–46; CIC 2447',url:cuiudoDutyReferences.charity},
 {number:'07',label:'Desânimo aceito como destino',subtitle:'A dificuldade não autoriza desistir do bem',
  description:'O desânimo em si não é automaticamente culpa. O perigo moral está em consentir com a indiferença e usar a tristeza como autorização permanente para abandonar o amor e as responsabilidades possíveis.',
  question:'Tenho procurado ajuda e recomeçado, ou já decidi não tentar fazer a parte que me cabe?',
  action:'Peça auxílio, escolha uma tarefa possível e dê o primeiro passo.',
  bible:'CIC 2733; 1857',url:cuiudoDutyReferences.prayer}
]);
function cuiudoDutyHero(){
 return '<section class="duty-hero">'+
  '<div class="duty-hero-copy"><span class="duty-eyebrow">EXAME DE CONSCIÊNCIA · SEM DESCULPAS</span>'+
  '<h2>O bem que você deixou de fazer também importa.</h2>'+
  '<p>Preguiça. Omissão. Deveres abandonados. A fé pede oração, responsabilidade e coragem para agir.</p>'+
  '<div class="duty-hero-actions"><button class="btn btn-primary" type="button" data-action="navigate" data-tab="exame">'+
  'Examinar minha consciência ↗</button></div></div>'+
  '<div class="duty-image-wrap"><img class="saint-benedict-hd" src="./assets/sao-bento-gravura-hd.webp" loading="lazy" decoding="async" width="620" height="900"'+
   ' alt="Gravura histórica de São Bento, Wellcome Collection · CC BY 4.0" '+
   'onerror="if(!this.dataset.failed){this.dataset.failed=1;this.src=\'./assets/sao-bento-arte-enviada.webp\';}">'+
   '<img class="saint-benedict-user-art" src="./assets/sao-bento-arte-enviada.webp" loading="lazy" decoding="async" width="120" height="200"'+
    ' alt="Arte de São Bento enviada pelo usuário — A cruz sagrada seja minha luz">'+
   '</div></section>';
}
function cuiudoDutyContent(){
 return '<section class="duty-section"><div class="duty-section-intro">'+
  '<span class="eyebrow">CATECISMO · PECADO POR OMISSÃO</span>'+
  '<h2>Preguiça, omissão e deveres abandonados podem ser pecado. Sete maneiras de examinar a própria consciência.</h2>'+
  '<p>Não confunda disciplina com brutalidade. O exame pergunta pela liberdade, pelo dever verdadeiro e pelo amor ao próximo.</p></div>'+
  '<div class="duty-cards">'+cuiudoDutyItems.map(item=>'<article class="duty-card">'+
   '<div class="duty-card-top"><span class="duty-number">'+item.number+'</span>'+
   '<span class="duty-reference">'+escapeHtml(item.bible)+'</span></div>'+
   '<h3>'+escapeHtml(item.label)+'</h3><p class="duty-subtitle">'+escapeHtml(item.subtitle)+'</p>'+
   '<p>'+escapeHtml(item.description)+'</p>'+
   '<div class="duty-question"><strong>Exame:</strong> '+escapeHtml(item.question)+'</div>'+
   '<div class="duty-action"><strong>Hoje:</strong> '+escapeHtml(item.action)+'</div>'+
   '<a href="'+escapeHtml(item.url)+'" target="_blank" rel="noopener noreferrer">'+
   'Consultar a doutrina ↗</a></article>').join('')+'</div>'+
  '<div class="duty-balance"><strong>Responsabilidade, arrependimento e Confissão.</strong>'+
   '<p>Ficar cansado, adoecer, descansar ou não alcançar uma meta pessoal não é, por si só, pecado mortal. '+
   'A doutrina exige avaliar o dever real e a liberdade da pessoa; o pecado mortal requer matéria grave, pleno conhecimento e consentimento deliberado (CIC 1857). '+
   'Se você deixou de praticar deliberadamente um bem sério que devia fazer, reconheça, repare e procure a Confissão sacramental. '+
   'Se tiver consciência de pecado mortal, confesse-se antes de comungar. Faça o que deve, peça ajuda e recomece com responsabilidade.</p>'+
   '<a href="'+cuiudoDutyReferences.sins+'" target="_blank" rel="noopener noreferrer">Catecismo da Igreja Católica, 1853–1860 ↗</a></div></section>';
}
const cuiudoDutyOldExamine=examine;
examine=function(){
 return cuiudoDutyHero()+cuiudoDutyContent()+cuiudoDutyOldExamine();
};
const cuiudoDutyOldHome=combatHome;
combatHome=function(){
 const html=cuiudoDutyOldHome();
 const start=html.indexOf('<section class="today-goals"');
 if(start<0)return html+cuiudoDutyHero();
 // Percorrer seções aninhadas para posicionar o exame DEPOIS das metas,
 // inclusive do desempenho e da anotação "O que atrapalhou seu dia?".
 const sections=/<\\/?section\\b[^>]*>/gi;
 sections.lastIndex=start;
 let depth=0,end=-1,tag;
 while((tag=sections.exec(html))){
  if(tag[0].startsWith('</')){
   depth--;
   if(depth===0){end=sections.lastIndex;break;}
  }else depth++;
 }
 if(end<0)return html+cuiudoDutyHero();
 return html.slice(0,end)+cuiudoDutyHero()+html.slice(end);
};
render();
