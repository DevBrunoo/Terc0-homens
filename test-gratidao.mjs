import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createContext,runInContext} from 'node:vm';
const source=readFileSync(new URL('./gratidao-catolica.js',import.meta.url),'utf8');
const index=readFileSync(new URL('./index.html',import.meta.url),'utf8');
const build=readFileSync(new URL('./scripts/build-cloudflare.mjs',import.meta.url),'utf8');
const worker=readFileSync(new URL('./sw.js',import.meta.url),'utf8');
for(const workflow of ['.github/workflows/deploy-pages.yml','.github/workflows/build-preview.yml']){
 const text=readFileSync(new URL('./'+workflow,import.meta.url),'utf8');
 assert.match(text,/node scripts\/build-cloudflare\.mjs/,'Distribuição deve incluir todos os módulos: '+workflow);
}

for(const file of [index,build,worker]){
 assert.match(file,/gratidao-catolica\.js/,'Script incluso em HTML, build e PWA');
 assert.match(file,/gratidao-catolica\.css/,'Estilos inclusos em HTML, build e PWA');
}
const memory=new Map(),listeners={},rendered=[];
const app={innerHTML:'',addEventListener(type,fn){(listeners[type]??=[]).push(fn)}};
const state={tab:'inicio',appLang:'pt'};
const nav={pt:{},en:{},es:{},la:{}},tabs=[{id:'inicio'}];
let calls=0,confirmed=0;
const context=createContext({
 state,app,combatTabs:tabs,cuiudoNav:nav,
 combatHome:()=>'<section class="cuiudo-hero"></section><section class="cuiudo-grace-reflection"></section><section class="poster-grid"></section>',
 render(){calls++;},renderShell:s=>s,
 setTheme(){},currentDay:()=> '2026-11-14',
 cuiudoLocale:()=>state.appLang,
 escapeHtml:s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),
 document:{documentElement:{lang:'pt-BR'},getElementById(){return {focus(){}}}},
 localStorage:{getItem(k){return memory.get(k)||null},setItem(k,v){memory.set(k,String(v))}},
 window:{},console,Date,Intl,
 confirm(){confirmed++;return true;}
});
runInContext(source,context,{timeout:2000});
assert.ok(tabs.some(x=>x.id==='gratidao'),'Navegação inclui gratidão');
assert.equal(nav.pt.gratidao,'Gratidão');
assert.equal(nav.en.gratidao,'Gratitude');
const initialHome=runInContext('combatHome()',context);
assert.match(initialHome,/id="grat-home-form"/,'Formulário compacto para salvar na própria tela inicial');
assert.match(initialHome,/id="grat-home-text"[^>]*name="gratitude"/,'Área pequena para escrever várias graças');
assert.match(initialHome,/Hoje sou grato por/);
assert.match(initialHome,/Minha moto, minha vida, o terço/);
assert.doesNotMatch(initialHome,/class="grat-home-open"|class="grat-home-save"/,'Sem botões extras na inicial');
assert.ok(initialHome.indexOf('cuiudo-hero')<initialHome.indexOf('grat-home'),
 'Cartão aparece depois do destaque inicial');
assert.ok(initialHome.indexOf('grat-home')<initialHome.indexOf('cuiudo-grace-reflection'),
 'Cartão aparece antes do feed e das reflexões');
assert.equal((initialHome.match(/class="grat-home"/g)||[]).length,1,'Não duplicar cartão');
assert.doesNotMatch(initialHome,/grat-home card/,'Cartão não usa espaçamento do card grande');
assert.equal(context.window.cuiudoGratidao.read()['2026-11-14'],undefined);
state.tab='gratidao';runInContext('render()',context);
assert.match(app.innerHTML,/Diário da Gratidão/);
assert.match(app.innerHTML,/1 Tessalonicenses 5,18/);
assert.match(app.innerHTML,/Lei da Atração/);
assert.match(app.innerHTML,/id="cuiudo-gratidao-form"/);
assert.match(app.innerHTML,/Sem publicação no quadro público/);
const submit=listeners.submit[0];
const values={
 'grat-thanks-0':'Agradeço pela família',
 'grat-thanks-1':'<script>alert(1)</script>',
 'grat-thanks-2':'Pela oportunidade de estudar',
 'grat-hardship':'Um dia difícil',
 'grat-vision':'Ser mais paciente',
 'grat-action':'Estudar vinte minutos',
 'grat-prayer':'Seja feita a vossa vontade'
};
submit({target:{id:'cuiudo-gratidao-form',querySelector(q){return {value:values[q.slice(1)]||''}}},
 preventDefault(){}});
assert.match(memory.get('terco-gratidao-catolica-v1'),/Agradeço pela família/);
assert.equal(context.window.cuiudoGratidao.read()['2026-11-14'].action,'Estudar vinte minutos');
assert.match(app.innerHTML,/&lt;script&gt;/,'Escapa textos digitados pelo usuário');
assert.doesNotMatch(app.innerHTML,/<script>alert/,'Não injeta scripts na interface');
assert.match(app.innerHTML,/Registro salvo neste aparelho/);
assert.match(app.innerHTML,/1\s+dia[s]? registrado[s]?/);
state.appLang='en';runInContext('render()',context);
assert.match(app.innerHTML,/Catholic Gratitude Journal/);
assert.match(app.innerHTML,/Law of Attraction/);
state.appLang='pt';
const click=listeners.click[0];
click({target:{dataset:{gratAction:'edit',day:'2026-11-14'},closest(){return this}}});
assert.match(app.innerHTML,/Agradeço pela família/);
click({target:{dataset:{gratAction:'delete',day:'2026-11-14'},closest(){return this}}});
assert.ok(confirmed>0,'Exclusão exige confirmação');
assert.equal(Object.keys(context.window.cuiudoGratidao.read()).length,0,'Exclusão somente por ação explícita');
// Garantir que o registro permaneça no armazenamento mesmo depois de navegar para fora.
values['grat-thanks-1']='Recebi uma ajuda';state.tab='gratidao';
submit({target:{id:'cuiudo-gratidao-form',querySelector(q){return {value:values[q.slice(1)]||''}}},
 preventDefault(){}});
state.tab='inicio';runInContext('render()',context);
assert.equal(calls,1,'Demais páginas permanecem delegadas ao render original');
state.tab='gratidao';runInContext('render()',context);
assert.match(app.innerHTML,/Recebi uma ajuda/);
// Entrada rápida na home: atualiza a primeira gratidão sem descartar as demais anotações.
const feedback={textContent:''},quickForm={
 id:'grat-home-form',
 querySelector(q){assert.equal(q,'[name="gratitude"]');return {value:'Agradeço pela paz de hoje'}},
 closest(q){assert.equal(q,'.grat-home');return {querySelector(){return feedback}}}
};
let prevented=false;
submit({target:quickForm,preventDefault(){prevented=true}});
const afterQuick=context.window.cuiudoGratidao.read()['2026-11-14'];
assert.ok(prevented);
assert.equal(afterQuick.thanks[0],'Agradeço pela paz de hoje');
assert.equal(afterQuick.thanks[1],'Recebi uma ajuda');
assert.equal(afterQuick.action,'Estudar vinte minutos');
assert.equal(feedback.textContent,'Salvo');
const input=listeners.input[0];
const quickTextarea={id:'grat-home-text',form:quickForm,value:'Sou grato pela minha moto, minha vida e pelo terço'};
quickForm.querySelector=()=>quickTextarea;
input({target:quickTextarea});
assert.equal(context.window.cuiudoGratidao.read()['2026-11-14'].thanks[0],quickTextarea.value,'Salva automaticamente ao digitar');
assert.equal(context.window.cuiudoGratidao.read()['2026-11-14'].thanks[1],'Recebi uma ajuda','Não perde as outras anotações');
const compactDone=runInContext('combatHome()',context);
assert.match(compactDone,/>Sou grato pela minha moto, minha vida e pelo terço<\/textarea>/);
assert.match(compactDone,/Gratidão de hoje/);
assert.ok(memory.get('terco-gratidao-catolica-v1'),'Registro local preservado');
console.log('✓ Gratidão: navegação, privacidade, escrita, XSS, histórico, exclusão e compatibilidade de build');
