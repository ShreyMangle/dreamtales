/**
 * ASTRALIS — Main Orchestrator
 * Seamlessly pairs generative static visual art, ambient soundscapes, and expressive voice narration.
 */

import { stories as initialStories } from './data/stories.js';
import { SpeechEngine } from './audio/speechEngine.js';
import { AmbientEngine } from './audio/ambientEngine.js';
import { AudioVisualizer } from './audio/visualizer.js';
import { ParticleSystem } from './visuals/particles.js';
import { GalleryView } from './components/gallery.js';
import { StoryStudio } from './components/studio.js';
import { getAssetUrl } from './utils/assets.js';

class AstralisApp {
  constructor() {
    this.stories = [...initialStories];
    this.currentStoryIdx = 0;
    this.currentSceneIdx = 0;
    this.activeView = 'cinema'; // 'cinema' | 'gallery' | 'studio'
    this.isAutoplay = true;
    this.kenBurnsCounter = 1;
    this.wordsList = [];
    this.activeWordIndex = -1;

    // Audio & Visual Subsystems
    this.speech = new SpeechEngine();
    this.ambient = new AmbientEngine();
    this.particles = null;
    this.visualizer = null;
    this.gallery = null;
    this.studio = null;

    this.init();
  }

  get currentStory() {
    return this.stories[this.currentStoryIdx] || this.stories[0];
  }

  get currentScene() {
    const s = this.currentStory;
    return s.scenes[this.currentSceneIdx] || s.scenes[0];
  }

  init() {
    this.bindDomElements();
    this.setupVisuals();
    this.setupAudio();
    this.setupViews();
    this.setupEventListeners();
    this.setupKeyboardShortcuts();

    // Render initial story scene
    this.applyStoryTheme();
    this.loadScene(0, false);
    this.renderStoryDropdown();
  }

  bindDomElements() {
    // Stage elements
    this.canvasFrame = document.getElementById('canvas-frame');
    this.activeSceneImg = document.getElementById('active-scene-image');
    this.sceneChapterBadge = document.getElementById('scene-chapter-badge');
    this.sceneTitleDisplay = document.getElementById('scene-title-display');
    this.sceneStoryTag = document.getElementById('scene-story-tag');
    this.teleprompterText = document.getElementById('teleprompter-text');
    this.teleprompterContainer = document.getElementById('teleprompter-container');

    // Controls
    this.mainPlayBtn = document.getElementById('main-play-btn');
    this.playBtnIcon = document.getElementById('play-btn-icon');
    this.prevSceneBtn = document.getElementById('prev-scene-btn');
    this.nextSceneBtn = document.getElementById('next-scene-btn');
    this.replaySceneBtn = document.getElementById('replay-scene-btn');
    this.scrubberTrack = document.getElementById('scrubber-track');
    this.scrubberFill = document.getElementById('scrubber-fill');
    this.scrubberMarkers = document.getElementById('scrubber-markers');
    this.sceneCounterDisplay = document.getElementById('scene-counter-display');
    this.autoplayCheckbox = document.getElementById('autoplay-checkbox');
    this.carouselDrawerToggle = document.getElementById('carousel-drawer-toggle');
    this.sceneThumbnailDrawer = document.getElementById('scene-thumbnail-drawer');
    this.sceneThumbnailStrip = document.getElementById('scene-thumbnail-strip');
    this.toggleSubtitlesBtn = document.getElementById('toggle-subtitles-btn');

    // Inspector
    this.inspectDrawerToggle = document.getElementById('inspect-drawer-toggle');
    this.artInspectorDrawer = document.getElementById('art-inspector-drawer');
    this.inspectorCloseBtn = document.getElementById('inspector-close-btn');
    this.inspectorContent = document.getElementById('inspector-content');

    // Header & Views
    this.storyDropdownBtn = document.getElementById('story-dropdown-btn');
    this.storyDropdownMenu = document.getElementById('story-dropdown-menu');
    this.currentStoryDot = document.getElementById('current-story-dot');
    this.currentStoryName = document.getElementById('current-story-name');
    this.tabCinema = document.getElementById('tab-cinema');
    this.tabGallery = document.getElementById('tab-gallery');
    this.tabStudio = document.getElementById('tab-studio');
    this.viewCinema = document.getElementById('view-cinema');
    this.viewGallery = document.getElementById('view-gallery');
    this.viewStudio = document.getElementById('view-studio');

    // Audio & Header Controls
    this.ambientToggleBtn = document.getElementById('ambient-toggle-btn');
    this.ambientVolumeSlider = document.getElementById('ambient-volume-slider');
    this.fullscreenBtn = document.getElementById('fullscreen-btn');
    this.voiceSettingsBtn = document.getElementById('voice-settings-btn');
    this.voiceSettingsModal = document.getElementById('voice-settings-modal');
    this.voiceModalClose = document.getElementById('voice-modal-close');
    this.voiceSelect = document.getElementById('voice-select');
    this.speechRateSlider = document.getElementById('speech-rate-slider');
    this.speechRateVal = document.getElementById('speech-rate-val');
    this.speechPitchSlider = document.getElementById('speech-pitch-slider');
    this.speechPitchVal = document.getElementById('speech-pitch-val');
    this.speechVolSlider = document.getElementById('speech-vol-slider');
    this.speechVolVal = document.getElementById('speech-vol-val');
    this.testCurrentVoiceBtn = document.getElementById('test-current-voice-btn');
    this.modeOpenAiBtn = document.getElementById('mode-openai-btn');
    this.modeBrowserBtn = document.getElementById('mode-browser-btn');
    this.browserVoiceGroup = document.getElementById('browser-voice-group');
    this.voiceIndicatorBadge = document.getElementById('voice-indicator-badge');
  }

  setupVisuals() {
    const particleCanvas = document.getElementById('particle-canvas');
    if (particleCanvas) {
      this.particles = new ParticleSystem(particleCanvas);
      this.particles.setTheme(this.currentStory.theme);
      this.particles.start();
    }
  }

  setupAudio() {
    const visualizerCanvas = document.getElementById('visualizer-canvas');
    if (visualizerCanvas) {
      this.visualizer = new AudioVisualizer(visualizerCanvas, this.ambient, this.speech);
      this.visualizer.setColors(this.currentStory.accentColor, this.currentStory.secondaryColor);
      this.visualizer.start();
    }

    this.populateVoiceList();
    if (window.speechSynthesis && window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = () => this.populateVoiceList();
    }
  }

  setupViews() {
    // Gallery View
    this.gallery = new GalleryView(this.viewGallery, this.stories, (storyId, sceneId) => {
      this.selectStoryById(storyId);
      const sceneIndex = this.currentStory.scenes.findIndex(s => s.id === sceneId);
      this.switchView('cinema');
      this.loadScene(Math.max(0, sceneIndex), true);
    });
    this.gallery.render();

    // Studio View
    this.studio = new StoryStudio(this.viewStudio, (newStory) => {
      this.stories.push(newStory);
      this.gallery.stories = this.stories;
      this.gallery.render();
      this.renderStoryDropdown();
      this.currentStoryIdx = this.stories.length - 1;
      this.applyStoryTheme();
      this.switchView('cinema');
      this.loadScene(0, true);
    });
    this.studio.render();
  }

  populateVoiceList() {
    const voices = this.speech.getVoices();
    if (!this.voiceSelect) return;
    this.voiceSelect.innerHTML = '';

    voices.forEach((v, idx) => {
      const opt = document.createElement('option');
      opt.value = v.voiceURI;
      opt.textContent = `${v.name} (${v.lang})${v.default ? ' — System Default' : ''}`;
      if (this.speech.selectedVoice && this.speech.selectedVoice.voiceURI === v.voiceURI) {
        opt.selected = true;
      }
      this.voiceSelect.appendChild(opt);
    });
  }

  applyStoryTheme() {
    const story = this.currentStory;
    document.documentElement.style.setProperty('--accent-color', story.accentColor);
    document.documentElement.style.setProperty('--accent-secondary', story.secondaryColor);
    document.documentElement.style.setProperty('--accent-glow', `${story.accentColor}40`);

    if (this.currentStoryDot) this.currentStoryDot.style.background = story.accentColor;
    if (this.currentStoryName) this.currentStoryName.textContent = story.title;

    if (this.particles) {
      this.particles.setTheme(story.theme);
    }
    if (this.visualizer) {
      this.visualizer.setColors(story.accentColor, story.secondaryColor);
    }

    this.ambient.playTheme(story.ambientSound || story.theme);
  }

  loadScene(sceneIndex, autoPlayNarration = false) {
    const story = this.currentStory;
    if (sceneIndex < 0) sceneIndex = 0;
    if (sceneIndex >= story.scenes.length) sceneIndex = story.scenes.length - 1;

    this.currentSceneIdx = sceneIndex;
    const scene = this.currentScene;

    // Stop current speech and restore ambient
    this.speech.stop();
    this.ambient.duck(false);
    this.updatePlayBtnState(false);

    // Update Ken Burns motion animation
    this.kenBurnsCounter = (this.kenBurnsCounter % 3) + 1;
    this.activeSceneImg.className = `cinematic-art-img ken-burns-${this.kenBurnsCounter}`;

    // Update Art image with smooth fade
    this.activeSceneImg.style.opacity = '0.3';
    setTimeout(() => {
      this.activeSceneImg.src = getAssetUrl(scene.image);
      this.activeSceneImg.onload = () => {
        this.activeSceneImg.style.opacity = '1';
      };
    }, 150);

    // Update Header Labels
    this.sceneChapterBadge.textContent = `CHAPTER ${scene.chapter}`;
    this.sceneTitleDisplay.textContent = scene.title;
    this.sceneStoryTag.textContent = story.title;
    this.sceneCounterDisplay.textContent = `Scene ${sceneIndex + 1} of ${story.scenes.length}`;

    // Update Teleprompter Subtitles
    this.prepareTeleprompter(scene.narration);

    // Update Scrubber Track & Markers
    this.renderScrubberMarkers();
    this.updateScrubberProgress(0);

    // Update Thumbnails Strip
    this.renderThumbnailStrip();

    // Update Art Inspector Content
    this.renderInspectorContent(scene);

    if (autoPlayNarration) {
      this.playCurrentScene();
    }
  }

  buildLineChunks(narrationText) {
    // Splits text into word tokens with exact character boundaries
    const wordRegex = /(\S+)/g;
    const rawWords = [];
    let match;
    while ((match = wordRegex.exec(narrationText)) !== null) {
      rawWords.push({
        text: match[0],
        start: match.index,
        end: match.index + match[0].length
      });
    }

    if (rawWords.length === 0) return [];

    const chunks = [];
    let i = 0;

    while (i < rawWords.length) {
      // Strictly 5 to 10 words per line
      const minWords = 5;
      const targetWords = 7;
      const maxWords = 9;

      let take = Math.min(targetWords, rawWords.length - i);

      // Check if there is a natural punctuation break (comma, colon, period) between minWords and maxWords
      let foundPunctBreak = -1;
      for (let j = minWords; j <= Math.min(maxWords, rawWords.length - i); j++) {
        const w = rawWords[i + j - 1].text;
        if (/[,;:.!?]$/.test(w)) {
          foundPunctBreak = j;
          break;
        }
      }

      if (foundPunctBreak !== -1) {
        take = foundPunctBreak;
      } else {
        const remaining = (rawWords.length - i) - take;
        if (remaining > 0 && remaining < minWords) {
          if (take + remaining <= 10) {
            take += remaining;
          } else {
            take = Math.max(minWords, Math.floor((rawWords.length - i) / 2));
          }
        }
      }

      const chunkWords = rawWords.slice(i, i + take);
      const startChar = chunkWords[0].start;
      const endChar = chunkWords[chunkWords.length - 1].end;

      chunks.push({
        words: chunkWords,
        startChar,
        endChar
      });

      i += take;
    }

    if (chunks.length > 0) {
      chunks[chunks.length - 1].endChar = Math.max(chunks[chunks.length - 1].endChar, narrationText.length);
    }

    return chunks;
  }

  prepareTeleprompter(narrationText) {
    this.lineChunks = this.buildLineChunks(narrationText);
    this.currentChunkIdx = -1;
    // Display ONLY the opening 5-10 word line
    this.displayChunk(0);
  }

  displayChunk(chunkIdx) {
    if (!this.lineChunks || !this.lineChunks[chunkIdx]) return;
    this.currentChunkIdx = chunkIdx;
    const chunk = this.lineChunks[chunkIdx];

    // Render ONLY this single line of 5-10 words
    this.teleprompterText.innerHTML = chunk.words.map((w) => {
      return `<span class="teleprompter-word" data-start="${w.start}" data-end="${w.end}">${w.text}</span>`;
    }).join(' ');

    this.teleprompterText.classList.remove('teleprompter-line-fade');
    void this.teleprompterText.offsetWidth; // trigger reflow for smooth fade
    this.teleprompterText.classList.add('teleprompter-line-fade');
  }

  playCurrentScene() {
    const scene = this.currentScene;
    this.ambient.ensureContext();
    this.ambient.duck(true);

    this.speech.speak(scene.narration, {
      audioUrl: getAssetUrl(scene.audio),
      onStart: () => {
        this.updatePlayBtnState(true);
        this.ambient.duck(true);
      },
      onWord: ({ charIndex, text }) => {
        this.highlightTeleprompterWord(charIndex, text);
        this.updateScrubberProgress(charIndex / Math.max(1, text.length));
      },
      onEnd: () => {
        this.updatePlayBtnState(false);
        this.updateScrubberProgress(1.0);
        this.markAllWordsSpoken();
        this.ambient.duck(false);

        if (this.isAutoplay) {
          setTimeout(() => {
            if (this.currentSceneIdx < this.currentStory.scenes.length - 1) {
              this.loadScene(this.currentSceneIdx + 1, true);
            }
          }, 1800);
        }
      },
      onError: () => {
        this.updatePlayBtnState(false);
        this.ambient.duck(false);
      }
    });
  }

  highlightTeleprompterWord(charIndex, fullText) {
    if (!this.lineChunks || this.lineChunks.length === 0) return;

    // 1. Identify which 5-10 word line chunk contains the current narration charIndex
    let targetChunkIdx = this.lineChunks.findIndex(c => charIndex >= c.startChar && charIndex < c.endChar);
    if (targetChunkIdx === -1) {
      if (charIndex >= this.lineChunks[this.lineChunks.length - 1].endChar) {
        targetChunkIdx = this.lineChunks.length - 1;
      } else {
        targetChunkIdx = 0;
      }
    }

    // 2. Only show the line currently being read (5-10 words)
    if (targetChunkIdx !== this.currentChunkIdx) {
      this.displayChunk(targetChunkIdx);
    }

    // 3. Highlight words within this single active line
    const wordElements = this.teleprompterContainer.querySelectorAll('.teleprompter-word');
    wordElements.forEach(el => {
      const start = parseInt(el.dataset.start, 10);
      const end = parseInt(el.dataset.end, 10);

      if (charIndex >= start && charIndex < end) {
        el.classList.add('active');
        el.classList.add('spoken');
      } else if (charIndex >= end) {
        el.classList.remove('active');
        el.classList.add('spoken');
      } else {
        el.classList.remove('active');
        el.classList.remove('spoken');
      }
    });
  }

  markAllWordsSpoken() {
    if (this.lineChunks && this.lineChunks.length > 0) {
      this.displayChunk(this.lineChunks.length - 1);
    }
    const wordElements = this.teleprompterContainer.querySelectorAll('.teleprompter-word');
    wordElements.forEach(el => {
      el.classList.remove('active');
      el.classList.add('spoken');
    });
  }

  updatePlayBtnState(isPlaying) {
    if (isPlaying) {
      this.playBtnIcon.innerHTML = `
        <rect x="6" y="4" width="4" height="16" />
        <rect x="14" y="4" width="4" height="16" />
      `;
    } else {
      this.playBtnIcon.innerHTML = `<polygon points="5 3 19 12 5 21 5 3"/>`;
    }
  }

  updateScrubberProgress(fraction) {
    const story = this.currentStory;
    const sceneFraction = 1 / story.scenes.length;
    const totalProgress = (this.currentSceneIdx * sceneFraction) + (fraction * sceneFraction);
    this.scrubberFill.style.width = `${Math.min(100, Math.max(0, totalProgress * 100))}%`;
  }

  renderScrubberMarkers() {
    const count = this.currentStory.scenes.length;
    this.scrubberMarkers.innerHTML = '';
    for (let i = 0; i < count; i++) {
      const tick = document.createElement('div');
      tick.className = `scrubber-tick ${i === this.currentSceneIdx ? 'active' : ''}`;
      this.scrubberMarkers.appendChild(tick);
    }
  }

  renderThumbnailStrip() {
    const story = this.currentStory;
    this.sceneThumbnailStrip.innerHTML = story.scenes.map((s, idx) => `
      <div class="strip-thumb-item ${idx === this.currentSceneIdx ? 'active' : ''}" data-idx="${idx}">
        <img src="${getAssetUrl(s.image)}" alt="${s.title}" />
        <div class="strip-thumb-overlay">
          <span class="strip-thumb-title">${s.chapter}. ${s.title}</span>
        </div>
      </div>
    `).join('');

    const thumbs = this.sceneThumbnailStrip.querySelectorAll('.strip-thumb-item');
    thumbs.forEach(thumb => {
      thumb.addEventListener('click', () => {
        const idx = parseInt(thumb.dataset.idx, 10);
        this.loadScene(idx, true);
      });
    });
  }

  renderInspectorContent(scene) {
    this.inspectorContent.innerHTML = `
      <div class="inspector-section">
        <span class="section-label">Scene Narration</span>
        <blockquote class="inspector-quote">"${scene.narration}"</blockquote>
      </div>

      <div class="inspector-section">
        <span class="section-label">Narrative Lore</span>
        <p class="inspector-lore">${scene.lore}</p>
      </div>

      <div class="inspector-section">
        <div class="prompt-header-row">
          <span class="section-label">AI Generation Prompt</span>
          <button class="copy-prompt-btn" id="inspector-copy-btn">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            <span id="inspect-copy-text">Copy</span>
          </button>
        </div>
        <div class="prompt-box">${scene.prompt}</div>
      </div>

      <div class="inspector-section">
        <span class="section-label">Harmonic Palette</span>
        <div class="modal-palette-row">
          ${(scene.palette || []).map(hex => `
            <div class="palette-swatch-item">
              <div class="swatch-color" style="background: ${hex};"></div>
              <span class="swatch-label">${hex}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    const copyBtn = this.inspectorContent.querySelector('#inspector-copy-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(scene.prompt).then(() => {
          const txt = this.inspectorContent.querySelector('#inspect-copy-text');
          txt.textContent = 'Copied!';
          setTimeout(() => { txt.textContent = 'Copy'; }, 2000);
        });
      });
    }
  }

  renderStoryDropdown() {
    this.storyDropdownMenu.innerHTML = this.stories.map((story, idx) => `
      <div class="story-option-item ${idx === this.currentStoryIdx ? 'active' : ''}" data-idx="${idx}">
        <span class="story-option-title">${story.title}</span>
        <span class="story-option-desc">${story.subtitle}</span>
      </div>
    `).join('');

    const items = this.storyDropdownMenu.querySelectorAll('.story-option-item');
    items.forEach(item => {
      item.addEventListener('click', () => {
        const idx = parseInt(item.dataset.idx, 10);
        this.selectStory(idx);
        this.storyDropdownMenu.style.display = 'none';
      });
    });
  }

  selectStory(idx) {
    if (idx < 0 || idx >= this.stories.length) return;
    this.currentStoryIdx = idx;
    this.applyStoryTheme();
    this.loadScene(0, false);
    this.renderStoryDropdown();
  }

  selectStoryById(storyId) {
    const idx = this.stories.findIndex(s => s.id === storyId);
    if (idx !== -1) {
      this.selectStory(idx);
    }
  }

  switchView(viewName) {
    this.activeView = viewName;
    const views = [
      { name: 'cinema', tab: this.tabCinema, elem: this.viewCinema },
      { name: 'gallery', tab: this.tabGallery, elem: this.viewGallery },
      { name: 'studio', tab: this.tabStudio, elem: this.viewStudio }
    ];

    views.forEach(v => {
      if (v.name === viewName) {
        v.tab.classList.add('active');
        v.elem.style.display = v.name === 'cinema' ? 'flex' : 'block';
      } else {
        v.tab.classList.remove('active');
        v.elem.style.display = 'none';
      }
    });

    if (viewName !== 'cinema') {
      this.speech.pause();
      this.updatePlayBtnState(false);
    }
  }

  setupEventListeners() {
    // Play / Pause
    this.mainPlayBtn.addEventListener('click', () => {
      if (this.speech.isPlaying && !this.speech.isPaused) {
        this.speech.pause();
        this.ambient.duck(false);
        this.updatePlayBtnState(false);
      } else if (this.speech.isPlaying && this.speech.isPaused) {
        this.speech.resume();
        this.ambient.duck(true);
        this.updatePlayBtnState(true);
      } else {
        this.playCurrentScene();
      }
    });

    // Prev / Next Scene
    this.prevSceneBtn.addEventListener('click', () => {
      if (this.currentSceneIdx > 0) {
        this.loadScene(this.currentSceneIdx - 1, true);
      }
    });

    this.nextSceneBtn.addEventListener('click', () => {
      if (this.currentSceneIdx < this.currentStory.scenes.length - 1) {
        this.loadScene(this.currentSceneIdx + 1, true);
      }
    });

    // Replay
    this.replaySceneBtn.addEventListener('click', () => {
      this.loadScene(this.currentSceneIdx, true);
    });

    // Scrubber click
    this.scrubberTrack.addEventListener('click', (e) => {
      const rect = this.scrubberTrack.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const fraction = clickX / rect.width;
      const targetScene = Math.floor(fraction * this.currentStory.scenes.length);
      this.loadScene(targetScene, true);
    });

    // Autoplay toggle
    this.autoplayCheckbox.addEventListener('change', (e) => {
      this.isAutoplay = e.target.checked;
    });

    // Thumbnail strip toggle
    this.carouselDrawerToggle.addEventListener('click', () => {
      const isOpen = this.sceneThumbnailDrawer.classList.toggle('open');
      this.carouselDrawerToggle.classList.toggle('active', isOpen);
    });

    // Subtitles visibility toggle
    this.toggleSubtitlesBtn.addEventListener('click', () => {
      const isVisible = this.teleprompterContainer.style.display !== 'none';
      this.teleprompterContainer.style.display = isVisible ? 'none' : 'flex';
      this.toggleSubtitlesBtn.classList.toggle('active', !isVisible);
    });

    // Inspector Drawer toggle
    this.inspectDrawerToggle.addEventListener('click', () => {
      this.artInspectorDrawer.classList.toggle('open');
    });

    this.inspectorCloseBtn.addEventListener('click', () => {
      this.artInspectorDrawer.classList.remove('open');
    });

    // View Tabs
    this.tabCinema.addEventListener('click', () => this.switchView('cinema'));
    this.tabGallery.addEventListener('click', () => this.switchView('gallery'));
    this.tabStudio.addEventListener('click', () => this.switchView('studio'));

    // Logo click returns to cinema
    document.getElementById('logo-home-btn').addEventListener('click', () => {
      this.switchView('cinema');
    });

    // Story Dropdown toggle
    this.storyDropdownBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isVisible = this.storyDropdownMenu.style.display === 'block';
      this.storyDropdownMenu.style.display = isVisible ? 'none' : 'block';
    });

    document.addEventListener('click', () => {
      this.storyDropdownMenu.style.display = 'none';
    });

    // Ambient Audio Controls
    this.ambientToggleBtn.addEventListener('click', () => {
      const isMuted = this.ambient.toggleMute();
      const icon = document.getElementById('ambient-icon');
      if (isMuted) {
        icon.innerHTML = `
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
          <line x1="23" y1="9" x2="17" y2="15"/>
          <line x1="17" y1="9" x2="23" y2="15"/>
        `;
      } else {
        icon.innerHTML = `
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
        `;
      }
    });

    this.ambientVolumeSlider.addEventListener('input', (e) => {
      this.ambient.setVolume(parseFloat(e.target.value));
    });

    // Fullscreen Toggle
    this.fullscreenBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    });

    // Voice Modal
    this.voiceSettingsBtn.addEventListener('click', () => {
      this.voiceSettingsModal.style.display = 'flex';
    });

    this.voiceModalClose.addEventListener('click', () => {
      this.voiceSettingsModal.style.display = 'none';
    });

    this.voiceSettingsModal.addEventListener('click', (e) => {
      if (e.target === this.voiceSettingsModal) {
        this.voiceSettingsModal.style.display = 'none';
      }
    });

    this.voiceSelect.addEventListener('change', (e) => {
      this.speech.setVoice(e.target.value);
    });

    this.speechRateSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      this.speech.setRate(val);
      this.speechRateVal.textContent = `${val.toFixed(2)}x`;
    });

    this.speechPitchSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      this.speech.setPitch(val);
      this.speechPitchVal.textContent = `${val.toFixed(2)}x`;
    });

    this.speechVolSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      this.speech.setVolume(val);
      this.speechVolVal.textContent = `${Math.round(val * 100)}%`;
    });

    // Voice Mode Switches (OpenAI Ash vs Browser Synth)
    if (this.modeOpenAiBtn && this.modeBrowserBtn) {
      this.modeOpenAiBtn.addEventListener('click', () => {
        this.speech.setVoiceMode('openai');
        this.modeOpenAiBtn.classList.add('active');
        this.modeBrowserBtn.classList.remove('active');
        if (this.browserVoiceGroup) this.browserVoiceGroup.style.display = 'none';
        if (this.voiceIndicatorBadge) this.voiceIndicatorBadge.textContent = 'OpenAI Ash (HD)';
        if (this.speech.isPlaying) {
          this.playCurrentScene();
        }
      });

      this.modeBrowserBtn.addEventListener('click', () => {
        this.speech.setVoiceMode('browser');
        this.modeBrowserBtn.classList.add('active');
        this.modeOpenAiBtn.classList.remove('active');
        if (this.browserVoiceGroup) this.browserVoiceGroup.style.display = 'flex';
        if (this.voiceIndicatorBadge) this.voiceIndicatorBadge.textContent = 'Browser Synth';
        if (this.speech.isPlaying) {
          this.playCurrentScene();
        }
      });
    }

    this.testCurrentVoiceBtn.addEventListener('click', () => {
      if (this.speech.voiceMode === 'openai') {
        this.speech.speak('In the quiet space between heartbeats, the universe hums its oldest lullaby.', {
          audioUrl: '/audio/archivist_scene_1.mp3'
        });
      } else {
        this.speech.speak('In the quiet space between heartbeats, the universe hums its oldest lullaby.');
      }
    });
  }

  showToast(message, icon = '✨') {
    let toast = document.getElementById('astralis-hud-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'astralis-hud-toast';
      toast.className = 'hud-toast';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<span class="hud-toast-icon">${icon}</span><span class="hud-toast-msg">${message}</span>`;
    toast.classList.add('visible');
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => {
      toast.classList.remove('visible');
    }, 1700);
  }

  setupKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      // Don't trigger if user is typing in input or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        this.mainPlayBtn.click();
        const isPlaying = this.speech.isPlaying && !this.speech.isPaused;
        this.showToast(isPlaying ? 'Narration Resumed' : 'Narration Paused', isPlaying ? '▶️' : '⏸️');
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        this.nextSceneBtn.click();
        this.showToast(`Scene ${this.currentSceneIdx + 1} of ${this.currentStory.scenes.length}`, '⏭️');
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        this.prevSceneBtn.click();
        this.showToast(`Scene ${this.currentSceneIdx + 1} of ${this.currentStory.scenes.length}`, '⏮️');
      } else if (e.key === 'm' || e.key === 'M') {
        this.ambientToggleBtn.click();
        this.showToast(this.ambient.isMuted ? 'Ambient Muted' : 'Ambient Active', this.ambient.isMuted ? '🔇' : '🎵');
      } else if (e.key === 'f' || e.key === 'F') {
        this.fullscreenBtn.click();
        const isFull = !!document.fullscreenElement;
        this.showToast(isFull ? 'Fullscreen Enabled' : 'Fullscreen Exited', '⛶');
      } else if (e.key === 'i' || e.key === 'I') {
        this.inspectDrawerToggle.click();
        this.showToast('Art Inspector Toggled', '🔍');
      } else if (e.key === 't' || e.key === 'T') {
        this.toggleSubtitlesBtn.click();
        const isSubVisible = this.teleprompterContainer.style.display !== 'none';
        this.showToast(isSubVisible ? 'Captions Enabled' : 'Captions Hidden', '💬');
      }
    });
  }
}

// Initialize Application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.astralisApp = new AstralisApp();
});
