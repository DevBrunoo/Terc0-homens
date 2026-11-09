import {response,dbReady,checkOrigin,readJSON,randomHex,sha256,issueSession,rateLimit,currentUser} from '../../server/cloud-security.js';

// Código aleatório de 256 bits: apenas o hash fica armazenado no banco.
// Outros aparelhos precisam conhecer o código para entrar na mesma sessão pessoal.
export async function onRequestPost(context){
 if(!dbReady(context))return response({error:'O banco D1 não está conectado a este site.'},503);
 if(!checkOrigin(context.request))return response({error:'Origem não autorizada.'},403);
 let data;
 try{data=await readJSON(context.request,2500);}catch{return response({error:'Requisição inválida.'},400);}
 const action=data.action;
 if(action!=='create'&&action!=='join')return response({error:'Ação inválida.'},400);
 try{
  const db=context.env.DB;
  if(action==='create'){
   const active=await currentUser(context);
   if(active)return response({error:'Dispositivo já conectado. Desconecte antes de ativar outro código.'},409);
   if(!await rateLimit(context,'solo-create','',4,3600000))
    return response({error:'Muitas ativações. Tente novamente mais tarde.'},429);
   const code=randomHex(32),id=randomHex(16),salt=randomHex(16),now=Date.now();
   const fakeEmail='solo-'+id+'@cuiudo.invalid';
   await db.prepare('INSERT INTO users(id,email,salt,password_hash,created_at) VALUES(?,?,?,?,?)')
    .bind(id,fakeEmail,salt,await sha256(randomHex(32)),now).run();
   await db.prepare('INSERT INTO solo_keys(code_hash,user_id,created_at) VALUES(?,?,?)')
    .bind(await sha256(code),id,now).run();
   return response({ok:true,code,user:{id,solo:true}},200,
    {'Set-Cookie':await issueSession(context,id)});
  }
  const code=String(data.code||'').trim().replace(/[\s-]/g,'').toLowerCase();
  if(!/^[0-9a-f]{64}$/.test(code))
   return response({error:'Código inválido. Cole os 64 caracteres do primeiro aparelho.'},400);
  if(!await rateLimit(context,'solo-join','',12,900000))
   return response({error:'Muitas tentativas. Tente novamente mais tarde.'},429);
  const row=await db.prepare('SELECT user_id FROM solo_keys WHERE code_hash=?')
   .bind(await sha256(code)).first();
  if(!row)return response({error:'Código não encontrado. Confira se foi copiado integralmente.'},401);
  return response({ok:true,user:{id:row.user_id,solo:true}},200,
   {'Set-Cookie':await issueSession(context,row.user_id)});
 }catch(error){
  console.error('[CUIUDO solo]',error);
  return response({error:'Falha no D1. Consulte os logs do Pages Functions.'},503);
 }
}
