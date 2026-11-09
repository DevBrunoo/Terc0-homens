import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {createContext,runInContext} from 'node:vm';
const read=p=>readFileSync(new URL('./'+p,import.meta.url),'utf8');
const files=['data.js','brutal.js','devocionario.js','feed-data.js','app.js','feed-ui.js','ambient-audio.js','cuiudo-music.js','rosary-i18n.js','rosary-artwork.js','rosary-context.js','rosary-plus.js','daily-goals.js'];
for(const f of files){const p=spawnSync(process.execPath,['--check',new URL('./'+f,import.meta.url).pathname]);assert.equal(p.status,0,f+': '+p.stderr);}
for(const p of ['assets/audio/cantico-catolico.mp3','assets/audio/cantico-medieval.mp3']){
 const b=readFileSync(new URL('./'+p,import.meta.url));
 assert.ok(b.length>200000,p);assert.ok(b.subarray(0,3).toString()==='ID3'||b[0]===255,p);
}
for(const p of ['assets/medalha-sao-bento-real.webp','assets/feed/ajudar-companheiro.webp','assets/feed/vai-pra-cima.webp','assets/feed/foco-estrada.webp']){
 const b=readFileSync(new URL('./'+p,import.meta.url));assert.equal(b.toString('ascii',0,4),'RIFF');assert.equal(b.toString('ascii',8,12),'WEBP');
}
const root={innerHTML:'',addEventListener(){},querySelectorAll(){return []},querySelector(){return null}};
const meta={content:'',setAttribute(){}};
const doc={documentElement:{dataset:{},style:{}},getElementById(){return root},querySelector(){return meta},addEventListener(){}};
const memory=new Map();
const vm=createContext({document:doc,window:{scrollTo(){},location:{hash:''},matchMedia(){return {matches:false,addEventListener(){}}}},navigator:{},location:{protocol:'file:'},localStorage:{getItem(k){return memory.get(k)||null},setItem(k,v){memory.set(k,v)}},confirm(){return true},console});
runInContext(files.map(read).join('\n'),vm,{timeout:6000});
assert.match(root.innerHTML,/benedict-medal-premium/);
assert.match(root.innerHTML,/today-goals/);
assert.match(root.innerHTML,/cuiudo-goal-form/);
assert.match(root.innerHTML,/goals-permanent-note/);
assert.match(root.innerHTML,/Rezar terço e se cuidar espiritualmente e esteticamente/);
assert.doesNotMatch(root.innerHTML,/name="minutes"|cuiudo-timer-|goal-timer|data-timer-clock/);
assert.doesNotMatch(read('daily-goals.js'),/cuiudoTimer|setInterval|input\[name=minutes\]/);
runInContext("state.dailyGoalDays={[currentDay()]:[{id:'pending',text:'Estudar e rezar',status:'pending'},{id:'success',text:'Concluída',status:'done'},{id:'failed',text:'Pendente',status:'missed'}]};render()",vm);
assert.match(root.innerHTML,/Estudar e rezar/);
assert.doesNotMatch(root.innerHTML,/data-timer-minutes|data-timer-clock|goal-timer|cuiudo-timer-/);
assert.match(root.innerHTML,/Seu presente/);
assert.match(root.innerHTML,/Você é muito macio/);
assert.match(root.innerHTML,/goal-gift/);
assert.match(root.innerHTML,/goal-victory/);
assert.match(root.innerHTML,/Inspirado em/);
assert.match(root.innerHTML,/goal-victory-emoji/);
assert.equal((root.innerHTML.match(/class="goal-gift goal-victory"/g)||[]).length,1,
 'A celebração bíblica deve existir apenas na tarefa concluída');
const completion=runInContext('cuiudoGoalBlessing("success")',vm);
assert.ok(completion.emoji&&completion.message&&completion.reference);
assert.equal(completion.message,runInContext('cuiudoGoalBlessing("success").message',vm),
 'A frase deve ser estável entre atualizações de dispositivos');
const pendingCard=root.innerHTML.split('class="today-goal goal-pending"')[1].split('</article>')[0];
assert.doesNotMatch(pendingCard,/goal-victory/);
assert.match(root.innerHTML,/goal-reality/);
assert.match(root.innerHTML,/data-action="cuiudo-goal-done"/);
assert.match(root.innerHTML,/data-action="cuiudo-goal-missed"/);
runInContext("state.dailyGoalDays[currentDay()][0].status='done';cuiudoGoalsSave();render()",vm);
assert.ok(memory.get('cuiudo-v1').includes('Estudar e rezar'));
runInContext("state.dailyGoalDays[currentDay()][0].text='<script>alert(1)</script>';render()",vm);
assert.ok(!root.innerHTML.includes('<script>alert(1)</script>'));
assert.ok(root.innerHTML.includes('&lt;script&gt;'));
// O compromisso permanente existe mesmo em uma lista vazia.
runInContext('state.dailyGoalDays={[currentDay()]:[]};render()',vm);
assert.match(root.innerHTML,/Rezar terço e se cuidar espiritualmente e esteticamente/);
assert.match(root.innerHTML,/goals-permanent-note/);
// Também existe na aba de desafios e em outros idiomas sem depender do banco.
runInContext("state.tab='desafios';render()",vm);
runInContext("state.appLang='es';render()",vm);
assert.match(root.innerHTML,/Rezar el rosario y cuidarse/);
runInContext("state.appLang='pt';render()",vm);
assert.match(root.innerHTML,/today-goals/);
runInContext("state.tab='terco';state.appLang='pt';render()",vm);
assert.match(root.innerHTML,/data-action="combat-rosary-prev-track"/);
 assert.match(root.innerHTML,/data-action="combat-rosary-next-track"/);
for(const id of ['catolico','templario','relaxar','relaxar2']){
 runInContext("state.musicTrack='"+id+"';cuiudoMusic.select('"+id+"');render()",vm);
 assert.match(root.innerHTML,/cuiudo-tiny-player/);
}
assert.equal(runInContext('cuiudoMusic.isPlaying()',vm),false);
for(const f of ['daily-goals.js','cuiudo-music.js','cuiudo-v13.css']){assert.ok(read('index.html').includes(f));assert.ok(read('sw.js').includes(f));}
assert.match(read('cuiudo-v16.css'),/\.goal-victory\.goal-gift/);
assert.match(read('cuiudo-v16.css'),/prefers-reduced-motion/);
assert.match(read('cuiudo-v16.css'),/grid-template-areas:"main" "actions"/);
assert.match(read('cuiudo-v16.css'),/grid-template-areas:"goal add"/);
assert.match(read('cuiudo-v16.css'),/v36 — Metas em LISTA VERTICAL/);
assert.match(read('cuiudo-v16.css'),/grid-template-columns:minmax\(0,1fr\) max-content/);
assert.match(read('cuiudo-v16.css'),/grid-template-areas:"main" "actions"/);
console.log('✓ Metas v36: lista vertical responsiva sem cronômetro, lembrete e celebrações preservados');
