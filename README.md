# Incredible India — Travel Guide

A static travel-guide website for India, built with plain HTML, CSS and vanilla JavaScript. No build step, no bundler, no framework — open a file and it works.

---

## How to Run

### Option 1 — Open directly
Double-click `index.html`. Most pages work fine. Note: some browsers block local fetch requests, which may affect the contact form's submit attempt (the honest "not connected" notice will still appear).

### Option 2 — Local server (recommended)
Any static server works. With Python (3.x):

```bash
cd path/to/Incredible-India
python -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

With Node (if installed):

```bash
npx serve .
```

Or the VS Code **Live Server** extension — right-click `index.html` → "Open with Live Server".

---

## Project Structure

```
Incredible-India/
├── index.html          Home page
├── index.css           Home-page styles
├── destination.html    Destinations page
├── destination.css     Destinations styles
├── traveltip.html      Travel Tips page
├── traveltip.css       Travel Tips styles
├── gallery.html        Gallery page
├── gallery.css         Gallery styles
├── gallery.js          Gallery filters + lightbox
├── contact.html        Contact page
├── contact.css         Contact styles
├── contact.js          Contact form validation
├── styles.css          ← Shared: design tokens, header, footer,
│                           buttons, skip link, reveal animations
├── site.js             ← Shared: mobile menu, IntersectionObserver
│                           reveals, image onerror fallback
├── assets/
│   ├── logo.svg        Logo — light-background version
│   ├── logo-dark.svg   Logo — dark-background version (used in header/footer)
│   ├── logo-mark.svg   Mark only (no wordmark)
│   └── favicon.svg     Favicon (SVG)
├── images/
│   ├── placeholder.svg Generic fallback image (shown on broken src)
│   ├── hero.svg        Home page hero illustration
│   ├── rajasthan.svg
│   ├── kerala.svg
│   ├── himachal-pradesh.svg
│   ├── uttarakhand.svg
│   ├── goa.svg
│   ├── varanasi.svg
│   ├── leh-ladakh.svg
│   ├── andaman-nicobar.svg
│   ├── mysore.svg
│   ├── contact-hero.svg
│   ├── gallery-valley-flowers.svg
│   ├── gallery-rann-kutch.svg
│   ├── gallery-spiti.svg
│   ├── gallery-tawang.svg
│   ├── gallery-loktak.svg
│   └── gallery-dudhsagar.svg
└── README.md
```

> **No favicon.png** — no SVG rasteriser (ImageMagick / Inkscape / sharp) was available in the build environment. The SVG favicon works in all modern browsers. To generate a PNG, run:
> `magick assets/favicon.svg -resize 32x32 assets/favicon.png`
> then add `<link rel="icon" href="assets/favicon.png" sizes="32x32">` to each `<head>`.

---

## Design System

All design tokens live as CSS custom properties on `:root` in **`styles.css`**:

| Token | Value | Use |
|---|---|---|
| `--color-ivory` | `#FAF7F0` | Page background |
| `--color-forest` | `#183D32` | Primary buttons, header, footer |
| `--color-saffron` | `#E89B3C` | Highlights, accents on dark backgrounds |
| `--color-terracotta` | `#B9674D` | Eyebrow labels, accents |
| `--color-charcoal` | `#252A27` | Body text |
| `--color-sage` | `#E5EBDD` | Soft section backgrounds |
| `--font-heading` | Playfair Display, Georgia… | All headings |
| `--font-body` | Inter, system-ui… | Body text, UI |

Fonts are loaded via Google Fonts `<link>` in each page `<head>`. `styles.css` only references the families through variables — it does **not** `@import` fonts.

**Logo text** uses SVG `<text>` with a font-family stack. The SVG makes no external requests; if Playfair Display hasn't loaded yet the browser falls back to Georgia. Hand-converting the wordmark to vector paths is the only way to eliminate the font dependency entirely.

---

## How to Add a Destination

1. **Home card** (`index.html`) — add an `<article class="dest-card reveal">` inside `.dest-grid`. Link the card button to `destination.html#your-id`.

2. **Destination block** (`destination.html`) — add an `<article id="your-id" class="dest-block reveal">` following the alternating pattern. Include best time, top attractions and local food.

3. **Jump link** (`destination.html`) — add `<li><a href="#your-id">Name</a></li>` to `.jump-nav__list`.

4. **Image** — create `images/your-destination.svg` following the SVG placeholder pattern (gradient background + subtle pattern + destination name as `<text>`). Reference it in both the home card and the destination block.

### SVG image pattern

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#183D32"/>
      <stop offset="100%" stop-color="#E89B3C"/>
    </linearGradient>
  </defs>
  <rect width="600" height="400" fill="url(#g)"/>
  <!-- your scene illustration here -->
  <text x="300" y="370" text-anchor="middle"
        font-family="Georgia, serif" font-size="22" font-weight="700"
        letter-spacing="0.1em" fill="rgba(255,255,255,0.95)">DESTINATION NAME</text>
</svg>
```

---

## How to Change Images

All images are local SVGs in the `images/` folder — no hotlinking. To swap one:

1. Place your new file (SVG or JPEG/WebP/PNG) in `images/`.
2. Update the `src` attribute on the relevant `<img>` element.
3. Update `alt` text to be descriptive.
4. Keep `width` and `height` attributes to prevent layout shift.
5. Use `loading="lazy"` on every image except the hero (which should stay `loading="eager"`).

### Broken-image fallback

`site.js` attaches a capture-phase `error` listener that swaps any broken `<img>` to `images/placeholder.svg`. It guards against loops with `data-err-handled`. If you rename the placeholder, update the path in `site.js`:

```js
el.src = 'images/placeholder.svg'; // ← update this line
```

---

## How to Connect the Contact Form

The form in `contact.html` has `data-endpoint="https://formspree.io/f/your-id"` on the `<form>` element. Until a real endpoint is set, `contact.js` detects the placeholder value and shows an honest "not connected" notice — it never fakes a success.

### Using Formspree (free tier)

1. Create an account at [formspree.io](https://formspree.io).
2. Create a new form and copy your endpoint URL (e.g. `https://formspree.io/f/abcdefgh`).
3. In `contact.html`, replace `your-id` in the `data-endpoint` attribute:
   ```html
   <form data-endpoint="https://formspree.io/f/abcdefgh" ...>
   ```
4. Remove or hide the `.form-notice` div (or leave it — once a real endpoint is set, submissions work and the notice becomes just an info banner).

### Using another service

Any service that accepts a `POST` with `multipart/form-data` and returns JSON works. Set `data-endpoint` to the service URL. `contact.js` POSTs with `fetch`, reads `res.ok`, and on success resets the form and shows a real confirmation. On failure it shows the error — it never claims success unless the server said so.

---

## Accessibility Notes

- Every page has a **skip link** as the first focusable element (`Skip to content` → `#main`).
- Visible **focus styles** use a saffron outline (`outline: 3px solid #E89B3C`).
- Semantic landmarks: `<header>`, `<nav>`, `<main>`, `<section>`, `<aside>`, `<footer>`.
- One `<h1>` per page; correct heading hierarchy throughout.
- The mobile hamburger uses `aria-expanded` and closes on Escape, outside click, and link click.
- The gallery lightbox uses `role="dialog" aria-modal="true"` with a focus trap and focus restored on close.
- All `<img>` elements have meaningful `alt` text; decorative images use `alt=""`.
- WCAG AA colour contrast on text and controls.

---

## No-Build Constraint

This project intentionally has **no build step**. Keep it that way:

- No `npm install`, no `package.json`, no `node_modules`.
- No CSS preprocessors (`sass`, `less`, `postcss`).
- No JavaScript bundlers (`webpack`, `vite`, `rollup`).
- No frameworks (`React`, `Vue`, `Angular`, `Svelte`).
- The only external request allowed is the Google Fonts `<link>` in each page `<head>`.

To add shared functionality, edit `styles.css` (shared styles) or `site.js` (shared JS). To add page-specific functionality, edit the page's own CSS file or create a new `page.js` and link it with `<script src="page.js" defer></script>` before `</body>`.

---

## Licence

See [LICENSE](LICENSE).
