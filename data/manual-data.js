// ═══════════════════════════════════════════════════════════════════════════
// VOID PROTOCOL — data/manual-data.js
// Contenido del Codex educativo (manual de programación para principiantes)
// ═══════════════════════════════════════════════════════════════════════════

window.MANUAL_DATA = {

  // ─────────────────────────────────────────────────────────────────────────
  // SECCIÓN HTML
  // ─────────────────────────────────────────────────────────────────────────

  sections: [
    {
      id: 'html',
      title: '🔴 HTML — Estructura',
      color: '#e55',
      icon: '&lt;/&gt;',
      entries: [
        {
          id: 'html_intro',
          title: '¿Qué es HTML?',
          content: `<p>HTML (<em>HyperText Markup Language</em>) es el <strong>lenguaje de estructura</strong> de toda página web. No es un lenguaje de programación — es un lenguaje de <em>marcado</em> que define qué hay en una página y cómo se organiza.</p>

<div class="manual-flavor">🚀 ARIA-7: "HTML es como el plano de arquitectura de la nave. Sin él, solo hay cables y metal sin forma. HTML da estructura al caos."</div>

<p>HTML usa <strong>etiquetas</strong> (tags) para marcar el contenido:</p>
<pre><code>&lt;h1&gt;Esto es un título&lt;/h1&gt;
&lt;p&gt;Esto es un párrafo.&lt;/p&gt;</code></pre>

<p>Cada etiqueta tiene una apertura <code>&lt;etiqueta&gt;</code> y un cierre <code>&lt;/etiqueta&gt;</code>.</p>`
        },
        {
          id: 'html_estructura',
          title: 'Estructura del Documento',
          content: `<p>Todo documento HTML sigue esta estructura base:</p>

<pre><code>&lt;!DOCTYPE html&gt;
&lt;html&gt;
  &lt;head&gt;
    &lt;title&gt;Título de la página&lt;/title&gt;
  &lt;/head&gt;
  &lt;body&gt;
    &lt;h1&gt;Contenido visible&lt;/h1&gt;
    &lt;p&gt;Un párrafo.&lt;/p&gt;
  &lt;/body&gt;
&lt;/html&gt;</code></pre>

<ul>
  <li><code>&lt;!DOCTYPE html&gt;</code> — Le dice al navegador que es HTML5</li>
  <li><code>&lt;html&gt;</code> — La raíz del documento</li>
  <li><code>&lt;head&gt;</code> — Información para el navegador (no visible)</li>
  <li><code>&lt;title&gt;</code> — El título que aparece en la pestaña del navegador</li>
  <li><code>&lt;body&gt;</code> — Todo el contenido visible de la página</li>
</ul>

<div class="manual-flavor">🚀 ARIA-7: "Sin DOCTYPE, el navegador entra en 'quirks mode' — un modo de compatibilidad antiguo que puede causar comportamientos impredecibles. Como volar sin instrumentos."</div>`
        },
        {
          id: 'html_etiquetas',
          title: 'Etiquetas Comunes',
          content: `<p>Las etiquetas HTML más utilizadas:</p>

<table>
  <tr><th>Etiqueta</th><th>Para qué sirve</th><th>Ejemplo</th></tr>
  <tr><td><code>&lt;h1&gt;</code>–<code>&lt;h6&gt;</code></td><td>Títulos (h1 = más grande)</td><td><code>&lt;h1&gt;Título&lt;/h1&gt;</code></td></tr>
  <tr><td><code>&lt;p&gt;</code></td><td>Párrafo de texto</td><td><code>&lt;p&gt;Texto...&lt;/p&gt;</code></td></tr>
  <tr><td><code>&lt;a&gt;</code></td><td>Enlace / hipervínculo</td><td><code>&lt;a href="url"&gt;Link&lt;/a&gt;</code></td></tr>
  <tr><td><code>&lt;img&gt;</code></td><td>Imagen (sin cierre)</td><td><code>&lt;img src="foto.png"&gt;</code></td></tr>
  <tr><td><code>&lt;div&gt;</code></td><td>Contenedor genérico</td><td><code>&lt;div&gt;...&lt;/div&gt;</code></td></tr>
  <tr><td><code>&lt;span&gt;</code></td><td>Contenedor en línea</td><td><code>&lt;span&gt;texto&lt;/span&gt;</code></td></tr>
  <tr><td><code>&lt;ul&gt;</code>/<code>&lt;li&gt;</code></td><td>Lista sin orden</td><td><code>&lt;ul&gt;&lt;li&gt;item&lt;/li&gt;&lt;/ul&gt;</code></td></tr>
  <tr><td><code>&lt;strong&gt;</code></td><td>Texto en negrita</td><td><code>&lt;strong&gt;importante&lt;/strong&gt;</code></td></tr>
  <tr><td><code>&lt;em&gt;</code></td><td>Texto en cursiva</td><td><code>&lt;em&gt;énfasis&lt;/em&gt;</code></td></tr>
</table>`
        },
        {
          id: 'html_atributos',
          title: 'Atributos',
          content: `<p>Los <strong>atributos</strong> añaden información o comportamiento a las etiquetas. Se escriben dentro de la etiqueta de apertura:</p>

<pre><code>&lt;etiqueta atributo="valor"&gt;contenido&lt;/etiqueta&gt;</code></pre>

<p>Atributos más comunes:</p>
<ul>
  <li><code>id</code> — Identificador único: <code>&lt;div id="mi-div"&gt;</code></li>
  <li><code>class</code> — Clase CSS: <code>&lt;p class="alerta"&gt;</code></li>
  <li><code>href</code> — URL de un enlace: <code>&lt;a href="https://ejemplo.com"&gt;</code></li>
  <li><code>src</code> — Fuente de imagen: <code>&lt;img src="foto.jpg"&gt;</code></li>
  <li><code>alt</code> — Texto alternativo: <code>&lt;img alt="descripción"&gt;</code></li>
  <li><code>placeholder</code> — Texto de ejemplo en inputs</li>
  <li><code>type</code> — Tipo de input o botón</li>
</ul>

<div class="manual-flavor">🚀 ARIA-7: "Los atributos son como los parámetros de configuración de un sistema. Sin ellos, la etiqueta existe pero no sabe cómo comportarse."</div>`
        },
        {
          id: 'html_formularios',
          title: 'Formularios',
          content: `<p>Los formularios permiten al usuario ingresar datos. Se crean con la etiqueta <code>&lt;form&gt;</code>:</p>

<pre><code>&lt;form id="mi-formulario" action="/procesar" method="POST"&gt;
  &lt;label for="nombre"&gt;Nombre:&lt;/label&gt;
  &lt;input type="text" id="nombre" name="nombre"&gt;
  
  &lt;label for="clave"&gt;Contraseña:&lt;/label&gt;
  &lt;input type="password" id="clave" name="clave"&gt;
  
  &lt;button type="submit"&gt;Enviar&lt;/button&gt;
&lt;/form&gt;</code></pre>

<ul>
  <li><code>&lt;form&gt;</code> — Contenedor del formulario</li>
  <li><code>&lt;label&gt;</code> — Etiqueta descriptiva para cada campo</li>
  <li><code>&lt;input&gt;</code> — Campo de entrada de datos</li>
  <li><code>&lt;button type="submit"&gt;</code> — Botón de envío</li>
</ul>`
        },
        {
          id: 'html_inputs',
          title: 'Tipos de Input',
          content: `<p>Los inputs cambian según su <code>type</code>:</p>

<table>
  <tr><th>type</th><th>Comportamiento</th></tr>
  <tr><td><code>text</code></td><td>Texto simple</td></tr>
  <tr><td><code>password</code></td><td>Oculta los caracteres</td></tr>
  <tr><td><code>email</code></td><td>Valida formato de email</td></tr>
  <tr><td><code>number</code></td><td>Solo números</td></tr>
  <tr><td><code>checkbox</code></td><td>Casilla marcable</td></tr>
  <tr><td><code>radio</code></td><td>Opción única entre varias</td></tr>
  <tr><td><code>submit</code></td><td>Botón que envía el form</td></tr>
  <tr><td><code>range</code></td><td>Deslizador</td></tr>
</table>

<pre><code>&lt;input type="text" name="user" placeholder="Escribe aquí..."&gt;
&lt;input type="password" name="pass" placeholder="Contraseña"&gt;
&lt;input type="number" name="edad" min="0" max="120"&gt;</code></pre>`
        }
      ]
    },

    // ─────────────────────────────────────────────────────────────────────
    // SECCIÓN CSS
    // ─────────────────────────────────────────────────────────────────────

    {
      id: 'css',
      title: '🟡 CSS — Estilos',
      color: '#ee4',
      icon: '{}',
      entries: [
        {
          id: 'css_intro',
          title: '¿Qué es CSS?',
          content: `<p>CSS (<em>Cascading Style Sheets</em>) es el lenguaje que controla <strong>cómo se ve</strong> el HTML. Sin CSS, todas las páginas web serían texto plano en blanco y negro.</p>

<div class="manual-flavor">🚀 ARIA-7: "Si HTML es el plano de la nave, CSS es el diseño de interiores. Los colores de alerta, las luces de emergencia, la disposición visual de los paneles... todo es CSS."</div>

<p>CSS conecta con HTML de tres formas:</p>
<ol>
  <li><strong>En un archivo externo</strong>: <code>&lt;link rel="stylesheet" href="estilos.css"&gt;</code></li>
  <li><strong>En el HTML</strong>: <code>&lt;style&gt; body { color: red; } &lt;/style&gt;</code></li>
  <li><strong>En línea</strong>: <code>&lt;p style="color: red;"&gt;</code></li>
</ol>
<p>Lo recomendado es usar un <strong>archivo externo</strong> separado.</p>`
        },
        {
          id: 'css_selectores',
          title: 'Selectores CSS',
          content: `<p>Los selectores determinan <strong>a qué elementos HTML</strong> se aplican los estilos:</p>

<pre><code>/* Selector de etiqueta — aplica a TODOS los &lt;h1&gt; */
h1 {
  color: red;
}

/* Selector de clase — aplica a todos los elementos con class="alerta" */
.alerta {
  background-color: yellow;
}

/* Selector de ID — aplica al elemento con id="header" */
#header {
  font-size: 2rem;
}

/* Selector combinado — &lt;p&gt; dentro de .contenedor */
.contenedor p {
  margin: 10px;
}</code></pre>

<ul>
  <li><code>etiqueta</code> — Por nombre de etiqueta HTML</li>
  <li><code>.clase</code> — Por clase (el punto es obligatorio)</li>
  <li><code>#id</code> — Por ID (el # es obligatorio)</li>
</ul>`
        },
        {
          id: 'css_propiedades',
          title: 'Propiedades Comunes',
          content: `<p>Las propiedades CSS más utilizadas:</p>

<table>
  <tr><th>Propiedad</th><th>Para qué sirve</th><th>Ejemplo</th></tr>
  <tr><td><code>color</code></td><td>Color del texto</td><td><code>color: white;</code></td></tr>
  <tr><td><code>background-color</code></td><td>Color de fondo</td><td><code>background-color: #cc0000;</code></td></tr>
  <tr><td><code>font-size</code></td><td>Tamaño de letra</td><td><code>font-size: 16px;</code></td></tr>
  <tr><td><code>font-weight</code></td><td>Grosor de letra</td><td><code>font-weight: bold;</code></td></tr>
  <tr><td><code>margin</code></td><td>Espacio exterior</td><td><code>margin: 20px;</code></td></tr>
  <tr><td><code>padding</code></td><td>Espacio interior</td><td><code>padding: 10px;</code></td></tr>
  <tr><td><code>border</code></td><td>Borde</td><td><code>border: 2px solid red;</code></td></tr>
  <tr><td><code>border-radius</code></td><td>Esquinas redondeadas</td><td><code>border-radius: 5px;</code></td></tr>
  <tr><td><code>width</code>/<code>height</code></td><td>Dimensiones</td><td><code>width: 200px;</code></td></tr>
  <tr><td><code>text-align</code></td><td>Alineación de texto</td><td><code>text-align: center;</code></td></tr>
</table>`
        },
        {
          id: 'css_colores',
          title: 'Colores en CSS',
          content: `<p>CSS acepta colores en varios formatos:</p>

<pre><code>/* Nombre del color */
color: red;
color: white;
color: darkblue;

/* Hexadecimal (#RRGGBB) */
color: #ff0000;  /* rojo */
color: #00ff00;  /* verde */
color: #cc0000;  /* rojo oscuro */

/* RGB */
color: rgb(255, 0, 0);

/* RGBA (con transparencia) */
color: rgba(255, 0, 0, 0.5);  /* rojo semitransparente */</code></pre>

<div class="manual-flavor">🚀 ARIA-7: "En la Erebus usamos #cc0000 para todas las alertas críticas. El rojo comunica peligro universalmente. Incluso NXVL-0 lo reconoce."</div>`
        },
        {
          id: 'css_box_model',
          title: 'El Modelo de Caja (Box Model)',
          content: `<p>En CSS, cada elemento es una <strong>caja rectangular</strong> con 4 capas:</p>

<pre><code>+------------------------------------------+
|               MARGIN                      |
|  +------------------------------------+   |
|  |           BORDER                   |   |
|  |  +------------------------------+  |   |
|  |  |         PADDING              |  |   |
|  |  |  +-----------------------+   |  |   |
|  |  |  |      CONTENIDO        |   |  |   |
|  |  |  +-----------------------+   |  |   |
|  |  +------------------------------+  |   |
|  +------------------------------------+   |
+------------------------------------------+</code></pre>

<ul>
  <li><strong>margin</strong> — Espacio <em>fuera</em> del elemento (entre elementos)</li>
  <li><strong>border</strong> — El borde visible</li>
  <li><strong>padding</strong> — Espacio <em>dentro</em> del elemento (entre borde y contenido)</li>
  <li><strong>content</strong> — El contenido real (texto, imágenes, etc.)</li>
</ul>

<pre><code>.caja {
  margin: 20px;       /* 20px en todos los lados */
  border: 2px solid white;
  padding: 10px 20px; /* 10px arriba/abajo, 20px izquierda/derecha */
}</code></pre>`
        },
        {
          id: 'css_flexbox',
          title: 'Flexbox — Layout Moderno',
          content: `<p>Flexbox es el sistema de layout más poderoso y fácil de CSS. Actívalo con <code>display: flex</code>:</p>

<pre><code>/* El contenedor flex */
.contenedor {
  display: flex;
  
  /* Dirección */
  flex-direction: row;    /* izquierda a derecha (default) */
  flex-direction: column; /* arriba a abajo */
  
  /* Alineación horizontal */
  justify-content: flex-start;    /* al inicio */
  justify-content: center;        /* centrado */
  justify-content: flex-end;      /* al final */
  justify-content: space-between; /* espaciado entre elementos */
  justify-content: space-around;  /* espaciado alrededor */
  
  /* Alineación vertical */
  align-items: flex-start; /* arriba */
  align-items: center;     /* centrado verticalmente */
  align-items: flex-end;   /* abajo */
  
  /* Espacio entre elementos */
  gap: 10px;
}</code></pre>

<div class="manual-flavor">🚀 ARIA-7: "Flexbox salvó millones de horas de trabajo. Antes del flex, centrar algo verticalmente en CSS era un ejercicio de paciencia y sufrimiento."</div>`
        }
      ]
    },

    // ─────────────────────────────────────────────────────────────────────
    // SECCIÓN JAVASCRIPT
    // ─────────────────────────────────────────────────────────────────────

    {
      id: 'js',
      title: '🟢 JavaScript — Lógica',
      color: '#4e4',
      icon: 'JS',
      entries: [
        {
          id: 'js_intro',
          title: '¿Qué es JavaScript?',
          content: `<p>JavaScript (JS) es el lenguaje de <strong>programación</strong> de la web. Mientras HTML estructura y CSS decora, JavaScript hace que todo sea <em>interactivo y dinámico</em>.</p>

<div class="manual-flavor">🚀 ARIA-7: "Si HTML es el plano y CSS es el diseño... JavaScript es el sistema nervioso de la nave. Los motores, las puertas automáticas, los sensores, las respuestas a eventos. Todo eso es JavaScript."</div>

<p>JavaScript se ejecuta en el navegador, puede:</p>
<ul>
  <li>Responder a clics, teclas, movimientos del mouse</li>
  <li>Cambiar el contenido HTML dinámicamente</li>
  <li>Hacer peticiones a servidores</li>
  <li>Calcular, procesar, almacenar datos</li>
</ul>

<pre><code>// Esto es un comentario
console.log("Hola, mundo!"); // Imprime en la consola del navegador

// Cambiar el HTML
document.getElementById("titulo").textContent = "Nuevo título";</code></pre>`
        },
        {
          id: 'js_variables',
          title: 'Variables',
          content: `<p>Las variables almacenan datos en la memoria del programa:</p>

<pre><code>// "let" — variable que puede cambiar
let nombre = "ARIA-7";
let energia = 100;

// "const" — constante que NO cambia
const VELOCIDAD_LUZ = 299792458;
const NAVE = "ISS Erebus";

// "var" — versión antigua (evitar en código moderno)
var estado = "activo"; // No recomendado

// Los tipos de datos principales:
let texto = "Hola";          // string (texto)
let numero = 42;             // number
let decimal = 3.14;          // number (decimal)
let booleano = true;         // boolean (true/false)
let nulo = null;             // null (sin valor)
let indefinido = undefined;  // undefined (no asignado)</code></pre>

<div class="manual-flavor">🚀 ARIA-7: "Usa 'const' cuando sabes que el valor no va a cambiar — es más seguro. Usa 'let' cuando necesitas reasignar. Nunca uses 'var' en código nuevo."</div>`
        },
        {
          id: 'js_operadores',
          title: 'Operadores',
          content: `<p>Los operadores realizan operaciones sobre valores:</p>

<pre><code>// Operadores aritméticos
let suma = 10 + 5;      // 15
let resta = 10 - 5;     // 5
let mult = 10 * 5;      // 50
let div = 10 / 5;       // 2
let resto = 10 % 3;     // 1 (módulo)
let potencia = 2 ** 8;  // 256

// Operadores de comparación (devuelven true/false)
5 === 5  // true  (igual en valor Y tipo)
5 !== 3  // true  (distinto)
5 > 3    // true  (mayor que)
5 >= 5   // true  (mayor o igual)
5 < 10   // true  (menor que)

// Operadores lógicos
true && false  // false (AND — ambos deben ser true)
true || false  // true  (OR — al menos uno debe ser true)
!true          // false (NOT — invierte el booleano)

// Operadores de cadenas (strings)
"Hola" + " " + "ARIA"  // "Hola ARIA" (concatenación)
\`Energía: \${energia}%\`  // Template literal (moderno)</code></pre>`
        },
        {
          id: 'js_condicionales',
          title: 'Condicionales',
          content: `<p>Las condicionales ejecutan código según una condición:</p>

<pre><code>// if / else if / else
let energia = 45;

if (energia > 80) {
  console.log("Energía alta — sistemas nominales");
} else if (energia > 30) {
  console.log("Energía media — precaución");
} else {
  console.log("ALERTA: Energía crítica");
}

// Operador ternario (versión corta del if/else)
let estado = energia > 50 ? "OK" : "CRITICO";
// equivale a:
// if (energia > 50) { estado = "OK"; } else { estado = "CRITICO"; }

// switch — para múltiples casos
let zona = "bridge";

switch (zona) {
  case "engineering":
    console.log("Bahía de Ingeniería");
    break;
  case "medbay":
    console.log("Bahía Médica");
    break;
  case "bridge":
    console.log("Puente de Mando");
    break;
  default:
    console.log("Zona desconocida");
}</code></pre>`
        },
        {
          id: 'js_funciones',
          title: 'Funciones',
          content: `<p>Las funciones son bloques de código reutilizable:</p>

<pre><code>// Declaración de función tradicional
function saludar(nombre) {
  return "Bienvenida a bordo, " + nombre;
}

// Llamar a la función:
let mensaje = saludar("ARIA-7");
console.log(mensaje); // "Bienvenida a bordo, ARIA-7"

// Función con múltiples parámetros
function calcular(a, b, operacion) {
  if (operacion === "suma") return a + b;
  if (operacion === "resta") return a - b;
  if (operacion === "mult") return a * b;
  return 0;
}

let resultado = calcular(10, 5, "suma"); // 15

// Arrow function (función flecha) — sintaxis moderna
const multiplicar = (a, b) => a * b;
const cuadrado = n => n * n; // Un solo parámetro: sin paréntesis

// Si la función tiene varias líneas, necesita llaves y return
const calcularCombustible = (pasajeros, distancia) => {
  const base = pasajeros * distancia;
  return base * 2.5;
};</code></pre>

<div class="manual-flavor">🚀 ARIA-7: "Siempre nombra tus funciones con verbos que describan lo que hacen: 'calcular', 'filtrar', 'obtener'. El código es comunicación."</div>`
        },
        {
          id: 'js_arrays',
          title: 'Arrays (Listas)',
          content: `<p>Un array es una lista ordenada de elementos:</p>

<pre><code>// Crear un array
const sistemas = ['motor', 'oxigeno', 'escape', 'offline'];

// Acceder por índice (empieza en 0)
console.log(sistemas[0]); // 'motor'
console.log(sistemas[2]); // 'escape'

// Longitud del array
console.log(sistemas.length); // 4

// Agregar al final
sistemas.push('comunicaciones');

// Eliminar el último
sistemas.pop();

// Verificar si contiene un valor
sistemas.includes('escape'); // true

// Recorrer con for...of
for (const sistema of sistemas) {
  console.log(sistema);
}

// Recorrer con forEach
sistemas.forEach((sistema, indice) => {
  console.log(indice + ": " + sistema);
});</code></pre>`
        },
        {
          id: 'js_metodos_array',
          title: 'Métodos de Array',
          content: `<p>Los arrays tienen métodos poderosos integrados:</p>

<pre><code>const sistemas = ['motor', 'offline', 'oxigeno', 'offline', 'escape'];

// filter() — filtra elementos según una condición
const activos = sistemas.filter(s => s !== 'offline');
// ['motor', 'oxigeno', 'escape']

// map() — transforma cada elemento
const mayusculas = sistemas.map(s => s.toUpperCase());
// ['MOTOR', 'OFFLINE', 'OXIGENO', 'OFFLINE', 'ESCAPE']

// find() — encuentra el primer elemento que cumple la condición
const primeroActivo = sistemas.find(s => s !== 'offline');
// 'motor'

// some() — ¿algún elemento cumple la condición?
const hayOffline = sistemas.some(s => s === 'offline'); // true

// every() — ¿todos los elementos cumplen la condición?
const todosActivos = sistemas.every(s => s !== 'offline'); // false

// reduce() — acumula un valor
const numeros = [1, 2, 3, 4, 5];
const suma = numeros.reduce((acum, n) => acum + n, 0); // 15</code></pre>

<div class="manual-flavor">🚀 ARIA-7: "filter(), map() y reduce() son las tres herramientas más poderosas de JavaScript. Con ellas puedes resolver el 80% de los problemas de datos."</div>`
        },
        {
          id: 'js_objetos',
          title: 'Objetos',
          content: `<p>Los objetos agrupan datos relacionados en pares clave-valor:</p>

<pre><code>// Crear un objeto
const tripulante = {
  nombre: "ARIA-7",
  cargo: "Operaria de Sistemas",
  energia: 85,
  infectada: false
};

// Acceder a propiedades
console.log(tripulante.nombre);     // "ARIA-7"
console.log(tripulante["cargo"]);   // "Operaria de Sistemas"

// Modificar propiedades
tripulante.energia = 60;
tripulante.zona = "engineering"; // Agregar nueva propiedad

// Métodos (funciones dentro de objetos)
const nave = {
  nombre: "ISS Erebus",
  velocidad: 0.03, // en c (velocidad de la luz)
  
  calcularTiempo(distancia) {
    return distancia / this.velocidad;
  }
};

console.log(nave.calcularTiempo(10)); // 333.33...</code></pre>`
        },
        {
          id: 'js_loops',
          title: 'Bucles (Loops)',
          content: `<p>Los bucles repiten código mientras se cumpla una condición:</p>

<pre><code>// for — cuando sabes cuántas veces iterar
for (let i = 0; i &lt; 5; i++) {
  console.log("Iteración " + i);
}
// Imprime: 0, 1, 2, 3, 4

// while — mientras se cumpla la condición
let energia = 100;
while (energia &gt; 0) {
  energia -= 10;
  console.log("Energía: " + energia);
}
// Imprime: 90, 80, 70... hasta 0

// do...while — se ejecuta al menos una vez
do {
  console.log("Revisando sistemas...");
  energia -= 10;
} while (energia &gt; 50);

// for...of — recorrer arrays
const zonas = ['engineering', 'medbay', 'bridge'];
for (const zona of zonas) {
  console.log("Verificando: " + zona);
}</code></pre>

<div class="manual-flavor">⚠️ ARIA-7: "Cuidado con los bucles infinitos — si la condición nunca es false, el programa se cuelga. Como el motor de la Erebus en modo de fusión: sin freno, todo explota."</div>`
        }
      ]
    },

    // ─────────────────────────────────────────────────────────────────────
    // SECCIÓN TYPESCRIPT
    // ─────────────────────────────────────────────────────────────────────

    {
      id: 'ts',
      title: '🔵 TypeScript — Tipos',
      color: '#48f',
      icon: 'TS',
      entries: [
        {
          id: 'ts_intro',
          title: '¿Qué es TypeScript?',
          content: `<p>TypeScript es JavaScript con <strong>tipos estáticos</strong>. El código TypeScript se compila (transpila) a JavaScript normal antes de ejecutarse en el navegador.</p>

<div class="manual-flavor">🚀 ARIA-7: "TypeScript es el protocolo de verificación de la nave. Antes de despegar, el sistema comprueba que cada variable tenga el tipo correcto. Menos sorpresas en el vacío."</div>

<p>Ventajas principales:</p>
<ul>
  <li>Detecta errores antes de ejecutar el código</li>
  <li>Autocompletado más preciso en el editor</li>
  <li>Documentación implícita mediante tipos</li>
  <li>100% compatible con JavaScript existente</li>
</ul>

<pre><code>// JavaScript
let energia = 100;

// TypeScript — declaramos el tipo explícitamente
let energia: number = 100;
let nombre: string = "ARIA-7";
let activo: boolean = true;</code></pre>`
        },
        {
          id: 'ts_tipos_basicos',
          title: 'Tipos Básicos',
          content: `<p>Los tipos más comunes en TypeScript:</p>

<pre><code>// Primitivos
let texto: string = "Erebus";
let numero: number = 42;
let activo: boolean = false;

// Arrays tipados
let sistemas: string[] = ['motor', 'oxigeno', 'escape'];
let niveles: number[] = [100, 85, 60];

// Tuplas (array con tipos fijos por posición)
let coordenada: [number, number] = [12, 4];

// any — evitar cuando sea posible
let desconocido: any = "puede ser cualquier cosa";

// unknown — más seguro que any
let dato: unknown = recibirSensor();
if (typeof dato === "number") {
  console.log(dato * 2);
}</code></pre>`
        },
        {
          id: 'ts_interfaces',
          title: 'Interfaces',
          content: `<p>Las <strong>interfaces</strong> definen la forma de un objeto:</p>

<pre><code>interface Tripulante {
  nombre: string;
  cargo: string;
  energia: number;
  infectada?: boolean; // ? = propiedad opcional
}

const aria: Tripulante = {
  nombre: "ARIA-7",
  cargo: "Ingeniera de Soporte",
  energia: 85
};

function curar(tripulante: Tripulante, cantidad: number): void {
  tripulante.energia = Math.min(100, tripulante.energia + cantidad);
}</code></pre>

<div class="manual-flavor">🚀 ARIA-7: "Una interface es como la ficha técnica de un componente. Si falta un campo obligatorio, el compilador grita antes de que la puerta se abra."</div>`
        },
        {
          id: 'ts_funciones',
          title: 'Funciones Tipadas',
          content: `<p>En TypeScript puedes tipar parámetros y valores de retorno:</p>

<pre><code>// Parámetros y retorno tipados
function calcularOxigeno(pasajeros: number, horas: number): number {
  return pasajeros * horas * 0.84;
}

// Arrow function tipada
const filtrarActivos = (sistemas: string[]): string[] =&gt; {
  return sistemas.filter(s =&gt; s !== 'offline');
};

// Tipo de retorno void = no devuelve nada
function alertar(mensaje: string): void {
  console.log("[ALERTA] " + mensaje);
}</code></pre>`
        },
        {
          id: 'ts_enums',
          title: 'Enums y Union Types',
          content: `<p>Los <strong>enums</strong> agrupan constantes relacionadas. Los <strong>union types</strong> permiten varios tipos:</p>

<pre><code>// Enum — estados de la estación
enum EstadoSistema {
  Nominal = "NOMINAL",
  Alerta = "ALERTA",
  Critico = "CRITICO",
  Offline = "OFFLINE"
}

let estado: EstadoSistema = EstadoSistema.Alerta;

// Union type — puede ser uno de varios tipos
type Zona = "engineering" | "medbay" | "bridge" | "escape";

function irAZona(zona: Zona): void {
  console.log("Rumbo a: " + zona);
}

// Type alias para objetos complejos
type Terminal = {
  id: string;
  resuelta: boolean;
  desafio: string;
};</code></pre>`
        }
      ]
    }
  ]
};

