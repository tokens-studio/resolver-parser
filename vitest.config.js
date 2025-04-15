import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['test/**/*.test.[jt]s?(x)'],
    globals: true,
    environment: 'jsdom',
  },
});
