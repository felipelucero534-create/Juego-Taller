/* ═══════════════════════════════════════════════════════════════════════════
   VOID PROTOCOL — js/hud.js
   Gestión de la interfaz HUD del juego (vida, infección, objetivos)
   ═══════════════════════════════════════════════════════════════════════════ */

class HUDSystem {
  constructor() {
    this.healthFill = null;
    this.healthValue = null;
    this.infectFill = null;
    this.infectValue = null;
    this.locationLabel = null;
    this.objectiveLabel = null;
    this.timerValue = null;
    this.promptElement = null;
    this.voidOverlay = null;
    this.chapterLabel = null;
    this.loreToast = null;
    this.loreToastTimer = null;
    this.fearOverlay = null;
    this.inventoryEl = null;
    this.lastFrameTime = performance.now();
    this.timerInterval = null;
  }

  // Enlazar los elementos DOM de la interfaz
  init() {
    this.healthFill = document.getElementById('hud-health-fill');
    this.healthValue = document.getElementById('hud-health-val');
    this.infectFill = document.getElementById('hud-infect-fill');
    this.infectValue = document.getElementById('hud-infect-val');
    this.locationLabel = document.getElementById('hud-location-label');
    this.objectiveLabel = document.getElementById('hud-objective-label');
    this.timerValue = document.getElementById('hud-timer-val');
    this.promptElement = document.getElementById('interaction-prompt');
    this.voidOverlay = document.getElementById('void-warning-overlay');

    this.chapterLabel = document.getElementById('hud-chapter-label');
    this.loreToast = document.getElementById('hud-lore-toast');
    this.fearOverlay = document.getElementById('fear-vignette-overlay');

    this.startTime = Date.now();
    this.startTimer();

    // Barra de stamina (sprint)
    this.staminaBar = document.getElementById('hud-stamina-bar');
    this.staminaFill = document.getElementById('hud-stamina-fill');
    // Create inventory UI element
    this.inventoryEl = document.createElement('div');
    this.inventoryEl.id = 'hud-inventory';
    this.inventoryEl.style.position = 'absolute';
    this.inventoryEl.style.bottom = '8px';
    this.inventoryEl.style.right = '8px';
    this.inventoryEl.style.padding = '4px 8px';
    this.inventoryEl.style.background = 'rgba(0,0,0,0.5)';
    this.inventoryEl.style.borderRadius = '4px';
    this.inventoryEl.style.fontFamily = 'var(--font-mono)';
    this.inventoryEl.style.color = 'var(--clr-success)';
    this.inventoryEl.style.fontSize = '0.8rem';
    this.inventoryEl.textContent = 'Piezas: 0';
    document.body.appendChild(this.inventoryEl);
    // duplicate inventory UI removed
  }

  // Actualiza la salud del jugador en el HUD
  updateHealth(health) {
    if (!this.healthFill) return;
    const pct = Math.max(0, Math.min(100, health));
    this.healthFill.style.width = `${pct}%`;
    this.healthValue.textContent = `${Math.round(pct)}%`;

    if (pct < 30) {
      this.healthFill.classList.add('danger');
    } else {
      this.healthFill.classList.remove('danger');
    }
  }

  // Actualiza el nivel de infección MYCO-X
  updateInfection(infection) {
    if (!this.infectFill) return;
    const pct = Math.max(0, Math.min(100, infection));
    this.infectFill.style.width = `${pct}%`;
    this.infectValue.textContent = `${Math.round(pct)}%`;

    if (pct > 50) {
      this.infectFill.classList.add('danger');
    } else {
      this.infectFill.classList.remove('danger');
    }
  }

  // Actualiza la barra de stamina del jugador
  updateStamina(stamina, exhausted) {
    if (!this.staminaFill || !this.staminaBar) return;
    const pct = Math.max(0, Math.min(100, stamina));
    this.staminaFill.style.width = `${pct}%`;

    // Mostrar/ocultar barra: solo visible cuando se está gastando stamina
    const visible = pct < 99;
    this.staminaBar.style.opacity = visible ? '1' : '0';

    this.staminaFill.classList.toggle('exhausted', exhausted);
    this.staminaFill.classList.toggle('low', pct < 25 && !exhausted);
  }

  // Actualiza el nombre de la locación actual
  updateLocation(locName) {
    if (this.locationLabel) {
      this.locationLabel.textContent = locName;
    }
  }

  // Actualiza el objetivo primario actual
  updateObjective(objectiveText) {
    if (this.objectiveLabel) {
      this.objectiveLabel.textContent = objectiveText;
    }
  }

  updateChapter(chapterText) {
    if (this.chapterLabel) {
      this.chapterLabel.textContent = chapterText;
    }
  }

  showLoreToast(text) {
    if (!this.loreToast || !text) return;
    this.loreToast.textContent = text;
    this.loreToast.classList.add('active');
    if (this.loreToastTimer) clearTimeout(this.loreToastTimer);
    this.loreToastTimer = setTimeout(() => {
      this.loreToast.classList.remove('active');
    }, 6000);
  }

  // Inicia el cronómetro de la sesión de juego
  startTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.startTime = Date.now();

    this.timerInterval = setInterval(() => {
      const elapsedMs = Date.now() - this.startTime;
      const totalSec = Math.floor(elapsedMs / 1000);
      const min = Math.floor(totalSec / 60).toString().padStart(2, '0');
      const sec = (totalSec % 60).toString().padStart(2, '0');
      if (this.timerValue) {
        this.timerValue.textContent = `${min}:${sec}`;
      }
    }, 1000);
  }

  // Detiene el cronómetro
  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  getElapsedSeconds() {
    return Math.floor((Date.now() - this.startTime) / 1000);
  }

  // Muestra u oculta el letrero flotante de interacción (e.g. "PULSA [E]")
  showInteractionPrompt(message) {
    if (!this.promptElement) return;
    this.promptElement.innerHTML = message;
    this.promptElement.classList.add('active');
  }

  hideInteractionPrompt() {
    if (this.promptElement) {
      this.promptElement.classList.remove('active');
    }
  }

  // Actualiza la advertencia de proximidad del vacío / NXVL-0
  updateVoidProximity(distance) {
    if (!this.voidOverlay) return;

    if (distance < 3) {
      this.voidOverlay.className = 'critical';
    } else if (distance < 8) {
      this.voidOverlay.className = 'near';
    } else {
      this.voidOverlay.className = '';
    }
  }

  updateFearOverlay(fearLevel, nearestEnemyDist) {
    if (!this.fearOverlay) return;
    const intensity = Math.min(1, fearLevel);
    this.fearOverlay.style.opacity = String(0.15 + intensity * 0.55);
    this.fearOverlay.classList.toggle('pulse', intensity > 0.5);
    this.fearOverlay.classList.toggle('critical', nearestEnemyDist < 5);

    if (this.healthFill && PLAYER.health < 35) {
      document.body.classList.add('low-health');
    } else {
      document.body.classList.remove('low-health');
    }
  }

  // Dispara el flash rojo rápido en pantalla por error de código
  triggerRedFlash() {
    const errorOverlay = document.getElementById('code-error-screen');
    if (!errorOverlay) return;

    errorOverlay.classList.add('active');
    AUDIO.playAlarm();

    // El flash dura 1.5 segundos
    setTimeout(() => {
      errorOverlay.classList.remove('active');
    }, 1500);
  }
}

window.HUD = new HUDSystem();
