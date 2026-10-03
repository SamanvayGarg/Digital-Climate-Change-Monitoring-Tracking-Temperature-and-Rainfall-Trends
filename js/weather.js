/**
 * Digital Climate Change Monitoring: Tracking Temperature and Rainfall Trends
 * Interactive Weather Engine (Canvas-based Rain, Heavy Rain, & Thunderstorm Simulator)
 * with Real-Time Web Audio Synthesized Continuous Rainfall & Thunder
 */

class WeatherSimulationEngine {
  constructor(canvasId, containerId) {
    this.canvas = document.getElementById(canvasId);
    this.container = document.getElementById(containerId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.mode = 'clear'; // 'clear', 'rain', 'heavy-rain', 'thunderstorm'
    this.drops = [];
    this.splashes = [];
    this.clouds = [];
    this.lightningBolts = [];
    this.isFlashing = false;
    this.flashOpacity = 0;
    this.animationFrameId = null;

    // Audio System
    this.audioEnabled = true; // Enabled by default on user weather mode interaction
    this.audioContext = null;
    this.masterGain = null;
    this.currentRainSource = null;
    this.currentRainGain = null;
    
    // Wind tilt
    this.windAngle = 0.15; // radians (~8.5 degrees tilt)

    // Lightning timer
    this.lastLightningTime = Date.now();
    this.nextLightningInterval = 4000 + Math.random() * 5000;

    this.initCanvasSize();
    this.initClouds();
    this.bindEvents();
    this.updateAudioButtonState();
  }

  initCanvasSize() {
    if (!this.canvas || !this.container) return;
    const rect = this.container.getBoundingClientRect();
    this.dpr = window.devicePixelRatio || 1;
    this.width = rect.width;
    this.height = Math.max(rect.height, 420);

    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.ctx.scale(this.dpr, this.dpr);
  }

  initClouds() {
    this.clouds = [];
    const numClouds = 6;
    for (let i = 0; i < numClouds; i++) {
      this.clouds.push({
        x: Math.random() * (this.width || 800),
        y: 20 + Math.random() * 80,
        radius: 35 + Math.random() * 45,
        speed: 0.15 + Math.random() * 0.25,
        opacity: 0.4 + Math.random() * 0.3
      });
    }
  }

  // ==========================================
  // AUDIO SYNTHESIZER ENGINE (Web Audio API)
  // ==========================================
  initAudioContext() {
    if (!this.audioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.audioContext = new AudioCtx();
        this.masterGain = this.audioContext.createGain();
        this.masterGain.gain.setValueAtTime(1.0, this.audioContext.currentTime);
        this.masterGain.connect(this.audioContext.destination);
      }
    }
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume().catch(() => {});
    }
  }

  updateAudioButtonState() {
    const btnAudio = document.getElementById('btnToggleAudio');
    if (!btnAudio) return;
    btnAudio.classList.toggle('audio-active', this.audioEnabled);
    btnAudio.innerHTML = this.audioEnabled 
      ? '<i class="icon">🔊</i> Sound: ON' 
      : '<i class="icon">🔇</i> Sound: OFF';
  }

  generateRainBuffer(type = 'light') {
    if (!this.audioContext) return null;
    const sampleRate = this.audioContext.sampleRate;
    const duration = 4.0; // 4.0 seconds seamless looping buffer
    const frameCount = Math.floor(sampleRate * duration);
    const buffer = this.audioContext.createBuffer(2, frameCount, sampleRate);
    const isHeavy = (type === 'heavy' || type === 'storm');

    for (let ch = 0; ch < 2; ch++) {
      const data = buffer.getChannelData(ch);
      let b0 = 0, b1 = 0, b2 = 0; // Filter state for pink noise
      
      for (let i = 0; i < frameCount; i++) {
        const white = Math.random() * 2 - 1;
        
        // Paul Kellet's filtered pink noise approximation
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        const pink = b0 + b1 + b2 + white * 0.5362;
        
        let val = isHeavy ? (pink * 0.26 + white * 0.14) : (pink * 0.14 + white * 0.07);

        // Randomized micro-raindrop impact clicks
        const dropProb = isHeavy ? 0.045 : 0.016;
        if (Math.random() < dropProb) {
          const dropPop = (Math.random() * 2 - 1) * (isHeavy ? 0.65 : 0.28);
          val += dropPop;
        }

        // Seamless boundary crossfade to avoid loop clicks
        const fadeLen = Math.floor(sampleRate * 0.08); // 80ms fade window
        if (i < fadeLen) {
          val *= (i / fadeLen);
        } else if (i > frameCount - fadeLen) {
          val *= ((frameCount - i) / fadeLen);
        }

        data[i] = val;
      }
    }
    return buffer;
  }

  playRainAudio(type) {
    if (!this.audioEnabled) return;
    this.initAudioContext();
    if (!this.audioContext) return;

    // Stop and fade out any existing rain sound to prevent overlap
    this.stopCurrentRainSource(0.12);

    const buffer = this.generateRainBuffer(type);
    if (!buffer) return;

    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    // Filter frequency shaping for realistic atmosphere
    const filter = this.audioContext.createBiquadFilter();
    if (type === 'light') {
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2200, this.audioContext.currentTime);
      filter.Q.setValueAtTime(0.75, this.audioContext.currentTime);
    } else {
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(3400, this.audioContext.currentTime);
      filter.Q.setValueAtTime(1.0, this.audioContext.currentTime);
    }

    const rainGain = this.audioContext.createGain();
    const targetGain = (type === 'light') ? 0.20 : ((type === 'storm') ? 0.40 : 0.34);
    
    // Smooth fade in
    rainGain.gain.setValueAtTime(0.001, this.audioContext.currentTime);
    rainGain.gain.linearRampToValueAtTime(targetGain, this.audioContext.currentTime + 0.18);

    source.connect(filter);
    filter.connect(rainGain);
    rainGain.connect(this.masterGain);

    source.start(0);

    this.currentRainSource = source;
    this.currentRainGain = rainGain;
  }

  stopCurrentRainSource(fadeDuration = 0.12) {
    if (this.currentRainSource && this.currentRainGain && this.audioContext) {
      try {
        const prevGain = this.currentRainGain;
        const prevSource = this.currentRainSource;
        const now = this.audioContext.currentTime;
        prevGain.gain.setValueAtTime(prevGain.gain.value, now);
        prevGain.gain.linearRampToValueAtTime(0.0001, now + fadeDuration);
        setTimeout(() => {
          try {
            prevSource.stop();
            prevSource.disconnect();
          } catch(e) {}
        }, fadeDuration * 1000 + 35);
      } catch (e) {}
      this.currentRainSource = null;
      this.currentRainGain = null;
    }
  }

  stopAllAudio() {
    this.stopCurrentRainSource(0.15);
  }

  playLightningAndThunder() {
    if (!this.audioEnabled) return;
    this.initAudioContext();
    if (!this.audioContext) return;

    try {
      const now = this.audioContext.currentTime;

      // 1. Sharp electrical snap/crack of nearby lightning arc
      const crackLen = Math.floor(this.audioContext.sampleRate * 0.08);
      const crackBuffer = this.audioContext.createBuffer(1, crackLen, this.audioContext.sampleRate);
      const crackData = crackBuffer.getChannelData(0);
      for (let i = 0; i < crackLen; i++) {
        crackData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.audioContext.sampleRate * 0.018));
      }
      const crackSource = this.audioContext.createBufferSource();
      crackSource.buffer = crackBuffer;
      const crackGain = this.audioContext.createGain();
      crackGain.gain.setValueAtTime(0.32, now);
      crackSource.connect(crackGain);
      crackGain.connect(this.masterGain);
      crackSource.start(now);

      // 2. Rolling thunder rumble following shortly after
      setTimeout(() => {
        if (!this.audioEnabled || !this.audioContext || this.mode !== 'thunderstorm') return;
        this.playThunderSound();
      }, 120);
    } catch(e) {}
  }

  playThunderSound() {
    try {
      if (!this.audioContext) return;
      const sampleRate = this.audioContext.sampleRate;
      const duration = 2.6;
      const buffer = this.audioContext.createBuffer(1, Math.floor(sampleRate * duration), sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < data.length; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + (0.02 * white)) / 1.02; // Brown/pink noise
        lastOut = data[i];
        data[i] *= 3.8;
      }

      const noise = this.audioContext.createBufferSource();
      noise.buffer = buffer;

      const filter = this.audioContext.createBiquadFilter();
      filter.type = 'lowpass';
      const now = this.audioContext.currentTime;
      filter.frequency.setValueAtTime(150, now);
      filter.frequency.exponentialRampToValueAtTime(38, now + duration);

      const gain = this.audioContext.createGain();
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.30, now + 0.16);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      noise.start(now);
    } catch (e) {}
  }

  // ==========================================
  // WEATHER MODE & SIMULATION ENGINE
  // ==========================================
  setMode(mode) {
    this.mode = mode;
    this.drops = [];
    this.splashes = [];
    this.lightningBolts = [];
    this.isFlashing = false;
    this.flashOpacity = 0;

    // Atmospheric mood shift on container
    if (this.container) {
      this.container.classList.remove('weather-mode-clear', 'weather-mode-rain', 'weather-mode-heavy', 'weather-mode-storm');
      if (mode === 'rain') this.container.classList.add('weather-mode-rain');
      else if (mode === 'heavy-rain') this.container.classList.add('weather-mode-heavy');
      else if (mode === 'thunderstorm') this.container.classList.add('weather-mode-storm');
      else this.container.classList.add('weather-mode-clear');
    }

    // Configure particle density
    let dropCount = 0;
    if (mode === 'rain') dropCount = 140;
    else if (mode === 'heavy-rain') dropCount = 340;
    else if (mode === 'thunderstorm') dropCount = 480;

    for (let i = 0; i < dropCount; i++) {
      this.drops.push(this.createDrop(true));
    }

    // Update active button state and status display
    this.updateStatusDisplay();

    // Manage Audio Playback per mode
    if (mode === 'rain') {
      this.playRainAudio('light');
    } else if (mode === 'heavy-rain') {
      this.playRainAudio('heavy');
    } else if (mode === 'thunderstorm') {
      this.playRainAudio('storm');
    } else {
      this.stopAllAudio();
    }

    // Canvas render loop control
    if (mode === 'clear') {
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
      }
      this.ctx.clearRect(0, 0, this.width, this.height);
    } else {
      if (!this.animationFrameId) {
        this.loop();
      }
    }
  }

  createDrop(initial = false) {
    const isHeavy = this.mode === 'heavy-rain' || this.mode === 'thunderstorm';
    const speedBase = isHeavy ? 14 : 9;
    const speedVar = isHeavy ? 6 : 4;
    const lengthBase = isHeavy ? 20 : 13;

    return {
      x: Math.random() * (this.width + 150) - 50,
      y: initial ? Math.random() * this.height : -20 - Math.random() * 50,
      length: lengthBase + Math.random() * 12,
      speed: speedBase + Math.random() * speedVar,
      opacity: isHeavy ? (0.45 + Math.random() * 0.45) : (0.25 + Math.random() * 0.4),
      thickness: isHeavy ? (1.2 + Math.random() * 1.0) : (0.8 + Math.random() * 0.8),
      depth: 0.5 + Math.random() * 0.5
    };
  }

  createSplash(x, y) {
    const numParticles = 3 + Math.floor(Math.random() * 3);
    for (let i = 0; i < numParticles; i++) {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.5;
      const speed = 1.5 + Math.random() * 2.5;
      this.splashes.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 0.8 + Math.random() * 1.2,
        life: 1.0,
        decay: 0.05 + Math.random() * 0.04
      });
    }
  }

  generateLightning() {
    this.isFlashing = true;
    this.flashOpacity = 0.65;
    this.lightningBolts = [];

    // Branching lightning bolt paths
    const startX = 50 + Math.random() * (this.width - 100);
    const startY = 10;
    const bolt = [];
    let currentX = startX;
    let currentY = startY;

    bolt.push({ x: currentX, y: currentY });

    while (currentY < this.height * 0.85) {
      currentY += 12 + Math.random() * 22;
      currentX += (Math.random() - 0.48) * 35;
      bolt.push({ x: currentX, y: currentY });

      // Occasional sub-branch
      if (Math.random() < 0.25 && currentY < this.height * 0.65) {
        const branch = [];
        let bX = currentX;
        let bY = currentY;
        for (let b = 0; b < 4; b++) {
          bY += 10 + Math.random() * 15;
          bX += (Math.random() - 0.45) * 28;
          branch.push({ x: bX, y: bY });
        }
        this.lightningBolts.push({ segments: branch, isBranch: true, life: 1 });
      }
    }

    this.lightningBolts.push({ segments: bolt, isBranch: false, life: 1 });

    // Trigger synchronized electrical crack & rolling thunder audio
    if (this.audioEnabled) {
      this.playLightningAndThunder();
    }
  }

  loop() {
    if (this.mode === 'clear') return;

    this.update();
    this.draw();

    this.animationFrameId = requestAnimationFrame(() => this.loop());
  }

  update() {
    const isHeavy = this.mode === 'heavy-rain' || this.mode === 'thunderstorm';

    // Update Rain Drops
    for (let i = 0; i < this.drops.length; i++) {
      const drop = this.drops[i];
      drop.y += drop.speed;
      drop.x += Math.sin(this.windAngle) * drop.speed;

      // Splash on bottom boundary
      if (drop.y >= this.height - 15) {
        if (Math.random() < (isHeavy ? 0.35 : 0.15)) {
          this.createSplash(drop.x, this.height - 10);
        }
        this.drops[i] = this.createDrop(false);
      }
    }

    // Update Splash Particles
    for (let i = this.splashes.length - 1; i >= 0; i--) {
      const s = this.splashes[i];
      s.x += s.vx;
      s.y += s.vy;
      s.vy += 0.15; // Gravity
      s.life -= s.decay;
      if (s.life <= 0) {
        this.splashes.splice(i, 1);
      }
    }

    // Update Floating Clouds
    for (const c of this.clouds) {
      c.x += c.speed;
      if (c.x - c.radius > this.width) {
        c.x = -c.radius * 2;
        c.y = 15 + Math.random() * 80;
      }
    }

    // Check Thunderstorm Lightning Timing
    if (this.mode === 'thunderstorm') {
      const now = Date.now();
      if (now - this.lastLightningTime > this.nextLightningInterval) {
        this.generateLightning();
        this.lastLightningTime = now;
        this.nextLightningInterval = 4500 + Math.random() * 5500;
      }
    }

    // Decay Screen Flash
    if (this.isFlashing) {
      this.flashOpacity -= 0.04;
      if (this.flashOpacity <= 0) {
        this.isFlashing = false;
        this.flashOpacity = 0;
        this.lightningBolts = [];
      }
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // 1. Atmospheric Tint Overlay
    if (this.mode === 'rain') {
      this.ctx.fillStyle = 'rgba(15, 35, 25, 0.08)';
      this.ctx.fillRect(0, 0, this.width, this.height);
    } else if (this.mode === 'heavy-rain') {
      this.ctx.fillStyle = 'rgba(12, 28, 22, 0.18)';
      this.ctx.fillRect(0, 0, this.width, this.height);
    } else if (this.mode === 'thunderstorm') {
      this.ctx.fillStyle = 'rgba(9, 20, 18, 0.32)';
      this.ctx.fillRect(0, 0, this.width, this.height);
    }

    // 2. Clouds
    this.drawClouds();

    // 3. Raindrops
    this.ctx.save();
    for (const drop of this.drops) {
      this.ctx.beginPath();
      const endX = drop.x - Math.sin(this.windAngle) * drop.length;
      const endY = drop.y - Math.cos(this.windAngle) * drop.length;

      this.ctx.moveTo(drop.x, drop.y);
      this.ctx.lineTo(endX, endY);

      if (this.mode === 'thunderstorm') {
        this.ctx.strokeStyle = `rgba(180, 225, 255, ${drop.opacity * 0.95})`;
      } else {
        this.ctx.strokeStyle = `rgba(130, 210, 215, ${drop.opacity * 0.8})`;
      }
      this.ctx.lineWidth = drop.thickness;
      this.ctx.lineCap = 'round';
      this.ctx.stroke();
    }
    this.ctx.restore();

    // 4. Splash Particles
    this.ctx.save();
    for (const s of this.splashes) {
      this.ctx.beginPath();
      this.ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(180, 225, 235, ${s.life * 0.6})`;
      this.ctx.fill();
    }
    this.ctx.restore();

    // 5. Lightning Bolts & Screen Flash
    if (this.mode === 'thunderstorm' && (this.isFlashing || this.lightningBolts.length > 0)) {
      this.ctx.fillStyle = `rgba(220, 245, 255, ${this.flashOpacity * 0.55})`;
      this.ctx.fillRect(0, 0, this.width, this.height);

      for (const bolt of this.lightningBolts) {
        if (!bolt.segments || bolt.segments.length < 2) continue;
        
        // Outer glow
        this.ctx.beginPath();
        this.ctx.moveTo(bolt.segments[0].x, bolt.segments[0].y);
        for (let i = 1; i < bolt.segments.length; i++) {
          this.ctx.lineTo(bolt.segments[i].x, bolt.segments[i].y);
        }
        this.ctx.strokeStyle = `rgba(167, 243, 208, ${this.flashOpacity * 0.7})`;
        this.ctx.lineWidth = bolt.isBranch ? 3 : 5;
        this.ctx.stroke();

        // Inner white hot core
        this.ctx.beginPath();
        this.ctx.moveTo(bolt.segments[0].x, bolt.segments[0].y);
        for (let i = 1; i < bolt.segments.length; i++) {
          this.ctx.lineTo(bolt.segments[i].x, bolt.segments[i].y);
        }
        this.ctx.strokeStyle = `rgba(255, 255, 255, ${this.flashOpacity * 0.95})`;
        this.ctx.lineWidth = bolt.isBranch ? 1.5 : 2.5;
        this.ctx.stroke();
      }
    }
  }

  drawClouds() {
    this.ctx.save();
    for (const c of this.clouds) {
      const gradient = this.ctx.createRadialGradient(c.x, c.y, 5, c.x, c.y, c.radius);
      if (this.mode === 'thunderstorm') {
        gradient.addColorStop(0, `rgba(40, 55, 50, ${c.opacity * 0.9})`);
        gradient.addColorStop(1, 'rgba(25, 35, 30, 0)');
      } else {
        gradient.addColorStop(0, `rgba(180, 205, 195, ${c.opacity * 0.5})`);
        gradient.addColorStop(1, 'rgba(180, 205, 195, 0)');
      }
      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
      this.ctx.fill();
    }
    this.ctx.restore();
  }

  // ==========================================
  // STATUS INDICATOR & BUTTON ACTIVE STATE FIX
  // ==========================================
  updateStatusDisplay() {
    const statusTextEl = document.getElementById('weatherStatusText');
    const statusIconEl = document.getElementById('weatherStatusIcon');
    const statusBadgeEl = document.getElementById('weatherStatusBadge');
    const statusRateEl = document.getElementById('weatherPrecipRate');

    if (!statusTextEl || !statusIconEl) return;

    let icon = '☀️';
    let text = 'Clear';
    let rate = '0.0 mm/hr (Dry / Calm)';
    let badgeClass = 'status-clear';

    if (this.mode === 'rain') {
      icon = '🌦';
      text = 'Light Rain';
      rate = '2.4 - 5.0 mm/hr (Gentle Precipitation)';
      badgeClass = 'status-light-rain';
    } else if (this.mode === 'heavy-rain') {
      icon = '🌧';
      text = 'Heavy Rain';
      rate = '12.0 - 24.5 mm/hr (Intense Downpour)';
      badgeClass = 'status-heavy-rain';
    } else if (this.mode === 'thunderstorm') {
      icon = '⛈';
      text = 'Thunderstorm';
      rate = '35.0+ mm/hr (Convective Storm & Lightning)';
      badgeClass = 'status-thunderstorm';
    }

    statusIconEl.textContent = icon;
    statusTextEl.textContent = text;
    if (statusRateEl) statusRateEl.textContent = rate;

    if (statusBadgeEl) {
      statusBadgeEl.className = `weather-status-badge ${badgeClass}`;
    }

    // STRICT BUTTON STATE FIX (BUG 2):
    // Remove active class from ALL weather control buttons first
    const btnRain = document.getElementById('btnRainMode');
    const btnHeavy = document.getElementById('btnHeavyRainMode');
    const btnStorm = document.getElementById('btnThunderstormMode');
    const btnStop = document.getElementById('btnStopWeather');

    [btnRain, btnHeavy, btnStorm, btnStop].forEach(btn => {
      if (btn) btn.classList.remove('active');
    });

    // Apply active class exclusively to the selected mode
    if (this.mode === 'rain') {
      if (btnRain) btnRain.classList.add('active');
    } else if (this.mode === 'heavy-rain') {
      if (btnHeavy) btnHeavy.classList.add('active');
    } else if (this.mode === 'thunderstorm') {
      if (btnStorm) btnStorm.classList.add('active');
    } else if (this.mode === 'clear') {
      if (btnStop) btnStop.classList.add('active');
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.initCanvasSize();
    });

    const btnRain = document.getElementById('btnRainMode');
    const btnHeavy = document.getElementById('btnHeavyRainMode');
    const btnStorm = document.getElementById('btnThunderstormMode');
    const btnStop = document.getElementById('btnStopWeather');
    const btnAudio = document.getElementById('btnToggleAudio');

    const handleModeActivation = (mode) => {
      this.initAudioContext();
      this.setMode(mode);
    };

    if (btnRain) {
      btnRain.addEventListener('click', () => handleModeActivation('rain'));
    }
    if (btnHeavy) {
      btnHeavy.addEventListener('click', () => handleModeActivation('heavy-rain'));
    }
    if (btnStorm) {
      btnStorm.addEventListener('click', () => handleModeActivation('thunderstorm'));
    }
    if (btnStop) {
      btnStop.addEventListener('click', () => {
        this.setMode('clear');
      });
    }

    if (btnAudio) {
      btnAudio.addEventListener('click', () => {
        this.audioEnabled = !this.audioEnabled;
        this.updateAudioButtonState();
        if (!this.audioEnabled) {
          this.stopAllAudio();
        } else {
          // Restart rain sound if mode is currently active
          if (this.mode === 'rain') this.playRainAudio('light');
          else if (this.mode === 'heavy-rain') this.playRainAudio('heavy');
          else if (this.mode === 'thunderstorm') this.playRainAudio('storm');
        }
      });
    }
  }
}

// Attach to window so other scripts can access
window.WeatherSimulationEngine = WeatherSimulationEngine;
