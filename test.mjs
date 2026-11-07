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
assert.match(app,/designVersion:'white-arial-v1'/);
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
assert.match(html,/designVersion==='white-arial-v1'/);
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
