import { defineConfig } from 'vite';
import eslintPlugin from 'vite-plugin-eslint';
import uni from '@dcloudio/vite-plugin-uni';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    uni(),
    // eslint 自动校验
    eslintPlugin({
      exclude: ['/node_modules'],
      cache: false,
    }),
  ],
});
