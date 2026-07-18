import { fileURLToPath, URL } from 'url';
import { defineConfig, type UserConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import svgLoader from 'vite-svg-loader';

// https://vitejs.dev/config/
export default defineConfig((): UserConfig => {
  return {
    base: '',
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
        // Deep-import of tracker-lib internals (buffer-level read/write classes).
        // The package's `exports` map only exposes the main entry, whose write
        // methods trigger one browser download per file — unusable for zipped
        // project export. Aliasing straight to dist/ bypasses the exports map.
        '@tracker-internals': fileURLToPath(new URL('./node_modules/@polyend/tracker-lib/dist', import.meta.url)),
      },
    },
  };
});
