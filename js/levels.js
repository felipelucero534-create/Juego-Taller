/* ═══════════════════════════════════════════════════════════════════════════
   VOID PROTOCOL — js/levels.js
   Capítulos, progresión narrativa y spawns alineados al lore
   ═══════════════════════════════════════════════════════════════════════════ */

class LevelSystem {
  constructor() {
    this.currentChapter = 1;
    this.chapterTransitionLock = false;
    this.collectedLogs = [];
    this.lastZone = null;
  }

  getChapterConfig(num) {
    return window.LORE_DATA?.chapters?.[num] || null;
  }

  loadChapter(chapterNum) {
    if (this.chapterTransitionLock) return;
    this.currentChapter = chapterNum;
    const ch = this.getChapterConfig(chapterNum);
    if (!ch) return;

    HUD.updateChapter(ch.title);
    HUD.updateLocation(ch.location);
    HUD.updateObjective(ch.objective);

  window.GAME.state = 'CUTSCENE';

    const cutsceneId = chapterNum === 1 ? ch.introCutscene : ch.introCutscene;
    LORE.playCutscene(cutsceneId).then(() => {
      window.GAME.state = 'PLAY';
      if (chapterNum === 1) {
        AUDIO.init();
        AMBIENT.start();
        // Iniciar golpes salvajes continuos hasta completar Terminal Alpha (T1)
        AUDIO.startPreTerminalBanging();
      }
      HUD.startTimer();
      this.spawnEnemiesForChapter(chapterNum);

      const canvas = document.getElementById('game-canvas');
      if (PLAYER.alive) canvas.requestPointerLock();
    });
  }

  spawnEnemiesForChapter(chapterNum) {
    window.GAME.enemies.forEach((enemy) => window.GAME.scene.remove(enemy.mesh));
    window.GAME.enemies = [];
    window.GAME.voidEnemy = null;

    const profiles = window.LORE_DATA?.enemyProfiles || {};

    MAP.spawnPoints.enemies.forEach((sp) => {
      const profile = profiles[sp.type];
      if (profile && profile.chapter > chapterNum) return;

      let enemy = null;
      if (sp.type === 'E1') enemy = new SporeWalker(sp.pos);
      else if (sp.type === 'E2' && chapterNum >= 2) enemy = new Crawler(sp.pos);
      else if (sp.type === 'E3' && chapterNum >= 3) enemy = new Screamer(sp.pos);

      if (enemy) {
        enemy.loreName = profile?.name || sp.type;
        window.GAME.enemies.push(enemy);
        window.GAME.scene.add(enemy.mesh);
      }
    });

    if (chapterNum >= 3) {
      const voidPos = new THREE.Vector3(9 * MAP.tileSize, 1.2, 2 * MAP.tileSize);
      const voidEntity = new VoidEntity(voidPos);
      voidEntity.loreName = 'NXVL-0 — Entidad del Vacío';
      window.GAME.enemies.push(voidEntity);
      window.GAME.voidEnemy = voidEntity;
      window.GAME.scene.add(voidEntity.mesh);
    }
  }

  onZoneEnter(zoneKey) {
    const deck = window.LORE_DATA?.deckZones?.[zoneKey];
    if (!deck || zoneKey === 'corridor') return;

    HUD.updateLocation(deck.label);
    HUD.showLoreToast(deck.flavor);
    AMBIENT.setZone(zoneKey);

    const ch = this.getChapterConfig(this.currentChapter);
    if (ch && ch.zoneKey === zoneKey) {
      HUD.updateObjective(ch.objective);
    } else if (zoneKey === 'escape' && window.GAME.escapeAuthorized) {
      HUD.updateObjective('Activa la escotilla del Módulo M-7 [E]');
    }
  }

  checkZoneChange(playerPos) {
    const zone = MAP.getPlayerZone(playerPos);
    if (zone !== this.lastZone) {
      this.lastZone = zone;
      if (zone && zone !== 'corridor') this.onZoneEnter(zone);
    }
  }

  onTerminalComplete(terminalId) {
    const chapterByTerminal = { T1: 1, T2: 2, T3: 3 };
    const num = chapterByTerminal[terminalId];
    const ch = this.getChapterConfig(num);
    if (ch) HUD.updateObjective(ch.objectiveComplete);
  }

  checkChapterProgression() {
    if (this.chapterTransitionLock) return;

    const t1 = MAP.terminals.find((t) => t.id === 'T1')?.solved;
    const t2 = MAP.terminals.find((t) => t.id === 'T2')?.solved;
    const t3 = MAP.terminals.find((t) => t.id === 'T3')?.solved;

    if (this.currentChapter === 1 && t1) {
      // Detener los golpes salvajes: la criatura se retira al completar T1
      AUDIO.stopPreTerminalBanging();
      this.advanceChapter(2, 'chapter1_complete');
    } else if (this.currentChapter === 2 && t2) {
      this.advanceChapter(3, 'chapter2_complete');
    } else if (this.currentChapter === 3 && t3 && !window.GAME.escapeAuthorized) {
      this.onFinalTerminalComplete();
    }
  }

  advanceChapter(nextChapter, cutsceneId) {
    this.chapterTransitionLock = true;
    window.GAME.state = 'CUTSCENE';

    LORE.playCutscene(cutsceneId).then(() => {
      this.currentChapter = nextChapter;
      this.chapterTransitionLock = false;
      this.loadChapterAfterTransition(nextChapter);
    });
  }

  loadChapterAfterTransition(chapterNum) {
    const ch = this.getChapterConfig(chapterNum);
    if (!ch) return;

    window.GAME.state = 'PLAY';
    HUD.updateChapter(ch.title);
    HUD.updateLocation(ch.location);
    HUD.updateObjective(ch.objective);

    if (chapterNum > 1) {
      LORE.playCutscene(ch.introCutscene).then(() => {
        this.spawnEnemiesForChapter(chapterNum);
      });
    } else {
      this.spawnEnemiesForChapter(chapterNum);
    }
  }

  onFinalTerminalComplete() {
    window.GAME.escapeAuthorized = true;
    window.GAME.state = 'CUTSCENE';

    LORE.playCutscene('escape_alert').then(() => {
      window.GAME.state = 'PLAY';
      const ch = this.getChapterConfig(3);
      HUD.updateObjective('¡CORRE! Escapa por el Módulo M-7 (Sector Oeste)');
      HUD.updateLocation('DECK 01 // RUTA DE EVACUACIÓN → M-7');
    });
  }

  collectLog(logId) {
    if (this.collectedLogs.includes(logId)) return false;
    this.collectedLogs.push(logId);
    return true;
  }

  resetProgress() {
    this.currentChapter = 1;
    this.chapterTransitionLock = false;
    this.collectedLogs = [];
    MAP.audioLogs.forEach((log) => {
      log.collected = false;
      if (log.led) log.led.material.color.setHex(0xff4400);
      if (log.mesh) log.mesh.visible = true;
    });
  }
}

window.LEVELS = new LevelSystem();
