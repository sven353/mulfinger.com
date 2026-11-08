// The site's languages. English is the full site; /es, /de and /fr are single landing pages
// for local search, written from the same confirmed facts (v66). Keep them in step with the English pages.
export type Lang = 'en' | 'es' | 'de' | 'fr';

export const langs: Record<Lang, { tag: string; og: string; path: string; name: string; skip: string }> = {
  en: { tag: 'en-GB', og: 'en_GB', path: '/', name: 'English', skip: 'Skip to content' },
  es: { tag: 'es-ES', og: 'es_ES', path: '/es/', name: 'Español', skip: 'Saltar al contenido' },
  de: { tag: 'de-DE', og: 'de_DE', path: '/de/', name: 'Deutsch', skip: 'Zum Inhalt springen' },
  fr: { tag: 'fr-FR', og: 'fr_FR', path: '/fr/', name: 'Français', skip: 'Aller au contenu' },
};
