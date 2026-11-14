/* Terço Premium — foco, oração imersiva, Lectio Divina, backups e lembretes.
 * Dados espirituais e preferências: somente localStorage (nunca D1 público).
 * Não gera notificações push quando o navegador está fechado.
 */
(function(){
 'use strict';
 const PREF_KEY='terco-premium-preferencias-v1';
 const SNAP_KEY='terco-metas-copias-v1';
 const LECTIO_KEY='terco-lectio-anotacoes-v1';
 const PRAYER_KEY='terco-ultimo-misterio-v1';
 const TEXT={
  pt:{lectio:'Lectio Divina',focus:'Modo foco',openFocus:'Concentrar',exit:'Sair',start:'Iniciar',pause:'Pausar',resume:'Retomar',
   complete:'Concluir meta',tools:'Proteção e recuperação',backup:'Cópias locais',export:'Exportar metas (JSON)',import:'Importar metas',
   restore:'Restaurar',trash:'Lixeira',empty:'Nenhuma meta recuperável na lixeira.',reminder:'Lembrete diário',
   reminderInfo:'O aviso funciona quando o aplicativo está ativo. Em segundo plano ou fechado, o sistema pode impedir a notificação.',
   permit:'Permitir avisos',schedule:'Salvar horário',saved:'Salvo neste aparelho',steps:['Ler','Meditar','Rezar','Contemplar','Agir'],
   prompt:['Leia o trecho atentamente, sem pressa.','O que Deus me ensina nesta passagem?','Responda a Deus com sinceridade.','Permaneça em silêncio diante do Senhor.','Qual gesto concreto de caridade colocarei em prática?'],
   scripture:'Palavra de Deus',reflection:'Minha reflexão privada',save:'Salvar reflexão',privacy:'Anotações privadas: permanecem somente neste aparelho.',
   immersive:'Oração imersiva',restoreSession:'Retomar de onde parei',snapshot:'Restaurar cópia local',
   importWarning:'As metas importadas serão publicadas no quadro compartilhado, acessível a qualquer visitante. Continuar?',
   restoreWarning:'Restaurar metas ausentes desta cópia no quadro público? Metas existentes não serão substituídas.',
   unavailable:'Ação indisponível neste aparelho.',done:'Concluído'},
  en:{lectio:'Lectio Divina',focus:'Focus mode',openFocus:'Focus',exit:'Exit',start:'Start',pause:'Pause',resume:'Resume',
   complete:'Complete goal',tools:'Backup and recovery',backup:'Local backups',export:'Export goals (JSON)',import:'Import goals',
   restore:'Restore',trash:'Trash',empty:'No recoverable goals.',reminder:'Daily reminder',
   reminderInfo:'Alerts run while the app is active. Phones may suspend notifications when it is closed.',
   permit:'Allow alerts',schedule:'Save time',saved:'Saved on this device',steps:['Read','Meditate','Pray','Contemplate','Act'],
   prompt:['Read slowly.','What does God teach me here?','Speak to God honestly.','Remain in silence.','What loving action can I take?'],
   scripture:'Scripture',reflection:'My private reflection',save:'Save reflection',privacy:'Private notes stay on this device.',
   immersive:'Immersive prayer',restoreSession:'Resume prayer',snapshot:'Restore local backup',
   importWarning:'Imported goals will be shared publicly. Continue?',restoreWarning:'Restore missing goals into the public board? Existing goals will not be replaced.',
   unavailable:'Not available on this device.',done:'Done'}
 };
 const lang=()=>TEXT[cuiudoLocale()]||TEXT.pt;
 function read(key,fallback){
  try{const v=JSON.parse(localStorage.getItem(key)||'null');return v===null?fallback:v;}catch{return fallback}
 }
 function write(key,value){try{localStorage.setItem(key,JSON.stringify(value));return true}catch{return false}}
 const prefs=read(PREF_KEY,{focusMinutes:25,reminderTime:'08:00',reminderOn:false,lastAlert:''});
 let activeFocus=null,snapshots=read(SNAP_KEY,[]);
 if(!Array.isArray(snapshots))snapshots=[];
 function snapshotData(){
  const goals=[];
  for(const [day,items] of Object.entries(state.dailyGoalDays||{})){
   if(!/^\d{4}-\d{2}-\d{2}$/.test(day)||!Array.isArray(items))continue;
   for(const g of items){
    if(typeof g.id!=='string'||typeof g.text!=='string'||!g.text.trim())continue;
    goals.push({day,id:g.id,text:g.text,status:g.status||'pending',
     priority:['high','medium','low'].includes(g.priority)?g.priority:'medium'});
   }
  }
  return goals;
 }
 function backup(){
  const goals=snapshotData(),digest=JSON.stringify(goals);
  if(!goals.length||snapshots[0]?.digest===digest)return false;
  snapshots.unshift({at:new Date().toISOString(),digest,goals});
  snapshots=snapshots.slice(0,12);
  return write(SNAP_KEY,snapshots);
 }
 function validGoal(g){
  return g&&typeof g==='object'&&/^\d{4}-\d{2}-\d{2}$/.test(g.day||'')&&
   typeof g.id==='string'&&/^[A-Za-z0-9_.:-]{6,80}$/.test(g.id)&&
   typeof g.text==='string'&&g.text.trim().length>0&&g.text.length<=180&&
   ['pending','done','missed'].includes(g.status)&&
   ['high','medium','low'].includes(g.priority||'medium');
 }
 function addMissing(goals,limit=30){
  let added=0;
  for(const row of goals){
   if(added>=limit)break;
   if(!validGoal(row))continue;
   const items=state.dailyGoalDays?.[row.day]||[];
   if(items.length>=30||items.some(x=>x.id===row.id)||
      Object.values(state.dailyGoalDays||{}).some(a=>Array.isArray(a)&&a.some(x=>x.id===row.id)))continue;
   const goal={id:row.id,text:row.text,status:row.status,
    priority:row.priority||'medium',duration_sec:0,remaining_sec:0,
    timer_started_at:null,timer_state:'none'};
   state.dailyGoalDays??={};state.dailyGoalDays[row.day]??=[];
   state.dailyGoalDays[row.day].unshift(goal);
   window.cuiudoGlobalGoals?.change('upsert',row.day,goal);
   added++;
  }
  if(added){save();backup();render()}
  return added;
 }
 function foundGoal(id){
  for(const [day,items] of Object.entries(state.dailyGoalDays||{})){
   const goal=Array.isArray(items)?items.find(x=>x.id===id):null;
   if(goal)return {day,goal};
  }
  return null;
 }
 function focusPanel(){
  if(!activeFocus)return '';
  const found=foundGoal(activeFocus);
  if(!found||found.goal.status!=='pending'){activeFocus=null;return ''}
  const {goal}=found,t=lang();
  const seconds=goal.duration_sec?cuiudoTimerSeconds(goal):Math.max(60,Number(prefs.focusMinutes)||25)*60;
  const running=goal.timer_state==='running',paused=goal.timer_state==='paused';
  const status=running?'Sessão em andamento':paused?'Sessão pausada':seconds===0?'Sessão encerrada':'Escolha o tempo e comece';
  return '<div class="cuiudo-focus-backdrop"><button type="button" class="cuiudo-focus-scrim" data-action="cuiudo-focus-close" aria-label="'+escapeHtml(t.exit)+'"></button>'+
   '<section class="cuiudo-focus-dialog" role="dialog" aria-modal="true" aria-labelledby="cuiudo-focus-heading">'+
   '<div class="cuiudo-focus-top"><span>✝ DISCIPLINA E PRESENÇA</span><button type="button" data-action="cuiudo-focus-close" aria-label="'+escapeHtml(t.exit)+'">×</button></div>'+
   '<h2 id="cuiudo-focus-heading">'+escapeHtml(goal.text)+'</h2>'+
   '<p class="cuiudo-focus-status">'+escapeHtml(status)+'</p>'+
   '<strong class="cuiudo-focus-clock" data-cuiudo-clock="'+escapeHtml(goal.id)+'">'+cuiudoTimerFormat(seconds)+'</strong>'+
   '<div class="cuiudo-focus-actions"><label>Minutos <input id="cuiudo-focus-minutes" type="number" min="1" max="120" step="1" value="'+
    Math.max(1,Math.min(120,Number(prefs.focusMinutes)||25))+'" '+(running?'disabled':'')+'></label>'+
    '<button type="button" class="btn btn-primary" data-action="cuiudo-focus-'+(running?'pause':paused?'resume':'start')+'">'+
    escapeHtml(running?t.pause:paused?t.resume:t.start)+'</button>'+
    '<button type="button" class="btn btn-secondary" data-action="cuiudo-focus-done">'+escapeHtml(t.complete)+'</button></div>'+
   '<p class="cuiudo-focus-verse">“Tudo o que fizerdes, fazei-o de coração.” — Cl 3,23</p>'+
   '</section></div>';
 }
 function toolsPanel(){
  const t=lang(),trash=window.cuiudoGlobalGoals?.getTrash?.()||[];
  const options=snapshots.map((s,i)=>'<option value="'+i+'">'+escapeHtml(new Date(s.at).toLocaleString())+
   ' · '+s.goals.length+' metas</option>').join('');
  return '<div class="cuiudo-premium-tools"><details class="cuiudo-premium-card"><summary><span>⛨</span><strong>'+
   escapeHtml(t.tools)+'</strong><small>Metas, lixeira e exportação</small></summary>'+
   '<div class="cuiudo-premium-inside"><div class="cuiudo-premium-actions">'+
   '<button type="button" data-action="cuiudo-premium-export">'+escapeHtml(t.export)+'</button>'+
   '<label class="cuiudo-premium-file">'+escapeHtml(t.import)+'<input id="cuiudo-premium-import" type="file" accept="application/json,.json"></label></div>'+
   '<div class="cuiudo-premium-restore"><label>'+escapeHtml(t.backup)+
   '<select id="cuiudo-premium-snapshots"><option value="">Selecionar cópia</option>'+options+'</select></label>'+
   '<button type="button" data-action="cuiudo-premium-restore-snapshot" '+(snapshots.length?'':'disabled')+'>'+escapeHtml(t.snapshot)+'</button></div>'+
   '<details class="cuiudo-premium-trash"><summary>'+escapeHtml(t.trash)+' ('+trash.length+')</summary>'+
   (trash.length?trash.slice(0,15).map(g=>
    '<div class="cuiudo-trash-item"><span>'+escapeHtml(g.text)+'</span><button type="button" data-action="cuiudo-premium-restore-trash" data-id="'+escapeHtml(g.id)+'">'+escapeHtml(t.restore)+'</button></div>'
   ).join(''):'<p>'+escapeHtml(t.empty)+'</p>')+'</details>'+
   '<p class="cuiudo-premium-privacy">Metas são públicas. As cópias locais ficam somente neste aparelho.</p></div></details>'+
   '<details class="cuiudo-premium-card"><summary><span>◷</span><strong>'+escapeHtml(t.reminder)+
   '</strong><small>Horário personalizado</small></summary>'+
   '<div class="cuiudo-premium-inside"><p>'+escapeHtml(t.reminderInfo)+'</p>'+
   '<div class="cuiudo-premium-actions"><label><input type="checkbox" id="cuiudo-reminder-enabled" '+(prefs.reminderOn?'checked':'')+
   '> Ativar</label><input type="time" id="cuiudo-reminder-time" value="'+escapeHtml(prefs.reminderTime||'08:00')+'">'+
   '<button type="button" data-action="cuiudo-premium-save-reminder">'+escapeHtml(t.schedule)+'</button>'+
   '<button type="button" data-action="cuiudo-premium-permit">'+escapeHtml(t.permit)+'</button></div></div></details></div>';
 }
 function goalExtras(){return toolsPanel()+focusPanel()}
 function lectioRead(){const v=read(LECTIO_KEY,{});return v&&typeof v==='object'&&!Array.isArray(v)?v:{}}
 function lectioPage(){
  const t=lang(),g=groups[dayGroup()],index=Math.max(0,Math.min(4,Number(prefs.lectioIndex)||0)),m=g.mysteries[index];
  const verse=versiculosPorMisterio[m.id],notes=lectioRead(),key=currentDay()+':'+m.id;
  const saved=String(notes[key]||'');
  const text=state.appLang==='en'?verse.en:verse.pt;
  const href=state.appLang==='en'?verse.enSource:verse.ptSource;
  return '<section class="cuiudo-lectio-page"><header><span class="eyebrow">✝ ORAÇÃO COM A PALAVRA</span>'+
   '<h1>'+escapeHtml(t.lectio)+'</h1><p>Leia devagar. Medite com humildade. Reze e transforme a Palavra em caridade.</p></header>'+
   '<div class="cuiudo-lectio-picker" role="group" aria-label="Escolher passagem">'+g.mysteries.map((v,i)=>
    '<button type="button" data-action="cuiudo-lectio-mystery" data-index="'+i+'" aria-pressed="'+(index===i)+'">'+(i+1)+'</button>').join('')+'</div>'+
   '<article class="cuiudo-lectio-verse"><span>'+escapeHtml(t.scripture)+' · '+escapeHtml(verse.ref)+'</span>'+
   '<h2>'+escapeHtml(m.title)+'</h2><blockquote>'+escapeHtml(text)+'</blockquote>'+
   '<a href="'+escapeHtml(href)+'" target="_blank" rel="noopener noreferrer">Ler capítulo completo · fonte ↗</a></article>'+
   '<div class="cuiudo-lectio-steps">'+t.steps.map((name,i)=>
    '<article><span>'+String(i+1).padStart(2,'0')+'</span><div><h3>'+escapeHtml(name)+'</h3>'+
    '<p>'+escapeHtml(t.prompt[i])+'</p></div></article>').join('')+'</div>'+
   '<form id="cuiudo-lectio-form"><label for="cuiudo-lectio-note">'+escapeHtml(t.reflection)+'</label>'+
   '<textarea id="cuiudo-lectio-note" rows="4" maxlength="2000">'+escapeHtml(saved)+'</textarea>'+
   '<p>'+escapeHtml(t.privacy)+'</p>'+
   '<button class="btn btn-primary" type="submit">'+escapeHtml(t.save)+'</button></form></section>';
 }
 function notify(title,body,tag){
  if(typeof Notification==='undefined'||Notification.permission!=='granted')return;
  const opts={body,tag,icon:'./assets/favicon-sao-bento.svg'};
  if(navigator.serviceWorker?.ready){
   navigator.serviceWorker.ready.then(reg=>reg.showNotification(title,opts)).catch(()=>{try{new Notification(title,opts)}catch{}});
  }else try{new Notification(title,opts)}catch{}
 }
 function checkReminder(){
  if(!prefs.reminderOn||typeof Notification==='undefined'||Notification.permission!=='granted')return;
  const d=new Date(),today=currentDay(),time=String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');
  if(time<prefs.reminderTime||prefs.lastAlert===today)return;
  prefs.lastAlert=today;write(PREF_KEY,prefs);
  notify('Terço com Ação','Reserve um momento para rezar e cumprir seus deveres.','cuiudo-reminder-'+today);
 }
 const lastPrayer=read(PRAYER_KEY,null);
 if(lastPrayer?.day===currentDay()&&groupNames.includes(lastPrayer.group)&&
    Number.isInteger(lastPrayer.mystery)&&lastPrayer.mystery>=0&&lastPrayer.mystery<=4){
  state.group=lastPrayer.group;state.mystery=lastPrayer.mystery;
 }
 function savePrayerPoint(){
  write(PRAYER_KEY,{day:currentDay(),group:state.group,mystery:state.mystery,progress:readProgress()[state.mystery]||0});
 }
 if(!combatTabs.some(x=>x.id==='lectio'))combatTabs.push({id:'lectio',label:'Lectio Divina',mobile:'Lectio',icon:'book'});
 for(const name of ['pt','en','es','la'])cuiudoNav[name].lectio='Lectio Divina';
 const beforeRosary=cuiudoRosary;
 cuiudoRosary=function(){
  const t=lang(),on=Boolean(state.rosaryImmersive),point=read(PRAYER_KEY,null);
  const resume=point?.day===currentDay()&&!on?
   '<button type="button" data-action="cuiudo-rosary-resume">'+escapeHtml(t.restoreSession)+'</button>':'';
  return '<div class="cuiudo-prayer-toolbar"><button type="button" data-action="cuiudo-rosary-immersive" aria-pressed="'+on+'">'+
    (on?'← '+escapeHtml(t.exit):'◎ '+escapeHtml(t.immersive))+'</button>'+resume+'</div>'+beforeRosary();
 };
 const beforeRender=render;
 render=function(){
  if(state.tab==='lectio'){
   setTheme();document.documentElement.lang=state.appLang==='en'?'en':'pt-BR';
   app.innerHTML=renderShell(lectioPage());document.title='Lectio Divina | Terço';
  }else beforeRender();
  document.documentElement.classList.toggle('cuiudo-rosary-immersive',state.tab==='terco'&&Boolean(state.rosaryImmersive));
  document.documentElement.classList.toggle('cuiudo-focus-lock',Boolean(activeFocus&&foundGoal(activeFocus)));
 };
 window.cuiudoPremium={goalExtras,backup,findGoal:foundGoal};
 backup();
 function syncGoal(found){
  save();backup();
  window.cuiudoGlobalGoals?.change('upsert',found.day,found.goal);
 }
 function focusAction(action){
  const found=foundGoal(activeFocus);if(!found)return;
  const g=found.goal;
  if(action==='start'){
   const minutes=Number(document.getElementById('cuiudo-focus-minutes')?.value||prefs.focusMinutes||25);
   if(!Number.isInteger(minutes)||minutes<1||minutes>120)return;
   prefs.focusMinutes=minutes;write(PREF_KEY,prefs);
   cuiudoTimerCancelAudio(g.id);
   g.duration_sec=minutes*60;g.remaining_sec=g.duration_sec;
   g.timer_started_at=Date.now();g.timer_state='running';cuiudoTimerArmAudio(g);
  }
  if(action==='pause')cuiudoTimerStop(g);
  if(action==='resume'&&g.timer_state==='paused'&&g.remaining_sec>0){
   g.timer_started_at=Date.now();g.timer_state='running';cuiudoTimerArmAudio(g);
  }
  if(action==='done'){
   cuiudoTimerCancelAudio(g.id);cuiudoTimerStop(g);g.status='done';activeFocus=null;
  }
  syncGoal(found);render();
 }
 app.addEventListener('click',e=>{
  const b=e.target.closest?.('[data-action]');if(!b)return;
  const a=b.dataset.action;
  if(a==='cuiudo-focus-open'){activeFocus=b.dataset.id;render();document.querySelector('.cuiudo-focus-dialog button')?.focus();return}
  if(a==='cuiudo-focus-close'){activeFocus=null;render();return}
  if(a.startsWith('cuiudo-focus-')){focusAction(a.slice('cuiudo-focus-'.length));return}
  if(a==='cuiudo-rosary-immersive'){state.rosaryImmersive=!state.rosaryImmersive;save();render();return}
  if(a==='cuiudo-rosary-resume'){
   const old=read(PRAYER_KEY,null);
   if(old&&groupNames.includes(old.group)){state.group=old.group;state.mystery=Math.max(0,Math.min(4,old.mystery||0));render()}
   return;
  }
  if(a==='cuiudo-lectio-mystery'){prefs.lectioIndex=Math.max(0,Math.min(4,Number(b.dataset.index)||0));write(PREF_KEY,prefs);render();return}
  if(a==='cuiudo-premium-export'){
   try{
    const json=JSON.stringify({version:1,exportedAt:new Date().toISOString(),publicGoals:snapshotData()},null,2);
    const blob=new Blob([json],{type:'application/json'});
    const url=URL.createObjectURL(blob),link=document.createElement('a');
    link.href=url;link.download='terco-metas-backup-'+currentDay()+'.json';document.body.append(link);link.click();link.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
   }catch{alert(lang().unavailable)}
   return;
  }
  if(a==='cuiudo-premium-restore-snapshot'){
   const value=document.getElementById('cuiudo-premium-snapshots')?.value;
   if(value===''||!snapshots[Number(value)])return;
   if(!confirm(lang().restoreWarning))return;
   addMissing(snapshots[Number(value)].goals);return;
  }
  if(a==='cuiudo-premium-restore-trash'){
   if(window.cuiudoGlobalGoals?.restore?.(b.dataset.id))backup();
   return;
  }
  if(a==='cuiudo-premium-save-reminder'){
   prefs.reminderOn=Boolean(document.getElementById('cuiudo-reminder-enabled')?.checked);
   const v=document.getElementById('cuiudo-reminder-time')?.value||'08:00';
   if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(v))return;
   prefs.reminderTime=v;write(PREF_KEY,prefs);render();checkReminder();return;
  }
  if(a==='cuiudo-premium-permit'){
   if(typeof Notification==='undefined'){alert(lang().unavailable);return}
   Notification.requestPermission().then(()=>render()).catch(()=>{});return;
  }
  if(['group','mystery','next-mystery','prev-mystery','rosary-hail','add-bead','rosary-father','rosary-glory'].includes(a))
   savePrayerPoint();
 });
 app.addEventListener('change',async e=>{
  if(e.target?.id!=='cuiudo-premium-import')return;
  const file=e.target.files?.[0];if(!file||file.size>150000)return;
  try{
   const payload=JSON.parse(await file.text());
   if(payload?.version!==1||!Array.isArray(payload.publicGoals)||payload.publicGoals.length>300)
    throw new Error('Formato inesperado');
   if(!confirm(lang().importWarning))return;
   const count=addMissing(payload.publicGoals);
   if(count===0)alert('Nenhuma meta nova para importar.');
  }catch{alert('Arquivo JSON inválido ou muito grande.')}
 });
 app.addEventListener('submit',e=>{
  if(e.target?.id!=='cuiudo-lectio-form')return;
  e.preventDefault();
  const group=groups[dayGroup()],i=Math.max(0,Math.min(4,Number(prefs.lectioIndex)||0));
  const key=currentDay()+':'+group.mysteries[i].id;
  const notes=lectioRead(),value=String(e.target.querySelector('textarea')?.value||'').slice(0,2000);
  if(value.trim())notes[key]=value;else delete notes[key];
  if(write(LECTIO_KEY,notes))render();
 });
 document.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&activeFocus){activeFocus=null;render();return}
  if(e.key==='Tab'&&activeFocus){
   const dlg=document.querySelector('.cuiudo-focus-dialog');if(!dlg)return;
   const buttons=[...dlg.querySelectorAll('button:not([disabled]),input:not([disabled])')];
   if(!buttons.length)return;
   if(e.shiftKey&&document.activeElement===buttons[0]){e.preventDefault();buttons.at(-1).focus()}
   else if(!e.shiftKey&&document.activeElement===buttons.at(-1)){e.preventDefault();buttons[0].focus()}
  }
 });
 if(typeof window.setInterval==='function')window.setInterval(checkReminder,30000);
 window.addEventListener('focus',checkReminder);
 render();
})();
