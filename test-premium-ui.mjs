import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createContext,runInContext} from 'node:vm';
const src=readFileSync(new URL('./cuiudo-premium.js',import.meta.url),'utf8');
const callbacks={click:[],change:[],submit:[]},memory=new Map();
const classSet=new Set(),changes=[];
const app={innerHTML:'',addEventListener(type,fn){(callbacks[type]??=[]).push(fn)}};
const now='2026-11-14';
const group={mysteries:Array.from({length:5},(_,i)=>({id:'m'+i,title:'Mistério '+i,ref:'Lc 1,1'}))};
const verses=Object.fromEntries(group.mysteries.map(m=>[m.id,{
 ref:'Lc 1,1',pt:'Palavra do Evangelho',en:'Word of the Gospel',
 ptSource:'https://www.vatican.va/',enSource:'https://www.vatican.va/'
}]));
const state={tab:'inicio',dailyGoalDays:{[now]:[{id:'1763000000000-test',text:'Estudar',status:'pending',priority:'high'}]},
 group:'gozosos',mystery:0,appLang:'pt',rosaryImmersive:false};
const html=[];
const ctx=createContext({
 state,groups:{gozosos:group},groupNames:['gozosos','dolorosos','gloriosos','luminosos'],
 dayGroup:()=> 'gozosos',currentDay:()=>now,versiculosPorMisterio:verses,
 cuiudoLocale:()=> 'pt',escapeHtml:s=>String(s??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;'),
 app,window:{addEventListener(){},setInterval(){},cuiudoGlobalGoals:{getTrash:()=>[],change(...a){changes.push(a)}}},
 document:{documentElement:{classList:{toggle(name,on){if(on)classSet.add(name);else classSet.delete(name)}},lang:'pt'},
  body:{},querySelector(){return null},getElementById(id){if(id==='cuiudo-focus-minutes')return {value:'5'};return null},
  addEventListener(){}},
 localStorage:{getItem(k){return memory.get(k)||null},setItem(k,v){memory.set(k,String(v))}},
 save(){},render(){html.push('base')},renderShell:s=>s,setTheme(){},
 cuiudoRosary:()=>'<section>Terço original</section>',
 combatTabs:[{id:'inicio'}],cuiudoNav:{pt:{},en:{},es:{},la:{}},
 readProgress:()=>[0,0,0,0,0],
 cuiudoTimerSeconds:g=>g.remaining_sec||0,cuiudoTimerFormat:s=>'00:'+String(s%60).padStart(2,'0'),
 cuiudoTimerCancelAudio(){},cuiudoTimerArmAudio(){},
 cuiudoTimerStop:g=>{g.timer_state='paused'},Notification:undefined,
 console,confirm:()=>true,alert(){},Date
});
runInContext(src,ctx,{timeout:1500});
assert.ok(ctx.window.cuiudoPremium);
assert.match(ctx.window.cuiudoPremium.goalExtras('pt'),/Proteção e recuperação/);
assert.match(ctx.window.cuiudoPremium.goalExtras('pt'),/Lembrete diário/);
assert.ok(ctx.combatTabs.some(x=>x.id==='lectio'),'Lectio adicionada à navegação');
ctx.state.tab='lectio';runInContext('render()',ctx);
assert.match(app.innerHTML,/Lectio Divina/);
assert.match(app.innerHTML,/Palavra do Evangelho/);
assert.match(app.innerHTML,/cuiudo-lectio-form/);
ctx.state.tab='inicio';
for(const fn of callbacks.click)fn({target:{dataset:{action:'cuiudo-focus-open',id:'1763000000000-test'},
 closest(){return this}}});
assert.match(ctx.window.cuiudoPremium.goalExtras('pt'),/cuiudo-focus-dialog/);
assert.match(ctx.window.cuiudoPremium.goalExtras('pt'),/00:00/);
for(const fn of callbacks.click)fn({target:{dataset:{action:'cuiudo-focus-start'},
 closest(){return this}}});
assert.equal(ctx.state.dailyGoalDays[now][0].duration_sec,300,'Iniciar foco de 5 min');
assert.equal(ctx.state.dailyGoalDays[now][0].timer_state,'running');
assert.equal(changes.length,1,'Alteração sincronizada');
for(const fn of callbacks.click)fn({target:{dataset:{action:'cuiudo-focus-done'},
 closest(){return this}}});
assert.equal(ctx.state.dailyGoalDays[now][0].status,'done');
assert.equal(changes.length,2,'Conclusão sincronizada');
assert.ok(!ctx.window.cuiudoPremium.goalExtras('pt').includes('cuiudo-focus-dialog'));
console.log('✓ Interface premium: Lectio, navegação, backup, foco, timer e conclusão');
