import { defineConfig } from 'vitest/config';
import path from 'node:path';

const root = process.cwd();

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    css: false,
  },
  // inline 空 PostCSS 設定：db/邏輯測試不需要 CSS，避免 vite 去載專案的
  // postcss.config.mjs（Tailwind v4 plugin 在 vite 管線下會被判為無效 plugin 而炸）。
  css: { postcss: { plugins: [] } },
  resolve: {
    alias: {
      // db.ts 用 `import 'server-only'` 做 server 守衛，在 node 測試環境會 throw；alias 成空模組。
      'server-only': path.resolve(root, 'tests/stubs/empty.ts'),
      '@': root,
    },
  },
});
