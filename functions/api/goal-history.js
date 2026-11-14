import {response,dbReady} from '../../server/cloud-security.js';

/* Histórico das metas públicas: somente transições realmente persistidas no D1.
   Não contém diário, intenções, anotações privadas nem eventos retroativos inventados. */
export async function onRequestGet(context){
 if(!dbReady(context))return response({error:'Banco D1 indisponível.'},503);
 try{
  const raw=new URL(context.request.url).searchParams.get('offset')||'0';
  if(!/^\\d{1,7}$/.test(raw))return response({error:'Página inválida.'},400);
  const result=await context.env.DB.prepare(
   'SELECT event_id,goal_id,goal_day,event_type,priority,occurred_at FROM goal_events '+
   'ORDER BY event_id DESC LIMIT 500 OFFSET ?'
  ).bind(Number(raw)).all();
  const events=result.results||[];
  return response({events,hasMore:events.length===500,source:'persisted-events',public:true});
 }catch(error){
  console.error('[goal-history]',error);
  return response({error:'Histórico temporariamente indisponível.'},503);
 }
}
