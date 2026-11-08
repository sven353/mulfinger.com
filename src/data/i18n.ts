// The site's languages. English is the full site; /es, /de and /fr are single landing pages
// for local search, written from the same confirmed facts (v66). Keep them in step with the English pages.
export type Lang = 'en' | 'es' | 'de' | 'fr';

export const langs: Record<Lang, { tag: string; og: string; path: string; name: string; skip: string }> = {
  en: { tag: 'en-GB', og: 'en_GB', path: '/', name: 'English', skip: 'Skip to content' },
  es: { tag: 'es-ES', og: 'es_ES', path: '/es/', name: 'Español', skip: 'Saltar al contenido' },
  de: { tag: 'de-DE', og: 'de_DE', path: '/de/', name: 'Deutsch', skip: 'Zum Inhalt springen' },
  fr: { tag: 'fr-FR', og: 'fr_FR', path: '/fr/', name: 'Français', skip: 'Aller au contenu' },
};

// Header and footer text per language (v67). On the language pages, the menu links still lead to the
// English pages; the footer says so plainly, and the logo and contact links stay on the language page.
export type Chrome = {
  nav: Record<'/about' | '/advisory' | '/#research' | '/recommendations' | '/contact', string>;
  home: string; touch: string; menuCta: string; openMenu: string; closeMenu: string; menu: string;
  brand: string; cred: [string, string, string]; loc: string;
  privacy: string; legal: string; enNote?: string;
};

export const chrome: Record<Lang, Chrome> = {
  en: {
    nav: { '/about': 'About', '/advisory': 'Advisory', '/#research': 'Research', '/recommendations': 'Recommendations', '/contact': 'Contact' },
    home: 'Home', touch: 'Get in touch', menuCta: 'Start a confidential conversation', openMenu: 'Open menu', closeMenu: 'Close menu', menu: 'Menu',
    brand: 'Executive advisory for founders and CEOs. Based in Barcelona.',
    cred: ['Serial entrepreneur and CEO', 'More than 100 founders, managing directors and C-suite leaders guided', 'Research collaborator with IESE and IE Business School'],
    loc: 'In person in Barcelona, Madrid, Munich and Brussels, online across the world, in English, Spanish, German and French.',
    privacy: 'Privacy Policy', legal: 'Legal Notice',
  },
  es: {
    nav: { '/about': 'Sobre mí', '/advisory': 'Asesoramiento', '/#research': 'Investigación', '/recommendations': 'Recomendaciones', '/contact': 'Contacto' },
    home: 'Inicio', touch: 'Contacto', menuCta: 'Solicitar una conversación confidencial', openMenu: 'Abrir el menú', closeMenu: 'Cerrar el menú', menu: 'Menú',
    brand: 'Asesoramiento independiente para fundadores y CEOs. Desde Barcelona.',
    cred: ['Emprendedor en serie y CEO', 'Más de 100 fundadores, directores generales y altos directivos acompañados', 'Colaborador de investigación de IESE e IE Business School'],
    loc: 'En persona en Barcelona, Madrid, Múnich y Bruselas y online en todo el mundo, en español, inglés, alemán y francés.',
    privacy: 'Política de privacidad', legal: 'Aviso legal', enNote: 'Las demás páginas de la web están en inglés.',
  },
  de: {
    nav: { '/about': 'Über mich', '/advisory': 'Beratung', '/#research': 'Forschung', '/recommendations': 'Empfehlungen', '/contact': 'Kontakt' },
    home: 'Start', touch: 'Kontakt', menuCta: 'Ein vertrauliches Gespräch beginnen', openMenu: 'Menü öffnen', closeMenu: 'Menü schließen', menu: 'Menü',
    brand: 'Unabhängige Beratung für Gründer und CEOs. Mit Sitz in Barcelona.',
    cred: ['Serienunternehmer und CEO', 'Über 100 begleitete Gründer, Geschäftsführer und C-Level-Führungskräfte', 'Forschungspartner von IESE und IE Business School'],
    loc: 'Persönlich in Barcelona, Madrid, München und Brüssel, online weltweit, auf Deutsch, Englisch, Spanisch und Französisch.',
    privacy: 'Datenschutz', legal: 'Impressum', enNote: 'Die übrigen Seiten der Website sind auf Englisch.',
  },
  fr: {
    nav: { '/about': 'À propos', '/advisory': 'Conseil', '/#research': 'Recherche', '/recommendations': 'Recommandations', '/contact': 'Contact' },
    home: 'Accueil', touch: 'Contact', menuCta: 'Commencer une conversation confidentielle', openMenu: 'Ouvrir le menu', closeMenu: 'Fermer le menu', menu: 'Menu',
    brand: 'Conseil indépendant pour fondateurs et CEO. Basé à Barcelone.',
    cred: ['Entrepreneur en série et CEO', 'Plus de 100 fondateurs, directeurs généraux et dirigeants accompagnés', 'Collaborateur de recherche de l’IESE et de l’IE Business School'],
    loc: 'En personne à Barcelone, Madrid, Munich et Bruxelles, en ligne partout dans le monde, en français, anglais, allemand et espagnol.',
    privacy: 'Politique de confidentialité', legal: 'Mentions légales', enNote: 'Les autres pages du site sont en anglais.',
  },
};
