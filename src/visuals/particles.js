/**
 * Dynamic Atmospheric Particle System
 * Emits theme-specific ambient motes, bubbles, and embers with cursor deflection
 */
export class ParticleSystem {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    this.particles = [];
    this.theme = 'cosmic';
    this.animationFrame = null;
    this.mouseX = -1000;
    this.mouseY = -1000;
    this.particleCount = 55;

    this.resize();
    window.addEventListener('resize', () => this.resize());

    window.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouseX = (e.clientX - rect.left) * (this.canvas.width / rect.width);
      this.mouseY = (e.clientY - rect.top) * (this.canvas.height / rect.height);
    });

    // Battery & CPU optimization: pause particle animation when tab is inactive
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.stop();
      } else {
        this.start();
      }
    });

    this.initParticles();
  }

  resize() {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width * (window.devicePixelRatio || 1);
    this.canvas.height = rect.height * (window.devicePixelRatio || 1);
  }

  setTheme(theme) {
    this.theme = theme;
    this.initParticles();
  }

  initParticles() {
    this.particles = [];
    const w = this.canvas.width || window.innerWidth;
    const h = this.canvas.height || window.innerHeight;

    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push(this.createParticle(w, h, true));
    }
  }

  createParticle(w, h, randomY = false) {
    let speedY = -0.3 - Math.random() * 0.4;
    let speedX = (Math.random() - 0.5) * 0.3;
    let size = 1.2 + Math.random() * 2.5;
    let color = 'rgba(192, 132, 252, '; // cosmic default

    if (this.theme === 'aquatic') {
      speedY = -0.5 - Math.random() * 0.8; // bubbles float up
      speedX = Math.sin(Math.random() * Math.PI) * 0.3;
      color = Math.random() > 0.4 ? 'rgba(45, 212, 191, ' : 'rgba(56, 189, 248, ';
    } else if (this.theme === 'steampunk') {
      speedY = -0.2 - Math.random() * 0.5;
      speedX = (Math.random() - 0.5) * 0.4;
      color = Math.random() > 0.5 ? 'rgba(245, 158, 11, ' : 'rgba(251, 191, 36, ';
    } else {
      // Cosmic stardust
      speedY = (Math.random() - 0.5) * 0.25;
      speedX = (Math.random() - 0.5) * 0.25;
      color = Math.random() > 0.5 ? 'rgba(56, 189, 248, ' : 'rgba(192, 132, 252, ';
    }

    return {
      x: Math.random() * w,
      y: randomY ? Math.random() * h : h + 10,
      size,
      speedX,
      speedY,
      color,
      alpha: 0.1 + Math.random() * 0.6,
      maxAlpha: 0.4 + Math.random() * 0.5,
      pulseSpeed: 0.01 + Math.random() * 0.02,
      pulsePhase: Math.random() * Math.PI * 2
    };
  }

  start() {
    if (this.animationFrame) return;
    const loop = () => {
      this.draw();
      this.animationFrame = requestAnimationFrame(loop);
    };
    this.animationFrame = requestAnimationFrame(loop);
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

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      // Deflection from cursor
      const dx = p.x - this.mouseX;
      const dy = p.y - this.mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120 && dist > 0) {
        const force = (120 - dist) / 120;
        p.x += (dx / dist) * force * 2;
        p.y += (dy / dist) * force * 2;
      }

      p.x += p.speedX;
      p.y += p.speedY;
      p.pulsePhase += p.pulseSpeed;

      const currentAlpha = Math.abs(Math.sin(p.pulsePhase)) * p.maxAlpha;

      // Wrap around screen
      if (p.y < -15) p.y = h + 10;
      if (p.y > h + 15) p.y = -10;
      if (p.x < -15) p.x = w + 10;
      if (p.x > w + 15) p.x = -10;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color + currentAlpha + ')';
      ctx.shadowColor = p.color + '0.8)';
      ctx.shadowBlur = 4;
      ctx.fill();
    }
  }
}
