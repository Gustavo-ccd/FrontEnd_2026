// ── Constellation background ──────────────────────────────────────────────
const canvas = document.createElement('canvas');
canvas.style.cssText = 'position:fixed;inset:0;z-index:0;pointer-events:none;';
document.body.prepend(canvas);
const ctx = canvas.getContext('2d');

let W, H, particles;
const COUNT = 60;
const MAX_DIST = 130;
const COLORS = ['#7dd3fc', '#38bdf8', '#f59e0b'];
let mouseX = -9999, mouseY = -9999;

class Particle {
  constructor(scatter) {
    this.reset(scatter ?? true);
  }
  reset(scatter) {
    this.x = scatter ? Math.random() * W : (Math.random() < 0.5 ? -10 : W + 10);
    this.y = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.38;
    this.vy = (Math.random() - 0.5) * 0.38;
    this.r   = Math.random() * 1.6 + 0.5;
    this.a   = Math.random() * 0.5 + 0.3;
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
  }
  update() {
    // Subtle mouse repulsion
    const dx = this.x - mouseX;
    const dy = this.y - mouseY;
    const d  = Math.sqrt(dx * dx + dy * dy);
    if (d < 90 && d > 0) {
      this.x += (dx / d) * 0.6;
      this.y += (dy / d) * 0.6;
    }
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < -20 || this.x > W + 20 || this.y < -20 || this.y > H + 20) {
      this.reset(false);
    }
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.a;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
  }
}

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}

function initParticles() {
  resize();
  particles = Array.from({ length: COUNT }, () => new Particle(true));
}

function loop() {
  ctx.clearRect(0, 0, W, H);

  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].draw();

    for (let j = i + 1; j < particles.length; j++) {
      const dx   = particles[i].x - particles[j].x;
      const dy   = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MAX_DIST) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(125,211,252,${(1 - dist / MAX_DIST) * 0.3})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(loop);
}

window.addEventListener('resize', initParticles);
document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });
initParticles();
loop();

// ── Cursor spotlight ─────────────────────────────────────────────────────
document.addEventListener('mousemove', e => {
  document.body.style.setProperty('--cursor-x', `${e.clientX}px`);
  document.body.style.setProperty('--cursor-y', `${e.clientY}px`);
});

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
