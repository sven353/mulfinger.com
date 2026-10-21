// Post-build verification for mulfinger.com. Run: npm run verify (after npm run build).
// Checks required files, internal links and anchors, Netlify form markup, JSON-LD and copy rules.
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname;
const results = [];
const check = (name, ok, detail = '') => results.push({ name, ok, detail });

const walk = (dir) => readdirSync(dir).flatMap((f) => {
  const p = join(dir, f);
  return statSync(p).isDirectory() ? walk(p) : [p];
});
const files = walk(DIST);
const htmlFiles = files.filter((f) => f.endsWith('.html'));

// 1. Required files
for (const f of ['index.html', 'about/index.html', 'advisory/index.html', 'contact/index.html', 'llms.txt', 'llms-full.txt', 'robots.txt', 'sitemap-index.xml', 'sitemap-0.xml', 'favicon.svg', 'og.png', 'menu.js', 'form.js', '404.html', 'thanks/index.html', 'legal/index.html', 'privacy/index.html']) {
  check(`file: ${f}`, existsSync(join(DIST, f)));
}
const sitemap = readFileSync(join(DIST, 'sitemap-0.xml'), 'utf8');
for (const p of ['/', '/about/', '/advisory/', '/contact/']) {
  check(`sitemap lists ${p}`, sitemap.includes(`https://mulfinger.com${p}`));
}
check('sitemap excludes /thanks, /legal, /privacy', !/\/(thanks|legal|privacy)\//.test(sitemap));
check('robots.txt references sitemap', readFileSync(join(DIST, 'robots.txt'), 'utf8').includes('Sitemap: https://mulfinger.com/sitemap-index.xml'));

// 2. Internal links and anchors
const pageFor = (path) => {
  const clean = path.replace(/\/$/, '');
  const candidates = [join(DIST, clean, 'index.html'), join(DIST, clean + '.html'), join(DIST, clean)];
  return candidates.find((c) => existsSync(c) && statSync(c).isFile());
};
const idsIn = (html) => new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
let broken = [];
let checked = 0;
for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  const self = '/' + relative(DIST, file).replace(/index\.html$/, '').replace(/\.html$/, '');
  for (const [, href] of html.matchAll(/\shref="([^"]+)"/g)) {
    if (/^(https?:|mailto:|tel:|data:)/.test(href)) continue;
    checked++;
    const [path, hash] = href.split('#');
    const target = path === '' ? file : pageFor(path);
    if (!target) { broken.push(`${self} -> ${href} (missing page)`); continue; }
    if (hash && target.endsWith('.html') && !idsIn(readFileSync(target, 'utf8')).has(hash)) {
      broken.push(`${self} -> ${href} (missing #${hash})`);
    }
  }
}
check(`internal links (${checked} checked)`, broken.length === 0, broken.join('; '));

// 3. Netlify form
const contact = readFileSync(join(DIST, 'contact/index.html'), 'utf8');
const formTag = contact.match(/<form[^>]*>/)?.[0] ?? '';
check('form name="executive-diagnostic"', formTag.includes('name="executive-diagnostic"'));
check('form data-netlify="true"', formTag.includes('data-netlify="true"'));
check('form netlify-honeypot="bot-field"', formTag.includes('netlify-honeypot="bot-field"'));
check('honeypot input present', contact.includes('name="bot-field"'));
check('hidden form-name input', contact.includes('name="form-name" value="executive-diagnostic"'));
for (const n of ['full_name', 'email', 'role_organisation', 'decision_challenge', 'privacy_consent']) {
  check(`required field ${n}`, new RegExp(`name="${n}"[^>]*required|required[^>]*name="${n}"`).test(contact));
}
check('in-place success state present', contact.includes('data-form-success'));
check('only one Netlify form site-wide', htmlFiles.filter((f) => readFileSync(f, 'utf8').includes('data-netlify="true"')).length === 1);

// 4. JSON-LD
for (const page of ['index.html', 'advisory/index.html', 'about/index.html']) {
  const html = readFileSync(join(DIST, page), 'utf8');
  const raw = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)?.[1];
  let graph = [];
  try { graph = JSON.parse(raw)['@graph']; } catch { check(`JSON-LD parses on ${page}`, false); continue; }
  const types = graph.map((n) => n['@type']);
  check(`JSON-LD on ${page}: Person + Service`, types.includes('Person') && types.includes('Service'));
  const faqNode = graph.find((n) => n['@type'] === 'FAQPage');
  if (page !== 'advisory/index.html') {
    check(`no FAQPage on ${page}`, !faqNode);
  } else {
    check(`FAQPage on ${page} (${faqNode?.mainEntity?.length ?? 0} questions)`, faqNode?.mainEntity?.length === 6);
    const faqTexts = (faqNode?.mainEntity ?? []).map((q) => q.acceptedAnswer?.text ?? '');
    check(`FAQPage answers are plain text on ${page}`, faqTexts.length > 0 && faqTexts.every((t) => t.length > 80 && !/[<>\[\]]/.test(t)));
  }
  check(`canonical + og + twitter on ${page}`, /rel="canonical"/.test(html) && /og:image/.test(html) && /twitter:card/.test(html));
}

// 4b. FAQ markup and outbound routing
for (const page of ['advisory/index.html']) {
  const html = readFileSync(join(DIST, page), 'utf8');
  const section = html.match(/<section id="faq"[\s\S]*?<\/section>/)?.[0] ?? '';
  const items = section.match(/<li[\s\S]*?<\/li>/g) ?? [];
  check(`FAQ on ${page} renders 6 items`, items.length === 6);
  check(`every FAQ item has a <details> toggle on ${page}`, items.length > 0 && items.every((li) => li.includes('<details') && li.includes('<summary')));
  // outbound links must sit inside <details>, never in the visible question or verdict
  const leaked = items.filter((li) => /href="https?:\/\//.test(li.split('<details')[0]));
  check(`no outbound links outside expanded context on ${page}`, leaked.length === 0);
  const outbound = [...section.matchAll(/<a [^>]*href="https?:\/\/[^"]+"[^>]*>/g)].map((m) => m[0]);
  const bad = outbound.filter((a) => !a.includes('target="_blank"') || !a.includes('rel="noopener noreferrer"'));
  check(`${outbound.length} FAQ outbound links use target=_blank + noopener noreferrer on ${page}`, outbound.length === 3 && bad.length === 0, bad.join(' '));
  for (const host of ['www.kuma.partners', 'offsite.kuma.partners', 'theround.kuma.partners']) {
    check(`FAQ on ${page} links to ${host}`, outbound.some((a) => a.includes(`https://${host}`)));
  }
}

// 4c. llms-full.txt carries all FAQ answers
const llmsFull = readFileSync(join(DIST, 'llms-full.txt'), 'utf8');
check('llms-full.txt contains 6 FAQ entries', (llmsFull.match(/^### \d+\. /gm) ?? []).length === 6);

// 4d. Home structure (editorial redesign, October 2026)
{
  const home = readFileSync(join(DIST, 'index.html'), 'utf8');
  check('home: reassurance note under the primary button', home.includes('Confidential. Direct. No obligation to continue.'));
  const img = home.match(/<figure[\s\S]*?<img[^>]*>/)?.[0]?.match(/<img[^>]*>/)?.[0] ?? '';
  check('home: hero portrait is a real optimised image', /src="\/_astro\/sven-hero\.[^"]+\.webp"/.test(img) && /srcset="[^"]*480w[^"]*960w/.test(img));
  check('home: portrait alt text', img.includes('alt="Dr. Sven Mulfinger advising founders and CEOs"'));
  check('home: portrait loads eagerly with high priority', img.includes('loading="eager"') && img.includes('fetchpriority="high"'));
  const imgSrc = img.match(/src="([^"]+)"/)?.[1];
  check('home: portrait file exists in dist', !!imgSrc && existsSync(join(DIST, imgSrc)));
  // Mobile reading order (below lg) is set with flex order: eyebrow and headline 1, lead 2, photo 3, CTA 4.
  const ord = (re) => Number(home.match(re)?.[1] ?? 0);
  const oHead = ord(/class="order-(\d)[^"]*lg:col-span-5 lg:row-start-1/);
  const oPhoto = ord(/<figure class="order-(\d)/);
  const oLead = ord(/<p class="order-(\d)[^"]*"[^>]*>I work with founders/);
  const oCta = ord(/<div class="order-(\d)[^"]*">\s*<a href="\/contact"/);
  check('home: mobile order headline, lead, photo, CTA', oHead === 1 && oLead === 2 && oPhoto === 3 && oCta === 4, [oHead, oLead, oPhoto, oCta].join(','));
  check('home: mobile reorder only below lg', /<figure class="order-3 lg:order-none/.test(home) && home.includes('class="contents lg:block'));
  check('home: hero photo in landscape 3:2 frame', /<figure[\s\S]*?aspect-\[3\/2\]/.test(home));
  // One photograph site-wide (the hero portrait); the book cover is the only other image allowed.
  const imgs = htmlFiles.flatMap((f) => readFileSync(f, 'utf8').match(/<img [^>]*>/g) ?? []);
  const photos = imgs.filter((t) => !t.includes('alt="The Non-Linear Operating System by Dr. Sven Mulfinger"'));
  const roundPhoto = imgs.filter((t) => t.includes('alt="Dr. Sven Mulfinger facilitating The Round executive peer session in Barcelona."'));
  check(`The Round session photo present, lazy-loaded`, roundPhoto.length === 1 && roundPhoto[0].includes('loading="lazy"'));
  check(`four photographs site-wide: hero, 1:1 session, The Round, Kuma offsite (found ${photos.length})`, photos.length === 4);
  check('three path cards each carry a 16:9 photograph', (home.match(/<figure class="mb-6">\s*<div class="relative aspect-video/g) ?? []).length === 3);
  check(`only the four photographs and the book cover as images (found ${imgs.length})`, imgs.length === 5);
  const stale = htmlFiles.filter((f) => /Portrait to follow|PORTRAIT TO FOLLOW|sven-mulfinger\.jpg/.test(readFileSync(f, 'utf8'))).map((f) => relative(DIST, f));
  check('no portrait placeholders left', stale.length === 0, stale.join(', '));
  check('home: situations section with 3 blocks', home.includes('The problems that bring CEOs to the table.') && (home.match(/id="situations-heading"[\s\S]*?<\/section>/)?.[0].match(/<article/g) ?? []).length === 3);
  check('home: background section', home.includes('I have sat on both sides of the table.'));
  check('home: 4-step process', home.includes('What happens when we work together.') && (home.match(/id="process-heading"[\s\S]*?<\/ol>/)?.[0].match(/<li/g) ?? []).length === 4);
  check('home: final invitation', home.includes('Bring the decision you have been circling.'));
  for (const host of ['https://www.kuma.partners', 'https://offsite.kuma.partners', 'https://neurodisruptors.com']) {
    const a = [...home.matchAll(new RegExp(`<a [^>]*href="${host.replace(/\./g, '\\.')}"[^>]*>`, 'g'))].map((m) => m[0]);
    check(`home links to ${host} in a new tab`, a.length > 0 && a.every((t) => t.includes('target="_blank"') && t.includes('rel="noopener noreferrer"')));
  }
}
{
  const css = files.filter((f) => f.endsWith('.css')).map((f) => readFileSync(f, 'utf8')).join('');
  check('serif headings: Newsreader bundled and applied to h1-h3', css.includes('Newsreader Variable') && /h1,h2,h3\{font-family:var\(--font-serif\)/.test(css.replace(/\s/g, '')));
  check('fonts self-hosted: no Google Fonts requests', !files.filter((f) => /\.(html|css)$/.test(f)).some((f) => readFileSync(f, 'utf8').includes('fonts.googleapis.com')));
  check('warm paper background #FAF9F6', css.toLowerCase().includes('#faf9f6'));
}

// 4e. No stray text before the document (catches a broken frontmatter fence)
{
  const stray = htmlFiles.filter((f) => !/^\s*<!doctype html>/i.test(readFileSync(f, 'utf8'))).map((f) => relative(DIST, f));
  check('every page starts with <!doctype html>', stray.length === 0, stray.join(', '));
}

// 4f. Legal layer
for (const page of ['legal/index.html', 'privacy/index.html']) {
  const html = readFileSync(join(DIST, page), 'utf8');
  check(`${page}: robots noindex, follow`, html.includes('<meta name="robots" content="noindex, follow">'));
  check(`${page}: owner, NIF/NIE and contact email present`, html.includes('EX4339734W') && html.includes('sven@kuma.partners') && html.includes('Sven Mulfinger'));
  check(`${page}: English and Spanish versions`, html.includes('id="en"') && html.includes('id="es"') && html.includes('lang="es-ES"'));
}
{
  const priv = readFileSync(join(DIST, 'privacy/index.html'), 'utf8');
  for (const t of ['6.1.a', '6.1.f', 'Standard Contractual Clauses', 'aepd.es', 'portab', 'Cookies']) {
    check(`privacy policy covers "${t}"`, priv.includes(t));
  }
  const legalHtml = readFileSync(join(DIST, 'legal/index.html'), 'utf8');
  for (const t of ['Article 10', 'LateralDeck', 'Spiky Profile', 'courts of Barcelona', 'No contractual advisory relationship']) {
    check(`legal notice covers "${t}"`, legalHtml.includes(t));
  }
  const noFooter = htmlFiles.filter((f) => {
    const footer = readFileSync(f, 'utf8').match(/<footer[\s\S]*?<\/footer>/)?.[0] ?? '';
    return !(footer.includes('href="/privacy"') && footer.includes('href="/legal"'));
  }).map((f) => relative(DIST, f));
  check('footer links to /privacy and /legal on every page', noFooter.length === 0, noFooter.join(', '));
  const contactHtml = readFileSync(join(DIST, 'contact/index.html'), 'utf8');
  check('form shows first-layer data protection info', contactHtml.includes('Basic data protection information'));
}

const visible = [...htmlFiles, join(DIST, 'llms.txt'), join(DIST, 'llms-full.txt')];

// 4g. Editorial rules from the October 2026 audit
{
  const home = readFileSync(join(DIST, 'index.html'), 'utf8');
  const homeText = home.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ');
  check('home: new hero headline', homeText.includes('A thinking partner for the decisions you cannot delegate.'));
  check('home: no FAQ block', !home.includes('id="faq"'));
    check('home: no product labels (Mode/Format/Rhythm/Led by)', !/\b(Mode 0\d|Format|Rhythm|Led by)\b/.test(homeText));
  const slogan = htmlFiles.reduce((n, f) => n + (readFileSync(f, 'utf8').replace(/<[^>]+>/g, ' ').match(/Slow down to speed up/gi) ?? []).length, 0);
  check(`"Slow down to speed up" not repeated as a banner (found ${slogan})`, slogan <= 1);
  const old = visible.filter((f) => readFileSync(f, 'utf8').includes('Translating deep systemic')).map((f) => relative(DIST, f));
  check('old hero headline fully retired', old.length === 0, old.join(', '));
}

// 4h. GEO layer: entity graph, crawler rules and llms files
{
  for (const page of ['index.html', 'advisory/index.html']) {
    const html = readFileSync(join(DIST, page), 'utf8');
    const head = html.split('</head>')[0];
    const raw = head.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)?.[1];
    let graph = [];
    try { graph = JSON.parse(raw)['@graph']; } catch {}
    check(`${page}: JSON-LD graph sits in <head>`, graph.length > 0);
    const person = graph.find((n) => n['@type'] === 'Person');
    check(`${page}: Person #sven-mulfinger`, person?.['@id'] === 'https://mulfinger.com/#sven-mulfinger');
    check(`${page}: jobTitle set`, person?.jobTitle === 'Executive Advisor & Strategic Thought Partner');
    check(`${page}: sameAs LinkedIn, Kuma, Neurodisruptors`, ['linkedin.com/in/svenmulfinger', 'kuma.partners', 'neurodisruptors.com'].every((u) => (person?.sameAs ?? []).some((x) => x.includes(u))));
    check(`${page}: worksFor Kuma Partners`, graph.some((n) => n['@id'] === person?.worksFor?.['@id'] && n.name === 'Kuma Partners'));
    check(`${page}: no alumniOf (by choice)`, !person?.alumniOf);
    const svc = graph.find((n) => n['@id'] === 'https://mulfinger.com/#executive-advisory');
    check(`${page}: ProfessionalService #executive-advisory`, svc?.['@type'] === 'ProfessionalService' && svc?.provider?.['@id'] === person?.['@id'] && svc?.serviceType === '1:1 Executive Advisory for Founders and CEOs' && JSON.stringify(svc?.availableLanguage) === '["en","es","de","fr"]');
  }
  const robots = readFileSync(join(DIST, 'robots.txt'), 'utf8');
  for (const bot of ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Applebot-Extended']) {
    check(`robots.txt allows ${bot}`, new RegExp(`User-agent: ${bot}\\nAllow: /`).test(robots));
  }
  check('robots.txt sitemap line is a plain URL', /^Sitemap: https:\/\/mulfinger\.com\/sitemap-index\.xml$/m.test(robots));
  const llms = readFileSync(join(DIST, 'llms.txt'), 'utf8');
  check('llms.txt: core mandate, routing and disambiguation', llms.includes('A thinking partner for the decisions you cannot delegate') && llms.includes('## Ecosystem routing') && llms.includes('## Disambiguation'));
  const full = readFileSync(join(DIST, 'llms-full.txt'), 'utf8');
  check('llms-full.txt: engagement model and entity relationships', full.includes('## The advisory engagement model') && full.includes('## Entity relationships and disambiguation'));
  const frankfurt = visible.filter((f) => readFileSync(f, 'utf8').includes('Frankfurt')).map((f) => relative(DIST, f));
  check('Frankfurt not claimed (not confirmed)', frankfurt.length === 0, frankfurt.join(', '));
}

// 4i. Scroll reveal and proof bar
{
  const home = readFileSync(join(DIST, 'index.html'), 'utf8');
  const css = files.filter((f) => f.endsWith('.css')).map((f) => readFileSync(f, 'utf8')).join('').replace(/\s/g, '');
  check('reveal.js shipped and loaded in <head> without defer', existsSync(join(DIST, 'reveal.js')) && /<head>[\s\S]*<script src="\/reveal\.js"><\/script>[\s\S]*<\/head>/.test(home));
  check('reveal hides content only under .js and no-preference motion', css.includes('@media(prefers-reduced-motion:no-preference){.js.reveal{opacity:0'));
  check('reveal stagger delays defined', [['100', '.1s'], ['200', '.2s'], ['300', '.3s']].every(([d, s]) => css.includes(`.js.reveal.delay-${d}{transition-delay:${d}ms}`) || css.includes(`.js.reveal.delay-${d}{transition-delay:${s}}`)));
  check('hero is never hidden by reveal', !/<section class="bg-linear-to-tr[^>]*reveal/.test(home) && !/<h1[^>]*reveal/.test(home));
  check('home uses reveal on sections below the fold', (home.match(/class="[^"]*\breveal\b/g) ?? []).length >= 12);
  const noBar = htmlFiles.filter((f) => !/<section aria-label="Credentials"[\s\S]*?<\/section>\s*<footer/.test(readFileSync(f, 'utf8'))).map((f) => relative(DIST, f));
  check('proof bar directly above the footer on every page', noBar.length === 0, noBar.join(', '));
}

// 4j. Field reflections and track record scope (confirmed 2026-10-16)
{
  const home = readFileSync(join(DIST, 'index.html'), 'utf8');
  const sec = home.match(/aria-labelledby="cases-heading"[\s\S]*?<\/section>/)?.[0] ?? '';
  check('field reflections: 3 cases', (sec.match(/<article/g) ?? []).length === 3);
  const pos = ['id="process-heading"', 'id="cases-heading"', 'id="paths-heading"'].map((t) => home.indexOf(t));
  check('field reflections sit between process and paths', pos.every((x) => x > 0) && pos[0] < pos[1] && pos[1] < pos[2]);
  check('100+ scope clarified on home', home.includes('across confidential 1:1 advisory, executive peer councils and board-level interventions'));
  check('100+ scope clarified in llms.txt', readFileSync(join(DIST, 'llms.txt'), 'utf8').includes('executive peer councils'));
}

// 4k. Subpages share the homepage design system
for (const page of ['about/index.html', 'advisory/index.html']) {
  const html = readFileSync(join(DIST, page), 'utf8');
  const main = html.match(/<main[\s\S]*?<\/main>/)?.[0] ?? '';
  const firstSection = main.match(/<section[^>]*>/)?.[0] ?? '';
  check(`${page}: hero uses the diagonal paper gradient`, firstSection.includes('bg-linear-to-tr'));
  check(`${page}: hero is never hidden by reveal`, !firstSection.includes('reveal') && !/<h1[^>]*reveal/.test(main));
  check(`${page}: sections below the fold use reveal`, (main.match(/class="[^"]*\breveal\b/g) ?? []).length >= 8);
  check(`${page}: h1 set in Newsreader serif`, /<h1[^>]*font-serif/.test(main));
}
{
  const adv = readFileSync(join(DIST, 'advisory/index.html'), 'utf8');
  check('advisory: who / what-we-work-on two-column grid', adv.includes('Who this is for') && adv.includes('What we work on'));
  check('advisory: three path cards with rounded corners', (adv.match(/<article[^>]*rounded-\[1\.5rem\]/g) ?? []).length === 3);
  const about = readFileSync(join(DIST, 'about/index.html'), 'utf8');
  check('about: three pillars and closing invitation', about.includes('Three sources of judgement.') && about.includes('id="about-invite-heading"'));
}

// 4l. Favicon: valid standalone SVG, Direction A mark, linked on every page
{
  const fav = readFileSync(join(DIST, 'favicon.svg'), 'utf8');
  check('favicon: valid SVG namespace', fav.includes('xmlns="http://www.w3.org/2000/svg"'));
  check('favicon: squircle tile and letter path, adapts to dark mode', /<rect class="tile"[^>]*rx="118"/.test(fav) && /<path class="letter" d="M/.test(fav) && fav.includes('prefers-color-scheme:dark') || fav.includes('prefers-color-scheme: dark'));
  const noIcon = htmlFiles.filter((f) => !/<link rel="icon" href="\/favicon\.svg" type="image\/svg\+xml">/.test(readFileSync(f, 'utf8'))).map((f) => relative(DIST, f));
  check('favicon linked on every page', noIcon.length === 0, noIcon.join(', '));
}

// 4m. Reading rhythm (2026-10-16)
{
  const home = readFileSync(join(DIST, 'index.html'), 'utf8');
  const sit = home.match(/aria-labelledby="situations-heading"[\s\S]*?<\/section>/)?.[0] ?? '';
  check('situations: three bold lead-ins', (sit.match(/<strong class="font-semibold text-ink">/g) ?? []).length === 3);
  const proc = home.match(/aria-labelledby="process-heading"[\s\S]*?<\/section>/)?.[0] ?? '';
  check('process: single timeline axis drawn on the list', /<ol[^>]*lg:before:border-t/.test(proc));
  const bgs = [...home.matchAll(/<section class="([^"]*)"[^>]*aria-labelledby="(situations|background|process|cases|paths)-heading"/g)].map((m) => [m[2], /bg-mist/.test(m[1]) ? 'mist' : 'paper']);
  const want = [['situations','paper'],['background','mist'],['process','paper'],['cases','mist'],['paths','paper']];
  check('sections alternate paper and mist', JSON.stringify(bgs) === JSON.stringify(want), JSON.stringify(bgs));
}

// 4n. Social sharing cards
{
  const og = readFileSync(join(DIST, 'og.png'));
  const w = og.readUInt32BE(16), h = og.readUInt32BE(20);
  check(`og.png is a 1200x630 PNG (found ${w}x${h})`, og.subarray(1, 4).toString() === 'PNG' && w === 1200 && h === 630);
  for (const page of ['index.html', 'about/index.html', 'advisory/index.html', 'contact/index.html']) {
    const html = readFileSync(join(DIST, page), 'utf8');
    const meta = (k) => html.match(new RegExp(`<meta (?:property|name)="${k}" content="([^"]*)"`))?.[1];
    const abs = ['og:url', 'og:image', 'og:image:secure_url', 'twitter:url', 'twitter:image'].every((k) => meta(k)?.startsWith('https://mulfinger.com/'));
    const canon = html.match(/rel="canonical" href="([^"]+)"/)?.[1] ?? '';
    check(`social: ${page} absolute apex URLs, og.png, large card`, abs && canon.startsWith('https://mulfinger.com/') && meta('og:image') === 'https://mulfinger.com/og.png' && meta('twitter:card') === 'summary_large_image' && meta('og:image:type') === 'image/png' && !!meta('og:image:alt') && !!meta('twitter:image:alt'));
  }
  const toml = readFileSync('netlify.toml', 'utf8');
  check('og.png cached one day with revalidation', /for = "\/og\.png"\s*\[headers\.values\]\s*Cache-Control = "public, max-age=86400, must-revalidate"/.test(toml));
}

// 5. Copy rules
const emDash = visible.filter((f) => readFileSync(f, 'utf8').includes('\u2014')).map((f) => relative(DIST, f));
check('no em dashes in pages or llms files', emDash.length === 0, emDash.join(', '));
const ie = visible.filter((f) => /\bIE Business School\b/.test(readFileSync(f, 'utf8').replace(/IESE Business School/g, ''))).map((f) => relative(DIST, f));
check('IE Business School named with Prof. Deuschel (confirmed 2026-10-15)', readFileSync(join(DIST, 'index.html'), 'utf8').includes('Nicolas Deuschel (IE Business School)'));
check('Kluetter spelled Thomas everywhere', !visible.some((f) => readFileSync(f, 'utf8').includes('Tomas Kluetter')));
check('old 20+ case-study figure retired', !visible.some((f) => /more than 20 case studies/.test(readFileSync(f, 'utf8'))));
{
  const home = readFileSync(join(DIST, 'index.html'), 'utf8');
  const cover = home.match(/<img[^>]*alt="The Non-Linear Operating System by Dr\. Sven Mulfinger"[^>]*>/)?.[0] ?? '';
  check('book cover rendered as optimised image with srcset', cover.includes('srcset=') && cover.includes('.webp'));
}

// Report
const failed = results.filter((r) => !r.ok);
for (const r of results) console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}${r.detail ? `  ${r.detail}` : ''}`);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
process.exit(failed.length ? 1 : 0);
