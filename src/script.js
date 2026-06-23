// ── Alternating background scenes ─────────────────────────────────────────
const canvas = document.createElement('canvas');
canvas.style.cssText = 'position:fixed;inset:0;z-index:0;pointer-events:none;';
document.body.prepend(canvas);
const ctx = canvas.getContext('2d');

const SWITCH_INTERVAL = 60_000;
const sceneModes = [];
let activeSceneIndex = 0;
let lastTimestamp = 0;
let mouseX = -9999;
let mouseY = -9999;
let width = 0;
let height = 0;

function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  sceneModes[activeSceneIndex]?.resize(width, height);
}

class ConstellationScene {
  constructor() {
    this.particles = [];
    this.count = 60;
    this.maxDistance = 130;
    this.colors = ['#7dd3fc', '#38bdf8', '#f59e0b'];
  }

  resize() {
    this.particles = Array.from({ length: this.count }, () => this.createParticle(true));
  }

  createParticle(scatter) {
    return {
      x: scatter ? Math.random() * width : (Math.random() < 0.5 ? -10 : width + 10),
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.38,
      vy: (Math.random() - 0.5) * 0.38,
      r: Math.random() * 1.6 + 0.5,
      a: Math.random() * 0.5 + 0.3,
      color: this.colors[Math.floor(Math.random() * this.colors.length)],
    };
  }

  updateParticle(particle) {
    const dx = particle.x - mouseX;
    const dy = particle.y - mouseY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 90 && distance > 0) {
      particle.x += (dx / distance) * 0.6;
      particle.y += (dy / distance) * 0.6;
    }

    particle.x += particle.vx;
    particle.y += particle.vy;

    if (particle.x < -20 || particle.x > width + 20 || particle.y < -20 || particle.y > height + 20) {
      Object.assign(particle, this.createParticle(false));
    }
  }

  drawFrame() {
    ctx.clearRect(0, 0, width, height);

    const backdrop = ctx.createRadialGradient(width * 0.18, height * 0.16, 0, width * 0.18, height * 0.16, Math.max(width, height) * 0.85);
    backdrop.addColorStop(0, 'rgba(56, 189, 248, 0.14)');
    backdrop.addColorStop(0.45, 'rgba(15, 23, 42, 0.05)');
    backdrop.addColorStop(1, 'rgba(2, 6, 23, 0.18)');
    ctx.fillStyle = backdrop;
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < this.particles.length; i++) {
      const particle = this.particles[i];
      this.updateParticle(particle);

      ctx.save();
      ctx.globalAlpha = particle.a;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
      ctx.fillStyle = particle.color;
      ctx.fill();
      ctx.restore();

      for (let j = i + 1; j < this.particles.length; j++) {
        const other = this.particles[j];
        const dx = particle.x - other.x;
        const dy = particle.y - other.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.maxDistance) {
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(other.x, other.y);
          ctx.strokeStyle = `rgba(125, 211, 252, ${(1 - distance / this.maxDistance) * 0.3})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }
}

class NeonAuroraScene {
  constructor() {
    this.orbs = [];
    this.sparks = [];
  }

  resize() {
    const orbCount = 7;
    const sparkCount = 110;

    this.orbs = Array.from({ length: orbCount }, (_, index) => ({
      radius: 80 + index * 18 + Math.random() * 24,
      orbit: 0.22 + index * 0.04,
      phase: Math.random() * Math.PI * 2,
      color: ['#22d3ee', '#f59e0b', '#fb7185', '#60a5fa'][index % 4],
    }));

    this.sparks = Array.from({ length: sparkCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 1.8,
      vy: (Math.random() - 0.5) * 1.8,
      size: Math.random() * 1.6 + 0.4,
      life: Math.random(),
    }));
  }

  updateSpark(spark, time) {
    spark.x += spark.vx;
    spark.y += spark.vy;
    spark.life += 0.006;

    if (spark.x < -30 || spark.x > width + 30 || spark.y < -30 || spark.y > height + 30) {
      spark.x = Math.random() * width;
      spark.y = Math.random() * height;
      spark.vx = (Math.random() - 0.5) * 1.8;
      spark.vy = (Math.random() - 0.5) * 1.8;
      spark.life = Math.random();
    }

    spark.vx += Math.sin(time * 0.0003 + spark.life) * 0.01;
    spark.vy += Math.cos(time * 0.00025 + spark.life) * 0.01;
  }

  drawGlowBlob(x, y, radius, innerColor, outerColor) {
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, innerColor);
    gradient.addColorStop(1, outerColor);
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  drawFrame(time) {
    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'source-over';

    const base = ctx.createLinearGradient(0, 0, width, height);
    base.addColorStop(0, 'rgba(5, 10, 24, 1)');
    base.addColorStop(0.5, 'rgba(8, 15, 35, 1)');
    base.addColorStop(1, 'rgba(22, 8, 40, 1)');
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, width, height);

    ctx.globalCompositeOperation = 'lighter';

    const centerX = width * 0.52;
    const centerY = height * 0.46;
    const pulse = 0.72 + Math.sin(time * 0.0016) * 0.18;

    this.drawGlowBlob(centerX * 0.82, centerY * 0.72, Math.max(width, height) * 0.46, 'rgba(34, 211, 238, 0.24)', 'rgba(34, 211, 238, 0)');
    this.drawGlowBlob(centerX * 1.12, centerY * 0.42, Math.max(width, height) * 0.38, 'rgba(245, 158, 11, 0.18)', 'rgba(245, 158, 11, 0)');
    this.drawGlowBlob(centerX * 0.98, centerY * 1.08, Math.max(width, height) * 0.34, 'rgba(251, 113, 133, 0.16)', 'rgba(251, 113, 133, 0)');

    this.orbs.forEach((orb, index) => {
      const angle = time * 0.0003 * orb.orbit + orb.phase;
      const offsetX = Math.cos(angle) * orb.radius * (1.2 + Math.sin(time * 0.0007 + index) * 0.08);
      const offsetY = Math.sin(angle * 1.3) * orb.radius * 0.72;
      const x = centerX + offsetX;
      const y = centerY + offsetY;

      ctx.save();
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.08 + index * 0.008})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, orb.radius * (0.95 + Math.sin(time * 0.001 + index) * 0.02), 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      this.drawGlowBlob(x, y, 16 + pulse * 18, `${orb.color}cc`, `${orb.color}00`);
    });

    ctx.lineWidth = 2;
    for (let i = 0; i < 6; i++) {
      const sweep = time * 0.0004 + i * 0.9;
      const radius = Math.min(width, height) * (0.16 + i * 0.045);
      ctx.beginPath();
      ctx.strokeStyle = `rgba(125, 211, 252, ${0.04 + i * 0.012})`;
      ctx.arc(centerX, centerY, radius, sweep, sweep + Math.PI * 1.3);
      ctx.stroke();
    }

    this.sparks.forEach((spark) => {
      this.updateSpark(spark, time);
      ctx.save();
      ctx.globalAlpha = 0.35 + spark.life * 0.3;
      ctx.strokeStyle = spark.life > 0.66 ? '#f59e0b' : '#7dd3fc';
      ctx.lineWidth = spark.size;
      ctx.beginPath();
      ctx.moveTo(spark.x, spark.y);
      ctx.lineTo(spark.x - spark.vx * 10, spark.y - spark.vy * 10);
      ctx.stroke();
      ctx.restore();
    });

    ctx.globalCompositeOperation = 'source-over';
  }
}

sceneModes.push(new ConstellationScene(), new NeonAuroraScene());

function switchScene(nextIndex) {
  activeSceneIndex = nextIndex;
  sceneModes[activeSceneIndex].resize(width, height);
}

function loop(timestamp) {
  if (!lastTimestamp) {
    lastTimestamp = timestamp;
  }

  if (timestamp - lastTimestamp >= SWITCH_INTERVAL) {
    switchScene((activeSceneIndex + 1) % sceneModes.length);
    lastTimestamp = timestamp;
  }

  sceneModes[activeSceneIndex].drawFrame(timestamp);
  requestAnimationFrame(loop);
}

window.addEventListener('resize', resizeCanvas);
document.addEventListener('mousemove', (event) => {
  mouseX = event.clientX;
  mouseY = event.clientY;
  document.body.style.setProperty('--cursor-x', `${event.clientX}px`);
  document.body.style.setProperty('--cursor-y', `${event.clientY}px`);
});

resizeCanvas();
switchScene(0);
requestAnimationFrame(loop);

// ── Scroll reveal with stagger ────────────────────────────────────────────
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('#bime1, #bime2').forEach((card, i) => {
  card.style.setProperty('--delay', `${i * 150}ms`);
  card.classList.add('reveal');
  observer.observe(card);
});

document.querySelectorAll('#bime1 li, #bime2 li').forEach((li, i) => {
  li.style.setProperty('--delay', `${200 + i * 70}ms`);
  li.classList.add('reveal');
  observer.observe(li);
});

// ── Scramble text on "Atividades" title ───────────────────────────────────
const title = document.querySelector('body > h1:nth-of-type(2)');
if (title) {
  const original = title.textContent.trim();
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&';
  let frame = 0;
  const total = original.length * 2;
  const interval = setInterval(() => {
    title.textContent = original.split('').map((ch, i) => {
      if (ch === ' ') return ' ';
      if (i < frame / 2) return ch;
      return chars[Math.floor(Math.random() * chars.length)];
    }).join('');
    frame++;
    if (frame > total) { title.textContent = original; clearInterval(interval); }
  }, 35);
}
