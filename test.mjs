import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { spawnSync } from 'node:child_process';
const read=n=>readFileSync(new URL('./'+n,import.meta.url),'utf8');
const data=read('data.js'), brutal=read('brutal.js'), app=read('app.js'), html=read('index.html');
const context={};
const groups=runInNewContext(data+'\n;groups',context);
assert.equal(Object.keys(groups).length,4);
assert.equal(Object.values(groups).reduce((n,g)=>n+g.mysteries.length,0),20);
const hard=runInNewContext(data+'\n'+brutal+'\n;({marteladas,confrontosBrutais})');
assert.equal(Object.keys(hard.marteladas).length,20);
assert.equal(hard.confrontosBrutais.length,18);
for(const g of Object.values(groups)) for(const m of g.mysteries) assert.ok(existsSync(new URL('./assets/misterios/'+m.id+'.svg',import.meta.url)),m.id);
for(const f of ['data.js','brutal.js','app.js','sw.js','server.mjs']){
 const p=spawnSync(process.execPath,['--check',new URL('./'+f,import.meta.url).pathname]);
 assert.equal(p.status,0,f+': '+p.stderr.toString());
}
assert.match(html,/styles\.css/);
assert.match(html,/app\.js/);
assert.match(app,/mission-done/);
console.log('✓ 20 mistérios, 20 meditações SEM DESCULPAS, 18 confrontos, artes e sintaxe JS');
