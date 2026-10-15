// Single source of truth for names, links and claims used across the site.
// Edit here, not in individual pages.

export const site = {
  name: 'Sven Mulfinger',
  title: 'Sven Mulfinger | Strategic advisor to founders and CEOs',
  description:
    'Sven Mulfinger is an executive coach and strategic advisor to founders and C-suite leaders navigating non-linear growth. Based in Barcelona, working across Europe in English, Spanish, German and French.',
  url: 'https://mulfinger.com',
  locale: 'en_GB',
  city: 'Barcelona',
  ogImage: '/og.png',
  links: {
    kuma: 'https://kuma.partners',
    round: 'https://theround.kuma.partners',
    offsite: 'https://offsite.kuma.partners',
    neurodisruptors: 'https://neurodisruptors.com',
    linkedin: '', // add LinkedIn profile URL to show it in footer and JSON-LD
  },
  languages: ['English', 'Spanish', 'German', 'French'],
};

export const nav = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/advisory', label: 'Advisory' },
  { href: '/#research', label: 'Research' },
];
