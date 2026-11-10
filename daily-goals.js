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
function cuiudoGoalsToday(){
 state.dailyGoalDays??={};
 const day=currentDay();
 const items=state.dailyGoalDays[day];
 return Array.isArray(items)?items:[];
}
// A criação da meta está codificada no início do ID (Date.now()).
// Assim, mudar o status nunca altera sua posição na fila, inclusive após o D1 sincronizar.
function cuiudoGoalsNewestFirst(goals){
 const createdAt=goal=>{
  const match=/^(\d{13})(?:-|$)/.exec(String(goal?.id||''));
  return match?Number(match[1]):0;
 };
 return goals.slice().sort((a,b)=>createdAt(b)-createdAt(a));
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
function cuiudoObstacleRead(){
 try{
  const all=JSON.parse(localStorage.getItem(cuiudoObstacleKey)||'{}');
  return all&&typeof all==='object'&&!Array.isArray(all)&&typeof all[currentDay()]==='string'?all[currentDay()].slice(0,650):'';
 }catch{return '';}
}
function cuiudoObstacleSave(value){
 try{
  const raw=JSON.parse(localStorage.getItem(cuiudoObstacleKey)||'{}');
  const all=raw&&typeof raw==='object'&&!Array.isArray(raw)?raw:{};
  const day=currentDay(),text=String(value||'').slice(0,650);
  if(text.trim())all[day]=text;else delete all[day];
  const days=Object.keys(all).sort();
  for(const stale of days.slice(0,Math.max(0,days.length-120)))delete all[stale];
  localStorage.setItem(cuiudoObstacleKey,JSON.stringify(all));return true;
 }catch{return false;}
}
function cuiudoObstacleBox(locale){
 const t=cuiudoObstacleLabels[locale]||cuiudoObstacleLabels.pt;
 return '<aside class="goals-obstacle-box" aria-labelledby="goals-obstacle-title">'+
  '<div class="goals-obstacle-head"><span class="goals-obstacle-symbol" aria-hidden="true">✎</span>'+
  '<div><strong id="goals-obstacle-title">'+escapeHtml(t[0])+'</strong><p>'+escapeHtml(t[1])+'</p></div></div>'+
  '<label class="sr-only" for="cuiudo-obstacle-text">'+escapeHtml(t[0])+'</label>'+
  '<textarea id="cuiudo-obstacle-text" class="goals-obstacle-input" rows="2" maxlength="650" placeholder="'+escapeHtml(t[2])+'">'+escapeHtml(cuiudoObstacleRead())+'</textarea>'+
  '<div class="goals-obstacle-status" role="status" aria-live="polite">'+escapeHtml(t[3])+'</div></aside>';
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
  const days=Object.keys(all).sort();
  for(const stale of days.slice(0,Math.max(0,days.length-120)))delete all[stale];
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
function cuiudoGoalChecklist(){
 const l=cuiudoLocale(),t=cuiudoGoalsText[l],goals=cuiudoGoalsNewestFirst(cuiudoGoalsToday());
 const metrics=cuiudoGoalCount();
 const pending=Math.max(0,metrics.total-metrics.done-metrics.failed);
 return '<section class="today-goals" aria-label="'+escapeHtml(t.heading)+'">'+
  '<div class="today-goals-top"><div><span class="eyebrow">✓ '+escapeHtml(t.heading)+'</span>'+
  '<h2>'+escapeHtml(t.heading)+'</h2><p class="goals-kick">'+escapeHtml(t.comeback)+'</p><p>'+escapeHtml(t.sub)+'</p></div>'+
  '<div class="today-goals-status"><strong>'+metrics.done+' / '+metrics.total+'</strong>'+
  '<span>'+escapeHtml(t.complete)+'</span></div></div>'+
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
   '<button class="goal-action" type="button" data-action="cuiudo-goal-missed" data-id="'+goal.id+'">✕ '+escapeHtml(t.missed)+'</button>':
   '<button class="goal-action" type="button" data-action="cuiudo-goal-reopen" data-id="'+goal.id+'">'+escapeHtml(t.reopen)+'</button>')+
   '<button class="goal-delete" type="button" data-action="cuiudo-goal-delete" data-id="'+goal.id+'" aria-label="'+escapeHtml(t.remove)+'">×</button></div></article>';
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
 const days=state.dailyGoalDays||{};
 const keys=Object.keys(days).sort();
 for(const stale of keys.slice(0,Math.max(0,keys.length-120)))delete days[stale];
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
 const target=event.target.closest?.('[data-action^="cuiudo-goal-"]');
 if(!target)return;
 const action=target.dataset.action,id=target.dataset.id;
 const items=cuiudoGoalsToday(),index=items.findIndex(x=>x.id===id);
 if(index<0)return;
 const goal=items[index],day=currentDay();
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
