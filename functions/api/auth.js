import {response,dbReady,checkOrigin,readJSON,randomHex,sha256,passwordHash,sameHash,
  currentUser,issueSession,cookieValue,cookieHeader,rateLimit} from '../../server/cloud-security.js';

export async function onRequestGet(context) {
  if (!dbReady(context))return response({error:'D1 não configurado: binding DB'},503);
  try {
    const user=await currentUser(context);
    return response({user:user?{email:user.email,id:user.id}:null,configured:true});
  }catch {return response({error:'Banco D1 ainda não inicializado. Execute a migração SQL.'},503);}
}
export async function onRequestPost(context) {
  if (!dbReady(context))return response({error:'Configure o binding D1 com o nome DB.'},503);
  if (!checkOrigin(context.request))return response({error:'Origem inválida'},403);
  let data;
  try{data=await readJSON(context.request,5000);}catch{return response({error:'Envie JSON válido'},400);}
  const action=String(data.action||'');
  try{
    if(action==='logout'){
      const token=cookieValue(context.request);
      if(/^[0-9a-f]{64}$/.test(token)){
        await context.env.DB.prepare('DELETE FROM sessions WHERE token_hash=?').bind(await sha256(token)).run();
      }
      return response({ok:true},200,{'Set-Cookie':cookieHeader(context.request,'',true)});
    }
    if(!['register','login'].includes(action))return response({error:'Ação inválida'},400);
    const email=String(data.email||'').trim().toLowerCase();
    const password=String(data.password||'');
    if(email.length>254||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||password.length<12||password.length>128)
      return response({error:'Informe um email válido e senha de 12 a 128 caracteres.'},400);
    if(!await rateLimit(context,action,email,action==='register'?5:12,action==='register'?3600000:1200000))
      return response({error:'Muitas tentativas. Tente novamente mais tarde.'},429);
    const db=context.env.DB;
    if(action==='register'){
      const existing=await db.prepare('SELECT id FROM users WHERE email=?').bind(email).first();
      if(existing)return response({error:'Já existe uma conta para esse email.'},409);
      const id=randomHex(16),salt=randomHex(16);
      const hash=await passwordHash(password,salt);
      try{
        await db.prepare('INSERT INTO users(id,email,salt,password_hash,created_at) VALUES(?,?,?,?,?)')
          .bind(id,email,salt,hash,Date.now()).run();
      }catch{return response({error:'Já existe uma conta com este email.'},409);}
      return response({ok:true,user:{id,email}},200,{'Set-Cookie':await issueSession(context,id)});
    }
    const user=await db.prepare('SELECT id,email,salt,password_hash FROM users WHERE email=?').bind(email).first();
    // Também faz cálculo para email inexistente, reduzindo diferença de tempo de resposta.
    const expected=await passwordHash(password,user?.salt||'00'.repeat(16));
    if(!user||!sameHash(expected,user.password_hash))
      return response({error:'Email ou senha incorretos.'},401);
    return response({ok:true,user:{id:user.id,email:user.email}},200,
      {'Set-Cookie':await issueSession(context,user.id)});
  }catch{
    return response({error:'Banco de dados indisponível. Verifique D1 e a migração.'},503);
  }
}
