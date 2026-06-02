/* ============================================================
   LOOM MC — Main JavaScript
   Premium interactions & animations
   ============================================================ */

(function () {
  'use strict';

  // ---- DOM Ready ----
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initScrollReveal();
    initNavScroll();
    initMobileNav();
    initFeatureCardGlow();
    initSmoothScroll();
    initOSDetection();
  }


  /* ==========================================================
     1. Scroll Reveal — IntersectionObserver
     ========================================================== */
  function initScrollReveal() {
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
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    reveals.forEach((el) => observer.observe(el));
  }


  /* ==========================================================
     2. Nav Scroll Detection
     ========================================================== */
  function initNavScroll() {
    const nav = document.querySelector('.nav');
    if (!nav) return;

    let ticking = false;

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
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
    // Run once on load in case page is already scrolled
    onScroll();
  }


  /* ==========================================================
     3. Mobile Nav Toggle
     ========================================================== */
  function initMobileNav() {
    const toggle = document.querySelector('.nav-toggle');
    const links = document.querySelector('.nav-links');
    const overlay = document.querySelector('.nav-overlay');

    if (!toggle || !links) return;

    function openNav() {
      toggle.classList.add('active');
      links.classList.add('open');
      if (overlay) overlay.classList.add('visible');
      document.body.style.overflow = 'hidden';
    }

    function closeNav() {
      toggle.classList.remove('active');
      links.classList.remove('open');
      if (overlay) overlay.classList.remove('visible');
      document.body.style.overflow = '';
    }

    toggle.addEventListener('click', () => {
      if (links.classList.contains('open')) {
        closeNav();
      } else {
        openNav();
      }
    });

    // Close when clicking overlay
    if (overlay) {
      overlay.addEventListener('click', closeNav);
    }

    // Close when clicking a nav link (mobile)
    links.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeNav);
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && links.classList.contains('open')) {
        closeNav();
      }
    });
  }


  /* ==========================================================
     4. Feature Card Mouse-Tracking Radial Glow
     ========================================================== */
  function initFeatureCardGlow() {
    const cards = document.querySelectorAll('.feature-card');
    if (!cards.length) return;

    cards.forEach((card) => {
      // Create the glow element if not present
      let glow = card.querySelector('.feature-card-glow');
      if (!glow) {
        glow = document.createElement('div');
        glow.classList.add('feature-card-glow');
        card.prepend(glow);
      }

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        glow.style.background = `radial-gradient(
          circle 220px at ${x}px ${y}px,
          rgba(217, 119, 6, 0.08),
          transparent 70%
        )`;
      });

      card.addEventListener('mouseleave', () => {
        glow.style.background = '';
      });
    });
  }


  /* ==========================================================
     5. Smooth Scroll for Anchor Links
     ========================================================== */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();

        const navHeight = document.querySelector('.nav')?.offsetHeight || 72;
        const targetPosition =
          target.getBoundingClientRect().top + window.scrollY - navHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });
      });
    });
  }


  /* ==========================================================
     6. OS Detection for Download Page
     ========================================================== */
  function initOSDetection() {
    const osLabel = document.querySelector('.download-os-name');
    const osIcon = document.querySelector('.download-os-icon');
    const downloadBtn = document.querySelector('.download-btn');

    if (!osLabel) return;

    const ua = navigator.userAgent || '';
    const platform = navigator.platform || '';
    let os = 'your OS';
    let icon = 'monitor'; // fallback

    if (/Win/i.test(platform) || /Windows/i.test(ua)) {
      os = 'Windows';
      icon = 'windows';
    } else if (/Mac/i.test(platform) || /Macintosh/i.test(ua)) {
      os = 'macOS';
      icon = 'apple';
    } else if (/Linux/i.test(platform) || /Linux/i.test(ua)) {
      os = 'Linux';
      icon = 'linux';
    }

    osLabel.textContent = os;

    // Update icon SVG if we have a specific OS
    if (osIcon) {
      const iconSVGs = {
        windows: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="8" height="8"/><rect x="13" y="3" width="8" height="8"/><rect x="3" y="13" width="8" height="8"/><rect x="13" y="13" width="8" height="8"/></svg>`,
        apple: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 5-4 5-8s-2.5-4-2.5-4c-.5-.5-1.5-1-3-1-1.5 0-2.5.5-3.5 1-1-.5-2-1-3.5-1-1.5 0-2.5.5-3 1C5.5 10 3 10 3 14s2 8 5 8c1.25 0 2.5-1.06 4-1.06z"/><path d="M12 7c1-2 3-3 5-3"/></svg>`,
        linux: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.5 9a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1z" fill="currentColor"/><path d="M14.5 9a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1z" fill="currentColor"/><path d="M8 13s1.5 3 4 3 4-3 4-3"/></svg>`,
        monitor: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
      };

      osIcon.innerHTML = iconSVGs[icon] || iconSVGs.monitor;
    }

    // Update download button text
    if (downloadBtn) {
      const btnTextEl = downloadBtn.querySelector('.btn-label');
      if (btnTextEl) {
        btnTextEl.textContent = `Download for ${os}`;
      }
    }
  }
})();
