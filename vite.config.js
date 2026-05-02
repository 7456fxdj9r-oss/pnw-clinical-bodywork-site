import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Using base: './' makes this work in BOTH cases:
//   - GitHub Pages subpath URL (https://USERNAME.github.io/REPO-NAME/)
//   - Custom domain (https://healingworkscenter.com)
// No config change needed when you add the custom domain later.
export default defineConfig({
  plugins: [react()],
  base: '/',
});
