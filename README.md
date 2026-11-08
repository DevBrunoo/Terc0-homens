## Abrir o aplicativo com todas as imagens

- Repositório: https://github.com/DevBrunoo/Terc0-homens
- **Pacote completo**: abra a aba **Actions**, escolha **Gerar aplicativo CUIÚDO para prévia** e baixe o artefato `CUIUDO-APP-COM-IMAGENS` (HTML, CSS, JavaScript e 14 WebP, tudo junto).
- **GitHub Pages**: para ativar o link público `https://devbrunoo.github.io/Terc0-homens/`, vá em **Settings → Pages → Build and deployment → Source → GitHub Actions**. A ativação é necessária apenas uma vez e não pode ser feita com o `GITHUB_TOKEN` padrão do repositório.
- Os arquivos do aplicativo estão na branch `main`. Tema claro minimalista como padrão, modo escuro/auto e todas as seções preservadas.

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


## Correção crítica: imagens do feed não apareciam (v10)

Em 7/11/2026, as **14 imagens de fonte** do feed foram baixadas, redimensionadas e enviadas fisicamente para `assets/feed/*.webp` via GitHub Actions. **Nenhuma imagem principal depende agora do CDN do Wikimedia Commons ou Unsplash** no momento em que a página carrega. O código `feed-data.js` aponta exclusivamente para caminhos relativos locais, adequados ao GitHub Pages no subdiretório `/Terc0-homens/`.

O Service Worker `cuiudo-local-art-v10` armazena essas imagens após instalar, invalidando o cache anterior e permitindo visualização offline. Cada card possui uma arte SVG local de segurança se algum arquivo falhar. O comando `npm test` confirma a existência e a assinatura WebP de todos os 14 arquivos.

Para importar novos trabalhos legais do Wikimedia / Unsplash no futuro, altere o script `scripts/cache_feed_art.py` e execute o fluxo `Incorporar imagens locais ao CUIÚDO` no GitHub Actions.


## CUIÚDO v11 — visual minimalista e publicação GitHub Pages

Reformulada a apresentação sem remover funções: visual claro com fundo `#f5f5f7`, navegação translúcida, tipografia de sistema (SF/Helvetica/Arial), cards de foto grandes, gradientes suaves, animação respeitando redução de movimento, e tema escuro opcional. Referências de design: Apple Human Interface Guidelines (hierarquia, legibilidade, conteúdo primeiro e alvos de toque).

Todas as 14 imagens de `assets/feed/*.webp` continuam **dentro do repositório** (não há dependência de Unsplash/Wikimedia na exibição). `index.html` carrega `apple.css` depois das folhas antigas. `sw.js` invalidou o cache, cacheia os recursos do app e prefere a rede para WebP quando disponível. A pré-carga da pintura de São Miguel melhora a imagem do primeiro card.

Um fluxo de implantação oficial `.github/workflows/deploy-pages.yml` publica o conteúdo na branch principal. **Para o primeiro deploy, o administrador precisa habilitar GitHub Pages em Settings → Pages → Source: GitHub Actions**. Sem essa configuração, a URL `https://devbrunoo.github.io/Terc0-homens/` retorna HTTP 404 mesmo com todos os arquivos presentes. Depois disso, o fluxo publica automaticamente.


## V12 — Medalha de São Bento, música suave e terço em 4 idiomas

- **Banner**: arte vetorial local da Medalha de São Bento, com inscrições tradicionais e chamada à oração. A medalha é sacramental, não amuleto.
- **Terço**: 20 mistérios com pinturas históricas licenciadas, baixadas do Wikimedia Commons e salvas no repositório em `assets/misterios/fotos/*.webp`. Cada imagem tem referência e licença própria em `rosary-artwork.js`. Se o arquivo não carregar, a ilustração SVG original permanece disponível.
- **Meditação**: escolha **Pequena / Média / Grande**, sem alterar as cinco dezenas tradicionais. Versão grande inclui exame de consciência, reflexão firme, virtude e oração pessoal.
- **Música**: composição instrumental ambiente **original**, sintetizada no navegador via Web Audio API (`ambient-audio.js`), com botão de iniciar/pausar e controle de volume. Não inicia sozinha, faz entrada e saída suave, não usa CDNs nem gravações de terceiros. É interrompida quando o usuário deixa o terço ou oculta a página.
- **Idiomas**: PT, EN, ES e LA para a tela do terço, orações tradicionais, títulos dos mistérios, instruções, meditações e navegação. Português e inglês mantêm citações bíblicas históricas literais já verificadas; espanhol e latim apresentam paráfrases **identificadas**, com acesso às fontes e sem fingir citação literal.
- **Mais conteúdo**: guia para rezar, oferecimento do terço, oração de Fátima, oração da Cruz de São Bento, intenção de oração salva localmente e crédito por pintura.

**Nota:** outras áreas editoriais do aplicativo continuam com textos em português; a internacionalização completa do feed e diário não está concluída.

**Acervo verificado:** os vinte arquivos WebP estão presentes na branch principal, todos com `license`, `credit` e `source` em `rosary-artwork.js`. O cache offline da v12 inclui os 20 arquivos. O teste automatizado valida a assinatura WebP de cada um.


## CUIÚDO v13 — três músicas, foto real da medalha e metas do dia

**Música:** selecionável ao rezar o terço, com botão tocar/pausar e volume: (1) **Cântico católico** — *Ave Maria* da Schola Gregoriana de Ołtarzew (direção Pe. Dariusz Smolarek), [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Schola_Gregoriana-Ave_Maria.ogg), [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/); (2) **Cântico templário (estilo medieval)** — *Cum Angelis*, antífona gregoriana medieval cantada por Paterm, [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Gregorian_chant_-_Procedamus_in_pace_-_Cum_angelis_-_Psalm_24_(23)_(German-Polish_accent).ogg), CC BY-SA 3.0. Não é uma gravação histórica de templários; (3) **Relaxar** — música ambiente instrumental original gerada via Web Audio. Os dois arquivos são transcodificações MP3 locais dos OGG originais. Crédito e licença acessíveis na tela do terço. Nenhuma música inicia automaticamente; para quando o usuário sai da oração.

**Medalha:** fotografia real e detalhada dos dois lados, de Gec00, [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Saint_Benedict_Medal.jpg), licença CC0 1.0. A simbologia foi conferida no [Mosteiro de São Bento do Rio de Janeiro](https://www.mosteirodesaobentorio.org.br/espiritualidade/medalha-de-sao-bento/). A medalha é sacramental, não amuleto.

**Mais três obras e reflexões cuiúdas:** *Aiding a Comrade*, *A New Year on the Cimarron* e *The Smoke Signal*, pinturas de Frederic Remington em domínio público, todas disponíveis localmente em assets/feed e creditadas em feed-data.js. Agora são 19 posts, 17 obras/fotografias no feed.

**Checklist de hoje:** usuário escreve a meta, clica **Concluí** ou **Não concluí**, pode reabrir ou excluir. Quando conclui, ganha uma recompensa virtual colecionável (medalha/selo/estrela/troféu) e animação discreta. Quando marca não concluída, aparece exatamente a mensagem solicitada: **“Você é muito macio! Reorganize-se, levante e faça acontecer.”** As metas são salvas por data apenas no navegador (`localStorage`).


## CUIÚDO v14 — Medalha, cântico indicado e novas meditações

**Medalha:** arte em ouro `assets/medalha-sao-bento-ouro.svg`, baseada nas inscrições tradicionais de São Bento, conferidas no [OSB](https://osb.org/the-medal-of-saint-benedict/). É interpretação vetorial, não cunhagem oficial.

**Música templária:** reproduz o vídeo exato informado: [YouTube zodHltkgK1w](https://www.youtube.com/watch?v=zodHltkgK1w), com player oficial do YouTube que fica visível e só abre após clicar em reproduzir. Nenhum áudio é copiado ou redistribuído; se o canal não permitir incorporação, o link original continua disponível.

**English · Douay-Rheims:** removida a redefinição de idioma que anulava o clique; a opção agora troca de fato os versículos e salva a preferência.

**20 mistérios:** história, o que contemplar durante a oração e aplicação concreta na vida, em PT, EN, ES e LA. Textos autorais fundamentados nas passagens bíblicas e na carta [Rosarium Virginis Mariae](https://www.vatican.va/content/john-paul-ii/pt/apost_letters/2002/documents/hf_jp-ii_apl_20021016_rosarium-virginis-mariae.html). A Assunção e a Coroação não são descritas literalmente nos Evangelhos.


## CUIÚDO v15 — as duas imagens escolhidas e exame da omissão

- **Imagem da medalha colorida:** `assets/medalha-sao-bento-colorida.webp` — a imagem em azul, vermelho e dourado enviada na conversa; substitui o desenho dourado anterior no banner e no terço.
- **Imagem artística de São Bento:** `assets/sao-bento-arte-enviada.webp` — a ilustração escura com São Bento e a Cruz, apresentada no conteúdo de exame de consciência. As duas cópias WebP estão embutidas no repositório e cacheadas no PWA, sem depender de URLs externas. Para importação, as imagens foram redimensionadas a partir de cópias de pré-visualização do upload; a resolução não é a original.
- **Exame dos deveres e pecados por omissão**: sete reflexões com pergunta e atitude concreta: acédia (CIC 2094/2733), pecado por omissão (Tg 4,17/CIC 1853), deveres negligenciados, procrastinação voluntária, talentos desperdiçados (Mt 25), caridade omitida (Mt 25/CIC 2447) e desânimo. O conteúdo permanece fiel à doutrina: falhar uma meta pessoal não é automaticamente pecado mortal, que requer matéria grave, pleno conhecimento e consentimento deliberado (CIC 1857).
- **Fontes:** [Catecismo — pecado e omissão](https://www.vatican.va/archive/cathechism_po/index_new/p3s1cap1_1699-1876_po.html), [acédia e amor a Deus](https://www.vatican.va/archive/cathechism_po/index_new/p3s2cap1_2083-2195_po.html), [acédia na oração](https://www.vatican.va/archive/cathechism_po/index_new/p4s1cap3_2697-2758_po.html), [medalha de São Bento — CNBB](https://jovensconectados.org.br/7-coisas-que-devemos-saber-sobre-a-medalha-e-cruz-de-sao-bento.html).
