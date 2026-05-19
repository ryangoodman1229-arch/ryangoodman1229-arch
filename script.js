/* ============================================================
   ryangoodmandesign.com — Main Script
   ============================================================ */

(function () {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isDesktop     = window.matchMedia('(min-width: 720px)').matches;

  /* ── Custom Cursor (desktop only) ── */
  if (isDesktop) {
    const cursor    = document.querySelector('.cursor');
    const cursorDot = document.querySelector('.cursor-dot');

    if (cursor && cursorDot) {
      let mx = -100, my = -100, dx = -100, dy = -100;

      document.addEventListener('mousemove', (e) => {
        mx = e.clientX;
        my = e.clientY;
        cursor.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
      });

      if (!reducedMotion) {
        const tick = () => {
          dx += (mx - dx) * 0.18;
          dy += (my - dy) * 0.18;
          const scale = document.body.classList.contains('hovering') ? 0 : 1;
          cursorDot.style.transform = `translate(${dx}px, ${dy}px) translate(-50%, -50%) scale(${scale})`;
          requestAnimationFrame(tick);
        };
        tick();
      }

      document.addEventListener('mouseover', (e) => {
        if (e.target.closest('a, button, input, textarea, .project-card, .iter-cell, .buildlog-row, [data-cursor]')) {
          document.body.classList.add('hovering');
        } else {
          document.body.classList.remove('hovering');
        }
      });

      document.addEventListener('mouseleave', () => {
        cursor.style.opacity    = '0';
        cursorDot.style.opacity = '0';
      });
      document.addEventListener('mouseenter', () => {
        cursor.style.opacity    = '1';
        cursorDot.style.opacity = '1';
      });
    }
  }

  /* ── Nav: scroll state ── */
  const nav = document.querySelector('nav.top-nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* Force solid nav on non-hero pages */
    if (!document.querySelector('.hero') && !document.querySelector('.case-hero')) {
      nav.classList.add('solid');
    }
  }

  /* ── Nav: mobile toggle ── */
  const toggle = document.querySelector('.nav-toggle');
  const panel  = document.querySelector('.nav-mobile-panel');
  if (toggle && panel) {
    let open = false;
    toggle.addEventListener('click', () => {
      open = !open;
      panel.classList.toggle('open', open);
      const bars = toggle.querySelectorAll('span');
      if (bars.length === 2) {
        bars[0].style.transform = open ? 'translateY(3px) rotate(45deg)'  : '';
        bars[1].style.transform = open ? 'translateY(-3px) rotate(-45deg)' : '';
      }
    });
    /* Close on link click */
    panel.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        open = false;
        panel.classList.remove('open');
        const bars = toggle.querySelectorAll('span');
        if (bars.length === 2) { bars[0].style.transform = ''; bars[1].style.transform = ''; }
      });
    });
  }

  /* ── Scroll reveal ── */
  if (!reducedMotion) {
    const revealEls = document.querySelectorAll('.reveal');
    if (revealEls.length) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            io.unobserve(e.target);
          }
        });
      }, { threshold: 0.08, rootMargin: '-40px' });
      revealEls.forEach(el => io.observe(el));
    }
  } else {
    /* Instantly show all reveal elements when motion is reduced */
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
  }

  /* ── Contact form submit ── */
  const form = document.querySelector('.contact-form');
  if (form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!submitBtn) return;
      submitBtn.textContent = '✓ Sent — Thanks';
      submitBtn.disabled = true;

      /* Fire to Formspree if action is set */
      const action = form.getAttribute('action');
      if (action && !action.includes('YOUR_FORM_ID')) {
        const data = new FormData(form);
        fetch(action, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
      }
    });
  }

  /* ── Chapter rail (KNOT case study) ── */
  const rail = document.querySelector('.chapter-rail');
  if (rail) {
    const chapters  = ['discover', 'define', 'develop', 'deliver'];
    const sections  = chapters.map(id => document.getElementById('ch-' + id)).filter(Boolean);
    const railItems = rail.querySelectorAll('li[data-ch]');

    const setActive = (id) => {
      railItems.forEach(li => li.classList.toggle('active', li.dataset.ch === id));
    };

    if (sections.length && !reducedMotion) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) setActive(e.target.id.replace('ch-', ''));
        });
      }, { rootMargin: '-30% 0px -55% 0px', threshold: 0 });
      sections.forEach(s => io.observe(s));
    }

    railItems.forEach(li => {
      li.addEventListener('click', () => {
        const el = document.getElementById('ch-' + li.dataset.ch);
        if (el) el.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
      });
    });
  }

})();
