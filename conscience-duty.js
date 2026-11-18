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
  'Responder ao exame sem fuga ↗</button></div></div>'+
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
const cuiudoHonestyKey='terco-exame-honesto-v1';
const cuiudoHonestyQuestions=Object.freeze([
 {id:'responsabilidade',title:'Qual dever você está empurrando com a barriga?',
  help:'Dê nome à obrigação e diga há quanto tempo. “Preciso melhorar” ainda não identifica o que precisa ser feito.',
  placeholder:'Estou adiando… há…'},
 {id:'acoes',title:'O que você fez de verdade nos últimos sete dias?',
  help:'Liste ações e entregas. Pesquisar e planejar têm valor; registre também o que virou execução.',
  placeholder:'Nesta semana eu fiz… e concluí…'},
 {id:'comeco',title:'Na hora de começar, o que você faz?',
  help:'Descreva o que acontece: celular, pesquisa sem fim, outra tarefa, medo ou falta de energia. Trocar pelo mais confortável também pode ser fuga.',
  placeholder:'Quando chega a hora, eu…'},
 {id:'obstaculos',title:'O que realmente impede você de agir?',
  help:'Dinheiro, barulho, saúde, sono ou excesso de deveres: explique o impacto. Diga qual parte continua possível e onde precisa de ajuda.',
  placeholder:'O obstáculo concreto é… Ainda consigo… Preciso de ajuda com…'},
 {id:'tempo',title:'Quanto tempo você teve — e como o gastou?',
  help:'Use um dia real. Considere trabalho, descanso e cuidados; depois, conte o tempo gasto em distrações que poderiam esperar.',
  placeholder:'Ontem tive… de tempo disponível. Usei… para…'},
 {id:'pressao',title:'O que muda quando o prazo aperta ou alguém cobra?',
  help:'Conte um caso recente. Se você age sob pressão, examine o que pode organizar antes de chegar ao limite.',
  placeholder:'Quando houve cobrança ou prazo, aconteceu…'},
 {id:'limites',title:'A dificuldade também atinge o que você gosta e os cuidados básicos?',
  help:'Observe sono, alimentação, higiene, convívio e lazer. Uma dificuldade ampla pede atenção e ajuda. Reconhecer um limite real também exige honestidade.',
  placeholder:'A dificuldade aparece em… e afeta meu dia assim…'},
 {id:'cobranca',title:'Depois de se cobrar, o que você faz?',
  help:'Mais culpa não é uma entrega. Descreva a ação que veio depois da cobrança — ou reconheça que continuou parado.',
  placeholder:'Depois de me cobrar, eu…'}
]);
function cuiudoHonestyRead(){
 try{
  const value=JSON.parse(localStorage.getItem(cuiudoHonestyKey)||'null');
  if(!value||value.version!==1||typeof value!=='object')return {};
  const result={};
  for(const question of cuiudoHonestyQuestions){
   if(typeof value[question.id]==='string')result[question.id]=value[question.id].slice(0,1200);
  }
  for(const [field,max] of [['entrega',600],['prazo',16],['confirmedAt',40]]){
   if(typeof value[field]==='string')result[field]=value[field].slice(0,max);
  }
  return result;
 }catch{return {}}
}
const cuiudoHonestyDraft=cuiudoHonestyRead();
let cuiudoHonestySaved=true;
function cuiudoHonestyCount(){
 return cuiudoHonestyQuestions.filter(q=>String(cuiudoHonestyDraft[q.id]||'').trim()).length;
}
function cuiudoHonestySave(){
 try{
  localStorage.setItem(cuiudoHonestyKey,JSON.stringify({...cuiudoHonestyDraft,version:1,updatedAt:new Date().toISOString()}));
  cuiudoHonestySaved=true;
 }catch{cuiudoHonestySaved=false}
 return cuiudoHonestySaved;
}
function cuiudoHonestyStatus(){
 if(!cuiudoHonestySaved)return 'Não foi possível salvar neste aparelho. Copie suas respostas antes de sair.';
 if(cuiudoHonestyDraft.confirmedAt)return 'Compromisso registrado. Escrever não conclui a tarefa. Cumpra o que assumiu.';
 return 'Respostas salvas automaticamente neste navegador.';
}
function cuiudoHonestyUpdate(){
 const count=cuiudoHonestyCount();
 const counter=app.querySelector('#honesty-count');
 const progress=app.querySelector('#honesty-progress');
 const status=app.querySelector('#honesty-status');
 if(counter)counter.textContent=count+' de 8 respondidas';
 if(progress)progress.value=count;
 if(status)status.textContent=cuiudoHonestyStatus();
}
function cuiudoHonestyContent(){
 const count=cuiudoHonestyCount();
 return '<section class="honesty-section" aria-labelledby="honesty-heading">'+
  '<div class="honesty-heading"><span class="eyebrow">EXAME HONESTO · ÚLTIMOS 7 DIAS</span>'+
  '<h2 id="honesty-heading">O que você fez com o que recebeu?</h2>'+
  '<p><strong>Boa intenção não cumpre dever adiado.</strong> Responda com fatos. Admita a omissão onde houve escolha e reconheça os limites reais.</p></div>'+
  '<details class="honesty-context"><summary>A cobrança da parábola dos talentos</summary>'+
  '<div><p>O servo devolveu o que recebeu, mas foi repreendido por tê-lo enterrado. O medo que apresentou não eliminou a responsabilidade pela providência que estava ao seu alcance. Jesus fala de fidelidade, caridade e prestação de contas diante de Deus (Mt 25,14–46).</p>'+
  '<p><strong>Você também responde pelo bem que escolhe deixar de fazer.</strong> Examine sua liberdade, seus deveres e as condições reais. Uma tentativa sincera que fracassou é diferente de uma omissão escolhida. A passagem não permite tratar cada perda da sua vida como castigo de Deus.</p>'+
  '<a href="https://www.vatican.va/content/francesco/pt/angelus/2023/documents/20231119-angelus.html" target="_blank" rel="noopener noreferrer">Ler a explicação da parábola ↗</a></div></details>'+
  '<div class="honesty-progress"><span id="honesty-count">'+count+' de 8 respondidas</span><span>Preenchimento do exame</span>'+
  '<progress id="honesty-progress" max="8" value="'+count+'" aria-labelledby="honesty-count"></progress></div>'+
  '<form id="honesty-form"><div class="honesty-grid">'+cuiudoHonestyQuestions.map((q,i)=>
   '<div class="honesty-question"><label for="honesty-'+q.id+'"><span class="honesty-number" aria-hidden="true">'+String(i+1).padStart(2,'0')+'</span>'+escapeHtml(q.title)+'</label>'+
   '<p id="honesty-help-'+q.id+'">'+escapeHtml(q.help)+'</p>'+
   '<textarea id="honesty-'+q.id+'" name="'+q.id+'" data-honesty-field="'+q.id+'" rows="3" maxlength="1200" aria-describedby="honesty-help-'+q.id+'" placeholder="'+escapeHtml(q.placeholder)+'">'+escapeHtml(cuiudoHonestyDraft[q.id]||'')+'</textarea></div>'
  ).join('')+'</div>'+
  '<fieldset class="honesty-commitment"><legend>Chega de promessa vaga. Assuma uma entrega.</legend>'+
  '<p>Escolha uma ação possível e verificável. Inclua o bem que você deve a alguém. “Vou me esforçar” ainda não diz o que você vai fazer.</p>'+
  '<div class="honesty-commitment-fields"><div><label for="honesty-entrega">O que você vai entregar?</label>'+
  '<textarea id="honesty-entrega" name="entrega" data-honesty-field="entrega" rows="2" maxlength="600" required placeholder="Enviar uma candidatura completa; resolver cinco exercícios; cumprir uma ajuda que prometi…">'+escapeHtml(cuiudoHonestyDraft.entrega||'')+'</textarea></div>'+
  '<div><label for="honesty-prazo">Até quando?</label><input id="honesty-prazo" name="prazo" data-honesty-field="prazo" type="datetime-local" required value="'+escapeHtml(cuiudoHonestyDraft.prazo||'')+'"></div></div>'+
  '<button class="btn btn-primary" type="submit">Registrar meu compromisso</button>'+
  '<p class="honesty-action-line"><strong>Antes de procurar outra frase que dê vontade de mudar, cumpra uma decisão que você já tomou.</strong></p></fieldset>'+
  '<p id="honesty-status" class="honesty-status" role="status" aria-live="polite">'+cuiudoHonestyStatus()+'</p>'+
  '<p class="honesty-privacy">Privado neste navegador. As respostas permanecem ao sair e voltar; limpar os dados do navegador pode apagá-las. Este exame ajuda a refletir e não substitui a Confissão.</p>'+
  '</form></section>';
}
app.addEventListener('input',event=>{
 const field=event.target;
 const key=field?.dataset?.honestyField;
 if(!key||!['entrega','prazo',...cuiudoHonestyQuestions.map(q=>q.id)].includes(key))return;
 cuiudoHonestyDraft[key]=String(field.value||'').slice(0,key==='entrega'?600:key==='prazo'?16:1200);
 if(key==='entrega'||key==='prazo'){
  delete cuiudoHonestyDraft.confirmedAt;
  field.setCustomValidity?.('');
 }
 cuiudoHonestySave();
 // Atualizar apenas os indicadores: recriar o formulário aqui apagaria a seleção e o foco.
 cuiudoHonestyUpdate();
});
app.addEventListener('submit',event=>{
 if(event.target?.id!=='honesty-form')return;
 event.preventDefault();
 const form=event.target;
 const delivery=form.querySelector('[name="entrega"]');
 const deadline=form.querySelector('[name="prazo"]');
 if(!delivery||!deadline)return;
 delivery.setCustomValidity(delivery.value.trim()?'':'Escreva uma entrega concreta.');
 const deadlineTime=new Date(deadline.value).getTime();
 deadline.setCustomValidity(Number.isFinite(deadlineTime)&&deadlineTime>Date.now()?'':'Escolha uma data e um horário futuros.');
 if(!form.reportValidity())return;
 cuiudoHonestyDraft.entrega=delivery.value.trim().slice(0,600);
 cuiudoHonestyDraft.prazo=deadline.value.slice(0,16);
 cuiudoHonestyDraft.confirmedAt=new Date().toISOString();
 cuiudoHonestySave();
 cuiudoHonestyUpdate();
});
const cuiudoDutyOldExamine=examine;
examine=function(){
 return cuiudoDutyHero()+cuiudoHonestyContent()+cuiudoDutyContent()+cuiudoDutyOldExamine();
};
const cuiudoDutyOldHome=combatHome;
combatHome=function(){
 const html=cuiudoDutyOldHome();
 const start=html.indexOf('<section class="today-goals"');
 if(start<0)return html+cuiudoDutyHero();
 // Percorrer seções aninhadas para posicionar o exame DEPOIS das metas,
 // inclusive do desempenho e da anotação "O que atrapalhou seu dia?".
 const sections=/<\/?section\b[^>]*>/gi;
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
