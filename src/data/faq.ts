// FAQ content for Faq.astro (index + advisory) and the FAQPage JSON-LD in Seo.astro.
//
// Each item: q = question, verdict = one visible line, body = expanded context.
// Links go in the body ONLY, written as [anchor text](https://url). They render as
// external links (new tab, rel="noopener noreferrer"). Never put a link in the verdict.
//
// Terms confirmed by Sven on 2026-10-15: retainer and session cadence (Q8),
// 24 to 48 hour response (Q12), The Round by application or nomination (Q5),
// in-person sessions in Barcelona and Madrid (Q6). IE Business School is not claimed.

export type FaqItem = { q: string; verdict: string; body: string };

const KUMA = 'https://kuma.partners';
const OFFSITE = 'https://offsite.kuma.partners';
const ND = 'https://neurodisruptors.com';

export const faq: FaqItem[] = [
  {
    q: 'How does your 1:1 Executive Advisory differ from Kuma Partners?',
    verdict: 'Mulfinger.com is my private, confidential thought partnership for individual leaders. Kuma Partners is the practice that scales the work across your executive team.',
    body: `My direct advisory focuses on the founder or CEO navigating boardroom dynamics, cognitive clarity and high-stakes transitions. Systemic organisational work needs a dedicated collective engine. For executive team culture diagnostics, the 14-Day Leadership Friction Diagnostic and enterprise operating models, see my institutional practice at [Kuma Partners](${KUMA}).`,
  },
  {
    q: 'Where do leadership offsites and team alignment sessions fit in?',
    verdict: 'Strategic leadership offsites and team alignment intensives are facilitated exclusively through Kuma Partners.',
    body: `Our offsites are structured pressure tests, designed to resolve operational friction, unblock strategic bottlenecks and agree explicit behavioural contracts. The celebration comes afterwards, if it is earned. For the methodology, the diagnostics and how an offsite is built, see [Kuma Partners offsites](${OFFSITE}).`,
  },
  {
    q: 'Where can I explore your work on non-linear thinking and neurodivergent leadership?',
    verdict: 'The diagnostic frameworks, founder cohorts and research on non-linear profiles live at Neurodisruptors.',
    body: `A significant share of top founders and disruptors have spiky cognitive profiles: ADHD, giftedness, AuADHD and more. Turning that wiring into a sustainable leadership operating system takes specialised diagnostic tools. My research, including the collaboration with IESE Business School, and the dedicated founder tracks are gathered at [Neurodisruptors](${ND}).`,
  },
  {
    q: "What does 'holding principled tension' look like during an engagement?",
    verdict: 'I act as an unvarnished mirror and refuse comfortable compromises when organisational integrity or long-term strategy is at risk.',
    body: 'Many advisory relationships stall because the adviser hesitates to challenge the founder\'s blind spots. My role is to help you slow down to speed up. I create the safety and the intellectual friction needed to question core assumptions, confront governance fractures and take high-stakes decisions from a grounded place, before momentum makes them for you.',
  },
  {
    q: "What is 'The Round' and how can I participate?",
    verdict: 'The Round is a private, curated peer collective for high-growth founders and CEOs, based in Barcelona.',
    body: `It runs on radical candour, zero commercial pitching and real operational openness. Members are selected so that peers operate at comparable levels of scale, ambition and strategic complexity. Participation is by application or peer nomination. More at [The Round by Kuma Partners](https://theround.kuma.partners).`,
  },
  {
    q: 'In what languages and formats do you work?',
    verdict: 'I advise fluently in four languages: English, Spanish, German and French, across Europe and internationally.',
    body: '1:1 Executive Advisory runs as focused fortnightly strategic sessions, online or in person in Barcelona or Madrid, backed by priority access between sessions. For multi-day executive interventions I travel across Europe and further afield.',
  },
  {
    q: 'Who is the ideal fit for your 1:1 Executive Advisory?',
    verdict: 'Founders, scale-up CEOs and enterprise executives navigating non-linear growth, structural pivots or complex governance.',
    body: 'The advisory is built for leaders who already execute well and need a sounding board to cut through cognitive fog, stress-test high-stakes decisions and resolve leadership friction before it cascades through the organisation. Entry-level business coaching and generic career advice sit elsewhere.',
  },
  {
    q: 'What is the typical cadence and duration of an advisory engagement?',
    verdict: 'Most partnerships run on a 6-month or 12-month retainer with fortnightly sessions and direct access in between.',
    body: 'Engagements are built for continuous strategic momentum. A retainer includes two focused strategic working sessions of 60 to 90 minutes per month, unlimited direct voice and message access for critical boardroom or founder dilemmas, and periodic review of your key strategic documents.',
  },
  {
    q: 'How do you integrate neuroscience and systems thinking into your advisory?',
    verdict: 'We work on cognitive energy, behavioural loops and structural incentives. Mindset hacks play no part.',
    body: 'My background runs from genetics and chemical engineering to executive systems, so I treat organisational friction as both systemic and biological. We examine how cognitive overload, decision fatigue and implicit power dynamics distort judgement, then engineer explicit operating rhythms and feedback loops that protect high performance over the long run.',
  },
  {
    q: 'Where can I find out more about your book, The Non-Linear Operating System?',
    verdict: 'The book gathers frameworks for leaders who think non-linearly and scale teams through systemic clarity.',
    body: `The Non-Linear Operating System shows how non-linear thinkers, divergent founders and high-impact executives can design their personal operating architecture, align leadership teams and avoid executive burnout. It is being developed with Prof. Tomas Kluetter at IESE Business School. Release news is shared on this site and at [Neurodisruptors](${ND}).`,
  },
  {
    q: 'What is the prerequisite or onboarding process before starting?',
    verdict: 'Every advisory engagement begins with a mutual qualification call and an initial Strategic Friction Diagnostic.',
    body: 'First we assess chemistry, strategic alignment and the size of the challenge. If there is mutual conviction, we map your current cognitive and organisational friction points in a preliminary scan and set explicit baseline outcomes before an advisory agreement is signed.',
  },
  {
    q: 'How do I start a conversation or submit a diagnostic request?',
    verdict: 'Complete the confidential application on the Contact page to arrange an introductory diagnostic conversation.',
    body: 'Briefly outline your organisation\'s current stage, headcount and main strategic bottleneck. Sven reviews every application personally within 24 to 48 hours and comes back to arrange a confidential preliminary conversation.',
  },
];

// Helpers shared by the component and the schema
const LINK = /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g;

/** Plain text for JSON-LD and llms files: "anchor (url)". */
export const toPlain = (s: string) => s.replace(LINK, '$1 ($2)');

/** Body split into text and link segments for rendering. */
export const segments = (s: string) => {
  const out: Array<{ text: string; href?: string }> = [];
  let last = 0;
  for (const m of s.matchAll(LINK)) {
    if (m.index! > last) out.push({ text: s.slice(last, m.index) });
    out.push({ text: m[1], href: m[2] });
    last = m.index! + m[0].length;
  }
  if (last < s.length) out.push({ text: s.slice(last) });
  return out;
};
