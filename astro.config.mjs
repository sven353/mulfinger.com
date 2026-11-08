import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://mulfinger.com',
  output: 'static',
  trailingSlash: 'ignore',
  // i18n pairs the homepage with /es, /de and /fr in the sitemap (xhtml:link alternates).
  integrations: [sitemap({ filter: (page) => !/\/(thanks|legal|privacy)\/?$/.test(page), lastmod: new Date(), i18n: { defaultLocale: 'en', locales: { en: 'en-GB', es: 'es-ES', de: 'de-DE', fr: 'fr-FR' } } })],
  vite: { plugins: [tailwindcss()] },
});
