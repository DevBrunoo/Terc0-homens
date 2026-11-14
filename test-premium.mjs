import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {createContext,runInContext} from 'node:vm';
const read=path=>readFileSync(new URL('./'+path,import.meta.url),'utf8');
const check=['goal-history.js','cuiudo-premium.js','functions/api/goal-history.js','functions/api/goals.js','daily-goals.js'];
for(const path of check){
 const r=spawnSync(process.execPath,['--check',new URL('./'+path,import.meta.url).pathname]);
 assert.equal(r.status,0,path+': '+r.stderr.toString());
}
const api=read('functions/api/goals.js');
const fn=api.slice(api.indexOf('function goalEvent('),api.indexOf('export async function onRequestPost('));
assert.ok(fn.startsWith('function goalEvent('));
const context=createContext({});
runInContext(fn,context);
const evaluate=(previous,action,status,priority)=>
 runInContext('goalEvent('+JSON.stringify(previous)+','+JSON.stringify(action)+','+
  JSON.stringify(status)+','+JSON.stringify(priority)+')',context);
assert.equal(evaluate(null,'upsert','pending','high'),'created');
assert.equal(evaluate({status:'pending',priority:'medium'},'upsert','done','medium'),'completed');
assert.equal(evaluate({status:'pending',priority:'medium'},'upsert','missed','medium'),'missed');
assert.equal(evaluate({status:'done',priority:'medium'},'upsert','pending','medium'),'reopened');
assert.equal(evaluate({status:'done',priority:'high'},'delete','deleted','medium'),'deleted');
assert.equal(evaluate({status:'deleted',priority:'medium'},'upsert','pending','medium'),'restored');
assert.equal(evaluate({status:'pending',priority:'medium'},'upsert','pending','high'),'priority');
assert.equal(evaluate({status:'pending',priority:'medium'},'upsert','pending','medium'),null,'Timer não deve criar evento falso');

const events=[
 {event_id:3,goal_id:'third',goal_day:'2026-11-13',event_type:'completed',priority:'high',
  occurred_at:Date.parse('2026-11-14T12:30:00Z')},
 {event_id:2,goal_id:'second',goal_day:'2026-11-14',event_type:'missed',priority:'medium',
  occurred_at:Date.parse('2026-11-14T12:15:00Z')},
 {event_id:1,goal_id:'first',goal_day:'2026-11-14',event_type:'created',priority:'low',
  occurred_at:Date.parse('2026-11-14T12:00:00Z')}
];
const vm=createContext({window:{fetch:()=>{},addEventListener(){},setInterval(){}},
 location:{protocol:'https:'},navigator:{onLine:true},document:{hidden:false},
 fetch:async()=>({ok:true,json:async()=>({events,hasMore:false})}),
 state:{tab:'lectio'},currentDay:()=> '2026-11-14',
 render(){throw Error('Não redesenhar durante Lectio')},console});
runInContext(read('goal-history.js'),vm);
await new Promise(resolve=>setTimeout(resolve,5));
const data=JSON.parse(JSON.stringify(runInContext("window.cuiudoGoalHistory.byDay(7,'2026-11-14')",vm)));
assert.equal(data.find(x=>x.day==='2026-11-14').completed,1);
assert.equal(data.find(x=>x.day==='2026-11-14').missed,1);
assert.equal(data.find(x=>x.day==='2026-11-14').created,1);
assert.ok(data.find(x=>x.day==='2026-11-13').completed===0,'Não atribuir conclusão à data da criação');
assert.match(read('index.html'),/cuiudo-premium\.css/);
assert.match(read('scripts/build-cloudflare.mjs'),/cuiudo-premium\\.css/);
assert.match(read('scripts/build-cloudflare.mjs'),/goal-history\\.js/);
assert.match(read('scripts/build-cloudflare.mjs'),/cuiudo-premium\\.js/);

assert.match(read('index.html'),/cuiudo-premium\.js/);
assert.match(read('sw.js'),/goal-history\.js/);
assert.match(read('cuiudo-premium.js'),/LECTIO_KEY/);
assert.match(read('cuiudo-premium.js'),/SNAP_KEY/);
assert.match(read('cuiudo-premium.js'),/cuiudo-focus-open/);
assert.match(read('cuiudo-premium.js'),/cuiudo-premium-restore-trash/);
assert.match(read('cuiudo-premium.js'),/cuiudo-rosary-immersive/);
assert.match(read('cuiudo-premium.js'),/reminderOn/);
assert.match(read('cuiudo-premium.css'),/prefers-reduced-motion/);
assert.match(read('cuiudo-premium.css'),/min-height:44px/);
assert.match(read('daily-goals.js'),/cuiudo-chart-trend/);
assert.match(read('daily-goals.js'),/terco-grafico-preferencias-v1/);
console.log('✓ Terço premium: histórico real, recuperação, foco, oração, lembretes e acessibilidade');
