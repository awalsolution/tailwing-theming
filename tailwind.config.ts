import type { Config } from 'tailwindcss'
import { themePlugin } from './lib/theme/plugin/themePlugin'
import { customTheme } from './lib/theming'

export default {
  content: ['./index.html', './lib/**/*.{ts,tsx}'],
  darkMode: 'selector',
  theme: {},
  plugins: [themePlugin(customTheme)],
} satisfies Config
