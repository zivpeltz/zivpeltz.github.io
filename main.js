/* ── Particle Canvas ───────────────────────────── */
(function () {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], lines = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function rand(min, max) { return Math.random() * (max - min) + min; }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = rand(0, W);
      this.y  = rand(0, H);
      this.vx = rand(-0.18, 0.18);
      this.vy = rand(-0.18, 0.18);
      this.r  = rand(1, 2.2);
      this.alpha = rand(0.15, 0.55);
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W) this.vx *= -1;
      if (this.y < 0 || this.y > H) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(139,172,15,${this.alpha})`;
      ctx.fill();
    }
  }

  function init() {
    resize();
    const count = Math.min(80, Math.floor((W * H) / 14000));
    particles = Array.from({ length: count }, () => new Particle());
  }

  function drawLines() {
    const D = 130;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < D) {
          const alpha = (1 - dist / D) * 0.12;
          ctx.strokeStyle = `rgba(139,172,15,${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', () => { resize(); });
  init();
  animate();
})();

/* ── Navbar scroll ─────────────────────────────── */
(function () {
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
})();

/* ── Highlight cycle ───────────────────────────── */
(function () {
  const el = document.getElementById('highlight-cycle');
  if (!el) return;
  const phrases = ['systems software', 'Linux internals', 'low-level C', 'Android apps', 'CPU emulators'];
  let idx = 0;
  setInterval(() => {
    el.style.opacity = '0';
    setTimeout(() => {
      idx = (idx + 1) % phrases.length;
      el.textContent = phrases[idx];
      el.style.opacity = '1';
    }, 300);
  }, 2400);
})();

/* ── Scroll reveal ─────────────────────────────── */
(function () {
  const targets = document.querySelectorAll(
    '.about-card, .skill-category, .project-card, .contact-card, .section-title, .section-label'
  );
  targets.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 4) * 80}ms`;
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
  }, { threshold: 0.12 });

  targets.forEach(el => observer.observe(el));
})();

/* ── Skill bar animation ───────────────────────── */
(function () {
  const fills = document.querySelectorAll('.skill-bar-fill');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const w = e.target.dataset.width;
        e.target.style.width = w + '%';
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  fills.forEach(f => observer.observe(f));
})();

/* ── Stat counters ─────────────────────────────── */
(function () {
  const nums = document.querySelectorAll('.stat-num[data-target]');
  let started = false;

  function countUp(el, target) {
    let current = 0;
    const step = Math.ceil(target / 30);
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current;
      if (current >= target) clearInterval(timer);
    }, 40);
  }

  const hero = document.getElementById('hero');
  const observer = new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !started) {
      started = true;
      nums.forEach(el => countUp(el, parseInt(el.dataset.target)));
    }
  }, { threshold: 0.4 });
  if (hero) observer.observe(hero);
})();

/* ── Active nav link ───────────────────────────── */
(function () {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-link');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${e.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(s => observer.observe(s));
})();
