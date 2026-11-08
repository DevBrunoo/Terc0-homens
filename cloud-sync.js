/* CUIÚDO Cloud Sync · Cloudflare Pages + D1.
 * Local-first, login por conta, revisão otimista e restauração em outros aparelhos.
 * Não publica credenciais nem acessa o banco diretamente do navegador.
 */
(function(){
 'use strict';
 const OWNER='cuiudo-sync-owner',DIRTY='cuiudo-sync-dirty';
 const KEYS=['progress','decadePrayers','challengeDays','examineDays','missionDays',
  'dailyGoalDays','notes','feedSaved','feedDone','rosaryIntention','musicTrack','musicVolume',
  'theme','appLang','mode','rosaryLength','verseLang','designVersion'];
 const COLLECTIONS=new Set(['progress','decadePrayers','challengeDays','examineDays',
  'missionDays','dailyGoalDays','feedSaved','feedDone']);
 const ui={user:null,revision:0,open:false,mode:'login',status:'',available:null,busy:false,applying:false};
 let syncTimer=null,working=false,retry=null,changeSequence=0;
 const oldSave=save,oldShell=renderShell;
 const supported=typeof window.fetch==='function' && location.protocol!=='file:';
 const esc=escapeHtml;
 const getOwner=()=>{try{return localStorage.getItem(OWNER)||'';}catch{return ''}};
 const isDirty=()=>{try{return localStorage.getItem(DIRTY)==='1';}catch{return false}};
 const setDirty=(v)=>{try{if(v)localStorage.setItem(DIRTY,'1');else localStorage.removeItem(DIRTY);}catch{}};
 function snapshot(){const data={};for(const k of KEYS)if(state[k]!==undefined)data[k]=state[k];return JSON.parse(JSON.stringify(data));}
 function saveOffline(){oldSave();}
 function applyData(next){
  ui.applying=true;
  try{
   for(const k of KEYS)if(Object.hasOwn(next,k))state[k]=next[k];
   saveOffline();
   if(typeof cuiudoMusic!=='undefined'&&next.musicTrack)cuiudoMusic.select(next.musicTrack);
  }finally{ui.applying=false;}
  render();
 }
 // Une as entradas diferentes de cada aparelho. Em um conflito, prefere o último
 // aparelho que fez mudanças ainda não enviadas. Não apaga listas silenciosamente.
 function merge(remote,local,preferLocal=false){
  const result={...remote};
  for(const k of KEYS){
   if(!Object.hasOwn(local,k))continue;
   if(!Object.hasOwn(remote,k)){result[k]=local[k];continue;}
   if(k==='notes'){
    const combined=[...(Array.isArray(remote[k])?remote[k]:[]),...(Array.isArray(local[k])?local[k]:[])];
    const unique=new Map();
    for(const n of combined)if(n&&typeof n.text==='string')unique.set(String(n.time||'')+'|'+n.text,n);
    result[k]=[...unique.values()].sort((a,b)=>String(b.time).localeCompare(String(a.time))).slice(0,100);
    continue;
   }
   if(COLLECTIONS.has(k) && remote[k] && local[k] && typeof remote[k]==='object' && typeof local[k]==='object'){
    const out={...remote[k]};
    for(const [day,item] of Object.entries(local[k])){
     if(!Object.hasOwn(out,day)){out[day]=item;continue;}
     if(preferLocal){out[day]=item;continue;}
     if(k==='progress'&&Array.isArray(out[day])&&Array.isArray(item)){
      out[day]=out[day].map((v,i)=>Math.max(Number(v)||0,Number(item[i])||0));continue;
     }
     if(k==='dailyGoalDays'&&Array.isArray(out[day])&&Array.isArray(item)){
      const entries=new Map();
      for(const g of [...out[day],...item])if(g&&g.id)entries.set(g.id,g);
      out[day]=[...entries.values()];continue;
     }
     if(k==='feedDone'&&typeof out[day]==='object'&&typeof item==='object'){
      out[day]={...item,...out[day]};continue;
     }
     if(k==='decadePrayers'&&typeof out[day]==='object'&&typeof item==='object'){
      out[day]={...item,...out[day]};continue;
     }
    }
    result[k]=out;
    continue;
   }
   if(preferLocal)result[k]=local[k];
  }
  return result;
 }
 function label(){
  const l=state.appLang||'pt';
  return ({pt:'Conta',en:'Account',es:'Cuenta',la:'Ratio'}[l]||'Conta');
 }
 function accountPanel(){
  if(!ui.open)return '';
  const info='As metas, o progresso do terço, suas intenções e o diário serão armazenados no D1 da sua conta. Use a mesma conta no celular e no notebook.';
  const description=ui.available===false?'O banco D1 não está disponível nesta hospedagem. Configure o binding DB e a migração.':info;
  return '<div class="cuiudo-auth-backdrop"><section class="cuiudo-auth-dialog" role="dialog" aria-modal="true" aria-labelledby="cuiudo-account-title">'+
   '<div class="cuiudo-auth-head"><div><span>✝ CUIÚDO CLOUD</span><h2 id="cuiudo-account-title">Sincronizar aparelhos</h2></div>'+
   '<button type="button" data-sync-action="close" aria-label="Fechar">×</button></div>'+
   '<p class="cuiudo-auth-description">'+esc(description)+'</p>'+
   (ui.user?'<p class="cuiudo-auth-email"><strong>Conta:</strong> '+esc(ui.user.email)+'</p>'+
     '<div class="cuiudo-auth-actions"><button type="button" data-sync-action="refresh">Sincronizar agora</button>'+
     '<button type="button" data-sync-action="logout">Sair da conta</button></div>':
     '<div class="cuiudo-auth-modes"><button type="button" data-sync-action="mode" data-mode="login" aria-pressed="'+(ui.mode==='login')+'">Entrar</button>'+
     '<button type="button" data-sync-action="mode" data-mode="register" aria-pressed="'+(ui.mode==='register')+'">Criar conta</button></div>'+
     '<form id="cuiudo-auth-form" class="cuiudo-auth-form">'+
     '<label>Email<input type="email" name="email" autocomplete="username" maxlength="254" required placeholder="seu@email.com"></label>'+
     '<label>Senha (mínimo 12 caracteres)<input type="password" name="password" minlength="12" maxlength="128" autocomplete="'+(ui.mode==='register'?'new-password':'current-password')+'" required></label>'+
     '<button type="submit" '+(ui.available===false||ui.busy?'disabled':'')+'>'+(ui.mode==='register'?'Criar conta':'Entrar e sincronizar')+'</button></form>'+
     '<p class="cuiudo-auth-hint">Guarde sua senha: ainda não há recuperação por email.</p>')+
   '<p class="cuiudo-sync-message" role="status" aria-live="polite">'+esc(ui.status||'O aplicativo continua funcionando offline mesmo sem login.')+'</p>'+
   '<p class="cuiudo-auth-help"><a href="https://github.com/DevBrunoo/Terc0-homens/blob/main/docs/CLOUDFLARE-D1.md" target="_blank" rel="noopener noreferrer">Como configurar o Cloudflare D1 ↗</a></p>'+
   '</section></div>';
 }
 renderShell=function(html){
  const button='<button type="button" class="cuiudo-account-toggle" data-sync-action="open" title="Conta e sincronização" aria-label="'+esc(label()+' e sincronização')+'">'+
   '<span aria-hidden="true">'+(ui.user?'☁':'⇄')+'</span><span class="cuiudo-account-text">'+esc(ui.user?'Sincronizado':label())+'</span></button>';
  return oldShell(html).replace('<div class="header-tools">','<div class="header-tools">'+button)
   .replace('<main class="main"',''+accountPanel()+'<main class="main"');
 };
 save=function(){
  oldSave();
  if(!ui.applying && (ui.user||getOwner())){
   changeSequence++;
   setDirty(true);
   schedule();
  }
 };
 function schedule(){
  if(!ui.user||!supported||ui.busy)return;
  if(syncTimer)clearTimeout(syncTimer);
  syncTimer=setTimeout(()=>{syncTimer=null;flush();},1000);
 }
 async function api(path,options={}){
  if(!supported)throw new Error('Use o site no Cloudflare Pages.');
  const res=await fetch('/api/'+path,{credentials:'same-origin',cache:'no-store',
   headers:{'Accept':'application/json',...(options.body?{'Content-Type':'application/json'}:{})},...options});
  let data;
  try{data=await res.json();}catch{throw new Error('Sincronização exige Cloudflare Pages com Functions (não GitHub Pages).');}
  return {status:res.status,...data};
 }
 async function pull({initial=false}={}){
  if(!ui.user||working)return;
  working=true;
  try{
   const result=await api('sync');
   if(result.status===401){ui.user=null;ui.status='Sessão encerrada. Entre novamente.';render();return;}
   if(result.status>=400)throw new Error(result.error||'Falha ao consultar dados.');
   const remote=result.state||{},local=snapshot(),owner=getOwner();
   const sameOwner=!owner||owner===ui.user.id;
   const prefer=isDirty()&&sameOwner;
   let combined;
   if(!sameOwner){
    // Não importamos automaticamente dados da conta anterior para a atual.
    try{localStorage.setItem('cuiudo-backup-conta-anterior',JSON.stringify(local));}catch{}
    combined=remote;
   }else{
    combined=merge(remote,local,prefer);
   }
   ui.revision=result.revision||0;
   applyData(combined);
   try{localStorage.setItem(OWNER,ui.user.id);}catch{}
   if(JSON.stringify(combined)!==JSON.stringify(remote)||prefer){
    setDirty(true);
    ui.status='Mesclando dados do notebook e celular…';
    schedule();
   }else{
    setDirty(false);ui.status='Dados atualizados nos dois aparelhos.';
   }
   ui.available=true;
  }catch(e){ui.status=String(e.message||e);setDirty(true);}
  finally{working=false;render();if(isDirty()&&ui.user)schedule();}
 }
 async function flush(){
  if(!ui.user||working||!isDirty())return;
  working=true;
  const sentSequence=changeSequence,data=snapshot();
  try{
   const result=await api('sync',{method:'PUT',body:JSON.stringify({revision:ui.revision,state:data})});
   if(result.status===409){
    ui.revision=result.revision||0;
    const combined=merge(result.state||{},snapshot(),true);
    applyData(combined);
    setDirty(true);ui.status='Conflito de versões resolvido. Salvando novamente…';
    return;
   }
   if(result.status===401){ui.user=null;ui.status='Faça login novamente.';return;}
   if(result.status>=400)throw new Error(result.error||'Não foi possível salvar.');
   ui.revision=result.revision;
   if(sentSequence===changeSequence){
    setDirty(false);ui.status='Salvo na nuvem.';
   }else{
    setDirty(true);ui.status='Sincronizando novas alterações…';
   }
  }catch(e){ui.status='Salvo neste aparelho. A nuvem está indisponível: '+String(e.message||e);}
  finally{working=false;if(ui.open)render();if(isDirty()&&ui.user&&navigator.onLine)schedule();}
 }
 async function checkSession(){
  if(!supported){ui.available=false;return;}
  try{
   const result=await api('auth');
   if(result.status>=400){ui.available=false;ui.status=result.error||'D1 indisponível.';return;}
   ui.available=true;
   if(result.user){ui.user=result.user;await pull({initial:true});}
  }catch(e){ui.available=false;ui.status=String(e.message||e);}
  render();
 }
 async function login(action,email,password){
  if(ui.busy)return;
  ui.busy=true;ui.status='Validando conta…';render();
  try{
   const result=await api('auth',{method:'POST',body:JSON.stringify({action,email,password})});
   if(result.status>=400)throw new Error(result.error||'Falha ao entrar.');
   ui.user=result.user;ui.revision=0;ui.available=true;ui.status='Conta conectada. Carregando dados…';
   await pull({initial:true});
   ui.open=false;
  }catch(e){ui.status=String(e.message||e);}
  finally{ui.busy=false;render();}
 }
 async function logout(){
  if(ui.busy)return;
  ui.busy=true;
  if(isDirty())await flush();
  try{await api('auth',{method:'POST',body:JSON.stringify({action:'logout'})});}catch{}
  ui.user=null;ui.revision=0;ui.open=false;ui.busy=false;
  setDirty(false);
  try{localStorage.removeItem(OWNER);}catch{}
  // Em aparelho compartilhado, evita exibir diário e intenções da conta anterior.
  ui.applying=true;
  for(const k of KEYS)delete state[k];
  saveOffline();ui.applying=false;
  render();
 }
 // Capture: o app principal renderiza após cliques, mesmo para ações desconhecidas.
 app.addEventListener('click',event=>{
  const b=event.target.closest?.('[data-sync-action]');if(!b)return;
  event.preventDefault();event.stopImmediatePropagation();
  const action=b.dataset.syncAction;
  if(action==='open'){ui.open=true;render();}
  else if(action==='close'){ui.open=false;render();}
  else if(action==='mode'){ui.mode=b.dataset.mode==='register'?'register':'login';ui.status='';render();}
  else if(action==='refresh'){if(isDirty())flush();else pull();}
  else if(action==='logout')logout();
 },true);
 app.addEventListener('submit',event=>{
  if(event.target.id!=='cuiudo-auth-form')return;
  event.preventDefault();event.stopImmediatePropagation();
  const form=event.target;
  const email=form.querySelector('[name=email]')?.value||'';
  const password=form.querySelector('[name=password]')?.value||'';
  login(ui.mode,email,password);
 },true);
 window.addEventListener('online',()=>{if(ui.user){if(isDirty())schedule();else pull();}});
 document.addEventListener('visibilitychange',()=>{
  if(!document.hidden&&ui.user){if(isDirty())schedule();else pull();}
 });
 window.setInterval(()=>{if(ui.user&&!document.hidden){if(isDirty())schedule();else pull();}},45000);
 render();
 checkSession();
})();
