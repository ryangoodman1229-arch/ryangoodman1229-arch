/* ============================================================
   ryangoodmandesign.com — Main Script
   ============================================================ */

(function () {
  'use strict';

  /* ── Custom Cursor ── */
  const cursor    = document.querySelector('.cursor');
  const cursorDot = document.querySelector('.cursor-dot');

  if (cursor && cursorDot) {
    let mouseX = 0, mouseY = 0;
    let dotX   = 0, dotY   = 0;
    let rafId;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      // Crosshair snaps immediately
      cursor.style.left = mouseX + 'px';
      cursor.style.top  = mouseY + 'px';
    });

    // Dot follows with slight lag
    function animateDot() {
      dotX += (mouseX - dotX) * 0.18;
      dotY += (mouseY - dotY) * 0.18;
      cursorDot.style.left = dotX + 'px';
      cursorDot.style.top  = dotY + 'px';
      rafId = requestAnimationFrame(animateDot);
    }
    animateDot();

    // Hovering state on interactive elements
    const hoverTargets = 'a, button, [role="button"], input, textarea, .project-card';
    document.querySelectorAll(hoverTargets).forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
    });

    // Hide on leave, show on enter
    document.addEventListener('mouseleave', () => {
      cursor.style.opacity    = '0';
      cursorDot.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      cursor.style.opacity    = '1';
      cursorDot.style.opacity = '1';
    });
  }

  /* ── Nav scroll state ── */
  const nav = document.querySelector('nav');
  if (nav) {
    const threshold = 60;
    function updateNav() {
      if (window.scrollY > threshold) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }
    window.addEventListener('scroll', updateNav, { passive: true });
    updateNav();
  }

  /* ── Scroll reveal ── */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach(el => observer.observe(el));
  }

  /* ── Project card index labels ── */
  // Auto-number any .card-num elements that are empty
  document.querySelectorAll('.card-num').forEach((el, i) => {
    if (!el.textContent.trim()) {
      el.textContent = String(i + 1).padStart(2, '0');
    }
  });

})();
