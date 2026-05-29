/* ═══════════════════════════════════════════════════════════════════════════
   VOID PROTOCOL — js/player.js
   Controlador del jugador en primera persona, colisiones e interacciones
   ═══════════════════════════════════════════════════════════════════════════ */

class PlayerController {
  constructor() {
    this.camera = null;

    // ── Inventario interno ─────────────────────────────────────────────
    this.hardwarePieces = 0; // contador de piezas recolectadas

    // ── Velocidades de movimiento ────────────────────────────────────
    this.walkSpeed    = 0.115;  // velocidad base al caminar
    this.sprintSpeed  = 0.22;   // velocidad al correr (Shift)
    this.crouchSpeed  = 0.06;   // velocidad al agacharse (Ctrl)
    this.moveSpeed    = this.walkSpeed;

    this.mouseSensitivity = 0.0022;

    this.position = new THREE.Vector3();
    this.rotation = new THREE.Euler(0, 0, 0, 'YXZ'); // YXZ para FPS look

    // ── Inercia / aceleración suave ──────────────────────────────────
    this.velocity      = new THREE.Vector3(); // velocidad actual con inercia
    this.acceleration  = 0.26;  // qué tan rápido llega a la velocidad máxima
    this.friction      = 0.80;  // qué tan rápido frena (1 = sin fricción)

    // ── Estado del Jugador ─────────────────────────────────────────────────
    this.health = 100;
    this.infection = 0;
    this.alive = true;

    // ── Stamina (sprint) ───────────────────────────────────────────────────
    this.stamina         = 100;   // 0-100
    this.staminaDrain    = 0.55;  // por frame al correr
    this.staminaRegen    = 0.22;  // por frame al descansar
    this.sprintExhausted = false; // bloqueado hasta recuperar stamina mínima

    // ── Estado de movimiento especial ─────────────────────────────────────
    this.isSprinting = false;
    this.isCrouching = false;

    // ── Altura de la cámara ────────────────────────────────────────────────
    this.standHeight  = 1.7;
    this.crouchHeight = 0.9;
    this.currentHeight = this.standHeight;  // altura interpolada actual

    // Controles de teclado
    this.keys = { w: false, a: false, s: false, d: false, shift: false, ctrl: false };

    // PointerLock state
    this.isLocked = false;
    this.bobTime = 0;
    this.bobAmount = 0;           // amplitude interpolada del balanceo
    this.footstepCounter = 0;
    this.lastDamageTime = 0;

    // ── FOV dinámico ───────────────────────────────────────────────────────
    this.baseFOV    = 70;
    this.sprintFOV  = 82;
    this.crouchFOV  = 63;
    this.currentFOV = this.baseFOV;

    this.nearTerminal = null;
    this.nearEscape = false;
    this.nearAudioLog = null;

    // Propiedades de la linterna táctica
    this.flashlight = null;
    this.flashlightOn = false;
    this.flashlightFlickerTimer = 0;
    this.flashlightTarget = null;

    // ── Vectores pre-asignados (evitar GC por frame) ───────────────────────
    this._moveVec    = new THREE.Vector3();
    this._dirVec     = new THREE.Vector3();
    this._targetVel  = new THREE.Vector3();
    this._newPos     = new THREE.Vector3();
    this._newPosX    = new THREE.Vector3();
    this._newPosZ    = new THREE.Vector3();
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
    this.stamina = 100;
    this.sprintExhausted = false;
    this.isSprinting = false;
    this.isCrouching = false;
    this.velocity.set(0, 0, 0);
    this.currentHeight = this.standHeight;
    this.currentFOV = this.baseFOV;
    this.bobTime = 0;
    this.bobAmount = 0;

    // Linterna táctica: haz amplio y definido, sin desviación hacia arriba
    // angle: ángulo del cono | penumbra: 0=borde duro, 1=borde difuso
    if (this.flashlight) {
      this.camera.remove(this.flashlight);
      if (this.flashlightTarget) this.camera.remove(this.flashlightTarget);
    }
    this.flashlight = new THREE.SpotLight(0xfff5e0, 18.0, 55, Math.PI / 4, 0.12, 1.2);
    this.flashlight.castShadow = true;
    this.flashlight.shadow.mapSize.width = 512;
    this.flashlight.shadow.mapSize.height = 512;
    this.flashlight.shadow.camera.near = 0.1;
    this.flashlight.shadow.camera.far = 55;
    this.flashlight.shadow.bias = -0.0015;

    // Target centrado directamente al frente de la cámara (sin offset vertical)
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
      if (key === 'w' || key === 'arrowup')    this.keys.w = true;
      if (key === 's' || key === 'arrowdown')  this.keys.s = true;
      if (key === 'a' || key === 'arrowleft')  this.keys.a = true;
      if (key === 'd' || key === 'arrowright') this.keys.d = true;

      // Sprint (Shift)
      if (e.key === 'Shift')   this.keys.shift = true;
      // Agacharse (Ctrl)
      if (e.key === 'Control') this.keys.ctrl  = true;

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
      if (key === 'w' || key === 'arrowup')    this.keys.w = false;
      if (key === 's' || key === 'arrowdown')  this.keys.s = false;
      if (key === 'a' || key === 'arrowleft')  this.keys.a = false;
      if (key === 'd' || key === 'arrowright') this.keys.d = false;

      if (e.key === 'Shift')   this.keys.shift = false;
      if (e.key === 'Control') this.keys.ctrl  = false;
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

    // ── Parpadeo de linterna al recibir daño ───────────────────────────────
    if (this.flashlight && this.flashlightOn) {
      if (this.flashlightFlickerTimer > 0) {
        this.flashlightFlickerTimer--;
        this.flashlight.visible = Math.random() > 0.35;
        if (this.flashlightFlickerTimer === 0) this.flashlight.visible = true;
      } else {
        this.flashlight.visible = true;
      }
    }

    // ── Determinar estado de movimiento (sprint / crouch) ─────────────────
    const isMoving = this.keys.w || this.keys.s || this.keys.a || this.keys.d;

    // Agacharse tiene prioridad sobre sprint
    this.isCrouching = this.keys.ctrl;

    // Sprint: Shift + movimiento hacia adelante + no agachado + no exhausto
    const canSprint = this.keys.shift && this.keys.w && !this.isCrouching && !this.sprintExhausted;
    this.isSprinting = canSprint && isMoving;

    // ── Gestión de Stamina ─────────────────────────────────────────────────
    if (this.isSprinting) {
      this.stamina = Math.max(0, this.stamina - this.staminaDrain);
      if (this.stamina <= 0) {
        this.sprintExhausted = true;
        this.isSprinting = false;
      }
    } else {
      this.stamina = Math.min(100, this.stamina + this.staminaRegen);
      if (this.sprintExhausted && this.stamina >= 30) {
        this.sprintExhausted = false; // recuperación mínima para volver a correr
      }
    }
    // Actualizar barra de stamina en HUD
    HUD.updateStamina(this.stamina, this.sprintExhausted);

    // ── Velocidad objetivo según estado ───────────────────────────────────
    let targetSpeed;
    if (this.isSprinting)      targetSpeed = this.sprintSpeed;
    else if (this.isCrouching) targetSpeed = this.crouchSpeed;
    else                       targetSpeed = this.walkSpeed;

    // ── FOV dinámico ───────────────────────────────────────────────────────
    let targetFOV;
    if (this.isSprinting)      targetFOV = this.sprintFOV;
    else if (this.isCrouching) targetFOV = this.crouchFOV;
    else                       targetFOV = this.baseFOV;

    this.currentFOV += (targetFOV - this.currentFOV) * 0.08;
    if (this.camera && Math.abs(this.camera.fov - this.currentFOV) > 0.01) {
      this.camera.fov = this.currentFOV;
      this.camera.updateProjectionMatrix();
    }

    // ── Altura de cámara al agacharse ──────────────────────────────────────
    const targetHeight = this.isCrouching ? this.crouchHeight : this.standHeight;
    this.currentHeight += (targetHeight - this.currentHeight) * 0.12;

    // ── Vector de dirección de movimiento ─────────────────────────────────
    const moveVector = this._moveVec.set(0, 0, 0);
    if (this.keys.w) moveVector.z -= 1;
    if (this.keys.s) moveVector.z += 1;
    if (this.keys.a) moveVector.x -= 1;
    if (this.keys.d) moveVector.x += 1;
    moveVector.normalize();

    // Rotar hacia la dirección de la cámara
    const direction = this._dirVec.set(moveVector.x, 0, moveVector.z);
    direction.applyQuaternion(this.camera.quaternion);
    direction.y = 0;
    if (direction.lengthSq() > 0) direction.normalize();

    // ── Inercia: interpolar velocidad hacia la dirección deseada ──────────
    const targetVelocity = this._targetVel.copy(direction).multiplyScalar(targetSpeed);
    this.velocity.x += (targetVelocity.x - this.velocity.x) * this.acceleration;
    this.velocity.z += (targetVelocity.z - this.velocity.z) * this.acceleration;

    // Fricción cuando no hay input
    if (!isMoving) {
      this.velocity.x *= this.friction;
      this.velocity.z *= this.friction;
    }

    // ── Colisión y aplicación de posición ─────────────────────────────────
    const newPos = this._newPos.copy(this.position).add(this.velocity);
    if (!MAP.checkCollision(newPos)) {
      this.position.copy(newPos);
    } else {
      // Intentar deslizamiento en X o Z por separado
      const newPosX = this._newPosX.copy(this.position);
      newPosX.x += this.velocity.x;
      if (!MAP.checkCollision(newPosX)) {
        this.position.x = newPosX.x;
      } else {
        this.velocity.x = 0;
      }
      const newPosZ = this._newPosZ.copy(this.position);
      newPosZ.z += this.velocity.z;
      if (!MAP.checkCollision(newPosZ)) {
        this.position.z = newPosZ.z;
      } else {
        this.velocity.z = 0;
      }
    }

    // ── Camera Bobbing mejorado ────────────────────────────────────────────
    const speed = this.velocity.length();
    const bobFrequency = this.isSprinting ? 0.24 : (this.isCrouching ? 0.08 : 0.15);
    const targetBobAmp  = isMoving
      ? (this.isSprinting ? 0.13 : (this.isCrouching ? 0.03 : 0.07))
      : 0;

    // Amplitude se interpola suavemente
    this.bobAmount += (targetBobAmp - this.bobAmount) * 0.1;

    if (speed > 0.003 || this.bobAmount > 0.001) {
      this.bobTime += bobFrequency;
    }

    // Sonido de pasos adaptado a la velocidad
    if (isMoving && speed > 0.003) {
      this.footstepCounter++;
      const footstepThreshold = this.isSprinting ? 5 : (this.isCrouching ? 14 : 9);
      if (this.footstepCounter > footstepThreshold) {
        AUDIO.playFootstep();
        this.footstepCounter = 0;
      }
    } else {
      this.footstepCounter = 0;
    }

    // Aplicar posición final con altura y bobbing
    this.camera.position.copy(this.position);
    this.camera.position.y = this.currentHeight + Math.sin(this.bobTime) * this.bobAmount;
    // Leve balanceo lateral al correr
    if (this.isSprinting) {
      this.camera.position.x += Math.sin(this.bobTime * 0.5) * 0.025;
    }

    // ── Verificar cercanía a elementos interactuables ──────────────────────
    this.checkInteractions();

    // ── Proximidad al vacío / NXVL-0 ──────────────────────────────────────
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

  // Añade una pieza de hardware al inventario y actualiza HUD
  addHardwarePiece() {
    this.hardwarePieces += 1;
    if (window.HUD && typeof window.HUD.updateInventory === 'function') {
      window.HUD.updateInventory(this.hardwarePieces);
    }
  }
}

window.PLAYER = new PlayerController();
