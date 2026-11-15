import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=f=>readFileSync(new URL('./'+f,import.meta.url),'utf8');
const css=read('cuiudo-v17.css'),html=read('index.html'),sw=read('sw.js'),build=read('scripts/build-cloudflare.mjs');

// 1. A folha v17 é a última carregada, para refinar as camadas anteriores.
const links=[...html.matchAll(/<link rel="stylesheet" href="\.\/([^"]+)"/g)].map(m=>m[1]);
assert.equal(links.at(-1),'cuiudo-v17.css','cuiudo-v17.css deve ser o último CSS do index.html');

// 2. Disponível offline e no pacote publicado (Pages / Cloudflare).
assert.ok(sw.includes("'./cuiudo-v17.css'"),'sw.js deve guardar cuiudo-v17.css para uso offline');
assert.ok(build.includes("'cuiudo-v17.css'"),'build-cloudflare.mjs deve copiar cuiudo-v17.css');

// 3. Tokens dos dois temas e sem dependência externa.
for(const token of ['--bg','--surface','--surface-2','--ink','--subink','--line','--accent','--on-accent','--gold','--serif']){
  assert.ok(css.includes(token+':'),`token ausente: ${token}`);
}
assert.match(css,/:root\[data-theme="dark"\]\{/,'tema escuro definido');
assert.doesNotMatch(css,/@import|https?:\/\/(?!www\.w3\.org)/,'sem fontes ou recursos externos');

// 4. Acessibilidade: movimento reduzido e foco visível.
assert.match(css,/prefers-reduced-motion:reduce/,'respeita redução de movimento');
assert.match(css,/:focus-visible/,'foco visível definido');

// 5. Contraste mínimo (WCAG AA 4.5:1) do texto principal e do dourado sobre as superfícies.
const lum=hex=>{const [r,g,b]=hex.match(/\w\w/g).map(h=>parseInt(h,16)/255).map(c=>c<=.03928?c/12.92:((c+.055)/1.055)**2.4);return .2126*r+.7152*g+.0722*b};
const ratio=(a,b)=>{const [x,y]=[lum(a),lum(b)].sort((p,q)=>q-p);return (x+.05)/(y+.05)};
const token=(theme,name)=>{
  const block=css.split(theme==='light'?':root[data-theme="light"]{':':root[data-theme="dark"]{')[1].split('}')[0];
  return block.match(new RegExp(name+':(#[0-9a-fA-F]{6})'))[1];
};
for(const theme of ['light','dark']){
  const bg=token(theme,'--bg'),surface=token(theme,'--surface');
  for(const fg of ['--ink','--subink','--accent']){
    for(const base of [bg,surface]){
      const r=ratio(token(theme,fg),base);
      assert.ok(r>=4.5,`contraste ${theme} ${fg} sobre ${base}: ${r.toFixed(2)}`);
    }
  }
  const accent=token(theme,'--accent'),onAccent=token(theme,'--on-accent');
  assert.ok(ratio(accent,onAccent)>=4.5,`contraste do botão em ${theme}`);
}
console.log('✓ CUIÚDO v17: tema Ouro Velho, carregamento offline, contraste AA e acessibilidade');
