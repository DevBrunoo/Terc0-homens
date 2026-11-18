import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {createContext,runInContext} from 'node:vm';
const read=p=>readFileSync(new URL('./'+p,import.meta.url),'utf8');
const files=['data.js','brutal.js','devocionario.js','feed-data.js','app.js','feed-ui.js',
'ambient-audio.js','cuiudo-music.js','rosary-i18n.js','rosary-artwork.js','rosary-context.js',
'rosary-plus.js','daily-goals.js','conscience-duty.js'];
const handlers={},widgets={};
const app={innerHTML:'',addEventListener(type,fn){(handlers[type]??=[]).push(fn)},querySelectorAll(){return []},querySelector(selector){return widgets[selector]||null}};
const doc={documentElement:{dataset:{},style:{}},getElementById(){return app},
 querySelector(){return {content:'',setAttribute(){}}},addEventListener(){}};
const saved=new Map();
let storageBlocked=false;
const vm=createContext({document:doc,window:{location:{hash:''},scrollTo(){},matchMedia(){return {matches:false,addEventListener(){}}}},
 navigator:{},location:{protocol:'file:'},localStorage:{getItem(k){return saved.get(k)||null},setItem(k,v){if(storageBlocked)throw new Error('Storage blocked');saved.set(k,v)}},
 console,confirm(){return true}});
runInContext(files.map(read).join('\n'),vm,{timeout:7000});
assert.match(app.innerHTML,/medalha-sao-bento-hd\.svg/,'Medalha em vetor HD visível na home');
assert.match(app.innerHTML,/sao-bento-arte-enviada\.webp/,'Arte de São Bento enviada visível na home');
assert.match(app.innerHTML,/duty-hero/,'Banner do exame de deveres visível');
assert.match(app.innerHTML,/today-goals/,'Checklist de metas existente preservado');
assert.ok(app.innerHTML.indexOf('goals-god-moment-box')<app.innerHTML.indexOf('cuiudo-goals-chart'),
 'Onde vejo Deus acima do gráfico de desempenho');
assert.ok(app.innerHTML.indexOf('id="goals-obstacle-title"')<app.innerHTML.indexOf('cuiudo-goals-chart'),
 'O que atrapalhou seu dia fica acima do desempenho');
assert.ok(app.innerHTML.indexOf('cuiudo-goals-chart')<app.innerHTML.indexOf('class="duty-hero"'),
 'O exame de consciência continua abaixo do desempenho');
assert.ok(app.innerHTML.indexOf('class="duty-hero"')<app.innerHTML.indexOf('class="benedict-hero"'),
 'Exame ainda aparece antes do banner principal');
runInContext("state.tab='exame';render()",vm);
assert.equal((app.innerHTML.match(/class="duty-card"/g)||[]).length,7,'Sete temas do exame de consciência');
for(const key of ['Preguiça espiritual','Pecado por omissão','Negligência','Procrastinação','talentos','caridade','desânimo']){
 assert.ok(app.innerHTML.toLowerCase().includes(key.toLowerCase()),'Tema ausente '+key);
}
assert.match(app.innerHTML,/matéria grave|matéria grave/i);
assert.match(app.innerHTML,/pleno conhecimento/);
assert.match(app.innerHTML,/consentimento deliberado/);
assert.match(app.innerHTML,/Catecismo/);
const items=runInContext('cuiudoDutyItems',vm);
assert.equal(items.length,7);
for(const item of items){
 assert.ok(item.description.length>60);
 assert.ok(item.action.length>20);
 assert.match(item.url,/^https:\/\/www\.vatican\.va\//);
}
// Respostas persistem durante a digitação sem recriar o formulário nem perder o foco.
assert.match(app.innerHTML,/id="honesty-form"/);
assert.equal((app.innerHTML.match(/data-honesty-field="(?:responsabilidade|acoes|comeco|obstaculos|tempo|pressao|limites|cobranca)"/g)||[]).length,8);
widgets['#honesty-count']={textContent:''};
widgets['#honesty-progress']={value:0};
widgets['#honesty-status']={textContent:''};
function input(field,value){
 const target={id:'honesty-'+field,dataset:{honestyField:field},value,setCustomValidity(){}};
 for(const fn of handlers.input||[])fn({target});
}
const beforeTyping=app.innerHTML;
input('responsabilidade','Enviar candidatura <script>alert(1)</script>');
assert.equal(app.innerHTML,beforeTyping,'Digitar não deve recriar o formulário');
assert.equal(widgets['#honesty-progress'].value,1);
assert.equal(widgets['#honesty-count'].textContent,'1 de 8 respondidas');
const privateAnswers=JSON.parse(saved.get('terco-exame-honesto-v1'));
assert.equal(privateAnswers.responsabilidade,'Enviar candidatura <script>alert(1)</script>');
assert.equal(JSON.parse(saved.get('cuiudo-v1')||'{}').responsabilidade,undefined,'Respostas não entram no estado geral/sincronização');
runInContext("state.tab='inicio';render();state.tab='exame';render()",vm);
assert.match(app.innerHTML,/Enviar candidatura &lt;script&gt;alert\(1\)&lt;\/script&gt;/,'Texto é escapado ao voltar');
assert.doesNotMatch(app.innerHTML,/<script>alert\(1\)<\/script>/);
assert.equal(runInContext('cuiudoHonestyRead().responsabilidade',vm),privateAnswers.responsabilidade,'Respostas podem ser recuperadas do armazenamento');
input('acoes','   ');
assert.equal(widgets['#honesty-progress'].value,1,'Espaços não contam como uma resposta');
storageBlocked=true;
input('acoes','Resolvi cinco exercícios.');
assert.match(widgets['#honesty-status'].textContent,/Não foi possível salvar/,'Falha de armazenamento deve ser visível');
storageBlocked=false;
input('acoes','Resolvi cinco exercícios e revisei os erros.');
assert.equal(widgets['#honesty-progress'].value,2);
assert.match(widgets['#honesty-status'].textContent,/salvas automaticamente/);
function field(value){return {value,validationMessage:'',setCustomValidity(message){this.validationMessage=message}}}
const delivery=field('Enviar uma candidatura completa'),deadline=field('2000-01-01T12:00');
const form={id:'honesty-form',querySelector(selector){return selector==='[name="entrega"]'?delivery:deadline},reportValidity(){return !delivery.validationMessage&&!deadline.validationMessage}};
function submit(){for(const fn of handlers.submit||[])fn({target:form,preventDefault(){}})}
submit();
assert.match(deadline.validationMessage,/futuros/,'Prazo vencido não deve registrar compromisso');
assert.equal(JSON.parse(saved.get('terco-exame-honesto-v1')).confirmedAt,undefined);
deadline.value='2099-01-01T12:00';delivery.value='   ';
submit();
assert.match(delivery.validationMessage,/entrega concreta/,'Compromisso vazio é recusado');
delivery.value='Enviar uma candidatura completa';
submit();
assert.ok(JSON.parse(saved.get('terco-exame-honesto-v1')).confirmedAt);
assert.match(widgets['#honesty-status'].textContent,/Escrever não conclui a tarefa/,'Registrar compromisso não marca tarefa cumprida');
input('entrega','Enviar duas candidaturas completas');
assert.equal(JSON.parse(saved.get('terco-exame-honesto-v1')).confirmedAt,undefined,'Editar a entrega retira a confirmação anterior');
runInContext("state.tab='terco';render()",vm);
assert.match(app.innerHTML,/medalha-sao-bento-hd\.svg/,'Medalha HD também durante o terço');
for(const asset of ['assets/medalha-sao-bento-colorida.webp','assets/sao-bento-arte-enviada.webp']){
 const url=new URL('./'+asset,import.meta.url);
 assert.ok(existsSync(url),'Imagem ausente: '+asset);
 const buf=readFileSync(url);
 assert.equal(buf.toString('ascii',0,4),'RIFF');
 assert.equal(buf.toString('ascii',8,12),'WEBP');
 assert.ok(buf.length>15000,'Imagem incompleta: '+asset);
}
for(const x of ['conscience-duty.js','cuiudo-v15.css']){
 assert.ok(read('index.html').includes(x),'Não carregado no index.html: '+x);
 assert.ok(read('sw.js').includes(x),'Não armazenado no PWA: '+x);
}
console.log('✓ Exame: 7 temas, 8 respostas privadas persistentes, digitação estável e compromisso com prazo validado');
