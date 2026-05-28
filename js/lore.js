/* ═══════════════════════════════════════════════════════════════════════════
   VOID PROTOCOL — js/lore.js
   Cinemáticas, registros de audio coleccionables y narrativa
   ═══════════════════════════════════════════════════════════════════════════ */

class LoreSystem {
  constructor() {
    this.overlay = null;
    this.titleEl = null;
    this.subtitleEl = null;
    this.textEl = null;
    this.portraitEl = null;
    this.nextBtn = null;
    this.skipBtn = null;
    this.dotsContainer = null;
    this.chapterLabelEl = null;

    this.logOverlay = null;
    this.currentCutscene = null;
    this.currentIndex = 0;
    this.typingTimeout = null;
    this.isTyping = false;
    this.resolveCallback = null;
  }

  init() {
    this.overlay = document.getElementById('cutscene-overlay');
    this.titleEl = this.overlay.querySelector('.cutscene-title');
    this.subtitleEl = this.overlay.querySelector('.cutscene-subtitle');
    this.textEl = this.overlay.querySelector('.cutscene-text');
    this.portraitEl = this.overlay.querySelector('.cutscene-portrait');
    this.nextBtn = this.overlay.querySelector('.btn-next');
    this.skipBtn = this.overlay.querySelector('.cutscene-skip');
    this.dotsContainer = this.overlay.querySelector('.cutscene-dots');
    this.chapterLabelEl = this.overlay.querySelector('.cutscene-chapter-label');

    this.logOverlay = document.getElementById('lore-log-overlay');

    this.nextBtn.addEventListener('click', () => this.onNextClick());
    this.skipBtn.addEventListener('click', () => this.skipCutscene());

    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && this.overlay.classList.contains('active')) {
        e.preventDefault();
        this.onNextClick();
      }
      if (e.code === 'Escape' && this.logOverlay?.classList.contains('active')) {
        this.closeAudioLog();
      }
    });

    const logClose = document.getElementById('lore-log-close');
    if (logClose) logClose.addEventListener('click', () => this.closeAudioLog());
  }

  playCutscene(cutsceneId) {
    return new Promise((resolve) => {
      this.resolveCallback = resolve;
      if (!window.LORE_DATA?.cutscenes?.[cutsceneId]) {
        resolve();
        return;
      }

      // Liberar el cursor durante la cinemática
      if (document.pointerLockElement) {
        document.exitPointerLock();
      }

      this.currentCutscene = window.LORE_DATA.cutscenes[cutsceneId];
      this.currentIndex = 0;
      this.overlay.classList.add('active');

      if (this.chapterLabelEl) {
        this.chapterLabelEl.textContent = this.currentCutscene.chapterLabel || 'REGISTRO DE TRANSMISIÓN';
      }

      this.setupDots();
      this.showSlide(0);
    });
  }

  setupDots() {
    if (!this.dotsContainer || !this.currentCutscene) return;
    this.dotsContainer.innerHTML = '';
    this.currentCutscene.slides.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.className = `cutscene-dot ${i === 0 ? 'active' : ''}`;
      this.dotsContainer.appendChild(dot);
    });
  }

  getPortraitEmoji(image, isNXVL) {
    if (isNXVL) return '👾';
    const map = {
      aria_normal: '👩‍🚀', aria_worried: '😰', aria_scared: '😨',
      aria_determined: '😤', aria_running: '🏃‍♀️', aria_reading: '📖',
      aria_escape: '🚀', sporewalker_warning: '☣️', nxvl_glimpse: '🌌'
    };
    return map[image] || '👩‍🚀';
  }

  showSlide(index) {
    if (this.typingTimeout) clearTimeout(this.typingTimeout);
    this.isTyping = true;

    const slide = this.currentCutscene.slides[index];
    const isNXVL = this.currentCutscene.character === 'nxvl';

    this.portraitEl.textContent = this.getPortraitEmoji(slide.image, isNXVL);
    this.portraitEl.className = isNXVL ? 'cutscene-portrait nxvl-portrait' : 'cutscene-portrait';

    if (isNXVL) {
      this.titleEl.textContent = 'NXVL-0';
      this.titleEl.style.color = 'var(--clr-nxvl)';
      this.subtitleEl.style.color = 'var(--clr-nxvl)';
    } else {
      this.titleEl.textContent = 'ARIA-7';
      this.titleEl.style.color = 'var(--clr-text-bright)';
      this.subtitleEl.style.color = 'var(--clr-accent)';
    }

    this.subtitleEl.textContent = slide.title || '';
    this.textEl.textContent = '';

    const text = slide.text.replace(/\\n/g, '\n');
    let charIdx = 0;

    const typeChar = () => {
      if (charIdx < text.length) {
        this.textEl.textContent += text.charAt(charIdx);
        charIdx++;
        if (charIdx % 4 === 0) AUDIO.playRadioChatter();
        this.typingTimeout = setTimeout(typeChar, 18);
      } else {
        this.isTyping = false;
        this.nextBtn.textContent = index === this.currentCutscene.slides.length - 1 ? 'CONTINUAR' : 'SIGUIENTE';
      }
    };
    typeChar();

    this.dotsContainer?.querySelectorAll('.cutscene-dot').forEach((dot, idx) => {
      dot.classList.toggle('active', idx === index);
    });
  }

  onNextClick() {
    AUDIO.playClick();
    if (this.isTyping) {
      clearTimeout(this.typingTimeout);
      const slide = this.currentCutscene.slides[this.currentIndex];
      this.textEl.textContent = slide.text.replace(/\\n/g, '\n');
      this.isTyping = false;
      this.nextBtn.textContent = this.currentIndex === this.currentCutscene.slides.length - 1 ? 'CONTINUAR' : 'SIGUIENTE';
      return;
    }

    this.currentIndex++;
    if (this.currentIndex < this.currentCutscene.slides.length) {
      this.showSlide(this.currentIndex);
    } else {
      this.endCutscene();
    }
  }

  skipCutscene() {
    AUDIO.playClick();
    clearTimeout(this.typingTimeout);
    this.endCutscene();
  }

  endCutscene() {
    this.overlay.classList.remove('active');
    const resolve = this.resolveCallback;
    this.resolveCallback = null;
    if (resolve) {
      resolve();
    }

    // Auto-solicitar Pointer Lock al volver al juego
    setTimeout(() => {
      if (
        window.GAME &&
        window.GAME.state === 'PLAY' &&
        !window.GAME.isTerminalOpen &&
        !window.GAME.isManualOpen &&
        !this.overlay.classList.contains('active')
      ) {
        const canvas = document.getElementById('game-canvas');
        if (canvas && PLAYER.alive) {
          canvas.requestPointerLock();
        }
      }
    }, 100);
  }

  playAudioLog(logId) {
    const data = window.LORE_DATA?.audioLogs?.[logId];
    if (!data || !this.logOverlay) return;

    document.getElementById('lore-log-title').textContent = data.title;
    document.getElementById('lore-log-date').textContent = data.date;
    document.getElementById('lore-log-location').textContent = data.location || '';
    document.getElementById('lore-log-speaker').textContent = data.speaker;
    document.getElementById('lore-log-body').textContent = data.text.replace(/\\n/g, '\n');

    this.logOverlay.classList.add('active');
    window.GAME.isLoreLogOpen = true;
    document.exitPointerLock();
    AUDIO.playRadioChatter();
  }

  closeAudioLog() {
    if (!this.logOverlay) return;
    AUDIO.playClick();
    this.logOverlay.classList.remove('active');
    window.GAME.isLoreLogOpen = false;

    const canvas = document.getElementById('game-canvas');
    if (PLAYER.alive && !window.GAME.isTerminalOpen && !window.GAME.isManualOpen && window.GAME.state === 'PLAY') {
      canvas.requestPointerLock();
    }
  }

  getRandomDeathMessage(cause) {
    const pool = window.LORE_DATA?.deathMessages?.[cause] || window.LORE_DATA?.deathMessages?.myco;
    if (!pool?.length) return null;
    return pool[UTILS.randInt(0, pool.length - 1)];
  }
}

window.LORE = new LoreSystem();

