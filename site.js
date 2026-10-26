/* ============================================================
   INCREDIBLE INDIA — site.js
   Shared: mobile menu, IntersectionObserver reveals,
   image onerror fallback.
   ============================================================ */

(function () {
  'use strict';

  /* ── 1. REDUCED MOTION PREFERENCE ─────────────────────────── */
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── 2. IMAGE ONERROR FALLBACK ─────────────────────────────── */
  // Capture-phase listener so it fires before bubbling
  document.addEventListener('error', function (e) {
    var el = e.target;
    if (el.tagName === 'IMG' && el.src !== '' &&
        el.getAttribute('data-err-handled') !== 'true') {
      el.setAttribute('data-err-handled', 'true');
      el.src = 'images/placeholder.svg';
    }
  }, true);

  /* ── 3. MOBILE MENU ────────────────────────────────────────── */
  var toggle = document.querySelector('.nav-toggle');
  var nav    = document.getElementById('primary-nav');

  function menuOpen() {
    nav.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
  }

  function menuClose() {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
  }

  function menuToggle() {
    if (nav.classList.contains('is-open')) {
      menuClose();
    } else {
      menuOpen();
    }
  }

  if (toggle && nav) {
    toggle.addEventListener('click', menuToggle);

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        menuClose();
        toggle.focus();
      }
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (nav.classList.contains('is-open') &&
          !nav.contains(e.target) &&
          !toggle.contains(e.target)) {
        menuClose();
      }
    });

    // Close when a nav link is clicked (mobile navigation)
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        if (window.innerWidth <= 768) {
          menuClose();
        }
      });
    });
  }

  /* ── 4. INTERSECTION OBSERVER REVEALS ─────────────────────── */
  if (prefersReduced) {
    // Show everything immediately if reduced motion is preferred
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('is-visible');
    });
    return;
  }

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          // Stagger siblings inside the same parent
          var siblings = Array.from(el.parentElement.querySelectorAll('.reveal'));
          var idx = siblings.indexOf(el);
          if (idx > 0) {
            el.style.transitionDelay = (idx * 0.08) + 's';
          }
          el.classList.add('is-visible');
          observer.unobserve(el);
        }
      });
    }, {
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.12
    });

    document.querySelectorAll('.reveal').forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: show all reveals for browsers without IO
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

})();
