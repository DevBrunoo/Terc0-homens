import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {createContext,runInContext} from 'node:vm';
const read=p=>readFileSync(new URL('./'+p,import.meta.url),'utf8');
const files=['data.js','brutal.js','devocionario.js','feed-data.js','app.js','feed-ui.js',
'ambient-audio.js','cuiudo-music.js','rosary-i18n.js','rosary-artwork.js','rosary-context.js',
'rosary-plus.js','daily-goals.js','conscience-duty.js'];
const app={innerHTML:'',addEventListener(){},querySelectorAll(){return []},querySelector(){return null}};
const doc={documentElement:{dataset:{},style:{}},getElementById(){return app},
 querySelector(){return {content:'',setAttribute(){}}},addEventListener(){}};
const saved=new Map();
const vm=createContext({document:doc,window:{location:{hash:''},scrollTo(){},matchMedia(){return {matches:false,addEventListener(){}}}},
 navigator:{},location:{protocol:'file:'},localStorage:{getItem(k){return saved.get(k)||null},setItem(k,v){saved.set(k,v)}},
 console,confirm(){return true}});
runInContext(files.map(read).join('\n'),vm,{timeout:7000});
assert.match(app.innerHTML,/medalha-sao-bento-hd\.svg/,'Medalha em vetor HD visível na home');
assert.match(app.innerHTML,/sao-bento-arte-enviada\.webp/,'Arte de São Bento enviada visível na home');
assert.match(app.innerHTML,/duty-hero/,'Banner do exame de deveres visível');
assert.match(app.innerHTML,/today-goals/,'Checklist de metas existente preservado');
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
console.log('✓ CUIÚDO v15: 2 imagens enviadas, medalha colorida, 7 pecados/omissões e doutrina católica');
