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


## Redesign editorial v4 — Dia, Noite e Auto

A interface foi recriada com foco em legibilidade e atmosfera de oração: fonte serifada Cormorant Garamond para títulos, DM Sans para leitura, navegação lateral organizada por seções, barra móvel com botão **Mais**, cartões com hierarquia clara e hero de oração sem excesso de efeitos. A tela inicial destaca a oração do dia, Palavra e o progresso pessoal.

**Aparência:** no topo, use **☀ Dia**, **☾ Noite** ou **◌ Auto**. Dia = paleta marfim e verde-escuro, Noite = grafite e verde suave, Auto = acompanha o sistema operacional. A preferência permanece neste navegador.

As mudanças preservam as 20 passagens PT/EN, as orações dos santos e anjos, o terço interativo, o exame, a reflexão e o diário. Referências gerais de acessibilidade: [Apple HIG — Dark Mode](https://developer.apple.com/design/human-interface-guidelines/dark-mode) e [WCAG](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).


## Redesign v5 — Minimalismo branco e Arial

Interface reconstruída usando a simplicidade de [Vercel Geist](https://vercel.com/geist/introduction) e a organização do [redesign da Linear](https://linear.app/now/behind-the-latest-design-refresh) como referências de princípios, sem copiar identidade visual de terceiros.

**Claro por padrão:** branco `#ffffff`, preto e cinzas neutros, botões pretos e fonte **Arial, Helvetica, sans-serif**. Sem Google Fonts. Títulos fluidos usam `clamp()`, com layout responsivo.

**Navegação:** barra superior em vez da antiga sidebar, botão Mais e barra inferior no celular. **Claro / Escuro / Auto** ficam no topo; na primeira abertura da versão v5 o tema volta a Claro, e a escolha posterior fica salva.

O Service Worker passou a priorizar a rede para HTML, CSS e JS, evitando visual antigo em cache após novas publicações. O terço, os versículos PT/EN, as 20 artes, a ladainha, santos e anjos, diário e desafios permanecem.


## V8 — Fotografia editorial e gesto de atitude

A home ganhou fotografia real, com licenças gratuitas do Unsplash: rosário por [Dolina Modlitwy](https://unsplash.com/photos/a-person-holding-a-rosary-with-a-cross-on-it-CCC0CdEsI7E), Basílica de São Pedro por [Chad Greiter](https://unsplash.com/photos/sunlight-beams-inside-ornate-cathedral--0gBnnMdQPw) e igreja contemporânea por [Julia Taubitz](https://unsplash.com/photos/modern-concrete-church-interior-with-sunlight-streaming-in-ioHO90sxxJA). As imagens ficam remotas e são carregadas diretamente do CDN do Unsplash.

Também foi criada uma microanimação CSS de **punho batendo na palma** como símbolo de determinação — respeitando `prefers-reduced-motion`. O bloco reforça a voz da marca: **“Tem que fazer as coisas dar certo. Vai pra cima.”**

Direção visual baseada em princípios observados no Apple HIG / Apple Design Awards, Linear, Vercel e Hallow: foco no conteúdo, navegação que recua, fotografias com função narrativa, hit targets claros e movimento com propósito.


## Feed CUIÚDO — edição de combate v9

Reconstrução baseada nas referências visuais enviadas pelo criador: grade escura estilo Explore, arte clássica de São Miguel e Cristo, pinturas western, texto de alto impacto e interação direta. **Nenhuma captura ou legenda de criador do Instagram foi copiada.** O acervo possui 16 posts autorais e 14 fontes visuais licenciadas, com link de créditos em cada detalhe.

### Experiência

- **Feed** responsivo de dois cards por linha no celular, com busca dinâmica, filtros temáticos, conteúdo salvo, compartilhamento e modal de leitura com reflexão e ação verificável.
- **Ir pra cima**: gesto animado de punho batendo na palma, sem violência física, e missões concretas de disciplina.
- **São Miguel**: capa com pintura histórica de Guido Reni, oração tradicional e devocionário com santos e anjos.
- **Rezar**: terço com calendário, 20 mistérios, contador, versículos e orações incluindo ladainha breve e São Miguel.
- **Versículos**: 20 passagens com idioma PT/EN, citações verificadas de Figueiredo e Douay-Rheims.
- **Diário**: anotações e hábitos locais. Tudo permanece no navegador, sem conta e sem servidor.
- **Tema**: escuro como padrão nesta edição; Claro e Auto continuam disponíveis no topo.

### Fontes visuais e direitos

As obras antigas são reproduções em **domínio público** disponíveis no [Wikimedia Commons](https://commons.wikimedia.org/). Artistas: Guido Reni, Rafael Sanzio, Frederic Remington, Ivan Kramskoi, El Greco e Rembrandt. Fotos de Dolina Modlitwy, Chad Greiter e Julia Taubitz vêm do [Unsplash](https://unsplash.com/license). Cada conteúdo possui ligação à sua página original e licença. As imagens são carregadas do domínio da fonte e podem não aparecer sem internet; nesse caso, o cartão continua legível. Referências históricas são documentadas em `feed-data.js`.

### Limites editoriais

A linguagem confronta a desculpa e os hábitos, não a dignidade das pessoas. Não há promessa de que orar trará sucesso financeiro ou elimine o sofrimento. O combate é interior e espiritual, não uma convocação à violência.

### Design

Referências funcionais: [Apple HIG](https://developer.apple.com/design/human-interface-guidelines/design-principles/), [Material Design 3](https://m3.material.io/components/app-bars/), [Hallow](https://help.hallow.com/pt-BR/articles/5834554-o-que-e-o-hallow). A direção estética principal vem dos prints enviados pelo criador.

**Persistência:** escolha manual de tema Claro/Escuro/Auto agora é respeitada nas recargas. O escuro é aplicado somente na primeira migração para v9.
