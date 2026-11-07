// Textos devocionais do CUIÚDO. Orações autorais identificadas; trechos bíblicos em tradução livre.
// Não são transcrições da Bíblia Ave-Maria e não substituem o texto litúrgico oficial.
const versiculosPorMisterio = Object.freeze({"anunciacao":{ref:"Lc 1,38",text:"Eis aqui a serva do Senhor; faça-se em mim segundo a tua palavra."},
"visitacao":{ref:"Lc 1,39",text:"Maria levantou-se e partiu apressadamente para a região montanhosa."},
"nascimento":{ref:"Lc 2,11",text:"Hoje nasceu para vós um Salvador, que é Cristo, o Senhor."},
"apresentacao":{ref:"Lc 2,30",text:"Os meus olhos viram a tua salvação."},
"encontro":{ref:"Lc 2,49",text:"Não sabíeis que devo ocupar-me das coisas de meu Pai?"},
"agonia":{ref:"Lc 22,42",text:"Pai, não se faça a minha vontade, mas a tua."},
"flagelacao":{ref:"Jo 19,1",text:"Então Pilatos mandou açoitar Jesus."},
"espinhos":{ref:"Mt 27,29",text:"Teceram uma coroa de espinhos e a colocaram sobre a sua cabeça."},
"cruz":{ref:"Lc 23,26",text:"Puseram a cruz sobre Simão, para que a levasse atrás de Jesus."},
"crucificacao":{ref:"Jo 19,30",text:"Tudo está consumado."},
"ressurreicao":{ref:"Mt 28,6",text:"Ele não está aqui, pois ressuscitou, como havia dito."},
"ascensao":{ref:"At 1,9",text:"Jesus foi elevado, e uma nuvem o encobriu aos olhos deles."},
"pentecostes":{ref:"At 2,4",text:"Todos ficaram cheios do Espírito Santo."},
"assuncao":{ref:"Ap 12,1",text:"Apareceu no céu um grande sinal: uma mulher revestida do sol."},
"coroacao":{ref:"Ap 12,1",text:"Sobre a sua cabeça, uma coroa de doze estrelas."},
"batismo":{ref:"Mt 3,17",text:"Este é meu Filho amado, em quem ponho a minha alegria."},
"cana":{ref:"Jo 2,5",text:"Fazei tudo o que ele vos disser."},
"reino":{ref:"Mc 1,15",text:"Convertei-vos e crede no Evangelho."},
"transfiguracao":{ref:"Mt 17,5",text:"Este é meu Filho amado. Escutai-o."},
"eucaristia":{ref:"Lc 22,19",text:"Isto é o meu corpo, que é dado por vós."}});
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
