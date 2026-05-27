/* ═══════════════════════════════════════════════════════════════════════════
   VOID PROTOCOL — js/audio.js
   Gestión de sonido y síntesis de efectos mediante Web Audio API
   ═══════════════════════════════════════════════════════════════════════════ */

class AudioSystem {
  constructor() {
    this.ctx = null;
    this.masterVolume = null;
    this.ambientOsc = null;
    this.ambientGain = null;
    this.zoneNoise = null;
    this.zoneGain = null;
    this.heartbeatOsc = null;
    this.heartbeatGain = null;
    this.heartbeatLfo = null;
    this.currentZone = 'eng';
    this.isMuted = false;
  }

  // Inicializa el contexto de audio (debe ser tras una interacción de usuario)
  init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContextClass();

    this.masterVolume = this.ctx.createGain();
    this.masterVolume.gain.setValueAtTime(0.5, this.ctx.currentTime);
    this.masterVolume.connect(this.ctx.destination);

    this.startAmbient();
  }

  // Reproduce un beep genérico
  playClick() {
    if (!this.ctx) this.init();
    if (this.isMuted) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(this.masterVolume);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  // Sonido de tipeo en la terminal
  playType() {
    if (!this.ctx) this.init();
    if (this.isMuted) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(UTILS.rand(600, 1000), this.ctx.currentTime);
    gain.gain.setValueAtTime(UTILS.rand(0.02, 0.05), this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03);

    osc.connect(gain);
    gain.connect(this.masterVolume);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.03);
  }

  // Sonido de éxito en desafío
  playAccessGranted() {
    if (!this.ctx) this.init();
    if (this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'sine';

    osc1.frequency.setValueAtTime(523.25, now); // C5
    osc1.frequency.setValueAtTime(659.25, now + 0.15); // E5
    osc2.frequency.setValueAtTime(783.99, now + 0.3); // G5

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.setValueAtTime(0.2, now + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.masterVolume);

    osc1.start(now);
    osc1.stop(now + 0.45);
    osc2.start(now + 0.15);
    osc2.stop(now + 0.6);
  }

  // Sonido de error en desafío (Zumbido rojo)
  playAccessDenied() {
    if (!this.ctx) this.init();
    if (this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.linearRampToValueAtTime(80, now + 0.4);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc.connect(gain);
    gain.connect(this.masterVolume);

    osc.start(now);
    osc.stop(now + 0.5);
  }

  // Sirena de alarma (se reproduce cuando salta la pantalla roja)
  playAlarm() {
    if (!this.ctx) this.init();
    if (this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.linearRampToValueAtTime(600, now + 0.3);
    osc.frequency.linearRampToValueAtTime(400, now + 0.6);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.linearRampToValueAtTime(0.15, now + 0.5);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

    osc.connect(gain);
    gain.connect(this.masterVolume);

    osc.start(now);
    osc.stop(now + 0.65);
  }

  // Puerta abriéndose
  playDoorOpen() {
    if (!this.ctx) this.init();
    if (this.isMuted) return;

    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 1.5; // 1.5 segundos
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Ruido blanco
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noiseNode = this.ctx.createBufferSource();
    noiseNode.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(100, now);
    filter.frequency.exponentialRampToValueAtTime(800, now + 0.5);
    filter.frequency.exponentialRampToValueAtTime(100, now + 1.5);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

    noiseNode.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterVolume);

    noiseNode.start(now);
    noiseNode.stop(now + 1.5);
  }

  // Rugido del zombi (MYCO-X) - sonido clásico
  playZombieGrowl() {
    if (!this.ctx) this.init();
    if (this.isMuted) return;

    const now = this.ctx.currentTime;
    const duration = UTILS.rand(0.6, 1.2);
    const osc = this.ctx.createOscillator();
    const mod = this.ctx.createOscillator();
    const modGain = this.ctx.createGain();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(UTILS.rand(60, 90), now);
    osc.frequency.linearRampToValueAtTime(UTILS.rand(30, 50), now + duration);

    mod.type = 'sine';
    mod.frequency.setValueAtTime(UTILS.rand(30, 50), now);
    modGain.gain.setValueAtTime(120, now); // Amplitud de modulación de frecuencia

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(300, now);
    filter.frequency.exponentialRampToValueAtTime(120, now + duration);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    mod.connect(modGain);
    modGain.connect(osc.frequency);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterVolume);

    mod.start(now);
    osc.start(now);
    mod.stop(now + duration);
    osc.stop(now + duration);
  }

  // Grito de ataque del zombi - sonido agudo terrorífico
  playZombieScream() {
    if (!this.ctx) this.init();
    if (this.isMuted) return;

    const now = this.ctx.currentTime;
    const duration = UTILS.rand(0.4, 0.8);
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'square';
    osc.frequency.setValueAtTime(UTILS.rand(200, 280), now);
    osc.frequency.linearRampToValueAtTime(UTILS.rand(150, 200), now + duration);

    filter.type = 'highpass';
    filter.frequency.setValueAtTime(200, now);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterVolume);

    osc.start(now);
    osc.stop(now + duration);
  }

  // Bufido/silbido de zombi infuriado
  playZombieHiss() {
    if (!this.ctx) this.init();
    if (this.isMuted) return;

    const now = this.ctx.currentTime;
    const duration = UTILS.rand(0.3, 0.6);
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Ruido blanco filtrado
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.5;
    }

    const noiseNode = this.ctx.createBufferSource();
    noiseNode.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1500, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noiseNode.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterVolume);

    noiseNode.start(now);
    noiseNode.stop(now + duration);
  }

  // Sonido de impacto / Golpe
  playImpact() {
    if (!this.ctx) this.init();
    if (this.isMuted) return;

    const now = this.ctx.currentTime;
    const duration = 0.15;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + duration);

    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(this.masterVolume);

    osc.start(now);
    osc.stop(now + duration);
  }

  // Sonido de pasos del jugador - ligero y metálico
  playFootstep() {
    if (!this.ctx) this.init();
    if (this.isMuted) return;

    const now = this.ctx.currentTime;
    const duration = 0.1;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(UTILS.rand(80, 120), now);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(this.masterVolume);

    osc.start(now);
    osc.stop(now + duration);
  }

  // Sonido de puerta cerrándose (cierre rápido)
  playDoorClose() {
    if (!this.ctx) this.init();
    if (this.isMuted) return;

    const now = this.ctx.currentTime;
    const duration = 0.8;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + duration);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(500, now);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterVolume);

    osc.start(now);
    osc.stop(now + duration);
  }

  // Sonido de terminal encendiéndose
  playTerminalBoot() {
    if (!this.ctx) this.init();
    if (this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.linearRampToValueAtTime(1200, now + 0.3);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.linearRampToValueAtTime(0.15, now + 0.25);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(this.masterVolume);

    osc.start(now);
    osc.stop(now + 0.3);
  }

  // Sonido de infección progresando
  playInfectionSound() {
    if (!this.ctx) this.init();
    if (this.isMuted) return;

    const now = this.ctx.currentTime;
    const duration = 0.5;
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Ruido oscuro y gotoso
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.sin(i / 1000) * Math.random()) * 0.7;
    }

    const noiseNode = this.ctx.createBufferSource();
    noiseNode.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(200, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noiseNode.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterVolume);

    noiseNode.start(now);
    noiseNode.stop(now + duration);
  }

  // Sonido de curación / cura médica
  playHeal() {
    if (!this.ctx) this.init();
    if (this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'sine';

    osc1.frequency.setValueAtTime(440, now);
    osc2.frequency.setValueAtTime(660, now);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.masterVolume);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.4);
    osc2.stop(now + 0.4);
  }

  // Sonido de teleportación / Portal
  playPortal() {
    if (!this.ctx) this.init();
    if (this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.4);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(gain);
    gain.connect(this.masterVolume);

    osc.start(now);
    osc.stop(now + 0.4);
  }

  // Sonido de ataque / Muerte
  playDeathSound() {
    if (!this.ctx) this.init();
    if (this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 1.2);

    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    osc.connect(gain);
    gain.connect(this.masterVolume);

    osc.start(now);
    osc.stop(now + 1.2);
  }

  // Voz de radio estática para cutscenes (chatter)
  playRadioChatter() {
    if (!this.ctx) this.init();
    if (this.isMuted) return;

    const now = this.ctx.currentTime;
    const duration = UTILS.rand(0.1, 0.25);
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(UTILS.rand(150, 300), now);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1000, now);
    filter.Q.setValueAtTime(10, now);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterVolume);

    osc.start(now);
    osc.stop(now + duration);
  }

  // Inicia sonido ambiente base de la nave
  startAmbient() {
    if (this.ambientOsc) return;

    const now = this.ctx.currentTime;
    this.ambientOsc = this.ctx.createOscillator();
    this.ambientGain = this.ctx.createGain();
    this.ambientOsc.type = 'triangle';
    this.ambientOsc.frequency.setValueAtTime(42, now);

    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.frequency.setValueAtTime(0.15, now);
    lfoGain.gain.setValueAtTime(3, now);
    lfo.connect(lfoGain);
    lfoGain.connect(this.ambientOsc.frequency);

    this.ambientGain.gain.setValueAtTime(0.08, now);
    this.ambientOsc.connect(this.ambientGain);
    this.ambientGain.connect(this.masterVolume);
    lfo.start(now);
    this.ambientOsc.start(now);

    this._createZoneNoiseLayer();
    this.setZoneAmbient('eng');
  }

  _createZoneNoiseLayer() {
    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.5;

    this.zoneNoise = this.ctx.createBufferSource();
    this.zoneNoise.buffer = buffer;
    this.zoneNoise.loop = true;
    this.zoneGain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(180, now);
    filter.Q.setValueAtTime(0.8, now);

    this.zoneNoise.connect(filter);
    filter.connect(this.zoneGain);
    this.zoneGain.connect(this.masterVolume);
    this.zoneGain.gain.setValueAtTime(0.04, now);
    this.zoneNoise.start(now);
  }

  setZoneAmbient(zone) {
    if (!this.ctx) return;
    this.currentZone = zone;
    const now = this.ctx.currentTime;
    const profiles = {
      eng:     { freq: 48,  noise: 0.035, filter: 120,  vol: 0.07 },
      medbay:  { freq: 38,  noise: 0.055, filter: 280,  vol: 0.09 },
      bridge:  { freq: 55,  noise: 0.045, filter: 400,  vol: 0.08 },
      escape:  { freq: 62,  noise: 0.025, filter: 200,  vol: 0.06 },
      lab:     { freq: 32,  noise: 0.07,  filter: 90,   vol: 0.11 },
      corridor:{ freq: 44,  noise: 0.04,  filter: 160,  vol: 0.075 }
    };
    const p = profiles[zone] || profiles.corridor;
    if (this.ambientOsc) {
      this.ambientOsc.frequency.linearRampToValueAtTime(p.freq, now + 2);
      this.ambientGain.gain.linearRampToValueAtTime(p.vol, now + 2);
    }
    if (this.zoneGain) {
      this.zoneGain.gain.linearRampToValueAtTime(p.noise, now + 2);
    }
  }

  stopZoneAmbient() {
    if (this.zoneGain) this.zoneGain.gain.setValueAtTime(0, this.ctx.currentTime);
  }

  _playNoiseBurst(duration, filterFreq, volume, type = 'lowpass') {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const bufferSize = Math.floor(this.ctx.sampleRate * duration);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const src = this.ctx.createBufferSource();
    src.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = type;
    filter.frequency.setValueAtTime(filterFreq, now);
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    src.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterVolume);
    src.start(now);
    src.stop(now + duration);
  }

  playMedbayThump() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(80, now);
    osc.frequency.exponentialRampToValueAtTime(35, now + 0.25);
    gain.gain.setValueAtTime(0.45, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc.connect(gain);
    gain.connect(this.masterVolume);
    osc.start(now);
    osc.stop(now + 0.35);
    setTimeout(() => this._playNoiseBurst(0.15, 200, 0.12, 'lowpass'), 80);
  }

  playDrip() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.frequency.setValueAtTime(900, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.08);
    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc.connect(gain);
    gain.connect(this.masterVolume);
    osc.start(now);
    osc.stop(now + 0.12);
  }

  playMetalCreak() {
    this._playNoiseBurst(1.2, 800, 0.08, 'bandpass');
  }

  playFlatlineBlip() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    for (let i = 0; i < 3; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + i * 0.9;
      osc.frequency.setValueAtTime(880, t);
      gain.gain.setValueAtTime(0.07, t);
      gain.gain.setValueAtTime(0.07, t + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
      osc.connect(gain);
      gain.connect(this.masterVolume);
      osc.start(t);
      osc.stop(t + 0.15);
    }
  }

  playVoidWhisper() {
    this._playNoiseBurst(2.5, 1200, 0.06, 'highpass');
  }

  playDistantMoan() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.linearRampToValueAtTime(70, now + 1.5);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);
    osc.connect(gain);
    gain.connect(this.masterVolume);
    osc.start(now);
    osc.stop(now + 1.8);
  }

  playDistantScream() {
    this.playZombieScream();
    setTimeout(() => this._playNoiseBurst(0.5, 600, 0.05, 'bandpass'), 200);
  }

  playSteamHiss() {
    this._playNoiseBurst(0.8, 2000, 0.05, 'highpass');
  }

  playSpark() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(UTILS.rand(2000, 4000), now);
    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    osc.connect(gain);
    gain.connect(this.masterVolume);
    osc.start(now);
    osc.stop(now + 0.05);
  }

  playDistantFootsteps() {
    for (let i = 0; i < 4; i++) {
      setTimeout(() => this.playFootstep(), i * 350 + UTILS.rand(0, 100));
    }
  }

  playStaticBurst() {
    this._playNoiseBurst(0.4, 1500, 0.1, 'bandpass');
  }

  playEscapeHum() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.frequency.setValueAtTime(110, now);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
    osc.connect(gain);
    gain.connect(this.masterVolume);
    osc.start(now);
    osc.stop(now + 1.5);
  }

  playBreathing() {
    this._playNoiseBurst(0.6, 300, 0.04, 'bandpass');
  }

  updateHeartbeat(fearLevel) {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    if (fearLevel < 0.15) {
      if (this.heartbeatGain) {
        this.heartbeatGain.gain.linearRampToValueAtTime(0, now + 0.3);
      }
      return;
    }

    if (!this.heartbeatOsc) {
      this.heartbeatOsc = this.ctx.createOscillator();
      this.heartbeatGain = this.ctx.createGain();
      this.heartbeatLfo = this.ctx.createOscillator();
      const lfoG = this.ctx.createGain();
      this.heartbeatOsc.type = 'sine';
      this.heartbeatOsc.frequency.setValueAtTime(55, now);
      this.heartbeatLfo.frequency.setValueAtTime(1.2, now);
      lfoG.gain.setValueAtTime(20, now);
      this.heartbeatLfo.connect(lfoG);
      lfoG.connect(this.heartbeatOsc.frequency);
      this.heartbeatOsc.connect(this.heartbeatGain);
      this.heartbeatGain.connect(this.masterVolume);
      this.heartbeatLfo.start(now);
      this.heartbeatOsc.start(now);
    }

    const bpm = 60 + fearLevel * 80;
    this.heartbeatLfo.frequency.linearRampToValueAtTime(bpm / 60, now + 0.5);
    this.heartbeatGain.gain.linearRampToValueAtTime(0.04 + fearLevel * 0.12, now + 0.3);
  }

  stopHeartbeat() {
    if (this.heartbeatGain && this.ctx) {
      this.heartbeatGain.gain.setValueAtTime(0, this.ctx.currentTime);
    }
  }

  // Cambia el estado de silencio
  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterVolume) {
      this.masterVolume.gain.setValueAtTime(this.isMuted ? 0 : 0.4, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  // Sonido de clic mecánico para encendido/apagado de linterna
  playFlashlightToggle() {
    if (!this.ctx) this.init();
    if (this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1000, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.04);

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.masterVolume);

    osc.start(now);
    osc.stop(now + 0.04);
  }
}

window.AUDIO = new AudioSystem();
