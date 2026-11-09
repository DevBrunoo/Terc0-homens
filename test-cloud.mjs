import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {webcrypto} from 'node:crypto';
if (!globalThis.crypto) Object.defineProperty(globalThis, 'crypto', {value:webcrypto});

const read=p=>readFileSync(new URL('./'+p,import.meta.url),'utf8');
for(const path of ['cloud-sync.js','server/cloud-security.js','functions/api/auth.js','functions/api/sync.js','functions/api/solo.js']){
 const result=spawnSync(process.execPath,['--check',new URL('./'+path,import.meta.url).pathname]);
 assert.equal(result.status,0,path+': '+result.stderr);
}
assert.match(read('index.html'),/cloud-sync\.js/);
assert.match(read('sw.js'),/cloud-sync\.js/);
assert.match(read('sw.js'),/api/);
assert.ok(!read('cloud-sync.js').includes('database_id'),'Nunca incluir identificador do banco no cliente');
assert.match(read('cloud-sync.js'),/cuiudo-solo-form/);
assert.match(read('cloud-sync.js'),/Ativar sincronização/);
assert.doesNotMatch(read('cloud-sync.js'),/Criar conta|Email<input/);
assert.match(read('migrations/0002_cuiudo_solo.sql'),/CREATE TABLE IF NOT EXISTS solo_keys/);
assert.match(read('cloud-sync.js'),/cuiudo-sync-dirty/);
assert.match(read('cloud-sync.js'),/Conflito de versões|status===409/);
assert.match(read('migrations/0001_cuiudo_d1.sql'),/CREATE TABLE IF NOT EXISTS synced_state/);

const security=await import('./server/cloud-security.js');
const auth=await import('./functions/api/auth.js');
const sync=await import('./functions/api/sync.js');
const solo=await import('./functions/api/solo.js');
const salt=security.randomHex(16),pass='Senha de teste suficientemente longa';
assert.equal(salt.length,32);
assert.equal(security.randomHex().length,64);
const hash=await security.passwordHash(pass,salt);
assert.equal(hash.length,64);
assert.ok(security.sameHash(hash,await security.passwordHash(pass,salt)));
assert.ok(!security.sameHash(hash,await security.passwordHash(pass+'?',salt)));
const req=new Request('https://exemplo.pages.dev/api/auth',{method:'POST',headers:{Origin:'https://malicioso.example','Content-Type':'application/json'},body:'{}'});
assert.equal(security.checkOrigin(req),false,'Bloqueio de solicitação externa');
assert.match(security.cookieHeader(req,'a'.repeat(64)),/HttpOnly; SameSite=Lax/);
assert.match(security.cookieHeader(req,'a'.repeat(64)),/Secure/);
const none={request:new Request('https://exemplo.pages.dev/api/auth'),env:{}};
assert.equal((await auth.onRequestGet(none)).status,503);
assert.equal((await sync.onRequestGet(none)).status,503);
assert.equal((await solo.onRequestPost(none)).status,503);
const wrongDb={request:new Request('https://exemplo.pages.dev/api/auth'),env:{
 DB:{prepare(){return {async all(){return {results:[{name:'users'}]}}};}}
}};
const missingResponse=await auth.onRequestGet(wrongDb);
assert.equal(missingResponse.status,503);
assert.deepEqual((await missingResponse.json()).missing,['sessions','synced_state','auth_limits']);
const healthyDb={request:new Request('https://exemplo.pages.dev/api/auth'),env:{
 DB:{prepare(){return {async all(){return {results:['users','sessions','synced_state','auth_limits'].map(name=>({name}))}}};}}
}};
const goodResponse=await auth.onRequestGet(healthyDb);
assert.equal(goodResponse.status,200);
assert.equal((await goodResponse.json()).database,'ready');
assert.match(read('functions/api/sync.js'),/revision=revision\+1/);
console.log('✓ Cloudflare D1: rotas, senha PBKDF2, sessão HTTP-only, revisão e cliente sem cache');
