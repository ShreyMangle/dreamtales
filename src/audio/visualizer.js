/**
 * Audio Reactive Visualizer Canvas
 * Renders glowing waveforms and frequency bars responding to narration and ambient audio
 */
export class AudioVisualizer {
  constructor(canvasElement, ambientEngine, speechEngine) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    this.ambientEngine = ambientEngine;
    this.speechEngine = speechEngine;
    this.animationFrame = null;
    this.accentColor = '#38bdf8';
    this.secondaryColor = '#c084fc';
    this.bars = 32;
    this.smoothedValues = new Float32Array(this.bars);

    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width * (window.devicePixelRatio || 1);
    this.canvas.height = rect.height * (window.devicePixelRatio || 1);
  }

  setColors(accent, secondary) {
    this.accentColor = accent || '#38bdf8';
    this.secondaryColor = secondary || '#c084fc';
  }

  start() {
    if (this.animationFrame) return;
    const render = () => {
      this.draw();
      this.animationFrame = requestAnimationFrame(render);
    };
    this.animationFrame = requestAnimationFrame(render);
  }

  stop() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }

  draw() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    if (!ctx || w === 0 || h === 0) return;

    ctx.clearRect(0, 0, w, h);

    const isSpeaking = this.speechEngine.isPlaying && !this.speechEngine.isPaused;
    const isAmbient = this.ambientEngine.isPlaying && !this.ambientEngine.isMuted;
    const analyserData = this.ambientEngine.getAnalyserData();

    // Calculate simulated or real energy
    const barWidth = (w / this.bars) * 0.7;
    const gap = (w / this.bars) * 0.3;
    const centerY = h / 2;

    for (let i = 0; i < this.bars; i++) {
      let targetHeight = 4; // Idle baseline

      if (isSpeaking) {
        // Voice activity simulation with dynamic harmonic modulation
        const speechWave = Math.sin(Date.now() * 0.008 + i * 0.4) * 0.5 + 0.5;
        const speechDetail = Math.cos(Date.now() * 0.015 - i * 0.3) * 0.3 + 0.7;
        targetHeight += speechWave * speechDetail * (h * 0.75) * (0.6 + Math.random() * 0.4);
      }

      if (isAmbient && analyserData && analyserData.length > 0) {
        const binIndex = Math.floor((i / this.bars) * analyserData.length * 0.6);
        const freqAmp = (analyserData[binIndex] || 0) / 255;
        targetHeight += freqAmp * (h * 0.45);
      }

      // Smooth interpolation
      this.smoothedValues[i] += (targetHeight - this.smoothedValues[i]) * 0.18;
      const barH = Math.max(3, this.smoothedValues[i]);

      const x = i * (barWidth + gap) + gap / 2;

      // Gradient
      const grad = ctx.createLinearGradient(0, centerY - barH / 2, 0, centerY + barH / 2);
      grad.addColorStop(0, this.secondaryColor);
      grad.addColorStop(0.5, this.accentColor);
      grad.addColorStop(1, this.secondaryColor);

      ctx.fillStyle = grad;
      ctx.shadowColor = this.accentColor;
      ctx.shadowBlur = isSpeaking ? 8 : 3;

      // Draw rounded symmetric pill bar
      const radius = barWidth / 2;
      const top = centerY - barH / 2;
      ctx.beginPath();
      ctx.roundRect(x, top, barWidth, barH, radius);
      ctx.fill();
    }
  }
}
