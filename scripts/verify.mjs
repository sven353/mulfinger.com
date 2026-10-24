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
    check(`FAQPage on ${page} (${faqNode?.mainEntity?.length ?? 0} questions)`, faqNode?.mainEntity?.length === 12);
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
  check(`FAQ on ${page} renders 12 items`, items.length === 12);
  check(`FAQ on ${page}: first five visible, the rest folded behind Show more`, (section.split('<details class="faq-more')[0].match(/<li/g) ?? []).length === 5 && /Show 7 more questions/.test(section));
  check(`FAQ on ${page}: every question folded, answer only after opening`, items.every((li) => li.indexOf('<summary') < li.indexOf('<h3') && li.indexOf('</summary>') < li.indexOf('class="reading')));
  check(`every FAQ item has a <details> toggle on ${page}`, items.length > 0 && items.every((li) => li.includes('<details') && li.includes('<summary')));
  // outbound links must sit inside <details>, never in the visible question or verdict
  const leaked = items.filter((li) => /href="https?:\/\//.test(li.split('<details')[0]));
  check(`no outbound links outside expanded context on ${page}`, leaked.length === 0);
  const outbound = [...section.matchAll(/<a [^>]*href="https?:\/\/[^"]+"[^>]*>/g)].map((m) => m[0]);
  const bad = outbound.filter((a) => !a.includes('target="_blank"') || !a.includes('rel="noopener noreferrer"'));
  check(`${outbound.length} FAQ outbound links use target=_blank + noopener noreferrer on ${page}`, outbound.length === 4 && bad.length === 0, bad.join(' '));
  for (const host of ['kuma.partners', 'offsite.kuma.partners', 'theround.kuma.partners', 'neurodisruptors.com']) {
    check(`FAQ on ${page} links to ${host}`, outbound.some((a) => a.includes(`https://${host}`)));
  }
}

// 4c. llms-full.txt carries all FAQ answers
const llmsFull = readFileSync(join(DIST, 'llms-full.txt'), 'utf8');
check('llms-full.txt contains 12 FAQ entries', (llmsFull.match(/^### \d+\. /gm) ?? []).length === 12);

// 4d. Home structure: "the working paper" (v26, October 2026)
{
  const home = readFileSync(join(DIST, 'index.html'), 'utf8');
  check('home: reassurance note next to the primary button', home.includes('Confidential. Direct. No obligation to continue.'));
  const hero = home.match(/<section aria-labelledby="hero-heading"[\s\S]*?<\/section>/)?.[0] ?? '';
  const heroImg = hero.match(/<img[^>]*>/)?.[0] ?? '';
  check('home: hero photograph loads eagerly with high priority', heroImg.includes('loading="eager"') && heroImg.includes('fetchpriority="high"') && hero.includes('<h1'));
  const imgs = htmlFiles.flatMap((f) => readFileSync(f, 'utf8').match(/<img [^>]*>/g) ?? []);
  const photos = imgs.filter((t) => !t.includes('alt="The Non-Linear Operating System by Dr. Sven Mulfinger"'));
  const homeImgs = home.match(/<img [^>]*>/g) ?? [];
  check(`home: hero, three path thumbnails and the book cover (found ${homeImgs.length})`, homeImgs.length === 5 && homeImgs.every((t) => /alt="[^"]+"/.test(t)) && ['1:1 advisory conversation', 'Berlin', 'The Round', '1:1 advisory session'].every((k) => homeImgs.some((t) => t.includes(k))));
  const paths = home.match(/aria-labelledby="paths-heading"[\s\S]*?<\/section>/)?.[0] ?? '';
  check('home: each way of working has a small photograph beside it', (paths.match(/<li[\s\S]*?<img[\s\S]*?<h3/g) ?? []).length === 3);
  check(`no other images site-wide (found ${photos.length + 1} on all pages)`, imgs.every((t) => homeImgs.includes(t) || /1:1 advisory session|The Round|Berlin/.test(t)));
  check('photographs have square corners (no rounded frames)', !/<figure[\s\S]{0,200}rounded/.test(home));
  const stale = htmlFiles.filter((f) => /Portrait to follow|PORTRAIT TO FOLLOW|sven-mulfinger\.jpg/.test(readFileSync(f, 'utf8'))).map((f) => relative(DIST, f));
  check('no portrait placeholders left', stale.length === 0, stale.join(', '));
  const sec = (id) => home.match(new RegExp(`aria-labelledby="${id}-heading"[\\s\\S]*?<\\/section>`))?.[0] ?? '';
  check('home: situations as one framed panel of three, each with an icon', home.includes('When the usual answers stop working.') && (sec('situations').match(/<article class="situation settle[^"]*">\s*<svg/g) ?? []).length === 3 && !sec('situations').includes('of three'));
  check('home: hero photograph with rounded corners, headline panel over it, retina-ready', /<section aria-labelledby="hero-heading"[^>]*>\s*<div class="container-x">\s*<div class="relative w-full">\s*<div class="relative w-full [^"]*rounded-xl/.test(home) && /srcset="[^"]*1584w/.test(heroImg) && !/unveil|zoomout/.test(hero));
  check('home: how I think, one worked pattern (the second lives on /advisory)', (sec('thinking').match(/<blockquote/g) ?? []).length === 1 && readFileSync(join(DIST, 'advisory/index.html'), 'utf8').includes('We need to hire a COO.'));
  check('home: four figures in the background chapter', (sec('background').match(/<dd class="display/g) ?? []).length === 4);
  check('home: no full-width photo strip mid-page', !home.includes('id="room-quote"'));
  check('home: all three field cases folded, title and one-line summary visible', (sec('cases').match(/<details class="case/g) ?? []).length === 3 && (sec('cases').match(/<span class="mt-3 block reading/g) ?? []).length === 3);
  check('home: background narrative', home.includes('I have carried the responsibility too.'));
  check('home: final invitation', home.includes('Bring the problem you have not been able to solve.'));
  const order = ['situations-heading', 'thinking-heading', 'background-heading', 'cases-heading', 'research-heading', 'paths-heading', 'invite-heading'].map((id) => home.indexOf(`id="${id}"`));
  check('home: chapter order', order.every((x, i) => x > 0 && (i === 0 || x > order[i - 1])), order.join(','));
  for (const host of ['https://kuma.partners', 'https://offsite.kuma.partners', 'https://neurodisruptors.com']) {
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
  check('home: no FAQ (it lives on /advisory only), one-line bridge to /advisory', !home.includes('id="faq"') && home.includes('Considering an engagement?'));
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

// 4i. Quiet design rules: no scroll animation, no gradients, no cards, no uppercase labels
{
  const css = files.filter((f) => f.endsWith('.css')).map((f) => readFileSync(f, 'utf8')).join('');
  check('no scroll-reveal script or classes', !htmlFiles.some((f) => readFileSync(f, 'utf8').includes('src="/reveal.js"')) && !htmlFiles.some((f) => /class="[^"]*\breveal\b/.test(readFileSync(f, 'utf8'))));
  const main = (f) => readFileSync(f, 'utf8').match(/<main[\s\S]*?<\/main>/)?.[0] ?? '';
  const pages = ['index.html', 'about/index.html', 'advisory/index.html', 'contact/index.html'].map((p) => join(DIST, p));
  check('no gradient backgrounds on main pages', !pages.some((f) => /bg-linear|bg-gradient/.test(main(f))));
  check('no rounded cards on main pages (the opening photograph and its panel excepted)', !pages.some((f) => /rounded-(xl|2xl|\[)/.test(main(f).replace(/<section aria-labelledby="[^"]+"[^>]*>\s*<div class="container-x">\s*<div class="relative w-full">[\s\S]*?<\/section>/, ''))));
  check('no uppercase tracked labels on main pages', !pages.some((f) => /\buppercase\b/.test(main(f))));
  const flat = css.replace(/\s/g, '');
  check('motion: everything behind prefers-reduced-motion', flat.includes('@media(prefers-reduced-motion:no-preference){.rise{') && !/\.(settle|draw|wipe|drift)\{animation/.test(flat.split('@media(prefers-reduced-motion:no-preference)')[0]));
  check('motion: scroll-linked parts behind @supports, nothing hidden without it', flat.includes('@supports(animation-timeline:view())') && !/\.(settle|wipe|draw)\{[^}]*(opacity:0|display:none)/.test(flat.split('@supports(animation-timeline:view())')[0]));
  const home = readFileSync(join(DIST, 'index.html'), 'utf8');
  check('motion: hero rises on arrival, chapters draw and settle, photos drift', /<h1[^>]*class="rise rise-2 /.test(home) && (home.match(/class="draw /g) ?? []).length >= 4 && (home.match(/\bsettle\b/g) ?? []).length >= 10 && (home.match(/<blockquote[^>]*class="wipe /g) ?? []).length === 1);
  check('motion: scroll timelines survive minification (never folded into the animation shorthand)', ['draw', 'settle', 'wipe', 'drift', 'progress'].every((c) => new RegExp(`\\.${c}\\{[^}]*animation-timeline:var\\(--tl-`).test(flat)) && !/animation:[^;}]*(view|scroll)\(/.test(flat));
  check('motion: reading-progress line on every page', htmlFiles.filter((f) => !f.endsWith('404.html')).every((f) => readFileSync(f, 'utf8').includes('<div class="progress" aria-hidden="true"></div>')));
  check('hairlines: every line drawn as a one-device-pixel inset shadow', flat.includes('[class*=hair-]{box-shadow:var(--sh-t),var(--sh-b),var(--sh-l),var(--sh-r)}') && /@media\((min-resolution:2dppx|resolution>=2x)\)\{:root\{--hair:\.5px\}\}/.test(flat));
  const thick = htmlFiles.filter((f) => /class="[^"]*(?<![\w:-])(border|border-[tblrxy]|divide-[xy]|underline)(?![\w-])/.test(readFileSync(f, 'utf8'))).map((f) => relative(DIST, f));
  check('no border, divide or underline utilities left in the markup', thick.length === 0, thick.join(', '));
  check('single accent colour defined', /--color-accent:\s*#1f4e5a/i.test(css));
  check('warm hairlines replace slate', /--color-line:\s*#e5dfd5/i.test(css) && !/--color-line:\s*#e2e8f0/i.test(css));
  const noCredits = htmlFiles.filter((f) => !(readFileSync(f, 'utf8').match(/<footer[\s\S]*?<\/footer>/)?.[0] ?? '').includes('IESE and IE Business School')).map((f) => relative(DIST, f));
  check('credentials line in the footer on every page', noCredits.length === 0, noCredits.join(', '));
}

// 4j. Field notes and track record scope (confirmed 2026-10-16)
{
  const home = readFileSync(join(DIST, 'index.html'), 'utf8');
  const sec = home.match(/aria-labelledby="cases-heading"[\s\S]*?<\/section>/)?.[0] ?? '';
  check('field notes: 3 cases', (sec.match(/<article/g) ?? []).length === 3);
  check('field notes: each case opens into three numbered steps', (sec.match(/<ol class="mt-6 grid/g) ?? []).length === 3 && ['The situation', 'What lay beneath', 'What changed'].every((t) => (sec.split(`· ${t}</p>`).length - 1) === 3));
  check('100+ scope clarified on home', home.includes('across confidential 1:1 advisory, executive peer councils and board-level interventions'));
  check('100+ scope clarified in llms.txt', readFileSync(join(DIST, 'llms.txt'), 'utf8').includes('executive peer councils'));
}

// 4k. Subpages share the working-paper system
for (const page of ['about/index.html', 'advisory/index.html', 'contact/index.html']) {
  const html = readFileSync(join(DIST, page), 'utf8');
  const main = html.match(/<main[\s\S]*?<\/main>/)?.[0] ?? '';
  check(`${page}: h1 set as serif display type`, /<h1[^>]*class="[^"]*\bdisplay\b/.test(main));
  check(`${page}: margin note column on desktop`, main.includes('lg:col-span-3'));
  if (page === 'advisory/index.html') check('advisory: opens with the same photo hero as the homepage', /<div class="relative w-full [^"]*rounded-xl/.test(main) && /<h1 id="advisory-heading"/.test(main));
}
{
  const adv = readFileSync(join(DIST, 'advisory/index.html'), 'utf8');
  check('advisory: in scope and deliberately out of scope', adv.includes('In scope') && adv.includes('Deliberately out of scope'));
  check('advisory: quiet routing to Kuma and The Round, no duplicate path cards', adv.includes('id="the-round"') && !adv.includes('1:1 advisory session') && ['kuma.partners', 'theround.kuma.partners', 'offsite.kuma.partners'].every((h) => adv.includes(`href="https://${h}"`)));
  check('advisory: its own closing invitation', adv.includes('Start with a first conversation.') && !adv.includes('Bring the problem you have not been able to solve.'));
  const about = readFileSync(join(DIST, 'about/index.html'), 'utf8');
  check('about: three sources of judgement and closing invitation', about.includes('Three sources of judgement.') && about.includes('id="invite-heading"'));
}

// 4l. Favicon: valid standalone SVG, Direction A mark, linked on every page
{
  const fav = readFileSync(join(DIST, 'favicon.svg'), 'utf8');
  check('favicon: valid SVG namespace', fav.includes('xmlns="http://www.w3.org/2000/svg"'));
  check('favicon: squircle tile and letter path, adapts to dark mode', /<rect class="tile"[^>]*rx="118"/.test(fav) && /<path class="letter" d="M/.test(fav) && fav.includes('prefers-color-scheme:dark') || fav.includes('prefers-color-scheme: dark'));
  const noIcon = htmlFiles.filter((f) => !/<link rel="icon" href="\/favicon\.svg" type="image\/svg\+xml">/.test(readFileSync(f, 'utf8'))).map((f) => relative(DIST, f));
  check('favicon linked on every page', noIcon.length === 0, noIcon.join(', '));
}

// 4m. Reading rhythm: one background, serif reading text
{
  const home = readFileSync(join(DIST, 'index.html'), 'utf8');
  check('home: three surfaces only, one dark band (field notes) and one sand band (research)', (home.match(/class="[^"]*tone-dark/g) ?? []).length === 1 && (home.match(/class="[^"]*tone-sand/g) ?? []).length === 1 && /id="cases"[^>]*tone-dark|tone-dark[^>]*id="cases"/.test(home.match(/<section[^>]*id="cases"[^>]*>/)?.[0] ?? '') );
  check('home: situations on raised white cards with bold openings', (home.match(/situation settle surface/g) ?? []).length === 3);
  check('home: background as four short blocks', ['The operator', 'The scientist', 'The advisor', 'The researcher'].every((t) => home.includes(`>${t}</h3>`)));
  check('home: reading text set in the serif', (home.match(/class="[^"]*\breading\b/g) ?? []).length >= 15);
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
