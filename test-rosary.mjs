import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {runInContext,createContext} from 'node:vm';
const read=p=>readFileSync(new URL('./'+p,import.meta.url),'utf8');
const components=['data.js','brutal.js','devocionario.js','feed-data.js','app.js','feed-ui.js','ambient-audio.js','cuiudo-music.js','rosary-i18n.js','rosary-context.js','rosary-plus.js'];
for(const component of components){
 const check=spawnSync(process.execPath,['--check',new URL('./'+component,import.meta.url).pathname]);
 assert.equal(check.status,0,component+': '+check.stderr.toString());
}
const mount={innerHTML:'',addEventListener(){},querySelectorAll(){return []},querySelector(){return null}};
const metadata={content:'',setAttribute(n,v){this[n]=v}};
const doc={documentElement:{dataset:{},style:{},lang:'pt'},getElementById(){return mount},querySelector(){return metadata},addEventListener(){}};
const store=new Map();
const context={
 document:doc,window:{scrollTo(){},matchMedia(){return {matches:false,addEventListener(){}}},location:{hash:''}},
 navigator:{},location:{protocol:'file:'},localStorage:{
  getItem(k){return store.get(k)||null},
  setItem(k,v){store.set(k,v)}
 },confirm(){return true},console
};
const codes=components.map(read);
if(existsSync(new URL('./rosary-artwork.js',import.meta.url)))codes.splice(-1,0,read('rosary-artwork.js'));
const vm=createContext(context);
runInContext(codes.join('\n'),vm,{timeout:6000});
assert.match(mount.innerHTML,/benedict-hero/,'a medalha deve substituir o banner');
assert.match(mount.innerHTML,/medalha-sao-bento-hd\.svg/);
assert.match(mount.innerHTML,/cuiudo-language/);
for(const lang of ['pt','en','es','la']){
 runInContext('state.appLang='+JSON.stringify(lang)+';state.tab="terco";state.rosaryLength="small";render()',vm,{timeout:2500});
 assert.match(mount.innerHTML,/rosary-music-control/,'controle de música visível em '+lang);
 assert.match(mount.innerHTML,/meditation-size-buttons/,'três tamanhos em '+lang);
 assert.match(mount.innerHTML,/rosary-painting/,'foto por mistério em '+lang);
 assert.match(mount.innerHTML,/assets\/medalha-sao-bento-hd\.svg/);
 assert.match(mount.innerHTML,/data-action="add-bead"/);
 assert.match(mount.innerHTML,/rosary-intention-form/);
 assert.equal((mount.innerHTML.match(/data-action="combat-meditation-length"/g)||[]).length,3);
 assert.match(mount.innerHTML,/data-action="combat-rosary-music"/);
 assert.equal((mount.innerHTML.match(/data-action="combat-rosary-track"/g)||[]).length,9);
 for(const length of ['small','medium','large']){
  runInContext('state.rosaryLength='+JSON.stringify(length)+';render()',vm);
  if(length==='small')assert.doesNotMatch(mount.innerHTML,/rosary-long/);
  if(length==='large')assert.match(mount.innerHTML,/rosary-long/);
 }
 for(const group of ['gozosos','dolorosos','gloriosos','luminosos']){
  for(let i=0;i<5;i++){
   runInContext('state.group='+JSON.stringify(group)+';state.mystery='+i+';render()',vm);
   assert.match(mount.innerHTML,/rosary-painting/);
   assert.match(mount.innerHTML,/assets\/misterios\/(fotos\/)?[a-z-]+\.(webp|svg)/);
  }
 }
}
runInContext('state.tab="inicio";state.appLang="en";render()',vm);
assert.match(mount.innerHTML,/benedict-hero/);
assert.match(mount.innerHTML,/May the Holy Cross/);
runInContext('state.tab="palavra";state.appLang="es";render()',vm);
assert.match(mount.innerHTML,/SAGRADA ESCRITURA/);
runInContext('state.tab="palavra";state.appLang="la";render()',vm);
assert.match(mount.innerHTML,/SACRA SCRIPTURA/);
assert.equal(doc.documentElement.dataset.theme,'light');
const langs=runInContext('Object.keys(rosaryLocales)',vm);
assert.deepEqual(Array.from(langs),['pt','en','es','la']);
const mysteries=runInContext('Object.keys(rosaryMysteries)',vm);
assert.equal(mysteries.length,20);

const art=runInContext('rosaryArtwork',vm);
assert.equal(Object.keys(art).length,20);
for(const [id,obj] of Object.entries(art)){
 assert.match(obj.url,/^\.\/assets\/misterios\/fotos\/[a-z-]+\.webp$/,'arte local: '+id);
 const p=new URL(obj.url.slice(2),import.meta.url);
 assert.ok(existsSync(p),'Imagem física ausente: '+obj.url);
 const b=readFileSync(p);
 assert.ok(b.length>8000,'Imagem muito pequena: '+obj.url);
 assert.equal(b.subarray(0,4).toString('ascii'),'RIFF','WebP: '+id);
 assert.equal(b.subarray(8,12).toString('ascii'),'WEBP','WebP: '+id);
 assert.ok(obj.credit&&obj.source&&obj.license,'crédito incompleto: '+id);
}
console.log('✓ 20/20 artes religiosas no repositório com créditos e arquivos válidos');
const audio=runInContext('({playing:cuiudoAmbient.isPlaying(),supported:cuiudoAmbient.isSupported()})',vm);
assert.equal(audio.playing,false,'áudio não deve iniciar automaticamente');
assert.ok(existsSync(new URL('./assets/medalha-sao-bento.svg',import.meta.url)));
assert.ok(existsSync(new URL('./assets/medalha-sao-bento-ouro.svg',import.meta.url)));
assert.ok(existsSync(new URL('./assets/medalha-sao-bento-colorida.webp',import.meta.url)));
assert.ok(existsSync(new URL('./assets/medalha-sao-bento-real.webp',import.meta.url)));
assert.ok(existsSync(new URL('./assets/audio/cantico-catolico.mp3',import.meta.url)));
assert.ok(existsSync(new URL('./assets/audio/cantico-medieval.mp3',import.meta.url)));
const html=read('index.html');
for(const file of ['ambient-audio.js','cuiudo-music.js','rosary-i18n.js','rosary-context.js','rosary-plus.js','daily-goals.js','rosary-plus.css','cuiudo-v13.css','cuiudo-v14.css','cuiudo-v15.css','cuiudo-v16.css','rosary-beads.js','saints-i18n.js'])
 assert.ok(html.includes(file),'HTML não inclui '+file);

const personalized=runInContext('rosaryLanguageExtras',vm);
assert.equal(Object.keys(personalized.mysteries).length,20);
for(const lang of ['en','es','la']){
 const actions=new Set();
 for(const [id,items] of Object.entries(personalized.mysteries)){
  assert.ok(items[lang]?.question?.length>10,'Pergunta incompleta '+lang+'/'+id);
  assert.ok(items[lang]?.action?.length>10,'Ação incompleta '+lang+'/'+id);
  actions.add(items[lang].action);
 }
 assert.equal(actions.size,20,'Cada mistério exige uma meditação individualizada em '+lang);
 runInContext('state.appLang='+JSON.stringify(lang)+';state.tab="terco";state.mystery=0;state.group="gozosos";state.rosaryLength="large";render()',vm);
 assert.match(mount.innerHTML,/rosary-long/);
 assert.ok(mount.innerHTML.includes(runInContext('escapeHtml(rosaryLanguageExtras.mysteries.anunciacao['+JSON.stringify(lang)+'].question)',vm)));
 assert.ok(mount.innerHTML.includes(runInContext('escapeHtml(rosaryLanguageExtras.mysteries.anunciacao['+JSON.stringify(lang)+'].action)',vm)));
 assert.ok(mount.innerHTML.includes(personalized.saintMichael[lang].name));
 assert.ok(mount.innerHTML.includes(personalized.litany[lang].name));
 assert.ok(mount.innerHTML.includes(personalized.saintMichael[lang].text.slice(0,35)));
}
console.log('✓ 20 meditações individualizadas e São Miguel + ladainha em EN/ES/LA');

const audioEvents=[];
class FakeGain {
 gain={setValueAtTime(){},exponentialRampToValueAtTime(){},setTargetAtTime(){}};
 connect(){}
 disconnect(){}
}
class FakeOscillator {
 type='sine';
 frequency={setValueAtTime(){}};
 connect(){}
 start(t){audioEvents.push(['start',t]);}
 stop(t){audioEvents.push(['stop',t]);}
 disconnect(){}
}
class FakeAudioContext {
 currentTime=0;
 destination={};
 createGain(){return new FakeGain();}
 createOscillator(){return new FakeOscillator();}
 async resume(){}
 async close(){audioEvents.push(['close']);}
}
const fakeWindow={
 AudioContext:FakeAudioContext,
 setInterval(cb){audioEvents.push(['interval']);return 21;},
 clearInterval(id){audioEvents.push(['clear',id]);},
 setTimeout(cb){cb();return 42;}
};
const audioContext=createContext({window:fakeWindow,console});
runInContext(read('ambient-audio.js'),audioContext,{timeout:1000});
assert.equal(runInContext('cuiudoAmbient.isPlaying()',audioContext),false,'Não iniciar sozinho');
const started=await runInContext('cuiudoAmbient.start()',audioContext);
assert.equal(started,true,'Botão precisa iniciar áudio');
assert.equal(runInContext('cuiudoAmbient.isPlaying()',audioContext),true);
assert.ok(audioEvents.filter(x=>x[0]==='start').length>10,'Deve criar notas musicais');
runInContext('cuiudoAmbient.setVolume(0)',audioContext);
assert.equal(runInContext('cuiudoAmbient.getVolume()',audioContext),0);
runInContext('cuiudoAmbient.stop()',audioContext);
assert.equal(runInContext('cuiudoAmbient.isPlaying()',audioContext),false);
assert.ok(audioEvents.some(x=>x[0]==='clear'),'Parada precisa cancelar o loop');
console.log('✓ AudioContext: início somente após toque, notas, volume zero, pausa e limpeza');

console.log('✓ CUIÚDO 12: medalha, áudio opcional, 4 idiomas, 20 mistérios e 3 tamanhos');
