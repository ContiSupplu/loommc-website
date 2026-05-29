// Nav glass border on scroll
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// Smooth anchor scrolling
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      document.getElementById('navLinks')?.classList.remove('nav-links-open');
    }
  });
});

// Scroll reveal (design_system.md §7.3 fadeIn)
const revealSelectors = [
  '.section-header', '.section-heading', '.card', '.di-item',
  '.loomie-card', '.loomie-orb-wrap', '.loomie-lead',
  '.dl-heading', '.dl-sub', '.btn-hero-dl', '.dl-meta',
  '.di-lead', '.di-compat', '.hero-desc', '.hero-actions', '.hero-note'
];

revealSelectors.forEach(sel => {
  document.querySelectorAll(sel).forEach(el => el.classList.add('reveal'));
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('nav-links-open');
  });
}
