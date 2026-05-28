// ═══════════════════════════════════════════════════════════════════════════
// VOID PROTOCOL — data/challenges.js
// Definición de todos los desafíos de programación del juego (12 desafíos en total)
// ═══════════════════════════════════════════════════════════════════════════

window.CHALLENGES = {

  // ─────────────────────────────────────────────────────────────────────────
  // CAPÍTULO 1 — HTML (Bahía de Ingeniería)
  // ─────────────────────────────────────────────────────────────────────────

  'html_estructura': {
    id: 'html_estructura',
    terminalId: 'T1',
    chapter: 1,
    step: 1,
    totalSteps: 4,
    type: 'html',
    title: 'PROTOCOLO-01 // ESTRUCTURA BASE',
    story: [
      'ARIA-7 — Registro de voz 001:',
      '"Los registros de arranque de la Terminal Alpha están corruptos. El parásito MYCO-X destruyó la memoria de arranque cuando el Dr. Voss abrió la fisura."',
      '"Tengo que reescribir la estructura HTML fundamental desde cero. Sin ella, el sistema operativo de emergencia no puede inicializar. Y sin ese sistema... las puertas permanecen selladas."',
      '"Están golpeando las paredes. Escucho cuatro de ellos en el corredor este. Tengo que ser rápida."'
    ],
    description: `<strong>MISIÓN:</strong> Reinicializar el sistema operativo de emergencia de la Erebus.

Escribe la estructura HTML base que necesita el sistema:
<ul>
  <li>La declaración <code>&lt;!DOCTYPE html&gt;</code></li>
  <li>La etiqueta raíz <code>&lt;html&gt;</code></li>
  <li>Una sección <code>&lt;head&gt;</code> con <code>&lt;title&gt;Sistema Erebus&lt;/title&gt;</code></li>
  <li>Una sección <code>&lt;body&gt;</code> con un título <code>&lt;h1&gt;EREBUS ONLINE&lt;/h1&gt;</code></li>
</ul>`,
    template: `<!-- ╔═══════════════════════════════════════╗ -->
<!-- ║  TERMINAL ALPHA — ISS EREBUS           ║ -->
<!-- ║  Estado: CORRUPCION CRITICA            ║ -->
// ╚═══════════════════════════════════════╝

<!-- Escribe tu código HTML aquí -->
`,
    requires: [
      '<!doctype html>',
      '<html',
      '<head',
      '<title>sistema erebus</title>',
      '<body',
      '<h1>erebus online</h1>'
    ],
    hint: 'Un documento HTML tiene esta estructura:\n\n<!DOCTYPE html>\n<html>\n  <head>\n    <title>Título</title>\n  </head>\n  <body>\n    <h1>Contenido</h1>\n  </body>\n</html>',
    successMessage: '✅ SISTEMA EREBUS ONLINE — Estructura base cargada correctamente.',
    failMessages: [
      'ERROR: Falta la declaración DOCTYPE.',
      'ERROR: El árbol HTML está incompleto.',
      'ERROR: El sistema no puede arrancar sin estructura base.'
    ],
    manualRefs: ['html_intro', 'html_estructura']
  },

  'html_formulario': {
    id: 'html_formulario',
    terminalId: 'T1',
    chapter: 1,
    step: 2,
    totalSteps: 4,
    type: 'html',
    title: 'PROTOCOLO-02 // FORMULARIO DE ACCESO',
    story: [
      'ARIA-7 — Registro de voz 002:',
      '"Sistema base cargado. Ahora necesito el módulo de autenticación. Las puertas de contención están en modo de bloqueo total — solo se abren con credenciales válidas."',
      '"El formulario de acceso tiene que tener los campos correctos. Si me equivoco, el sistema me expulsará y tendré que empezar de nuevo."',
      '"Uno de los infectados acaba de girar la esquina. Lo puedo ver por el visor. Es el Teniente Marcos... o lo que queda de él."'
    ],
    description: `<strong>MISIÓN:</strong> Crear el formulario de autenticación de emergencia.

El formulario debe contener:
<ul>
  <li>Un <code>&lt;form&gt;</code> con <code>id="formulario-acceso"</code></li>
  <li>Un <code>&lt;input type="text" name="usuario" placeholder="ID de Tripulante"&gt;</code></li>
  <li>Un <code>&lt;input type="password" name="clave" placeholder="Clave de Acceso"&gt;</code></li>
  <li>Un <code>&lt;button type="submit"&gt;ACCEDER AL SISTEMA&lt;/button&gt;</code></li>
</ul>`,
    template: `<!-- Formulario de Acceso de Emergencia — ISS Erebus -->
<!-- Escribe el formulario aquí -->

`,
    requires: [
      '<form',
      'id="formulario-acceso"',
      'type="text"',
      'name="usuario"',
      'type="password"',
      'name="clave"',
      '<button',
      'type="submit"',
      'acceder al sistema'
    ],
    hint: 'Un formulario HTML:\n\n<form id="mi-form">\n  <input type="text" name="usuario">\n  <input type="password" name="clave">\n  <button type="submit">Enviar</button>\n</form>',
    successMessage: '✅ AUTENTICACIÓN CARGADA — Protocolo inicializado.',
    failMessages: [
      'ERROR: Formulario incompleto. Sistema rechazó la autenticación.',
      'ERROR: Faltan campos requeridos en el formulario.',
      'ERROR: El tipo de input no coincide con el protocolo de seguridad.'
    ],
    manualRefs: ['html_formularios', 'html_inputs', 'html_atributos']
  },

  'html_lista': {
    id: 'html_lista',
    terminalId: 'T1',
    chapter: 1,
    step: 3,
    totalSteps: 4,
    type: 'html',
    title: 'PROTOCOLO-03 // REGISTRO DE SÍNTOMAS',
    story: [
      'ARIA-7 — Registro de voz 003:',
      '"Logré inicializar el formulario de acceso, pero el monitor médico de Ingeniería muestra que las esporas fúngicas se están esparciendo de forma agresiva por los conductos de ventilación."',
      '"Tengo que documentar una lista no ordenada de los síntomas detectados en el Teniente Reyes antes de que la memoria física se corrompa. Si no registro esto, el algoritmo médico de la nave no sabrá qué suero sintetizar."',
      '"Las esporas brillan en el aire... se sienten pesadas. Tengo miedo de respirar profundo. Debo apurarme."'
    ],
    description: `<strong>MISIÓN:</strong> Crear la lista de síntomas clínicos detectados para el diagnóstico.

El documento debe contener una lista desordenada con las etiquetas correctas:
<ul>
  <li>Una etiqueta contenedora de lista desordenada <code>&lt;ul&gt;</code></li>
  <li>Tres elementos de lista <code>&lt;li&gt;</code> con los siguientes textos exactos:
    <ul>
      <li><code>Esporas luminosas</code></li>
      <li><code>Pérdida de habla</code></li>
      <li><code>Fiebre fúngica</code></li>
    </ul>
  </li>
</ul>`,
    template: `<!-- Lista de Diagnóstico Clínico — ISS Erebus -->
<!-- Escribe la lista de síntomas aquí -->

`,
    requires: [
      '<ul',
      '<li>esporas luminosas</li>',
      '<li>pérdida de habla</li>',
      '<li>fiebre fúngica</li>',
      '</ul>'
    ],
    hint: 'Una lista desordenada en HTML se define usando <ul> y cada elemento dentro de ella usando <li>:\n\n<ul>\n  <li>Elemento 1</li>\n  <li>Elemento 2</li>\n</ul>',
    successMessage: '✅ SÍNTOMAS REGISTRADOS — El módulo de diagnóstico ha almacenado la secuencia fúngica.',
    failMessages: [
      'ERROR: Estructura de lista inválida. Use <ul> y <li>.',
      'ERROR: Faltan síntomas requeridos en la lista.',
      'ERROR: Texto de síntomas incorrecto. Asegúrese de escribir "Esporas luminosas", "Pérdida de habla" y "Fiebre fúngica".'
    ],
    manualRefs: ['html_etiquetas']
  },

  'html_enlaces': {
    id: 'html_enlaces',
    terminalId: 'T1',
    chapter: 1,
    step: 4,
    totalSteps: 4,
    type: 'html',
    title: 'PROTOCOLO-04 // DERIVACIÓN FÍSICA',
    story: [
      'ARIA-7 — Registro de voz 004:',
      '"La ventilación sigue atascada. Las esporas se están acumulando aquí. La única forma de despejar el Deck 04 es enlazar la terminal de Ingeniería directamente con la base de datos de la Bahía Médica."',
      '"Necesito un hipervínculo de derivación de emergencia. Tengo que apuntarlo al nodo de la Bahía Médica."',
      '"Algo está empujando la puerta desde el exterior... se escucha un chirrido metálico espantoso. ¡Tengo que terminar esta derivación ya!"'
    ],
    description: `<strong>MISIÓN:</strong> Crear un enlace de derivación a la Bahía Médica.

El enlace debe contener:
<ul>
  <li>Una etiqueta de enlace <code>&lt;a&gt;</code> con el atributo <code>id="link-medico"</code></li>
  <li>El atributo <code>href="#deck03"</code> para apuntar a la base de datos de la Bahía Médica (Deck 03)</li>
  <li>El texto dentro del enlace debe ser exactamente: <code>ACCEDER A MEDBAY</code></li>
</ul>`,
    template: `<!-- Enlace de Derivación de Emergencia — ISS Erebus -->
<!-- Escribe tu etiqueta de enlace aquí -->

`,
    requires: [
      '<a',
      'id="link-medico"',
      'href="#deck03"',
      'acceder a medbay',
      '</a>'
    ],
    hint: 'Un enlace en HTML usa la etiqueta <a> con el atributo href para la dirección:\n\n<a id="mi-id" href="#destino">Texto del Enlace</a>',
    successMessage: '✅ DERIVACIÓN COMPLETA — Puerta norte desbloqueada. El flujo de aire ha dispersado temporalmente las esporas.',
    failMessages: [
      'ERROR: El enlace debe usar la etiqueta <a>.',
      'ERROR: El atributo href debe apuntar exactamente a "#deck03".',
      'ERROR: El texto del enlace debe ser exactamente "ACCEDER A MEDBAY".'
    ],
    manualRefs: ['html_etiquetas', 'html_atributos']
  },

  // ─────────────────────────────────────────────────────────────────────────
  // CAPÍTULO 2 — CSS (Bahía Médica)
  // ─────────────────────────────────────────────────────────────────────────

  'css_selectores': {
    id: 'css_selectores',
    terminalId: 'T2',
    chapter: 2,
    step: 1,
    totalSteps: 4,
    type: 'css',
    title: 'PROTOCOLO-05 // ILUMINACIÓN DE EMERGENCIA',
    story: [
      'ARIA-7 — Registro de voz 005:',
      '"Llegué a la Bahía Médica. El Dr. Chen está... ya no está aquí. Encontré su diario. Escribió que MYCO-X no es solo un parásito: es una inteligencia distribuida."',
      '"Los sistemas de iluminación de emergencia están caídos. Sin ellos, los paneles de alerta no se pueden ver en la oscuridad. Necesito reprogramar los estilos CSS del sistema de alertas."',
      '"NXVL-0 está aquí también. Puedo sentirla. Una presencia en los sistemas de datos. Está leyendo los archivos del laboratorio de materia oscura."'
    ],
    description: `<strong>MISIÓN:</strong> Restaurar el sistema de iluminación de paneles de alerta.

Escribe las siguientes reglas CSS:
<ul>
  <li>Para <code>.panel-alerta</code>: <code>background-color: #cc0000</code>, <code>color: white</code>, y <code>padding: 20px</code></li>
  <li>Para <code>h1</code>: <code>font-size: 2rem</code> y <code>color: #ff4444</code></li>
</ul>`,
    template: `/* ╔════════════════════════════════════════╗ */
/* ║  ESTILOS DE EMERGENCIA — BAHÍA MÉDICA  ║ */
/* ╚════════════════════════════════════════╝ */

/* Escribe tus reglas CSS aquí */
`,
    requires: [
      '.panel-alerta',
      'background-color',
      '#cc0000',
      'color',
      'white',
      'padding',
      '20px',
      'h1',
      'font-size',
      '2rem',
      '#ff4444'
    ],
    hint: 'Una regla CSS:\n\n.clase {\n  propiedad: valor;\n}\n\nh1 {\n  font-size: 2rem;\n  color: #ff4444;\n}',
    successMessage: '✅ ILUMINACIÓN CSS RESTAURADA — Paneles de alerta online.',
    failMessages: [
      'ERROR: El selector no coincide con el protocolo.',
      'ERROR: Propiedad CSS no reconocida por el sistema.',
      'ERROR: Valor de color inválido. Use formato hexadecimal.'
    ],
    manualRefs: ['css_intro', 'css_selectores', 'css_propiedades', 'css_colores']
  },

  'css_layout': {
    id: 'css_layout',
    terminalId: 'T2',
    chapter: 2,
    step: 2,
    totalSteps: 4,
    type: 'css',
    title: 'PROTOCOLO-06 // LAYOUT DE MONITORES',
    story: [
      'ARIA-7 — Registro de voz 006:',
      '"Los monitores de signos vitales están desorganizados. La interfaz de monitoreo está rota — los datos se superponen. Sin orden visual, no puedo leer qué sistemas siguen activos."',
      '"Tengo que usar flexbox para reorganizar los paneles. Suena trivial. Pero en una emergencia, cada segundo que pierdo buscando información es un segundo que NXVL-0 usa para expandirse."',
      '"Cuatro Caminantes bloquearon la salida este. Hay otra ruta, pero pasa por el almacén... donde escuché algo moverse hace diez minutos."'
    ],
    description: `<strong>MISIÓN:</strong> Reorganizar los monitores de diagnóstico con Flexbox.

Escribe las siguientes reglas CSS:
<ul>
  <li>Para <code>.monitores</code>: <code>display: flex</code>, <code>justify-content: space-between</code>, <code>align-items: center</code>, <code>gap: 10px</code></li>
  <li>Para <code>.monitor-item</code>: <code>width: 200px</code>, <code>border: 2px solid #00ff00</code>, <code>padding: 15px</code></li>
</ul>`,
    template: `/* Layout de Monitores — Bahía Médica */
/* Escribe las reglas flexbox aquí */
`,
    requires: [
      '.monitores',
      'display',
      'flex',
      'justify-content',
      'space-between',
      'align-items',
      'center',
      'gap',
      '10px',
      '.monitor-item',
      'width',
      '200px',
      'border',
      'padding',
      '15px'
    ],
    hint: 'Flexbox:\n\n.contenedor {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: 10px;\n}\n\n.item {\n  width: 200px;\n}',
    successMessage: '✅ LAYOUT FLEXBOX CARGADO — Monitores alineados correctamente.',
    failMessages: [
      'ERROR: Flexbox no inicializado. ¿Olvidaste display: flex?',
      'ERROR: Alineación incorrecta. Revisa justify-content y align-items.',
      'ERROR: Las dimensiones del monitor-item no coinciden con el protocolo.'
    ],
    manualRefs: ['css_flexbox', 'css_box_model', 'css_propiedades']
  },

  'css_colores': {
    id: 'css_colores',
    terminalId: 'T2',
    chapter: 2,
    step: 3,
    totalSteps: 4,
    type: 'css',
    title: 'PROTOCOLO-07 // PANEL DE CUARENTENA',
    story: [
      'ARIA-7 — Registro de voz 007:',
      '"Logré ordenar los monitores, pero la pantalla principal de cuarentena biológica no es legible. El contraste de colores por defecto hace imposible leer los niveles de esporas en el ambiente."',
      '"Necesito cambiar el color del banner de advertencia para que brille en la oscuridad y resalte la alerta crítica."',
      '"Escucho susurros extraños que vienen de los altavoces de la Bahía Médica... no es estática, es como una voz distorsionada... NXVL-0 me está observando."'
    ],
    description: `<strong>MISIÓN:</strong> Cambiar los estilos del panel de advertencia de cuarentena.

Escribe una regla CSS para la clase <code>.caution-banner</code> que configure:
<ul>
  <li>Un color de fondo: <code>background-color: #ffcc00</code></li>
  <li>Un color de texto oscuro: <code>color: #111122</code></li>
  <li>Un redondeado de esquinas: <code>border-radius: 4px</code></li>
</ul>`,
    template: `/* Banner de Advertencia de Cuarentena — Bahía Médica */
/* Escribe tu regla CSS aquí */

`,
    requires: [
      '.caution-banner',
      'background-color',
      '#ffcc00',
      'color',
      '#111122',
      'border-radius',
      '4px'
    ],
    hint: 'Una regla CSS para una clase usa el prefijo punto (.) seguido del nombre de la clase:\n\n.mi-clase {\n  background-color: #ffcc00;\n  color: #111122;\n  border-radius: 4px;\n}',
    successMessage: '✅ PANEL DE CUARENTENA ACTUALIZADO — Lectura de esporas visible en pantalla.',
    failMessages: [
      'ERROR: Falta el selector de clase .caution-banner.',
      'ERROR: El color de fondo o el color de texto no coincide con los valores especificados.',
      'ERROR: Asegúrese de aplicar border-radius: 4px.'
    ],
    manualRefs: ['css_selectores', 'css_propiedades', 'css_colores']
  },

  'css_box_model': {
    id: 'css_box_model',
    terminalId: 'T2',
    chapter: 2,
    step: 4,
    totalSteps: 4,
    type: 'css',
    title: 'PROTOCOLO-08 // ALINEACIÓN DE BIO-ESCÁNERES',
    story: [
      'ARIA-7 — Registro de voz 008:',
      '"Los bio-escáneres están listos pero los paneles se superponen visualmente con el marco de la pantalla táctil de la terminal. Si no ajusto el espaciado interno y externo de las cajas, el escáner biológico fallará al procesar mis huellas."',
      '"Debo configurar el Box Model de los bio-escáneres para darles el tamaño y separación correctos."',
      '"Los pasos en la habitación de al lado se detuvieron... y ahora se escucha un jadeo pesado justo en el conducto sobre mi cabeza. ¡Rápido!"'
    ],
    description: `<strong>MISIÓN:</strong> Ajustar el espaciado del componente de bio-escáner.

Escribe una regla CSS para la clase <code>.bio-scanner</code> que configure:
<ul>
  <li>Un espaciado interno: <code>padding: 12px</code></li>
  <li>Un espaciado externo: <code>margin: 8px</code></li>
  <li>Un borde sólido naranja: <code>border: 1px solid #ffaa00</code></li>
</ul>`,
    template: `/* Caja del Bio-Escáner de Huellas — Bahía Médica */
/* Escribe tu regla CSS aquí */

`,
    requires: [
      '.bio-scanner',
      'padding',
      '12px',
      'margin',
      '8px',
      'border',
      '1px solid #ffaa00'
    ],
    hint: 'El modelo de caja CSS controla padding (espacio interno), margin (espacio externo) y border:\n\n.bio-scanner {\n  padding: 12px;\n  margin: 8px;\n  border: 1px solid #ffaa00;\n}',
    successMessage: '✅ BIO-ESCÁNER CALIBRADO — Acceso a la esclusa sur concedido. Puedes subir al Puente de Mando.',
    failMessages: [
      'ERROR: Selector .bio-scanner incorrecto.',
      'ERROR: Faltan propiedades del modelo de caja (padding, margin o border).',
      'ERROR: El borde debe ser "1px solid #ffaa00".'
    ],
    manualRefs: ['css_box_model', 'css_propiedades']
  },

  // ─────────────────────────────────────────────────────────────────────────
  // CAPÍTULO 3 — JavaScript (Puente de Mando)
  // ─────────────────────────────────────────────────────────────────────────

  'js_funciones': {
    id: 'js_funciones',
    terminalId: 'T3',
    chapter: 3,
    step: 1,
    totalSteps: 4,
    type: 'js',
    title: 'PROTOCOLO-09 // CÁLCULO DE COMBUSTIBLE',
    story: [
      'ARIA-7 — Registro de voz 009:',
      '"Llegué al Puente. Hay... restos del Capitán Yevtushenko. No quiero saber cómo murió."',
      '"El sistema de lanzamiento de módulos de escape está bloqueado por un protocolo de seguridad. Necesita calcular si hay combustible suficiente basándose en el número de pasajeros y la distancia al sector seguro más cercano."',
      '"Tengo que programar la función de cálculo manualmente. El sistema espera una función JavaScript específica. Una equivocación y el lanzamiento fallará."',
      '"NXVL-0 está en los servidores del Puente. Puedo ver sus procesos en el monitor. Está tratando de acceder al control de los módulos de escape antes que yo."'
    ],
    description: `<strong>MISIÓN:</strong> Programar el sistema de cálculo de combustible.

Crea una función llamada <code>calcularCombustible</code> que:
<ul>
  <li>Reciba dos parámetros: <code>pasajeros</code> y <code>distancia</code></li>
  <li>Retorne el resultado de: <code>pasajeros * distancia * 2.5</code></li>
</ul>
<strong>Ejemplo:</strong> <code>calcularCombustible(10, 100)</code> debe retornar <code>2500</code>`,
    template: `// Sistema de Cálculo de Combustible — ISS Erebus
// Escribe tu función aquí
`,
    testCode: 'return calcularCombustible(10, 100);',
    expectedResult: 2500,
    hint: 'Para crear una función en JavaScript:\n\nfunction nombreFuncion(param1, param2) {\n  return param1 * param2 * 2.5;\n}\n\n// Usa "return" para devolver el resultado',
    successMessage: '✅ FUNCIÓN DE COMBUSTIBLE CARGADA — Suficiente para el Sector Delta-9.',
    failMessages: [
      'ERROR: La función no existe o no retorna el valor correcto.',
      'ERROR: calcularCombustible(10, 100) debería retornar 2500.',
      'ERROR: Error de sintaxis en el código JavaScript.'
    ],
    manualRefs: ['js_funciones', 'js_variables', 'js_operadores']
  },

  'js_arrays': {
    id: 'js_arrays',
    terminalId: 'T3',
    chapter: 3,
    step: 2,
    totalSteps: 4,
    type: 'js',
    title: 'PROTOCOLO-10 // FILTRADO DE SISTEMAS',
    story: [
      'ARIA-7 — Registro de voz 010:',
      '"Un paso más. Solo necesito identificar qué sistemas siguen activos para priorizar la energía de los módulos de escape."',
      '"La lista de sistemas está contaminada. MYCO-X corrompió los registros y mezcló los sistemas funcionales con entradas marcadas como "offline". Tengo que filtrar manualmente."',
      '"Si funciona... si el módulo de escape se activa... puede que salga de la Erebus."',
      '"Hay algo en la puerta detrás de mí. Es grande. Más grande que un Caminante."',
      '"Rápido. Tengo que terminar esto AHORA."'
    ],
    description: `<strong>MISIÓN:</strong> Filtrar los sistemas activos para el lanzamiento.

Crea una función llamada <code>filtrarActivos</code> que:
<ul>
  <li>Reciba un array de strings llamado <code>sistemas</code></li>
  <li>Retorne un nuevo array con solo los elementos que <strong>NO</strong> sean igual a <code>'offline'</code></li>
</ul>
<strong>Ejemplo:</strong> <code>filtrarActivos(['motor', 'offline', 'oxigeno', 'offline', 'escape'])</code> debe retornar <code>['motor', 'oxigeno', 'escape']</code>`,
    template: `// Sistema de Filtrado de Recursos — ISS Erebus
// Escribe tu función aquí
`,
    testCode: `
const resultado = filtrarActivos(['motor', 'offline', 'oxigeno', 'offline', 'escape']);
return JSON.stringify(resultado) === JSON.stringify(['motor', 'oxigeno', 'escape']);
`,
    expectedResult: true,
    hint: 'Usa el método filter() de los arrays:\n\nfunction filtrarActivos(sistemas) {\n  return sistemas.filter(s => s !== "offline");\n}\n\nfilter() devuelve un nuevo array con los elementos que pasan la condición.',
    successMessage: '✅ SISTEMAS FILTRADOS — Lista de recursos de lanzamiento limpia.',
    failMessages: [
      'ERROR: filtrarActivos no existe o retorna un resultado incorrecto.',
      'ERROR: El array resultante contiene elementos "offline".',
      'ERROR: La función debe retornar un array, no un valor primitivo.'
    ],
    manualRefs: ['js_arrays', 'js_metodos_array', 'js_funciones']
  },

  'js_loops': {
    id: 'js_loops',
    terminalId: 'T3',
    chapter: 3,
    step: 3,
    totalSteps: 4,
    type: 'js',
    title: 'PROTOCOLO-11 // MONITOREO DE LATIDOS',
    story: [
      'ARIA-7 — Registro de voz 011:',
      '"Llegué a la terminal central del Puente. El sistema indica que hay señales de tripulantes registradas en los servidores, pero muchas son artificiales, creadas por la Entidad NXVL-0 para engañarme."',
      '"Tengo que contar cuántos de los nodos de sensores muestran señales de latidos biológicos activos (valores true) en la red local. Si hay demasiados falsos, los motores no iniciarán."',
      '"Puedo escuchar el zumbido eléctrico de la Entidad rodeando la consola... el aire está helado y mis manos tiemblan. Si fallo esta función, la red colapsará."'
    ],
    description: `<strong>MISIÓN:</strong> Escribir un algoritmo para contar los latidos de tripulantes activos.

Crea una función llamada <code>contarNodosActivos</code> que:
<ul>
  <li>Reciba un parámetro: un array de booleanos llamado <code>nodos</code></li>
  <li>Recorra el array y retorne el número total de elementos que sean estrictamente iguales a <code>true</code></li>
</ul>
<strong>Ejemplo:</strong> <code>contarNodosActivos([true, false, true, true, false])</code> debe retornar <code>3</code>`,
    template: `// Sistema de Monitoreo de Seguridad — ISS Erebus
// Escribe tu función aquí

`,
    testCode: 'return contarNodosActivos([true, false, true, true, false, true, false]);',
    expectedResult: 4,
    hint: 'Puedes usar un bucle "for...of" o un método como "filter":\n\nfunction contarNodosActivos(nodos) {\n  let contador = 0;\n  for (const nodo of nodos) {\n    if (nodo === true) contador++;\n  }\n  return contador;\n}',
    successMessage: '✅ MONITOREO COMPLETADO — Latidos biológicos verificados. Nodos seguros identificados.',
    failMessages: [
      'ERROR: La función contarNodosActivos no existe o no retorna el número correcto de nodos activos.',
      'ERROR: contarNodosActivos([true, false, true, true, false, true, false]) debería retornar 4.',
      'ERROR: Error de sintaxis en el código JavaScript.'
    ],
    manualRefs: ['js_funciones', 'js_loops', 'js_arrays']
  },

  'js_objetos': {
    id: 'js_objetos',
    terminalId: 'T3',
    chapter: 3,
    step: 4,
    totalSteps: 4,
    type: 'js',
    title: 'PROTOCOLO-12 // ANÁLISIS DE INFECCIÓN',
    story: [
      'ARIA-7 — Registro de voz 012:',
      '"Este es el último paso. La compuerta final del módulo de escape exige validar mi propio estado biométrico ante la computadora principal de lanzamiento."',
      '"La computadora lee un objeto con mi información médica. Debo crear la función de verificación final. Si mi nivel de infección por MYCO-X es menor a 50, me marcará como AUTORIZADO. De lo contrario, activará la cuarentena y quedaré atrapada en la Erebus para siempre."',
      '"Las alarmas están chillando en rojo. NXVL-0 acaba de romper el sello del Puente. ¡Está detrás de mí! ¡Tengo que compilar esto AHORA!"'
    ],
    description: `<strong>MISIÓN FINAL:</strong> Validar el objeto biométrico de la tripulación.

Crea una función llamada <code>verificarInfeccion</code> que:
<ul>
  <li>Reciba un objeto llamado <code>tripulante</code> (que tiene las propiedades <code>nombre</code> y <code>nivelInfeccion</code>)</li>
  <li>Si la propiedad <code>nivelInfeccion</code> es mayor o igual a <code>50</code>, retorne el texto <code>'CUARENTENA'</code></li>
  <li>De lo contrario (si es menor a 50), retorne el texto <code>'AUTORIZADO'</code></li>
</ul>
<strong>Ejemplo:</strong> <code>verificarInfeccion({nombre: 'Dr. Chen', nivelInfeccion: 60})</code> debe retornar <code>'CUARENTENA'</code>`,
    template: `// Filtro Biométrico de Lanzamiento — ISS Erebus
// Escribe tu función aquí

`,
    testCode: `
const t1 = verificarInfeccion({nombre: 'Marcos', nivelInfeccion: 85});
const t2 = verificarInfeccion({nombre: 'Aria', nivelInfeccion: 12});
return t1 === 'CUARENTENA' && t2 === 'AUTORIZADO';
`,
    expectedResult: true,
    hint: 'Accede a las propiedades de un objeto con la sintaxis de punto (.) y usa una condición if/else:\n\nfunction verificarInfeccion(tripulante) {\n  if (tripulante.nivelInfeccion >= 50) {\n    return "CUARENTENA";\n  } else {\n    return "AUTORIZADO";\n  }\n}',
    successMessage: '✅ AUTORIZACIÓN BIOMÉTRICA CONCEDIDA — Nivel de infección bajo límite crítico. ¡LANZAMIENTO DEL MÓDULO M-7 AUTORIZADO!',
    failMessages: [
      'ERROR: verificarInfeccion no existe o no retorna la cadena de texto correcta.',
      'ERROR: Nivel de infección >= 50 debe retornar "CUARENTENA" y < 50 debe retornar "AUTORIZADO".',
      'ERROR: Error de sintaxis en el código JavaScript.'
    ],
    manualRefs: ['js_funciones', 'js_objetos', 'js_condicionales']
  }
};

// Orden de desafíos por terminal
window.TERMINAL_SEQUENCE = {
  'T1': ['html_estructura', 'html_formulario', 'html_lista', 'html_enlaces'],
  'T2': ['css_selectores', 'css_layout', 'css_colores', 'css_box_model'],
  'T3': ['js_funciones', 'js_arrays', 'js_loops', 'js_objetos']
};
