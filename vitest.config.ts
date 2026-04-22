import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test-setup.ts',
    // You might need to add Angular-specific setup here
    // For now, we assume the user has set up Angular testing with vitest
  }
});