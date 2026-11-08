/* Conteúdo original de meditação em quatro idiomas; orações tradicionais.
 * Não reproduz traduções modernas da Bíblia protegidas por copyright.
 * PT/EN mantêm citações bíblicas históricas já verificadas; ES/LA usam
 * a referência e uma paráfrase devocional claramente identificada. */
const rosaryLocales=Object.freeze({
  "pt": {
    "locale": "Idioma",
    "rosary": "O Santo Terço",
    "intro": "Reze com calma. Contemple Cristo, examine a consciência e leve a fé para a vida.",
    "today": "Mistérios de hoje",
    "groups": {
      "gozosos": "Gozosos",
      "dolorosos": "Dolorosos",
      "gloriosos": "Gloriosos",
      "luminosos": "Luminosos"
    },
    "mystery": "mistério",
    "scripture": "PALAVRA DE DEUS",
    "meditation": "Meditação",
    "reflection": "REFLEXÃO DIRETA",
    "examine": "Exame de consciência",
    "question": "Onde preciso crescer neste mistério?",
    "act": "Ação concreta",
    "virtue": "Virtude para cultivar",
    "decade": "Contador da dezena",
    "hailCount": "Ave-Marias",
    "add": "Rezei uma Ave-Maria",
    "done": "Dezena concluída",
    "undo": "Desfazer",
    "reset": "Reiniciar",
    "previous": "Anterior",
    "next": "Próximo mistério",
    "prayers": "Orações do terço",
    "stepByStep": "Como rezar",
    "opening": "Início",
    "decades": "Em cada mistério",
    "closing": "Encerramento",
    "openingGuide": "Faça o Sinal da Cruz e reze o Credo, um Pai-Nosso, três Ave-Marias e um Glória.",
    "decadeGuide": "Anuncie o mistério, medite por um momento; reze um Pai-Nosso, dez Ave-Marias e um Glória. A oração de Fátima é opcional.",
    "closingGuide": "Conclua com a Salve-Rainha, a ladainha ou uma oração de agradecimento.",
    "musicOn": "Ligar música suave",
    "musicOff": "Pausar música",
    "musicUnsupported": "Seu navegador não oferece áudio ambiente.",
    "musicError": "Não foi possível iniciar o áudio. Tente tocar novamente.",
    "musicLabel": "Música ambiente original, sem reprodução automática",
    "volume": "Volume",
    "intention": "Intenção de oração",
    "intentionHelp": "Ofereça este terço por alguém ou por uma situação. Fica salva apenas neste navegador.",
    "intentionPlaceholder": "Por quem ou pelo que você quer rezar?",
    "saveIntention": "Salvar intenção",
    "saved": "Intenção salva neste aparelho",
    "prayersMore": "Orações adicionais",
    "offering": "Oferecimento do terço",
    "fatima": "Oração de Fátima (opcional)",
    "benedict": "Oração da Cruz de São Bento",
    "chapter": "Ler a referência bíblica",
    "adapted": "Paráfrase devocional autoral, não citação literal",
    "source": "Fonte",
    "complete": "Terço concluído. Agradeça a Deus e viva a caridade.",
    "notMagic": "A medalha é um sacramental, não um amuleto.",
    "localNote": "O idioma e a intenção ficam neste dispositivo."
  },
  "en": {
    "locale": "Language",
    "rosary": "The Holy Rosary",
    "intro": "Pray gently. Contemplate Christ, examine your conscience, and live your faith.",
    "today": "Today's mysteries",
    "groups": {
      "gozosos": "Joyful",
      "dolorosos": "Sorrowful",
      "gloriosos": "Glorious",
      "luminosos": "Luminous"
    },
    "mystery": "mystery",
    "scripture": "HOLY SCRIPTURE",
    "meditation": "Meditation",
    "reflection": "A DIRECT CHALLENGE",
    "examine": "Examination of conscience",
    "question": "Where do I need to grow through this mystery?",
    "act": "A concrete step",
    "virtue": "Virtue to cultivate",
    "decade": "Decade counter",
    "hailCount": "Hail Marys",
    "add": "I prayed a Hail Mary",
    "done": "Decade completed",
    "undo": "Undo",
    "reset": "Reset decade",
    "previous": "Previous",
    "next": "Next mystery",
    "prayers": "Rosary prayers",
    "stepByStep": "How to pray",
    "opening": "Beginning",
    "decades": "Each mystery",
    "closing": "Conclusion",
    "openingGuide": "Make the Sign of the Cross and pray the Creed, one Our Father, three Hail Marys, and the Glory Be.",
    "decadeGuide": "Announce the mystery, meditate in silence, then pray one Our Father, ten Hail Marys, and the Glory Be. The Fatima prayer is optional.",
    "closingGuide": "Finish with the Hail Holy Queen, a litany, or thanksgiving.",
    "musicOn": "Play gentle music",
    "musicOff": "Pause music",
    "musicUnsupported": "Your browser does not support ambient audio.",
    "musicError": "Unable to play audio. Tap again.",
    "musicLabel": "Original ambient music · no autoplay",
    "volume": "Volume",
    "intention": "Prayer intention",
    "intentionHelp": "Offer this rosary for someone or a situation. Stored only on this device.",
    "intentionPlaceholder": "Who or what are you praying for?",
    "saveIntention": "Save intention",
    "saved": "Saved on this device",
    "prayersMore": "Additional prayers",
    "offering": "Offering of the Rosary",
    "fatima": "Fatima prayer (optional)",
    "benedict": "Prayer of the Cross of St Benedict",
    "chapter": "Read biblical reference",
    "adapted": "Original devotional paraphrase, not a literal Bible quotation",
    "source": "Source",
    "complete": "Rosary completed. Give thanks to God and practice charity.",
    "notMagic": "The medal is a sacramental, not a charm.",
    "localNote": "Your language and intention stay on this device."
  },
  "es": {
    "locale": "Idioma",
    "rosary": "El Santo Rosario",
    "intro": "Reza con calma. Contempla a Cristo, examina tu conciencia y vive tu fe.",
    "today": "Misterios de hoy",
    "groups": {
      "gozosos": "Gozosos",
      "dolorosos": "Dolorosos",
      "gloriosos": "Gloriosos",
      "luminosos": "Luminosos"
    },
    "mystery": "misterio",
    "scripture": "SAGRADA ESCRITURA",
    "meditation": "Meditación",
    "reflection": "UNA VERDAD DIRECTA",
    "examine": "Examen de conciencia",
    "question": "¿En qué debo crecer al contemplar este misterio?",
    "act": "Acción concreta",
    "virtue": "Virtud que cultivar",
    "decade": "Contador de la decena",
    "hailCount": "Avemarías",
    "add": "He rezado un Avemaría",
    "done": "Decena completada",
    "undo": "Deshacer",
    "reset": "Reiniciar",
    "previous": "Anterior",
    "next": "Siguiente misterio",
    "prayers": "Oraciones del Rosario",
    "stepByStep": "Cómo rezar",
    "opening": "Inicio",
    "decades": "Cada misterio",
    "closing": "Final",
    "openingGuide": "Haz la Señal de la Cruz y reza el Credo, un Padrenuestro, tres Avemarías y un Gloria.",
    "decadeGuide": "Anuncia el misterio, medita en silencio y reza un Padrenuestro, diez Avemarías y un Gloria. La oración de Fátima es opcional.",
    "closingGuide": "Termina con la Salve, una letanía o una acción de gracias.",
    "musicOn": "Activar música suave",
    "musicOff": "Pausar música",
    "musicUnsupported": "Tu navegador no admite audio ambiente.",
    "musicError": "No se pudo reproducir el audio. Inténtalo de nuevo.",
    "musicLabel": "Música ambiente original · sin reproducción automática",
    "volume": "Volumen",
    "intention": "Intención de oración",
    "intentionHelp": "Ofrece este rosario por alguien o por una situación. Solo se guarda en este dispositivo.",
    "intentionPlaceholder": "¿Por quién o por qué quieres rezar?",
    "saveIntention": "Guardar intención",
    "saved": "Guardado en este dispositivo",
    "prayersMore": "Oraciones adicionales",
    "offering": "Ofrecimiento del Rosario",
    "fatima": "Oración de Fátima (opcional)",
    "benedict": "Oración de la Cruz de San Benito",
    "chapter": "Leer referencia bíblica",
    "adapted": "Paráfrasis devocional original; no es cita bíblica literal",
    "source": "Fuente",
    "complete": "Rosario completado. Da gracias a Dios y practica la caridad.",
    "notMagic": "La medalla es un sacramental, no un amuleto.",
    "localNote": "El idioma y la intención permanecen en este dispositivo."
  },
  "la": {
    "locale": "Lingua",
    "rosary": "Sanctum Rosarium",
    "intro": "Placide ora. Christum contemplare, conscientiam examina et fidem exerce.",
    "today": "Mysteria hodierna",
    "groups": {
      "gozosos": "Gaudiosa",
      "dolorosos": "Dolorosa",
      "gloriosos": "Gloriosa",
      "luminosos": "Luminosa"
    },
    "mystery": "mysterium",
    "scripture": "SACRA SCRIPTURA",
    "meditation": "Meditatio",
    "reflection": "VERITAS SINE EXCUSATIONE",
    "examine": "Examen conscientiae",
    "question": "Quid in hoc mysterio emendare debeo?",
    "act": "Opus concretum",
    "virtue": "Virtus colenda",
    "decade": "Numerus decadis",
    "hailCount": "Ave Maria",
    "add": "Ave Maria recitata est",
    "done": "Decas completa",
    "undo": "Revoca",
    "reset": "Itera decadem",
    "previous": "Prius",
    "next": "Mysterium sequens",
    "prayers": "Preces Rosarii",
    "stepByStep": "Quomodo orandum",
    "opening": "Initium",
    "decades": "In unoquoque mysterio",
    "closing": "Conclusio",
    "openingGuide": "Signo Crucis incipe. Symbolum Apostolorum, unum Pater noster, tres Ave Maria et Gloria Patri recita.",
    "decadeGuide": "Mysterium annuntia, paulisper meditare, deinde Pater noster, decem Ave Maria et Gloria Patri recita. Prex Fatimae ad libitum est.",
    "closingGuide": "Salve Regina, litanias vel gratiarum actionem adde.",
    "musicOn": "Musicam lenem age",
    "musicOff": "Musicam siste",
    "musicUnsupported": "Navigator tuus sonum ambientem non sustinet.",
    "musicError": "Sonus inchoari non potuit.",
    "musicLabel": "Musica originalis · numquam sponte incipit",
    "volume": "Sonus",
    "intention": "Intentio orationis",
    "intentionHelp": "Hoc rosarium pro aliquo vel aliqua re offer. Tantum in hoc instrumento servatur.",
    "intentionPlaceholder": "Pro quo vel pro qua re oras?",
    "saveIntention": "Serva intentionem",
    "saved": "In hoc instrumento servatum",
    "prayersMore": "Preces additae",
    "offering": "Oblatio Rosarii",
    "fatima": "Prex Fatimae (ad libitum)",
    "benedict": "Prex Crucis Sancti Benedicti",
    "chapter": "Lege locum Scripturae",
    "adapted": "Meditatio libera, non verba Scripturae ad litteram",
    "source": "Fons",
    "complete": "Rosarium completum. Deo gratias age et caritatem exerce.",
    "notMagic": "Medalia sacramentale est, non amuletum.",
    "localNote": "Lingua et intentio in instrumento tuo manent."
  }
});
const rosaryMysteries=Object.freeze({
  "anunciacao": {
    "en": {
      "title": "Annunciation",
      "meditation": "God calls Mary; she answers with trust before knowing the entire path.",
      "virtue": "Courage to say yes"
    },
    "es": {
      "title": "Anunciación",
      "meditation": "María responde con confianza sin conocer todo el camino.",
      "virtue": "Valentía para decir sí"
    },
    "la": {
      "title": "Annuntiatio",
      "meditation": "Maria Deo fidit, quamvis totum iter nondum intellegat.",
      "virtue": "Fiducia"
    }
  },
  "visitacao": {
    "en": {
      "title": "Visitation",
      "meditation": "Mary rises and goes to serve Elizabeth without delay.",
      "virtue": "Service in action"
    },
    "es": {
      "title": "Visitación",
      "meditation": "María se levanta y va a servir a Isabel sin tardar.",
      "virtue": "Caridad activa"
    },
    "la": {
      "title": "Visitatio",
      "meditation": "Maria surgit atque Elisabeth sine mora ministrat.",
      "virtue": "Caritas"
    }
  },
  "nascimento": {
    "en": {
      "title": "Nativity of Jesus",
      "meditation": "The Savior comes in humility, not in the comfort of power.",
      "virtue": "Humility"
    },
    "es": {
      "title": "Nacimiento de Jesús",
      "meditation": "El Salvador llega en la humildad, no en el privilegio.",
      "virtue": "Humildad"
    },
    "la": {
      "title": "Nativitas Domini",
      "meditation": "Salvator in humilitate nascitur, non in divitiis.",
      "virtue": "Humilitas"
    }
  },
  "apresentacao": {
    "en": {
      "title": "Presentation in the Temple",
      "meditation": "Mary and Joseph faithfully fulfill their ordinary duties.",
      "virtue": "Faithfulness"
    },
    "es": {
      "title": "Presentación en el Templo",
      "meditation": "María y José cumplen con fidelidad sus deberes cotidianos.",
      "virtue": "Fidelidad"
    },
    "la": {
      "title": "Praesentatio in Templo",
      "meditation": "Maria et Ioseph fideliter cotidiana officia complent.",
      "virtue": "Fidelitas"
    }
  },
  "encontro": {
    "en": {
      "title": "Finding Jesus in the Temple",
      "meditation": "Mary and Joseph seek Jesus with perseverance.",
      "virtue": "Seek Christ"
    },
    "es": {
      "title": "Jesús perdido y hallado en el Templo",
      "meditation": "María y José buscan a Jesús con perseverancia.",
      "virtue": "Buscar a Cristo"
    },
    "la": {
      "title": "Inventio in Templo",
      "meditation": "Maria et Ioseph Iesum constanter quaerunt.",
      "virtue": "Perseverantia"
    }
  },
  "agonia": {
    "en": {
      "title": "Agony in the Garden",
      "meditation": "Jesus prays through anguish and entrusts himself to the Father.",
      "virtue": "Trust in trials"
    },
    "es": {
      "title": "Agonía en el Huerto",
      "meditation": "Jesús ora en la angustia y se confía al Padre.",
      "virtue": "Confianza en la prueba"
    },
    "la": {
      "title": "Agonia in Horto",
      "meditation": "Iesus in angustiis orat et se Patri committit.",
      "virtue": "Fortitudo"
    }
  },
  "flagelacao": {
    "en": {
      "title": "Scourging at the Pillar",
      "meditation": "Jesus suffers without abandoning his mission of love.",
      "virtue": "Endurance"
    },
    "es": {
      "title": "Flagelación de Jesús",
      "meditation": "Jesús sufre sin abandonar su misión de amor.",
      "virtue": "Perseverancia"
    },
    "la": {
      "title": "Flagellatio Domini",
      "meditation": "Iesus patitur neque caritatis missionem deserit.",
      "virtue": "Patientia"
    }
  },
  "espinhos": {
    "en": {
      "title": "Crowning with Thorns",
      "meditation": "Christ endures mockery without answering with pride.",
      "virtue": "Humility in hardship"
    },
    "es": {
      "title": "Coronación de Espinas",
      "meditation": "Cristo soporta las burlas sin responder con orgullo.",
      "virtue": "Humildad en la prueba"
    },
    "la": {
      "title": "Coronatio Spinis",
      "meditation": "Christus ludibria patitur neque superbia respondet.",
      "virtue": "Mansuetudo"
    }
  },
  "cruz": {
    "en": {
      "title": "Carrying of the Cross",
      "meditation": "Jesus carries the cross; Simon helps him along the road.",
      "virtue": "Responsibility"
    },
    "es": {
      "title": "Jesús carga con la Cruz",
      "meditation": "Jesús lleva la cruz y Simón lo ayuda en el camino.",
      "virtue": "Responsabilidad"
    },
    "la": {
      "title": "Baiulatio Crucis",
      "meditation": "Iesus crucem portat et Simon eum adiuvat.",
      "virtue": "Constantia"
    }
  },
  "crucificacao": {
    "en": {
      "title": "Crucifixion and Death",
      "meditation": "Jesus gives his life for love upon the Cross.",
      "virtue": "Self-giving love"
    },
    "es": {
      "title": "Crucifixión y Muerte",
      "meditation": "Jesús entrega su vida por amor en la Cruz.",
      "virtue": "Amor que se entrega"
    },
    "la": {
      "title": "Crucifixio et Mors",
      "meditation": "Iesus in cruce vitam suam ex caritate tradit.",
      "virtue": "Amor"
    }
  },
  "ressurreicao": {
    "en": {
      "title": "Resurrection",
      "meditation": "The empty tomb proclaims that Christ is risen.",
      "virtue": "Hope"
    },
    "es": {
      "title": "Resurrección",
      "meditation": "El sepulcro vacío proclama que Cristo ha resucitado.",
      "virtue": "Esperanza"
    },
    "la": {
      "title": "Resurrectio",
      "meditation": "Sepulcrum vacuum Christum resurrexisse annuntiat.",
      "virtue": "Spes"
    }
  },
  "ascensao": {
    "en": {
      "title": "Ascension",
      "meditation": "The risen Lord entrusts the mission to his disciples.",
      "virtue": "Mission"
    },
    "es": {
      "title": "Ascensión",
      "meditation": "El Resucitado confía la misión a sus discípulos.",
      "virtue": "Misión"
    },
    "la": {
      "title": "Ascensio",
      "meditation": "Dominus resuscitatus missionem discipulis committit.",
      "virtue": "Missio"
    }
  },
  "pentecostes": {
    "en": {
      "title": "Descent of the Holy Spirit",
      "meditation": "The Spirit gives courage to witness to the Gospel.",
      "virtue": "Courage"
    },
    "es": {
      "title": "Venida del Espíritu Santo",
      "meditation": "El Espíritu da fuerza para anunciar el Evangelio.",
      "virtue": "Fortaleza"
    },
    "la": {
      "title": "Descensus Spiritus Sancti",
      "meditation": "Spiritus discipulos ad Evangelium nuntiandum roborat.",
      "virtue": "Fortitudo"
    }
  },
  "assuncao": {
    "en": {
      "title": "Assumption of Mary",
      "meditation": "The Church celebrates Mary taken into heavenly glory by grace.",
      "virtue": "Hope of Heaven"
    },
    "es": {
      "title": "Asunción de María",
      "meditation": "La Iglesia celebra a María elevada a la gloria del cielo por gracia.",
      "virtue": "Esperanza del cielo"
    },
    "la": {
      "title": "Assumptio Mariae",
      "meditation": "Ecclesia Mariam gratia Dei in caelestem gloriam assumptam celebrat.",
      "virtue": "Spes caelestis"
    }
  },
  "coroacao": {
    "en": {
      "title": "Coronation of Mary",
      "meditation": "Christian devotion contemplates Mary glorified beside her Son.",
      "virtue": "Faithful service"
    },
    "es": {
      "title": "Coronación de María",
      "meditation": "La devoción contempla a María glorificada junto a su Hijo.",
      "virtue": "Servicio fiel"
    },
    "la": {
      "title": "Coronatio Mariae",
      "meditation": "Pietas Mariam apud Filium glorificatam contemplatur.",
      "virtue": "Fidelitas"
    }
  },
  "batismo": {
    "en": {
      "title": "Baptism of Jesus",
      "meditation": "The Father reveals Jesus as his beloved Son.",
      "virtue": "Identity in God"
    },
    "es": {
      "title": "Bautismo de Jesús",
      "meditation": "El Padre revela a Jesús como su Hijo amado.",
      "virtue": "Identidad en Dios"
    },
    "la": {
      "title": "Baptismus Domini",
      "meditation": "Pater Iesum Filium dilectum revelat.",
      "virtue": "Dignitas"
    }
  },
  "cana": {
    "en": {
      "title": "Wedding at Cana",
      "meditation": "Mary points to Jesus and invites trust in him.",
      "virtue": "Obedience"
    },
    "es": {
      "title": "Bodas de Caná",
      "meditation": "María señala a Jesús e invita a confiar en él.",
      "virtue": "Obediencia"
    },
    "la": {
      "title": "Nuptiae Canae",
      "meditation": "Maria ad Iesum ducit atque fiduciam suadet.",
      "virtue": "Oboedientia"
    }
  },
  "reino": {
    "en": {
      "title": "Proclamation of the Kingdom",
      "meditation": "Jesus calls everyone to conversion and faith.",
      "virtue": "Conversion"
    },
    "es": {
      "title": "Anuncio del Reino",
      "meditation": "Jesús llama a todos a la conversión y a la fe.",
      "virtue": "Conversión"
    },
    "la": {
      "title": "Annuntiatio Regni",
      "meditation": "Iesus omnes ad paenitentiam et fidem vocat.",
      "virtue": "Conversio"
    }
  },
  "transfiguracao": {
    "en": {
      "title": "Transfiguration",
      "meditation": "Christ reveals his glory and the Father calls us to listen.",
      "virtue": "Listening"
    },
    "es": {
      "title": "Transfiguración",
      "meditation": "Cristo revela su gloria y el Padre nos invita a escucharlo.",
      "virtue": "Escucha"
    },
    "la": {
      "title": "Transfiguratio",
      "meditation": "Christus gloriam suam ostendit et Pater eum audire iubet.",
      "virtue": "Auditus"
    }
  },
  "eucaristia": {
    "en": {
      "title": "Institution of the Eucharist",
      "meditation": "At the Last Supper, Christ gives his Body and Blood in love.",
      "virtue": "Gratitude"
    },
    "es": {
      "title": "Institución de la Eucaristía",
      "meditation": "En la Última Cena, Cristo entrega su Cuerpo y Sangre por amor.",
      "virtue": "Gratitud"
    },
    "la": {
      "title": "Institutio Eucharistiae",
      "meditation": "In Ultima Cena Christus Corpus et Sanguinem ex amore donat.",
      "virtue": "Gratitudo"
    }
  }
});
const rosaryPrayers=Object.freeze({
  "en": [
    [
      "Sign of the Cross",
      "In the name of the Father, and of the Son, and of the Holy Spirit. Amen."
    ],
    [
      "Apostles' Creed",
      "I believe in God, the Father almighty, Creator of heaven and earth, and in Jesus Christ, his only Son, our Lord, who was conceived by the Holy Spirit, born of the Virgin Mary, suffered under Pontius Pilate, was crucified, died and was buried; he descended into hell; on the third day he rose again from the dead; he ascended into heaven, and is seated at the right hand of God the Father almighty; from there he will come to judge the living and the dead. I believe in the Holy Spirit, the holy Catholic Church, the communion of saints, the forgiveness of sins, the resurrection of the body, and life everlasting. Amen."
    ],
    [
      "Our Father",
      "Our Father, who art in heaven, hallowed be thy name; thy kingdom come; thy will be done on earth as it is in heaven. Give us this day our daily bread; and forgive us our trespasses, as we forgive those who trespass against us; and lead us not into temptation, but deliver us from evil. Amen."
    ],
    [
      "Hail Mary",
      "Hail Mary, full of grace, the Lord is with thee; blessed art thou among women, and blessed is the fruit of thy womb, Jesus. Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen."
    ],
    [
      "Glory Be",
      "Glory be to the Father, and to the Son, and to the Holy Spirit. As it was in the beginning, is now, and ever shall be, world without end. Amen."
    ],
    [
      "Hail Holy Queen",
      "Hail, holy Queen, Mother of mercy, our life, our sweetness, and our hope. To thee do we cry, poor banished children of Eve. To thee do we send up our sighs, mourning and weeping in this valley of tears. Turn then, most gracious advocate, thine eyes of mercy toward us, and after this our exile, show unto us the blessed fruit of thy womb, Jesus. O clement, O loving, O sweet Virgin Mary. Pray for us, O Holy Mother of God, that we may be made worthy of the promises of Christ. Amen."
    ]
  ],
  "es": [
    [
      "Señal de la Cruz",
      "En el nombre del Padre, y del Hijo, y del Espíritu Santo. Amén."
    ],
    [
      "Credo de los Apóstoles",
      "Creo en Dios, Padre todopoderoso, Creador del cielo y de la tierra. Creo en Jesucristo, su único Hijo, nuestro Señor, que fue concebido por obra y gracia del Espíritu Santo, nació de Santa María Virgen, padeció bajo el poder de Poncio Pilato, fue crucificado, muerto y sepultado, descendió a los infiernos, al tercer día resucitó de entre los muertos, subió a los cielos y está sentado a la derecha de Dios Padre todopoderoso. Desde allí ha de venir a juzgar a vivos y muertos. Creo en el Espíritu Santo, la santa Iglesia católica, la comunión de los santos, el perdón de los pecados, la resurrección de la carne y la vida eterna. Amén."
    ],
    [
      "Padrenuestro",
      "Padre nuestro que estás en el cielo, santificado sea tu nombre; venga a nosotros tu reino; hágase tu voluntad en la tierra como en el cielo. Danos hoy nuestro pan de cada día; perdona nuestras ofensas, como también nosotros perdonamos a los que nos ofenden; no nos dejes caer en la tentación y líbranos del mal. Amén."
    ],
    [
      "Avemaría",
      "Dios te salve, María, llena eres de gracia, el Señor es contigo; bendita tú eres entre todas las mujeres y bendito es el fruto de tu vientre, Jesús. Santa María, Madre de Dios, ruega por nosotros, pecadores, ahora y en la hora de nuestra muerte. Amén."
    ],
    [
      "Gloria al Padre",
      "Gloria al Padre, al Hijo y al Espíritu Santo. Como era en el principio, ahora y siempre, por los siglos de los siglos. Amén."
    ],
    [
      "Salve, Reina",
      "Dios te salve, Reina y Madre de misericordia, vida, dulzura y esperanza nuestra; Dios te salve. A ti llamamos los desterrados hijos de Eva; a ti suspiramos, gimiendo y llorando en este valle de lágrimas. Ea, pues, Señora, abogada nuestra, vuelve a nosotros esos tus ojos misericordiosos; y después de este destierro muéstranos a Jesús, fruto bendito de tu vientre. ¡Oh clementísima, oh piadosa, oh dulce Virgen María! Ruega por nosotros, santa Madre de Dios, para que seamos dignos de alcanzar las promesas de Cristo. Amén."
    ]
  ],
  "la": [
    [
      "Signum Crucis",
      "In nomine Patris, et Filii, et Spiritus Sancti. Amen."
    ],
    [
      "Symbolum Apostolorum",
      "Credo in Deum Patrem omnipotentem, Creatorem caeli et terrae, et in Iesum Christum, Filium eius unicum, Dominum nostrum, qui conceptus est de Spiritu Sancto, natus ex Maria Virgine, passus sub Pontio Pilato, crucifixus, mortuus et sepultus, descendit ad inferos, tertia die resurrexit a mortuis, ascendit ad caelos, sedet ad dexteram Dei Patris omnipotentis, inde venturus est iudicare vivos et mortuos. Credo in Spiritum Sanctum, sanctam Ecclesiam catholicam, sanctorum communionem, remissionem peccatorum, carnis resurrectionem, vitam aeternam. Amen."
    ],
    [
      "Pater Noster",
      "Pater noster, qui es in caelis: sanctificetur nomen tuum; adveniat regnum tuum; fiat voluntas tua, sicut in caelo et in terra. Panem nostrum quotidianum da nobis hodie; et dimitte nobis debita nostra, sicut et nos dimittimus debitoribus nostris; et ne nos inducas in tentationem; sed libera nos a malo. Amen."
    ],
    [
      "Ave Maria",
      "Ave Maria, gratia plena, Dominus tecum. Benedicta tu in mulieribus, et benedictus fructus ventris tui, Iesus. Sancta Maria, Mater Dei, ora pro nobis peccatoribus, nunc et in hora mortis nostrae. Amen."
    ],
    [
      "Gloria Patri",
      "Gloria Patri, et Filio, et Spiritui Sancto. Sicut erat in principio, et nunc, et semper, et in saecula saeculorum. Amen."
    ],
    [
      "Salve Regina",
      "Salve, Regina, Mater misericordiae, vita, dulcedo, et spes nostra, salve. Ad te clamamus, exsules filii Hevae. Ad te suspiramus, gementes et flentes in hac lacrimarum valle. Eia ergo, advocata nostra, illos tuos misericordes oculos ad nos converte. Et Iesum, benedictum fructum ventris tui, nobis post hoc exsilium ostende. O clemens, O pia, O dulcis Virgo Maria. Ora pro nobis, sancta Dei Genetrix, ut digni efficiamur promissionibus Christi. Amen."
    ]
  ]
});
const rosaryExtras=Object.freeze({
  "pt": {
    "offering": "Senhor Jesus, ofereço este terço pela conversão do meu coração, pela minha família, pelos que sofrem e por aqueles que mais precisam de misericórdia. Que eu não fuja dos meus deveres e ame como Tu ensinas. Amém.",
    "fatima": "Ó meu Jesus, perdoai-nos, livrai-nos do fogo do inferno, levai as almas todas para o Céu e socorrei principalmente as que mais precisarem da vossa misericórdia.",
    "benedict": "A Cruz Sagrada seja minha luz; não seja o dragão meu guia. Retira-te, Satanás; nunca me aconselhes coisas vãs. É mau o que tu me ofereces; bebe tu mesmo o teu veneno.",
    "challenge": "O que essa passagem exige de mim hoje? Peço a graça e dou o primeiro passo."
  },
  "en": {
    "offering": "Lord Jesus, I offer this Rosary for a converted heart, my family, those who suffer, and everyone in need of mercy. Help me face my duties and love as you teach. Amen.",
    "fatima": "O my Jesus, forgive us our sins, save us from the fires of hell, lead all souls to Heaven, especially those in most need of your mercy.",
    "benedict": "May the Holy Cross be my light. May the dragon never be my guide. Begone, Satan; never tempt me with vain things. What you offer is evil; drink your own poison.",
    "challenge": "What does this mystery ask of me today? I ask for grace and take the first step."
  },
  "es": {
    "offering": "Señor Jesús, ofrezco este Rosario por la conversión de mi corazón, mi familia, los que sufren y quienes más necesitan misericordia. Ayúdame a cumplir mis deberes y amar como Tú enseñas. Amén.",
    "fatima": "Oh Jesús mío, perdona nuestros pecados, líbranos del fuego del infierno, lleva al cielo a todas las almas, especialmente a las más necesitadas de tu misericordia.",
    "benedict": "La Santa Cruz sea mi luz; no sea el dragón mi guía. Apártate, Satanás; no me aconsejes vanidades. Es malo lo que me ofreces: bebe tú mismo tu veneno.",
    "challenge": "¿Qué me pide este misterio hoy? Pido la gracia y doy el primer paso."
  },
  "la": {
    "offering": "Domine Iesu, hoc Rosarium pro conversione cordis mei, pro familia mea, pro patientibus et pro omnibus misericordia indigentibus offero. Da mihi ut officium faciam et diligam sicut tu doces. Amen.",
    "fatima": "O Iesu mi, dimitte nobis peccata nostra, libera nos ab igne inferni, perduc omnes animas in caelum, praesertim eas quae misericordia tua maxime indigent.",
    "benedict": "Crux sacra sit mihi lux; non draco sit mihi dux. Vade retro Satana; numquam suade mihi vana. Sunt mala quae libas; ipse venena bibas.",
    "challenge": "Quid hoc mysterium hodie a me postulat? Gratiam peto et primum gradum facio."
  }
});
