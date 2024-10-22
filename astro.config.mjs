import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  experimental: {
    contentLayer: true,
  },
  integrations: [tailwind({ configFile: 'tailwind.config.js' })],
});
