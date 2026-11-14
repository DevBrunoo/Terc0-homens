/* Histórico público e factual: eventos registrados no servidor depois desta atualização.
 * O banco não permite reconstruir o dia exato das conclusões anteriores. */
(function(){
 'use strict';
 const MAX_PAGES=20;
 let events=[],loaded=false,loading=false,lastFetch=0,error='';
 function dayOf(timestamp){
  const date=new Date(Number(timestamp));
  if(!Number.isFinite(date.getTime()))return '';
  return date.getFullYear()+'-'+String(date.getMonth()+1).padStart(2,'0')+'-'+String(date.getDate()).padStart(2,'0');
 }
 function valid(e){
  return e&&Number.isSafeInteger(e.event_id)&&Number.isSafeInteger(e.occurred_at)&&
   e.occurred_at>0&&typeof e.goal_id==='string'&&
   ['created','completed','missed','reopened','deleted','restored','priority'].includes(e.event_type);
 }
 async function fetchHistory(force=false){
  if(loading||!navigator.onLine&&navigator.onLine!==undefined)return;
  if(!force&&Date.now()-lastFetch<40000)return;
  loading=true;
  try{
   const next=[];let offset=0;
   for(let page=0;page<MAX_PAGES;page++){
    const res=await fetch('/api/goal-history'+(offset?'?offset='+offset:''),{
     credentials:'same-origin',cache:'no-store',headers:{Accept:'application/json'}
    });
    if(!res.ok)throw new Error('HTTP '+res.status);
    const data=await res.json();
    if(!Array.isArray(data.events))throw new Error('Formato de histórico inesperado');
    next.push(...data.events.filter(valid));
    if(!data.hasMore||!data.events.length)break;
    offset+=data.events.length;
   }
   const updated=JSON.stringify(next)!==JSON.stringify(events);
   events=next;loaded=true;error='';lastFetch=Date.now();
   if(updated&&typeof render==='function'&&['inicio','desafios'].includes(state.tab))render();
  }catch(e){error=String(e?.message||e).slice(0,100)}
  finally{loading=false}
 }
 window.cuiudoGoalHistory={
  get events(){return events;},
  get loaded(){return loaded;},
  get error(){return error;},
  byDay(days=14,endDay=currentDay()){
   const end=Date.parse(endDay+'T12:00:00');
   if(!Number.isFinite(end))return [];
   const dates=Array.from({length:days},(_,i)=>{
    const d=new Date(end-(days-1-i)*86400000);
    return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
   });
   return dates.map(day=>{
    const dayEvents=events.filter(e=>dayOf(e.occurred_at)===day);
    const count=type=>dayEvents.filter(e=>e.event_type===type).length;
    return {day,completed:count('completed'),missed:count('missed'),created:count('created'),
     resolved:count('completed')+count('missed')};
   });
  },
  refresh:()=>fetchHistory(true)
 };
 if(location.protocol!=='file:'&&typeof window.fetch==='function'){
  fetchHistory(true);
  window.addEventListener('focus',()=>fetchHistory());
  window.addEventListener('online',()=>fetchHistory(true));
  window.setInterval(()=>{if(!document.hidden)fetchHistory()},45000);
 }
})();
