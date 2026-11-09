import {response,dbReady,checkOrigin,readJSON,randomHex,sha256,passwordHash,sameHash,
  currentUser,issueSession,cookieValue,cookieHeader,rateLimit} from '../../server/cloud-security.js';

const REQUIRED_TABLES=['users','sessions','synced_state','auth_limits'];
async function verifyDatabase(context){
  // Verifica o banco REALMENTE conectado ao binding do Pages (pode diferir do D1 aberto no painel).
  const found=await context.env.DB.prepare(
    "SELECT name FROM sqlite_master WHERE type='table' AND name IN ('users','sessions','synced_state','auth_limits')"
  ).all();
  const names=new Set((found.results||[]).map(row=>row.name));
  return REQUIRED_TABLES.filter(table=>!names.has(table));
}

export async function onRequestGet(context) {
  if (!dbReady(context))return response({
    error:'Binding D1 DB não configurado neste ambiente do Pages (produção/preview).',
    code:'D1_BINDING_MISSING'
  },503);
  try {
    const missing=await verifyDatabase(context);
    if(missing.length)return response({
      error:'O D1 conectado ao site não tem todas as tabelas. Confira se DB aponta para o banco em que executou o SQL.',
      code:'D1_TABLES_MISSING',missing
    },503);
    const user=await currentUser(context);
    return response({user:user?{email:user.email,id:user.id}:null,configured:true,database:'ready'});
  }catch(error){
    console.error('[CUIUDO auth GET] D1 query failed',error);
    return response({
      error:'Não foi possível consultar o D1 conectado ao site. Veja os logs da Function no Cloudflare.',
      code:'D1_QUERY_FAILED'
    },503);
  }
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
  }catch(error){
    // Logs do servidor, sem email, senha nem dados enviados no corpo da requisição.
    console.error('[CUIUDO auth POST] operation failed',error);
    const message=String(error?.message||'');
    if(/no such table|no such column/i.test(message))return response({
      error:'O banco DB conectado a este site está sem a estrutura correta. Confira o D1 selecionado no binding de produção.',
      code:'D1_SCHEMA_MISMATCH'
    },503);
    if(/D1_ERROR|SQLITE_ERROR|database is locked/i.test(message))return response({
      error:'O Cloudflare D1 recusou a consulta. Confira o banco vinculado e os logs da Function.',
      code:'D1_QUERY_FAILED'
    },503);
    return response({
      error:'O cadastro ou login falhou no servidor. Veja os logs do Cloudflare Pages Functions para identificar a causa.',
      code:'AUTH_SERVER_ERROR'
    },503);
  }
}
