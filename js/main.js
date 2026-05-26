/* ═══════════════════════════════════════════════════════════════════════════
   VOID PROTOCOL — js/main.js
   Punto de entrada principal del juego: inicialización, loop y máquina de estados
   ═══════════════════════════════════════════════════════════════════════════ */

class GameManager {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;

    // Estado general del Juego
    this.state = 'MENU'; // MENU, PLAY, CUTSCENE, DEAD, WIN
    this.isTerminalOpen = false;
    this.isManualOpen = false;
    this.isLoreLogOpen = false;

    this.enemies = []; // Colección de instancias de enemigos activos
    this.voidEnemy = null; // NXVL-0 floating void boss
    this.completedChallenges = []; // IDs de retos superados
    this.escapeAuthorized = false; // Estado del portal de escape
  }

  // Inicializa el motor 3D y los subsistemas del juego
  init() {
    // 1. Configurar escena y renderizador 3D
    const canvas = document.getElementById('game-canvas');
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x020208, 0.095);

    // Cámara con FOV cinematográfico
    this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100);
    this.scene.add(this.camera);

    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      powerPreference: "high-performance"
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.85;

    // Escuchar redimensionado
    window.addEventListener('resize', () => this.onWindowResize());

    // 2. Construir mapa físico y colisiones desde MAP (js/map.js)
    MAP.buildMap(this.scene);

    // 3. Inicializar subsistemas del DOM
    HUD.init();
    LORE.init();
    RADAR.init();
    TERMINAL.init();
    MANUAL.init();

    // 4. Configurar controles del menú de inicio
    this.setupMenuControls();

    // 5. Iniciar bucle de animación 3D
    this.animate();
  }

  // Configura las interacciones de la pantalla de título
  setupMenuControls() {
    const btnPlay = document.getElementById('btn-play-game');
    btnPlay.addEventListener('click', () => {
      this.startGame();
    });

    // Botones de reintento en pantallas de muerte
    const btnRetrys = document.querySelectorAll('.btn-retry');
    btnRetrys.forEach(btn => {
      btn.addEventListener('click', () => {
        this.restartGame();
      });
    });

    // Botón de reintento en pantalla de victoria
    const btnRestartWin = document.getElementById('btn-win-restart');
    btnRestartWin.addEventListener('click', () => {
      this.restartGame();
    });
  }

  // Comienza la partida desde el Deck 1 y carga historia
  startGame() {
    AUDIO.playClick();
    document.getElementById('title-screen').classList.add('hidden');

    // Mover al jugador al spawn inicial
    PLAYER.init(this.camera, MAP.spawnPoints.player);

    // Iniciar Capítulo 1
    LEVELS.loadChapter(1);
  }

  // Alterna apertura/cierre del Codex/Manual (Tecla M)
  toggleManual() {
    if (this.isTerminalOpen) return; // No abrir manual sobreescribiendo terminal directamente
    if (this.isManualOpen) {
      MANUAL.close();
    } else {
      MANUAL.open();
    }
  }

  // Invoca el menú del manual abriendo un tema puntual
  openManualTopic(topicId) {
    MANUAL.openAtTopic(topicId);
  }

  // Invoca la apertura del terminal de código
  openTerminal(terminalObj) {
    TERMINAL.open(terminalObj);
  }

  // Consulta progresión de compuertas
  checkLevelProgress() {
    LEVELS.checkChapterProgression();
  }

  // Dispara el estado de muerte del jugador
  triggerDeath(cause) {
    this.state = 'DEAD';
    HUD.stopTimer();
    AMBIENT.stop();

    const loreMsg = LORE.getRandomDeathMessage(cause === 'void' ? 'nxvl' : cause);
    if (cause === 'myco') {
      const screen = document.getElementById('infected-screen');
      if (loreMsg) screen.querySelector('.death-description').textContent = loreMsg.replace(/\n/g, ' ');
      screen.classList.add('active');
    } else {
      const screen = document.getElementById('void-consumed-screen');
      if (loreMsg) screen.querySelector('.death-description').textContent = loreMsg.replace(/\n/g, ' ');
      screen.classList.add('active');
    }
  }

  triggerWin() {
    this.state = 'CUTSCENE';
    HUD.stopTimer();

    LORE.playCutscene('win').then(() => {
      this.state = 'WIN';
      const elapsedSecs = HUD.getElapsedSeconds();
      const min = Math.floor(elapsedSecs / 60);
      const sec = elapsedSecs % 60;
      const logsFound = LEVELS.collectedLogs.length;
      const totalLogs = MAP.audioLogs.length;

      document.getElementById('win-time').textContent = `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
      document.getElementById('win-errors').textContent = this.completedChallenges.length;
      document.getElementById('win-logs').textContent = `${logsFound}/${totalLogs}`;

      document.getElementById('win-screen').classList.add('active');
    });
  }

  // Reinicia la simulación del juego por completo
  restartGame() {
    AUDIO.playClick();

    // Ocultar overlays activos
    document.getElementById('infected-screen').classList.remove('active');
    document.getElementById('void-consumed-screen').classList.remove('active');
    document.getElementById('win-screen').classList.remove('active');

    // Resetear variables lógicas
    this.completedChallenges = [];
    this.escapeAuthorized = false;
    AMBIENT.stop();
    LEVELS.resetProgress();

    // Resetear mapa 3D (cerrar compuertas, etc.)
    this.resetMap3DState();

    // Inicializar de nuevo estadísticas de jugador y HUD
    PLAYER.init(this.camera, MAP.spawnPoints.player);

    // Volver a cargar el Capítulo 1
    this.loadChapterSilent(1);
  }

  // Recarga el capítulo 1 sin repetir la intro larga opcionalmente
  loadChapterSilent(chapterNum) {
    this.state = 'PLAY';
    this.isTerminalOpen = false;
    this.isManualOpen = false;

    HUD.updateLocation('DECK 04 // BAHÍA DE INGENIERÍA');
    HUD.updateObjective('Localiza y reinicia la Terminal Alpha (T1)');
    HUD.startTimer();
    HUD.updateHealth(100);
    HUD.updateInfection(0);

    LEVELS.spawnEnemiesForChapter(1);
    LEVELS.currentChapter = 1;
    AMBIENT.start();

    // Capturar foco del puntero
    const canvas = document.getElementById('game-canvas');
    canvas.requestPointerLock();
  }

  // Restaura el estado original de la malla de compuertas
  resetMap3DState() {
    // Cerrar compuertas y volver a registrar colisionadores
    for (const door of MAP.doorList) {
      door.open = false;
      door.left.position.x = -0.95;
      door.right.position.x = 0.95;
      if (!MAP.colliders.includes(door.box)) MAP.colliders.push(door.box);
    }

    // Resetear pantallas de terminales a color azul por defecto
    MAP.terminals.forEach(term => {
      term.solved = false;
      const screenMesh = term.screenMesh || term.mesh.children[3];
      if (screenMesh) screenMesh.material.emissive.setHex(0x00d4ff);
    });
  }

  // Redimensionado de pantalla adaptativo
  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  // Bucle principal de frames
  animate() {
    requestAnimationFrame(() => this.animate());

    const now = performance.now();
    const dt = (now - (this.lastFrame || now)) / 1000;
    this.lastFrame = now;

    if (this.state === 'PLAY') {
      PLAYER.update();
      LEVELS.checkZoneChange(PLAYER.position);

      this.enemies.forEach((enemy) => {
        enemy.update(PLAYER.position);
      });

      RADAR.update();
      AMBIENT.update(dt, PLAYER.position);
    }

    if (this.state === 'PLAY' && MAP.decorLights.length) {
      MAP.updateLights(now * 0.001);
    }
    this.renderer.render(this.scene, this.camera);
  }
}

// Inicializar el orquestador principal
window.addEventListener('DOMContentLoaded', () => {
  window.GAME = new GameManager();
  window.GAME.init();
});
