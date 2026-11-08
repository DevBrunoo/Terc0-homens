/* CUIÚDO — orações dos 18 santos/anjos em quatro idiomas.
 * Oração de São Miguel e oração do Anjo da Guarda são tradicionais.
 * As demais são preces devocionais autorais, aqui traduzidas — não são citações oficiais.
 */
const cuiudoSaintUI=Object.freeze({
  "en": {
    "heading": "Saints & Angels",
    "kicker": "THE COMMUNION OF SAINTS",
    "desc": "We worship God alone. We ask the saints and angels to intercede for us, so that prayer may become faith, responsibility and charity.",
    "filters": [
      [
        "todos",
        "All prayers"
      ],
      [
        "anjos",
        "Angels"
      ],
      [
        "santos",
        "Saints"
      ],
      [
        "mariana",
        "Our Lady"
      ]
    ],
    "available": "PRAYERS AVAILABLE",
    "traditional": "Traditional prayer",
    "original": "Original devotional prayer",
    "source": "Devotional source",
    "noteTitle": "Prayer is not magic.",
    "noteText": "Saints intercede; Christ alone is our Savior. Holiness involves grace, conversion and charity, not guaranteed results.",
    "back": "Pray the Rosary",
    "painting": "Fra Angelico · Saints and martyrs · Public domain",
    "extraPainting": "The Coronation of the Virgin · Fra Angelico · CC0 photograph"
  },
  "es": {
    "heading": "Santos y Ángeles",
    "kicker": "LA COMUNIÓN DE LOS SANTOS",
    "desc": "Adoramos solamente a Dios. Pedimos a los santos y a los ángeles que intercedan por nosotros y que la oración se convierta en fe, responsabilidad y caridad.",
    "filters": [
      [
        "todos",
        "Todas las oraciones"
      ],
      [
        "anjos",
        "Ángeles"
      ],
      [
        "santos",
        "Santos"
      ],
      [
        "mariana",
        "Nuestra Señora"
      ]
    ],
    "available": "ORACIONES DISPONIBLES",
    "traditional": "Oración tradicional",
    "original": "Oración devocional original",
    "source": "Fuente devocional",
    "noteTitle": "La oración no es magia.",
    "noteText": "Los santos interceden; solamente Cristo salva. La santidad exige gracia, conversión y caridad, no resultados garantizados.",
    "back": "Rezar el Rosario",
    "painting": "Fra Angelico · Santos y mártires · Dominio público",
    "extraPainting": "La Coronación de la Virgen · Fra Angelico · Fotografía CC0"
  },
  "la": {
    "heading": "Sancti et Angeli",
    "kicker": "COMMUNIO SANCTORUM",
    "desc": "Soli Deo adorationem tribuimus. Sanctorum et angelorum intercessionem petimus, ut oratio in fidem, officium et caritatem vertatur.",
    "filters": [
      [
        "todos",
        "Omnes orationes"
      ],
      [
        "anjos",
        "Angeli"
      ],
      [
        "santos",
        "Sancti"
      ],
      [
        "mariana",
        "Beata Maria"
      ]
    ],
    "available": "ORATIONES",
    "traditional": "Oratio tradita",
    "original": "Oratio devotionis recens composita",
    "source": "Fons devotionis",
    "noteTitle": "Oratio non est magia.",
    "noteText": "Sancti intercedunt; solus Christus salvat. Sanctitas gratiam, conversionem et caritatem requirit, non prosperitatem certam.",
    "back": "Rosarium orare",
    "painting": "Fra Angelico · Sancti et martyres · Dominium publicum",
    "extraPainting": "Coronatio Mariae · Fra Angelico · Imago CC0"
  },
  "pt": {
    "heading": "Santos e Anjos",
    "kicker": "A COMUNHÃO DOS SANTOS",
    "desc": "Adoramos somente a Deus. Pedimos a intercessão dos santos e anjos para que a oração se transforme em fé, responsabilidade e caridade.",
    "filters": [
      [
        "todos",
        "Todas as orações"
      ],
      [
        "anjos",
        "Anjos"
      ],
      [
        "santos",
        "Santos"
      ],
      [
        "mariana",
        "Nossa Senhora"
      ]
    ],
    "available": "ORAÇÕES DISPONÍVEIS",
    "traditional": "Oração tradicional",
    "original": "Oração devocional autoral",
    "source": "Fonte devocional",
    "noteTitle": "Oração não é magia.",
    "noteText": "Os santos intercedem; somente Cristo salva. Santidade exige graça, conversão e caridade, não sucesso garantido.",
    "back": "Rezar o terço",
    "painting": "Fra Angelico · Santos e mártires · Domínio público",
    "extraPainting": "Coroação da Virgem · Fra Angelico · Fotografia CC0"
  }
});
const cuiudoSaintTranslations=Object.freeze({
  "miguel": {
    "en": [
      "Saint Michael the Archangel",
      "Saint Michael the Archangel, defend us in battle. Be our protection against the wickedness and snares of the devil. May God rebuke him, we humbly pray; and do thou, O Prince of the heavenly host, by the power of God, cast into hell Satan and all the evil spirits who prowl about the world seeking the ruin of souls. Amen."
    ],
    "es": [
      "San Miguel Arcángel",
      "San Miguel Arcángel, defiéndenos en la batalla. Sé nuestro amparo contra las maldades y asechanzas del demonio. Reprímale Dios, pedimos suplicantes; y tú, Príncipe de la milicia celestial, arroja al infierno con el divino poder a Satanás y a los demás espíritus malignos que andan dispersos por el mundo para la perdición de las almas. Amén."
    ],
    "la": [
      "Sancte Michael Archangele",
      "Sancte Michael Archangele, defende nos in proelio; contra nequitiam et insidias diaboli esto praesidium. Imperet illi Deus, supplices deprecamur; tuque, Princeps militiae caelestis, Satanam aliosque spiritus malignos, qui ad perditionem animarum pervagantur in mundo, divina virtute in infernum detrude. Amen."
    ]
  },
  "gabriel": {
    "en": [
      "Saint Gabriel the Archangel",
      "Saint Gabriel, faithful messenger of God's will, intercede for us, that we may hear the Word without running away. May our yes be sincere, obedient and courageous. Lead our decisions toward Jesus Christ. Amen."
    ],
    "es": [
      "San Gabriel Arcángel",
      "San Gabriel, mensajero fiel de la voluntad de Dios, intercede por nosotros para que escuchemos la Palabra sin huir. Que nuestro sí sea sincero, obediente y valiente. Guía nuestras decisiones hacia Jesucristo. Amén."
    ],
    "la": [
      "Sancte Gabriel Archangele",
      "Sancte Gabriel, fidelis voluntatis Dei nuntie, pro nobis intercede, ut Verbum sine fuga audiamus. Fiat nostrum ita sincerum, oboediens et forte. Consilia nostra ad Iesum Christum dirige. Amen."
    ]
  },
  "rafael": {
    "en": [
      "Saint Raphael the Archangel",
      "Saint Raphael, servant of the Lord and companion on the journey, intercede for our families, the sick and those lost in fear. Guide us toward prudence, hope and gratitude to God. Amen."
    ],
    "es": [
      "San Rafael Arcángel",
      "San Rafael, servidor del Señor y compañero de camino, intercede por nuestras familias, los enfermos y quienes viven con miedo. Guíanos hacia la prudencia, la esperanza y la gratitud a Dios. Amén."
    ],
    "la": [
      "Sancte Raphael Archangele",
      "Sancte Raphael, Domini minister et itineris comes, pro familiis nostris, infirmis ac timentibus intercede. Ad prudentiam, spem et grati animi sensum erga Deum nos perduc. Amen."
    ]
  },
  "guarda": {
    "en": [
      "Guardian Angel",
      "Angel of God, my guardian dear, to whom God's love commits me here, ever this day be at my side, to light and guard, to rule and guide. Amen."
    ],
    "es": [
      "Santo Ángel de la Guarda",
      "Ángel de Dios, que eres mi custodio, pues la bondad divina me ha confiado a ti, ilumíname, guárdame, rígeme y gobiérname siempre. Amén."
    ],
    "la": [
      "Angele Dei",
      "Angele Dei, qui custos es mei, me tibi commissum pietate superna, illumina, custodi, rege et guberna. Amen."
    ]
  },
  "maria": {
    "en": [
      "Our Lady of the Rosary",
      "O Mary, Mother of Jesus and our Mother, teach us to keep God's Word in our hearts. Accompany us in the Rosary and intercede that we may persevere in humility and faithfulness to your Son. Amen."
    ],
    "es": [
      "Nuestra Señora del Rosario",
      "Oh María, Madre de Jesús y Madre nuestra, enséñanos a guardar la Palabra de Dios en el corazón. Acompáñanos al rezar el Rosario e intercede para que seamos perseverantes, humildes y fieles a tu Hijo. Amén."
    ],
    "la": [
      "Beata Maria Virgo a Rosario",
      "O Maria, Mater Iesu et Mater nostra, doce nos Verbum Dei in corde custodire. In Rosario nos comitare et intercede, ut constantes, humiles ac Filio tuo fideles simus. Amen."
    ]
  },
  "jose": {
    "en": [
      "Saint Joseph",
      "Glorious Saint Joseph, just man and guardian of the Redeemer, teach us to work with dignity, love quietly, and faithfully fulfill our duties. Intercede for those seeking livelihood and direction. Amen."
    ],
    "es": [
      "San José",
      "Glorioso San José, hombre justo y custodio del Redentor, enséñanos a trabajar con dignidad, amar en silencio y cumplir fielmente nuestros deberes. Intercede por quienes buscan sustento y orientación. Amén."
    ],
    "la": [
      "Sancte Ioseph",
      "Gloriose Sancte Ioseph, vir iuste et Redemptoris custos, doce nos cum dignitate laborare, tacite amare et officia fideliter exsequi. Pro iis qui victum et viam quaerunt intercede. Amen."
    ]
  },
  "bento": {
    "en": [
      "Saint Benedict",
      "Saint Benedict, intercede that we may reject evil and choose what is good. May Christ's Cross guide our decisions, and may discipline never turn into pride but remain humble service to the Lord. Amen."
    ],
    "es": [
      "San Benito",
      "San Benito, intercede para que rechacemos el mal y escojamos el bien. Que la Cruz de Cristo guíe nuestras decisiones y que la disciplina no se convierta en orgullo, sino en humilde servicio al Señor. Amén."
    ],
    "la": [
      "Sancte Benedicte",
      "Sancte Benedicte, intercede ut malum respuamus et bonum eligamus. Crux Christi consilia nostra dirigat; disciplina non in superbiam, sed in humile Domino ministerium vertatur. Amen."
    ]
  },
  "francisco": {
    "en": [
      "Saint Francis of Assisi",
      "Saint Francis, brother of the poor and friend of peace, intercede for us. Take away our vanity and the desire to dominate. Teach us to love, serve and care for creation with joy. Amen."
    ],
    "es": [
      "San Francisco de Asís",
      "San Francisco, hermano de los pobres y amigo de la paz, intercede por nosotros. Aparta de nuestro corazón la vanidad y el deseo de dominar. Enséñanos a amar, servir y cuidar la creación con alegría. Amén."
    ],
    "la": [
      "Sancte Francisce Assisiensis",
      "Sancte Francisce, pauperum frater et pacis amice, pro nobis intercede. Vanitatem et dominandi cupiditatem a cordibus nostris amove. Nos amare, servire et creaturam cum gaudio curare doce. Amen."
    ]
  },
  "agostinho": {
    "en": [
      "Saint Augustine",
      "Saint Augustine, who restlessly sought the truth, intercede for our conversion. Free us from excuses that postpone what is good; teach us to love God more than our own ego. Amen."
    ],
    "es": [
      "San Agustín",
      "San Agustín, que buscaste la verdad con inquietud, intercede por nuestra conversión. Líbranos de las excusas con que postergamos el bien y enséñanos a amar a Dios por encima de nuestro orgullo. Amén."
    ],
    "la": [
      "Sancte Augustine",
      "Sancte Augustine, qui veritatem inquieto corde quaesivisti, pro conversione nostra intercede. A causis fictis quibus bonum differimus libera nos; Deum plus quam nosmetipsos amare doce. Amen."
    ]
  },
  "rita": {
    "en": [
      "Saint Rita of Cascia",
      "Saint Rita, model of perseverance in suffering, intercede in difficult causes and for wounded hearts. Help us reject despair, seek reconciliation where possible, and trust in God without abandoning responsibility. Amen."
    ],
    "es": [
      "Santa Rita de Casia",
      "Santa Rita, ejemplo de perseverancia en el sufrimiento, intercede en las causas difíciles y por los corazones heridos. Ayúdanos a rechazar la desesperación, buscar la reconciliación posible y confiar en Dios sin abandonar nuestros deberes. Amén."
    ],
    "la": [
      "Sancta Rita Cassiensis",
      "Sancta Rita, patientiae in dolore exemplum, in causis difficilibus et pro cordibus vulneratis intercede. Adiuva nos desperationem repellere, reconciliationem quaerere et Deo confidere sine officiorum fuga. Amen."
    ]
  },
  "teresinha": {
    "en": [
      "Saint Thérèse of the Child Jesus",
      "Saint Thérèse, teach us the little way of love: to do simple things faithfully without demanding applause. Intercede that our trust in God may grow together with everyday charity. Amen."
    ],
    "es": [
      "Santa Teresita del Niño Jesús",
      "Santa Teresita, enséñanos el caminito del amor: hacer lo sencillo con fidelidad, sin exigir aplausos. Intercede para que nuestra confianza en Dios crezca junto con la caridad cotidiana. Amén."
    ],
    "la": [
      "Sancta Teresia a Iesu Infante",
      "Sancta Teresia, parvam caritatis viam doce nos: simplicia fideliter sine laudis cupiditate agere. Intercede ut fiducia nostra in Deo una cum cotidiana caritate crescat. Amen."
    ]
  },
  "antonio": {
    "en": [
      "Saint Anthony of Padua",
      "Saint Anthony, preacher of the Gospel, intercede for those searching for what they have lost: peace, hope or direction. Above all, may we rediscover friendship with Christ and the courage to begin again. Amen."
    ],
    "es": [
      "San Antonio de Padua",
      "San Antonio, predicador del Evangelio, intercede por quienes buscan lo que han perdido: la paz, la esperanza o el rumbo. Que recuperemos sobre todo la amistad con Cristo y la valentía de empezar de nuevo. Amén."
    ],
    "la": [
      "Sancte Antoni Patavine",
      "Sancte Antoni, Evangelii praedicator, pro iis qui pacem, spem vel viam amiserunt intercede. Ante omnia amicitiam Christi atque fortitudinem rursus incipiendi inveniamus. Amen."
    ]
  },
  "judas": {
    "en": [
      "Saint Jude Thaddeus",
      "Saint Jude Thaddeus, apostle of Jesus Christ, intercede for us in times of great difficulty. Keep us from replacing faith with magical formulas. Give us trust in God and firmness to do the good we can. Amen."
    ],
    "es": [
      "San Judas Tadeo",
      "San Judas Tadeo, apóstol de Jesucristo, intercede por nosotros en las grandes dificultades. Que nunca cambiemos la fe por fórmulas mágicas. Danos confianza en Dios y firmeza para hacer el bien posible. Amén."
    ],
    "la": [
      "Sancte Iuda Thaddaee",
      "Sancte Iuda Thaddaee, Iesu Christi apostole, in magnis difficultatibus pro nobis intercede. Ne fidem cum formulis magicis commutemus. Fiduciam in Deo et constantiam ad bonum faciendum nobis obtine. Amen."
    ]
  },
  "pio": {
    "en": [
      "Saint Pio of Pietrelcina",
      "Saint Pio of Pietrelcina, who loved prayer and the sacrament of Reconciliation, intercede that we may leave sin behind and seek divine mercy with sincere repentance. Amen."
    ],
    "es": [
      "San Pío de Pietrelcina",
      "San Pío de Pietrelcina, que amaste la oración y el sacramento de la Reconciliación, intercede para que abandonemos el pecado y acudamos a la misericordia divina con arrepentimiento sincero. Amén."
    ],
    "la": [
      "Sancte Pie Pietrelcinensis",
      "Sancte Pie Pietrelcinensis, qui orationem et reconciliationis sacramentum amasti, intercede ut peccatum relinquamus et divinae misericordiae sincera paenitentia accedamus. Amen."
    ]
  },
  "faustina": {
    "en": [
      "Saint Faustina Kowalska",
      "Saint Faustina, witness to divine mercy, intercede that we may trust in Jesus without using mercy as an excuse to remain in error. Teach us to forgive and ask forgiveness. Jesus, I trust in You. Amen."
    ],
    "es": [
      "Santa Faustina Kowalska",
      "Santa Faustina, testigo de la misericordia divina, intercede para que confiemos en Jesús sin usar la misericordia como excusa para seguir en el error. Enséñanos a perdonar y pedir perdón. Jesús, en Ti confío. Amén."
    ],
    "la": [
      "Sancta Faustina Kowalska",
      "Sancta Faustina, divinae misericordiae testis, intercede ut Iesu confidamus neque misericordia ad peccatum permanendum abutamur. Ignoscere et veniam petere doce nos. Iesu, in te confido. Amen."
    ]
  },
  "monica": {
    "en": [
      "Saint Monica",
      "Saint Monica, mother persevering in prayer, intercede for our families. Help us love without controlling others, persevere without despair and entrust to God those whom we cannot change by force. Amen."
    ],
    "es": [
      "Santa Mónica",
      "Santa Mónica, madre perseverante en la oración, intercede por nuestras familias. Ayúdanos a amar sin controlar, perseverar sin desesperar y confiar a Dios a quienes no podemos cambiar por la fuerza. Amén."
    ],
    "la": [
      "Sancta Monica",
      "Sancta Monica, mater in oratione constans, pro familiis nostris intercede. Nos amare sine dominatione, perseverare sine desperatione et Deo credere eos quos vi mutare nequimus adiuva. Amen."
    ]
  },
  "teresa": {
    "en": [
      "Saint Teresa of Calcutta",
      "Saint Teresa of Calcutta, intercede that we may see Jesus in those who suffer. May our prayers become real respect, presence and charity, especially toward those the world prefers to ignore. Amen."
    ],
    "es": [
      "Santa Teresa de Calcuta",
      "Santa Teresa de Calcuta, intercede para que veamos a Jesús en quienes sufren. Que nuestra oración se traduzca en respeto, presencia y caridad verdadera, especialmente hacia quienes el mundo prefiere ignorar. Amén."
    ],
    "la": [
      "Sancta Teresia Calcuttensis",
      "Sancta Teresia Calcuttensis, intercede ut Iesum in patientibus videamus. Oratio nostra in reverentiam, praesentiam et veram caritatem transeat, praesertim erga eos quos mundus neglegit. Amen."
    ]
  },
  "joaopaulo": {
    "en": [
      "Saint John Paul II",
      "Saint John Paul II, witness to courage and hope, intercede that fear may never rule us. Help us follow Christ, defend human dignity and carry the Cross faithfully. Amen."
    ],
    "es": [
      "San Juan Pablo II",
      "San Juan Pablo II, testigo de valentía y esperanza, intercede para que el miedo no nos gobierne. Ayúdanos a seguir a Cristo, defender la dignidad humana y llevar la cruz con fidelidad. Amén."
    ],
    "la": [
      "Sancte Ioannes Paule II",
      "Sancte Ioannes Paule Secunde, fortitudinis et spei testis, intercede ne timor nobis imperet. Nos Christum sequi, humanam dignitatem defendere et crucem fideliter portare adiuva. Amen."
    ]
  }
});
function cuiudoSaintPrayer(entry,language){
 const l=['pt','en','es','la'].includes(language)?language:'pt';
 if(l==='pt')return {name:entry.name,text:entry.text,type:entry.type};
 const translated=cuiudoSaintTranslations[entry.id]?.[l];
 const t=cuiudoSaintUI[l];
 return translated?{name:translated[0],text:translated[1],
  type:entry.type==='Oração tradicional'?t.traditional:t.original}:
  {name:entry.name,text:entry.text,type:entry.type};
}
const cuiudoPriorSaintsPage=devocionario;
devocionario=function(){
 const l=cuiudoLocale(),t=cuiudoSaintUI[l];
 const filters=t.filters,selected=filters.some(x=>x[0]===state.devFilter)?state.devFilter:'todos';
 const prayers=oracoesDevocionario.filter(p=>selected==='todos'||p.category===selected);
 return '<section class="saints-hd-hero">'+
  '<div class="saints-hd-copy"><span class="eyebrow">'+escapeHtml(t.kicker)+'</span>'+
    '<h1>'+escapeHtml(t.heading)+'</h1><p>'+escapeHtml(t.desc)+'</p>'+
    '<div class="saints-hd-hero-detail"><span>✝</span><span>Communio Sanctorum</span></div></div>'+
  '<figure class="saints-hd-photo"><img src="./assets/santos-todos-fra-angelico.webp" loading="eager" decoding="async" width="1000" height="750" alt="'+escapeHtml(t.painting)+'">'+
  '<figcaption>'+escapeHtml(t.painting)+'</figcaption></figure></section>'+
  '<div class="devotion-filters" role="group" aria-label="'+escapeHtml(t.heading)+'">'+
  filters.map(([id,name])=>'<button class="group-button '+(selected===id?'active':'')+
   '" type="button" data-action="dev-filter" data-filter="'+id+'" aria-pressed="'+(selected===id)+'">'+escapeHtml(name)+'</button>').join('')+'</div>'+
  '<div class="card-meta saints-count">'+prayers.length+' '+escapeHtml(t.available)+'</div>'+
  '<section class="devotion-grid saints-hd-grid">'+prayers.map(entry=>{
   const p=cuiudoSaintPrayer(entry,l);
   return '<details class="card devotion-card" id="oracao-'+entry.id+'"><summary><span class="devotion-symbol" aria-hidden="true">'+
    (entry.category==='anjos'?icon('angel'):entry.category==='mariana'?'✝':'✦')+'</span><span><strong>'+
    escapeHtml(p.name)+'</strong><small>'+escapeHtml(p.type)+' · '+escapeHtml(entry.ref)+'</small></span></summary>'+
    '<div class="devotion-text" lang="'+escapeHtml(l==='pt'?'pt-BR':l)+'">'+escapeHtml(p.text)+'</div>'+
    (entry.source?'<a class="devotion-link" href="'+escapeHtml(entry.source)+'" target="_blank" rel="noopener noreferrer">'+escapeHtml(t.source)+' ↗</a>':'')+
    '</details>';
  }).join('')+'</section>'+
  '<section class="saints-second-photo"><figure><img src="./assets/santos-coroacao-fra-angelico.webp" loading="lazy" decoding="async" width="1000" height="720" alt="'+escapeHtml(t.extraPainting)+'">'+
   '<figcaption>'+escapeHtml(t.extraPainting)+'</figcaption></figure>'+
   '<div><span class="eyebrow">PAX</span><h2>'+escapeHtml(t.noteTitle)+'</h2><p>'+escapeHtml(t.noteText)+'</p>'+
    '<button class="btn btn-secondary" type="button" data-action="navigate" data-tab="terco">'+escapeHtml(t.back)+' ↗</button></div></section>';
};
render();
