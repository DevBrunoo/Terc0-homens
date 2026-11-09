/* CUIÚDO — Metas universais e públicas, armazenadas no Cloudflare D1.
 * Sem cadastro, senha, código, conta ou pareamento de aparelhos.
 * APENAS metas são globais. Diário, intenções, terço e preferências seguem locais.
 * Qualquer visitante pode ler, modificar ou apagar metas neste quadro compartilhado.
 */
(function(){
 'use strict';
 const ENDPOINT='/api/goals';
 const QUEUE_KEY='cuiudo-public-goals-queue-v1';
 const IMPORT_KEY='cuiudo-public-goals-imported-v1';
 const esc=escapeHtml;
 let pending=[],inFlight=false,pulling=false,connected=false,initialLoad=true;
 let timer=null,lastCheck=0,status='Carregando metas da nuvem…';
 const previousShell=renderShell;
 const supported=typeof window.fetch==='function' && location.protocol!=='file:';

 function readLocal(key,fallback){
  try{const data=JSON.parse(localStorage.getItem(key)||'null');return data===null?fallback:data;}catch{return fallback;}
 }
 function writeLocal(key,data){
  try{localStorage.setItem(key,JSON.stringify(data));}catch{}
 }
 function saveLocal(){
  // A função original do aplicativo é preservada: não sincroniza dados privados.
  save();
 }
 const validDay=day=>/^\d{4}-\d{2}-\d{2}$/.test(day);
 function withinWindow(day){
  if(!validDay(day))return false;
  const now=Date.now(),time=Date.parse(day+'T12:00:00Z');
  return Number.isFinite(time)&&time>=now-121*86400000&&time<=now+8*86400000;
 }
 function validGoal(goal){
  return goal && typeof goal==='object'&&
   typeof goal.id==='string'&&/^[A-Za-z0-9_.:-]{6,80}$/.test(goal.id)&&
   typeof goal.text==='string'&&goal.text.trim().length>0&&goal.text.trim().length<=180&&
   ['pending','done','missed'].includes(goal.status||'pending');
 }
 function normalize(op){
  if(!op||!validDay(op.day)||!withinWindow(op.day)||!op.id||typeof op.id!=='string')return null;
  if(!/^[A-Za-z0-9_.:-]{6,80}$/.test(op.id))return null;
  if(op.action==='delete')return {action:'delete',day:op.day,id:op.id};
  if(op.action!=='upsert'||!validGoal(op))return null;
  return {action:'upsert',day:op.day,id:op.id,text:op.text.trim(),status:op.status||'pending'};
 }
 pending=readLocal(QUEUE_KEY,[]).map(normalize).filter(Boolean);
 function updateStatus(message,online){
  status=message;
  if(online!==undefined)connected=online;
  if(document.getElementById('cuiudo-global-status')){
   const node=document.getElementById('cuiudo-global-status');
   node.textContent=status;
  }
 }
 function snapshotGoals(){
  const result={};
  for(const [day,goals] of Object.entries(state.dailyGoalDays||{})){
   if(!Array.isArray(goals))continue;
   result[day]=goals.filter(validGoal).map(g=>({id:g.id,text:g.text,status:g.status||'pending'}));
  }
  return result;
 }
 function replaceGoals(rows){
  const grouped={};
  for(const row of rows){
   if(!row||!validDay(row.day)||!validGoal({id:row.id,text:row.text,status:row.status==='deleted'?'pending':row.status}))continue;
   grouped[row.day]??=[];
   if(row.status!=='deleted')grouped[row.day].push({id:row.id,text:row.text,status:row.status});
  }
  // Aplicar alterações ainda não enviadas para não sumirem da tela.
  for(const op of pending){
   const goals=grouped[op.day]??=[];
   const idx=goals.findIndex(g=>g.id===op.id);
   if(op.action==='delete'){if(idx>=0)goals.splice(idx,1);}
   else if(idx>=0){goals[idx]={id:op.id,text:op.text,status:op.status};}
   else goals.push({id:op.id,text:op.text,status:op.status});
   grouped[op.day]=goals;
  }
  // Histórico fora da janela de leitura continua disponível apenas localmente.
  const old=state.dailyGoalDays||{};
  for(const [day,entries] of Object.entries(old)){
   if(!withinWindow(day)&&Array.isArray(entries))grouped[day]=entries;
  }
  state.dailyGoalDays=grouped;
  saveLocal();
  render();
 }
 function queueOperation(op){
  const normalized=normalize(op);
  if(!normalized)return;
  pending=pending.filter(p=>!(p.day===normalized.day&&p.id===normalized.id));
  pending.push(normalized);
  writeLocal(QUEUE_KEY,pending);
  updateStatus('Salvando '+pending.length+' alteração(ões) no D1…');
  schedule();
 }
 function schedule(){
  if(timer)clearTimeout(timer);
  timer=setTimeout(()=>{timer=null;flush();},300);
 }
 async function request(method,body){
  const res=await fetch(ENDPOINT,{
   method,credentials:'same-origin',cache:'no-store',
   headers:{Accept:'application/json',...(body?{'Content-Type':'application/json'}:{})},
   ...(body?{body:JSON.stringify(body)}:{})
  });
  let result;
  try{result=await res.json();}catch{throw new Error('Servidor não devolveu JSON. Verifique a publicação Cloudflare.');}
  if(!res.ok)throw new Error(result.error||('HTTP '+res.status));
  return result;
 }
 async function flush(){
  if(inFlight||!supported||!pending.length)return;
  inFlight=true;
  try{
   while(pending.length){
    const operation=pending[0];
    await request('POST',operation);
    // Se a meta mudou enquanto a requisição estava em voo, mantenha a edição mais nova.
    if(pending[0]===operation)pending.shift();
    else pending=pending.filter(p=>p!==operation);
    writeLocal(QUEUE_KEY,pending);
   }
   updateStatus('Salvo no D1. Disponível em qualquer aparelho.',true);
  }catch(e){
   updateStatus('Sem conexão: metas mantidas aqui. '+String(e.message||e),false);
  }finally{
   inFlight=false;
   if(connected&&pending.length)schedule();
   if(connected)pull();
  }
 }
 async function pull(){
  if(!supported||pulling||inFlight)return;
  pulling=true;
  try{
   const data=await request('GET');
   const rows=Array.isArray(data.goals)?data.goals:[];
   const imported=readLocal(IMPORT_KEY,false);
   if(!imported){
    // Migrar automaticamente as metas que já existiam no navegador para o
    // quadro público UMA VEZ. Tombstones remotas impedem ressurreição.
    const known=new Set(rows.map(row=>row.id));
    for(const [day,goals] of Object.entries(snapshotGoals())){
     if(!withinWindow(day))continue;
     for(const goal of goals){
      if(!known.has(goal.id)&&!pending.some(p=>p.id===goal.id&&p.day===day)){
       queueOperation({action:'upsert',day,...goal});
      }
     }
    }
    writeLocal(IMPORT_KEY,true);
   }
   connected=true;
   lastCheck=Date.now();
   updateStatus(pending.length?'Enviando metas locais…':'Sincronizado automaticamente com o D1.',true);
   replaceGoals(rows);
   if(pending.length)schedule();
  }catch(e){
   updateStatus('Não foi possível buscar metas da nuvem: '+String(e.message||e),false);
  }finally{pulling=false;initialLoad=false;}
 }
 window.cuiudoGlobalGoals={
  change(action,day,goal){
   if(!goal)return;
   queueOperation({action,day,id:goal.id,text:goal.text,status:goal.status||'pending'});
  },
  refresh(){return pull();},
  isConnected(){return connected;}
 };
 renderShell=function(html){
  const notice='<div class="cuiudo-global-notice" role="status">'+
   '<strong>☁ Metas universais — sem conta ou código</strong>'+
   '<span id="cuiudo-global-status">'+esc(status)+'</span>'+
   '<small>Quadro público: qualquer visitante pode ver, concluir ou excluir as metas. Diário e intenções continuam privados neste aparelho.</small>'+
   '<button type="button" data-global-goals-refresh>Atualizar ↻</button></div>';
  return previousShell(html).replace('<form id="cuiudo-goal-form"',notice+'<form id="cuiudo-goal-form"');
 };
 app.addEventListener('click',event=>{
  if(!event.target.closest?.('[data-global-goals-refresh]'))return;
  event.preventDefault();pull();
 },true);
 if(supported){
  window.addEventListener('online',()=>{if(pending.length)flush();pull();});
  window.addEventListener('focus',()=>pull());
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)pull();});
  window.setInterval(()=>{if(!document.hidden){if(pending.length)flush();else pull();}},8000);
  pull();
 }else updateStatus('Metas locais: para sincronizar, abra o site no Cloudflare.',false);
 render();
})();
