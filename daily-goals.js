/* CUIÚDO — checklist do dia, com metas definidas pela própria pessoa.
 * Metas públicas compartilhadas automaticamente pelo D1; diário e intenções são locais.
 */
const cuiudoGoalsText={
 pt:{heading:'Metas de hoje',sub:'Prazo para concluir as metas até meia-noite, no horário de Brasília.',
  label:'Nova meta',placeholder:'Ex.: estudar 40 minutos, rezar o terço, resolver uma pendência',
  add:'Adicionar',done:'Concluí',missed:'Não concluí',reopen:'Reabrir',remove:'Excluir',
  complete:'Concluídas',completed:'Concluída',remaining:'Pendente',undone:'Não concluída',
  empty:'Adicione uma meta para começar.',archive:'Histórico de metas',day:'Dia'},
 en:{heading:"Today's goals",sub:'Complete your goals by midnight, Brasília time.',
  label:'New goal',placeholder:'E.g. study for 40 minutes, pray the Rosary',add:'Add',
  done:'Completed',missed:'Not completed',reopen:'Reopen',remove:'Delete',
  complete:'Completed',completed:'Completed',remaining:'Pending',undone:'Not completed',
  empty:'Add a goal to get started.',archive:'Goal history',day:'Day'},
 es:{heading:'Metas de hoy',sub:'Completa tus metas antes de medianoche, hora de Brasilia.',
  label:'Nueva meta',placeholder:'Ej.: estudiar 40 minutos, rezar el Rosario',add:'Añadir',
  done:'Cumplí',missed:'No cumplí',reopen:'Reabrir',remove:'Eliminar',
  complete:'Cumplidas',completed:'Cumplida',remaining:'Pendiente',undone:'No cumplida',
  empty:'Añade una meta para empezar.',archive:'Historial de metas',day:'Día'},
 la:{heading:'Metas hodiernae',sub:'Proposita ante mediam noctem Brasiliae perfice.',
  label:'Meta nova',placeholder:'Ex.: quadraginta minuta studere, Rosarium orare',add:'Adde',
  done:'Complevi',missed:'Non complevi',reopen:'Reclude',remove:'Dele',
  complete:'Completae',completed:'Completa',remaining:'Pendens',undone:'Non completa',
  empty:'Propositum novum adde.',archive:'Historia propositorum',day:'Dies'}
};
const cuiudoGoalDayFormat=new Intl.DateTimeFormat('en-CA',{
 timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'
});
function cuiudoGoalDay(now=Date.now()){
 const {year,month,day}=Object.fromEntries(cuiudoGoalDayFormat.formatToParts(now)
  .map(({type,value})=>[type,value]));
 return year+'-'+month+'-'+day;
}
/* Horário real da conclusão, persistido junto à meta e apresentado sempre
 * no fuso de Brasília, mesmo que o visitante esteja em outro fuso. */
const cuiudoCompletedAtLabels={
 pt:'Concluída em',en:'Completed on',es:'Completada el',la:'Completa die'
};
const cuiudoMissedAtLabels={
 pt:'Não concluída em',en:'Marked not completed on',es:'No completada el',la:'Non completa die'
};
function cuiudoGoalMarkedTime(stamp,locale,label,className){
 if(!Number.isSafeInteger(stamp)||stamp<=0)return '';
 const date=new Date(stamp);
 if(!Number.isFinite(date.getTime()))return '';
 const language={pt:'pt-BR',en:'en-US',es:'es-ES',la:'pt-BR'}[locale]||'pt-BR';
 const when=new Intl.DateTimeFormat(language,{
  timeZone:'America/Sao_Paulo',dateStyle:'short',timeStyle:'short'
 }).format(date);
 return '<time class="'+className+'" datetime="'+date.toISOString()+'">'+
  escapeHtml(label+' '+when+' (Brasília)')+'</time>';
}
function cuiudoGoalCompletedTime(goal,locale){
 return cuiudoGoalMarkedTime(goal?.completed_at,locale,
  cuiudoCompletedAtLabels[locale]||cuiudoCompletedAtLabels.pt,'goal-victory-time');
}
function cuiudoGoalMissedTime(goal,locale){
 return cuiudoGoalMarkedTime(goal?.missed_at,locale,
  cuiudoMissedAtLabels[locale]||cuiudoMissedAtLabels.pt,'goal-reality-time');
}
function cuiudoGoalsToday(day=cuiudoGoalDay()){
 const items=state.dailyGoalDays?.[day];
 return Array.isArray(items)?items.filter(goal=>goal&&goal.status!=='deleted'):[];
}
function cuiudoGoalStatus(goal,day,activeDay=cuiudoGoalDay()){
 if(goal.status==='done'||goal.status==='missed')return goal.status;
 return day<activeDay?'missed':'pending';
}
// Pendentes primeiro. Em cada grupo: Alta → Média → Baixa.
// Empates: mais recente primeiro. Concluídas e não concluídas ficam no fim.
// Prioridade ausente em metas antigas equivale a Média, sem alterar os registros.
// Ordenação apenas visual, estável após a sincronização do D1.
function cuiudoGoalsNewestFirst(goals){
 const createdAt=goal=>{
  const match=/^(\d{13})(?:-|$)/.exec(String(goal?.id||''));
  return match?Number(match[1]):0;
 };
 const finished=goal=>goal?.status==='done'||goal?.status==='missed'?1:0;
 const importance=goal=>({high:0,medium:1,low:2})[goal?.priority]??1;
 return goals.slice().sort((a,b)=>
  finished(a)-finished(b)||importance(a)-importance(b)||createdAt(b)-createdAt(a));
}
const cuiudoPermanentNotes={
 pt:'Rezar terço e se cuidar espiritualmente e esteticamente',
 en:'Pray the Rosary and care for yourself spiritually and aesthetically',
 es:'Rezar el rosario y cuidarse espiritual y estéticamente',
 la:'Rosarium orare et curam animae corporisque colere'
};
const cuiudoPinnedLabels={
 pt:['COMPROMISSO ESSENCIAL','Fé, disciplina e cuidado de si — todos os dias.'],
 en:['ESSENTIAL COMMITMENT','Faith, discipline and self-care — every day.'],
 es:['COMPROMISO ESENCIAL','Fe, disciplina y cuidado de uno mismo — cada día.'],
 la:['PROPOSITUM COTIDIANUM','Fides, disciplina et cura sui — cotidie.']
};
/* Anotações temporárias do quadro, guardadas somente neste navegador. */
const cuiudoObstacleKey='terco-obstaculos-diarios-v1';
const cuiudoGodMomentKey='terco-presenca-de-deus-v1';
function cuiudoDailyNoteRead(key){
 try{return (localStorage.getItem(key+':'+cuiudoGoalDay())||'').slice(0,650);}
 catch{return '';}
}
function cuiudoDailyNoteSave(key,value){
 try{
  const dayKey=key+':'+cuiudoGoalDay(),text=String(value||'').slice(0,650);
  if(text.trim())localStorage.setItem(dayKey,text);
  else localStorage.removeItem(dayKey);
  return true;
 }catch{return false;}
}
function cuiudoClearOldDailyNotes(day){
 for(const key of [cuiudoObstacleKey,cuiudoGodMomentKey]){
  try{
   const prefix=key+':',dayKey=prefix+day;
   const legacy=localStorage.getItem(key);
   if(legacy!==null){
    // As versões anteriores não registravam a data da última edição.
    let entries={};
    try{entries=JSON.parse(legacy)||{};}catch{}
    const last=Object.keys(entries).sort().reverse()
     .find(date=>/^\d{4}-\d{2}-\d{2}$/.test(date)&&typeof entries[date]==='string'&&entries[date].trim());
    if(last&&localStorage.getItem(dayKey)===null)
     localStorage.setItem(dayKey,entries[last].slice(0,650));
    localStorage.removeItem(key);
   }
   for(let i=localStorage.length-1;i>=0;i--){
    const stored=localStorage.key(i);
    if(stored?.startsWith(prefix)&&stored<dayKey)localStorage.removeItem(stored);
   }
  }catch{}
 }
}
let cuiudoActiveGoalDay=cuiudoGoalDay();
cuiudoClearOldDailyNotes(cuiudoActiveGoalDay);

const cuiudoObstacleLabels={
 pt:['O que atrapalhou seu dia?','Anote o que dificultou suas metas. Reconheça, aprenda e recomece.','Ex.: distrações, cansaço, imprevistos ou falta de organização…','Salvo só neste aparelho · privado','Erro ao salvar neste aparelho'],
 en:['What got in your way today?','Note the obstacles, learn and begin again.','E.g. distractions, tiredness, unexpected events…','Saved only on this device · private','Unable to save on this device'],
 es:['¿Qué dificultó tu día?','Anota los obstáculos, aprende y vuelve a empezar.','Ej.: distracciones, cansancio, imprevistos…','Guardado solo en este dispositivo · privado','No se pudo guardar'],
 la:['Quid hodie impedivit?','Impedimenta nota, disce et rursus incipe.','Ex.: distractio, lassitudo, difficultates…','In hoc tantum instrumento servatum','Servari non potuit']
};
function cuiudoObstacleRead(){return cuiudoDailyNoteRead(cuiudoObstacleKey);}
function cuiudoObstacleSave(value){return cuiudoDailyNoteSave(cuiudoObstacleKey,value);}
function cuiudoObstacleBox(locale){
 const t=cuiudoObstacleLabels[locale]||cuiudoObstacleLabels.pt;
 return '<aside class="goals-obstacle-box" aria-labelledby="goals-obstacle-title">'+
  '<div class="goals-obstacle-head"><span class="goals-obstacle-symbol" aria-hidden="true">✎</span>'+
  '<div><strong id="goals-obstacle-title">'+escapeHtml(t[0])+'</strong><p>'+escapeHtml(t[1])+'</p></div></div>'+
  '<label class="sr-only" for="cuiudo-obstacle-text">'+escapeHtml(t[0])+'</label>'+
  '<textarea id="cuiudo-obstacle-text" class="goals-obstacle-input" rows="2" maxlength="650" placeholder="'+escapeHtml(t[2])+'">'+escapeHtml(cuiudoObstacleRead())+'</textarea>'+
  '<div class="goals-obstacle-bottom"><span class="goals-obstacle-status" role="status" aria-live="polite">'+escapeHtml(t[3])+'</span>'+
  '<button type="button" class="goals-obstacle-delete" data-action="cuiudo-obstacle-delete">'+
  escapeHtml({pt:'Excluir anotação',en:'Delete note',es:'Eliminar anotación',la:'Dele annotationem'}[locale]||'Excluir anotação')+
  '</button></div></aside>';
}

const cuiudoGodMomentLabels={
 pt:['Onde vejo Deus no meu dia?','Reconheça uma graça, um gesto de amor ou um momento de oração.','Ex.: na minha vida, no terço, no cuidado recebido…','Salvo só neste aparelho · privado','Erro ao salvar neste aparelho','Excluir anotação'],
 en:['Where did I see God today?','Recall a grace, a kind gesture or a moment of prayer.','E.g. in my life, during the Rosary, in someone’s kindness…','Saved only on this device · private','Unable to save on this device','Delete note'],
 es:['¿Dónde veo a Dios en mi día?','Reconoce una gracia, un gesto de amor o un momento de oración.','Ej.: en mi vida, en el rosario, en la ayuda recibida…','Guardado solo en este dispositivo · privado','No se pudo guardar','Eliminar nota'],
 la:['Ubi Deum hodie conspexi?','Gratiam vel caritatem vel orationis momentum memorare.','Ex.: in vita, rosario, auxilio accepto…','In hoc instrumento servatum · privatum','Servari non potuit','Delere']
};
function cuiudoGodMomentRead(){return cuiudoDailyNoteRead(cuiudoGodMomentKey);}
function cuiudoGodMomentSave(value){return cuiudoDailyNoteSave(cuiudoGodMomentKey,value);}
function cuiudoGodMomentBox(locale){
 const t=cuiudoGodMomentLabels[locale]||cuiudoGodMomentLabels.pt;
 return '<aside class="goals-obstacle-box goals-god-moment-box" aria-labelledby="goals-god-moment-title">'+
  '<div class="goals-obstacle-head"><span class="goals-obstacle-symbol" aria-hidden="true">✝</span>'+
  '<div><strong id="goals-god-moment-title">'+escapeHtml(t[0])+'</strong><p>'+escapeHtml(t[1])+'</p></div></div>'+
  '<label class="sr-only" for="cuiudo-god-moment-text">'+escapeHtml(t[0])+'</label>'+
  '<textarea id="cuiudo-god-moment-text" class="goals-obstacle-input" rows="2" maxlength="650" placeholder="'+escapeHtml(t[2])+'">'+escapeHtml(cuiudoGodMomentRead())+'</textarea>'+
  '<div class="goals-obstacle-bottom"><span class="goals-obstacle-status" role="status" aria-live="polite">'+escapeHtml(t[3])+'</span>'+
  '<button type="button" class="goals-obstacle-delete" data-action="cuiudo-god-moment-delete">'+escapeHtml(t[5])+'</button></div></aside>';
}

/* Compromisso diário persistente e particular deste navegador. */
const cuiudoEssentialKey='terco-compromisso-essencial-v1';
const cuiudoEssentialLabels={
 pt:['Concluído hoje','Marcar compromisso como concluído hoje'],
 en:['Completed today','Mark this commitment as completed today'],
 es:['Completado hoy','Marcar compromiso como completado hoy'],
 la:['Hodie completum','Hodie complevi']
};
function cuiudoEssentialDone(day=cuiudoGoalDay()){
 try{
  const all=JSON.parse(localStorage.getItem(cuiudoEssentialKey)||'{}');
  return !!(all&&typeof all==='object'&&!Array.isArray(all)&&all[day]===true);
 }catch{return false;}
}
function cuiudoEssentialSave(done){
 try{
  const data=JSON.parse(localStorage.getItem(cuiudoEssentialKey)||'{}');
  const all=data&&typeof data==='object'&&!Array.isArray(data)?data:{};
  const day=cuiudoGoalDay();
  if(done)all[day]=true;else delete all[day];
  // Histórico do compromisso não é apagado automaticamente.
  localStorage.setItem(cuiudoEssentialKey,JSON.stringify(all));return true;
 }catch{return false;}
}
function cuiudoEssentialCard(locale){
 const done=cuiudoEssentialDone(),t=cuiudoEssentialLabels[locale]||cuiudoEssentialLabels.pt;
 return '<aside class="goals-permanent-note goals-essential-footer'+(done?' is-completed':'')+'" aria-label="'+escapeHtml(cuiudoPinnedLabels[locale][0])+'">'+
  '<span class="goals-note-icon" aria-hidden="true">✝</span>'+
  '<div><span class="goals-note-eyebrow">✦ '+escapeHtml(cuiudoPinnedLabels[locale][0])+'</span>'+
  '<strong>'+escapeHtml(cuiudoPermanentNotes[locale])+'</strong>'+
  '<small>'+escapeHtml(cuiudoPinnedLabels[locale][1])+'</small></div>'+
  '<label class="goals-essential-check"><input type="checkbox" id="cuiudo-essential-done" '+
    (done?'checked ':'')+'aria-label="'+escapeHtml(t[1])+'">'+
   '<span class="goals-essential-label">'+escapeHtml(t[0])+'</span></label></aside>';
}
/* Cristiano Ronaldo, entrevista à TVI em agosto de 2014. */
const cuiudoRonaldoQuote={
 pt:['"Tenho de pensar que sou o melhor. Posso não ser, mas na minha cabeça sou o melhor."','Cristiano Ronaldo · TVI, 2014'],
 en:['"I have to believe I am the best. Maybe I am not, but in my mind I am the best."','Cristiano Ronaldo · TVI, 2014'],
 es:['"Tengo que pensar que soy el mejor. Puede que no lo sea, pero en mi mente soy el mejor."','Cristiano Ronaldo · TVI, 2014'],
 la:['"Me optimum esse cogitare debeo. Fortasse non sum; sed in mente mea optimus sum."','Cristianus Ronaldo · TVI, 2014']
};
function cuiudoRonaldoMindset(locale){
 const [quote,source]=cuiudoRonaldoQuote[locale]||cuiudoRonaldoQuote.pt;
 return '<figure class="goals-mindset-quote"><blockquote>'+escapeHtml(quote)+'</blockquote>'+
  '<figcaption>'+escapeHtml(source)+'</figcaption></figure>';
}
const cuiudoCrossReminder={
 pt:'Fugir da sua cruz é a pior desgraça que você pode fazer.',
 en:'Running away from your cross is the worst thing you can do.',
 es:'Huir de tu cruz es la peor desgracia que puedes cometer.',
 la:'Crucem tuam fugere pessima calamitas est.'
};
function cuiudoCrossReminderBox(locale){
 return '<p class="goals-cross-reminder"><span aria-hidden="true">✝</span>'+
  '<strong>'+escapeHtml(cuiudoCrossReminder[locale]||cuiudoCrossReminder.pt)+'</strong></p>';
}
/* Um único espaço, duas frases alternando sem recarregar a página. */
function cuiudoAlternatingQuotes(locale){
 return '<div class="goals-alternating-quotes" aria-label="Frases de motivação">'+
  cuiudoCrossReminderBox(locale)+
  cuiudoRonaldoMindset(locale)+
  '</div>';
}

const cuiudoPriorityLabels={pt:['Alta','Média','Baixa','Prioridade'],en:['High','Medium','Low','Priority'],es:['Alta','Media','Baja','Prioridad'],la:['Alta','Media','Humilis','Prioritas']};
const cuiudoCreatePriorityText={
 pt:{label:'Importância *',choose:'Escolha o nível de importância'},
 en:{label:'Importance *',choose:'Choose an importance level'},
 es:{label:'Importancia *',choose:'Elige el nivel de importancia'},
 la:{label:'Momentum *',choose:'Gradum momenti elige'}
};
/* Temporizador por meta — já compatível com os campos do Cloudflare D1. */
let cuiudoTimerOpened=null;
const cuiudoTimerLabels={
 pt:{label:'Temporizador',minutes:'Minutos',start:'Iniciar',pause:'Pausar',resume:'Retomar',reset:'Reiniciar',running:'Contando',paused:'Pausado',done:'Tempo encerrado',ready:'Pronto'},
 en:{label:'Timer',minutes:'Minutes',start:'Start',pause:'Pause',resume:'Resume',reset:'Reset',running:'Running',paused:'Paused',done:'Time is up',ready:'Ready'},
 es:{label:'Temporizador',minutes:'Minutos',start:'Iniciar',pause:'Pausar',resume:'Continuar',reset:'Reiniciar',running:'Contando',paused:'Pausado',done:'Tiempo agotado',ready:'Listo'},
 la:{label:'Temporarium',minutes:'Minuta',start:'Incipe',pause:'Siste',resume:'Perge',reset:'Renova',running:'Currit',paused:'Intermissum',done:'Tempus finitum',ready:'Paratum'}
};
const cuiudoGoalDurationLabels={
 pt:{label:'Tempo',unit:'min',required:'Informe um tempo de 1 a 1440 minutos.'},
 en:{label:'Time',unit:'min',required:'Set a duration of 1 to 1440 minutes.'},
 es:{label:'Tiempo',unit:'min',required:'Indica un tiempo de 1 a 1440 minutos.'},
 la:{label:'Tempus',unit:'min',required:'Elige tempus inter 1 et 1440 minuta.'}
};
function cuiudoTimerSeconds(goal,now=Date.now()){
 const total=Number.isSafeInteger(goal?.duration_sec)?Math.max(0,goal.duration_sec):0;
 const left=Number.isSafeInteger(goal?.remaining_sec)?Math.max(0,Math.min(total,goal.remaining_sec)):total;
 if(goal?.timer_state!=='running')return left;
 const start=Number(goal.timer_started_at);
 return Number.isSafeInteger(start)&&start>0?Math.max(0,left-Math.floor(Math.max(0,now-start)/1000)):left;
}
function cuiudoTimerFormat(n){
 const s=Math.max(0,Math.floor(n)),h=Math.floor(s/3600),m=Math.floor(s%3600/60);
 return (h?String(h).padStart(2,'0')+':':'')+String(m).padStart(2,'0')+':'+String(s%60).padStart(2,'0');
}
function cuiudoTimerPanel(goal,locale){
 const t=cuiudoTimerLabels[locale]||cuiudoTimerLabels.pt;
 const total=Number.isSafeInteger(goal.duration_sec)&&goal.duration_sec>0?goal.duration_sec:1500;
 const left=goal.duration_sec?cuiudoTimerSeconds(goal):total;
 const phase=goal.duration_sec&&left===0?'finished':goal.timer_state||'none';
 const action=phase==='running'?'pause':phase==='paused'?'resume':'start';
 const caption=phase==='running'?t.pause:phase==='paused'?t.resume:t.start;
 const status=phase==='running'?t.running:phase==='paused'?t.paused:phase==='finished'?t.done:t.ready;
 const id=escapeHtml(goal.id);
 return '<div class="cuiudo-countdown" data-timer-for="'+id+'">'+
  '<div class="cuiudo-countdown-readout"><span>'+escapeHtml(t.label)+'</span>'+
  '<strong data-cuiudo-clock="'+id+'">'+cuiudoTimerFormat(left)+'</strong>'+
  '<small data-cuiudo-clock-status>'+escapeHtml(status)+'</small></div>'+
  '<div class="cuiudo-countdown-options"><label>'+escapeHtml(t.minutes)+
  ' <input data-timer-minutes type="number" min="1" step="1" inputmode="numeric" value="'+Math.round(total/60)+'"></label>'+
  (phase==='finished'?'':'<button type="button" data-action="cuiudo-goal-timer-'+action+'" data-id="'+id+'">'+escapeHtml(caption)+'</button>')+
  '<button type="button" data-action="cuiudo-goal-timer-reset" data-id="'+id+'">'+escapeHtml(t.reset)+'</button>'+
  '<button type="button" data-action="cuiudo-goal-timer-test" data-id="'+id+'">'+escapeHtml({pt:'Testar som',en:'Test sound',es:'Probar sonido',la:'Sonum tempta'}[locale]||'Testar som')+'</button>'+
  (typeof Notification!=='undefined'&&Notification.permission==='default'?'<button type="button" data-action="cuiudo-goal-timer-notifications" data-id="'+id+'">'+escapeHtml({pt:'Ativar avisos',en:'Enable alerts',es:'Activar avisos',la:'Nuntios permitte'}[locale]||'Ativar avisos')+'</button>':'')+
  '</div></div>';
}

/* O áudio é agendado quando o usuário inicia o timer. O Web Audio pode
 * disparar o som mesmo com outra aba em primeiro plano, sem depender de
 * setInterval. O sistema pode suspender abas em celulares; notificações são
 * um reforço, não uma garantia quando o navegador/app for encerrado. */
let cuiudoTimerAudioContext=null;
const cuiudoTimerAudioJobs=new Map();
function cuiudoTimerUnlockAudio(){
 try{
  const Type=window.AudioContext||window.webkitAudioContext;
  if(!Type)return;
  if(!cuiudoTimerAudioContext||cuiudoTimerAudioContext.state==='closed')
   cuiudoTimerAudioContext=new Type();
  if(cuiudoTimerAudioContext.state==='suspended'){
   const p=cuiudoTimerAudioContext.resume();p?.catch?.(()=>{});
  }
 }catch{}
}
function cuiudoTimerScheduleTone(ctx,at){
 const nodes=[];
 try{
  for(let i=0;i<14;i++){
   const t=at+i*0.34;
   for(let layer=0;layer<2;layer++){
    const osc=ctx.createOscillator(),gain=ctx.createGain();
    osc.type=layer===0?'square':'sine';
    osc.frequency.setValueAtTime(layer===0?(i%3===2?740:880):1320,t);
    gain.gain.setValueAtTime(0.0001,t);
    gain.gain.exponentialRampToValueAtTime(layer===0?0.32:0.12,t+0.018);
    gain.gain.exponentialRampToValueAtTime(0.0001,t+0.29);
    osc.connect(gain);gain.connect(ctx.destination);
    osc.start(t);osc.stop(t+0.30);
    nodes.push(osc);
   }
  }
 }catch{}
 return nodes;
}
function cuiudoTimerCancelAudio(id){
 const job=cuiudoTimerAudioJobs.get(id);
 if(!job)return;
 cuiudoTimerAudioJobs.delete(id);
 for(const node of job.nodes){try{node.stop()}catch{}}
}
function cuiudoTimerArmAudio(goal){
 cuiudoTimerCancelAudio(goal.id);
 if(goal.timer_state!=='running'||!Number.isSafeInteger(goal.timer_started_at))return;
 const when=goal.timer_started_at+goal.remaining_sec*1000;
 if(cuiudoGoalDay(when)!==cuiudoGoalDay())return;
 cuiudoTimerUnlockAudio();
 // Schedule audio near expiry; very distant Web Audio events are unreliable.
 if(when-Date.now()>86400000)return;
 const ctx=cuiudoTimerAudioContext;
 if(!ctx)return;
 const at=ctx.currentTime+Math.max(0,(when-Date.now())/1000)+0.02;
 const nodes=cuiudoTimerScheduleTone(ctx,at);
 cuiudoTimerAudioJobs.set(goal.id,{when,nodes,ctx});
}
function cuiudoTimerSound(){
 try{
  const ctx=cuiudoTimerAudioContext;
  if(!ctx||ctx.state==='closed')return;
  if(ctx.state==='suspended'){const p=ctx.resume();p?.catch?.(()=>{});}
  cuiudoTimerScheduleTone(ctx,ctx.currentTime+0.03);
 }catch{}
}
function cuiudoTimerNotify(goal){
 try{
  if(typeof Notification==='undefined'||Notification.permission!=='granted'||!document.hidden)return;
  const locale=cuiudoLocale(),t=cuiudoTimerLabels[locale]||cuiudoTimerLabels.pt;
  const title=t.done,opts={body:goal.text,tag:'cuiudo-timer-'+goal.id,
   icon:'./assets/icon.svg',requireInteraction:true};
  if(navigator.serviceWorker?.ready){
   navigator.serviceWorker.ready.then(reg=>reg.showNotification(title,opts))
    .catch(()=>{try{new Notification(title,opts)}catch{}});
  }else new Notification(title,opts);
 }catch{}
}
function cuiudoRunningTimerEntries(day=cuiudoGoalDay()){
 return cuiudoGoalsToday(day).filter(goal=>goal.status==='pending'&&goal.timer_state==='running')
  .map(goal=>({day,goal}));
}
function cuiudoTimerReconcileAudio(){
 const goals=cuiudoRunningTimerEntries().map(x=>x.goal);
 for(const [id,job] of cuiudoTimerAudioJobs){
  const goal=goals.find(g=>g.id===id);
  const when=goal?.timer_state==='running'?goal.timer_started_at+goal.remaining_sec*1000:null;
  if(goal?.status==='pending'&&when===job.when)continue;
  cuiudoTimerCancelAudio(id);
  if(goal?.status==='pending'&&goal.timer_state==='running')cuiudoTimerArmAudio(goal);
 }
}
window.cuiudoTimerReconcileAudio=cuiudoTimerReconcileAudio;

function cuiudoTimerStop(goal){
 if(goal.timer_state!=='running')return;
 goal.remaining_sec=cuiudoTimerSeconds(goal);
 if(goal.remaining_sec>0)cuiudoTimerCancelAudio(goal.id);
 goal.timer_started_at=null;goal.timer_state=goal.remaining_sec===0?'finished':'paused';
}


/* Início da contagem em 17/11/2026 às 11:21:26, no horário de Brasília. */
const cuiudoPerformanceSince=Date.parse('2026-11-17T14:21:26Z');
const cuiudoChartPrefs=(()=>{
 try{if(typeof localStorage!=='undefined')return JSON.parse(localStorage.getItem('terco-grafico-preferencias-v1')||'{}')||{}}catch{}
 return {};
})();
let cuiudoChartMode=['status','priority'].includes(cuiudoChartPrefs.mode)?cuiudoChartPrefs.mode:'status';
let cuiudoChartRange=[7,14,30].includes(cuiudoChartPrefs.range)?cuiudoChartPrefs.range:7;
function cuiudoSaveChartPrefs(){try{localStorage.setItem('terco-grafico-preferencias-v1',JSON.stringify({mode:cuiudoChartMode,range:cuiudoChartRange}))}catch{}}
const cuiudoChartLabels={
 pt:{title:'Seu desempenho',subtitle:'Contagem desde',status:'Por dia',priority:'Por prioridade',period:'Período',days:'dias',
  done:'Concluídas',pending:'Pendentes',missed:'Não concluídas',high:'Alta',medium:'Média',low:'Baixa',
  empty:'Nenhum resultado registrado neste período.',noData:'Sem resultados',summary:'metas concluídas',of:'de',
  axis:'Percentual concluído',note:'As barras mostram quantas metas foram concluídas. A linha mostra o percentual de conclusão entre as metas avaliadas.',
  priorityNote:'As barras mostram o número de metas concluídas por prioridade. Os percentuais usam as metas avaliadas em cada nível.',noteLabel:'Como calculamos'},
 en:{title:'Your progress',subtitle:'Tracking since',status:'By day',priority:'By priority',period:'Period',days:'days',
  done:'Completed',pending:'Pending',missed:'Not completed',high:'High',medium:'Medium',low:'Low',
  empty:'No results recorded in this period.',noData:'No results',summary:'goals completed',of:'of',
  axis:'Completion rate',note:'Bars show how many goals were completed. The line shows the completion rate among assessed goals.',
  priorityNote:'Bars show how many goals were completed at each priority. Percentages use the assessed goals at each level.',noteLabel:'How it is calculated'},
 es:{title:'Tu progreso',subtitle:'Recuento desde',status:'Por día',priority:'Por prioridad',period:'Período',days:'días',
  done:'Cumplidas',pending:'Pendientes',missed:'No cumplidas',high:'Alta',medium:'Media',low:'Baja',
  empty:'No hay resultados registrados en este período.',noData:'Sin resultados',summary:'metas cumplidas',of:'de',
  axis:'Porcentaje cumplido',note:'Las barras muestran cuántas metas se cumplieron. La línea muestra el porcentaje de cumplimiento entre las metas evaluadas.',
  priorityNote:'Las barras muestran cuántas metas se cumplieron por prioridad. Los porcentajes usan las metas evaluadas en cada nivel.',noteLabel:'Cómo se calcula'},
 la:{title:'Progressus tuus',subtitle:'Computatio ab',status:'Per diem',priority:'Per prioritatem',period:'Tempus',days:'dies',
  done:'Completae',pending:'Pendentes',missed:'Non completae',high:'Alta',medium:'Media',low:'Humilis',
  empty:'Nulla proposita hoc tempore reperta.',noData:'Nulla proposita',summary:'proposita completa',of:'ex',
  axis:'Proportio completa',note:'Columnae numerum propositorum completorum ostendunt. Linea proportionem completorum indicat.',
  priorityNote:'Singula prioritas rationem completorum ostendit.',noteLabel:'Ratio computationis'}
};
function cuiudoPerformanceLocalGoals(){
 const results={};
 for(const goals of Object.values(state.dailyGoalDays||{})){
  if(!Array.isArray(goals))continue;
  for(const goal of goals){
   const stamp=goal?.status==='done'?goal.completed_at:goal?.status==='missed'?goal.missed_at:null;
   if(!Number.isSafeInteger(stamp)||stamp<cuiudoPerformanceSince)continue;
   const day=cuiudoGoalDay(stamp);
   (results[day]??=[]).push(goal);
  }
 }
 return results;
}
function cuiudoChartRows(days=14,endDay=cuiudoGoalDay(),goalsByDay=state.dailyGoalDays||{}){
 const count=[7,14,30].includes(Number(days))?Number(days):14;
 const end=Date.parse(String(endDay)+'T12:00:00Z');
 if(!Number.isFinite(end))return [];
 const activeDay=cuiudoGoalDay();
 return Array.from({length:count},(_,i)=>{
  const day=new Date(end-(count-1-i)*86400000).toISOString().slice(0,10);
  const goals=Array.isArray(goalsByDay[day])?goalsByDay[day]:[];
  const row={day,done:0,pending:0,missed:0,high:0,medium:0,low:0};
  for(const goal of goals){
   if(!goal||goal.status==='deleted')continue;
   const status=cuiudoGoalStatus(goal,day,activeDay);
   row[status]++;
   if(status==='pending'){
    const priority=['high','medium','low'].includes(goal.priority)?goal.priority:'medium';
    row[priority]++;
   }
  }
  return row;
 });
}
function cuiudoChartBars(rows,mode='status',goalsByDay=state.dailyGoalDays||{}){
 if(mode==='priority'){
  const dates=new Set(rows.map(row=>row.day));
  return ['high','medium','low'].map(priority=>{
   let done=0,total=0;
   for(const [day,goals] of Object.entries(goalsByDay)){
    if(!dates.has(day)||!Array.isArray(goals))continue;
    for(const goal of goals){
     if(!goal||goal.status==='deleted')continue;
     const level=['high','medium','low'].includes(goal.priority)?goal.priority:'medium';
     if(level!==priority)continue;
     total++;
     if(goal.status==='done')done++;
    }
   }
   return {key:priority,label:priority,done,total,percent:total?Math.round(done/total*100):null};
  });
 }
 return rows.map(row=>{
  const total=row.done+row.pending+row.missed;
  return {key:row.day,label:row.day.slice(8,10)+'/'+row.day.slice(5,7),
   done:row.done,total,percent:total?Math.round(row.done/total*100):null};
 });
}
function cuiudoGoalsBarChart(locale){
 const t=cuiudoChartLabels[locale]||cuiudoChartLabels.pt;
 const history=typeof window!=='undefined'?window.cuiudoGoalHistory:null;
 let bars;
 if(history?.loaded){
  const historicRows=history.byDay(cuiudoChartRange,cuiudoGoalDay(),cuiudoPerformanceSince);
  if(cuiudoChartMode==='status'){
   bars=historicRows.map(row=>({
    key:row.day,label:row.day.slice(8,10)+'/'+row.day.slice(5,7),
    done:row.completed,total:row.resolved,
    percent:row.resolved?Math.round(row.completed/row.resolved*100):null
   }));
  }else{
   const days=new Set(historicRows.map(x=>x.day));
   bars=['high','medium','low'].map(priority=>{
    const relevant=history.events.filter(e=>e.occurred_at>=cuiudoPerformanceSince&&e.priority===priority&&
     ['completed','missed'].includes(e.event_type)&&days.has(cuiudoGoalDay(e.occurred_at)));
    const d=relevant.filter(e=>e.event_type==='completed').length;
    return {key:priority,label:t[priority],done:d,total:relevant.length,
     percent:relevant.length?Math.round(d/relevant.length*100):null};
   });
  }
 }else{
  const goals=cuiudoPerformanceLocalGoals();
  const rows=cuiudoChartRows(cuiudoChartRange,cuiudoGoalDay(),goals);
  bars=cuiudoChartBars(rows,cuiudoChartMode,goals);
 }
 const done=bars.reduce((sum,bar)=>sum+bar.done,0);
 const count=bars.reduce((sum,bar)=>sum+bar.total,0);
 const rate=count?Math.round(done/count*100):null;
 const controls='<div class="cuiudo-chart-controls">'+
  '<div class="cuiudo-chart-modes" role="group" aria-label="'+escapeHtml(t.title)+'">'+
  ['status','priority'].map(mode=>'<button type="button" data-action="cuiudo-chart-mode" data-mode="'+mode+'" aria-pressed="'+(cuiudoChartMode===mode?'true':'false')+'">'+escapeHtml(t[mode])+'</button>').join('')+
  '</div><label class="cuiudo-chart-period">'+escapeHtml(t.period)+' <select id="cuiudo-chart-range" aria-label="'+escapeHtml(t.period)+'">'+
  [7,14,30].map(days=>'<option value="'+days+'"'+(cuiudoChartRange===days?' selected':'')+'>'+days+' '+escapeHtml(t.days)+'</option>').join('')+
  '</select></label></div>';
 const summary='<div class="cuiudo-chart-summary"><strong>'+(rate===null?'—':rate+'%')+'</strong>'+
  '<span>'+done+' '+escapeHtml(t.of)+' '+count+' '+escapeHtml(t.summary)+'</span></div>';
 const start=new Intl.DateTimeFormat(({pt:'pt-BR',en:'en-US',es:'es-ES',la:'pt-BR'})[locale]||'pt-BR',{
  timeZone:'America/Sao_Paulo',dateStyle:'short',timeStyle:'short'
 }).format(cuiudoPerformanceSince);
 const head='<header class="cuiudo-chart-head"><div class="cuiudo-chart-intro"><span class="cuiudo-chart-eyebrow">✦ '+escapeHtml(t.axis)+'</span>'+
  '<h3>'+escapeHtml(t.title)+'</h3><p>'+escapeHtml(t.subtitle+' '+start)+'</p></div>'+summary+'</header>';
 let content='<p class="cuiudo-chart-empty">'+escapeHtml(t.empty)+'</p>';
 if(bars.some(x=>x.total>0)){
  const maxDone=Math.max(1,...bars.map(bar=>bar.done));
  const tiles=bars.map(bar=>{
   const label=cuiudoChartMode==='priority'?t[bar.key]:bar.label;
   const detail=label+': '+bar.done+' '+t.of+' '+bar.total+' '+t.summary+
    (bar.percent===null?'':' ('+bar.percent+'%)');
   const green=bar.percent!==null&&bar.percent>=50;
   const height=Math.round(bar.done/maxDone*100);
   return '<div class="cuiudo-chart-bar-item'+(bar.percent===null?' is-empty':green?' is-success':' is-warning')+
    '" role="img" aria-label="'+escapeHtml(bar.percent===null?label+': '+t.noData:detail)+'" title="'+escapeHtml(bar.percent===null?label+': '+t.noData:detail)+'">'+
    '<div class="cuiudo-chart-bar-stage"><div class="cuiudo-chart-bar-track">'+
    (bar.percent===null?'<span class="cuiudo-chart-bar-nodata" aria-hidden="true"></span>':
     '<span class="cuiudo-chart-bar-fill" style="height:'+height+'%" aria-hidden="true"></span>')+
    '</div></div><strong class="cuiudo-chart-percent">'+(bar.percent===null?'—':bar.percent+'%')+'</strong>'+
    '<span class="cuiudo-chart-bar-label">'+escapeHtml(label)+'</span></div>';
  }).join('');
  // O traço azul indica percentual de conclusões entre metas resolvidas.
  // Pontos sem dados interrompem a linha para não inventar observações.
  const segments=[];let seg=[];
  bars.forEach((bar,i)=>{
   if(bar.percent===null){if(seg.length)segments.push(seg);seg=[];return;}
   seg.push([((i+.5)/bars.length*100).toFixed(3),(94-bar.percent*.88).toFixed(3)]);
  });
  if(seg.length)segments.push(seg);
  const line=segments.map(points=>
   '<polyline points="'+points.map(x=>x.join(',')).join(' ')+'" fill="none" stroke="#3187c6" stroke-width="1.9" vector-effect="non-scaling-stroke" stroke-linejoin="round" stroke-linecap="round"/>'
  ).join('');
  const dots=segments.flat().map(point=>'<circle cx="'+point[0]+'" cy="'+point[1]+'" r=".8" fill="#3187c6" stroke="white" stroke-width=".35" vector-effect="non-scaling-stroke"/>').join('');
  const overlay=cuiudoChartMode==='status'?'<svg class="cuiudo-chart-trend" viewBox="0 0 100 100" preserveAspectRatio="none" role="img" aria-label="'+escapeHtml(t.axis)+'">'+line+dots+'</svg>':'';
  content='<div class="cuiudo-chart-scroll" role="region" tabindex="0" aria-label="'+escapeHtml(t.axis)+'">'+
   '<div class="cuiudo-chart-plot-wrap" style="--chart-count:'+bars.length+'">'+
   '<div class="cuiudo-chart-barplot">'+tiles+'</div>'+overlay+'</div></div>';
 }
 const note=cuiudoChartMode==='priority'?t.priorityNote:t.note;
 return '<section class="cuiudo-goals-chart" aria-label="'+escapeHtml(t.title)+'">'+head+controls+content+
  '<details class="cuiudo-chart-footnote"><summary>'+escapeHtml(t.noteLabel)+'</summary><p>'+escapeHtml(note)+'</p></details></section>';
}

let cuiudoArchiveDay='';
function cuiudoGoalArchiveRows(day,locale){
 const t=cuiudoGoalsText[locale];
 return cuiudoGoalsToday(day).map(goal=>{
  const completed=cuiudoGoalStatus(goal,day)==='done';
  const time=completed?cuiudoGoalCompletedTime(goal,locale):cuiudoGoalMissedTime(goal,locale);
  return '<li class="goal-archive-row"><div><strong>'+escapeHtml(goal.text)+'</strong>'+time+'</div>'+
   '<span class="goal-card-status '+(completed?'is-success':'is-missed')+'">'+
   escapeHtml(completed?t.completed:t.undone)+'</span></li>';
 }).join('');
}
function cuiudoGoalArchive(locale,activeDay){
 const t=cuiudoGoalsText[locale];
 const days=Object.keys(state.dailyGoalDays||{}).filter(day=>day<activeDay&&cuiudoGoalsToday(day).length)
  .sort().reverse();
 if(!days.length)return '';
 const day=days.includes(cuiudoArchiveDay)?cuiudoArchiveDay:days[0];
 return '<details class="cuiudo-premium-card goal-archive"><summary><strong>'+escapeHtml(t.archive)+'</strong></summary>'+
  '<div class="cuiudo-premium-inside"><label class="cuiudo-chart-period">'+escapeHtml(t.day)+
  ' <select id="cuiudo-goal-archive-day">'+days.map(date=>'<option value="'+escapeHtml(date)+'"'+
  (date===day?' selected':'')+'>'+escapeHtml(date.split('-').reverse().join('/'))+'</option>').join('')+'</select></label>'+
  '<ul class="goal-archive-list">'+cuiudoGoalArchiveRows(day,locale)+'</ul></div></details>';
}
function cuiudoGoalChecklist(){
 const l=cuiudoLocale(),t=cuiudoGoalsText[l],day=cuiudoGoalDay();
 const goals=cuiudoGoalsNewestFirst(cuiudoGoalsToday(day));
 const done=goals.filter(goal=>goal.status==='done').length;
 return '<section class="today-goals" aria-label="'+escapeHtml(t.heading)+'">'+
  '<div class="today-goals-top"><div><h2>'+escapeHtml(t.heading)+'</h2><p>'+escapeHtml(t.sub)+'</p></div>'+
  '<div class="today-goals-status"><strong>'+done+' / '+goals.length+'</strong>'+
  '<span>'+escapeHtml(t.complete)+'</span></div></div>'+
  cuiudoAlternatingQuotes(l)+
  cuiudoEssentialCard(l)+
  '<form id="cuiudo-goal-form" class="today-goals-form"><label class="sr-only" for="cuiudo-goal-text">'+escapeHtml(t.label)+'</label>'+
  '<input id="cuiudo-goal-text" name="goal" maxlength="180" required autocomplete="off" placeholder="'+escapeHtml(t.placeholder)+'">'+
  '<label class="goal-create-priority" for="cuiudo-goal-priority">'+escapeHtml(cuiudoCreatePriorityText[l].label)+
  '<select id="cuiudo-goal-priority" name="priority" required aria-required="true">'+
  '<option value="" selected disabled>'+escapeHtml(cuiudoCreatePriorityText[l].choose)+'</option>'+
  ['high','medium','low'].map((p,i)=>'<option value="'+p+'">'+escapeHtml(cuiudoPriorityLabels[l][i])+'</option>').join('')+
  '</select></label>'+
  '<label class="goal-create-duration" for="cuiudo-goal-duration">'+escapeHtml(cuiudoGoalDurationLabels[l].label)+
  ' <input id="cuiudo-goal-duration" name="duration_minutes" type="number" min="1" max="1440" step="1" required aria-required="true" inputmode="numeric" placeholder="25" aria-label="'+escapeHtml(cuiudoGoalDurationLabels[l].required)+'">'+
  '<span aria-hidden="true">'+escapeHtml(cuiudoGoalDurationLabels[l].unit)+'</span></label>'+
  '<button class="btn btn-primary" type="submit">'+escapeHtml(t.add)+' +</button></form>'+
  '<div class="today-goals-progress" role="progressbar" aria-label="'+escapeHtml(t.complete)+'" aria-valuenow="'+done+
  '" aria-valuemin="0" aria-valuemax="'+Math.max(1,goals.length)+'"><span style="width:'+
   (goals.length?Math.round(done/goals.length*100):0)+'%"></span></div>'+
  '<div class="today-goals-list">'+(goals.length?goals.map((goal,i)=>{
   const status=goal.status||'pending',completed=status==='done',failed=status==='missed';
   return '<article class="today-goal '+(completed?'goal-completed':failed?'goal-missed':'goal-pending')+'" data-priority="'+(['high','medium','low'].includes(goal.priority)?goal.priority:'medium')+'">'+
   '<div class="today-goal-main"><span class="today-goal-icon" aria-hidden="true">'+(completed?'✓':failed?'!':String(i+1).padStart(2,'0'))+'</span>'+
   '<div class="today-goal-content"><div class="goal-card-heading"><strong class="goal-card-title">'+escapeHtml(goal.text)+'</strong>'+
   '<label class="goal-priority-label">'+escapeHtml(cuiudoPriorityLabels[l][3])+' <select class="goal-priority-select" data-goal-priority="'+escapeHtml(goal.id)+'" aria-label="'+escapeHtml(cuiudoPriorityLabels[l][3])+'">'+['high','medium','low'].map((p,j)=>'<option value="'+p+'" '+((goal.priority||'medium')===p?'selected':'')+'>'+escapeHtml(cuiudoPriorityLabels[l][j])+'</option>').join('')+'</select></label>'+
   '<span class="goal-card-status '+(completed?'is-success':failed?'is-missed':'is-pending')+'">'+escapeHtml(completed?t.completed:failed?t.undone:t.remaining)+'</span></div>'+
   (completed?cuiudoGoalCompletedTime(goal,l):failed?cuiudoGoalMissedTime(goal,l):'')+
   '</div></div><div class="today-goal-actions">'+
   (status==='pending'?'<button class="goal-action positive" type="button" data-action="cuiudo-goal-done" data-id="'+goal.id+'">✓ '+escapeHtml(t.done)+'</button>'+
   '<button class="goal-action" type="button" data-action="cuiudo-goal-missed" data-id="'+goal.id+'">✕ '+escapeHtml(t.missed)+'</button>'+
    '<button class="goal-action goal-timer-button" type="button" data-action="cuiudo-goal-timer-toggle" data-id="'+escapeHtml(goal.id)+'" aria-expanded="'+(cuiudoTimerOpened===goal.id?'true':'false')+'" aria-label="'+escapeHtml(cuiudoTimerLabels[l].label+(Number.isSafeInteger(goal.duration_sec)&&goal.duration_sec>0?' · '+Math.round(goal.duration_sec/60)+' '+cuiudoGoalDurationLabels[l].unit:''))+'">⏱ '+escapeHtml(Number.isSafeInteger(goal.duration_sec)&&goal.duration_sec>0?Math.round(goal.duration_sec/60)+' '+cuiudoGoalDurationLabels[l].unit:cuiudoTimerLabels[l].label)+'</button>'+
    '<button class="goal-action cuiudo-focus-launch" type="button" data-action="cuiudo-focus-open" data-id="'+escapeHtml(goal.id)+'">◎ '+escapeHtml({pt:'Foco',en:'Focus',es:'Foco',la:'Intentio'}[l])+'</button>':
   '<button class="goal-action" type="button" data-action="cuiudo-goal-reopen" data-id="'+goal.id+'">'+escapeHtml(t.reopen)+'</button>')+
   '<button class="goal-delete" type="button" data-action="cuiudo-goal-delete" data-id="'+goal.id+'" aria-label="'+escapeHtml(t.remove)+'">×</button></div>'+
   (status==='pending'&&cuiudoTimerOpened===goal.id?cuiudoTimerPanel(goal,l):'')+'</article>';
  }).join(''):'<p class="today-goals-empty">'+escapeHtml(t.empty)+'</p>')+'</div>'+
  cuiudoGodMomentBox(l)+
  cuiudoObstacleBox(l)+
  cuiudoGoalsBarChart(l)+
  cuiudoGoalArchive(l,day)+
  (window.cuiudoPremium?.goalExtras?.(l)||'')+
  '</section>';
}
const cuiudoPreviousHomeGoals=combatHome;
combatHome=function(){
 const html=cuiudoPreviousHomeGoals();
 const start=html.indexOf('<section class="benedict-hero">');
 if(start<0)return cuiudoGoalChecklist()+html;
 // Metas vêm logo após a faixa de ação, antes da imagem principal.
 return html.slice(0,start)+cuiudoGoalChecklist()+html.slice(start);
};
const cuiudoPreviousChallengesGoals=challenges;
challenges=function(){return cuiudoGoalChecklist()+cuiudoPreviousChallengesGoals();};
function cuiudoGoalsSave(){
 save();
 window.cuiudoPremium?.backup?.();
}
app.addEventListener('click',event=>{
 const button=event.target?.closest?.('[data-action="cuiudo-chart-mode"]');
 if(!button)return;
 const mode=button.dataset.mode;
 if(!['status','priority'].includes(mode)||mode===cuiudoChartMode)return;
 cuiudoChartMode=mode;
 cuiudoSaveChartPrefs();
 render();
});
app.addEventListener('change',event=>{
 if(event.target?.id!=='cuiudo-chart-range')return;
 const range=Number(event.target.value);
 if(![7,14,30].includes(range)||range===cuiudoChartRange)return;
 cuiudoChartRange=range;
 cuiudoSaveChartPrefs();
 render();
});
app.addEventListener('change',event=>{
 const select=event.target;
 if(select?.id!=='cuiudo-goal-archive-day')return;
 cuiudoArchiveDay=select.value;
 const list=select.closest('details')?.querySelector('.goal-archive-list');
 if(list)list.innerHTML=cuiudoGoalArchiveRows(cuiudoArchiveDay,cuiudoLocale());
});

app.addEventListener('input',event=>{
 if(event.target?.id!=='cuiudo-god-moment-text')return;
 if(cuiudoRefreshGoalDay()){render();return;}
 const saved=cuiudoGodMomentSave(event.target.value);
 const status=event.target.closest('.goals-god-moment-box')?.querySelector('.goals-obstacle-status');
 if(status){
  const t=cuiudoGodMomentLabels[cuiudoLocale()]||cuiudoGodMomentLabels.pt;
  status.textContent=saved?t[3]:t[4];
 }
});
app.addEventListener('click',event=>{
 const button=event.target?.closest?.('[data-action="cuiudo-god-moment-delete"]');
 if(!button||!cuiudoGodMomentRead())return;
 if(typeof confirm==='function'&&!confirm('Excluir esta anotação sobre onde você viu Deus?'))return;
 if(cuiudoGodMomentSave(''))render();
});
app.addEventListener('input',event=>{
 if(event.target?.id!=='cuiudo-obstacle-text')return;
 if(cuiudoRefreshGoalDay()){render();return;}
 const saved=cuiudoObstacleSave(event.target.value);
 const status=event.target.closest('.goals-obstacle-box')?.querySelector('.goals-obstacle-status');
 if(status){
  const t=cuiudoObstacleLabels[cuiudoLocale()]||cuiudoObstacleLabels.pt;
  status.textContent=saved?t[3]:t[4];
 }
});
app.addEventListener('change',event=>{
 if(event.target?.id!=='cuiudo-essential-done')return;
 const desired=Boolean(event.target.checked);
 if(cuiudoEssentialSave(desired))render();
 else event.target.checked=!desired;
});
app.addEventListener('change',event=>{
 const select=event.target?.closest?.('[data-goal-priority]');if(!select)return;
 const id=select.dataset.goalPriority,priority=select.value;
 if(!['high','medium','low'].includes(priority))return;
 const day=cuiudoGoalDay(),goal=cuiudoGoalsToday(day).find(g=>g.id===id);
 if(!goal)return;
 goal.priority=priority;cuiudoGoalsSave();window.cuiudoGlobalGoals?.change('upsert',day,goal);
 render(); // Atualiza imediatamente a posição da meta no checklist.
});
app.addEventListener('input',event=>{
 if(event.target?.id==='cuiudo-goal-duration')event.target.setCustomValidity?.('');
});
app.addEventListener('submit',event=>{
 if(event.target?.id!=='cuiudo-goal-form')return;
 event.preventDefault();
 const input=event.target.querySelector('input[name=goal]');
 const text=String(input?.value||'').trim().slice(0,180);
 const select=event.target.querySelector('select[name=priority]');
 const priority=String(select?.value||'');
 const durationField=event.target.querySelector('input[name=duration_minutes]');
 const durationText=String(durationField?.value??'').trim();
 const durationMinutes=Number(durationText);
 if(!text)return;
 // Prioridade e tempo devem ser definidos explicitamente para cada NOVA meta.
 if(!['high','medium','low'].includes(priority)){
  select?.reportValidity?.();
  return;
 }
 if(!durationText||!Number.isSafeInteger(durationMinutes)||durationMinutes<1||durationMinutes>1440){
  durationField?.setCustomValidity?.(cuiudoGoalDurationLabels[cuiudoLocale()].required);
  durationField?.reportValidity?.();
  return;
 }
 durationField?.setCustomValidity?.('');
 state.dailyGoalDays??={};
 const day=cuiudoGoalDay(),items=state.dailyGoalDays[day]??=[];
 if(items.length>=30)return;
 const id=String(Date.now())+'-'+Math.random().toString(36).slice(2,8);
 const duration_sec=durationMinutes*60;
 const goal={id,text,status:'pending',priority,duration_sec,remaining_sec:duration_sec,timer_started_at:null,timer_state:'none'};
 items.unshift(goal);
 cuiudoGoalsSave();
 window.cuiudoGlobalGoals?.change('upsert',day,goal);
 render();
});
app.addEventListener('click',event=>{
 const target=event.target.closest?.('[data-action^="cuiudo-goal-"],[data-action="cuiudo-obstacle-delete"]');
 if(!target)return;
 const action=target.dataset.action,id=target.dataset.id;
 if(action==='cuiudo-obstacle-delete'){
  if(!cuiudoObstacleRead())return;
  if(typeof confirm==='function'&&!confirm('Excluir esta anotação?'))return;
  if(cuiudoObstacleSave(''))render();
  return;
 }
 const day=cuiudoGoalDay(),items=state.dailyGoalDays?.[day];
 if(!Array.isArray(items))return;
 const index=items.findIndex(goal=>goal?.id===id&&goal.status!=='deleted');
 if(index<0)return;
 const goal=items[index];
 if(action==='cuiudo-goal-timer-toggle'){
  cuiudoTimerOpened=cuiudoTimerOpened===id?null:id;
  render();return;
 }
 if(action.startsWith('cuiudo-goal-timer-')){
  if(goal.status!=='pending')return;
  if(action==='cuiudo-goal-timer-test'){
   cuiudoTimerUnlockAudio();cuiudoTimerSound();return;
  }
  if(action==='cuiudo-goal-timer-notifications'){
   if(typeof Notification!=='undefined'&&Notification.permission==='default')
    Notification.requestPermission().then(()=>render()).catch(()=>{});
   return;
  }
  if(action==='cuiudo-goal-timer-pause')cuiudoTimerStop(goal);
  if(action==='cuiudo-goal-timer-resume'&&goal.timer_state==='paused'&&goal.remaining_sec>0){
   cuiudoTimerUnlockAudio();
   goal.timer_started_at=Date.now();goal.timer_state='running';
   cuiudoTimerArmAudio(goal);
  }
  if(action==='cuiudo-goal-timer-start'||action==='cuiudo-goal-timer-reset'){
   const field=target.closest('.today-goal')?.querySelector('[data-timer-minutes]');
   const minutes=Number(field?.value||25);
   if(!Number.isSafeInteger(minutes)||minutes<1||!Number.isSafeInteger(minutes*60000)||minutes*60000>8640000000000000-Date.now()-60000){
    field?.setCustomValidity?.('Escolha uma duração válida maior que zero.');
    field?.reportValidity?.();return;
   }
   cuiudoTimerCancelAudio(goal.id);
   goal.duration_sec=minutes*60;goal.remaining_sec=goal.duration_sec;
   goal.timer_started_at=action==='cuiudo-goal-timer-start'?Date.now():null;
   goal.timer_state=action==='cuiudo-goal-timer-start'?'running':'paused';
   if(action==='cuiudo-goal-timer-start')cuiudoTimerArmAudio(goal);
  }
  cuiudoGoalsSave();
  window.cuiudoGlobalGoals?.change('upsert',day,goal);
  render();return;
 }
 if(action==='cuiudo-goal-done'||action==='cuiudo-goal-missed'){
  cuiudoTimerCancelAudio(id);
  cuiudoTimerStop(goal);
  if(cuiudoTimerOpened===id)cuiudoTimerOpened=null;
 }
 if(action==='cuiudo-goal-done'){
  goal.status='done';
  goal.completed_at=Date.now();
  delete goal.missed_at;
 }
 if(action==='cuiudo-goal-missed'){
  goal.status='missed';
  goal.missed_at=Date.now();
  delete goal.completed_at;
 }
 if(action==='cuiudo-goal-reopen'){
  goal.status='pending';
  delete goal.completed_at;
  delete goal.missed_at;
 }
 const before={...goal};
 if(action==='cuiudo-goal-delete'){
  cuiudoTimerCancelAudio(id);
  items.splice(index,1);
 }
 cuiudoGoalsSave();
 window.cuiudoGlobalGoals?.change(action==='cuiudo-goal-delete'?'delete':'upsert',day,
  action==='cuiudo-goal-delete'?before:items[index]);
 render();
});
render();

function cuiudoRefreshGoalDay(day=cuiudoGoalDay()){
 if(day===cuiudoActiveGoalDay)return false;
 cuiudoActiveGoalDay=day;
 cuiudoClearOldDailyNotes(day);
 cuiudoTimerOpened=null;
 cuiudoTimerReconcileAudio();
 return true;
}
/* Atualiza os temporizadores do dia, mesmo com os cartões fechados. */
function cuiudoTimerTick(){
 const day=cuiudoGoalDay(),changedDay=cuiudoRefreshGoalDay(day);
 const entries=cuiudoRunningTimerEntries(day);
 const goals=[...cuiudoGoalsToday(day),...entries.filter(x=>x.day!==day).map(x=>x.goal)];
 let finished=0;
 for(const {day:goalDay,goal} of entries){
  if(cuiudoTimerSeconds(goal)>0){
   if(cuiudoTimerAudioContext&&!cuiudoTimerAudioJobs.has(goal.id)&&cuiudoTimerSeconds(goal)<=86400)cuiudoTimerArmAudio(goal);
   continue;
  }
  cuiudoTimerStop(goal);
  cuiudoGoalsSave();
  window.cuiudoGlobalGoals?.change('upsert',goalDay,goal);
  const armed=cuiudoTimerAudioJobs.get(goal.id);
  if(!armed||armed.ctx.state!=='running')cuiudoTimerSound();
  cuiudoTimerAudioJobs.delete(goal.id);
  cuiudoTimerNotify(goal);
  finished++;
 }
 if(changedDay&&['inicio','desafios'].includes(state.tab))render();
 else if(finished&&['inicio','desafios'].includes(state.tab))cuiudoRenderBackground();
 if(typeof document.querySelectorAll==='function'){
  document.querySelectorAll('[data-cuiudo-clock]').forEach(node=>{
   const id=node.getAttribute('data-cuiudo-clock');
   const goal=goals.find(g=>g.id===id);
   if(goal)node.textContent=cuiudoTimerFormat(cuiudoTimerSeconds(goal));
  });
 }
 return finished;
}
if(typeof window.setInterval==='function')window.setInterval(cuiudoTimerTick,1000);
if(typeof window.addEventListener==='function')window.addEventListener('focus',cuiudoTimerTick);
if(typeof document.addEventListener==='function')document.addEventListener('visibilitychange',()=>{
 if(!document.hidden)cuiudoTimerTick();
});
