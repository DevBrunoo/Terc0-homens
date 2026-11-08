import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { runInNewContext, runInContext, createContext } from 'node:vm';
import { spawnSync } from 'node:child_process';
const read=n=>readFileSync(new URL('./'+n,import.meta.url),'utf8');
const data=read('data.js'), brutal=read('brutal.js'), app=read('app.js'), html=read('index.html');
const devotion=read('devocionario.js');
const context={};
const groups=runInNewContext(data+'\n;groups',context);
assert.equal(Object.keys(groups).length,4);
assert.equal(Object.values(groups).reduce((n,g)=>n+g.mysteries.length,0),20);
const hard=runInNewContext(data+'\n'+brutal+'\n;({marteladas,confrontosBrutais})');
assert.equal(Object.keys(hard.marteladas).length,20);
assert.equal(hard.confrontosBrutais.length,18);
for(const g of Object.values(groups)) for(const m of g.mysteries) assert.ok(existsSync(new URL('./assets/misterios/'+m.id+'.svg',import.meta.url)),m.id);
for(const f of ['data.js','brutal.js','devocionario.js','app.js','sw.js','server.mjs']){
 const p=spawnSync(process.execPath,['--check',new URL('./'+f,import.meta.url).pathname]);
 assert.equal(p.status,0,f+': '+p.stderr.toString());
}
assert.match(html,/styles\.css/);
assert.match(html,/app\.js/);
assert.match(app,/mission-done/);
const devotional=runInNewContext(devotion+'\n;({versiculosPorMisterio,oracoesDevocionario,ladainhaBreve})');
assert.equal(Object.keys(devotional.versiculosPorMisterio).length,20);
for(const v of Object.values(devotional.versiculosPorMisterio)){assert.ok(v.pt&&v.en&&v.ptSource&&v.enSource,'Citação real nos dois idiomas');}
assert.match(app,/set-theme/);
assert.match(app,/appearance-control/);
assert.match(app,/theme:'light'/);
assert.match(app,/designVersion:'apple-v11'/);
assert.match(app,/site-header/);
assert.match(app,/home-hero/);
assert.match(app,/hero-photo-card/);
assert.match(app,/action-banner/);
assert.match(app,/fist-palm/);
assert.match(app,/photo-story-grid/);
assert.match(app,/mobileMore/);
assert.match(app,/close-more/);
assert.match(app,/mobile-nav/);
assert.match(app,/resolvedTheme/);
assert.match(app,/verse-lang/);
assert.match(app,/dataset\.theme/);
const css=read('styles.css');
assert.match(css,/data-theme="light"/);
assert.match(css,/data-theme="dark"/);
assert.match(css,/\.home-hero/);
assert.match(css,/@keyframes fistHit/);
assert.match(css,/\.photo-story-grid/);
assert.match(css,/Arial,Helvetica,sans-serif/);
assert.match(css,/--bg:#fff/);
assert.doesNotMatch(css,/Cormorant|DM Sans|Marcellus/);
assert.match(css,/\.mobile-nav/);
assert.match(css,/\.appearance-control/);
assert.match(html,/designVersion==='apple-v11'/);
assert.match(app,/Douay-Rheims/);
assert.doesNotMatch(app,/Trecho bíblico em tradução livre/);
assert.ok(devotional.oracoesDevocionario.length>=18);
assert.ok(devotional.ladainhaBreve.length>=15);
assert.match(app,/devocionario:devocionario/);
assert.match(app,/angel:/);
assert.doesNotMatch(app,/MISSÃO DE HOJE:/);
assert.match(html,/devocionario\.js/);

// Smoke test real de renderização sem navegador: todas as telas e alternância de aparência.
const mount={innerHTML:'',addEventListener(){}};
const meta={content:'',setAttribute(name,value){this[name]=value}};
const doc={documentElement:{dataset:{},style:{}},getElementById(){return mount},querySelector(){return meta}};
const storage=new Map();
const sandbox={
 document:doc,
 window:{scrollTo(){},matchMedia(){return {matches:false,addEventListener(){}}}},
 navigator:{},location:{protocol:'file:'},
 localStorage:{getItem(k){return storage.get(k)||null},setItem(k,v){storage.set(k,v)}},
 confirm(){return true},console
};
const viewCtx=createContext(sandbox);
runInContext(data+'\n'+brutal+'\n'+devotion+'\n'+app,viewCtx,{timeout:3000});
assert.match(mount.innerHTML,/home-hero/);
assert.match(mount.innerHTML,/Reza\. Levanta/);
for(const [tab,needle] of [
 ['inicio','home-hero'],['terco','O Santo Terço'],['devocionario','Santos'],
 ['verdade','Confronto'],['desafios','compromissos'],['exame','consciência'],['diario','Diário']
]){
 runInContext("state.tab='"+tab+"';render();",viewCtx,{timeout:3000});
 assert.ok(mount.innerHTML.includes(needle),'Falha ao renderizar a tela '+tab);
}
runInContext("state.theme='dark';render()",viewCtx);
assert.equal(doc.documentElement.dataset.theme,'dark');
runInContext("state.theme='light';render()",viewCtx);
assert.equal(doc.documentElement.dataset.theme,'light');
runInContext("state.tab='terco';state.verseLang='en';render()",viewCtx);
assert.match(mount.innerHTML,/Douay-Rheims/);
runInContext("state.tab='inicio';state.mobileMore=true;render()",viewCtx);
assert.match(mount.innerHTML,/more-panel/);
console.log('✓ Smoke test: 7 telas, tema claro/escuro, PT/EN e menu adicional');

console.log('✓ 20 mistérios, 20 meditações SEM DESCULPAS, 18 confrontos, artes e sintaxe JS');


// Validação da camada CUIÚDO v9 / feed, navegação, São Miguel, Bíblia e preferências.
const feedData=read('feed-data.js'), feedUi=read('feed-ui.js'), feedStyles=read('feed.css');
assert.match(html,/feed-data\.js/);
assert.match(html,/feed-ui\.js/);
assert.match(html,/feed\.css/);
assert.match(html,/apple\.css/);
assert.match(read('apple.css'),/\.cuiudo-hero/);
assert.match(read('apple.css'),/\.poster-grid/);
assert.match(read('sw.js'),/cuiudo-rosary-v12/);
assert.match(read('sw.js'),/\.webp/);
assert.match(feedStyles,/\.poster-grid/);
assert.match(feedStyles,/@keyframes cuiudoPunch/);
const feedInfo=runInNewContext(feedData+'\n;({feedPosts,feedArtwork,feedFilters})');
assert.equal(feedInfo.feedPosts.length,16);
assert.ok(Object.keys(feedInfo.feedArtwork).length>=14);
assert.ok(existsSync(new URL('./assets/feed/fallback.svg',import.meta.url)));
for(const [id,asset] of Object.entries(feedInfo.feedArtwork)){
  assert.match(asset.url,/^\.\/assets\/feed\/[a-z0-9-]+\.webp$/,'Imagem deve estar no repositório: '+id);
  const file=new URL(asset.url.replace(/^\.\//,''),import.meta.url);
  assert.ok(existsSync(file),'Arquivo não encontrado: '+asset.url);
  const content=readFileSync(file);
  assert.ok(content.length>8000,'WebP pequeno: '+id);
  assert.equal(content.subarray(0,4).toString('ascii'),'RIFF','Cabeçalho WebP: '+id);
  assert.equal(content.subarray(8,12).toString('ascii'),'WEBP','Assinatura WebP: '+id);
}
console.log('✓ 14/14 imagens WebP armazenadas no repositório e verificadas');
assert.ok(feedInfo.feedFilters.some(([id])=>id==='miguel'));
for(const file of ['feed-ui.js','feed-data.js']){
 const out=spawnSync(process.execPath,['--check',new URL('./'+file,import.meta.url).pathname]);
 assert.equal(out.status,0,file+': '+out.stderr.toString());
}
const feedMount={innerHTML:'',addEventListener(){},querySelectorAll(){return []},querySelector(){return null}};
const feedMeta={content:'',setAttribute(n,v){this[n]=v}};
const feedDoc={documentElement:{dataset:{},style:{}},getElementById(){return feedMount},querySelector(){return feedMeta}};
const storeMap=new Map();
const feedSandbox={
 document:feedDoc,
 window:{scrollTo(){},matchMedia(){return {matches:false,addEventListener(){}}},location:{hash:''}},
 navigator:{},location:{protocol:'file:'},
 localStorage:{getItem(k){return storeMap.get(k)||null},setItem(k,v){storeMap.set(k,v)}},
 confirm(){return true},console
};
const feedCtx=createContext(feedSandbox);
runInContext(data+'\n'+brutal+'\n'+devotion+'\n'+feedData+'\n'+app+'\n'+feedUi,feedCtx,{timeout:3000});
assert.match(feedMount.innerHTML,/cuiudo-hero/);
assert.match(feedMount.innerHTML,/TEM QUE SER/);
assert.match(feedMount.innerHTML,/poster-grid/);
assert.equal((feedMount.innerHTML.match(/data-feed-id=/g)||[]).length,16);
assert.equal(feedDoc.documentElement.dataset.theme,'light');
for(const [tab,expected] of [['terco','O Santo Terço'],['devocionario','SÃO MIGUEL'],['palavra','PALAVRA DE DEUS'],['diario','Diário'],['desafios','compromissos'],['exame','consciência']]){
 runInContext("state.tab='"+tab+"';render()",feedCtx);
 assert.ok(feedMount.innerHTML.includes(expected),'Falhou navegação: '+tab);
}
runInContext("state.tab='inicio';state.feedOpen='m01';render()",feedCtx);
assert.match(feedMount.innerHTML,/feed-modal/);
runInContext("state.feedOpen=null;state.feedSaved={m01:true};state.feedFilter='salvos';render()",feedCtx);
assert.equal((feedMount.innerHTML.match(/data-feed-id=/g)||[]).length,1);
runInContext("state.feedFilter='todos';state.theme='light';render()",feedCtx);
assert.equal(feedDoc.documentElement.dataset.theme,'light');
runInContext("state.tab='palavra';state.verseLang='en';render()",feedCtx);
assert.match(feedMount.innerHTML,/Douay-Rheims/);
console.log('✓ CUIÚDO V9: 16 posts, 14 fontes de imagem, feed, salvos, modal, temas e 8 telas');
