/* Lectio Divina — devocional católico diário. Reflexões autorais, sem substituir a Escritura.
 * Notas e marcações privadas ficam neste navegador, nunca nas metas públicas do D1. */
(function(){
 'use strict';
 const KEY='terco-lectio-devocionais-v1';
 const DEVOTIONALS={
  anunciacao:['A coragem do sim','Maria acolhe o chamado mesmo sem enxergar todo o caminho. A fé não elimina as perguntas, mas impede que o medo tenha a última palavra.','Senhor, dá-me a coragem e a humildade de Maria para responder ao bem que me pedes.'],
  visitacao:['A fé se torna serviço','Maria se levanta e vai ao encontro de Isabel. A oração que transforma o coração também transforma a maneira como cuidamos dos outros.','Jesus, faz-me atento às necessidades de quem está perto e pronto para servir sem buscar aplausos.'],
  nascimento:['Deus age no pequeno','O Salvador nasce com simplicidade. A santidade não depende de prestígio nem de condições perfeitas, mas da fidelidade ao amor possível hoje.','Menino Jesus, livra-me da vaidade e ensina-me a começar com o que tenho.'],
  apresentacao:['O dever também santifica','Maria e José cumprem com fé os deveres cotidianos. Ser fiel nas coisas pequenas prepara o coração para as grandes.','Senhor, ensina-me a cumprir meus compromissos com dedicação e sem reclamar.'],
  encontro:['Buscar o essencial','Maria e José procuram Jesus sem desistir. Quando a rotina se torna barulhenta, voltar à Palavra nos ajuda a reencontrar a direção.','Jesus, não permitas que minhas distrações me afastem de Ti.'],
  agonia:['Coragem na angústia','No Horto, Jesus não esconde o sofrimento: confia-o ao Pai. A coragem cristã permite pedir ajuda e continuar escolhendo o bem.','Pai, acolhe minhas inquietações e dá-me serenidade para dar o próximo passo.'],
  flagelacao:['Amor que não revida','Cristo sofre a injustiça sem renunciar ao amor. Segui-lo não significa aceitar abusos; significa defender a dignidade sem alimentar a crueldade.','Jesus, faz-me justo e compassivo, mesmo diante do mal.'],
  espinhos:['A força da humildade','A zombaria não retira a dignidade de Cristo. O valor da pessoa não depende da aprovação alheia nem da vitória em uma discussão.','Senhor, liberta-me do orgulho e ensina-me a responder com dignidade.'],
  cruz:['Não caminhar sozinho','Simão de Cirene ajuda Jesus a levar a cruz. A responsabilidade pessoal não exclui a humildade de aceitar ajuda quando necessário.','Jesus, fortalece meus passos e ensina-me a ajudar e a ser ajudado.'],
  crucificacao:['Amar com atitudes','Na cruz, Jesus manifesta um amor que é entrega, não apenas sentimento. O nosso amor também precisa aparecer em escolhas concretas de cuidado e fidelidade.','Jesus crucificado, livra-me do egoísmo e torna meu amor verdadeiro.'],
  ressurreicao:['O recomeço é possível','A Ressurreição sustenta a esperança cristã. O erro exige conversão e reparação, mas não precisa aprisionar o futuro.','Cristo ressuscitado, renova minha esperança e dá-me força para recomeçar.'],
  ascensao:['Uma missão para hoje','A esperança do céu dá sentido aos deveres da terra. Cristo envia seus discípulos a testemunhar e servir, não a ficar parados.','Jesus, mostra-me onde devo agir e dá-me perseverança para cumprir minha missão.'],
  pentecostes:['A coragem vem do Espírito','O Espírito Santo fortalece discípulos inseguros. Seus dons nos orientam a unir verdade, prudência, caridade e coragem.','Vinde, Espírito Santo. Iluminai meu coração, meus estudos e minhas decisões.'],
  assuncao:['Viver para a eternidade','A Igreja contempla Maria elevada à glória celeste. Essa esperança não nos afasta da vida concreta: ajuda-nos a ordenar os desejos e valorizar a dignidade humana.','Senhor, pela intercessão de Maria, faz-me viver hoje com os olhos na eternidade.'],
  coroacao:['A grandeza dos humildes','Maria é honrada por Deus; sua grandeza vem da fidelidade e do serviço. A glória cristã não nasce da vaidade nem da busca de aplausos.','Senhor, purifica minhas intenções para que eu procure ser fiel, não admirado.'],
  batismo:['Viver como filho de Deus','No Jordão, o Pai manifesta seu amor pelo Filho. O Batismo nos chama à vida nova; cada escolha diária deve responder a essa graça.','Pai, ajuda-me a viver a graça do Batismo com gratidão e coerência.'],
  cana:['Escutar e fazer a própria parte','Nas bodas, Maria aponta para Jesus e os servos obedecem. A confiança cristã caminha junto com a ação responsável.','Jesus, ensina-me a escutar tua Palavra e cumprir minha parte.'],
  reino:['Converter-se hoje','Jesus anuncia a proximidade do Reino e chama à conversão. O arrependimento sincero começa a mudar a vida em gestos concretos.','Senhor, mostra-me o que preciso corrigir e ajuda-me a começar hoje.'],
  transfiguracao:['Escutai-o','No monte, os discípulos são chamados a escutar Jesus. O silêncio e a atenção à Palavra ajudam a reconhecer a verdade em meio ao ruído.','Jesus, abre meus ouvidos à tua voz e dá-me constância na fé.'],
  eucaristia:['Gratidão que vira caridade','Na Última Ceia, Cristo entrega a si mesmo por amor. A Eucaristia pede reverência, preparação e uma vida que transborde em serviço.','Jesus eucarístico, aumenta minha fé e transforma minha gratidão em caridade.']
 };
 function read(){
  try{
   const data=JSON.parse(localStorage.getItem(KEY)||'{}');
   return data&&typeof data==='object'&&!Array.isArray(data)?data:{};
  }catch{return {};}
 }
 window.cuiudoDevotionalCard=function(m){
  if(!m)return '';
  const d=DEVOTIONALS[m.id]||['Viver a Palavra',m.summary||'Escute Cristo com fé.','Senhor, ajuda-me a viver o Evangelho com caridade.'];
  const done=Boolean(read()[currentDay()+':'+m.id]);
  return '<article class="cuiudo-devotional" aria-labelledby="cuiudo-devotional-title">'+
   '<div class="cuiudo-devotional-header"><div><span class="cuiudo-devotional-eyebrow">DEVOCIONAL DO DIA</span>'+
   '<h2 id="cuiudo-devotional-title">'+escapeHtml(d[0])+'</h2></div>'+
   '<span class="cuiudo-devotional-reference">'+escapeHtml(m.ref)+'</span></div>'+
   '<p class="cuiudo-devotional-intro">Meditação autoral inspirada na passagem acima.</p>'+
   '<div class="cuiudo-devotional-body">'+
   '<section><h3>Meditação</h3><p>'+escapeHtml(d[1])+'</p></section>'+
   '<section><h3>Exame do coração</h3><p>'+escapeHtml(m.question||'O que esta Palavra pede de mim hoje?')+'</p></section>'+
   '<section class="cuiudo-devotional-prayer"><h3>Oração</h3><p>'+escapeHtml(d[2])+'</p></section>'+
   '<section class="cuiudo-devotional-action"><h3>Propósito de hoje</h3><p>'+escapeHtml(m.action||'Pratique um ato de caridade.')+'</p></section>'+
   '</div><div class="cuiudo-devotional-footer"><button type="button" data-action="cuiudo-lectio-devotional-toggle" data-id="'+escapeHtml(m.id)+'" aria-pressed="'+done+'">'+
   escapeHtml(done?'Devocional realizado · Desfazer':'Marcar devocional como realizado')+'</button>'+
   '<small>Registro privado, salvo neste aparelho.</small></div></article>';
 };
 app.addEventListener('click',event=>{
  const b=event.target?.closest?.('[data-action="cuiudo-lectio-devotional-toggle"]');
  if(!b)return;
  const id=String(b.dataset.id||'');
  if(!Object.prototype.hasOwnProperty.call(DEVOTIONALS,id))return;
  const key=currentDay()+':'+id,records=read();
  if(records[key])delete records[key];else records[key]=Date.now();
  try{localStorage.setItem(KEY,JSON.stringify(records));render();}catch{}
 });
})();