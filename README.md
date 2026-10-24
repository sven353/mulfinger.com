# mulfinger.com

Personal advisory site of Dr. Sven Mulfinger. A static Astro site styled with Tailwind CSS, deployed from GitHub to Netlify. It replaces the previous HubSpot site.

## Tech stack

- Astro 7, fully static output in `dist/`
- Tailwind CSS v4 via `@tailwindcss/vite`, plus `@tailwindcss/typography`
- Self-hosted fonts via Fontsource: Newsreader (serif, all headings) and Inter (body and navigation). No Google Fonts calls, so the CSP and the Privacy Policy stay accurate.
- `@astrojs/sitemap` for `sitemap-index.xml`
- Netlify: hosting, CDN, HTTPS, Forms
- No front-end framework and no trackers. Two small scripts in `public/`: `menu.js` (mobile menu) and `form.js` (form validation and in-place confirmation)

## Structure

```
src/
  data/
    site.ts               names, links, nav and ALL public claims (badges). Edit claims here only.
    legal.ts              owner, NIF/NIE, contact email, address, hosting: single source for both legal pages and the form notice
    faq.ts                6-question advisory FAQ (question, one-line verdict, expanded body with [text](url) links).
                          Feeds Faq.astro on /advisory, the FAQPage schema and /llms-full.txt.
  layouts/Layout.astro    html shell, SEO, header, footer. Takes an optional `faq` prop.
  components/
    Seo.astro             meta, canonical, OpenGraph, Twitter card, JSON-LD graph
                          (Person, Organization, ProfessionalService, 3 x Service, WebSite, WebPage, FAQPage when `faq` is passed)
    Header.astro          sticky nav + full-screen mobile drawer (drawer sits outside <header> on purpose)
    Footer.astro          footer with credentials row
    Faq.astro             question + visible verdict, <details> 'Read context' toggle, outbound links only inside the toggle
    ContactForm.astro     Netlify form "executive-diagnostic": honeypot, required privacy consent checkbox,
                          first-layer data protection summary, in-place success state
    LegalShell.astro      shared frame and typography for the two legal pages
  pages/
    index.astro           home: hero with portrait, three situations, background, four-step process,
                          engagement paths (1:1 primary), research feature, final invitation
    about.astro           systems lineage
    advisory.astro        who it is for, how an engagement works, what to expect, The Round and Kuma Partners, 6-question FAQ
    contact.astro         "Discuss a leadership challenge" with the simplified form
    legal.astro           Legal Notice | Aviso Legal (LSSI-CE), English + Spanish, noindex follow
    privacy.astro         Privacy Policy | Política de Privacidad (GDPR, LOPDGDD), English + Spanish, noindex follow
    thanks.astro          fallback success page for visitors without JavaScript (noindex)
    404.astro
    llms-full.txt.ts      generates /llms-full.txt at build time, including all FAQ answers
  styles/global.css       design tokens and base styles
public/
  llms.txt                GEO summary for AI search and assistants (static)
  robots.txt              allows all crawlers incl. AI bots, points to the sitemap
  favicon.svg, og.png, menu.js, form.js
scripts/verify.mjs        post-build checks (see Verification)
netlify.toml              build, security headers, caching, redirects
```

## Design system

Editorial authority (FT, Monocle, HBR rather than a tech landing page). Tokens in `src/styles/global.css`:
paper #FAF9F6 (background), mist #F2F0EB (alternate sections), ink #111317 (text, dark surfaces), steel #4A5568 (secondary text), line #E2E8F0 (hairlines), fog #9AA3B2 (text on dark).
All h1 to h3 are set in Newsreader; `display` is the serif display utility, `label` the small uppercase sans marker. No boxed cards: hairline rules and whitespace carry the rhythm.
Primary button `bg-ink text-paper hover:bg-ink-hover`; secondary links are underlined text.

Photography: one photograph site-wide, `src/assets/images/sven-hero.jpg`, in the home hero only. Astro converts it to responsive WebP (480 to 1256 px, 18 to 56 kB) at build time. The 4:5 crop is set by `object-[44%_40%]` in `src/pages/index.astro`; to swap the photo, replace the file under the same name and check the crop. `npm run verify` fails if a second `<img>` or a placeholder appears.

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
- the proof bar sits directly after the hero with 3 credentials; home links to kuma.partners and offsite.kuma.partners in a new tab
- every page starts with `<!doctype html>` (catches a broken frontmatter fence)
- no em dashes anywhere in pages or llms files; IE Business School appears only with Prof. Deuschel as confirmed; Kluetter spelled Thomas

Status on 2026-10-24: build clean, 167/167 checks passed. No horizontal overflow and nothing left half-faded on any main page from 390 to 2560 px wide.

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
2. The visitor must tick the privacy consent box. The value `privacy_consent=accepted` is stored with the submission as the consent record.
3. The submission lands in Netlify > Project > Forms > `executive-diagnostic`. The honeypot (`bot-field`) and Netlify's spam filter catch most bots. Flagged entries go to the Spam tab.
4. Set up notifications once: Forms > Form notifications > Add notification > Email notification, recipient sven@mulfinger.com, form `executive-diagnostic`. For faster triage, add a Slack notification as well.
5. Triage within a few working days, as the confirmation promises. Reply from your own inbox. The visitor's address is in the `email` field.
6. Record qualified leads in HubSpot (private portal "Sven Mulfinger"), or export from Netlify as CSV.
7. Delete submissions in Netlify once handled. The Privacy Policy promises deletion when no engagement follows.
8. Data protection requests arrive at sven@kuma.partners and must be answered within one month.

The free Netlify tier includes 100 submissions per month.

## GEO layer

Entity graph (`src/components/Seo.astro`, in the `<head>` of every page): Person `#sven-mulfinger` (jobTitle, slogan, knowsAbout, sameAs LinkedIn, Kuma Partners and Neurodisruptors, worksFor Kuma Partners, IESE affiliation), Organization `#kuma`, ProfessionalService `#executive-advisory` (serviceType, areaServed Europe and Global, availableLanguage en, es, de, fr), three Service nodes, WebSite, WebPage, and FAQPage on /advisory only. No alumniOf, by Sven's choice.

`robots.txt` explicitly allows GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, PerplexityBot, Google-Extended and Applebot-Extended.

`llms.txt` carries an entity summary, ecosystem routing, a disambiguation note (Sven Mulfinger vs Kuma Partners) and the page index. `llms-full.txt` adds the biography, situations, core diagnostic scenarios, the advisory engagement model, entity relationships and all FAQ answers.

Canonical host is the apex `https://mulfinger.com` everywhere (www redirects to it), so all schema and llms URLs use the apex form.


`llms.txt` follows the llmstxt.org format: H1, summary, then link sections. `llms-full.txt` is the full profile with biography, credentials, approach, engagement modes, research and all FAQ answers. It is generated from `src/data/faq.ts` at build time, so FAQ edits flow through automatically. Both are linked from every page's `<head>`, are served as UTF-8 plain text and carry `X-Robots-Tag: noindex` so they do not compete with the HTML pages in classic search. Update `public/llms.txt` and the intro in `src/pages/llms-full.txt.ts` whenever a claim in `src/data/site.ts` changes.

## Claims policy

Only claims confirmed by Sven appear anywhere on the site, including the llms files and the schema. Confirmed on 2026-10-16: the three Field Reflections cases are real, anonymised engagements with accurate figures; the 100+ track record covers founders, managing directors and C-suite leaders across 1:1 advisory, executive peer councils and board-level interventions. Confirmed later on 2026-10-15: IE Business School collaboration (Prof. Dr. Nicolas Deuschel), Prof. Dr. Thomas Kluetter (spelling), research across more than 50 serial entrepreneurs and CEOs. Not confirmed and therefore excluded: a genetics-specific doctorate, Frankfurt as a location, alumniOf institutions. Confirmed on 2026-10-15: IESE Business School research collaboration, more than 100 founders and CEOs guided, molecular genetics and chemical engineering background, doctorate, four working languages. IE Business School is deliberately not mentioned. The field of the doctorate is not stated.

Commercial terms confirmed the same day and published in the FAQ: 6 or 12-month retainer, two 60 to 90-minute sessions per month, unlimited direct voice and message access, in-person sessions in Barcelona or Madrid, response to applications within 24 to 48 hours, The Round by application or peer nomination. If any of these change, update `src/data/faq.ts`, the advisory page and the contact page together.

## Content to complete

- `src/data/legal.ts`: replace the address placeholder with the full postal address (street, number, postcode, town). LSSI-CE Art. 10 requires it.
- Have both legal pages reviewed by your lawyer or gestor before relying on them.
- `src/pages/about.astro`: replace the portrait placeholder with `public/sven.jpg` (rendered greyscale)

## Writing rules for this site

UK spelling, no serial comma, no em dashes, no bold labels, short paragraphs.

Editorial rules from the October 2026 audit, enforced by `npm run verify`:

- describe real leadership situations in the words leaders use, not frameworks or conceptual jargon
- no slogan banners: "Slow down to speed up" may appear at most once
- no product labels (Mode, Format, Rhythm, Led by) on the home page; engagement paths are described in prose
- every external link opens in a new tab with `rel="noopener noreferrer"`
- the FAQ lives only on /advisory
- primary call to action everywhere: "Discuss a leadership challenge"

## Changelog

- 2026-10-16 (v20): Reading rhythm: bold lead-ins on the three situations, paragraph measure capped at 40ch, alternating paper and mist sections, grouped engagement paths, four-step process on one continuous timeline axis (vertical on mobile).
- 2026-10-16 (v21): Mobile-only layout pass (below 1024 px): natural hero order (headline, lead, photo, full-width CTA), section padding py-10, balanced headings, hairline separators between situations and process steps, compact path cards with 44 px touch targets, softer glass header, drawer locked against sideways scroll. Desktop unchanged.
- 2026-10-16 (v22): Documentary photographs on the 1:1 Advisory and Kuma Partners cards. All three path cards share one anatomy (16:9 photo and caption, eyebrow, title, description, action pinned to the bottom); About The Round now links to theround.kuma.partners.
- 2026-10-16 (v23): Social sharing: new 1200x630 editorial OG card (rendered from HTML with the site's own Inter and Newsreader), complete OpenGraph and X metadata with absolute apex URLs and image alt text, og.png cached one day with must-revalidate.
- 2026-10-16 (v24): Kuma Partners card now shows the Berlin leadership team offsite (Sven and Vincent Azé at the board), cropped at centre 35%.
- 2026-10-17 (v25): Page hierarchy: secondary text token darkened to #2D3748, narrative body copy at 15/16 px with 1.7 leading, background section as an asymmetric statement and stacked pillars, field reflections as white outcome cards with a highlighted resolution, research band on a soft mist background.
- 2026-10-23 (v26): Redesign, "the working paper". The site now reads like an edited essay: one warm ivory background, warm hairlines, Newsreader for reading text, Inter only for navigation and notes, a single petrol accent, section names as quiet margin notes. No gradients, cards, uppercase labels or scroll animation. Typographic hero; documentary photographs only (Berlin offsite, The Round), square-cornered with captions. Homepage adds "How I think" (two draft patterns for Sven to replace) and a background told as operator, scientist and advisor. About, Advisory, Contact, FAQ, header, footer and social card rebuilt in the same system. Removed: public/reveal.js and the two staged photographs.
- 2026-10-24 (v27): Motion that follows the reader's scroll. The opening composes itself on arrival; a thin petrol reading-progress line runs along the top; section rules draw in from the left; headings and blocks of text settle into place; the two client remarks are written out across the line; photographs drift slightly slower than the page; margin notes stay beside the text while a chapter is read. Built with CSS scroll-driven animations (no JavaScript); browsers without support and visitors who prefer reduced motion see the finished page.
- 2026-10-24 (v28): New Berlin offsite photograph and caption on the homepage.
- 2026-10-24 (v29): Homepage "The operator" paragraph rewritten: 20 years building start-ups, CEO in the corporate world, then Kuma Partners (stated by Sven).
- 2026-10-24 (v30): Less text, more rhythm. Homepage roughly halved in reading length: 1:1 conversation photograph in the opening, bleeding off the right edge and uncovered on arrival; the three situations as cards that stack while you scroll; one "How I think" pattern (the COO pattern moved to /advisory); the Berlin offsite as a full-width strip with a large pull quote; background led by four figures; one field case open and two behind "Read the case"; research cut to two sentences. About timeline cut from six steps to five with the 20-year operator story.
- 2026-10-24 (v31): Advisory FAQ folded: each item shows only the question; opening it shows the one-line answer, with the longer context one more click away. First five questions visible, the rest behind "Show more questions". Six questions added for GEO (who Sven is, locations and languages, coaching vs consulting vs therapy, confidentiality, fees, neurodivergent founders), all built from facts already confirmed on the site. FAQPage schema and llms-full.txt now carry 12 questions.
- 2026-10-24 (v32): All three field cases folded on the homepage: context, title and a one-line summary visible; the full situation, underneath and what changed open with "Read the case".
- 2026-10-24 (v33): "Three ways to work together" shows a small photograph beside each way of working (1:1, The Round, leadership teams) on the homepage and /advisory; the large Round photo moved into its row. New leadership-teams image (path-teams.jpg). The 1:1 thumbnail (path-advisory.jpg) is a copy of the hero photograph until Sven supplies its own.
- 2026-10-24 (v34): Opening rebuilt as a full-width photograph strip with a paper panel (name, headline, subtitle, button) over its lower right corner; on phones the panel overlaps the bottom of the photo. The three situations are now one framed panel of three columns that fill in from left to right while scrolling, replacing the stacking cards and their empty space.
- 2026-10-24 (v35): Full-width Berlin strip and its pull quote removed from the homepage. In "Three ways to work together" the Berlin offsite photo now sits beside Leadership teams; 1:1 Executive Advisory shows Sven in conversation; The Round keeps its own photo. path-teams.jpg deleted.
- 2026-10-24 (v36): Research section: larger book cover on desktop, cover now also shown on phones above the heading, and the 50+ founders described as operating with a non-linear mind (ADHD, giftedness, dyslexia, autism and others).
- 2026-10-24 (v37): Opening strip capped at 1,440 px wide and sized to the photograph's proportions, so very wide screens no longer blow the 1,264 px source up and crop into it; photograph served at full resolution with lighter compression.
- 2026-10-24 (v38): Situations reframed for the people who get in touch: margin note "Why leaders get in touch", a line on founders and CEOs seeking advisory or a sparring partner, line icons instead of "One of three", titles addressed to the reader, and a link to a first conversation. Short folded FAQ (five questions) back on the homepage before the invitation, linking to all 12 on /advisory; FAQPage schema stays on /advisory only.
- 2026-10-24 (v39): Background adds "The researcher": recent research on cognitive preferences, within and beyond the neurodivergent spectrum, with a focus on leadership (stated by Sven). Same line added to the research pillar on /about.
- 2026-10-24 (v40): Hero rebuilt from Sven's original photograph (1,264 px) with a carefully resampled 2,528 px version for retina screens (hero-conversation.jpg), so browsers no longer stretch it. Panel moved to the right edge of the strip and narrowed so it never crosses Sven's face. advisory-conversation.jpg deleted (no longer used).
- 2026-10-16 (v19): Favicon Direction A: Newsreader capital M (wght 650, opsz 24, outlined from the site font) in a squircle tile, inverting in dark browser chrome.
- 2026-10-16 (v18): /advisory and /about aligned with the homepage: diagonal paper gradient heroes (not animated), serif headings, hairline grids, scroll reveal with stagger, rounded path cards on /advisory, rounded hover rows in the FAQ, warm closing panel on /about. FAQ stays at six questions.
- 2026-10-16 (v17): The Round session photo (`src/assets/images/the-round-session.jpg`) in The Round card, 16:9 crop at 35% height, rounded-2xl, caption. Site now carries two photographs.
- 2026-10-16 (v16): Field Reflections section (three anonymised cases: dilemma, what lay beneath, resolution) between the process and the engagement paths. 100+ track record clarified on home, About, proof bar and both llms files.
- 2026-10-16 (v15): Scroll reveal (`public/reveal.js`, IntersectionObserver, threshold 0.12, 100/200/300 ms stagger), hidden state only with JavaScript and no reduced-motion preference; hero never animated. Background and process sections restructured, engagement paths as three equal cards with 1:1 tinted as primary, light proof bar above the footer on every page.
- 2026-10-15 (v14): Situations section rebuilt as a three-column editorial grid: header, one full-width hairline, then three equal columns. Staggered indents and per-item rules removed.
- 2026-10-15 (v13): Hero rebalanced to a 42/58 split from md upwards with the photo in its natural 3:2 landscape ratio, showing both conversation partners and the city view. Mobile order: eyebrow, headline, photo, supporting text, call to action. Text column capped at 27.5rem.
- 2026-10-15 (v12): Hero photo frame softened (3:4, rounded-2xl mobile, 1.5rem desktop, ink/5 hairline, faint shadow), subtle diagonal cream-to-grey gradients on the hero and situations sections, quieter caption, more air above the CTA.
- 2026-10-15 (v11): Real book cover in the research section (optimised WebP, 3.4 MB source down to 32 to 280 kB per size). Research copy updated with Prof. Dr. Thomas Kluetter (IESE) and Prof. Dr. Nicolas Deuschel (IE Business School) and the 50+ figure, carried through About, schema affiliation and both llms files.
- 2026-10-15 (v10): Single photograph in the hero (`src/assets/images/sven-hero.jpg`), optimised to responsive WebP, eager and high priority, 4:5 crop centred on Sven. Hero rebuilt as 7/5 columns; on mobile the order is headline, subhead, photo, call to action. Portrait placeholder removed from About. Legal pages no longer reference the removed mono font. Verify script at 121 checks.
- 2026-10-15 (v9): GEO upgrade. Person `#sven-mulfinger` with new jobTitle, knowsAbout and LinkedIn in sameAs; ProfessionalService `#executive-advisory` with serviceType, areaServed and language codes; Kuma Partners organisation described for disambiguation. llms.txt restructured (entity summary, ecosystem routing, disambiguation); llms-full.txt gains the engagement model, diagnostic scenarios and entity relationships. Applebot-Extended allowed in robots.txt. LinkedIn link in the footer. Verify script at 115 checks.
- 2026-10-15 (v8): Editorial authority redesign. Newsreader serif headings with Inter body, warm paper palette, boxed cards replaced by hairline rules. New home in eight sections: two-column hero with portrait frame and reassurance note, three narrative situations, background, four-step process, engagement paths with 1:1 as the primary offer, research feature, final invitation. Advisory restructured around buyer questions. Contact simplified to four fields plus consent (fields `role_organisation`, `decision_challenge`). Privacy Policy updated to match. All external links open in a new tab. New favicon and OG image. Verify script at 93 checks.
- 2026-10-15 (v7): Editorial overhaul. New hero ("A thinking partner for the decisions you cannot delegate."), four real situations replace the philosophy cards, one approach section carries "Slow down to speed up", engagement modes rewritten as prose without product labels, home FAQ removed, advisory FAQ cut to six qualification questions, footer slogan removed, CTAs unified, site title, description, OG image and llms files updated.
- 2026-10-15 (v6): Legal Notice (/legal) and Privacy Policy (/privacy) in English and Spanish under LSSI-CE, GDPR and LOPDGDD, both noindex follow and excluded from the sitemap. Footer links to both on every page. Form gains a required privacy consent checkbox and a first-layer data protection summary. Verify script at 87 checks.
- 2026-10-15 (v5): Hero refined: hairline grid at 40% of the line colour, paragraph directly under the headline, horizontal button group, clear primary and outline hierarchy, more editorial spacing. Proof bar rebuilt as a full-width three-credential strip (IESE, 100+, EN · ES · DE · FR). Engagement cards gain a descriptor line and a second Kuma link to offsite.kuma.partners; external links open in a new tab. Verify script at 66 checks.
- 2026-10-15 (v4): 12-question FAQ with visible one-line verdicts and 'Read context' toggles, smooth expansion where supported, outbound links to kuma.partners, offsite.kuma.partners, theround.kuma.partners and neurodisruptors.com only inside the expanded context. FAQPage schema extended to 12 answers. `/llms-full.txt` now generated from the FAQ data. Confirmed terms applied site-wide (24 to 48 hour reply, Madrid sessions, nomination route for The Round, retainer cadence). Verify script extended to 61 checks.
- 2026-10-15 (v3): GEO layer (`llms.txt`, `llms-full.txt`, AI-friendly `robots.txt`), FAQ component with FAQPage schema on home and advisory, Service schema for the three engagement modes, WebPage schema. Form renamed to `executive-diagnostic` with new fields, inline validation and in-place confirmation. Hardened headers and caching in `netlify.toml`, `/sitemap.xml` redirect. `scripts/verify.mjs` and npm `verify` and `check` scripts. Full README.
- 2026-10-15 (v2): Monochrome Swiss redesign, Layout and Badges components, /contact page, new copy, The Round and Kuma comparison on /advisory.
- 2026-10-15 (v1): Initial build.
