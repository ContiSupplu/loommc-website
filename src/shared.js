// ── Loom Shared JS ──
// Panel toggle, scroll reveal, announcement cycling, particles

// Panel toggle
const menuBtn = document.getElementById('menuBtn');
const panel = document.getElementById('panel');
const panelOverlay = document.getElementById('panelOverlay');
const panelClose = document.getElementById('panelClose');
function openPanel() { panel?.classList.add('open'); panelOverlay?.classList.add('open'); }
function closePanel() { panel?.classList.remove('open'); panelOverlay?.classList.remove('open'); }
if (menuBtn) menuBtn.addEventListener('click', openPanel);
if (panelClose) panelClose.addEventListener('click', closePanel);
if (panelOverlay) panelOverlay.addEventListener('click', closePanel);
document.querySelectorAll('.panel-links a').forEach(a => a.addEventListener('click', closePanel));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closePanel(); });

// Scroll reveal
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Announcement Bar Cycling
(function() {
  const slides = document.querySelectorAll('.announce-slide');
  if (slides.length < 2) return;
  let current = 0;
  setInterval(() => {
    slides[current].classList.remove('active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('active');
  }, 4500);
})();

// Floating Particles (purple + yellow mix)
(function() {
  const container = document.getElementById('particles');
  if (!container || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const COUNT = 25;
  for (let i = 0; i < COUNT; i++) {
    const p = document.createElement('div');
    // 70% purple, 30% yellow
    p.className = 'particle ' + (Math.random() < 0.7 ? 'particle--purple' : 'particle--yellow');
    p.style.left = Math.random() * 100 + '%';
    p.style.bottom = '-4px';
    p.style.animationDuration = (12 + Math.random() * 18) + 's';
    p.style.animationDelay = (Math.random() * 20) + 's';
    p.style.width = p.style.height = (1.5 + Math.random() * 2) + 'px';
    p.style.opacity = 0;
    container.appendChild(p);
  }
})();
