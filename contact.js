/* ============================================================
   INCREDIBLE INDIA — contact.js
   Contact form inline validation and honest no-backend handling.
   Rules:
   - Validate on submit and on blur.
   - Set aria-invalid on each field.
   - Show inline error messages next to each field.
   - If no real endpoint is configured, NEVER fake success.
   - Only show a success message when a real HTTP 200 comes back.
   ============================================================ */

(function () {
  'use strict';

  var form       = document.getElementById('contact-form');
  var submitBtn  = document.getElementById('form-submit');
  var statusEl   = document.getElementById('form-status');

  if (!form) return;

  /* ── VALIDATION RULES ─────────────────────────────────────── */
  var rules = {
    name: function (v) {
      if (!v.trim()) return 'Please enter your full name.';
      if (v.trim().length < 2) return 'Name must be at least 2 characters.';
      return '';
    },
    email: function (v) {
      if (!v.trim()) return 'Please enter your email address.';
      // RFC-compatible simple pattern
      var re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      if (!re.test(v.trim())) return 'Please enter a valid email address (e.g. you@example.com).';
      return '';
    },
    subject: function (v) {
      if (!v.trim()) return 'Please enter a subject.';
      if (v.trim().length < 3) return 'Subject must be at least 3 characters.';
      return '';
    },
    message: function (v) {
      if (!v.trim()) return 'Please enter your message.';
      if (v.trim().length < 10) return 'Message must be at least 10 characters.';
      return '';
    }
  };

  var fieldIds = ['name', 'email', 'subject', 'message'];

  /* ── SHOW / CLEAR FIELD ERROR ─────────────────────────────── */
  function showFieldError(id, msg) {
    var input = document.getElementById(id);
    var errEl = document.getElementById(id + '-error');
    if (!input || !errEl) return;

    if (msg) {
      input.setAttribute('aria-invalid', 'true');
      errEl.textContent = msg;
    } else {
      input.setAttribute('aria-invalid', 'false');
      errEl.textContent = '';
    }
  }

  function validateField(id) {
    var input = document.getElementById(id);
    if (!input) return true;
    var rule = rules[id];
    if (!rule) return true;
    var msg = rule(input.value);
    showFieldError(id, msg);
    return msg === '';
  }

  function validateAll() {
    var allValid = true;
    fieldIds.forEach(function (id) {
      if (!validateField(id)) allValid = false;
    });
    return allValid;
  }

  /* ── BLUR VALIDATION ──────────────────────────────────────── */
  fieldIds.forEach(function (id) {
    var input = document.getElementById(id);
    if (!input) return;
    input.addEventListener('blur', function () {
      validateField(id);
    });
    // Clear error on input after first error shown
    input.addEventListener('input', function () {
      if (input.getAttribute('aria-invalid') === 'true') {
        validateField(id);
      }
    });
  });

  /* ── SHOW STATUS MESSAGE ─────────────────────────────────── */
  function showStatus(html, type) {
    // type: 'is-error' | 'is-notice'
    statusEl.innerHTML = html;
    statusEl.className = 'form-status ' + type;
    statusEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function clearStatus() {
    statusEl.innerHTML = '';
    statusEl.className = 'form-status';
  }

  /* ── SUBMIT HANDLER ───────────────────────────────────────── */
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearStatus();

    var isValid = validateAll();
    if (!isValid) {
      // Focus the first invalid field
      for (var i = 0; i < fieldIds.length; i++) {
        var input = document.getElementById(fieldIds[i]);
        if (input && input.getAttribute('aria-invalid') === 'true') {
          input.focus();
          break;
        }
      }
      return;
    }

    // Check whether a real endpoint has been configured
    var endpoint = (form.dataset.endpoint || '').trim();
    var isPlaceholder = !endpoint ||
                        endpoint === 'https://formspree.io/f/your-id' ||
                        endpoint.indexOf('your-id') !== -1;

    if (isPlaceholder) {
      // No real endpoint — be honest, do NOT fake success
      showStatus(
        '<strong>Heads up:</strong> This form isn\'t connected to a submission service yet, so your message won\'t be received. To enable submissions, follow the instructions in the README to add a Formspree (or similar) endpoint.',
        'is-notice'
      );
      return;
    }

    // Real endpoint: attempt fetch submission
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    var data = new FormData(form);

    fetch(endpoint, {
      method: 'POST',
      body: data,
      headers: { 'Accept': 'application/json' }
    })
    .then(function (res) {
      if (res.ok) {
        // Genuine success — reset form and show confirmation
        form.reset();
        fieldIds.forEach(function (id) {
          var inp = document.getElementById(id);
          if (inp) inp.removeAttribute('aria-invalid');
        });
        showStatus(
          '<strong>Message sent!</strong> Thank you for reaching out — we\'ll be in touch soon.',
          'is-notice'
        );
      } else {
        // Server returned an error status
        return res.json().catch(function () { return {}; }).then(function (body) {
          var msg = (body && body.error) ? body.error : 'Something went wrong on our end. Please try again.';
          showStatus('<strong>Error:</strong> ' + msg, 'is-error');
        });
      }
    })
    .catch(function () {
      showStatus(
        '<strong>Network error:</strong> Your message couldn\'t be sent. Please check your connection and try again.',
        'is-error'
      );
    })
    .finally(function () {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
    });
  });

})();
