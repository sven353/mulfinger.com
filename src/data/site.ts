// Single source of truth for names, links and claims used across the site.
// Every public claim lives here so it can be checked or changed in one place.

export const site = {
  name: 'Sven Mulfinger',
  title: 'Dr. Sven Mulfinger | A thinking partner for founders and CEOs',
  description:
    'Confidential strategic advisory for founders and CEOs navigating consequential decisions, leadership friction and high-stakes transitions. Barcelona based, advising across Europe in English, Spanish, German and French.',
  url: 'https://mulfinger.com',
  locale: 'en_GB',
  ogImage: '/og.png',
  ogImageAlt: 'Dr. Sven Mulfinger, strategic advisory for founders and CEOs',
  links: {
    kuma: 'https://www.kuma.partners',
    round: 'https://theround.kuma.partners',
    offsite: 'https://offsite.kuma.partners',
    neurodisruptors: 'https://neurodisruptors.com',
    // Profile pages that describe the same person. Used for schema sameAs; keep identical on all three sites.
    kumaProfile: 'https://www.kuma.partners/partners.html',
    neurodisruptorsProfile: 'https://neurodisruptors.com/about/',
    linkedin: 'https://www.linkedin.com/in/svenmulfinger', // confirmed by Sven 2026-10-15
  },
  languages: ['English', 'Spanish', 'German', 'French'],
};

// Confirmed by Sven on 2026-10-15. IE Business School collaboration (Prof. Deuschel) confirmed later the same day.
// Commercial terms confirmed the same day live in src/data/faq.ts (Q5, Q6, Q8, Q12).
export const badges = [
  { label: 'Research', value: 'IESE & IE Business School', note: 'Active research collaborator' },
  { label: 'Track record', value: '100+ leaders guided', note: 'Founders, MDs and C-suite across Europe' },
  { label: 'Working languages', value: 'EN · ES · DE · FR', note: 'Advising internationally' },
];

export const nav = [
  { href: '/about', label: 'About' },
  { href: '/advisory', label: 'Advisory' },
  { href: '/#research', label: 'Research' },
  { href: '/contact', label: 'Contact' },
];
