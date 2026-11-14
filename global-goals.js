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
 let pending=[],inFlight=false,pulling=false,connected=false;
 let timer=null,status='Carregando metas da nuvem…';
 const supported=typeof window.fetch==='function' && location.protocol!=='file:';
 const timerFields=['duration_sec','remaining_sec','timer_started_at','timer_state'];
 function copyGoal(g){
  return {id:g.id,text:g.text,status:g.status||'pending',
   priority:['high','medium','low'].includes(g.priority)?g.priority:'medium',
   duration_sec:Number.isSafeInteger(g.duration_sec)?g.duration_sec:0,
   remaining_sec:Number.isSafeInteger(g.remaining_sec)?g.remaining_sec:0,
   timer_started_at:Number.isSafeInteger(g.timer_started_at)?g.timer_started_at:null,
   timer_state:['running','paused','finished'].includes(g.timer_state)?g.timer_state:'none'};
 }

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
  // Não expirar metas antigas, inclusive na fila offline.
  return validDay(day)&&Number.isFinite(Date.parse(day+'T12:00:00Z'));
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
  return {action:'upsert',day:op.day,...copyGoal(op),text:op.text.trim()};
 }
 pending=readLocal(QUEUE_KEY,[]).map(normalize).filter(Boolean);
 function updateStatus(message,online){
  status=message;
  if(online!==undefined)connected=online;
 }
 function snapshotGoals(){
  const result={};
  for(const [day,goals] of Object.entries(state.dailyGoalDays||{})){
   if(!Array.isArray(goals))continue;
   result[day]=goals.filter(validGoal).map(copyGoal);
  }
  return result;
 }
 function replaceGoals(rows){
  const grouped={};
  for(const row of rows){
   if(!row||!validDay(row.day)||typeof row.id!=='string')continue;
   grouped[row.day]??=[];
   if(row.status==='deleted')continue; // Excluída no servidor: não reintroduzir no cliente.
   if(!validGoal(row))continue;
   grouped[row.day].push(copyGoal(row));
  }
  // Aplicar alterações ainda não enviadas para não sumirem da tela.
  for(const op of pending){
   const goals=grouped[op.day]??=[];
   const idx=goals.findIndex(g=>g.id===op.id);
   if(op.action==='delete'){if(idx>=0)goals.splice(idx,1);}
   else if(idx>=0){goals[idx]=copyGoal(op);}
   else goals.push(copyGoal(op));
   grouped[op.day]=goals;
  }
  const old=state.dailyGoalDays||{};
  // A atualização automática não deve apagar o que a pessoa está digitando
  // no campo de metas. Só redesenhar quando houver mudança real dos dados.
  if(JSON.stringify(grouped)===JSON.stringify(old))return;
  const input=document.getElementById('cuiudo-goal-text');
  const draft=input?.value||'';
  const focused=Boolean(input&&document.activeElement===input);
  const start=focused?input.selectionStart:null;
  const end=focused?input.selectionEnd:null;
  state.dailyGoalDays=grouped;
  saveLocal();
  render();
  const nextInput=document.getElementById('cuiudo-goal-text');
  if(nextInput&&draft){
   nextInput.value=draft;
   if(focused){nextInput.focus({preventScroll:true});
    if(start!==null&&end!==null)nextInput.setSelectionRange(start,end);}
  }
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
 async function request(method,body,offset=0){
  const url=method==='GET'&&offset?ENDPOINT+'?offset='+offset:ENDPOINT;
  const res=await fetch(url,{
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
   // Recuperar todas as páginas; não descartar metas antigas por limite de linhas.
   const rows=[];
   let offset=0,hasMore=true;
   while(hasMore){
    const data=await request('GET',null,offset);
    const page=Array.isArray(data.goals)?data.goals:[];
    rows.push(...page);
    hasMore=data.hasMore===true;
    if(hasMore&&!page.length)throw new Error('Não foi possível carregar todas as metas.');
    offset+=page.length;
   }
   const imported=readLocal(IMPORT_KEY,false);
   // Preservar metas locais não enviadas mesmo após a migração inicial.
   // Tombstones impedem restaurar algo que o usuário excluiu de propósito.
   const known=new Set(rows.map(row=>row.id));
   for(const [day,goals] of Object.entries(snapshotGoals())){
    if(!withinWindow(day))continue;
    for(const goal of goals){
     if(!known.has(goal.id)&&!pending.some(p=>p.id===goal.id&&p.day===day)){
      queueOperation({action:'upsert',day,...goal});
     }
    }
   }
   if(!imported)writeLocal(IMPORT_KEY,true);
   connected=true;
   updateStatus(pending.length?'Enviando metas locais…':'Sincronizado automaticamente com o D1.',true);
   replaceGoals(rows);
   if(pending.length)schedule();
  }catch(e){
   updateStatus('Não foi possível buscar metas da nuvem: '+String(e.message||e),false);
  }finally{pulling=false;}
 }
 window.cuiudoGlobalGoals={
  change(action,day,goal){
   if(!goal)return;
   queueOperation({action,day,...copyGoal(goal)});
  },
  refresh(){return pull();},
  isConnected(){return connected;},
  getStatus(){return status;}
 };
 if(supported){
  window.addEventListener('online',()=>{if(pending.length)flush();pull();});
  window.addEventListener('focus',()=>pull());
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)pull();});
  window.setInterval(()=>{if(!document.hidden){if(pending.length)flush();else pull();}},8000);
  pull();
 }else updateStatus('Metas locais: para sincronizar, abra o site no Cloudflare.',false);
 render();
})();
