import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {createContext,runInContext} from 'node:vm';
import {spawnSync} from 'node:child_process';
const read=p=>readFileSync(new URL('./'+p,import.meta.url),'utf8');
const files=['data.js','brutal.js','devocionario.js','feed-data.js','app.js','feed-ui.js','ambient-audio.js',
 'cuiudo-music.js','rosary-i18n.js','rosary-artwork.js','rosary-context.js','rosary-plus.js','rosary-beads.js',
 'saints-i18n.js','daily-goals.js','conscience-duty.js'];
for(const f of files){
 const r=spawnSync(process.execPath,['--check',new URL('./'+f,import.meta.url).pathname]);
 assert.equal(r.status,0,f+': '+r.stderr.toString());
}
const callbacks={click:[],change:[],submit:[],input:[]};
const mount={innerHTML:'',addEventListener(type,fn){(callbacks[type]??=[]).push(fn)},querySelector(){return null},querySelectorAll(){return []}};
const root={dataset:{},style:{},lang:'pt'};
const doc={documentElement:root,getElementById(){return mount},querySelector(){return {content:'',setAttribute(){}}},addEventListener(){}};
const memory=new Map();
const vm=createContext({document:doc,console,navigator:{},location:{protocol:'file:'},
 window:{location:{hash:''},scrollTo(){},matchMedia(){return {matches:false,addEventListener(){}}}},
 localStorage:{getItem(k){return memory.get(k)||null},setItem(k,v){memory.set(k,v)}},
 confirm(){return true}});
runInContext(files.map(read).join('\n'),vm,{timeout:9500});

assert.match(mount.innerHTML,/medalha-sao-bento-hd\.svg/);
assert.match(mount.innerHTML,/benedict-medal-single/);
assert.match(mount.innerHTML,/Saint_Benedict_Medal_icon\.svg/);
assert.doesNotMatch(mount.innerHTML,/St_Benedict_Medal_icon\.svg/);
assert.match(mount.innerHTML,/Você é muito macio!/);
assert.match(mount.innerHTML,/cuiudo-grace-reflection/);
assert.match(mount.innerHTML,/COMUNHÃO • GRAÇA • SANTIDADE/);
assert.match(mount.innerHTML,/Sentir essas dores não significa que Deus esteja ausente/);
assert.match(mount.innerHTML,/cuiudo-photo-gallery/);
assert.equal((mount.innerHTML.match(/class="cuiudo-gallery-card"/g)||[]).length,10);
assert.match(mount.innerHTML,/class="nav-more" data-action="toggle-more"/);
assert.match(mount.innerHTML,/aria-haspopup="true"/);
assert.ok(read('cuiudo-v16.css').includes('scroll-snap-type:x mandatory'));
assert.ok(read('cuiudo-v16.css').includes('@media(max-width:350px)'));
assert.match(mount.innerHTML,/sao-bento-gravura-hd\.webp/);
assert.match(mount.innerHTML,/sao-bento-arte-enviada\.webp/);

function click(action,more={}){
 const target={dataset:{action,...more},closest(){return this}};
 for(const fn of callbacks.click)fn({target,preventDefault(){}});
}
click('toggle-more');
assert.match(mount.innerHTML,/id="cuiudo-more-menu"/);
assert.match(mount.innerHTML,/style="--cuiudo-more-x:/);
assert.match(mount.innerHTML,/aria-expanded="true"/);
click('close-more');
assert.doesNotMatch(mount.innerHTML,/id="cuiudo-more-menu"/);
runInContext("state.tab='terco';state.appLang='pt';state.group='gozosos';state.mystery=0;render()",vm);
assert.match(mount.innerHTML,/rosary-bead-visual/);
assert.match(mount.innerHTML,/cuiudo-tiny-player/);
assert.match(read('index.html'),/global-goals\.js/);
for(const id of ['kyrie','sancte','puer','magnificat','adjutorium']){
 const url=runInContext('cuiudoMusic.tracks['+JSON.stringify(id)+'].source',vm);
 assert.ok(url.startsWith('https://commons.wikimedia.org/wiki/File:'),'Fonte musical '+id);
}
assert.match(mount.innerHTML,/data-action="combat-rosary-next-track"/);
assert.match(mount.innerHTML,/data-action="combat-rosary-prev-track"/);
assert.doesNotMatch(mount.innerHTML,/data-action="combat-rosary-track"/);
assert.equal(runInContext('cuiudoMusic.getTrack()',vm),'catolico');
click('combat-rosary-next-track');
assert.equal(runInContext('cuiudoMusic.getTrack()',vm),'templario');
click('combat-rosary-prev-track');
assert.equal(runInContext('cuiudoMusic.getTrack()',vm),'catolico');
assert.equal((mount.innerHTML.match(/class="rosary-bead-node hail/g)||[]).length,10);
assert.equal((mount.innerHTML.match(/class="rosary-bead-node father/g)||[]).length,1);
assert.equal((mount.innerHTML.match(/class="rosary-bead-node glory/g)||[]).length,1);
assert.match(mount.innerHTML,/1 Pai-Nosso/);
assert.match(mount.innerHTML,/10 Ave-Marias/);
assert.match(mount.innerHTML,/1 Glória/);
assert.equal(runInContext('cuiudoDecadeComplete()',vm),false);
click('rosary-father');
assert.equal(runInContext('cuiudoDecadeFlags().father',vm),true);
for(let n=1;n<=10;n++)click('rosary-hail',{number:String(n)});
assert.equal(runInContext('readProgress()[state.mystery]',vm),10);
assert.equal(runInContext('cuiudoDecadeComplete()',vm),false,'Não completo sem Glória');
click('rosary-glory');
assert.equal(runInContext('cuiudoDecadeFlags().glory',vm),true);
assert.equal(runInContext('cuiudoDecadeComplete()',vm),true);
assert.match(mount.innerHTML,/Decena|Dezena|completa|completo/i);
assert.ok(memory.get('cuiudo-v1')?.includes('decadePrayers'),'Progresso não salvo');
click('rosary-reset-all');
assert.equal(runInContext('readProgress()[state.mystery]',vm),0);
assert.equal(runInContext('cuiudoDecadeFlags().father',vm),false);
assert.equal(runInContext('cuiudoDecadeFlags().glory',vm),false);
console.log('✓ Rosário de contas: 1 Pai-Nosso, 10 Ave-Marias e 1 Glória com persistência e reset');

const ids=runInContext('oracoesDevocionario.map(p=>p.id)',vm);
assert.equal(ids.length,18);
assert.equal(runInContext('Object.keys(cuiudoMusic.tracks).length',vm),15);
assert.equal(runInContext('cuiudoMusic.tracks.templario.kind',vm),'file');
assert.match(runInContext('cuiudoMusic.tracks.veni.src',vm),/Veni.creator.spiritus\.ogg/);
assert.match(runInContext('cuiudoMusic.tracks.alma.src',vm),/Alma_Redemptoris_Mater\.ogg/);
assert.equal(runInContext('cuiudoMusic.tracks.templario.src',vm),'./assets/audio/cantico-medieval.mp3');
assert.equal(runInContext('cuiudoMusic.isPlaying()',vm),false);
assert.doesNotMatch(read('cuiudo-music.js'),/youtube-nocookie\.com\/embed/);
for(const lang of ['pt','en','es','la']){
 runInContext('state.appLang='+JSON.stringify(lang)+";state.tab='devocionario';state.devFilter='todos';render()",vm);
 const translated=runInContext('cuiudoSaintUI['+JSON.stringify(lang)+'].heading',vm);
 assert.ok(mount.innerHTML.includes(String(translated).replaceAll('&','&amp;')), 'Título em '+lang);
 assert.match(mount.innerHTML,/santos-todos-fra-angelico\.webp/);
 assert.match(mount.innerHTML,/santos-coroacao-fra-angelico\.webp/);
 assert.equal((mount.innerHTML.match(/class="card devotion-card"/g)||[]).length,18,'18 orações em '+lang);
 assert.match(mount.innerHTML,/data-tab="devocionario"/);
 assert.ok(!mount.innerHTML.includes('>São Miguel</span>'),'Navbar voltou a Miguel');
 if(lang!=='pt'){
  const t=runInContext('cuiudoSaintPrayer(oracoesDevocionario[0],'+JSON.stringify(lang)+')',vm);
  assert.ok(mount.innerHTML.includes(t.text.slice(0,60)),'Oração São Miguel não traduzida: '+lang);
  assert.ok(!mount.innerHTML.includes('São Miguel Arcanjo, defendei-nos'),'Oração portuguesa residual: '+lang);
 }
}
for(const l of ['en','es','la']){
 const names=runInContext('oracoesDevocionario.map(p=>cuiudoSaintPrayer(p,'+JSON.stringify(l)+').name)',vm);
 assert.equal(names.length,18);
 assert.equal(new Set(names).size,18,'Traduções repetidas '+l);
 for(const id of ids){
  const txt=runInContext('cuiudoSaintPrayer(oracoesDevocionario.find(x=>x.id==='+JSON.stringify(id)+'),'+JSON.stringify(l)+').text',vm);
  assert.ok(txt.length>55,'Oração curta: '+id+'/'+l);
 }
}
console.log('✓ Santos: 18 orações completas em português, inglês, espanhol e latim + imagens HD');
const media=[
 'assets/medalha-sao-bento-hd.svg','assets/santos-todos-fra-angelico.webp',
 'assets/santos-coroacao-fra-angelico.webp','assets/sao-bento-gravura-hd.webp',
 'assets/audio/cantico-pange-lingua.mp3','assets/audio/cantico-tantum-ergo.mp3',
 'assets/audio/cantico-pater-noster.mp3','assets/audio/cantico-rorate-caeli.mp3'
];
for(const path of media){
 const file=new URL('./'+path,import.meta.url);
 assert.ok(existsSync(file),'Arquivo ausente: '+path);
 const bin=readFileSync(file);
 assert.ok(bin.length>100000,'Baixa qualidade/incompleto: '+path);
 if(path.endsWith('.webp'))assert.equal(bin.toString('ascii',8,12),'WEBP');
 if(path.endsWith('.svg'))assert.match(bin.toString('utf8',0,2500),/<svg/);
 if(path.endsWith('.mp3'))assert.ok(bin.toString('ascii',0,3)==='ID3'||bin[0]===255,'MP3 inválido '+path);
}
for(const path of ['cuiudo-v16.css','rosary-beads.js','saints-i18n.js']){
 assert.ok(read('index.html').includes(path),'Index não incluiu '+path);
 assert.ok(read('sw.js').includes(path),'SW não incluiu '+path);
}
console.log('✓ 8 imagens e cânticos locais validados, cache offline e interface ativos');
