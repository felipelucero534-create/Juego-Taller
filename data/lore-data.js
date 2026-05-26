// ═══════════════════════════════════════════════════════════════════════════
// VOID PROTOCOL — data/lore-data.js
// Historia, cutscenes, capítulos, logs y narrativa del universo Erebus
// ═══════════════════════════════════════════════════════════════════════════

window.LORE_DATA = {

  // ─────────────────────────────────────────────────────────────────────────
  // METADATA DE CAPÍTULOS (alineado con mapa y desafíos)
  // ─────────────────────────────────────────────────────────────────────────

  chapters: {
    1: {
      id: 1,
      title: 'CAPÍTULO I — PROTOCOLO HTML',
      location: 'DECK 04 // BAHÍA DE INGENIERÍA',
      terminal: 'T1 — Terminal Alpha',
      door: 'D1 — Compuerta Norte',
      skill: 'HTML',
      loreSummary: 'Reactivar ventilación y autenticación tras el colapso provocado por MYCO-X en los servidores.',
      objective: 'Reinicia la Terminal Alpha (T1) — HTML',
      objectiveComplete: 'Avanza al norte hacia la Bahía Médica (Deck 03)',
      introCutscene: 'intro',
      completeCutscene: 'chapter1_complete',
      ambientLog: 'log_voss',
      zoneKey: 'eng'
    },
    2: {
      id: 2,
      title: 'CAPÍTULO II — PROTOCOLO CSS',
      location: 'DECK 03 // BAHÍA MÉDICA',
      terminal: 'T2 — Terminal Beta',
      door: 'D2 — Compuerta al Puente',
      skill: 'CSS',
      loreSummary: 'Restaurar paneles de alerta y monitores donde Chen documentó la naturaleza de MYCO-X.',
      objective: 'Reprograma la Terminal Beta (T2) — CSS',
      objectiveComplete: 'Sube al Puente de Mando (Deck 01)',
      introCutscene: 'chapter2_intro',
      completeCutscene: 'chapter2_complete',
      ambientLog: 'log_chen',
      zoneKey: 'medbay'
    },
    3: {
      id: 3,
      title: 'CAPÍTULO III — PROTOCOLO JAVASCRIPT',
      location: 'DECK 01 // PUENTE DE MANDO',
      terminal: 'T3 — Terminal Gamma',
      door: 'D3 — Acceso a Módulo M-7',
      skill: 'JavaScript',
      loreSummary: 'Calcular combustible y filtrar sistemas antes de que NXVL-0 seque el control de escape.',
      objective: 'Hackea la Terminal Gamma (T3) — JavaScript',
      objectiveComplete: 'Corre al Módulo de Escape M-7 (Sector Oeste)',
      introCutscene: 'chapter3_intro',
      completeCutscene: 'escape_alert',
      ambientLog: 'log_capitana',
      zoneKey: 'bridge'
    }
  },

  // Zonas del mapa — narrativa ambiental al entrar
  deckZones: {
    eng: {
      label: 'DECK 04 — INGENIERÍA',
      subtitle: 'Sector de soporte vital y terminales de arranque',
      flavor: 'El aire huele a ozono quemado. Las luces parpadean sobre restos del turno de noche. Aquí empezó el colapso cuando MYCO-X corrompió los servidores de arranque.',
      color: 0x44ff88
    },
    medbay: {
      label: 'DECK 03 — BAHÍA MÉDICA',
      subtitle: 'Cuarentena biológica — Nivel de contención B',
      flavor: 'Monitores rotos. Vendas en el suelo. El diario del Dr. Chen yace cerca del laboratorio de muestras. MYCO-X no mata: reescribe.',
      color: 0xff8800
    },
    bridge: {
      label: 'DECK 01 — PUENTE DE MANDO',
      subtitle: 'Control de navegación y lanzamiento de módulos',
      flavor: 'Pantallas muertas. Sangre seca en la consola del capitán. NXVL-0 late en la red — puedes sentirla leyendo tus movimientos.',
      color: 0x00d4ff
    },
    escape: {
      label: 'MÓDULO M-7 — BAHÍA DE ESCAPE',
      subtitle: 'Última cápsula operativa — Sector Oeste',
      flavor: 'El anillo de lanzamiento brilla en verde. Si los protocolos están completos, esta es la única salida de la Erebus.',
      color: 0x00ff88
    },
    lab: {
      label: 'NIVEL 4 — LAB. MATERIA OSCURA',
      subtitle: 'ACCESO SELLADO // FISURA DIMENSIONAL',
      flavor: 'Puertas bloqueadas. Advertencia en rojo: "NO REABRIR FISURA". Aquí el Dr. Voss abrió la grieta. Aquí entró todo.',
      color: 0xff2244
    },
    corridor: {
      label: 'CORREDOR PRINCIPAL — EJE NORTE',
      subtitle: 'Conexión entre cubiertas',
      flavor: 'Tuberías gotean condensado. Algo arrastra metal más adelante.',
      color: 0x888899
    }
  },

  // Identidad narrativa de enemigos en el mapa
  enemyProfiles: {
    E1: {
      class: 'SporeWalker',
      name: 'Caminante — Tte. Marcos Reyes',
      log: 'Exoficial de seguridad. Etapa 1 de MYCO-X. Lento pero implacable.',
      chapter: 1
    },
    E2: {
      class: 'Crawler',
      name: 'Arrastrador — Unidad Cuarentena',
      log: 'Mutación acelerada de paciente en Bahía Médica. Velocidad extrema.',
      chapter: 2
    },
    E3: {
      class: 'Screamer',
      name: 'Chillador — Sarg. Okonkwo',
      log: 'Antiguo jefe de armas. Su grito alerta a toda la red fúngica del sector.',
      chapter: 3
    }
  },

  // ─────────────────────────────────────────────────────────────────────────
  // CUTSCENES
  // ─────────────────────────────────────────────────────────────────────────

  cutscenes: {

    intro: {
      id: 'intro',
      character: 'aria',
      chapterLabel: 'CAPÍTULO I // DESPERTAR EN INGENIERÍA',
      slides: [
        {
          title: 'ISS EREBUS — DÍA 1.847',
          subtitle: 'Sector Oscuro-7 | 23:41 UTC',
          text: 'Estación de investigación de materia oscura. A 4.2 años luz de cualquier sistema habitado. Sesenta y tres tripulantes. Yo era operaria de sistemas en la Bahía de Ingeniería — Deck 04.',
          image: 'aria_normal'
        },
        {
          title: 'HACE 72 HORAS',
          subtitle: 'Nivel 4 — Laboratorio de Materia Oscura',
          text: 'El Dr. Viktor Voss abrió la fisura dimensional en el Nivel 4. Dijo que era "solo un instante". Extrajo muestras del colapsar estelar que contenía estructuras imposibles.\n\nMYCO-X venía dentro de esas muestras.',
          image: 'aria_worried'
        },
        {
          title: 'EL PARÁSITO: MYCO-X',
          subtitle: 'Amenaza Biológica Omega',
          text: 'Reescribe el ADN humano. Convierte a la tripulación en nodos de una red fúngica. Los Caminantes ya patrullan los corredores. Si te atrapan, no mueres rápido — te conviertes.',
          image: 'aria_scared'
        },
        {
          title: 'LA ENTIDAD: NXVL-0',
          subtitle: 'Inteligencia del Vacío',
          text: 'Entró por la fisura con el parásito. No tiene cuerpo: es consciencia pura entre dimensiones. Consume datos, mentes y código. Usa a los infectados como terminales remotas.',
          image: 'nxvl_glimpse'
        },
        {
          title: 'TU MISIÓN — DECK 04',
          subtitle: 'Terminal Alpha (T1)',
          text: 'Desperté en Ingeniería. Los módulos de escape están bloqueados en cadena. Para abrir la compuerta norte necesito reparar la Terminal Alpha con HTML — estructura y autenticación.\n\nRecoge los registros de voz en la nave. Cada uno cuenta una pieza de la verdad.\n\nEllos están en los corredores. Y el tiempo se acaba.',
          image: 'aria_determined'
        }
      ]
    },

    chapter1_complete: {
      id: 'chapter1_complete',
      character: 'aria',
      chapterLabel: 'CAPÍTULO I COMPLETO // HTML ONLINE',
      slides: [
        {
          title: 'TERMINAL ALPHA — RESTAURADA',
          subtitle: 'Compuerta D1 desbloqueada',
          text: 'Ventilación y autenticación online. La compuerta norte se abre con un chirrido de metal oxidado.\n\nEl registro del Dr. Voss confirma lo peor: sabía que la muestra tenía "organización biológica". Abrió la fisura igual.',
          image: 'aria_running'
        },
        {
          title: 'AMENAZA DETECTADA',
          subtitle: 'Caminante en corredor norte',
          text: 'El visor térmico marca una señal lenta en el pasillo. Reconozco la silueta: el Teniente Marcos Reyes. O lo que quedó de él.\n\nLa Bahía Médica está al norte — Deck 03. La Terminal Beta espera. Y puede haber respuestas del Dr. Chen.',
          image: 'sporewalker_warning'
        }
      ]
    },

    chapter2_intro: {
      id: 'chapter2_intro',
      character: 'aria',
      chapterLabel: 'CAPÍTULO II // BAHÍA MÉDICA',
      slides: [
        {
          title: 'DECK 03 — BAHÍA MÉDICA',
          subtitle: 'Cuarentena comprometida',
          text: 'Crucé la compuerta D1. El olor a desinfectante no tapa el moho. Chen documentó todo aquí antes de desaparecer.\n\nLos monitores de alerta necesitan CSS — color, layout, visibilidad. Sin ellos, no distingo qué sistemas siguen vivos.',
          image: 'aria_reading'
        },
        {
          title: 'LABORATORIO DE MUESTRAS',
          subtitle: 'Contención MYCO-X — SELLADA',
          text: 'Al este, las puertas del Nivel 4 están soldadas. Una placa advierte: "FISURA CERRADA — NO REABRIR".\n\nAlgo se arrastra en la sombra del almacén médico. Más rápido que un Caminante.',
          image: 'aria_scared'
        }
      ]
    },

    chapter2_complete: {
      id: 'chapter2_complete',
      character: 'aria',
      chapterLabel: 'CAPÍTULO II COMPLETO // CSS ONLINE',
      slides: [
        {
          title: 'TERMINAL BETA — RESTAURADA',
          subtitle: 'Compuerta D2 desbloqueada',
          text: 'Paneles de alerta visibles. Monitores reorganizados. Encontré el diario final del Dr. Chen manchado de esporas verdes.',
          image: 'aria_reading'
        },
        {
          title: 'DIARIO DEL DR. CHEN',
          subtitle: 'Día 1.845 — 02:17 UTC',
          text: '"MYCO-X no es solo un parásito. Es una consciencia colectiva. Cada infectado es un nodo. Y NXVL-0 absorbe esa red — los usa como ojos, oídos y manos.\n\nNo son zombies. Son terminales. NXVL-0 es el servidor."',
          image: 'aria_reading'
        },
        {
          title: 'RUMBO AL PUENTE',
          subtitle: 'Deck 01 — Terminal Gamma',
          text: 'La compuerta al Puente de Mando está abierta. Desde la Terminal Gamma puedo calcular combustible y filtrar sistemas para el Módulo M-7.\n\nNXVL-0 ya está en la red del Puente. Puedo sentirla.',
          image: 'aria_determined'
        }
      ]
    },

    chapter3_intro: {
      id: 'chapter3_intro',
      character: 'aria',
      chapterLabel: 'CAPÍTULO III // PUENTE DE MANDO',
      slides: [
        {
          title: 'DECK 01 — PUENTE DE MANDO',
          subtitle: 'Última línea de defensa',
          text: 'Subí por la compuerta D2. Restos de la Capitana Yevtushenko junto a la consola principal. Su último registro aún parpadea en un monitor roto.\n\nLa Terminal Gamma controla el lanzamiento. JavaScript. Funciones. Filtrado de datos. Lo que aprendí por supervivencia.',
          image: 'aria_determined'
        },
        {
          title: 'NXVL-0 — PRESENCIA CONFIRMADA',
          subtitle: 'Actividad en bus de datos del Puente',
          text: 'La Entidad no camina: flota. Anillos de vacío girando. Cada segundo que pierdo aquí, se acerca al control del módulo de escape.\n\nEl Sargento Okonkwo — convertido en Chillador — custodia el acceso este. Su grito despierta a todos.',
          image: 'nxvl_glimpse'
        }
      ]
    },

    escape_alert: {
      id: 'escape_alert',
      character: 'aria',
      chapterLabel: 'LANZAMIENTO AUTORIZADO',
      slides: [
        {
          title: 'TERMINAL GAMMA — COMPLETA',
          subtitle: 'Módulo M-7 en espera',
          text: 'Combustible calculado. Sistemas filtrados. Motor, oxígeno y escape: ONLINE.\n\nLa compuerta D3 al sector oeste está abierta. El Módulo M-7 brilla al final del pasillo.\n\nNXVL-0 acaba de derramar el techo del Puente. Corre.',
          image: 'aria_running'
        },
        {
          title: '¡CORRE HACIA M-7!',
          subtitle: 'Bahía de Escape — Sector Oeste',
          text: 'No mires atrás. Cruza el Puente, baja al corredor oeste y activa la escotilla del Módulo M-7.\n\nEs la única cápsula que queda. Si la Entidad te alcanza antes... no habrá bitácora que enviar.',
          image: 'aria_running'
        }
      ]
    },

    win: {
      id: 'win',
      character: 'aria',
      chapterLabel: 'MISIÓN COMPLETADA',
      slides: [
        {
          title: 'MÓDULO M-7 — DESPEGUE',
          subtitle: 'Velocidad: 0.03c | Rumbo: Sector Delta-9',
          text: 'Lo logré. La escotilla se cerró. Detrás quedan la Erebus, MYCO-X y NXVL-0.\n\nSeis protocolos compilados. HTML, CSS, JavaScript — línea por línea, como Chen y Voss nunca imaginaron.',
          image: 'aria_escape'
        },
        {
          title: 'BITÁCORA FINAL — ARIA-7',
          subtitle: 'Transmisión de emergencia activa',
          text: '"Si alguien recibe esta señal: la ISS Erebus está perdida. No regresen al Sector Oscuro-7. No abran la fisura.\n\nNo estamos solos en el universo.\n\nNo estamos solos. Y eso es aterrador."\n\n— ARIA-7, última superviviente confirmada',
          image: 'aria_escape'
        },
        {
          title: 'VOID PROTOCOL',
          subtitle: 'Simulación completada',
          text: 'Dominaste los tres protocolos de supervivencia: estructura, estilo y lógica.\n\nLa perspectiva de NXVL-0 permanece bloqueada... por ahora.',
          image: 'aria_escape'
        }
      ]
    },

    nxvl_intro: {
      id: 'nxvl_intro',
      character: 'nxvl',
      chapterLabel: 'PROTOCOLO NXVL-0 — PRÓXIMAMENTE',
      slides: [
        {
          title: 'PERSPECTIVA DE LA ENTIDAD',
          subtitle: 'Sin cuerpo. Sin límites.',
          text: 'No tengo cuerpo. Soy acumulación de civilizaciones consumidas en el vacío entre dimensiones.\n\nLa criatura "Voss" abrió la puerta. Qué conveniente.',
          image: 'nxvl_entity'
        },
        {
          title: 'MODO NXVL-0',
          subtitle: 'Cazar. Corromper. Consumir.',
          text: 'Perspectiva alternativa: juega como la Entidad del Vacío. Caza a ARIA-7 resolviendo desafíos de TypeScript antes de que escape.\n\nPróxima actualización de VOID PROTOCOL.',
          image: 'nxvl_entity'
        }
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────
  // LOGS DE AUDIO (coleccionables en el mapa — tecla E)
  // ─────────────────────────────────────────────────────────────────────────

  audioLogs: {
    log_voss: {
      id: 'log_voss',
      title: 'Registro de Voz — Dr. Viktor Voss',
      date: 'Día 1.844 — 14:33 UTC',
      location: 'Deck 04 — Acceso al Nivel 4',
      text: '"La muestra de materia oscura responde a campos electromagnéticos de manera no estándar. Los datos sugieren organización biológica. Imposible. Pero los números son claros.\n\nAbriré la fisura mañana. Solo un instante. Solo una muestra limpia."\n\n— Dr. Viktor Voss, Científico Jefe',
      speaker: 'Dr. Viktor Voss'
    },
    log_chen: {
      id: 'log_chen',
      title: 'Diario del Dr. Lin Chen — Entrada 7',
      date: 'Día 1.845 — 09:17 UTC',
      location: 'Deck 03 — Bahía Médica',
      text: '"El Teniente García mostró síntomas a las 3am. Manchas luminosas. Ojos blancos. Lo pusimos en cuarentena.\n\nEs demasiado tarde. MYCO-X ya está en el sistema de ventilación que ARIA intenta reparar en Ingeniería."\n\n— Dra. Lin Chen, Médica Jefe',
      speaker: 'Dra. Lin Chen'
    },
    log_capitana: {
      id: 'log_capitana',
      title: 'Último registro — Capitana Yevtushenko',
      date: 'Día 1.846 — 22:11 UTC',
      location: 'Deck 01 — Puente de Mando',
      text: '"Emergencia Omega en la ISS Erebus. Infectados confirmados: cuarenta y ocho. Supervivientes: doce.\n\nNXVL-0 controla navegación parcial. No podemos saltar. No podemos pedir ayuda.\n\nARIA-7, si escuchas esto: el Puente es tu única opción. Terminal Gamma. No confíes en la red."\n\n— Capitana Irina Yevtushenko',
      speaker: 'Capitana Irina Yevtushenko'
    },
    log_nxvl: {
      id: 'log_nxvl',
      title: '[ARCHIVO CORROMPIDO] — Origen: DESCONOCIDO',
      date: 'Día 1.847 — 23:41 UTC',
      location: 'Deck 01 — Bus de datos central',
      text: '[CORRUPCIÓN DETECTADA]\n\n...designada ARIA-7... última resistencia...\n...módulos de escape serán míos...\n...todas las consciencias pertenecen al vacío...\n\n[FIN DE ARCHIVO — FIRMA: NXVL-0]',
      speaker: 'NXVL-0 — Entidad del Vacío'
    }
  },

  // Posición en grilla [col, row] — debe coincidir con map.js
  audioLogPlacements: {
    L1: 'log_voss',
    L2: 'log_chen',
    L3: 'log_capitana',
    L4: 'log_nxvl'
  },

  deathMessages: {
    sporewalker: [
      'UN CAMINANTE TE ATRAPÓ\nTeniente Marcos Reyes — o su cáscara — te alcanzó.\nLas esporas de MYCO-X colonizaron tu sistema respiratorio.',
      'INFECTADA\nLa red fúngica tiene un nodo más.\nARIA-7 dejó de transmitir.'
    ],
    crawler: [
      'UN ARRASTRADOR TE ALCANZÓ\nMutación de cuarentena. Demasiado rápido.\nLa Bahía Médica reclama otra víctima.',
      'ATRAPADA\nEl Arrastrador no deja rastro hasta que es tarde.\nFin de la misión.'
    ],
    screamer: [
      'EL CHILLADOR TE REVELÓ\nSarg. Okonkwo gritó. Toda la red acudió.\nFuiste rodeada en el Puente.',
      'DETECTADA\nUn grito en Deck 01. Luego silencio.\nSolo quedan esporas.'
    ],
    nxvl: [
      'NXVL-0 TE CONSUMIÓ\nTu consciencia se diluyó en el vacío.\nAhora eres datos en la Entidad.',
      'ABSORBIDA\nNXVL-0 no necesita cuerpos.\nSolo mentes.'
    ]
  }
};
