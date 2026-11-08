import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {runInContext,createContext} from 'node:vm';
const read=f=>readFileSync(new URL('./'+f,import.meta.url),'utf8');
const appListeners={click:[],change:[],input:[],submit:[]};
const mount={innerHTML:'',addEventListener(type,cb){(appListeners[type]??=[]).push(cb);},querySelector(){return null;},querySelectorAll(){return []}};
const meta={content:'',setAttribute(n,v){this[n]=v}};
const doc={documentElement:{dataset:{},style:{},lang:'pt'},getElementById(){return mount},querySelector(){return meta},addEventListener(){}};
const local=new Map();
const sandbox={document:doc,window:{scrollTo(){},location:{hash:''},matchMedia(){return {matches:false,addEventListener(){}}}},
 navigator:{},location:{protocol:'file:'},localStorage:{getItem(k){return local.get(k)||null},setItem(k,v){local.set(k,v)}},confirm(){return true},console};
const vm=createContext(sandbox);
const components=['data.js','brutal.js','devocionario.js','feed-data.js','app.js','feed-ui.js',
'ambient-audio.js','cuiudo-music.js','rosary-i18n.js','rosary-artwork.js','rosary-context.js','rosary-plus.js','daily-goals.js'];
runInContext(components.map(read).join('\n'),vm,{timeout:7000});
runInContext("state.tab='palavra';state.appLang='pt';state.verseLang='pt';render()",vm);
assert.match(mount.innerHTML,/Português · Figueiredo/);
const action=(type,attrs)=>{
 const target={dataset:{action:type,...attrs},closest(selector){
  if(selector==='[data-action]')return this;
  return null;
 }};
 for(const listener of appListeners.click)listener({target,preventDefault(){}});
};
action('verse-lang',{lang:'en'});
assert.equal(runInContext('state.appLang',vm),'en');
assert.equal(runInContext('state.verseLang',vm),'en');
assert.match(mount.innerHTML,/English · Douay-Rheims/);
assert.match(mount.innerHTML,/lang="en"/);
assert.match(mount.innerHTML,/Douay-Rheims/);
assert.ok(local.get('cuiudo-v1')?.includes('"verseLang":"en"'));
action('verse-lang',{lang:'pt'});
assert.equal(runInContext('state.verseLang',vm),'pt');
assert.equal(runInContext('state.appLang',vm),'pt');
assert.match(mount.innerHTML,/lang="pt-BR"/);
console.log('✓ Botões English Douay-Rheims e Português mudam versos e são persistidos');

const context=runInContext('cuiudoMysteryContext',vm),labels=runInContext('cuiudoContextTitles',vm);
assert.equal(Object.keys(context).length,20);
for(const locale of ['pt','en','es','la']){
 assert.ok(labels[locale]?.history && labels[locale]?.think && labels[locale]?.apply);
 for(const [id,blocks] of Object.entries(context)){
  const row=blocks[locale];
  assert.equal(row.length,3,'Três textos para '+locale+' '+id);
  for(const value of row)assert.ok(value.length>35,'Texto incompleto em '+locale+'/'+id);
 }
 for(const group of ['gozosos','luminosos','dolorosos','gloriosos']){
  for(let i=0;i<5;i++){
   runInContext("state.tab='terco';state.appLang="+JSON.stringify(locale)+";state.group="+JSON.stringify(group)+";state.mystery="+i+";render()",vm);
   assert.match(mount.innerHTML,/rosary-story-history/);
   assert.match(mount.innerHTML,/rosary-story-think/);
   assert.match(mount.innerHTML,/rosary-story-apply/);
   assert.match(mount.innerHTML,/rosary-story-source/);
  }
 }
}
assert.ok(existsSync(new URL('./assets/medalha-sao-bento-ouro.svg',import.meta.url)));
const svg=read('assets/medalha-sao-bento-ouro.svg');
for(const mark of ['PAX','V · R · S · N · S · M · V','CRUX SANCTI PATRIS BENEDICTI'])
 assert.ok(svg.includes(mark),'Inscrição da medalha: '+mark);
console.log('✓ História, contemplação e aplicação em todos os 20 mistérios / 4 idiomas');

const elements=[],byId=new Map();
function element(tag){
 const el={tag,attrs:{},children:[],isConnected:true,addEventListener(){},
  setAttribute(k,v){this.attrs[k]=v;},append(...nodes){this.children.push(...nodes);},
  remove(){this.isConnected=false;},removeAttribute(k){delete this.attrs[k]},load(){},pause(){}};
 elements.push(el);return el;
}
const mockedDoc={body:{append(node){byId.set('cuiudo-youtube-dock',node);}},getElementById(k){return byId.get(k)||null},
 createElement:element};
const playCtx=createContext({document:mockedDoc,window:{AudioContext:null,webkitAudioContext:null},console});
runInContext(read('cuiudo-music.js'),playCtx);
assert.equal(runInContext("cuiudoMusic.tracks.templario.kind",playCtx),'youtube');
assert.equal(runInContext("cuiudoMusic.tracks.templario.source",playCtx),'https://www.youtube.com/watch?v=zodHltkgK1w');
assert.equal(elements.length,0,'Não criar player automaticamente');
await runInContext("cuiudoMusic.select('templario')",playCtx);
assert.equal(elements.length,0,'Selecionar faixa não deve tocar sozinho');
const started=await runInContext("cuiudoMusic.play()",playCtx);
assert.equal(started,true,'Iniciar o vídeo só após clique');
const iframe=elements.find(x=>x.tag==='iframe');
assert.ok(iframe);
assert.match(iframe.src,/youtube-nocookie\.com\/embed\/zodHltkgK1w\?autoplay=1/);
assert.equal(iframe.width,'360');assert.equal(iframe.height,'224');
assert.equal(runInContext('cuiudoMusic.isPlaying()',playCtx),true);
runInContext('cuiudoMusic.stop()',playCtx);
assert.equal(runInContext('cuiudoMusic.isPlaying()',playCtx),false);
console.log('✓ Cântico exato de YouTube por player oficial visível, sem autoplay inicial');
console.log('✓ CUIÚDO v14 validado');
