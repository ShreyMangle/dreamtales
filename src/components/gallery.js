/**
 * Art Gallery Exhibition Component
 * High-aesthetic digital exhibition wall showcasing all generated artwork, prompts, and lore
 */
export class GalleryView {
  constructor(container, stories, onSelectScene) {
    this.container = container;
    this.stories = stories;
    this.onSelectScene = onSelectScene;
    this.activeFilter = 'all';
    this.selectedModalArt = null;
  }

  render() {
    this.container.innerHTML = `
      <div class="gallery-container">
        <header class="gallery-header">
          <div class="gallery-title-group">
            <span class="badge-tag">Curated Archive</span>
            <h2 class="gallery-title">The Grand Exhibition</h2>
            <p class="gallery-subtitle">Explore high-resolution generative static artworks, creative prompts, and narrative lore across the anthology.</p>
          </div>

          <div class="gallery-filter-bar">
            <button class="filter-chip active" data-filter="all">All Masterpieces</button>
            <button class="filter-chip" data-filter="cosmic">Cosmic Odyssey</button>
            <button class="filter-chip" data-filter="aquatic">Sunken Abyss</button>
            <button class="filter-chip" data-filter="steampunk">Clockwork Solarpunk</button>
          </div>
        </header>

        <div class="gallery-grid" id="gallery-grid">
          ${this.renderArtCards()}
        </div>

        <div class="art-modal-backdrop" id="art-modal" style="display: none;">
          <div class="art-modal-content">
            <button class="modal-close-btn" id="modal-close" title="Close">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
            <div class="modal-body" id="modal-body"></div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  getAllArtPieces() {
    const list = [];
    this.stories.forEach(story => {
      story.scenes.forEach(scene => {
        list.push({
          ...scene,
          storyId: story.id,
          storyTitle: story.title,
          theme: story.theme,
          accentColor: story.accentColor
        });
      });
    });
    return list;
  }

  renderArtCards() {
    const pieces = this.getAllArtPieces().filter(p => this.activeFilter === 'all' || p.theme === this.activeFilter);

    return pieces.map(piece => `
      <article class="art-card" data-story="${piece.storyId}" data-scene="${piece.id}">
        <div class="art-card-media">
          <img src="${piece.image}" alt="${piece.title}" loading="lazy" />
          <div class="art-card-overlay">
            <button class="action-btn play-scene-btn" title="Launch Narrated Scene">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              <span>Experience</span>
            </button>
            <button class="action-btn inspect-art-btn" title="Inspect Prompt & Lore">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              <span>Inspect</span>
            </button>
          </div>
          <span class="chapter-badge">${piece.chapter}</span>
        </div>

        <div class="art-card-details">
          <div class="art-meta-row">
            <span class="story-tag" style="color: ${piece.accentColor};">${piece.storyTitle}</span>
          </div>
          <h3 class="art-card-title">${piece.title}</h3>
          <p class="art-card-snippet">${piece.narration.substring(0, 110)}...</p>

          <div class="art-card-footer">
            <div class="color-palette-dots">
              ${(piece.palette || []).map(c => `<span class="palette-dot" style="background: ${c};" title="${c}"></span>`).join('')}
            </div>
            <span class="aspect-ratio-tag">16:9 Cinema</span>
          </div>
        </div>
      </article>
    `).join('');
  }

  bindEvents() {
    const filterButtons = this.container.querySelectorAll('.filter-chip');
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeFilter = btn.dataset.filter;
        const grid = this.container.querySelector('#gallery-grid');
        if (grid) {
          grid.innerHTML = this.renderArtCards();
          this.bindCardEvents();
        }
      });
    });

    this.bindCardEvents();

    const modal = this.container.querySelector('#art-modal');
    const closeBtn = this.container.querySelector('#modal-close');
    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
      });
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
      });
    }
  }

  bindCardEvents() {
    const cards = this.container.querySelectorAll('.art-card');
    cards.forEach(card => {
      const storyId = card.dataset.story;
      const sceneId = card.dataset.scene;
      const piece = this.getAllArtPieces().find(p => p.storyId === storyId && p.id === sceneId);

      const playBtn = card.querySelector('.play-scene-btn');
      if (playBtn) {
        playBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (this.onSelectScene) this.onSelectScene(storyId, sceneId);
        });
      }

      const inspectBtn = card.querySelector('.inspect-art-btn');
      if (inspectBtn) {
        inspectBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.openInspectModal(piece);
        });
      }

      card.addEventListener('click', () => {
        this.openInspectModal(piece);
      });
    });
  }

  openInspectModal(piece) {
    if (!piece) return;
    const modal = this.container.querySelector('#art-modal');
    const body = this.container.querySelector('#modal-body');

    body.innerHTML = `
      <div class="modal-grid">
        <div class="modal-preview-wrapper">
          <img src="${piece.image}" alt="${piece.title}" class="modal-full-img" />
          <div class="modal-preview-controls">
            <button class="primary-pill-btn launch-experience-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              <span>Play Narrated Experience</span>
            </button>
          </div>
        </div>

        <div class="modal-info-panel">
          <div class="modal-meta-top">
            <span class="badge-tag" style="border-color: ${piece.accentColor}; color: ${piece.accentColor};">
              ${piece.storyTitle} • Chapter ${piece.chapter}
            </span>
            <span class="badge-tag">16:9 Ultra HD</span>
          </div>

          <h2 class="modal-art-title">${piece.title}</h2>

          <div class="modal-section">
            <h4 class="section-label">Spoken Narration</h4>
            <blockquote class="modal-narration">"${piece.narration}"</blockquote>
          </div>

          <div class="modal-section">
            <h4 class="section-label">Narrative Lore & Worldbuilding</h4>
            <p class="modal-lore">${piece.lore || 'Archived historical entry.'}</p>
          </div>

          <div class="modal-section">
            <div class="prompt-header-row">
              <h4 class="section-label">Generative AI Prompt</h4>
              <button class="copy-prompt-btn" id="copy-prompt-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                <span id="copy-text">Copy Prompt</span>
              </button>
            </div>
            <div class="modal-prompt-box">${piece.prompt}</div>
          </div>

          <div class="modal-section">
            <h4 class="section-label">Harmonic Color Palette</h4>
            <div class="modal-palette-row">
              ${(piece.palette || []).map(hex => `
                <div class="palette-swatch-item">
                  <div class="swatch-color" style="background: ${hex};"></div>
                  <span class="swatch-label">${hex}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;

    const copyBtn = body.querySelector('#copy-prompt-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(piece.prompt).then(() => {
          const txt = body.querySelector('#copy-text');
          txt.textContent = 'Copied!';
          setTimeout(() => { txt.textContent = 'Copy Prompt'; }, 2000);
        });
      });
    }

    const launchBtn = body.querySelector('.launch-experience-btn');
    if (launchBtn) {
      launchBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        if (this.onSelectScene) this.onSelectScene(piece.storyId, piece.id);
      });
    }

    modal.style.display = 'flex';
  }
}
