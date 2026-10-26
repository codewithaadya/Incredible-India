# Implementation Plan — Incredible India Redesign

Redesign the static "Incredible India — Travel Guide" site IN PLACE. Plain HTML/CSS/vanilla JS only — NO npm, NO build step, NO bundler, NO frameworks, NO preprocessors. Keep existing file names (`index.html`, `destination.html`, `traveltip.html`, `gallery.html`, `contact.html`) and each page's own CSS file. Improve in place; do not create a parallel site. Do not touch `LICENSE`.

This plan is the authoritative spec. The executable decomposition lives in the FEAT artifact files under `.agents/tasks/task-incredible-india-redesign/`. Execution order: `feature_order` in `task.json`.

---

## Design system (verbatim — use everywhere)

CSS custom properties on `:root` in `styles.css`, used on every page:

```
Palette:
  --color-ivory:     #FAF7F0   /* page background */
  --color-forest:    #183D32   /* primary buttons, key sections, header/footer bg */
  --color-saffron:   #E89B3C   /* highlights — accents on dark/forest only, NEVER body text on ivory */
  --color-terracotta:#B9674D   /* accents */
  --color-charcoal:  #252A27   /* body text (always on ivory/white/sage for AA) */
  --color-sage:      #E5EBDD   /* soft section backgrounds */
  --color-white:     #ffffff

Fonts:
  --font-heading: 'Playfair Display', Georgia, 'Times New Roman', serif;   /* all headings */
  --font-body:    'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif;  /* body */

Spacing scale:  --space-1..8 (0.25rem, 0.5rem, 0.75rem, 1rem, 1.5rem, 2rem, 2.5rem, 3rem)
Radii:         --radius-sm 6px / --radius-md 12px / --radius-lg 20px
Transitions:   --transition-fast 150ms ease / --transition-med 250ms ease
Layout:        --max-width 1200px / --max-width-narrow 760px
```

Fonts load via Google Fonts `<link>` with `preconnect` in every page `<head>` (before the page CSS). styles.css only references the families via the variables — it does NOT `@import` fonts.

Contrast rules (AA): body text is always `--color-charcoal` on ivory/white/sage. White text on `--color-forest` passes. `--color-saffron` is for highlights/icons/borders on dark/forest backgrounds only (saffron on ivory fails AA for text). `--color-terracotta` for large headings or accents, not body text.

Style: generous whitespace, editorial, calm. Avoid heavy shadows, neon gradients, clutter. Subtle borders, warm tints. Remove the existing parallax (`background-attachment: fixed`).

## Hard constraints (non-negotiable)

- Plain HTML/CSS/vanilla JS. No npm/build/bundler/frameworks/preprocessors. No `@import` of remote CSS. Remove the Font Awesome CDN `<link>` from every page (replace icons with inline SVG or remove).
- All assets LOCAL. No hotlinking (no `raw.githubusercontent.com`, no Reddit, no Unsplash, no `images.openai.com`, no third-party CDNs). The only external requests allowed are the Google Fonts `<link>` (fonts only).
- No invented facts: do not invent opening hours, prices, phone numbers, or restrictions. Remove the fake phone number `+91 11 4000 6000`. Replace fake testimonials with clearly-labelled journey ideas.
- No horizontal scroll from 360px to 1920px: global `box-sizing: border-box`, `max-width` containers, responsive images (`max-width:100%; height:auto`), wrap flex/grid.
- WCAG AA contrast; visible focus styles (never `outline:none` without a replacement); semantic HTML landmarks.
- Progressive enhancement: works without JavaScript. Reveal/animated content visible by default; hidden ONLY under a `.js` class added by a tiny inline `<head>` script before paint. No-JS users see all content and use nav/links.
- Do not touch `LICENSE`.

## Shared markup (keep IDENTICAL across all 5 pages — no copy-paste drift)

`<head>` on every page (in this order):
```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{unique per page}</title>
<meta name="description" content="{unique per page}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@500;600;700&display=swap" rel="stylesheet">
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="styles.css">
<link rel="stylesheet" href="{page}.css">
<script>document.documentElement.classList.add('js');</script>
```
(The inline `.js` script MUST run before paint so reveal content is hidden only when JS is on.)

First focusable element on every page (skip link):
```html
<a class="skip-link" href="#main">Skip to content</a>
```
`<main id="main">` wraps page content.

Header (identical on all pages; only `aria-current="page"` differs — set it on the current page's link):
```html
<header class="site-header">
  <div class="site-header__inner container">
    <a class="site-logo" href="index.html" aria-label="Incredible India — home">
      <img src="assets/logo-dark.svg" alt="Incredible India" width="180" height="44">
    </a>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="primary-nav" aria-label="Open menu">
      <span class="nav-toggle__bar"></span><span class="nav-toggle__bar"></span><span class="nav-toggle__bar"></span>
    </button>
    <nav id="primary-nav" class="primary-nav" aria-label="Primary navigation">
      <ul class="primary-nav__list">
        <li><a href="index.html">Home</a></li>
        <li><a href="destination.html">Destinations</a></li>
        <li><a href="traveltip.html">Travel Tips</a></li>
        <li><a href="gallery.html">Gallery</a></li>
        <li><a href="contact.html">Contact</a></li>
      </ul>
    </nav>
  </div>
</header>
```
Header background is `--color-forest` (dark), so it uses `logo-dark.svg` (light text). The hamburger button is hidden on desktop and shown on small screens; under `.js` the nav list collapses on small screens (`.js .primary-nav` hidden until `.is-open`); WITHOUT `.js` the list is always visible and usable.

Footer (identical on all pages; NO phone number; logo + blurb + quick links + copyright):
```html
<footer class="site-footer">
  <div class="site-footer__inner container">
    <div class="site-footer__brand">
      <img src="assets/logo-dark.svg" alt="Incredible India" width="180" height="44">
      <p>Discover the soul of India — culture, nature and adventure, one story at a time.</p>
    </div>
    <nav class="site-footer__links" aria-label="Footer">
      <h2 class="site-footer__heading">Explore</h2>
      <ul>
        <li><a href="index.html">Home</a></li>
        <li><a href="destination.html">Destinations</a></li>
        <li><a href="traveltip.html">Travel Tips</a></li>
        <li><a href="gallery.html">Gallery</a></li>
        <li><a href="contact.html">Contact</a></li>
      </ul>
    </nav>
  </div>
  <div class="site-footer__bottom">
    <p>© 2025 Incredible India Travel Guide. All rights reserved.</p>
  </div>
</footer>
```
Every page links `site.js` (deferred) before `</body>`: `<script src="site.js" defer></script>`. Gallery adds `gallery.js`; contact adds `contact.js`.

## Destination ids (FIXED — homepage cards and destination.html anchors must match exactly)

`rajasthan`, `kerala`, `himachal-pradesh`, `uttarakhand`, `goa`, `varanasi`.

Homepage cards link to `destination.html#rajasthan`, `#kerala`, `#himachal-pradesh`, `#uttarakhand`, `#goa`, `#varanasi`. destination.html renders each with `id="rajasthan"` etc. More-to-explore row: Leh-Ladakh, Andaman & Nicobar, Mysore (no deep links required).

## Logo (self-contained SVG, no external requests, no emoji)

Create in `assets/`:
- `logo.svg` — light-background version: dark text/mark on transparent/ivory. Mark = minimal India silhouette + small saffron sun + heritage arch/torana motif. Wordmark "INCREDIBLE INDIA" + tagline "Discover the Extraordinary".
- `logo-dark.svg` — dark-background version (forest bg): identical geometry, light text/mark colors only. Used in header + footer.
- `logo-mark.svg` — mark only (no text).
- `favicon.svg` — small square mark only.

Text approach: use SVG `<text>` with a robust local font-family stack (`'Playfair Display', Georgia, 'Times New Roman', serif` for the wordmark; `'Inter', system-ui, sans-serif` for the tagline). The SVG makes NO external requests (the page's Google Fonts link provides the families; if unavailable the SVG falls back gracefully). This is the documented tradeoff explicitly permitted by the brief — hand-converting "INCREDIBLE INDIA" to vector outlines is impractical to author reliably; record this tradeoff in `FEAT-001` findings and the README.

`favicon.png`: no rasterizer is installed (no ImageMagick/rsvg/inkscape; installing sharp would add an npm dependency the site must not have). Ship `favicon.svg` only and note in the README that a PNG could not be generated in this environment. Do NOT block the task on it.

## Image placeholder approach (all local, no hotlinking)

Every photo is a tasteful LOCAL SVG in `images/`: an on-brand gradient (forest→saffron or sage→ivory) + a subtle pattern (dots/lines/arches) + the destination/scene name as `<text>`. The hero is a richer gradient composition. This guarantees no broken images and no licensing issues.

Generic fallback: `images/placeholder.svg` (on-brand gradient + subtle pattern + "Incredible India" text). Add `onerror` handling in `site.js` (capture-phase error listener swaps any broken `<img>` to `images/placeholder.svg`, guarded against loops) so a dead image never shows the broken-image icon.

Every `<img>` gets explicit `width` + `height` attributes (prevent layout shift), `loading="lazy"` (except the hero, which is `loading="eager"`), and meaningful `alt` text. Decorative images use `alt=""`.

## JavaScript (vanilla, organised)

- Inline `<head>` script (above): `document.documentElement.classList.add('js');` before paint.
- `site.js` (deferred, all pages): mobile menu (toggle `.is-open` on `#primary-nav`, sync `aria-expanded` on `.nav-toggle`; close on Escape, outside click, and link click); Intersection Observer fade-up reveals with staggered cards (add `.is-visible`; stagger via `transition-delay`); image-zoom hover (CSS-driven); image `onerror` → `images/placeholder.svg`; respect `prefers-reduced-motion` (if reduced, show all reveals immediately, skip transforms). No parallax, no loops; reveals are one-shot.
- `gallery.js` (gallery only): category filter buttons (filter `.gallery-card` by `data-category`); accessible lightbox (`role="dialog" aria-modal="true" aria-label`, close button, Escape, left/right arrows, backdrop click, focus trap, focus restored to trigger). Without JS each image is wrapped in an anchor linking to the full photo so it still opens full-size; JS `preventDefault`s and opens the lightbox.
- `contact.js` (contact only): inline validation (name required min 2; email required + valid pattern; subject required min 3; message required min 10) on submit and on blur; messages near fields via `aria-describedby`; `aria-invalid` toggled. The form has NO backend — put `data-endpoint="https://formspree.io/f/your-id"` on `<form>`. Show an honest "not connected yet" notice near the form. Do NOT show a success message unless a real submission actually succeeds (default: no real endpoint → keep the notice, never fake success).

## Per-page requirements

1. **index.html + index.css** — full-width hero with dark overlay; H1 "India: A Journey Through a Thousand Stories", supporting line, two buttons "Explore Destinations" (→ `destination.html`) and "Plan Your Journey" (→ `contact.html`) — relative paths, NOT `127.0.0.1:5500`. Short intro paragraph. Six destination cards (Rajasthan, Kerala, Himachal Pradesh, Uttarakhand, Goa, Varanasi) each linking to its anchor on `destination.html` with accurate one-line teasers. A "Journeys" section REPLACING the fake testimonials — clearly labelled journey ideas (Golden Triangle, Backwaters & Spice Coasts, Himalayan Trails, Spiritual Rivers) presented as inspirations, NOT real quotes. Closing CTA. Remove the fake phone number and testimonials.

2. **destination.html + destination.css** — jump-link row at top (in-page anchors). Six destinations with editorial alternating image/text layouts, each with `id` (rajasthan…varanasi), each with best time to visit, top attractions, local food (accurate, no invented hours/prices). "More to explore" row: Leh-Ladakh, Andaman & Nicobar, Mysore (smaller teaser cards).

3. **traveltip.html + traveltip.css** — sections: best time to visit (with a semantic `<table>` of months/regions), transport, etiquette, packing, food, safety, responsible tourism. Sticky table of contents on desktop (an `<aside>` of in-page anchors; collapses gracefully on mobile).

4. **gallery.html + gallery.css + gallery.js** — FIX the missing `</head>`. Responsive editorial grid. Category filters (region/theme). Accessible lightbox (close button, Escape, arrow navigation, focus trap, focus restored). Progressive enhancement: without JS each image is an anchor to the full photo.

5. **contact.html + contact.css + contact.js** — labelled fields (name, email, subject, message) each with a real `<label for>`. Inline validation. `data-endpoint` on the form. Honest "not connected yet" notice. No fake success. Fix the malformed footer (stray `</div>`).

## Accessibility & quality

- Skip link first focusable on every page; visible focus styles; semantic landmarks (`header`, `nav`, `main`, `section`/`article`, `aside` for TOC, `footer`); one `h1` per page; correct heading hierarchy.
- AA contrast on text and controls.
- Every page: unique `<title>`, meta description, `lang="en"` on `<html>`, viewport meta, favicon `<link>`(s).
- No horizontal overflow 360px–1920px.

## README.md — rewrite fully

How to run it (open `index.html`, or `python -m http.server 8000` from the repo root); project structure (files and folders); how to add a destination (card on home → block on `destination.html` with matching `id` → jump link → image); how to change images (where they live, the `onerror` fallback, the SVG placeholder pattern); how to connect the contact form (set `data-endpoint` to a Formspree URL, what changes); note the design system (palette, fonts) and the no-build constraint; note favicon.svg-only / no PNG tradeoff.

## Verification checklist (mandatory before done)

Serve locally: `python -m http.server 8000` from `c:/Users/aadyagupta/Incredible-India`. Then:
- Every internal link and asset path resolves (no 404s): nav links, homepage destination cards → `destination.html#<id>` (ids exist), CTA buttons (relative, not 127.0.0.1), footer links, `styles.css`, each page CSS, `site.js`, `gallery.js`, `contact.js`, `assets/logo*.svg`, `assets/favicon.svg`, `images/*.svg`.
- Mobile menu opens/closes via hamburger, Escape, outside click, link click; links visible without JS.
- Gallery lightbox: open; close (button + Escape + backdrop); prev/next arrows; focus trap; focus restored. Without JS, images still link to full photos.
- Contact form: validation messages appear; no fake success; "not connected yet" notice present; `data-endpoint` present.
- No console errors: run `node --check site.js`, `node --check gallery.js`, `node --check contact.js` (all pass); confirm all script `src` paths and all referenced ids exist.
- Responsive 360px–1920px: no horizontal overflow.
- AA contrast on text/controls.

## Decomposition (FEAT artifact files under .agents/tasks/task-incredible-india-redesign/)

- **FEAT-001** Foundation: `styles.css` (tokens + base + header/nav + footer + buttons + skip link + focus + reveal/animation utility classes), `assets/logo.svg`/`logo-dark.svg`/`logo-mark.svg`/`favicon.svg`, `images/placeholder.svg` + `images/hero.svg`, `site.js`. Documents canonical header/footer markup + the inline `.js` script + the SVG placeholder pattern in findings.
- **FEAT-002** Home: `index.html` + `index.css` + six destination card SVGs (`images/rajasthan.svg` … `images/varanasi.svg`).
- **FEAT-003** Destinations: `destination.html` + `destination.css` + three more-to-explore SVGs (`images/leh-ladakh.svg`, `images/andaman-nicobar.svg`, `images/mysore.svg`); reuse the six from FEAT-002.
- **FEAT-004** Travel Tips: `traveltip.html` + `traveltip.css` + sticky TOC + table.
- **FEAT-005** Gallery: `gallery.html` + `gallery.css` + `gallery.js` + gallery SVGs; fix `</head>`.
- **FEAT-006** Contact: `contact.html` + `contact.css` + `contact.js` + `images/contact-hero.svg`.
- **FEAT-007** README + polish: rewrite `README.md`; optional `favicon.png`; final asset pass.
- **Convergence**: cross-FEAT integration (serve + full link/asset sweep + JS syntax + responsiveness), then review → `review.json`.
