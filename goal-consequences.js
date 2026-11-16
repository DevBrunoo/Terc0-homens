/* Consequências restaurativas para metas marcadas como não concluídas.
 * O motivo e a reparação ficam só no dispositivo: nunca entram no quadro público D1.
 * Nenhuma meta é apagada ou marcada automaticamente ao passar da meia-noite.
 */
(function(){
 'use strict';
 const KEY='terco-consequencias-metas-v1';
 const minutes={high:20,medium:10,low:5};
 const texts={
  pt:{title:'CONSEQUÊNCIA · REPARAÇÃO',call:'Falhou? Assuma, corrija e volte ao combate.',
   action:'Faça {n} minutos de retomada focada ou, se houver impedimento real, planeje o menor próximo passo.',
   reason:'O que impediu esta meta?',hint:'Seja concreto: distração, imprevisto, cansaço, falta de planejamento…',
   confirm:'Cumpri a reparação',done:'Reparação cumprida',pending:'Reparação pendente',
   required:'Registre primeiro o motivo ou impedimento.',
   note:'Não se trata de castigo físico nem de culpa automática. A consequência é corrigir a rota.'},
  en:{title:'CONSEQUENCE · MAKE AMENDS',call:'Missed it? Own it, correct course, start again.',
   action:'Spend {n} focused minutes restarting, or plan the smallest next step if truly prevented.',
   reason:'What prevented this goal?',hint:'Be specific: distraction, unexpected event, exhaustion, poor planning…',
   confirm:'I completed the recovery step',done:'Recovery completed',pending:'Recovery pending',
   required:'First note the reason or obstacle.',
   note:'No physical punishment or automatic guilt. The consequence is to correct your course.'},
  es:{title:'CONSECUENCIA · REPARACIÓN',call:'¿Fallaste? Reconócelo, corrige y vuelve a empezar.',
   action:'Dedica {n} minutos a retomar la tarea o, ante un impedimento real, planifica el siguiente paso mínimo.',
   reason:'¿Qué impidió esta meta?',hint:'Sé concreto: distracciones, imprevistos, cansancio, falta de planificación…',
   confirm:'Cumplí la reparación',done:'Reparación cumplida',pending:'Reparación pendiente',
   required:'Primero registra el motivo o impedimento.',
   note:'Sin castigos físicos ni culpa automática. La consecuencia es corregir el rumbo.'},
  la:{title:'CONSEQUENTIA · EMENDATIO',call:'Defecisti? Agnosce, emenda, iterum incipe.',
   action:'Per {n} minuta intentus opus repete, aut proximum gradum parvum dispone, si impeditus es.',
   reason:'Quid te impedivit?',hint:'Causam concrete scribe…',
   confirm:'Emendationem complevi',done:'Emendatio completa',pending:'Emendatio pendet',
   required:'Primum causam scribe.',
   note:'Non poena corporalis nec culpa automatica: iter corrige.'}
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
  const n=minutes[goal.priority]||10;
  return '<section class="goal-consequence'+(done?' is-repaired':'')+'" aria-label="'+safe(t.title)+'">'+
   '<div class="goal-consequence-top"><span class="goal-consequence-eyebrow">'+safe(t.title)+'</span>'+
   '<span class="goal-consequence-state">'+safe(done?t.done:t.pending)+'</span></div>'+
   '<strong class="goal-consequence-call">'+safe(t.call)+'</strong>'+
   '<p class="goal-consequence-task">'+safe(t.action.replace('{n}',String(n)))+'</p>'+
   '<label class="goal-consequence-label" for="goal-consequence-'+safe(goal.id)+'">'+safe(t.reason)+'</label>'+
   '<textarea id="goal-consequence-'+safe(goal.id)+'" data-cuiudo-consequence-reason="'+safe(goal.id)+
   '" rows="2" maxlength="240" placeholder="'+safe(t.hint)+'">'+safe(r.reason)+'</textarea>'+
   '<div class="goal-consequence-footer"><button type="button" class="goal-consequence-confirm" data-action="cuiudo-consequence-complete" data-id="'+safe(goal.id)+'">'+
   (done?'✓ ':'□ ')+safe(done?t.done:t.confirm)+'</button>'+
   (time?'<time class="goal-consequence-time" datetime="'+new Date(r.done_at).toISOString()+'">'+safe(time)+'</time>':'')+
   '</div><small class="goal-consequence-note">'+safe(t.note)+'</small></section>';
 }
 window.cuiudoConsequences={card,reset,isComplete};
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