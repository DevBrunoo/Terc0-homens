import {response,dbReady,checkOrigin,readJSON,rateLimit} from '../../server/cloud-security.js';

// Quadro GLOBAL intencionalmente público. Não recebe diário, intenções ou dados pessoais.
// Qualquer pessoa que conheça a URL pode visualizar e alterar estas metas.
const validId=v=>typeof v==='string'&&/^[A-Za-z0-9_.:-]{6,80}$/.test(v);
const validDay=v=>typeof v==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(v)&&
  !Number.isNaN(Date.parse(v+'T12:00:00Z'));
const allowed=new Set(['pending','done','missed']);
const cutoff=()=>new Date(Date.now()-121*86400000).toISOString().slice(0,10);

export async function onRequestGet(context){
 if(!dbReady(context))return response({error:'Banco D1 indisponível.'},503);
 try{
  const data=await context.env.DB.prepare(
   'SELECT id,day,text,status,updated_at FROM public_goals WHERE day>=? ORDER BY day,updated_at,id LIMIT 5000'
  ).bind(cutoff()).all();
  return response({goals:data.results||[],public:true,updatedAt:Date.now()});
 }catch(e){
  console.error('[CUIUDO public goals GET]',e);
  return response({error:'Falha ao consultar as metas globais. Verifique a migração 0003.'},503);
 }
}

export async function onRequestPost(context){
 if(!dbReady(context))return response({error:'Banco D1 indisponível.'},503);
 if(!checkOrigin(context.request))return response({error:'Origem não permitida.'},403);
 let body;
 try{body=await readJSON(context.request,1300);}
 catch{return response({error:'JSON inválido.'},400);}
 const {action,day,id}=body;
 if(!['upsert','delete'].includes(action)||!validId(id)||!validDay(day))
  return response({error:'Identificador, data ou ação inválidos.'},400);
 const nowDay=new Date().toISOString().slice(0,10);
 if(day<cutoff()||day>new Date(Date.now()+7*86400000).toISOString().slice(0,10))
  return response({error:'Só é possível alterar metas dos últimos 120 dias ou dos próximos sete dias.'},400);
 let status='deleted',goalText='';
 if(action==='upsert'){
  status=body.status;
  goalText=typeof body.text==='string'?body.text.trim():'';
  if(!allowed.has(status)||!goalText||goalText.length>180)
   return response({error:'Meta inválida (máximo de 180 caracteres).'},400);
 }
 try{
  // Requisições anônimas são limitadas por IP para evitar abuso automatizado.
  if(!await rateLimit(context,'public-goals','',100,600000))
   return response({error:'Muitas alterações. Aguarde alguns minutos.'},429);
  const db=context.env.DB;
  const exists=await db.prepare('SELECT day FROM public_goals WHERE id=?').bind(id).first();
  if(exists && exists.day!==day)return response({error:'Identificador em uso por outra data.'},409);
  if(!exists&&status!=='deleted'){
   const count=await db.prepare("SELECT count(*) AS n FROM public_goals WHERE day=? AND status!='deleted'").bind(day).first();
   if((count?.n||0)>=30)return response({error:'Limite de 30 metas para este dia.'},409);
  }
  await db.prepare(
   'INSERT INTO public_goals(id,day,text,status,updated_at) VALUES(?,?,?,?,?) '+
   'ON CONFLICT(id) DO UPDATE SET text=excluded.text,status=excluded.status,updated_at=excluded.updated_at '+
   'WHERE public_goals.day=excluded.day'
  ).bind(id,day,goalText,status,Date.now()).run();
  return response({ok:true,id,day,status,public:true});
 }catch(e){
  console.error('[CUIUDO public goals POST]',e);
  return response({error:'Falha ao salvar no banco D1.'},503);
 }
}
