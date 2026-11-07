// CUIÚDO / Feed editorial. Frases autorais; não são citações literais das Escrituras.
// Obras clássicas em domínio público e fotografias sob licença Unsplash.
const feedArtwork = Object.freeze({
  "miguel-reni": {
    "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/GuidoReni_MichaelDefeatsSatan.jpg/640px-GuidoReni_MichaelDefeatsSatan.jpg",
    "credit": "Guido Reni, São Miguel derrotando Satanás",
    "source": "https://commons.wikimedia.org/wiki/File:GuidoReni_MichaelDefeatsSatan.jpg",
    "license": "Domínio público"
  },
  "cowboy-remington": {
    "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/The_Cowboy%2C_1902%2C_by_Frederic_S._Remington.jpg/640px-The_Cowboy%2C_1902%2C_by_Frederic_S._Remington.jpg",
    "credit": "Frederic Remington, The Cowboy (1902)",
    "source": "https://commons.wikimedia.org/wiki/File:The_Cowboy,_1902,_by_Frederic_S._Remington.jpg",
    "license": "Domínio público"
  },
  "cristo-deserto": {
    "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Christ_in_the_Wilderness_-_Ivan_Kramskoy_-_Google_Cultural_Institute.jpg/640px-Christ_in_the_Wilderness_-_Ivan_Kramskoy_-_Google_Cultural_Institute.jpg",
    "credit": "Ivan Kramskoy, Cristo no deserto (1872)",
    "source": "https://commons.wikimedia.org/wiki/File:Christ_in_the_Wilderness_-_Ivan_Kramskoy_-_Google_Cultural_Institute.jpg",
    "license": "Domínio público"
  },
  "miguel-rafael": {
    "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Raphael_Saint_Michael_and_the_Dragon.jpg/640px-Raphael_Saint_Michael_and_the_Dragon.jpg",
    "credit": "Rafael, São Miguel e o dragão",
    "source": "https://commons.wikimedia.org/wiki/File:Raphael_Saint_Michael_and_the_Dragon.jpg",
    "license": "Domínio público"
  },
  "queda-cowboy": {
    "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/The_Fall_of_the_Cowboy%2C_1895%2C_by_Frederic_S._Remington.jpg/640px-The_Fall_of_the_Cowboy%2C_1895%2C_by_Frederic_S._Remington.jpg",
    "credit": "Frederic Remington, The Fall of the Cowboy (1895)",
    "source": "https://commons.wikimedia.org/wiki/File:The_Fall_of_the_Cowboy,_1895,_by_Frederic_S._Remington.jpg",
    "license": "Domínio público"
  },
  "investida": {
    "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/A_Dash_for_the_Timber%3B_1889%2C_Frederic_S._Remington.jpg/640px-A_Dash_for_the_Timber%3B_1889%2C_Frederic_S._Remington.jpg",
    "credit": "Frederic Remington, A Dash for the Timber (1889)",
    "source": "https://commons.wikimedia.org/wiki/File:A_Dash_for_the_Timber;_1889,_Frederic_S._Remington.jpg",
    "license": "Domínio público"
  },
  "cristo-cruz": {
    "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Christ_Carrying_the_Cross_1580.jpg/640px-Christ_Carrying_the_Cross_1580.jpg",
    "credit": "El Greco, Cristo carregando a cruz",
    "source": "https://commons.wikimedia.org/wiki/File:Christ_Carrying_the_Cross_1580.jpg",
    "license": "Domínio público"
  },
  "tempestade": {
    "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Rembrandt_-_Christ_in_the_Storm_on_the_Sea_of_Galilee.jpeg/640px-Rembrandt_-_Christ_in_the_Storm_on_the_Sea_of_Galilee.jpeg",
    "credit": "Rembrandt, Cristo na tempestade (1633)",
    "source": "https://commons.wikimedia.org/wiki/File:Rembrandt_-_Christ_in_the_Storm_on_the_Sea_of_Galilee.jpeg",
    "license": "Domínio público"
  },
  "waterhole": {
    "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Frederic_Remington_-_Fight_for_the_Waterhole_-_Google_Art_Project.jpg/640px-Frederic_Remington_-_Fight_for_the_Waterhole_-_Google_Art_Project.jpg",
    "credit": "Frederic Remington, Fight for the Waterhole",
    "source": "https://commons.wikimedia.org/wiki/File:Frederic_Remington_-_Fight_for_the_Waterhole_-_Google_Art_Project.jpg",
    "license": "Domínio público"
  },
  "broncho": {
    "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/The_Broncho_Buster_by_Frederic_Remington.jpg/640px-The_Broncho_Buster_by_Frederic_Remington.jpg",
    "credit": "Frederic Remington, The Broncho Buster",
    "source": "https://commons.wikimedia.org/wiki/File:The_Broncho_Buster_by_Frederic_Remington.jpg",
    "license": "Domínio público"
  },
  "rider": {
    "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Frederic_Remington_-_The_Cowboy_-_Google_Art_Project.jpg/640px-Frederic_Remington_-_The_Cowboy_-_Google_Art_Project.jpg",
    "credit": "Frederic Remington, The Cowboy",
    "source": "https://commons.wikimedia.org/wiki/File:Frederic_Remington_-_The_Cowboy_-_Google_Art_Project.jpg",
    "license": "Domínio público"
  },
  "rosario": {
    "url": "https://images.unsplash.com/photo-1654157632898-858fdbee3087?auto=format&fit=crop&w=900&q=82",
    "credit": "Dolina Modlitwy / Unsplash",
    "source": "https://unsplash.com/photos/a-person-holding-a-rosary-with-a-cross-on-it-CCC0CdEsI7E",
    "license": "Unsplash License"
  },
  "luz": {
    "url": "https://images.unsplash.com/photo-1491566102020-21838225c3c8?auto=format&fit=crop&w=900&q=82",
    "credit": "Chad Greiter / Unsplash",
    "source": "https://unsplash.com/photos/sunlight-beams-inside-ornate-cathedral--0gBnnMdQPw",
    "license": "Unsplash License"
  },
  "igreja": {
    "url": "https://images.unsplash.com/photo-1762967020428-66cdb1a6d789?auto=format&fit=crop&w=900&q=82",
    "credit": "Julia Taubitz / Unsplash",
    "source": "https://unsplash.com/photos/modern-concrete-church-interior-with-sunlight-streaming-in-ioHO90sxxJA",
    "license": "Unsplash License"
  }
});
const feedFilters = Object.freeze([["todos","Para você"],["miguel","São Miguel"],["rural","Rural / trabalho"],["jesus","Jesus"],["coragem","Vai pra cima"],["santidade","Santidade"],["salvos","Salvos"]]);
const feedPosts = Object.freeze([
  {
    "id": "m01",
    "category": "miguel",
    "art": "miguel-reni",
    "title": "NÃO INVOQUE SÃO MIGUEL PRA FUGIR DA SUA PRÓPRIA LUTA.",
    "kicker": "COMBATE ESPIRITUAL",
    "ref": "Ap 12,7",
    "reflection": "São Miguel enfrenta a batalha que lhe foi confiada. A sua batalha diária começa quando você encara a verdade e abandona o pecado, a mentira e a covardia.",
    "action": "Reze a oração de São Miguel e resolva uma pendência justa que você está adiando."
  },
  {
    "id": "r01",
    "category": "rural",
    "art": "cowboy-remington",
    "title": "FÉ EM DEUS. PÉ NA TÁBUA. TRABALHO NA MÃO.",
    "kicker": "FÉ & TRABALHO",
    "ref": "Cl 3,23",
    "reflection": "A fé não se prova no grito. Aparece no compromisso, na honestidade do trabalho e na coragem de fazer o que precisa ser feito.",
    "action": "Trabalhe 25 minutos sem distrair a cabeça com o celular."
  },
  {
    "id": "j01",
    "category": "jesus",
    "art": "cristo-deserto",
    "title": "CRISTO ENFRENTOU O DESERTO. E VOCÊ VAI FUGIR DO SEU DIA?",
    "kicker": "JESUS & CORAGEM",
    "ref": "Mt 4,1–11",
    "reflection": "Nem toda dor é castigo, e nem todo cansaço é fraqueza. Mas existe uma decisão que cabe a você: não se entregar à tentação de desistir do bem.",
    "action": "Reze por cinco minutos e faça o primeiro passo possível."
  },
  {
    "id": "r02",
    "category": "coragem",
    "art": "queda-cowboy",
    "title": "CAIU? LEVANTA. NÃO CHAMA UMA QUEDA DE DESTINO.",
    "kicker": "LEVANTAR DE NOVO",
    "ref": "Pr 24,16",
    "reflection": "Cair machuca. Não há vergonha em pedir ajuda. A vergonha seria abandonar o bem quando ainda existe caminho para recomeçar.",
    "action": "Identifique o erro, repare o que puder e volte ao trabalho."
  },
  {
    "id": "m02",
    "category": "miguel",
    "art": "miguel-rafael",
    "title": "SÃO MIGUEL, DEFENDEI-NOS NO COMBATE.",
    "kicker": "MILÍCIA CELESTE",
    "ref": "Ap 12,7–9",
    "reflection": "São Miguel aponta para a vitória de Deus, não para um culto ao próprio ego. Coragem cristã é enfrentar o mal sem se tornar aquilo que combate.",
    "action": "Reze a São Miguel e recuse uma atitude que alimenta o mal."
  },
  {
    "id": "r03",
    "category": "coragem",
    "art": "investida",
    "title": "SE TEM MEDO, VAI COM PRUDÊNCIA. MAS VAI.",
    "kicker": "CORAGEM EM MOVIMENTO",
    "ref": "Js 1,9",
    "reflection": "Esperar uma coragem sem medo é esperar para sempre. Prudência não é fuga; é avançar com preparo e responsabilidade.",
    "action": "Faça hoje uma ligação ou tarefa importante que você adia."
  },
  {
    "id": "j02",
    "category": "jesus",
    "art": "cristo-cruz",
    "title": "PEGA A TUA CRUZ. PARA DE TERCEIRIZAR A TUA VIDA.",
    "kicker": "CRUZ & RESPONSABILIDADE",
    "ref": "Lc 9,23",
    "reflection": "Jesus não prometeu uma vida sem cruz. Ele ensinou a carregar o peso com amor, receber ajuda e permanecer fiel ao bem.",
    "action": "Cumpra um dever que é seu sem colocar a culpa em outra pessoa."
  },
  {
    "id": "j03",
    "category": "jesus",
    "art": "tempestade",
    "title": "A TEMPESTADE NÃO É A ÚLTIMA PALAVRA.",
    "kicker": "FÉ EM MEIO AO CAOS",
    "ref": "Mt 8,23–27",
    "reflection": "A vida pode desorganizar tudo. A confiança em Cristo não apaga a dificuldade, mas nos impede de transformar o medo em senhor da nossa existência.",
    "action": "Coloque no papel três prioridades e execute a primeira."
  },
  {
    "id": "r04",
    "category": "rural",
    "art": "waterhole",
    "title": "QUEM QUER RESULTADO PRECISA ENCARAR A ESTRADA.",
    "kicker": "DISCIPLINA",
    "ref": "Gl 6,9",
    "reflection": "Desejar a vitória é fácil; ser fiel aos pequenos trabalhos cotidianos é a parte que quase ninguém fotografa.",
    "action": "Conclua uma tarefa concreta antes de abrir as redes sociais."
  },
  {
    "id": "r05",
    "category": "rural",
    "art": "broncho",
    "title": "CUIÚDO NÃO É QUEM GRITA. É QUEM AGUENTA E FAZ.",
    "kicker": "FORÇA COM JUÍZO",
    "ref": "2Tm 1,7",
    "reflection": "A força cristã exige domínio de si, não violência. Se não consegue governar a própria língua e o próprio horário, comece por aí.",
    "action": "Responda com respeito mesmo quando estiver irritado."
  },
  {
    "id": "r06",
    "category": "rural",
    "art": "rider",
    "title": "O SOL NASCEU. E A TUA DESCULPA JÁ ACORDOU ANTES?",
    "kicker": "ACORDA, CUIÚDO",
    "ref": "Ef 5,14",
    "reflection": "Um dia novo não resolve tudo, mas oferece outra chance de agir com dignidade. Ninguém constrói uma vida consistente só na intenção.",
    "action": "Escolha uma ação de 15 minutos e cumpra."
  },
  {
    "id": "f01",
    "category": "santidade",
    "art": "rosario",
    "title": "REZA DE VERDADE. DEPOIS HONRA O QUE REZOU.",
    "kicker": "ORAÇÃO & COERÊNCIA",
    "ref": "Tg 1,22",
    "reflection": "A oração transforma quando atravessa a porta da igreja e entra no comportamento em casa, no trabalho e nas relações.",
    "action": "Reze uma dezena do terço e pratique uma atitude de caridade."
  },
  {
    "id": "f02",
    "category": "santidade",
    "art": "luz",
    "title": "SILÊNCIO TAMBÉM É CORAGEM.",
    "kicker": "DISCERNIMENTO",
    "ref": "Sl 46,11",
    "reflection": "Quem só conhece o barulho perde a capacidade de ouvir a consciência. A firmeza nasce também de reconhecer os próprios limites.",
    "action": "Desligue as distrações e faça dez minutos de silêncio."
  },
  {
    "id": "f03",
    "category": "santidade",
    "art": "igreja",
    "title": "NÃO VENDA A ALMA PRA GANHAR UMA DISCUSSÃO.",
    "kicker": "DOMÍNIO PRÓPRIO",
    "ref": "Tg 1,19",
    "reflection": "Ter razão não autoriza humilhar ninguém. A verdade é forte o suficiente para dispensar crueldade.",
    "action": "Encerre hoje uma discussão inútil e preserve a paz."
  },
  {
    "id": "m03",
    "category": "miguel",
    "art": "miguel-reni",
    "title": "O MAL NÃO SE VENCE COM POSE. SE VENCE COM CONVERSÃO.",
    "kicker": "GUERRA INTERIOR",
    "ref": "Ef 6,11",
    "reflection": "São Miguel não é um amuleto. A oração precisa acompanhar escolhas concretas de conversão e fidelidade a Cristo.",
    "action": "Abandone um hábito que contraria sua consciência e procure a Reconciliação se necessário."
  },
  {
    "id": "r07",
    "category": "coragem",
    "art": "investida",
    "title": "TEM QUE FAZER DAR CERTO. COMEÇA COM O QUE VOCÊ CONTROLA.",
    "kicker": "VAI PRA CIMA",
    "ref": "Cl 3,23",
    "reflection": "Você não controla o resultado do mundo. Controla parte do esforço, das escolhas e do modo como trata as pessoas. Faça o melhor com o que está nas suas mãos.",
    "action": "Dê uma entrega concreta a algo importante ainda hoje."
  }
]);
