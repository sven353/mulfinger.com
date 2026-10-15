# mulfinger.com

Personal advisory site of Sven Mulfinger. Static Astro site styled with Tailwind CSS v4, hosted on Netlify. Replaces the previous HubSpot site.

## Stack

- Astro 7, static output (`dist/`)
- Tailwind CSS v4 via `@tailwindcss/vite`, plus `@tailwindcss/typography`
- Self-hosted fonts: Inter Tight (display and text) and JetBrains Mono (labels), via Fontsource. No Google Fonts calls.
- `@astrojs/sitemap` for `sitemap-index.xml`
- Netlify Forms: `executive-intake` on /contact
- No frameworks or trackers in the browser. One small script (`public/menu.js`) for the mobile menu.

## Structure

```
src/
  data/site.ts            names, links, nav and ALL public claims (badges). Edit claims here only.
  layouts/Layout.astro    html shell, SEO, header, footer
  components/
    Seo.astro             meta, canonical, OpenGraph, Twitter card, JSON-LD (Person, Organization, ProfessionalService, WebSite)
    Header.astro          sticky nav + full-screen mobile drawer (drawer sits outside <header> on purpose)
    Footer.astro          architectural footer with credentials row
    Badges.astro          credentials grid (IESE, 100+, languages, Kuma)
    ContactForm.astro     Netlify form "executive-intake" with honeypot
  pages/
    index.astro           home
    about.astro           systems lineage: genetics, engineering, founder, IESE, advisory
    advisory.astro        1:1 advisory, The Round, comparison with Kuma Partners
    contact.astro         executive diagnostic application
    legal.astro           legal notice and privacy (PLACEHOLDER, complete before launch)
    thanks.astro          form success page (noindex)
    404.astro
  styles/global.css       design tokens and base styles
public/
  favicon.svg, og.png, robots.txt, menu.js
netlify.toml              build, security headers, caching, redirects
```

## Design system

Monochrome Swiss. Tokens in `src/styles/global.css`:
ink #0F1115, ink-line #1E232B, white #FFFFFF, mist #F8F9FA, line #E2E8F0, steel #5B6270 (text on light), fog #8B93A1 (text on dark).
Display type uses the `display` utility, small mono markers the `label` utility.

## Claims policy

Only claims confirmed by Sven appear on the site. Confirmed 2026-10-15: IESE research collaboration, 100+ founders and CEOs guided, molecular genetics and chemical engineering background, doctorate, four languages. IE Business School is deliberately not mentioned.

## Local development

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # outputs dist/
npm run preview
```

## First deploy

### Option A: command line

```bash
cd mulfinger-com
git init -b main
git add .
git commit -m "Complete mulfinger.com architecture overhaul"

# create the empty repo first at https://github.com/new (name: mulfinger-com, no README)
git remote add origin https://github.com/sven353/mulfinger-com.git
git push -u origin main

# Netlify
npm install -g netlify-cli
netlify login
netlify init      # choose "Create & configure a new project", connect the GitHub repo
                  # build command: npm run build, publish directory: dist
```

### Option B: GitHub web upload

1. Create the repo `mulfinger-com` on GitHub.
2. Add file > Upload files, drag in the contents of this folder (not `node_modules` or `dist`).
3. In Netlify: Add new project > Import from Git > pick `mulfinger-com`. Settings come from `netlify.toml`.

### After the first deploy

1. Netlify > Forms: confirm the `executive-intake` form was detected (the old `diagnostic` form can be deleted). Add an email notification to your inbox.
2. Netlify > Domain management: add `mulfinger.com` and `www.mulfinger.com`. Point DNS to Netlify (or move nameservers). HTTPS is automatic.
3. Before switching DNS away from HubSpot, list the old URLs that matter (HubSpot sitemap, Search Console) and add 301s to `netlify.toml`.
4. Submit `https://mulfinger.com/sitemap-index.xml` in Google Search Console.

## Content to complete

- `src/pages/legal.astro`: owner details and NIF, check with your advisor.
- `src/data/site.ts`: add the LinkedIn URL (shows in footer and JSON-LD).
- `src/pages/about.astro`: replace the portrait placeholder with `public/sven.jpg` (rendered greyscale).

## Writing rules for this site

UK spelling, no serial comma, no em dashes, no bold labels, short paragraphs.

## Changelog

- 2026-10-15 (v2): Full overhaul. Monochrome Swiss design system, new Layout and Badges components, dedicated /contact page with Netlify form executive-intake, new copy across all pages, The Round and Kuma comparison on /advisory, new OG image and favicon.
- 2026-10-15: Initial build. Home, About, Advisory, Legal, Thanks, 404. Netlify form, security headers, sitemap, OG image.
