// Textos devocionais do CUIÚDO. Orações autorais identificadas; versículos bíblicos em traduções católicas históricas de domínio público.
// Figueiredo e Douay-Rheims não são a Bíblia Ave-Maria; trechos longos podem ter excertos literais.
// Citações bíblicas reais, conferidas na tradução católica histórica de Figueiredo e na Douay-Rheims 1899.
// A ortografia portuguesa segue formas atualizadas; algumas entradas são excertos literais identificados.
const versiculosPorMisterio = Object.freeze({
  "anunciacao": {
    "ref": "Lc 1,38",
    "pt": "Então disse Maria: Eis-aqui a escrava do Senhor, faça-se em mim, segundo a tua palavra. E o anjo se apartou dela.",
    "en": "And Mary said: Behold the handmaid of the Lord; be it done to me according to thy word. And the angel departed from her.",
    "excerptPt": false,
    "ptSource": "https://fidesviva.org/pt-BR/biblia/lucas/1",
    "enSource": "https://ebible.org/engDRA/LUK01.htm"
  },
  "visitacao": {
    "ref": "Lc 1,39",
    "pt": "E naqueles dias levantando-se Maria foi com pressa às montanhas, a uma cidade de Judá;",
    "en": "And Mary rising up in those days, went into the hill country with haste into a city of Juda.",
    "excerptPt": false,
    "ptSource": "https://fidesviva.org/pt-BR/biblia/lucas/1",
    "enSource": "https://ebible.org/engDRA/LUK01.htm"
  },
  "nascimento": {
    "ref": "Lc 2,11",
    "pt": "E é que hoje vos nasceu na cidade de Davi o Salvador que é o Cristo Senhor.",
    "en": "For, this day, is born to you a Saviour, who is Christ the Lord, in the city of David.",
    "excerptPt": false,
    "ptSource": "https://fidesviva.org/pt-BR/biblia/lucas/2",
    "enSource": "https://ebible.org/engDRA/LUK02.htm"
  },
  "apresentacao": {
    "ref": "Lc 2,30",
    "pt": "Porque já os meus olhos viram o Salvador que tu nos deste,",
    "en": "Because my eyes have seen thy salvation,",
    "excerptPt": false,
    "ptSource": "https://fidesviva.org/pt-BR/biblia/lucas/2",
    "enSource": "https://ebible.org/engDRA/LUK02.htm"
  },
  "encontro": {
    "ref": "Lc 2,49",
    "pt": "E ele lhes respondeu: Para que me buscáveis? não sabíeis que importa ocupar-me nas coisas que são do serviço de meu Pai?",
    "en": "And he said to them: How is it that you sought me? did you not know, that I must be about my father’s business?",
    "excerptPt": false,
    "ptSource": "https://fidesviva.org/pt-BR/biblia/lucas/2",
    "enSource": "https://ebible.org/engDRA/LUK02.htm"
  },
  "agonia": {
    "ref": "Lc 22,42",
    "pt": "Não se faça contudo a minha vontade, senão a tua,",
    "en": "Saying: Father, if thou wilt, remove this chalice from me: but yet not my will, but thine be done.",
    "excerptPt": true,
    "ptSource": "https://fidesviva.org/pt-BR/biblia/lucas/22",
    "enSource": "https://ebible.org/engDRA/LUK22.htm"
  },
  "flagelacao": {
    "ref": "Jo 19,1",
    "pt": "Pilatos pois tomou então a Jesus e o mandou açoitar.",
    "en": "Then therefore, Pilate took Jesus, and scourged him.",
    "excerptPt": false,
    "ptSource": "https://fidesviva.org/pt-BR/biblia/joao/19",
    "enSource": "https://ebible.org/engDRA/JHN19.htm"
  },
  "espinhos": {
    "ref": "Mt 27,29",
    "pt": "E tecendo uma coroa de espinhos, lha puseram sobre a cabeça, e na sua mão direita uma cana. E ajoelhando diante dele, o escarneciam, dizendo: Deus te salve, rei dos judeus.",
    "en": "And platting a crown of thorns, they put it upon his head, and a reed in his right hand. And bowing the knee before him, they mocked him, saying: Hail, king of the Jews.",
    "excerptPt": false,
    "ptSource": "https://bibliatraduzida.com/figueiredo/mateus/27/",
    "enSource": "https://ebible.org/engDRA/MAT27.htm"
  },
  "cruz": {
    "ref": "Mt 27,32",
    "pt": "E ao sair da cidade acharam um homem de Cirene, por nome Simão: A este constrangeram a que levasse a cruz dele padecente.",
    "en": "And going out, they found a man of Cyrene, named Simon: him they forced to take up his cross.",
    "excerptPt": false,
    "ptSource": "https://bibliatraduzida.com/figueiredo/mateus/27/",
    "enSource": "https://ebible.org/engDRA/MAT27.htm"
  },
  "crucificacao": {
    "ref": "Jo 19,30",
    "pt": "Jesus porém havendo tomado o vinagre, disse: Tudo está cumprido. E abaixando a cabeça, rendeu o espírito.",
    "en": "Jesus therefore, when he had taken the vinegar, said: It is consummated. And bowing his head, he gave up the ghost.",
    "excerptPt": false,
    "ptSource": "https://fidesviva.org/pt-BR/biblia/joao/19",
    "enSource": "https://ebible.org/engDRA/JHN19.htm"
  },
  "ressurreicao": {
    "ref": "Mt 28,6",
    "pt": "Ele já aqui não está, porque ressuscitou como tinha dito; vinde e vede o lugar, onde o Senhor estava posto.",
    "en": "He is not here, for he is risen, as he said. Come, and see the place where the Lord was laid.",
    "excerptPt": false,
    "ptSource": "https://fidesviva.org/pt-BR/biblia/mateus/28",
    "enSource": "https://ebible.org/engDRA/MAT28.htm"
  },
  "ascensao": {
    "ref": "At 1,9",
    "pt": "E tendo dito isto, vendo-o eles, se foi elevando; e o recebeu uma nuvem que o ocultou a seus olhos.",
    "en": "And when he had said these things, while they looked on, he was raised up: and a cloud received him out of their sight.",
    "excerptPt": false,
    "ptSource": "https://fidesviva.org/pt-BR/biblia/atos-dos-apostolos/1",
    "enSource": "https://ebible.org/engDRA/ACT01.htm"
  },
  "pentecostes": {
    "ref": "At 2,4",
    "pt": "E foram todos cheios do Espírito Santo, e começaram a falar em várias línguas, conforme o Espírito Santo lhes concedia que falassem.",
    "en": "And they were all filled with the Holy Ghost, and they began to speak with divers tongues, according as the Holy Ghost gave them to speak.",
    "excerptPt": false,
    "ptSource": "https://fidesviva.org/pt-BR/biblia/atos-dos-apostolos/2",
    "enSource": "https://ebible.org/engDRA/ACT02.htm"
  },
  "assuncao": {
    "ref": "Ap 12,1",
    "pt": "Apareceu, outrossim, um grande sinal no céu: Uma mulher vestida do sol que tinha a lua debaixo de seus pés e uma coroa de doze estrelas sobre a sua cabeça;",
    "en": "And a great sign appeared in heaven: A woman clothed with the sun, and the moon under her feet, and on her head a crown of twelve stars:",
    "excerptPt": false,
    "ptSource": "https://fidesviva.org/pt-BR/biblia/apocalipse/12",
    "enSource": "https://ebible.org/engDRA/REV12.htm"
  },
  "coroacao": {
    "ref": "Ap 12,1",
    "pt": "Apareceu, outrossim, um grande sinal no céu: Uma mulher vestida do sol que tinha a lua debaixo de seus pés e uma coroa de doze estrelas sobre a sua cabeça;",
    "en": "And a great sign appeared in heaven: A woman clothed with the sun, and the moon under her feet, and on her head a crown of twelve stars:",
    "excerptPt": false,
    "ptSource": "https://fidesviva.org/pt-BR/biblia/apocalipse/12",
    "enSource": "https://ebible.org/engDRA/REV12.htm"
  },
  "batismo": {
    "ref": "Mt 3,17",
    "pt": "E eis uma voz dos céus, que dizia: Este é meu filho amado, no qual tenho posto toda a minha complacência.",
    "en": "And behold a voice from heaven, saying: This is my beloved Son, in whom I am well pleased.",
    "excerptPt": false,
    "ptSource": "https://bibliatraduzida.com/figueiredo/mateus/3/",
    "enSource": "https://ebible.org/engDRA/MAT03.htm"
  },
  "cana": {
    "ref": "Jo 2,5",
    "pt": "Disse a Mãe de Jesus aos que serviam: Fazei tudo o que ele vos disser.",
    "en": "His mother saith to the waiters: Whatsoever he shall say to you, do ye.",
    "excerptPt": false,
    "ptSource": "https://fidesviva.org/pt-BR/biblia/joao/2",
    "enSource": "https://ebible.org/engDRA/JHN02.htm"
  },
  "reino": {
    "ref": "Mc 1,15",
    "pt": "e dizendo: Pois que o tempo está cumprido, e se aproximou o reino de Deus: Fazei penitência, e crede no Evangelho.",
    "en": "And saying: The time is accomplished, and the kingdom of God is at hand: repent, and believe the gospel.",
    "excerptPt": false,
    "ptSource": "https://bibliatraduzida.com/figueiredo/marcos/1/",
    "enSource": "https://ebible.org/engDRA/MRK01.htm"
  },
  "transfiguracao": {
    "ref": "Mt 17,5",
    "pt": "Estando ele ainda falando, eis que uma lúcida nuvem os cobriu. E eis que saiu uma voz da nuvem que dizia: Este é aquele, meu querido Filho, em quem tenho posto toda a minha complacência: Ouvi-o.",
    "en": "And as he was yet speaking, behold a bright cloud overshadowed them. And lo, a voice out of the cloud, saying: This is my beloved Son, in whom I am well pleased: hear ye him.",
    "excerptPt": false,
    "ptSource": "https://bibliatraduzida.com/figueiredo/mateus/17/",
    "enSource": "https://ebible.org/engDRA/MAT17.htm"
  },
  "eucaristia": {
    "ref": "Lc 22,19",
    "pt": "Este é o meu corpo, que se dá por vós: Fazei isto em memória de mim.",
    "en": "And taking bread, he gave thanks, and brake; and gave to them, saying: This is my body, which is given for you. Do this for a commemoration of me.",
    "excerptPt": true,
    "ptSource": "https://fidesviva.org/pt-BR/biblia/lucas/22",
    "enSource": "https://ebible.org/engDRA/LUK22.htm"
  }
});
const oracoesDevocionario = [
  {
    "id": "miguel",
    "name": "São Miguel Arcanjo",
    "category": "anjos",
    "type": "Oração tradicional",
    "ref": "Ap 12,7–9",
    "text": "São Miguel Arcanjo, defendei-nos no combate. Sede nosso refúgio contra as maldades e ciladas do demônio. Ordene-lhe Deus, instantemente o pedimos; e vós, Príncipe da milícia celeste, pelo divino poder, precipitai no inferno a Satanás e a todos os espíritos malignos que andam pelo mundo para perder as almas. Amém.",
    "source": "https://www.vatican.va/content/john-paul-ii/pt/angelus/1981/documents/hf_jp-ii_ang_19810930.html"
  },
  {
    "id": "gabriel",
    "name": "São Gabriel Arcanjo",
    "category": "anjos",
    "type": "Oração autoral",
    "ref": "Lc 1,26–38",
    "text": "São Gabriel, mensageiro fiel da vontade de Deus, intercedei por nós para que saibamos ouvir a Palavra sem fugir. Que o nosso sim seja sincero, obediente e corajoso. Conduzi nossas decisões a Jesus Cristo. Amém."
  },
  {
    "id": "rafael",
    "name": "São Rafael Arcanjo",
    "category": "anjos",
    "type": "Oração autoral",
    "ref": "Tb 12,15",
    "text": "São Rafael, servidor do Senhor e companheiro de caminho, intercedei por nossas famílias, por quem está enfermo e por quem se perdeu no medo. Levai-nos à prudência, à esperança e à gratidão a Deus. Amém."
  },
  {
    "id": "guarda",
    "name": "Santo Anjo da Guarda",
    "category": "anjos",
    "type": "Oração tradicional",
    "ref": "Mt 18,10",
    "text": "Santo Anjo do Senhor, meu zeloso guardador, se a ti me confiou a piedade divina, sempre me rege, guarda, governa e ilumina. Amém."
  },
  {
    "id": "maria",
    "name": "Nossa Senhora do Rosário",
    "category": "mariana",
    "type": "Oração autoral",
    "ref": "Lc 1,46–49",
    "text": "Ó Maria, Mãe de Jesus e nossa Mãe, ensinai-nos a conservar a Palavra de Deus no coração. Acompanhai-nos na oração do Rosário e intercedei para que sejamos perseverantes, humildes e fiéis ao vosso Filho. Amém."
  },
  {
    "id": "jose",
    "name": "São José",
    "category": "santos",
    "type": "Oração autoral",
    "ref": "Mt 1,24",
    "text": "Glorioso São José, homem justo e guardião do Redentor, ensinai-nos a trabalhar com dignidade, amar em silêncio e cumprir nossos deveres com fidelidade. Intercedei pelos que procuram sustento e direção. Amém.",
    "source": "https://www.vatican.va/content/francesco/pt/apost_letters/documents/papa-francesco-lettera-ap_20201208_patris-corde.html"
  },
  {
    "id": "bento",
    "name": "São Bento",
    "category": "santos",
    "type": "Oração autoral",
    "ref": "Ef 6,11",
    "text": "São Bento, intercedei para que rejeitemos o mal e escolhamos o bem. Que a Cruz de Cristo oriente nossas decisões e que a disciplina não se transforme em orgulho, mas em humilde serviço ao Senhor. Amém."
  },
  {
    "id": "francisco",
    "name": "São Francisco de Assis",
    "category": "santos",
    "type": "Oração autoral",
    "ref": "Mt 5,9",
    "text": "São Francisco, irmão dos pobres e amigo da paz, intercedei por nós: arrancai do nosso coração a vaidade e o desejo de dominar. Ensinai-nos a amar, servir e cuidar da criação com alegria. Amém."
  },
  {
    "id": "agostinho",
    "name": "Santo Agostinho",
    "category": "santos",
    "type": "Oração autoral",
    "ref": "Rm 13,13–14",
    "text": "Santo Agostinho, que buscastes a verdade com inquietação, intercedei por nossa conversão. Livrai-nos das desculpas com que adiamos o bem; fazei-nos amar a Deus acima do próprio ego. Amém."
  },
  {
    "id": "rita",
    "name": "Santa Rita de Cássia",
    "category": "santos",
    "type": "Oração autoral",
    "ref": "Rm 12,12",
    "text": "Santa Rita, exemplo de perseverança no sofrimento, intercedei nas causas difíceis e pelos corações feridos. Ajudai-nos a recusar o desespero, procurar a reconciliação possível e confiar em Deus sem abandonar a responsabilidade. Amém."
  },
  {
    "id": "teresinha",
    "name": "Santa Teresinha do Menino Jesus",
    "category": "santos",
    "type": "Oração autoral",
    "ref": "Mt 18,3",
    "text": "Santa Teresinha, ensinai-nos a pequena via do amor: fazer o simples com fidelidade, sem exigir aplausos. Intercedei para que nossa confiança em Deus cresça junto com a caridade cotidiana. Amém."
  },
  {
    "id": "antonio",
    "name": "Santo Antônio de Pádua",
    "category": "santos",
    "type": "Oração autoral",
    "ref": "Lc 15,4",
    "text": "Santo Antônio, pregador do Evangelho, intercedei pelos que buscam o que perderam: a paz, a esperança, a direção. Que reencontremos acima de tudo a amizade com Cristo e a coragem de recomeçar. Amém."
  },
  {
    "id": "judas",
    "name": "São Judas Tadeu",
    "category": "santos",
    "type": "Oração autoral",
    "ref": "Jd 1,20–21",
    "text": "São Judas Tadeu, apóstolo de Jesus Cristo, intercedei por nós nos momentos de grande dificuldade. Que jamais troquemos a fé por fórmulas mágicas: dai-nos confiança em Deus e firmeza para fazer o bem possível. Amém."
  },
  {
    "id": "pio",
    "name": "São Pio de Pietrelcina",
    "category": "santos",
    "type": "Oração autoral",
    "ref": "1Ts 5,17",
    "text": "São Pio de Pietrelcina, que amastes a oração e o sacramento da reconciliação, intercedei para que abandonemos o pecado e recorramos à misericórdia divina com arrependimento sincero. Amém."
  },
  {
    "id": "faustina",
    "name": "Santa Faustina Kowalska",
    "category": "santos",
    "type": "Oração autoral",
    "ref": "Lc 6,36",
    "text": "Santa Faustina, testemunha da misericórdia divina, intercedei para que confiemos em Jesus sem usar a misericórdia como desculpa para continuar no erro. Que saibamos perdoar e pedir perdão. Jesus, eu confio em vós. Amém."
  },
  {
    "id": "monica",
    "name": "Santa Mônica",
    "category": "santos",
    "type": "Oração autoral",
    "ref": "Lc 18,1",
    "text": "Santa Mônica, mãe perseverante na oração, intercedei por nossas famílias. Ajudai-nos a amar sem controlar, perseverar sem desesperar e confiar a Deus as pessoas que não podemos mudar à força. Amém."
  },
  {
    "id": "teresa",
    "name": "Santa Teresa de Calcutá",
    "category": "santos",
    "type": "Oração autoral",
    "ref": "Mt 25,40",
    "text": "Santa Teresa de Calcutá, intercedei para que enxerguemos Jesus em quem sofre. Que nossa oração se traduza em respeito, presença e caridade real, especialmente diante de quem o mundo prefere ignorar. Amém."
  },
  {
    "id": "joaopaulo",
    "name": "São João Paulo II",
    "category": "santos",
    "type": "Oração autoral",
    "ref": "Jo 14,27",
    "text": "São João Paulo II, testemunha de coragem e esperança, intercedei para que não nos deixemos governar pelo medo. Ajudai-nos a seguir Cristo, defender a dignidade humana e carregar a cruz com fidelidade. Amém."
  }
];
const ladainhaBreve = [
  "Senhor Jesus, fonte da nossa esperança — tende piedade de nós.",
  "Cristo, que acolheis os arrependidos — tende piedade de nós.",
  "Senhor, que chamais à santidade — tende piedade de nós.",
  "Santa Maria, serva fiel da Palavra — rogai por nós.",
  "Santa Mãe do Salvador — rogai por nós.",
  "Maria, mulher do sim corajoso — rogai por nós.",
  "Mãe que guardava a Palavra no coração — rogai por nós.",
  "Virgem que confiou no Senhor — rogai por nós.",
  "Mãe presente ao pé da Cruz — rogai por nós.",
  "Senhora da esperança nas provações — rogai por nós.",
  "Mãe que nos aponta para Jesus — rogai por nós.",
  "Mãe dos que buscam a conversão — rogai por nós.",
  "Amparo dos que choram — rogai por nós.",
  "Companheira dos que peregrinam na fé — rogai por nós.",
  "Serva que inspira a caridade — rogai por nós.",
  "Exemplo de silêncio e fidelidade — rogai por nós.",
  "Mãe da Igreja em oração — rogai por nós.",
  "Senhora do Santo Rosário — rogai por nós."
];
const fonteLadainhaOficial = "https://www.vatican.va/special/rosary/documents/litanie-lauretane_po.html";
