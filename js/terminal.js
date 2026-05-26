/* ═══════════════════════════════════════════════════════════════════════════
   VOID PROTOCOL — js/terminal.js
   Mecánica de terminal de código: editor, evaluación y penalización
   ═══════════════════════════════════════════════════════════════════════════ */

class TerminalSystem {
  constructor() {
    this.windowEl = null;
    this.titleEl = null;
    this.storyBox = null;
    this.missionTitle = null;
    this.descriptionBox = null;
    this.hintBox = null;
    this.editorTextarea = null;
    this.editorGutter = null;
    this.statusLog = null;
    this.runBtn = null;
    this.resetBtn = null;
    this.closeBtn = null;

    this.activeTerminal = null; // Objeto terminal del mapa (T1, T2 o T3)
    this.activeChallenge = null; // Objeto de desafío activo (challenges.js)
    this.currentCode = '';
  }

  // Enlazar los elementos DOM de la ventana de la terminal
  init() {
    this.windowEl = document.getElementById('terminal-overlay');
    this.titleEl = document.getElementById('term-title');
    this.storyBox = document.getElementById('term-story-box');
    this.missionTitle = document.getElementById('term-mission-title');
    this.descriptionBox = document.getElementById('term-description');
    this.hintBox = document.getElementById('term-hint');
    this.editorTextarea = document.getElementById('term-editor-textarea');
    this.editorGutter = document.getElementById('term-editor-gutter');
    this.statusLog = document.getElementById('term-status-log');
    this.runBtn = document.getElementById('term-btn-run');
    this.resetBtn = document.getElementById('term-btn-reset');
    this.closeBtn = document.getElementById('term-btn-close');

    // Escuchar eventos
    this.runBtn.addEventListener('click', () => this.evaluateCode());
    this.resetBtn.addEventListener('click', () => this.resetTemplate());
    this.closeBtn.addEventListener('click', () => this.close());

    // Sincronizar números de línea al escribir
    this.editorTextarea.addEventListener('input', () => {
      this.updateLineNumbers();
      AUDIO.playType();
    });

    this.editorTextarea.addEventListener('keydown', (e) => {
      // Permitir sangrías con Tab en lugar de saltar foco
      if (e.key === 'Tab') {
        e.preventDefault();
        const start = this.editorTextarea.selectionStart;
        const end = this.editorTextarea.selectionEnd;
        const val = this.editorTextarea.value;
        this.editorTextarea.value = val.substring(0, start) + '  ' + val.substring(end);
        this.editorTextarea.selectionStart = this.editorTextarea.selectionEnd = start + 2;
        this.updateLineNumbers();
      }
    });
  }

  // Abre la terminal de programación con el desafío correspondiente
  open(terminalObj) {
    this.activeTerminal = terminalObj;
    this.activeChallenge = this.getChallengeForTerminal(terminalObj.id);

    if (!this.activeChallenge) {
      console.error(`No challenges defined for terminal: ${terminalObj.id}`);
      return;
    }

    this.windowEl.classList.add('active');
    window.GAME.isTerminalOpen = true;

    // Configurar metadatos del desafío
    this.titleEl.textContent = this.activeChallenge.title;
    this.missionTitle.textContent = `DESAFÍO ${this.activeChallenge.step}/${this.activeChallenge.totalSteps} — PROTOCOLO DE REPARACIÓN`;
    this.descriptionBox.innerHTML = this.activeChallenge.description;
    this.hintBox.querySelector('.terminal-hint-content').textContent = this.activeChallenge.hint;

    // Agregar logs de historia / diálogos de ARIA
    this.storyBox.innerHTML = '';
    this.activeChallenge.story.forEach((line) => {
      const p = document.createElement('div');
      p.className = 'terminal-story-line';
      if (line.startsWith('ARIA-7')) {
        p.innerHTML = `<span class="terminal-story-author">ARIA-7 // TRANS-LOG:</span><br>${line.replace('ARIA-7 — Registro de voz 001:', '').replace('ARIA-7 — Registro de voz 002:', '').replace('ARIA-7 — Registro de voz 003:', '').replace('ARIA-7 — Registro de voz 004:', '').replace('ARIA-7 — Registro de voz 005:', '').replace('ARIA-7 — Registro de voz 006:', '')}`;
      } else {
        p.textContent = line;
      }
      this.storyBox.appendChild(p);
    });

    // Cargar plantilla de código inicial
    this.editorTextarea.value = this.activeChallenge.template;
    this.updateLineNumbers();

    // Limpiar logs de estado
    this.statusLog.textContent = 'INICIALIZANDO LECTOR DE PROTOCOLOS...';
    this.statusLog.className = 'terminal-status-log';

    // Agregar acceso rápido al manual desde las referencias sugeridas
    const manualRefList = this.activeChallenge.manualRefs;
    if (manualRefList && manualRefList.length > 0) {
      const guideBox = document.createElement('div');
      guideBox.className = 'terminal-guide-box';

      const guideTitle = document.createElement('div');
      guideTitle.className = 'terminal-guide-title';
      guideTitle.textContent = '📖 Temas del Codex recomendados:';
      guideBox.appendChild(guideTitle);

      manualRefList.forEach((refId) => {
        const topic = window.MANUAL?.topicIndex?.[refId];
        const link = document.createElement('button');
        link.type = 'button';
        link.className = 'terminal-guide-link';
        link.textContent = topic ? topic.entry.title : refId;
        link.addEventListener('click', () => {
          window.GAME.openManualTopic(refId);
        });
        guideBox.appendChild(link);
      });

      this.descriptionBox.appendChild(guideBox);
    }
  }

  // Encuentra el primer desafío pendiente de la secuencia de esta terminal
  getChallengeForTerminal(terminalId) {
    const sequence = window.TERMINAL_SEQUENCE[terminalId];
    if (!sequence) return null;

    // Retorna el primer desafío que no esté completado en el juego
    for (let i = 0; i < sequence.length; i++) {
      const challengeId = sequence[i];
      if (!window.GAME.completedChallenges.includes(challengeId)) {
        return window.CHALLENGES[challengeId];
      }
    }
    // Si todos fueron resueltos, retorna el último para revisión
    return window.CHALLENGES[sequence[sequence.length - 1]];
  }

  // Actualiza los números en el canal lateral del editor
  updateLineNumbers() {
    const lines = this.editorTextarea.value.split('\n');
    const gutterLines = lines.map((_, idx) => idx + 1).join('\n');
    this.editorGutter.textContent = gutterLines;
  }

  // Restaura la plantilla por defecto del desafío
  resetTemplate() {
    AUDIO.playClick();
    if (confirm('¿Reiniciar el código de la terminal al estado original de fábrica?')) {
      this.editorTextarea.value = this.activeChallenge.template;
      this.updateLineNumbers();
      this.statusLog.textContent = 'PROTOCOLO REINICIALIZADO.';
      this.statusLog.className = 'terminal-status-log';
    }
  }

  // Cierra la terminal y devuelve el control al jugador
  close() {
    AUDIO.playClick();
    this.windowEl.classList.remove('active');
    window.GAME.isTerminalOpen = false;

    // Bloquear puntero de nuevo automáticamente al volver
    const canvas = document.getElementById('game-canvas');
    if (PLAYER.alive) {
      canvas.requestPointerLock();
    }
  }

  // Evalúa el código escrito por el jugador según el tipo de desafío
  evaluateCode() {
    AUDIO.playClick();
    this.statusLog.textContent = 'COMPILANDO CÓDIGO Y COMPROBANDO REQUISITOS...';
    this.statusLog.className = 'terminal-status-log';

    const code = this.editorTextarea.value;
    let isSuccess = false;
    let errorMessage = '';

    try {
      if (this.activeChallenge.type === 'html') {
        // Evaluación HTML: comprobar inclusión de etiquetas clave
        const normalizedCode = code.toLowerCase().replace(/\s+/g, ' ');
        const missing = [];

        this.activeChallenge.requires.forEach((req) => {
          if (!normalizedCode.includes(req.toLowerCase())) {
            missing.push(req);
          }
        });

        if (missing.length === 0) {
          isSuccess = true;
        } else {
          // Obtener un mensaje de error temático de fallos
          const randIdx = UTILS.randInt(0, this.activeChallenge.failMessages.length - 1);
          errorMessage = `${this.activeChallenge.failMessages[randIdx]}\n(Falta declarar o estructurar adecuadamente: ${missing.join(', ')})`;
        }
      } else if (this.activeChallenge.type === 'css') {
        // Evaluación CSS: comprobar selectores y propiedades
        const normalizedCode = code.replace(/\s+/g, '');
        const missing = [];

        this.activeChallenge.requires.forEach((req) => {
          if (!normalizedCode.includes(req.replace(/\s+/g, ''))) {
            missing.push(req);
          }
        });

        if (missing.length === 0) {
          isSuccess = true;
        } else {
          const randIdx = UTILS.randInt(0, this.activeChallenge.failMessages.length - 1);
          errorMessage = `${this.activeChallenge.failMessages[randIdx]}\n(Faltan selectores o propiedades requeridas: ${missing[0]})`;
        }
      } else if (this.activeChallenge.type === 'js') {
        // Evaluación JS: Evaluar la función en un Sandbox local
        // Crear un constructor de funciones locales
        const evaluator = new Function(`${code}\n${this.activeChallenge.testCode}`);
        const result = evaluator();

        if (result === this.activeChallenge.expectedResult) {
          isSuccess = true;
        } else {
          errorMessage = `ERROR: El resultado de la función es inválido.\nSe esperaba '${this.activeChallenge.expectedResult}' pero retornó '${result}'.`;
        }
      }
    } catch (err) {
      errorMessage = `ERROR DE ENTRADA / ERROR SINTACTICO:\n${err.message}`;
    }

    if (isSuccess) {
      // ÉXITO
      AUDIO.playAccessGranted();
      this.statusLog.textContent = this.activeChallenge.successMessage;
      this.statusLog.className = 'terminal-status-log success';

      // Registrar desafío completado
      if (!window.GAME.completedChallenges.includes(this.activeChallenge.id)) {
        window.GAME.completedChallenges.push(this.activeChallenge.id);
      }

      // Comprobar si la terminal completa todos sus desafíos
      const sequence = window.TERMINAL_SEQUENCE[this.activeTerminal.id];
      const allDone = sequence.every(chId => window.GAME.completedChallenges.includes(chId));

      if (allDone) {
        this.activeTerminal.solved = true;
        // Cambiar luz de la terminal a verde
        const screenMesh = this.activeTerminal.screenMesh || this.activeTerminal.mesh.children[3];
        if (screenMesh) screenMesh.material.emissive.setHex(0x00ff88);

        // Desbloquear puerta asociada (D1 para T1, D2 para T2, etc.)
        const doorId = this.activeTerminal.id.replace('T', 'D');
        MAP.openDoor(doorId);

        // Si fue la última terminal, autorizar escape final
        if (this.activeTerminal.id === 'T3') {
          window.GAME.escapeAuthorized = true;
        }
      }

      // Cerrar la terminal automáticamente tras 2 segundos de éxito
      setTimeout(() => {
        this.close();
        window.GAME.checkLevelProgress();
      }, 2000);
    } else {
      // FALLO: pantalla roja de error y daño leve por infección fúngica por cortocircuito
      AUDIO.playAccessDenied();
      this.statusLog.textContent = errorMessage.split('\n')[0];
      this.statusLog.className = 'terminal-status-log error';

      // Disparar flash rojo en pantalla y alertar
      HUD.triggerRedFlash();

      // Penalización: 8% de daño biológico
      PLAYER.damage(8);
    }
  }
}

window.TERMINAL = new TerminalSystem();

