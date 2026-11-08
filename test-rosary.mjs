import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {runInContext,createContext} from 'node:vm';
const read=p=>readFileSync(new URL('./'+p,import.meta.url),'utf8');
const components=['data.js','brutal.js','devocionario.js','feed-data.js','app.js','feed-ui.js','ambient-audio.js','rosary-i18n.js','rosary-plus.js'];
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
assert.match(mount.innerHTML,/medalha-sao-bento\.svg/);
assert.match(mount.innerHTML,/cuiudo-language/);
for(const lang of ['pt','en','es','la']){
 runInContext('state.appLang='+JSON.stringify(lang)+';state.tab="terco";state.rosaryLength="small";render()',vm,{timeout:2500});
 assert.match(mount.innerHTML,/rosary-music-control/,'controle de música visível em '+lang);
 assert.match(mount.innerHTML,/meditation-size-buttons/,'três tamanhos em '+lang);
 assert.match(mount.innerHTML,/rosary-painting/,'foto por mistério em '+lang);
 assert.match(mount.innerHTML,/assets\/medalha-sao-bento\.svg/);
 assert.match(mount.innerHTML,/data-action="add-bead"/);
 assert.match(mount.innerHTML,/rosary-intention-form/);
 assert.equal((mount.innerHTML.match(/data-action="combat-meditation-length"/g)||[]).length,3);
 assert.match(mount.innerHTML,/data-action="combat-rosary-music"/);
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
const html=read('index.html');
for(const file of ['ambient-audio.js','rosary-i18n.js','rosary-plus.js','rosary-plus.css'])
 assert.ok(html.includes(file),'HTML não inclui '+file);
console.log('✓ CUIÚDO 12: medalha, áudio opcional, 4 idiomas, 20 mistérios e 3 tamanhos');
