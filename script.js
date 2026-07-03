/* ============================================================
   ZINING WANG · PERSONAL SITE · script.js
   ============================================================ */

// ---- Navbar hairline on scroll ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

// ---- Mobile menu ----
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');
hamburger?.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ---- Scroll reveal ----
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const siblings = [...entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')];
      const idx = siblings.indexOf(entry.target);
      setTimeout(() => entry.target.classList.add('visible'), idx * 70);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

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

// ---- Active nav link on scroll ----
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

// ---- Photo fallback: monogram if the image is missing ----
const heroPhoto = document.getElementById('hero-photo');
heroPhoto?.addEventListener('error', () => {
  heroPhoto.style.display = 'none';
  const avatar = document.createElement('div');
  avatar.style.cssText = `
    width:210px;height:262px;border-radius:2px;
    background:#ece7db;border:1px solid #d8d1c1;
    box-shadow:12px 12px 0 #ece7db,12px 12px 0 1px #d8d1c1;
    display:flex;align-items:center;justify-content:center;
    font-family:'Fraunces',serif;font-size:4rem;color:#9a4527;
  `;
  avatar.textContent = 'ZW';
  heroPhoto.parentElement.appendChild(avatar);
});
