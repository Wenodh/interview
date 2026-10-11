import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';

export default defineConfig({
  output: 'static',
  adapter: vercel(),
  integrations: [
    starlight({
      title: 'Wenodh Frontend Interview Handbook',
      description: 'Comprehensive, structured frontend interview prep: DSA, JS polyfills, machine coding apps, snippets, and company experiences.',
      social: {
        github: 'https://github.com/Wenodh/interview',
      },
      sidebar: [
        {
          label: 'Overview',
          items: [
            { label: 'Welcome & Guide', slug: 'index' },
          ],
        },
        {
          label: '🧠 DSA Cheatsheet',
          autogenerate: { directory: 'dsa' },
        },
        {
          label: '⚡ JS Coding & Polyfills',
          autogenerate: { directory: 'js-coding' },
        },
        {
          label: '💻 Machine Coding Apps',
          autogenerate: { directory: 'machine-coding' },
        },
        {
          label: '📝 JS Code Snippets',
          autogenerate: { directory: 'code-snippets' },
        },
        {
          label: '🏢 Interview Experiences',
          autogenerate: { directory: 'interview-experiences' },
        },
      ],
      customCss: [
        './src/styles/custom.css',
      ],
      defaultLocale: 'root',
      locales: {
        root: {
          label: 'English',
          lang: 'en',
        },
      },
    }),
    react(),
  ],
});
