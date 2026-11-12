/* CUIÚDO — checklist do dia, com metas definidas pela própria pessoa.
 * Metas públicas compartilhadas automaticamente pelo D1; diário e intenções são locais.
 */
const cuiudoGoalsText={
 pt:{heading:'Metas de hoje',sub:'Escreva o que precisa fazer. Depois assuma o resultado.',
  label:'Nova meta',placeholder:'Ex.: estudar 40 minutos, rezar o terço, resolver uma pendência',
  add:'Adicionar',done:'Concluí',missed:'Não concluí',reopen:'Reabrir',remove:'Excluir',
  complete:'Concluídas',remaining:'Pendente',gift:'Missão cumprida',empty:'Sua primeira meta começa aqui.',
  comeback:'Você é muito macio! Reorganize-se, levante e faça acontecer.',
  confession:'Preguiça é pecado, omissão é pecado, não fazer o que cumpre é coisa de macio frango, você vai ter que se confessar.',
  confessionButton:'Examinar e corrigir',
  undone:'Não concluída',earned:['Medalha da Coragem','Selo da Disciplina','Estrela da Perseverança','Troféu da Palavra Cumprida'],
  rewardText:'Você fez o que prometeu. O presente é uma conquista virtual: continue firme.'},
 en:{heading:"Today's goals",sub:'Write down what needs doing. Then own the result.',
  label:'New goal',placeholder:'E.g. study for 40 minutes, pray the Rosary',add:'Add',
  done:'Completed',missed:'Not completed',reopen:'Reopen',remove:'Delete',
  complete:'Completed',remaining:'Pending',gift:'Mission accomplished',empty:'Your first goal starts here.',
  comeback:'You have gone soft! Stand up, regroup and get it done.',
  confession:'Deliberate neglect of real duties may be sinful. Examine your conscience and bring culpable failures to Confession; not every missed personal goal is a mortal sin.',
  confessionButton:'Examine and act',
  undone:'Not completed',earned:['Medal of Courage','Discipline Badge','Star of Perseverance','Promise Kept Trophy'],
  rewardText:'You followed through. Your gift is a virtual achievement: keep going.'},
 es:{heading:'Metas de hoy',sub:'Escribe lo que debes hacer y asume el resultado.',
  label:'Nueva meta',placeholder:'Ej.: estudiar 40 minutos, rezar el Rosario',add:'Añadir',
  done:'Cumplí',missed:'No cumplí',reopen:'Reabrir',remove:'Eliminar',
  complete:'Cumplidas',remaining:'Pendientes',gift:'Misión cumplida',empty:'Tu primera meta empieza aquí.',
  comeback:'¡Estás demasiado blando! Levántate, reorganízate y hazlo.',
  confession:'La pereza y la omisión deliberada de deberes reales pueden ser pecado. Examina tu conciencia y lleva a la Confesión las faltas culpables; no toda meta incumplida es pecado mortal.',
  confessionButton:'Examinar y actuar',
  undone:'No cumplida',earned:['Medalla del Valor','Sello de la Disciplina','Estrella de Perseverancia','Trofeo de la Palabra Cumplida'],
  rewardText:'Cumpliste lo prometido. Tu regalo es una recompensa virtual.'},
 la:{heading:'Metas hodiernae',sub:'Scribe quod hodie agere debes et opus exple.',
  label:'Meta nova',placeholder:'Ex.: quadraginta minuta studere, Rosarium orare',add:'Adde',
  done:'Complevi',missed:'Non complevi',reopen:'Reclude',remove:'Dele',
  complete:'Completae',remaining:'Pendentes',gift:'Donum tuum',empty:'Prima meta hic incipit.',
  comeback:'Nimis mollis es! Surge, te para et opus fac.',
  confession:'Neglegentia et omissio officiorum deliberata peccata esse possunt. Conscientiam examina et culpabiles culpas in Confessione affer; non omnis meta irrita peccatum mortale est.',
  confessionButton:'Conscientiam examina',
  undone:'Non completa',earned:['Medalia Fortitudinis','Signum Disciplinae','Stella Constantiae','Praemium Promissi Servati'],
  rewardText:'Promissum servasti. Donum tuum honor virtualis est.'}
};
/* Metas continuam visíveis depois da meia-noite. */
function cuiudoGoalsToday(){
 state.dailyGoalDays??={};
 return Object.values(state.dailyGoalDays).flatMap(items=>Array.isArray(items)?items:[]);
}
// Metas pendentes vêm primeiro, da mais recente para a mais antiga.
// Concluídas e não concluídas ficam abaixo das pendentes, sem apagar nada.
// A ordem é calculada só por ID e status, estável após a sincronização do D1.
function cuiudoGoalsNewestFirst(goals){
 const createdAt=goal=>{
  const match=/^(\d{13})(?:-|$)/.exec(String(goal?.id||''));
  return match?Number(match[1]):0;
 };
 const finished=goal=>goal?.status==='done'||goal?.status==='missed'?1:0;
 return goals.slice().sort((a,b)=>finished(a)-finished(b)||createdAt(b)-createdAt(a));
}
function cuiudoGoalCount(){
 const items=cuiudoGoalsToday();
 return {total:items.length,done:items.filter(x=>x.status==='done').length,failed:items.filter(x=>x.status==='missed').length};
}
function cuiudoGoalGift(id){
 const list=cuiudoGoalsText[cuiudoLocale()].earned;
 let sum=0;
 for(const c of String(id))sum=(sum*31+c.charCodeAt(0))>>>0;
 return list[sum%list.length];
}

/* Celebrações autorais: uma escolha estável por ID da meta, sem mensagens
 * aleatórias mudando a cada sincronização. Referências são inspirações,
 * não transcrições literais de uma tradução bíblica. */
const cuiudoBlessings={
 pt:[
 ['Fé que não vira atitude é discurso. Hoje você fez a sua parte. Amanhã, de novo.','Tg 2,17'],
 ['Não despreze o dever pequeno. A disciplina se constrói quando ninguém está olhando.','Lc 16,10'],
 ['Você enfrentou a tarefa e venceu a resistência. Coragem se prova com ação.','Js 1,9'],
 ['Combate vencido. Não afrouxe: continue firme na luta pelo que é certo.','2Tm 4,7'],
 ['Você entregou trabalho, não desculpas. Faça tudo com dedicação e propósito.','Cl 3,23'],
 ['Você não fugiu do esforço. Perseverou. É assim que se forja o caráter.','Rm 5,3–4'],
 ['Hoje a preguiça não deu as ordens. Você assumiu o controle do seu dever.','Pr 6,6'],
 ['Tarefa cumprida. Não se acomode na vitória: amanhã há mais bem a fazer.','Gl 6,9'],
 ['Sem plateia e sem aplausos: você fez o que precisava. Deus vê o que é sincero.','Mt 6,4'],
 ['Você parou de adiar e entrou em ação. Disciplina vence conversa fiada.','1Cor 9,24'],
 ['Passo dado. Continue a corrida com firmeza, sem abandonar o que começou.','Hb 12,1'],
 ['Missão cumprida. Agradeça a Deus, endireite a postura e siga em frente.','Sl 118(117),24']
 ],
 en:[
 ['Faith without action is just talk. You acted today. Do it again tomorrow.','Jas 2:17'],
 ['Do not dismiss a small duty. Discipline grows when nobody is watching.','Lk 16:10'],
 ['You faced the task instead of running from it. Courage is action.','Jos 1:9'],
 ['Battle won. Do not back down: keep fighting for what is right.','2 Tim 4:7'],
 ['You delivered work, not excuses. Do everything with purpose.','Col 3:23'],
 ['You did not run from effort. You persevered. That builds character.','Rom 5:3–4'],
 ['Laziness did not give the orders today. You fulfilled your duty.','Prov 6:6'],
 ['Task completed. Do not settle: more good work lies ahead.','Gal 6:9'],
 ['No audience, no applause: you did what needed doing. God sees sincerity.','Mt 6:4'],
 ['You stopped delaying and took action. Discipline beats empty talk.','1 Cor 9:24'],
 ['One step taken. Keep running with resolve; do not abandon the path.','Heb 12:1'],
 ['Mission accomplished. Thank God, stand tall and move forward.','Ps 118:24']
 ],
 es:[
 ['La fe sin acción es solo discurso. Hoy actuaste. Mañana, otra vez.','St 2,17'],
 ['No desprecies un deber pequeño. La disciplina crece sin espectadores.','Lc 16,10'],
 ['Enfrentaste la tarea. El valor se demuestra con hechos.','Jos 1,9'],
 ['Combate ganado. No retrocedas: sigue luchando por el bien.','2 Tim 4,7'],
 ['Entregaste trabajo, no excusas. Haz todo con propósito.','Col 3,23'],
 ['No huiste del esfuerzo. Perseveraste. Así se forja el carácter.','Rom 5,3–4'],
 ['Hoy la pereza no mandó. Cumpliste tu deber.','Prov 6,6'],
 ['Tarea cumplida. No te acomodes: queda mucho bien por hacer.','Gal 6,9'],
 ['Sin público ni aplausos: cumpliste. Dios ve lo que es sincero.','Mt 6,4'],
 ['Dejaste de posponer y actuaste. La disciplina vence las palabras vacías.','1 Cor 9,24'],
 ['Un paso más. Sigue con firmeza; no abandones el camino.','Heb 12,1'],
 ['Misión cumplida. Da gracias a Dios y sigue adelante.','Sal 118,24']
 ],
 la:[
 ['Fides sine operibus inanis est. Hodie egisti; cras iterum age.','Iac 2,17'],
 ['Officium parvum ne spernas. Disciplina in occulto crescit.','Lc 16,10'],
 ['Opus aggressus es, non fugisti. Fortitudo operibus probatur.','Ios 1,9'],
 ['Certamen confectum. Persta in pugna pro bono.','2 Tim 4,7'],
 ['Opus, non excusationes, obtulisti. Omnia diligenter age.','Col 3,23'],
 ['Laborem non fugisti. Perseverantia animum confirmat.','Rom 5,3–4'],
 ['Pigritia hodie non imperavit. Officium perfecisti.','Prov 6,6'],
 ['Opus completum. Noli consistere: alia bona facienda sunt.','Gal 6,9'],
 ['Sine plausu opus perfecisti. Deus sinceritatem videt.','Mt 6,4'],
 ['Moras vicisti et egisti. Disciplina verba vana superat.','1 Cor 9,24'],
 ['Unum iter confecisti. Constanter ad metam procede.','Heb 12,1'],
 ['Missio completa. Deo gratias age et fortiter procede.','Ps 117,24']
 ]
};
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
function cuiudoGoalBlessing(id){
 let hash=0;
 for(const c of String(id))hash=(Math.imul(hash,33)+c.charCodeAt(0))>>>0;
 const list=cuiudoBlessings[cuiudoLocale()]||cuiudoBlessings.pt;
 const [message,reference]=list[hash%list.length];
 return {message,reference};
}

/* Anotação diária local e privada: não incluir no estado sincronizado pelo D1. */
const cuiudoObstacleKey='terco-obstaculos-diarios-v1';
const cuiudoObstacleLabels={
 pt:['O que atrapalhou seu dia?','Anote o que dificultou suas metas. Reconheça, aprenda e recomece.','Ex.: distrações, cansaço, imprevistos ou falta de organização…','Salvo só neste aparelho · privado','Erro ao salvar neste aparelho'],
 en:['What got in your way today?','Note the obstacles, learn and begin again.','E.g. distractions, tiredness, unexpected events…','Saved only on this device · private','Unable to save on this device'],
 es:['¿Qué dificultó tu día?','Anota los obstáculos, aprende y vuelve a empezar.','Ej.: distracciones, cansancio, imprevistos…','Guardado solo en este dispositivo · privado','No se pudo guardar'],
 la:['Quid hodie impedivit?','Impedimenta nota, disce et rursus incipe.','Ex.: distractio, lassitudo, difficultates…','In hoc tantum instrumento servatum','Servari non potuit']
};
function cuiudoObstacleEntries(){
 try{
  const value=JSON.parse(localStorage.getItem(cuiudoObstacleKey)||'{}');
  return value&&typeof value==='object'&&!Array.isArray(value)?value:{};
 }catch{return {};}
}
function cuiudoObstacleLastDay(){
 const entries=cuiudoObstacleEntries();
 return Object.keys(entries).filter(day=>typeof entries[day]==='string'&&entries[day].trim()).sort().at(-1)||null;
}
function cuiudoObstacleRead(){
 const day=cuiudoObstacleLastDay();
 return day?cuiudoObstacleEntries()[day].slice(0,650):'';
}
function cuiudoObstacleSave(value){
 try{
  const entries=cuiudoObstacleEntries();
  // Editar a anotação existente, sem zerá-la depois da meia-noite.
  const day=cuiudoObstacleLastDay()||currentDay();
  const text=String(value||'').slice(0,650);
  if(text.trim())entries[day]=text;
  else delete entries[day]; // Ação explícita de apagar o texto.
  localStorage.setItem(cuiudoObstacleKey,JSON.stringify(entries));return true;
 }catch{return false;}
}
function cuiudoObstacleDelete(){
 try{
  const day=cuiudoObstacleLastDay();
  if(!day)return true;
  const entries=cuiudoObstacleEntries();
  delete entries[day];
  localStorage.setItem(cuiudoObstacleKey,JSON.stringify(entries));return true;
 }catch{return false;}
}
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

/* Compromisso diário persistente e particular deste navegador. */
const cuiudoEssentialKey='terco-compromisso-essencial-v1';
const cuiudoEssentialLabels={
 pt:['Concluído hoje','Marcar compromisso como concluído hoje'],
 en:['Completed today','Mark this commitment as completed today'],
 es:['Completado hoy','Marcar compromiso como completado hoy'],
 la:['Hodie completum','Hodie complevi']
};
function cuiudoEssentialDone(day=currentDay()){
 try{
  const all=JSON.parse(localStorage.getItem(cuiudoEssentialKey)||'{}');
  return !!(all&&typeof all==='object'&&!Array.isArray(all)&&all[day]===true);
 }catch{return false;}
}
function cuiudoEssentialSave(done){
 try{
  const data=JSON.parse(localStorage.getItem(cuiudoEssentialKey)||'{}');
  const all=data&&typeof data==='object'&&!Array.isArray(data)?data:{};
  const day=currentDay();
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

/* Temporizador por meta — já compatível com os campos do Cloudflare D1. */
let cuiudoTimerOpened=null;
const cuiudoTimerLabels={
 pt:{label:'Temporizador',minutes:'Minutos',start:'Iniciar',pause:'Pausar',resume:'Retomar',reset:'Reiniciar',running:'Contando',paused:'Pausado',done:'Tempo encerrado',ready:'Pronto'},
 en:{label:'Timer',minutes:'Minutes',start:'Start',pause:'Pause',resume:'Resume',reset:'Reset',running:'Running',paused:'Paused',done:'Time is up',ready:'Ready'},
 es:{label:'Temporizador',minutes:'Minutos',start:'Iniciar',pause:'Pausar',resume:'Continuar',reset:'Reiniciar',running:'Contando',paused:'Pausado',done:'Tiempo agotado',ready:'Listo'},
 la:{label:'Temporarium',minutes:'Minuta',start:'Incipe',pause:'Siste',resume:'Perge',reset:'Renova',running:'Currit',paused:'Intermissum',done:'Tempus finitum',ready:'Paratum'}
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
  ' <input data-timer-minutes type="number" min="1" max="1440" step="1" inputmode="numeric" value="'+Math.round(total/60)+'"></label>'+
  (phase==='finished'?'':'<button type="button" data-action="cuiudo-goal-timer-'+action+'" data-id="'+id+'">'+escapeHtml(caption)+'</button>')+
  '<button type="button" data-action="cuiudo-goal-timer-reset" data-id="'+id+'">'+escapeHtml(t.reset)+'</button>'+
  '</div></div>';
}

/* Aviso sonoro do temporizador. Web Audio é habilitado no clique de Iniciar/Retomar. */
let cuiudoTimerAudioContext=null;
function cuiudoTimerUnlockAudio(){
 try{
  const Type=window.AudioContext||window.webkitAudioContext;
  if(!Type)return;
  if(!cuiudoTimerAudioContext)cuiudoTimerAudioContext=new Type();
  if(cuiudoTimerAudioContext.state==='suspended'){
   const p=cuiudoTimerAudioContext.resume();p?.catch?.(()=>{});
  }
 }catch{}
}
function cuiudoTimerSound(){
 try{
  const ctx=cuiudoTimerAudioContext;
  if(!ctx||ctx.state==='closed')return;
  if(ctx.state==='suspended'){const p=ctx.resume();p?.catch?.(()=>{});}
  const base=ctx.currentTime+0.03;
  for(let i=0;i<3;i++){
   const at=base+i*0.32;
   const osc=ctx.createOscillator(),gain=ctx.createGain();
   osc.type='sine';
   osc.frequency.setValueAtTime(i===1?659.25:880,at);
   gain.gain.setValueAtTime(0.0001,at);
   gain.gain.exponentialRampToValueAtTime(0.20,at+0.02);
   gain.gain.exponentialRampToValueAtTime(0.0001,at+0.23);
   osc.connect(gain);gain.connect(ctx.destination);
   osc.start(at);osc.stop(at+0.24);
  }
 }catch{}
}

function cuiudoTimerStop(goal){
 if(goal.timer_state!=='running')return;
 goal.remaining_sec=cuiudoTimerSeconds(goal);
 goal.timer_started_at=null;goal.timer_state=goal.remaining_sec===0?'finished':'paused';
}

function cuiudoGoalChecklist(){
 const l=cuiudoLocale(),t=cuiudoGoalsText[l],goals=cuiudoGoalsNewestFirst(cuiudoGoalsToday());
 const metrics=cuiudoGoalCount();
 const pending=Math.max(0,metrics.total-metrics.done-metrics.failed);
 return '<section class="today-goals" aria-label="'+escapeHtml(t.heading)+'">'+
  '<div class="today-goals-top"><div><span class="eyebrow">✓ '+escapeHtml(t.heading)+'</span>'+
  '<h2>'+escapeHtml(t.heading)+'</h2><p class="goals-kick">'+escapeHtml(t.comeback)+'</p><p>'+escapeHtml(t.sub)+'</p></div>'+
  '<div class="today-goals-status"><strong>'+metrics.done+' / '+metrics.total+'</strong>'+
  '<span>'+escapeHtml(t.complete)+'</span></div></div>'+
  cuiudoAlternatingQuotes(l)+
  cuiudoEssentialCard(l)+
  '<form id="cuiudo-goal-form" class="today-goals-form"><label class="sr-only" for="cuiudo-goal-text">'+escapeHtml(t.label)+'</label>'+
  '<input id="cuiudo-goal-text" name="goal" maxlength="180" required autocomplete="off" placeholder="'+escapeHtml(t.placeholder)+'">'+

  '<button class="btn btn-primary" type="submit">'+escapeHtml(t.add)+' +</button></form>'+
  '<div class="today-goals-progress" role="progressbar" aria-label="'+escapeHtml(t.complete)+'" aria-valuenow="'+metrics.done+
  '" aria-valuemin="0" aria-valuemax="'+Math.max(1,metrics.total)+'"><span style="width:'+
   (metrics.total?Math.round(metrics.done/metrics.total*100):0)+'%"></span></div>'+
  '<div class="today-goals-list">'+(goals.length?goals.map((goal,i)=>{
   const status=goal.status||'pending',completed=status==='done',failed=status==='missed';
   return '<article class="today-goal '+(completed?'goal-completed':failed?'goal-missed':'goal-pending')+'">'+
   '<div class="today-goal-main"><span class="today-goal-icon" aria-hidden="true">'+(completed?'✓':failed?'!':String(i+1).padStart(2,'0'))+'</span>'+
   '<div class="today-goal-content"><div class="goal-card-heading"><strong class="goal-card-title">'+escapeHtml(goal.text)+'</strong>'+
   '<span class="goal-card-status '+(completed?'is-success':failed?'is-missed':'is-pending')+'">'+escapeHtml(completed?t.done:failed?t.undone:t.remaining)+'</span></div>'+
   (completed?(()=>{
      const blessing=cuiudoGoalBlessing(goal.id);
      const inspiration={pt:'Inspirado em',en:'Inspired by',es:'Inspirado en',la:'Ex'}[l];
      return '<div class="goal-gift goal-victory" role="status">'+
       '<div class="goal-victory-copy"><span class="goal-victory-kicker">'+escapeHtml(t.gift)+' · '+escapeHtml(cuiudoGoalGift(goal.id))+'</span>'+
       '<b>'+escapeHtml(blessing.message)+'</b>'+
       '<small>'+escapeHtml(inspiration)+' '+escapeHtml(blessing.reference)+'</small></div>'+
       '</div>';
    })():
   failed?'<p class="goal-reality" role="status">'+escapeHtml(t.comeback)+'</p><p class="goal-confession">'+escapeHtml(t.confession)+'</p>'+
    '<button class="goal-confession-link" type="button" data-action="navigate" data-tab="exame">'+escapeHtml(t.confessionButton)+' ↗</button>':'')+
   '</div></div><div class="today-goal-actions">'+
   (status==='pending'?'<button class="goal-action positive" type="button" data-action="cuiudo-goal-done" data-id="'+goal.id+'">✓ '+escapeHtml(t.done)+'</button>'+
   '<button class="goal-action" type="button" data-action="cuiudo-goal-missed" data-id="'+goal.id+'">✕ '+escapeHtml(t.missed)+'</button>'+
    '<button class="goal-action goal-timer-button" type="button" data-action="cuiudo-goal-timer-toggle" data-id="'+escapeHtml(goal.id)+'" aria-expanded="'+(cuiudoTimerOpened===goal.id?'true':'false')+'">⏱ '+escapeHtml(cuiudoTimerLabels[l].label)+'</button>':
   '<button class="goal-action" type="button" data-action="cuiudo-goal-reopen" data-id="'+goal.id+'">'+escapeHtml(t.reopen)+'</button>')+
   '<button class="goal-delete" type="button" data-action="cuiudo-goal-delete" data-id="'+goal.id+'" aria-label="'+escapeHtml(t.remove)+'">×</button></div>'+
   (status==='pending'&&cuiudoTimerOpened===goal.id?cuiudoTimerPanel(goal,l):'')+'</article>';
  }).join(''):'<p class="today-goals-empty">'+escapeHtml(t.empty)+'</p>')+'</div>'+
  cuiudoObstacleBox(l)+
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
 // Somente a pessoa pode excluir metas.
 save();
}
app.addEventListener('input',event=>{
 if(event.target?.id!=='cuiudo-obstacle-text')return;
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
app.addEventListener('submit',event=>{
 if(event.target?.id!=='cuiudo-goal-form')return;
 event.preventDefault();
 const input=event.target.querySelector('input[name=goal]');
 const text=String(input?.value||'').trim().slice(0,180);
 if(!text)return;
 state.dailyGoalDays??={};
 const day=currentDay(),items=state.dailyGoalDays[day]??=[];
 if(items.length>=30)return;
 const id=String(Date.now())+'-'+Math.random().toString(36).slice(2,8);
 const goal={id,text,status:'pending'};
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
  if(cuiudoObstacleDelete())render();
  return;
 }
 // Localizar a data original para editar/excluir uma meta antiga no D1.
 const found=Object.entries(state.dailyGoalDays||{}).find(([,arr])=>Array.isArray(arr)&&arr.some(item=>item.id===id));
 if(!found)return;
 const [day,items]=found,index=items.findIndex(x=>x.id===id);
 const goal=items[index];
 if(action==='cuiudo-goal-timer-toggle'){
  cuiudoTimerOpened=cuiudoTimerOpened===id?null:id;
  render();return;
 }
 if(action.startsWith('cuiudo-goal-timer-')){
  if(goal.status!=='pending')return;
  if(action==='cuiudo-goal-timer-pause')cuiudoTimerStop(goal);
  if(action==='cuiudo-goal-timer-resume'&&goal.timer_state==='paused'&&goal.remaining_sec>0){
   cuiudoTimerUnlockAudio();
   goal.timer_started_at=Date.now();goal.timer_state='running';
  }
  if(action==='cuiudo-goal-timer-start'||action==='cuiudo-goal-timer-reset'){
   const field=target.closest('.today-goal')?.querySelector('[data-timer-minutes]');
   const minutes=Number(field?.value||25);
   if(!Number.isSafeInteger(minutes)||minutes<1||minutes>1440){
    field?.setCustomValidity?.('Escolha um valor de 1 a 1440 minutos.');
    field?.reportValidity?.();return;
   }
   goal.duration_sec=minutes*60;goal.remaining_sec=goal.duration_sec;
   goal.timer_started_at=action==='cuiudo-goal-timer-start'?Date.now():null;
   goal.timer_state=action==='cuiudo-goal-timer-start'?'running':'paused';
   if(action==='cuiudo-goal-timer-start')cuiudoTimerUnlockAudio();
  }
  cuiudoGoalsSave();
  window.cuiudoGlobalGoals?.change('upsert',day,goal);
  render();return;
 }
 if(action==='cuiudo-goal-done'||action==='cuiudo-goal-missed'){
  cuiudoTimerStop(goal);
  if(cuiudoTimerOpened===id)cuiudoTimerOpened=null;
 }
 if(action==='cuiudo-goal-done')items[index].status='done';
 if(action==='cuiudo-goal-missed')items[index].status='missed';
 if(action==='cuiudo-goal-reopen')items[index].status='pending';
 const before={...goal};
 if(action==='cuiudo-goal-delete')items.splice(index,1);
 cuiudoGoalsSave();
 window.cuiudoGlobalGoals?.change(action==='cuiudo-goal-delete'?'delete':'upsert',day,
  action==='cuiudo-goal-delete'?before:items[index]);
 render();
});
render();

/* Atualiza todos os temporizadores, mesmo fechados; alarme apenas na transição. */
function cuiudoTimerTick(){
 let finished=0;
 for(const [day,items] of Object.entries(state.dailyGoalDays||{})){
  if(!Array.isArray(items))continue;
  for(const goal of items){
   if(!goal||goal.status!=='pending'||goal.timer_state!=='running')continue;
   if(cuiudoTimerSeconds(goal)>0)continue;
   cuiudoTimerStop(goal);
   cuiudoGoalsSave();
   window.cuiudoGlobalGoals?.change('upsert',day,goal);
   cuiudoTimerSound();
   finished++;
  }
 }
 if(finished)render();
 else if(typeof document.querySelectorAll==='function'){
  document.querySelectorAll('[data-cuiudo-clock]').forEach(node=>{
   const id=node.getAttribute('data-cuiudo-clock');
   const goal=Object.values(state.dailyGoalDays||{}).flatMap(x=>Array.isArray(x)?x:[]).find(g=>g.id===id);
   if(goal)node.textContent=cuiudoTimerFormat(cuiudoTimerSeconds(goal));
  });
 }
 return finished;
}
if(typeof window.setInterval==='function')window.setInterval(cuiudoTimerTick,1000);
if(typeof document.addEventListener==='function')document.addEventListener('visibilitychange',()=>{
 if(!document.hidden)cuiudoTimerTick();
});
