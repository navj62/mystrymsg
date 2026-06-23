import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
  // These are pure TS unit tests; skip the project's Tailwind v4 PostCSS
  // pipeline, which Vite can't load and which the tests don't need.
  css: {
    postcss: { plugins: [] },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
