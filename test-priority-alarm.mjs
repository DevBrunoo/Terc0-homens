import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createContext,runInContext} from 'node:vm';
import {spawnSync} from 'node:child_process';
const read=p=>readFileSync(new URL('./'+p,import.meta.url),'utf8');
for(const p of ['daily-goals.js','global-goals.js','functions/api/goals.js','sw.js']){
 const run=spawnSync(process.execPath,['--check',new URL('./'+p,import.meta.url).pathname]);
 assert.equal(run.status,0,p+': '+run.stderr);
}
const source=read('daily-goals.js');
const slice=source.slice(source.indexOf('const cuiudoPriorityLabels='),source.indexOf('function cuiudoGoalChecklist()'));
assert.ok(slice.includes('function cuiudoTimerArmAudio'));
const started=[],stopped=[],beeps=[];
class TestAudioContext {
 constructor(){this.state='running';this.currentTime=100;this.destination={};}
 createOscillator(){
  const o={frequency:{setValueAtTime(){}},connect(){},start(t){started.push(t)},stop(t){stopped.push(t)}};
  return o;
 }
 createGain(){return {gain:{setValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){}};}
 resume(){this.state='running';return Promise.resolve();}
}
const ctx={window:{AudioContext:TestAudioContext},state:{dailyGoalDays:{}},
 cuiudoLocale:()=>'pt',Notification:undefined,document:{hidden:false},navigator:{}};
const sandbox=createContext(ctx);
runInContext(slice,sandbox);
const now=Date.now();
const goal={id:'test-timer',text:'Estudar',status:'pending',duration_sec:60,
 remaining_sec:60,timer_started_at:now,timer_state:'running'};
ctx.state.dailyGoalDays={'2026-11-14':[goal]};
ctx.cuiudoTimerArmAudio(goal);
const job=runInContext('cuiudoTimerAudioJobs.get("test-timer")',sandbox);
assert.ok(job,'Alarme armado após o clique');
assert.equal(job.nodes.length,28,'14 avisos em duas frequências');
assert.ok(started[0]>=100+58&&started[0]<=100+62,'Áudio pré-agendado para o fim do tempo');
ctx.cuiudoTimerStop(goal);
assert.equal(goal.timer_state,'paused');
assert.equal(runInContext('cuiudoTimerAudioJobs.size',sandbox),0,'Pausar cancela o alarme');
assert.ok(stopped.length>=28,'Nós agendados cancelados');
const html=read('daily-goals.js');
assert.match(html,/data-goal-priority/);
assert.match(html,/data-priority=/);
assert.match(html,/cuiudo-goal-timer-test/);
assert.match(html,/cuiudo-goal-timer-notifications/);
assert.match(html,/cuiudoTimerNotify\(goal\)/);
assert.match(read('sw.js'),/notificationclick/);
assert.match(read('global-goals.js'),/priority:\['high','medium','low'\]/);
assert.match(read('functions/api/goals.js'),/priorities\.has\(priority\)/);
assert.match(read('migrations/0005_goal_priority.sql'),/DEFAULT 'medium'/);
// Não permitir cadastrar meta sem importância, nem assumir 'Média' automaticamente.
assert.match(source,/id="cuiudo-goal-priority"/);
assert.match(source,/name="priority" required aria-required="true"/);
assert.match(source,/option value="" selected disabled/);
assert.match(source,/goal-create-priority/);
assert.match(read('cuiudo-v16.css'),/grid-template-areas:"goal priority add"/);
const submitStart=source.indexOf("app.addEventListener('submit',event=>{\n if(event.target?.id!=='cuiudo-goal-form')return;");
const submitEnd=source.indexOf("app.addEventListener('click',event=>{",submitStart);
assert.ok(submitStart>=0&&submitEnd>submitStart,'Localizar envio de novas metas');
const events=[],changes=[];
let saveCount=0,renderCount=0,validationCount=0;
const subCtx=createContext({
 app:{addEventListener(type,fn){events.push([type,fn])}},
 state:{dailyGoalDays:{}},
 currentDay:()=> '2026-11-14',cuiudoGoalsSave(){saveCount++},
 window:{cuiudoGlobalGoals:{change(...args){changes.push(args)}}},
 render(){renderCount++},Math,Date
});
runInContext(source.slice(submitStart,submitEnd),subCtx,{timeout:1500});
const submit=events.find(([type])=>type==='submit')?.[1];
assert.ok(submit,'Evento de cadastro registrado');
function send(priority,text='Estudar'){
 let prevented=false;
 const form={id:'cuiudo-goal-form',querySelector(q){
  if(q==='input[name=goal]')return {value:text};
  if(q==='select[name=priority]')return {value:priority,reportValidity(){validationCount++;return false;}};
  return null;
 }};
 submit({target:form,preventDefault(){prevented=true}});
 assert.ok(prevented,'Evitar envio HTML não controlado');
}
send('');
send('invalid');
assert.equal(Object.keys(subCtx.state.dailyGoalDays).length,0,'Sem nível explícito, não registra meta');
assert.equal(saveCount,0,'Sem nível explícito, não grava no navegador');
assert.equal(changes.length,0,'Sem nível explícito, não publica no D1');
assert.equal(validationCount,2,'Pede ao navegador seleção válida');
for(const level of ['high','medium','low'])send(level,'Meta '+level);
assert.equal(subCtx.state.dailyGoalDays['2026-11-14'].length,3);
assert.deepEqual(subCtx.state.dailyGoalDays['2026-11-14'].map(g=>g.priority),['low','medium','high'],'Respeitar seleção de cada meta');
assert.equal(saveCount,3);
assert.equal(renderCount,3);
assert.equal(changes.length,3);
console.log('✓ Prioridades mantidas no D1; alarme pré-agendado e cancelado ao pausar');
