/* CUIÚDO Cloud Sync · Cloudflare Pages + D1.
 * Local-first, login por conta, revisão otimista e restauração em outros aparelhos.
 * Não publica credenciais nem acessa o banco diretamente do navegador.
 */
(function(){
 'use strict';
 const OWNER='cuiudo-sync-owner',DIRTY='cuiudo-sync-dirty',SOLO='cuiudo-solo-code';
 const KEYS=['progress','decadePrayers','challengeDays','examineDays','missionDays',
  'dailyGoalDays','notes','feedSaved','feedDone','rosaryIntention','musicTrack','musicVolume',
  'theme','appLang','mode','rosaryLength','verseLang','designVersion'];
 const COLLECTIONS=new Set(['progress','decadePrayers','challengeDays','examineDays',
  'missionDays','dailyGoalDays','feedSaved','feedDone']);
 const ui={user:null,revision:0,open:false,mode:'start',showCode:false,status:'',available:null,busy:false,applying:false};
 let syncTimer=null,working=false,retryAt=0,changeSequence=0;
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
   for(const k of KEYS){if(Object.hasOwn(next,k))state[k]=next[k];else delete state[k];}
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
     if(k==='dailyGoalDays'&&Array.isArray(out[day])&&Array.isArray(item)){
      // Mesclar por ID: metas criadas no MESMO dia em dispositivos diferentes
      // não podem substituir umas às outras.
      const entries=new Map();
      for(const goal of out[day])if(goal&&goal.id)entries.set(String(goal.id),goal);
      for(const goal of item)if(goal&&goal.id){
       const id=String(goal.id);
       if(!entries.has(id)||preferLocal)entries.set(id,goal);
      }
      out[day]=[...entries.values()].slice(0,30);
      continue;
     }
     if(preferLocal){out[day]=item;continue;}
     if(k==='progress'&&Array.isArray(out[day])&&Array.isArray(item)){
      out[day]=out[day].map((v,i)=>Math.max(Number(v)||0,Number(item[i])||0));continue;
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
 function secret(){try{return localStorage.getItem(SOLO)||'';}catch{return ''}}
 function accountPanel(){
  if(!ui.open)return '';
  const message=ui.available===false?
   'A sincronização não está disponível. Confira o Cloudflare D1 e a ligação DB.':
   'Sem cadastro, email ou senha. Um código privado conecta seu notebook e celular, sem tornar seus dados públicos.';
  return '<div class="cuiudo-auth-backdrop"><section class="cuiudo-auth-dialog" role="dialog" aria-modal="true" aria-labelledby="cuiudo-account-title">'+
   '<div class="cuiudo-auth-head"><div><span>✝ CUIÚDO PESSOAL</span><h2 id="cuiudo-account-title">Sincronizar aparelhos</h2></div>'+
   '<button type="button" data-sync-action="close" aria-label="Fechar">×</button></div>'+
   '<p class="cuiudo-auth-description">'+esc(message)+'</p>'+
   (ui.user?
    '<p class="cuiudo-auth-email">☁ Sincronização ativa neste aparelho.</p>'+
    (secret()?'<div class="cuiudo-auth-actions"><button type="button" data-sync-action="show-code">'+
      (ui.showCode?'Ocultar código':'Ver código para outro aparelho')+'</button></div>'+
      (ui.showCode?'<div class="cuiudo-solo-code"><code>'+esc(secret())+'</code>'+
       '<button type="button" data-sync-action="copy-code">Copiar código</button></div>':''):
      '<p class="cuiudo-auth-hint">O código original não está disponível neste navegador. Aparelhos já conectados continuam funcionando.</p>')+
    '<div class="cuiudo-auth-actions"><button type="button" data-sync-action="refresh">Sincronizar agora</button>'+
    '<button type="button" data-sync-action="logout">Desconectar este aparelho</button></div>':
    '<div class="cuiudo-auth-modes"><button type="button" data-sync-action="mode" data-mode="start" aria-pressed="'+(ui.mode==='start')+'">Primeiro aparelho</button>'+
    '<button type="button" data-sync-action="mode" data-mode="join" aria-pressed="'+(ui.mode==='join')+'">Outro aparelho</button></div>'+
    (ui.mode==='start'?
      '<p class="cuiudo-auth-description">Toque uma vez para criar um código só seu. Não é necessário cadastrar nada.</p>'+
      '<button type="button" class="cuiudo-solo-primary" data-sync-action="create" '+(ui.busy||ui.available===false?'disabled':'')+'>Ativar sincronização</button>':
      '<form id="cuiudo-solo-form" class="cuiudo-auth-form">'+
      '<label>Código privado do primeiro aparelho<input type="text" name="code" autocomplete="off" autocapitalize="off" spellcheck="false" minlength="64" maxlength="90" required placeholder="Cole seu código pessoal"></label>'+
      '<button type="submit" '+(ui.busy||ui.available===false?'disabled':'')+'>Conectar aparelho</button></form>')+
    '<p class="cuiudo-auth-hint">Guarde o código em lugar seguro. Quem tiver acesso a ele poderá ver seus dados e não existe recuperação automática.</p>')+
   '<p class="cuiudo-sync-message" role="status" aria-live="polite">'+esc(ui.status||'Suas metas continuam neste aparelho mesmo sem internet.')+'</p>'+
   '</section></div>';
 }
 renderShell=function(html){
  const button='<button type="button" class="cuiudo-account-toggle" data-sync-action="open" title="Conta e sincronização" aria-label="'+esc(label()+' e sincronização')+'">'+
   '<span aria-hidden="true">'+(ui.user?'☁':'⇄')+'</span><span class="cuiudo-account-text">'+esc(ui.user?'Sincronizado':label())+'</span></button>';
  const notice=ui.user?
   '<div class="cuiudo-cloud-alert cuiudo-cloud-active" role="status">☁ Sincronização ligada · <button type="button" data-sync-action="open">Conferir nuvem</button></div>':
   '<div class="cuiudo-cloud-alert" role="status">⇄ Metas salvas somente neste aparelho. <button type="button" data-sync-action="open">Ativar sincronização sem cadastro</button></div>';
  const goalHint=ui.user?
    '<div class="cuiudo-goals-sync-hint cuiudo-goals-sync-connected" role="status">'+
      '<strong>☁ Seus aparelhos podem compartilhar as metas.</strong><span>'+esc(ui.status||'Conectado ao D1')+'</span>'+
      '<button type="button" data-sync-action="refresh">Sincronizar agora ↻</button></div>':
    '<div class="cuiudo-goals-sync-hint" role="status">'+
      '<strong>⚠ Estas metas ainda não estão na nuvem.</strong>'+
      '<span>Para aparecerem no celular: neste navegador escolha <b>Primeiro aparelho</b>; no celular escolha <b>Outro aparelho</b> e cole o mesmo código.</span>'+
      '<button type="button" data-sync-action="open">☁ Conectar metas do PC e celular ↗</button></div>';
  return oldShell(html)
   .replace('<div class="header-tools">','<div class="header-tools">'+button)
   .replace('<form id="cuiudo-goal-form"',goalHint+'<form id="cuiudo-goal-form"')
   .replace('<main class="main" id="main-content">',''+accountPanel()+'<main class="main" id="main-content">'+notice);
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
  if(!ui.user||!supported||ui.busy||Date.now()<retryAt)return;
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
   if(result.status===401){ui.user=null;ui.status='Sessão encerrada. Reconecte com seu código pessoal.';render();return;}
   if(result.status>=400)throw new Error(result.error||'Falha ao consultar dados.');
   const remote=result.state||{},local=snapshot(),owner=getOwner();
   const sameOwner=!owner||owner===ui.user.id;
   const prefer=isDirty()&&sameOwner;
   let combined;
   if(!sameOwner){
    // Não importamos automaticamente dados da conta anterior para a atual.
    try{localStorage.setItem('cuiudo-backup-conta-anterior',JSON.stringify(local));}catch{}
    combined=remote;
   }else if(owner===ui.user.id&&!prefer){
    // Aparelho já sincronizado, sem mudança pendente: o D1 é a fonte oficial.
    // Evita trazer de volta metas já apagadas no outro aparelho.
    combined=remote;
   }else{
    // Primeiro pareamento: importa metas locais anteriores à nuvem.
    combined=merge(remote,local,prefer);
   }
   ui.revision=result.revision||0;
   applyData(combined);
   try{localStorage.setItem(OWNER,ui.user.id);}catch{}
   if(JSON.stringify(combined)!==JSON.stringify(remote)||prefer){
    setDirty(true);
    ui.status='Metas locais encontradas. Enviando para a nuvem…';
   }else{
    setDirty(false);ui.status='Dados carregados e atualizados no D1.';
   }
   ui.available=true;
  }catch(e){ui.status=String(e.message||e);}
  finally{working=false;render();if(isDirty()&&ui.user)schedule();}
 }
 async function flush(){
  if(!ui.user||working||!isDirty())return;
  working=true;
  const sentSequence=changeSequence,data=snapshot();
  try{
   const result=await api('sync',{method:'PUT',body:JSON.stringify({revision:ui.revision,state:data})});
   if(result.status===409){retryAt=0;
    ui.revision=result.revision||0;
    const combined=merge(result.state||{},snapshot(),true);
    applyData(combined);
    setDirty(true);ui.status='Conflito de versões resolvido. Salvando novamente…';
    return;
   }
   if(result.status===401){ui.user=null;ui.status='Sessão expirada. Reconecte com seu código pessoal.';return;}
   if(result.status>=400)throw new Error(result.error||'Não foi possível salvar.');
   retryAt=0;ui.revision=result.revision;
   if(sentSequence===changeSequence){
    setDirty(false);ui.status='Salvo na nuvem.';
   }else{
    setDirty(true);ui.status='Sincronizando novas alterações…';
   }
  }catch(e){retryAt=Date.now()+30000;ui.status='Salvo neste aparelho. A nuvem está indisponível: '+String(e.message||e);}
  finally{working=false;if(ui.open)render();if(isDirty()&&ui.user&&navigator.onLine)schedule();}
 }
 async function checkSession(){
  if(!supported){ui.available=false;return;}
  try{
   const result=await api('auth');
   if(result.status>=400){ui.available=false;ui.status=result.error||'D1 indisponível.';return;}
   ui.available=true;
   if(result.user){ui.user=result.user;await pull({initial:true});}
   else if(secret())await pair('join',secret(),true);
  }catch(e){ui.available=false;ui.status=String(e.message||e);}
  render();
 }
 async function pair(action,code='',automatic=false){
  if(ui.busy)return;
  ui.busy=true;ui.status=automatic?'Reconectando seu aparelho…':'Ativando a sincronização…';
  if(!automatic)render();
  try{
   const result=await api('solo',{method:'POST',body:JSON.stringify({action,code})});
   if(result.status>=400)throw new Error(result.error||'Não foi possível conectar.');
   if(result.code){try{localStorage.setItem(SOLO,result.code);}catch{}}
   else if(code){try{localStorage.setItem(SOLO,code.trim().replace(/[\s-]/g,'').toLowerCase());}catch{}}
   ui.user=result.user;ui.revision=0;ui.available=true;
   ui.showCode=action==='create';
   ui.status=action==='create'?
    'Código criado. Copie e cole no celular em Outro aparelho. Suas metas estão sendo enviadas.':
    'Código aceito. Este aparelho vai compartilhar as mesmas metas do primeiro.';
   ui.busy=false;
   await pull({initial:true});
  }catch(e){ui.status=String(e.message||e);}
  finally{ui.busy=false;render();if(ui.user&&isDirty())schedule();}
 }
 async function logout(){
  if(ui.busy)return;
  ui.busy=true;
  if(isDirty())await flush();
  if(isDirty()){ui.status='Sincronize antes de sair para não perder as alterações deste aparelho.';ui.busy=false;render();return;}
  try{await api('auth',{method:'POST',body:JSON.stringify({action:'logout'})});}catch{}
  ui.user=null;ui.revision=0;ui.open=false;ui.busy=false;
  setDirty(false);
  try{localStorage.removeItem(OWNER);localStorage.removeItem(SOLO);}catch{}
  // Uso pessoal: desconectar não deve apagar metas, diário ou progresso offline.
  // O próximo pareamento faz mesclagem dos dados locais com o banco escolhido.
  ui.status='Dispositivo desconectado. Seus dados locais foram mantidos.';
  render();
 }
 // Capture: o app principal renderiza após cliques, mesmo para ações desconhecidas.
 app.addEventListener('click',event=>{
  const b=event.target.closest?.('[data-sync-action]');if(!b)return;
  event.preventDefault();event.stopImmediatePropagation();
  const action=b.dataset.syncAction;
  if(action==='open'){ui.open=true;render();}
  else if(action==='close'){ui.open=false;render();}
  else if(action==='mode'){ui.mode=b.dataset.mode==='join'?'join':'start';ui.status='';render();}
  else if(action==='create')pair('create');
  else if(action==='show-code'){ui.showCode=!ui.showCode;render();}
  else if(action==='copy-code'){if(navigator.clipboard?.writeText)navigator.clipboard.writeText(secret()).then(()=>{ui.status='Código copiado. Cole no outro aparelho.';render();},()=>{ui.status='Copie o código manualmente.';render();});}
  else if(action==='refresh'){if(isDirty())flush();else pull();}
  else if(action==='logout')logout();
 },true);
 app.addEventListener('submit',event=>{
  if(event.target.id!=='cuiudo-solo-form')return;
  event.preventDefault();event.stopImmediatePropagation();
  const form=event.target;
  const code=form.querySelector('[name=code]')?.value||'';
  pair('join',code);
 },true);
 window.addEventListener('online',()=>{if(ui.user){if(isDirty())schedule();else pull();}});
 document.addEventListener('visibilitychange',()=>{
  if(!document.hidden&&ui.user){if(isDirty())schedule();else pull();}
 });
 window.setInterval(()=>{if(ui.user&&!document.hidden){if(isDirty())schedule();else pull();}},45000);
 render();
 checkSession();
})();
