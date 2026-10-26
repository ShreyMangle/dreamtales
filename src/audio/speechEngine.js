/**
2:  * Speech Engine for Natural Web Speech & High-Fidelity Pre-rendered OpenAI TTS Voice Narration
3:  * Features word-level teleprompter synchronization and dynamic switching between OpenAI Ash and Web Speech voices.
4:  */
export class SpeechEngine {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.voices = [];
    this.currentUtterance = null;
    this.selectedVoice = null;
    this.rate = 1.0;
    this.pitch = 1.0;
    this.volume = 1.0;
    this.isPaused = false;
    this.isPlaying = false;
    this.voiceMode = 'openai'; // 'openai' | 'browser'

    // HTML5 Audio instance for high-definition OpenAI TTS voice files
    this.audioElement = new Audio();
    this.audioElement.preload = 'auto';
    this.setupAudioListeners();

    this.fallbackTimer = null;
    this.keepAliveInterval = null;

    this.onStartCallback = null;
    this.onEndCallback = null;
    this.onWordCallback = null;
    this.onErrorCallback = null;

    this.currentText = '';
    this.currentWords = [];

    this.initVoices();
  }

  setupAudioListeners() {
    this.audioElement.addEventListener('play', () => {
      this.isPlaying = true;
      this.isPaused = false;
      if (this.onStartCallback) this.onStartCallback();
    });

    this.audioElement.addEventListener('timeupdate', () => {
      if (!this.isPlaying || this.isPaused || !this.currentText) return;
      const duration = this.audioElement.duration;
      const current = this.audioElement.currentTime;
      if (!duration || duration <= 0) return;

      const progress = Math.min(0.999, Math.max(0, current / duration));
      const charIndex = Math.floor(progress * this.currentText.length);
      if (this.onWordCallback) {
        this.onWordCallback({ charIndex, text: this.currentText });
      }
    });

    this.audioElement.addEventListener('ended', () => {
      this.isPlaying = false;
      this.isPaused = false;
      if (this.onWordCallback && this.currentText) {
        this.onWordCallback({ charIndex: this.currentText.length, text: this.currentText });
      }
      if (this.onEndCallback) this.onEndCallback();
    });

    this.audioElement.addEventListener('error', (e) => {
      console.warn('Audio element playback error, falling back to synthesis:', e);
      if (this.isPlaying && this.currentText) {
        this.speakWithSynthesis(this.currentText);
      }
    });
  }

  initVoices() {
    if (!this.synth) return;

    const populate = () => {
      this.voices = this.synth.getVoices();
      if (!this.selectedVoice && this.voices.length > 0) {
        const preferred = this.voices.find(v => 
          (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel') || v.name.includes('David')) &&
          v.lang.startsWith('en')
        ) || this.voices.find(v => v.lang.startsWith('en')) || this.voices[0];
        this.selectedVoice = preferred;
      }
    };

    populate();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = populate;
    }
  }

  getVoices() {
    return this.voices;
  }

  setVoiceMode(mode) {
    this.voiceMode = mode; // 'openai' or 'browser'
  }

  setVoice(voiceUriOrName) {
    const voice = this.voices.find(v => v.voiceURI === voiceUriOrName || v.name === voiceUriOrName);
    if (voice) {
      this.selectedVoice = voice;
    }
  }

  setRate(val) {
    this.rate = Math.max(0.5, Math.min(2.0, val));
    if (this.audioElement) {
      this.audioElement.playbackRate = this.rate;
    }
  }

  setPitch(val) {
    this.pitch = Math.max(0.5, Math.min(1.5, val));
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1.0, val));
    if (this.audioElement) {
      this.audioElement.volume = this.volume;
    }
    if (this.currentUtterance && this.synth) {
      this.currentUtterance.volume = this.volume;
    }
  }

  speak(text, { audioUrl, onStart, onEnd, onWord, onError } = {}) {
    this.stop();

    this.currentText = text;
    this.currentWords = text.split(/\s+/);
    this.onStartCallback = onStart;
    this.onEndCallback = onEnd;
    this.onWordCallback = onWord;
    this.onErrorCallback = onError;

    // If pre-rendered high fidelity audio exists and mode is openai, use audio element
    if (this.voiceMode === 'openai' && audioUrl) {
      this.speakWithAudio(audioUrl);
      return;
    }

    this.speakWithSynthesis(text);
  }

  speakWithAudio(audioUrl) {
    try {
      this.audioElement.src = audioUrl;
      this.audioElement.currentTime = 0;
      this.audioElement.volume = this.volume;
      this.audioElement.playbackRate = this.rate;
      
      const playPromise = this.audioElement.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Audio play failed, falling back to synthesis:', err);
          this.speakWithSynthesis(this.currentText);
        });
      }
    } catch (err) {
      console.warn('Audio source error, falling back:', err);
      this.speakWithSynthesis(this.currentText);
    }
  }

  speakWithSynthesis(text) {
    if (!this.synth || this.voices.length === 0) {
      this.startFallbackNarration(text);
      return;
    }

    try {
      this.synth.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      this.currentUtterance = utterance;

      if (this.selectedVoice) {
        utterance.voice = this.selectedVoice;
      }
      utterance.rate = this.rate * 0.95;
      utterance.pitch = this.pitch;
      utterance.volume = this.volume;

      utterance.onstart = () => {
        this.isPlaying = true;
        this.isPaused = false;
        if (this.onStartCallback) this.onStartCallback();
      };

      utterance.onboundary = (event) => {
        if (event.name === 'word') {
          const charIndex = event.charIndex;
          if (this.onWordCallback) {
            this.onWordCallback({ charIndex, text });
          }
        }
      };

      utterance.onend = () => {
        this.isPlaying = false;
        this.isPaused = false;
        this.currentUtterance = null;
        if (this.onEndCallback) this.onEndCallback();
      };

      utterance.onerror = (err) => {
        console.warn('SpeechSynthesis error:', err);
        if (err.error === 'interrupted' || err.error === 'canceled') return;
        this.startFallbackNarration(text);
      };

      this.keepAliveInterval = setInterval(() => {
        if (this.isPlaying && !this.isPaused && this.synth) {
          this.synth.pause();
          this.synth.resume();
        } else {
          clearInterval(this.keepAliveInterval);
        }
      }, 10000);

      this.synth.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis caught exception, using fallback:', e);
      this.startFallbackNarration(text);
    }
  }

  startFallbackNarration(text) {
    this.isPlaying = true;
    this.isPaused = false;
    if (this.onStartCallback) this.onStartCallback();

    const words = text.split(/\s+/);
    const duration = Math.max(6, words.length * 0.4 / this.rate);
    const intervalMs = (duration * 1000) / words.length;

    let currentIdx = 0;
    let currentCharIndex = 0;

    clearInterval(this.fallbackTimer);
    this.fallbackTimer = setInterval(() => {
      if (this.isPaused) return;

      if (currentIdx >= words.length) {
        clearInterval(this.fallbackTimer);
        this.isPlaying = false;
        this.isPaused = false;
        if (this.onEndCallback) this.onEndCallback();
        return;
      }

      currentCharIndex = text.indexOf(words[currentIdx], currentCharIndex);
      if (this.onWordCallback) {
        this.onWordCallback({ charIndex: currentCharIndex, text });
      }
      currentCharIndex += words[currentIdx].length;
      currentIdx++;
    }, intervalMs);
  }

  pause() {
    if (this.isPlaying) {
      this.isPaused = true;
      if (!this.audioElement.paused) {
        this.audioElement.pause();
      }
      if (this.synth && this.synth.speaking) {
        this.synth.pause();
      }
    }
  }

  resume() {
    if (this.isPlaying && this.isPaused) {
      this.isPaused = false;
      if (this.audioElement.src && this.audioElement.paused) {
        this.audioElement.play().catch(e => console.warn('Audio resume error', e));
      }
      if (this.synth && this.synth.paused) {
        this.synth.resume();
      }
    }
  }

  stop() {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.removeAttribute('src');
      this.audioElement.load();
    }
    if (this.synth) {
      this.synth.cancel();
    }
    if (this.fallbackTimer) {
      clearInterval(this.fallbackTimer);
      this.fallbackTimer = null;
    }
    if (this.keepAliveInterval) {
      clearInterval(this.keepAliveInterval);
      this.keepAliveInterval = null;
    }
    this.isPlaying = false;
    this.isPaused = false;
    this.currentUtterance = null;
  }
}
