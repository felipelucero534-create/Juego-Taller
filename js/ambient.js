/* ═══════════════════════════════════════════════════════════════════════════
   VOID PROTOCOL — js/ambient.js
   Ambiente sonoro dinámico y eventos de horror por zona
   ═══════════════════════════════════════════════════════════════════════════ */

class AmbientHorrorSystem {
  constructor() {
    this.currentZone = 'eng';
    this.eventTimer = 0;
    this.nextEventIn = 8;
    this.enabled = false;
    this.fearLevel = 0;
  }

  start() {
    this.enabled = true;
    this.setZone('eng');
    this.scheduleNextEvent();
  }

  stop() {
    this.enabled = false;
    AUDIO.stopZoneAmbient?.();
    AUDIO.stopHeartbeat?.();
  }

  setZone(zoneKey) {
    if (!zoneKey || zoneKey === 'corridor') return;
    if (this.currentZone === zoneKey && this.enabled) return;
    this.currentZone = zoneKey;
    AUDIO.setZoneAmbient(zoneKey);
    this.scheduleNextEvent();

    if (zoneKey === 'medbay') {
      setTimeout(() => AUDIO.playMedbayThump(), UTILS.rand(1500, 4000));
    } else if (zoneKey === 'bridge') {
      setTimeout(() => AUDIO.playStaticBurst(), UTILS.rand(2000, 5000));
    }
  }

  scheduleNextEvent() {
    const ranges = {
      eng: [10, 22],
      medbay: [5, 14],
      bridge: [6, 16],
      escape: [8, 20],
      lab: [4, 10]
    };
    const [min, max] = ranges[this.currentZone] || [8, 18];
    this.nextEventIn = UTILS.rand(min, max);
    this.eventTimer = 0;
  }

  triggerZoneEvent() {
    const zone = this.currentZone;
    const roll = Math.random();

    if (zone === 'medbay') {
      if (roll < 0.35) AUDIO.playMedbayThump();
      else if (roll < 0.55) AUDIO.playDrip();
      else if (roll < 0.7) AUDIO.playMetalCreak();
      else if (roll < 0.82) AUDIO.playFlatlineBlip();
      else AUDIO.playDistantMoan();
    } else if (zone === 'eng') {
      if (roll < 0.4) AUDIO.playMetalCreak();
      else if (roll < 0.65) AUDIO.playSteamHiss();
      else if (roll < 0.8) AUDIO.playDistantFootsteps();
      else AUDIO.playSpark();
    } else if (zone === 'bridge') {
      if (roll < 0.3) AUDIO.playVoidWhisper();
      else if (roll < 0.5) AUDIO.playStaticBurst();
      else if (roll < 0.7) AUDIO.playMetalCreak();
      else AUDIO.playDistantScream();
    } else if (zone === 'escape') {
      AUDIO.playEscapeHum();
    } else if (zone === 'lab') {
      AUDIO.playVoidWhisper();
      if (roll > 0.5) AUDIO.playMedbayThump();
    } else {
      AUDIO.playMetalCreak();
    }

    this.scheduleNextEvent();
  }

  update(dt, playerPos) {
    if (!this.enabled || window.GAME.state !== 'PLAY') return;
    if (window.GAME.isTerminalOpen || window.GAME.isManualOpen || window.GAME.isLoreLogOpen) return;

    this.eventTimer += dt;
    if (this.eventTimer >= this.nextEventIn) {
      this.triggerZoneEvent();
    }

    let nearestEnemy = 999;
    window.GAME.enemies.forEach((e) => {
      if (e.mesh) nearestEnemy = Math.min(nearestEnemy, playerPos.distanceTo(e.mesh.position));
    });

    const healthFear = Math.max(0, (40 - PLAYER.health) / 40);
    const infectFear = Math.max(0, (PLAYER.infection - 30) / 70);
    const proxFear = nearestEnemy < 15 ? (15 - nearestEnemy) / 15 : 0;
    this.fearLevel = Math.min(1, healthFear * 0.4 + infectFear * 0.35 + proxFear * 0.5);

    AUDIO.updateHeartbeat(this.fearLevel);
    HUD.updateFearOverlay(this.fearLevel, nearestEnemy);

    if (nearestEnemy < 6 && Math.random() < 0.002) {
      AUDIO.playBreathing();
    }
  }
}

window.AMBIENT = new AmbientHorrorSystem();
