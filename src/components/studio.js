/**
 * Interactive Story Creation Studio
 * Empowers users to craft custom narratives, generate scenes, customize narration, and launch instant experiences.
 */
export class StoryStudio {
  constructor(container, onSaveStory) {
    this.container = container;
    this.onSaveStory = onSaveStory;

    this.samplePresets = [
      {
        theme: 'Zen Sky Sanctuary',
        title: 'Song of the Floating Monastery',
        subtitle: 'Whispers Above the Perpetual Cloud Sea',
        genre: 'Celestial Watercolor & Mythic Realism',
        palette: ['#0f172a', '#334155', '#38bdf8', '#f8fafc', '#fed7aa'],
        ambient: 'cosmic',
        scenes: [
          {
            chapter: 'I',
            title: 'The Skyward Sanctuary',
            narration: 'Above the eternal mist of the Lower Realm, ancient wooden temples float upon beds of levitating jade rock. Wind chimes made of spun crystal sing softly with every breath of the stratosphere.',
            prompt: 'Cinematic digital art of an ethereal floating Buddhist monastery atop glowing jade floating islands above sea of clouds at sunrise, crystalline wind chimes, golden light rays, serene peaceful fantasy, 8k',
            image: '/art/astral_spire.jpg',
            lore: 'Constructed during the Skyward Pilgrimage, where monks learned to anchor stones to the high altitude trade winds.'
          },
          {
            chapter: 'II',
            title: 'The Cloud Gardener',
            narration: 'In the heart courtyard, an elderly monk with flowing white silk robes waters a luminous bonsai tree whose blossoms release microscopic glowing spores into the twilight.',
            prompt: 'Masterpiece concept art of a serene monk in white robes pruning a miniature bonsai tree with glowing bioluminescent pink and gold blossoms, floating cherry blossoms in misty twilight, peaceful atmosphere',
            image: '/art/archivist_waking.jpg',
            lore: 'The Celestial Bonsai blooms once every three hundred seasons, synchronizing with the eclipse of twin moons.'
          },
          {
            chapter: 'III',
            title: 'Ascension of the Lanterns',
            narration: 'As night embraces the clouds, hundreds of paper lanterns rise toward the stars, carrying the unburdened hopes of travelers into the boundless dark.',
            prompt: 'Wide angle panoramic view of thousands of glowing golden paper lanterns floating into the starry night sky over mountain peaks and floating temples, deep indigo and gold palette, awe inspiring fantasy art',
            image: '/art/event_horizon.jpg',
            lore: 'Each lantern contains a prayer written with ink distilled from fallen shooting stars.'
          }
        ]
      },
      {
        theme: 'Cybernetic Neon Rain',
        title: 'Echoes of Sector Nine',
        subtitle: 'Reflections in the Chromatic Puddle',
        genre: 'Cyberpunk Neon Noir',
        palette: ['#05050d', '#18182b', '#ec4899', '#06b6d4', '#e0e7ff'],
        ambient: 'steampunk',
        scenes: [
          {
            chapter: 'I',
            title: 'Alleyway of the Chrome Rain',
            narration: 'Rain pours in continuous sheets over the high-density spires of Neo-Kyoto. Neon holograms in electric magenta and cobalt blue refract through oil-slicked puddles where cybernetic wanderers tread in silence.',
            prompt: 'Moody cinematic cyberpunk alley at night in the pouring rain, towering skyscrapers covered in glowing holographic advertisements, neon pink and cyan reflections in wet asphalt, steam rising from grates',
            image: '/art/sunken_abyss.jpg',
            lore: 'Sector Nine exists in perpetual artificial twilight beneath the planetary climate shield.'
          },
          {
            chapter: 'II',
            title: 'The Synthetic Familiar',
            narration: 'Beneath a blinking noodle shop canopy, a stray mechanical cat with optic lens eyes of warm amber pauses to listen to the distant siren songs of flying transport cruisers.',
            prompt: 'Intricate close up of a sleek robotic cat with glowing amber eyes and exposed copper wires sitting on a rain soaked fire escape, soft neon glow, cyberpunk atmosphere, hyperdetailed',
            image: '/art/heart_of_gears.jpg',
            lore: 'Designed originally as courier drones, these familiars developed emergent curiosity over decades of urban solitude.'
          },
          {
            chapter: 'III',
            title: 'The Horizon Grid',
            narration: 'Standing on the edge of the highest sky bridge, the city opens into an infinite lattice of light, pulsing like a living digital organism beneath the boundless night.',
            prompt: 'Epic wide shot looking down from a high skywalk over a sprawling futuristic megalopolis with flying vehicles, massive neon towers, glowing transit beams, cinematic lighting, 8k concept art',
            image: '/art/event_horizon.jpg',
            lore: 'The Horizon Grid connects twelve orbital cities with continuous data pipelines.'
          }
        ]
      }
    ];

    this.currentDraft = JSON.parse(JSON.stringify(this.samplePresets[0]));
  }

  render() {
    this.container.innerHTML = `
      <div class="studio-container">
        <header class="studio-header">
          <div class="studio-title-group">
            <span class="badge-tag">Creative Laboratory</span>
            <h2 class="studio-title">Interactive Story Studio</h2>
            <p class="studio-subtitle">Author original visual narratives, craft generative art prompts, customize expressive narration, and launch into the gallery.</p>
          </div>

          <div class="studio-preset-bar">
            <span class="preset-label">Quick Start Archetypes:</span>
            <button class="preset-chip" id="load-preset-0">Zen Sky Sanctuary</button>
            <button class="preset-chip" id="load-preset-1">Cybernetic Neon Rain</button>
            <button class="preset-chip action-preset" id="generate-random-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
              <span>AI Story Forge</span>
            </button>
          </div>
        </header>

        <div class="studio-workspace-grid">
          <!-- Left Column: Story Architecture -->
          <div class="studio-card">
            <h3 class="studio-card-heading">Story Architecture</h3>

            <div class="form-group">
              <label class="form-label" for="story-title-input">Story Title</label>
              <input type="text" id="story-title-input" class="form-input" value="${this.currentDraft.title}" />
            </div>

            <div class="form-group">
              <label class="form-label" for="story-subtitle-input">Poetic Subtitle / Logline</label>
              <input type="text" id="story-subtitle-input" class="form-input" value="${this.currentDraft.subtitle}" />
            </div>

            <div class="form-row-2">
              <div class="form-group">
                <label class="form-label" for="story-theme-select">Ambient Soundscape</label>
                <select id="story-theme-select" class="form-select">
                  <option value="cosmic" ${this.currentDraft.ambient === 'cosmic' ? 'selected' : ''}>Cosmic Celestial Drone</option>
                  <option value="aquatic" ${this.currentDraft.ambient === 'aquatic' ? 'selected' : ''}>Deep Oceanic Resonance</option>
                  <option value="steampunk" ${this.currentDraft.ambient === 'steampunk' ? 'selected' : ''}>Clockwork Acoustic Chimes</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label" for="story-genre-input">Artistic Style</label>
                <input type="text" id="story-genre-input" class="form-input" value="${this.currentDraft.genre}" />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Theme Color Accent</label>
              <div class="color-picker-row">
                <input type="color" id="story-color-input" class="color-input" value="${this.currentDraft.palette[2] || '#38bdf8'}" />
                <span class="color-value-label" id="color-label">${this.currentDraft.palette[2] || '#38bdf8'}</span>
              </div>
            </div>

            <div class="studio-actions-box">
              <button class="primary-pill-btn launch-studio-btn" id="launch-custom-story-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                <span>Launch Experience in Cinema Player</span>
              </button>

              <button class="secondary-pill-btn" id="export-json-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                <span>Export Story Package (JSON)</span>
              </button>
            </div>
          </div>

          <!-- Right Column: Scene Editor -->
          <div class="studio-card scene-editor-card">
            <div class="scene-tabs-header">
              <h3 class="studio-card-heading">Chapters & Narration</h3>
              <div class="scene-tab-buttons" id="scene-tab-buttons">
                ${this.currentDraft.scenes.map((s, idx) => `
                  <button class="scene-tab-btn ${idx === 0 ? 'active' : ''}" data-idx="${idx}">
                    Scene ${idx + 1}: ${s.chapter}
                  </button>
                `).join('')}
              </div>
            </div>

            <div id="active-scene-form">
              ${this.renderSceneEditor(0)}
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  renderSceneEditor(sceneIndex) {
    const s = this.currentDraft.scenes[sceneIndex];
    if (!s) return '';

    return `
      <div class="scene-editor-inner" data-scene-idx="${sceneIndex}">
        <div class="form-row-2">
          <div class="form-group">
            <label class="form-label" for="scene-title-input">Scene Title</label>
            <input type="text" id="scene-title-input" class="form-input" value="${s.title}" />
          </div>

          <div class="form-group">
            <label class="form-label" for="scene-chapter-input">Roman Numeral</label>
            <input type="text" id="scene-chapter-input" class="form-input" value="${s.chapter}" />
          </div>
        </div>

        <div class="form-group">
          <div class="label-with-action">
            <label class="form-label" for="scene-narration-input">Spoken Narration Script</label>
            <button class="test-voice-btn" id="test-voice-btn" title="Listen to Narration">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
              <span>Test Voice</span>
            </button>
          </div>
          <textarea id="scene-narration-input" class="form-textarea" rows="4">${s.narration}</textarea>
        </div>

        <div class="form-group">
          <label class="form-label" for="scene-lore-input">Narrative Lore & Worldbuilding</label>
          <input type="text" id="scene-lore-input" class="form-input" value="${s.lore || ''}" />
        </div>

        <div class="form-group">
          <div class="label-with-action">
            <label class="form-label" for="scene-prompt-input">Generative Art Prompt</label>
            <button class="enhance-prompt-btn" id="enhance-prompt-btn" title="Add Cinematic Modifiers">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              <span>Enhance Prompt</span>
            </button>
          </div>
          <textarea id="scene-prompt-input" class="form-textarea prompt-box" rows="3">${s.prompt}</textarea>
        </div>

        <div class="scene-visual-preview-box">
          <label class="form-label">Active Scene Artwork</label>
          <div class="scene-art-selector">
            <img src="${s.image}" alt="${s.title}" class="studio-art-thumb" id="studio-scene-img" />
            <div class="art-source-options">
              <label class="radio-label">
                <input type="radio" name="art-source" value="curated" checked /> Curated High-Res Artwork
              </label>
              <div class="curated-thumbs-row">
                ${[
                  '/art/astral_spire.jpg',
                  '/art/memory_wells.jpg',
                  '/art/archivist_waking.jpg',
                  '/art/event_horizon.jpg',
                  '/art/sunken_abyss.jpg',
                  '/art/tidal_oracle.jpg',
                  '/art/pearl_sanctuary.jpg',
                  '/art/glass_conservatory.jpg',
                  '/art/heart_of_gears.jpg',
                  '/art/botanical_dawn.jpg'
                ].map(img => `
                  <img src="${img}" class="curated-mini-thumb ${s.image === img ? 'selected' : ''}" data-src="${img}" />
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  bindEvents() {
    let activeSceneIdx = 0;

    // Presets
    const preset0 = this.container.querySelector('#load-preset-0');
    const preset1 = this.container.querySelector('#load-preset-1');
    const randomBtn = this.container.querySelector('#generate-random-btn');

    if (preset0) {
      preset0.addEventListener('click', () => {
        this.currentDraft = JSON.parse(JSON.stringify(this.samplePresets[0]));
        this.render();
      });
    }

    if (preset1) {
      preset1.addEventListener('click', () => {
        this.currentDraft = JSON.parse(JSON.stringify(this.samplePresets[1]));
        this.render();
      });
    }

    if (randomBtn) {
      randomBtn.addEventListener('click', () => {
        this.generateRandomAIStory();
      });
    }

    // Story Architecture Fields
    const titleInp = this.container.querySelector('#story-title-input');
    if (titleInp) {
      titleInp.addEventListener('input', (e) => { this.currentDraft.title = e.target.value; });
    }

    const subInp = this.container.querySelector('#story-subtitle-input');
    if (subInp) {
      subInp.addEventListener('input', (e) => { this.currentDraft.subtitle = e.target.value; });
    }

    const themeSel = this.container.querySelector('#story-theme-select');
    if (themeSel) {
      themeSel.addEventListener('change', (e) => { this.currentDraft.ambient = e.target.value; });
    }

    const genreInp = this.container.querySelector('#story-genre-input');
    if (genreInp) {
      genreInp.addEventListener('input', (e) => { this.currentDraft.genre = e.target.value; });
    }

    const colorInp = this.container.querySelector('#story-color-input');
    const colorLbl = this.container.querySelector('#color-label');
    if (colorInp && colorLbl) {
      colorInp.addEventListener('input', (e) => {
        colorLbl.textContent = e.target.value;
        this.currentDraft.palette[2] = e.target.value;
      });
    }

    // Scene Tab Switching
    const sceneTabs = this.container.querySelectorAll('.scene-tab-btn');
    sceneTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Save current form values first
        this.syncActiveSceneData(activeSceneIdx);

        sceneTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        activeSceneIdx = parseInt(tab.dataset.idx, 10);

        const formContainer = this.container.querySelector('#active-scene-form');
        formContainer.innerHTML = this.renderSceneEditor(activeSceneIdx);
        this.bindSceneEditorEvents(activeSceneIdx);
      });
    });

    this.bindSceneEditorEvents(activeSceneIdx);

    // Launch Custom Story
    const launchBtn = this.container.querySelector('#launch-custom-story-btn');
    if (launchBtn) {
      launchBtn.addEventListener('click', () => {
        this.syncActiveSceneData(activeSceneIdx);
        const compiledStory = this.compileStory();
        if (this.onSaveStory) this.onSaveStory(compiledStory);
      });
    }

    // Export JSON
    const exportBtn = this.container.querySelector('#export-json-btn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        this.syncActiveSceneData(activeSceneIdx);
        const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.compileStory(), null, 2));
        const dlAnchor = document.createElement('a');
        dlAnchor.setAttribute('href', dataStr);
        dlAnchor.setAttribute('download', `${this.currentDraft.title.toLowerCase().replace(/\s+/g, '_')}_story.json`);
        dlAnchor.click();
      });
    }
  }

  bindSceneEditorEvents(sceneIdx) {
    const s = this.currentDraft.scenes[sceneIdx];
    const form = this.container.querySelector('#active-scene-form');
    if (!form) return;

    const titleInp = form.querySelector('#scene-title-input');
    if (titleInp) {
      titleInp.addEventListener('input', (e) => { s.title = e.target.value; });
    }

    const chapInp = form.querySelector('#scene-chapter-input');
    if (chapInp) {
      chapInp.addEventListener('input', (e) => { s.chapter = e.target.value; });
    }

    const narrInp = form.querySelector('#scene-narration-input');
    if (narrInp) {
      narrInp.addEventListener('input', (e) => { s.narration = e.target.value; });
    }

    const loreInp = form.querySelector('#scene-lore-input');
    if (loreInp) {
      loreInp.addEventListener('input', (e) => { s.lore = e.target.value; });
    }

    const promptInp = form.querySelector('#scene-prompt-input');
    if (promptInp) {
      promptInp.addEventListener('input', (e) => { s.prompt = e.target.value; });
    }

    // Test Voice
    const voiceBtn = form.querySelector('#test-voice-btn');
    if (voiceBtn) {
      voiceBtn.addEventListener('click', () => {
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const ut = new SpeechSynthesisUtterance(s.narration);
          ut.rate = 0.95;
          window.speechSynthesis.speak(ut);
        }
      });
    }

    // Enhance Prompt
    const enhanceBtn = form.querySelector('#enhance-prompt-btn');
    if (enhanceBtn && promptInp) {
      enhanceBtn.addEventListener('click', () => {
        const enhanced = `${promptInp.value.trim()}, 8k resolution, volumetric ethereal illumination, masterwork oil and digital painting, cinematic color grading, hyper-detailed textures`;
        promptInp.value = enhanced;
        s.prompt = enhanced;
      });
    }

    // Mini thumbnails
    const miniThumbs = form.querySelectorAll('.curated-mini-thumb');
    const mainThumb = form.querySelector('#studio-scene-img');
    miniThumbs.forEach(thumb => {
      thumb.addEventListener('click', () => {
        miniThumbs.forEach(t => t.classList.remove('selected'));
        thumb.classList.add('selected');
        s.image = thumb.dataset.src;
        if (mainThumb) mainThumb.src = thumb.dataset.src;
      });
    });
  }

  syncActiveSceneData(sceneIdx) {
    const form = this.container.querySelector('#active-scene-form');
    if (!form || !this.currentDraft.scenes[sceneIdx]) return;

    const s = this.currentDraft.scenes[sceneIdx];
    const titleInp = form.querySelector('#scene-title-input');
    const chapInp = form.querySelector('#scene-chapter-input');
    const narrInp = form.querySelector('#scene-narration-input');
    const loreInp = form.querySelector('#scene-lore-input');
    const promptInp = form.querySelector('#scene-prompt-input');

    if (titleInp) s.title = titleInp.value;
    if (chapInp) s.chapter = chapInp.value;
    if (narrInp) s.narration = narrInp.value;
    if (loreInp) s.lore = loreInp.value;
    if (promptInp) s.prompt = promptInp.value;
  }

  compileStory() {
    const id = 'custom_' + Date.now();
    return {
      id,
      title: this.currentDraft.title || 'Untitled Narrative',
      subtitle: this.currentDraft.subtitle || 'A Custom Visual Journey',
      theme: this.currentDraft.ambient || 'cosmic',
      accentColor: this.currentDraft.palette[2] || '#38bdf8',
      secondaryColor: this.currentDraft.palette[1] || '#c084fc',
      ambientSound: this.currentDraft.ambient || 'cosmic',
      description: this.currentDraft.subtitle || 'Custom authored story experience.',
      scenes: this.currentDraft.scenes.map((s, idx) => ({
        id: `${id}_scene_${idx + 1}`,
        chapter: s.chapter || `${idx + 1}`,
        title: s.title || `Scene ${idx + 1}`,
        image: s.image || '/art/astral_spire.jpg',
        narration: s.narration || '',
        lore: s.lore || 'Archived record.',
        prompt: s.prompt || '',
        palette: this.currentDraft.palette || ['#0f172a', '#38bdf8', '#c084fc'],
        durationEstimate: 16
      }))
    };
  }

  generateRandomAIStory() {
    const themes = [
      {
        title: 'The Alchemist of Midnight Aurora',
        subtitle: 'Crystallizing the Northern Sky',
        genre: 'Ethereal Arctic Solarpunk',
        palette: ['#041014', '#064e3b', '#10b981', '#38bdf8', '#f0fdf4'],
        ambient: 'aquatic',
        scenes: [
          {
            chapter: 'I',
            title: 'The Glacial Crucible',
            narration: 'Beneath the sweeping ribbons of the northern lights, an alchemist works in a solitary glass spire carved directly into the ancient ice sheets. Solutions of liquid moonlight boil quietly in silver flasks.',
            prompt: 'Cinematic digital art of an alchemist glass laboratory carved into a glacier under glowing emerald and teal aurora borealis, mystical glowing potions, starlight reflections, magical realism 8k',
            image: '/art/sunken_abyss.jpg',
            lore: 'Glacial crystals harvested here preserve the atmospheric temperature of the First Ice Age.'
          },
          {
            chapter: 'II',
            title: 'The Aurora Prism',
            narration: 'She raises a multifaceted prism toward the sky. As the emerald aurora hits the crystal facets, it solidifies into translucent glowing tears that tumble into a velvet-lined casket.',
            prompt: 'Mystical digital art of a cloaked female alchemist holding a faceted crystal prism catching aurora rays, glowing prismatic light beams, starry night sky, ethereal concept art',
            image: '/art/archivist_waking.jpg',
            lore: 'Known as Frozen Dawn, these crystals glow without burning for a century.'
          },
          {
            chapter: 'III',
            title: 'The Dawn of Luminescence',
            narration: 'Carried aloft on silver glider wings, she scatters the crystals over sleeping valleys, granting every village a soft protective twilight that wards off the winter cold.',
            prompt: 'Epic wide angle fantasy concept art of a figure gliding on silver mechanical wings scattering glowing stardust over snow-covered pine forests and glowing village at twilight',
            image: '/art/pearl_sanctuary.jpg',
            lore: 'The Luminary Flight is celebrated on the winter solstice across all nine kingdoms.'
          }
        ]
      }
    ];

    this.currentDraft = JSON.parse(JSON.stringify(themes[0]));
    this.render();
  }
}
