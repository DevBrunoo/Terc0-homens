/* CUIÚDO — checklist do dia, com metas definidas pela própria pessoa.
 * Metas públicas compartilhadas automaticamente pelo D1; diário e intenções são locais.
 */
const cuiudoGoalsText={
 pt:{heading:'Metas de hoje',sub:'Escreva o que precisa fazer. Depois assuma o resultado.',
  label:'Nova meta',placeholder:'Ex.: estudar 40 minutos, rezar o terço, resolver uma pendência',
  add:'Adicionar',done:'Concluí',missed:'Não concluí',reopen:'Reabrir',remove:'Excluir',
  complete:'Concluídas',remaining:'Pendente',gift:'Seu presente',empty:'Sua primeira meta começa aqui.',
  comeback:'Você é muito macio! Reorganize-se, levante e faça acontecer.',
  confession:'Preguiça é pecado, omissão é pecado, não fazer o que cumpre é coisa de macio frango, você vai ter que se confessar.',
  confessionButton:'Examinar e corrigir',
  undone:'Não concluída',earned:['Medalha da Coragem','Selo da Disciplina','Estrela da Perseverança','Troféu da Palavra Cumprida'],
  rewardText:'Você fez o que prometeu. O presente é uma conquista virtual: continue firme.'},
 en:{heading:"Today's goals",sub:'Write down what needs doing. Then own the result.',
  label:'New goal',placeholder:'E.g. study for 40 minutes, pray the Rosary',add:'Add',
  done:'Completed',missed:'Not completed',reopen:'Reopen',remove:'Delete',
  complete:'Completed',remaining:'Pending',gift:'Your gift',empty:'Your first goal starts here.',
  comeback:'You have gone soft! Stand up, regroup and get it done.',
  confession:'Deliberate neglect of real duties may be sinful. Examine your conscience and bring culpable failures to Confession; not every missed personal goal is a mortal sin.',
  confessionButton:'Examine and act',
  undone:'Not completed',earned:['Medal of Courage','Discipline Badge','Star of Perseverance','Promise Kept Trophy'],
  rewardText:'You followed through. Your gift is a virtual achievement: keep going.'},
 es:{heading:'Metas de hoy',sub:'Escribe lo que debes hacer y asume el resultado.',
  label:'Nueva meta',placeholder:'Ej.: estudiar 40 minutos, rezar el Rosario',add:'Añadir',
  done:'Cumplí',missed:'No cumplí',reopen:'Reabrir',remove:'Eliminar',
  complete:'Cumplidas',remaining:'Pendientes',gift:'Tu regalo',empty:'Tu primera meta empieza aquí.',
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
function cuiudoGoalsToday(){
 state.dailyGoalDays??={};
 const day=currentDay();
 const items=state.dailyGoalDays[day];
 return Array.isArray(items)?items:[];
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
 ['🏆','Vai para cima! Hoje a fé virou atitude.','Tg 2,17'],
 ['🌿','Fiel no pouco. É assim que se constrói a santidade.','Lc 16,10'],
 ['⚔️','Coragem! Deus te deu forças e você fez sua parte.','Js 1,9'],
 ['🔥','Sem desculpas: você combateu o bom combate.','2Tm 4,7'],
 ['✨','Trabalho feito com amor também é oração.','Cl 3,23'],
 ['🦁','Você perseverou. Não pare de crescer!','Rm 5,3–4'],
 ['🌟','A preguiça não venceu esta batalha. Avante!','Pr 6,6'],
 ['💪','Mais uma obra boa. Continue firme, sem desanimar.','Gl 6,9'],
 ['🕊️','O bem feito em silêncio também tem valor diante de Deus.','Mt 6,4'],
 ['🎯','Menos promessa, mais atitude. Você entregou!','1Cor 9,24'],
 ['🚀','Pé na tábua e fé no coração. Missão cumprida!','Hb 12,1'],
 ['🙏','Agradeça a Deus por esta pequena grande vitória.','Sl 118(117),24']
 ],
 en:[
 ['🏆','Go forward! Today faith became action.','Jas 2:17'],
 ['🌿','Faithful in small things. Holiness grows here.','Lk 16:10'],
 ['⚔️','Be courageous. You did your part today.','Jos 1:9'],
 ['🔥','No excuses: you fought the good fight.','2 Tim 4:7'],
 ['✨','Work done with love can become prayer.','Col 3:23'],
 ['🦁','You persevered. Keep growing.','Rom 5:3–4'],
 ['🌟','Laziness did not win this battle.','Prov 6:6'],
 ['💪','One more good work. Do not give up.','Gal 6:9'],
 ['🕊️','Quiet goodness is precious before God.','Mt 6:4'],
 ['🎯','Fewer promises, more action. Done!','1 Cor 9:24'],
 ['🚀','Faith in your heart. Mission accomplished!','Heb 12:1'],
 ['🙏','Thank God for this meaningful victory.','Ps 118:24']
 ],
 es:[
 ['🏆','¡Adelante! Hoy la fe se convirtió en acción.','St 2,17'],
 ['🌿','Fiel en lo pequeño. Así crece la santidad.','Lc 16,10'],
 ['⚔️','¡Valor! Hoy cumpliste con tu deber.','Jos 1,9'],
 ['🔥','Sin excusas: libraste el buen combate.','2 Tim 4,7'],
 ['✨','El trabajo hecho con amor también es oración.','Col 3,23'],
 ['🦁','Perseveraste. ¡Sigue creciendo!','Rom 5,3–4'],
 ['🌟','La pereza no ganó esta batalla.','Prov 6,6'],
 ['💪','Otra buena obra. ¡No te rindas!','Gal 6,9'],
 ['🕊️','El bien silencioso es valioso ante Dios.','Mt 6,4'],
 ['🎯','Menos promesas, más acción. ¡Lo lograste!','1 Cor 9,24'],
 ['🚀','Fe en el corazón. ¡Misión cumplida!','Heb 12,1'],
 ['🙏','Da gracias a Dios por esta victoria.','Sal 118,24']
 ],
 la:[
 ['🏆','Age fortiter! Fides hodie in opere fulsit.','Iac 2,17'],
 ['🌿','In parvis fidelis. Sic crescit sanctitas.','Lc 16,10'],
 ['⚔️','Esto fortis. Officium tuum perfecisti.','Ios 1,9'],
 ['🔥','Sine excusationibus: bonum certamen certasti.','2 Tim 4,7'],
 ['✨','Opus cum caritate factum oratio fieri potest.','Col 3,23'],
 ['🦁','Perseverasti. Perge in bonum!','Rom 5,3–4'],
 ['🌟','Pigritia hodie non vicit.','Prov 6,6'],
 ['💪','Aliud opus bonum. Noli deficere.','Gal 6,9'],
 ['🕊️','Bonum occultum coram Deo pretiosum est.','Mt 6,4'],
 ['🎯','Minus promittendum, plus agendum.','1 Cor 9,24'],
 ['🚀','Fides in corde. Missio completa!','Heb 12,1'],
 ['🙏','Deo gratias pro hac victoria age.','Ps 117,24']
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
 const [emoji,message,reference]=list[hash%list.length];
 return {emoji,message,reference};
}
function cuiudoTimerSeconds(goal){
 const seconds=Number(goal.remaining_sec)||0;
 if(goal.timer_state==='running'&&Number.isFinite(goal.timer_started_at))
  return Math.max(0,seconds-Math.floor((Date.now()-goal.timer_started_at)/1000));
 return Math.max(0,seconds);
}
function cuiudoTimerClock(seconds){
 const n=Math.max(0,Math.floor(seconds));
 return String(Math.floor(n/60)).padStart(2,'0')+':'+String(n%60).padStart(2,'0');
}
function cuiudoTimerPanel(goal){
 const duration=Number(goal.duration_sec)||0,active=duration>0,seconds=cuiudoTimerSeconds(goal);
 const phase=goal.timer_state||'none',finished=phase==='finished'||(active&&phase==='running'&&seconds===0);
 return '<div class="goal-timer" data-goal-timer="'+escapeHtml(goal.id)+'">'+
  '<div class="goal-timer-top"><span class="goal-timer-label">⏱ '+(active?'Tempo da atividade':'Definir tempo')+'</span>'+
  '<strong class="goal-timer-clock" data-timer-clock="'+escapeHtml(goal.id)+'">'+(active?cuiudoTimerClock(seconds):'--:--')+'</strong></div>'+
  '<div class="goal-timer-controls"><label class="goal-timer-set"><span>min</span>'+
    '<input type="number" inputmode="numeric" min="1" max="1440" step="1" data-timer-minutes="'+escapeHtml(goal.id)+
    '" value="'+(active?Math.ceil(duration/60):25)+'" aria-label="Minutos para '+escapeHtml(goal.text)+'"></label>'+
  (active&&phase==='running'&&!finished?
    '<button type="button" data-action="cuiudo-timer-pause" data-id="'+escapeHtml(goal.id)+'">Ⅱ Pausar</button>':
   active&&!finished?'<button type="button" data-action="cuiudo-timer-resume" data-id="'+escapeHtml(goal.id)+'">▶ Continuar</button>':
    '<button type="button" data-action="cuiudo-timer-start" data-id="'+escapeHtml(goal.id)+'">▶ Iniciar</button>')+
  '<button type="button" data-action="cuiudo-timer-reset" data-id="'+escapeHtml(goal.id)+'">↻ Reiniciar</button></div>'+
  '<small class="goal-timer-state">'+(finished?'Tempo encerrado':!active?'Escolha os minutos e inicie':phase==='paused'?'Pausado':'Contando automaticamente')+
  '</small></div>';
}
function cuiudoGoalChecklist(){
 const l=cuiudoLocale(),t=cuiudoGoalsText[l],goals=cuiudoGoalsToday();
 const metrics=cuiudoGoalCount();
 const pending=Math.max(0,metrics.total-metrics.done-metrics.failed);
 return '<section class="today-goals" aria-label="'+escapeHtml(t.heading)+'">'+
  '<div class="today-goals-top"><div><span class="eyebrow">✓ '+escapeHtml(t.heading)+'</span>'+
  '<h2>'+escapeHtml(t.heading)+'</h2><p class="goals-kick">'+escapeHtml(t.comeback)+'</p><p>'+escapeHtml(t.sub)+'</p></div>'+
  '<div class="today-goals-status"><strong>'+metrics.done+' / '+metrics.total+'</strong>'+
  '<span>'+escapeHtml(t.complete)+'</span></div></div>'+
  '<aside class="goals-permanent-note" aria-label="'+escapeHtml(cuiudoPinnedLabels[l][0])+'">'+
   '<span class="goals-note-icon" aria-hidden="true">✝</span>'+
   '<div><span class="goals-note-eyebrow">✦ '+escapeHtml(cuiudoPinnedLabels[l][0])+'</span>'+
   '<strong>'+escapeHtml(cuiudoPermanentNotes[l])+'</strong>'+
   '<small>'+escapeHtml(cuiudoPinnedLabels[l][1])+'</small></div>'+
   '<span class="goals-note-pin" aria-hidden="true">SEMPRE</span></aside>'+
  '<form id="cuiudo-goal-form" class="today-goals-form"><label class="sr-only" for="cuiudo-goal-text">'+escapeHtml(t.label)+'</label>'+
  '<input id="cuiudo-goal-text" name="goal" maxlength="180" required autocomplete="off" placeholder="'+escapeHtml(t.placeholder)+'">'+
  '<label class="cuiudo-timer-duration" title="Tempo para esta atividade"><span>⏱ Minutos</span><input type="number" name="minutes" inputmode="numeric" min="0" max="1440" step="1" value="25" aria-label="Duração da meta em minutos (zero para não iniciar)"></label>'+
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
       '<span class="goal-gift-icon goal-victory-emoji" aria-hidden="true">'+blessing.emoji+'</span>'+
       '<div class="goal-victory-copy"><span class="goal-victory-kicker">✦ '+escapeHtml(t.gift)+' · '+escapeHtml(cuiudoGoalGift(goal.id))+'</span>'+
       '<b>'+escapeHtml(blessing.message)+'</b>'+
       '<small>'+escapeHtml(inspiration)+' '+escapeHtml(blessing.reference)+'</small></div>'+
       '<span class="goal-victory-spark" aria-hidden="true">✦</span></div>';
    })():
   failed?'<p class="goal-reality" role="status">'+escapeHtml(t.comeback)+'</p><p class="goal-confession">'+escapeHtml(t.confession)+'</p>'+
    '<button class="goal-confession-link" type="button" data-action="navigate" data-tab="exame">'+escapeHtml(t.confessionButton)+' ↗</button>':'')+
   '</div></div>'+cuiudoTimerPanel(goal)+'<div class="today-goal-actions">'+
   (status==='pending'?'<button class="goal-action positive" type="button" data-action="cuiudo-goal-done" data-id="'+goal.id+'">✓ '+escapeHtml(t.done)+'</button>'+
   '<button class="goal-action" type="button" data-action="cuiudo-goal-missed" data-id="'+goal.id+'">✕ '+escapeHtml(t.missed)+'</button>':
   '<button class="goal-action" type="button" data-action="cuiudo-goal-reopen" data-id="'+goal.id+'">'+escapeHtml(t.reopen)+'</button>')+
   '<button class="goal-delete" type="button" data-action="cuiudo-goal-delete" data-id="'+goal.id+'" aria-label="'+escapeHtml(t.remove)+'">×</button></div></article>';
  }).join(''):'<p class="today-goals-empty">'+escapeHtml(t.empty)+'</p>')+'</div>'+
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
 const days=state.dailyGoalDays||{};
 const keys=Object.keys(days).sort();
 for(const stale of keys.slice(0,Math.max(0,keys.length-120)))delete days[stale];
 save();
}
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
 const inputMinutes=event.target.querySelector('input[name=minutes]');
 const minutes=Math.max(0,Math.min(1440,Math.floor(Number(inputMinutes?.value)||0)));
 const goal={id,text,status:'pending',
  duration_sec:minutes*60,remaining_sec:minutes*60,
  timer_started_at:minutes?Date.now():null,timer_state:minutes?'running':'none'};
 items.push(goal);
 cuiudoGoalsSave();
 window.cuiudoGlobalGoals?.change('upsert',day,goal);
 render();
});
app.addEventListener('click',event=>{
 const target=event.target.closest?.('[data-action^="cuiudo-goal-"],[data-action^="cuiudo-timer-"]');
 if(!target)return;
 const action=target.dataset.action,id=target.dataset.id;
 const items=cuiudoGoalsToday(),index=items.findIndex(x=>x.id===id);
 if(index<0)return;
 const goal=items[index],day=currentDay();
 if(action.startsWith('cuiudo-timer-')){
  if(action==='cuiudo-timer-pause'&&goal.timer_state==='running'){
   goal.remaining_sec=cuiudoTimerSeconds(goal);
   goal.timer_started_at=null;goal.timer_state=goal.remaining_sec?'paused':'finished';
  }
  if(action==='cuiudo-timer-resume'&&goal.timer_state!=='running'){
   goal.remaining_sec=cuiudoTimerSeconds(goal);
   if(goal.remaining_sec>0){goal.timer_started_at=Date.now();goal.timer_state='running';}
  }
  if(action==='cuiudo-timer-start'||action==='cuiudo-timer-reset'){
   const input=app.querySelector('[data-timer-minutes="'+id+'"]');
   const minutes=Math.max(1,Math.min(1440,Math.floor(Number(input?.value)||25)));
   goal.duration_sec=minutes*60;goal.remaining_sec=goal.duration_sec;
   goal.timer_started_at=Date.now();goal.timer_state='running';
  }
  cuiudoGoalsSave();
  window.cuiudoGlobalGoals?.change('upsert',day,goal);
  render();return;
 }
 if(action==='cuiudo-goal-done')items[index].status='done';
 if(action==='cuiudo-goal-missed')items[index].status='missed';
 if(action==='cuiudo-goal-reopen')items[index].status='pending';
 if((action==='cuiudo-goal-done'||action==='cuiudo-goal-missed')&&goal.timer_state==='running'){
  goal.remaining_sec=cuiudoTimerSeconds(goal);
  goal.timer_started_at=null;goal.timer_state=goal.remaining_sec?'paused':'finished';
 }
 const before={...goal};
 if(action==='cuiudo-goal-delete')items.splice(index,1);
 cuiudoGoalsSave();
 window.cuiudoGlobalGoals?.change(action==='cuiudo-goal-delete'?'delete':'upsert',day,
  action==='cuiudo-goal-delete'?before:items[index]);
 render();
});
render();

/* Cronômetros por timestamp: seguem contando mesmo com a tela bloqueada. */
if(typeof window!=='undefined'&&typeof window.setInterval==='function'){
 window.setInterval(()=>{
  if(typeof document==='undefined'||typeof document.querySelectorAll!=='function')return;
  for(const clock of document.querySelectorAll('[data-timer-clock]')){
   const id=clock.getAttribute('data-timer-clock');
   const goal=cuiudoGoalsToday().find(item=>item.id===id);
   if(!goal||!goal.duration_sec)continue;
   const seconds=cuiudoTimerSeconds(goal),next=cuiudoTimerClock(seconds);
   if(clock.textContent!==next)clock.textContent=next;
   const panel=clock.closest('.goal-timer'),hint=panel?.querySelector('.goal-timer-state');
   if(hint&&goal.timer_state==='running'&&seconds===0){
    hint.textContent='Tempo encerrado';panel.classList.add('goal-timer-finished');
   }
  }
 },1000);
}
