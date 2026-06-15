# Praman — DPDP Compliance Advisory Website

A responsive, multi-page static website for a data-protection / DPDP compliance
advisory business. Plain HTML, CSS, and JavaScript — no build step, no
dependencies. Host it anywhere.

## Structure

```
praman-website/
├── index.html        Home
├── services.html     Services (detailed)
├── pricing.html      Pricing + FAQ
├── about.html        About / values / credentials
├── contact.html      Contact form + details
├── css/
│   └── styles.css     Shared styles (all pages)
└── js/
    └── main.js        Mobile menu, footer year, contact form
```

## How to run it

- **Locally:** double-click `index.html`, or run a tiny server from this folder:
  - Python: `python -m http.server 8000` → open `http://localhost:8000`
- **Hosting:** upload the whole folder to any static host (Netlify, Vercel,
  GitHub Pages, Cloudflare Pages, S3, or normal cPanel hosting). No server code
  required.

## What to customize

1. **Brand name** — replace "Praman" throughout (search & replace). The logo is
   an inline SVG in each page's header/footer.
2. **Contact details** — email `hello@praman.example`, phone `+91 00000 00000`,
   and the office address on `contact.html`.
3. **Pricing** — figures on `pricing.html` are indicative; set your own.
4. **Credentials** — the chips on `about.html` are placeholders; list your
   team's actual certifications.
5. **Colors / fonts** — all design tokens live at the top of `css/styles.css`
   (`:root` variables).

## Make the contact form live

The form currently validates and shows a confirmation in the browser only — it
does **not** send anything. To receive enquiries, either:

- point it at a form provider (e.g. Formspree, Web3Forms) by adding an `action`
  and `method` to the `<form>` in `contact.html`, or
- post the fields to your own backend / email service.

## Notes

- Responsive down to mobile, keyboard-accessible, and respects reduced-motion.
- Praman provides advisory services, not legal advice — keep the footer
  disclaimer, and work with qualified legal counsel for formal compliance
  decisions.
