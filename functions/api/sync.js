import {response,dbReady,checkOrigin,readJSON,currentUser} from '../_lib/security.js';

// Apenas dados do usuário: telas/controles temporários não vão para o banco.
export const SYNC_KEYS=['progress','decadePrayers','challengeDays','examineDays','missionDays',
  'dailyGoalDays','notes','feedSaved','feedDone','rosaryIntention','musicTrack','musicVolume',
  'theme','appLang','mode','rosaryLength','rosaryLengthSetting','verseLang','designVersion'];

function validateState(value){
  if(!value||typeof value!=='object'||Array.isArray(value))throw new Error('Estado inválido');
  const clean={};
  for(const key of SYNC_KEYS)if(Object.prototype.hasOwnProperty.call(value,key))clean[key]=value[key];
  for(const name of ['progress','decadePrayers','challengeDays','examineDays','missionDays','dailyGoalDays','feedSaved','feedDone']){
    if(clean[name]!==undefined && (!clean[name]||typeof clean[name]!=='object'||Array.isArray(clean[name])))
      throw new Error('Estado inválido');
  }
  if(clean.notes!==undefined&&!Array.isArray(clean.notes))throw new Error('Notas inválidas');
  const text=JSON.stringify(clean);
  if(new TextEncoder().encode(text).byteLength>120000)throw new Error('Limite de 120 KB por usuário');
  return text;
}
async function load(context,id){
  return await context.env.DB.prepare('SELECT data,revision,updated_at FROM synced_state WHERE user_id=?').bind(id).first();
}
export async function onRequestGet(context){
  if(!dbReady(context))return response({error:'Banco D1 não configurado (binding DB)'},503);
  try{
    const user=await currentUser(context);
    if(!user)return response({error:'Faça login para sincronizar.'},401);
    const row=await load(context,user.id);
    return response({revision:row?.revision||0,state:row?JSON.parse(row.data):{},updatedAt:row?.updated_at||null});
  }catch{return response({error:'Erro de leitura no D1. Execute a migração.'},503);}
}
export async function onRequestPut(context){
  if(!dbReady(context))return response({error:'Banco D1 não configurado (binding DB)'},503);
  if(!checkOrigin(context.request))return response({error:'Origem inválida'},403);
  let body,record;
  try{
    body=await readJSON(context.request,130000);
    if(!Number.isSafeInteger(body.revision)||body.revision<0)throw new Error('Revisão inválida');
    record=validateState(body.state);
  }catch(e){return response({error:String(e.message||'Dados inválidos')},400);}
  try{
    const user=await currentUser(context);
    if(!user)return response({error:'Faça login novamente.'},401);
    const db=context.env.DB,now=Date.now();
    let changed=0;
    if(body.revision===0){
      const result=await db.prepare('INSERT INTO synced_state(user_id,data,revision,updated_at) VALUES(?,?,1,?) ON CONFLICT(user_id) DO NOTHING')
        .bind(user.id,record,now).run();
      changed=result.meta?.changes||0;
    }else{
      const result=await db.prepare('UPDATE synced_state SET data=?,revision=revision+1,updated_at=? WHERE user_id=? AND revision=?')
        .bind(record,now,user.id,body.revision).run();
      changed=result.meta?.changes||0;
    }
    if(changed===1)return response({ok:true,revision:body.revision+1,updatedAt:now});
    const latest=await load(context,user.id);
    return response({error:'Conflito de edição',revision:latest?.revision||0,
      state:latest?JSON.parse(latest.data):{}},409);
  }catch{return response({error:'Erro ao salvar no banco D1.'},503);}
}
