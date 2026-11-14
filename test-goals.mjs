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
assert.match(root.innerHTML,/cuiudo-goals-chart/);
assert.match(root.innerHTML,/cuiudo-chart-range/);
assert.match(root.innerHTML,/cuiudo-goal-form/);
assert.match(root.innerHTML,/Onde vejo Deus no meu dia\?/,'Campo espiritual na tela de metas');
assert.ok(root.innerHTML.indexOf('class="today-goals-list"')<root.innerHTML.indexOf('goals-god-moment-box'),
 'Reflexão sobre Deus deve ficar abaixo das metas');
assert.ok(root.innerHTML.indexOf('goals-god-moment-box')<root.innerHTML.indexOf('id="goals-obstacle-title"'),
 'Reflexão sobre Deus deve ficar antes do registro de obstáculos');
assert.ok(root.innerHTML.indexOf('id="goals-obstacle-title"')<root.innerHTML.indexOf('cuiudo-goals-chart'),
 'O que atrapalhou meu dia deve aparecer acima do desempenho');
assert.match(root.innerHTML,/Cristiano Ronaldo/);
assert.match(root.innerHTML,/Fugir da sua cruz é a pior desgraça que você pode fazer\./);
assert.match(root.innerHTML,/goals-alternating-quotes/);
assert.equal((root.innerHTML.match(/class="goals-alternating-quotes"/g)||[]).length,1);
assert.ok(root.innerHTML.indexOf('goals-cross-reminder')<root.innerHTML.indexOf('goals-mindset-quote'));
assert.match(read('cuiudo-v16.css'),/animation:terco-quote-first 14s linear infinite/);
assert.match(read('cuiudo-v16.css'),/animation-name:terco-quote-second/);
assert.match(read('cuiudo-v16.css'),/prefers-reduced-motion:reduce/);
assert.ok(root.innerHTML.indexOf('goals-alternating-quotes')<root.innerHTML.indexOf('goals-essential-footer'));
assert.equal(runInContext('cuiudoCrossReminder.es',vm),'Huir de tu cruz es la peor desgracia que puedes cometer.');

assert.match(root.innerHTML,/Posso não ser, mas na minha cabeça sou o melhor/);
assert.ok(root.innerHTML.indexOf('goals-mindset-quote')<root.innerHTML.indexOf('goals-essential-footer'));

assert.match(root.innerHTML,/data-action="cuiudo-obstacle-delete"/);
assert.match(root.innerHTML,/data-action="cuiudo-god-moment-delete"/);
assert.equal(runInContext("cuiudoGodMomentSave('Encontrei Deus na oração do terço')",vm),true);
assert.equal(runInContext("cuiudoGodMomentRead()",vm),'Encontrei Deus na oração do terço');
runInContext('render()',vm);
assert.match(root.innerHTML,/Encontrei Deus na oração do terço/,'Mantém a anotação ao renderizar');
assert.doesNotMatch(read('app.js'),/state\.notes=state\.notes\.slice\(0,100\)/);
const rollover=runInContext(`(()=>{
 const original=currentDay;
 try{
  currentDay=()=> '2026-11-09';
  state.dailyGoalDays={'2026-11-09':[{id:'1762700000000-old',text:'Meta anterior',status:'pending'}]};
  cuiudoObstacleSave('Anotação da véspera');
  currentDay=()=> '2026-11-10';
  render();
  return {
   goal:cuiudoGoalsToday().some(goal=>goal.text==='Meta anterior'),
   note:cuiudoObstacleRead()==='Anotação da véspera',
   html:app.innerHTML.includes('Meta anterior')&&app.innerHTML.includes('Anotação da véspera')
  };
 }finally{currentDay=original;}
})()`,vm);
assert.deepEqual({...rollover},{goal:true,note:true,html:true});
assert.match(read('daily-goals.js'),/Object\.entries\(state\.dailyGoalDays\|\|{}\)/);
assert.doesNotMatch(read('daily-goals.js'),/keys\.slice\(0,Math\.max\(0,keys\.length-120\)\)/);
assert.match(read('daily-goals.js'),/items\.unshift\(goal\)/,'Novas metas entram no início da fila');
const ordering = runInContext("cuiudoGoalsNewestFirst([{id:'1700000000000-old',text:'Antiga'},{id:'1762800000000-new',text:'Nova'},{id:'1705000000000-mid',text:'Intermediária'}]).map(x=>x.text).join('|')",vm);
assert.equal(ordering,'Nova|Intermediária|Antiga');
const sortedByStatus=runInContext("cuiudoGoalsNewestFirst([{id:'1762800000003-done',text:'Concluída nova',status:'done'},{id:'1762800000002-missed',text:'Não concluída nova',status:'missed'},{id:'1762800000001-pending',text:'Pendente recente',status:'pending'},{id:'1700000000000-pending',text:'Pendente antiga',status:'pending'}]).map(x=>x.text).join('|')",vm);
assert.equal(sortedByStatus,'Pendente recente|Pendente antiga|Concluída nova|Não concluída nova');
const reopenedOrder=runInContext("cuiudoGoalsNewestFirst([{id:'1762800000003-done',text:'Reaberta',status:'pending'},{id:'1700000000000-pending',text:'Pendente antiga',status:'pending'},{id:'1762800000002-missed',text:'Não concluída',status:'missed'}]).map(x=>x.text).join('|')",vm);
assert.equal(reopenedOrder,'Reaberta|Pendente antiga|Não concluída');

// Pendências ordenadas por importância antes da antiguidade.
const byImportance=runInContext(`cuiudoGoalsNewestFirst([
 {id:'1762800000000-low',text:'Baixa recente',status:'pending',priority:'low'},
 {id:'1700000000000-high',text:'Alta antiga',status:'pending',priority:'high'},
 {id:'1762800000001-med',text:'Média recente',status:'pending',priority:'medium'},
 {id:'1750000000000-legacy',text:'Sem prioridade antiga',status:'pending'},
 {id:'1762800000002-high',text:'Alta nova',status:'pending',priority:'high'}
]).map(g=>g.text).join('|')`,vm);
assert.equal(byImportance,'Alta nova|Alta antiga|Média recente|Sem prioridade antiga|Baixa recente',
 'Alta vem primeiro, depois Média (inclui legadas), por fim Baixa; desempate por recência');
const statusBeforeImportance=runInContext(`cuiudoGoalsNewestFirst([
 {id:'1762800000004-done',text:'Alta concluída',status:'done',priority:'high'},
 {id:'1762800000003-missed',text:'Alta não concluída',status:'missed',priority:'high'},
 {id:'1762800000002-pending',text:'Baixa pendente',status:'pending',priority:'low'},
 {id:'1762800000001-other',text:'Média pendente',status:'pending',priority:'medium'}
]).map(g=>g.text).join('|')`,vm);
assert.equal(statusBeforeImportance,'Média pendente|Baixa pendente|Alta concluída|Alta não concluída',
 'Concluídas e não concluídas devem ficar depois de todas as pendentes');
runInContext(`state.dailyGoalDays={[currentDay()]:[
 {id:'1762800000002-low',text:'Estudar assunto leve',status:'pending',priority:'low'},
 {id:'1762800000001-high',text:'Resolver obrigação urgente',status:'pending',priority:'high'},
 {id:'1762800000003-mid',text:'Responder mensagens',status:'pending',priority:'medium'}
]};render()`,vm);
const titles=['Resolver obrigação urgente','Responder mensagens','Estudar assunto leve'];
assert.ok(titles.every((title,i)=>i===0||root.innerHTML.indexOf(titles[i-1])<root.innerHTML.indexOf(title)),
 'A lista renderizada segue Alta → Média → Baixa');
runInContext("state.dailyGoalDays[currentDay()][0].priority='high';render()",vm);
assert.ok(root.innerHTML.indexOf('Estudar assunto leve')<root.innerHTML.indexOf('Responder mensagens'),
 'Mudar importância reorganiza a lista ao renderizar');
assert.match(read('daily-goals.js'),/goal\.priority=priority;cuiudoGoalsSave\(\);window\.cuiudoGlobalGoals\?\.change\('upsert',day,goal\);\s*render\(\)/,
 'Alterar a prioridade de uma meta deve reorganizar imediatamente o checklist');
assert.equal(runInContext("cuiudoGoalsNewestFirst([{id:'antiga-a'},{id:'antiga-b'}]).map(x=>x.id).join('|')",vm),'antiga-a|antiga-b',
 'Metas legadas mantêm a ordem entre si');
runInContext("state.dailyGoalDays={[currentDay()]:[{id:'1700000000000-a',text:'Meta antiga',status:'pending'},{id:'1762800000000-b',text:'Meta recente',status:'pending'}]};render()",vm);
assert.ok(root.innerHTML.indexOf('Meta recente')<root.innerHTML.indexOf('Meta antiga'),'Meta nova aparece acima da antiga');
runInContext("state.dailyGoalDays[currentDay()][1].status='missed';render()",vm);
assert.ok(root.innerHTML.indexOf('Meta antiga')<root.innerHTML.indexOf('Meta recente'),'Marcar não concluída move a meta para baixo');
runInContext("state.dailyGoalDays[currentDay()][1].status='pending';render()",vm);
assert.ok(root.innerHTML.indexOf('Meta recente')<root.innerHTML.indexOf('Meta antiga'),'Reabrir move a meta para o grupo pendente');
runInContext("state.dailyGoalDays[currentDay()][0].status='done';render()",vm);
assert.ok(root.innerHTML.indexOf('Meta recente')<root.innerHTML.indexOf('Meta antiga'),'Concluir uma meta não muda a ordem');

assert.match(root.innerHTML,/O que atrapalhou seu dia\?/);
assert.match(root.innerHTML,/id="cuiudo-obstacle-text"/);
assert.match(root.innerHTML,/Salvo só neste aparelho/);
assert.ok(runInContext('cuiudoObstacleSave("Distrações e cansaço")',vm));
assert.equal(runInContext('cuiudoObstacleRead()',vm),'Distrações e cansaço');
assert.ok(memory.get('terco-obstaculos-diarios-v1').includes('Distrações e cansaço'));
assert.ok(!memory.get('cuiudo-v1')?.includes('Distrações e cansaço'));
runInContext('render()',vm);
assert.match(root.innerHTML,/Distrações e cansaço/);
assert.ok(runInContext('cuiudoObstacleSave("<script>alert(1)</script>")',vm));
runInContext('render()',vm);
assert.ok(!root.innerHTML.includes('<script>alert(1)</script>'));
assert.ok(root.innerHTML.includes('&lt;script&gt;'));
assert.ok(runInContext('cuiudoObstacleSave("")',vm));
assert.equal(runInContext('cuiudoObstacleRead()',vm),'');
assert.match(root.innerHTML,/goals-permanent-note/);
assert.match(root.innerHTML,/id="cuiudo-essential-done"/);
assert.match(root.innerHTML,/Concluído hoje/);
assert.ok(root.innerHTML.indexOf('goals-essential-footer')<root.innerHTML.indexOf('id="cuiudo-goal-form"'),'Compromisso antes do formulário de metas');
assert.ok(root.innerHTML.indexOf('class="today-goals-list"')<root.innerHTML.indexOf('class="goals-obstacle-box"'),'Anotação de obstáculos abaixo da lista');
assert.ok(runInContext('cuiudoEssentialSave(true)',vm));
assert.equal(runInContext('cuiudoEssentialDone()',vm),true);
runInContext('render()',vm);
assert.match(root.innerHTML,/id="cuiudo-essential-done" checked/);
assert.ok(memory.get('terco-compromisso-essencial-v1').includes('true'));
assert.ok(!memory.get('cuiudo-v1')?.includes('terco-compromisso-essencial'));
assert.ok(runInContext('cuiudoEssentialSave(false)',vm));
assert.equal(runInContext('cuiudoEssentialDone()',vm),false);
assert.match(root.innerHTML,/Rezar terço e se cuidar espiritualmente e esteticamente/);
assert.doesNotMatch(root.innerHTML,/data-timer-minutes|data-cuiudo-clock=/,'Painel expansível só aparece ao abrir o timer');
assert.match(read('daily-goals.js'),/function cuiudoTimerSeconds/);
runInContext("state.dailyGoalDays={[currentDay()]:[{id:'pending',text:'Estudar e rezar',status:'pending'},{id:'success',text:'Concluída',status:'done'},{id:'failed',text:'Pendente',status:'missed'}]};render()",vm);
assert.match(root.innerHTML,/Estudar e rezar/);
assert.match(root.innerHTML,/cuiudo-chart-barplot/);
assert.match(root.innerHTML,/cuiudo-chart-bar-fill/);
assert.match(root.innerHTML,/data-action="cuiudo-goal-timer-toggle"/);
assert.match(root.innerHTML,/Missão cumprida/);
assert.match(root.innerHTML,/Você é muito macio/);
assert.match(root.innerHTML,/goal-gift/);
assert.match(root.innerHTML,/goal-victory/);
// O selo mostra o instante real, com data e horário fixos de Brasília.
assert.doesNotMatch(root.innerHTML,/goal-victory-time/,'Sem registro real, não inventar horário');
runInContext("state.dailyGoalDays[currentDay()].find(g=>g.id==='success').completed_at=Date.UTC(2026,10,14,14,59);render()",vm);
assert.match(root.innerHTML,/Concluída em 14\/11\/2026, 11:59 \(Brasília\)/);
assert.match(root.innerHTML,/datetime="2026-11-14T14:59:00.000Z"/);
runInContext("delete state.dailyGoalDays[currentDay()].find(g=>g.id==='success').completed_at;render()",vm);
assert.doesNotMatch(root.innerHTML,/goal-victory-time/);
// Não inventar um instante para metas antigas; exibir o real quando disponível.
assert.doesNotMatch(root.innerHTML,/goal-reality-time/);
runInContext("state.dailyGoalDays[currentDay()].find(g=>g.id==='failed').missed_at=Date.UTC(2026,10,14,19,12);render()",vm);
assert.match(root.innerHTML,/Não concluída em 14\/11\/2026, 16:12 \(Brasília\)/);
assert.match(root.innerHTML,/datetime="2026-11-14T19:12:00.000Z"/);
runInContext("delete state.dailyGoalDays[currentDay()].find(g=>g.id==='failed').missed_at;render()",vm);
assert.doesNotMatch(root.innerHTML,/goal-reality-time/);
assert.match(root.innerHTML,/Inspirado em/);
assert.doesNotMatch(root.innerHTML,/goal-victory-emoji|goal-victory-spark|goal-gift-icon/);
const victoryMessages=read('daily-goals.js').split('const cuiudoBlessings=')[1].split('const cuiudoPermanentNotes=')[0];
assert.doesNotMatch(victoryMessages,/\p{Extended_Pictographic}/u,'Mensagens de conclusão não devem ter emojis');
assert.equal((root.innerHTML.match(/class="goal-gift goal-victory"/g)||[]).length,1,
 'A celebração bíblica deve existir apenas na tarefa concluída');
const completion=runInContext('cuiudoGoalBlessing("success")',vm);
assert.ok(completion.message&&completion.reference);
assert.equal(Object.hasOwn(completion,'emoji'),false);
assert.match(completion.message,/\S/);
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
assert.match(read('cuiudo-v16.css'),/v37 — faixa de ação e quadro de metas com a mesma largura/);
assert.match(read('cuiudo-v16.css'),/\.main > \.today-goals/);
assert.doesNotMatch(read('global-goals.js'),/terco-obstaculos-diarios-v1/);
assert.match(read('cuiudo-v16.css'),/goals-obstacle-box/);
assert.match(read('cuiudo-v16.css'),/goals-essential-footer/);
console.log('✓ Metas v42: conquista firme e sem emojis; compromisso no topo e obstáculos embaixo');

/* Checa o término de temporizadores com o painel fechado; não repetir o aviso. */
const timeup=runInContext(`(()=>{
 const day=currentDay(),g={id:'timer-test',text:'Foco',status:'pending',duration_sec:60,remaining_sec:1,timer_started_at:Date.now()-4000,timer_state:'running'};
 state.dailyGoalDays={[day]:[g]};
 const first=cuiudoTimerTick(),second=cuiudoTimerTick();
 return {first,second,status:g.timer_state,remaining:g.remaining_sec};
})()`,vm);
assert.deepEqual({...timeup},{first:1,second:0,status:'finished',remaining:0});
assert.match(read('daily-goals.js'),/function cuiudoTimerSound/);
assert.match(read('daily-goals.js'),/cuiudoTimerUnlockAudio\(\)/);
