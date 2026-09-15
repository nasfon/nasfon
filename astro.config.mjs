import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://nasfon.com',
  output: 'static',
  build: {
    format: 'directory'
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404'),
      customPages: ['https://nasfon.com/dangote-ipo/'],
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      serialize(item) {
        if (item.url === 'https://nasfon.com/') {
          item.priority = 1.0;
          item.changefreq = 'weekly';
        } else if (item.url.includes('/services/') || item.url.includes('/projects/')) {
          item.priority = 0.8;
          item.changefreq = 'monthly';
        } else if (item.url.includes('/blog')) {
          item.priority = 0.6;
          item.changefreq = 'weekly';
        }
        item.lastmod = new Date();
        return item;
      }
    })
  ]
});
