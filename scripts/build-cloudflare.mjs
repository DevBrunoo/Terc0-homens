// Build estático para Cloudflare Pages: /functions fica fora da pasta pública.
import {cpSync,existsSync,mkdirSync,rmSync,readFileSync} from 'node:fs';
import {join} from 'node:path';
const out='dist';
rmSync(out,{recursive:true,force:true});
mkdirSync(out,{recursive:true});
const files=[
 'index.html','styles.css','feed.css','apple.css','rosary-plus.css',
 'cuiudo-v13.css','cuiudo-v14.css','cuiudo-v15.css','cuiudo-v16.css','cuiudo-premium.css','gratidao-catolica.css','cuiudo-bonito.css','goal-consequences.css',
 'data.js','brutal.js','devocionario.js','feed-data.js','app.js','feed-ui.js',
 'ambient-audio.js','cuiudo-music.js','rosary-i18n.js','rosary-artwork.js',
 'rosary-context.js','rosary-plus.js','spotify-dock.js','rosary-beads.js','saints-i18n.js',
 'goal-consequences.js','daily-goals.js','conscience-duty.js','global-goals.js','holiness-path.js',
 'goal-history.js','cuiudo-lectio-devotional.js','cuiudo-premium.js','gratidao-catolica.js',
 'sw.js','manifest.webmanifest','.nojekyll'
];
for(const f of files){
 if(!existsSync(f))throw new Error('Arquivo do site ausente: '+f);
 cpSync(f,join(out,f));
}
cpSync('assets',join(out,'assets'),{recursive:true});

// Falhe o build se uma folha de estilo ou script citado no HTML ficar fora
// de dist — evita deploy "bem-sucedido" com arquivos faltando (404).
const html=readFileSync(join(out,'index.html'),'utf8');
const referenced=[...html.matchAll(/<(?:script|link)\b[^>]*?(?:src|href)="\.\/([^"#?]+)(?:\?[^"]*)?"[^>]*>/g)]
 .map(([,path])=>path).filter(path=>/\.(?:js|css)$/.test(path));
const missing=referenced.filter(path=>!existsSync(join(out,path)));
if(missing.length)throw new Error('Assets importados pelo index.html ausentes do deploy: '+missing.join(', '));
console.log('✓ '+referenced.length+' referências JavaScript/CSS presentes no pacote Cloudflare.');

console.log('✓ Cloudflare Pages: arquivos públicos em /dist; /functions e migrations fora do site.');
