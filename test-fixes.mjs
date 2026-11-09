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
   assert.match(mount.innerHTML,/rosary-history-card/);
   const visual=mount.innerHTML.split('class="mystery-visual rosary-photo-wrap"')[1].split('<div class="mystery-detail">')[0];
   assert.ok(visual.indexOf('class="rosary-painting"')<visual.indexOf('class="rosary-history-card"'),'História abaixo da imagem');
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


const sounds=[],events=[];
const fakeAudio={
 attrs:{},volume:0,loop:false,preload:'',
 addEventListener(type,fn){events.push('listen-'+type);},
 getAttribute(name){return this.attrs[name]||null;},
 set src(value){this.attrs.src=value;},
 load(){events.push('load');},
 pause(){events.push('pause');},
 async play(){events.push('play');}
};
const mockedDoc={createElement(type){sounds.push(type);if(type!=='audio')throw Error('Não criar iframe YouTube');return fakeAudio}};
const playCtx=createContext({document:mockedDoc,window:{},console});
runInContext('const cuiudoAmbient={isPlaying:()=>false,stop(){},setVolume(){}};',playCtx);
runInContext(read('cuiudo-music.js'),playCtx);
assert.equal(runInContext("cuiudoMusic.tracks.templario.kind",playCtx),'file');
assert.equal(runInContext("cuiudoMusic.tracks.templario.src",playCtx),'./assets/audio/cantico-medieval.mp3');
assert.equal(runInContext("Object.keys(cuiudoMusic.tracks).length",playCtx),15);
assert.equal(sounds.length,0,'Música não deve iniciar automaticamente');
await runInContext("cuiudoMusic.select('templario')",playCtx);
assert.equal(sounds.length,0,'Selecionar não toca');
const started=await runInContext("cuiudoMusic.play()",playCtx);
assert.equal(started,true,'Tocar arquivo MP3 local');
assert.equal(fakeAudio.attrs.src,'./assets/audio/cantico-medieval.mp3');
assert.deepEqual(sounds,['audio'],'A música templária não deve abrir YouTube/iframe');
assert.equal(runInContext('cuiudoMusic.isPlaying()',playCtx),true);
runInContext('cuiudoMusic.stop()',playCtx);
assert.equal(runInContext('cuiudoMusic.isPlaying()',playCtx),false);
console.log('✓ Música templária reproduz MP3 no aplicativo, sem YouTube, sem autoplay');
console.log('✓ CUIÚDO v16 validado');
