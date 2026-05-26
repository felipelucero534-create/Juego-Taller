/* ═══════════════════════════════════════════════════════════════════════════
   VOID PROTOCOL — js/manual.js
   Gestión del Codex / Manual educativo de HTML, CSS y JS integrado
   ═══════════════════════════════════════════════════════════════════════════ */

class ManualSystem {
  constructor() {
    this.windowEl = null;
    this.sidebarEl = null;
    this.contentEl = null;
    this.closeBtn = null;
    this.searchInput = null;
    this.activeTopicId = null;
    this.topicIndex = {};
  }

  buildIndex() {
    this.topicIndex = {};
    const sections = window.MANUAL_DATA?.sections || [];

    sections.forEach((section) => {
      section.entries.forEach((entry) => {
        this.topicIndex[entry.id] = { section, entry };
      });
    });
  }

  init() {
    this.windowEl = document.getElementById('manual-overlay');
    this.sidebarEl = document.getElementById('manual-sidebar-list');
    this.contentEl = document.getElementById('manual-content-view');
    this.closeBtn = document.getElementById('manual-btn-close');

    this.buildIndex();
    this.closeBtn.addEventListener('click', () => this.close());
    this.renderSidebar();
    this.setupSearch();
  }

  setupSearch() {
    const header = this.windowEl?.querySelector('.manual-header-controls');
    if (!header || header.querySelector('.manual-search')) return;

    const wrap = document.createElement('div');
    wrap.className = 'manual-search-wrap';

    this.searchInput = document.createElement('input');
    this.searchInput.type = 'search';
    this.searchInput.className = 'manual-search';
    this.searchInput.placeholder = 'Buscar tema...';
    this.searchInput.setAttribute('aria-label', 'Buscar en el manual');

    this.searchInput.addEventListener('input', () => {
      this.filterSidebar(this.searchInput.value.trim().toLowerCase());
    });

    wrap.appendChild(this.searchInput);
    header.insertBefore(wrap, this.closeBtn);
  }

  filterSidebar(query) {
    const groups = this.sidebarEl.querySelectorAll('.manual-category-group');
    groups.forEach((group) => {
      let visibleCount = 0;
      group.querySelectorAll('.manual-topic-item').forEach((item) => {
        const match = !query || item.textContent.toLowerCase().includes(query);
        item.style.display = match ? '' : 'none';
        if (match) visibleCount++;
      });
      group.style.display = visibleCount > 0 ? '' : 'none';
    });
  }

  renderSidebar() {
    if (!this.sidebarEl) return;
    this.sidebarEl.innerHTML = '';

    const sections = window.MANUAL_DATA?.sections || [];

    sections.forEach((section) => {
      const group = document.createElement('div');
      group.className = 'manual-category-group';

      const header = document.createElement('div');
      header.className = 'manual-category-header';
      header.style.borderLeftColor = section.color || 'var(--clr-success)';
      header.innerHTML = `<span class="manual-cat-icon">${section.icon || '■'}</span> ${section.title}`;
      group.appendChild(header);

      const list = document.createElement('ul');
      list.className = 'manual-topics-list';

      section.entries.forEach((entry) => {
        const li = document.createElement('li');
        li.className = 'manual-topic-item';
        li.textContent = entry.title;
        li.dataset.topicId = entry.id;
        li.style.setProperty('--topic-color', section.color || '#4e4');

        li.addEventListener('click', () => this.selectTopic(entry.id));
        list.appendChild(li);
      });

      group.appendChild(list);
      this.sidebarEl.appendChild(group);
    });
  }

  selectTopic(topicId) {
    AUDIO.playClick();
    this.activeTopicId = topicId;

    const data = this.topicIndex[topicId];
    if (!data) return;

    const { section, entry } = data;

    this.sidebarEl.querySelectorAll('.manual-topic-item').forEach((item) => {
      item.classList.toggle('active', item.dataset.topicId === topicId);
    });

    this.contentEl.innerHTML = '';

    const badge = document.createElement('div');
    badge.className = 'manual-section-badge';
    badge.style.color = section.color;
    badge.style.borderColor = section.color;
    badge.textContent = section.title.replace(/^[^\s]+\s/, '');
    this.contentEl.appendChild(badge);

    const title = document.createElement('h2');
    title.className = 'manual-concept-title';
    title.textContent = entry.title;
    this.contentEl.appendChild(title);

    const body = document.createElement('div');
    body.className = 'manual-concept-description';
    body.innerHTML = entry.content;
    this.contentEl.appendChild(body);

    this.contentEl.scrollTop = 0;
  }

  open() {
    this.windowEl.classList.add('active');
    window.GAME.isManualOpen = true;
    document.exitPointerLock();

    if (this.searchInput) {
      this.searchInput.value = '';
      this.filterSidebar('');
    }

    if (!this.activeTopicId) {
      const firstItem = this.sidebarEl.querySelector('.manual-topic-item');
      if (firstItem) {
        this.selectTopic(firstItem.dataset.topicId);
      }
    } else {
      this.selectTopic(this.activeTopicId);
    }
  }

  openAtTopic(topicId) {
    this.activeTopicId = topicId;
    this.open();
  }

  close() {
    AUDIO.playClick();
    this.windowEl.classList.remove('active');
    window.GAME.isManualOpen = false;

    const canvas = document.getElementById('game-canvas');
    if (PLAYER.alive && !window.GAME.isTerminalOpen && window.GAME.state === 'PLAY') {
      canvas.requestPointerLock();
    }
  }
}

window.MANUAL = new ManualSystem();

