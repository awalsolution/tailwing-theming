// import { themes } from '../theme/semanticColors'
import { ThemeManager } from '../theme/themeManager'

const themeManager = new ThemeManager({
  defaultTheme: '',
  themes: [
    {
      name: 'light',
      extend: {
        colors: {
          background: { DEFAULT: 'white' },
          foreground: { DEFAULT: 'black' },
          primary: { DEFAULT: 'blue' },
        },
      },
    },
    {
      name: 'dark',
      extend: {
        colors: {
          background: { DEFAULT: 'black' },
          foreground: { DEFAULT: 'white' },
          primary: { DEFAULT: 'purple' },
        },
      },
    },
  ],
})

const customTheme = themeManager.getThemes()
export { themeManager, customTheme }
