import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {webcrypto} from 'node:crypto';
if (!globalThis.crypto) Object.defineProperty(globalThis, 'crypto', {value:webcrypto});

const read=p=>readFileSync(new URL('./'+p,import.meta.url),'utf8');
for(const path of ['cloud-sync.js','server/cloud-security.js','functions/api/auth.js','functions/api/sync.js','functions/api/solo.js','functions/api/goals.js']){
 const result=spawnSync(process.execPath,['--check',new URL('./'+path,import.meta.url).pathname]);
 assert.equal(result.status,0,path+': '+result.stderr);
}
assert.match(read('index.html'),/global-goals\.js/);
assert.match(read('sw.js'),/global-goals\.js/);
assert.match(read('sw.js'),/api/);
assert.match(read('global-goals.js'),/cuiudo-public-goals-queue-v1/);
assert.doesNotMatch(read('global-goals.js'),/cuiudo-global-notice|data-global-goals-refresh|Metas universais — sem conta ou código/);
assert.match(read('global-goals.js'),/setInterval\(\(\)=>/);
assert.match(read('global-goals.js'),/JSON\.stringify\(grouped\)===JSON\.stringify\(old\)/);
assert.match(read('cuiudo-v16.css'),/font-size:16px; \/\* Evita zoom/);
assert.match(read('global-goals.js'),/Sem cadastro|sem conta ou código/);
assert.match(read('global-goals.js'),/qualquer visitante/i);
assert.doesNotMatch(read('global-goals.js'),/notes|rosaryIntention|examineDays/);
assert.match(read('daily-goals.js'),/cuiudoGlobalGoals\?\.change/);
assert.match(read('migrations/0003_public_goals.sql'),/CREATE TABLE IF NOT EXISTS public_goals/);
assert.match(read('migrations/0004_goal_timers.sql'),/ADD COLUMN timer_started_at/);
assert.match(read('functions/api/goals.js'),/timer_state/);
assert.match(read('global-goals.js'),/remaining_sec/);
assert.match(read('global-goals.js'),/let offset=0,hasMore=true/);
assert.match(read('global-goals.js'),/hasMore=data\.hasMore===true/);
assert.doesNotMatch(read('functions/api/goals.js'),/day>=\?|cutoff\(\)/);
assert.match(read('functions/api/goals.js'),/GOALS_PAGE_SIZE=500/);
assert.match(read('functions/api/goals.js'),/ORDER BY day,id LIMIT \? OFFSET \?/);
assert.match(read('manifest.webmanifest'),/"short_name": "Terço"/);
assert.match(read('index.html'),/apple-mobile-web-app-title" content="Terço"/);
assert.match(read('migrations/0001_cuiudo_d1.sql'),/CREATE TABLE IF NOT EXISTS synced_state/);

const security=await import('./server/cloud-security.js');
const auth=await import('./functions/api/auth.js');
const sync=await import('./functions/api/sync.js');
const solo=await import('./functions/api/solo.js');
const publicGoals=await import('./functions/api/goals.js');
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
assert.equal((await publicGoals.onRequestGet(none)).status,503);
assert.equal((await publicGoals.onRequestPost(none)).status,503);
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
console.log('✓ Cloudflare D1: metas globais públicas e dados pessoais isolados');

assert.match(read('migrations/0005_goal_priority.sql'),/ADD COLUMN priority/);
assert.match(read('functions/api/goals.js'),/priority=excluded\.priority/);
assert.match(read('functions/api/goals.js'),/priorities\.has\(priority\)/);
assert.match(read('global-goals.js'),/priority:\['high','medium','low'\]/);
assert.match(read('global-goals.js'),/cuiudoTimerReconcileAudio/);
