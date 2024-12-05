import type { Config } from 'tailwindcss'
import { multiThemePlugin } from './lib/theme/plugin/themePlugin'

export default {
  content: ['./index.html', './lib/**/*.{ts,tsx}'],
  darkMode: 'selector',
  theme: {},
  plugins: [multiThemePlugin({})],
} satisfies Config
