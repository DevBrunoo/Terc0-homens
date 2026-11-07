# CUIÚDO — Fé, Coragem e Ação ✝️

**Reza. Levanta. Faz acontecer. Sem desculpas.**

Aplicativo católico responsivo com terço diário, os 20 mistérios, meditações francas, modo **SEM DESCULPAS**, exame de consciência, desafios, diário e acompanhamento local da oração.

O projeto nasceu para unir oração e ação concreta: confronta hábitos e escolhas sem humilhar ninguém. Respeita a dignidade humana, o valor do descanso e a misericórdia cristã.

## Executar

Requer Node.js 18 ou superior.

```bash
npm run dev
```

Acesse **http://localhost:8000**. Sem dependências externas, além de fontes web opcionais.

Para testes:

```bash
npm test
```

## Publicar no GitHub Pages

No repositório, vá em **Settings → Pages → Build and deployment → Deploy from a branch**. Escolha **main** e **/(root)**; salve. A publicação ocorrerá no endereço fornecido pelo GitHub Pages.

## Organização

- `index.html` — entrada do aplicativo
- `styles.css` — identidade visual preto, vinho e dourado
- `data.js` — 20 mistérios e textos de apoio
- `brutal.js` — meditações do modo SEM DESCULPAS e confrontos diretos
- `app.js` — navegação, contador do terço, desafios e diário
- `assets/misterios/` — 20 artes simbólicas SVG
- `manifest.webmanifest`, `sw.js` — instalação (PWA) e cache offline
- `preview.html` — versão monolítica de prévia
- `test.mjs` — verificações automatizadas

## Calendário do terço

Segunda e sábado: Gozosos. Terça e sexta: Dolorosos. Quarta e domingo: Gloriosos. Quinta: Luminosos.

## Privacidade e limites

O histórico pessoal fica no `localStorage` deste navegador; não há contas, servidor, sincronização nem IA gerativa nesta versão. Os textos bíblicos são **paráfrases referenciadas**, não transcrições atribuídas a uma edição da Bíblia Ave-Maria. Orações e conteúdo de formação devem receber revisão antes de uma publicação oficial. O exame não substitui a confissão sacramental e as orientações não substituem acompanhamento profissional quando necessário.

Projeto em desenvolvimento.

## Novidade: Bíblia e devocionário (v3)

- 20 versículos da Escritura em tradução histórica católica (PT/EN), um por mistério, com referência canônica.
- Ladainha mariana breve **autoral** após o terço, com link à Ladainha Lauretana completa no Vaticano.
- Oração tradicional de São Miguel e menu **Santos e Anjos**, com 18 orações pesquisáveis por categoria (4 angélicas, 1 mariana, 13 de santos).
- O bloco "MISSÃO DE HOJE" foi retirado de cada mistério, preservando as reflexões e o exame de consciência.
- Referências: [Santo Rosário](https://www.vatican.va/special/rosary/documents/misteri_po.html), [Ladainha oficial](https://www.vatican.va/special/rosary/documents/litanie-lauretane_po.html) e [São Miguel](https://www.vatican.va/content/john-paul-ii/pt/angelus/1981/documents/hf_jp-ii_ang_19810930.html).

**Nota:** orações marcadas "autoral" foram compostas para o app; não se atribuem aos santos como se eles tivessem escrito. As citações bíblicas são de Figueiredo (PT) e Douay-Rheims (EN), versões católicas históricas de domínio público, não da Bíblia Ave-Maria.

## Identidade e lema

**TEM QUE FAZER ACONTECER. IR PRA CIMA. SER CUIÚDO.**

“Ser cuiúdo” neste projeto é rezar, enfrentar as próprias desculpas, cumprir o dever com coragem, admitir erros, recomeçar e tratar as pessoas com caridade. O lema aparece na home, no menu lateral e nas telas de reflexão e desafios.


## Bilinguismo e aparência (edição v3)

A interface de meditação agora oferece **versículos reais da Bíblia** em **português** (Padre Antônio Pereira de Figueiredo, tradução católica da Vulgata, século XVIII) e **inglês** (Douay-Rheims 1899). Um controle **PT / EN** dentro do terço escolhe o idioma e conserva a preferência. Foram verificadas as fontes dos vinte mistérios, incluindo textos de Apocalipse 12 para os mistérios marianos (uma leitura tipológica tradicional, não descrição literal da Assunção).

Fontes: [Figueiredo, Fides Viva](https://fidesviva.org/pt-BR/biblia/lucas/1) · [Douay-Rheims 1899, eBible](https://ebible.org/engDRA/) · [Figueiredo, edição 1950](https://bibliatraduzida.com/figueiredo/).

A transcrição portuguesa preserva a redação histórica e atualiza grafia em alguns casos; dois textos são identificados como **excertos literais**. O inglês mantém a redação histórica da Douay-Rheims. A tradução da Bíblia Ave-Maria não foi utilizada por ter proteção editorial. As duas traduções escolhidas incluem o cânon católico completo.

**Tema claro e escuro:** alterne pelo botão sol/lua no canto superior. O app grava a preferência no navegador. Não são necessários login, serviços pagos ou credenciais.

**CUIÚDO**: variante popular de colhudo, com sentido coloquial de coragem e valentia; no aplicativo significa enfrentar as próprias desculpas e fazer o bem, não humilhar ninguém. Pesquisa lexical: [GZH / Cláudio Moreno](https://gauchazh.clicrbs.com.br/cultura-e-lazer/noticia/2013/03/nao-vem-de-cuia-4084233.html) · [Priberam](https://dicionario.priberam.org/colhudo).
