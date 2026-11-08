/* CUIÚDO — checklist do dia, com metas definidas pela própria pessoa.
 * Checklists ficam apenas no localStorage. Nenhuma conta nem servidor.
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
function cuiudoGoalChecklist(){
 const l=cuiudoLocale(),t=cuiudoGoalsText[l],goals=cuiudoGoalsToday();
 const metrics=cuiudoGoalCount();
 const pending=Math.max(0,metrics.total-metrics.done-metrics.failed);
 return '<section class="today-goals" aria-label="'+escapeHtml(t.heading)+'">'+
  '<div class="today-goals-top"><div><span class="eyebrow">✓ '+escapeHtml(t.heading)+'</span>'+
  '<h2>'+escapeHtml(t.heading)+'</h2><p class="goals-kick">'+escapeHtml(t.comeback)+'</p><p>'+escapeHtml(t.sub)+'</p></div>'+
  '<div class="today-goals-status"><strong>'+metrics.done+' / '+metrics.total+'</strong>'+
  '<span>'+escapeHtml(t.complete)+'</span></div></div>'+
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
   '<div class="today-goal-content"><strong>'+escapeHtml(goal.text)+'</strong>'+
   (completed?'<div class="goal-gift" role="status"><span class="goal-gift-icon" aria-hidden="true">🎁</span>'+
    '<div><b>'+escapeHtml(t.gift)+': '+escapeHtml(cuiudoGoalGift(goal.id))+'</b><small>'+
    escapeHtml(t.rewardText)+'</small></div><span aria-hidden="true">✦ ✧</span></div>':
   failed?'<p class="goal-reality" role="status">'+escapeHtml(t.comeback)+'</p><p class="goal-confession">'+escapeHtml(t.confession)+'</p>'+
    '<button class="goal-confession-link" type="button" data-action="navigate" data-tab="exame">'+escapeHtml(t.confessionButton)+' ↗</button>':'')+
   '</div></div><div class="today-goal-actions">'+
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
 const close=html.indexOf('</section>',start);
 if(start<0||close<0)return cuiudoGoalChecklist()+html;
 return html.slice(0,close+10)+cuiudoGoalChecklist()+html.slice(close+10);
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
 items.push({id,text,status:'pending'});
 cuiudoGoalsSave();
 render();
});
app.addEventListener('click',event=>{
 const target=event.target.closest?.('[data-action^="cuiudo-goal-"]');
 if(!target)return;
 const action=target.dataset.action,id=target.dataset.id;
 const items=cuiudoGoalsToday(),index=items.findIndex(x=>x.id===id);
 if(index<0)return;
 if(action==='cuiudo-goal-done')items[index].status='done';
 if(action==='cuiudo-goal-missed')items[index].status='missed';
 if(action==='cuiudo-goal-reopen')items[index].status='pending';
 if(action==='cuiudo-goal-delete')items.splice(index,1);
 cuiudoGoalsSave();render();
});
render();
