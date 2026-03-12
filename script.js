/* ============================================================
   WANG ZINING · PERSONAL ACADEMIC WEBSITE · script.js
   ============================================================ */

// ---- Typed text ----
const phrases = [
  'Public Policy',
  'Urban AI',
  'Spatial Econometrics',
  'Environmental Economics',
  'Smart Cities'
];
let phraseIdx = 0, charIdx = 0, deleting = false;
const typedEl = document.getElementById('typed');

function typeLoop() {
  const current = phrases[phraseIdx];
  if (!deleting) {
    typedEl.textContent = current.slice(0, charIdx + 1);
    charIdx++;
    if (charIdx === current.length) {
      deleting = true;
      setTimeout(typeLoop, 1800);
      return;
    }
  } else {
    typedEl.textContent = current.slice(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) {
      deleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
    }
  }
  setTimeout(typeLoop, deleting ? 60 : 100);
}
typeLoop();

// ---- Particle canvas ----
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
const PARTICLE_COUNT = 70;

function resize() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

class Particle {
  constructor() { this.reset(true); }
  reset(initial = false) {
    this.x  = Math.random() * canvas.width;
    this.y  = initial ? Math.random() * canvas.height : canvas.height + 10;
    this.vx = (Math.random() - .5) * .35;
    this.vy = -(Math.random() * .5 + .15);
    this.r  = Math.random() * 2 + .5;
    this.alpha = Math.random() * .35 + .08;
    // soft colors for white background
    const roll = Math.random();
    this.color = roll > .65 ? '#00c6ae' : roll > .35 ? '#f5c842' : '#0a0f2e';
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    if (this.y < -10) this.reset();
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
  }
}

for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  // Draw faint connections
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        ctx.save();
        ctx.globalAlpha = (1 - dist / 100) * 0.05;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = '#00897b';
        ctx.lineWidth = .5;
        ctx.stroke();
        ctx.restore();
      }
    }
  }
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ---- Navbar scroll ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// ---- Hamburger ----
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');
hamburger?.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
navLinks?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ---- Scroll reveal ----
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger siblings
      const siblings = [...entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')];
      const idx = siblings.indexOf(entry.target);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, idx * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => revealObserver.observe(el));

// ---- Publication filter ----
const pubBtns  = document.querySelectorAll('.pub-btn');
const pubCards = document.querySelectorAll('.pub-card');

pubBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    pubBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    pubCards.forEach(card => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hidden', !show);
    });
  });
});

// ---- Smooth active nav on scroll ----
const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navLinkEls.forEach(a => {
    a.classList.toggle('active-nav', a.getAttribute('href') === '#' + current);
  });
});

// ---- Photo fallback: if no photo, show initials avatar ----
const heroPhoto = document.getElementById('hero-photo');
if (heroPhoto) {
  heroPhoto.addEventListener('error', () => {
    heroPhoto.style.display = 'none';
    const wrap = heroPhoto.parentElement;
    const avatar = document.createElement('div');
    avatar.style.cssText = `
      width:170px;height:170px;border-radius:50%;
      background:linear-gradient(135deg,#e8f5f3,#d0f0ec);
      border:3px solid #00c6ae;
      display:flex;align-items:center;justify-content:center;
      font-size:3.5rem;font-weight:700;color:#00897b;
      font-family:'Playfair Display',serif;
      animation:float 6s ease-in-out infinite;
      box-shadow:0 0 0 6px rgba(0,198,174,.10),0 16px 48px rgba(10,15,46,.14);
    `;
    avatar.textContent = 'Z';
    wrap.appendChild(avatar);
  });
}
