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
console.log('✓ Prioridades mantidas no D1; alarme pré-agendado e cancelado ao pausar');
