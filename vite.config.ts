import { glob } from 'glob'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { extname, relative, resolve } from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    dts({
      tsconfigPath: resolve(__dirname, 'tsconfig.json'),
      include: ['lib/'],
      exclude: ['lib/**/*-frontend.ts', 'lib/utils/storage/*'],
    }),
  ],
  resolve: {
    alias: [
      {
        find: '@lib/',
        replacement: path.resolve(process.cwd(), 'lib') + '/',
      },
    ],
  },
  build: {
    copyPublicDir: false,
    lib: {
      name: 'Tailwind-theming',
      formats: ['es'],
      entry: resolve(__dirname, 'lib/main.ts'),
      fileName: (format) => `tailwind-theming.${format}.js`,
    },
    rollupOptions: {
      input: Object.fromEntries(
        glob
          .sync('lib/**/*.{ts,tsx}', {
            ignore: ['lib/**/*.d.ts', 'lib/**/*-frontend.ts', 'lib/utils/storage/*'],
          })
          .map((file) => [
            relative('lib', file.slice(0, file.length - extname(file).length)),
            fileURLToPath(new URL(file, import.meta.url)),
          ]),
      ),
      output: {
        assetFileNames: 'assets/[name][extname]',
        entryFileNames: '[name].js',
      },
    },
  },
})
