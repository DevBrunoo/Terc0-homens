import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {createContext,runInContext} from 'node:vm';
const read=p=>readFileSync(new URL('./'+p,import.meta.url),'utf8');
const run=spawnSync(process.execPath,['--check',new URL('./daily-goals.js',import.meta.url).pathname]);
assert.equal(run.status,0,'daily-goals.js: '+run.stderr);
const source=read('daily-goals.js');
const from=source.indexOf("const cuiudoChartPrefs=");
const to=source.indexOf('function cuiudoGoalChecklist(){',from);
assert.ok(from>=0&&to>from,'Bloco do gráfico encontrado');
const vm=createContext({
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
 currentDay:()=> '2026-11-14',
 escapeHtml:s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;')
});
runInContext(source.slice(from,to),vm);
const rows=JSON.parse(JSON.stringify(runInContext('cuiudoChartRows(7,"2026-11-14")',vm)));
assert.equal(rows.length,7);
const yesterday=rows.find(r=>r.day==='2026-11-13');
assert.deepEqual(yesterday,{day:'2026-11-13',done:1,pending:2,missed:1,high:1,medium:1,low:0});
assert.equal(rows.reduce((s,r)=>s+r.done+r.pending+r.missed,0),5,'Não contar metas excluídas');
const bars=JSON.parse(JSON.stringify(runInContext("cuiudoChartBars(cuiudoChartRows(7,'2026-11-14'),'status')",vm)));
assert.equal(bars.length,7);
assert.equal(bars.find(x=>x.key==='2026-11-13').percent,25);
assert.equal(bars.find(x=>x.key==='2026-11-14').percent,0);
assert.equal(bars.find(x=>x.key==='2026-11-12').percent,null,'Dia sem metas não é 0%');
const html=runInContext("cuiudoGoalsBarChart('pt')",vm);
assert.match(html,/Seu desempenho/);
assert.match(html,/cuiudo-chart-barplot/);
assert.match(html,/cuiudo-chart-footnote/);
assert.match(html,/<details class="cuiudo-chart-footnote"><summary>Como calculamos<\/summary>/);
assert.match(read('cuiudo-v16.css'),/\.cuiudo-chart-bar-stage\s*\{\s*height:76px/);
assert.match(read('cuiudo-v16.css'),/\.cuiudo-chart-bar-stage\s*\{\s*height:58px/);
assert.match(html,/cuiudo-chart-bar-fill/);
assert.match(html,/25%/);
assert.match(html,/0%/);
assert.match(html,/cuiudo-chart-bar-nodata/);
assert.match(html,/data-mode="priority"/);
assert.match(html,/id="cuiudo-chart-range"/);
assert.match(html,/data de conclusão/);
assert.doesNotMatch(html,/cuiudo-chart-svg|cuiudo-chart-line/,'Não manter gráficos de linhas');
runInContext("cuiudoChartMode='priority';cuiudoChartRange=30",vm);
const priority=runInContext("cuiudoGoalsBarChart('pt')",vm);
assert.match(priority,/>Alta</);
assert.match(priority,/>Média</);
assert.match(priority,/>Baixa</);
assert.match(priority,/50%/,'Meta concluída 1 de 2 de prioridade alta');
assert.match(priority,/<option value="30" selected>/);
assert.match(priority,/Metas antigas sem prioridade/);
const pBars=JSON.parse(JSON.stringify(runInContext("cuiudoChartBars(cuiudoChartRows(30,'2026-11-14'),'priority')",vm)));
assert.deepEqual(pBars.map(x=>x.percent),[50,50,0],'Taxa por prioridade inclui concluídas e não concluídas');
assert.ok(!priority.includes('NaN')&&!priority.includes('undefined'));
const historical=JSON.parse(JSON.stringify(runInContext('cuiudoChartRows(30,"2026-11-14")',vm)));
assert.equal(historical.find(x=>x.day==='2026-10-20').done,1,'30 dias inclui metas antigas');
vm.state.dailyGoalDays={};
assert.match(runInContext("cuiudoGoalsBarChart('en')",vm),/There are no goals recorded in this period yet/);
for(const locale of ['pt','en','es','la'])assert.match(
 runInContext('cuiudoGoalsBarChart('+JSON.stringify(locale)+')',vm),/cuiudo-goals-chart/
);
assert.match(read('sw.js'),/const VERSION='terco-[a-z0-9-]+-v\d+'/);
assert.match(read('cuiudo-v16.css'),/\.cuiudo-chart-bar-fill/);
assert.match(read('cuiudo-v16.css'),/prefers-reduced-motion/);
console.log('✓ Barras percentuais: 0% real, sem dados, prioridades, datas, 7/14/30 dias e quatro idiomas');
