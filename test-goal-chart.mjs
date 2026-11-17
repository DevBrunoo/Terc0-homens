import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {createContext,runInContext} from 'node:vm';
const read=p=>readFileSync(new URL('./'+p,import.meta.url),'utf8');
const run=spawnSync(process.execPath,['--check',new URL('./daily-goals.js',import.meta.url).pathname]);
assert.equal(run.status,0,'daily-goals.js: '+run.stderr);
const source=read('daily-goals.js');
const from=source.indexOf("const cuiudoPerformanceSince=");
const to=source.indexOf('function cuiudoGoalChecklist(){',from);
assert.ok(from>=0&&to>from,'Bloco do gráfico encontrado');
let now=Date.parse('2026-11-14T15:00:00Z');
class TestDate extends Date {
 static now(){return now;}
}
const vm=createContext({
 Date:TestDate,
 state:{dailyGoalDays:{
  '2026-11-13':[
   {id:'a',text:'Concluída',status:'done',priority:'high'},
   {id:'b',text:'Alta pendente',status:'pending',priority:'high'},
   {id:'c',text:'Antiga sem prioridade',status:'pending'},
   {id:'d',text:'Não concluída',status:'missed',priority:'low'},
   {id:'e',text:'Excluída',status:'deleted',priority:'high'}
  ],
  '2026-11-14':[{id:'f',text:'Baixa pendente',status:'pending',priority:'low'}],
  '2026-10-20':[{id:'old',text:'Histórico preservado',status:'done'}]
 }},
 escapeHtml:s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;')
});
const goalStatus=source.slice(source.indexOf('function cuiudoGoalStatus('),source.indexOf('// Pendentes primeiro.'));
const goalDay=source.slice(source.indexOf('const cuiudoGoalDayFormat='),source.indexOf('/* Horário real'));
runInContext(goalDay+goalStatus+source.slice(from,to),vm);
const rows=JSON.parse(JSON.stringify(runInContext('cuiudoChartRows(7,"2026-11-14")',vm)));
assert.equal(rows.length,7);
const yesterday=rows.find(r=>r.day==='2026-11-13');
assert.deepEqual(yesterday,{day:'2026-11-13',done:1,pending:0,missed:3,high:0,medium:0,low:0});
assert.equal(rows.reduce((s,r)=>s+r.done+r.pending+r.missed,0),5,'Não contar metas excluídas');
const bars=JSON.parse(JSON.stringify(runInContext("cuiudoChartBars(cuiudoChartRows(7,'2026-11-14'),'status')",vm)));
assert.equal(bars.length,7);
assert.equal(bars.find(x=>x.key==='2026-11-13').percent,25);
assert.equal(bars.find(x=>x.key==='2026-11-14').percent,0);
assert.equal(bars.find(x=>x.key==='2026-11-12').percent,null,'Dia sem metas não é 0%');
const pBars=JSON.parse(JSON.stringify(runInContext("cuiudoChartBars(cuiudoChartRows(30,'2026-11-14'),'priority')",vm)));
assert.deepEqual(pBars.map(x=>x.percent),[50,50,0],'Taxa por prioridade inclui concluídas e não concluídas');
const historical=JSON.parse(JSON.stringify(runInContext('cuiudoChartRows(30,"2026-11-14")',vm)));
assert.equal(historical.find(x=>x.day==='2026-10-20').done,1,'30 dias inclui metas antigas');

const since=Date.parse('2026-11-17T14:21:26Z');
now=Date.parse('2026-11-18T15:00:00Z');
const goals=vm.state.dailyGoalDays;
goals['2026-11-17']=[
 {id:'old-completion',status:'done',completed_at:since-1,priority:'high'},
 {id:'old-miss',status:'missed',missed_at:since-1,priority:'low'},
 {id:'legacy',status:'done',priority:'medium'},
 {id:'pending',status:'pending',priority:'low'}
];
const renderChart=()=>runInContext("cuiudoGoalsBarChart('pt')",vm);
function emptyInEveryMode(){
 for(const mode of ['status','priority']){
  for(const range of [7,14,30]){
   runInContext(`cuiudoChartMode='${mode}';cuiudoChartRange=${range}`,vm);
   const html=renderChart();
   assert.match(html,/0 de 0 metas concluídas/);
   assert.doesNotMatch(html,/cuiudo-chart-barplot/);
  }
 }
}
emptyInEveryMode();
assert.equal(goals['2026-11-17'].length,4,'O reinício mantém as metas registradas');
const initial=renderChart();
assert.match(initial,/Seu desempenho/);
assert.match(initial,/Contagem desde 17\/11\/2026, 11:21/);
assert.match(initial,/Nenhum resultado registrado neste período/);
assert.match(runInContext("cuiudoGoalsBarChart('en')",vm),/No results recorded in this period/);

goals['2026-11-17'].push(
 {id:'completed-high',status:'done',completed_at:since,priority:'high'},
 {id:'missed-high',status:'missed',missed_at:since+1000,priority:'high'},
 {id:'completed-medium',status:'done',completed_at:since+2000,priority:'medium'}
);
goals['2026-11-18']=[{id:'missed-low',status:'missed',missed_at:now,priority:'low'}];
function verifyNewCounts(){
 runInContext("cuiudoChartMode='status';cuiudoChartRange=7",vm);
 const html=renderChart();
 assert.match(html,/2 de 4 metas concluídas/);
 assert.match(html,/17\/11: 2 de 3 metas concluídas/);
 assert.match(html,/18\/11: 0 de 1 metas concluídas/);
 assert.match(html,/cuiudo-chart-barplot/);
 assert.match(html,/cuiudo-chart-bar-fill/);
 assert.match(html,/cuiudo-chart-bar-nodata/);
 assert.match(html,/<details class="cuiudo-chart-footnote"><summary>Como calculamos<\/summary>/);
 assert.match(html,/data-mode="priority"/);
 assert.match(html,/id="cuiudo-chart-range"/);
 runInContext("cuiudoChartMode='priority';cuiudoChartRange=30",vm);
 const priority=renderChart();
 assert.match(priority,/2 de 4 metas concluídas/);
 assert.match(priority,/Alta: 1 de 2 metas concluídas/);
 assert.match(priority,/Média: 1 de 1 metas concluídas/);
 assert.match(priority,/Baixa: 0 de 1 metas concluídas/);
 assert.match(priority,/<option value="30" selected>/);
}
verifyNewCounts();

// O carregamento do histórico usa o mesmo horário de corte, em ambos os modos.
const events=[
 {event_id:1,goal_id:'old-completion',occurred_at:since-1,event_type:'completed',priority:'high'},
 {event_id:2,goal_id:'old-miss',occurred_at:since-1,event_type:'missed',priority:'low'}
];
Object.assign(vm,{
 window:{fetch(){},addEventListener(){},setInterval(){}},
 location:{protocol:'https:'},document:{hidden:false},navigator:{onLine:true},
 fetch:async()=>({ok:true,json:async()=>({events,hasMore:false})})
});
runInContext(read('goal-history.js'),vm);
await new Promise(resolve=>setImmediate(resolve));
assert.equal(vm.window.cuiudoGoalHistory.loaded,true);
emptyInEveryMode();
events.push(
 {event_id:3,goal_id:'completed-high',occurred_at:since,event_type:'completed',priority:'high'},
 {event_id:4,goal_id:'missed-high',occurred_at:since+1000,event_type:'missed',priority:'high'},
 {event_id:5,goal_id:'completed-medium',occurred_at:since+2000,event_type:'completed',priority:'medium'},
 {event_id:6,goal_id:'missed-low',occurred_at:now,event_type:'missed',priority:'low'},
 {event_id:7,goal_id:'new-pending',occurred_at:since+3000,event_type:'created',priority:'low'}
);
await vm.window.cuiudoGoalHistory.refresh();
verifyNewCounts();
assert.match(read('cuiudo-v16.css'),/\.cuiudo-chart-bar-stage\s*\{\s*height:76px/);
assert.match(read('cuiudo-v16.css'),/\.cuiudo-chart-bar-stage\s*\{\s*height:58px/);
for(const locale of ['pt','en','es','la'])assert.match(
 runInContext('cuiudoGoalsBarChart('+JSON.stringify(locale)+')',vm),/cuiudo-goals-chart/
);
assert.match(read('sw.js'),/const VERSION='terco-[a-z0-9-]+-v\d+'/);
assert.match(read('cuiudo-v16.css'),/\.cuiudo-chart-bar-fill/);
assert.match(read('cuiudo-v16.css'),/prefers-reduced-motion/);
console.log('✓ Desempenho: reinício nos dois modos e retomada com resultados novos, online e offline');
