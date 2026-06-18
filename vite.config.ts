import { fileURLToPath, URL } from 'url';
import { defineConfig, type UserConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import svgLoader from 'vite-svg-loader';

// https://vitejs.dev/config/
export default defineConfig((): UserConfig => {
  return {
    base: '/instrumented/',
    plugins: [
      vue(),
      svgLoader({
        svgoConfig: {
          multipass: true,
          plugins: [
            {
              name: 'preset-default',
              /** @ts-expect-error can be ignored */
              prefixIds: true,
              params: {
                overrides: {},
              },
            },
          ],
        },
      }),
    ],
    css: {
      preprocessorOptions: {
        scss: {
          /** @ts-expect-error can be ignored */
          api: 'modern-compiler',
        },
      },
    },
    server: {},
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  };
});
