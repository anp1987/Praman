# Praman — Go-Live Guide

Get the site online and capturing leads. Three parts: connect the forms, deploy
the site, then point your domain at it. Budget ~30–45 minutes.

---

## Part 1 — Connect the forms (so leads reach you)

Both the **Contact** form and the **Readiness Score** report form submit through
[Web3Forms](https://web3forms.com) — free, no backend, no account required.

1. Go to https://web3forms.com and enter the email address where you want leads
   delivered. They email you an **access key** (a long string).
2. Open `js/main.js`. Near the top, find:
   ```js
   var FORM_ACCESS_KEY = "YOUR-ACCESS-KEY-HERE";
   ```
   Replace `YOUR-ACCESS-KEY-HERE` with your key. Save.
3. That's it — both forms now email you every submission, including the
   visitor's **readiness score and answers**.

> Before you add a key, the forms still validate and show a confirmation, but
> nothing is sent. After you add it, submissions arrive in your inbox.

**Alternatives:** Formspree or your own backend work too — just change the
`fetch(...)` URL and payload in `js/main.js` (contact) and `js/readiness.js`
(readiness report).

---

## Part 2 — Deploy the site

Pick one. All are free for a site this size and serve the folder as-is.

### Option A — Netlify Drop (easiest, no account setup)
1. Go to https://app.netlify.com/drop
2. Drag the whole `praman-website` folder onto the page.
3. It's live instantly at a `*.netlify.app` URL.

### Option B — Cloudflare Pages / Vercel
1. Push this folder to a GitHub repository.
2. In Cloudflare Pages or Vercel, "Import" the repo.
3. Framework preset: **None / Static**. Build command: *(leave empty)*.
   Output directory: `/` (the repo root).
4. Deploy.

### Option C — GitHub Pages
1. Create a GitHub repo and upload these files to the `main` branch.
2. Repo → **Settings → Pages** → Source: `main` branch, `/root`.
3. Your site appears at `https://<username>.github.io/<repo>/`.

---

## Part 3 — Custom domain & email

1. **Buy a domain** (e.g. praman.in / praman.co) from any registrar.
2. **Point it at your host:** in your host's dashboard add the domain, then add
   the DNS records it shows you at your registrar. HTTPS is automatic on
   Netlify, Vercel, Cloudflare, and GitHub Pages.
3. **Professional email:** set up `hello@yourdomain` with Google Workspace,
   Zoho Mail (has a free tier), or your registrar's email. Then update the
   address shown in the footer and on `contact.html`.

---

## Part 4 — Before you share it (5-minute checklist)

- [ ] Web3Forms key added — submit a test enquiry and confirm it lands.
- [ ] Replaced the brand name "Praman" if you're using a different name.
- [ ] Updated email, phone, and office address (footer + `contact.html`).
- [ ] Set real prices on `pricing.html`.
- [ ] Listed your actual certifications on `about.html`.
- [ ] Added analytics — e.g. [Plausible](https://plausible.io) or Google
      Analytics — by pasting their snippet before `</body>` on each page.
- [ ] Opened the site on a phone to check the mobile menu and the Readiness
      Score flow.

---

## What's next (Phase 2)

Once leads are flowing and you've run a few assessments, replace the front-end
scoring with an ASP.NET Core backend: store responses, score server-side,
auto-generate a branded PDF report, and push leads into a CRM with follow-up
sequences. That turns this lead magnet into an automated machine — and the seed
of your SaaS product.
