/* ═══════════════════════════════════════════════════════════════════════════
   VOID PROTOCOL — js/player.js
   Controlador del jugador en primera persona, colisiones e interacciones
   ═══════════════════════════════════════════════════════════════════════════ */

class PlayerController {
  constructor() {
    this.camera = null;
    this.moveSpeed = 0.08;
    this.mouseSensitivity = 0.0022;

    this.position = new THREE.Vector3();
    this.rotation = new THREE.Euler(0, 0, 0, 'YXZ'); // YXZ para FPS look

    // Estado del Jugador
    this.health = 100;
    this.infection = 0;
    this.alive = true;

    // Controles de teclado
    this.keys = { w: false, a: false, s: false, d: false };

    // PointerLock state
    this.isLocked = false;
    this.bobTime = 0;
    this.footstepCounter = 0; // Contador para efectos de pasos
    this.lastDamageTime = 0; // Para evitar múltiples sonidos de daño

    this.nearTerminal = null;
    this.nearEscape = false;
    this.nearAudioLog = null;

    // Propiedades de la linterna táctica
    this.flashlight = null;
    this.flashlightOn = false;
    this.flashlightFlickerTimer = 0;
    this.flashlightTarget = null;
  }

  // Inicializa cámara, posición y controles
  init(camera, startPos) {
    this.camera = camera;
    this.position.copy(startPos);
    this.camera.position.copy(this.position);
    this.camera.rotation.set(0, 0, 0);
    this.rotation.set(0, 0, 0);

    // Reiniciar estadísticas
    this.health = 100;
    this.infection = 0;
    this.alive = true;

    // Inicializar Linterna SpotLight con sombras de alta calidad
    if (this.flashlight) {
      this.camera.remove(this.flashlight);
      if (this.flashlightTarget) this.camera.remove(this.flashlightTarget);
    }

    this.flashlight = new THREE.SpotLight(0xffffff, 4.0, 32, Math.PI / 4.8, 0.45, 1.25);
    this.flashlight.castShadow = true;
    this.flashlight.shadow.mapSize.width = 1024;
    this.flashlight.shadow.mapSize.height = 1024;
    this.flashlight.shadow.camera.near = 0.1;
    this.flashlight.shadow.camera.far = 35;
    this.flashlight.shadow.bias = -0.0015;

    // Target de linterna frente a la cámara
    this.flashlightTarget = new THREE.Object3D();
    this.flashlightTarget.position.set(0, 0, -1);
    this.camera.add(this.flashlightTarget);
    this.flashlight.target = this.flashlightTarget;

    this.camera.add(this.flashlight);
    this.flashlightOn = true;
    this.flashlightFlickerTimer = 0;

    this.setupInput();
  }

  // Registra eventos de teclado y ratón
  setupInput() {
    // Teclado abajo
    document.addEventListener('keydown', (e) => {
      if (!this.alive || window.GAME.isTerminalOpen || window.GAME.isManualOpen || window.GAME.isLoreLogOpen) return;

      const key = e.key.toLowerCase();
      if (key === 'w' || key === 'arrowup') this.keys.w = true;
      if (key === 's' || key === 'arrowdown') this.keys.s = true;
      if (key === 'a' || key === 'arrowleft') this.keys.a = true;
      if (key === 'd' || key === 'arrowright') this.keys.d = true;

      // Interacción
      if (key === 'e') {
        this.interact();
      }

      // Manual / Codex
      if (key === 'm') {
        window.GAME.toggleManual();
      }

      // Alternar linterna
      if (key === 'f') {
        this.toggleFlashlight();
      }
    });

    // Teclado arriba
    document.addEventListener('keyup', (e) => {
      const key = e.key.toLowerCase();
      if (key === 'w' || key === 'arrowup') this.keys.w = false;
      if (key === 's' || key === 'arrowdown') this.keys.s = false;
      if (key === 'a' || key === 'arrowleft') this.keys.a = false;
      if (key === 'd' || key === 'arrowright') this.keys.d = false;
    });

    // Ratón - Look
    document.addEventListener('mousemove', (e) => {
      if (!this.isLocked || !this.alive || window.GAME.isTerminalOpen) return;

      this.rotation.y -= e.movementX * this.mouseSensitivity;
      this.rotation.x -= e.movementY * this.mouseSensitivity;

      // Limitar rotación vertical para evitar dar la vuelta completa
      this.rotation.x = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, this.rotation.x));

      this.camera.rotation.copy(this.rotation);
    });

    // PointerLock events
    const canvas = document.getElementById('game-canvas');
    canvas.addEventListener('click', () => {
      if (!window.GAME.isTerminalOpen && !window.GAME.isManualOpen && this.alive && window.GAME.state === 'PLAY') {
        canvas.requestPointerLock();
      }
    });

    document.addEventListener('pointerlockchange', () => {
      this.isLocked = document.pointerLockElement === canvas;
    });
  }

  // Gestiona la acción de interacción (Tecla E)
  interact() {
    if (this.nearAudioLog && !this.nearAudioLog.collected) {
      if (LEVELS.collectLog(this.nearAudioLog.logId)) {
        this.nearAudioLog.collected = true;
        if (this.nearAudioLog.led) this.nearAudioLog.led.material.color.setHex(0x333333);
        LORE.playAudioLog(this.nearAudioLog.logId);
      }
      return;
    }

    if (this.nearTerminal) {
      if (this.nearTerminal.solved) {
        return;
      }
      // Abrir terminal de código
      AUDIO.playTerminalBoot();
      document.exitPointerLock();
      window.GAME.openTerminal(this.nearTerminal);
    } else if (this.nearEscape && window.GAME.escapeAuthorized) {
      // Escapar y ganar
      AUDIO.playPortal();
      document.exitPointerLock();
      window.GAME.triggerWin();
    }
  }

  // Daño infligido por zombies
  damage(amount, cause = 'myco') {
    if (!this.alive) return;
    const now = Date.now();
    this.health = Math.max(0, this.health - amount);
    HUD.updateHealth(this.health);

    if (amount >= 3 && now - this.lastDamageTime > 200) {
      AUDIO.playImpact();
      this.lastDamageTime = now;
      HUD.triggerRedFlash();
    }

    // Parpadeo inmersivo de linterna al recibir daño
    if (this.flashlight && this.flashlightOn) {
      this.flashlightFlickerTimer = 35; // 35 frames de parpadeos
    }

    if (this.health <= 0) {
      this.die(cause);
    }
  }

  // Incremento paulatino de infección
  infect(amount) {
    if (!this.alive) return;
    this.infection = Math.min(100, this.infection + amount);
    HUD.updateInfection(this.infection);

    // Sonido de infección
    if (this.infection > 0 && this.infection % 25 === 0) {
      AUDIO.playInfectionSound();
    }

    if (this.infection >= 100) {
      this.die('myco');
    }
  }

  // Muere
  die(cause) {
    this.alive = false;
    this.keys = { w: false, a: false, s: false, d: false };
    document.exitPointerLock();
    AUDIO.playDeathSound();
    window.GAME.triggerDeath(cause);
  }

  // Actualización por cuadro (frame)
  update() {
    if (!this.alive || window.GAME.isTerminalOpen || window.GAME.isManualOpen || window.GAME.isLoreLogOpen) return;

    // Manejo de parpadeo de linterna cuando recibe daño
    if (this.flashlight && this.flashlightOn) {
      if (this.flashlightFlickerTimer > 0) {
        this.flashlightFlickerTimer--;
        this.flashlight.visible = Math.random() > 0.35; // 35% de probabilidad de apagarse por frame
        if (this.flashlightFlickerTimer === 0) {
          this.flashlight.visible = true; // restaurar
        }
      } else {
        this.flashlight.visible = true;
      }
    }

    // Calcular vector de movimiento
    const moveVector = new THREE.Vector3();
    if (this.keys.w) moveVector.z -= 1;
    if (this.keys.s) moveVector.z += 1;
    if (this.keys.a) moveVector.x -= 1;
    if (this.keys.d) moveVector.x += 1;

    moveVector.normalize();

    // Efecto de pasos cuando el jugador se mueve
    if (moveVector.length() > 0.1) {
      this.footstepCounter++;
      if (this.footstepCounter > 8) { // Reproducir cada cierto número de frames
        AUDIO.playFootstep();
        this.footstepCounter = 0;
      }
    } else {
      this.footstepCounter = 0; // Reset cuando no hay movimiento
    }

    // Rotar dirección de movimiento para que coincida con la vista de la cámara
    const direction = new THREE.Vector3(moveVector.x, 0, moveVector.z);
    direction.applyQuaternion(this.camera.quaternion);
    direction.y = 0; // Bloquear altura en plano horizontal
    direction.normalize();

    // Nueva posición propuesta
    const velocity = direction.multiplyScalar(this.moveSpeed);
    const newPos = this.position.clone().add(velocity);

    // Validar colisión antes de aplicar movimiento
    if (!MAP.checkCollision(newPos)) {
      this.position.copy(newPos);

      // Efecto premium de balanceo de cámara (Camera Bobbing) al caminar
      if (this.keys.w || this.keys.s || this.keys.a || this.keys.d) {
        this.bobTime += 0.15;
        this.camera.position.copy(this.position);
        this.camera.position.y += Math.sin(this.bobTime) * 0.08; // Balanceo suave
      } else {
        this.camera.position.copy(this.position);
      }
    }

    // Verificar cercanía a elementos interactuables
    this.checkInteractions();

    // Auto infectar levemente si la proximidad al vacío es crítica
    // (NXVL-0 drena cordura/vida)
    if (window.GAME.voidEnemy) {
      const distToVoid = this.position.distanceTo(window.GAME.voidEnemy.mesh.position);
      HUD.updateVoidProximity(distToVoid);

      if (distToVoid < 2.5) {
        this.damage(0.4, 'void');
      }
    }
  }

  // Evalúa cercanía a terminales y escotillas
  checkInteractions() {
    let foundTerminal = null;
    for (let i = 0; i < MAP.terminals.length; i++) {
      const term = MAP.terminals[i];
      if (this.position.distanceTo(term.mesh.position) < 2.2) {
        foundTerminal = term;
        break;
      }
    }

    this.nearTerminal = foundTerminal;
    this.nearAudioLog = null;

    for (let i = 0; i < MAP.audioLogs.length; i++) {
      const log = MAP.audioLogs[i];
      if (!log.collected && this.position.distanceTo(log.pos) < 2.0) {
        this.nearAudioLog = log;
        break;
      }
    }

    let nearEsc = false;
    if (MAP.escapeHatch && this.position.distanceTo(MAP.escapeHatch.pos) < 2.5) {
      nearEsc = true;
    }
    this.nearEscape = nearEsc;

    if (this.nearAudioLog) {
      const data = window.LORE_DATA?.audioLogs?.[this.nearAudioLog.logId];
      HUD.showInteractionPrompt(`[E] — REGISTRO: ${data?.title?.split('—')[0]?.trim() || 'AUDIO LOG'}`);
    } else if (this.nearTerminal && !this.nearTerminal.solved) {
      const lore = this.nearTerminal.lore || {};
      HUD.showInteractionPrompt(`[E] — ${lore.name || this.nearTerminal.id.toUpperCase()} (${lore.deck || ''})`);
    } else if (this.nearEscape) {
      if (window.GAME.escapeAuthorized) {
        HUD.showInteractionPrompt('[E] — ACTIVAR MÓDULO M-7');
      } else {
        HUD.showInteractionPrompt('<span style="color:var(--clr-danger)">M-7 BLOQUEADO — COMPLETA TERMINAL GAMMA</span>');
      }
    } else {
      HUD.hideInteractionPrompt();
    }
  }

  // Alterna el estado de la linterna táctica
  toggleFlashlight() {
    if (!this.flashlight) return;
    this.flashlightOn = !this.flashlightOn;
    this.flashlight.visible = this.flashlightOn;
    if (window.AUDIO) {
      window.AUDIO.playFlashlightToggle();
    }
  }
}

window.PLAYER = new PlayerController();
