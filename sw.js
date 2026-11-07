const VERSION='cuiudo-photo-action-v8';
const ASSETS=['./','./index.html','./styles.css','./data.js','./brutal.js','./devocionario.js','./app.js','./manifest.webmanifest','./assets/icon.svg'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(ASSETS)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==VERSION).map(k=>caches.delete(k)))));self.clients.claim()});
self.addEventListener('fetch',e=>{
 const q=e.request;if(q.method!=='GET'||new URL(q.url).origin!==location.origin)return;
 const path=new URL(q.url).pathname;
 const dynamic=q.mode==='navigate'||/\.(html|css|js)$/i.test(path)||path.endsWith('/');
 e.respondWith((async()=>{
   if(dynamic){try{const r=await fetch(q);if(r.ok){const cache=await caches.open(VERSION);cache.put(q,r.clone())}return r}catch{return await caches.match(q)||Response.error()}}
   const cached=await caches.match(q);if(cached)return cached;
   const r=await fetch(q);if(r.ok){const cache=await caches.open(VERSION);cache.put(q,r.clone())}return r;
 })());
});
