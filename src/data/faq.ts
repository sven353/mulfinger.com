// Advisory FAQ: six questions on direct advisory qualification only.
// Used by Faq.astro on /advisory, the FAQPage JSON-LD in Seo.astro and /llms-full.txt.
//
// Each item: q = question, verdict = one visible line, body = expanded context.
// Links go in the body ONLY, written as [anchor text](https://url). They render as
// external links (new tab, rel="noopener noreferrer"). Never put a link in the verdict.
//
// Terms confirmed by Sven on 2026-10-15: 6 or 12-month retainer, two 60 to 90-minute
// sessions a month, unlimited direct voice and message access for critical dilemmas,
// in-person sessions in Barcelona or Madrid, reply within 24 to 48 hours,
// The Round by application or peer nomination. IE Business School collaboration confirmed 2026-10-15.

export type FaqItem = { q: string; verdict: string; body: string };

const KUMA = 'https://kuma.partners';
const OFFSITE = 'https://offsite.kuma.partners';
const ROUND = 'https://theround.kuma.partners';

export const faq: FaqItem[] = [
  {
    q: 'Who is 1:1 Executive Advisory designed for?',
    verdict: 'Founders, CEOs and senior executives who carry the final call and whose company has outgrown the way they lead it.',
    body: 'Typically you already execute well. What has changed is the scale: more people, more stakes, less room to get the big calls wrong. You want someone outside the company who will tell you what they see and help you think it through. Entry-level business coaching and generic career advice sit elsewhere.',
  },
  {
    q: 'What kinds of decisions and dilemmas do we examine?',
    verdict: 'The ones only you can make, and the ones you keep postponing.',
    body: 'Common examples: a co-founder relationship that has quietly broken down, an executive who no longer fits the stage of the company, decisions that keep landing on your desk, a strategy the team agrees with in the room and ignores outside it, a board conversation you need to prepare, or your own role changing as the company grows.',
  },
  {
    q: 'What is the cadence and how does priority direct access work?',
    verdict: 'A 6 or 12-month retainer with two working sessions a month and direct access in between.',
    body: 'Each month includes two focused sessions of 60 to 90 minutes, online or in person in Barcelona or Madrid. Between sessions you have unlimited direct voice and message access for critical boardroom or founder dilemmas, so a decision that cannot wait for the next session does not have to. Periodically we also review your key strategic documents.',
  },
  {
    q: 'How does this personal advisory differ from Kuma Partners?',
    verdict: '1:1 advisory works with you as a leader. Kuma Partners works with your executive team as a system.',
    body: `When the issue sits with you, your judgement, your role or a decision only you can take, 1:1 is the right room. When the friction sits between executives, the work moves to my institutional practice, [Kuma Partners](${KUMA}): team diagnostics, alignment sprints and [strategic offsites](${OFFSITE}), run with partners who have led companies themselves.`,
  },
  {
    q: "What is the criteria and format for 'The Round'?",
    verdict: 'A small, confidential peer group of founders and CEOs in Barcelona, joined by application or nomination.',
    body: `Members meet monthly to work on live issues with peers who carry comparable weight, with individual sparring sessions with me in between, a one-day, one-night immersion and an annual offsite. Members are selected so the group is balanced in scale and ambition and free of conflicts of interest. There is no commercial pitching in the room. More at [The Round by Kuma Partners](${ROUND}).`,
  },
  {
    q: 'What happens after I get in touch?',
    verdict: 'I read your message myself, reply within 24 to 48 hours and suggest a first conversation if there is a fit.',
    body: 'That first conversation is confidential and is about whether we should work together at all: chemistry, the size of the challenge and whether I am the right person. If we both see a fit, we map the main friction points in a short Strategic Friction Diagnostic and agree the outcomes we are aiming for before an advisory agreement is signed. If I am not the right person, I will say so.',
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
