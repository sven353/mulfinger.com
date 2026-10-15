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
  for (const host of ['kuma.partners', 'offsite.kuma.partners', 'theround.kuma.partners']) {
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
  check('home: portrait frame in the hero', /<figure[\s\S]*?(sven-mulfinger\.jpg|Portrait of Sven Mulfinger)/.test(home));
  check('home: situations section with 3 blocks', home.includes('The problems that bring CEOs to the table.') && (home.match(/id="situations-heading"[\s\S]*?<\/section>/)?.[0].match(/<article/g) ?? []).length === 3);
  check('home: background section', home.includes('I have sat on both sides of the table.'));
  check('home: 4-step process', home.includes('What happens when we work together.') && (home.match(/id="process-heading"[\s\S]*?<\/ol>/)?.[0].match(/<li/g) ?? []).length === 4);
  check('home: final invitation', home.includes('Bring the decision you have been circling.'));
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
  check('home: no FAQ block', !home.includes('id="faq"'));
    check('home: no product labels (Mode/Format/Rhythm/Led by)', !/\b(Mode 0\d|Format|Rhythm|Led by)\b/.test(homeText));
  const slogan = htmlFiles.reduce((n, f) => n + (readFileSync(f, 'utf8').replace(/<[^>]+>/g, ' ').match(/Slow down to speed up/gi) ?? []).length, 0);
  check(`"Slow down to speed up" not repeated as a banner (found ${slogan})`, slogan <= 1);
  const old = visible.filter((f) => readFileSync(f, 'utf8').includes('Translating deep systemic')).map((f) => relative(DIST, f));
  check('old hero headline fully retired', old.length === 0, old.join(', '));
}

// 5. Copy rules
const emDash = visible.filter((f) => readFileSync(f, 'utf8').includes('\u2014')).map((f) => relative(DIST, f));
check('no em dashes in pages or llms files', emDash.length === 0, emDash.join(', '));
const ie = visible.filter((f) => /\bIE Business School\b/.test(readFileSync(f, 'utf8').replace(/IESE Business School/g, ''))).map((f) => relative(DIST, f));
check('IE Business School not claimed', ie.length === 0, ie.join(', '));

// Report
const failed = results.filter((r) => !r.ok);
for (const r of results) console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}${r.detail ? `  ${r.detail}` : ''}`);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
process.exit(failed.length ? 1 : 0);
