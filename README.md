# mulfinger.com

Personal advisory site of Dr. Sven Mulfinger. A static Astro site styled with Tailwind CSS, deployed from GitHub to Netlify. It replaces the previous HubSpot site.

## Tech stack

- Astro 7, fully static output in `dist/`
- Tailwind CSS v4 via `@tailwindcss/vite`, plus `@tailwindcss/typography`
- Self-hosted fonts via Fontsource: Inter Tight (display and text) and JetBrains Mono (labels). No Google Fonts calls.
- `@astrojs/sitemap` for `sitemap-index.xml`
- Netlify: hosting, CDN, HTTPS, Forms
- No front-end framework and no trackers. Two small scripts in `public/`: `menu.js` (mobile menu) and `form.js` (form validation and in-place confirmation)

## Structure

```
src/
  data/
    site.ts               names, links, nav and ALL public claims (badges). Edit claims here only.
    faq.ts                12-question FAQ (question, one-line verdict, expanded body with [text](url) links).
                          Feeds Faq.astro, the FAQPage schema and /llms-full.txt.
  layouts/Layout.astro    html shell, SEO, header, footer. Takes an optional `faq` prop.
  components/
    Seo.astro             meta, canonical, OpenGraph, Twitter card, JSON-LD graph
                          (Person, Organization, ProfessionalService, 3 x Service, WebSite, WebPage, FAQPage when `faq` is passed)
    Header.astro          sticky nav + full-screen mobile drawer (drawer sits outside <header> on purpose)
    Footer.astro          footer with credentials row
    Badges.astro          credentials grid
    Faq.astro             question + visible verdict, <details> 'Read context' toggle, outbound links only inside the toggle
    ContactForm.astro     Netlify form "executive-diagnostic" with honeypot and in-place success state
  pages/
    index.astro           home (includes FAQ)
    about.astro           systems lineage
    advisory.astro        1:1 advisory, The Round, comparison with Kuma Partners (includes FAQ)
    contact.astro         executive diagnostic application
    legal.astro           legal notice and privacy (PLACEHOLDER, complete before launch)
    thanks.astro          fallback success page for visitors without JavaScript (noindex)
    404.astro
    llms-full.txt.ts      generates /llms-full.txt at build time, including all 12 FAQ answers
  styles/global.css       design tokens and base styles
public/
  llms.txt                GEO summary for AI search and assistants (static)
  robots.txt              allows all crawlers incl. AI bots, points to the sitemap
  favicon.svg, og.png, menu.js, form.js
scripts/verify.mjs        post-build checks (see Verification)
netlify.toml              build, security headers, caching, redirects
```

## Local development

Requires Node 22.

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # outputs dist/
npm run verify    # post-build checks, run after build
npm run check     # build + verify in one go
npm run preview   # serve dist/ locally
```

Netlify Forms only work on Netlify. Locally, the form validates but submission will fail with the error message.

## Verification

`npm run verify` checks the built site and exits non-zero on any failure:

- required files exist: all pages, `llms.txt`, `llms-full.txt`, `robots.txt`, sitemap, `og.png`, scripts
- sitemap lists the four main pages and excludes `/thanks`
- every internal link and `#anchor` resolves
- the form keeps `data-netlify="true"`, the honeypot, the hidden `form-name` and all four required fields
- JSON-LD parses, contains Person and Service, and a 12-question FAQPage with plain-text answers on home and advisory
- the FAQ renders 12 items, each with a toggle; all 5 outbound links sit inside the expanded context and use `target="_blank" rel="noopener noreferrer"`
- `llms-full.txt` contains all 12 FAQ answers
- no em dashes and no IE Business School claim anywhere in pages or llms files

Status on 2026-10-15: build clean, 61/61 checks passed. The form was also tested in a browser: empty and invalid submissions are blocked with inline errors, and a valid one posts all fields and shows the in-place confirmation.

## Deployment pipeline

GitHub repo `sven353/mulfinger-com`, branch `main`. Netlify builds every push to `main` (`npm run build`, publish `dist`, settings from `netlify.toml`).

Command line:

```bash
git add .
git commit -m "Add GEO layer, FAQ schema, hardened Netlify form, security headers, and project docs"
git push origin main
```

Or through the GitHub web interface: Add file > Upload files, then commit to `main`. Files deleted locally must also be deleted in the repo by hand, because an upload never removes files.

Netlify then builds, runs the form detection and publishes atomically. If a build fails, the previous version stays live. Every deploy can be rolled back from Netlify > Deploys.

## DNS (IONOS)

The domain is registered at IONOS and points to Netlify's load balancer.

| Type  | Host | Value | Notes |
|-------|------|-------|-------|
| A     | @    | 75.2.60.5 | Netlify load balancer. Remove any other A or AAAA records on @. |
| CNAME | www  | `<project-name>.netlify.app` | Netlify then redirects www to the apex, see `netlify.toml` |

Keep the existing MX, SPF, DKIM and DMARC records for email untouched.

After DNS resolves, Netlify > Domain management shows both domains as verified and issues the Let's Encrypt certificate automatically. Only then, turn on HSTS preload by submitting the domain at hstspreload.org. The header is already set, and preload is hard to undo, so be sure every subdomain serves HTTPS first.

## Security headers

Set in `netlify.toml` for every response: HSTS (1 year, subdomains, preload), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` (camera, microphone, geolocation off), `Cross-Origin-Opener-Policy`, and a CSP. The CSP allows only scripts, fonts and images from this domain. All scripts are external files, so there is no inline JavaScript. Fetch and form posts are allowed only to this domain.

If you ever add a third-party embed (analytics, Calendly, video), its domain must be added to the CSP or it will be blocked.

## Caching

`/_astro/*` holds every fingerprinted build file (CSS, fonts, processed images) and is cached for a year as immutable. `/assets/*` gets the same rule for future hashed assets. Unhashed files (`og.png`, `favicon.svg`, scripts, `llms*.txt`) get short caches so edits appear after the next deploy. HTML always revalidates.

## Inbound lead workflow (Netlify Forms)

1. A visitor submits the application at /contact. With JavaScript, the page shows the in-place confirmation. Without it, Netlify redirects to /thanks.
2. The submission lands in Netlify > Project > Forms > `executive-diagnostic`. The honeypot (`bot-field`) and Netlify's spam filter catch most bots. Flagged entries go to the Spam tab.
3. Set up notifications once: Forms > Form notifications > Add notification > Email notification, recipient sven@mulfinger.com, form `executive-diagnostic`. For faster triage, add a Slack notification as well.
4. Triage within a few working days, as the confirmation promises. Reply from your own inbox. The visitor's address is in the `email` field.
5. Record qualified leads in HubSpot (private portal "Sven Mulfinger"), or export from Netlify as CSV.
6. Delete submissions in Netlify once handled. The privacy notice promises deletion when no working relationship follows.

The free Netlify tier includes 100 submissions per month.

## GEO layer

`llms.txt` follows the llmstxt.org format: H1, summary, then link sections. `llms-full.txt` is the full profile with biography, credentials, approach, engagement modes, research and all FAQ answers. It is generated from `src/data/faq.ts` at build time, so FAQ edits flow through automatically. Both are linked from every page's `<head>`, are served as UTF-8 plain text and carry `X-Robots-Tag: noindex` so they do not compete with the HTML pages in classic search. Update `public/llms.txt` and the intro in `src/pages/llms-full.txt.ts` whenever a claim in `src/data/site.ts` changes.

## Claims policy

Only claims confirmed by Sven appear anywhere on the site, including the llms files. Confirmed on 2026-10-15: IESE Business School research collaboration, more than 100 founders and CEOs guided, molecular genetics and chemical engineering background, doctorate, four working languages. IE Business School is deliberately not mentioned. The field of the doctorate is not stated.

Commercial terms confirmed the same day and published in the FAQ: 6 or 12-month retainer, two 60 to 90-minute sessions per month, unlimited direct voice and message access, in-person sessions in Barcelona or Madrid, response to applications within 24 to 48 hours, The Round by application or peer nomination. If any of these change, update `src/data/faq.ts`, the advisory page and the contact page together.

## Content to complete

- `src/pages/legal.astro`: owner details and NIF, check with your advisor
- `src/data/site.ts`: add the LinkedIn URL (shows in the footer and JSON-LD)
- `src/pages/about.astro`: replace the portrait placeholder with `public/sven.jpg` (rendered greyscale)

## Writing rules for this site

UK spelling, no serial comma, no em dashes, no bold labels, short paragraphs.

## Changelog

- 2026-10-15 (v4): 12-question FAQ with visible one-line verdicts and 'Read context' toggles, smooth expansion where supported, outbound links to kuma.partners, offsite.kuma.partners, theround.kuma.partners and neurodisruptors.com only inside the expanded context. FAQPage schema extended to 12 answers. `/llms-full.txt` now generated from the FAQ data. Confirmed terms applied site-wide (24 to 48 hour reply, Madrid sessions, nomination route for The Round, retainer cadence). Verify script extended to 61 checks.
- 2026-10-15 (v3): GEO layer (`llms.txt`, `llms-full.txt`, AI-friendly `robots.txt`), FAQ component with FAQPage schema on home and advisory, Service schema for the three engagement modes, WebPage schema. Form renamed to `executive-diagnostic` with new fields, inline validation and in-place confirmation. Hardened headers and caching in `netlify.toml`, `/sitemap.xml` redirect. `scripts/verify.mjs` and npm `verify` and `check` scripts. Full README.
- 2026-10-15 (v2): Monochrome Swiss redesign, Layout and Badges components, /contact page, new copy, The Round and Kuma comparison on /advisory.
- 2026-10-15 (v1): Initial build.
