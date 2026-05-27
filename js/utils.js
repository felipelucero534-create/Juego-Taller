/* ═══════════════════════════════════════════════════════════════════════════
   VOID PROTOCOL — js/utils.js
   Funciones de utilidad: generadores de texturas procedurales y helpers
   ═══════════════════════════════════════════════════════════════════════════ */

window.UTILS = {
  // Genera un número aleatorio entre min y max
  rand: (min, max) => Math.random() * (max - min) + min,

  // Genera un entero aleatorio entre min y max
  randInt: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,

  // Calcula la distancia euclidiana entre dos puntos 2D
  dist2D: (x1, z1, x2, z2) => Math.sqrt((x2 - x1) ** 2 + (z2 - z1) ** 2),

  // Genera una textura canvas para paneles metálicos (paredes)
  createMetalWallTexture: () => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Fondo metalizado oscuro
    ctx.fillStyle = '#0f0f1c';
    ctx.fillRect(0, 0, 256, 256);

    // Grid de paneles
    ctx.strokeStyle = '#1e1e3f';
    ctx.lineWidth = 4;
    ctx.strokeRect(4, 4, 248, 248);
    ctx.strokeRect(4, 4, 120, 248);
    ctx.strokeRect(4, 128, 248, 4);

    // Remaches en las esquinas de los paneles
    ctx.fillStyle = '#2d2d5a';
    const rivets = [
      [12, 12], [116, 12], [140, 12], [244, 12],
      [12, 120], [116, 120], [140, 120], [244, 120],
      [12, 136], [116, 136], [140, 136], [244, 136],
      [12, 244], [116, 244], [140, 244], [244, 244]
    ];
    rivets.forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    });

    // Líneas de desgaste metálico / textura grunge
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 40; i++) {
      const y = Math.random() * 256;
      ctx.beginPath();
      ctx.moveTo(4, y);
      ctx.lineTo(252, y);
      ctx.stroke();
    }

    // Alguna franja de peligro industrial naranja/amarilla (opcional)
    ctx.fillStyle = 'rgba(255, 100, 0, 0.15)';
    ctx.beginPath();
    ctx.moveTo(10, 230);
    ctx.lineTo(30, 230);
    ctx.lineTo(20, 245);
    ctx.fill();

    return new THREE.CanvasTexture(canvas);
  },

  // Genera una textura de rejilla metálica para el suelo
  createFloorTexture: () => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    // Fondo acero oscuro
    ctx.fillStyle = '#07070f';
    ctx.fillRect(0, 0, 128, 128);

    // Dibujar rejillas
    ctx.fillStyle = '#111124';
    const size = 8;
    const gap = 4;
    for (let x = 4; x < 128; x += size + gap) {
      for (let y = 4; y < 128; y += size + gap) {
        ctx.fillRect(x, y, size, size);
        ctx.fillStyle = '#0c0c18';
        ctx.fillRect(x + 1, y + 1, size - 2, size - 2);
        ctx.fillStyle = '#111124'; // Reset
      }
    }

    // Bordes de placa
    ctx.strokeStyle = '#1d1d36';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, 126, 126);

    return new THREE.CanvasTexture(canvas);
  },

  // Genera una textura de techo con conductos de ventilación y luces
  createCeilingTexture: () => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Fondo
    ctx.fillStyle = '#0b0b14';
    ctx.fillRect(0, 0, 256, 256);

    // Conductos centrales
    ctx.fillStyle = '#18182d';
    ctx.fillRect(64, 0, 128, 256);

    // Rejilla de conducto
    ctx.fillStyle = '#06060c';
    for (let y = 8; y < 256; y += 16) {
      ctx.fillRect(72, y, 112, 6);
    }

    // Paneles a los lados
    ctx.strokeStyle = '#1e1e38';
    ctx.lineWidth = 3;
    ctx.strokeRect(4, 4, 248, 248);

    // Luz led central de la baldosa
    ctx.fillStyle = '#005577';
    ctx.fillRect(118, 118, 20, 20);
    const grad = ctx.createRadialGradient(128, 128, 2, 128, 128, 20);
    grad.addColorStop(0, '#00d4ff');
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(128, 128, 20, 0, Math.PI * 2);
    ctx.fill();

    return new THREE.CanvasTexture(canvas);
  },

  // Textura para puerta cerrada
  createDoorTexture: (colorHex = '#00d4ff') => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#121226';
    ctx.fillRect(0, 0, 256, 256);

    // Marco exterior
    ctx.strokeStyle = '#1f1f3d';
    ctx.lineWidth = 6;
    ctx.strokeRect(6, 6, 244, 244);

    // Estructura de puerta corrediza doble
    ctx.fillStyle = '#080816';
    ctx.fillRect(15, 15, 110, 226);
    ctx.fillRect(131, 15, 110, 226);

    ctx.strokeStyle = '#282852';
    ctx.lineWidth = 3;
    ctx.strokeRect(15, 15, 110, 226);
    ctx.strokeRect(131, 15, 110, 226);

    // Líneas cruzadas de refuerzo
    ctx.beginPath();
    ctx.moveTo(15, 15); ctx.lineTo(125, 241);
    ctx.moveTo(125, 15); ctx.lineTo(15, 241);
    ctx.moveTo(131, 15); ctx.lineTo(241, 241);
    ctx.moveTo(241, 15); ctx.lineTo(131, 241);
    ctx.stroke();

    // Símbolo / Luz central de estado de la compuerta
    const grad = ctx.createRadialGradient(128, 128, 2, 128, 128, 30);
    grad.addColorStop(0, colorHex);
    grad.addColorStop(0.3, colorHex);
    grad.addColorStop(1, 'transparent');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(128, 128, 30, 0, Math.PI * 2);
    ctx.fill();

    return new THREE.CanvasTexture(canvas);
  },

  // Genera textura de la criatura MYCO-X (zombi)
  createMycoTexture: () => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#1a2218';
    ctx.fillRect(0, 0, 256, 256);

    // Manchas de podredumbre
    for (let i = 0; i < 12; i++) {
      const g = ctx.createRadialGradient(
        Math.random() * 256, Math.random() * 256, 0,
        Math.random() * 256, Math.random() * 256, 40 + Math.random() * 60
      );
      g.addColorStop(0, '#3d2a1a');
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 256, 256);
    }

    // Esporas bioluminiscentes
    for (let i = 0; i < 120; i++) {
      const x = Math.random() * 256;
      const y = Math.random() * 256;
      const r = Math.random() * 5 + 1;
      ctx.fillStyle = Math.random() > 0.5 ? '#55ff44' : '#88cc22';
      ctx.globalAlpha = 0.5 + Math.random() * 0.5;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Venas negras
    ctx.strokeStyle = 'rgba(0,0,0,0.7)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 18; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * 256, Math.random() * 256);
      ctx.bezierCurveTo(
        Math.random() * 256, Math.random() * 256,
        Math.random() * 256, Math.random() * 256,
        Math.random() * 256, Math.random() * 256
      );
      ctx.stroke();
    }

    // Costras oscuras
    ctx.fillStyle = 'rgba(20,10,10,0.6)';
    for (let i = 0; i < 25; i++) {
      ctx.beginPath();
      ctx.ellipse(Math.random() * 256, Math.random() * 256, 8 + Math.random() * 20, 4 + Math.random() * 10, Math.random(), 0, Math.PI * 2);
      ctx.fill();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    return tex;
  },

  // Genera textura del Sargento (traje espacial desgastado)
  createSgtTexture: () => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#2a3540';
    ctx.fillRect(0, 0, 256, 256);

    // Placas del traje
    ctx.fillStyle = '#1a2530';
    ctx.fillRect(20, 20, 216, 216);
    ctx.strokeStyle = '#4a6070';
    ctx.lineWidth = 3;
    ctx.strokeRect(20, 20, 216, 216);

    // Insignia militar borrosa
    ctx.fillStyle = '#556b2f';
    ctx.fillRect(100, 40, 56, 30);

    // Sangre seca
    for (let i = 0; i < 35; i++) {
      ctx.fillStyle = `rgba(${120 + Math.random() * 40}, 0, 0, ${0.3 + Math.random() * 0.5})`;
      ctx.beginPath();
      ctx.arc(Math.random() * 256, Math.random() * 256, Math.random() * 12 + 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Micelio invadiendo el uniforme
    for (let i = 0; i < 40; i++) {
      ctx.strokeStyle = `rgba(80, 255, 80, ${0.3 + Math.random() * 0.5})`;
      ctx.lineWidth = 1 + Math.random() * 2;
      ctx.beginPath();
      ctx.moveTo(Math.random() * 256, Math.random() * 256);
      ctx.lineTo(Math.random() * 256, Math.random() * 256);
      ctx.stroke();
    }

    // Ojos vacíos (zona cabeza aproximada)
    ctx.fillStyle = '#ffffee';
    ctx.beginPath();
    ctx.ellipse(90, 70, 12, 8, 0, 0, Math.PI * 2);
    ctx.ellipse(166, 70, 12, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.arc(90, 70, 4, 0, Math.PI * 2);
    ctx.arc(166, 70, 4, 0, Math.PI * 2);
    ctx.fill();

    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  },

  // Textura de suelo con tinte de zona (ingeniería, médica, puente)
  createZoneFloorTexture: (tintHex = '#00ff88', label = '') => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#07070f';
    ctx.fillRect(0, 0, 128, 128);

    const size = 8;
    const gap = 4;
    for (let x = 4; x < 128; x += size + gap) {
      for (let y = 4; y < 128; y += size + gap) {
        ctx.fillStyle = '#111124';
        ctx.fillRect(x, y, size, size);
      }
    }

    // Banda de emergencia en el borde
    ctx.fillStyle = tintHex;
    ctx.globalAlpha = 0.35;
    ctx.fillRect(0, 0, 128, 6);
    ctx.fillRect(0, 122, 128, 6);
    ctx.fillRect(0, 0, 6, 128);
    ctx.fillRect(122, 0, 6, 128);
    ctx.globalAlpha = 1;

    if (label) {
      ctx.fillStyle = tintHex;
      ctx.globalAlpha = 0.2;
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(label, 64, 68);
      ctx.globalAlpha = 1;
    }

    ctx.strokeStyle = '#1d1d36';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, 126, 126);

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  },

  // Textura de pared con señalización de cubierta
  createZoneWallTexture: (accentHex = '#00d4ff') => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#0f0f1c';
    ctx.fillRect(0, 0, 256, 256);
    ctx.strokeStyle = '#1e1e3f';
    ctx.lineWidth = 4;
    ctx.strokeRect(4, 4, 248, 248);

    ctx.fillStyle = accentHex;
    ctx.globalAlpha = 0.25;
    ctx.fillRect(4, 110, 248, 36);
    ctx.globalAlpha = 1;

    ctx.fillStyle = accentHex;
    ctx.globalAlpha = 0.08;
    for (let i = 0; i < 30; i++) {
      ctx.fillRect(Math.random() * 240 + 8, Math.random() * 240 + 8, 2, 40);
    }
    ctx.globalAlpha = 1;

    return new THREE.CanvasTexture(canvas);
  },

  // Genera un mapa de relieve (Bump Map) para las paredes
  createMetalWallBumpTexture: () => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Base plana gris medio
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, 256, 256);

    // Ranuras de paneles (indenciones profundas, color oscuro)
    ctx.strokeStyle = '#202020';
    ctx.lineWidth = 4;
    ctx.strokeRect(4, 4, 248, 248);
    ctx.strokeRect(4, 4, 120, 248);
    ctx.strokeRect(4, 128, 248, 4);

    // Remaches extruidos (color claro para indicar altura)
    ctx.fillStyle = '#e0e0e0';
    const rivets = [
      [12, 12], [116, 12], [140, 12], [244, 12],
      [12, 120], [116, 120], [140, 120], [244, 120],
      [12, 136], [116, 136], [140, 136], [244, 136],
      [12, 244], [116, 244], [140, 244], [244, 244]
    ];
    rivets.forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    });

    // Pequeños arañazos / imperfecciones
    for (let i = 0; i < 20; i++) {
      ctx.strokeStyle = Math.random() > 0.5 ? '#ffffff' : '#202020';
      ctx.globalAlpha = 0.15;
      ctx.lineWidth = 1;
      const x = Math.random() * 240 + 8;
      const y = Math.random() * 240 + 8;
      const len = Math.random() * 15 + 5;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + len, y + len * 0.3);
      ctx.stroke();
    }
    ctx.globalAlpha = 1.0;

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    return tex;
  },

  // Genera mapa de rugosidad para paredes (brillo dinámico)
  createMetalWallRoughnessTexture: () => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Base semirugosa
    ctx.fillStyle = '#909090';
    ctx.fillRect(0, 0, 256, 256);

    // Juntas (más rugosas / menos brillantes, color claro)
    ctx.strokeStyle = '#d0d0d0';
    ctx.lineWidth = 4;
    ctx.strokeRect(4, 4, 248, 248);
    ctx.strokeRect(4, 4, 120, 248);
    ctx.strokeRect(4, 128, 248, 4);

    // Remaches (metal pulido / muy brillante, color muy oscuro/negro)
    ctx.fillStyle = '#101010';
    const rivets = [
      [12, 12], [116, 12], [140, 12], [244, 12],
      [12, 120], [116, 120], [140, 120], [244, 120],
      [12, 136], [116, 136], [140, 136], [244, 136],
      [12, 244], [116, 244], [140, 244], [244, 244]
    ];
    rivets.forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    });

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    return tex;
  },

  // Bump Map para suelo
  createFloorBumpTexture: () => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    // Base de metal elevada
    ctx.fillStyle = '#b0b0b0';
    ctx.fillRect(0, 0, 128, 128);

    // Ranuras profundas (rejilla)
    ctx.fillStyle = '#101010';
    const size = 8;
    const gap = 4;
    for (let x = 4; x < 128; x += size + gap) {
      for (let y = 4; y < 128; y += size + gap) {
        ctx.fillRect(x, y, size, size);
      }
    }

    // Borde de la placa indentado
    ctx.strokeStyle = '#303030';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, 126, 126);

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    return tex;
  },

  // Roughness Map para suelo
  createFloorRoughnessTexture: () => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    // Superficie brillante del metal
    ctx.fillStyle = '#404040';
    ctx.fillRect(0, 0, 128, 128);

    // Ranuras acumulan suciedad/óxido (muy rugosas)
    ctx.fillStyle = '#d0d0d0';
    const size = 8;
    const gap = 4;
    for (let x = 4; x < 128; x += size + gap) {
      for (let y = 4; y < 128; y += size + gap) {
        ctx.fillRect(x, y, size, size);
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    return tex;
  },

  // Bump Map para techo
  createCeilingBumpTexture: () => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#a0a0a0';
    ctx.fillRect(0, 0, 256, 256);

    // Conductos centrales (depresión media)
    ctx.fillStyle = '#606060';
    ctx.fillRect(64, 0, 128, 256);

    // Rejilla de conducto (profundo)
    ctx.fillStyle = '#101010';
    for (let y = 8; y < 256; y += 16) {
      ctx.fillRect(72, y, 112, 6);
    }

    // Marcos
    ctx.strokeStyle = '#404040';
    ctx.lineWidth = 3;
    ctx.strokeRect(4, 4, 248, 248);

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    return tex;
  },

  // Textura Emisiva de Pared (Circuitos del deck o venas de infección)
  createWallEmissiveTexture: (zoneKey = '', colorHex = '#00d4ff') => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Fondo negro (sin emisión)
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, 256, 256);

    // Si la zona es infectada (lab o eng), dibujamos micelio biológico
    if (zoneKey === 'lab' || zoneKey === 'eng') {
      ctx.strokeStyle = '#10ff40'; // Bio-green
      ctx.lineWidth = 2.0;
      ctx.shadowColor = '#00ff30';
      ctx.shadowBlur = 8;

      // Venas orgánicas aleatorias
      ctx.beginPath();
      ctx.moveTo(128, 0);
      ctx.bezierCurveTo(100, 80, 160, 160, 128, 256);
      ctx.moveTo(0, 128);
      ctx.bezierCurveTo(80, 100, 160, 160, 256, 128);
      ctx.stroke();

      // Nódulos o bulbos de esporas
      ctx.fillStyle = '#30ff50';
      const nodes = [[128, 90], [145, 140], [60, 110], [180, 150]];
      nodes.forEach(([x, y]) => {
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();
      });
    } else {
      // Zonas normales: Circuitos futuristas / Neón
      ctx.strokeStyle = colorHex;
      ctx.lineWidth = 1.5;
      ctx.shadowColor = colorHex;
      ctx.shadowBlur = 6;

      // Líneas de neón tecnológicas horizontales y verticales rectangulares
      ctx.strokeRect(30, 30, 60, 60);
      ctx.strokeRect(166, 166, 60, 60);

      ctx.beginPath();
      ctx.moveTo(90, 60);
      ctx.lineTo(166, 60);
      ctx.lineTo(166, 166);
      ctx.moveTo(30, 60);
      ctx.lineTo(10, 60);
      ctx.moveTo(226, 196);
      ctx.lineTo(246, 196);
      ctx.stroke();

      // Indicadores luminosos parpadeantes simulados
      ctx.fillStyle = colorHex;
      ctx.beginPath();
      ctx.arc(128, 60, 3, 0, Math.PI * 2);
      ctx.arc(128, 196, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Resetear sombra
    ctx.shadowBlur = 0;

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }
};
