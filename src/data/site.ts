// Single source of truth for names, links and claims used across the site.
// Every public claim lives here so it can be checked or changed in one place.

export const site = {
  name: 'Sven Mulfinger',
  title: 'Sven Mulfinger | Strategic thought partner to founders and CEOs',
  description:
    'Sven Mulfinger is a strategic thought partner to founders, CEOs and C-suite leaders navigating complexity and non-linear growth. Barcelona based, advising across Europe in English, Spanish, German and French.',
  url: 'https://mulfinger.com',
  locale: 'en_GB',
  ogImage: '/og.png',
  links: {
    kuma: 'https://kuma.partners',
    round: 'https://theround.kuma.partners',
    offsite: 'https://offsite.kuma.partners',
    neurodisruptors: 'https://neurodisruptors.com',
    linkedin: '', // add the LinkedIn profile URL to show it in the footer and JSON-LD
  },
  languages: ['English', 'Spanish', 'German', 'French'],
};

// Confirmed by Sven on 2026-10-15. IE Business School is deliberately NOT listed.
// Commercial terms confirmed the same day live in src/data/faq.ts (Q5, Q6, Q8, Q12).
export const badges = [
  { label: 'Research', value: 'IESE Business School', note: 'Active research collaborator' },
  { label: 'Track record', value: '100+', note: 'Founders and CEOs guided' },
  { label: 'Practice', value: 'EN / ES / DE / FR', note: 'International, four working languages' },
  { label: 'Firm', value: 'Kuma Partners', note: 'Lead Partner' },
];

export const nav = [
  { href: '/about', label: 'About' },
  { href: '/advisory', label: 'Advisory' },
  { href: '/#research', label: 'Research' },
  { href: '/contact', label: 'Contact' },
];
