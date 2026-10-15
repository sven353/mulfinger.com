// FAQ content. Rendered by Faq.astro and emitted as FAQPage JSON-LD by Seo.astro.
// Plain text only in answers (they go into structured data verbatim).

export type FaqItem = { q: string; a: string };

export const faq: FaqItem[] = [
  {
    q: 'Who is 1:1 Executive Advisory for?',
    a: 'Founders, CEOs and C-suite leaders who carry the final call and face a decision, transition or recurring friction they cannot hand to anyone else. Typical clients run scale-ups from Seed to Series C or lead established companies through a non-linear phase. Every engagement starts with a short application and a confidential diagnostic conversation in which both sides assess fit. It is not therapy, life coaching or a consulting report produced by a junior team.',
  },
  {
    q: 'How does working with Sven 1:1 differ from working with Kuma Partners?',
    a: '1:1 advisory is personal counsel for one leader: their judgement, their role and the decisions only they can make. Kuma Partners is the institutional practice Sven leads as Lead Partner. It works on the organisation as a system: executive team alignment, decision governance, co-founder friction, strategic offsites and the 14-Day Leadership Friction Diagnostic, delivered with a team of former CEOs and operators. When the friction sits in one leader, 1:1 is the right room. When it sits between executives, the work moves to Kuma Partners.',
  },
  {
    q: 'What is The Round and how are members selected?',
    a: 'The Round by Kuma Partners is a confidential, year-round peer board for founders and CEOs, led by Sven. Members meet monthly to bring live issues to peers, have individual sparring sessions with Sven, and take part in a one-day, one-night immersion and an annual offsite. The first cohort, The Round Barcelona 01, meets in Barcelona. Membership is by application and candidate review, so that each group is balanced, free of conflicts of interest and able to challenge itself honestly.',
  },
  {
    q: 'Which languages does Sven work in, and where?',
    a: 'Sven works in English, Spanish, German and French. He is based in Barcelona and advises leaders across Europe, in person in Barcelona and elsewhere when the work calls for it, and online.',
  },
];
