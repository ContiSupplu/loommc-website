/* ============================================
   Loom Launcher — Interactions
   v1.6.1 "Netherite"
   ============================================ */

// --- Scroll Reveal with IntersectionObserver ---
function initReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  reveals.forEach((el) => observer.observe(el));
}


// --- Nav Scroll Effect ---
function initNavScroll() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        if (window.scrollY > 20) {
          nav.classList.add('scrolled');
        } else {
          nav.classList.remove('scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}


// --- Mobile Nav Toggle ---
function initMobileNav() {
  const toggle = document.querySelector('.nav__toggle');
  const links = document.querySelector('.nav__links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    links.classList.toggle('open');
  });

  // Close nav when a link is clicked
  links.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      links.classList.remove('open');
    });
  });
}


// --- Feature Card Mouse-Tracking Glow ---
function initFeatureGlow() {
  const cards = document.querySelectorAll('.feature-card');
  if (!cards.length) return;

  cards.forEach((card) => {
    const glow = card.querySelector('.feature-card__glow');
    if (!glow) return;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      glow.style.background = `radial-gradient(
        400px circle at ${x}px ${y}px,
        rgba(217, 119, 6, 0.08),
        transparent 60%
      )`;
    });

    card.addEventListener('mouseleave', () => {
      glow.style.background = '';
    });
  });
}


// --- Smooth Scroll for Anchor Links ---
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });
  });
}


// --- Initialize Everything ---
document.addEventListener('DOMContentLoaded', () => {
  initReveal();
  initNavScroll();
  initMobileNav();
  initFeatureGlow();
  initSmoothScroll();
});
