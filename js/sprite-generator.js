/* ═══════════════════════════════════════════════════════════════════════════
   VOID PROTOCOL — js/sprite-generator.js
   Generador de sprites y texturas dinámicas para enemigos y elementos
   ═══════════════════════════════════════════════════════════════════════════ */

class SpriteGenerator {
  // Crea una textura visual para zombis infuriados (MYCO-X)
  static createZombieTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Fondo carne podrida
    ctx.fillStyle = '#4a2020';
    ctx.fillRect(0, 0, 256, 256);

    // Patrón de infección fúngica verde
    ctx.fillStyle = 'rgba(68, 255, 68, 0.6)';
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * 256;
      const y = Math.random() * 256;
      const size = Math.random() * 15 + 5;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Venas oscuras
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.lineWidth = 3;
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * 256, Math.random() * 256);
      for (let j = 0; j < 5; j++) {
        ctx.lineTo(
          Math.random() * 256,
          Math.random() * 256
        );
      }
      ctx.stroke();
    }

    // Puntos brillantes de infección
    ctx.fillStyle = '#00ff00';
    for (let i = 0; i < 30; i++) {
      const x = Math.random() * 256;
      const y = Math.random() * 256;
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
      
      // Glow
      ctx.strokeStyle = 'rgba(0, 255, 0, 0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  // Crea textura de puerta metálica
  static createDoorTexture(color) {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Fondo metálico
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, 128, 256);

    // Líneas de metal
    ctx.strokeStyle = 'rgba(100, 150, 200, 0.4)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 256; i += 20) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(128, i);
      ctx.stroke();
    }

    // Panel de color (puerta)
    const parsedColor = parseInt(color.substring(1), 16);
    const r = (parsedColor >> 16) & 255;
    const g = (parsedColor >> 8) & 255;
    const b = parsedColor & 255;

    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.7)`;
    ctx.fillRect(10, 20, 108, 216);

    // Bordes brillantes
    ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 1)`;
    ctx.lineWidth = 3;
    ctx.strokeRect(10, 20, 108, 216);

    // Luz de seguridad
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(64, 30, 6, 0, Math.PI * 2);
    ctx.fill();

    // Glow de luz
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.3)`;
    for (let i = 2; i < 15; i++) {
      ctx.beginPath();
      ctx.arc(64, 30, i, 0, Math.PI * 2);
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  // Crea textura para pantalla terminal
  static createTerminalScreenTexture(isActive = false) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    // Fondo de pantalla
    ctx.fillStyle = isActive ? '#001a00' : '#000000';
    ctx.fillRect(0, 0, 256, 128);

    if (isActive) {
      // Líneas de escaneo
      ctx.strokeStyle = 'rgba(0, 212, 255, 0.2)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 128; i += 4) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(256, i);
        ctx.stroke();
      }

      // Texto simulado
      ctx.fillStyle = '#00ff00';
      ctx.font = '10px monospace';
      ctx.fillText('> SISTEMA ACTIVO', 10, 20);
      ctx.fillText('> STATUS: OK', 10, 40);
      ctx.fillText('> ESPERANDO ENTRADA...', 10, 60);

      // Cursor parpadeante
      ctx.fillStyle = '#00d4ff';
      ctx.fillRect(140, 75, 8, 12);
    } else {
      // Pantalla negra
      ctx.fillStyle = '#003300';
      ctx.fillText('ERROR: NO SIGNAL', 10, 65);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  // Crea icono de UI para interfaz
  static createUIButton(text, color) {
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 60;
    const ctx = canvas.getContext('2d');

    // Fondo del botón
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.2;
    ctx.fillRect(0, 0, 200, 60);
    ctx.globalAlpha = 1.0;

    // Borde
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.strokeRect(2, 2, 196, 56);

    // Texto
    ctx.fillStyle = color;
    ctx.font = 'bold 14px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 100, 30);

    return canvas.toDataURL();
  }

  // Crea un indicador de salud visual
  static createHealthBar(percentage) {
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 20;
    const ctx = canvas.getContext('2d');

    // Fondo
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, 200, 20);

    // Borde
    ctx.strokeStyle = '#444444';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, 200, 20);

    // Barra de salud (color dinámico según porcentaje)
    let color;
    if (percentage > 60) {
      color = '#00ff88';
    } else if (percentage > 30) {
      color = '#ff8800';
    } else {
      color = '#ff2020';
    }

    ctx.fillStyle = color;
    ctx.fillRect(2, 2, (percentage / 100) * 196, 16);

    // Texto de porcentaje
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${Math.round(percentage)}%`, 100, 10);

    return canvas;
  }

  // Crea indicador de infección
  static createInfectionBar(percentage) {
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 20;
    const ctx = canvas.getContext('2d');

    // Fondo
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, 200, 20);

    // Borde
    ctx.strokeStyle = '#444444';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, 200, 20);

    // Barra de infección (verde oscuro a verde brillante)
    ctx.fillStyle = `rgb(68, 255, 68)`;
    ctx.globalAlpha = 0.3 + (percentage / 100) * 0.7;
    ctx.fillRect(2, 2, (percentage / 100) * 196, 16);
    ctx.globalAlpha = 1.0;

    // Efecto de pulso
    ctx.strokeStyle = 'rgba(68, 255, 68, 0.5)';
    ctx.lineWidth = 1;
    for (let i = 2; i < (percentage / 100) * 196; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i, 2);
      ctx.lineTo(i, 18);
      ctx.stroke();
    }

    // Texto
    ctx.fillStyle = '#44ff44';
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${Math.round(percentage)}%`, 100, 10);

    return canvas;
  }

  // Crea patrón de ruido para ambiente
  static createNoiseTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.createImageData(512, 512);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const noise = Math.random() * 255;
      data[i] = noise;
      data[i + 1] = noise;
      data[i + 2] = noise;
      data[i + 3] = 255;
    }

    ctx.putImageData(imageData, 0, 0);
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  // Crea panel de interfaz para HUD
  static createHUDPanel(title, content) {
    const div = document.createElement('div');
    div.className = 'hud-custom-panel';
    div.innerHTML = `
      <div class="hud-panel-header">${title}</div>
      <div class="hud-panel-content">${content}</div>
    `;
    return div;
  }

  // Genera un icono de terminal
  static createTerminalIcon() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    // Fondo
    ctx.fillStyle = '#001a00';
    ctx.fillRect(0, 0, 64, 64);

    // Borde
    ctx.strokeStyle = '#00d4ff';
    ctx.lineWidth = 2;
    ctx.strokeRect(4, 4, 56, 56);

    // Líneas de terminal
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 1;
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo(8, 16 + i * 12);
      ctx.lineTo(56, 16 + i * 12);
      ctx.stroke();
    }

    // Punto de cursor
    ctx.fillStyle = '#00d4ff';
    ctx.beginPath();
    ctx.arc(56, 16, 2, 0, Math.PI * 2);
    ctx.fill();

    return canvas.toDataURL();
  }
}

window.SpriteGenerator = SpriteGenerator;
