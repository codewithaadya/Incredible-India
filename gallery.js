/* ============================================================
   INCREDIBLE INDIA — gallery.js
   Category filters + accessible lightbox.
   Progressive enhancement: without JS the images are plain
   anchor links that open the full SVG in the browser.
   ============================================================ */

(function () {
  'use strict';

  /* ── FILTERS ─────────────────────────────────────────────── */
  var filterBtns  = document.querySelectorAll('.filter-btn');
  var galleryCards = Array.from(document.querySelectorAll('.gallery-card'));
  var emptyMsg    = document.getElementById('gallery-empty');

  function applyFilter(filter) {
    var visibleCount = 0;

    galleryCards.forEach(function (card) {
      var categories = (card.dataset.category || '').split(' ');
      var show = filter === 'all' || categories.indexOf(filter) !== -1;

      if (show) {
        card.removeAttribute('hidden');
        visibleCount++;
      } else {
        card.setAttribute('hidden', '');
      }
    });

    if (emptyMsg) {
      if (visibleCount === 0) {
        emptyMsg.removeAttribute('hidden');
      } else {
        emptyMsg.setAttribute('hidden', '');
      }
    }
  }

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      // Update button states
      filterBtns.forEach(function (b) {
        b.classList.remove('filter-btn--active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('filter-btn--active');
      btn.setAttribute('aria-pressed', 'true');

      applyFilter(btn.dataset.filter || 'all');
    });
  });

  /* ── LIGHTBOX ─────────────────────────────────────────────── */
  var lightbox      = document.getElementById('lightbox');
  var lbImg         = document.getElementById('lightbox-img');
  var lbCaption     = document.getElementById('lightbox-caption');
  var lbClose       = lightbox && lightbox.querySelector('.lightbox__close');
  var lbBackdrop    = lightbox && lightbox.querySelector('.lightbox__backdrop');
  var lbPrev        = lightbox && lightbox.querySelector('.lightbox__arrow--prev');
  var lbNext        = lightbox && lightbox.querySelector('.lightbox__arrow--next');

  // Items currently in lightbox (visible, filtered cards)
  var lbItems       = [];
  var lbIndex       = 0;
  var lbTrigger     = null; // element that opened the lightbox (for focus restore)

  if (!lightbox) return;

  function getVisibleCards() {
    return galleryCards.filter(function (c) { return !c.hasAttribute('hidden'); });
  }

  function openLightbox(cards, index, trigger) {
    lbItems   = cards;
    lbIndex   = index;
    lbTrigger = trigger;
    loadImage(lbIndex);

    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');

    // Focus the close button
    if (lbClose) {
      setTimeout(function () { lbClose.focus(); }, 50);
    }

    // Prevent body scroll
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    // Restore focus to the triggering element
    if (lbTrigger) {
      lbTrigger.focus();
    }
  }

  function loadImage(idx) {
    var card    = lbItems[idx];
    var fullSrc = card.dataset.full || card.querySelector('img').src;
    var alt     = card.querySelector('img').alt || '';
    var caption = card.dataset.caption || '';

    lbImg.src = fullSrc;
    lbImg.alt = alt;
    lbCaption.textContent = caption;

    // Update counter / arrow visibility
    updateArrows();
  }

  function updateArrows() {
    if (lbItems.length <= 1) {
      if (lbPrev) lbPrev.setAttribute('hidden', '');
      if (lbNext) lbNext.setAttribute('hidden', '');
    } else {
      if (lbPrev) lbPrev.removeAttribute('hidden');
      if (lbNext) lbNext.removeAttribute('hidden');
    }
  }

  function showPrev() {
    lbIndex = (lbIndex - 1 + lbItems.length) % lbItems.length;
    loadImage(lbIndex);
  }

  function showNext() {
    lbIndex = (lbIndex + 1) % lbItems.length;
    loadImage(lbIndex);
  }

  // Intercept link clicks on gallery cards to open lightbox
  galleryCards.forEach(function (card) {
    var link = card.querySelector('.gallery-card__link');
    if (!link) return;

    link.addEventListener('click', function (e) {
      e.preventDefault();
      var visible = getVisibleCards();
      var idx     = visible.indexOf(card);
      if (idx === -1) return; // card is filtered out
      openLightbox(visible, idx, link);
    });
  });

  // Close on close button
  if (lbClose) {
    lbClose.addEventListener('click', closeLightbox);
  }

  // Close on backdrop click
  if (lbBackdrop) {
    lbBackdrop.addEventListener('click', closeLightbox);
  }

  // Prev / Next buttons
  if (lbPrev) {
    lbPrev.addEventListener('click', showPrev);
  }
  if (lbNext) {
    lbNext.addEventListener('click', showNext);
  }

  // Keyboard: Escape, ArrowLeft, ArrowRight
  document.addEventListener('keydown', function (e) {
    if (lightbox.hasAttribute('hidden')) return;

    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      showPrev();
    } else if (e.key === 'ArrowRight') {
      showNext();
    }
  });

  // ── FOCUS TRAP ────────────────────────────────────────────
  // Keep Tab/Shift+Tab cycling inside the lightbox
  var FOCUSABLE = 'button:not([disabled]):not([hidden]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

  lightbox.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;
    if (lightbox.hasAttribute('hidden')) return;

    var focusable = Array.from(lightbox.querySelectorAll(FOCUSABLE))
                         .filter(function (el) {
                           return !el.hasAttribute('hidden') &&
                                  getComputedStyle(el).visibility !== 'hidden';
                         });

    if (focusable.length === 0) return;

    var first = focusable[0];
    var last  = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

})();
