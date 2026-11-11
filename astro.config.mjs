import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Custom domain via public/CNAME -> base is "/"
export default defineConfig({
  site: 'https://furuhashilab.com',
  integrations: [sitemap({ filter: (p) => !p.includes('index_') })],
  build: { format: 'directory' },
});
