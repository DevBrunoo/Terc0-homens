/* Consequências restaurativas para metas marcadas como não concluídas.
 * O motivo e a reparação ficam só no dispositivo: nunca entram no quadro público D1.
 * Nenhuma meta é apagada ou marcada automaticamente ao passar da meia-noite.
 */
(function(){
 'use strict';
 const KEY='terco-consequencias-metas-v1';
 const minutes={high:20,medium:10,low:5};
 const texts={
  pt:{title:'Consequências',reason:'O que impediu esta meta?',hint:'Ex.: distração, imprevisto ou falta de planejamento',
   confirm:'Cumpri a reparação',done:'Reparação concluída',pending:'Pendente',
   required:'Registre primeiro o que impediu esta meta.',minutes:'Tempo sugerido'},
  en:{title:'Consequences',reason:'What prevented this goal?',hint:'E.g. distraction, unexpected events or lack of planning',
   confirm:'I completed the recovery step',done:'Recovery completed',pending:'Pending',
   required:'First note what prevented this goal.',minutes:'Suggested time'},
  es:{title:'Consecuencias',reason:'¿Qué impidió esta meta?',hint:'Ej.: distracción, imprevistos o falta de planificación',
   confirm:'Cumplí la reparación',done:'Reparación completada',pending:'Pendiente',
   required:'Primero anota qué impidió esta meta.',minutes:'Tiempo sugerido'},
  la:{title:'Consequentiae',reason:'Quid te impedivit?',hint:'Causam breviter scribe',
   confirm:'Emendationem complevi',done:'Emendatio completa',pending:'Pendet',
   required:'Primum causam scribe.',minutes:'Tempus propositum'}
 };
 let records={};
 try{
  const data=JSON.parse(localStorage.getItem(KEY)||'{}');
  if(data&&typeof data==='object'&&!Array.isArray(data))records=data;
 }catch{}
 const safe=value=>escapeHtml(String(value??''));
 function get(id){
  const r=records[id];
  return r&&typeof r==='object'?r:{reason:'',done_at:null};
 }
 function saveRecords(){
  try{localStorage.setItem(KEY,JSON.stringify(records));return true;}catch{return false;}
 }
 function findGoal(id){
  for(const list of Object.values(state.dailyGoalDays||{})){
   if(!Array.isArray(list))continue;
   const goal=list.find(x=>x?.id===id);
   if(goal)return goal;
  }
  return null;
 }
 function reset(id){
  if(Object.prototype.hasOwnProperty.call(records,id)){
   delete records[id];
   saveRecords();
  }
 }
 function isComplete(id){
  const r=get(id);
  return typeof r.reason==='string'&&r.reason.trim().length>0&&
   Number.isSafeInteger(r.done_at)&&r.done_at>0;
 }
 function completedTime(timestamp,locale){
  if(!Number.isSafeInteger(timestamp)||timestamp<=0)return '';
  const date=new Date(timestamp);
  if(!Number.isFinite(date.getTime()))return '';
  const language={pt:'pt-BR',en:'en-US',es:'es-ES',la:'pt-BR'}[locale]||'pt-BR';
  return new Intl.DateTimeFormat(language,{
   timeZone:'America/Sao_Paulo',dateStyle:'short',timeStyle:'short'
  }).format(date);
 }
 function card(goal,locale){
  if(!goal||goal.status!=='missed')return '';
  const t=texts[locale]||texts.pt,r=get(goal.id),done=isComplete(goal.id);
  const time=done?completedTime(r.done_at,locale):'';
  return '<div class="goal-consequence'+(done?' is-repaired':'')+'">'+
   '<label class="goal-consequence-label" for="goal-consequence-'+safe(goal.id)+'">'+safe(t.reason)+'</label>'+
   '<textarea id="goal-consequence-'+safe(goal.id)+'" data-cuiudo-consequence-reason="'+safe(goal.id)+
   '" rows="2" maxlength="240" placeholder="'+safe(t.hint)+'">'+safe(r.reason)+'</textarea>'+
   '<div class="goal-consequence-footer"><button type="button" class="goal-consequence-confirm" data-action="cuiudo-consequence-complete" data-id="'+safe(goal.id)+'"'+
   (done?' disabled aria-disabled="true"':'')+'>'+
   '<span aria-hidden="true">'+(done?'✓':'□')+'</span> '+safe(done?t.done:t.confirm)+'</button>'+
   (time?'<time class="goal-consequence-time" datetime="'+new Date(r.done_at).toISOString()+'">'+safe(time)+'</time>':'')+
   '</div></div>';
 }
 function panel(goals,locale){
  const t=texts[locale]||texts.pt;
  const labels={
   pt:{heading:'Consequências',description:'Reconheça, ajuste e siga em frente.',
    none:'Nenhuma meta não cumprida.',pending:'pendente',plural:'pendentes',allDone:'Tudo reparado'},
   en:{heading:'Consequences',description:'Reflect, adjust and move forward.',
    none:'No missed goals.',pending:'pending',plural:'pending',allDone:'All resolved'},
   es:{heading:'Consecuencias',description:'Reconoce, ajusta y sigue adelante.',
    none:'Ninguna meta incumplida.',pending:'pendiente',plural:'pendientes',allDone:'Todo reparado'},
   la:{heading:'Consequentiae',description:'Agnosce, emenda et perge.',
    none:'Nulla meta omissa.',pending:'pendet',plural:'pendent',allDone:'Omnia emendata'}
  }[locale]||{heading:'Consequências',description:'Reconheça, ajuste e siga em frente.',none:'Nenhuma meta não cumprida.',pending:'pendente',plural:'pendentes',allDone:'Tudo reparado'};
  const failed=(Array.isArray(goals)?goals:[]).filter(g=>g?.status==='missed');
  failed.sort((a,b)=>Number(isComplete(a.id))-Number(isComplete(b.id)));
  const open=failed.filter(g=>!isComplete(g.id)).length;
  const firstPending=failed.find(g=>!isComplete(g.id))?.id;
  const statusText=open?open+' '+(open===1?labels.pending:labels.plural):labels.allDone;
  const entries=failed.map(goal=>{
   const done=isComplete(goal.id);
   const n=minutes[goal.priority]||10;
   const duration=String(n)+' min';
   return '<details class="goals-consequence-entry'+(done?' is-repaired':'')+'"'+
    (goal.id===firstPending?' open':'')+'>'+
    '<summary class="goals-consequence-summary">'+
    '<span class="goals-consequence-name">'+safe(goal.text)+'</span>'+
    '<span class="goals-consequence-summary-meta">'+
    '<span class="goals-consequence-duration" title="'+safe(t.minutes)+'" aria-label="'+safe(t.minutes+': '+n+' min')+'">'+safe(duration)+'</span>'+
    '<span class="goals-consequence-status" aria-label="'+safe(done?t.done:t.pending)+'">'+
    (done?'✓':'•')+'</span>'+
    '<span class="goals-consequence-chevron" aria-hidden="true">⌄</span>'+
    '</span></summary>'+card(goal,locale)+'</details>';
  }).join('');
  return '<aside class="goals-consequence-panel" aria-label="'+safe(labels.heading)+'">'+
   '<div class="goals-consequence-heading">'+
   '<span class="goals-consequence-symbol" aria-hidden="true">↻</span>'+
   '<div class="goals-consequence-heading-text"><strong>'+safe(labels.heading)+'</strong>'+
   '<p>'+safe(labels.description)+'</p></div>'+
   (failed.length?'<span class="goals-consequence-count'+(open?'':' is-clear')+
    '" aria-label="'+safe(statusText)+'">'+safe(open?String(open):'✓')+'</span>':'')+
   '</div>'+
   '<div class="goals-consequence-list">'+
   (failed.length?entries:'<div class="goals-consequence-empty"><span aria-hidden="true">✓</span><p>'+safe(labels.none)+'</p></div>')+
   '</div></aside>';
 }
 window.cuiudoConsequences={card,panel,reset,isComplete};
 app.addEventListener('input',event=>{
  const field=event.target?.closest?.('[data-cuiudo-consequence-reason]');
  if(!field)return;
  const id=field.dataset.cuiudoConsequenceReason;
  if(findGoal(id)?.status!=='missed')return;
  field.setCustomValidity?.('');
  const reason=String(field.value||'').slice(0,240);
  const previous=get(id);
  records[id]={reason,done_at:reason.trim()?previous.done_at:null};
  saveRecords();
 });
 app.addEventListener('click',event=>{
  const button=event.target?.closest?.('[data-action="cuiudo-consequence-complete"]');
  if(!button)return;
  const id=button.dataset.id;
  if(findGoal(id)?.status!=='missed')return;
  const field=button.closest('.goal-consequence')?.querySelector('[data-cuiudo-consequence-reason]');
  const reason=String(field?.value||'').trim().slice(0,240);
  if(!reason){
   const t=texts[cuiudoLocale()]||texts.pt;
   field?.setCustomValidity?.(t.required);
   field?.reportValidity?.();
   field?.focus?.();
   return;
  }
  records[id]={reason,done_at:isComplete(id)?get(id).done_at:Date.now()};
  saveRecords();
  render();
 });
})();