import type { Config } from 'tailwindcss'
import { themePlugin } from './lib/theme/plugin/themePlugin'

export default {
  content: ['./index.html', './lib/**/*.{ts,tsx}'],
  darkMode: 'media',
  theme: {},
  plugins: [themePlugin()],
} satisfies Config
