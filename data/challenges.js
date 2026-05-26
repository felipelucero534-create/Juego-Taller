// ═══════════════════════════════════════════════════════════════════════════
// VOID PROTOCOL — data/challenges.js
// Definición de todos los desafíos de programación del juego
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
    totalSteps: 2,
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
<!-- ╚═══════════════════════════════════════╝ -->

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
    totalSteps: 2,
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
    successMessage: '✅ AUTENTICACIÓN CARGADA — Puerta norte desbloqueada. Puedes avanzar a la Bahía Médica.',
    failMessages: [
      'ERROR: Formulario incompleto. Sistema rechazó la autenticación.',
      'ERROR: Faltan campos requeridos en el formulario.',
      'ERROR: El tipo de input no coincide con el protocolo de seguridad.'
    ],
    manualRefs: ['html_formularios', 'html_inputs', 'html_atributos']
  },

  // ─────────────────────────────────────────────────────────────────────────
  // CAPÍTULO 2 — CSS (Bahía Médica)
  // ─────────────────────────────────────────────────────────────────────────

  'css_selectores': {
    id: 'css_selectores',
    terminalId: 'T2',
    chapter: 2,
    step: 1,
    totalSteps: 2,
    type: 'css',
    title: 'PROTOCOLO-03 // ILUMINACIÓN DE EMERGENCIA',
    story: [
      'ARIA-7 — Registro de voz 003:',
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
    totalSteps: 2,
    type: 'css',
    title: 'PROTOCOLO-04 // LAYOUT DE MONITORES',
    story: [
      'ARIA-7 — Registro de voz 004:',
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
    successMessage: '✅ LAYOUT FLEXBOX CARGADO — Monitores reorganizados. Puerta sur desbloqueada.',
    failMessages: [
      'ERROR: Flexbox no inicializado. ¿Olvidaste display: flex?',
      'ERROR: Alineación incorrecta. Revisa justify-content y align-items.',
      'ERROR: Las dimensiones del monitor-item no coinciden con el protocolo.'
    ],
    manualRefs: ['css_flexbox', 'css_box_model', 'css_propiedades']
  },

  // ─────────────────────────────────────────────────────────────────────────
  // CAPÍTULO 3 — JavaScript (Puente de Mando)
  // ─────────────────────────────────────────────────────────────────────────

  'js_funciones': {
    id: 'js_funciones',
    terminalId: 'T3',
    chapter: 3,
    step: 1,
    totalSteps: 2,
    type: 'js',
    title: 'PROTOCOLO-05 // CÁLCULO DE COMBUSTIBLE',
    story: [
      'ARIA-7 — Registro de voz 005:',
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
    totalSteps: 2,
    type: 'js',
    title: 'PROTOCOLO-06 // FILTRADO DE SISTEMAS',
    story: [
      'ARIA-7 — Registro de voz 006:',
      '"Un paso más. Solo necesito identificar qué sistemas siguen activos para priorizar la energía de los módulos de escape."',
      '"La lista de sistemas está contaminada. MYCO-X corrompió los registros y mezcló los sistemas funcionales con entradas marcadas como "offline". Tengo que filtrar manualmente."',
      '"Si funciona... si el módulo de escape se activa... puede que salga de la Erebus."',
      '"Hay algo en la puerta detrás de mí. Es grande. Más grande que un Caminante."',
      '"Rápido. Tengo que terminar esto AHORA."'
    ],
    description: `<strong>MISIÓN FINAL:</strong> Filtrar los sistemas activos para el lanzamiento.

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
    successMessage: '✅ SISTEMAS FILTRADOS — Motor: OK | Oxígeno: OK | Escape: ONLINE. ¡LANZAMIENTO AUTORIZADO!',
    failMessages: [
      'ERROR: filtrarActivos no existe o retorna un resultado incorrecto.',
      'ERROR: El array resultante contiene elementos "offline".',
      'ERROR: La función debe retornar un array, no un valor primitivo.'
    ],
    manualRefs: ['js_arrays', 'js_metodos_array', 'js_funciones']
  }
};

// Orden de desafíos por terminal
window.TERMINAL_SEQUENCE = {
  'T1': ['html_estructura', 'html_formulario'],
  'T2': ['css_selectores', 'css_layout'],
  'T3': ['js_funciones', 'js_arrays']
};
