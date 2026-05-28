# 📂 Soluciones y Respuestas de los Desafíos — VOID PROTOCOL

Este documento contiene las respuestas y el código necesario para resolver cada una de las terminales del juego, ordenadas por niveles.

---

## 🔌 CAPÍTULO 1 — HTML (Bahía de Ingeniería - Terminal Alpha T1)

### 1️⃣ Desafío 1: Estructura Base (`html_estructura`)
**Misión:** Escribir la estructura HTML fundamental del sistema operativo de emergencia de la Erebus.

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Sistema Erebus</title>
  </head>
  <body>
    <h1>EREBUS ONLINE</h1>
  </body>
</html>
```

---

### 2️⃣ Desafío 2: Formulario de Acceso (`html_formulario`)
**Misión:** Crear el formulario de autenticación de emergencia para desbloquear la compuerta de acceso.

```html
<form id="formulario-acceso">
  <input type="text" name="usuario" placeholder="ID de Tripulante">
  <input type="password" name="clave" placeholder="Clave de Acceso">
  <button type="submit">ACCEDER AL SISTEMA</button>
</form>
```

---

### 3️⃣ Desafío 3: Registro de Síntomas (`html_lista`)
**Misión:** Crear una lista desordenada con los síntomas clínicos detectados en el Teniente Reyes.

```html
<ul>
  <li>Esporas luminosas</li>
  <li>Pérdida de habla</li>
  <li>Fiebre fúngica</li>
</ul>
```

---

### 4️⃣ Desafío 4: Derivación Física (`html_enlaces`)
**Misión:** Crear un enlace de derivación de emergencia hacia la base de datos de la Bahía Médica.

```html
<a id="link-medico" href="#deck03">ACCEDER A MEDBAY</a>
```

---

## 🎨 CAPÍTULO 2 — CSS (Bahía Médica - Terminal Beta T2)

### 5️⃣ Desafío 5: Iluminación de Emergencia (`css_selectores`)
**Misión:** Restaurar el sistema de iluminación de paneles de alerta con estilos de color y tamaño.

```css
.panel-alerta {
  background-color: #cc0000;
  color: white;
  padding: 20px;
}

h1 {
  font-size: 2rem;
  color: #ff4444;
}
```

---

### 6️⃣ Desafío 6: Layout de Monitores (`css_layout`)
**Misión:** Usar Flexbox para reorganizar los paneles de signos vitales de la Bahía Médica.

```css
.monitores {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.monitor-item {
  width: 200px;
  border: 2px solid #00ff00;
  padding: 15px;
}
```

---

### 7️⃣ Desafío 7: Panel de Cuarentena (`css_colores`)
**Misión:** Cambiar los estilos del banner de advertencia de cuarentena biológica.

```css
.caution-banner {
  background-color: #ffcc00;
  color: #111122;
  border-radius: 4px;
}
```

---

### 8️⃣ Desafío 8: Alineación de Bio-Escáneres (`css_box_model`)
**Misión:** Ajustar el espaciado del componente de bio-escáner para calibrar el lector de huellas.

```css
.bio-scanner {
  padding: 12px;
  margin: 8px;
  border: 1px solid #ffaa00;
}
```

---

## ⚡ CAPÍTULO 3 — JavaScript (Puente de Mando - Terminal Gamma T3)

### 9️⃣ Desafío 9: Cálculo de Combustible (`js_funciones`)
**Misión:** Escribir una función que reciba el número de pasajeros y distancia y retorne el consumo de combustible multiplicado por un factor de seguridad de 2.5.

```javascript
function calcularCombustible(pasajeros, distancia) {
  return pasajeros * distancia * 2.5;
}
```

---

### 🔟 Desafío 10: Filtrado de Sistemas (`js_arrays`)
**Misión:** Filtrar la lista de sistemas contaminada por MYCO-X y devolver solo los que estén activos (no `'offline'`).

```javascript
function filtrarActivos(sistemas) {
  return sistemas.filter(function(sistema) {
    return sistema !== 'offline';
  });
}
```

---

### 1️⃣1️⃣ Desafío 11: Monitoreo de Latidos (`js_loops`)
**Misión:** Contar cuántos nodos biológicos (valores `true`) hay en el array de sensores activos.

```javascript
function contarNodosActivos(nodos) {
  let contador = 0;
  for (const nodo of nodos) {
    if (nodo === true) {
      contador++;
    }
  }
  return contador;
}
```

---

### 1️⃣2️⃣ Desafío 12: Análisis de Infección (`js_objetos`)
**Misión:** Validar el estado biométrico del tripulante. Si el nivel de infección es mayor o igual a 50, retornar `'CUARENTENA'`. Si es menor, retornar `'AUTORIZADO'`.

```javascript
function verificarInfeccion(tripulante) {
  if (tripulante.nivelInfeccion >= 50) {
    return 'CUARENTENA';
  } else {
    return 'AUTORIZADO';
  }
}
```

---

## 🚀 Resumen de Respuestas

| # | ID | Tipo | Respuesta clave |
|---|-----|------|-----------------|
| 1 | `html_estructura` | HTML | Estructura `<!DOCTYPE>`, `<html>`, `<head>`, `<body>`, `<h1>` |
| 2 | `html_formulario` | HTML | `<form id="formulario-acceso">` con inputs `text`, `password` y `button[type=submit]` |
| 3 | `html_lista` | HTML | `<ul>` con 3 `<li>`: "Esporas luminosas", "Pérdida de habla", "Fiebre fúngica" |
| 4 | `html_enlaces` | HTML | `<a id="link-medico" href="#deck03">ACCEDER A MEDBAY</a>` |
| 5 | `css_selectores` | CSS | `.panel-alerta` con `background-color: #cc0000` y `h1` con `font-size: 2rem` |
| 6 | `css_layout` | CSS | `.monitores` con `display: flex` y `.monitor-item` con `width: 200px` |
| 7 | `css_colores` | CSS | `.caution-banner` con `background-color: #ffcc00`, `color: #111122`, `border-radius: 4px` |
| 8 | `css_box_model` | CSS | `.bio-scanner` con `padding: 12px`, `margin: 8px`, `border: 1px solid #ffaa00` |
| 9 | `js_funciones` | JS | `function calcularCombustible(p, d) { return p * d * 2.5; }` |
| 10 | `js_arrays` | JS | `function filtrarActivos(sistemas) { return sistemas.filter(s => s !== 'offline'); }` |
| 11 | `js_loops` | JS | `function contarNodosActivos(nodos)` con bucle `for...of` contando `true` |
| 12 | `js_objetos` | JS | `function verificarInfeccion(t)` que evalúa `t.nivelInfeccion >= 50` |
