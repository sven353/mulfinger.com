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
for (const f of ['index.html', 'about/index.html', 'advisory/index.html', 'contact/index.html', 'llms.txt', 'llms-full.txt', 'robots.txt', 'sitemap-index.xml', 'sitemap-0.xml', 'favicon.svg', 'og.png', 'menu.js', 'form.js', '404.html', 'thanks/index.html', 'legal/index.html']) {
  check(`file: ${f}`, existsSync(join(DIST, f)));
}
const sitemap = readFileSync(join(DIST, 'sitemap-0.xml'), 'utf8');
for (const p of ['/', '/about/', '/advisory/', '/contact/']) {
  check(`sitemap lists ${p}`, sitemap.includes(`https://mulfinger.com${p}`));
}
check('sitemap excludes /thanks', !sitemap.includes('/thanks'));
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
for (const n of ['full_name', 'email', 'organisation_stage', 'strategic_mandate']) {
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
  if (page !== 'about/index.html') {
    const faqNode = graph.find((n) => n['@type'] === 'FAQPage');
    check(`FAQPage on ${page} (${faqNode?.mainEntity?.length ?? 0} questions)`, faqNode?.mainEntity?.length === 12);
    const faqTexts = (faqNode?.mainEntity ?? []).map((q) => q.acceptedAnswer?.text ?? '');
    check(`FAQPage answers are plain text on ${page}`, faqTexts.length > 0 && faqTexts.every((t) => t.length > 80 && !/[<>\[\]]/.test(t)));
  }
  check(`canonical + og + twitter on ${page}`, /rel="canonical"/.test(html) && /og:image/.test(html) && /twitter:card/.test(html));
}

// 4b. FAQ markup and outbound routing
for (const page of ['index.html', 'advisory/index.html']) {
  const html = readFileSync(join(DIST, page), 'utf8');
  const section = html.match(/<section id="faq"[\s\S]*?<\/section>/)?.[0] ?? '';
  const items = section.match(/<li[\s\S]*?<\/li>/g) ?? [];
  check(`FAQ on ${page} renders 12 items`, items.length === 12);
  check(`every FAQ item has a <details> toggle on ${page}`, items.length > 0 && items.every((li) => li.includes('<details') && li.includes('<summary')));
  // outbound links must sit inside <details>, never in the visible question or verdict
  const leaked = items.filter((li) => /href="https?:\/\//.test(li.split('<details')[0]));
  check(`no outbound links outside expanded context on ${page}`, leaked.length === 0);
  const outbound = [...section.matchAll(/<a [^>]*href="https?:\/\/[^"]+"[^>]*>/g)].map((m) => m[0]);
  const bad = outbound.filter((a) => !a.includes('target="_blank"') || !a.includes('rel="noopener noreferrer"'));
  check(`${outbound.length} FAQ outbound links use target=_blank + noopener noreferrer on ${page}`, outbound.length === 5 && bad.length === 0, bad.join(' '));
  for (const host of ['kuma.partners', 'offsite.kuma.partners', 'neurodisruptors.com']) {
    check(`FAQ on ${page} links to ${host}`, outbound.some((a) => a.includes(`https://${host}`)));
  }
}

// 4c. llms-full.txt carries all FAQ answers
const llmsFull = readFileSync(join(DIST, 'llms-full.txt'), 'utf8');
check('llms-full.txt contains 12 FAQ entries', (llmsFull.match(/^### \d+\. /gm) ?? []).length === 12);

// 4d. Home hero and engagement cards
{
  const home = readFileSync(join(DIST, 'index.html'), 'utf8');
  const proof = home.match(/<section aria-label="Credentials"[\s\S]*?<\/section>/)?.[0] ?? '';
  check('proof bar sits directly after the hero', /<\/section>\s*<section aria-label="Credentials"/.test(home));
  check('proof bar has 3 credentials', (proof.match(/<dt/g) ?? []).length === 3);
  for (const host of ['https://kuma.partners', 'https://offsite.kuma.partners']) {
    const a = [...home.matchAll(new RegExp(`<a [^>]*href="${host.replace(/\./g, '\\.')}"[^>]*>`, 'g'))].map((m) => m[0]);
    const ok = a.length > 0 && a.some((t) => t.includes('target="_blank"') && t.includes('rel="noopener noreferrer"'));
    check(`home links to ${host} in a new tab`, ok);
  }
}

// 4e. No stray text before the document (catches a broken frontmatter fence)
{
  const stray = htmlFiles.filter((f) => !/^\s*<!doctype html>/i.test(readFileSync(f, 'utf8'))).map((f) => relative(DIST, f));
  check('every page starts with <!doctype html>', stray.length === 0, stray.join(', '));
}

// 5. Copy rules
const visible = [...htmlFiles, join(DIST, 'llms.txt'), join(DIST, 'llms-full.txt')];
const emDash = visible.filter((f) => readFileSync(f, 'utf8').includes('\u2014')).map((f) => relative(DIST, f));
check('no em dashes in pages or llms files', emDash.length === 0, emDash.join(', '));
const ie = visible.filter((f) => /\bIE Business School\b/.test(readFileSync(f, 'utf8').replace(/IESE Business School/g, ''))).map((f) => relative(DIST, f));
check('IE Business School not claimed', ie.length === 0, ie.join(', '));

// Report
const failed = results.filter((r) => !r.ok);
for (const r of results) console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}${r.detail ? `  ${r.detail}` : ''}`);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
process.exit(failed.length ? 1 : 0);
