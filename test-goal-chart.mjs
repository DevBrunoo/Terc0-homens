import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {createContext,runInContext} from 'node:vm';
const read=p=>readFileSync(new URL('./'+p,import.meta.url),'utf8');
const run=spawnSync(process.execPath,['--check',new URL('./daily-goals.js',import.meta.url).pathname]);
assert.equal(run.status,0,'daily-goals.js: '+run.stderr);
const file=read('daily-goals.js');
const from=file.indexOf("let cuiudoChartMode='status';");
const to=file.indexOf('function cuiudoGoalChecklist(){',from);
assert.ok(from>=0&&to>from,'Bloco do gráfico encontrado');
const ctx=createContext({
  state:{dailyGoalDays:{
   '2026-11-13':[
    {id:'a',text:'Concluída',status:'done',priority:'high'},
    {id:'b',text:'Prioridade alta',status:'pending',priority:'high'},
    {id:'c',text:'Antiga sem prioridade',status:'pending'},
    {id:'d',text:'Não concluída',status:'missed',priority:'low'},
    {id:'e',text:'Excluída',status:'deleted',priority:'high'}
   ],
   '2026-11-14':[{id:'f',text:'Pendente baixa',status:'pending',priority:'low'}],
   '2026-10-20':[{id:'old',text:'Histórico preservado',status:'done'}]
  }},
  currentDay:()=> '2026-11-14',
  escapeHtml:s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;')
});
runInContext(file.slice(from,to),ctx);
const rows=JSON.parse(JSON.stringify(runInContext('cuiudoChartRows(7,"2026-11-14")',ctx)));
assert.equal(rows.length,7);
const yesterday=rows.find(r=>r.day==='2026-11-13');
const today=rows.find(r=>r.day==='2026-11-14');
assert.deepEqual(yesterday,{day:'2026-11-13',done:1,pending:2,missed:1,high:1,medium:1,low:0},
 'Agrupar por criação: somente metas atuais e pendentes por prioridade');
assert.deepEqual(today,{day:'2026-11-14',done:0,pending:1,missed:0,high:0,medium:0,low:1});
assert.equal(rows.reduce((n,r)=>n+r.done+r.pending+r.missed,0),5,'Excluídas não aparecem');
assert.ok(rows.every(row=>row.day>='2026-11-08'&&row.day<='2026-11-14'));
const more=JSON.parse(JSON.stringify(runInContext('cuiudoChartRows(30,"2026-11-14")',ctx)));
assert.equal(more.find(r=>r.day==='2026-10-20')?.done,1,'Janela maior inclui histórico, sem apagá-lo');
const status=runInContext("cuiudoGoalsLineChart('pt')",ctx);
assert.match(status,/Evolução das metas/);
assert.match(status,/cuiudo-chart-svg/);
assert.match(status,/cuiudo-chart-line is-done/);
assert.match(status,/cuiudo-chart-line is-pending/);
assert.match(status,/cuiudo-chart-line is-missed/);
assert.match(status,/data-mode="priority"/);
assert.match(status,/id="cuiudo-chart-range"/);
assert.match(status,/data em que a meta foi cadastrada/);
runInContext("cuiudoChartMode='priority';cuiudoChartRange=30",ctx);
const priority=runInContext("cuiudoGoalsLineChart('pt')",ctx);
assert.match(priority,/cuiudo-chart-line is-high/);
assert.match(priority,/cuiudo-chart-line is-medium/);
assert.match(priority,/cuiudo-chart-line is-low/);
assert.match(priority,/apenas as metas ainda pendentes/);
assert.match(priority,/<option value="30" selected>/);
assert.doesNotMatch(priority,/NaN|undefined/);
ctx.state.dailyGoalDays={};
assert.match(runInContext("cuiudoGoalsLineChart('en')",ctx),/No goals recorded in this period/);
for(const locale of ['pt','en','es','la']){
  const chart=runInContext('cuiudoGoalsLineChart('+JSON.stringify(locale)+')',ctx);
  assert.match(chart,/cuiudo-goals-chart/);
}
assert.match(read('sw.js'),/terco-grafico-metas-v60/);
assert.match(read('cuiudo-v16.css'),/\.cuiudo-chart-svg/);
console.log('✓ Gráfico de linhas: séries, prioridades, datas reais, 7/14/30 dias e idiomas');
