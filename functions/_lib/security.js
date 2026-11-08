// Helpers compartilhados por Cloudflare Pages Functions; nunca enviados como código do cliente.
const encoder = new TextEncoder();
const SESSION_LIFETIME = 30 * 24 * 60 * 60 * 1000;
export const AUTH_COOKIE = 'cuiudo_session';

export function response(value, status = 200, extra = {}) {
  return new Response(JSON.stringify(value), {status, headers: {
    'Content-Type':'application/json; charset=utf-8',
    'Cache-Control':'no-store, private',
    'X-Content-Type-Options':'nosniff',
    ...extra
  }});
}
export function dbReady(context) {
  return Boolean(context.env && context.env.DB && typeof context.env.DB.prepare==='function');
}
export function checkOrigin(request) {
  const origin=request.headers.get('Origin');
  const site=request.headers.get('Sec-Fetch-Site');
  return (!origin || origin===new URL(request.url).origin) && site!=='cross-site';
}
export async function readJSON(request, maxBytes=130000) {
  if (!String(request.headers.get('Content-Type')||'').toLowerCase().startsWith('application/json')) throw new Error('JSON obrigatório');
  const body=await request.text();
  if (encoder.encode(body).byteLength>maxBytes) throw new Error('Dados muito grandes');
  const data=JSON.parse(body);
  if (!data || typeof data!=='object' || Array.isArray(data)) throw new Error('Objeto JSON inválido');
  return data;
}
export function randomHex(size=32) {
  return [...crypto.getRandomValues(new Uint8Array(size))].map(x=>x.toString(16).padStart(2,'0')).join('');
}
export async function sha256(value) {
  return [...new Uint8Array(await crypto.subtle.digest('SHA-256',encoder.encode(value)))].map(x=>x.toString(16).padStart(2,'0')).join('');
}
export async function passwordHash(password,saltHex) {
  const salt=new Uint8Array(saltHex.match(/../g).map(v=>parseInt(v,16)));
  const key=await crypto.subtle.importKey('raw',encoder.encode(password),{name:'PBKDF2'},false,['deriveBits']);
  const buffer=await crypto.subtle.deriveBits({name:'PBKDF2',salt,iterations:210000,hash:'SHA-256'},key,256);
  return [...new Uint8Array(buffer)].map(b=>b.toString(16).padStart(2,'0')).join('');
}
export function sameHash(a,b) {
  if (typeof a!=='string'||typeof b!=='string'||a.length!==b.length) return false;
  let n=0;for(let i=0;i<a.length;i++) n|=a.charCodeAt(i)^b.charCodeAt(i);
  return n===0;
}
export function cookieValue(request){
  const cookie=request.headers.get('Cookie')||'';
  const pair=cookie.split(';').map(x=>x.trim()).find(x=>x.startsWith(AUTH_COOKIE+'='));
  return pair?pair.slice(AUTH_COOKIE.length+1):'';
}
export function cookieHeader(request,token,clear=false){
  const secure=new URL(request.url).protocol==='https:'?'; Secure':'';
  return AUTH_COOKIE+'='+(clear?'':token)+'; HttpOnly; SameSite=Lax; Path=/'+secure+
    (clear?'; Max-Age=0':'; Max-Age='+Math.round(SESSION_LIFETIME/1000));
}
export async function currentUser(context) {
  const token=cookieValue(context.request);
  if (!/^[0-9a-f]{64}$/.test(token))return null;
  const hashed=await sha256(token);
  return (await context.env.DB.prepare(
    'SELECT users.id, users.email FROM sessions JOIN users ON users.id=sessions.user_id WHERE token_hash=? AND expires_at>?'
  ).bind(hashed,Date.now()).first())||null;
}
export async function issueSession(context,userId) {
  const token=randomHex(),hash=await sha256(token),now=Date.now();
  await context.env.DB.prepare('INSERT INTO sessions(token_hash,user_id,created_at,expires_at) VALUES(?,?,?,?)')
    .bind(hash,userId,now,now+SESSION_LIFETIME).run();
  return cookieHeader(context.request,token);
}
export async function rateLimit(context,scope,identity,limit=10,windowMs=900000) {
  const ip=context.request.headers.get('CF-Connecting-IP')||'unknown';
  const key=await sha256(scope+':'+ip+':'+identity);
  const now=Date.now(),until=now+windowMs;
  await context.env.DB.prepare(
    'INSERT INTO auth_limits(key,hits,reset_at) VALUES(?,1,?) '+
    'ON CONFLICT(key) DO UPDATE SET hits=CASE WHEN reset_at<? THEN 1 ELSE hits+1 END, '+
    'reset_at=CASE WHEN reset_at<? THEN ? ELSE reset_at END'
  ).bind(key,until,now,now,until).run();
  const row=await context.env.DB.prepare('SELECT hits FROM auth_limits WHERE key=?').bind(key).first();
  return (row?.hits||0)<=limit;
}
