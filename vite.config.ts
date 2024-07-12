import { defineConfig, loadEnv } from 'vite';
import eslintPlugin from 'vite-plugin-eslint';
import uni from '@dcloudio/vite-plugin-uni';

// https://vitejs.dev/config/
export default ({ mode }) => {
  const ENV = loadEnv(mode, process.cwd());
  return defineConfig({
    plugins: [
      uni(),
      // eslint 自动校验
      eslintPlugin({ exclude: ['/node_modules'], cache: false }),
    ],
    css: {
      preprocessorOptions: {
        scss: {
          // 引入全局样式
          // additionalData: '@import "@/style/index.scss";',
          additionalData: '@import "@/assets/styles/common.scss";',
        },
      },
    },
    build: {
      minify: 'esbuild',
      // sourcemap: true,
      sourcemap: ENV.VITE_USER_NODE_ENV === 'development',
      // esbuild 打包更快，但是不能去除 console.log，terser打包慢，但能去除 console.log
      // minify: "terser",
      // 禁用 gzip 压缩大小报告，可略微减少打包时间
      reportCompressedSize: false,
      // 规定触发警告的 chunk 大小
      chunkSizeWarningLimit: 2000,
    },
  });
};
