/**
 * Procedural Web Audio Ambient Soundscape Generator
 * Produces smooth, noise-free celestial harmonics and gentle atmospheric textures.
 * Features auto-ducking during voice narration and starts muted by default to eliminate background noise.
 */
export class AmbientEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.analyser = null;
    this.activeNodes = [];
    this.currentTheme = null;
    this.isPlaying = false;
    this.volume = 0.15;
    this.isMuted = true; // Started muted by default for crystal-clear voice narration
    this.isDucked = false;
    this.intervalId = null;
  }

  ensureContext() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();

      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 128;
      this.analyser.smoothingTimeConstant = 0.85;

      this.masterGain = this.ctx.createGain();
      // If muted, gain is 0
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);

      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1.0, val));
    if (this.masterGain && this.ctx && !this.isMuted) {
      const target = this.isDucked ? this.volume * 0.15 : this.volume;
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.linearRampToValueAtTime(target, this.ctx.currentTime + 0.1);
    }
  }

  duck(isDucked) {
    this.isDucked = isDucked;
    if (this.masterGain && this.ctx && !this.isMuted) {
      const now = this.ctx.currentTime;
      const targetGain = isDucked ? this.volume * 0.12 : this.volume;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.linearRampToValueAtTime(targetGain, now + 0.5);
    }
  }

  toggleMute() {
    this.ensureContext();
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      const target = this.isMuted ? 0 : (this.isDucked ? this.volume * 0.15 : this.volume);
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.ctx.currentTime);
      this.masterGain.gain.linearRampToValueAtTime(target, this.ctx.currentTime + 0.2);
    }
    return this.isMuted;
  }

  playTheme(themeName) {
    this.ensureContext();
    if (this.currentTheme === themeName && this.isPlaying) return;

    this.stopTheme(true);
    this.currentTheme = themeName;
    this.isPlaying = true;

    if (themeName === 'cosmic') {
      this.startCosmicSoundscape();
    } else if (themeName === 'aquatic') {
      this.startAquaticSoundscape();
    } else if (themeName === 'steampunk') {
      this.startSteampunkSoundscape();
    } else {
      this.startCosmicSoundscape();
    }
  }

  stopTheme(smooth = true) {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    if (!this.ctx) return;

    const fadeDuration = smooth ? 1.0 : 0.05;
    const now = this.ctx.currentTime;

    this.activeNodes.forEach(item => {
      try {
        if (item.gainNode) {
          item.gainNode.gain.cancelScheduledValues(now);
          item.gainNode.gain.setValueAtTime(item.gainNode.gain.value, now);
          item.gainNode.gain.linearRampToValueAtTime(0.0001, now + fadeDuration);
        }
        if (item.source) {
          setTimeout(() => {
            try { item.source.stop(); item.source.disconnect(); } catch (e) {}
          }, fadeDuration * 1000 + 40);
        }
      } catch (e) {}
    });

    this.activeNodes = [];
    this.isPlaying = false;
  }

  /**
   * Cosmic Soundscape:
   * Pure, gentle, resonant celestial sine tones (zero harsh beating or noise)
   */
  startCosmicSoundscape() {
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const themeGain = ctx.createGain();
    themeGain.gain.setValueAtTime(0.0001, now);
    themeGain.gain.linearRampToValueAtTime(0.4, now + 1.5);
    themeGain.connect(this.masterGain);

    // Warm, peaceful celestial pad (harmonic fifths: D3 146.8Hz, A3 220Hz, D4 293.6Hz)
    const harmonicFreqs = [146.83, 220.0, 293.66];
    harmonicFreqs.forEach((f) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, now);

      oscGain.gain.setValueAtTime(0.025, now);

      osc.connect(filter);
      filter.connect(oscGain);
      oscGain.connect(themeGain);

      osc.start();
      this.activeNodes.push({ source: osc, gainNode: oscGain });
    });

    // Soft celestial bell shimmer
    const chimeFreqs = [587.33, 880.0, 1174.66];
    this.intervalId = setInterval(() => {
      if (!this.isPlaying || this.isMuted || Math.random() > 0.4) return;
      this.playChime(chimeFreqs[Math.floor(Math.random() * chimeFreqs.length)], themeGain);
    }, 4500);
  }

  playChime(freq, targetNode) {
    if (!this.ctx || this.isMuted) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.02, now + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.0);

    osc.connect(gain);
    gain.connect(targetNode);

    osc.start(now);
    osc.stop(now + 3.1);
  }

  /**
   * Aquatic Soundscape:
   * Smooth, calming oceanic swells using filtered sine harmonics (no harsh white noise)
   */
  startAquaticSoundscape() {
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const themeGain = ctx.createGain();
    themeGain.gain.setValueAtTime(0.0001, now);
    themeGain.gain.linearRampToValueAtTime(0.4, now + 1.5);
    themeGain.connect(this.masterGain);

    // Warm deep swell
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(96, now);
    subGain.gain.setValueAtTime(0.03, now);

    const subFilter = ctx.createBiquadFilter();
    subFilter.type = 'lowpass';
    subFilter.frequency.setValueAtTime(140, now);

    subOsc.connect(subFilter);
    subFilter.connect(subGain);
    subGain.connect(themeGain);
    subOsc.start();
    this.activeNodes.push({ source: subOsc, gainNode: subGain });

    // Bioluminescent drops
    const drops = [523.25, 659.25, 783.99];
    this.intervalId = setInterval(() => {
      if (!this.isPlaying || this.isMuted || Math.random() > 0.4) return;
      this.playHydroDrop(drops[Math.floor(Math.random() * drops.length)], themeGain);
    }, 4000);
  }

  playHydroDrop(freq, targetNode) {
    if (!this.ctx || this.isMuted) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.85, now + 0.15);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.02, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

    osc.connect(gain);
    gain.connect(targetNode);

    osc.start(now);
    osc.stop(now + 1.9);
  }

  /**
   * Steampunk Soundscape:
   * Warm gentle acoustic tones
   */
  startSteampunkSoundscape() {
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const themeGain = ctx.createGain();
    themeGain.gain.setValueAtTime(0.0001, now);
    themeGain.gain.linearRampToValueAtTime(0.35, now + 1.5);
    themeGain.connect(this.masterGain);

    const chords = [174.61, 261.63];
    chords.forEach((f) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(260, now);

      oscGain.gain.setValueAtTime(0.02, now);

      osc.connect(filter);
      filter.connect(oscGain);
      oscGain.connect(themeGain);

      osc.start();
      this.activeNodes.push({ source: osc, gainNode: oscGain });
    });
  }

  getAnalyserData() {
    if (!this.analyser) return new Uint8Array(64);
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);
    return dataArray;
  }
}
