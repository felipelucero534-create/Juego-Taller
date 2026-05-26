/* ═══════════════════════════════════════════════════════════════════════════
   VOID PROTOCOL — js/radar.js
   Visor térmico / radar táctico (mencionado en el lore de ARIA-7)
   ═══════════════════════════════════════════════════════════════════════════ */

class ThermalRadar {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.panel = null;
    this.blipCount = null;
    this.scanPhase = 0;
    this.alertLevel = 0;
    this.mapW = 0;
    this.mapH = 0;
  }

  init() {
    this.canvas = document.getElementById('thermal-radar-canvas');
    this.panel = document.getElementById('thermal-radar-panel');
    this.blipCount = document.getElementById('radar-blip-count');
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.mapW = MAP.width * MAP.tileSize;
    this.mapH = MAP.height * MAP.tileSize;
  }

  worldToRadar(x, z) {
    const size = this.canvas.width;
    const pad = 8;
    const inner = size - pad * 2;
    return {
      x: pad + (x / this.mapW) * inner,
      y: pad + (z / this.mapH) * inner
    };
  }

  getBlipColor(enemy) {
    if (enemy.type === 'void_entity') return '#cc44ff';
    if (enemy.type === 'screamer') return '#ff2255';
    if (enemy.type === 'crawler') return '#ff8800';
    return '#44ff66';
  }

  update() {
    if (!this.ctx || window.GAME.state !== 'PLAY') return;

    const size = this.canvas.width;
    this.ctx.clearRect(0, 0, size, size);
    this.scanPhase += 0.04;

    // Fondo radar
    this.ctx.fillStyle = 'rgba(0, 8, 4, 0.92)';
    this.ctx.fillRect(0, 0, size, size);

    // Grid
    this.ctx.strokeStyle = 'rgba(0, 255, 100, 0.12)';
    this.ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const p = 8 + (i / 4) * (size - 16);
      this.ctx.beginPath();
      this.ctx.moveTo(p, 8);
      this.ctx.lineTo(p, size - 8);
      this.ctx.stroke();
      this.ctx.beginPath();
      this.ctx.moveTo(8, p);
      this.ctx.lineTo(size - 8, p);
      this.ctx.stroke();
    }

    // Barrido rotatorio
    const cx = size / 2;
    const cy = size / 2;
    const grad = this.ctx.createConicalGradient
      ? null
      : this.ctx.createRadialGradient(cx, cy, 0, cx, cy, size / 2);
    if (grad) {
      grad.addColorStop(0, 'rgba(0,255,120,0.15)');
      grad.addColorStop(1, 'transparent');
      this.ctx.fillStyle = grad;
      this.ctx.fillRect(0, 0, size, size);
    }

    this.ctx.save();
    this.ctx.translate(cx, cy);
    this.ctx.rotate(this.scanPhase);
    this.ctx.beginPath();
    this.ctx.moveTo(0, 0);
    this.ctx.arc(0, 0, size / 2 - 4, -0.25, 0.25);
    this.ctx.closePath();
    this.ctx.fillStyle = 'rgba(0, 255, 120, 0.08)';
    this.ctx.fill();
    this.ctx.restore();

    // Borde
    this.ctx.strokeStyle = 'rgba(0, 255, 136, 0.5)';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(1, 1, size - 2, size - 2);

    // Jugador (ARIA-7)
    const playerPos = PLAYER.position;
    const pp = this.worldToRadar(playerPos.x, playerPos.z);
    this.ctx.fillStyle = '#00d4ff';
    this.ctx.beginPath();
    this.ctx.arc(pp.x, pp.y, 3, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.strokeStyle = 'rgba(0,212,255,0.6)';
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.arc(pp.x, pp.y, 6, 0, Math.PI * 2);
    this.ctx.stroke();

    let nearby = 0;
    let maxDist = 999;

    window.GAME.enemies.forEach((enemy) => {
      if (!enemy.mesh) return;
      const ep = this.worldToRadar(enemy.mesh.position.x, enemy.mesh.position.z);
      const dist = playerPos.distanceTo(enemy.mesh.position);
      if (dist < 20) nearby++;
      maxDist = Math.min(maxDist, dist);

      const pulse = 0.6 + Math.sin(this.scanPhase * 3 + dist) * 0.4;
      const radius = enemy.type === 'void_entity' ? 5 : enemy.type === 'screamer' ? 4 : 3;

      this.ctx.fillStyle = this.getBlipColor(enemy);
      this.ctx.globalAlpha = pulse;
      this.ctx.beginPath();
      this.ctx.arc(ep.x, ep.y, radius, 0, Math.PI * 2);
      this.ctx.fill();

      // Halo de calor
      this.ctx.strokeStyle = this.getBlipColor(enemy);
      this.ctx.globalAlpha = pulse * 0.35;
      this.ctx.beginPath();
      this.ctx.arc(ep.x, ep.y, radius + 4, 0, Math.PI * 2);
      this.ctx.stroke();
      this.ctx.globalAlpha = 1;
    });

    this.alertLevel = nearby > 0 ? Math.min(1, 1 - maxDist / 18) : 0;

    if (this.panel) {
      this.panel.classList.toggle('alert', nearby > 0 && maxDist < 12);
      this.panel.classList.toggle('critical', maxDist < 5);
    }

    if (this.blipCount) {
      this.blipCount.textContent = nearby > 0
        ? `${nearby} SEÑAL${nearby > 1 ? 'ES' : ''} TÉRMICA${nearby > 1 ? 'S' : ''}`
        : 'SECTOR LIMPIO';
    }
  }
}

window.RADAR = new ThermalRadar();
